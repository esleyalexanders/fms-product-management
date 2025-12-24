// Pay Run Builder (Manager)
// - Builds draft pay runs from approved time entries
// - Supports hourly / per-session / mixed via fms_pay_profiles
// - Applies daily overtime (only) and simple multipliers (weekend/after-hours/public holiday)
// - Finalize locks included time entries
// - Export CSV

(function () {
  const Store = window.FMSPayrollStore;
  if (!Store) {
    console.error('FMSPayrollStore not found. Did you include payroll_store.js?');
    return;
  }

  const PAYRUNS_KEY = 'fms_pay_runs';

  const elPayRunSelect = document.getElementById('payRunSelect');
  const elStart = document.getElementById('periodStart');
  const elEnd = document.getElementById('periodEnd');
  const elInclude = document.getElementById('includeStatus');

  const btnBuild = document.getElementById('btnBuild');
  const btnFinalize = document.getElementById('btnFinalize');
  const btnExport = document.getElementById('btnExport');
  const btnRefresh = document.getElementById('btnRefresh');
  const btnSeedDemo = document.getElementById('btnSeedDemo');
  const btnSeedDemoInline = document.getElementById('btnSeedDemoInline');
  const btnSeedDemoEmpty = document.getElementById('btnSeedDemoEmpty');

  const summaryPanel = document.getElementById('summaryPanel');
  const emptyPanel = document.getElementById('empty');

  const kpiStatus = document.getElementById('kpiStatus');
  const kpiEntries = document.getElementById('kpiEntries');
  const kpiStaff = document.getElementById('kpiStaff');
  const kpiGross = document.getElementById('kpiGross');
  const runIdBadge = document.getElementById('runIdBadge');

  const staffTotalsTbody = document.getElementById('staffTotalsTbody');
  const lineItemsTbody = document.getElementById('lineItemsTbody');

  let currentPayRun = null;
  let lastBuiltPayRunId = null;

  function safeJsonParse(str, fallback) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
    }
  }

  function loadPayRuns() {
    const raw = safeJsonParse(localStorage.getItem(PAYRUNS_KEY) || '[]', []);
    return Array.isArray(raw) ? raw : [];
  }

  function savePayRuns(runs) {
    localStorage.setItem(PAYRUNS_KEY, JSON.stringify(Array.isArray(runs) ? runs : []));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function toYmd(d) {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
  }

  function isValidYmd(ymd) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(ymd || ''));
  }

  function formatMoney(n) {
    const v = Number(n) || 0;
    return `$${v.toFixed(2)}`;
  }

  function minutesToHours(mins) {
    return (Math.max(0, Number(mins) || 0) / 60);
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function generatePayRunId() {
    return `pr_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  function toIso(ymd, hm) {
    if (!isValidYmd(ymd)) return '';
    const m = String(hm || '').match(/^(\d{2}):(\d{2})$/);
    if (!m) return '';
    return `${ymd}T${m[1]}:${m[2]}:00`;
  }

  function ensureStaffSeeded() {
    // Ensure staff exists even if Manage Team hasn't been opened yet
    const staffStore = window.FMSStaffStore;
    if (staffStore?.ensureStaffSeededFromSamples) staffStore.ensureStaffSeededFromSamples();
  }

  function seedDemoData() {
    ensureStaffSeeded();
    ensureDefaultPayProfiles();

    // Seed demo pay profiles (do not overwrite existing IDs)
    const profiles = Store.loadPayProfiles();
    const ts = nowIso();
    const ensureProfile = (p) => {
      const idx = profiles.findIndex((x) => String(x?.id) === String(p.id));
      if (idx >= 0) return;
      profiles.push({ ...p, createdAt: ts, updatedAt: ts });
    };

    ensureProfile({
      id: 'pp_demo_hourly',
      name: 'Demo Hourly (AU)',
      payType: 'hourly',
      hourlyRate: 35,
      sessionRates: { flatSessionRate: 0, bySessionType: {} },
      multipliers: { weekend: 1.25, afterHours: { start: '18:00', end: '06:00', multiplier: 1.25 }, publicHoliday: 1.5 },
      overtimeDaily: { enabled: true, thresholdHours: 8, multiplier: 1.5 },
    });
    ensureProfile({
      id: 'pp_demo_session',
      name: 'Demo Per-Session',
      payType: 'per_session',
      hourlyRate: 0,
      sessionRates: { flatSessionRate: 120, bySessionType: { Class: 150, Group: 120, 'One-to-One': 90 } },
      multipliers: { weekend: 1.25, afterHours: { start: '18:00', end: '06:00', multiplier: 1.25 }, publicHoliday: 1.5 },
      overtimeDaily: { enabled: false, thresholdHours: 8, multiplier: 1.5 },
    });
    ensureProfile({
      id: 'pp_demo_mixed',
      name: 'Demo Mixed',
      payType: 'mixed',
      hourlyRate: 30,
      sessionRates: { flatSessionRate: 50, bySessionType: {} },
      multipliers: { weekend: 1.25, afterHours: { start: '18:00', end: '06:00', multiplier: 1.25 }, publicHoliday: 1.5 },
      overtimeDaily: { enabled: true, thresholdHours: 8, multiplier: 1.5 },
    });
    Store.savePayProfiles(profiles);

    // Assign demo profiles to active staff (by seeded Manage Team sample names)
    const staff = Store.loadStaff();
    const byName = (n) => staff.find((s) => String(s?.name || '').toLowerCase() === String(n).toLowerCase());

    const john = byName('John Smith');
    const sarah = byName('Sarah Johnson');
    const mike = byName('Mike Davis');

    const updatedStaff = staff.map((s) => {
      if (john && s.id === john.id) return { ...s, defaultPayProfileId: 'pp_demo_mixed', hourlyRateOverride: 32 };
      if (sarah && s.id === sarah.id) return { ...s, defaultPayProfileId: 'pp_demo_hourly', hourlyRateOverride: 35 };
      if (mike && s.id === mike.id) return { ...s, defaultPayProfileId: 'pp_demo_session', sessionRateOverride: 120 };
      return s;
    });
    Store.saveStaff(updatedStaff);

    // Seed demo sessions within the selected period (fallback: current month)
    const now = new Date();
    let startYmd = String(elStart.value || '').trim();
    let endYmd = String(elEnd.value || '').trim();
    if (!isValidYmd(startYmd) || !isValidYmd(endYmd) || endYmd < startYmd) {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      startYmd = toYmd(monthStart);
      endYmd = toYmd(monthEnd);
    }

    const startDate = new Date(startYmd + 'T00:00:00');
    const endDate = new Date(endYmd + 'T00:00:00');
    const totalDays = Math.max(0, Math.floor((endDate.getTime() - startDate.getTime()) / 86400000));

    const d1 = new Date(startDate);
    d1.setDate(d1.getDate() + Math.min(9, totalDays)); // +9 days or end
    const d2 = new Date(startDate);
    d2.setDate(d2.getDate() + Math.min(10, totalDays));
    const d3 = new Date(startDate);
    d3.setDate(d3.getDate() + Math.min(12, totalDays));

    const ymd1 = toYmd(d1);
    const ymd2 = toYmd(d2);
    const ymdWeekend = toYmd(d3);

    const sessions = Store.loadSessions();
    const existingIds = new Set(sessions.map((s) => String(s?.id)));
    const demoId = (suffix) => {
      const id = `demo_sess_${now.getFullYear()}${pad2(now.getMonth() + 1)}_${suffix}`;
      if (!existingIds.has(id)) return id;
      return `${id}_${Date.now()}`;
    };

    const newSessions = [
      // Overtime day for John: 5h + 5h => 10h (2h OT over 8h)
      {
        id: demoId('john_1'),
        learningServiceId: 'demo_ls_001',
        learningServiceName: 'Demo: Math Class',
        type: 'Class',
        date: ymd1,
        startTime: '09:00',
        endTime: '14:00',
        duration: 300,
        status: 'scheduled',
        assignedStaff: ['John Smith'],
      },
      {
        id: demoId('john_2'),
        learningServiceId: 'demo_ls_002',
        learningServiceName: 'Demo: Evening Study',
        type: 'Group',
        date: ymd1,
        startTime: '14:30',
        endTime: '19:30',
        duration: 300,
        status: 'scheduled',
        assignedStaff: ['John Smith'],
      },
      // Sarah hourly
      {
        id: demoId('sarah_1'),
        learningServiceId: 'demo_ls_003',
        learningServiceName: 'Demo: Tutoring',
        type: 'One-to-One',
        date: ymd2,
        startTime: '10:00',
        endTime: '12:00',
        duration: 120,
        status: 'scheduled',
        assignedStaff: ['Sarah Johnson'],
      },
      // Mike per-session (weekend/public-holiday will apply if set in holidays)
      {
        id: demoId('mike_1'),
        learningServiceId: 'demo_ls_004',
        learningServiceName: 'Demo: Weekend Workshop',
        type: 'Group',
        date: ymdWeekend,
        startTime: '11:00',
        endTime: '13:00',
        duration: 120,
        status: 'scheduled',
        assignedStaff: ['Mike Davis'],
      },
    ];

    const mergedSessions = sessions.concat(newSessions);
    Store.saveSessions(mergedSessions);

    // Seed a holiday for ymdWeekend so public holiday multiplier is testable
    const holidays = safeJsonParse(localStorage.getItem('fms_holidays') || '[]', []);
    const hol = Array.isArray(holidays) ? holidays : [];
    if (!hol.some((h) => h && String(h.date) === String(ymdWeekend))) {
      hol.push({ date: ymdWeekend, name: 'Demo Public Holiday' });
      localStorage.setItem('fms_holidays', JSON.stringify(hol));
    }

    // Create + approve time entries for demo sessions
    newSessions.forEach((s) => {
      const ensured = Store.ensureTimeEntriesForSession(s, { persist: true });
      const entries = Store.loadTimeEntries().filter((e) => e && String(e.sessionId) === String(s.id));
      entries.forEach((e) => {
        const actualStart = toIso(s.date, s.startTime);
        const actualEnd = toIso(s.date, s.endTime);
        const breakMinutes = 0;
        // managerApprovedMinutes in minutes (paidMinutes); for simplicity: duration - break
        const managerApprovedMinutes = Math.max(0, Number(s.duration || 0) - breakMinutes);
        Store.upsertTimeEntry(
          {
            ...e,
            scheduledStart: toIso(s.date, s.startTime),
            scheduledEnd: toIso(s.date, s.endTime),
            actualStart,
            actualEnd,
            breakMinutes,
            managerApprovedMinutes,
            status: 'approved',
          },
          { persist: true }
        );
      });
    });

    // Set builder dates to cover seeded sessions
    elStart.value = startYmd;
    elEnd.value = endYmd;
    elInclude.value = 'approved';

    populatePayRunSelect();

    // Auto build draft so user sees data immediately
    const run = buildDraftPayRun(elStart.value, elEnd.value, elInclude.value);
    if (run) {
      upsertPayRun(run);
      populatePayRunSelect();
      elPayRunSelect.value = run.id;
      lastBuiltPayRunId = run.id;
      renderPayRun(run);
    }

    alert('Seeded demo data (staff profiles, sessions, approved time entries, and a demo holiday). A draft pay run has been built.');
  }

  function getDayKeyFromIsoOrSession(session) {
    // Session is expected to have `date: YYYY-MM-DD`
    const ymd = String(session?.date || '').trim();
    return isValidYmd(ymd) ? ymd : '';
  }

  function getSessionMaps() {
    const sessions = Store.loadSessions();
    const staff = Store.loadStaff();
    const profiles = Store.loadPayProfiles();

    return {
      sessionsById: new Map(sessions.map((s) => [String(s.id), s])),
      staffById: new Map(staff.map((s) => [String(s.id), s])),
      profilesById: new Map(profiles.map((p) => [String(p.id), p])),
      sessions,
      staff,
      profiles,
    };
  }

  function ensureDefaultPayProfiles() {
    // Minimal seeding so system behaves even if no config UI exists yet
    const profiles = Store.loadPayProfiles();
    if (profiles.length > 0) return;

    const seededAt = nowIso();
    const defaultProfiles = [
      {
        id: 'pp_hourly_default',
        name: 'Default Hourly',
        payType: 'hourly',
        hourlyRate: 0,
        sessionRates: {
          flatSessionRate: 0,
          bySessionType: {},
        },
        multipliers: {
          weekend: 1.0,
          afterHours: { start: '18:00', end: '06:00', multiplier: 1.0 },
          publicHoliday: 1.0,
        },
        overtimeDaily: { enabled: true, thresholdHours: 8, multiplier: 1.5 },
        createdAt: seededAt,
        updatedAt: seededAt,
      },
      {
        id: 'pp_session_default',
        name: 'Default Per-Session',
        payType: 'per_session',
        hourlyRate: 0,
        sessionRates: {
          flatSessionRate: 0,
          bySessionType: {},
        },
        multipliers: {
          weekend: 1.0,
          afterHours: { start: '18:00', end: '06:00', multiplier: 1.0 },
          publicHoliday: 1.0,
        },
        overtimeDaily: { enabled: false, thresholdHours: 8, multiplier: 1.5 },
        createdAt: seededAt,
        updatedAt: seededAt,
      },
      {
        id: 'pp_mixed_default',
        name: 'Default Mixed',
        payType: 'mixed',
        hourlyRate: 0,
        sessionRates: {
          flatSessionRate: 0,
          bySessionType: {},
        },
        multipliers: {
          weekend: 1.0,
          afterHours: { start: '18:00', end: '06:00', multiplier: 1.0 },
          publicHoliday: 1.0,
        },
        overtimeDaily: { enabled: true, thresholdHours: 8, multiplier: 1.5 },
        createdAt: seededAt,
        updatedAt: seededAt,
      },
    ];

    Store.savePayProfiles(defaultProfiles);
  }

  function parseHmToMinutes(hm) {
    const m = String(hm || '').match(/^(\d{2}):(\d{2})$/);
    if (!m) return null;
    const h = Number(m[1]);
    const mm = Number(m[2]);
    if (!Number.isFinite(h) || !Number.isFinite(mm)) return null;
    return h * 60 + mm;
  }

  function isoToHm(iso) {
    if (!iso) return null;
    const m = String(iso).match(/T(\d{2}:\d{2}):\d{2}/);
    return m ? m[1] : null;
  }

  function getEntryTimeWindowMinutes(entry, session) {
    // Prefer actual time if present, else scheduled.
    const aStart = isoToHm(entry.actualStart);
    const aEnd = isoToHm(entry.actualEnd);
    const sStart = isoToHm(entry.scheduledStart) || String(session?.startTime || '');
    const sEnd = isoToHm(entry.scheduledEnd) || String(session?.endTime || '');

    const start = aStart || sStart;
    const end = aEnd || sEnd;

    if (!start || !end) return null;
    const st = parseHmToMinutes(start);
    const et = parseHmToMinutes(end);
    if (st === null || et === null) return null;

    // Allow overnight.
    let dur = et - st;
    if (dur < 0) dur += 24 * 60;
    return { startMin: st, endMin: (st + dur) % (24 * 60), duration: dur, overnight: et < st };
  }

  function overlapMinutesWindow(aStart, aEnd, bStart, bEnd) {
    // Overlap between [aStart,aEnd) and [bStart,bEnd) in same 0..1440 day.
    const start = Math.max(aStart, bStart);
    const end = Math.min(aEnd, bEnd);
    return Math.max(0, end - start);
  }

  function computeAfterHoursMultiplier(entry, session, profile) {
    const rule = profile?.multipliers?.afterHours;
    const mult = Number(rule?.multiplier);
    if (!Number.isFinite(mult) || mult <= 0) return 1.0;

    const startHm = rule?.start;
    const endHm = rule?.end;
    const a = parseHmToMinutes(startHm);
    const b = parseHmToMinutes(endHm);
    if (a === null || b === null) return 1.0;

    const tw = getEntryTimeWindowMinutes(entry, session);
    if (!tw) return 1.0;

    // We apply after-hours multiplier if ANY overlap occurs.
    // (Simplified; a more accurate implementation would split pay by minutes.)
    const paidWindowStart = tw.startMin;
    const paidWindowEnd = tw.startMin + tw.duration;

    function hasOverlap(segStart, segEnd, winStart, winEnd) {
      const overlap = overlapMinutesWindow(segStart, segEnd, winStart, winEnd);
      return overlap > 0;
    }

    // Normalize paid segments (could span midnight)
    const segments = [];
    if (paidWindowEnd <= 24 * 60) {
      segments.push([paidWindowStart, paidWindowEnd]);
    } else {
      segments.push([paidWindowStart, 24 * 60]);
      segments.push([0, paidWindowEnd - 24 * 60]);
    }

    // Normalize after-hours window (may span midnight)
    const windows = [];
    if (b > a) {
      windows.push([a, b]);
    } else if (b < a) {
      windows.push([a, 24 * 60]);
      windows.push([0, b]);
    } else {
      return 1.0;
    }

    for (const seg of segments) {
      for (const win of windows) {
        if (hasOverlap(seg[0], seg[1], win[0], win[1])) return mult;
      }
    }

    return 1.0;
  }

  function computeWeekendMultiplier(session, profile) {
    const m = Number(profile?.multipliers?.weekend);
    const weekendMult = Number.isFinite(m) && m > 0 ? m : 1.0;

    const ymd = String(session?.date || '').trim();
    if (!isValidYmd(ymd)) return 1.0;
    const dt = new Date(ymd + 'T00:00:00');
    if (Number.isNaN(dt.getTime())) return 1.0;
    const day = dt.getDay();
    const isWeekend = day === 0 || day === 6;
    return isWeekend ? weekendMult : 1.0;
  }

  function loadHolidays() {
    const raw = safeJsonParse(localStorage.getItem('fms_holidays') || '[]', []);
    return Array.isArray(raw) ? raw : [];
  }

  function isPublicHolidayDate(ymd) {
    if (!isValidYmd(ymd)) return false;
    const list = loadHolidays();
    return list.some((h) => h && String(h.date) === ymd);
  }

  function computePublicHolidayMultiplier(entry, session, profile) {
    // Applies if:
    // - session.date is in localStorage.fms_holidays[], OR
    // - time entry has a manual boolean flag: entry.publicHoliday === true
    const m = Number(profile?.multipliers?.publicHoliday);
    const ph = Number.isFinite(m) && m > 0 ? m : 1.0;
    const sessionDate = String(session?.date || '').trim();
    return entry?.publicHoliday || isPublicHolidayDate(sessionDate) ? ph : 1.0;
  }

  function combinedMultiplier(entry, session, profile) {
    const w = computeWeekendMultiplier(session, profile);
    const a = computeAfterHoursMultiplier(entry, session, profile);
    const p = computePublicHolidayMultiplier(entry, session, profile);
    return { total: w * a * p, weekend: w, afterHours: a, publicHoliday: p };
  }

  function resolvePayProfileForStaff(staff, profilesById) {
    const staffProfileId = String(staff?.defaultPayProfileId || '').trim();
    const byId = staffProfileId ? profilesById.get(staffProfileId) : null;
    if (byId) return byId;

    // fallback to hourly default
    return profilesById.get('pp_hourly_default') || {
      id: 'pp_hourly_default',
      name: 'Default Hourly',
      payType: 'hourly',
      hourlyRate: 0,
      sessionRates: { flatSessionRate: 0, bySessionType: {} },
      multipliers: { weekend: 1.0, afterHours: { start: '18:00', end: '06:00', multiplier: 1.0 }, publicHoliday: 1.0 },
      overtimeDaily: { enabled: true, thresholdHours: 8, multiplier: 1.5 },
    };
  }

  function resolveRates(staff, profile, sessionType) {
    const payType = String(profile?.payType || 'hourly');

    const staffHourly = staff?.hourlyRateOverride;
    const staffSession = staff?.sessionRateOverride;

    const hourlyRate = Number.isFinite(Number(staffHourly)) ? Number(staffHourly) : Number(profile?.hourlyRate || 0);

    let sessionRate = 0;
    if (Number.isFinite(Number(staffSession))) {
      sessionRate = Number(staffSession);
    } else {
      const byType = profile?.sessionRates?.bySessionType || {};
      const rateByType = byType && sessionType && byType[sessionType] !== undefined ? Number(byType[sessionType]) : NaN;
      if (Number.isFinite(rateByType)) sessionRate = rateByType;
      else sessionRate = Number(profile?.sessionRates?.flatSessionRate || 0) || 0;
    }

    return { payType, hourlyRate, sessionRate };
  }

  function buildDraftPayRun(periodStart, periodEnd, includeMode) {
    if (!isValidYmd(periodStart) || !isValidYmd(periodEnd)) {
      alert('Please select a valid period start and end date.');
      return null;
    }
    if (periodEnd < periodStart) {
      alert('Period end must be on/after period start.');
      return null;
    }

    ensureDefaultPayProfiles();

    // Ensure sessions are normalized + entries exist for sessions in range
    Store.normalizeAllSessions({ persist: true });

    const { sessionsById, staffById, profilesById } = getSessionMaps();

    // Make sure entries exist for sessions in range
    Store.loadSessions()
      .filter((s) => String(s?.date || '') >= periodStart && String(s?.date || '') <= periodEnd)
      .forEach((s) => Store.ensureTimeEntriesForSession(s, { persist: true }));

    let entries = Store.loadTimeEntries();
    entries = entries.map((e) => (e ? Store.recomputeTimeEntry(e) : e));
    Store.saveTimeEntries(entries);

    const includeStatuses = includeMode === 'approved_or_locked' ? new Set(['approved', 'locked']) : new Set(['approved']);

    // Filter entries in range by session.date and status
    const selected = entries.filter((e) => {
      if (!e) return false;
      const st = String(e.status || 'draft').toLowerCase();
      if (!includeStatuses.has(st)) return false;
      const session = sessionsById.get(String(e.sessionId));
      const ymd = String(session?.date || '');
      if (!isValidYmd(ymd)) return false;
      if (ymd < periodStart || ymd > periodEnd) return false;
      return true;
    });

    // Group entries by staff/day for overtime calculation
    // daily totals based on paidMinutes (managerApprovedMinutes ?? workedMinutes)
    const byStaffDay = new Map();
    selected.forEach((e) => {
      const session = sessionsById.get(String(e.sessionId));
      const dayKey = getDayKeyFromIsoOrSession(session);
      const staffId = String(e.staffId);
      if (!dayKey || !staffId) return;
      const key = `${staffId}__${dayKey}`;
      const prev = byStaffDay.get(key) || { staffId, dayKey, entries: [], totalPaidMinutes: 0 };
      prev.entries.push(e);
      prev.totalPaidMinutes += Math.max(0, Number(e.paidMinutes) || 0);
      byStaffDay.set(key, prev);
    });

    // Allocate overtime minutes to last sessions of the day by end time desc
    const overtimeByEntryId = new Map();

    byStaffDay.forEach((group) => {
      const staff = staffById.get(String(group.staffId)) || null;
      const profile = resolvePayProfileForStaff(staff || {}, profilesById);
      const overtimeEnabled = Boolean(profile?.overtimeDaily?.enabled);
      const thresholdHours = Number(profile?.overtimeDaily?.thresholdHours);
      const thresholdMinutes = Number.isFinite(thresholdHours) ? Math.round(thresholdHours * 60) : 8 * 60;

      if (!overtimeEnabled) return;
      const overtimeTotal = Math.max(0, group.totalPaidMinutes - thresholdMinutes);
      if (overtimeTotal <= 0) return;

      // Sort by session end time desc
      const sorted = group.entries
        .slice()
        .sort((a, b) => {
          const sa = sessionsById.get(String(a.sessionId));
          const sb = sessionsById.get(String(b.sessionId));
          const aEnd = String(sa?.endTime || '00:00');
          const bEnd = String(sb?.endTime || '00:00');
          // Desc
          return bEnd.localeCompare(aEnd);
        });

      let remaining = overtimeTotal;
      for (const entry of sorted) {
        if (remaining <= 0) break;
        const paid = Math.max(0, Number(entry.paidMinutes) || 0);
        const alloc = Math.min(remaining, paid);
        overtimeByEntryId.set(String(entry.id), alloc);
        remaining -= alloc;
      }
    });

    const lineItems = [];
    const staffTotals = new Map();
    const lockedTimeEntryIds = [];

    selected.forEach((entry) => {
      const session = sessionsById.get(String(entry.sessionId)) || null;
      const staff = staffById.get(String(entry.staffId)) || null;
      const staffName = staff?.name || `${staff?.firstName || ''} ${staff?.lastName || ''}`.trim() || entry.staffId;

      const profile = resolvePayProfileForStaff(staff || {}, profilesById);
      const sessionType = session?.type || session?.learningServiceType || '';
      const { payType, hourlyRate, sessionRate } = resolveRates(staff || {}, profile, sessionType);

      const overtimeMinutes = overtimeByEntryId.get(String(entry.id)) || 0;
      const paidMinutes = Math.max(0, Number(entry.paidMinutes) || 0);
      const baseMinutes = Math.max(0, paidMinutes - overtimeMinutes);

      const mult = combinedMultiplier(entry, session, profile);
      const overtimeMult = Number(profile?.overtimeDaily?.multiplier);
      const overtimeMultiplier = Number.isFinite(overtimeMult) && overtimeMult > 0 ? overtimeMult : 1.5;

      // Pay computation
      let basePay = 0;
      let overtimePay = 0;
      let perSessionPay = 0;

      if (payType === 'hourly' || payType === 'mixed') {
        basePay = (baseMinutes / 60) * hourlyRate * mult.total;
        overtimePay = (overtimeMinutes / 60) * hourlyRate * overtimeMultiplier * mult.total;
      }

      if (payType === 'per_session' || payType === 'mixed') {
        perSessionPay = sessionRate * mult.total;
      }

      const total = basePay + overtimePay + perSessionPay;

      const staffKey = String(entry.staffId);
      const prev = staffTotals.get(staffKey) || {
        staffId: staffKey,
        staffName,
        payType,
        hoursMinutes: 0,
        overtimeMinutes: 0,
        sessions: 0,
        gross: 0,
      };

      prev.hoursMinutes += paidMinutes;
      prev.overtimeMinutes += overtimeMinutes;
      prev.sessions += 1;
      prev.gross += total;
      staffTotals.set(staffKey, prev);

      lineItems.push({
        timeEntryId: entry.id,
        sessionId: entry.sessionId,
        sessionDate: session?.date || '',
        sessionType: sessionType,
        staffId: entry.staffId,
        staffName,

        payProfileId: profile.id,
        payProfileName: profile.name,
        payType,

        hourlyRate,
        sessionRate,
        multiplierWeekend: mult.weekend,
        multiplierAfterHours: mult.afterHours,
        multiplierPublicHoliday: mult.publicHoliday,
        multiplierTotal: mult.total,

        paidMinutes,
        overtimeMinutes,
        baseMinutes,

        basePay,
        overtimePay,
        sessionPay: perSessionPay,
        totalPay: total,
      });

      lockedTimeEntryIds.push(entry.id);
    });

    const payRun = {
      id: generatePayRunId(),
      periodStart,
      periodEnd,
      status: 'draft',
      createdAt: nowIso(),
      finalizedAt: null,
      finalizedBy: null,
      exportedAt: null,

      lineItems,
      staffTotals: Array.from(staffTotals.values()).sort((a, b) => a.staffName.localeCompare(b.staffName)),
      lockedTimeEntryIds,
    };

    return payRun;
  }

  function upsertPayRun(payRun) {
    const runs = loadPayRuns();
    const idx = runs.findIndex((r) => r && r.id === payRun.id);
    if (idx >= 0) runs[idx] = payRun;
    else runs.unshift(payRun);
    savePayRuns(runs);
  }

  function renderPayRun(payRun) {
    currentPayRun = payRun;

    if (!payRun) {
      summaryPanel.style.display = 'none';
      emptyPanel.style.display = 'block';
      return;
    }

    emptyPanel.style.display = 'none';
    summaryPanel.style.display = 'block';

    runIdBadge.textContent = payRun.id;
    kpiStatus.textContent = payRun.status;
    kpiEntries.textContent = String(payRun.lineItems?.length || 0);
    kpiStaff.textContent = String(payRun.staffTotals?.length || 0);

    const gross = (payRun.staffTotals || []).reduce((sum, s) => sum + (Number(s.gross) || 0), 0);
    kpiGross.textContent = formatMoney(gross);

    staffTotalsTbody.innerHTML = (payRun.staffTotals || [])
      .map((s) => {
        return `
          <tr>
            <td>
              <div style="font-weight:900;color:#111827;">${escapeHtml(s.staffName)}</div>
              <div class="mono" style="color:#6b7280;margin-top:4px;">${escapeHtml(s.staffId)}</div>
            </td>
            <td><span class="badge gray">${escapeHtml(s.payType)}</span></td>
            <td class="mono">${escapeHtml((minutesToHours(s.hoursMinutes)).toFixed(2))}</td>
            <td class="mono">${escapeHtml((minutesToHours(s.overtimeMinutes)).toFixed(2))}</td>
            <td class="mono">${escapeHtml(String(s.sessions))}</td>
            <td class="mono" style="font-weight:900;">${escapeHtml(formatMoney(s.gross))}</td>
          </tr>
        `;
      })
      .join('');

    lineItemsTbody.innerHTML = (payRun.lineItems || [])
      .map((li) => {
        const multText = `w:${li.multiplierWeekend.toFixed(2)} a:${li.multiplierAfterHours.toFixed(2)} h:${li.multiplierPublicHoliday.toFixed(2)} = ${li.multiplierTotal.toFixed(2)}`;
        return `
          <tr>
            <td>
              <div class="mono" style="font-weight:900;color:#111827;">${escapeHtml(li.sessionId)}</div>
              <div style="color:#6b7280;margin-top:4px;">${escapeHtml(li.sessionType || '')}</div>
            </td>
            <td>
              <div style="font-weight:900;color:#111827;">${escapeHtml(li.staffName)}</div>
              <div class="mono" style="color:#6b7280;margin-top:4px;">${escapeHtml(li.staffId)}</div>
            </td>
            <td class="mono">${escapeHtml(li.sessionDate || '')}</td>
            <td class="mono">${escapeHtml(String(li.paidMinutes))}</td>
            <td class="mono">${escapeHtml(String(li.overtimeMinutes))}</td>
            <td class="mono">${escapeHtml(multText)}</td>
            <td class="mono">${escapeHtml(formatMoney(li.basePay))}</td>
            <td class="mono">${escapeHtml(formatMoney(li.overtimePay))}</td>
            <td class="mono">${escapeHtml(formatMoney(li.sessionPay))}</td>
            <td class="mono" style="font-weight:900;">${escapeHtml(formatMoney(li.totalPay))}</td>
          </tr>
        `;
      })
      .join('');
  }

  function populatePayRunSelect() {
    const runs = loadPayRuns();

    elPayRunSelect.innerHTML = '<option value="">(new draft)</option>';
    runs.forEach((r) => {
      const opt = document.createElement('option');
      opt.value = r.id;
      const label = `${r.id} • ${r.periodStart}→${r.periodEnd} • ${r.status}`;
      opt.textContent = label;
      elPayRunSelect.appendChild(opt);
    });
  }

  function loadSelectedPayRun() {
    const id = elPayRunSelect.value;
    if (!id) {
      renderPayRun(null);
      return;
    }
    const runs = loadPayRuns();
    const run = runs.find((r) => r && r.id === id) || null;
    renderPayRun(run);
  }

  function finalizeCurrentPayRun() {
    if (!currentPayRun) {
      alert('No pay run loaded. Build a draft first.');
      return;
    }

    if (currentPayRun.status !== 'draft') {
      alert(`Pay run is already ${currentPayRun.status}.`);
      return;
    }

    if (!confirm('Finalize this pay run? This will lock included time entries.')) return;

    // Lock time entries
    const entries = Store.loadTimeEntries();
    const lockedSet = new Set((currentPayRun.lockedTimeEntryIds || []).map(String));

    let changed = false;
    const updated = entries.map((e) => {
      if (!e) return e;
      if (!lockedSet.has(String(e.id))) return e;
      if (String(e.status).toLowerCase() === 'locked') return e;
      changed = true;
      return { ...e, status: 'locked', updatedAt: nowIso() };
    });

    if (changed) Store.saveTimeEntries(updated);

    const finalized = {
      ...currentPayRun,
      status: 'finalized',
      finalizedAt: nowIso(),
      finalizedBy: 'MANAGER',
    };

    upsertPayRun(finalized);
    populatePayRunSelect();
    elPayRunSelect.value = finalized.id;
    renderPayRun(finalized);

    alert('Pay run finalized and time entries locked.');
  }

  function csvEscape(val) {
    const s = String(val ?? '');
    if (/[\n\r,\"]/g.test(s)) return `"${s.replace(/\"/g, '""')}"`;
    return s;
  }

  function downloadCsv(filename, csv) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportCurrentPayRunCsv() {
    if (!currentPayRun) {
      alert('No pay run loaded.');
      return;
    }

    const summaryHeader = ['PayRunId', 'PeriodStart', 'PeriodEnd', 'Status', 'StaffId', 'StaffName', 'PayType', 'Hours', 'OvertimeHours', 'Sessions', 'Gross'];
    const summaryRows = (currentPayRun.staffTotals || []).map((s) => [
      currentPayRun.id,
      currentPayRun.periodStart,
      currentPayRun.periodEnd,
      currentPayRun.status,
      s.staffId,
      s.staffName,
      s.payType,
      minutesToHours(s.hoursMinutes).toFixed(2),
      minutesToHours(s.overtimeMinutes).toFixed(2),
      String(s.sessions),
      (Number(s.gross) || 0).toFixed(2),
    ]);

    const detailsHeader = [
      'PayRunId',
      'PeriodStart',
      'PeriodEnd',
      'TimeEntryId',
      'SessionId',
      'SessionDate',
      'SessionType',
      'StaffId',
      'StaffName',
      'PayProfileId',
      'PayType',
      'HourlyRate',
      'SessionRate',
      'PaidMinutes',
      'OvertimeMinutes',
      'MultiplierWeekend',
      'MultiplierAfterHours',
      'MultiplierPublicHoliday',
      'MultiplierTotal',
      'BasePay',
      'OvertimePay',
      'SessionPay',
      'TotalPay',
    ];

    const detailsRows = (currentPayRun.lineItems || []).map((li) => [
      currentPayRun.id,
      currentPayRun.periodStart,
      currentPayRun.periodEnd,
      li.timeEntryId,
      li.sessionId,
      li.sessionDate,
      li.sessionType,
      li.staffId,
      li.staffName,
      li.payProfileId,
      li.payType,
      String(li.hourlyRate ?? ''),
      String(li.sessionRate ?? ''),
      String(li.paidMinutes ?? ''),
      String(li.overtimeMinutes ?? ''),
      String(li.multiplierWeekend ?? ''),
      String(li.multiplierAfterHours ?? ''),
      String(li.multiplierPublicHoliday ?? ''),
      String(li.multiplierTotal ?? ''),
      (Number(li.basePay) || 0).toFixed(2),
      (Number(li.overtimePay) || 0).toFixed(2),
      (Number(li.sessionPay) || 0).toFixed(2),
      (Number(li.totalPay) || 0).toFixed(2),
    ]);

    const csvParts = [];
    csvParts.push('SUMMARY');
    csvParts.push(summaryHeader.map(csvEscape).join(','));
    summaryRows.forEach((r) => csvParts.push(r.map(csvEscape).join(',')));

    csvParts.push('');
    csvParts.push('DETAILS');
    csvParts.push(detailsHeader.map(csvEscape).join(','));
    detailsRows.forEach((r) => csvParts.push(r.map(csvEscape).join(',')));

    const csv = csvParts.join('\n');

    downloadCsv(`payrun_${currentPayRun.id}_${currentPayRun.periodStart}_to_${currentPayRun.periodEnd}.csv`, csv);

    // mark exported
    const exported = { ...currentPayRun, exportedAt: nowIso() };
    upsertPayRun(exported);
    populatePayRunSelect();
    elPayRunSelect.value = exported.id;
    renderPayRun(exported);
  }

  function initDefaultDates() {
    const now = new Date();
    // Default: current month
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    elStart.value = toYmd(start);
    elEnd.value = toYmd(end);
  }

  // Wire events
  btnBuild.addEventListener('click', () => {
    const run = buildDraftPayRun(elStart.value, elEnd.value, elInclude.value);
    if (!run) return;

    upsertPayRun(run);
    populatePayRunSelect();
    elPayRunSelect.value = run.id;
    renderPayRun(run);

    if ((run.lineItems || []).length === 0) {
      alert('Draft created but contains 0 entries. Tip: click “Seed demo data” to generate test data, or approve some entries in Timesheet Inbox/Calendar.');
    }
  });

  btnFinalize.addEventListener('click', finalizeCurrentPayRun);
  btnExport.addEventListener('click', exportCurrentPayRunCsv);

  btnRefresh.addEventListener('click', () => {
    populatePayRunSelect();
    loadSelectedPayRun();
  });

  elPayRunSelect.addEventListener('change', loadSelectedPayRun);

  btnSeedDemo?.addEventListener('click', seedDemoData);
  btnSeedDemoInline?.addEventListener('click', seedDemoData);
  btnSeedDemoEmpty?.addEventListener('click', seedDemoData);

  // Init
  ensureDefaultPayProfiles();
  populatePayRunSelect();
  initDefaultDates();
  renderPayRun(null);
})();

