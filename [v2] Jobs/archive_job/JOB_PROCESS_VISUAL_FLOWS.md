# Job Process Visual Flows

## Complete Job Lifecycle Diagram

```mermaid
flowchart TD
    Start([Quote Approved]) --> CreateJob[Admin: Convert Quote to Job]
    CreateJob --> JobCreated[Job Created<br/>Status: Scheduled<br/>Job ID: J-YYYY-NNN]
    
    JobCreated --> AutoSchedule[System: Propose Schedule & Assignment]
    AutoSchedule --> AdminReview{Admin Reviews Proposal}
    
    AdminReview -->|Confirm| ScheduleConfirmed[Schedule Confirmed<br/>Calendar Blocked<br/>Staff Notified]
    AdminReview -->|Modify| ManualSchedule[Admin: Manual Schedule/Assign]
    AdminReview -->|Skip| Unassigned[Job in Unassigned Queue]
    
    ManualSchedule --> ScheduleConfirmed
    Unassigned -.->|Later| ManualSchedule
    
    ScheduleConfirmed --> Scheduled[Status: Scheduled]
    
    Scheduled -->|Admin Reschedules| Rescheduled[Status: Rescheduled]
    Rescheduled --> Scheduled
    
    Scheduled -->|Staff Starts| InProgress[Status: In Progress<br/>Timestamp Recorded]
    
    InProgress -->|Issue Occurs| OnHold[Status: On Hold<br/>Reason Recorded]
    OnHold -->|Resume| InProgress
    
    InProgress --> WorkExecution[Staff: Perform Work<br/>Add Notes/Photos]
    
    WorkExecution --> CheckAdditional{Additional<br/>Work Needed?}
    
    CheckAdditional -->|Yes| CreateCO[Admin: Create Change Order]
    CreateCO --> SendCO[Admin: Send CO to Customer]
    SendCO --> CustomerReview{Customer<br/>Approves?}
    
    CustomerReview -->|Yes| ApplyCO[System: Apply CO<br/>Update Job Scope & Price]
    CustomerReview -->|No| DeclineCO[System: Mark CO Declined<br/>No Scope Change]
    
    ApplyCO --> InProgress
    DeclineCO --> InProgress
    
    CheckAdditional -->|No| StaffComplete[Staff: Mark Job Completed]
    
    StaffComplete --> Completed[Status: Completed<br/>Admin Notified]
    
    Completed --> QualityReview{Admin:<br/>Quality Review}
    
    QualityReview -->|Approve| Approved[Status: Approved<br/>Quality Passed]
    QualityReview -->|Rework| ReworkRequired[Status: Rework Required<br/>Issues Documented]
    
    ReworkRequired --> InProgress
    
    Approved --> GenerateInvoice[System: Auto-Generate Invoice]
    GenerateInvoice --> Invoiced[Status: Invoiced<br/>Invoice Sent to Customer]
    
    Invoiced --> PaymentCheck{Payment<br/>Received?}
    
    PaymentCheck -->|Yes| RecordPayment[Admin: Record Payment]
    PaymentCheck -->|Overdue| Overdue[Status: Overdue<br/>Reminders Sent]
    
    Overdue --> PaymentCheck
    
    RecordPayment --> Paid[Status: Paid<br/>Job Closed<br/>Quote Closed]
    
    Paid --> End([End])
    
    Scheduled -.->|Cancel| Cancelled[Status: Cancelled]
    Rescheduled -.->|Cancel| Cancelled
    InProgress -.->|Cancel| Cancelled
    OnHold -.->|Cancel| Cancelled
    
    Cancelled --> End
    
    style Start fill:#e1f5ff
    style CreateJob fill:#e1f5ff
    style Scheduled fill:#fff9c4
    style Rescheduled fill:#fff9c4
    style InProgress fill:#fff59d
    style OnHold fill:#ffe0b2
    style Completed fill:#c8e6c9
    style Approved fill:#a5d6a7
    style Invoiced fill:#e1bee7
    style Overdue fill:#ffcdd2
    style Paid fill:#81c784
    style Cancelled fill:#ef9a9a
    style End fill:#e0e0e0
```

---

## Change Order Detailed Flow

