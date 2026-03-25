# Staff Dashboard - Franchise Management System

## Overview

The Staff Dashboard is a dedicated interface for field technicians and service staff to manage their daily work activities. It follows the same design system as the main admin dashboard (`home.html`) for consistency while focusing on staff-specific features.

## Design Philosophy

- **Consistent with Admin Dashboard**: Uses the same `home-styles.css` and design patterns
- **Staff-Centric**: Shows only jobs assigned to the logged-in staff member
- **Mobile-First**: Optimized for field workers on mobile devices
- **Simple & Efficient**: Quick access to essential actions

## Features

### 🏠 Home Dashboard (`index.html`)

Quick overview and daily actions for staff members.

#### Header Section
- **Personalized Greeting**: "Good afternoon, [Staff Name]"
- **Current Date Display**
- **Status Selector**: Available / On Job / Off Duty
  - Visual indicator with colored dot (green/orange/red)
  - Real-time status updates
- **Notifications Bell**: Shows unread count
- **Staff Avatar**: Profile picture with status indicator

#### Quick Actions Bar
Four primary actions in a responsive grid:

1. **Clock In/Out** (Green)
   - Tracks work hours automatically
   - Shows real-time running timer
   - Keyboard shortcut: `Ctrl/Cmd + I`

2. **Check In to Job** (Blue)
   - GPS-based job site verification
   - Validates job ID against assigned jobs
   - Updates status to "On Job"

3. **Update Status** (Purple)
   - Quick progress updates
   - Predefined status options
   - Syncs with backend

4. **Break Time** (Orange)
   - Track break duration
   - Sets status to "Busy"
   - Running break timer

#### Today's Overview (Stats Cards)

Three key metrics cards:

1. **Active Time** (Green Icon)
   - Real-time work duration
   - Clock-in timestamp
   - Format: HH:MM:SS

2. **Jobs Completed** (Blue Icon)
   - Completed vs total today
   - Completion percentage
   - Visual progress indicator

3. **Today's Earnings** (Purple Icon)
   - Estimated daily earnings
   - Week-to-date total
   - Automatic calculation

#### Current Job Section (Conditional)
Displays when a job is active:
- Job title and customer name
- Job ID for reference
- Priority badge (Urgent/High/Normal/Low)
- Location address
- Start time
- **Actions**:
  - Complete Job (Green button)
  - Pause Job (Gray button)

#### My Assigned Jobs

**Filter Tabs**:
- All (shows count)
- Pending
- Scheduled
- Completed

**Job Cards** display:
- Status badge (color-coded)
- Priority indicator
- Scheduled time
- Job title and ID
- Customer name
- Location address
- Duration estimate
- Left border color matches priority

**Job Card Colors**:
- **Urgent**: Red border (`#ef4444`)
- **High**: Orange border (`#f59e0b`)
- **Normal**: Blue border (`#3b82f6`)
- **Low**: Green border (`#10b981`)

**Click Behavior**: View full job details modal

#### Weekly Progress Section
Performance tracking with progress bars:
- Jobs Completed: 15 / 25 (60%)
- Hours Worked: 32.5 / 40 hrs (81%)
- Customer Rating: ⭐ 4.8 / 5.0 (96%)

Each metric shows:
- Label and current/target values
- Color-coded progress bar
- Percentage visualization

### 💼 Jobs List Page (`jobs.html`)

Comprehensive job management interface for viewing and managing all assigned jobs.

#### Statistics Summary
Four key metric boxes at the top:
- **Total Jobs** (Blue): All jobs assigned to staff
- **Pending** (Orange): Jobs awaiting action
- **Scheduled** (Purple): Jobs with confirmed schedule
- **Completed** (Green): Successfully finished jobs

#### Advanced Search & Filters

**Search Bar**:
- Real-time search across job title, customer, ID, and location
- Debounced input (300ms) for performance
- Icon indicator for active search

**Sort Options**:
- Due Date (Soonest) - default
- Due Date (Latest)
- Priority (High to Low)
- Customer (A-Z)

**Status Filter Buttons**:
- All Jobs
- Scheduled
- Pending
- In Progress
- Completed

**View Toggle**:
- List View (default) - Full details in horizontal cards
- Grid View - Compact cards in responsive grid

#### Job Cards

Each job card displays comprehensive information:

**Header Section**:
- Status badge (color-coded)
- Priority badge (Urgent/High/Normal/Low)
- Due date indicator (Today, Tomorrow, In X days)
- Job title (bold, 18px)
- Customer name and Job ID
- Job description

**Right Panel**:
- Estimated pay amount (large, green, bold)
- "Est. Pay" label

**Details Section** (3-column grid):
- Location with address
- Schedule time and duration
- Customer phone number

**Notes Section** (if present):
- Special instructions or notes
- Highlighted with left border

