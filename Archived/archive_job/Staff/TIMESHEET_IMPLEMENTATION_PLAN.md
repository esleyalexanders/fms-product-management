# Timesheet Implementation Plan

## Overview
This plan outlines the implementation of timesheet functionality for both **Staff** and **Manager** roles. The system will aggregate time entries from completed jobs and provide comprehensive timesheet views, reporting, and management capabilities.

---

## 📋 Current State Analysis

### ✅ What Exists:
1. **Job Time Entry**: Staff manually enters hours/minutes when completing jobs
   - Location: `Staff/job_detail.html` & `Staff/jobs.html`
   - Data stored in: `job.completionData.timeSpent = { hours, minutes }`
   - Validation: Requires at least 1 hour OR 1 minute

2. **Clock In/Out System**: Status tracking only (not used for time calculation)
   - Location: `Staff/index.html`
   - Purpose: Status visibility, NOT payroll calculation

3. **Navigation**: Timesheet menu item exists in sidebar (but no page)

4. **Manager Structure**: Manager/admin pages exist in `manage-team/` folder

### ❌ What's Missing:
1. Staff timesheet view page
2. Manager timesheet view (all staff)
3. Time aggregation and calculations
4. Daily/Weekly/Monthly views
5. Export functionality
6. Time entry history and editing
7. Manager approval workflow

---

## 🎯 Implementation Goals

### Phase 1: Staff Timesheet (Core Features)
- View own timesheet entries
- Daily, Weekly, Monthly views
- Time summaries and totals
- Link to job details

### Phase 2: Manager Timesheet (Management Features)
- View all staff timesheets
- Filter by staff, date range
- Approve/reject entries (optional)
- Export functionality

### Phase 3: Advanced Features (Future)
- Time entry editing
- Manual time entries (non-job work)
- Overtime calculations
- Payroll integration

---

## 📁 File Structure

```
Staff/
├── timesheet.html          # Staff timesheet page (NEW)
├── timesheet.js            # Staff timesheet logic (NEW)
├── timesheet-styles.css    # Staff timesheet styles (NEW, optional)

manage-team/
├── staff-timesheets.html   # Manager view of all staff timesheets (NEW)
├── staff-timesheets.js     # Manager timesheet logic (NEW)
└── staff-timesheet-detail.html  # Manager view of individual staff timesheet (NEW)
```

---

## 🎨 Staff Timesheet Page (`Staff/timesheet.html`)

### Features:

#### 1. **View Toggle (Daily/Weekly/Monthly)**
- Tabs or buttons to switch between views
- Default: Daily (today)

#### 2. **Daily View**
- **Date Picker**: Select any date
- **Summary Card**: 
  - Total hours worked today
  - Number of jobs completed
  - Total earnings (if available)
- **Job Entries List**:
  - Job ID and title
  - Customer name
  - Time entered (hours + minutes)
  - Completion time
  - Link to job details
  - Status badge

#### 3. **Weekly View**
- **Week Selector**: Navigate weeks
- **Calendar Grid**: 7 days
  - Each day shows:
    - Total hours
    - Number of jobs
    - Click to view daily detail
- **Week Summary**:
  - Total hours for week
  - Average hours per day
  - Total jobs completed

#### 4. **Monthly View**
- **Month Selector**: Navigate months
- **Calendar Grid**: Full month
  - Each day shows total hours
  - Color coding (more hours = darker)
  - Click to view daily detail
- **Month Summary**:
  - Total hours
  - Total jobs
  - Average per day
  - Best day (most hours)

#### 5. **Time Entry Details**
- Expandable job cards showing:
  - Job details
  - Time breakdown
  - Completion notes
  - Photos (if available)

### Data Source:
```javascript
// Aggregate from allJobs where:
// - status === 'completed'
// - completionData exists
// - completionData.timeSpent exists
// - completedBy === currentStaff.id
```

