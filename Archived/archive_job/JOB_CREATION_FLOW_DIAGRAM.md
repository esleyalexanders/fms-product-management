# Job Creation Flow Diagrams - Multiple Jobs Per Quote

## 1. Complete Job Creation Flow

```mermaid
flowchart TD
    Start([Quote Approved]) --> OpenQuote[Admin: Open Quote Detail]
    OpenQuote --> ClickConvert[Admin: Click Convert to Job]
    
    ClickConvert --> Modal{Job Creation<br/>Modal}
    
    Modal -->|Single Job| SinglePath[Create Single Job Path]
    Modal -->|Multiple Jobs| MultiplePath[Create Multiple Jobs Path]
    Modal -->|Cancel| Abort([Abort])
    
    %% Single Job Path
    SinglePath --> CreateSingle[System: Create Job with All Items]
    CreateSingle --> AssignJobID1[System: Assign Job ID<br/>J-2024-001]
    AssignJobID1 --> PopulateData1[System: Auto-populate<br/>All Quote Data]
    PopulateData1 --> SetStatus1[System: Set Status = Scheduled]
    SetStatus1 --> UpdateQuote1[System: Update Quote<br/>Status: Converted 1 job]
    UpdateQuote1 --> RedirectSingle[Redirect to Job Detail]
    RedirectSingle --> EndSingle([End])
    
    %% Multiple Jobs Path
    MultiplePath --> ShowDistribution[System: Show Item<br/>Distribution Screen]
    ShowDistribution --> InitJobs[System: Initialize<br/>2 Empty Job Cards]
    
    InitJobs --> AssignItems[Admin: Assign Items to Jobs]
    
    AssignItems --> AssignMethod{Assignment<br/>Method?}
    
    AssignMethod -->|Drag & Drop| DragDrop[Admin: Drag Items<br/>to Job Cards]
    AssignMethod -->|Checkbox| Checkbox[Admin: Select Items<br/>+ Assign Button]
    AssignMethod -->|Quick Split| QuickSplit[Admin: Click<br/>Split Evenly]
    
    DragDrop --> ConfigureJobs
    Checkbox --> ConfigureJobs
    QuickSplit --> AutoDistribute[System: Auto-distribute<br/>Items Evenly]
    AutoDistribute --> ConfigureJobs
    
    ConfigureJobs[Admin: Configure Each Job<br/>Name, Date, Priority, Notes]
    
    ConfigureJobs --> AddMore{Add More<br/>Jobs?}
    AddMore -->|Yes| AddJobCard[Admin: Click<br/>Add Another Job]
    AddJobCard --> AssignItems
    AddMore -->|No| ValidateAll
    
    ValidateAll[System: Validate All Jobs]
    
    ValidateAll --> ValidationCheck{All Valid?}
    
    ValidationCheck -->|No| ShowErrors[System: Show<br/>Validation Errors]
    ShowErrors --> FixErrors{Admin<br/>Fixes?}
    FixErrors -->|Yes| AssignItems
    FixErrors -->|No| Abort
    
    ValidationCheck -->|Yes| CreateAllJobs[Admin: Click<br/>Create All Jobs]
    
    CreateAllJobs --> GenerateIDs[System: Generate Job IDs<br/>J-2024-001, 002, 003]
    GenerateIDs --> CreateRecords[System: Create Job Records<br/>in Database]
    CreateRecords --> LinkQuote[System: Link All Jobs<br/>to Quote]
    LinkQuote --> DistributeDeposit[System: Distribute Deposit<br/>Proportionally]
    DistributeDeposit --> UpdateQuoteMulti[System: Update Quote<br/>Status: Converted 3 jobs]
    UpdateQuoteMulti --> ShowSuccess[System: Show Success<br/>Message with Job IDs]
    ShowSuccess --> RedirectMulti[Redirect to Job List<br/>Filtered by Quote]
    RedirectMulti --> EndMulti([End])
    
    style Start fill:#e1f5ff
    style Modal fill:#fff9c4
    style SinglePath fill:#c8e6c9
    style MultiplePath fill:#e1bee7
    style ValidationCheck fill:#ffe0b2
    style ShowErrors fill:#ffcdd2
    style CreateAllJobs fill:#a5d6a7
    style EndSingle fill:#81c784
    style EndMulti fill:#81c784
```

---

## 2. Item Distribution Interface Flow