```mermaid
flowchart TD
    Start([Job In Progress]) --> Discovery[Staff: Discovers Additional Work]
    
    Discovery --> Document[Staff: Takes Photos & Notes]
    Document --> Contact[Staff: Contacts Admin<br/>via WhatsApp/In-App]
    
    Contact --> AdminReview[Admin: Reviews Request]
    AdminReview --> CreateCO[Admin: Creates Change Order<br/>in System]
    
    CreateCO --> COType{Change Order<br/>Type?}
    
    COType -->|Additive| AddItems[Add Line Items<br/>Increase Price]
    COType -->|Deductive| RemoveItems[Remove Line Items<br/>Decrease Price]
    
    AddItems --> Calculate[System: Calculate New Total<br/>+ Tax Adjustments]
    RemoveItems --> Calculate
    
    Calculate --> CheckDeposit{Deductive CO<br/>& Deposit Paid?}
    
    CheckDeposit -->|Yes| CreditMemo[System: Flag for Credit Memo]
    CheckDeposit -->|No| GenerateCO[System: Generate CO Document]
    
    CreditMemo --> GenerateCO
    
    GenerateCO --> SendCustomer[Admin: Send CO to Customer<br/>Email/WhatsApp]
    
    SendCustomer --> WaitApproval[Wait for Customer Response]
    
    WaitApproval --> CustomerDecision{Customer<br/>Decision?}
    
    CustomerDecision -->|Approve| RecordApproval[Admin: Record Approval in System]
    CustomerDecision -->|Decline| RecordDecline[Admin: Record Decline in System]
    CustomerDecision -->|Modify| Negotiate[Admin: Negotiate Changes]
    
    Negotiate --> CreateCO
    
    RecordApproval --> ApplyChanges[System: Apply CO to Job<br/>Update Line Items & Totals]
    ApplyChanges --> UpdateQuote[System: Update Quote Status<br/>CO Applied]
    UpdateQuote --> NotifyStaff[Admin: Notify Staff to Proceed]
    NotifyStaff --> ContinueWork[Staff: Continue with New Scope]
    
    RecordDecline --> NoChanges[System: Mark CO Declined<br/>No Scope Change]
    NoChanges --> NotifyStaffOriginal[Admin: Notify Staff<br/>Original Scope Only]
    NotifyStaffOriginal --> ContinueOriginal[Staff: Continue with Original Scope]
    
    ContinueWork --> End([Return to Job Execution])
    ContinueOriginal --> End
    
    style Start fill:#fff59d
    style Discovery fill:#ffecb3
    style CreateCO fill:#e1f5ff
    style AddItems fill:#c8e6c9
    style RemoveItems fill:#ffcdd2
    style CreditMemo fill:#ffe0b2
    style RecordApproval fill:#a5d6a7
    style RecordDecline fill:#ef9a9a
    style End fill:#fff59d
```

---

## Scheduling & Assignment Flow

```mermaid
flowchart TD
    Start([Job Created]) --> SystemAnalysis[System: Analyze Job Requirements<br/>Skills, Duration, Location, Priority]
    
    SystemAnalysis --> CheckResources[System: Check Available Resources<br/>Teams, Staff, Calendars]
    
    CheckResources --> EvaluateOptions[System: Evaluate Options<br/>Skills Match, Workload, Travel Time]
    
    EvaluateOptions --> ScoreCandidates[System: Score Candidates<br/>Generate Confidence Score]
    
    ScoreCandidates --> HasCandidate{Suitable<br/>Candidate<br/>Found?}
    
    HasCandidate -->|Yes| GenerateProposal[System: Generate Proposal<br/>Date/Time + Team/Staff]
    HasCandidate -->|No| NoCandidate[System: No Suitable Candidate]
    
    NoCandidate --> Suggestions[System: Provide Suggestions<br/>Alternate Times/Teams]
    Suggestions --> UnassignedQueue[Add to Unassigned Queue]
    UnassignedQueue --> ManualSchedule[Admin: Manual Schedule Later]
    
    GenerateProposal --> ShowProposal[System: Show Proposal to Admin]
    
    ShowProposal --> AdminDecision{Admin<br/>Decision?}
    
    AdminDecision -->|Confirm| BlockCalendar[System: Block Calendar Slot]
    AdminDecision -->|Modify| ManualSchedule
    AdminDecision -->|Skip| UnassignedQueue
    
    BlockCalendar --> CreateAssignment[System: Create Assignment Record]
    CreateAssignment --> NotifyStaff[System: Notify Assigned Staff]
    NotifyStaff --> UpdateJob[System: Update Job<br/>Status: Scheduled]
    
    ManualSchedule --> SelectDateTime[Admin: Select Date/Time]
    SelectDateTime --> SelectTeam[Admin: Select Team/Staff]
    SelectTeam --> ValidateManual[System: Validate Selection<br/>Check Conflicts]
    
    ValidateManual --> ValidationResult{Valid?}
    
    ValidationResult -->|Yes| BlockCalendar
    ValidationResult -->|No| ShowConflicts[System: Show Conflicts]
    ShowConflicts --> SelectDateTime
    
    UpdateJob --> CheckReschedule{Need to<br/>Reschedule?}
    
    CheckReschedule -->|Yes| RescheduleFlow[Admin: Reschedule]
    CheckReschedule -->|No| Ready[Job Ready for Execution]
    
    RescheduleFlow --> ReleaseSlot[System: Release Current Slot]
    ReleaseSlot --> SelectDateTime
    
    Ready --> End([Job Scheduled])
    
    style Start fill:#e1f5ff
    style SystemAnalysis fill:#e8f5e9
    style GenerateProposal fill:#fff9c4
    style AdminDecision fill:#e1f5ff
    style BlockCalendar fill:#c8e6c9
    style ManualSchedule fill:#e1f5ff
    style UnassignedQueue fill:#ffe0b2
    style Ready fill:#a5d6a7
    style End fill:#81c784
```

