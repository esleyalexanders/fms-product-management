# FMS Master Flowcharts Library

This document centrally aggregates all active `mermaid` flowcharts and architectural diagrams defining the Franchise Management System (FMS). Historical (Archived) diagrams have been intentionally excluded to serve as the single source of truth for current operations.

---

## 1. Core Platform Architecture (Master BRD)

### Data Provisioning Flow
```mermaid
graph TD
    A[Superadmin / Manager] -->|Logs into FMS| B(Home Dashboard)
    B --> C{Select Core Module}
    C -->|Manage Team| D[Add Staff Member & Set 'Default Pay Rate']
    C -->|Pricebook| E[Import Catalog Data & Set 'Unit Prices']
    C -->|Customer CRM| F[Add New Client Billing Details]
    D --> G[Data ready for Phase 3: Payroll]
    E --> H[Data ready for Phase 2: Sales]
```

### Sales Pipeline Flow
```mermaid
graph TD
    A[Sales Rep] -->|Selects Pricebook Items| B(Create Quote)
    B --> C{Client Response}
    C -->|Accepted| E[Convert to Job]
    E --> F[Generate Job Record]
    E --> G[Generate Linked Invoice]
    G --> H[Record Payment]
```

### Staff Scheduling & Payroll Flow
```mermaid
graph TD
    A[Convert Job to Session] --> B(Set Recurrence Rules)
    B --> C{Calendar Dispatch}
    C -->|Assign Staff A| D[My Timesheet: Staff A]
    D --> E{Session Complete}
    E -->|Actual = Estimated Hours| F[Auto-Approve Pending]
    E -->|Actual > Estimated| G[Flag Discrepancy]
    G --> H[Timesheet Manager Inbox]
    H --> I(Review & Approve/Decline)
```

---

## 2. Pricebook & Course Configuration

### Course Logic Configuration Flow
```mermaid
graph TD
    A[Start: Create Item] --> B{Package Type?}
    
    B -->|Subscription| C[Frequency: Weekly/Monthly]
    
    B -->|Course| D[Period Configuration]
    D --> D1[Select Period: Week/Month]
    D --> D2[Enter Days per Period (e.g., 4)]
    D --> D3[Enter Duration (e.g., 3 Weeks)]
    
    D3 --> E[Calculate Total Sessions]
    E -->|4 * 3 = 12| F[Total Sessions: 12]
    
    F --> G[Pricing]
    G --> G1[Input: Price per Session ($50)]
    G1 --> G2[Calculate Total Price: 12 * 50 = $600]
```

---

## 3. Team Management

### User Journey
```mermaid
flowchart TD
    A[User logs into system] --> B[Navigate to Manage Team page]
    B --> C[View Staff List]

    C --> D{Action?}
    D -->|View Details| E[Click staff member]
    D -->|Add Staff| F[Click 'Add Staff' button]
    D -->|Edit Staff| G[Click 'Edit' for staff member]
    D -->|Filter/Search| H[Use search or filter options]
    D -->|Manage Roles| I[Click 'Manage Roles' button]
    D -->|Deactivate| J[Click 'Deactivate' for staff member]

    E --> K[View Staff Detail Page]
    K --> L{Action?}
    L -->|Edit| G
    L -->|Print| M[Print staff details]
    L -->|Export| N[Export staff data]
    L -->|Back| C

    F --> O[Staff Create Form]
    O --> P[Fill Personal Info tab]
    P --> Q[Fill Employment tab]
    Q --> R[Submit form]
    R --> S{Validation passes?}
    S -->|Yes| T[Show success message]
    S -->|No| U[Show validation errors]
    U --> O
    T --> C

    G --> V[Staff Edit Form]
    V --> W[Update information]
    W --> X[Submit form]
    X --> Y{Validation passes?}
    Y -->|Yes| Z[Show success message]
    Y -->|No| AA[Show validation errors]
    AA --> V
    Z --> C

    H --> BB[Filtered staff list]
    BB --> C

    I --> CC[Role Management Page]
    CC --> DD{Action?}
    DD -->|View Roles| EE[Display role list]
    DD -->|Add Role| FF[Click 'Add Role']
    DD -->|Edit Role| GG[Click 'Edit' for role]
    DD -->|Back| C

    FF --> HH[Role Create Form]
    HH --> II[Fill role details & permissions]
    II --> JJ[Submit form]
    JJ --> KK[Show success message]
    KK --> CC

    GG --> LL[Role Edit Form]
    LL --> MM[Update role details]
    MM --> NN[Submit form]
    NN --> OO[Show success message]
    OO --> CC

    J --> PP{Confirm deactivation?}
    PP -->|Yes| QQ[Deactivate staff]
    PP -->|No| C
    QQ --> RR[Show confirmation]
    RR --> C
```

