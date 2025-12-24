# Class Management V2 - Implementation Plan

## 🎯 Next Steps

Based on the requirements in `CLASS_MANAGEMENT_REQUIREMENTS.md`, here's your implementation roadmap:

---

## Phase 1: Core Data Models & Structure (Week 1)

### Step 1.1: Define Data Models
**Priority: HIGH**

Create JavaScript data structures for:
- ✅ Class entity (with schedule, default staff, pricebook link)
- ✅ Class Session entity (with date, time, staff override, bookings)
- ✅ Customer Slot Inventory entity (aggregated from quotes)

**Files to create:**
- `class_job_v2/data-models.js` - Data structure definitions
- `class_job_v2/sample-data.js` - Sample data for testing

**What to include:**
- Complete data structures matching the requirements
- Helper functions for data validation
- Sample classes, sessions, and customer inventories

---

### Step 1.2: LocalStorage Management
**Priority: HIGH**

Create utility functions for data persistence:
- Save/load Classes
- Save/load Class Sessions
- Save/load Customer Slot Inventories
- Data migration helpers (if needed)

**Files to create:**
- `class_job_v2/storage-utils.js` - LocalStorage management functions

**Functions needed:**
```javascript
- saveClass(classData)
- loadClass(classId)
- getAllClasses()
- saveClassSession(sessionData)
- loadClassSession(sessionId)
- getSessionsByClass(classId)
- getCustomerSlotInventory(customerId, pricebookItemId)
- updateCustomerInventory(customerId, pricebookItemId, slotsUsed)
```

---

## Phase 2: Class Management UI (Week 1-2)

### Step 2.1: Class List Screen
**Priority: HIGH**

Create the main Classes listing page:
- Display all Classes in a card/list view
- Show Class name, linked Price Book Item, schedule summary
- Filter by status, Price Book Item, staff
- Search functionality
- Create new Class button

**Files to create:**
- `class_job_v2/class_list.html`
- `class_job_v2/class_list_script.js`

**Features:**
- Stats cards (Total Classes, Active, Paused)
- Filter bar (status, pricebook, staff, search)
- Class cards with key info
- Navigation to Class detail page

---

### Step 2.2: Class Create/Edit Screen
**Priority: HIGH**

Create form for creating/editing Classes:
- Class name and description
- Price Book Item selection (required, single select)
- Recurring schedule configuration
  - Frequency (daily, weekly, monthly, custom)
  - Days of week picker
  - Start/end time
  - Duration
  - Start date, end date (optional)
- Default staff assignment (multi-select)
- Capacity settings (max capacity, waitlist toggle)
- Skill level and other metadata

**Files to create:**
- `class_job_v2/class_create.html`
- `class_job_v2/class_create_script.js`
- `class_job_v2/class_edit.html` (can reuse create with edit mode)
- `class_job_v2/class_edit_script.js`

**Key validations:**
- Price Book Item is required
- At least one default staff required
- Schedule must have at least one day
- Start time < end time
- Duration > 0

---

### Step 2.3: Class Detail Screen
**Priority: HIGH**

Create detailed view for a single Class:
- Class information display
- Schedule configuration view
- Default staff list
- Linked Class Sessions list
- Actions: Edit, Archive, Generate Sessions

**Files to create:**
- `class_job_v2/class_detail.html`
- `class_job_v2/class_detail_script.js`

**Sections:**
- Header with Class name and status
- Class Information card
- Schedule Configuration card
- Default Staff card
- Linked Sessions list (with calendar view option)
- Quick Actions sidebar

---

## Phase 3: Class Session Management (Week 2-3)

### Step 3.1: Session Generation Logic
**Priority: HIGH**

Implement automatic session generation:
- Weekly generation based on Class schedule
- Respect recurring pattern (days, time)
- Inherit default staff
- Create sessions for configurable look-ahead period
- Handle start/end dates

**Files to create:**
- `class_job_v2/session-generator.js` - Core generation logic

