# Complete Flow Example: 2 Services (Cleaning + Mowing)

## Case Overview

**Scenario:** Customer books 2 different services requiring different staff and schedules

### Quote Details

- **Customer:** John Smith
- **Address:** 123 Main St, Melbourne
- **Quote ID:** Q-2024-001

### Services

| Item | Qty | Price | Total |
|------|-----|-------|-------|
| Cleaning Service | 2 hrs | $50/hr | $100 |
| Grass Mowing | 2 hrs | $60/hr | $120 |
| Herbicide | 1 | $45 | $45 |
| **TOTAL** | | | **$265** |

---

## PHASE 1: Quote Creation & Approval

### Step 1: Manager Creates Quote
**Time:** Nov 1, 10:00 AM

```
Manager → System: Create Quote

QUOTE STATUS: Draft
```

---

### Step 2: Manager Sends Quote
**Time:** Nov 1, 10:30 AM

```
Manager → System: Send Quote to Customer
System → Customer: Deliver Quote (Email)

QUOTE STATUS: Draft → Sent
```

---

### Step 3: Customer Approves Quote
**Time:** Nov 2, 3:00 PM

```
Customer → Manager: 🖐️ "Approved!" (via WhatsApp)
Manager → System: Record Approval

QUOTE STATUS: Sent → Approved
```

---

## PHASE 2: Job Creation - Split into 2 Jobs

### Step 4: Manager Splits Quote into Multiple Jobs
**Time:** Nov 2, 3:15 PM

**Manager Action:** Clicks "Split into Multiple Jobs"

#### Job 1: House Cleaning

| Field | Value |
|-------|-------|
| **Job ID** | J-2024-001 |
| **Items** | Cleaning Service (2 hrs) |
| **Amount** | $100 |
| **Date** | Nov 5, 2024 |
| **Time** | 9:00 AM - 11:00 AM |
| **Assignment Type** | Individual Staff |
| **Assigned Staff** | Sarah Lee (Cleaner) |
| **Priority** | Normal |

```
JOB 1 CREATED: J-2024-001
Status: Scheduled
Staff: Sarah Lee (1 person)
```

#### Job 2: Grass Mowing + Herbicide

| Field | Value |
|-------|-------|
| **Job ID** | J-2024-002 |
| **Items** | Grass Mowing (2 hrs) + Herbicide |
| **Amount** | $165 |
| **Date** | Nov 6, 2024 |
| **Time** | 8:00 AM - 10:00 AM |
| **Assignment Type** | Individual Staff |
| **Assigned Staff** | Mike Johnson (Gardener) |
| **Priority** | Normal |

```
JOB 2 CREATED: J-2024-002
Status: Scheduled
Staff: Mike Johnson (1 person)
```

### Result Structure

```
QUOTE Q-2024-001: Approved
├─ Job 1 (J-2024-001): Scheduled - Sarah Lee - Nov 5, 9 AM
└─ Job 2 (J-2024-002): Scheduled - Mike Johnson - Nov 6, 8 AM
```

---

## PHASE 3: Job 1 Execution (Cleaning - Nov 5)

### Step 5: Sarah Starts Job 1
**Time:** Nov 5, 9:05 AM

```
Sarah → System: Start Job

JOB 1 STATUS: Scheduled → In Progress
```

---

### Step 6: Sarah Completes Job 1
**Time:** Nov 5, 11:10 AM

```
Sarah → System: Upload 3 photos
Sarah → System: Add note "Kitchen, living room cleaned"
Sarah → System: Mark Complete

JOB 1 STATUS: In Progress → Completed
```

---

### Step 7: Manager Approves Job 1
**Time:** Nov 5, 11:30 AM

```
Manager → System: Approve Completion

JOB 1 STATUS: Completed → Approved
```

---

### Step 8: Invoice Generated for Job 1
**Time:** Nov 5, 11:31 AM (automatic)

