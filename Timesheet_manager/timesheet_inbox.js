// Timesheet Inbox (Manager)
// Uses fms_time_entries (Phase 3) + deep link to Time & Payroll Calendar

(function () {
  const Store = window.FMSPayrollStore;
  if (!Store) {
    console.error('FMSPayrollStore not found. Did you include payroll_store.js?');
    return;
  }

  const elStart = document.getElementById('startDate');
  const elEnd = document.getElementById('endDate');
  // const elStaff = document.getElementById('staffFilter'); // Removed
  const elStatus = document.getElementById('statusFilter');

  const elService = document.getElementById('serviceFilter');
  const elSessionType = document.getElementById('sessionTypeFilter');
  const elSearch = document.getElementById('searchFilter');

  // Multi-select elements
  const elStaffDisplay = document.getElementById('staffDisplay');
  const elStaffInput = document.getElementById('staffSearchInput');
  const elStaffDropdown = document.getElementById('staffDropdown');

  let selectedStaffIds = [];
  let allStaff = [];

  const btnApply = document.getElementById('btnApply');
  const btnClear = document.getElementById('btnClear');
  const btnRefresh = document.getElementById('btnRefresh');
  const btnNormalize = document.getElementById('btnNormalize');

  const elTbody = document.getElementById('inboxTbody');
  const elEmpty = document.getElementById('empty');
  const elTableWrap = document.getElementById('tableWrap');

  const elSummary = document.getElementById('summaryText');

  const elSelectAll = document.getElementById('selectAll');
  const bulkBar = document.getElementById('bulkBar');
  const selectedCount = document.getElementById('selectedCount');
  const bulkApprovedMinutes = document.getElementById('bulkApprovedMinutes');
  const btnBulkApprove = document.getElementById('btnBulkApprove');
  const btnBulkDecline = document.getElementById('btnBulkDecline');
  const btnBulkClear = document.getElementById('btnBulkClear');

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function toYmd(d) {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalizeText(s) {
    return Store.normalizeName(s);
  }

  function minutesToHhMm(mins) {
    const m = Math.max(0, Number(mins) || 0);
    const h = Math.floor(m / 60);
    const r = m % 60;
    return `${h}h ${pad2(r)}m`;
  }

  function timeFromIso(iso) {
    if (!iso) return '';
    const m = String(iso).match(/T(\d{2}:\d{2}):\d{2}/);
    return m ? m[1] : '';
  }

  function getSessionById(sessions, sessionId) {
    return sessions.find((s) => String(s?.id) === String(sessionId)) || null;
  }

  function badge(status) {
    const s = String(status || 'draft').toLowerCase();
    if (s === 'approved') return '<span class="badge green">Approved</span>';
    if (s === 'declined') return '<span class="badge red">Declined</span>';
    if (s === 'submitted') return '<span class="badge orange">Submitted</span>';
    if (s === 'locked') return '<span class="badge gray">Locked</span>';
    return '<span class="badge gray">Draft</span>';
  }

  function dateInRange(ymd, startYmd, endYmd) {
    if (!ymd) return false;
    if (startYmd && ymd < startYmd) return false;
    if (endYmd && ymd > endYmd) return false;
    return true;
  }

  function getEntrySessionDate(session) {
    return String(session?.date || '').trim();
  }

  function buildStaffOptions() {
    allStaff = Store.loadStaff().filter((s) => (s.status || 'active') === 'active');
    allStaff.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    renderDropdownOptions();
  }

  function renderDropdownOptions(filterText = '') {
    const query = filterText.toLowerCase();
    const filtered = allStaff.filter(s => {
      const name = (s.name || '').toLowerCase();
      return name.includes(query) && !selectedStaffIds.includes(s.id);
    });

    if (filtered.length === 0) {
      elStaffDropdown.innerHTML = '<div class="dropdown-option" style="cursor:default;color:#9ca3af;">No staff found</div>';
      return;
    }

    elStaffDropdown.innerHTML = filtered.map(s => `
          <div class="dropdown-option" data-id="${s.id}">
              ${s.name || `${s.firstName || ''} ${s.lastName || ''}`}
          </div>
      `).join('');

    elStaffDropdown.querySelectorAll('.dropdown-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const id = opt.dataset.id;
        if (id) addStaff(id);
      });
    });
  }

  function addStaff(id) {
    if (!selectedStaffIds.includes(id)) {
      selectedStaffIds.push(id);
      renderTags();
      elStaffInput.value = '';
      renderDropdownOptions();
      // render(); // Wait for apply? No, immediate
      // Actually user has an "Apply" button in Inbox but usually expects immediate response
      // But `timesheet_inbox` has explicit Apply/Refresh.
      // Let's stick to explicit Apply behavior for filters, OR make this one immediate?
      // The current code only renders on btnApply or btnRefresh for filters...
      // Wait, actually user request said "same with staff-timesheet-detail".
      // Detail page updates immediately.
      // BUT Inbox page has "Apply" button for the filter group.
      // If I update immediately, it might be weird if other fields are pending.
      // However, the input box implies interactivity.
      // Checking existing code: `btnApply.addEventListener('click', () => render());`
      // So other filters wait.
      // I will make the staff selection wait for "Apply" too, OR trigger render?
      // Detail page triggers render immediately.
      // Let's stick to "Apply" button workflow for Inbox to be consistent with OTHER Inbox filters.
      // UNLESS the user explicitly wants immediate feedback.
      // "the filter staff should be the same with [detail]".
      // In detail, it's instant.
      // I'll make it instant update for consistency or at least visual update.
      // Actually, let's keep it consistent with the INBOX page pattern (Apply button) to avoid partial state.
      // BUT update the UI (tags).
    }
  }

  function removeStaff(id) {
    selectedStaffIds = selectedStaffIds.filter(sid => sid !== id);
    renderTags();
    renderDropdownOptions();
  }

  function renderTags() {
    const tags = elStaffDisplay.querySelectorAll('.tag');
    tags.forEach(t => t.remove());

    selectedStaffIds.forEach(id => {
      const staff = allStaff.find(s => s.id === id);
      if (!staff) return;
      const name = staff.name || `${staff.firstName} ${staff.lastName}`;

      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.innerHTML = `
              ${name}
              <div class="tag-remove" data-id="${id}">
                  <i class="fas fa-times"></i>
              </div>
          `;
      elStaffDisplay.insertBefore(tag, elStaffInput);
    });

    elStaffDisplay.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeStaff(btn.dataset.id);
      });
    });

    if (selectedStaffIds.length > 0) {
      elStaffInput.placeholder = '';
    } else {
      elStaffInput.placeholder = 'All staff...';
    }
  }

  // Event Listeners for Multi-Select
  elStaffInput.addEventListener('focus', () => {
    elStaffDropdown.classList.add('active');
    renderDropdownOptions(elStaffInput.value);
  });

  elStaffInput.addEventListener('input', () => {
    elStaffDropdown.classList.add('active');
    renderDropdownOptions(elStaffInput.value);
  });

  document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('staffMultiSelect');
    if (wrapper && !wrapper.contains(e.target)) {
      elStaffDropdown.classList.remove('active');
    }
  });

  elStaffDisplay.addEventListener('click', () => {
    elStaffInput.focus();
  });

  function ensureEntriesForVisibleSessions(startYmd, endYmd) {
    const sessions = Store.loadSessions();
    const filtered = sessions.filter((s) => dateInRange(String(s?.date || ''), startYmd, endYmd));
    filtered.forEach((s) => {
      Store.ensureTimeEntriesForSession(s, { persist: true });
    });
  }

  function getSelectedEntryIds() {
    return Array.from(document.querySelectorAll('input.row-check:checked')).map((c) => c.dataset.entryId);
  }

  function updateBulkBar() {
    const ids = getSelectedEntryIds();
    selectedCount.textContent = String(ids.length);
    bulkBar.classList.toggle('active', ids.length > 0);
  }

  function clearSelection() {
    elSelectAll.checked = false;
    document.querySelectorAll('input.row-check').forEach((c) => (c.checked = false));
    updateBulkBar();
  }

  function applyBulkApprovedMinutesToSelection(valueMinutes) {
    const ids = getSelectedEntryIds();
    if (!ids.length) return;

    ids.forEach((id) => {
      const input = document.querySelector(`input.approved-minutes-input[data-entry-id="${CSS.escape(id)}"]`);
      if (input) input.value = String(valueMinutes);

      const entry = Store.loadTimeEntries().find((e) => e && e.id === id);
      if (!entry) return;
      Store.upsertTimeEntry({ ...entry, managerApprovedMinutes: valueMinutes }, { persist: true });
    });
  }

  function approveEntries(entryIds) {
    const entries = Store.loadTimeEntries();
    entryIds.forEach((id) => {
      const existing = entries.find((e) => e && e.id === id);
      if (!existing) return;

      const computed = Store.recomputeTimeEntry(existing);
      const approvedMinutes =
        computed.managerApprovedMinutes !== null && computed.managerApprovedMinutes !== undefined
          ? Number(computed.managerApprovedMinutes)
          : computed.paidMinutes;

      Store.upsertTimeEntry(
        {
          ...computed,
          status: 'approved',
          managerApprovedMinutes: Math.max(0, Math.round(Number(approvedMinutes) || 0)),
        },
        { persist: true }
      );
    });
  }

  function declineEntries(entryIds, reason) {
    const entries = Store.loadTimeEntries();
    entryIds.forEach((id) => {
      const existing = entries.find((e) => e && e.id === id);
      if (!existing) return;

      Store.upsertTimeEntry(
        {
          ...existing,
          status: 'declined',
          managerApprovedMinutes: 0,
          managerNote: String(reason || '').trim(),
        },
        { persist: true }
      );
    });
  }

  function buildRow(entry, session, staff) {
    const serviceName = session?.learningServiceName || session?.title || session?.learningServiceType || '';
    const sessionType = session?.type || session?.learningServiceType || '';

    const staffName = staff?.name || `${staff?.firstName || ''} ${staff?.lastName || ''}`.trim() || entry.staffId;

    const scheduled = `${timeFromIso(entry.scheduledStart)}–${timeFromIso(entry.scheduledEnd)}`.replace(/^–|–$/g, '');
    const actual = `${timeFromIso(entry.actualStart)}–${timeFromIso(entry.actualEnd)}`.replace(/^–|–$/g, '');

    const managerApproved = entry.managerApprovedMinutes === null || entry.managerApprovedMinutes === undefined ? '' : String(entry.managerApprovedMinutes);

    return `
      <tr data-entry-id="${escapeHtml(entry.id)}">
        <td><input class="row-check" type="checkbox" data-entry-id="${escapeHtml(entry.id)}" /></td>
        <td>
          <div class="mono" style="font-weight:900;color:#111827;">${escapeHtml(session?.id || entry.sessionId)}</div>
          <div style="margin-top:4px;color:#6b7280;">${escapeHtml(serviceName)}${sessionType ? ` • <span class=\"mono\">${escapeHtml(sessionType)}</span>` : ''}</div>
          <div style="margin-top:4px;color:#6b7280;">${escapeHtml(session?.date || '')}</div>
        </td>
        <td>
          <div style="font-weight:900;color:#111827;">${escapeHtml(staffName)}</div>
          <div class="mono" style="margin-top:4px;color:#6b7280;">${escapeHtml(entry.staffId)}</div>
        </td>
        <td class="mono">${escapeHtml(scheduled || '')}</td>
        <td class="mono">${escapeHtml(actual || '')}</td>
        <td class="mono" style="font-weight:900;">${escapeHtml(minutesToHhMm(entry.workedMinutes))} • ${escapeHtml(minutesToHhMm(entry.paidMinutes))}</td>
        <td>
          <input
            class="approved-minutes-input"
            data-entry-id="${escapeHtml(entry.id)}"
            type="number"
            min="0"
            step="1"
            value="${escapeHtml(managerApproved)}"
            placeholder="(auto)"
            style="width:120px;border:1px solid #e5e7eb;border-radius:10px;padding:10px 10px;"
          />
          <div class="small-note">Minutes</div>
        </td>
        <td>${badge(entry.status)}</td>
        <td>
          <div class="row-actions">
            <button class="link-btn" data-action="open_calendar" data-session-id="${escapeHtml(entry.sessionId)}">View session</button>
            <button class="link-btn" data-action="approve" data-entry-id="${escapeHtml(entry.id)}">Approve</button>
            <button class="link-btn" data-action="decline" data-entry-id="${escapeHtml(entry.id)}">Decline</button>
          </div>
        </td>
      </tr>
    `;
  }

  function getFilters() {
    return {
      startDate: elStart.value,
      endDate: elEnd.value,
      // staffId: elStaff.value, // Removed
      staffIds: selectedStaffIds, // New
      status: elStatus.value,
      service: elService.value,
      sessionType: elSessionType.value,
      search: elSearch.value,
    };
  }

  function isNeedsActionStatus(status) {
    const s = String(status || 'draft').toLowerCase();
    // needs action includes drafts/submitted plus any entry with exceptions
    return s === 'draft' || s === 'submitted';
  }

  function applyFiltersToEntries(entries, sessionsById, staffById, filters) {
    const startYmd = filters.startDate || '';
    const endYmd = filters.endDate || '';

    const serviceNeedle = normalizeText(filters.service);
    const typeNeedle = normalizeText(filters.sessionType);
    const searchNeedle = normalizeText(filters.search);

    return entries.filter((e) => {
      if (!e) return false;
      const session = sessionsById.get(String(e.sessionId)) || null;
      const staff = staffById.get(String(e.staffId)) || null;

      // date range by session date
      const ymd = getEntrySessionDate(session);
      if (!dateInRange(ymd, startYmd, endYmd)) return false;

      // staff filter
      // if (filters.staffId && String(e.staffId) !== String(filters.staffId)) return false;
      if (filters.staffIds && filters.staffIds.length > 0) {
        if (!filters.staffIds.includes(String(e.staffId))) return false;
      }

      // status filter
      const st = String(e.status || 'draft').toLowerCase();
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'needs_action') {
          if (!isNeedsActionStatus(st)) return false;
        } else {
          if (st !== filters.status) return false;
        }
      }

      // learning service filter
      if (serviceNeedle) {
        const svc = normalizeText(session?.learningServiceName || session?.title || session?.learningServiceType || '');
        if (!svc.includes(serviceNeedle)) return false;
      }

      // session type filter
      if (typeNeedle) {
        const t = normalizeText(session?.type || session?.learningServiceType || '');
        if (!t.includes(typeNeedle)) return false;
      }

      // free search
      if (searchNeedle) {
        const sessionId = normalizeText(session?.id || e.sessionId);
        const staffName = normalizeText(staff?.name || `${staff?.firstName || ''} ${staff?.lastName || ''}`);
        if (!sessionId.includes(searchNeedle) && !staffName.includes(searchNeedle)) return false;
      }

      return true;
    });
  }

  function render() {
    const filters = getFilters();

    // Normalize sessions within date range and ensure entries exist
    ensureEntriesForVisibleSessions(filters.startDate, filters.endDate);

    const sessions = Store.loadSessions();
    const staffList = Store.loadStaff();

    const sessionsById = new Map(sessions.map((s) => [String(s.id), s]));
    const staffById = new Map(staffList.map((s) => [String(s.id), s]));

    let entries = Store.loadTimeEntries();

    // Keep time entries recomputed (cheap) so exceptions/worked/paid is consistent
    entries = entries.map((e) => (e ? Store.recomputeTimeEntry(e) : e));
    Store.saveTimeEntries(entries);

    const filtered = applyFiltersToEntries(entries, sessionsById, staffById, filters)
      .sort((a, b) => {
        const sa = sessionsById.get(String(a.sessionId));
        const sb = sessionsById.get(String(b.sessionId));
        const da = String(sa?.date || '');
        const db = String(sb?.date || '');
        if (da !== db) return da.localeCompare(db);
        return String(sa?.startTime || '').localeCompare(String(sb?.startTime || ''));
      });

    elSummary.textContent = `${filtered.length} entries shown (from ${filters.startDate || '—'} to ${filters.endDate || '—'})`;

    if (filtered.length === 0) {
      elTableWrap.style.display = 'none';
      elEmpty.style.display = 'block';
      elTbody.innerHTML = '';
      clearSelection();
      return;
    }

    elTableWrap.style.display = 'block';
    elEmpty.style.display = 'none';

    elTbody.innerHTML = filtered
      .map((e) => {
        const session = sessionsById.get(String(e.sessionId)) || null;
        const staff = staffById.get(String(e.staffId)) || null;
        return buildRow(e, session, staff);
      })
      .join('');

    // row checkbox handlers
    document.querySelectorAll('input.row-check').forEach((c) => {
      c.addEventListener('change', () => {
        const all = Array.from(document.querySelectorAll('input.row-check'));
        const checked = all.filter((x) => x.checked);
        elSelectAll.checked = checked.length > 0 && checked.length === all.length;
        updateBulkBar();
      });
    });

    // per-row approved minutes -> update store
    document.querySelectorAll('input.approved-minutes-input').forEach((input) => {
      input.addEventListener('change', () => {
        const entryId = input.dataset.entryId;
        const raw = input.value;
        const minutes = raw === '' ? null : Math.max(0, Math.round(Number(raw) || 0));

        const entry = Store.loadTimeEntries().find((e) => e && e.id === entryId);
        if (!entry) return;
        Store.upsertTimeEntry({ ...entry, managerApprovedMinutes: minutes }, { persist: true });
      });
    });

    // row action buttons
    document.querySelectorAll('button.link-btn[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'open_calendar') {
          const sessionId = btn.dataset.sessionId;
          // Redirect to session detail since calendar view is removed for MVP
          window.location.href = `../[v2] Jobs/service_job_v3/session_detail.html?id=${encodeURIComponent(sessionId)}`;
          return;
        }

        if (action === 'approve') {
          const entryId = btn.dataset.entryId;
          approveEntries([entryId]);
          render();
          return;
        }

        if (action === 'decline') {
          const entryId = btn.dataset.entryId;
          const reason = prompt('Decline reason (required):');
          if (!reason) return;
          declineEntries([entryId], reason);
          render();
          return;
        }
      });
    });

    // reset bulk state
    elSelectAll.checked = false;
    updateBulkBar();
  }

  function initDefaults() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    elStart.value = toYmd(start);
    elEnd.value = toYmd(end);
  }

  // Events
  elSelectAll.addEventListener('change', () => {
    const checked = elSelectAll.checked;
    document.querySelectorAll('input.row-check').forEach((c) => (c.checked = checked));
    updateBulkBar();
  });

  btnBulkClear.addEventListener('click', () => clearSelection());

  btnBulkApprove.addEventListener('click', () => {
    const ids = getSelectedEntryIds();
    if (!ids.length) return;

    const raw = bulkApprovedMinutes.value;
    if (raw !== '') {
      const mins = Math.max(0, Math.round(Number(raw) || 0));
      applyBulkApprovedMinutesToSelection(mins);
    }

    if (!confirm(`Approve ${ids.length} selected entries?`)) return;
    approveEntries(ids);
    render();
    clearSelection();
  });

  btnBulkDecline.addEventListener('click', () => {
    const ids = getSelectedEntryIds();
    if (!ids.length) return;
    const reason = prompt('Decline reason (required):');
    if (!reason) return;

    if (!confirm(`Decline ${ids.length} selected entries?`)) return;
    declineEntries(ids, reason);
    render();
    clearSelection();
  });

  btnApply.addEventListener('click', () => render());
  btnRefresh.addEventListener('click', () => render());

  btnNormalize.addEventListener('click', () => {
    Store.normalizeAllSessions({ persist: true });
    alert('Session staff normalized (and placeholders created if needed).');
    buildStaffOptions();
    render();
  });

  btnClear.addEventListener('click', () => {
    const { value: start } = elStart;
    const { value: end } = elEnd;

    elStaffInput.value = '';
    selectedStaffIds = []; // clear
    renderTags(); // reset UI
    buildStaffOptions(); // reset options
    elStatus.value = 'needs_action';

    elService.value = '';
    elSessionType.value = '';
    elSearch.value = '';

    elStart.value = start;
    elEnd.value = end;

    render();
  });

  // Init
  initDefaults();
  buildStaffOptions();
  render();
})();