### UI Components:
- Summary cards (matching `home-styles.css`)
- Job list cards (matching existing job cards)
- Calendar component (custom or library)
- Date picker
- Empty states

---

## 👔 Manager Timesheet Pages

### 1. **Staff Timesheets List** (`manage-team/staff-timesheets.html`)

#### Features:
- **Staff Selector**: Dropdown or list of all staff
- **Date Range Filter**: Start date to end date
- **Summary Dashboard**:
  - Total hours across all staff
  - Total jobs completed
  - Average hours per staff
  - Staff with most/least hours
- **Staff List Table**:
  - Staff name
  - Total hours (for selected period)
  - Jobs completed
  - Status (active/inactive)
  - Actions: View Details, Export
- **Export Button**: Export all data to CSV/PDF

### 2. **Individual Staff Timesheet** (`manage-team/staff-timesheet-detail.html`)

#### Features:
- **Staff Header**: Name, role, photo
- **View Toggle**: Daily/Weekly/Monthly (same as staff view)
- **Time Entries**: Same structure as staff view
- **Approval Actions** (optional):
  - Approve/Reject buttons
  - Add comments
  - Request corrections
- **Export**: Export this staff's timesheet

### Data Source:
```javascript
// Aggregate from allJobs where:
// - status === 'completed'
// - completionData exists
// - Filter by assignedTo (staff ID)
// - Filter by date range
```

---

## 🔧 Technical Implementation

### 1. **Data Aggregation Functions**

#### `timesheet.js` - Core Functions:

```javascript
// Get all completed jobs for a staff member
function getStaffCompletedJobs(staffId, startDate, endDate) {
    return allJobs.filter(job => 
        job.status === 'completed' &&
        job.completionData &&
        job.completionData.timeSpent &&
        job.completionData.completedBy === staffId &&
        isDateInRange(job.completionData.completedAt, startDate, endDate)
    );
}

// Calculate total time from job entries
function calculateTotalTime(jobs) {
    let totalMinutes = 0;
    jobs.forEach(job => {
        const time = job.completionData.timeSpent;
        totalMinutes += (time.hours * 60) + time.minutes;
    });
    return {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
        totalHours: (totalMinutes / 60).toFixed(2)
    };
}

// Group jobs by date
function groupJobsByDate(jobs) {
    const grouped = {};
    jobs.forEach(job => {
        const date = new Date(job.completionData.completedAt).toISOString().split('T')[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(job);
    });
    return grouped;
}

// Get week start/end dates
function getWeekRange(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const start = new Date(d.setDate(diff));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
}

// Get month range
function getMonthRange(date) {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return { start, end };
}
```

### 2. **UI Rendering Functions**

```javascript
// Render daily view
function renderDailyView(date) {
    const jobs = getStaffCompletedJobs(currentStaff.id, date, date);
    const totalTime = calculateTotalTime(jobs);
    
    // Update summary
    updateSummaryCard(totalTime, jobs.length);
    
    // Render job list
    renderJobList(jobs);
}

// Render weekly view
function renderWeeklyView(weekStart) {
    const weekRange = getWeekRange(weekStart);
    const jobs = getStaffCompletedJobs(currentStaff.id, weekRange.start, weekRange.end);
    const grouped = groupJobsByDate(jobs);
    
    // Render calendar grid
    renderWeekCalendar(weekRange.start, grouped);
    
    // Update summary
    const totalTime = calculateTotalTime(jobs);
    updateWeekSummary(totalTime, jobs.length);
}

// Render monthly view
function renderMonthlyView(monthDate) {
    const monthRange = getMonthRange(monthDate);
    const jobs = getStaffCompletedJobs(currentStaff.id, monthRange.start, monthRange.end);
    const grouped = groupJobsByDate(jobs);
    
    // Render calendar grid
    renderMonthCalendar(monthDate, grouped);
    
    // Update summary
    const totalTime = calculateTotalTime(jobs);
    updateMonthSummary(totalTime, jobs.length);
}
```