```
System → Generate Invoice

JOB 1 STATUS: Approved → Invoiced

INVOICE INV-2024-001:
- Cleaning Service: $100
- Tax (10%): $10
- TOTAL: $110

System → Customer: Send invoice via Email/WhatsApp
```

**Current State:**
- **QUOTE:** Approved (waiting for Job 2)
- **JOB 1:** Invoiced ($110)
- **JOB 2:** Scheduled (tomorrow)

---

## PHASE 4: Job 2 Execution (Mowing - Nov 6)

### Step 9: Mike Starts Job 2
**Time:** Nov 6, 8:05 AM

```
Mike → System: Start Job

JOB 2 STATUS: Scheduled → In Progress
```

---

### Step 10: Change Order - Extra Herbicide Needed
**Time:** Nov 6, 9:30 AM

#### 🖐️ Manual Communication Flow:

1. **Mike → Manager:** "Lawn bigger than expected, need 1 more herbicide ($45)"
2. **Manager → Customer:** "Need extra herbicide +$45. OK?" (WhatsApp)
3. **Customer → Manager:** "Yes, go ahead"
4. **Manager → Mike:** "Approved, proceed" (WhatsApp)

#### System Actions:

```
Manager → System: Create Change Order
CO-001 STATUS: Pending
Linked to: Job 2 (J-2024-002)
Items: Herbicide x1 = $45

Manager → System: Record CO Approval
CO-001 STATUS: Pending → Approved

System → Updates Job 2:
- Original: $165
- With CO: $165 + $45 = $210
```

---

### Step 11: Mike Completes Job 2
**Time:** Nov 6, 10:15 AM

```
Mike → System: Upload 4 photos
Mike → System: Add note "Lawn mowed, 2 bottles herbicide applied"
Mike → System: Mark Complete

JOB 2 STATUS: In Progress → Completed
```

---

### Step 12: Manager Approves Job 2
**Time:** Nov 6, 10:45 AM

```
Manager → System: Approve Completion

JOB 2 STATUS: Completed → Approved
```

---

### Step 13: Invoice Generated for Job 2
**Time:** Nov 6, 10:46 AM (automatic)

```
System → Generate Invoice

JOB 2 STATUS: Approved → Invoiced

INVOICE INV-2024-002:
- Grass Mowing (2 hrs): $120
- Herbicide (2 bottles): $90
- Tax (10%): $21
- TOTAL: $231

System → Customer: Send invoice via Email/WhatsApp
```

---

## PHASE 5: Payment & Closure

### Step 14: Customer Pays Invoice 1
**Time:** Nov 7, 2:00 PM

```
Customer → Bank: 🖐️ Pay $110 for Invoice 1
Manager → System: Record payment for Job 1

JOB 1 STATUS: Invoiced → Paid
```

---

### Step 15: Customer Pays Invoice 2 & Quote Closes
**Time:** Nov 8, 10:00 AM

```
Customer → Bank: 🖐️ Pay $231 for Invoice 2
Manager → System: Record payment for Job 2

JOB 2 STATUS: Invoiced → Paid

System checks: All jobs paid?
- Job 1: Paid ✅
- Job 2: Paid ✅

System → Auto-close quote

QUOTE STATUS: Approved → Closed - Won
```

### ✅ FINAL STATE

- **Quote Q-2024-001:** Closed - Won
- **Job 1 (J-2024-001):** Paid
- **Job 2 (J-2024-002):** Paid
- **Change Order CO-001:** Approved (applied to Job 2)
- **Total Revenue:** $341 (including tax)

---

## Complete Status Timeline

