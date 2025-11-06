# Job Creation Process - Multiple Jobs Per Quote

## Overview

This document details the job creation process with support for **creating multiple jobs per quote**. This allows franchisees to split a single quote into multiple jobs for different dates, teams, or service phases.

---

## 1. Multiple Jobs Per Quote - Use Cases

**Why Multiple Jobs Per Quote?**

1. **Multi-day Projects:** Large project requiring work over several days
2. **Phased Services:** Initial consultation + follow-up sessions
3. **Different Teams:** Different services requiring different specialist teams
4. **Recurring Services:** Monthly/weekly services from one quote
5. **Split Scheduling:** Customer wants services on different dates
6. **Resource Constraints:** Not enough staff to complete all work in one visit

**Example Scenarios:**
- Quote for "Complete Home Tutoring Package" → 4 jobs (one per week)
- Quote for "Office Cleaning + Deep Clean" → 2 jobs (regular cleaning + deep clean on different days)
- Quote for "Pest Control Initial + Follow-up" → 2 jobs (initial treatment + 2-week follow-up)

---

## 2. Job Creation Flow

### 2.1 Single Job Creation (Default)

**Process:**
1. Admin navigates to Quote Detail page
2. Quote status must be "Accepted"
3. Admin clicks "Convert to Job" button
4. System shows Job Creation Modal

**Job Creation Modal:**
```
┌─────────────────────────────────────────────────────────────┐
│  Create Job from Quote Q-2024-001                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ○ Create Single Job (All items)                           │
│  ○ Create Multiple Jobs (Split items)                      │
│                                                             │
│  [Continue]  [Cancel]                                       │
└─────────────────────────────────────────────────────────────┘
```

**If "Create Single Job" selected:**
- System creates one job with all quote line items
- Job ID: J-2024-001
- All quote data auto-populated
- Status: Scheduled
- Admin redirected to Job Detail page

### 2.2 Multiple Jobs Creation

**Process:**

#### Step 1: Item Distribution Interface

System shows Job Distribution Screen with:
- Available line items (drag-and-drop or checkbox selection)
- Job cards (can add/remove jobs)
- Real-time total calculation
- Validation warnings

**Key Features:**
- Drag items from "Available" to specific job cards
- Add/remove job cards dynamically
- Each job shows subtotal, tax, and total
- Visual validation (remaining items, total match)

#### Step 2: Item Assignment Methods

**Method A: Drag & Drop**
- Drag line items from "Available" to specific job cards
- Visual feedback during drag

**Method B: Checkbox Selection**
- Select items with checkboxes
- Click "Assign to Job X" button

**Method C: Quick Split**
- "Split Evenly" button distributes items equally
- "Split by Service Type" groups similar services

#### Step 3: Job Configuration

For each job, admin can configure:
- Job Name/Description (optional)
- Scheduled Date (optional at creation)
- Priority (inherits from quote, can override)
- Notes (specific to this job)

#### Step 4: Validation & Creation

**System Validations:**
- All quote items must be assigned
- Each job must have at least one line item
- Sum of all job totals must equal quote total
- No item can be split across multiple jobs

**When "Create All Jobs" clicked:**
1. System validates all jobs
2. Creates job records in database
3. Each job links to original quote
4. Quote status updates to "Converted (X jobs)"
5. Success message with job IDs
6. Admin redirected to Job List filtered by quote

---

## 3. Data Model

### 3.1 Quote Entity Updates

```javascript
{
  id: "Q-2024-001",
  
  // Job Tracking
  jobsCreated: true,
  jobIds: ["J-2024-001", "J-2024-002", "J-2024-003"],
  jobCount: 3,
  jobCreationType: "multiple",
  
  // Financial tracking
  totalInvoiced: 1265.00,
  totalPaid: 495.00,
  balanceRemaining: 770.00
}
```

### 3.2 Job Entity with Quote Reference

```javascript
{
  id: "J-2024-001",
  
  // Quote Reference
  quoteId: "Q-2024-001",
  isPartOfMultiJobQuote: true,
  jobSequence: 1,
  totalJobsInQuote: 3,
  siblingJobIds: ["J-2024-002", "J-2024-003"],
  
  // Job-specific fields
  jobName: "Week 1 Math Session",
  lineItems: [...],
  total: 495.00
}
```

---

## 4. UI Components

### 4.1 Quote Detail Page - Jobs Section

**New Section: "Jobs Created from This Quote"**

Shows list of all jobs created from quote with:
- Job ID and name
- Status badge
- Schedule date and team
- Total amount
- Line items summary
- "View Job" button

**Financial Summary:**
- Total Invoiced
- Total Paid
- Balance Remaining

### 4.2 Convert to Job Button States

**Before Jobs Created:**
- "Convert to Job" (emerald button)

**After Jobs Created:**
- "Create Additional Job" (blue button)

**All Items Assigned:**
- Disabled state with message

---

## 5. Business Rules

### 5.1 Job Creation Rules

**Single Job:**
- All quote line items included
- Job total = Quote total
- One job ID generated

**Multiple Jobs:**
- All quote line items must be assigned
- Each job must have ≥1 line item
- Sum of job totals = Quote total
- No partial quantities allowed
- 2-10 jobs per quote (configurable limit)

### 5.2 Deposit Handling

**Recommended: Proportional Distribution**

Each job receives proportional share of deposit:
```
Job Deposit = (Job Total / Quote Total) * Quote Deposit
```

Example:
- Quote Total: $1,650, Deposit: $825 (50%)
- Job 1: $495 → Deposit $247.50
- Job 2: $660 → Deposit $330.00
- Job 3: $110 → Deposit $55.00

### 5.3 Quote Status with Multiple Jobs

**Status Transitions:**
- "Accepted" → "Converted (3 jobs)" when jobs created
- → "Closed" only when ALL jobs are paid

**Quote Closure Rule:**
```
Quote closes when:
- All jobs status = "Paid" OR "Cancelled"
- Total paid = Quote total
- No outstanding balance
```

---

## 6. User Workflows

### 6.1 Create Multiple Jobs for Weekly Tutoring

1. Admin creates quote with 4 tutoring sessions
2. Customer approves quote
3. Admin clicks "Convert to Job"
4. Selects "Create Multiple Jobs"
5. Clicks "Split Evenly" → 4 jobs created
6. Admin configures each job with different dates
7. Clicks "Create All Jobs"
8. System creates 4 jobs, each scheduled for different week

### 6.2 Create Jobs for Different Service Types

1. Quote has Regular Cleaning + Deep Clean
2. Admin creates 2 jobs:
   - Job 1: Regular Cleaning (this week)
   - Job 2: Deep Clean (next month)
3. Different teams assigned to each job
4. Each job invoiced separately

---

## 7. Edge Cases

### 7.1 Customer Cancels One Job

**Scenario:** 3 jobs created, customer cancels Job 2

**Handling:**
1. Admin cancels Job 2
2. Job 2 amount removed from invoiced total
3. Quote status remains "Converted (3 jobs)"
4. Financial summary updates
5. If deposit applied, issue credit or apply to remaining jobs

### 7.2 Add Additional Job Later

**Scenario:** Customer requests extra service

**Handling:**
1. Admin opens Quote Detail
2. Clicks "Create Additional Job"
3. If no items remaining, admin adds new line items to quote first
4. New job created with new items
5. Quote total updated

---

## Document Version

- **Version:** 1.0
- **Date:** November 6, 2024
- **Status:** Ready for Implementation
