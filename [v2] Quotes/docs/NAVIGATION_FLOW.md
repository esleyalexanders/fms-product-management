# Navigation Flow - Simplified Invoice System

## 📋 Screen Overview

### Quote Screens
1. **quote_list_simple.html** - List all quotes
2. **quote_create_simple.html** - Create new quote
3. **quote_edit_simple.html** - Edit existing quote

### Invoice Screens
4. **invoice_list_simple.html** - List all invoices
5. **invoice_create_simple.html** - Create invoice from quote
6. **invoice_detail_simple.html** - View invoice details

### Customer Screens
7. **customer_billing_setup.html** - Customer payment setup

---

## 🔄 Complete Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        QUOTE FLOW                                │
└─────────────────────────────────────────────────────────────────┘

quote_list_simple.html
    ├─→ [+ New Quote] → quote_create_simple.html
    │                       └─→ [Save] → quote_list_simple.html
    │
    ├─→ [Click Quote] → quote_edit_simple.html
    │                       ├─→ [Save] → quote_list_simple.html
    │                       ├─→ [Create Invoice] → invoice_create_simple.html
    │                       └─→ [Back] → quote_list_simple.html
    │
    └─→ [Invoices Tab] → invoice_list_simple.html


┌─────────────────────────────────────────────────────────────────┐
│                       INVOICE FLOW                               │
└─────────────────────────────────────────────────────────────────┘

invoice_list_simple.html
    ├─→ [Create from Quote] → quote_list_simple.html
    └─→ [Click Invoice] → invoice_detail_simple.html
                              ├─→ [Back] → invoice_list_simple.html
                              ├─→ [View Quote] → quote_edit_simple.html
                              └─→ [Send Setup Link] → (Email to customer)


invoice_create_simple.html
    ├─→ [Back to Quote] → quote_edit_simple.html
    ├─→ [Cancel] → quote_edit_simple.html
    └─→ [Create Invoice] → invoice_detail_simple.html


invoice_detail_simple.html
    ├─→ [Back to Invoices] → invoice_list_simple.html
    ├─→ [View Quote] → quote_edit_simple.html
    ├─→ [Send Setup Link] → customer_billing_setup.html (via email)
    └─→ [Mark as Paid] → (Modal, stays on page)


┌─────────────────────────────────────────────────────────────────┐
│                      CUSTOMER FLOW                               │
└─────────────────────────────────────────────────────────────────┘

customer_billing_setup.html
    └─→ [Submit] → Success State (closes window)
```

---

## 🔗 Navigation Links by Screen

### 1. quote_list_simple.html
**Outgoing Links:**
- `[+ New Quote]` → `quote_create_simple.html`
- `[Click Quote Card]` → `quote_edit_simple.html?id={quoteId}`
- `[Invoices]` (nav tab) → `invoice_list_simple.html`

**Incoming Links:**
- From `quote_create_simple.html` (after save)
- From `quote_edit_simple.html` (after save/cancel)
- From `invoice_list_simple.html` (back button)

---

### 2. quote_create_simple.html
**Outgoing Links:**
- `[Cancel]` → `quote_list_simple.html`
- `[Save Quote]` → `quote_list_simple.html` (after success)

**Incoming Links:**
- From `quote_list_simple.html` (+ New Quote button)

---

### 3. quote_edit_simple.html
**Outgoing Links:**
- `[Back]` → `quote_list_simple.html`
- `[Save]` → `quote_list_simple.html` (after success)
- `[Create Invoice]` → `invoice_create_simple.html?quoteId={id}`
- `[View Invoice]` → `invoice_detail_simple.html?id={invoiceId}`

**Incoming Links:**
- From `quote_list_simple.html` (click quote)
- From `invoice_detail_simple.html` (view quote button)
- From `invoice_create_simple.html` (back button)

---

### 4. invoice_list_simple.html
**Outgoing Links:**
- `[Create from Quote]` → `quote_list_simple.html`
- `[Click Invoice Card]` → `invoice_detail_simple.html?id={invoiceId}`
- `[Quotes]` (nav tab) → `quote_list_simple.html`

**Incoming Links:**
- From `quote_list_simple.html` (Invoices tab)
- From `invoice_detail_simple.html` (back button)

---

### 5. invoice_create_simple.html
**Outgoing Links:**
- `[Back to Quote]` → `quote_edit_simple.html?id={quoteId}`
- `[Cancel]` → `quote_edit_simple.html?id={quoteId}`
- `[Create Invoice]` → `invoice_detail_simple.html?id={invoiceId}` (after success)
- `[Back to Quotes]` (in success modal) → `quote_list_simple.html`

**Incoming Links:**
- From `quote_edit_simple.html` (Create Invoice button)

---

### 6. invoice_detail_simple.html
**Outgoing Links:**
- `[Back]` → `invoice_list_simple.html`
- `[View Quote]` → `quote_edit_simple.html?id={quoteId}`
- `[Send Setup Link]` → Sends email with link to `customer_billing_setup.html?token={token}`
- `[Send Payment Link]` → Sends email (stays on page)
- `[Mark as Paid]` → Opens modal (stays on page)

**Incoming Links:**
- From `invoice_list_simple.html` (click invoice)
- From `invoice_create_simple.html` (after creation)
- From `quote_edit_simple.html` (view invoice button)

---

### 7. customer_billing_setup.html
**Outgoing Links:**
- None (closes window after success)

**Incoming Links:**
- From email link sent via `invoice_detail_simple.html`
- URL format: `customer_billing_setup.html?token={setupToken}`

---

## 🎯 User Journeys

### Journey 1: Create Quote → Invoice → Get Paid
```
1. quote_list_simple.html
2. Click [+ New Quote]
3. quote_create_simple.html → Fill details → [Save]
4. quote_list_simple.html → Click quote card
5. quote_edit_simple.html → [Create Invoice]
6. invoice_create_simple.html → Select payment model → [Create]
7. invoice_detail_simple.html → [Send Payment Link]
8. Customer pays
9. [Mark as Paid]
```

### Journey 2: Subscription with Auto-Charge Setup
```
1. quote_edit_simple.html → [Create Invoice]
2. invoice_create_simple.html → Select "Subscription" → Enable auto-charge → [Create]
3. invoice_detail_simple.html → See "Payment method not set up" warning
4. Click [Send Setup Link]
5. Modal opens → Enter email → [Send Link]
6. Customer receives email
7. Customer clicks link → customer_billing_setup.html
8. Customer fills billing info → [Submit]
9. Success! Payment method saved
10. invoice_detail_simple.html → Status updates to "Payment method configured"
```

### Journey 3: View All Invoices
```
1. quote_list_simple.html → Click [Invoices] tab
2. invoice_list_simple.html → Browse invoices
3. Click invoice card
4. invoice_detail_simple.html → View details
5. Click [Back] → invoice_list_simple.html
```

### Journey 4: Deposit Payment
```
1. quote_edit_simple.html → [Create Invoice]
2. invoice_create_simple.html → Select "Deposit" → Enter amount → [Create]
3. invoice_detail_simple.html → Shows deposit paid + remaining balance
4. [Send Payment Link] for remaining balance
5. Customer pays remaining
6. [Mark as Paid] for full amount
```

---

## 🔧 Required Updates

### Add Navigation Bar to All Screens
```html
<nav class="bg-white border-b border-gray-200 mb-6">
    <div class="max-w-7xl mx-auto px-4">
        <div class="flex gap-6">
            <a href="quote_list_simple.html" class="nav-link">Quotes</a>
            <a href="invoice_list_simple.html" class="nav-link">Invoices</a>
        </div>
    </div>
