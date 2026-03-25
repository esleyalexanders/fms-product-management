# Timesheet System Guide

## Overview

The timesheet system tracks staff work hours through **manual time entry per job**. Staff record the actual time spent working on each job when they complete it. There is no automatic time calculation - all time entries are manual.

### Key Principle:
- **Manual Time Entry Only**: Staff manually enter hours and minutes spent on each job
- **No Automatic Calculation**: Time is NOT calculated from clock-in to job completion
- **Simple & Accurate**: Staff records actual work time, not total elapsed time

---

## 🕐 Current Implementation

### Daily Status Tracking (Dashboard - `index.html`)

**Note**: Clock in/out and break tracking are for **status management only**, not for time calculation.

#### Features:

**Clock In/Out:**
- Staff can clock in when starting work (status indicator)
- Clock out when finishing work
- **Purpose**: Shows availability status, NOT for time calculation
- Status updates:
  - Clock In → Status: "Available" (online)
  - Clock Out → Status: "Off Duty" (offline)

**Break Tracking:**
- Staff can start/end breaks
- **Purpose**: Status indicator only, NOT for time deduction
- Status changes to "Busy" during break

**Active Time Display:**
- Shows time since clock in (informational only)
- **NOT used for payroll or timesheet calculation**
- Just a visual indicator of work session duration

---

### Job Time Entry (Job Completion - `job_detail.html`)

**This is the ONLY time tracking used for timesheet/payroll.**

When staff completes a job, they record the time spent on that specific job.

#### Features:

**Manual Time Entry:**
- Staff manually enters hours and minutes spent on the job
- **This is the actual work time** - not calculated automatically
- Required field (cannot complete job without time)
- Staff records only the time they actually worked on the job
- Excludes: travel time, breaks, waiting time (unless part of work)

**Time Entry Fields:**
- Hours: 0-12 (integer input)
- Minutes: 0-59 (integer input)
- Validation: Must enter at least 1 hour OR 1 minute
- Location: `Staff/job_detail.html` - Complete Job Modal

**Data Saved:**
```javascript
job.completionData = {
    timeSpent: {
        hours: 2,      // Manually entered by staff
        minutes: 30    // Manually entered by staff
    },
    completedAt: "ISO timestamp",
    completedBy: "STAFF-ID"
}
```

**Important**: 
- Time is **NOT** calculated from job start to completion
- Staff enters the **actual work time** they spent
- This allows for accurate time tracking (excluding breaks, travel, etc.)

---

## 📊 Timesheet Data Flow

### Simplified Time Tracking Flow:
```
Staff Arrives
    ↓
Clock In → Status: "Available" (for visibility only)
    ↓
Start Job → Status: "In Progress"
    ↓
Staff Works on Job
    ↓
Complete Job → Enter Manual Time (hours + minutes)
    ↓
Time Saved with Job → This is the ONLY time tracked
    ↓
[Repeat for other jobs]
    ↓
Clock Out → Status: "Off Duty" (for visibility only)
```

### Key Points:
- **Clock In/Out**: Only for status visibility, NOT for time calculation
- **Job Time Entry**: Manual entry when completing each job
- **No Automatic Calculation**: Time is NOT calculated from start to finish
- **Timesheet = Sum of Job Times**: Total work time = sum of all job time entries

---

## 🔄 How Timesheet Works

### 1. **Clock In/Out System** (Status Only)

**Clock In:**
- Sets `clockedIn = true`
- Records `clockInTime = new Date()`
- Updates status to "online"
- **Purpose**: Shows staff is available, NOT for time calculation
- Button changes to "Clock Out"

**Clock Out:**
- Sets `clockedIn = false`
- Clears `clockInTime`
- Updates status to "offline"
- **Purpose**: Shows staff is off duty, NOT for time calculation
- Button changes to "Clock In"

**Note**: Active time display is informational only, not used for payroll.

---

### 2. **Break Tracking** (Status Only)

**Start Break:**
- Sets `onBreak = true`
- Updates status to "busy"
- **Purpose**: Shows staff is on break, NOT for time deduction

**End Break:**
- Sets `onBreak = false`
- Updates status back to "online"
- **Purpose**: Shows staff is back to work

**Note**: Break time is NOT deducted from work time. Staff enters actual work time per job.

---

### 3. **Job Time Entry** (Actual Time Tracking)

