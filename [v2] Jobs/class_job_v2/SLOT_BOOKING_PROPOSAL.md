# Slot-Level Booking System Proposal

## Overview
This proposal outlines a slot-level booking system that allows managers to book individual slots with student details, track slot inventory, and transfer slots between sessions/classes.

## Use Case Example
**Customer:** Sarah Johnson  
**Quote:** Q-2025-010 ($200.00, 4 slots purchased)  
**Requirement:** Book 2 slots separately:
- Slot 1: For Sarah's son (with name)
- Slot 2: For Sarah's daughter (with name)
- Remaining: 2 slots available for future booking

**Manager Needs:**
1. See total purchased slots vs booked vs remaining
2. Book slots individually with student names
3. Transfer slots between sessions/classes
4. View slot history and details

---

## 1. Data Structure Changes

### 1.1 Enhanced Booking Structure
```javascript
// Current structure (too simple)
{
  id: 'BOOKING-001',
  customerId: 'CUST-001',
  quoteId: 'Q-2025-010',
  slotsUsed: 2,  // ❌ Doesn't allow individual slot tracking
  status: 'confirmed'
}

// Proposed structure (slot-level)
{
  id: 'BOOKING-001',
  customerId: 'CUST-001',
  customerName: 'Sarah Johnson',
  customerEmail: 'sarah.j@email.com',
  quoteId: 'Q-2025-010',
  sessionId: 'SESSION-001',
  classId: 'CLASS-001',
  slots: [  // ✅ Array of individual slots
    {
      slotId: 'SLOT-001',
      studentName: 'John Johnson',  // Sarah's son
      notes: 'First time attending',
      status: 'booked',  // booked, cancelled, transferred
      bookedAt: '2025-01-15T10:00:00Z',
      sessionId: 'SESSION-001'
    },
    {
      slotId: 'SLOT-002',
      studentName: 'Emma Johnson',  // Sarah's daughter
      notes: 'Returning student',
      status: 'booked',
      bookedAt: '2025-01-15T10:00:00Z',
      sessionId: 'SESSION-001'
    }
  ],
  status: 'confirmed',  // Overall booking status
  bookedAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z'
}
```

### 1.2 Slot Transfer History
```javascript
{
  slotId: 'SLOT-001',
  transferHistory: [
    {
      fromSessionId: 'SESSION-001',
      toSessionId: 'SESSION-002',
      transferredAt: '2025-01-20T14:00:00Z',
      transferredBy: 'Manager Name'
    }
  ]
}
```

### 1.3 Customer Slot Inventory Tracking
```javascript
{
  customerId: 'CUST-001',
  pricebookItemId: 'PB-YOGA-CLASS',
  quotes: [
    {
      quoteId: 'Q-2025-010',
      totalSlots: 4,
      bookedSlots: 2,
      availableSlots: 2,
      slots: [
        { slotId: 'SLOT-001', status: 'booked', sessionId: 'SESSION-001' },
        { slotId: 'SLOT-002', status: 'booked', sessionId: 'SESSION-001' },
        { slotId: 'SLOT-003', status: 'available' },
        { slotId: 'SLOT-004', status: 'available' }
      ]
    }
  ],
  summary: {
    totalPurchased: 4,
    totalBooked: 2,
    totalAvailable: 2
  }
}
```

---

## 2. UI/UX Improvements

### 2.1 Enhanced "Book Customer" Modal

**Current Flow:**
- Select customer → Enter number of slots → Book

**Proposed Flow:**
- Select customer → View slot inventory → Add individual slots with student names → Book

**New Modal Sections:**

1. **Customer & Quote Selection** (Top Section)
   - Customer info display
   - Quote dropdown (if multiple quotes)
   - Slot inventory summary:
     ```
     📊 Slot Inventory
     Total Purchased: 4
     Booked: 2
     Available: 2
     ```

2. **Individual Slot Booking** (Main Section)
   - Dynamic slot entry form:
     ```
     Slot 1:
     [ ] Student Name: [John Johnson____________]
     [ ] Notes: [First time attending________]
     [ ] Session: [Select Session ▼]
     
     Slot 2:
     [ ] Student Name: [Emma Johnson___________]
     [ ] Notes: [Returning student___________]
     [ ] Session: [Select Session ▼]
     
     [+ Add Another Slot] (up to available slots)
     ```

3. **Quick Actions**
   - "Book All Available Slots" button
   - "Book Selected Slots Only" button

### 2.2 Slot Inventory Dashboard

**New Page/Section:** Customer Slot Management

**Features:**
- Customer search/selection
- Pricebook item filter
- Visual inventory display:
  ```
  Quote Q-2025-010 ($200.00)
  ┌─────────────────────────────────────┐
  │ Total: 4 slots                      │
  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
  │ Booked: ████░░░░ (2 slots)          │
  │ Available: ░░░░ (2 slots)           │
  └─────────────────────────────────────┘
  
  Booked Slots:
  ✓ Slot 1 - John Johnson (SESSION-001, Dec 2)
  ✓ Slot 2 - Emma Johnson (SESSION-001, Dec 2)
  
  Available Slots:
  ○ Slot 3 - Not booked
  ○ Slot 4 - Not booked
  ```