**Functions needed:**
```javascript
- generateSessionsForClass(classId, weeksAhead = 4)
- generateSessionsForDateRange(classId, startDate, endDate)
- shouldGenerateSession(class, date) // Check if session should exist on this date
- createSessionFromClass(class, date) // Create session instance
```

---

### Step 3.2: Session List Screen
**Priority: HIGH**

Create calendar/list view of Class Sessions:
- Calendar view (week/month)
- List view with filters
- Show enrollment status (X/Y slots)
- Status indicators
- Quick actions (View, Edit, Cancel)

**Files to create:**
- `class_job_v2/session_list.html`
- `class_job_v2/session_list_script.js`

**Views:**
- Week view (similar to existing job_schedule.html)
- Month view
- List view with date range filter
- Filter by Class, staff, status

---

### Step 3.3: Session Detail Screen
**Priority: HIGH**

Create detailed view for a Class Session:
- Session information (date, time, Class)
- Staff assignments (show if overridden)
- Current bookings list
- Available slots display
- Book customer functionality
- Notes section

**Files to create:**
- `class_job_v2/session_detail.html`
- `class_job_v2/session_detail_script.js`

**Key features:**
- Staff override UI (show default vs override)
- Booking management (add/remove bookings)
- Real-time slot availability
- Customer search and booking

---

### Step 3.4: Manual Session Management
**Priority: MEDIUM**

Allow managers to manually create/edit sessions:
- Create individual session (not from recurring)
- Edit future sessions (date, time, staff)
- Delete future sessions
- Override staff per session

**Files to modify:**
- `class_job_v2/session_detail_script.js` - Add edit capabilities
- `class_job_v2/session_create.html` - Manual session creation
- `class_job_v2/session_create_script.js`

---

## Phase 4: Slot Inventory System (Week 3-4)

### Step 4.1: Quote Integration
**Priority: HIGH**

Integrate with quote system to track slot purchases:
- Read approved quotes
- Extract Price Book Item quantities
- Aggregate slots per customer per Price Book Item
- Update inventory when quotes change status

**Files to create:**
- `class_job_v2/inventory-calculator.js` - Slot aggregation logic

**Functions needed:**
```javascript
- calculateCustomerInventory(customerId, pricebookItemId)
- getCustomerQuotes(customerId, pricebookItemId)
- aggregateSlotsFromQuotes(quotes)
- updateInventoryOnQuoteChange(quoteId, oldStatus, newStatus)
```

**Integration points:**
- Read from localStorage: `quotes` or `approvedQuotes`
- Or integrate with existing quote system APIs

---

### Step 4.2: Customer Inventory Display
**Priority: HIGH**

Create UI to view customer slot inventory:
- Customer search/selection
- Price Book Item filter
- Total purchased/used/remaining slots
- Quote breakdown
- Booking history

**Files to create:**
- `class_job_v2/customer_inventory.html`
- `class_job_v2/customer_inventory_script.js`

**Display:**
- Summary card (total/used/remaining)
- Quote breakdown table
- Booking history timeline
- Visual indicators (low inventory warnings)

---

### Step 4.3: Booking Logic
**Priority: HIGH**

Implement booking mechanism with slot deduction:
- Check customer has available slots
- Deduct slot when booking confirmed
- Restore slot when booking cancelled
- Prevent double-booking
- Handle waitlist when capacity full

**Files to create:**
- `class_job_v2/booking-manager.js` - Core booking logic

**Functions needed:**
```javascript
- canBookCustomer(customerId, pricebookItemId, slots)
- bookCustomerIntoSession(sessionId, customerId, quoteId, slots)
- cancelBooking(bookingId)
- getCustomerRemainingSlots(customerId, pricebookItemId)
- checkSessionCapacity(sessionId)
```

---

## Phase 5: Staff Assignment System (Week 4)

### Step 5.1: Default Staff Management
**Priority: MEDIUM**

Implement default staff assignment for Classes:
- Multi-select staff for Class
- Display default staff in Class detail
- Show inheritance in Session views

