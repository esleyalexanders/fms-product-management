# User Stories / Backlog

This document contains Epics → Features → User Stories derived from `As_is.md`, `quote_process.md` and `to_be.md`.

---

## Epic 1 — Quote Management (Lead → Quote → Approval)

**Feature 1.1 — Pricebook & Line Items**

- **Q1.1.1 — Create pricebook entries**
  - As a franchisor admin, I want to create and manage pricebook service items (codes, descriptions, unit, base price, tax treatment) so franchisees can build quotes from canonical items.
  - Acceptance criteria:
    - Admin UI to add/edit/remove pricebook items with fields: code, name, description, unit, base price, tax, optional images.
    - Items are versioned (audit log).
    - Pricebook entries are searchable by name/code.
  - Priority: High; Size: M (3–5 points)

- **Q1.1.2 — Support pricing rules & markups**
  - As a franchisor admin, I want to define markups and price overrides (by franchise or region) so final pricing respects business rules.
  - Acceptance: Pricing rule engine applies markup percentage or fixed markup per franchise; UI to set overrides; preview shows final price.
  - Priority: Medium; Size: L (8)

**Feature 1.2 — Quote Creation & Versioning**

- **Q1.2.1 — Create quote from pricebook**
  - As a franchisee, I want to create a quote using pricebook items so I can produce consistent proposals.
  - Acceptance:
    - New Quote UI allows selecting pricebook items, adding custom lines, quantities, discounts, deposit flag.
    - Quote total calculates line totals, tax, and deposit requirements.
    - Quote saved with unique id and timestamp.
  - Priority: High; Size: M (5)

- **Q1.2.2 — Quote versioning & audit**
  - As a franchisee, I want to create revisions of a quote and keep history so we can track changes and which version was approved.
  - Acceptance: Each edit can create a new version with previous version preserved; UI shows version history and who changed it.
  - Priority: High; Size: M (3)

- **Q1.2.3 — Quote template & branding**
  - As a franchisee, I want to generate a branded quote (PDF/HTML) with logo and company details so customers receive professional documents.
  - Acceptance: Exportable quote with logo, franchise details, formatted lines, and deposit/pay instructions; sample PDF export works.
  - Priority: Medium; Size: M (5)

**Feature 1.3 — Quote Delivery & Approval (Franchise-mediated)**

- **Q1.3.1 — Record manual delivery and approval**
  - As a franchisee, I want to send a quote via email/phone and record the customer's response in the system so approval is auditable.
  - Acceptance:
    - UI to mark quote as "Sent" with channel (email/phone), timestamp, and optional notes.
    - UI to record customer approval (approve/reject/request changes) with timestamp and recorder.
  - Priority: High; Size: S (2)

- **Q1.3.2 — Automated reminders for unresponded quotes**
  - As a franchisee, I want the system to remind me to follow up on quotes with no response after configurable intervals so leads don't go cold.
  - Acceptance:
    - Worker sends reminders (or creates a task) after configurable days; reminders appear in franchisee tasks list.
  - Priority: Medium; Size: M (3)


## Epic 2 — Scheduling & Dispatch

**Feature 2.1 — Convert Quote -> Work Order**

- **S2.1.1 — Create work order from approved quote**
  - As a scheduler, I want to convert an approved quote to a work order with customer details and line-items so dispatch can plan the job.
  - Acceptance: Work order contains fields copied from quote; status set to "Scheduled/Unscheduled"; link back to quote; shows required tools/skills.
  - Priority: High; Size: S (2)

**Feature 2.2 — Scheduling & Assignment UI**

- **S2.2.1 — Calendar & quick schedule**
  - As a scheduler, I want a calendar view to place jobs on dates/times and assign technicians so work is distributed evenly.
  - Acceptance: Drag/drop to schedule; assignment updates work order; conflict detection (double-booking) warns user.
  - Priority: High; Size: L (8)

- **S2.2.2 — Route optimization option**
  - As an operations manager, I want to generate optimized routes for techs for a day so travel time is minimized.
  - Acceptance: Route generation algorithm suggests visit order and total travel time; outputable route for tech.
  - Priority: Low; Size: L (8)


## Epic 3 — Field Execution (Mobile App)

**Feature 3.1 — Mobile Job Execution**

- **F3.1.1 — Technician job details & checklists**
  - As a technician, I want to view job details, checklists, and required equipment on my mobile so I can execute the job to spec.
  - Acceptance: Mobile view shows job info, tasks checklist; tasks must be completed before marking job complete (configurable).
  - Priority: High; Size: M (5)

- **F3.1.2 — Record photo & signature proof**
  - As a technician, I want to capture before/after photos and obtain customer signature so proof-of-service is stored.
  - Acceptance: Uploads saved to job record; files visible in web UI; timestamped and attached to invoice if needed.
  - Priority: High; Size: M (5)

- **F3.1.3 — Create on-site change order / quote**
  - As a technician, I want to create a small change order or on-site quote when scope changes so the franchisee can request approval and bill accordingly.
  - Acceptance: Ability to add lines, send to franchisee/sales for approval, and link to original job/quote.
  - Priority: Medium; Size: M (5)