---

## Payment & Invoicing Flow

```mermaid
flowchart TD
    Start([Job Approved]) --> AutoInvoice[System: Auto-Generate Invoice<br/>INV-YYYY-NNN]
    
    AutoInvoice --> CalculateBalance[System: Calculate Balance<br/>Total - Deposit Paid]
    
    CalculateBalance --> SetDueDate[System: Set Due Date<br/>e.g., Net 30]
    
    SetDueDate --> UpdateStatus[System: Update Job Status<br/>Status: Invoiced]
    
    UpdateStatus --> SendInvoice[System: Send Invoice to Customer<br/>Email + WhatsApp]
    
    SendInvoice --> NotifyAdmin[System: Notify Admin<br/>Invoice Sent]
    
    NotifyAdmin --> WaitPayment[Wait for Payment]
    
    WaitPayment --> CheckDueDate{Due Date<br/>Passed?}
    
    CheckDueDate -->|No| PaymentReceived{Payment<br/>Received?}
    CheckDueDate -->|Yes| MarkOverdue[System: Mark Overdue<br/>Status: Overdue]
    
    MarkOverdue --> SendReminder[System: Send Reminder<br/>to Customer]
    SendReminder --> AlertAdmin[System: Alert Admin]
    AlertAdmin --> AdminAction[Admin: Follow Up<br/>Call/Email Customer]
    AdminAction --> PaymentReceived
    
    PaymentReceived -->|No| WaitPayment
    PaymentReceived -->|Yes| AdminRecords[Admin: Record Payment in System]
    
    AdminRecords --> PaymentForm[Admin: Fill Payment Form<br/>Date, Method, Amount, Reference]
    
    PaymentForm --> ValidateAmount[System: Validate Amount<br/>Matches Balance Due?]
    
    ValidateAmount --> AmountCheck{Amount<br/>Correct?}
    
    AmountCheck -->|Full Payment| ProcessFull[System: Process Full Payment]
    AmountCheck -->|Partial| ProcessPartial[System: Process Partial Payment<br/>Update Balance]
    AmountCheck -->|Overpayment| ProcessOver[System: Flag Overpayment<br/>Refund Process]
    
    ProcessFull --> UpdateJobPaid[System: Update Job Status<br/>Status: Paid]
    ProcessPartial --> UpdateJobPartial[System: Update Job Status<br/>Partial Payment Recorded]
    ProcessOver --> UpdateJobPaid
    
    UpdateJobPaid --> CloseQuote[System: Close Quote<br/>Quote Status: Closed]
    UpdateJobPartial --> WaitPayment
    
    CloseQuote --> GenerateReceipt[System: Generate Payment Receipt]
    GenerateReceipt --> SendReceipt[System: Send Receipt to Customer]
    SendReceipt --> UpdateFinancials[System: Update Financial Reports]
    UpdateFinancials --> LogActivity[System: Log Payment in Activity Timeline]
    
    LogActivity --> End([Job Closed])
    
    style Start fill:#a5d6a7
    style AutoInvoice fill:#e1bee7
    style UpdateStatus fill:#e1bee7
    style MarkOverdue fill:#ffcdd2
    style AdminAction fill:#e1f5ff
    style ProcessFull fill:#c8e6c9
    style ProcessPartial fill:#fff59d
    style ProcessOver fill:#ffe0b2
    style UpdateJobPaid fill:#81c784
    style End fill:#66bb6a
```

---

## Quality Control Flow