### Staff Management Operations (Sequence)
```mermaid
sequenceDiagram
    participant U as User (Admin/Manager)
    participant FE as Frontend (Web App)
    participant API as Backend API
    participant DB as Database
    participant ES as Email Service

    %% Create Staff Flow
    rect rgb(240, 248, 255)
        Note over U,ES: Create New Staff Member
        U->>FE: Click "Add Staff" button
        FE->>FE: Display create form
        U->>FE: Fill form data (personal, employment info)
        U->>FE: Submit form
        FE->>FE: Validate form data
        FE->>API: POST /api/staff (staff data)
        API->>API: Validate business rules
        API->>DB: INSERT staff record
        DB-->>API: Return staff ID
        API->>ES: Send invitation email (if requested)
        ES-->>API: Email sent confirmation
        API-->>FE: Return success response
        FE->>FE: Show success message
        FE->>FE: Redirect to staff list
    end

    %% View Staff Details Flow
    rect rgb(255, 248, 220)
        Note over U,DB: View Staff Details
        U->>FE: Click staff member name/link
        FE->>API: GET /api/staff/{id}
        API->>DB: SELECT staff record
        DB-->>API: Return staff data
        API-->>FE: Return staff details
        FE->>FE: Display staff detail page
    end

    %% Update Staff Flow
    rect rgb(240, 255, 240)
        Note over U,ES: Update Staff Information
        U->>FE: Click "Edit" for staff member
        FE->>API: GET /api/staff/{id}
        API->>DB: SELECT staff record
        DB-->>API: Return staff data
        API-->>FE: Return staff details
        FE->>FE: Pre-populate edit form
        U->>FE: Modify staff data
        U->>FE: Submit form
        FE->>FE: Validate form data
        FE->>API: PUT /api/staff/{id} (updated data)
        API->>API: Validate business rules
        API->>DB: UPDATE staff record
        DB-->>API: Confirm update
        API->>ES: Send update notification (if requested)
        ES-->>API: Email sent confirmation
        API-->>FE: Return success response
        FE->>FE: Show success message
        FE->>FE: Redirect to staff list
    end

    %% Deactivate Staff Flow
    rect rgb(255, 240, 240)
        Note over U,DB: Deactivate Staff Member
        U->>FE: Click "Deactivate" for staff member
        FE->>FE: Show confirmation dialog
        U->>FE: Confirm deactivation
        FE->>API: PUT /api/staff/{id}/status (inactive)
        API->>DB: UPDATE staff status
        DB-->>API: Confirm update
        API-->>FE: Return success response
        FE->>FE: Show confirmation message
        FE->>FE: Update staff list display
    end
```

---

## 4. Quotes & Sales Lifecycle

### To-Be Quote-to-Cash + Field Service
```mermaid
flowchart TD
  %% Quote-to-Cash + Field Service To-Be Flow
  A[Admin Creates Quote] --> B[Send to Customer]
  B --> C{Customer Review}
  C -->|Approve via franchise| D[Convert to Work Order]
  C -->|Request Changes via franchise| A
  C -->|No Response| R[Franchise follows up manually / Automated Reminder]
  R --> C

  D --> E[Scheduling & Dispatch]
  E --> F[Assign Technician / Create Route]
  F --> G[Technician Web Dashboard - On-site Execution]
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

### Quote Status Lifecycle
```mermaid
sequenceDiagram
    participant Admin
    participant System
    participant Customer
    participant Job

    Note over Admin,System: Quote Creation
    Admin->>System: Create new quote
    System->>System: Set status = Draft
    Note right of System: Status: 📝 Draft<br/>Trigger: Auto (on creation)

    Note over Admin,System: Quote Sending
    Admin->>System: Click "Resend Quote" button
    System->>System: Change status to Sent
    System->>Customer: Send quote via email/SMS
    Note right of System: Status: 📤 Sent<br/>Trigger: Manual (admin action)

    Note over Customer,Admin: Customer Response - Acceptance
    Customer-->>Admin: Verbally/Email accepts quote
    Admin->>System: Change status to Accepted
    System->>System: Show "Customer Feedback" section
    System->>System: Show "Convert to Job" button
    Admin->>System: Record feedback & response date
    Note right of System: Status: ✅ Accepted<br/>Trigger: Manual (admin records)

    Note over System,Job: Job Conversion
    Admin->>System: Click "Convert to Job"
    System->>Job: Create new job with quote data
    Job-->>System: Job created successfully
    System-->>Admin: Redirect to job page
    Note right of System: Quote → Job conversion<br/>Trigger: Manual (admin action)

    Note over Customer,Admin: Customer Response - Rejection
    Customer-->>Admin: Verbally/Email declines quote
    Admin->>System: Change status to Declined
    System->>System: Show "Customer Feedback" section
    Admin->>System: Record reason & response date
    Note right of System: Status: ❌ Declined<br/>Trigger: Manual (admin records)

    Note over System: Automatic Expiration
    System->>System: Daily cron job checks validUntilDate
    System->>System: If date < today, set status = Expired
    Note right of System: Status: ⏰ Expired<br/>Trigger: Auto (daily cron)