**Action Buttons** (status-dependent):

For **Scheduled/Pending** jobs:
- "Start Job" (Green button)
- "View Details" (Gray button)

For **In Progress** jobs:
- "Complete" (Green button)
- "Update Status" (Gray button)

For **Completed** jobs:
- "View Details" (Gray button only)

#### Job Card Styling

**Priority Color Coding** (left border + background gradient):
- **Urgent**: Red (`#ef4444`) with light red background
- **High**: Orange (`#f59e0b`) with light orange background
- **Normal**: Blue (`#3b82f6`) with light blue background
- **Low**: Green (`#10b981`) with light green background

**Status Badge Colors**:
- Scheduled: Blue (`#dbeafe` bg, `#1e40af` text)
- Pending: Yellow (`#fef3c7` bg, `#92400e` text)
- In Progress: Purple (`#e9d5ff` bg, `#6b21a8` text)
- Completed: Green (`#d1fae5` bg, `#065f46` text)
- On Hold: Red (`#fecaca` bg, `#991b1b` text)

**Hover Effects**:
- Lift up 2px with shadow
- Smooth 0.2s transition
- Cursor pointer

#### Job Details Modal

Clicking any job card shows detailed information:
- Full job title and ID
- Complete customer information (name, phone, email)
- Full address
- Schedule details (date, time, duration)
- Current status and priority
- Estimated pay
- Full description
- Special notes

#### Filtering Logic

**Jobs displayed**: Only jobs where `assignedTo === currentStaff.id`

**Search filters**:
- Job title
- Customer name
- Job ID
- Address location

**Status filters**:
- `all`: No status filtering
- `scheduled`: Only scheduled jobs
- `pending`: Only pending jobs
- `in_progress`: Only in-progress jobs
- `completed`: Only completed jobs

**Sort implementations**:
- `date_asc`: Earliest due date first
- `date_desc`: Latest due date first
- `priority`: Urgent → High → Normal → Low
- `customer`: Alphabetical by customer name

#### Job Actions

**Start Job**:
1. Click "Start Job" button
2. Confirmation dialog appears
3. Job status changes to "In Progress"
4. Stats update automatically
5. Success notification shows
6. Button changes to "Complete"

**Complete Job**:
1. Click "Complete" button
2. Confirmation dialog appears
3. Job status changes to "Completed"
4. Stats update automatically
5. Celebration notification (with emoji)
6. Job card updates appearance

**Update Status**:
1. Click "Update Status"
2. Modal shows status options
3. Select new status
4. Confirmation notification
5. Status syncs to backend

**View Details**:
1. Click "View Details" or anywhere on card
2. Modal shows complete job information
3. Includes all customer and job data
4. Read-only view

#### Empty State

Shows when no jobs match filters:
- Large briefcase icon (64px, gray)
- "No jobs found" heading
- "Try adjusting your filters or search terms" message
- Clear call-to-action

#### Data Structure

**Job Object** (12 sample jobs included):
```javascript
{
    id: 'JOB-YYYY-XXX',
    title: 'Service Name',
    description: 'Detailed description',
    customer: 'Customer Name',
    customerPhone: '+61 400 XXX XXX',
    customerEmail: 'email@example.com',
    time: '9:00 AM',
    duration: '2.5 hrs',
    address: 'Full Address with Suburb VIC Postcode',
    priority: 'urgent|high|normal|low',
    status: 'scheduled|pending|in_progress|completed|on_hold',
    assignedTo: 'STAFF-XXX',
    dueDate: 'YYYY-MM-DD',
    estimatedPay: number,
    notes: 'Special instructions'
}
```

#### Real-time Updates

- Search: Debounced 300ms
- Stats: Update on job status change
- Job list: Re-render on filter/sort change
- Notifications: 3-second display with fade-out

#### Grid View Layout

**Design Features**:
- Responsive grid: Auto-fills with minimum 340px cards
- Mobile: 1 column
- Tablet (769-1200px): Flexible columns
- Desktop: 3-4 columns depending on screen size

**Grid Card Structure**:
1. **Priority Indicator** (Top border)
   - 4px colored gradient bar at top
   - Urgent: Red gradient
   - High: Orange gradient
   - Normal: Blue gradient
   - Low: Green gradient

2. **Card Header** (20px padding)
   - Status and priority badges
   - Job title (18px, bold)
   - Customer name with icon
   - Job ID and due date

3. **Card Body** (20px padding, flex-grow)
   - Job description (3 lines max in practice)
   - Location info row (with ellipsis for long addresses)
   - Time and duration (2-column grid)
   - Notes box (if present, yellow background)
   - Estimated pay badge (green gradient, pushed to bottom)

4. **Card Footer** (Gray background)
   - Action buttons (full width, flexible)
   - Same logic as list view

