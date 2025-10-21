# To-Be: Quote-to-Cash + Field Service Flow

This document describes the proposed "To-Be" flow for the Franchise ERP system. It is based on the provided `As_is.md` and `quote_process.md` analysis and focuses on the end-to-end Quote-to-Cash process integrated with Field Service execution and Franchisor reporting.

## High-level Mermaid Flowchart

```mermaid
flowchart TD
  %% Quote-to-Cash + Field Service To-Be Flow
  A[Lead / Service Request] --> B[Create Quote - Pricebook]
  B --> C{Customer Review}
  C -->|Approve via franchise| D[Convert to Work Order]
  C -->|Request Changes via franchise| B
  C -->|No Response| R[Franchise follows up manually / Automated Reminder]
  R --> C

  D --> E[Scheduling & Dispatch]
  E --> F[Assign Technician / Create Route]
  F --> G[Technician Mobile App - On-site Execution]
  G --> H{Work Completed?}
  H -->|Yes| I[Generate Invoice]
  H -->|Partial / Rework| F
  H -->|Cancelled| K[Close Job; Issue Refund/Charge Adjustment]

  I --> J[Send Invoice - Email/SMS]
  J --> L{Payment Received?}
  L -->|Yes| M[Record Payment to Accounting; Mark Job Paid]
  L -->|No / Overdue| N[Automated Dunning / Follow-up]
  N -->|Escalate| O[Franchisor Review / Collections]
  N -->|Retry| J

  M --> P[Post-Service Survey & Warranty / Support]
  P --> Q[Analytics & Reporting; Royalty Calculation]
  Q --> S[Franchisor Dashboard - aggregated KPIs]

  style R fill:#f9f,stroke:#333
  style N fill:#fff3cd,stroke:#333
  style O fill:#f8d7da,stroke:#333
```

## Swimlane (Actors & Responsibilities)

```mermaid
sequenceDiagram
  participant Customer
  participant Sales as Franchisee Sales
  participant System as Platform (API/Services)
  participant Scheduler
  participant Tech as Technician (Mobile App)
  participant Billing as Payment Gateway & Accounting
  participant Franchisor

  Customer->>Sales: Request service / Discuss requirements
  Sales->>System: Create Quote (use Pricebook)
  Sales->>Customer: Send Quote via Email or Phone
  Customer->>Sales: Approve or request changes (via phone/email)
  Sales->>System: Record approval -> Convert to Work Order
  Scheduler->>Tech: Assign job & route
  Tech->>System: Update job status / upload proof (photos, signature)
  System->>Billing: Generate Invoice and send to Customer
  Customer->>Billing: Pay invoice
  Billing->>System: Confirm payment -> mark invoice paid
  System->>Franchisor: Aggregate transactions -> royalties report
  System->>Customer: Post-service survey & support flow
```

## Key Data Objects
- Pricebook / Service Catalog
- Quote / Proposal (versions allowed)
- Work Order / Job
- Invoice & Payment Record
- Proof-of-Service (photos/signature/checklist)
 - Customer Account (contact record; no client portal)
- Franchisee Account & Royalty records

## Decision Points
- Customer Review: Approve / Request Changes / No Response
- Deposit required? (configured per pricebook item)
- Scheduling logic: immediate vs queued vs manual
- Work result: complete / partial / cancelled
- Invoice payment: success / failure / dispute

## Edge Cases
1. Partial completion -> create Change Order and re-quote on-site.
2. Offline technician -> local queue + idempotent sync.
3. Payment dispute -> attach proof-of-service, start dispute workflow, withhold royalty until resolved.
4. Duplicate quote edits -> optimistic locking and merge/refresh UI.
5. Long-running jobs -> support progress invoicing.

## Success Criteria
- Quote -> Approved -> Job Completed -> Invoice Paid (SLA: e.g., 7 days)
- Payment capture rate > 98%
- Average schedule time < 48 hours
- Royalty calculation accuracy = 100%

## Next Steps
- Export Mermaid to PNG/SVG for inclusion in docs.
- Produce an OpenAPI skeleton for key endpoints (quotes, work-orders, invoices, payments).
- Design email/SMS templates and standard operating procedures for franchise-mediated quote delivery and approval.

---

Document created from `As_is.md` and `quote_process.md` analysis on 2025-10-21.
