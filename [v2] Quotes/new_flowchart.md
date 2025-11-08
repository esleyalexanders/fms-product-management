**Luồng ["Flow 2 (Enhanced): Financial Flow (One-Time vs Subscription)"]**
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
    
    subgraph Flow["Flow 2 (Enhanced): Financial Flow (One-Time vs Subscription)"]
        Start((Start Financial Event)) --> Trigger{Event Type?}
        
        Trigger -->|1. One-Time Service| CreateInv[/User Clicks Create Invoice on Quote/]
        CreateInv --> SelectItems[/User SELECTS line items to invoice<br/>e.g., Down payment, Progress billing/]
        SelectItems --> InvA[System Creates Invoice Status: UNPAID]
        InvA --> GenLink[System Creates Payment Link]
        GenLink --> SendLink[/User Manually Sends Link<br/>Email/SMS/WhatsApp/]
        SendLink --> Pay1[Customer Pays via Link]
        Pay1 --> S_Paid[Invoice Status: Paid]
        S_Paid --> CheckComplete{Quote 100% invoiced & paid?}
        CheckComplete -->|No| Loop1((Waiting to invoice<br/>remaining items))
        CheckComplete -->|Yes| End1((Quote Fully Paid))
        Loop1 --> CreateInv
        
        Trigger -->|2. Subscription Cycle| Scheduler[System Scheduler Triggers<br/>e.g., 1st day of month]
        Scheduler --> CardOnFile{Customer has saved<br/>Credit Card/Account?}
        
        CardOnFile -->|Yes 99% Case| AutoCharge[System AUTO-CHARGES<br/>Stripe/PayPal Auto-Charge]
        AutoCharge --> ChargeOK{Charge Successful?}
        ChargeOK -->|Yes| AutoInvPaid[System Creates Invoice Status: PAID<br/>and Sends Receipt]
        AutoInvPaid --> Loop2((Wait for next cycle))
        Loop2 --> Scheduler
        
        ChargeOK -->|No Card Error| Dunning[Start Dunning Process<br/>Send emails, retry...]
        Dunning --> EndFail((Pause Subscription))
        
        CardOnFile -->|No Rare Case| AutoInvUnpaid[System Auto-Creates<br/>Invoice Status: UNPAID]
        AutoInvUnpaid --> GenLink2[System Creates Payment Link]
        GenLink2 --> SendLink2[System Auto-Sends Link<br/>e.g., Email invoice]
        SendLink2 --> Pay1
    end
    
    style CreateInv fill:#DAE8FC,stroke:#6C8EBF
    style SelectItems fill:#DAE8FC,stroke:#6C8EBF
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

**Luồng Quote operation Status Lifecycle**
graph TB
    subgraph Legend["Legend"]
        L1[Active States]
        L2[Customer Decision States]
        L3[Terminal States]
    end
    
    style L1 fill:#E3F2FD,stroke:#1565C0
    style L2 fill:#FFF9C4,stroke:#F57F17
    style L3 fill:#FFCDD2,stroke:#C62828
    
    subgraph Flow["Quote Lifecycle"]
        Start([New Quote]) --> Draft[Status: Draft<br/>Being prepared]
        
        Draft -->|User sends quote| Sent[Status: Sent<br/>Awaiting customer response]
        
        Sent -->|User recalls/edits| Draft
        
        Sent -->|Customer accepts| Accepted[Status: Accepted<br/>Approved by customer]
        Sent -->|Customer rejects| Rejected[Status: Rejected<br/>Declined by customer]
        Sent -->|Time expires| Expired[Status: Expired<br/>Auto-expired by system]
        
        Rejected -->|User edits & resends| Draft
        
        Accepted -->|User cancels| Canceled[Status: Canceled<br/>Canceled after acceptance]
        
        Expired --> End1([Quote Closed])
        Canceled --> End1
    end
    
    style Start fill:#4CAF50,stroke:#2E7D32,stroke-width:3px
    style Draft fill:#E3F2FD,stroke:#1565C0,stroke-width:2px
    style Sent fill:#E3F2FD,stroke:#1565C0,stroke-width:2px
    style Accepted fill:#FFF9C4,stroke:#F57F17,stroke-width:2px
    style Rejected fill:#FFF9C4,stroke:#F57F17,stroke-width:2px
    style Expired fill:#FFCDD2,stroke:#C62828,stroke-width:2px
    style Canceled fill:#FFCDD2,stroke:#C62828,stroke-width:2px
    style End1 fill:#757575,stroke:#424242,stroke-width:3px