```mermaid
flowchart TD
    Start([Distribution Screen Loaded]) --> LoadItems[System: Load Quote Line Items]
    
    LoadItems --> DisplayAvailable[System: Display Available Items<br/>in Draggable List]
    
    DisplayAvailable --> DisplayJobs[System: Display 2 Empty<br/>Job Cards]
    
    DisplayJobs --> WaitAction[Wait for Admin Action]
    
    WaitAction --> Action{Admin<br/>Action?}
    
    %% Drag & Drop Path
    Action -->|Drag Item| StartDrag[Admin: Start Dragging Item]
    StartDrag --> HighlightZones[System: Highlight Drop Zones]
    HighlightZones --> DropItem{Drop on<br/>Job Card?}
    DropItem -->|Yes| MoveItem[System: Move Item to Job]
    DropItem -->|No| CancelDrag[System: Cancel Drag]
    CancelDrag --> WaitAction
    
    %% Checkbox Selection Path
    Action -->|Select Items| CheckItems[Admin: Check Item Checkboxes]
    CheckItems --> ClickAssign[Admin: Click Assign to Job X]
    ClickAssign --> MoveSelected[System: Move Selected Items<br/>to Job X]
    MoveSelected --> MoveItem
    
    %% Quick Split Path
    Action -->|Quick Split| ClickSplit[Admin: Click Split Button]
    ClickSplit --> SplitType{Split<br/>Type?}
    SplitType -->|Evenly| SplitEvenly[System: Distribute Items<br/>Evenly Across Jobs]
    SplitType -->|By Type| SplitByType[System: Group Similar<br/>Items per Job]
    SplitEvenly --> MoveItem
    SplitByType --> MoveItem
    
    %% Add/Remove Jobs
    Action -->|Add Job| AddJob[Admin: Click Add Job]
    AddJob --> CreateJobCard[System: Create New<br/>Empty Job Card]
    CreateJobCard --> WaitAction
    
    Action -->|Remove Job| RemoveJob[Admin: Click Remove Job]
    RemoveJob --> ReturnItems[System: Return Items<br/>to Available List]
    ReturnItems --> DeleteCard[System: Delete Job Card]
    DeleteCard --> WaitAction
    
    %% After Item Moved
    MoveItem --> UpdateTotals[System: Recalculate Totals<br/>for All Jobs]
    UpdateTotals --> CheckComplete{All Items<br/>Assigned?}
    
    CheckComplete -->|No| UpdateRemaining[System: Update<br/>Remaining Count]
    UpdateRemaining --> WaitAction
    
    CheckComplete -->|Yes| ValidateTotals[System: Validate<br/>Job Totals = Quote Total]
    ValidateTotals --> ValidationResult{Valid?}
    
    ValidationResult -->|Yes| EnableCreate[System: Enable<br/>Create All Jobs Button]
    ValidationResult -->|No| ShowWarning[System: Show<br/>Total Mismatch Warning]
    ShowWarning --> WaitAction
    
    EnableCreate --> WaitAction
    
    Action -->|Create All| Proceed([Proceed to Job Creation])
    
    style Start fill:#e1f5ff
    style Action fill:#fff9c4
    style MoveItem fill:#c8e6c9
    style CheckComplete fill:#ffe0b2
    style ValidationResult fill:#ffe0b2
    style EnableCreate fill:#a5d6a7
    style ShowWarning fill:#ffcdd2
    style Proceed fill:#81c784
```

---

## 3. Validation Flow

