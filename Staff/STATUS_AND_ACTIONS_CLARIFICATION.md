# Job Status & Actions Clarification
## Manager vs Staff Perspectives

---

## 📊 Status Lifecycle Overview

```
CREATED → SCHEDULED → IN_PROGRESS → COMPLETED
              ↓            ↓
           ON_HOLD    CANCELED
```

---

## 🎯 Status Definitions

### **CREATED** (Manager Only)
- **Who sees it**: Manager/Admin only
- **Description**: Job has been created but not yet scheduled or assigned
- **Next steps**: Manager must assign staff and set schedule

### **SCHEDULED** (Both Sides)
- **Who sees it**: Both Manager and Staff
- **Description**: Job is assigned to staff and has a scheduled date/time
- **Ready for**: Staff can start working on the job

### **IN_PROGRESS** (Both Sides)
- **Who sees it**: Both Manager and Staff
- **Description**: Staff has started working on the job
- **Active work**: Job is currently being executed

### **ON_HOLD** (Both Sides)
- **Who sees it**: Both Manager and Staff
- **Description**: Job is temporarily paused (can be resumed)
- **Reason**: Usually due to customer unavailability, weather, missing parts, etc.

### **COMPLETED** (Both Sides)
- **Who sees it**: Both Manager and Staff
- **Description**: Job has been successfully finished
- **Final state**: No further actions needed (except invoice generation)

### **CANCELED/CANCELLED** (Both Sides)
- **Who sees it**: Both Manager and Staff
- **Description**: Job cannot be completed (permanent state)
- **Reason**: Customer refused, wrong service, safety issue, etc.

---

## 👔 MANAGER SIDE Actions (`[v2] Jobs/job_detail.html`)

### **Status: CREATED**
**Available Actions:**
- ✅ **Assign Staff** - Select staff member or team
- ✅ **Set Schedule** - Choose date and time
- ✅ **Set Priority** - High, Medium, Low
- ✅ **Edit Job Details** - Name, description, notes
- ✅ **Convert to Recurring** - Create recurring job template
- ❌ **Cannot**: Start job (must be scheduled first)

**Status Transition:**
- `created` → `scheduled` (when staff assigned + schedule set)

---

### **Status: SCHEDULED**
**Available Actions:**
- ✅ **Edit Schedule** - Change date/time
- ✅ **Reassign Staff** - Change staff assignment
- ✅ **Change Priority** - Update priority level
- ✅ **Edit Job Details** - Modify job information
- ✅ **Convert to Recurring** - Make it recurring
- ✅ **Cancel Job** - Cancel the job (→ `cancelled`)
- ✅ **Manual Status Change** - Can change status via dropdown
- ❌ **Cannot**: Start job (staff must do this)

**Status Transitions:**
- Manager can manually change to: `in_progress`, `on_hold`, `completed`, `cancelled`
- Staff action changes to: `in_progress` (when staff clicks "Start Job")

---

### **Status: IN_PROGRESS**
**Available Actions:**
- ✅ **View Progress** - See job status and updates
- ✅ **Pause Job** - Put job on hold (→ `on_hold`)
- ✅ **Mark Complete** - Manually mark as completed (→ `completed`)
- ✅ **Cancel Job** - Cancel the job (→ `cancelled`)
- ✅ **Edit Job Details** - Modify information
- ✅ **View Activity Feed** - See comments and updates
- ✅ **Generate Invoice** - Create invoice for completed work

**Status Transitions:**
- Manager can manually change to: `on_hold`, `completed`, `cancelled`
- Staff actions:
  - Complete Job → `completed`
  - Put On Hold → `on_hold`
  - Cannot Complete → `canceled`

---

### **Status: ON_HOLD**
**Available Actions:**
- ✅ **Resume Job** - Continue work (→ `in_progress`)
- ✅ **View Hold Reason** - See why job was paused
- ✅ **Edit Hold Details** - Update hold information
- ✅ **Cancel Job** - Cancel permanently (→ `cancelled`)
- ✅ **Reassign Staff** - Change assignment if needed

**Status Transitions:**
- Manager can manually change to: `in_progress`, `cancelled`
- Staff action: Resume Job → `in_progress`

---

### **Status: COMPLETED**
**Available Actions:**
- ✅ **Generate Invoice** - Create invoice for customer
- ✅ **Request Feedback** - Get customer review
- ✅ **View Completion Data** - Photos, signature, time spent
- ✅ **Duplicate Job** - Create copy for similar work
- ✅ **View Activity History** - See full job timeline
- ❌ **Cannot**: Change status (final state)

**Status Transitions:**
- ❌ **No transitions** - This is a final state

---

### **Status: CANCELLED**
**Available Actions:**
- ✅ **View Cancel Reason** - See why job was cancelled
- ✅ **View Activity History** - See full job timeline
- ✅ **Duplicate Job** - Create new job from this one
- ❌ **Cannot**: Resume or change status (permanent state)