| Time | Quote Status | Job 1 Status | Job 2 Status | CO-001 | Event |
|------|-------------|--------------|--------------|--------|-------|
| Nov 1, 10:00 AM | **Draft** | - | - | - | Manager creates quote |
| Nov 1, 10:30 AM | **Sent** | - | - | - | Manager sends quote |
| Nov 2, 3:00 PM | **Approved** | - | - | - | 🖐️ Customer approves |
| Nov 2, 3:15 PM | Approved | **Scheduled** | **Scheduled** | - | Manager splits into 2 jobs |
| Nov 5, 9:05 AM | Approved | **In Progress** | Scheduled | - | Sarah starts Job 1 |
| Nov 5, 11:10 AM | Approved | **Completed** | Scheduled | - | Sarah completes Job 1 |
| Nov 5, 11:30 AM | Approved | **Approved** | Scheduled | - | Manager approves Job 1 |
| Nov 5, 11:31 AM | Approved | **Invoiced** | Scheduled | - | Invoice 1 generated |
| Nov 6, 8:05 AM | Approved | Invoiced | **In Progress** | - | Mike starts Job 2 |
| Nov 6, 9:30 AM | Approved | Invoiced | In Progress | **Pending** | 🖐️ Mike requests extra herbicide |
| Nov 6, 9:45 AM | Approved | Invoiced | In Progress | **Approved** | 🖐️ Customer approves CO |
| Nov 6, 10:15 AM | Approved | Invoiced | **Completed** | Approved | Mike completes Job 2 |
| Nov 6, 10:45 AM | Approved | Invoiced | **Approved** | Approved | Manager approves Job 2 |
| Nov 6, 10:46 AM | Approved | Invoiced | **Invoiced** | Approved | Invoice 2 generated |
| Nov 7, 2:00 PM | Approved | **Paid** | Invoiced | Approved | Customer pays Invoice 1 |
| Nov 8, 10:00 AM | **Closed - Won** | Paid | **Paid** | Approved | Customer pays Invoice 2, quote closes |

---

## Visual Flow Diagram

```
QUOTE Q-2024-001 ($265 → $310 with CO)
│
├─ JOB 1: House Cleaning ($100)
│   ├─ Staff: Sarah Lee (Cleaner)
│   ├─ Schedule: Nov 5, 9:00 AM - 11:00 AM
│   ├─ Items: Cleaning Service (2 hrs)
│   ├─ Invoice: INV-2024-001 ($110 incl. tax)
│   └─ Status Flow: Scheduled → In Progress → Completed → Approved → Invoiced → Paid ✅
│
└─ JOB 2: Grass Mowing ($165 → $210 with CO)
    ├─ Staff: Mike Johnson (Gardener)
    ├─ Schedule: Nov 6, 8:00 AM - 10:00 AM
    ├─ Items: Grass Mowing (2 hrs), Herbicide (2 bottles)
    ├─ Change Order: CO-001 (+$45 extra herbicide)
    ├─ Invoice: INV-2024-002 ($231 incl. tax)
    └─ Status Flow: Scheduled → In Progress → Completed → Approved → Invoiced → Paid ✅
```

---

## ALTERNATIVE CASE 1: Concurrent Jobs (Same Time)

### Scenario
Customer requests: "Can you do both cleaning and mowing on Nov 5 at 9 AM?"

### Job Creation (Modified)

#### Job 1: Cleaning
- Date: Nov 5, 9:00 AM
- Staff: Sarah Lee (Cleaner)

#### Job 2: Mowing
- Date: Nov 5, 9:00 AM (SAME TIME!)
- Staff: Mike Johnson (Gardener)

### System Alert

```
⚠️ CONCURRENT JOB DETECTED

Job 1 and Job 2 scheduled at same time/location.
✅ Different staff (Sarah ≠ Mike)
✅ Different work areas (indoor vs outdoor)

[✓] Confirm concurrent jobs
```

### Execution Flow

```
Nov 5, 9:05 AM
Sarah → System: Start Job 1
JOB 1 STATUS: In Progress

Mike → System: Start Job 2
JOB 2 STATUS: In Progress

Both work simultaneously at same location!

11:10 AM - Sarah completes Job 1
11:15 AM - Mike completes Job 2
```

**Result:** Both jobs tracked independently despite same time!

---

## ALTERNATIVE CASE 2: Team Assignment for Job 1

