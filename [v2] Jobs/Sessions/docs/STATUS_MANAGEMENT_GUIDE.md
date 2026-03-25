# Status Management Guide
## Learning Services & Sessions

**Version:** 1.0  
**Last Updated:** December 25, 2024  
**Purpose:** Developer implementation guide for status management

---

## 📋 Overview

This document defines the status system for Learning Services and Sessions, including available statuses, transitions, and user experience requirements.

---

## 🎓 Learning Service Statuses

### Available Statuses

| Status | Description | Default | Final State |
|--------|-------------|---------|-------------|
| **Active** | Service is running and accepting enrollments | ✅ Yes | ❌ No |
| **Archived** | Service ended, historical record only | ❌ No | ✅ Yes |

### Status Transitions

```
Active ──────────> Archived
                   (Cannot be reversed)
```

### Business Rules

1. **New services** are created with `status: "active"`
2. **Archiving** a service:
   - Stops new enrollments
   - Cancels all future sessions
   - Keeps historical data
   - **Cannot be undone**
3. **Archived services**:
   - Read-only
   - Visible in reports/history
   - Cannot be reactivated

---

## 📅 Session Statuses

### Available Statuses

| Status | Description | Default | Final State |
|--------|-------------|---------|-------------|
| **Scheduled** | Session planned for the future | ✅ Yes | ❌ No |
| **Completed** | Session has finished | ❌ No | ✅ Yes |
| **Cancelled** | Session was cancelled | ❌ No | ✅ Yes |

### Status Transitions

```
Scheduled ──────────> Completed
    │
    └─────────────> Cancelled
```

### Business Rules

1. **New sessions** are created with `status: "scheduled"`
2. **Completing** a session:
   - **Requires actual hours worked** for payroll calculation
   - Defaults to estimated duration (from session schedule)
   - User can adjust actual hours if different from estimate
   - Can be manual or automatic (after session end time)
   - Locks enrollment changes
   - Session becomes read-only
3. **Cancelling** a session:
   - Returns slots to customers' inventory
   - Notifies enrolled attendees
   - Requires cancellation reason (optional)
   - **Cannot be undone**
4. **Completed/Cancelled sessions**:
   - Read-only
   - Cannot change status
   - Visible in history/reports

### Payroll Calculation

When marking a session as completed:
- **Actual Hours** field is required for payroll calculation
- Default value = Estimated duration (e.g., 1.5 hours for 90-minute session)
- User can adjust if session ran longer/shorter than planned
- Formula: `Payroll = Actual Hours × Staff Hourly Rate`
- Actual hours are stored for reporting and payroll processing

---

## 🎨 UI/UX Requirements

### Learning Service Status Changes

#### Location 1: Learning Service List Page

**Display:**
- Status badge in card header
- Action buttons or dropdown menu

**Actions:**
```
[Active ▼]  or  [Archive] button

Dropdown options:
├─ ✓ Active (current)
└─ 📦 Archive Service
```

#### Location 2: Learning Service Detail Page

**Display:**
- Status badge in page header
- Archive button in actions menu

**Actions:**
```
Header: [Active ▼] [Edit] [•••]

Menu (•••):
├─ 📝 Edit Service
├─ 📦 Archive Service
└─ 🗑️ Delete (if no sessions exist)
```

#### Archive Confirmation Dialog

```
┌─────────────────────────────────────────┐
│ ⚠️ Archive Learning Service?            │
│                                         │
│ Service: [Service Name]                 │
│                                         │
│ This will:                              │
│ • Mark service as archived              │
│ • Stop new enrollments                  │
│ • Cancel all future sessions            │
│ • Keep historical data for reporting    │
│                                         │
│ ⚠️ This action cannot be undone.        │
│                                         │
│ Optional reason:                        │
│ [Text input field]                      │
│                                         │
│    [Keep Active]  [Archive Service]     │
└─────────────────────────────────────────┘
```

---

### Session Status Changes

#### Location 1: Session List Page

**Display:**
- Status badge on each session card
- Quick action buttons

