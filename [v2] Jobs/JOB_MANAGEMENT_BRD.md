# Job Management Business Requirement Document (BRD)

## 1. Overview
This document outlines the business requirements and functional specifications for the Job Management module within the FMS system. The module consists of a **Job List** for managing active services and a **Job Detail** view for comprehensive job lifecycle management.

## 2. Job List Page (`job_list_simple.html`)

### 2.1. Purpose
To provide a centralized dashboard for staff to view, filter, and manage all student jobs, focusing on enrollment status, payment health, and service delivery.

### 2.2. Key Features

#### 2.2.1. KPI Dashboard
*   **Total Jobs**: Total count of all jobs in the system.
*   **Action Needed**: Count of jobs requiring attention (e.g., incomplete setup).
*   **Payment Issues**: Total count and value of overdue payments.
*   **Subscriptions**: Count of active recurring subscription services.

#### 2.2.2. Filters & Search filters
*   **Search**: Text-based search by Job ID, Customer Name, or Service Name.
*   **Status Tabs**:
    *   **All Jobs**: Complete list.
    *   **Active**: Currently running services. A job is **ONLY** considered Active if:
        1.  It has valid links (Sessions, Schedule).
        2.  **AND** The first invoice has been **PAID**.
    *   **Incomplete**: Jobs missing critical links (Sessions, Schedule) **OR** the first invoice is unpaid.
    *   **Inactive**: Paused or deactivated jobs.
    *   **Payment Issues**: Jobs with overdue invoices (but may still be active if not the first invoice).
*   **Service Type Filter**:
    *   **All Types**
    *   **Subscription**: Recurring services.
    *   **Course**: Service linked to a Pricebook Item with package type "Course".
*   **Sorting**: Sort by Newest, Oldest, or Customer Name.

#### 2.2.3. Job List Card
Each job is displayed as a card containing:
*   **Primary Info**: Job ID, Customer Name, Service Name.
*   **Status Badges**:
    *   Job Status: Active (Green), Incomplete (Yellow), Inactive (Gray).
    *   Service Type: Subscription (Blue), Course (Purple).
*   **Details**:
    *   **Sessions**: Name of the linked session cohort.
    *   **Schedule**: Recurring pattern (e.g., "Every Mon 5:00 PM").
    *   **Staff**: Assigned instructor.
    *   **Next Session**: Date of the next scheduled occurrence.
*   **Warnings**:
    *   **Overdue**: Red text indicating payment amount due.
    *   **Incomplete**: Amber text indicating missing criteria:
        *   "Not linked to Sessions yet"
        *   "First invoice pending payment"
    *   **Payment Warning**: Red text advising manual deactivation if payment issues persist (No auto-deactivation).

#### 2.2.4. Functionality
*   **Pagination**: standard previous/next navigation (10 items per page).
*   **Create Job**: CTA to create a new job (typically via Quote conversion).
*   **Navigation**: Clicking a card navigates to the Job Detail page.

---

## 3. Job Detail Page (`job_detail_simple.html`)

### 3.1. Purpose
To provide a detailed view of a specific job, allowing management of its lifecycle, including session linking, financial status, and customer communication.

### 3.2. Key Features

#### 3.2.1. Job Header
*   **Identity**: Job ID, Status Badge, Service Type Badge.
*   **Primary Actions**:
    *   **Edit**: Modify job details.
    *   **Deactivate**: End the job (opens confirmation modal).

#### 3.2.2. Source & Configuration (The "Source of Truth")
*   **Linked Quote**:
    *   Displays the originating Quote ID.
    *   **Locked State**: Marked as "Linked & Locked" to prevent accidental unlinking.
    *   **Action**: View original Quote.
*   **Pricebook Item**:
    *   Displays the Name of the Service/Item from the Pricebook.
    *   Indicates "Configuration Applied".
    *   **Action**: View original Pricebook Item.

#### 3.2.3. Service Information
*   **Customer**: Name, Email, "View Profile" button.
*   **Details**: Enrollment Date, Assigned Staff, Service Type.
*   **Sessions Management**:
    *   Displays linked Session/Cohort name.
    *   Shows schedule pattern.
    *   **Incomplete State Handling**:
        *   If not linked: Display "Action Required" warning with "Link to Sessions" CTA.
            Same which how we link Quote to Session in Quote_details
        *   If linked but empty: Display warning about no future sessions.
    *   **Action**: View original Session.

#### 3.2.4. Schedule & Upcoming
*   **Next Session**: Prominent display of the next class date.
*   **Schedule Pattern**: Recurring time slot detail.
*   **Warnings**: "No upcoming sessions scheduled" if applicable.
*   **Action**: "View Full Schedule" button.

#### 3.2.5. Invoice History
*   **Layout**: Card-based list of generated invoices.
*   **Invoice Card Details**:
    *   **Header**: Invoice ID, Status Badge (Paid, Unpaid, Overdue, Partial).
    *   **Financials**: Billable Amount, Amount Paid, Outstanding Due.
    *   **Progress Bar**: Visual indicator of payment completion (Green/Yellow/Gray).
    *   **Overdue Logic**: Automatically marks unpaid invoices past due date as "OVERDUE".
*   **Actions per Invoice**:
    *   **View**: Open invoice details (original invoice page) to perform further actions (PDF, Payment, etc).
    *   **Note**: No direct PDF/Resend actions here to simplify the view.

#### 3.2.6. Payment & Health Status
*   **Status Card**:
    *   **Good Standing**: Green indicator if all payments are up to date.
    *   **Payment Issues**: Red indicator if invoices are overdue.
    *   **First Invoice Pending**: Yellow indicator if job is Incomplete due to unpaid first invoice.
*   **Overdue Layout**:
    *   Displays total overdue amount.
    *   Displays warning: "Payment is overdue. Please check invoice details."
    *   **Action**: None (User should navigate to Invoice HistoryView).
*   **Auto-Deactivation**: REMOVED. System will purely warn and suggest manual intervention.

#### 3.2.7. Activity Log
*   Chronological list of job events (Creation, Session attendance, Invoicing, Payment, Deactivation).

### 3.3. Modals

#### 3.3.1. Deactivate Job
*   **Input**: Reason for deactivation (Customer Request, Payment Issues, Completed, Other).
*   **Notes**: Optional text field.
*   **Confirmation**: "Deactivate Job" destructive action.

#### 3.3.2. Link Quote
*   **Purpose**: Manually link a quote if not done during creation.
*   **Input**: Quote ID.

---

## 4. Technical Assumptions (Frontend)
*   **Framework**: Simple HTML/JS with Tailwind CSS.
*   **Data Source**: Currently uses mock data objects (`jobs` array in `job_list_simple.js`, `jobData` in `job_detail_simple.js`).
*   **Routing**: URL parameter-based navigation (e.g., `?id=JOB-2024-001`).
