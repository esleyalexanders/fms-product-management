// Time & Payroll Calendar (Manager)
// Depends on:
// - ../manage-team/staff_store.js (optional but recommended)
// - payroll_store.js (window.FMSPayrollStore)

(function () {
  const Store = window.FMSPayrollStore;

  if (!Store) {
    console.error('FMSPayrollStore not found. Did you include payroll_store.js?');
    return;
  }

  const elCalendar = document.getElementById('calendar');
  const elRangeLabel = document.getElementById('rangeLabel');
  const elDatePicker = document.getElementById('datePicker');

  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnToday = document.getElementById('btnToday');
  const btnRefresh = document.getElementById('btnRefresh');
  const btnNormalize = document.getElementById('btnNormalize');

  const viewWeekBtn = document.getElementById('viewWeek');
  const viewDayBtn = document.getElementById('viewDay');

  const modalBackdrop = document.getElementById('modalBackdrop');
  const btnClose = document.getElementById('btnClose');
  const btnBulkApprove = document.getElementById('btnBulkApprove');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerSubtitle = document.getElementById('drawerSubtitle');
  const entriesContainer = document.getElementById('entriesContainer');
  const drawerHint = document.getElementById('drawerHint');

  let viewMode = 'week';
  let anchorDate = new Date();
  anchorDate.setHours(0, 0, 0, 0);

  let openSessionId = null;
  let pendingOpenSessionId = null;

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function toYmd(d) {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
  }

  function startOfWeek(d) {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    // Monday-start week
    const day = (dt.getDay() + 6) % 7; // Mon=0..Sun=6
    dt.setDate(dt.getDate() - day);
    return dt;
  }

  function addDays(d, days) {
    const dt = new Date(d);
    dt.setDate(dt.getDate() + days);
    return dt;
  }

  function formatRangeLabel(start, end) {
    const s = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const e = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${s} → ${e}`;
  }

  function sessionDisplayName(session) {
    return session.learningServiceName || session.title || session.learningServiceType || session.type || 'Session';
  }

  function sessionTimeLabel(session) {
    const st = session.startTime || '';
    const et = session.endTime || '';
    if (st && et) return `${st}–${et}`;
    return st || et || '—';
  }

  function getStatusCountsForSession(sessionId) {
    const entries = Store.listTimeEntriesForSession(sessionId);
    const counts = { draft: 0, submitted: 0, approved: 0, declined: 0, locked: 0, exception: 0, total: 0 };

    entries.forEach((e) => {
      counts.total += 1;
      const st = (e.status || 'draft').toLowerCase();
      if (counts[st] !== undefined) counts[st] += 1;
      if (Array.isArray(e.exceptions) && e.exceptions.length > 0) counts.exception += 1;
    });

    return counts;
  }

  function badgeHtml(text, cls) {
    return `<span class="badge ${cls}">${text}</span>`;
  }

  function buildSessionCard(session) {
    // Ensure time entries exist for display/status
    Store.ensureTimeEntriesForSession(session, { persist: true });

    const counts = getStatusCountsForSession(session.id);

    const badges = [];
    badges.push(badgeHtml(`${counts.total} staff`, 'gray'));
    if (counts.exception > 0) badges.push(badgeHtml(`${counts.exception} exception`, 'red'));
    if (counts.approved > 0) badges.push(badgeHtml(`${counts.approved} approved`, 'green'));
    if (counts.submitted > 0) badges.push(badgeHtml(`${counts.submitted} submitted`, 'orange'));
    if (counts.declined > 0) badges.push(badgeHtml(`${counts.declined} declined`, 'red'));

    const title = sessionDisplayName(session);
    const time = sessionTimeLabel(session);

    const el = document.createElement('div');
    el.className = 'session-card';
    el.dataset.sessionId = session.id;

    el.innerHTML = `
      <div class="session-top">
        <div>
          <div class="session-title">${escapeHtml(title)}</div>
          <div class="session-meta">
            <span class="session-time"><i class="fas fa-clock" style="margin-right:6px;"></i>${escapeHtml(time)}</span>
          </div>
        </div>
        <div class="mini-badges">${badges.join('')}</div>
      </div>
    `;

    el.addEventListener('click', () => openDrawer(session.id));
    return el;
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderWeek() {
    const start = startOfWeek(anchorDate);
    const end = addDays(start, 6);

    elRangeLabel.textContent = formatRangeLabel(start, end);
    elDatePicker.value = toYmd(anchorDate);

    const sessions = Store.loadSessions();

    elCalendar.innerHTML = '';

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const ymd = toYmd(day);
      const daySessions = sessions
        .filter((s) => String(s?.date || '') === ymd)
        .sort((a, b) => String(a.startTime || '').localeCompare(String(b.startTime || '')));

      const col = document.createElement('div');
      col.className = 'day-col';
      col.innerHTML = `
        <div class="day-header">
          <div>
            <div class="dow">${day.toLocaleDateString(undefined, { weekday: 'short' })}</div>
            <div class="date">${day.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
          </div>
          <div>${badgeHtml(`${daySessions.length} sessions`, 'purple')}</div>
        </div>
      `;

      const list = document.createElement('div');
      list.className = 'session-list';

      if (daySessions.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-day';
        empty.textContent = 'No sessions';
        col.appendChild(empty);
      } else {
        daySessions.forEach((s) => list.appendChild(buildSessionCard(s)));
        col.appendChild(list);
      }

      elCalendar.appendChild(col);
    }
  }

  function renderDay() {
    const day = new Date(anchorDate);
    day.setHours(0, 0, 0, 0);

    elRangeLabel.textContent = day.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    elDatePicker.value = toYmd(anchorDate);

    const sessions = Store.loadSessions();
    const ymd = toYmd(day);
    const daySessions = sessions
      .filter((s) => String(s?.date || '') === ymd)
      .sort((a, b) => String(a.startTime || '').localeCompare(String(b.startTime || '')));

    elCalendar.innerHTML = '';

    const col = document.createElement('div');
    col.className = 'day-col';
    col.style.gridColumn = '1 / -1';

    col.innerHTML = `
      <div class="day-header">
        <div>
          <div class="dow">${day.toLocaleDateString(undefined, { weekday: 'short' })}</div>
          <div class="date">${day.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
        </div>
        <div>${badgeHtml(`${daySessions.length} sessions`, 'purple')}</div>
      </div>
    `;

    if (daySessions.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-day';
      empty.textContent = 'No sessions';
      col.appendChild(empty);
    } else {
      const list = document.createElement('div');
      list.className = 'session-list';
      daySessions.forEach((s) => list.appendChild(buildSessionCard(s)));
      col.appendChild(list);
    }

    elCalendar.appendChild(col);
  }

  function render() {
    if (viewMode === 'day') renderDay();
    else renderWeek();
  }

  function setViewMode(mode) {
    viewMode = mode;
    viewWeekBtn.classList.toggle('active', mode === 'week');
    viewDayBtn.classList.toggle('active', mode === 'day');
    render();
  }

  function openDrawer(sessionId) {
    const sessions = Store.loadSessions();
    const session = sessions.find((s) => String(s?.id) === String(sessionId));
    if (!session) return;

    // Make sure entries exist for all assigned staff
    const ensured = Store.ensureTimeEntriesForSession(session, { persist: true });

    openSessionId = String(sessionId);

    const title = sessionDisplayName(ensured.session);
    const subtitle = `${ensured.session.date || '—'} • ${sessionTimeLabel(ensured.session)} • ${ensured.session.id}`;

    drawerTitle.textContent = title;
    drawerSubtitle.textContent = subtitle;

    renderDrawerEntries(ensured.session);

    drawerHint.textContent = 'Tip: Use “Copy scheduled” then adjust actual times and breaks, then Approve.';

    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    openSessionId = null;
    entriesContainer.innerHTML = '';
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  }

  function timeFromIso(iso) {
    if (!iso) return '';
    const m = String(iso).match(/T(\d{2}:\d{2}):\d{2}/);
    return m ? m[1] : '';
  }

  function toIsoFromDateTime(dateYmd, timeHm) {
    if (!dateYmd || !timeHm) return '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateYmd)) return '';
    if (!/^\d{2}:\d{2}$/.test(timeHm)) return '';
    return `${dateYmd}T${timeHm}:00`;
  }

  function minutesToHhMm(mins) {
    const m = Math.max(0, Number(mins) || 0);
    const h = Math.floor(m / 60);
    const r = m % 60;
    return `${h}h ${pad2(r)}m`;
  }

  function statusBadge(status) {
    const s = String(status || 'draft').toLowerCase();
    if (s === 'approved') return badgeHtml('approved', 'green');
    if (s === 'declined') return badgeHtml('declined', 'red');
    if (s === 'submitted') return badgeHtml('submitted', 'orange');
    if (s === 'locked') return badgeHtml('locked', 'gray');
    return badgeHtml('draft', 'gray');
  }

  function renderDrawerEntries(session) {
    const entries = Store.listTimeEntriesForSession(session.id)
      .sort((a, b) => String(a.staffId || '').localeCompare(String(b.staffId || '')));

    const staffMap = new Map(Store.loadStaff().map((s) => [String(s.id), s]));

    entriesContainer.innerHTML = '';

    entries.forEach((entry) => {
      const staff = staffMap.get(String(entry.staffId)) || null;
      const staffName = staff?.name || `${staff?.firstName || ''} ${staff?.lastName || ''}`.trim() || entry.staffId;

      const row = document.createElement('div');
      row.className = 'entry-row';
      row.dataset.entryId = entry.id;

      const exceptions = Array.isArray(entry.exceptions) ? entry.exceptions : [];
      const exceptionBadge = exceptions.length ? badgeHtml(`${exceptions.length} exception`, 'red') : badgeHtml('ok', 'green');

      row.innerHTML = `
        <div class="entry-row-header">
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <div class="entry-staff">${escapeHtml(staffName)}</div>
            <div>${statusBadge(entry.status)}</div>
            <div>${exceptionBadge}</div>
          </div>
          <div class="entry-actions">
            <button class="btn btn-ghost" data-action="copy"><i class="fas fa-copy"></i> Copy scheduled</button>
            <button class="btn btn-secondary" data-action="save"><i class="fas fa-floppy-disk"></i> Save</button>
            <button class="btn btn-primary" data-action="approve"><i class="fas fa-check"></i> Approve</button>
            <button class="btn btn-ghost" data-action="decline" style="border-color:#fecaca;"><i class="fas fa-xmark"></i> Decline</button>
          </div>
        </div>

        <div class="grid">
          <div class="field">
            <label>Scheduled start</label>
            <input class="readonly" type="time" value="${escapeHtml(timeFromIso(entry.scheduledStart))}" disabled />
          </div>
          <div class="field">
            <label>Scheduled end</label>
            <input class="readonly" type="time" value="${escapeHtml(timeFromIso(entry.scheduledEnd))}" disabled />
          </div>

          <div class="field">
            <label>Actual start</label>
            <input type="time" data-field="actualStart" value="${escapeHtml(timeFromIso(entry.actualStart))}" />
          </div>
          <div class="field">
            <label>Actual end</label>
            <input type="time" data-field="actualEnd" value="${escapeHtml(timeFromIso(entry.actualEnd))}" />
          </div>

          <div class="field small">
            <label>Break (mins)</label>
            <input type="number" min="0" step="1" data-field="breakMinutes" value="${escapeHtml(entry.breakMinutes ?? 0)}" />
          </div>

          <div class="field wide">
            <label>Worked / Paid</label>
            <input class="readonly" type="text" value="${escapeHtml(minutesToHhMm(entry.workedMinutes))} • ${escapeHtml(minutesToHhMm(entry.paidMinutes))}" disabled />
          </div>
        </div>

        <div class="hint">
          Staff ID: <strong>${escapeHtml(entry.staffId)}</strong> · Time Entry ID: <strong>${escapeHtml(entry.id)}</strong>
          ${exceptions.length ? ` · Exceptions: <strong>${escapeHtml(exceptions.join(', '))}</strong>` : ''}
        </div>
      `;

      // Change handlers
      row.querySelectorAll('input[data-field]').forEach((input) => {
        input.addEventListener('change', () => {
          const updated = readEntryFromRow(row, session, entry);
          const saved = Store.upsertTimeEntry(updated, { persist: true });
          // refresh only this row
          const refreshed = Store.listTimeEntriesForSession(session.id).find((te) => te.id === saved.id);
          if (refreshed) {
            renderDrawerEntries(session);
            render();
          }
        });
      });

      // Action handlers
      row.querySelectorAll('button[data-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const action = btn.getAttribute('data-action');
          if (action === 'copy') {
            const updated = { ...entry };
            updated.actualStart = entry.scheduledStart || '';
            updated.actualEnd = entry.scheduledEnd || '';
            const saved = Store.upsertTimeEntry(updated, { persist: true });
            if (saved) {
              renderDrawerEntries(session);
              render();
            }
            return;
          }

          if (action === 'save') {
            const updated = readEntryFromRow(row, session, entry);
            const saved = Store.upsertTimeEntry(updated, { persist: true });
            if (saved) {
              renderDrawerEntries(session);
              render();
            }
            return;
          }

          if (action === 'approve') {
            const updated = readEntryFromRow(row, session, entry);
            const computed = Store.recomputeTimeEntry(updated);
            const approveMinutes = computed.paidMinutes;

            const saved = Store.upsertTimeEntry(
              {
                ...computed,
                status: 'approved',
                managerApprovedMinutes: approveMinutes,
              },
              { persist: true }
            );

            if (saved) {
              renderDrawerEntries(session);
              render();
            }
            return;
          }

          if (action === 'decline') {
            const reason = prompt('Decline reason (required):');
            if (!reason) return;
            const updated = readEntryFromRow(row, session, entry);
            const saved = Store.upsertTimeEntry(
              {
                ...updated,
                status: 'declined',
                managerApprovedMinutes: 0,
                managerNote: String(reason).trim(),
              },
              { persist: true }
            );
            if (saved) {
              renderDrawerEntries(session);
              render();
            }
            return;
          }
        });
      });

      entriesContainer.appendChild(row);
    });

    if (entries.length === 0) {
      entriesContainer.innerHTML = '<div class="entry-row">No staff assigned for this session.</div>';
    }
  }

  function readEntryFromRow(row, session, originalEntry) {
    const updated = { ...originalEntry };

    const startInput = row.querySelector('input[data-field="actualStart"]');
    const endInput = row.querySelector('input[data-field="actualEnd"]');
    const breakInput = row.querySelector('input[data-field="breakMinutes"]');

    const start = startInput?.value || '';
    const end = endInput?.value || '';

    updated.actualStart = start ? toIsoFromDateTime(session.date, start) : '';
    updated.actualEnd = end ? toIsoFromDateTime(session.date, end) : '';

    const br = breakInput?.value;
    updated.breakMinutes = br === '' || br === undefined ? 0 : Number(br);

    // Recompute computed fields/exceptions
    return Store.recomputeTimeEntry(updated);
  }

  function bulkApproveOpenSession() {
    if (!openSessionId) return;
    const sessions = Store.loadSessions();
    const session = sessions.find((s) => String(s?.id) === String(openSessionId));
    if (!session) return;

    const entries = Store.listTimeEntriesForSession(session.id);
    if (!entries.length) return;

    if (!confirm(`Approve all ${entries.length} entries for this session?`)) return;

    entries.forEach((e) => {
      const computed = Store.recomputeTimeEntry(e);
      Store.upsertTimeEntry(
        {
          ...computed,
          status: 'approved',
          managerApprovedMinutes: computed.paidMinutes,
        },
        { persist: true }
      );
    });

    renderDrawerEntries(session);
    render();
  }

  // Event wiring
  btnPrev.addEventListener('click', () => {
    anchorDate = addDays(anchorDate, viewMode === 'day' ? -1 : -7);
    render();
  });
  btnNext.addEventListener('click', () => {
    anchorDate = addDays(anchorDate, viewMode === 'day' ? 1 : 7);
    render();
  });
  btnToday.addEventListener('click', () => {
    anchorDate = new Date();
    anchorDate.setHours(0, 0, 0, 0);
    render();
  });

  btnRefresh.addEventListener('click', () => render());

  btnNormalize.addEventListener('click', () => {
    Store.normalizeAllSessions({ persist: true });
    render();
    alert('Session staff normalized (and placeholders created if needed).');
  });

  viewWeekBtn.addEventListener('click', () => setViewMode('week'));
  viewDayBtn.addEventListener('click', () => setViewMode('day'));

  elDatePicker.addEventListener('change', () => {
    const v = elDatePicker.value;
    if (!v) return;
    const dt = new Date(v + 'T00:00:00');
    if (!Number.isNaN(dt.getTime())) {
      anchorDate = dt;
      render();
    }
  });

  btnClose.addEventListener('click', closeDrawer);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeDrawer();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  btnBulkApprove.addEventListener('click', bulkApproveOpenSession);

  // Initial render
  (function initFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('sessionId');
    if (!sessionId) return;

    const sessions = Store.loadSessions();
    const session = sessions.find((s) => String(s?.id) === String(sessionId));
    if (!session) return;

    // Jump to the session date then open drawer after render
    const dt = new Date(`${session.date}T00:00:00`);
    if (!Number.isNaN(dt.getTime())) anchorDate = dt;
    pendingOpenSessionId = String(sessionId);
  })();

  elDatePicker.value = toYmd(anchorDate);
  render();

  // Open deep-linked session after first render
  if (pendingOpenSessionId) {
    const sid = pendingOpenSessionId;
    pendingOpenSessionId = null;
    // Use microtask to ensure DOM is painted
    setTimeout(() => openDrawer(sid), 0);
  }
})();