```

### Extend & Resend Workflow
```mermaid
graph TD
    A[Quote Status: Expired] --> B[Admin updates Valid Until date]
    B --> C[Admin clicks Extend & Resend]
    C --> D{Validate Date}
    D -->|Date not set| E[Show error: Set date]
    D -->|Date in past| F[Show error: Future date required]
    D -->|Date valid| G[Show confirmation dialog]
    G -->|Cancel| H[No action]
    G -->|Confirm| I[Change status to Sent]
    I --> J[Update header badge]
    I --> K[Hide Extend button]
    I --> L[Show Resend button]
    I --> M[Resend quote to customer]
    M --> N[Show success message]
```

---

## 5. Simplified Financial & Operational Models

### End-to-End Financial Flow (One-Time vs Subscription)
```mermaid
graph TD
    subgraph Legend["Legend"]
        direction LR
        L2[System Process]
        L3((Start / End))
        L4[Auto System]
        L5[/User Action/]
        L6[Status]
    end
    
    style L2 fill:#ECECFF,stroke:#9370DB
    style L3 fill:#f9f,stroke:#333,stroke-width:2px
    style L4 fill:#FFD700,stroke:#B8860B
    style L5 fill:#DAE8FC,stroke:#6C8EBF
    style L6 fill:#D5E8D4,stroke:#82B366
    
    subgraph Flow["Simplified Financial Flow"]
        Start((Start Financial Event)) --> Trigger{Service Type?}
        
        Trigger -->|1. One-Time Service| CreateInv[/User Clicks Create Invoice/]
        CreateInv --> InvA[System Creates Invoice<br/>for FULL QUOTE AMOUNT<br/>Status: UNPAID]
        InvA --> GenLink[System Creates Payment Link]
        GenLink --> SendLink[/User Manually Sends Link<br/>Email/SMS/WhatsApp/]
        SendLink --> Pay1[Customer Pays FULL AMOUNT via Link]
        Pay1 --> S_Paid[Invoice Status: PAID<br/>Quote Status: PAID]
        S_Paid --> End1((Quote Complete))
        
        Trigger -->|2. Subscription Service| Scheduler[System Scheduler Triggers<br/>e.g., 1st day of month]
        Scheduler --> CardOnFile{Customer has saved<br/>Credit Card/Account?}
        
        CardOnFile -->|Yes 99% Case| AutoCharge[System AUTO-CHARGES<br/>FULL AMOUNT<br/>Stripe/PayPal Auto-Charge]
        AutoCharge --> ChargeOK{Charge Successful?}
        ChargeOK -->|Yes| AutoInvPaid[System Creates Invoice Status: PAID<br/>and Sends Receipt]
        AutoInvPaid --> Loop2((Wait for next cycle))
        Loop2 --> Scheduler
        
        ChargeOK -->|No Card Error| Dunning[Start Dunning Process<br/>Send emails, retry...]
        Dunning --> EndFail((Pause Subscription))
        
        CardOnFile -->|No Rare Case| AutoInvUnpaid[System Auto-Creates<br/>Invoice Status: UNPAID<br/>FULL AMOUNT]
        AutoInvUnpaid --> GenLink2[System Creates Payment Link]
        GenLink2 --> SendLink2[System Auto-Sends Link<br/>e.g., Email invoice]
        SendLink2 --> Pay1
    end
    
    style CreateInv fill:#DAE8FC,stroke:#6C8EBF
    style SendLink fill:#DAE8FC,stroke:#6C8EBF
    
    style InvA fill:#ECECFF,stroke:#9370DB
    style GenLink fill:#ECECFF,stroke:#9370DB
    style Pay1 fill:#ECECFF,stroke:#9370DB
    style GenLink2 fill:#ECECFF,stroke:#9370DB
    
    style Scheduler fill:#FFD700,stroke:#B8860B
    style AutoCharge fill:#FFD700,stroke:#B8860B
    style AutoInvPaid fill:#FFD700,stroke:#B8860B
    style Dunning fill:#FFD700,stroke:#B8860B
    style AutoInvUnpaid fill:#FFD700,stroke:#B8860B
    style SendLink2 fill:#FFD700,stroke:#B8860B
    
    style S_Paid fill:#D5E8D4,stroke:#82B366