**Files to modify:**
- `class_job_v2/class_create_script.js` - Add staff multi-select
- `class_job_v2/class_detail_script.js` - Display default staff

---

### Step 5.2: Staff Override per Session
**Priority: MEDIUM**

Implement per-session staff override:
- Show default staff (inherited)
- Allow override for specific session
- Save override indicator
- Display override status in UI

**Files to modify:**
- `class_job_v2/session_detail_script.js` - Add override UI
- `class_job_v2/session-generator.js` - Respect overrides when generating

**UI elements:**
- Staff assignment section
- "Override default" toggle
- Staff selector (when override enabled)
- Visual indicator showing "Default" vs "Overridden"

---

## Phase 6: UI Polish & Integration (Week 5)

### Step 6.1: Navigation Integration
**Priority: HIGH**

Integrate new screens into main navigation:
- Add "Classes" menu item to sidebar
- Update navigation links
- Ensure consistent styling with existing FMS

**Files to modify:**
- All HTML files - Update sidebar navigation
- Ensure links point to correct pages

---

### Step 6.2: Styling & Responsiveness
**Priority: MEDIUM**

Ensure consistent styling:
- Use existing Tailwind CSS patterns
- Match existing FMS design system
- Ensure mobile responsiveness
- Add loading states and animations

**Files to review:**
- All HTML files - Check styling consistency
- Add CSS animations where appropriate

---

### Step 6.3: Error Handling & Validation
**Priority: MEDIUM**

Add comprehensive validation:
- Form validation on create/edit
- Business rule validation
- User-friendly error messages
- Success notifications

**Files to create:**
- `class_job_v2/validation.js` - Validation helpers

---

## Phase 7: Testing & Documentation (Week 6)

### Step 7.1: Test Scenarios
**Priority: HIGH**

Create and test key scenarios:
- Create Class with recurring schedule
- Generate sessions automatically
- Book customer with available slots
- Override staff for specific session
- Track slot inventory across multiple quotes
- Handle capacity and waitlist

**Files to create:**
- `class_job_v2/TEST_SCENARIOS.md` - Test cases

---

### Step 7.2: User Documentation
**Priority: MEDIUM**

Create user guides:
- How to create a Class
- How to manage Class Sessions
- How to book customers
- How to track slot inventory
- How to override staff assignments

**Files to create:**
- `class_job_v2/USER_GUIDE.md`

---

## 📋 Implementation Checklist

### Phase 1: Foundation
- [ ] Data models defined
- [ ] LocalStorage utilities created
- [ ] Sample data prepared

### Phase 2: Class Management
- [ ] Class list screen
- [ ] Class create/edit screen
- [ ] Class detail screen

### Phase 3: Session Management
- [ ] Session generation logic
- [ ] Session list screen
- [ ] Session detail screen
- [ ] Manual session management

### Phase 4: Inventory System
- [ ] Quote integration
- [ ] Customer inventory display
- [ ] Booking logic with slot deduction

### Phase 5: Staff System
- [ ] Default staff management
- [ ] Staff override per session

### Phase 6: Polish
- [ ] Navigation integrated
- [ ] Styling consistent
- [ ] Error handling complete

### Phase 7: Testing
- [ ] Test scenarios documented
- [ ] User guide created
- [ ] All features tested

---

## 🚀 Quick Start Recommendation

**Start with Phase 1, Step 1.1:**
1. Create `class_job_v2/data-models.js`
2. Define Class, ClassSession, and CustomerInventory structures
3. Create sample data for testing
4. Test data structures work correctly

**Then move to Phase 2, Step 2.1:**
1. Create basic Class list page
2. Display sample Classes
3. Add navigation
4. Test basic flow

**Continue iteratively through phases.**

---

## 📝 Notes

- Build incrementally - get one feature working before moving to next
- Test as you go - don't wait until the end
- Use existing FMS patterns - consistency is key
- Document as you build - it's easier than retrofitting
- Start simple - add complexity gradually

---

**Last Updated:** November 2024  
**Status:** Ready to Begin Implementation