</nav>
```

### Update All "Back" Buttons
- Ensure proper return paths
- Pass necessary URL parameters
- Maintain context (quote ID, invoice ID)

### Update All "Create" Buttons
- Pass source IDs in URL
- Pre-fill data from source
- Validate required parameters

---

## 📊 URL Parameter Patterns

### Quotes
- `quote_create_simple.html` - No parameters
- `quote_edit_simple.html?id=Q-2024-001` - Quote ID
- `quote_list_simple.html` - No parameters

### Invoices
- `invoice_create_simple.html?quoteId=Q-2024-001` - Source quote ID
- `invoice_detail_simple.html?id=INV-2024-001` - Invoice ID
- `invoice_list_simple.html` - No parameters

### Customer
- `customer_billing_setup.html?token=abc123xyz` - Setup token

---

## 🎨 Consistent UI Elements

### Header Pattern
```html
<div class="flex items-center justify-between mb-6">
    <div>
        <h1 class="text-3xl font-bold">Page Title</h1>
        <p class="text-gray-600">Description</p>
    </div>
    <div class="flex gap-2">
        <button class="secondary">Cancel/Back</button>
        <button class="primary">Primary Action</button>
    </div>
</div>
```

### Breadcrumb Pattern
```html
<div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
    <a href="quote_list_simple.html">Quotes</a>
    <span>›</span>
    <a href="quote_edit_simple.html?id=Q-2024-001">Q-2024-001</a>
    <span>›</span>
    <span class="text-gray-900">Create Invoice</span>
</div>
```

---

## ✅ Implementation Checklist

### Phase 1: Add Navigation Bar
- [ ] Add nav to quote_list_simple.html
- [ ] Add nav to quote_create_simple.html
- [ ] Add nav to quote_edit_simple.html
- [ ] Add nav to invoice_list_simple.html
- [ ] Add nav to invoice_create_simple.html
- [ ] Add nav to invoice_detail_simple.html

### Phase 2: Update Links
- [ ] Update all "Back" buttons with correct paths
- [ ] Update all "Create" buttons with URL parameters
- [ ] Update all "View" buttons with correct IDs
- [ ] Add breadcrumbs where appropriate

### Phase 3: URL Parameter Handling
- [ ] Add URL parameter parsing to all screens
- [ ] Pre-fill data based on URL parameters
- [ ] Validate required parameters
- [ ] Show error if parameters missing

### Phase 4: Test All Flows
- [ ] Test Quote → Invoice flow
- [ ] Test Invoice → Quote flow
- [ ] Test List → Detail → List flow
- [ ] Test Customer billing setup flow
- [ ] Test all back buttons
- [ ] Test all cancel buttons

---

## 🚀 Summary

The simplified invoice system has **7 interconnected screens** with clear navigation paths:

**Quote Management:**
- List → Create → List
- List → Edit → Create Invoice

**Invoice Management:**
- List → Detail → Back
- Create → Detail → Back
- Detail → Send Setup Link → Customer Portal

**Customer Portal:**
- Standalone billing setup page
- Accessed via email link
- Returns to success state

All screens follow consistent patterns for navigation, URL parameters, and UI elements, creating a cohesive user experience throughout the system.
