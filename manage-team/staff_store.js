// Shared staff registry store for Manage Team + Timesheet/Payroll
// Source of truth: localStorage.fms_staff[]
//
// Design goals:
// - Non-breaking: if fms_staff is empty, seed from demo/sample data so pages still work
// - Canonical IDs: string IDs like STAFF-001, STAFF-002, ...
// - Compatibility: keep legacy numeric IDs in `legacyId` to support old deep links
// - Payroll fields: defaultPayProfileId + optional rate overrides
(() => {
  const STORAGE_KEY = 'fms_staff';

  function safeJsonParse(str, fallback) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
    }
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function pad3(n) {
    return String(n).padStart(3, '0');
  }

  function sampleStaffLegacy() {
    // Mirrors the previous hardcoded sample list in manage-team-script.js
    return [
      {
        id: 0,
        firstName: 'Robert',
        lastName: 'Anderson',
        role: 'Franchise Owner',
        jobTitle: 'Franchise Owner',
        email: 'robert.anderson@store.com',
        phone: '+1 234 567 8900',
        status: 'active',
        isOwner: true,
      },
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        role: 'Manager',
        jobTitle: 'Store Manager',
        email: 'john.smith@store.com',
        phone: '+1 234 567 8901',
        status: 'active',
        isCurrentUser: true,
      },
      {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'Staff',
        jobTitle: 'Senior HVAC Technician',
        email: 'sarah.johnson@store.com',
        phone: '+1 234 567 8902',
        status: 'active',
      },
      {
        id: 3,
        firstName: 'Mike',
        lastName: 'Davis',
        role: 'Staff',
        jobTitle: 'HVAC Technician',
        email: 'mike.davis@store.com',
        phone: '+1 234 567 8903',
        status: 'active',
      },
      {
        id: 4,
        firstName: 'Emily',
        lastName: 'Wilson',
        role: 'Staff',
        jobTitle: 'Lead Receptionist',
        email: 'emily.wilson@store.com',
        phone: '+1 234 567 8904',
        status: 'inactive',
      },
    ];
  }

  function toFullName(firstName, lastName, fallbackName) {
    const fn = (firstName || '').trim();
    const ln = (lastName || '').trim();
    if (fn || ln) return `${fn} ${ln}`.trim();
    return (fallbackName || '').trim();
  }

  function splitName(fullName) {
    const name = (fullName || '').trim().replace(/\s+/g, ' ');
    if (!name) return { firstName: '', lastName: '', name: '' };
    const parts = name.split(' ');
    if (parts.length === 1) return { firstName: parts[0], lastName: '', name };
    return { firstName: parts[0], lastName: parts.slice(1).join(' '), name };
  }

  function normalizeStaffRecord(input) {
    const r = input && typeof input === 'object' ? input : {};
    const legacyId = r.legacyId ?? (typeof r.id === 'number' ? r.id : undefined);

    // Normalize ID (keep string IDs as-is)
    let id = r.id;
    if (typeof id !== 'string' || !id.trim()) {
      id = undefined;
    } else {
      id = id.trim();
    }

    // Normalize name fields
    const fullName = toFullName(r.firstName, r.lastName, r.name);
    const { firstName, lastName, name } = splitName(fullName);

    const status = (r.status || 'active').toLowerCase() === 'inactive' ? 'inactive' : 'active';

    const normalized = {
      id,
      legacyId: legacyId !== undefined && legacyId !== null ? Number(legacyId) : undefined,
      firstName,
      lastName,
      name,

      role: (r.role || '').trim(),
      jobTitle: (r.jobTitle || '').trim(),
      email: (r.email || '').trim(),
      phone: (r.phone || '').trim(),
      status,

      isOwner: Boolean(r.isOwner || r.role === 'Franchise Owner'),
      isCurrentUser: Boolean(r.isCurrentUser),

      // Payroll
      defaultPayProfileId: (r.defaultPayProfileId || '').trim() || '',
      hourlyRateOverride:
        r.hourlyRateOverride !== undefined && r.hourlyRateOverride !== null && r.hourlyRateOverride !== ''
          ? Number(r.hourlyRateOverride)
          : undefined,
      sessionRateOverride:
        r.sessionRateOverride !== undefined && r.sessionRateOverride !== null && r.sessionRateOverride !== ''
          ? Number(r.sessionRateOverride)
          : undefined,

      // Employment metadata (optional)
      employeeId: (r.employeeId || '').trim() || (r.staffId || '').trim() || '',
      employmentType: (r.employmentType || '').trim(),
      dateOfBirth: (r.dateOfBirth || '').trim(),
      startDate: (r.startDate || '').trim(),

      // Free-form extra data (e.g., scheduling)
      scheduling: r.scheduling && typeof r.scheduling === 'object' ? r.scheduling : undefined,

      createdAt: r.createdAt || undefined,
      updatedAt: r.updatedAt || undefined,
    };

    return normalized;
  }

  function getStoredStaffRaw() {
    const raw = safeJsonParse(localStorage.getItem(STORAGE_KEY) || '[]', []);
    return Array.isArray(raw) ? raw : [];
  }

  function saveStaff(staffList) {
    const list = Array.isArray(staffList) ? staffList : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function generateStaffId(existingStaff) {
    const list = Array.isArray(existingStaff) ? existingStaff : [];
    let max = 0;
    list.forEach((s) => {
      const id = typeof s?.id === 'string' ? s.id : '';
      const m = id.match(/^STAFF-(\d{3,})$/i);
      if (m) max = Math.max(max, Number(m[1]));
    });
    return `STAFF-${pad3(max + 1)}`;
  }

  function seedFromSamples() {
    const samples = sampleStaffLegacy();
    const seededAt = nowIso();
    const seeded = samples.map((s, idx) => {
      const normalized = normalizeStaffRecord({
        ...s,
        legacyId: s.id,
        id: `STAFF-${pad3(idx + 1)}`,
        createdAt: seededAt,
        updatedAt: seededAt,
      });
      return normalized;
    });
    saveStaff(seeded);
    return seeded;
  }

  function ensureStaffSeededFromSamples() {
    const existing = getStoredStaffRaw();
    if (existing.length > 0) return existing.map(normalizeStaffRecord);
    return seedFromSamples();
  }

  function loadStaff(options) {
    const opts = options || {};
    const autoSeed = opts.autoSeed !== false;
    const raw = getStoredStaffRaw();
    if (raw.length > 0) return raw.map(normalizeStaffRecord);
    return autoSeed ? ensureStaffSeededFromSamples() : [];
  }

  function findStaffByIdOrLegacy(staffList, idOrLegacy) {
    const list = Array.isArray(staffList) ? staffList : [];
    if (idOrLegacy === undefined || idOrLegacy === null) return null;

    const str = String(idOrLegacy).trim();
    // Canonical string ID
    const byId = list.find((s) => String(s.id || '').trim() === str);
    if (byId) return byId;

    // Legacy numeric id
    const legacyNum = Number(str);
    if (!Number.isNaN(legacyNum)) {
      const byLegacy = list.find((s) => Number(s.legacyId) === legacyNum);
      if (byLegacy) return byLegacy;
    }

    return null;
  }

  function upsertStaff(staff) {
    const list = loadStaff();
    const normalized = normalizeStaffRecord(staff);

    // Ensure canonical ID
    if (!normalized.id) {
      normalized.id = generateStaffId(list);
    }

    const idx = list.findIndex((s) => s.id === normalized.id);
    const timestamp = nowIso();
    if (idx >= 0) {
      const merged = {
        ...list[idx],
        ...normalized,
        id: list[idx].id,
        createdAt: list[idx].createdAt || timestamp,
        updatedAt: timestamp,
      };
      list[idx] = merged;
    } else {
      list.push({
        ...normalized,
        createdAt: normalized.createdAt || timestamp,
        updatedAt: timestamp,
      });
    }
    saveStaff(list);
    return normalized;
  }

  function setStaffStatus(idOrLegacy, status) {
    const list = loadStaff();
    const staff = findStaffByIdOrLegacy(list, idOrLegacy);
    if (!staff) return null;
    staff.status = status === 'inactive' ? 'inactive' : 'active';
    staff.updatedAt = nowIso();
    saveStaff(list);
    return staff;
  }

  function getCurrentUserStaffId() {
    const list = loadStaff();
    const byFlag = list.find((s) => s.isCurrentUser);
    if (byFlag?.id) return byFlag.id;
    const byLegacy = list.find((s) => s.legacyId === 1);
    if (byLegacy?.id) return byLegacy.id;
    const byName = list.find((s) => (s.name || '').toLowerCase() === 'john smith');
    return byName?.id || null;
  }

  window.FMSStaffStore = {
    STORAGE_KEY,
    loadStaff,
    saveStaff,
    ensureStaffSeededFromSamples,
    normalizeStaffRecord,
    splitName,
    generateStaffId,
    findStaffByIdOrLegacy,
    upsertStaff,
    setStaffStatus,
    getCurrentUserStaffId,
  };
})();


