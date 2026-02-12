# Job + Scheduling & Assignment: End-to-End Sequence

This sequence combines job creation (from quote or manual), scheduling and assignment, execution updates, and billing closure into one system-centric view.

```mermaid
sequenceDiagram
  autonumber
  participant Admin as Franchisee Admin
  participant System as Platform (Jobs & Scheduling)
  participant Calendar as Calendars (Teams/Staff)
  participant Routing as Routing/Travel
  participant Staff as Assigned Staff
  participant Customer
  participant Billing as Billing/Payments

  Note over Admin,System: CREATE JOB
  alt From Approved Quote
    Customer->>Admin: Approves Quote
    Admin->>System: Convert Quote to Job
    System->>Admin: Job ID issued; Status=Scheduled (default)
  else Manual Create
    Admin->>System: Create Job (customer, scope, price, priority)
    System->>Admin: Job ID issued; Status=Scheduled (default)
  end

  Note over Admin,System: AUTO-SCHEDULE & ASSIGN WITH CONFIRMATION
  System->>System: Pre-compute schedule candidates (skills, load, travel, priority)
  System->>Calendar: Check availability & conflicts
  opt Travel Scoring
    System->>Routing: Get travel time/distance
    Routing-->>System: Travel metrics
  end
  System->>System: Propose best schedule & assignment
  System-->>Admin: Show proposed date/time and assignee(s) for confirmation
  alt Admin Confirms
    Admin->>System: Confirm proposal
    System->>Calendar: Block slot and persist assignment
    System->>Staff: Notify assignment
    System->>Admin: Scheduled/assigned confirmed
  else Admin Modifies
    Admin->>System: Edit date/time and/or assignee
    System->>Calendar: Re-validate; block new slot
    System->>Staff: Notify updated assignment
    System->>Admin: Scheduled/assigned updated
  end

  Note over Admin,System: READ & UPDATE
  Admin->>System: View Job List
  Admin->>System: Open Job Detail
  opt Reschedule
    Admin->>System: Update schedule
    System->>Calendar: Re-block slot
    System->>Staff: Notify schedule change
    System->>Admin: Confirmation
  end
  opt Reassign
    Admin->>System: Change team/members
    System->>Calendar: Update assignment
    System->>Staff: Notify assignees
    System->>Admin: Confirmation
  end
  opt Edit Fields
    Admin->>System: Update location/notes/priority
    System-->>Admin: Saved
  end
  opt Change Scope
    Admin->>System: Update items/prices
    System->>Customer: Send update / request approval
    Customer->>Admin: Approve/Decline
    Admin->>System: Record decision
  end

  Note over Staff,System: EXECUTION
  Staff->>System: Start Job - Status=In Progress
  Staff->>System: Add notes/photos
  opt Additional Work discovered
    Staff->>Admin: Request change (details/photos)
    Admin->>System: Create Change Order (add/deduct)
    System-->>Admin: CO draft (items/totals/tax)
    Admin->>Customer: Send CO for approval
    alt Customer Approves CO
      Admin->>System: Record approval
      System->>System: Apply CO to Job (update items & totals)
      Note right of System: If deposit/progress billed\nissue credit memo for deduct CO
      Admin->>Staff: Confirm to proceed
    else Customer Declines CO
      Admin->>System: Mark CO declined (no scope change)
    end
  end
  Staff->>System: Mark Job Completed - Status=Completed

  Note over System,Billing: INVOICE & PAYMENT
  System->>Billing: Generate invoice
  Billing->>Customer: Send invoice/link
  alt Payment Received
    Customer->>Billing: Pay invoice
    Billing->>System: Confirm payment
    System->>Admin: Status=Paid; Close job
  else Overdue
    System->>Admin: Overdue alert
    Admin->>Customer: Send reminder
    Customer->>Billing: Pay invoice
  end

  Note over Admin,System: CANCEL
  opt Cancel Job
    Admin->>System: Set Status=Cancelled
    System->>Calendar: Release reserved slot
    System->>Staff: Notify cancellation
    System->>Admin: Job locked read-only
  end
```
