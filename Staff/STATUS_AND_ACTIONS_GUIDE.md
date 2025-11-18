# Status and Actions Guide

## Where Status and Actions Are Displayed

### 1. **Primary Action Banner** (Top of Page)
- **Location**: Large banner at the top of the job detail page
- **Element ID**: `primaryActionBanner`
- **Function**: `updateStatusBanner()` in `job_detail.js`

### 2. **Quick Actions Sidebar** (Right Side)
- **Location**: Right sidebar card titled "Quick Actions"
- **Element ID**: `quickActionsContainer`
- **Function**: `updateQuickActions()` in `job_detail.js`

---

## How Status and Actions Change

Both the **Primary Action Banner** and **Quick Actions** sidebar dynamically change based on the job's current status. Here's how each status displays:

### 📅 **SCHEDULED** Status

#### Primary Action Banner:
- **Background**: Blue gradient
- **Icon**: Calendar check icon
- **Title**: "Job is Scheduled"
- **Message**: "Ready to start when you arrive at location"
- **Primary Button**: 
  - "Start Job" (green button)
  - Calls `startJob()` function

#### Quick Actions Sidebar:
- **Start Job** button (green)
- **Call Customer** link (phone icon)
- **Get Directions** link (opens Google Maps)

---

### ⚙️ **IN PROGRESS** Status

#### Primary Action Banner:
- **Background**: Orange/yellow gradient
- **Icon**: Spinning spinner icon
- **Title**: "Job in Progress"
- **Message**: "Complete the job when finished"
- **Primary Button**: 
  - "Complete Job" (green button)
  - Calls `openCompleteModal()` function
- **Secondary Buttons**:
  - "On Hold" (orange button) - Calls `openOnHoldModal()`
  - "Cannot Complete" (red button) - Calls `openCannotCompleteModal()`

#### Quick Actions Sidebar:
- **Complete Job** button (green)
- **Put On Hold** button (orange)
- **Cannot Complete** button (red)

---

### ⏸️ **ON HOLD** Status

#### Primary Action Banner:
- **Background**: Yellow/orange gradient
- **Icon**: Pause circle icon
- **Title**: "Job is On Hold"
- **Message**: "This job has been paused"
- **Primary Button**: 
  - "Resume Job" (green button)
  - Calls `resumeJob()` function

#### Quick Actions Sidebar:
- **Resume Job** button (green)
- **View Hold Reason** button (info icon)

---

### ✅ **COMPLETED** Status

#### Primary Action Banner:
- **Background**: Green gradient
- **Icon**: Check circle icon
- **Title**: "Job Completed"
- **Message**: "This job has been successfully completed"
- **No Action Buttons** (read-only state)

#### Quick Actions Sidebar:
- **Back to Jobs** link (returns to job list)

---

### ❌ **CANCELED** Status

#### Primary Action Banner:
- **Background**: Red gradient
- **Icon**: Times circle icon
- **Title**: "Job Canceled"
- **Message**: "This job cannot be completed"
- **No Action Buttons** (read-only state)

#### Quick Actions Sidebar:
- Empty (no actions available)

---

## When Status Changes Are Triggered

The status and actions are updated automatically when:

1. **Page Load**: When `displayJobDetails()` is called
2. **Status Change**: After actions like:
   - `startJob()` - Changes status from `scheduled` → `in_progress`
   - `resumeJob()` - Changes status from `on_hold` → `in_progress`
   - `submitJobCompletion()` - Changes status from `in_progress` → `completed`
   - `submitOnHold()` - Changes status from `in_progress` → `on_hold`
   - `submitCannotComplete()` - Changes status from `in_progress` → `canceled`

---

## Code Flow

```
Job Detail Page Loads
    ↓
loadJobFromURL()
    ↓
displayJobDetails()
    ↓
updateStatusBanner()  ← Updates Primary Action Banner
updateQuickActions()  ← Updates Quick Actions Sidebar
```

---

## Status Values

The job status can be one of:
- `scheduled` - Job is scheduled but not started
- `in_progress` - Job is currently being worked on
- `on_hold` - Job is temporarily paused
- `completed` - Job is finished
- `canceled` - Job cannot be completed

---

## Visual States

Each status has distinct visual styling:
- **Scheduled**: Blue theme
- **In Progress**: Orange/yellow theme with spinning icon
- **On Hold**: Yellow/orange theme
- **Completed**: Green theme
- **Canceled**: Red theme

