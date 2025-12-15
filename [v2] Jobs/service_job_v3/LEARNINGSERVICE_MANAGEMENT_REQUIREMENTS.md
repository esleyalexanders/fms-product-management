# Learning Service Management & Scheduling Feature Enhancement

## 🎯 Overview

This document defines the enhanced Learning Service Management system that supports scheduled service offerings with recurring schedules, flexible staff assignments, and quote-based inventory tracking. A **Learning Service** is the umbrella term for three distinct types: **Class**, **Group**, and **One-to-One**.

---

## 1️⃣ Core Entities and Definitions

### Learning Service (Umbrella Term)

A **Learning Service** is a schedulable educational service offering that can be delivered in three different formats:

| Type | Definition | Key Characteristics | Example |
| :--- | :--- | :--- | :--- |
| **Class** | A regular, structured course of study with a defined curriculum, fixed start and end dates, and scheduled meetings. | Curriculum-driven, cohort-based, comprehensive content over extended period | **AP Calculus Class** - Semester-long course with fixed curriculum |
| **Group** | Multiple students (usually 2 or more) learning the same content simultaneously with one instructor. | High student-to-tutor ratio (2+:1), collaborative learning, lower cost per student | **Math Tutoring Group** - Flexible group sessions for algebra help |
| **One-to-One** | One tutor works exclusively with one student during a session. | 1:1 ratio, highly personalized, targeted instruction, highest cost per session | **Personalized SAT Prep** - Individual tutoring session |

**Note:** Throughout this document, "Learning Service" refers to any of these three types unless specifically stated otherwise.

### Core Entities

| Term | Enhanced Definition | Example |
| :--- | :--- | :--- |
| **Learning Service** | A distinct, schedulable service offering. It is the **master template** for a series of lessons. Can be a Class, Group, or One-to-One type. | **Advanced Yoga Class** (Class type), **Math Tutoring Group** (Group type), **Personalized SAT Prep** (One-to-One type) |
| **Price Book Item** | The purchasable product/service that links directly to a Learning Service. This item represents the customer's *entitlement* to a number of Learning Service Sessions. | **Yoga - Aerobic** (Price: $20/slot) |
| **Learning Service Session** | A single, specific instance of the Learning Service occurring at a set time and date. Multiple Sessions make up a Learning Service schedule. | The **Advanced Yoga Class** scheduled for **Mon, Dec 8th, 2025, at 2:00 PM** |
| **Staff Assignment** | Instructors, lecturers, tutors, or other personnel assigned to teach or run the Learning Service or a specific Session. | Staff A and Staff B |

---

## 2️⃣ Learning Service Definition and Scheduling

### Financial Linkage
- **Requirement:** Every **Learning Service** must be linked to exactly one **Price Book Item**.
- **Purpose:** Establishes the commercial tie-in and enables customers to purchase slots.
- **Example:** The **Advanced Yoga Class** (Class type) is linked to the **Yoga - Aerobic** Price Book Item.

### Type-Specific Characteristics

#### Class Type
- **Curriculum:** Must have a defined curriculum or course outline
- **Cohort Dates:** Requires fixed start and end dates
- **Cohort Size:** Tracks enrolled students in the cohort
- **Structure:** Follows a structured progression through content

#### Group Type
- **Min Capacity:** Requires minimum number of students (e.g., 2+)
- **Max Capacity:** Flexible group size limits
- **Flexible Scheduling:** Can be scheduled on-demand or recurring
- **No Fixed Curriculum:** Content can be adapted per session

#### One-to-One Type
- **Fixed Ratio:** Always 1:1 (one student, one instructor)
- **Max Capacity:** Always 1
- **Personalization:** Highly personalized instruction
- **Focus Area:** Can specify focus areas and personalization levels

### Scheduling Capabilities
- **Recurring Schedules:** The system supports defining recurring schedules for **Learning Services**.
  - Examples: Every Monday, Wednesday, Friday at 2 PM
  - Weekly patterns
  - Custom intervals
- **Schedule Definition:** Managers can define:
  - Days of the week
  - Time slots
  - Duration
  - Start and end dates (optional, required for Class type)

### Default Staff/Team Assignment
- **Multiple Assignment Support:** Multiple Staff members or Teams can be assigned as default instructors for the **Learning Service**.
- **Unified Search:** Search for both staff and teams by name, skills, or role.
- **Team Support:** Assign entire teams to a Learning Service; team members are all assigned.
- **Example:** Staff A, Staff B, and the Math Department team are all assigned to **Advanced Yoga Class**.
- **Inheritance:** Learning Service Sessions inherit these default assignments (can be overridden per session).
- **Recommended Assignments:** System suggests relevant staff/teams based on skills and availability.

