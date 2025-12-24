# Timesheet + Payroll (Manager) — Implementation Plan (service_job_v3)

## Objectives
- Build manager tooling to **capture staff time**, **approve timesheets**, and **run payroll** for **learning service sessions**.
- Support **multiple staff per session** (co-teaching) with **separate pay** per staff.
- Support pay configurations:
  - **Hourly**
  - **Per-session**
  - **Mixed (hourly + session bonuses)**
- Support policy rules:
  - **Overtime: daily only**
  - **Multipliers**: weekend, after-hours, public holiday (configurable)
- **Important constraint**: time entry capture should be in a **new calendar view** (do **not** reuse `@[v2] Jobs/service_job_v3/schedule_calendar.html` UI).

## Current context in repo
- Sessions live in `localStorage.fms_sessions` (service_job_v3).
- Learning services live in `localStorage.fms_learning_services`.
- `Timesheet_manager/*` currently provides manager timesheet pages; we will extend it to an inbox + payroll runs.

---

## Manage Team integration (make `manage-team` the source of truth)

### Why we need this
Right now `manage-team/*` uses **in-file sample staff arrays** and only stores a demo snapshot (`demo_last_staff`). Meanwhile, sessions and timesheets reference staff using names/IDs (e.g., `STAFF-001`, “Daniel Davis”).  
To make Timesheet/Payroll reliable and consistent, we need a single staff registry that:
- powers scheduling staff pickers + assignments
- powers timesheet approvals + payroll rules
- avoids name mismatches across pages

### Target: `localStorage.fms_staff` as the staff source of truth
`manage-team` will become the CRUD UI for `fms_staff[]`. All Timesheet/Payroll pages will read staff from `fms_staff` (not their own hardcoded lists).

### Non-breaking migration approach (fallback to sample data if empty)
We will implement a **compatibility layer** so existing demos keep working:

- **Step A — Add a shared staff store helper**
  - New helper module (recommended): `manage-team/staff_store.js` (or a shared `common/staff_store.js`)
  - Responsibilities:
    - `loadStaff()`:
      - if `localStorage.fms_staff` exists and non-empty → return it
      - else → return existing sample staff (current behavior) *and* offer “Initialize staff store” seeding
    - `saveStaff(staffList)` → writes `localStorage.fms_staff`
    - `ensureStaffSeededFromSamples()`:
      - if `fms_staff` missing/empty → seed from current sample arrays (so UI still shows staff)

- **Step B — Migrate manage-team pages to use the helper**
  - `manage-team.html` list: read/write via `loadStaff()/saveStaff()`
  - create/edit/detail: persist changes into `fms_staff`
  - roles page (optional for MVP): keep UI as-is, but store role definitions in `localStorage` (see below)

- **Step C — ID compatibility**
  - Sessions today may contain:
    - `assignedStaff: ['Daniel Davis']` (string names)
    - `assignedStaff: [{ id:'STAFF-001', name:'Daniel Davis' }]`
    - manage-team sample uses numeric IDs (e.g. `id: 1`)
  - Migration rules:
    - Canonical staff IDs in `fms_staff` should be **string IDs** (recommended): `STAFF-001`, `STAFF-002`, ...
    - On first seeding from manage-team samples:
      - generate `STAFF-###` IDs for each staff record
      - store the old numeric ID in a field like `legacyId` for deep-link safety
    - When normalizing session assignments:
      - if assignment has `{id}` → match directly
      - else if assignment has `name` or is a string → match by normalized full name
      - if no match → create placeholder `fms_staff` record (status `inactive` or `unlinked`) so payroll is never blocked by missing staff

### Payroll add-ons in Manage Team (new fields)
Manage Team should own these fields so payroll configuration is centralized:
- **Pay profile assignment**
  - `defaultPayProfileId`
  - optional overrides:
    - `hourlyRateOverride`
    - `sessionRateOverride` / `sessionRateOverridesByType`
- **Employment/payroll metadata** (optional for MVP)
  - `employmentType`, `taxFileNumber`, `bankAccount`, etc. (can be stubbed)

### Roles & permissions integration (recommended)
Manage Team already has a roles/permissions concept in specs. To support Timesheet/Payroll, add permission keys such as:
- `timesheet.view`
- `timesheet.approve`
- `timesheet.edit_after_approval`
- `payrun.create`
- `payrun.finalize`
- `payrun.export`