**When Completing Job:**
- Staff manually enters hours (0-12) and minutes (0-59) they actually worked
- **This is the actual work time** - not calculated automatically
- Time is validated (must be > 0)
- Saved with job completion data
- **This is the ONLY time used for:**
  - Timesheet calculation
  - Payroll calculation
  - Job cost analysis
  - Performance tracking

**Time Validation:**
- Hours: 0-12 (integer)
- Minutes: 0-59 (integer)
- At least one must be > 0

**What Time Should Include:**
- ✅ Actual work time on the job
- ✅ Setup/cleanup time
- ✅ Time spent on job-related tasks
- ❌ Travel time (unless part of service)
- ❌ Break time
- ❌ Waiting time (unless actively working)

---

## 📋 Timesheet Components

### Current Implementation:

1. **Dashboard Time Tracking** (`Staff/index.html`):
   - Clock In/Out button
   - Active Time display card
   - Break button
   - Break timer display

2. **Job Completion Time** (`Staff/job_detail.html`):
   - Time entry fields in Complete Job modal
   - Hours and minutes inputs
   - Validation on submission

---

## 🎯 Timesheet Features (Not Yet Implemented)

Based on the sidebar navigation mentioning "Timesheet", here's what a timesheet page would include:

### 1. **Timesheet View Page** (To Be Created - `Staff/timesheet.html`)
- **Daily View**: List of all jobs completed today with time entries
- **Weekly View**: Calendar showing jobs and time per day
- **Monthly View**: Summary of total hours per day
- **Job List**: Each job shows:
  - Job ID and title
  - Time entered (hours + minutes)
  - Completion date/time
  - Status (completed)

### 2. **Time Summary**
- **Today's Total**: Sum of all job times for today
- **This Week's Total**: Sum of all job times for the week
- **This Month's Total**: Sum of all job times for the month
- **No overtime calculation** (unless configured separately)
- **No break deduction** (time entered is actual work time)

### 3. **Time Entry Display**
- List of completed jobs with time entries
- Sortable by date, job, or time
- Filter by date range
- Search by job ID or customer name

### 4. **Manager Review** (Optional)
- Manager can view all staff timesheets
- Approve/reject entries (if needed)
- Add comments
- Request corrections

### 5. **Reporting & Export**
- Export to CSV/PDF
- Payroll integration
- Performance metrics
- Time vs. estimated time comparison

---

## 🔌 Backend API Integration (Planned)

### Simplified Time Tracking APIs:

**Note**: Clock in/out APIs are for status tracking only, not time calculation.

```javascript
// Status tracking (optional)
POST /api/timesheet/clock-in
{
    staffId: "STAFF-001",
    timestamp: "2024-11-20T09:00:00Z"
}

POST /api/timesheet/clock-out
{
    staffId: "STAFF-001",
    timestamp: "2024-11-20T17:00:00Z"
}

// Job time entry (this is the actual timesheet data)
// Time is saved when job is completed
POST /api/jobs/:id/complete
{
    timeSpent: { hours: 2, minutes: 30 },
    workSummary: "...",
    photos: [...],
    signature: "..."
}

// Get timesheet data
GET /api/timesheet/today
Response: {
    date: "2024-11-20",
    jobs: [
        {
            jobId: "JOB-2024-124",
            jobTitle: "Garden Maintenance",
            timeSpent: { hours: 2, minutes: 30 },
            completedAt: "2024-11-20T11:30:00Z"
        },
        {
            jobId: "JOB-2024-125",
            jobTitle: "Pool Cleaning",
            timeSpent: { hours: 1, minutes: 15 },
            completedAt: "2024-11-20T14:15:00Z"
        }
    ],
    totalHours: 3.75, // Sum of all job times
    totalMinutes: 225
}

GET /api/timesheet/week?startDate=2024-11-18
Response: {
    week: [
        {
            date: "2024-11-18",
            jobs: [...],
            totalHours: 6.5
        },
        {
            date: "2024-11-19",
            jobs: [...],
            totalHours: 7.25
        }
        // ... rest of week
    ],
    weekTotal: 35.5
}
```

---

## 📊 Data Relationships