```mermaid
flowchart TD
    Start([Admin Clicks Create All Jobs]) --> ValidateStart[System: Start Validation]
    
    ValidateStart --> CheckAllAssigned{All Items<br/>Assigned?}
    
    CheckAllAssigned -->|No| ErrorUnassigned[Error: X items not assigned]
    CheckAllAssigned -->|Yes| CheckJobsNotEmpty
    
    ErrorUnassigned --> ShowError1[Show Error Message]
    ShowError1 --> Return1([Return to Distribution])
    
    CheckJobsNotEmpty{All Jobs<br/>Have Items?}
    
    CheckJobsNotEmpty -->|No| ErrorEmpty[Error: Job X has no items]
    CheckJobsNotEmpty -->|Yes| CheckTotals
    
    ErrorEmpty --> ShowError2[Show Error Message]
    ShowError2 --> Return2([Return to Distribution])
    
    CheckTotals{Sum of Job Totals<br/>= Quote Total?}
    
    CheckTotals -->|No| ErrorTotal[Error: Total mismatch<br/>Jobs: $X, Quote: $Y]
    CheckTotals -->|Yes| CheckQuantities
    
    ErrorTotal --> ShowError3[Show Error Message]
    ShowError3 --> Return3([Return to Distribution])
    
    CheckQuantities{Any Item<br/>Split Across Jobs?}
    
    CheckQuantities -->|Yes| ErrorSplit[Error: Cannot split<br/>item quantities]
    CheckQuantities -->|No| CheckJobLimit
    
    ErrorSplit --> ShowError4[Show Error Message]
    ShowError4 --> Return4([Return to Distribution])
    
    CheckJobLimit{Job Count<br/>≤ 10?}
    
    CheckJobLimit -->|No| ErrorLimit[Error: Max 10 jobs<br/>per quote]
    CheckJobLimit -->|Yes| AllValid
    
    ErrorLimit --> ShowError5[Show Error Message]
    ShowError5 --> Return5([Return to Distribution])
    
    AllValid[All Validations Passed] --> ProceedCreate[Proceed to Job Creation]
    
    ProceedCreate --> End([Success])
    
    style Start fill:#e1f5ff
    style CheckAllAssigned fill:#fff9c4
    style CheckJobsNotEmpty fill:#fff9c4
    style CheckTotals fill:#fff9c4
    style CheckQuantities fill:#fff9c4
    style CheckJobLimit fill:#fff9c4
    style ErrorUnassigned fill:#ffcdd2
    style ErrorEmpty fill:#ffcdd2
    style ErrorTotal fill:#ffcdd2
    style ErrorSplit fill:#ffcdd2
    style ErrorLimit fill:#ffcdd2
    style AllValid fill:#a5d6a7
    style End fill:#81c784
```

---

## 4. Deposit Distribution Flow

```mermaid
flowchart TD
    Start([Jobs Created]) --> CheckDeposit{Quote Has<br/>Deposit?}
    
    CheckDeposit -->|No| NoDeposit[No Deposit Distribution<br/>Needed]
    NoDeposit --> End([End])
    
    CheckDeposit -->|Yes| GetDepositInfo[Get Quote Deposit Info<br/>Amount, Type, Percentage]
    
    GetDepositInfo --> DistributionMethod{Distribution<br/>Method?}
    
    DistributionMethod -->|Proportional| CalcProportional[Calculate Proportional<br/>Distribution]
    DistributionMethod -->|First Job| ApplyToFirst[Apply Full Deposit<br/>to First Job]
    DistributionMethod -->|Manual| AdminSpecifies[Admin Specifies<br/>Deposit per Job]
    
    CalcProportional --> ForEachJob[For Each Job]
    
    ForEachJob --> CalcJobDeposit[Job Deposit =<br/>Job Total / Quote Total<br/>* Quote Deposit]
    
    CalcJobDeposit --> AssignDeposit[Assign Deposit to Job]
    
    AssignDeposit --> MoreJobs{More<br/>Jobs?}
    
    MoreJobs -->|Yes| ForEachJob
    MoreJobs -->|No| ValidateSum
    
    ApplyToFirst --> AssignFullDeposit[Assign Full Deposit<br/>to Job 1]
    AssignFullDeposit --> ZeroOthers[Set Deposit = 0<br/>for Other Jobs]
    ZeroOthers --> ValidateSum
    
    AdminSpecifies --> ManualEntry[Admin Enters Deposit<br/>for Each Job]
    ManualEntry --> ValidateSum
    
    ValidateSum[Validate: Sum of Job Deposits<br/>= Quote Deposit]
    
    ValidateSum --> SumCheck{Sum<br/>Matches?}
    
    SumCheck -->|No| AdjustRounding[Apply Rounding<br/>Adjustment to Last Job]
    SumCheck -->|Yes| UpdateJobs
    
    AdjustRounding --> UpdateJobs[Update All Job Records<br/>with Deposit Amounts]
    
    UpdateJobs --> UpdateBalances[Calculate Balance Due<br/>for Each Job]
    
    UpdateBalances --> LogDistribution[Log Deposit Distribution<br/>in Activity Timeline]
    
    LogDistribution --> End
    
    style Start fill:#e1f5ff
    style CheckDeposit fill:#fff9c4
    style DistributionMethod fill:#ffe0b2
    style CalcProportional fill:#c8e6c9
    style ValidateSum fill:#fff59d
    style SumCheck fill:#ffe0b2
    style UpdateJobs fill:#a5d6a7
    style End fill:#81c784
```

---

## 5. Quote Status Update Flow