## Epic 4 — Invoicing & Payments

**Feature 4.1 — Invoice Generation**

- **I4.1.1 — Auto-generate invoice from job**
  - As billing admin, I want invoices generated from job/quote data so customers are billed correctly.
  - Acceptance: Invoice shows job lines, taxes, totals; invoice id generated; invoice status = Pending; link to job and quote.
  - Priority: High; Size: S (2)

- **I4.1.2 — Invoice email & download**
  - As billing admin, I want invoices emailed to customers and downloadable (PDF/HTML) so records are accessible.
  - Acceptance: Email sent with invoice link or attachment; invoice downloadable; sample invoice download tested (works).
  - Priority: High; Size: S (3)

**Feature 4.2 — Payments & Dunning**

- **I4.2.1 — Integrate payment gateway and record payments**
  - As billing admin, I want to accept card/ACH payments and record gateway responses so payments reconcile.
  - Acceptance: Payment attempted via gateway; webhook updates payment status; payment record stored with txn id and status.
  - Priority: High; Size: L (8)

- **I4.2.2 — Automated dunning & escalation**
  - As billing admin, I want overdue invoices to get dunning emails and eventual escalation to franchisor for collection so receivables are managed.
  - Acceptance: Configurable dunning schedule triggers emails and optionally escalates to franchisor dashboard after N days.
  - Priority: Medium; Size: M (5)


## Epic 5 — Reporting, Royalty & Franchisor Controls

**Feature 5.1 — Royalty Calculation & Reports**

- **R5.1.1 — Calculate royalties from paid invoices**
  - As a franchisor finance user, I want royalties calculated from paid invoices according to predefined rules so monthly fees are accurate.
  - Acceptance: Input rules (percentage, tiers, min fee); batch job computes royalties for period; report exports (CSV/PDF) available.
  - Priority: High; Size: L (8)

- **R5.1.2 — Aggregated KPIs dashboard**
  - As franchisor admin, I want to see aggregated KPIs (quote conversion, DSO, paid invoices, CSAT) so I can monitor health across the network.
  - Acceptance: Dashboard shows filterable KPIs and date ranges; data pulls from invoices, jobs, surveys.
  - Priority: High; Size: M (5)

**Feature 5.2 — Centralized Admin Controls**

- **R5.2.1 — Pricebook & templates central control**
  - As franchisor admin, I want to push pricebook updates and templates to franchisees so standards remain consistent.
  - Acceptance: Push mechanism or publish/unpublish model; franchisee receives notifications of changes; version history exists.
  - Priority: High; Size: M (5)


## Epic 6 — Notifications, Tasks & Workflows

**Feature 6.1 — Tasks & Reminders**

- **N6.1.1 — Automated follow-up tasks for unresponded quotes**
  - As a franchisee, I want follow-up tasks to be created automatically for quotes with no response so I can call/email the customer.
  - Acceptance: Tasks created after configurable delay; tasks show quote link, contact info, and suggested script.
  - Priority: Medium; Size: S (2)

**Feature 6.2 — Alerts for failed payments / exceptions**

- **N6.2.1 — Alerts for payment failures and disputes**
  - As billing admin, I want alerts when payments fail or disputes occur so we can act quickly.
  - Acceptance: Alerts appear in billing queue; webhook failures surfaced; tickets created for manual handling.
  - Priority: High; Size: M (3)


## Epic 7 — Field App Offline & Sync Resilience

**Feature 7.1 — Offline queue & conflict resolution**

- **O7.1.1 — Local queue and idempotent sync**
  - As a technician, I want job updates saved locally when offline and synced when online so work isn't blocked.
  - Acceptance: Local storage of job changes, retry logic, idempotent APIs (idempotency keys), and conflict resolution UI for duplicates.
  - Priority: High; Size: L (8)

- **O7.1.2 — Media upload resilience**
  - As a technician, I want photos to be uploaded reliably even on flaky networks so proof-of-service is preserved.
  - Acceptance: Background upload, resumable uploads, upload status shown, retries on failure.
  - Priority: Medium; Size: M (5)


## Epic 8 — Security & Audit

**Feature 8.1 — Audit logging & role-based access**

- **Sec8.1.1 — RBAC and audit logs**
  - As an auditor, I want role-based access control and immutable audit logs so I can verify who changed invoices or quotes.
  - Acceptance: Roles (Franchisor Admin, Franchisee Manager, Tech, Billing), logged changes with user, timestamp, previous value; logs exportable.
  - Priority: High; Size: M (5)

**Feature 8.2 — Payment data security**

- **Sec8.2.1 — PCI-compliant payment handling (use gateway)**
  - As a platform security lead, I want card data to be handled via tokenized gateway so PCI scope is minimized.
  - Acceptance: No card PAN stored; tokens used; documentation of process; gateway integration tested.
  - Priority: High; Size: L (8)


---

### Notes
- MVP recommendation: implement Epics 1, 2, 3, 4 first (Quote, Convert-to-Work, Mobile execution, Invoice / Payments).
- I can export these into CSV or create GitHub Issues for you. Which would you prefer?