**Status Transitions:**
- ❌ **No transitions** - This is a permanent final state

---

## 👷 STAFF SIDE Actions (`Staff/job_detail.html`)

### **Status: SCHEDULED**
**Available Actions:**
- ✅ **Start Job** - Begin working (→ `in_progress`)
- ✅ **Call Customer** - Quick contact link
- ✅ **Get Directions** - Open Google Maps
- ✅ **View Job Details** - See all job information
- ✅ **Add Comments** - Communicate with team
- ❌ **Cannot**: Change schedule, reassign, or cancel

**Status Transition:**
- `scheduled` → `in_progress` (when staff clicks "Start Job")

---

### **Status: IN_PROGRESS**
**Available Actions:**
- ✅ **Complete Job** - Finish work (→ `completed`)
  - Requires: Photos, work summary, time spent, signature
- ✅ **Put On Hold** - Pause work temporarily (→ `on_hold`)
  - Requires: Reason and details
- ✅ **Cannot Complete** - Report unable to finish (→ `canceled`)
  - Requires: Reason, details, optional photos
- ✅ **Add Comments** - Update team on progress
- ✅ **View Customer Info** - Contact details (copyable)

**Status Transitions:**
- `in_progress` → `completed` (when staff completes job)
- `in_progress` → `on_hold` (when staff puts on hold)
- `in_progress` → `canceled` (when staff reports cannot complete)

---

### **Status: ON_HOLD**
**Available Actions:**
- ✅ **Resume Job** - Continue work (→ `in_progress`)
- ✅ **View Hold Reason** - See why it was paused
- ✅ **Add Comments** - Update on hold situation
- ❌ **Cannot**: Complete job while on hold

**Status Transition:**
- `on_hold` → `in_progress` (when staff clicks "Resume Job")

---

### **Status: COMPLETED**
**Available Actions:**
- ✅ **View Completion Data** - Photos, signature, summary
- ✅ **Back to Jobs** - Return to job list
- ✅ **View Activity History** - See full timeline
- ❌ **Cannot**: Make changes (read-only)

**Status Transitions:**
- ❌ **No transitions** - Final state for staff

---

### **Status: CANCELED**
**Available Actions:**
- ✅ **View Cancel Reason** - See why job was cancelled
- ✅ **Back to Jobs** - Return to job list
- ✅ **View Activity History** - See full timeline
- ❌ **Cannot**: Resume or change (permanent state)

**Status Transitions:**
- ❌ **No transitions** - Permanent final state

---

## 🔄 Status Dependencies & Rules

### **Who Can Change What**

