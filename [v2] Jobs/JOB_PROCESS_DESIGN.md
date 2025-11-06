# Job Process Design Document

## Executive Summary

This document defines the complete job process design for the FMS (Franchise Management System), integrating insights from the quote management UI, job workflow sequences, and status transition flows.

---

## 1. Job Creation Process

### 1.1 From Approved Quote (Primary Path)

**Trigger:** Customer approves quote (recorded manually by admin)

**Process:**
1. Admin navigates to Quote Detail page (`quote_edit.html`)
2. Admin changes quote status to "Accepted"
3. "Convert to Job" button becomes visible
4. Admin clicks "Convert to Job"
5. System auto-populates job with quote data:
   - Customer information (name, email, phone, address)
   - Service address and access instructions
   - All line items with quantities and pricing
   - Subtotal, tax breakdown, total amount
   - Deposit information (if applicable)
   - Customer notes and internal notes
   - Quote ID reference

**Auto-filled Job Fields:**
- Job ID: Auto-generated (format: J-YYYY-NNN)
- Quote Reference: Links to original quote
- Customer: All contact details
- Service Location: Address + access instructions
- Line Items: Complete catalog items with pricing
- Financial Summary: Subtotal, taxes, total, deposit
- Initial Status: **Scheduled** (default)
- Created Date: System timestamp

### 1.2 Manual Job Creation (Secondary Path)

**Trigger:** Admin needs to create job without quote

**Process:**
1. Admin clicks "Create Job" from Job List page
2. System presents `job_create.html` form (similar to `quote_create.html`)
3. Admin manually enters:
   - Customer (search existing or create new)
   - Service address and access instructions
   - Line items (search catalog and add)
   - Schedule date/time (optional at creation)
   - Priority level
   - Notes
4. System generates Job ID and sets Status = **Scheduled**

**Required Fields:**
- Customer (mandatory)
- At least one line item (mandatory)
- Service address (mandatory)
- Priority (default: Medium)

---

## 2. Job Scheduling & Assignment

### 2.1 Auto-Schedule with Admin Confirmation

**Design Philosophy:** System proposes optimal schedule; admin confirms or modifies.

**Process Flow:**

#### Step 1: System Proposal
When job is created, system automatically:
1. Analyzes job requirements:
   - Required skills (from line items)
   - Estimated duration (from catalog items)
   - Service location
   - Priority level

2. Evaluates available resources:
   - Team/staff availability
   - Current workload
   - Skill matching
   - Travel time from previous jobs

3. Generates proposal:
   - Recommended date/time slot
   - Suggested team/staff assignment
   - Estimated travel time
   - Confidence score

#### Step 2: Admin Review & Confirmation
System presents proposal modal with recommended schedule and assignment.

**Admin Actions:**
- **Confirm:** Accept proposal → Calendar blocked, staff notified
- **Modify:** Open scheduling interface → Select different date/time/team
- **Skip for Now:** Job remains unassigned → Appears in "Unassigned Jobs" queue

### 2.2 Reschedule & Reassign

**Reschedule Process:**
1. Admin opens Job Detail
2. Clicks "Reschedule" button
3. Selects new date/time
4. System validates availability and conflicts
5. Admin confirms
6. System updates calendar, notifies staff, logs activity
7. Status changes to **Rescheduled**

**Reassign Process:**
1. Admin opens Job Detail
2. Clicks "Reassign" button
3. Selects new team/members
4. System validates skills and capacity
5. Admin confirms
6. System updates assignment, notifies all parties
7. Status remains **Scheduled** or **Rescheduled**

---

## 3. Job Execution & Field Operations

### 3.1 Job Start (Check-in)

**Actor:** Assigned Staff

**Process:**
1. Staff opens assigned job
2. Reviews job details (customer, address, scope)
3. Clicks "Start Job" button
4. System:
   - Records start timestamp
   - Changes status to **In Progress**
   - Notifies admin
   - Starts time tracking

### 3.2 During Execution

**Staff Actions:**
- **Add Notes:** Text updates, observations, issues
- **Take Photos:** Before/during/after photos
- **Update Progress:** Checklist items
- **Report Issues:** Equipment failure, customer concerns
- **Request Change Order:** Additional work discovered

### 3.3 Job Pause (On Hold)

**Trigger:** Work interrupted (weather, missing materials, customer unavailable)

**Process:**
1. Staff clicks "Pause Job"
2. System prompts for reason
3. Status changes to **On Hold**
4. Admin notified
5. Staff can resume later → Status returns to **In Progress**

---

## 4. Change Order Management

### 4.1 Change Order Types

**A. Additive Change Order**
- Additional work discovered during execution
- Increases job scope and price

**B. Deductive Change Order**
- Work removed from original scope
- Decreases job scope and price
- **Special Handling:** If deposit paid, issue credit memo

### 4.2 Change Order Process