```

### Simplified Job Status Lifecycle
```mermaid
stateDiagram-v2
    direction LR
    
    Unscheduled: Unscheduled
    Scheduled: Scheduled
    In_Progress: In Progress
    On_Hold: On Hold
    Completed: Completed
    Canceled: Canceled
    
    state "Job Creation" as Triggers {
        direction TB
        Trigger1: From Quote (Manual)
        Trigger2: From Subscription (Auto)
        Trigger1 --> Unscheduled
        Trigger2 --> Unscheduled
    }
    
    Unscheduled --> Scheduled: Manager Assigns Date + Staff
    Scheduled --> Unscheduled: Manager Unschedules
    
    Scheduled --> In_Progress: Staff Starts Job
    
    In_Progress --> On_Hold: Staff Pauses (On-site issue)
    Scheduled --> On_Hold: Manager Pauses (Admin reason)
    
    On_Hold --> In_Progress: Staff Resumes
    On_Hold --> Scheduled: Manager Reschedules
    
    In_Progress --> Completed: Staff Completes Job
    
    Unscheduled --> Canceled: Manager Cancels
    Scheduled --> Canceled: Manager Cancels
    On_Hold --> Canceled: Manager Cancels
    
    Completed --> CheckSub
    state CheckSub <<choice>>
    CheckSub --> EndJob: One-Time Service
    CheckSub --> LoopBack: Subscription Service
    
    state LoopBack {
        [*] --> Wait: Wait for Next Cycle
        Wait --> [*]: Scheduler Triggers
    }
    
    LoopBack --> Trigger2
    Canceled --> EndJob
    
    state EndJob {
        [*]
    }
```

---

## 6. Multi-Quantity Session Enrollment
```mermaid
flowchart TD
    %% Nodes
    Start([Start]) --> Dashboard
    Dashboard -->|Click 'New Quote'| CreateQuote[Create Quote]
    
    subgraph Quote_Creation [Quote Creation]
        CreateQuote --> AddCustomer[Select Customer]
        AddCustomer --> AddItems[Item: 'Adv Math', Qty: 2]
        AddItems -->|Configure| ItemDetails[Freq: Weekly, Stop: After 12]
        ItemDetails --> SaveQuote[Save Quote]
    end

    SaveQuote --> QuoteDetail[Quote Detail View]
    
    QuoteDetail --> ConversionDec{Conversion Path}
    
    %% Handling Items based on RECURRENCE
    ConversionDec -->|Start Conversion| CheckRecurrence{Has Recurrence?}
    
    %% Session-Based Items
    CheckRecurrence -->|Yes| SplitQty{Split by Quantity?}
    
    %% SPLIT LOGIC
    SplitQty -->|Qty = 2| ShowSplitUI[Show 2 Independent Allocation Rows]
    
    subgraph Enrollment_Selection [Session Assignment Phase]
        ShowSplitUI --> Row1[Job 1 Allocation]
        ShowSplitUI --> Row2[Job 2 Allocation]
        
        Row1 --> SelectSess1[Select Session: 'Mon 5:00 PM']
        Row2 --> SelectSess2[Select Session: 'Tue 7:00 PM']
        
        SelectSess1 --> Validate[Valid: 2 Distinct Slots Selected]
        SelectSess2 --> Validate
        
        Validate --> Execute[Execute Enrollment]
    end

    %% EXECUTION & LIFECYCLE
    subgraph Lifecycle [Job & Session Lifecycle]
        Execute --> CreateJob1[Create Job #1 + Enrollment #1]
        Execute --> CreateJob2[Create Job #2 + Enrollment #2]
        
        CreateJob1 --> Track1[Job 1: Active]
        CreateJob2 --> Track2[Job 2: Active]
        
        Track1 --> Attend1[Attendance System: Count +1]
        Attend1 --> CheckLimit1{Count >= 12?}
        CheckLimit1 -->|No| Continue1[Continue Job]
        CheckLimit1 -->|Yes| StopJob1[AUTO-STOP: Set Job Terminated/Completed]
    end

    %% Styling
    classDef pathA fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef pathB fill:#f3e5f5,stroke:#4a148c,stroke-width:2px;
    classDef lifecycle fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    class CreateJob1,CreateJob2,Track1,Track2,CheckLimit1,StopJob1 lifecycle;
    class ShowSplitUI,Row1,Row2,SelectSess1,SelectSess2,Validate,Execute pathB;
```
