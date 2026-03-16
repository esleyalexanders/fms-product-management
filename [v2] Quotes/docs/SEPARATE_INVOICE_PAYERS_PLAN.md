# Plan: Separate Invoice Publishing from Payer Configuration

## 🎯 Goal
Separate the concerns of **invoice creation/publishing** from **payer configuration/assignment**, making the workflow more flexible and independent.

---

## 📋 Current State

**Current Flow:**
1. Configure payers in Payment Configuration tab
2. Generate invoices → Invoices created with payer info embedded
3. Record payments → Payments linked to payers

**Issues:**
- Invoice creation is tightly coupled with payer configuration
- Can't create invoices without payers configured
- Can't change payer assignment after invoice creation
- Payer configuration affects invoice generation logic

---

## 🎨 Proposed Separation

### Concept: Two Independent Workflows

#### Workflow 1: Invoice Publishing (Independent)
- Create/publish invoices based on payment model
- Invoice is a financial document, independent of who pays
- One invoice per quote (or deposit + balance for deposit model)

#### Workflow 2: Payer Management (Independent)
- Configure payers separately
- Assign payers to invoices (can be done before or after invoice creation)
- Track which payers are responsible for which invoices
- Record payments from specific payers

---

## 📐 Architecture Changes

### 1. Invoice Structure (Simplified)
```javascript
{
  id: 'INV-2024-001',
  quoteId: 'Q-2024-001',
  amount: 1000.00,
  type: 'full', // or 'deposit', 'balance', 'subscription'
  status: 'unpaid',
  paidAmount: 0,
  dueDate: '2024-02-15',
  items: [...],
  createdAt: '2024-01-15',
  
  // NEW: Payer assignment (separate from invoice creation)
  assignedPayers: [
    {
      payerId: 'payer-1',
      name: 'John Doe',
      email: 'john@example.com',
      percentage: 50,  // Their share of responsibility
      assignedAmount: 500.00,  // Calculated: invoice.amount * percentage / 100
      assignedAt: '2024-01-15',
      assignedBy: 'user-id',
      
      // Payment tracking per payer
      paidAmount: 500.00,  // Sum of confirmed payments from this payer
      outstandingAmount: 0.00,  // assignedAmount - paidAmount
      paymentStatus: 'paid',  // 'paid', 'partial', 'unpaid', 'overdue'
      payments: [  // Payments from this payer (confirmed only)
        {
          id: 'PAY-001',
          amount: 500.00,
          date: '2024-01-15',
          method: 'Stripe',
          status: 'confirmed'
        }
      ],
      lastPaymentDate: '2024-01-15'
    },
    {
      payerId: 'payer-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      percentage: 50,
      assignedAmount: 500.00,
      assignedAt: '2024-01-15',
      assignedBy: 'user-id',
      paidAmount: 250.00,
      outstandingAmount: 250.00,
      paymentStatus: 'partial',
      payments: [
        {
          id: 'PAY-002',
          amount: 250.00,
          date: '2024-01-20',
          method: 'PayPal',
          status: 'confirmed'
        }
      ],
      lastPaymentDate: '2024-01-20'
    }
  ],
  
  // Payment history (enhanced with confirmation)
  paymentHistory: [
    {
      id: 'PAY-001',
      amount: 500.00,
      payer: {
        payerId: 'payer-1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      method: 'Stripe',
      date: '2024-01-15',
      notes: 'First payment',
      recordedAt: '2024-01-15T10:00:00Z',
      
      // Payment confirmation tracking
      status: 'confirmed', // 'recorded', 'pending_confirmation', 'confirmed', 'cancelled'
      recordedBy: 'staff-user-id',
      confirmedBy: 'manager-user-id',
      confirmedAt: '2024-01-15T10:30:00Z',
      cancelledBy: null,
      cancelledAt: null,
      cancellationReason: null
    }
  ]
}
```

