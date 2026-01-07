# Timesheet & Payroll Manager Implementation Plan

## 1. Overview
This plan outlines the development of a robust Timesheet Manager module designed to streamline the tracking, approval, and payment of staff hours. The system addresses two primary user roles: **Manager** (oversight, approval, payroll) and **Staff** (viewing their own records).

The core focus is on data visibility, financial accuracy (alerts for discrepancies), and quick actions (approve/decline).

## 2. User Roles & Requirements

### 2.1 Manager
*   **Dashboard View**: See all timesheets (sessions/jobs) within a selected period.
*   **Filtering**: Filter by Staff Name, Status (Pending, Approved, Declined), and Date Range.
*   **Quick Period Selection**: One-click filters for Today, This Week, This Month, This Quarter, This Year.
*   **Financial Control**:
    *   View `Hourly Rate` and `Actual Hours` for each session.
    *   **Auto-Calculation**: See total amount payable per session (`Actual Hours` * `Rate`).
    *   **Summary**: View total payable amount for the filtered list/period.
*   **Discrepancy Alerts**: Visual warning if `Actual Hours` ≠ `Estimated Hours`.
*   **Actions**: Approve or Decline timesheets individually or in bulk.
*   **Export**: Export the currently filtered data (CSV/Excel) for external processing.
*   **Staff Drill-down**: View full timesheet history for a specific staff member.

### 2.2 Staff
*   **My Timesheets**: View a personal list of timesheets with status (Approved/Declined/Pending) and payment details.

## 3. Technical Architecture

### 3.1 Technology Stack
*   **Structure**: HTML5 (Semantic)
*   **Styling**: Vanilla CSS (CSS Variables for themes, Flexbox/Grid for layout)
*   **Logic**: Vanilla JavaScript (ES6+ Modules)
*   **Data**: LocalStorage / JSON Mock Data

### 3.2 Data Model Description
We will use a relational structure in our mock data:

**1. Staff Object**
```json
{
  "id": "S001",
  "name": "Jane Doe",
  "role": "Instructor",
  "hourlyRate": 50.00 // Default rate, can be overridden per job
}
```

**2. Job/Session Object**
```json
{
  "id": "J101",
  "title": "Yoga Class - Morning",
  "staffId": "S001",
  "date": "2023-10-27",
  "startTime": "09:00",
  "endTime": "10:00",
  "estimatedHours": 1.0,
  "status": "Completed"
}
```

**3. Timesheet Entry Object**
```json
{
  "id": "TS500",
  "jobId": "J101",
  "staffId": "S001",
  "date": "2023-10-27T00:00:00Z",
  "actualHours": 1.5, // Discrepancy Example: Est was 1.0
  "hourlyRate": 50.00,
  "totalPay": 75.00, // Calculated
  "status": "Pending", // Pending, Approved, Declined
  "adminNotes": ""
}
```

## 4. UI/UX Design Strategy

### 4.1 Manager Dashboard (`timesheet_manager_inbox.html`)
*   **Header**:
    *   **Period Selector**: Pill-shaped buttons [Today] [Week] [Month] [Quarter] [Year].
    *   **Date Range Picker**: Custom range inputs.
    *   **Summary Cards**:
        *   Total Timesheets (Count)
        *   Pending Approval (Count)
        *   **Total Payable** (Currency, derived from filtered view)
*   **Filters Bar**: Search by Staff Name, Status Dropdown.
*   **The Grid (Data Table)**:
    *   Columns: Date | Staff | Job/Session | Est. Hours | **Actual Hours** | Rate | **Total** | Status | Actions.
    *   **Alert Visuals**: If `Actual` != `Est`, the Actual Hours cell highlights (Amber/Red) with a tooltip showing the difference.
    *   **Actions**: Checkmark (Approve) and Cross (Decline) buttons inline.
*   **Footer**: "Export Data" button.

### 4.2 Staff View (`staff_timesheet_view.html`)
*   Simplified table view showing Date, Job, Hours, Rate, Total, and Status info chips.

## 5. Execution Steps

### Step 1: Mock Data Generation
*   Create a robust `TimesheetDataService` class.
*   Generate realistic data covering various scenarios:
    *   Perfect matches (Actual == Est).
    *   Overtime (Actual > Est).
    *   Undertime (Actual < Est).
    *   Various statuses (Pending, Approved).
    *   Multiple staff members.

### Step 2: Implementation - Manager Inbox Logic
*   Develop `timesheet_manager_inbox.html` structure.
*   Implement `TimesheetController.js`:
    *   **Load Data**: Fetch from service.
    *   **Filter Logic**: detailed function to handle Date Ranges + Text Search + Status.
    *   **Stats Engine**: Function to loop through filtered results and calculate "Total Payable" dynamically.

### Step 3: Implementation - The Interface
*   Build the Table Row rendering logic.
*   **Alert Logic**: `if (actual != estimated) addClass('warning-highlight')`.
*   Connect Period Selectors to the Filter Logic.

### Step 4: Actions & Export
*   Implement `approveItem(id)` and `declineItem(id)` functions that update local state and re-render.
*   Implement `exportToCSV()` function that iterates over the current filtered view and triggers a download.

### Step 5: Staff View
*   Build a read-only view filtering the dataset by a specific `currentUserId`.

## 6. Critical Features Checklist
- [ ] **Filter Period**: Today, Week, Month, Quarter, Year.
- [ ] **Alerts**: Highlight diff between Actual vs Est hours.
- [ ] **Money**: Accurate automatic calculation of Total Rate per session.
- [ ] **Summary**: Aggregated total pay for filtered list.
- [ ] **Actions**: Approve/Decline capability.
- [ ] **Export**: CSV generation.
