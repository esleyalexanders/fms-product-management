# Job, Scheduling & Assignment – Clarifying Questions (No Client Portal)

These questions help finalize the functional flow where admin communicates with customers via phone/email only.

## Job Creation
- What are all sources of jobs (approved quote only, manual too)?
- Should initial status be “Created (Unscheduled)” until admin confirms schedule/assignment?
- Must every job have a linked quote ID, or can it be null?

### Assumptions
- Jobs can be created from approved quotes and manually (both supported).
- Initial status is Created (Unscheduled) until admin confirms schedule/assignment.
- Linking to a quote is required for quote-originated jobs; optional (null) for manual jobs.

## Statuses & Transitions
- Confirm allowed statuses and transitions (Created → Scheduled → In Progress → On Hold → Completed → Invoiced → Paid; Cancelled at guarded points).
- Any guardrails (e.g., cannot cancel after “In Progress” without a required reason)?
- When does “Scheduled” become effective—only on admin confirmation?

### Assumptions
- Use the defined state model; no backward transitions (e.g., not Completed → In Progress).
- Cancel from In Progress/On Hold requires a reason and supervisor permission.
- “Scheduled” becomes effective only after admin confirm/modify of the proposal.

## Scheduling Policy
- Do we schedule to a fixed start time or a time window?
- Business hours, blackout dates, overtime rules?
- How is duration determined (from pricebook/quote vs editable estimate)?

### Assumptions
- Use fixed start time initially; time windows are a future enhancement.
- Business hours 08:00–18:00, Mon–Sat; Sundays blocked by default (configurable later).
- Default duration from pricebook/quote; admin may edit before scheduling.

## Assignment Rules
- Assign to team, individual, or both? Multi-team allowed for a single job?
- Required skills/certifications and how we model skill-to-job matching?
- Max concurrent jobs per person; travel time buffers between jobs?

### Assumptions
- Assign to a team and specific members; one team per timeslot. Multi-day work uses split jobs/segments.
- Skills are modeled as tags; candidate must satisfy all required skill tags.
- One concurrent job per member; enforce 30-minute travel buffer by default.

## Auto‑Proposal
- Scoring criteria (skills, availability, travel/route, priority, load balancing)?
- Is admin required to confirm every proposal, or auto‑accept for low‑risk jobs?
- If no candidate found, should the job go to an “Unassigned Queue” with suggestions?

### Assumptions
- Scoring: skills (hard filter), then weighted: travel 30%, job priority 30%, load 20%, availability fit 20%.
- Admin must confirm every proposal (no auto-accept in v1).
- If none found, place into Unassigned Queue and show top 3 suggested alternatives.

## Admin Confirmation Workflow
- What must be captured on confirmation (date/time, team, members, notes)?
- Do we log who confirmed, timestamp, and preserve the original proposal for audit?

### Assumptions
- Capture date, time, team, members, and an optional note.
- Log confirmer user, timestamp, and store a snapshot of the proposed plan for audit.

## Reschedule/Reassign
- SLAs/cutoffs for changing schedule (e.g., within 24h requires approval)?
- Notify staff on every change? Which channels (email/SMS/WhatsApp)?
- Do we notify customers, or does admin handle it manually outside the system?

### Assumptions
- Changes <24h before start require supervisor approval; otherwise admin can proceed.
- Always notify staff via email; WhatsApp/SMS can be manual for now (templated emails provided).
- Customer notifications are handled by admin externally; system logs an admin note.

## Customer Communication (No Portal)
- How do we record customer approvals/consents (email thread upload, call log, checkbox “verbal approval received”)?
- Do we need templates for emails (proposal, change order, schedule change)?

### Assumptions
- Record approvals by attaching email/thread or logging a call with name/time; allow a “verbal approval received” checkbox plus note.
- Provide basic email templates for proposal, change order, and schedule change.

## Change Orders (Add & Deduct)
- Thresholds requiring CO vs quick admin note (e.g., > $X or scope type change)?
- For deductive CO, do we issue credit memos if deposits/progress billed; refund rules?
- Approval evidence required (name, time, method, attachments)?

### Assumptions
- Require a CO when delta > $100 or scope-type changes; else an admin note is sufficient.
- Deductive CO creates a credit memo applied to next invoice; refunds are manual (finance policy).
- Store approval evidence (name, timestamp, method) and allow attachments (email/pdf).

## Time & Materials (T&M)
- Allow T&M add‑ons? Pre‑authorized cap per job/day?
- Rates from pricebook; different rates by skill/after hours?

### Assumptions
- Allow T&M with a pre-authorized cap of $300 per job/day (configurable).
- Rates from pricebook; after-hours multiplier 1.5×; skill-specific rates supported.

## Data Model & Audit
- Store both proposed and confirmed schedule/assignees?
- Audit trail for schedule/assignment changes and reasons?

### Assumptions
- Store both proposal and final confirmation fields on the job.
- Maintain an immutable audit trail for schedule/assignment changes, including reason and actor.

## Constraints
- Travel time source (none now; add Google/API later)?
- Mandatory rest buffers; maximum daily hours; territory limits?

### Assumptions
- Use a simple internal travel time estimate for v1; plan Google Maps integration later.
- Enforce 15-minute rest buffers and 8-hour max scheduled work per member per day; restrict assignments to franchise territory.

## Permissions
- Who can confirm proposals, reschedule, reassign, or cancel? Any approval tiers?

### Assumptions
- Admin can confirm proposals, reschedule, and reassign.
- Supervisor approval required for cancellation in In Progress/On Hold and for <24h reschedules.

## Reporting
- Required KPIs: scheduled vs created lead time, utilization, on‑time start, reschedule rate, unassigned backlog.

### Assumptions
- Provide dashboard widgets for all listed KPIs with filters by team/date range.

## Edge Cases
- Partial assignment (multi‑day jobs, split across teams)?
- On Hold behavior (timer pause? effect on routing)?
- No‑show or site access issues—status and follow‑up flow?

### Assumptions
- Use split jobs/segments for multi-day or multi-team scenarios.
- On Hold pauses job timers and removes the stop from optimized route until resumed.
- No-show/access issue moves job to On Hold with reason; admin reschedules or cancels per policy.