### 2.3 Slot Transfer Interface

**In Booking List View:**
- Each booked slot shows "Transfer" button
- Transfer modal:
  ```
  Transfer Slot: John Johnson
  From: Session 1 (Dec 2, 2025)
  To: [Select Session ▼]
  
  Reason: [Optional notes]
  
  [Cancel] [Transfer Slot]
  ```

---

## 3. Key Features Implementation

### 3.1 Slot Inventory Calculation
```javascript
function calculateCustomerSlotInventory(customerId, pricebookItemId) {
  // Get all approved quotes for customer and pricebook item
  const quotes = getCustomerQuotes(customerId, pricebookItemId);
  
  // Get all bookings across all sessions
  const allSessions = getAllSessions();
  const bookings = getAllBookingsForCustomer(customerId, pricebookItemId);
  
  // Calculate totals
  let totalPurchased = 0;
  let totalBooked = 0;
  
  quotes.forEach(quote => {
    totalPurchased += quote.slots;
    // Count booked slots from this quote
    bookings.forEach(booking => {
      if (booking.quoteId === quote.id) {
        totalBooked += booking.slots.length;
      }
    });
  });
  
  return {
    totalPurchased,
    totalBooked,
    totalAvailable: totalPurchased - totalBooked,
    quotes: quotes.map(quote => ({
      ...quote,
      bookedSlots: countBookedSlotsForQuote(quote.id),
      availableSlots: quote.slots - countBookedSlotsForQuote(quote.id)
    }))
  };
}
```

### 3.2 Individual Slot Booking
```javascript
function bookIndividualSlots(customerId, quoteId, slotEntries) {
  // slotEntries = [
  //   { studentName: 'John Johnson', notes: '...', sessionId: '...' },
  //   { studentName: 'Emma Johnson', notes: '...', sessionId: '...' }
  // ]
  
  // Validate available slots
  const inventory = calculateCustomerSlotInventory(customerId, pricebookItemId);
  if (slotEntries.length > inventory.totalAvailable) {
    throw new Error('Not enough available slots');
  }
  
  // Group slots by session
  const slotsBySession = groupSlotsBySession(slotEntries);
  
  // Create bookings for each session
  Object.keys(slotsBySession).forEach(sessionId => {
    const slots = slotsBySession[sessionId].map((entry, index) => ({
      slotId: generateSlotId(quoteId, sessionId, index),
      studentName: entry.studentName,
      notes: entry.notes,
      status: 'booked',
      bookedAt: new Date().toISOString(),
      sessionId: sessionId
    }));
    
    createBooking({
      customerId,
      quoteId,
      sessionId,
      slots,
      status: 'confirmed'
    });
  });
}
```

### 3.3 Slot Transfer
```javascript
function transferSlot(slotId, fromSessionId, toSessionId, reason) {
  // Find the slot
  const booking = findBookingBySlotId(slotId);
  const slot = booking.slots.find(s => s.slotId === slotId);
  
  // Validate target session capacity
  const targetSession = getSession(toSessionId);
  if (targetSession.confirmedSlots >= targetSession.maxCapacity) {
    throw new Error('Target session is full');
  }
  
  // Update slot
  slot.sessionId = toSessionId;
  slot.transferredAt = new Date().toISOString();
  slot.transferHistory = slot.transferHistory || [];
  slot.transferHistory.push({
    fromSessionId,
    toSessionId,
    transferredAt: new Date().toISOString(),
    reason
  });
  
  // Update session counts
  decrementSessionSlots(fromSessionId);
  incrementSessionSlots(toSessionId);
  
  // Save changes
  saveBooking(booking);
}
```

---

## 4. Implementation Plan

### Phase 1: Data Structure Updates
1. ✅ Update booking data structure to support slot arrays
2. ✅ Add slot inventory calculation functions
3. ✅ Update localStorage schema

### Phase 2: UI Enhancements
1. ✅ Redesign "Book Customer" modal with individual slot entry
2. ✅ Add slot inventory display
3. ✅ Create customer slot management page

### Phase 3: Transfer Functionality
1. ✅ Add transfer button to booked slots
2. ✅ Create transfer modal
3. ✅ Implement transfer logic

### Phase 4: Reporting & Analytics
1. ✅ Slot usage reports
2. ✅ Customer slot history
3. ✅ Transfer audit trail

---

## 5. Benefits

1. **Granular Control**: Book slots individually with student details
2. **Better Tracking**: Know exactly which slot is for which student
3. **Flexibility**: Transfer slots between sessions easily
4. **Transparency**: Clear view of purchased vs booked vs available
5. **Audit Trail**: Track all slot movements and changes

---

## 6. Migration Strategy

For existing bookings:
- Convert `slotsUsed: 2` to `slots: [{slotId: '...', studentName: 'Customer Name', ...}, ...]`
- Generate slot IDs for existing bookings
- Preserve booking history

---

## Next Steps

1. Review and approve this proposal
2. Implement Phase 1 (data structure)
3. Update UI components
4. Test with sample data
5. Deploy incrementally