---

## 3️⃣ Managing Learning Service Sessions

### Automated Generation
- **Weekly Auto-Generation:** **Learning Service Sessions** are automatically generated weekly based on the **Learning Service** schedule.
- **Generation Rules:**
  - Follows the recurring schedule pattern defined in the Learning Service
  - Creates sessions for upcoming weeks (configurable look-ahead period)
  - Respects start/end dates if defined (especially for Class type)
  - For One-to-One type: Generates sessions with max capacity of 1

### Manual Override/Pre-creation
- **Manager Control:** Managers can manually pre-create **Learning Service Sessions** for future dates.
- **Use Cases:**
  - Optimize resource planning
  - Handle special scheduling needs
  - Plan ahead for holidays or special events
  - Adjust for staff availability
  - Create one-off Group or One-to-One sessions

### Flexible Staff Assignment

#### Default Inheritance
- **Inheritance Rule:** By default, a **Learning Service Session** inherits the Staff assigned to the **Learning Service**.
- **Example:** If **Advanced Yoga Class** has Staff A and Staff B as defaults, all generated sessions will have Staff A and Staff B assigned.

#### Per-Session Override
- **Override Capability:** Managers can **override** the default assignment for any specific **Learning Service Session**.
- **Use Cases:**
  - Staff unavailability (sick leave, vacation)
  - Substitute instructors
  - Special event requirements
  - Skill-specific sessions
  - One-to-One sessions may require specific tutor assignments
- **Example:** For a specific Wednesday session, assign Staff C instead of Staff A.

---

## 4️⃣ Slot Booking and Inventory Management

### Quote-Based Inventory System

#### Core Concept
- **Entitlement Tracking:** Customer booking eligibility is determined by the quantity of the linked **Price Book Item** purchased across all of their **Quotes** (Sales Orders/Invoices).
- **Centralized View:** The system provides a clear, centralized view of each customer's remaining entitlements.

#### Slot Aggregation
- **Aggregation Rule:** The system aggregates the total purchased quantity (slots) from all relevant customer quotes.
- **Calculation:**
  ```
  Total Bookable Slots = Sum of (Price Book Item quantity) across all customer's approved quotes
  ```
- **Result:** This defines the **maximum bookable slots** for that customer for that specific **Learning Service**.

#### Booking Mechanism
- **Slot Deduction:** When a customer books a **Learning Service Session**, one slot is deducted from their aggregated pool of purchased slots.
- **Inventory Tracking:**
  - Remaining slots = Total purchased slots - Used slots
  - Used slots = Sum of all bookings across all Learning Service Sessions for that Learning Service
- **Prevention:** System prevents booking if customer has no remaining slots.
- **Type-Specific Considerations:**
  - **One-to-One:** Each session consumes exactly 1 slot per customer
  - **Group:** Multiple customers can book the same session (up to max capacity)
  - **Class:** Multiple customers can book sessions within the cohort structure

### Example Scenario

**Customer:** Miss A

**Purchases:**
- Quote 1: **2 slots** of **Yoga - Aerobic** (Price Book Item)
- Quote 2: **3 slots** of **Yoga - Aerobic** (Price Book Item)

**Result:**
- Miss A has a total of **5 bookable slots**
- Manager can schedule her into **Learning Service Sessions** linked to the **Yoga - Aerobic** Price Book Item
- Each booking deducts 1 slot from her pool of 5
- System tracks: 5 total - X used = Y remaining

---

## 5️⃣ Data Model Structure

