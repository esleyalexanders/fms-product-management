// Staff pay profile assignments

(function () {
  const Store = window.FMSPayrollStore;
  if (!Store) {
    console.error('FMSPayrollStore not found. Did you include payroll_store.js?');
    return;
  }

  // If fms_staff is empty, seed from Manage Team samples so the table isn't blank.
  window.FMSStaffStore?.ensureStaffSeededFromSamples?.();

  const tbody = document.getElementById('tbody');
  const search = document.getElementById('search');
  const statusFilter = document.getElementById('statusFilter');
  const btnRefresh = document.getElementById('btnRefresh');
  const btnSaveAll = document.getElementById('btnSaveAll');

  let draftStaff = [];

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function toNumOrNull(val) {
    if (val === '' || val === undefined || val === null) return null;
    const n = Number(val);
    if (!Number.isFinite(n)) return null;
    return n;
  }

  function ensureDefaults() {
    // ensure pay profiles exist
    const profiles = Store.loadPayProfiles();
    if (profiles.length > 0) return;

    const ts = new Date().toISOString();
    Store.savePayProfiles([
      {
        id: 'pp_hourly_default',
        name: 'Default Hourly',
        payType: 'hourly',
        hourlyRate: 0,
        sessionRates: { flatSessionRate: 0, bySessionType: {} },
        multipliers: { weekend: 1.0, afterHours: { start: '18:00', end: '06:00', multiplier: 1.0 }, publicHoliday: 1.0 },
        overtimeDaily: { enabled: true, thresholdHours: 8, multiplier: 1.5 },
        createdAt: ts,
        updatedAt: ts,
      },
      {
        id: 'pp_session_default',
        name: 'Default Per-Session',
        payType: 'per_session',
        hourlyRate: 0,
        sessionRates: { flatSessionRate: 0, bySessionType: {} },
        multipliers: { weekend: 1.0, afterHours: { start: '18:00', end: '06:00', multiplier: 1.0 }, publicHoliday: 1.0 },
        overtimeDaily: { enabled: false, thresholdHours: 8, multiplier: 1.5 },
        createdAt: ts,
        updatedAt: ts,
      },
    ]);
  }

  function render() {
    ensureDefaults();

    const profiles = Store.loadPayProfiles();
    const staff = Store.loadStaff();

    // local edit buffer (avoid updating store on every keystroke)
    draftStaff = staff.map((s) => ({ ...s }));

    const status = statusFilter.value;
    const needle = String(search.value || '').trim().toLowerCase();

    const filtered = draftStaff
      .filter((s) => {
        const st = String(s.status || 'active');
        if (status !== 'all' && st !== status) return false;
        if (!needle) return true;
        const name = String(s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim()).toLowerCase();
        const id = String(s.id || '').toLowerCase();
        return name.includes(needle) || id.includes(needle);
      })
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

    function profileOptions(selectedId) {
      const base = ['<option value="">(default)</option>'];
      profiles
        .slice()
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
        .forEach((p) => {
          const sel = String(p.id) === String(selectedId) ? 'selected' : '';
          base.push(`<option value="${escapeHtml(p.id)}" ${sel}>${escapeHtml(p.name)} (${escapeHtml(p.payType)})</option>`);
        });
      return base.join('');
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="padding:18px;color:#6b7280;">
            No staff found. Tip: open <a href="../manage-team/manage-team.html" style="color:#6366f1;text-decoration:underline;">Manage team</a> to add staff, or switch “Show” to All.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered
      .map((s) => {
        const name = s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim();
        const hourly = s.hourlyRateOverride === undefined ? '' : String(s.hourlyRateOverride);
        const session = s.sessionRateOverride === undefined ? '' : String(s.sessionRateOverride);

        return `
          <tr data-staff-id="${escapeHtml(s.id)}">
            <td>
              <div style="font-weight:900;color:#111827;">${escapeHtml(name)}</div>
              <div class="mono" style="color:#6b7280;margin-top:4px;">${escapeHtml(s.id)}</div>
            </td>
            <td>
              <select class="profile-select" style="min-width:240px;border:1px solid #e5e7eb;border-radius:10px;padding:10px 10px;">
                ${profileOptions(s.defaultPayProfileId)}
              </select>
            </td>
            <td>
              <input class="hourly-input" type="number" min="0" step="0.01" value="${escapeHtml(hourly)}" placeholder="(none)" style="width:140px;border:1px solid #e5e7eb;border-radius:10px;padding:10px 10px;" />
              <div class="hint">Overrides profile hourly rate</div>
            </td>
            <td>
              <input class="session-input" type="number" min="0" step="0.01" value="${escapeHtml(session)}" placeholder="(none)" style="width:140px;border:1px solid #e5e7eb;border-radius:10px;padding:10px 10px;" />
              <div class="hint">Overrides profile session rate</div>
            </td>
            <td>
              <span class="mono">${escapeHtml(String(s.status || 'active'))}</span>
            </td>
          </tr>
        `;
      })
      .join('');

    // Wire input events to update draftStaff
    tbody.querySelectorAll('tr[data-staff-id]').forEach((tr) => {
      const staffId = tr.getAttribute('data-staff-id');
      const idx = draftStaff.findIndex((x) => String(x.id) === String(staffId));
      if (idx < 0) return;

      const profileSelect = tr.querySelector('.profile-select');
      const hourlyInput = tr.querySelector('.hourly-input');
      const sessionInput = tr.querySelector('.session-input');

      profileSelect?.addEventListener('change', () => {
        draftStaff[idx].defaultPayProfileId = String(profileSelect.value || '').trim();
      });

      hourlyInput?.addEventListener('input', () => {
        const v = toNumOrNull(hourlyInput.value);
        if (v === null) delete draftStaff[idx].hourlyRateOverride;
        else draftStaff[idx].hourlyRateOverride = v;
      });

      sessionInput?.addEventListener('input', () => {
        const v = toNumOrNull(sessionInput.value);
        if (v === null) delete draftStaff[idx].sessionRateOverride;
        else draftStaff[idx].sessionRateOverride = v;
      });
    });
  }

  function saveAll() {
    // Persist whole list
    Store.saveStaff(draftStaff);
    alert('Saved staff pay profile assignments.');
    render();
  }

  // Events
  btnRefresh.addEventListener('click', render);
  btnSaveAll.addEventListener('click', saveAll);
  search.addEventListener('input', render);
  statusFilter.addEventListener('change', render);

  // Init
  render();
})();