### 2. Payer Configuration (Separate Entity)
```javascript
{
  // Global payer list (stored separately)
  quotePayers: [
    {
      id: 'payer-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      percentage: 50,  // Default percentage for this quote
      isPrimary: true,
      createdAt: '2024-01-10'
    },
    {
      id: 'payer-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      percentage: 50,
      isPrimary: false,
      createdAt: '2024-01-10'
    }
  ]
}
```

---

## 🔄 New Workflow

### Scenario 1: Create Invoice First, Assign Payers Later

**Step 1: Publish Invoice**
- User clicks "Generate Invoice" or "Publish Invoice"
- System creates invoice based on payment model
- Invoice is created WITHOUT payer assignment
- Invoice status: "Unassigned" or "Draft"

**Step 2: Assign Payers (Optional)**
- User can assign payers to the invoice
- Can assign from configured payers OR add new payers
- Can assign multiple payers with percentages
- Invoice status: "Assigned" or "Ready"

**Step 3: Record Payments**
- Payments can be recorded from assigned payers
- Or from any payer (even if not assigned)

### Scenario 2: Configure Payers First, Then Publish

**Step 1: Configure Payers**
- User sets up payers in Payment Configuration tab
- Payers are saved to quote (not tied to specific invoice)

**Step 2: Publish Invoice**
- User publishes invoice
- System can suggest payer assignment based on configured payers
- User can accept suggestion or modify

**Step 3: Record Payments**
- Payments recorded as before

---

## 🎨 UI/UX Changes

### 1. Invoice Publishing Section (New/Enhanced)

**Location:** Invoices Tab

**Features:**
- "Publish Invoice" button (instead of "Generate Invoice")
- Invoice creation is independent of payers
- Clear separation: "Invoice Management" vs "Payer Assignment"

**UI:**
```
┌─────────────────────────────────────┐
│  Invoice Publishing                 │
├─────────────────────────────────────┤
│  [Publish Invoice] button           │
│  - Creates invoice based on model   │
│  - No payer assignment required     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Published Invoices                 │
├─────────────────────────────────────┤
│  INV-001  $1,000.00                 │
│  Status: Unassigned                 │
│  [Assign Payers] [Record Payment]   │
└─────────────────────────────────────┘
```

### 2. Payer Assignment Modal (New)

**Trigger:** "Assign Payers" button on invoice card

**Features:**
- List of configured payers for the quote
- Ability to assign multiple payers
- Set percentage for each payer
- Add new payer on the fly
- Remove assigned payers
- Preview total assignment (must equal 100%)

**UI:**
```
┌─────────────────────────────────────┐
│  Assign Payers to INV-001           │
├─────────────────────────────────────┤
│  Invoice Amount: $1,000.00           │
│                                      │
│  Assigned Payers:                    │
│  ┌──────────────────────────────┐  │
│  │ ☑ John Doe (50%) - $500.00   │  │
│  │ ☑ Jane Smith (50%) - $500.00 │  │
│  └──────────────────────────────┘  │
│                                      │
│  Available Payers:                   │
│  [ ] Add New Payer                  │
│                                      │
│  Total Assignment: 100% ✓            │
│  [Cancel] [Save Assignment]          │
└─────────────────────────────────────┘
```

### 3. Payment Configuration Tab (Enhanced)

**Changes:**
- Rename to "Payer Configuration" or "Payment & Payer Settings"
- Separate sections:
  - Payment Model Settings (unchanged)
  - Payer Management (new/separated)
  - Invoice Settings (if needed)

**UI Structure:**
```
┌─────────────────────────────────────┐
│  Payment Model                      │
│  [Full Payment] [Deposit] [Sub]     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Payer Management                   │
│  (Independent of invoices)          │
│                                      │
│  Configured Payers:                 │
│  • John Doe (50%)                   │
│  • Jane Smith (50%)                  │
│                                      │
│  [Add Payer] [Edit] [Remove]        │
└─────────────────────────────────────┘
```

### 4. Payer Payment Status Panel (New)

**Location:** Invoices Tab - Right Sidebar or Dedicated Section