**Grid Card Styles**:
- Border: 2px solid gray
- Border-radius: 16px (more rounded than list)
- Hover: Lift 4px + border turns blue + larger shadow
- Transition: 0.3s ease (smoother than list)
- Height: 100% (equal height cards in each row)
- Display: Flex column (for footer at bottom)

**Grid vs List Differences**:

| Feature | List View | Grid View |
|---------|-----------|-----------|
| Layout | Vertical stack | Responsive grid |
| Card Shape | Wide horizontal | Compact vertical |
| Priority | Left border (4px) | Top border gradient (4px) |
| Pay Display | Right side, inline | Bottom badge, standalone |
| Hover Lift | 2px | 4px |
| Address | Full address shown | First part + ellipsis |
| Best For | Detailed scanning | Quick overview |
| Cards per Row | 1 | 1-4 (responsive) |

**View Persistence**:
- User's choice saved to `localStorage` as `staffJobsView`
- Automatically loads last used view on page return
- Toggle between views without losing filters/search

### 🎨 Design System

#### Color Palette (Matching `home-styles.css`)
- **Primary Blue**: `#6366f1` (buttons, links)
- **Success Green**: `#10b981` (completed, active)
- **Warning Orange**: `#f59e0b` (breaks, warnings)
- **Danger Red**: `#ef4444` (urgent, errors)
- **Info Purple**: `#9333ea` (updates, info)
- **Gray Shades**: `#111827` to `#f9fafb` (text, backgrounds)

#### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 
  - Page Title: 24px, Bold (700)
  - Section Title: 18px, Semibold (600)
  - Card Title: 16px, Semibold (600)
- **Body Text**: 14px, Regular (400)
- **Small Text**: 12px, Medium (500)
- **Time Display**: Monospace (Courier New) for tabular numbers

#### Spacing
- Card Padding: 20px
- Grid Gap: 12px
- Section Margin: 24px bottom
- Icon Size: 20-24px

#### Components
All components match `home-styles.css`:
- `.action-card`: Quick action buttons
- `.stat-card`: Metric display cards
- `.appointments-card`: Job list container
- `.tab-btn`: Filter tabs
- `.btn-primary`: Primary actions
- `.btn-secondary`: Secondary actions
- `.empty-state`: No data placeholder

### 📱 Sidebar Navigation

**Staff Portal Section**:
- My Dashboard (active)
- My Jobs
- My Schedule
- Timesheet

**Resources Section**:
- Handbook
- Training

**Footer**:
- Support
- Settings

### 🔧 JavaScript Functionality (`staff-home.js`)

#### Core Functions

**Time Tracking**:
```javascript
toggleClockInOut()      // Clock in/out with timer
updateActiveTime()      // Update active time display every second
startBreak()            // Start/end break tracking
updateBreakTimer()      // Update break timer display
```

**Job Management**:
```javascript
loadAssignedJobs(filter) // Load jobs assigned to staff (filtered)
createJobCard(job)       // Generate job card HTML
viewJobDetails(jobId)    // Show full job details
filterJobs(status)       // Filter by status (all/pending/scheduled/completed)
updateJobCounts()        // Update tab badge counts
```

**Status Management**:
```javascript
updateStatus(status)     // Change availability status
showCheckInModal()       // Check in to job by ID
showUpdateModal()        // Update job progress
completeJob()            // Mark job as complete
pauseJob()               // Pause current job
```

**UI Updates**:
```javascript
showNotification(msg, type)  // Toast notifications
initializeDashboard()        // Initialize on load
initializeBanner()           // Banner close handler
```

#### Data Structure

**Staff Data**:
```javascript
staffData = {
    id: 'STAFF-XXX',
    name: 'Full Name',
    status: 'online|busy|offline',
    clockedIn: boolean,
    clockInTime: Date | null,
    onBreak: boolean,
    breakStartTime: Date | null,
    currentJob: Job | null
}
```

**Job Object**:
```javascript
job = {
    id: 'JOB-YYYY-XXX',
    title: 'Service Name',
    customer: 'Customer Name',
    customerEmail: 'email@example.com',
    time: '9:00 AM',
    duration: '2.5 hrs',
    address: 'Full Address',
    priority: 'urgent|high|normal|low',
    status: 'scheduled|pending|completed|in_progress',
    assignedTo: 'STAFF-XXX',
    dueDate: 'YYYY-MM-DD'
}
```

#### Job Filtering Logic

The system only shows jobs where `job.assignedTo === staffData.id`:

```javascript
const myJobs = assignedJobs.filter(job => 
    job.assignedTo === staffData.id
);
```

Status filters further refine the list:
- **All**: No additional filtering
- **Pending**: `job.status === 'pending'`
- **Scheduled**: `job.status === 'scheduled'`
- **Completed**: `job.status === 'completed'`

### 🔒 Security & Permissions