Storage approach (localStorage-first):
- `localStorage.fms_roles[]` (role definitions + permission sets)
- `fms_staff[].roleId` (or `roles[]`) to link staff to permissions

### Acceptance criteria for Manage Team integration
- [x] If `fms_staff` is empty, Manage Team still shows staff (seeded from its current sample arrays).
- [x] Creating/editing/deactivating staff updates `fms_staff`.
- [ ] Timesheet/Payroll pages and session staff assignment can resolve staff **by ID or by name** using `fms_staff`. *(Phase 1/2)*

---

## Product surfaces (what the manager will use)

### 1) Time & Payroll Calendar (NEW page; separate from schedule calendar)
**Purpose**: operationally manage daily staffing time entries and payroll status on a calendar timeline.

**Core features**
- **Calendar views**: Day + Week (Month optional)
- **Event type**: session blocks; each session shows:
  - learning service name, session time
  - assigned staff count + time entry status badges (draft/submitted/approved/exception)
  - cost preview (optional)
- **Click session**: opens a **Time Entry Drawer/Modal** (manager-focused)
  - For each staff assigned to the session:
    - scheduled start/end (read-only from session)
    - actual start/end
    - break minutes
    - paid minutes (computed, overrideable)
    - notes
    - status: draft/submitted/approved/declined/locked
    - exceptions list (missing end, negative duration, overtime trigger, etc.)
  - Manager actions:
    - approve/decline per staff entry
    - bulk approve for all staff on that session
    - add adjustment line item(s) for that session/staff

**New files**
- `Timesheet_manager/time_payroll_calendar.html`
- `Timesheet_manager/time_payroll_calendar.js`

**Why separate?**
- This view is *time/payroll-first* (approvals/exceptions/cost), unlike `schedule_calendar.html` which is *scheduling-first* (create/edit sessions, enroll attendees).

---

### 2) Timesheet Inbox (NEW page)
**Purpose**: manager queue for approvals + exceptions across all staff/sessions.

**Core features**
- Filters: date range, staff, approval status, exception type, learning service, session type
- Default view: “Needs action”
  - Submitted entries awaiting approval
  - Entries with exceptions
- Bulk actions:
  - approve selected
  - decline selected (requires reason)
  - set approved minutes (bulk or per row)
- Row actions:
  - open session in Time & Payroll Calendar (deep link to session)
  - open session detail (`service_job_v3/session_detail.html?id=...`) (optional)

**New files**
- `Timesheet_manager/timesheet_inbox.html`
- `Timesheet_manager/timesheet_inbox.js`

---

### 3) Pay Run Builder (NEW page)
**Purpose**: build a payroll snapshot for a pay period, finalize it, and export.

**Core features**
- Select pay period:
  - weekly / fortnightly / monthly / custom range (configurable)
- Preview pay run:
  - totals per staff (hours, session counts, allowances, overtime, gross pay)
  - drill-down to line items: per session per staff
- Add payroll adjustments:
  - allowances (travel, materials)
  - deductions (advance, corrections)
  - notes + audit
- Finalize pay run:
  - locks included time entries (no edits without “reopen”)
- Export:
  - CSV export (pay run summary + details tabs)
  - later: Xero/MYOB/QuickBooks formats

**New files**
- `Timesheet_manager/pay_run_builder.html`
- `Timesheet_manager/pay_run_builder.js`

---

## Data model (localStorage) — designed for all configurations

### Source of truth: sessions (existing)
- `fms_sessions[]` (existing)
  - `id`, `date`, `startTime`, `endTime`, `duration`, `learningServiceId`, `learningServiceName`
  - `assignedStaff`: may be `string[]` or `{id,name}[]` today

### 1) Staff registry (NEW)
- `fms_staff[]`
  - `id`, `name`, `role`, `status`
  - `defaultPayProfileId`
  - optional overrides: `hourlyRateOverride`, `sessionRateOverride`

**Migration rule**
- Normalize `assignedStaff` on read:
  - strings are mapped to staff by name if possible, otherwise create placeholder staff record.