### Learning Service Entity
```javascript
{
  id: "LS-2024-001",
  name: "Advanced Yoga Class",
  type: "Class", // "Class", "Group", or "One-to-One"
  pricebookItemId: "PB-YOGA-AEROBIC",
  pricebookItem: {
    id: "PB-YOGA-AEROBIC",
    name: "Yoga - Aerobic",
    price: 20.00
  },
  
  // Scheduling
  schedule: {
    frequency: "weekly", // daily, weekly, monthly, custom
    daysOfWeek: ["Monday", "Wednesday", "Friday"],
    startTime: "14:00",
    endTime: "15:30",
    duration: 90, // minutes
    startDate: "2025-01-01",
    endDate: null, // null = ongoing, required for Class type
    timezone: "Australia/Melbourne"
  },
  
  // Default Staff/Team Assignments
  defaultAssignments: [
    { 
      id: "STAFF-001", 
      name: "Staff A", 
      type: "staff", 
      role: "Senior Tutor",
      hourlyRate: 45.00,      // Default rate from staff profile
      assignedRate: 50.00     // Overridden rate for this Learning Service
    },
    { 
      id: "STAFF-002", 
      name: "Staff B", 
      type: "staff", 
      role: "Math Specialist",
      hourlyRate: 40.00,
      assignedRate: 40.00     // Same as default
    },
    { 
      id: "TEAM-001", 
      name: "Math Department", 
      type: "team", 
      members: 4 
      // Teams don't have hourly rates - individual team member rates apply
    }
  ],
  
  // Capacity
  maxCapacity: 20, // For One-to-One type, this is always 1
  minCapacity: null, // For Group type, minimum required (e.g., 2)
  
  // Type-Specific Fields
  // For Class type:
  curriculum: "Advanced Ashtanga Yoga Program",
  cohortStartDate: "2025-01-01",
  cohortEndDate: "2025-03-31",
  cohortSize: 20,
  
  // For Group type:
  // minCapacity: 2,
  
  // For One-to-One type:
  // focusArea: "SAT Math",
  // personalizationLevel: "High",
  
  // Default Enrollments (for Group and One-to-One types)
  // These attendees are enrolled in all sessions by default
  enrollments: [
    {
      id: "ENROLL-001",
      attendeeName: "Alice Johnson",
      attendeeEmail: "alice@email.com",
      notes: "Prefers front row seating",
      customerId: "CUST-001",
      customerName: "Miss A",
      quoteId: "Q-2024-020",
      status: "confirmed", // confirmed, cancelled
      enrolledAt: "2024-12-01T10:00:00Z",
      enrolledInAllSessions: true, // If true, auto-enrolled in all sessions
      // Optional: track transfers
      transferredFrom: null, // Learning Service ID if transferred
      transferReason: null,
      transferredAt: null
    }
  ],
  
  // Metadata
  skillLevel: "Advanced",
  description: "Advanced yoga class for experienced practitioners",
  status: "active", // active, paused, archived
  createdAt: "2024-11-01T10:00:00Z",
  updatedAt: "2024-11-15T14:30:00Z"
}
```

### Learning Service Session Entity
```javascript
{
  id: "SESSION-2024-001",
  learningServiceId: "LS-2024-001",
  learningServiceName: "Advanced Yoga Class",
  learningServiceType: "Class", // "Class", "Group", or "One-to-One"
  
  // Schedule
  date: "2025-12-08",
  startTime: "14:00",
  endTime: "15:30",
  duration: 90,
  
  // Staff/Team Assignment (inherited or overridden)
  assignedStaff: [
    { id: "STAFF-003", name: "Staff C", type: "staff", role: "Substitute Tutor" } // Override: Staff C instead of default
  ],
  staffOverride: true, // Indicates if default was overridden
  // If staffOverride is false, assignments are inherited from Learning Service defaultAssignments
  
  // Enrollment
  bookings: [
    {
      id: "BOOKING-001",
      customerId: "CUST-001",
      customerName: "Miss A",
      quoteId: "Q-2024-020",
      slotsUsed: 1,
      status: "confirmed", // confirmed, cancelled
      bookedAt: "2024-11-10T09:00:00Z"
    }
  ],
  confirmedSlots: 15,
  availableSlots: 5, // maxCapacity - confirmedSlots
  
  // Status
  status: "scheduled", // scheduled, in_progress, completed, cancelled
  notes: "Substitute instructor for this session",
  
  // Metadata
  createdAt: "2024-11-01T10:00:00Z",
  updatedAt: "2024-11-15T14:30:00Z"
}
```

### Customer Slot Inventory
```javascript
{
  customerId: "CUST-001",
  customerName: "Miss A",
  pricebookItemId: "PB-YOGA-AEROBIC",
  pricebookItemName: "Yoga - Aerobic",
  
  // Inventory Tracking
  totalPurchasedSlots: 5, // From all quotes
  usedSlots: 2,
  remainingSlots: 3,
  
  // Quote Breakdown
  quoteBreakdown: [
    {
      quoteId: "Q-2024-020",
      slots: 2,
      usedSlots: 1,
      remainingSlots: 1,
      status: "approved"
    },
    {
      quoteId: "Q-2024-021",
      slots: 3,
      usedSlots: 1,
      remainingSlots: 2,
      status: "approved"
    }
  ],
  
  // Booking History
  bookings: [
    {
      sessionId: "SESSION-2024-001",
      sessionDate: "2025-12-08",
      slotsUsed: 1,
      bookedAt: "2024-11-10T09:00:00Z"
    }
  ],
  
  lastUpdated: "2024-11-15T14:30:00Z"
}
```

---

## 6️⃣ Key Features and Workflows