**Access Control**:
- Staff can only view jobs assigned to them (`assignedTo` field)
- Cannot access admin features or other staff's jobs
- Session-based authentication required
- Role verification on backend

**Data Visibility**:
- ✅ Own jobs (assigned)
- ✅ Own timesheet
- ✅ Own performance metrics
- ❌ Other staff jobs
- ❌ System configuration
- ❌ Financial data (except own earnings estimate)

### 📊 Integration Points

#### Required Backend APIs

**Authentication**:
- `POST /api/auth/login` - Staff login
- `GET /api/auth/me` - Get current staff profile

**Jobs**:
- `GET /api/staff/jobs` - Get assigned jobs
  - Query params: `status`, `date`
  - Filter: `assignedTo = current_staff_id`
- `PUT /api/jobs/:id/status` - Update job status
- `POST /api/jobs/:id/checkin` - Check in to job (with GPS)
- `POST /api/jobs/:id/complete` - Mark job complete

**Time Tracking**:
- `POST /api/timesheet/clock-in` - Clock in
- `POST /api/timesheet/clock-out` - Clock out
- `POST /api/timesheet/break-start` - Start break
- `POST /api/timesheet/break-end` - End break
- `GET /api/timesheet/today` - Today's time summary

**Metrics**:
- `GET /api/staff/metrics/today` - Today's stats
- `GET /api/staff/metrics/week` - Weekly performance

### 🎯 Usage Workflows

#### Morning Routine
1. Staff arrives → Opens dashboard
2. Sees personalized greeting
3. Reviews "My Assigned Jobs" for today
4. Clicks "Clock In" button
5. Timer starts, status changes to "Available"
6. Reviews first job details

#### Starting a Job
1. Arrives at job site
2. Clicks "Check In" button
3. Enters Job ID (or scans QR code)
4. System verifies GPS location
5. Status updates to "On Job"
6. Current Job section appears
7. Can use "Update Status" for progress

#### During Work
- Can take tracked breaks
- Update job status as needed
- View upcoming jobs in schedule
- Check estimated earnings

#### Completing a Job
1. Clicks "Complete Job" in Current Job section
2. Confirms completion
3. Job moves to "Completed" tab
4. Earnings estimate updates
5. Current Job section hides
6. Status returns to "Available"
7. Next job becomes visible

#### End of Day
1. Completes all assigned jobs
2. Reviews completed count
3. Checks daily earnings
4. Clicks "Clock Out"
5. Timer stops, summary saved
6. Status changes to "Off Duty"

### 📱 Mobile Optimization

**Responsive Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Features**:
- Touch-optimized buttons (min 44x44px)
- Swipe gestures for job cards
- Fixed header on scroll
- Bottom navigation (future)
- Offline mode (future)

**Performance**:
- Lazy load job cards
- Debounced search/filter
- Optimized images
- Minimal JavaScript bundle
- Service worker caching

### 🔄 Real-time Updates

**Auto-refresh**:
- Job list: Every 60 seconds
- Time displays: Every second
- Status sync: Every 30 seconds
- Notifications: WebSocket (future)

**Background Sync**:
- Queue actions when offline
- Sync when connection restored
- Optimistic UI updates

### 🚀 Future Enhancements

**Planned Features**:
- [ ] Photo upload for job completion
- [ ] Customer signature capture
- [ ] Voice notes for job updates
- [ ] Offline mode with sync
- [ ] Push notifications
- [ ] Route optimization & maps
- [ ] Chat with manager
- [ ] Equipment checklist
- [ ] Expense submission
- [ ] Customer ratings & reviews
- [ ] Training videos library
- [ ] Safety checklists

**Analytics**:
- Average time per job type
- Travel time vs work time
- Customer satisfaction trends
- Overtime patterns
- Break frequency analysis

### 🛠️ Development

**File Structure**:
```
Staff/
├── index.html           # Main dashboard (matches home.html style)
├── staff-home.js        # Dashboard JavaScript functionality
├── jobs.html            # Job list page (full job management)
├── jobs.js              # Jobs list JavaScript functionality
└── README.md           # This documentation
```

**Dependencies**:
- `../home-styles.css` - Shared stylesheet
- Inter font (Google Fonts)
- Font Awesome 6.4.0

**Browser Support**:
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 8+)

### 📝 Customization

**Colors**: Modify in `<style>` tag:
```css
.stat-icon.green { background: #d1fae5; color: #059669; }
```

**Job Priorities**: Update in JavaScript:
```javascript
const priorityLabels = {
    'urgent': { text: 'URGENT', color: '#ef4444' },
    // Add custom priorities
};
```

**Layout**: Adjust grid columns:
```html
<div class="actions-grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
```

---

**Version**: 1.0.0  
**Last Updated**: November 2024  
**Design System**: Matches `home.html` v2  
**Target Users**: Field Service Technicians & Staff