### 2) Pay profiles (NEW) — supports hourly/per-session/mixed
- `fms_pay_profiles[]`
  - `id`, `name`
  - `payType`: `hourly | per_session | mixed`
  - `hourlyRate`
  - `sessionRates`:
    - `flatSessionRate` (optional)
    - `bySessionType`: `{ Class, Group, "One-to-One" }` (optional)
  - `multipliers`:
    - weekend: `1.0..`
    - afterHours: `{ start: "18:00", end: "06:00", multiplier: 1.25 }`
    - publicHoliday: `1.5`
  - `overtimeDaily`:
    - `enabled: true`
    - `thresholdHours: 8`
    - `multiplier: 1.5`

### 3) Time entries (NEW) — one per (sessionId, staffId)
- `fms_time_entries[]`
  - `id`
  - `sessionId`, `staffId`
  - `scheduledStart`, `scheduledEnd` (copied from session)
  - `actualStart`, `actualEnd`, `breakMinutes`
  - computed:
    - `workedMinutes`
    - `paidMinutes`
    - `overtimeMinutesDaily`
  - manager overrides:
    - `managerApprovedMinutes` (optional)
    - `managerNote` (optional)
  - `status`: `draft | submitted | approved | declined | locked`
  - `exceptions[]`: e.g. `missing_end`, `negative_duration`, `overlap`, `overtime_daily`
  - audit:
    - `createdAt`, `updatedAt`
    - `history[]`: `{ at, by, action, diff, note }`

**Generation rules**
- When a session is loaded into Time & Payroll Calendar:
  - ensure a time entry exists for each assigned staff
  - default `actualStart/End` empty
  - allow quick “copy scheduled → actual”

### 4) Pay period configuration (NEW)
- `fms_pay_period_config`
  - `frequency`: `weekly | fortnightly | monthly | custom`
  - `weekStartDay`: `Mon..Sun` (if weekly/fortnightly)

### 5) Pay runs (NEW)
- `fms_pay_runs[]`
  - `id`, `periodStart`, `periodEnd`
  - `status`: `draft | finalized | exported`
  - `createdAt`, `finalizedAt`, `finalizedBy`
  - `lineItems[]`:
    - per staff per time entry: hours, session pay, multipliers, overtime, adjustments
  - `staffTotals[]`
  - `lockedTimeEntryIds[]`

---

## Business logic (calculations & rules)

### Time calculations
- `workedMinutes = max(0, actualEnd - actualStart - breakMinutes)`
- `paidMinutes = managerApprovedMinutes ?? workedMinutes`
- If actual times missing, entry is an **exception** and cannot be finalized for payroll.

### Daily overtime (only)
- Determine daily totals per staff across sessions (within a day):
  - overtime minutes = max(0, totalPaidMinutesThatDay - threshold)
- Allocate overtime minutes deterministically:
  - simplest: allocate overtime to the **last sessions of the day** (by end time descending)
  - store allocation in each time entry: `overtimeMinutesDaily`

### Multipliers
- Weekend multiplier: if session date is Sat/Sun
- After-hours multiplier: if time window overlaps configured after-hours range
- Public holiday multiplier: based on `fms_holidays[]` (optional future), or manual toggle on session/time entry for MVP

### Pay computation (per staff per time entry)
- **Hourly**:
  - basePay = (paidMinutes - overtimeMinutes) × hourlyRate × multipliers
  - overtimePay = overtimeMinutes × hourlyRate × overtimeMultiplier × multipliers
- **Per-session**:
  - sessionPay = sessionRate(sessionType) × multipliers
  - (optional) overtime still possible if policy says so; if not, overtime ignored for per-session staff
- **Mixed**:
  - hourly component + session bonus component

**Config precedence**
- Staff override rate > pay profile rate.

---

## Permissions & locking
- Draft/submitted can be edited by staff (future) and manager.
- Approved/declined editable by manager only (until pay run finalization).
- Finalized pay run locks entries (`status=locked`) — edits require “reopen pay run” (future).

---

## Phased rollout (implementation steps)

### Phase 0 — Make Manage Team the source of truth (required)
- [x] Implement `fms_staff` storage + migration helper (fallback to sample staff when empty).  
  - Implemented in `manage-team/staff_store.js`: seeds sample staff → `localStorage.fms_staff` with canonical IDs `STAFF-###` + `legacyId` compatibility.