### Feature 1: Learning Service Creation
1. Manager creates a new Learning Service
2. Selects type: Class, Group, or One-to-One
3. Links to exactly one Price Book Item
4. Defines recurring schedule (days, time, duration)
5. Assigns default staff
6. Sets capacity settings (type-specific)
7. Enters type-specific fields (curriculum for Class, minCapacity for Group, focusArea for One-to-One)
8. System validates all required fields

### Feature 2: Automatic Session Generation
1. System runs weekly (or configurable interval)
2. Generates Learning Service Sessions based on Learning Service schedule
3. Inherits default staff assignments
4. Creates sessions for upcoming period (e.g., next 4 weeks)
5. Respects start/end dates if defined (especially for Class type)
6. For One-to-One type: Ensures max capacity is always 1

### Feature 3: Manual Session Management
1. Manager views list of Learning Service Sessions
2. Can manually create individual sessions
3. Can edit/delete future sessions
4. Can override staff assignment per session
5. Can add notes for specific sessions
6. Can filter sessions by type (Class, Group, One-to-One)

### Feature 4: Customer Slot Inventory
1. System aggregates slots from all customer quotes
2. Shows total purchased, used, and remaining slots
3. Updates in real-time as bookings are made
4. Prevents booking if no slots available
5. Shows quote breakdown for transparency

### Feature 5: Attendee Enrollment (Group and One-to-One only)
1. Manager opens Enrollment tab (hidden for Class type)
2. Views enrollment stats (Total, Confirmed, Available, Fill Rate)
3. Clicks "Add Attendee" to open enrollment modal
4. Searches for customer with available slots
5. Enters attendee details (name, email, notes)
6. Confirms enrollment
7. **Default Behavior:** Attendee is automatically enrolled in ALL sessions
8. Individual session attendance can be modified later
9. Slot is deducted from customer's inventory

### Feature 5a: Transfer Attendee
1. Manager clicks Transfer icon on attendee row
2. System shows Transfer Modal with attendee info
3. Dropdown shows compatible learning services (same price book item)
4. Manager selects target service and optional reason
5. Confirms transfer
6. Attendee is removed from current service
7. Attendee is added to target service (all sessions)
8. Slot moves with attendee (not returned to customer)

### Feature 5b: Remove Attendee
1. Manager clicks Remove icon on attendee row
2. Confirmation dialog shows attendee name
3. Manager confirms removal
4. Attendee is removed from all future sessions
5. Slot is returned to customer's available inventory

### Feature 6: Session Booking Management
1. Manager selects a Learning Service Session
2. Views available slots and current bookings
3. Inherited enrollees shown by default (from Learning Service enrollments)
4. Can add/remove attendees for this specific session only
5. Session-level changes don't affect default enrollment
6. For One-to-One: Session becomes fully booked after one booking

### Feature 8: Staff Override
1. Manager views Learning Service Session details
2. Sees default staff assignments (inherited from Learning Service)
3. Can override for this specific session
4. Selects alternative staff member(s)
5. System saves override and shows indicator
6. Future sessions still use default staff
7. For One-to-One: May require specific tutor matching based on focus area

---

## 7️⃣ Business Rules

### Learning Service Rules
- ✅ Every Learning Service must have exactly one Price Book Item
- ✅ Staff assignment is optional during creation
- ✅ At least one staff member required before generating sessions
- ✅ Schedule must include at least one day of week
- ✅ Start time must be before end time
- ✅ Duration must be positive
- ✅ Type must be specified: "Class", "Group", or "One-to-One"
- ✅ Class type must have curriculum, cohortStartDate, and cohortEndDate
- ✅ Group type must have minCapacity defined
- ✅ One-to-One type must have maxCapacity = 1, and may include focusArea and personalizationLevel

### Session Rules
- ✅ Sessions cannot be created in the past (unless manually allowed)
- ✅ Sessions inherit default staff unless overridden
- ✅ Cannot exceed max capacity
- ✅ Cannot book customer without available slots

### Inventory Rules
- ✅ Slots are only deducted when booking is confirmed
- ✅ Cancelled bookings restore slots to customer inventory
- ✅ Slots are learning service-specific (tied to Price Book Item)
- ✅ Inventory is calculated from approved quotes only

### Booking Rules
- ✅ One slot = one booking per session
- ✅ Customer must have remaining slots to book
- ✅ Cannot double-book same customer in same session
- ✅ One-to-One sessions: Only one customer per session (max capacity = 1)
- ✅ Group sessions: Must meet minimum capacity requirement before session can proceed

### Enrollment Rules (Group and One-to-One only)
- ✅ Enrollment tab is only available for Group and One-to-One types
- ✅ Class type manages enrollment differently (at cohort level)
- ✅ Enrolling an attendee automatically adds them to ALL future sessions
- ✅ Session-level attendance can be modified without affecting default enrollment
- ✅ Removing an attendee removes them from all future sessions
- ✅ Removing an attendee returns the slot to customer's available inventory
- ✅ Transferring an attendee requires target service with same price book item
- ✅ Transferring moves the slot (not returned to customer)
- ✅ Cannot enroll more attendees than max capacity