**Actions:**
```
For Scheduled sessions:
[Scheduled ▼]  or  [Complete] [Cancel] buttons

Dropdown options:
├─ ✓ Scheduled (current)
├─ ✅ Mark as Completed
└─ ❌ Cancel Session

For Completed/Cancelled sessions:
[Completed] or [Cancelled] (read-only badge, no dropdown)
```

#### Location 2: Session Detail Page

**Display:**
- Status badge in page header
- Action buttons

**Actions:**
```
For Scheduled:
Header: [Scheduled ▼] [Edit] [Mark Complete] [Cancel]

For Completed/Cancelled:
Header: [Completed] or [Cancelled] (read-only, no actions)
```

#### Mark as Completed Dialog

```
┌─────────────────────────────────────────┐
│ ✅ Mark Session as Completed?           │
│                                         │
│ Session: [Date] • [Time]                │
│ [Service Name]                          │
│                                         │
│ Attendance: [X]/[Y] attendees           │
│                                         │
│ ─────────────────────────────────────── │
│ Actual Hours Worked (for payroll):     │
│ ┌─────────────────────────────────────┐ │
│ │ 1.5 hours                           │ │  ← Default from duration
│ └─────────────────────────────────────┘ │
│ ℹ️ Default: 1.5 hours (90 min session) │
│ Adjust if session ran longer/shorter   │
│ ─────────────────────────────────────── │
│                                         │
│ Session notes (optional):               │
│ ┌─────────────────────────────────────┐ │
│ │ Great session, covered Chapter 5    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│         [Cancel]  [Mark Completed]      │
└─────────────────────────────────────────┘
```

**Field Details:**
- **Actual Hours Worked**: Required field for payroll calculation
- **Default Value**: Auto-calculated from session duration (e.g., 90 minutes = 1.5 hours)
- **Editable**: User can adjust if session ran longer or shorter
- **Validation**: Must be > 0
- **Format**: Decimal hours (e.g., 1.5, 2.0, 0.5)
- **Usage**: Multiplied by staff hourly rate for payroll

#### Cancel Session Dialog

```
┌─────────────────────────────────────────┐
│ ⚠️ Cancel Session?                      │
│                                         │
│ Session: [Date] • [Time]                │
│ [Service Name]                          │
│                                         │
│ This will:                              │
│ • Cancel this session                   │
│ • Notify [X] enrolled attendees         │
│ • Return slots to customers' inventory  │
│                                         │
│ Cancellation reason (optional):         │
│ [Text area]                             │
│                                         │
│    [Keep Session]  [Cancel Session]     │
└─────────────────────────────────────────┘
```

---

## 📊 Filtering & Display

### Filter Options

**Learning Service List:**
- Filter by status: All | Active | Archived
- Default: Show Active only

**Session List:**
- Filter by status: All | Scheduled | Completed | Cancelled
- Default: Show All

### Display Rules

1. **Archived services** should be visually distinct (grayed out)
2. **Cancelled sessions** should show cancellation reason on hover
3. **Completed sessions** should show completion notes if available
4. **Read-only statuses** (Archived, Completed, Cancelled) should not have status dropdown

---

## ✅ Testing Checklist

### Learning Service Status

- [ ] New service created with `status: "active"`
- [ ] Can archive active service
- [ ] Archive confirmation dialog appears
- [ ] Archiving cancels all future sessions
- [ ] Archived service is read-only
- [ ] Cannot reactivate archived service
- [ ] Archived services visible in history/reports

### Session Status

- [ ] New session created with `status: "scheduled"`
- [ ] Can mark scheduled session as completed
- [ ] Completion dialog appears with actual hours field
- [ ] Actual hours field defaults to estimated duration (e.g., 1.5 for 90 min)
- [ ] Can edit actual hours before completing
- [ ] Validation prevents completing without valid hours (> 0)
- [ ] Actual hours are stored with completed session
- [ ] Can cancel scheduled session
- [ ] Completion dialog appears with notes field
- [ ] Cancellation dialog appears with reason field
- [ ] Completed sessions are read-only
- [ ] Cancelled sessions are read-only
- [ ] Cannot change completed/cancelled status
- [ ] Completed sessions show actual hours in detail view
- [ ] (Optional) Past sessions auto-complete