```mermaid
flowchart TD
    Start([Jobs Created Successfully]) --> CountJobs[System: Count Created Jobs]
    
    CountJobs --> UpdateQuoteStatus[System: Update Quote Status]
    
    UpdateQuoteStatus --> SetConverted[Set Status:<br/>Converted X jobs]
    
    SetConverted --> UpdateJobFields[Update Quote Fields:<br/>jobsCreated = true<br/>jobIds = array<br/>jobCount = X]
    
    UpdateJobFields --> InitFinancials[Initialize Financial Tracking:<br/>totalInvoiced = 0<br/>totalPaid = 0<br/>balanceRemaining = quote total]
    
    InitFinancials --> LogActivity[Log Activity:<br/>X jobs created from quote]
    
    LogActivity --> CheckNotify{Customer<br/>Notification<br/>Needed?}
    
    CheckNotify -->|Yes| SendNotification[Send Notification:<br/>Jobs scheduled from your quote]
    CheckNotify -->|No| UpdateUI
    
    SendNotification --> UpdateUI[Update UI:<br/>Show Jobs Section<br/>Update Button State]
    
    UpdateUI --> End([End])
    
    style Start fill:#e1f5ff
    style UpdateQuoteStatus fill:#fff9c4
    style InitFinancials fill:#c8e6c9
    style CheckNotify fill:#ffe0b2
    style UpdateUI fill:#a5d6a7
    style End fill:#81c784
```

---

## 6. Additional Job Creation Flow

```mermaid
flowchart TD
    Start([Admin Clicks Create Additional Job]) --> CheckQuote[System: Check Quote Status]
    
    CheckQuote --> QuoteStatus{Quote<br/>Status?}
    
    QuoteStatus -->|Not Converted| ErrorNotConverted[Error: No jobs created yet<br/>Use Convert to Job first]
    QuoteStatus -->|Converted| CheckItems
    
    ErrorNotConverted --> Abort([Abort])
    
    CheckItems[System: Check Remaining<br/>Unassigned Items]
    
    CheckItems --> HasItems{Unassigned<br/>Items?}
    
    HasItems -->|No| PromptAddItems[Prompt: Add new items<br/>to quote first?]
    HasItems -->|Yes| ShowItemSelection
    
    PromptAddItems --> AdminDecision{Admin<br/>Decision?}
    
    AdminDecision -->|Add Items| RedirectQuoteEdit[Redirect to Quote Edit<br/>to Add Line Items]
    AdminDecision -->|Cancel| Abort
    
    RedirectQuoteEdit --> ItemsAdded{Items<br/>Added?}
    ItemsAdded -->|Yes| ShowItemSelection
    ItemsAdded -->|No| Abort
    
    ShowItemSelection[System: Show Item<br/>Selection Screen]
    
    ShowItemSelection --> AdminSelects[Admin: Select Items<br/>for New Job]
    
    AdminSelects --> ConfigureJob[Admin: Configure Job<br/>Name, Date, Priority, Notes]
    
    ConfigureJob --> ValidateJob[System: Validate Job]
    
    ValidateJob --> ValidationResult{Valid?}
    
    ValidationResult -->|No| ShowErrors[Show Validation Errors]
    ShowErrors --> AdminSelects
    
    ValidationResult -->|Yes| CreateJob[Admin: Click Create Job]
    
    CreateJob --> GenerateID[System: Generate Job ID<br/>Next in Sequence]
    
    GenerateID --> CreateRecord[System: Create Job Record]
    
    CreateRecord --> LinkToQuote[System: Link to Quote<br/>Add to jobIds array]
    
    LinkToQuote --> UpdateQuoteCount[System: Update Quote<br/>jobCount += 1]
    
    UpdateQuoteCount --> DistributeDeposit[System: Recalculate<br/>Deposit Distribution]
    
    DistributeDeposit --> LogActivity[Log Activity:<br/>Additional job created]
    
    LogActivity --> ShowSuccess[Show Success Message]
    
    ShowSuccess --> RedirectJob[Redirect to New Job Detail]
    
    RedirectJob --> End([End])
    
    style Start fill:#e1f5ff
    style QuoteStatus fill:#fff9c4
    style HasItems fill:#ffe0b2
    style ValidationResult fill:#ffe0b2
    style ErrorNotConverted fill:#ffcdd2
    style ShowErrors fill:#ffcdd2
    style CreateJob fill:#a5d6a7
    style End fill:#81c784
```

---

## Document Version

- **Version:** 1.0
- **Date:** November 6, 2024
- **Companion to:** JOB_CREATION_PROCESS.md