### Simplified Timesheet Entry Structure:
```javascript
timesheetEntry = {
    id: "TS-2024-001",
    staffId: "STAFF-001",
    date: "2024-11-20",
    
    // Job time entries (this is the actual timesheet)
    jobEntries: [
        {
            jobId: "JOB-2024-124",
            jobTitle: "Garden Maintenance",
            customer: "Michael Chen",
            timeSpent: { 
                hours: 2, 
                minutes: 30 
            },
            completedAt: "2024-11-20T11:30:00Z",
            completedBy: "STAFF-001"
        },
        {
            jobId: "JOB-2024-125",
            jobTitle: "Pool Cleaning",
            customer: "Emma Wilson",
            timeSpent: { 
                hours: 1, 
                minutes: 15 
            },
            completedAt: "2024-11-20T14:15:00Z",
            completedBy: "STAFF-001"
        }
    ],
    
    // Calculated totals (sum of job times)
    totalHours: 3.75, // 2.5 + 1.25
    totalMinutes: 225,
    
    // Optional: Status tracking (not used for calculation)
    clockInTime: "2024-11-20T09:00:00Z", // For reference only
    clockOutTime: "2024-11-20T17:00:00Z", // For reference only
    
    // Approval workflow (optional)
    status: "pending|approved|rejected",
    approvedBy: "MANAGER-ID",
    approvedAt: "2024-11-20T18:00:00Z"
}
```

### Key Points:
- **Job Entries**: Each completed job with its time entry
- **Total Time**: Simple sum of all job times
- **No Break Deduction**: Time entered is actual work time
- **No Automatic Calculation**: All time is manually entered

---

## 🎨 UI Components

### Current UI (Dashboard):

1. **Clock In/Out Button:**
   - Green button with clock icon
   - Text changes: "Clock In" ↔ "Clock Out"
   - Shows active time when clocked in

2. **Active Time Card:**
   - Green icon
   - Displays: `HH:MM:SS`
   - Updates every second
   - Shows clock-in timestamp

3. **Break Button:**
   - Orange button
   - Text: "Break Time"
   - Shows break timer when active

4. **Break Timer:**
   - Displays: `MM:SS`
   - Updates every second
   - Resets when break ends

---

## 🔄 Time Calculation Logic

### Total Work Time (Timesheet):
```javascript
// Simple sum of all job time entries
const totalWorkTime = sum of all job.completionData.timeSpent;

// Example:
// Job 1: 2 hours 30 minutes
// Job 2: 1 hour 15 minutes
// Job 3: 3 hours 0 minutes
// Total: 6 hours 45 minutes
```

### Timesheet Calculation:
- **Total Work Time** = Sum of all job time entries for the day
- **No automatic calculation** from clock-in to clock-out
- **No break deduction** - staff enters actual work time
- **Simple and accurate** - what staff enters is what gets paid

### Example:
```
Job 1: 2.5 hours (manually entered)
Job 2: 1.5 hours (manually entered)
Job 3: 2.0 hours (manually entered)
─────────────────────────────
Total: 6.0 hours (for timesheet/payroll)
```

---

## 📝 Usage Scenarios

### Scenario 1: Full Day Work
```
09:00 AM - Clock In (status: Available)
09:00 AM - Start Job #1
11:30 AM - Complete Job #1 → Enter: 2.5 hours (actual work time)
12:00 PM - Break (status: Busy)
12:30 PM - End Break (status: Available)
12:30 PM - Start Job #2
02:00 PM - Complete Job #2 → Enter: 1.5 hours (actual work time)
02:30 PM - Start Job #3
04:30 PM - Complete Job #3 → Enter: 2.0 hours (actual work time)
05:00 PM - Clock Out (status: Off Duty)

Timesheet Total: 6.0 hours (2.5 + 1.5 + 2.0)
Note: Break time NOT included (staff only enters work time)
```

### Scenario 2: Partial Day
```
09:00 AM - Clock In
09:00 AM - Start Job #1
10:30 AM - Complete Job #1 → Enter: 1.5 hours (actual work time)
11:00 AM - Clock Out

Timesheet Total: 1.5 hours
Note: Only job time is tracked, not total elapsed time
```

### Scenario 3: Multiple Jobs
```
08:00 AM - Clock In
08:00 AM - Start Job #1 (Garden Maintenance)
10:00 AM - Complete Job #1 → Enter: 2.0 hours
10:30 AM - Start Job #2 (Pool Cleaning)
11:45 AM - Complete Job #2 → Enter: 1.25 hours (1 hour 15 min)
12:00 PM - Break
12:30 PM - End Break
01:00 PM - Start Job #3 (Repair)
03:00 PM - Complete Job #3 → Enter: 2.0 hours
05:00 PM - Clock Out

Timesheet Total: 5.25 hours (2.0 + 1.25 + 2.0)
```

