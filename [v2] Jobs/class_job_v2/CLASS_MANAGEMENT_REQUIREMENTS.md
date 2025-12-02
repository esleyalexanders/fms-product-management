# Class Management & Scheduling Feature Enhancement

## 🎯 Overview

This document defines the enhanced Class Management system that supports scheduled service offerings with recurring schedules, flexible staff assignments, and quote-based inventory tracking.

---

## 1️⃣ Core Entities and Definitions

| Term | Enhanced Definition | Example |
| :--- | :--- | :--- |
| **Class** | A distinct, schedulable service offering. It is the **master template** for a series of lessons. | **Advanced Yoga Class** |
| **Price Book Item** | The purchasable product/service that links directly to a Class. This item represents the customer's *entitlement* to a number of Class Sessions. | **Yoga - Aerobic** (Price: $20/slot) |
| **Class Session** | A single, specific instance of the Class occurring at a set time and date. Multiple Class Sessions make up a Class schedule. | The **Advanced Yoga Class** scheduled for **Mon, Dec 8th, 2025, at 2:00 PM** |
| **Staff Assignment** | Instructors, lecturers, tutors, or other personnel assigned to teach or run the Class or a specific Class Session. | Staff A and Staff B |

---

## 2️⃣ Class Definition and Scheduling

### Financial Linkage
- **Requirement:** Every **Class** must be linked to exactly one **Price Book Item**.
- **Purpose:** Establishes the commercial tie-in and enables customers to purchase slots.
- **Example:** The **Advanced Yoga Class** is linked to the **Yoga - Aerobic** Price Book Item.

### Scheduling Capabilities
- **Recurring Schedules:** The system supports defining recurring schedules for the **Class**.
  - Examples: Every Monday, Wednesday, Friday at 2 PM
  - Weekly patterns
  - Custom intervals
- **Schedule Definition:** Managers can define:
  - Days of the week
  - Time slots
  - Duration
  - Start and end dates (optional)

### Default Staff Assignment
- **Multiple Staff Support:** Multiple Staff members can be assigned as default instructors for the **Class**.
- **Example:** Staff A and Staff B are both assigned as default instructors for **Advanced Yoga Class**.
- **Inheritance:** Class Sessions inherit these default assignments (can be overridden per session).

---

## 3️⃣ Managing Class Sessions

### Automated Generation
- **Weekly Auto-Generation:** **Class Sessions** are automatically generated weekly based on the **Class** schedule.
- **Generation Rules:**
  - Follows the recurring schedule pattern defined in the Class
  - Creates sessions for upcoming weeks (configurable look-ahead period)
  - Respects start/end dates if defined

### Manual Override/Pre-creation
- **Manager Control:** Managers can manually pre-create **Class Sessions** for future dates.
- **Use Cases:**
  - Optimize resource planning
  - Handle special scheduling needs
  - Plan ahead for holidays or special events
  - Adjust for staff availability

### Flexible Staff Assignment

#### Default Inheritance
- **Inheritance Rule:** By default, a **Class Session** inherits the Staff assigned to the **Class**.
- **Example:** If **Advanced Yoga Class** has Staff A and Staff B as defaults, all generated sessions will have Staff A and Staff B assigned.

#### Per-Session Override
- **Override Capability:** Managers can **override** the default assignment for any specific **Class Session**.
- **Use Cases:**
  - Staff unavailability (sick leave, vacation)
  - Substitute instructors
  - Special event requirements
  - Skill-specific sessions
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
- **Result:** This defines the **maximum bookable slots** for that customer for that specific **Class**.

#### Booking Mechanism
- **Slot Deduction:** When a customer books a **Class Session**, one slot is deducted from their aggregated pool of purchased slots.
- **Inventory Tracking:**
  - Remaining slots = Total purchased slots - Used slots
  - Used slots = Sum of all bookings across all Class Sessions for that Class
- **Prevention:** System prevents booking if customer has no remaining slots.

### Example Scenario

**Customer:** Miss A

**Purchases:**
- Quote 1: **2 slots** of **Yoga - Aerobic** (Price Book Item)
- Quote 2: **3 slots** of **Yoga - Aerobic** (Price Book Item)