### 3. **Manager Functions**

```javascript
// Get all staff timesheets
function getAllStaffTimesheets(startDate, endDate) {
    const staffList = getAllStaff(); // From manage-team data
    return staffList.map(staff => {
        const jobs = getStaffCompletedJobs(staff.id, startDate, endDate);
        const totalTime = calculateTotalTime(jobs);
        return {
            staffId: staff.id,
            staffName: staff.name,
            totalHours: totalTime.totalHours,
            totalJobs: jobs.length,
            jobs: jobs
        };
    });
}

// Export to CSV
function exportTimesheetToCSV(data, filename) {
    // Convert data to CSV format
    // Trigger download
}
```

---

## 📊 Data Models

### Timesheet Entry (Derived from Job):
```javascript
{
    jobId: "JOB-2024-124",
    jobTitle: "Garden Maintenance",
    customer: "Michael Chen",
    timeSpent: { hours: 2, minutes: 30 },
    completedAt: "2024-11-20T11:30:00Z",
    completedBy: "STAFF-001",
    status: "completed"
}
```

### Daily Timesheet Summary:
```javascript
{
    date: "2024-11-20",
    staffId: "STAFF-001",
    jobs: [...], // Array of job entries
    totalHours: 6.5,
    totalMinutes: 390,
    jobCount: 3
}
```

### Weekly Timesheet Summary:
```javascript
{
    weekStart: "2024-11-18",
    weekEnd: "2024-11-24",
    staffId: "STAFF-001",
    dailyEntries: [
        { date: "2024-11-18", totalHours: 6.5, jobCount: 3 },
        { date: "2024-11-19", totalHours: 7.25, jobCount: 4 },
        // ... rest of week
    ],
    weekTotal: 35.5,
    averagePerDay: 5.08,
    totalJobs: 20
}
```

---

## 🎨 UI/UX Design

### Design System:
- **Match existing styles**: Use `home-styles.css` patterns
- **Color coding**:
  - Green: Completed, approved
  - Orange: Pending approval
  - Red: Rejected, errors
  - Blue: Info, links
- **Icons**: Font Awesome (already in use)
- **Typography**: Inter font (already in use)

### Responsive Design:
- Mobile-first approach
- Collapsible sections on mobile
- Touch-friendly buttons (min 44px)
- Horizontal scroll for tables on mobile

### Accessibility:
- ARIA labels for screen readers
- Keyboard navigation
- High contrast colors
- Focus indicators

---

## 🔗 Integration Points

### 1. **Link from Sidebar**
- Update all Staff pages: Change `<div class="nav-item">` to `<a href="timesheet.html">`
- Update manager pages: Add timesheet link in sidebar

### 2. **Link from Job Details**
- Add "View in Timesheet" link in completed job details
- Link should go to timesheet page with date filter set

### 3. **Link from Manager Staff List**
- Add "View Timesheet" action button in `manage-team.html`
- Opens staff timesheet detail page

---

## 📝 Implementation Steps

### Step 1: Staff Timesheet Page (Core)
1. ✅ Create `Staff/timesheet.html`
   - Basic layout with sidebar
   - View toggle (Daily/Weekly/Monthly)
   - Summary cards
   - Job list container

2. ✅ Create `Staff/timesheet.js`
   - Data aggregation functions
   - View rendering functions
   - Date navigation
   - Job list rendering

3. ✅ Update sidebar links
   - Change all "Timesheet" nav items to links
   - Test navigation

4. ✅ Test with sample data
   - Verify calculations
   - Test all views
   - Test date navigation

### Step 2: Manager Timesheet Views
1. ✅ Create `manage-team/staff-timesheets.html`
   - Staff selector
   - Date range filter
   - Summary dashboard
   - Staff list table