| Status | Manager Can Change To | Staff Can Change To |
|--------|----------------------|---------------------|
| **created** | scheduled, cancelled | ❌ (doesn't see this) |
| **scheduled** | in_progress, on_hold, completed, cancelled | in_progress |
| **in_progress** | on_hold, completed, cancelled | completed, on_hold, canceled |
| **on_hold** | in_progress, cancelled | in_progress |
| **completed** | ❌ (final) | ❌ (final) |
| **cancelled** | ❌ (final) | ❌ (final) |

---

## 📋 Action Requirements

### **Staff Actions Requiring Data:**

1. **Complete Job** (`in_progress` → `completed`)
   - ✅ Work summary (required)
   - ✅ Time spent - hours & minutes (required)
   - ✅ After photos (optional but recommended)
   - ✅ Before photos (optional)
   - ✅ Customer signature (optional)
   - ✅ Materials used (optional)

2. **Put On Hold** (`in_progress` → `on_hold`)
   - ✅ Reason (required - dropdown)
   - ✅ Additional details (required - text)
   - ✅ Expected resume date (optional)
   - ✅ Supporting photos (optional)

3. **Cannot Complete** (`in_progress` → `canceled`)
   - ✅ Reason (required - dropdown)
   - ✅ Detailed explanation (required - text)
   - ✅ Supporting photos (optional)

---

## 🔐 Permission Matrix

| Action | Manager | Staff |
|--------|---------|-------|
| Create Job | ✅ | ❌ |
| Assign Staff | ✅ | ❌ |
| Set Schedule | ✅ | ❌ |
| Start Job | ❌ | ✅ |
| Complete Job | ✅ (manual) | ✅ (with form) |
| Put On Hold | ✅ (manual) | ✅ (with form) |
| Cannot Complete | ✅ (manual) | ✅ (with form) |
| Resume Job | ✅ (manual) | ✅ |
| Cancel Job | ✅ | ❌ |
| Generate Invoice | ✅ | ❌ |
| Convert to Recurring | ✅ | ❌ |
| Edit Job Details | ✅ | ❌ |
| Change Priority | ✅ | ❌ |
| View All Jobs | ✅ | ❌ (only assigned) |

---

## 🔄 Status Flow Diagram

```
                    [MANAGER CREATES JOB]
                            ↓
                      [CREATED]
                            ↓
              [Assign Staff + Set Schedule]
                            ↓
                      [SCHEDULED]
                            ↓
                    [Staff Starts Job]
                            ↓
                    [IN_PROGRESS]
                    ↙    ↓    ↘
            [ON_HOLD] [COMPLETED] [CANCELED]
                ↓
        [Staff Resumes]
                ↓
        [IN_PROGRESS]
                ↓
        [COMPLETED]
```

---

## ⚠️ Important Rules

1. **Staff cannot skip statuses**
   - Must go: `scheduled` → `in_progress` → `completed`
   - Cannot go directly: `scheduled` → `completed`

2. **Manager can override**
   - Manager can manually change status via dropdown
   - Manager can set status to any valid state

3. **On Hold is temporary**
   - Job can be resumed from `on_hold` → `in_progress`
   - Cannot complete job while on hold

4. **Canceled is permanent**
   - Once `canceled`, job cannot be resumed
   - Different from `on_hold` (which is temporary)

5. **Completed is final**
   - Once `completed`, no further status changes
   - Manager can generate invoice after completion

6. **Staff actions require data**
   - Completing job requires work summary and time
   - Putting on hold requires reason and details
   - Cannot complete requires explanation

---

## 🎨 Visual Status Indicators

### **Manager Side:**
- Status badge with emoji and color
- Progress bar (0-100%)
- Status actions banner with contextual buttons
- Manual status dropdown in sidebar

### **Staff Side:**
- Primary action banner (gradient background)
- Status icon (animated for in_progress)
- Quick actions sidebar
- Color-coded status badges

---

## 📱 Status Change Triggers

### **Automatic Status Changes:**
- None - all status changes are manual actions

### **Manual Status Changes:**

**By Staff:**
- `scheduled` → `in_progress`: Click "Start Job"
- `in_progress` → `completed`: Submit completion form
- `in_progress` → `on_hold`: Submit hold form
- `in_progress` → `canceled`: Submit cannot complete form
- `on_hold` → `in_progress`: Click "Resume Job"

**By Manager:**
- Any status → Any status: Via status dropdown (with validation)
- Can override staff actions if needed

---

## 🔔 Notifications & Activity Log

Both sides see:
- Status change history in activity feed
- Comments and updates
- Who performed each action
- Timestamps for all changes

**Activity Feed Shows:**
- Status transitions (who changed what)
- Comments from staff/manager
- Job assignment notifications
- Completion summaries
- Hold reasons

---

## 💡 Best Practices

1. **Staff should:**
   - Start job when arriving at location
   - Update status accurately
   - Provide detailed completion data
   - Communicate issues via comments

2. **Manager should:**
   - Assign jobs to appropriate staff
   - Set realistic schedules
   - Monitor in-progress jobs
   - Review completion data before invoicing

3. **Status Changes:**
   - Staff: Use action buttons (not manual dropdown)
   - Manager: Can use dropdown for corrections
   - Always provide context in comments

---

## 🚨 Edge Cases

1. **Job put on hold multiple times**
   - Each hold creates new activity log entry
   - Most recent hold reason is displayed
   - Can resume from any hold state

2. **Manager changes status while staff is working**
   - Staff sees updated status immediately
   - Activity log shows who changed it
   - Staff can continue or adjust accordingly

3. **Staff completes job, manager needs to reopen**
   - Manager can change status back to `in_progress`
   - Activity log shows the change
   - Staff can see updated status

4. **Job canceled but needs to be restarted**
   - Manager can create new job from canceled one
   - Or duplicate the job
   - Cannot resume canceled job

---

## 📊 Status Summary Table

| Status | Manager Sees | Staff Sees | Can Manager Change? | Can Staff Change? | Next Valid Statuses |
|--------|--------------|-----------|---------------------|-------------------|---------------------|
| created | ✅ | ❌ | ✅ | ❌ | scheduled, cancelled |
| scheduled | ✅ | ✅ | ✅ | ✅ | in_progress, on_hold, completed, cancelled |
| in_progress | ✅ | ✅ | ✅ | ✅ | completed, on_hold, canceled |
| on_hold | ✅ | ✅ | ✅ | ✅ | in_progress, cancelled |
| completed | ✅ | ✅ | ❌ | ❌ | (final) |
| cancelled | ✅ | ✅ | ❌ | ❌ | (final) |

---

## 🎯 Key Differences: Manager vs Staff

### **Manager Has:**
- ✅ Full status control (can change to any status)
- ✅ Job creation and editing
- ✅ Staff assignment
- ✅ Schedule management
- ✅ Invoice generation
- ✅ Recurring job management
- ✅ View all jobs

### **Staff Has:**
- ✅ Status execution (start, complete, hold)
- ✅ Job completion forms (photos, signature, etc.)
- ✅ Communication (comments)
- ✅ View only assigned jobs
- ❌ Cannot edit job details
- ❌ Cannot change schedule
- ❌ Cannot reassign

---

This document clarifies how statuses depend on each other and what actions are available on both the manager and staff sides of the job detail pages.