---

## 8️⃣ Screen Inventory

**Total Screens Required: 7**

The system requires **7 main screens** to support all Learning Service Management functionality:

| # | Screen Name | File Name | Purpose | Priority |
|:--|:------------|:----------|:--------|:---------|
| 1 | **Learning Service List** | `learning_service_list.html` | Display all Learning Services (Class, Group, One-to-One) with filtering and search | HIGH |
| 2 | **Learning Service Create** | `learning_service_create.html` | Create new Learning Service with type selection, schedule and staff setup | HIGH |
| 3 | **Learning Service Detail** | `learning_service_detail.html` | View AND edit Learning Service (merged view/edit modes) | HIGH |
| 4 | **Session List** | `session_list.html` | Calendar/list view of all Learning Service Sessions | HIGH |
| 5 | **Session Detail** | `session_detail.html` | View/manage individual session, bookings, staff | HIGH |
| 6 | **Session Create** | `session_create.html` | Manually create individual Learning Service Session | MEDIUM |
| 7 | **Customer Inventory** | `customer_inventory.html` | View customer slot inventory and booking history | HIGH |

**Note:** Learning Service Detail (Screen 3) combines view and edit functionality using a toggle-based approach. Users can switch between View Mode and Edit Mode on the same page.

---

## 9️⃣ User Interface Requirements

### Screen 1: Learning Service List (`learning_service_list.html`)
**Purpose:** Main entry point for Learning Service Management

**Features:**
- List of all Learning Services in card/table view
- Stats cards: Total Learning Services, Active, Paused, Archived
- Breakdown by type: Class count, Group count, One-to-One count
- Create new Learning Service button (prominent)
- Filter by:
  - Type (Class, Group, One-to-One)
  - Status (active, paused, archived)
  - Price Book Item
  - Default staff member
  - Skill level
- Search functionality (by name, description)
- Sort options (name, date created, status, type)
- Quick actions per Learning Service:
  - View Details
  - Edit
  - Archive/Pause
  - Generate Sessions
- Navigation to Learning Service Detail screen
- Color-coded type badges (Class, Group, One-to-One)

**Key Metrics Display:**
- Total Learning Services count
- Active Learning Services count
- Breakdown by type (Class/Group/One-to-One)
- Total Sessions generated
- Average enrollment rate

---

### Screen 2: Learning Service Create (`learning_service_create.html`)
**Purpose:** Create a new Learning Service with all required configuration

**Form Sections:**
1. **Basic Information**
   - Learning Service Name (required)
   - Type Selection (required): Class, Group, or One-to-One
   - Description
   - Skill Level
   - Status (default: active)

2. **Price Book Item Selection** (required)
   - Single select dropdown/search
   - Display selected Price Book Item details
   - Price display

3. **Type-Specific Fields** (shown based on selected type)
   
   **For Class Type:**
   - Curriculum (required)
   - Cohort Start Date (required)
   - Cohort End Date (required)
   - Cohort Size
   
   **For Group Type:**
   - Min Capacity (required, e.g., 2)
   
   **For One-to-One Type:**
   - Focus Area (optional)
   - Personalization Level (optional)

4. **Schedule Configuration**
   - Frequency: Daily, Weekly, Monthly, Custom
   - Days of Week picker (for weekly)
   - Start Time (required)
   - End Time (required)
   - Duration (auto-calculated or manual)
   - Start Date (optional, required for Class type)
   - End Date (optional, null = ongoing, required for Class type)
   - Timezone selection

5. **Default Staff Assignment** (optional, can be assigned later)
   - Unified search for staff and teams
   - Search by name, skills, or role
   - Selected Assignments list with count
   - Support for both individual staff and teams
   - Team assignments show member count
   - **Hourly Rate per Staff** (for individual staff only):
     - Defaults to staff member's pay rate from their profile
     - Manager/Admin can override for this specific Learning Service
     - Reset button to restore default rate
     - Shows "Default: $X.XX/hr from staff profile" hint
   - Remove assignment option
   - Recommended Assignments section
   - Refresh recommendations button
   - Visual distinction between staff (circle avatar) and teams (square icon)

6. **Capacity Settings**
   - Max Capacity (required, default: 10, always 1 for One-to-One)
   - Min Capacity (for Group type only)

7. **Actions**
   - Create Learning Service (redirects to detail page)
   - Cancel (returns to list)

