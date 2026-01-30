# Business Requirement Document (BRD): Job List Screen

## 1. Executive Summary
This document outlines the requirements for a new **Job List Screen** within the FMS system. The screen allows Managers to view, filter, and manage **Service Jobs** converted from quotes. Key features include monitoring job status based on session linkage and payment health (specifically for subscriptions), and providing actions to deactivate/reactivate jobs.

The design and layout will follow the "Simple Invoice List" pattern (`quote_simple/invoice_list_simple.html`).

## 2. User Persona
*   **Primary User:** Manager
*   **Goal:** Oversee all active and inactive service jobs, ensure staff are assigned, and verify payment health (especially for subscriptions) to take action on delinquent accounts.

## 3. Core Concepts & Relationships
*   **Job**: Represents a **Customer's Enrollment** in a Service, derived from an accepted Quote.
*   **Linkage**: 
    *   **Job** $\rightarrow$ **Learning Service** (Subscription Session Parent).
    *   **Note**: Jobs are assigned to the *Learning Service* (the course/subscription), which then generates individual *Session Slots*. They are NOT assigned directly to loose sessions.
*   **Data Flow**:
    *   **Quote**: Source of Job (Customer, Items, Payment Model).
    *   **Invoice**: Source of Financial Status (Initial Payment & Recurring Payments).
    *   **Learning Service**: Source of Operational Status (Is the student enrolled? Are sessions generated?).

## 4. Functional Requirements

### 4.1. Job List View
The screen must display a list of jobs with the following information for each item:
*   **Customer Key Info:** Name, Contact.
*   **Job Details:** Job ID, Linked Learning Service (Subscription Name).
*   **Staff Involved:** Default Staff assigned to the linked Learning Service.
*   **Payment Status:**
    *   Clear distinction between **Subscription** and **Non-Subscription** (One-off) jobs.
    *   Visual indicators for "Overdue" or "Unpaid" recurring invoices.

### 4.2. Job Status Logic
The core logic for defining a job's status is as follows:

| Status | Condition | Description |
| :--- | :--- | :--- |
| **Incomplete** | 1. Job is **not linked** to any Learning Service (Student not in "Attendees" list).<br>OR<br>2. Job is Subscription-based AND **First Charge** is not successful/paid. | The job is not ready for delivery. Either operational setup is missing (not enrolled) or financial commitment is missing. |
| **Active** | 1. Job **is enrolled** in a Learning Service.<br>AND<br>2. **First Charge** is successful. | The job is fully setup and active. The customer has paid the initial requirement and is on the attendance list. |
| **Inactive** | Manually deactivated by the Manager. | Job is paused or cancelled. Student is effectively "unenrolled" or "paused" in the Learning Service. |

### 4.3. Payment Health & Alerts
*   **Subscription Jobs:**
    *   The system must check the status of **all invoices** linked to this Job/Quote (Initial + Recurring).
    *   **Alert:** If *any* recurring invoice is **Overdue** or **Unpaid**, the Job card must display a prominent alert (e.g., "⚠️ Payment Overdue - Billing Paused?").
*   **Non-Subscription Jobs:**
    *   Display standard payment status (Paid/Unpaid).

### 4.4. Management Actions
*   **Deactivate Job:**
    *   Allow manager to manually set a job to "Inactive".
    *   **Impact Warning:** "Deactivating this job will remove the student from the 'Attendees' list of [Service Name] and stop future recurring billing."
*   **Reactivate Job:**
    *   Allow manager to restore an "Inactive" job to "Active".
    *   **Impact Info:** "Billing will resume. You may need to manually re-add the student to the 'Attendees' list if the slot was filled."

## 5. User Interface (UI) Requirements
Based on `invoice_list_simple.html`:

*   **Header:** Title "Jobs", "Create Job" button.
*   **KPI Cards (Top):**
    *   **Total Jobs:** Active vs Incomplete.
    *   **Action Needed:** Count of jobs with "Payment Overdue" or "Missing Enrollment".
    *   **Revenue at Risk:** Total value of overdue subscription jobs.
*   **Filters:**
    *   **Search:** By Customer, Job ID, Service Name.
    *   **Status Filter:** Active, Incomplete, Inactive, Payment Issue.
    *   **Payment Type:** Subscription, One-off.
*   **List Layout:**
    *   Card-based rows.
    *   **Left:** Job ID, Customer, Tags (Subscription).
    *   **Middle:** Enrolled Service Name, **Schedule Pattern** (e.g., "Mon 17:00"), Next Session Date.
    *   **Right:** Status Badge, Payment Alert (Red Warning), Action Menu.

## 6. Technical Components
*   **New File:** `[v2] Jobs/job_list_simple.html` (to match `quote_simple` pattern).
*   **Mock Data:** Needs to simulate the cross-module data:
    *   Jobs with `subscriptionId` linking to a Learning Service.
    *   Invoices with `jobId` and varying statuses (Paid, Overdue).