**Step 1: Staff Identifies Need**
1. Staff discovers additional/changed work
2. Takes photos and notes
3. Contacts admin (via WhatsApp or in-app)
4. Provides description, photos, estimated time/materials

**Step 2: Admin Creates Change Order**
1. Admin opens Job Detail
2. Clicks "Create Change Order"
3. Fills form:
   - Change Order ID: Auto-generated (CO-YYYY-NNN)
   - Type: Add / Deduct
   - Description
   - Line Items: Add/remove from catalog
   - Photos: Upload from staff
   - Reason: Dropdown

4. System calculates:
   - Original job total
   - Change order amount (+ or -)
   - New job total
   - Tax adjustments
   - Deposit impact

**Step 3: Customer Approval**
1. Admin sends Change Order to customer (Email/WhatsApp)
2. Document includes original vs new scope and pricing
3. Customer responds: Approve / Decline / Request modification

**Step 4: Admin Records Decision**

**If Approved:**
1. Admin clicks "Approve Change Order"
2. System updates job line items, recalculates totals
3. If deductive CO and deposit paid → Generate credit memo
4. Admin notifies staff to proceed
5. Job status returns to **In Progress**

**If Declined:**
1. Admin clicks "Decline Change Order"
2. System marks CO as **Declined**
3. No changes to job scope or price
4. Admin notifies staff to continue with original scope
5. Job status returns to **In Progress**

---

## 5. Job Completion & Quality Control

### 5.1 Job Completion by Staff

**Process:**
1. Staff finishes all work items
2. Uploads final photos
3. Adds completion notes
4. Clicks "Mark Job Completed"
5. System:
   - Records completion timestamp
   - Calculates actual duration
   - Changes status to **Completed**
   - Notifies admin for quality review

### 5.2 Admin Quality Review

**Process:**
1. Admin receives notification
2. Opens Job Detail
3. Reviews completion notes, photos, time spent

**Admin Decision:**

**A. Approve Completion**
1. Admin clicks "Approve Completion"
2. System changes status to **Approved**
3. Triggers invoice generation

**B. Request Rework**
1. Admin clicks "Request Rework"
2. Provides rework reason and details
3. System changes status to **Rework Required**
4. Notifies assigned staff
5. Staff returns to site
6. Status changes back to **In Progress**
7. Staff completes rework and marks completed again
8. Admin reviews again → Approve

---

## 6. Invoicing & Payment

### 6.1 Invoice Generation

**Trigger:** Job status changes to **Approved**

**Process:**
1. System auto-generates invoice:
   - Invoice ID: Auto-generated (INV-YYYY-NNN)
   - Job and quote references
   - Customer details
   - Line items (including approved change orders)
   - Subtotal, taxes, total
   - Deposit paid (if applicable)
   - Balance due
   - Payment terms and due date

2. System changes job status to **Invoiced**
3. Sends invoice to customer (Email/WhatsApp)
4. Admin notified

### 6.2 Payment Recording

**Process:**
1. Customer makes payment (Bank Transfer/Cash/Credit Card)
2. Admin receives confirmation
3. Admin opens Job Detail
4. Clicks "Record Payment"
5. Fills payment form:
   - Payment Date
   - Payment Method
   - Amount Paid
   - Transaction Reference
   - Notes

6. Admin submits
7. System:
   - Validates payment amount
   - Changes job status to **Paid**
   - Changes quote status to **Closed**
   - Generates payment receipt
   - Sends receipt to customer
   - Updates financial reports

### 6.3 Overdue Payment Handling

**Trigger:** Invoice due date passes without payment

**Process:**
1. System automatically:
   - Changes job status to **Overdue**
   - Sends alert to admin
   - Sends reminder to customer

2. Admin can:
   - Send manual reminder
   - Call customer
   - Apply late fees
   - Escalate to collections

3. When payment received:
   - Admin records payment
   - Status changes to **Paid**

---

## 7. Job Status Lifecycle

### 7.1 Status Definitions

| Status | Description | Color | Icon | Triggered By |
|--------|-------------|-------|------|--------------|
| **Scheduled** | Job created and scheduled with assigned staff | Blue | 📅 | Admin converts quote or creates job |
| **Rescheduled** | Job date/time has been changed | Blue | 🔄 | Admin updates schedule |
| **In Progress** | Staff actively working on job | Yellow | ⚙️ | Staff starts job |
| **On Hold** | Job temporarily paused | Orange | ⏸️ | Staff pauses job |
| **Completed** | Staff finished work, awaiting quality review | Green | ✓ | Staff marks completed |
| **Rework Required** | Quality check failed, needs correction | Red | 🔧 | Admin flags for rework |
| **Approved** | Job completion approved, ready for invoicing | Green | ✅ | Admin approves completion |
| **Invoiced** | Invoice generated and sent to customer | Purple | 💰 | System auto-generates |
| **Overdue** | Payment deadline passed | Red | ⚠️ | System detects overdue |
| **Paid** | Payment received, job closed | Green | 💵 | Admin records payment |
| **Cancelled** | Job cancelled before completion | Red | ✕ | Admin cancels job |