**Validation:**
- All required fields must be filled
- Type must be selected
- Price Book Item must be selected
- Staff assignment is optional during creation (can be assigned later)
- Start time < end time
- At least one day selected for weekly schedule
- Duration > 0
- Class type: curriculum, cohortStartDate, cohortEndDate required
- Group type: minCapacity required
- One-to-One type: maxCapacity must be 1

---

### Screen 3: Learning Service Detail (`learning_service_detail.html`)
**Purpose:** View AND edit Learning Service (merged view/edit with toggle)

**Modes:**
This screen supports two modes that users can toggle between:

| Mode | Description | Header Actions |
|------|-------------|----------------|
| **View Mode** (default) | Read-only display of all information | [Edit] [Archive] [Generate Sessions] |
| **Edit Mode** | Editable form fields | [Save Changes] [Cancel] |

**View/Edit Toggle Behavior:**
- Click "Edit" → switches entire page to Edit Mode
- Fields become editable inputs (text inputs, dropdowns, etc.)
- "Save Changes" validates and saves, returns to View Mode
- "Cancel" discards changes, returns to View Mode
- Sticky header keeps Save/Cancel buttons visible while scrolling

**Tab Navigation:**
The screen uses **4 tabs** to organize content:

| Tab | Purpose | Available in Edit Mode? |
|-----|---------|------------------------|
| **1. Overview** | Basic info, schedule, capacity, type-specific details | ✅ Yes (editable) |
| **2. Staff Assignment** | Default staff/team assignments with hourly rates | ✅ Yes (editable) |
| **3. Enrollment** | Customer bookings and enrollment management | ❌ No (view only) |
| **4. Sessions** | List of all Learning Service Sessions | ❌ No (view only) |

**Tab Structure:**

#### **Tab 1: Overview**
**View Mode:**
- Learning Service Information Card
  - Name, description, skill level, type, price book item, status
- Type-Specific Information Card (shown based on type)
  - **Class:** Curriculum, Cohort Start Date, Cohort End Date, Cohort Size
  - **Group:** Min Capacity
  - **One-to-One:** Focus Area, Personalization Level
- Schedule Configuration Card
  - Recurring schedule pattern, days, time, duration, start/end dates
- Capacity Settings Card
  - Max capacity, Min capacity (for Group), Current enrollment summary
- Price Book Item Card
  - Linked Price Book Item with link to pricebook

**Edit Mode:**
- All fields become editable (except Type which is read-only with 🔒 icon)
- ⚠️ Warning shown if schedule changes will affect existing sessions

#### **Tab 2: Staff Assignment**
**View Mode:**
- Default Staff/Team Assignments Card
  - List of assigned staff members and teams
  - Visual distinction: Staff (circle avatar), Teams (square icon)
  - Hourly Rate per Staff displayed
  - Team assignments show member count
  - Staff role/skills displayed

**Edit Mode:**
- Unified search for staff and teams
- Add/remove assignments
- Edit hourly rates per staff member
- Recommended assignments section
- Refresh recommendations button
- ⚠️ Warning shown if staff changes will affect existing sessions

#### **Tab 3: Enrollment**
**Available for:** Group and One-to-One types only (hidden for Class type)

**View Mode Only** (not editable from Overview/Staff tabs):
- Enrollment Stats Cards
  - Total Enrolled, Confirmed, Available Slots, Fill Rate
- Info Banner explaining default enrollment behavior
- Enrolled Attendees List
  - Search enrolled attendees by name, email, or customer
  - List of all enrollments with customer details
  - Quote ID, enrollment status, notes
  - **Actions per attendee:**
    - **Transfer**: Move attendee to another compatible learning service
    - **Remove**: Remove attendee from enrollment (returns slot to customer)

**Add Attendee Modal:**
- Customer search with autocomplete
- Slot inventory display (Total, Booked, Available)
- Attendee details form:
  - Attendee Name (required)
  - Email (optional)
  - Notes (optional)
- Info banner: "Attendee will be automatically enrolled in all future sessions"
- Enroll button

**Default Enrollment Behavior:**
- When an attendee is enrolled, they are automatically added to ALL sessions by default
- Individual session attendance can be modified from the Sessions tab or Session Detail page
- This allows for bulk enrollment with session-by-session exceptions

**Transfer Attendee:**
- Opens Transfer Modal
- Shows current attendee info
- Dropdown of compatible learning services (same price book item, active status)
- Optional transfer reason
- Slot moves with the attendee (not returned to customer)

**Remove Attendee:**
- Confirmation dialog with attendee name
- Removes from all future sessions
- Returns slot to customer's available inventory

#### **Tab 4: Sessions**
**View Mode Only** (not editable from this tab):
- Sessions Header
  - Create Session button
  - Generate Sessions button
