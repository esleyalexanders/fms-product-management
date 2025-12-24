// Timesheet/Payroll foundation store helpers (localStorage-first)
//
// Stores:
// - fms_sessions[] (existing, service_job_v3)
// - fms_staff[] (source of truth from Manage Team)
// - fms_pay_profiles[] (new)
// - fms_time_entries[] (new)
//
// This module focuses on:
// - Session staff normalization: string/name/object -> {id,name}[] using fms_staff
// - Time entry generation: ensure one entry per (sessionId, staffId)
// - Exception detection + computed minutes
(() => {
  const KEYS = {
    sessions: 'fms_sessions',
    staff: 'fms_staff',
    payProfiles: 'fms_pay_profiles',
    timeEntries: 'fms_time_entries',
  };

  function safeJsonParse(str, fallback) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
    }
  }

  function loadArray(key) {
    const raw = safeJsonParse(localStorage.getItem(key) || '[]', []);
    return Array.isArray(raw) ? raw : [];
  }

  function saveArray(key, value) {
    const arr = Array.isArray(value) ? value : [];
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeName(name) {
    return String(name || '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  function splitName(fullName) {
    const store = window.FMSStaffStore;
    if (store?.splitName) return store.splitName(fullName);

    const name = String(fullName || '')
      .trim()
      .replace(/\s+/g, ' ');
    if (!name) return { firstName: '', lastName: '', name: '' };
    const parts = name.split(' ');
    if (parts.length === 1) return { firstName: parts[0], lastName: '', name };
    return { firstName: parts[0], lastName: parts.slice(1).join(' '), name };
  }

  function pad3(n) {
    return String(n).padStart(3, '0');
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

  function loadSessions() {
    return loadArray(KEYS.sessions);
  }

  function saveSessions(sessions) {
    saveArray(KEYS.sessions, sessions);
  }

  function loadStaff() {
    // Prefer the Manage Team helper if present; otherwise read localStorage directly
    const store = window.FMSStaffStore;
    if (store?.loadStaff) return store.loadStaff({ autoSeed: false });
    return loadArray(KEYS.staff);
  }

  function saveStaff(staff) {
    const store = window.FMSStaffStore;
    if (store?.saveStaff) return store.saveStaff(staff);
    return saveArray(KEYS.staff, staff);
  }

  function findStaffById(staffList, staffId) {
    const list = Array.isArray(staffList) ? staffList : [];
    const id = String(staffId || '').trim();
    if (!id) return null;
    return list.find((s) => String(s?.id || '').trim() === id) || null;
  }

  function findStaffByName(staffList, staffName) {
    const list = Array.isArray(staffList) ? staffList : [];
    const target = normalizeName(staffName);
    if (!target) return null;
    return (
      list.find((s) => normalizeName(s?.name || `${s?.firstName || ''} ${s?.lastName || ''}`) === target) || null
    );
  }

  function upsertPlaceholderStaff({ id, name }) {
    const staffList = loadStaff();

    const existingById = id ? findStaffById(staffList, id) : null;
    if (existingById) return { staff: existingById, created: false };

    const existingByName = name ? findStaffByName(staffList, name) : null;
    if (existingByName) return { staff: existingByName, created: false };

    const displayName = String(name || 'Unlinked Staff').trim() || 'Unlinked Staff';
    const { firstName, lastName, name: normalizedName } = splitName(displayName);

    const newId = id && typeof id === 'string' && id.trim() ? id.trim() : generateStaffId(staffList);
    const ts = nowIso();

    const placeholder = {
      id: newId,
      legacyId: undefined,
      firstName,
      lastName,
      name: normalizedName,
      role: 'Staff',
      jobTitle: '',
      email: '',
      phone: '',

      // Keep placeholders non-intrusive in UIs that default-filter to active staff
      status: 'inactive',
      unlinked: true,

      // Payroll
      defaultPayProfileId: '',
      hourlyRateOverride: undefined,
      sessionRateOverride: undefined,

      createdAt: ts,
      updatedAt: ts,
    };

    staffList.push(placeholder);
    saveStaff(staffList);

    return { staff: placeholder, created: true };
  }

  function getSessionRawAssignments(session) {
    if (!session || typeof session !== 'object') return [];

    // Canonical in plan: assignedStaff
    if (session.assignedStaff !== undefined) return session.assignedStaff;

    // Existing session_create_script stores `staff`
    if (session.staff !== undefined) return session.staff;

    return [];
  }

  function normalizeSessionAssignedStaff(session, options) {
    const opts = options || {};
    const persist = opts.persist === true;

    const staffList = loadStaff();
    const raw = getSessionRawAssignments(session);

    const rawArr = Array.isArray(raw) ? raw : raw ? [raw] : [];

    let createdAnyStaff = false;
    const normalized = rawArr
      .map((a) => {
        if (typeof a === 'string') return { id: null, name: a };
        if (a && typeof a === 'object') {
          const name = a.name || a.fullName || `${a.firstName || ''} ${a.lastName || ''}`.trim();
          return { id: a.id || null, name: name || 'Unknown' };
        }
        return { id: null, name: 'Unknown' };
      })
      .map((a) => {
        const id = a.id && typeof a.id === 'string' ? a.id.trim() : '';
        const name = String(a.name || '').trim();

        let staff = id ? findStaffById(staffList, id) : null;
        if (!staff && name) staff = findStaffByName(staffList, name);

        if (!staff) {
          const res = upsertPlaceholderStaff({ id: id || undefined, name });
          staff = res.staff;
          createdAnyStaff = createdAnyStaff || res.created;
        }

        return { id: staff.id, name: staff.name || `${staff.firstName || ''} ${staff.lastName || ''}`.trim() };
      });

    // Detect change
    const before = Array.isArray(session?.assignedStaff) ? session.assignedStaff : null;
    const beforeJson = before ? JSON.stringify(before) : '';
    const afterJson = JSON.stringify(normalized);
    const didChange = beforeJson !== afterJson;

    const nextSession = { ...(session || {}) };

    // Always set canonical field in returned value
    nextSession.assignedStaff = normalized;

    // Keep compatibility for old code paths
    if (nextSession.staff !== undefined) {
      nextSession.staff = normalized;
    }

    if (persist && didChange) {
      const sessions = loadSessions();
      const idx = sessions.findIndex((s) => String(s?.id) === String(nextSession.id));
      if (idx >= 0) {
        sessions[idx] = { ...sessions[idx], ...nextSession, assignedStaff: normalized };
        saveSessions(sessions);
      }
    }

    return { session: nextSession, assignedStaff: normalized, didChange, createdAnyStaff };
  }

  function normalizeAllSessions(options) {
    const opts = options || {};
    const persist = opts.persist === true;

    const sessions = loadSessions();
    let changed = false;

    const normalized = sessions.map((s) => {
      const res = normalizeSessionAssignedStaff(s, { persist: false });
      if (res.didChange) changed = true;
      return res.session;
    });

    if (persist && changed) saveSessions(normalized);

    return { sessions: normalized, changed };
  }

  function loadPayProfiles() {
    return loadArray(KEYS.payProfiles);
  }

  function savePayProfiles(profiles) {
    saveArray(KEYS.payProfiles, profiles);
  }

  function loadTimeEntries() {
    return loadArray(KEYS.timeEntries);
  }

  function saveTimeEntries(entries) {
    saveArray(KEYS.timeEntries, entries);
  }

  function generateTimeEntryId() {
    // short + readable, no huge hashes
    return `te_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  function toLocalIso(date, time) {
    const d = String(date || '').trim();
    const t = String(time || '').trim();
    if (!d || !t) return '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return '';
    if (!/^\d{2}:\d{2}$/.test(t)) return '';
    return `${d}T${t}:00`;
  }

  function minutesDiff(isoStart, isoEnd) {
    const a = new Date(isoStart);
    const b = new Date(isoEnd);
    if (!Number.isFinite(a.getTime()) || !Number.isFinite(b.getTime())) return null;
    return Math.round((b.getTime() - a.getTime()) / 60000);
  }

  function computeAndFlagExceptions(entry) {
    const e = { ...(entry || {}) };
    const exceptions = [];

    const breakMinutesRaw = e.breakMinutes;
    const breakMinutes = breakMinutesRaw === '' || breakMinutesRaw === undefined || breakMinutesRaw === null ? 0 : Number(breakMinutesRaw);
    e.breakMinutes = Number.isFinite(breakMinutes) ? Math.max(0, breakMinutes) : 0;

    const hasStart = Boolean(e.actualStart);
    const hasEnd = Boolean(e.actualEnd);

    if (hasStart && !hasEnd) exceptions.push('missing_end');
    if (!hasStart && hasEnd) exceptions.push('missing_start');

    let workedMinutes = 0;
    if (hasStart && hasEnd) {
      const diff = minutesDiff(e.actualStart, e.actualEnd);
      if (diff === null) {
        exceptions.push('invalid_time');
      } else if (diff < 0) {
        exceptions.push('negative_duration');
      } else {
        workedMinutes = Math.max(0, diff - e.breakMinutes);
        if (e.breakMinutes > diff) exceptions.push('invalid_break');
      }
    }

    // Scheduled times sanity
    if (!e.scheduledStart || !e.scheduledEnd) {
      exceptions.push('missing_scheduled_time');
    }

    e.workedMinutes = workedMinutes;

    const managerApprovedMinutes =
      e.managerApprovedMinutes === '' || e.managerApprovedMinutes === undefined || e.managerApprovedMinutes === null
        ? null
        : Number(e.managerApprovedMinutes);

    if (managerApprovedMinutes !== null && (!Number.isFinite(managerApprovedMinutes) || managerApprovedMinutes < 0)) {
      exceptions.push('invalid_manager_approved');
    }

    const paidMinutes = managerApprovedMinutes !== null && Number.isFinite(managerApprovedMinutes)
      ? Math.max(0, Math.round(managerApprovedMinutes))
      : workedMinutes;

    e.paidMinutes = paidMinutes;

    // Phase 1 only: overtime allocation happens later (Phase 4). Keep field for forward-compat.
    e.overtimeMinutesDaily = Number.isFinite(Number(e.overtimeMinutesDaily)) ? Number(e.overtimeMinutesDaily) : 0;

    e.exceptions = exceptions;
    return e;
  }

  function recomputeTimeEntry(entry) {
    return computeAndFlagExceptions(entry);
  }

  function listTimeEntriesForSession(sessionId) {
    const sid = String(sessionId || '').trim();
    if (!sid) return [];
    return loadTimeEntries().filter((te) => te && String(te.sessionId) === sid);
  }

  function upsertTimeEntry(timeEntry, options) {
    const opts = options || {};
    const persist = opts.persist !== false;

    const incoming = timeEntry && typeof timeEntry === 'object' ? { ...timeEntry } : null;
    if (!incoming) return null;
    if (!incoming.id) incoming.id = generateTimeEntryId();

    const entries = loadTimeEntries();
    const idx = entries.findIndex((te) => te && te.id === incoming.id);
    const ts = nowIso();

    const merged = idx >= 0 ? { ...entries[idx], ...incoming } : { ...incoming };
    merged.updatedAt = ts;
    if (!merged.createdAt) merged.createdAt = ts;

    const computed = computeAndFlagExceptions(merged);

    if (idx >= 0) entries[idx] = computed;
    else entries.push(computed);

    if (persist) saveTimeEntries(entries);
    return computed;
  }

  function ensureTimeEntriesForSession(session, options) {
    const opts = options || {};
    const persist = opts.persist !== false;

    // Normalize staff assignments first (also ensures placeholder staff records exist)
    const normalizedSessionRes = normalizeSessionAssignedStaff(session, { persist: false });
    const normalizedSession = normalizedSessionRes.session;

    const scheduledStart = toLocalIso(normalizedSession.date, normalizedSession.startTime);
    const scheduledEnd = toLocalIso(normalizedSession.date, normalizedSession.endTime);

    const entries = loadTimeEntries();
    let changed = false;

    (normalizedSession.assignedStaff || []).forEach((staffAssignment) => {
      const staffId = staffAssignment?.id;
      if (!staffId) return;

      const existingIdx = entries.findIndex((te) => te && te.sessionId === normalizedSession.id && te.staffId === staffId);
      if (existingIdx >= 0) {
        const existing = entries[existingIdx];

        // Keep scheduled times in sync if missing / changed
        const merged = {
          ...existing,
          scheduledStart: scheduledStart || existing.scheduledStart,
          scheduledEnd: scheduledEnd || existing.scheduledEnd,
          updatedAt: nowIso(),
        };
        entries[existingIdx] = computeAndFlagExceptions(merged);
        changed = true;
        return;
      }

      const ts = nowIso();
      const created = {
        id: generateTimeEntryId(),
        sessionId: normalizedSession.id,
        staffId,

        scheduledStart,
        scheduledEnd,

        actualStart: '',
        actualEnd: '',
        breakMinutes: 0,

        workedMinutes: 0,
        paidMinutes: 0,
        overtimeMinutesDaily: 0,

        managerApprovedMinutes: null,
        managerNote: '',

        status: 'draft',
        exceptions: [],

        createdAt: ts,
        updatedAt: ts,
        history: [],
      };

      entries.push(computeAndFlagExceptions(created));
      changed = true;
    });

    if (persist && changed) saveTimeEntries(entries);

    return {
      session: normalizedSession,
      timeEntries: entries.filter((te) => te && te.sessionId === normalizedSession.id),
      changed,
    };
  }

  window.FMSPayrollStore = {
    KEYS,

    // Sessions
    loadSessions,
    saveSessions,
    normalizeSessionAssignedStaff,
    normalizeAllSessions,

    // Staff
    loadStaff,
    saveStaff,
    upsertPlaceholderStaff,

    // Pay profiles
    loadPayProfiles,
    savePayProfiles,

    // Time entries
    loadTimeEntries,
    saveTimeEntries,
    listTimeEntriesForSession,
    recomputeTimeEntry,
    upsertTimeEntry,
    ensureTimeEntriesForSession,

    // Utils
    normalizeName,
    splitName,
  };
})();