- [x] Update `manage-team/*` pages to read/write `fms_staff` (non-breaking).  
  - Updated: `manage-team.html` (list), `manage-team-create.html`, `manage-team-edit.html`, `manage-team-detail.html` + their scripts.
- [x] Add payroll-related staff fields (pay profile assignment + rate overrides).  
  - Stored fields: `defaultPayProfileId` (placeholder), `hourlyRateOverride` (from Pay Rate UI).
- [ ] Add roles/permissions storage (optional for MVP but recommended). (not implemented yet)

**Deliverable**
- [x] `manage-team/staff_store.js` (or shared store module) + updated manage-team scripts. *(done: 2025-12-18)*

### Phase 1 — Foundations (data + normalization)
- [x] Implement `fms_staff`, `fms_pay_profiles`, `fms_time_entries` storage helpers.  
  - Implemented: `Timesheet_manager/payroll_store.js` (module: `window.FMSPayrollStore`).
- [x] Implement session staff normalization (string → `{id,name}`).  
  - Implemented: `FMSPayrollStore.normalizeSessionAssignedStaff(session)` (+ placeholder staff creation when missing).
- [x] Implement `ensureTimeEntriesForSession(session)` and exception detection.  
  - Implemented: `FMSPayrollStore.ensureTimeEntriesForSession(session)` + basic exception flags + computed minutes.

**Deliverable**
- [x] A small `Timesheet_manager/payroll_store.js` module (or duplicated helpers per page) that reads/writes these stores reliably. *(done: 2025-12-18)*

### Phase 2 — Time & Payroll Calendar (new)
- [x] Build new calendar UI showing sessions + status badges.  
  - Implemented: `Timesheet_manager/time_payroll_calendar.html` + `Timesheet_manager/time_payroll_calendar.js`
- [x] Time Entry drawer/modal:
  - [x] create/edit time entries per staff
  - [x] bulk approve for session
  - [x] show exceptions

**Deliverable**
- [x] `time_payroll_calendar.html/js` in `Timesheet_manager` *(done: 2025-12-18)*

### Phase 3 — Timesheet Inbox
- [x] Build inbox list view over `fms_time_entries`  
  - Implemented: `Timesheet_manager/timesheet_inbox.html` + `Timesheet_manager/timesheet_inbox.js`
- [x] Filters + bulk approve/decline + manager approved minutes
- [x] Deep link back to calendar session modal (`time_payroll_calendar.html?sessionId=...`)

**Deliverable**
- [x] `timesheet_inbox.html/js` in `Timesheet_manager` *(done: 2025-12-18)*

### Phase 4 — Pay run builder (draft + finalize + export)
- [x] Implement pay period selection UI.
- [x] Build draft run from **approved** time entries.
- [x] Calculate totals using pay profiles (hourly/per-session/mixed), daily overtime, multipliers.
- [x] Finalize pay run (snapshot + lock time entries).
- [x] Export CSV.

**Deliverable**
- [x] `pay_run_builder.html/js` in `Timesheet_manager` *(done: 2025-12-18)*

### Phase 5 — Configuration UI (optional but recommended)
- [x] Staff pay profile assignment page  
  - Implemented: `Timesheet_manager/staff_pay_profiles.html` + `Timesheet_manager/staff_pay_profiles.js`
- [x] Pay profiles CRUD (rates, multipliers, overtime)  
  - Implemented: `Timesheet_manager/pay_profiles.html` + `Timesheet_manager/pay_profiles.js`
- [x] Holiday list editor (for public holiday multiplier)  
  - Implemented: `Timesheet_manager/holidays.html` + `Timesheet_manager/holidays.js` (store: `localStorage.fms_holidays[]`)

---

## MVP acceptance criteria
- Manager can open **Time & Payroll Calendar**, click a session, and record actual start/end + breaks for **each staff**.
- Manager can use **Timesheet Inbox** to approve/decline time entries in bulk and handle exceptions.
- Manager can create a **Pay Run** for a period, review totals, **finalize**, and **export CSV**.
- Supports **hourly / per-session / mixed** via pay profiles, with **daily overtime** and **weekend/after-hours/public holiday** multipliers.