### Scenario
House is very large, needs 3 cleaners working together

### Job Creation (Modified)

#### Job 1: Cleaning (TEAM)
- Date: Nov 5, 9:00 AM
- **Assignment Type:** Team (Multiple Staff)
- **Assigned Team:** Cleaning Team A
  - Sarah Lee (Team Lead)
  - Mike Johnson
  - Lisa Chen
- Total: 3 staff members

```
JOB 1 CREATED: J-2024-001
Status: Scheduled
Staff: Team (3 members)
```

### Notifications

**Sarah (Team Lead) receives:**
```
📱 New job - You're team lead
Team: Sarah (you), Mike, Lisa
Nov 5, 9 AM at 123 Main St
```

**Mike & Lisa receive:**
```
📱 New job - Team member
Team Lead: Sarah
Nov 5, 9 AM at 123 Main St
```

### Execution Flow

```
Nov 5, 9:05 AM
Sarah (Team Lead) → System: Start Job for Team
System prompts: Start for all 3 members?
Sarah confirms

JOB 1 STATUS: Scheduled → In Progress
All 3 staff checked in

11:30 AM
Sarah → System: Mark Complete (for whole team)

JOB 1 STATUS: In Progress → Completed
```

**Invoice:** Still 1 invoice for Job 1 ($110), even with 3 people

---

## ALTERNATIVE CASE 3: Team for Both Jobs

### Scenario
Both jobs need teams

#### Job 1: Cleaning (TEAM)
- Team: Sarah, Mike, Lisa (3 cleaners)
- Date: Nov 5, 9:00 AM

#### Job 2: Mowing (TEAM)
- Team: Bob, Mark (2 gardeners)
- Date: Nov 6, 8:00 AM

### Result Structure

```
QUOTE Q-2024-001
├─ Job 1: Team (3 cleaners) - Nov 5
└─ Job 2: Team (2 gardeners) - Nov 6

Total: 5 staff members across 2 jobs
```

---

## ALTERNATIVE CASE 4: Quality Issue - Rework

### Scenario
Manager finds issue with Job 1 completion

```
Nov 5, 11:30 AM
Manager reviews Job 1 photos
Manager notices: Bathroom not cleaned properly

Manager → System: Flag for Rework
JOB 1 STATUS: Completed → Rework Required

Manager → Sarah: 🖐️ "Please return to clean bathroom" (WhatsApp)

Nov 5, 3:00 PM
Sarah → System: Start Rework
JOB 1 STATUS: Rework Required → In Progress

Sarah → System: Complete Rework (upload new photos)
JOB 1 STATUS: In Progress → Completed

Manager → System: Approve
JOB 1 STATUS: Completed → Approved → Invoiced
```

---

## ALTERNATIVE CASE 5: Payment Overdue

### Scenario
Customer doesn't pay on time

```
Nov 12 (7 days after invoice)
System detects: Invoice 1 overdue

JOB 1 STATUS: Invoiced → Overdue

System → Manager: Alert "Invoice INV-2024-001 overdue"

Manager → Customer: 🖐️ "Friendly reminder, invoice $110 overdue" (WhatsApp)

Nov 14
Customer → Bank: 🖐️ Pay $110 (late)
Manager → System: Record payment

JOB 1 STATUS: Overdue → Paid
```

---

## Key Takeaways

### Why Split into 2 Jobs?

1. **Different Services** = Different job types (cleaning vs mowing)
2. **Different Staff** = Separate accountability (cleaner vs gardener)
3. **Different Schedules** = Flexibility (Nov 5 vs Nov 6)
4. **Independent Completion** = Better tracking (one can finish before other)
5. **Flexible Invoicing** = Customer can pay separately if needed
6. **Better Reporting** = See cleaning revenue vs mowing revenue separately

### Status Flow Rules