**Purpose:** 
- Centralized view of all payers and their payment status
- Manager can track who has paid and who hasn't
- Manual payment confirmation and cancellation controls

**Features:**
- Real-time payment status per payer
- Payment progress indicators
- Manual payment confirmation/cancellation
- Payment history per payer
- Quick actions (send reminder, record payment)

**UI:**
```
┌─────────────────────────────────────────────────┐
│  Payer Payment Status Panel                     │
├─────────────────────────────────────────────────┤
│  Invoice: INV-001 ($1,000.00)                  │
│  Status: Partially Paid                         │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ 📊 John Doe                              │  │
│  │    Assigned: $500.00 (50%)               │  │
│  │    Paid: $500.00 ✓                       │  │
│  │    Outstanding: $0.00                    │  │
│  │    Status: ✅ Fully Paid                 │  │
│  │    [████████████████████] 100%           │  │
│  │    Last Payment: Jan 15, 2024            │  │
│  │    [View Payments] [Payment Details]      │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ 📊 Jane Smith                            │  │
│  │    Assigned: $500.00 (50%)               │  │
│  │    Paid: $250.00                         │  │
│  │    Outstanding: $250.00                 │  │
│  │    Status: ⚠️ Partially Paid             │  │
│  │    [████████████░░░░░░░░] 50%            │  │
│  │    Last Payment: Jan 20, 2024            │  │
│  │    [View Payments] [Record Payment]      │  │
│  │    [Send Reminder]                        │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  📊 Summary:                                     │
│     Total Assigned: $1,000.00                   │
│     Total Paid: $750.00                         │
│     Total Outstanding: $250.00                  │
│     Completion: 75%                              │
└─────────────────────────────────────────────────┘
```

**Payment Status Indicators:**
- ✅ **Fully Paid** - Payer has completed their assigned amount
- ⚠️ **Partially Paid** - Payer has paid some but not all
- ❌ **Not Paid** - No payments from this payer
- ⏳ **Overdue** - Payment is past due date

