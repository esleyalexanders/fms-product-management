# Timesheet Statistics Cards - Business Logic

## Overview
This document describes the business logic for the statistics cards displayed on the Timesheet Manager and Timesheet Overview screens. These cards provide managers with quick insights into timesheet data and payroll status.

---

## 1. Timesheet Manager Inbox (`timesheet_manager_inbox.html`)

### Purpose
The Manager Inbox is an action-oriented dashboard where managers review, approve, or decline individual timesheet entries. The statistics focus on **actionable items** and **financial obligations**.

### Statistics Cards

#### 1.1 Pending Reviews
- **What it shows**: Number of timesheet entries awaiting manager approval
- **Business meaning**: Workload indicator - how many items require immediate attention
- **Calculation**: Count all timesheet entries with status = "pending"
- **User action**: Managers should review and approve/decline these entries
- **Color**: Amber (warning/attention needed)

#### 1.2 Total Payable
- **What it shows**: Total dollar amount owed to staff for approved hours
- **Business meaning**: Financial commitment - how much will be paid in the next payroll run
- **Calculation**: Sum of (approved hours × hourly rate) for all approved timesheet entries
- **User action**: Finance teams use this for budgeting and payroll preparation
- **Color**: Green (positive/money)

#### 1.3 Hours Alerts
- **What it shows**: Number of timesheet entries with discrepancies or issues
- **Business meaning**: Quality control - entries that need special attention before approval
- **Calculation**: Count entries where:
  - Actual hours significantly differ from estimated hours (e.g., >20% variance)
  - Hours exceed expected thresholds
  - Missing required information
- **User action**: Managers should investigate these entries before approving
- **Color**: Red (alert/warning)

#### 1.4 Total Entries
- **What it shows**: Total number of timesheet entries in the current view/period
- **Business meaning**: Volume indicator - overall activity level
- **Calculation**: Count all timesheet entries matching current filters (date range, staff, status)
- **User action**: Informational - helps managers understand workload volume
- **Color**: Indigo (neutral/informational)

---

## 2. Timesheet Overview (`timesheet_overview.html`)

### Purpose
The Overview screen provides an aggregated, high-level view of timesheet data **by staff member**. It focuses on **hours distribution** and **approval status** rather than individual entries.

### Statistics Cards

#### 2.1 Total Hours
- **What it shows**: Sum of all hours across all staff members
- **Business meaning**: Overall labor capacity utilized in the period
- **Calculation**: Sum of all final hours from all timesheet entries (regardless of status)
- **User action**: Workforce planning - understand total labor hours consumed
- **Color**: Indigo (primary metric)

#### 2.2 Pending Approval
- **What it shows**: Total hours awaiting manager approval
- **Business meaning**: Unprocessed labor hours - work completed but not yet validated
- **Calculation**: Sum of hours from entries with status = "pending"
- **User action**: Indicates backlog - managers should process pending approvals
- **Color**: Amber (attention needed)

#### 2.3 Approved Hours
- **What it shows**: Total hours that have been approved
- **Business meaning**: Validated work hours ready for payroll processing
- **Calculation**: Sum of hours from entries with status = "approved"
- **User action**: These hours will be included in the next payroll run
- **Color**: Green (approved/ready)

#### 2.4 Active Staff
- **What it shows**: Number of unique staff members with timesheet entries
- **Business meaning**: Workforce engagement - how many people worked in this period
- **Calculation**: Count distinct staff members who have at least one timesheet entry in the period
- **User action**: Workforce analytics - understand team size and participation
- **Color**: Purple (people metric)

---

## 3. Key Differences Between the Two Screens

| Aspect | Manager Inbox | Overview |
|--------|---------------|----------|
| **Focus** | Individual entries (action-oriented) | Aggregated by staff (analytical) |
| **Primary User** | Managers approving timesheets | HR/Finance reviewing totals |
| **Time Sensitivity** | Real-time actions needed | Period-based analysis |
| **Metrics Type** | Count of entries + financial | Sum of hours + staff count |
| **Decision Support** | "What do I need to approve today?" | "How many hours did the team work this month?" |

---

## 4. Business Rules

### 4.1 Status Definitions
- **Pending**: Timesheet entry submitted by staff, awaiting manager review
- **Approved**: Manager has validated and approved the hours
- **Declined**: Manager has rejected the entry (requires staff correction)

### 4.2 Hours Calculation Priority
When calculating hours for statistics:
1. Use **Final Hours** (manager-adjusted) if available
2. Fall back to **Actual Hours** (staff-reported) if final hours not set
3. Fall back to **Estimated Hours** only if both above are missing

### 4.3 Alert Triggers (Manager Inbox)
An entry generates an alert when:
- Actual hours exceed estimated hours by >20%
- Actual hours are less than estimated hours by >30%
- Total hours for a single entry exceed 12 hours (potential overtime issue)
- Required fields are missing (job reference, activity description)

### 4.4 Date Filtering
- Statistics update dynamically based on selected date range
- Default view: Current month
- Quick filters available: Today, Week, Month, Quarter
- Custom date ranges supported

---

## 5. User Workflows

### 5.1 Manager Inbox Workflow
1. Manager opens inbox → sees pending reviews count
2. Reviews entries with alerts first (red card)
3. Approves/declines entries → pending count decreases, approved hours increase
4. Monitors total payable to stay within budget
5. Exports approved entries for payroll processing

### 5.2 Overview Workflow
1. HR/Finance opens overview → sees total hours for period
2. Filters by date range to analyze specific periods
3. Reviews pending hours → follows up with managers if backlog is high
4. Checks active staff count → compares with expected headcount
5. Exports aggregated data for reporting/analytics

---

## 6. Data Refresh Logic

### Real-time Updates
- Statistics recalculate immediately when:
  - Manager approves/declines an entry
  - Date filters change
  - Staff filters change
  - Status filters change

### Performance Considerations
- For large datasets (>1000 entries), statistics may use cached/pre-aggregated values
- Refresh button available to force recalculation
- Loading states displayed during calculation

---

## 7. Export Functionality

### Manager Inbox Export
Exports individual timesheet entries with columns:
- Date, Staff Name, Job/Activity, Estimated Hours, Actual Hours, Final Hours, Total Pay, Status

### Overview Export
Exports aggregated data by staff with columns:
- Staff Name, Pending Hours, Approved Hours, Declined Hours, Total Hours

---

## Notes for Development Team
- All calculations should handle edge cases (null values, zero hours, missing rates)
- Currency formatting should respect locale settings
- Hour displays should use consistent format (e.g., "24h 30m" or "24.5h")
- Statistics should update without full page reload (use JavaScript)
- Consider adding trend indicators (↑↓) showing change from previous period