1. **Quote Status** stays "Approved" throughout job execution
2. **Quote closes** only when ALL jobs are paid
3. **Each Job** has independent lifecycle (Scheduled → Paid)
4. **Change Orders** only affect the specific job they're linked to
5. **Invoices** generated per job (2 invoices in this case)
6. **Manual activities** (🖐️) happen outside system but get recorded

### Assignment Options

| Scenario | Assignment Type | Example |
|----------|----------------|---------|
| Simple service, 1 person | Individual Staff | Sarah (cleaner) |
| Large job, multiple people | Team (Pre-defined) | Cleaning Team A (3 members) |
| Custom team selection | Team (Custom) | Select Sarah + Mike + Lisa |
| Same time, different services | 2 Individual Staff | Sarah (cleaning) + Mike (mowing) |
| Same time, same service | Team | 3 cleaners working together |

### Payment Scenarios

| Scenario | How It Works |
|----------|--------------|
| **Separate Payments** | Customer pays Invoice 1 ($110), then Invoice 2 ($231) |
| **Combined Payment** | Customer pays total ($341) at once, manager allocates to both jobs |
| **Partial Payment** | Customer pays Invoice 1, delays Invoice 2 → Job 2 goes Overdue |
| **Late Payment** | Invoice overdue → System alerts manager → Customer pays late |

---

## System Automation Points

### Automatic Actions

1. **Invoice Generation**: When job approved → auto-generate invoice
2. **Quote Closure**: When all jobs paid → auto-close quote as "Won"
3. **Overdue Detection**: 7 days after invoice → auto-flag as overdue
4. **Status Updates**: When staff marks complete → auto-update job status
5. **Notifications**: When job created → auto-notify assigned staff

### Manual Actions (🖐️)

1. **Customer Approval**: Customer approves quote via WhatsApp/Email
2. **Change Order Request**: Staff calls manager for extra work
3. **Change Order Approval**: Manager asks customer, customer approves
4. **Payment**: Customer transfers money to bank
5. **Payment Recording**: Manager records payment in system
6. **Quality Check**: Manager reviews photos and approves completion

---

## Data Model Summary

```javascript
Quote {
  id: "Q-2024-001"
  status: "Closed - Won"
  customer: "John Smith"
  total: 310 // Updated with CO
  jobs: [
    {
      id: "J-2024-001",
      status: "Paid",
      amount: 100,
      staff: ["Sarah Lee"],
      invoice_id: "INV-2024-001"
    },
    {
      id: "J-2024-002",
      status: "Paid",
      amount: 210, // Updated with CO
      staff: ["Mike Johnson"],
      invoice_id: "INV-2024-002",
      change_orders: ["CO-001"]
    }
  ]
}

ChangeOrder {
  id: "CO-001"
  quote_id: "Q-2024-001"
  job_id: "J-2024-002"
  status: "Approved"
  items: [{ name: "Herbicide", qty: 1, price: 45 }]
  total: 45
}

Invoice {
  id: "INV-2024-001"
  job_id: "J-2024-001"
  amount: 110 // Including tax
  status: "Paid"
  payment_date: "2024-11-07"
}

Invoice {
  id: "INV-2024-002"
  job_id: "J-2024-002"
  amount: 231 // Including tax and CO
  status: "Paid"
  payment_date: "2024-11-08"
}
```

---

## Conclusion

This complete flow demonstrates:

- ✅ How 1 quote splits into 2 jobs for different services
- ✅ Independent job execution and tracking
- ✅ Change order handling during job execution
- ✅ Separate invoicing per job
- ✅ Quote closure when all jobs paid
- ✅ Team assignment options (individual vs team)
- ✅ Concurrent job handling (same time, different staff)
- ✅ Quality control and rework process
- ✅ Payment tracking and overdue management

**Total Duration:** 7 days (Nov 1 - Nov 8)  
**Total Revenue:** $341 (including tax)  
**Jobs Completed:** 2  
**Staff Involved:** 2 (Sarah, Mike)  
**Change Orders:** 1 (extra herbicide)