---

## ⚠️ Current Limitations

1. **No Dedicated Timesheet Page:**
   - Timesheet menu item exists but no page
   - Cannot view list of time entries
   - No weekly/monthly summaries

2. **No Time Entry History:**
   - Cannot view past time entries
   - No daily/weekly/monthly totals
   - No time entry list

3. **No Manager Approval:**
   - Time entries not submitted for approval
   - No review workflow
   - Manager cannot view staff timesheets

4. **No Time Editing:**
   - Cannot correct mistakes after submission
   - No way to edit time entries

5. **No Integration:**
   - Time data not sent to backend
   - No payroll export
   - No reporting features

---

## 🚀 Recommended Enhancements

### 1. Create Timesheet Page (`Staff/timesheet.html`)
- **Daily View**: List of all jobs with time entries for selected date
- **Weekly View**: Calendar showing total hours per day
- **Monthly View**: Summary table with daily totals
- **Job List**: Each entry shows:
  - Job ID, title, customer
  - Time entered (hours + minutes)
  - Completion date/time
  - Link to job details

### 2. Time Summary Dashboard
- **Today's Total**: Sum of all job times today
- **This Week's Total**: Sum of all job times this week
- **This Month's Total**: Sum of all job times this month
- **No overtime calculation** (unless business rules require it)
- **Simple sum**: Total = Sum of all job time entries

### 3. Time Entry Management (Optional)
- Edit entries (with manager approval)
- Add manual entries for non-job work
- Delete entries (with reason and approval)
- Notes on entries

### 4. Manager Review (Optional)
- View all staff timesheets
- Approve/reject entries
- Add comments
- Request corrections

### 5. Reporting & Export
- Export to CSV/PDF
- Payroll integration
- Performance reports
- Time vs. estimated time comparison

---

## 🔐 Permissions

### Staff Can:
- ✅ View own timesheet
- ✅ Clock in/out
- ✅ Track breaks
- ✅ Enter job time
- ✅ View time summaries
- ❌ Edit approved entries
- ❌ View other staff timesheets

### Manager Can:
- ✅ View all staff timesheets
- ✅ Approve/reject entries
- ✅ Edit any time entry
- ✅ Add manual entries
- ✅ Export timesheet data
- ✅ View time reports

---

## 📱 Mobile Considerations

- Large touch targets for clock in/out
- Easy break start/stop
- Quick time entry
- Offline time tracking (sync later)
- GPS location capture (optional)

---

## 🎯 Key Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Clock In/Out | ✅ Implemented | `Staff/index.html` |
| Active Time Display | ✅ Implemented | `Staff/index.html` |
| Break Tracking | ✅ Implemented | `Staff/index.html` |
| Job Time Entry | ✅ Implemented | `Staff/job_detail.html` |
| Timesheet View Page | ❌ Not Created | - |
| Time Entry History | ❌ Not Implemented | - |
| Manager Approval | ❌ Not Implemented | - |
| Time Editing | ❌ Not Implemented | - |
| Export/Reporting | ❌ Not Implemented | - |

---

## 💡 Best Practices

1. **Clock In/Out:**
   - Clock in when starting work (for status visibility)
   - Clock out when finishing work (for status visibility)
   - **Remember**: This is for status only, NOT for time calculation

2. **Job Time Entry (Most Important):**
   - Enter time **immediately** after completing each job
   - Enter **actual work time** spent on the job
   - Be accurate (round to nearest 15 minutes if needed)
   - **Include**: Setup, actual work, cleanup
   - **Exclude**: Travel time, breaks, waiting time
   - **This is what gets paid** - be accurate!

3. **Time Recording:**
   - Record time for each job separately
   - Don't combine multiple jobs into one entry
   - If you worked 2 hours, enter 2 hours (not 3 hours including travel)

4. **Timesheet Review:**
   - Review your timesheet daily
   - Verify all jobs have time entries
   - Report discrepancies immediately
   - Keep notes for unusual entries

---

This guide explains how the current timesheet system works and what features could be added for a complete timesheet management system.