**Luồng Quote financial Status Lifecycle**
flowchart TB
 subgraph Legend["Legend"]
        L1["Initial State"]
        L2["Invoicing States"]
        L3["Payment States"]
        L4["Final State"]
  end
 subgraph Flow["Quote Status Lifecycle"]
        Start(["Status: Not Invoiced<br>Initial State"])
        PI["Status: Partially Invoiced<br>Some items billed"]
        FI["Status: Fully Invoiced<br>All items billed"]
        PP1["Status: Partially Paid<br>Some invoices paid"]
        PP2["Status: Partially Paid<br>Some amounts paid"]
        End(["Status: Paid<br>Complete"])
  end
    Start -- Invoice some items --> PI
    Start -- Invoice all items --> FI
    PI -- Invoice remaining items --> FI
    PI -- Customer pays first invoice --> PP1
    FI -- Customer pays partially<br>Split payment --> PP2
    PP1 -- Customer pays<br>final amount --> End
    PP2 -- Customer pays<br>final amount --> End
    FI -- Customer pays<br>100% at once --> End
    Start -. Direct path<br>rare .-> End

    style L1 fill:#E1F5FF,stroke:#01579B
    style L2 fill:#FFF9C4,stroke:#F57F17
    style L3 fill:#F3E5F5,stroke:#4A148C
    style L4 fill:#C8E6C9,stroke:#1B5E20
    style Start fill:#E1F5FF,stroke:#01579B,stroke-width:3px
    style PI fill:#FFF9C4,stroke:#F57F17,stroke-width:2px
    style FI fill:#FFF9C4,stroke:#F57F17,stroke-width:2px
    style PP1 fill:#F3E5F5,stroke:#4A148C,stroke-width:2px
    style PP2 fill:#F3E5F5,stroke:#4A148C,stroke-width:2px
    style End fill:#C8E6C9,stroke:#1B5E20,stroke-width:3px


**Luồng Job Status Lifecycle**
stateDiagram-v2
    direction LR
    
    Unscheduled: Unscheduled
    Scheduled: Scheduled
    In_Progress: In Progress
    On_Hold: On Hold
    Completed: Completed
    Canceled: Canceled
    
    state "Job Creation Triggers" as Triggers {
        direction TB
        Trigger1: From Quote Manual
        Trigger2: From Subscription Auto
        Trigger1 --> Unscheduled
        Trigger2 --> Unscheduled
    }
    
    Unscheduled --> Scheduled: Manager Assigns Date + Staff
    Scheduled --> Unscheduled: Manager Unschedules
    
    Scheduled --> In_Progress: Staff Starts Job
    
    In_Progress --> On_Hold: Staff Pauses On-site issue
    Scheduled --> On_Hold: Manager Pauses Administrative reason
    
    On_Hold --> In_Progress: Staff Resumes
    On_Hold --> Scheduled: Manager Reschedules
    
    In_Progress --> Completed: Staff Completes Job
    
    Unscheduled --> Canceled: Manager Cancels
    Scheduled --> Canceled: Manager Cancels
    On_Hold --> Canceled: Manager Cancels
    
    Completed --> CheckSub
    state CheckSub <<choice>>
    CheckSub --> EndJob: No One-Time
    CheckSub --> LoopBack: Yes Subscription
    
    state LoopBack {
        [*] --> Wait: Wait for Scheduler
        Wait --> [*]: Next Job Cycle
    }
    
    LoopBack --> Trigger2
    Canceled --> EndJob
    
    state EndJob {
        [*]
    }