// Pay Profiles CRUD

(function () {
  const Store = window.FMSPayrollStore;
  if (!Store) {
    console.error('FMSPayrollStore not found. Did you include payroll_store.js?');
    return;
  }

  const tbody = document.getElementById('tbody');
  const search = document.getElementById('search');

  const btnAdd = document.getElementById('btnAdd');
  const btnSeed = document.getElementById('btnSeed');
  const btnRefresh = document.getElementById('btnRefresh');

  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalHint = document.getElementById('modalHint');
  const btnSave = document.getElementById('btnSave');
  const btnClose = document.getElementById('btnClose');

  const f_id = document.getElementById('p_id');
  const f_name = document.getElementById('p_name');
  const f_payType = document.getElementById('p_payType');
  const f_hourly = document.getElementById('p_hourlyRate');
  const f_flatSession = document.getElementById('p_flatSessionRate');
  const f_rateClass = document.getElementById('p_rateClass');
  const f_rateGroup = document.getElementById('p_rateGroup');
  const f_rateO2O = document.getElementById('p_rateOneToOne');

  const f_multWeekend = document.getElementById('p_multWeekend');
  const f_ahStart = document.getElementById('p_ahStart');
  const f_ahEnd = document.getElementById('p_ahEnd');
  const f_ahMult = document.getElementById('p_ahMult');
  const f_multHoliday = document.getElementById('p_multHoliday');

  const f_otEnabled = document.getElementById('p_otEnabled');
  const f_otThreshold = document.getElementById('p_otThreshold');
  const f_otMult = document.getElementById('p_otMult');

  let editingId = null;

  function nowIso() {
    return new Date().toISOString();
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function seedDefaultsIfEmpty() {
    const profiles = Store.loadPayProfiles();
    if (profiles.length > 0) return;

    const ts = nowIso();
    const defaults = [
      {
        id: 'pp_hourly_default',
        name: 'Default Hourly',
        payType: 'hourly',
        hourlyRate: 0,
        sessionRates: { flatSessionRate: 0, bySessionType: {} },
        multipliers: {
          weekend: 1.0,
          afterHours: { start: '18:00', end: '06:00', multiplier: 1.0 },
          publicHoliday: 1.0,
        },
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
        multipliers: {
          weekend: 1.0,
          afterHours: { start: '18:00', end: '06:00', multiplier: 1.0 },
          publicHoliday: 1.0,
        },
        overtimeDaily: { enabled: false, thresholdHours: 8, multiplier: 1.5 },
        createdAt: ts,
        updatedAt: ts,
      },
      {
        id: 'pp_mixed_default',
        name: 'Default Mixed',
        payType: 'mixed',
        hourlyRate: 0,
        sessionRates: { flatSessionRate: 0, bySessionType: {} },
        multipliers: {
          weekend: 1.0,
          afterHours: { start: '18:00', end: '06:00', multiplier: 1.0 },
          publicHoliday: 1.0,
        },
        overtimeDaily: { enabled: true, thresholdHours: 8, multiplier: 1.5 },
        createdAt: ts,
        updatedAt: ts,
      },
    ];

    Store.savePayProfiles(defaults);
  }

  function openModal(profile) {
    editingId = profile?.id || null;

    modalTitle.textContent = editingId ? 'Edit pay profile' : 'Add pay profile';
    modalHint.textContent = editingId ? `Editing: ${editingId}` : 'Create a new profile';

    f_id.value = profile?.id || '';
    f_name.value = profile?.name || '';
    f_payType.value = profile?.payType || 'hourly';

    f_hourly.value = profile?.hourlyRate ?? 0;

    f_flatSession.value = profile?.sessionRates?.flatSessionRate ?? 0;
    f_rateClass.value = profile?.sessionRates?.bySessionType?.Class ?? '';
    f_rateGroup.value = profile?.sessionRates?.bySessionType?.Group ?? '';
    f_rateO2O.value = profile?.sessionRates?.bySessionType?.['One-to-One'] ?? '';

    f_multWeekend.value = profile?.multipliers?.weekend ?? 1.0;
    f_ahStart.value = profile?.multipliers?.afterHours?.start ?? '18:00';
    f_ahEnd.value = profile?.multipliers?.afterHours?.end ?? '06:00';
    f_ahMult.value = profile?.multipliers?.afterHours?.multiplier ?? 1.0;
    f_multHoliday.value = profile?.multipliers?.publicHoliday ?? 1.0;

    f_otEnabled.value = String(Boolean(profile?.overtimeDaily?.enabled));
    f_otThreshold.value = profile?.overtimeDaily?.thresholdHours ?? 8;
    f_otMult.value = profile?.overtimeDaily?.multiplier ?? 1.5;

    // ID editable only when creating
    f_id.disabled = Boolean(editingId);

    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    editingId = null;
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  }

  function numOr(val, fallback) {
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  }

  function readForm() {
    const id = String(f_id.value || '').trim();
    const name = String(f_name.value || '').trim();
    const payType = String(f_payType.value || 'hourly');

    if (!id) throw new Error('ID is required');
    if (!name) throw new Error('Name is required');

    const byType = {};
    const classRate = f_rateClass.value === '' ? null : numOr(f_rateClass.value, null);
    const groupRate = f_rateGroup.value === '' ? null : numOr(f_rateGroup.value, null);
    const o2oRate = f_rateO2O.value === '' ? null : numOr(f_rateO2O.value, null);
    if (classRate !== null) byType.Class = classRate;
    if (groupRate !== null) byType.Group = groupRate;
    if (o2oRate !== null) byType['One-to-One'] = o2oRate;

    const profile = {
      id,
      name,
      payType,
      hourlyRate: numOr(f_hourly.value, 0),
      sessionRates: {
        flatSessionRate: numOr(f_flatSession.value, 0),
        bySessionType: byType,
      },
      multipliers: {
        weekend: numOr(f_multWeekend.value, 1.0),
        afterHours: {
          start: f_ahStart.value || '18:00',
          end: f_ahEnd.value || '06:00',
          multiplier: numOr(f_ahMult.value, 1.0),
        },
        publicHoliday: numOr(f_multHoliday.value, 1.0),
      },
      overtimeDaily: {
        enabled: String(f_otEnabled.value) === 'true',
        thresholdHours: numOr(f_otThreshold.value, 8),
        multiplier: numOr(f_otMult.value, 1.5),
      },
    };

    return profile;
  }

  function upsertProfile(profile) {
    const list = Store.loadPayProfiles();
    const idx = list.findIndex((p) => String(p?.id) === String(profile.id));
    const ts = nowIso();

    if (idx >= 0) {
      list[idx] = { ...list[idx], ...profile, id: list[idx].id, updatedAt: ts, createdAt: list[idx].createdAt || ts };
    } else {
      list.unshift({ ...profile, createdAt: ts, updatedAt: ts });
    }

    Store.savePayProfiles(list);
  }

  function deleteProfile(profileId) {
    const id = String(profileId || '').trim();
    if (!id) return;

    // Warn if used by staff
    const staff = Store.loadStaff();
    const usedBy = staff.filter((s) => String(s.defaultPayProfileId || '').trim() === id);

    const msg = usedBy.length
      ? `This profile is assigned to ${usedBy.length} staff. Deleting it will fall back to default hourly profile. Continue?`
      : 'Delete this profile?';

    if (!confirm(msg)) return;

    const list = Store.loadPayProfiles().filter((p) => String(p?.id) !== id);
    Store.savePayProfiles(list);

    // Unassign from staff
    if (usedBy.length) {
      const staffList = staff.map((s) => (String(s.defaultPayProfileId || '').trim() === id ? { ...s, defaultPayProfileId: '' } : s));
      Store.saveStaff(staffList);
    }
  }

  function render() {
    seedDefaultsIfEmpty();

    const needle = String(search.value || '').trim().toLowerCase();
    const list = Store.loadPayProfiles();

    const filtered = !needle
      ? list
      : list.filter((p) => {
          const id = String(p?.id || '').toLowerCase();
          const name = String(p?.name || '').toLowerCase();
          return id.includes(needle) || name.includes(needle);
        });

    tbody.innerHTML = filtered
      .map((p) => {
        const type = p.payType || 'hourly';
        const rates = [];
        if (type === 'hourly' || type === 'mixed') rates.push(`$${Number(p.hourlyRate || 0).toFixed(2)}/hr`);
        if (type === 'per_session' || type === 'mixed') {
          const flat = Number(p?.sessionRates?.flatSessionRate || 0);
          rates.push(`$${flat.toFixed(2)}/session`);
        }

        const mult = p?.multipliers || {};
        const after = mult.afterHours || {};
        const multText = `wk:${Number(mult.weekend || 1).toFixed(2)} ah:${Number(after.multiplier || 1).toFixed(2)} hol:${Number(mult.publicHoliday || 1).toFixed(2)}`;

        const ot = p?.overtimeDaily || {};
        const otText = ot.enabled ? `on @ ${Number(ot.thresholdHours || 8)}h ×${Number(ot.multiplier || 1.5).toFixed(2)}` : 'off';

        return `
          <tr>
            <td>
              <div style="font-weight:900;color:#111827;">${escapeHtml(p.name || '')}</div>
              <div class="mono" style="color:#6b7280;margin-top:4px;">${escapeHtml(p.id)}</div>
            </td>
            <td><span class="badge gray">${escapeHtml(type)}</span></td>
            <td class="mono">${escapeHtml(rates.join(' • '))}</td>
            <td class="mono">${escapeHtml(multText)}</td>
            <td class="mono">${escapeHtml(otText)}</td>
            <td>
              <div class="row-actions">
                <button class="link-btn" data-action="edit" data-id="${escapeHtml(p.id)}">Edit</button>
                <button class="link-btn" data-action="delete" data-id="${escapeHtml(p.id)}" style="color:#dc2626;">Delete</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    document.querySelectorAll('button.link-btn[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (action === 'edit') {
          const p = Store.loadPayProfiles().find((x) => String(x?.id) === String(id));
          if (p) openModal(p);
        }
        if (action === 'delete') {
          deleteProfile(id);
          render();
        }
      });
    });
  }

  // Events
  btnAdd.addEventListener('click', () => openModal(null));
  btnSeed.addEventListener('click', () => {
    seedDefaultsIfEmpty();
    alert('Default profiles ensured.');
    render();
  });
  btnRefresh.addEventListener('click', render);
  search.addEventListener('input', render);

  btnClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  btnSave.addEventListener('click', () => {
    try {
      const profile = readForm();
      upsertProfile(profile);
      closeModal();
      render();
    } catch (err) {
      alert(err?.message || 'Invalid profile');
    }
  });

  // init
  render();

  // If opened from Staff pay profiles with ?new=1, auto-open the create modal.
  (function openNewFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') !== '1') return;
    setTimeout(() => openModal(null), 0);
  })();
})();