**Result:**
- Miss A has a total of **5 bookable slots**
- Manager can schedule her into **Class Sessions** linked to the **Yoga - Aerobic** Price Book Item
- Each booking deducts 1 slot from her pool of 5
- System tracks: 5 total - X used = Y remaining

---

## 5️⃣ Data Model Structure

### Class Entity
```javascript
{
  id: "CLASS-2024-001",
  name: "Advanced Yoga Class",
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
    endDate: null, // null = ongoing
    timezone: "Australia/Melbourne"
  },
  
  // Default Staff
  defaultStaff: [
    { id: "STAFF-001", name: "Staff A" },
    { id: "STAFF-002", name: "Staff B" }
  ],
  
  // Capacity
  maxCapacity: 20,
  waitlistEnabled: true,
  
  // Metadata
  skillLevel: "Advanced",
  description: "Advanced yoga class for experienced practitioners",
  status: "active", // active, paused, archived
  createdAt: "2024-11-01T10:00:00Z",
  updatedAt: "2024-11-15T14:30:00Z"
}
```

### Class Session Entity
```javascript
{
  id: "SESSION-2024-001",
  classId: "CLASS-2024-001",
  className: "Advanced Yoga Class",
  
  // Schedule
  date: "2025-12-08",
  startTime: "14:00",
  endTime: "15:30",
  duration: 90,
  
  // Staff Assignment (inherited or overridden)
  assignedStaff: [
    { id: "STAFF-003", name: "Staff C" } // Override: Staff C instead of default Staff A
  ],
  staffOverride: true, // Indicates if default was overridden
  
  // Enrollment
  bookings: [
    {
      id: "BOOKING-001",
      customerId: "CUST-001",
      customerName: "Miss A",
      quoteId: "Q-2024-020",
      slotsUsed: 1,
      status: "confirmed", // confirmed, waitlisted, cancelled
      bookedAt: "2024-11-10T09:00:00Z"
    }
  ],
  confirmedSlots: 15,
  waitlistedSlots: 3,
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

### Feature 1: Class Creation
1. Manager creates a new Class
2. Links to exactly one Price Book Item
3. Defines recurring schedule (days, time, duration)
4. Assigns default staff
5. Sets capacity and waitlist preferences
6. System validates all required fields

### Feature 2: Automatic Session Generation
1. System runs weekly (or configurable interval)
2. Generates Class Sessions based on Class schedule
3. Inherits default staff assignments
4. Creates sessions for upcoming period (e.g., next 4 weeks)
5. Respects start/end dates if defined

### Feature 3: Manual Session Management
1. Manager views list of Class Sessions
2. Can manually create individual sessions
3. Can edit/delete future sessions
4. Can override staff assignment per session
5. Can add notes for specific sessions

### Feature 4: Customer Slot Inventory
1. System aggregates slots from all customer quotes
2. Shows total purchased, used, and remaining slots
3. Updates in real-time as bookings are made
4. Prevents booking if no slots available
5. Shows quote breakdown for transparency

### Feature 5: Booking Management
1. Manager selects a Class Session
2. Views available slots and current bookings
3. Searches for customer by name
4. System shows customer's remaining slots for this Price Book Item
5. Manager books customer into session
6. System deducts slot from customer's inventory
7. Updates session enrollment count

### Feature 6: Staff Override
1. Manager views Class Session details
2. Sees default staff assignments (inherited from Class)
3. Can override for this specific session
4. Selects alternative staff member(s)
5. System saves override and shows indicator
6. Future sessions still use default staff

---

## 7️⃣ Business Rules

### Class Rules
- ✅ Every Class must have exactly one Price Book Item
- ✅ Every Class must have at least one default staff member
- ✅ Schedule must include at least one day of week
- ✅ Start time must be before end time
- ✅ Duration must be positive

### Session Rules
- ✅ Sessions cannot be created in the past (unless manually allowed)
- ✅ Sessions inherit default staff unless overridden
- ✅ Cannot exceed max capacity (unless waitlist enabled)
- ✅ Cannot book customer without available slots

### Inventory Rules
- ✅ Slots are only deducted when booking is confirmed
- ✅ Cancelled bookings restore slots to customer inventory
- ✅ Slots are class-specific (tied to Price Book Item)
- ✅ Inventory is calculated from approved quotes only

### Booking Rules
- ✅ One slot = one booking per session
- ✅ Customer must have remaining slots to book
- ✅ Waitlist applies when capacity is full
- ✅ Cannot double-book same customer in same session

---

## 8️⃣ Screen Inventory

**Total Screens Required: 8**

The system requires **8 main screens** to support all Class Management functionality:

| # | Screen Name | File Name | Purpose | Priority |
|:--|:------------|:----------|:--------|:---------|
| 1 | **Class List** | `class_list.html` | Display all Classes with filtering and search | HIGH |
| 2 | **Class Create** | `class_create.html` | Create new Class with schedule and staff setup | HIGH |
| 3 | **Class Edit** | `class_edit.html` | Edit existing Class details and configuration | HIGH |
| 4 | **Class Detail** | `class_detail.html` | View Class details, linked sessions, and actions | HIGH |
| 5 | **Session List** | `session_list.html` | Calendar/list view of all Class Sessions | HIGH |
| 6 | **Session Detail** | `session_detail.html` | View/manage individual session, bookings, staff | HIGH |
| 7 | **Session Create** | `session_create.html` | Manually create individual Class Session | MEDIUM |
| 8 | **Customer Inventory** | `customer_inventory.html` | View customer slot inventory and booking history | HIGH |

**Note:** Screens 2 and 3 (Class Create/Edit) can potentially be combined into a single form with create/edit modes.

---

## 9️⃣ User Interface Requirements

### Screen 1: Class List (`class_list.html`)
**Purpose:** Main entry point for Class Management

**Features:**
- List of all Classes in card/table view
- Stats cards: Total Classes, Active, Paused, Archived
- Create new Class button (prominent)
- Filter by:
  - Status (active, paused, archived)
  - Price Book Item
  - Default staff member
  - Skill level
- Search functionality (by name, description)
- Sort options (name, date created, status)
- Quick actions per Class:
  - View Details
  - Edit
  - Archive/Pause
  - Generate Sessions
- Navigation to Class Detail screen

**Key Metrics Display:**
- Total Classes count
- Active Classes count
- Total Sessions generated
- Average enrollment rate

---

### Screen 2: Class Create (`class_create.html`)
**Purpose:** Create a new Class with all required configuration

**Form Sections:**
1. **Basic Information**
   - Class Name (required)
   - Description
   - Skill Level
   - Status (default: active)

2. **Price Book Item Selection** (required)
   - Single select dropdown/search
   - Display selected Price Book Item details
   - Price display

3. **Schedule Configuration**
   - Frequency: Daily, Weekly, Monthly, Custom
   - Days of Week picker (for weekly)
   - Start Time (required)
   - End Time (required)
   - Duration (auto-calculated or manual)
   - Start Date (optional)
   - End Date (optional, null = ongoing)
   - Timezone selection

4. **Default Staff Assignment** (required, at least one)
   - Multi-select staff picker
   - Search staff by name
   - Display selected staff list
   - Remove staff option

5. **Capacity Settings**
   - Max Capacity (required, default: 10)
   - Waitlist Enabled (toggle)

6. **Actions**
   - Save & Create Class
   - Cancel
   - Save & Generate Sessions (optional)

**Validation:**
- All required fields must be filled
- Price Book Item must be selected
- At least one default staff required
- Start time < end time
- At least one day selected for weekly schedule
- Duration > 0

---

### Screen 3: Class Edit (`class_edit.html`)
**Purpose:** Edit existing Class configuration

**Features:**
- Same form structure as Class Create
- Pre-populated with existing Class data
- Read-only fields (if any):
  - Class ID
  - Created date
- Warning if editing schedule (may affect existing sessions)
- Save Changes button
- Cancel button
- Archive Class option (separate action)

**Special Considerations:**
- If schedule changed, prompt: "Update existing sessions or only new ones?"
- If staff changed, prompt: "Update existing sessions or only new ones?"
- Show count of affected sessions

---

### Screen 4: Class Detail (`class_detail.html`)
**Purpose:** Comprehensive view of a single Class

**Sections:**
1. **Header**
   - Class name and ID
   - Status badge
   - Quick actions: Edit, Archive, Generate Sessions

2. **Class Information Card**
   - Name, description, skill level
   - Linked Price Book Item (with link to pricebook)
   - Status and dates

3. **Schedule Configuration Card**
   - Display recurring schedule pattern
   - Days, time, duration
   - Start/end dates
   - Edit schedule button

4. **Default Staff Card**
   - List of default staff members
   - Staff avatars/initials
   - Contact info (if available)
   - Edit staff button

5. **Capacity Settings Card**
   - Max capacity
   - Waitlist status
   - Current enrollment summary

6. **Linked Sessions Section**
   - List/calendar view of all Class Sessions
   - Filter by date range
   - Show enrollment status per session
   - Quick actions: View Session, Edit Session
   - Link to Session List filtered by this Class

7. **Sidebar Actions**
   - Generate Sessions (with date range picker)
   - View All Sessions
   - Archive Class
   - Delete Class (if no sessions)

**Navigation:**
- Back to Class List
- Edit Class
- Create Session (manual)

---

### Screen 5: Session List (`session_list.html`)
**Purpose:** Calendar and list view of all Class Sessions

**View Options:**
1. **Calendar View** (default)
   - Week view (7 days)
   - Month view
   - Day view
   - Time slots (7 AM - 9 PM)
   - Color-coded by Class
   - Show enrollment (X/Y slots)

2. **List View**
   - Table with columns:
     - Date & Time
     - Class Name
     - Staff
     - Enrollment (X/Y)
     - Status
     - Actions

**Filters:**
- Date range picker
- Class filter (multi-select)
- Staff filter (multi-select)
- Status filter (scheduled, in_progress, completed, cancelled)
- Search by Class name

**Quick Actions:**
- View Session Detail
- Edit Session
- Cancel Session
- Book Customer (quick action)

**Stats Display:**
- Total Sessions
- Upcoming Sessions
- Sessions Today
- Average Enrollment Rate

---

### Screen 6: Session Detail (`session_detail.html`)
**Purpose:** Detailed view and management of a single Class Session

**Sections:**
1. **Header**
   - Session date and time
   - Class name (with link to Class Detail)
   - Status badge
   - Quick actions: Edit, Cancel

2. **Session Information Card**
   - Date and time
   - Duration
   - Class link
   - Status

3. **Staff Assignment Card**
   - Default staff (inherited from Class) - with indicator
   - Override staff (if overridden) - with indicator
   - "Override Default Staff" button
   - Staff override modal/form

4. **Enrollment Card**
   - Capacity: X / Y slots
   - Confirmed: X slots
   - Waitlisted: X slots
   - Available: X slots
   - Progress bar

5. **Bookings List**
   - List of all bookings (confirmed and waitlisted)
   - Customer name
   - Quote ID
   - Booking status
   - Booked date
   - Actions: View Customer, Cancel Booking

6. **Book Customer Section**
   - Customer search/select
   - Display customer's remaining slots for this Price Book Item
   - Select quote (if multiple)
   - Number of slots to book
   - Book button (disabled if no slots available)
   - Add to waitlist option (if capacity full)

7. **Notes Section**
   - Session-specific notes
   - Edit notes

**Sidebar:**
- Class Information summary
- Quick Links:
  - View Class Detail
  - View All Sessions for this Class
  - Customer Inventory

---

### Screen 7: Session Create (`session_create.html`)
**Purpose:** Manually create an individual Class Session (not from recurring schedule)

**Form Sections:**
1. **Class Selection** (required)
   - Select Class from dropdown
   - Display Class details (schedule, capacity, staff)

2. **Session Details**
   - Date (required, date picker)
   - Start Time (required)
   - End Time (required)
   - Duration (auto-calculated)

3. **Staff Assignment**
   - Use default staff (checkbox, default: checked)
   - Override staff (if unchecked)
   - Staff multi-select

4. **Notes**
   - Optional notes for this session

**Actions:**
- Create Session
- Cancel

**Validation:**
- Date cannot be in past (unless override)
- Start time < end time
- Class must be selected

---

### Screen 8: Customer Inventory (`customer_inventory.html`)
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
   - Class name
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
- Automated waitlist management
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
- All new development should be in `class_job_v2/` folder
- Maintain backward compatibility considerations for data migration
- Follow existing FMS design patterns and UI components
- Use localStorage for demo/prototype, plan for backend API integration

---

**Document Version:** 1.0  
**Last Updated:** November 2024  
**Status:** Requirements Definition - Ready for Implementation