```mermaid
flowchart TD
    Start([Staff Marks Job Completed]) --> RecordTime[System: Record Completion Time<br/>Calculate Duration]
    
    RecordTime --> UpdateStatus[System: Update Status<br/>Status: Completed]
    
    UpdateStatus --> NotifyAdmin[System: Notify Admin<br/>Quality Review Required]
    
    NotifyAdmin --> AdminOpens[Admin: Opens Job Detail]
    
    AdminOpens --> ReviewData[Admin: Reviews<br/>Notes, Photos, Time]
    
    ReviewData --> QualityCheck{Quality<br/>Acceptable?}
    
    QualityCheck -->|Yes| ApproveCompletion[Admin: Approve Completion]
    QualityCheck -->|No| RequestRework[Admin: Request Rework]
    
    ApproveCompletion --> RecordApproval[System: Record Approval<br/>Timestamp + Admin ID]
    
    RecordApproval --> UpdateApproved[System: Update Status<br/>Status: Approved]
    
    UpdateApproved --> TriggerInvoice[System: Trigger Invoice Generation]
    
    TriggerInvoice --> End([Proceed to Invoicing])
    
    RequestRework --> ReworkForm[Admin: Fill Rework Form<br/>Reason, Issues, Photos]
    
    ReworkForm --> UpdateRework[System: Update Status<br/>Status: Rework Required]
    
    UpdateRework --> NotifyStaff[System: Notify Assigned Staff<br/>Rework Details]
    
    NotifyStaff --> StaffReturns[Staff: Returns to Site]
    
    StaffReturns --> StartRework[Staff: Start Rework<br/>Status: In Progress]
    
    StartRework --> PerformRework[Staff: Perform Rework<br/>Add Notes/Photos]
    
    PerformRework --> CompleteRework[Staff: Mark Completed Again]
    
    CompleteRework --> RecordTime
    
    style Start fill:#c8e6c9
    style QualityCheck fill:#e1f5ff
    style ApproveCompletion fill:#a5d6a7
    style RequestRework fill:#ffcdd2
    style UpdateApproved fill:#81c784
    style UpdateRework fill:#ef9a9a
    style End fill:#a5d6a7
```

---

## Job Cancellation Flow

```mermaid
flowchart TD
    Start([Admin Initiates Cancellation]) --> CheckStatus{Current<br/>Job Status?}
    
    CheckStatus -->|Scheduled| AllowCancel[Cancellation Allowed]
    CheckStatus -->|Rescheduled| AllowCancel
    CheckStatus -->|In Progress| ConfirmCancel{Confirm<br/>Cancellation?}
    CheckStatus -->|On Hold| AllowCancel
    CheckStatus -->|Approved+| BlockCancel[Cancellation Not Allowed<br/>Must Complete Payment]
    
    ConfirmCancel -->|Yes| AllowCancel
    ConfirmCancel -->|No| Abort([Abort Cancellation])
    
    BlockCancel --> Abort
    
    AllowCancel --> CancelForm[Admin: Fill Cancellation Form<br/>Reason, Notes]
    
    CancelForm --> UpdateStatus[System: Update Status<br/>Status: Cancelled]
    
    UpdateStatus --> ReleaseCalendar[System: Release Calendar Slot]
    
    ReleaseCalendar --> NotifyStaff[System: Notify Assigned Staff<br/>Job Cancelled]
    
    NotifyStaff --> CheckCustomerNotify{Customer<br/>Notification<br/>Required?}
    
    CheckCustomerNotify -->|Yes| NotifyCustomer[Admin: Notify Customer<br/>Email/WhatsApp]
    CheckCustomerNotify -->|No| LogActivity
    
    NotifyCustomer --> LogActivity[System: Log Cancellation<br/>in Activity Timeline]
    
    LogActivity --> CheckRefund{Deposit<br/>Paid?}
    
    CheckRefund -->|Yes| ProcessRefund[Admin: Process Refund<br/>or Credit]
    CheckRefund -->|No| LockJob
    
    ProcessRefund --> LockJob[System: Lock Job<br/>Read-Only Mode]
    
    LockJob --> UpdateQuote[System: Update Quote Status<br/>Quote: Cancelled]
    
    UpdateQuote --> End([Job Cancelled])
    
    style Start fill:#e1f5ff
    style CheckStatus fill:#fff9c4
    style AllowCancel fill:#c8e6c9
    style BlockCancel fill:#ffcdd2
    style UpdateStatus fill:#ef9a9a
    style ProcessRefund fill:#ffe0b2
    style End fill:#ef9a9a
```

---

## Document Version

- **Version:** 1.0
- **Date:** November 6, 2024
- **Companion to:** JOB_PROCESS_DESIGN.md