### 7.2 Status Transition Rules

**Valid Transitions:**
- **Scheduled** → In Progress, Rescheduled, Cancelled
- **Rescheduled** → In Progress, Cancelled
- **In Progress** → On Hold, Completed, Cancelled
- **On Hold** → In Progress, Cancelled
- **Completed** → Approved, Rework Required
- **Rework Required** → In Progress
- **Approved** → Invoiced (automatic)
- **Invoiced** → Paid, Overdue
- **Overdue** → Paid
- **Paid** → [Terminal state]
- **Cancelled** → [Terminal state]

---

## 8. UI/UX Design Specifications

### 8.1 Job List Page

**Layout:** Similar to `quote_list.html`

**Components:**
- Page title: "Jobs Management"
- "Create Job" button
- Stats cards: Total Jobs, Scheduled, In Progress, Completed
- Filters: Search, Status, Team, Date Range, Sort
- Table with columns: Job ID, Customer, Address, Schedule, Team, Status, Priority, Total, Actions
- Pagination

### 8.2 Job Detail Page

**Layout:** 2-column (main content + sidebar)

**Main Content:**
1. Customer Information Card
2. Schedule & Assignment Card
3. Line Items Table
4. Activity Timeline
5. Notes & Photos Section

**Sidebar:**
1. Quick Actions Card
2. Financial Summary Card
3. Documents Card

### 8.3 Job Create/Edit Page

**Sections:**
1. Customer Information
2. Schedule & Assignment
3. Line Items
4. Notes
5. Action buttons

---

## 9. Business Rules & Validations

### 9.1 Job Creation Rules
- Customer is mandatory
- At least one line item required
- Service address is mandatory
- Cannot create job from declined/expired quote

### 9.2 Scheduling Rules
- Cannot schedule in the past
- Must check team availability
- Must validate skill requirements
- Cannot double-book resources

### 9.3 Change Order Rules
- Can only create during "In Progress" status
- Requires customer approval before applying
- Deductive CO with paid deposit generates credit memo
- All COs logged in audit trail

### 9.4 Payment Rules
- Cannot record payment before invoice generated
- Payment amount must match balance due (or be partial)
- Overpayment triggers refund process
- Payment closes both job and quote

### 9.5 Cancellation Rules
- Can cancel from any pre-completion status
- Cannot cancel after "Approved" status
- Cancelled jobs are read-only
- Cancellation reason is mandatory
- Customer notification required

---

## 10. Integration Points

### 10.1 Quote System Integration
- Job inherits all quote data
- Quote status updates when job status changes
- Quote closes when job is paid

### 10.2 Customer Management Integration
- Customer data synced bidirectionally
- Service address history tracked
- Customer communication preferences respected

### 10.3 Calendar Integration
- Jobs block team/staff calendars
- Reschedule updates calendar automatically
- Conflict detection before scheduling

### 10.4 Notification System Integration
- Staff notified of assignments/changes
- Admin notified of status changes
- Customer notified of schedule, completion, invoice

### 10.5 Financial System Integration
- Invoice generation triggers accounting entries
- Payment recording updates ledger
- Tax calculations follow regional rules
- Deposit handling integrated with payment flow

---

## 11. Key Design Principles

1. **Quote-to-Job Continuity:** Seamless data flow from quote to job
2. **Admin Confirmation:** System proposes, admin confirms (scheduling)
3. **Audit Trail:** All actions logged with timestamp and actor
4. **Customer Communication:** Manual via Email/WhatsApp (no automated customer portal yet)
5. **Status Enforcement:** Strict status transition rules prevent invalid states
6. **Change Order Transparency:** All scope changes require customer approval
7. **Quality Gate:** Admin approval required before invoicing
8. **Payment Flexibility:** Support for deposits, partial payments, multiple methods

---

## 12. Future Enhancements

1. **Mobile App:** Native iOS/Android app for field staff
2. **Customer Portal:** Self-service job tracking and payment
3. **Automated Scheduling:** AI-powered optimal scheduling
4. **Route Optimization:** GPS-based travel time and route planning
5. **Inventory Integration:** Track materials used per job
6. **Time Tracking:** Detailed time logs per task
7. **Customer Signatures:** Digital signature capture on mobile
8. **Recurring Jobs:** Template-based recurring service jobs
9. **Multi-day Jobs:** Jobs spanning multiple days with progress tracking
10. **Team Chat:** In-app communication between admin and field staff

---

## Document Version

- **Version:** 1.0
- **Date:** November 6, 2024
- **Author:** FMS Product Team
- **Status:** Final for Implementation