- Sessions List
  - List/calendar view of all Learning Service Sessions
  - Filter by date range
  - Show enrollment status per session
  - Quick actions: View Session, Edit Session
  - Empty state if no sessions

**Header** (sticky in Edit Mode):
- Learning Service name and ID
- Type badge (Class, Group, or One-to-One) with color coding
- Status badge
- **View Mode:** [Edit] [Archive] [Generate Sessions] buttons
- **Edit Mode:** [Save Changes] [Cancel] buttons

**Sidebar Actions** (always visible):
- Generate Sessions (with date range picker)
- View All Sessions
- Archive Learning Service
- Delete Learning Service (if no sessions)

**Tab Behavior in Edit Mode:**
- **Overview & Staff Assignment tabs:** Fully editable when in Edit Mode
- **Enrollment & Sessions tabs:** Disabled/hidden in Edit Mode (view only)
- User must save changes before switching to Enrollment or Sessions tabs
- If user clicks Enrollment/Sessions while in Edit Mode, show: "Please save or cancel changes first"

**⚠️ Edit Mode Cautions & Handling:**

| Scenario | Handling |
|----------|----------|
| **Unsaved changes + navigate away** | Browser confirmation: "You have unsaved changes. Leave anyway?" |
| **Unsaved changes + switch tabs** | Prevent tab switch, show: "Please save or cancel changes first" |
| **Schedule/Staff changes affect sessions** | Warning dialog: "This will affect X existing sessions. Apply to: ○ Future only ○ All sessions" |
| **Type field** | Read-only after creation with 🔒 icon and "(Cannot be changed)" text |
| **Validation errors** | Inline field errors + summary at top of form |
| **Long form scrolling** | Sticky header with Save/Cancel always visible |
| **Permission check** | Hide "Edit" button for users without edit permission |

**URL State:**
- View: `learning_service_detail.html?id=123`
- Edit: `learning_service_detail.html?id=123&mode=edit` (optional, allows bookmarking edit mode)

**Navigation:**
- Back to Learning Service List
- Create Session (manual)

---

### Screen 4: Session List (`session_list.html`)
**Purpose:** Calendar and list view of all Learning Service Sessions

**View Options:**
1. **Calendar View** (default)
   - Week view (7 days)
   - Month view
   - Day view
   - Time slots (7 AM - 9 PM)
   - Color-coded by Learning Service type (Class, Group, One-to-One)
   - Show enrollment (X/Y slots)
   - Type badges on session cards

2. **List View**
   - Table with columns:
     - Date & Time
     - Learning Service Name
     - Type (Class, Group, One-to-One) with badge
     - Staff
     - Enrollment (X/Y)
     - Status
     - Actions

**Filters:**
- Date range picker
- Learning Service filter (multi-select)
- Type filter (Class, Group, One-to-One)
- Staff filter (multi-select)
- Status filter (scheduled, in_progress, completed, cancelled)
- Search by Learning Service name

**Quick Actions:**
- View Session Detail
- Edit Session
- Cancel Session
- Book Customer (quick action)

**Stats Display:**
- Total Sessions
- Upcoming Sessions
- Sessions Today
- Breakdown by type (Class/Group/One-to-One sessions)
- Average Enrollment Rate

---

### Screen 5: Session Detail (`session_detail.html`)
**Purpose:** Detailed view and management of a single Learning Service Session

**Sections:**
1. **Header**
   - Session date and time
   - Learning Service name (with link to Learning Service Detail)
   - Type badge (Class, Group, or One-to-One)
   - Status badge
   - Quick actions: Edit, Cancel

2. **Session Information Card**
   - Date and time
   - Duration
   - Learning Service link with type
   - Status

3. **Type-Specific Information** (shown based on Learning Service type)
   
   **For Class Type:**
   - Curriculum information
   - Cohort details
   
   **For Group Type:**
   - Min capacity requirement
   
   **For One-to-One Type:**
   - Focus area
   - Personalization level

4. **Staff/Team Assignment Card**
   - Default assignments (inherited from Learning Service) - with "Inherited" indicator
   - Shows both staff members and teams with visual distinction
   - Override assignments (if overridden) - with "Overridden" indicator
   - "Override Default Assignments" button
   - Staff/team override modal with unified search
   - Recommended assignments for this session
   - For One-to-One: May show tutor specialization matching

5. **Enrollment Card**
   - Capacity: X / Y slots
   - Confirmed: X slots
   - Available: X slots
   - Progress bar
   - For One-to-One: Shows "1:1 Ratio" instead of capacity

6. **Bookings List**
   - List of all bookings (confirmed)
   - Customer name
   - Quote ID
   - Booking status
   - Booked date
   - Actions: View Customer, Cancel Booking
   - For One-to-One: Only one booking shown (fully booked)