**Payment Details View (Expandable):**
```
┌─────────────────────────────────────────────────┐
│  Payment Details - Jane Smith                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  Payment History:                                │
│  ┌──────────────────────────────────────────┐  │
│  │ Payment #1 - Jan 20, 2024                │  │
│  │ Amount: $250.00                          │  │
│  │ Method: PayPal                           │  │
│  │ Status: ✅ Confirmed                     │  │
│  │ Confirmed by: Manager Name               │  │
│  │ Confirmed at: Jan 20, 2024 2:30 PM      │  │
│  │ [View Details] [Cancel Payment]          │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  Pending Payments:                               │
│  ┌──────────────────────────────────────────┐  │
│  │ Payment #2 - Jan 22, 2024                │  │
│  │ Amount: $250.00                          │  │
│  │ Method: Bank Transfer                    │  │
│  │ Status: ⏳ Pending Confirmation           │  │
│  │ Recorded by: Staff Name                 │  │
│  │ Recorded at: Jan 22, 2024 10:15 AM      │  │
│  │ [✅ Confirm Payment] [❌ Cancel Payment] │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Manual Payment Confirmation/Cancellation:**

**Payment Status Flow:**
1. **Recorded** → Payment is recorded by staff (initial state)
2. **Pending Confirmation** → Waiting for manager approval
3. **Confirmed** → Manager confirms the payment (final state)
4. **Cancelled** → Manager cancels/rejects the payment

**Payment Object Structure:**
```javascript
{
  id: 'PAY-001',
  amount: 250.00,
  payer: {
    id: 'payer-2',
    name: 'Jane Smith',
    email: 'jane@example.com'
  },
  method: 'PayPal',
  date: '2024-01-20',
  notes: 'Payment received',
  
  // Payment confirmation tracking
  status: 'pending_confirmation', // 'recorded', 'pending_confirmation', 'confirmed', 'cancelled'
  recordedBy: 'staff-user-id',
  recordedAt: '2024-01-20T10:15:00Z',
  confirmedBy: null, // Manager user ID when confirmed
  confirmedAt: null, // Timestamp when confirmed
  cancelledBy: null, // Manager user ID when cancelled
  cancelledAt: null, // Timestamp when cancelled
  cancellationReason: null // Reason for cancellation
}
```

**Manager Actions:**

1. **Confirm Payment:**
   - Manager clicks "✅ Confirm Payment" button
   - Confirmation modal appears:
     ```
     ┌─────────────────────────────────────┐
     │  Confirm Payment                    │
     ├─────────────────────────────────────┤
     │  Payment Details:                   │
     │  Amount: $250.00                    │
     │  Payer: Jane Smith                  │
     │  Method: PayPal                     │
     │  Date: Jan 20, 2024                │
     │                                     │
     │  [Cancel] [Confirm Payment]         │
     └─────────────────────────────────────┘
     ```
   - Payment status changes to "Confirmed"
   - Invoice paid amount updates
   - Payment becomes final and cannot be cancelled (unless admin override)

2. **Cancel Payment:**
   - Manager clicks "❌ Cancel Payment" button
   - Cancellation modal appears:
     ```
     ┌─────────────────────────────────────┐
     │  Cancel Payment                     │
     ├─────────────────────────────────────┤
     │  Payment Details:                   │
     │  Amount: $250.00                    │
     │  Payer: Jane Smith                  │
     │                                     │
     │  Reason for Cancellation: *         │
     │  [Textarea for reason]              │
     │                                     │
     │  ⚠️ This will remove this payment   │
     │     from the invoice.               │
     │                                     │
     │  [Cancel] [Confirm Cancellation]     │
     └─────────────────────────────────────┘
     ```
   - Manager must provide cancellation reason
   - Payment status changes to "Cancelled"
   - Invoice paid amount decreases
   - Payment is removed from active payment history
   - Cancellation reason is logged

**Payment Confirmation Settings:**

- **Auto-Confirm Threshold:** Payments below a certain amount can be auto-confirmed
- **Require Confirmation:** All payments require manager confirmation (default)
- **Confirmation Notifications:** Notify manager when new payments need confirmation
- **Cancellation Permissions:** Only managers/admins can cancel confirmed payments

**Manager Dashboard View:**

```
┌─────────────────────────────────────────────────┐
│  Payment Confirmation Queue                      │
├─────────────────────────────────────────────────┤
│  ⏳ 3 payments pending confirmation              │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ INV-001 - Jane Smith                     │  │
│  │ $250.00 | PayPal | Jan 20, 2024         │  │
│  │ [✅ Confirm] [❌ Cancel] [View Details]   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ INV-002 - John Doe                       │  │
│  │ $500.00 | Stripe | Jan 21, 2024         │  │
│  │ [✅ Confirm] [❌ Cancel] [View Details]   │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  [Confirm All] [View All Pending]                │
└─────────────────────────────────────────────────┘
```

**Benefits:**
- ✅ Manager has full control over payment confirmation
- ✅ Prevents unauthorized or incorrect payments
- ✅ Audit trail of who confirmed/cancelled payments
- ✅ Clear visibility of payment status
- ✅ Easy tracking of who has paid and who hasn't
- ✅ Ability to correct mistakes by cancelling payments

---

## 🔧 Implementation Plan

### Phase 1: Separate Data Structures

**Task 1.1:** Update Invoice Data Model
- Remove `configuredPayers` from invoice creation
- Add `assignedPayers` array (can be empty initially)
- Add invoice status: `unassigned`, `assigned`, `unpaid`, `partially_paid`, `paid`

**Task 1.2:** Separate Payer Configuration
- Move payer configuration to quote level (not invoice level)
- Store `quotePayers` array separately
- Payers exist independently of invoices

**Task 1.3:** Update Invoice Generation
- Remove payer-based splitting logic
- Create invoices without payer assignment
- Invoice creation is purely financial

### Phase 2: Payer Assignment Feature

**Task 2.1:** Create Payer Assignment Modal
- Modal UI for assigning payers to invoices
- Support multiple payer assignment
- Percentage validation (must equal 100%)
- Add/remove payers from assignment

**Task 2.2:** Update Invoice Display
- Show "Unassigned" status if no payers assigned
- Show assigned payers on invoice card
- "Assign Payers" button on unassigned invoices
- "Edit Assignment" button on assigned invoices

**Task 2.3:** Payer Assignment Logic
- Save assigned payers to invoice
- Validate percentages
- Update invoice status

### Phase 3: Update Payment Recording

**Task 3.1:** Update Payment Modal
- Show assigned payers (if any)
- Allow selecting from assigned payers OR any payer
- Show payer assignment info in payment history
- Payment status: "Recorded" (initial state, requires confirmation)

**Task 3.2:** Payment History Display
- Show which payer made each payment
- Highlight if payer was assigned to invoice
- Show assignment vs actual payment tracking
- Display payment status (pending_confirmation, confirmed, cancelled)

**Task 3.3:** Payment Confirmation System
- Add payment status field (recorded, pending_confirmation, confirmed, cancelled)
- Create payment confirmation modal
- Create payment cancellation modal
- Add confirmation/cancellation tracking (who, when, why)
- Update invoice paid amount only after confirmation

**Task 3.4:** Payer Payment Status Panel
- Create dedicated panel component
- Display payer payment status with progress indicators
- Show payment details per payer
- Add quick actions (confirm, cancel, view details)
- Calculate and display payer payment statistics

### Phase 4: UI/UX Enhancements

**Task 4.1:** Separate Invoice Publishing UI
- Clear "Publish Invoice" section
- Separate from payer configuration
- Better visual separation

**Task 4.2:** Payer Management UI
- Dedicated payer management section
- Better organization
- Clearer workflow

**Task 4.3:** Payer Payment Status Panel UI
- Design and implement payer payment status panel
- Add payment confirmation/cancellation buttons
- Create payment confirmation queue dashboard
- Add payment status indicators and progress bars
- Implement expandable payment details view

---

## 📊 Benefits

### 1. Flexibility
- ✅ Create invoices without payers configured
- ✅ Assign payers before or after invoice creation
- ✅ Change payer assignment if needed
- ✅ Multiple invoices can have different payer assignments

### 2. Clarity
- ✅ Clear separation of concerns
- ✅ Invoice = financial document
- ✅ Payer = who pays (separate concern)
- ✅ Easier to understand workflow

### 3. Workflow Options
- ✅ Option A: Create invoice → Assign payers → Record payments
- ✅ Option B: Configure payers → Create invoice → Auto-assign → Record payments
- ✅ Option C: Create invoice → Record payments (no payer assignment needed)

### 4. Better Management
- ✅ Payers configured once at quote level
- ✅ Can reuse payer configuration for multiple invoices
- ✅ Can track payer assignments per invoice
- ✅ Can see which invoices are assigned vs unassigned

---

## 🎯 Use Cases

### Use Case 1: Simple Single Payer
1. Create invoice ($1,000)
2. Don't assign payers (optional)
3. Record payment from customer
4. Invoice paid

### Use Case 2: Multiple Payers, Assign Later
1. Create invoice ($1,000)
2. Later, assign 2 payers (50% each)
3. Record payment from Payer 1 ($500)
4. Record payment from Payer 2 ($500)
5. Invoice paid

### Use Case 3: Configure First, Then Publish
1. Configure 2 payers in Payment Configuration
2. Publish invoice
3. System suggests assignment (50/50)
4. User accepts or modifies
5. Record payments

### Use Case 4: Change Assignment
1. Invoice created with 2 payers assigned
2. User changes assignment (adds 3rd payer)
3. Payments can still be recorded from any payer
4. Assignment is just for tracking/reference

---

## 🔄 Migration Strategy

### For Existing Invoices
- Existing invoices with `configuredPayers` → Convert to `assignedPayers`
- If no payers configured → Invoice status = "Unassigned"
- Payment history remains unchanged

### For New Invoices
- Create without payer assignment
- Allow assignment later
- Default to "Unassigned" status

---

## ❓ Questions to Clarify

1. **Is payer assignment required?**
   - Option A: Optional (can record payments without assignment)
   - Option B: Required (must assign before recording payments)
   - **Recommendation:** Optional for flexibility

2. **Can one invoice have different payers than another?**
   - Example: Deposit invoice → Payer A & B
   - Balance invoice → Payer A, B & C
   - **Recommendation:** Yes, each invoice can have different assignments

3. **Should payer assignment affect invoice amount?**
   - Option A: No, assignment is just for tracking
   - Option B: Yes, invoice amount can be split by assignment
   - **Recommendation:** Option A (assignment is for tracking, not splitting)

4. **Can payers be assigned at quote level?**
   - Option A: Yes, quote-level payers apply to all invoices
   - Option B: No, each invoice has its own assignment
   - **Recommendation:** Option B (more flexible)

---

## 📝 Implementation Checklist

### Phase 1: Data Structure
- [ ] Update invoice data model (remove `configuredPayers`, add `assignedPayers`)
- [ ] Separate payer configuration from invoice creation
- [ ] Update invoice generation to not require payers
- [ ] Add invoice status: `unassigned`, `assigned`

### Phase 2: Payer Assignment
- [ ] Create payer assignment modal
- [ ] Add "Assign Payers" button to invoice cards
- [ ] Implement assignment logic
- [ ] Update invoice display to show assignment status

### Phase 3: Payment Recording
- [ ] Update payment modal to show assigned payers
- [ ] Allow payments from any payer (not just assigned)
- [ ] Update payment history display
- [ ] Add payment confirmation system
- [ ] Add payment cancellation system
- [ ] Implement payment status tracking (recorded, pending, confirmed, cancelled)
- [ ] Add confirmation/cancellation tracking fields

### Phase 3.5: Payer Payment Status Panel
- [ ] Create payer payment status panel component
- [ ] Display payer payment status with progress indicators
- [ ] Add payment confirmation/cancellation controls
- [ ] Create payment confirmation queue dashboard
- [ ] Add payment details expandable view
- [ ] Implement payer payment statistics calculation

### Phase 4: UI/UX
- [ ] Separate invoice publishing section
- [ ] Enhance payer management UI
- [ ] Implement payer payment status panel UI
- [ ] Add payment confirmation/cancellation modals
- [ ] Create payment confirmation queue dashboard
- [ ] Update workflow documentation
- [ ] Add tooltips/help text

---

## 🎨 Visual Mockup Concept

```
┌─────────────────────────────────────────────────────────┐
│  INVOICES TAB                                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Invoice Publishing                            │    │
│  │  [Publish Invoice] button                     │    │
│  │  Creates invoice based on payment model       │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Published Invoices                           │    │
│  ├────────────────────────────────────────────────┤    │
│  │  INV-001  $1,000.00                           │    │
│  │  Status: Unassigned                            │    │
│  │  [Assign Payers] [Record Payment]             │    │
│  ├────────────────────────────────────────────────┤    │
│  │  INV-002  $500.00                             │    │
│  │  Status: Assigned (2 payers)                  │    │
│  │  [Edit Assignment] [Record Payment]           │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  PAYMENT CONFIGURATION TAB                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Payment Model Settings                       │    │
│  │  [Full Payment] [Deposit] [Subscription]     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Payer Management                              │    │
│  │  (Configure payers for this quote)             │    │
│  │  • John Doe (50%)                              │    │
│  │  • Jane Smith (50%)                            │    │
│  │  [Add Payer] [Edit] [Remove]                   │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Next Steps

1. **Review this plan** - Confirm approach and answer questions
2. **Phase 1 Implementation** - Separate data structures
3. **Phase 2 Implementation** - Payer assignment feature
4. **Phase 3 Implementation** - Update payment recording
5. **Phase 4 Implementation** - UI/UX enhancements

---

**Ready to proceed?** Let me know if you'd like any changes to this plan or have answers to the questions above!