2. ✅ Create `manage-team/staff-timesheets.js`
   - Multi-staff aggregation
   - Filtering logic
   - Export functionality

3. ✅ Create `manage-team/staff-timesheet-detail.html`
   - Individual staff view
   - Same structure as staff view
   - Approval actions (optional)

4. ✅ Add navigation links
   - Add to manage-team sidebar
   - Add action buttons in staff list

### Step 3: Polish & Enhancements
1. ✅ Export functionality
   - CSV export
   - PDF export (optional)

2. ✅ Empty states
   - No jobs message
   - No data for date range

3. ✅ Loading states
   - Skeleton loaders
   - Progress indicators

4. ✅ Error handling
   - Invalid date ranges
   - Missing data
   - Network errors (for future API)

---

## 🧪 Testing Checklist

### Staff Timesheet:
- [ ] Daily view shows correct jobs for selected date
- [ ] Weekly view calculates totals correctly
- [ ] Monthly view displays calendar correctly
- [ ] Time calculations are accurate
- [ ] Date navigation works (prev/next)
- [ ] Job links navigate to job details
- [ ] Empty states display correctly
- [ ] Mobile responsive
- [ ] All time entries display correctly

### Manager Timesheet:
- [ ] Staff selector filters correctly
- [ ] Date range filter works
- [ ] Summary calculations are accurate
- [ ] Staff list displays all staff
- [ ] Individual staff view works
- [ ] Export functionality works
- [ ] Links to job details work
- [ ] Mobile responsive

---

## 🚀 Future Enhancements (Phase 3)

1. **Time Entry Editing**
   - Allow staff to edit entries (with manager approval)
   - Edit history tracking

2. **Manual Time Entries**
   - Add time entries for non-job work
   - Training, meetings, admin tasks

3. **Approval Workflow**
   - Manager approval required
   - Email notifications
   - Approval history

4. **Overtime Calculations**
   - Configurable overtime rules
   - Automatic overtime detection
   - Overtime reporting

5. **Payroll Integration**
   - Export to payroll systems
   - Pay rate calculations
   - Tax calculations

6. **Advanced Reporting**
   - Time vs. estimated time
   - Performance metrics
   - Productivity reports
   - Cost analysis

---

## 📚 API Integration (Future)

When backend is ready, these endpoints will be needed:

```javascript
// Staff endpoints
GET /api/timesheet/today?staffId=STAFF-001
GET /api/timesheet/week?staffId=STAFF-001&startDate=2024-11-18
GET /api/timesheet/month?staffId=STAFF-001&month=2024-11

// Manager endpoints
GET /api/timesheet/all-staff?startDate=2024-11-18&endDate=2024-11-24
GET /api/timesheet/staff/:staffId?startDate=2024-11-18&endDate=2024-11-24
POST /api/timesheet/approve/:entryId
POST /api/timesheet/reject/:entryId

// Export
GET /api/timesheet/export?format=csv&staffId=STAFF-001&startDate=...&endDate=...
```

---

## ✅ Success Criteria

1. **Staff can:**
   - View their timesheet entries
   - See daily/weekly/monthly summaries
   - Navigate between dates
   - See accurate time totals

2. **Managers can:**
   - View all staff timesheets
   - Filter by staff and date range
   - See aggregated summaries
   - Export data

3. **System:**
   - Accurately calculates time from job entries
   - Handles edge cases (no jobs, invalid dates)
   - Responsive on all devices
   - Matches existing design system

---

## 📝 Notes

- **Time Source**: All time comes from `job.completionData.timeSpent` - no automatic calculation
- **Clock In/Out**: Not used for timesheet calculation (status only)
- **Data Storage**: Currently using in-memory `allJobs` array - will need API integration later
- **Permissions**: Staff can only see own timesheet; Managers can see all staff

---

This plan provides a complete roadmap for implementing timesheet functionality. The implementation should follow the existing code patterns and design system for consistency.