7. **Book Customer Section**
   - Customer search/select
   - Display customer's remaining slots for this Price Book Item
   - Select quote (if multiple)
   - Number of slots to book (always 1 for One-to-One)
   - Book button (disabled if no slots available or session full)
   - For One-to-One: Shows "Session is fully booked" if already has one customer

8. **Notes Section**
   - Session-specific notes
   - Edit notes

**Sidebar:**
- Learning Service Information summary
- Type badge
- Quick Links:
  - View Learning Service Detail
  - View All Sessions for this Learning Service
  - Customer Inventory

---

### Screen 6: Session Create (`session_create.html`)
**Purpose:** Manually create an individual Learning Service Session (not from recurring schedule)

**Form Sections:**
1. **Learning Service Selection** (required)
   - Select Learning Service from dropdown
   - Filter by type (Class, Group, One-to-One) optional
   - Display Learning Service details (type, schedule, capacity, staff)
   - Show type badge

2. **Session Details**
   - Date (required, date picker)
   - Start Time (required)
   - End Time (required)
   - Duration (auto-calculated)

3. **Staff/Team Assignment**
   - Use default assignments (checkbox, default: checked)
   - Shows inherited staff/teams from Learning Service
   - Override assignments (if unchecked)
   - Unified search for staff and teams
   - Selected assignments list with count
   - Recommended assignments section
   - For One-to-One: May show tutor specialization matching

4. **Notes**
   - Optional notes for this session

**Actions:**
- Create Session
- Cancel

**Validation:**
- Date cannot be in past (unless override)
- Start time < end time
- Learning Service must be selected
- For One-to-One: Ensure max capacity is 1

---

### Screen 7: Customer Inventory (`customer_inventory.html`)
**Purpose:** View and manage customer slot inventory across all Price Book Items

**Sections:**
1. **Customer Search/Selection**
   - Search by customer name/email
   - Customer dropdown/autocomplete
   - Selected customer display

2. **Price Book Item Filter** (optional)
   - Filter by specific Price Book Item
   - Or show all Price Book Items

3. **Inventory Summary Card**
   - Total Purchased Slots (across all items or filtered)
   - Total Used Slots
   - Total Remaining Slots
   - Visual progress indicators

4. **Price Book Item Breakdown**
   - For each Price Book Item (or selected one):
     - Price Book Item name
     - Total purchased slots
     - Used slots
     - Remaining slots
     - Low inventory warning (if < threshold)
     - Quote breakdown (expandable)

5. **Quote Breakdown Table**
   - For selected Price Book Item:
     - Quote ID (with link)
     - Quote date
     - Slots purchased
     - Slots used
     - Slots remaining
     - Quote status

6. **Booking History**
   - List of all bookings for this customer
   - Session date and time
   - Learning Service name
   - Learning Service type (Class, Group, One-to-One) with badge
   - Slots used
   - Booking status
   - Booked date

**Features:**
- Real-time updates
- Export inventory report
- Low inventory alerts
- Link to quotes
- Link to sessions

---

## 🔟 Integration Points

### Quote System Integration
- Read approved quotes with Price Book Item quantities
- Track quote status changes
- Update inventory when quotes are approved/cancelled
- Link bookings back to source quotes

### Price Book Integration
- Validate Price Book Item exists
- Display Price Book Item details
- Ensure Price Book Item is active
- Support Price Book Item updates

### Staff Management Integration
- Validate staff members exist
- Check staff availability (future enhancement)
- Display staff details and contact info
- Support staff assignment changes

### Calendar/Scheduling Integration
- Display sessions on calendar
- Support drag-and-drop rescheduling (future)
- Conflict detection (future)
- Staff availability overlay (future)

---

## 1️⃣1️⃣ Future Enhancements (Out of Scope for V1)

- Customer self-booking portal
- Email/SMS notifications
- Staff availability checking
- Conflict detection and resolution
- Recurring schedule exceptions (holidays, breaks)
- Multi-location support
- Session attendance tracking
- Payment processing integration
- Analytics and reporting dashboard

---

## 📝 Notes

- This system replaces the existing `Class_job/` implementation
- All new development should be in `service_job_v3/` folder
- Maintain backward compatibility considerations for data migration
- Follow existing FMS design patterns and UI components
- Use localStorage for demo/prototype, plan for backend API integration
- **Learning Service** is the umbrella term for three types: Class, Group, and One-to-One
- All screens and features must support all three types with appropriate type-specific handling

---

**Document Version:** 1.0  
**Last Updated:** November 2024  
**Status:** Requirements Definition - Ready for Implementation

