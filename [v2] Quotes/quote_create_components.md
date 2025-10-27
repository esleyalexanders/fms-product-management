# Quote Create Screen - Component Specification

Based on the quote creation sequence flow, this document defines all key components, interactions, and technical requirements for the Quote Create screen.

**Document Version:** 1.0  
**Date:** 2025-10-27  
**Reference:** quote_creation_sequence.md

---

## Overview

The Quote Create screen is a multi-section form that guides franchisee staff through the complete quote creation process, from customer selection to quote delivery. The screen integrates with Customer Management, Pricebook, and Workflow Engine systems.

---

## 1. Customer Selection Component

### 1.1 Purpose
Allows staff to search for existing customers or create new ones inline without leaving the quote creation flow.

### 1.2 Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│ 👤 CUSTOMER INFORMATION                                         │
├────────────────────────────────────────────────────────────────┤
│ [Search Existing Customer] OR [+ Create New Customer]          │
└────────────────────────────────────────────────────────────────┘
```

### 1.3 Sub-components

#### A. Customer Search (Existing Customer Flow)
**UI Elements:**
- Search input with autocomplete
- Customer dropdown results showing:
  - Customer name
  - Contact info (email/phone)
  - Last service date
  - Total jobs count
  
**API Integration:**
```javascript
GET /api/customers/search?q={query}
Response: [
  {
    id: "C-123",
    name: "John Doe",
    email: "john@email.com",
    phone: "+61400123456",
    lastService: "2025-10-15",
    totalJobs: 12,
    address: {...}
  }
]
```

**Features:**
- ✅ Real-time search with debounce (300ms)
- ✅ Fuzzy matching on name, email, phone
- ✅ Display customer profile on selection
- ✅ Show previous quotes history
- ✅ Clone previous quote option

#### B. Previous Quotes Display
**Trigger:** After customer selection  
**UI Elements:**
- Expandable section showing last 5 quotes
- Each quote shows: Quote #, Date, Total, Status
- "Clone This Quote" action button

**Interaction:**
```
Customer selected → Fetch previous quotes
User clicks "Clone" → Duplicate quote data to current form
Pre-fill all line items, pricing, terms from cloned quote
Allow editing before save
```

#### C. New Customer Form (New Customer Flow)
**UI Elements:**
- Inline form (no modal/page navigation)
- Required fields:
  - Full Name *
  - Email * (with format validation)
  - Phone * (with format validation)
  - Service Address *
- Optional fields:
  - Business Name
  - WhatsApp Number
  - Preferred Contact Method (radio buttons)

**API Integration:**
```javascript
POST /api/customers
Request: {
  name: "John Doe",
  email: "john@email.com",
  phone: "+61400123456",
  whatsapp: "+61400123456",
  preferredContact: "whatsapp",
  address: {...}
}
Response: {
  id: "C-124",
  ...customerData
}
```

**Features:**
- ✅ Address autocomplete (Google Places API)
- ✅ Email/phone format validation
- ✅ Auto-generate Customer ID on save
- ✅ Link customer to quote immediately

### 1.4 Component State
```javascript
customerSection: {
  mode: 'search' | 'new' | 'selected',
  selectedCustomer: CustomerObject | null,
  previousQuotes: QuoteObject[],
  isCloning: boolean,
  clonedFromQuoteId: string | null
}
```

---

## 2. Pricebook Service Selection Component

### 2.1 Purpose
Browse and select services/products from the pricebook catalog to add to the quote.

### 2.2 Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│ 🛍️ SERVICES & PRODUCTS                                         │
├────────────────────────────────────────────────────────────────┤
│ [🔍 Search services and products...]                           │
│                                                                │
│ [Suggested Packages] (if applicable)                          │
│                                                                │
│ [Selected Line Items Table]                                    │
└────────────────────────────────────────────────────────────────┘
```

### 2.3 Sub-components

#### A. Pricebook Search
**UI Elements:**
- Search input with type-ahead
- Filter options:
  - Service Type (Service/Product)
  - Category dropdown
  - Price range slider
- Search results grid/list showing:
  - Service code
  - Service name
  - Description (truncated)
  - Unit price
  - Unit of measure
  - Thumbnail image
  - "Add" button

**API Integration:**
```javascript
GET /api/pricebook/search?q={query}&type={type}&category={cat}
Response: [
  {
    id: "PB-001",
    code: "CLEAN-001",
    type: "service",
    name: "House Cleaning",
    description: "Standard 3BR home cleaning",
    basePrice: 150.00,
    unit: "each",
    duration: 120,
    taxCategory: "taxable_gst",
    imageUrl: "https://...",
    status: "published"
  }
]
```

**Features:**
- ✅ Debounced search (300ms)
- ✅ Filter by published items only
- ✅ Show item availability
- ✅ Quick add to line items
- ✅ Display unit pricing and duration

#### B. Package Suggestions (Good-Better-Best)
**Trigger:** Based on customer type, property size, service history  
**UI Elements:**
- Card-based layout (3 packages max)
- Each card shows:
  - Package name
  - Total price
  - Included items list
  - "Add Package" button
  
**Interaction:**
```
Display suggested packages
User clicks "Add Package" → Add all items to line items
Allow customization after package added
```

**Business Logic:**
- Packages defined in pricebook with package flag
- Filter packages based on customer profile
- Pre-calculate package totals

---

## 3. Line Items Management Component

### 3.1 Purpose
Display, manage, and calculate all selected services/products in the quote.

### 3.2 Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│ Selected Items (3)                                             │
├────────────────────────────────────────────────────────────────┤
│ Item            │ Qty │ Unit Price │ Disc % │ Total │ Actions │
├─────────────────┼─────┼────────────┼────────┼───────┼─────────┤
│ House Cleaning  │  1  │  $150.00   │   0%   │$150.00│ ⚙️ ✖️   │
│ Window Cleaning │  2  │  $75.00    │  10%   │$135.00│ ⚙️ ✖️   │
└────────────────────────────────────────────────────────────────┘
```

### 3.3 Features per Line Item

#### A. Editable Fields
- **Quantity:** Inline number input (min: 0.1, max: 9999)
- **Unit Price:** Inline currency input (editable for custom items)
- **Discount %:** Inline percentage input (0-100%)

**Real-time Calculation:**
```javascript
function calculateLineTotal(item) {
  const baseAmount = item.quantity * item.unitPrice;
  const discountAmount = baseAmount * (item.discountPercent / 100);
  const lineTotal = baseAmount - discountAmount;
  return lineTotal;
}
```

#### B. Line Item Actions
- **⚙️ Configure:** Open item details modal
  - Edit quantity/frequency
  - Add line item notes
  - Mark as optional
  - Set discount with reason
- **✖️ Remove:** Delete line item (with confirmation)
- **↕️ Reorder:** Drag handle to reorder items

#### C. Item Details Modal
```
┌────────────────────────────────────────────────────────────────┐
│ Configure Line Item: House Cleaning                            │
├────────────────────────────────────────────────────────────────┤
│ Quantity/Frequency                                             │
│ [1] [each ▼]                                                   │
│                                                                │
│ ☐ Mark as Optional Item (customer can choose)                 │
│                                                                │
│ Discount                                                       │
│ [0]%  Reason: [_____________________________]                 │
│                                                                │
│ Line Item Notes (visible to customer)                         │
│ [________________________________________________]              │
│                                                                │
│ Internal Notes (staff only)                                   │
│ [________________________________________________]              │
│                                                                │
│ [Cancel] [Save Changes]                                        │
└────────────────────────────────────────────────────────────────┘
```

#### D. Add Custom Line Item
**Trigger:** "+ Add Custom Item" button  
**UI Elements:**
- Item name (text input)
- Description (textarea)
- Quantity (number)
- Unit price (currency)
- Tax category (dropdown)

**Validation:**
- Name required
- Price must be > 0
- Tax category required

---

## 4. Pricing & Calculation Component

### 4.1 Purpose
Apply discounts, calculate taxes, and compute quote totals automatically.

### 4.2 Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│ 💰 PRICING & TOTALS                                            │
├────────────────────────────────────────────────────────────────┤
│ ☐ Apply Quote-Level Discount                                  │
│ ☐ Require Deposit                                              │
│                                                                │
│ Calculation Summary:                                           │
│ Subtotal:                                        $285.00       │
│ Discount:                                         -$0.00       │
│ Tax (GST 10%):                                    $28.50       │
│ ─────────────────────────────────────────────────────────      │
│ TOTAL:                                           $313.50       │
│ Deposit Required:                                 $62.70       │
│ Balance Due:                                     $250.80       │
└────────────────────────────────────────────────────────────────┘
```

### 4.3 Sub-components

#### A. Auto-Discount Engine
**Trigger:** On line items change  
**API Integration:**
```javascript
POST /api/pricebook/check-discounts
Request: {
  customerId: "C-123",
  lineItems: [...],
  subtotal: 285.00
}
Response: {
  applicableDiscounts: [
    {
      id: "DISC-001",
      name: "Repeat Customer 5%",
      type: "percentage",
      value: 5,
      autoApply: true
    }
  ]
}
```

**Business Logic:**
- Check customer loyalty discounts
- Check volume discounts
- Check seasonal promotions
- Apply highest discount automatically
- Display applied discount with name

#### B. Manual Discount Override
**UI Elements:**
- Discount type: Percentage / Fixed Amount
- Discount value input
- Reason field (required for discounts > threshold)

**Workflow Integration:**
```javascript
if (discountPercent > 20 || discountAmount > 100) {
  // Trigger approval workflow
  POST /api/workflow/approval
  Request: {
    type: "quote_discount",
    quoteId: "Q-001",
    requestedBy: "STAFF-123",
    discountValue: 25,
    reason: "VIP customer special request",
    quote: {...}
  }
  
  // Quote status → "pending_approval"
  // Notify manager
  // Wait for approval before sending
}
```

#### C. Deposit Configuration
**UI Elements:**
- Enable deposit checkbox
- Deposit type: Fixed Amount / Percentage
- Amount/percentage input
- Auto-calculate deposit amount

**Calculation:**
```javascript
function calculateDeposit(total, depositConfig) {
  if (depositConfig.type === 'percentage') {
    return total * (depositConfig.percent / 100);
  } else {
    return depositConfig.fixedAmount;
  }
}
```

#### D. Tax Calculation
**Business Logic:**
- Get tax category from each line item
- Apply tax rate based on category (from pricebook)
- Calculate tax on subtotal (after discounts)
- Support tax-inclusive/exclusive modes

**Tax Categories (Australia GST):**
- `taxable_gst`: 10% GST
- `gst_free`: 0% (GST-free supplies)
- `input_taxed`: 0% (no GST, no credits)

```javascript
function calculateTax(lineItems) {
  let totalTax = 0;
  lineItems.forEach(item => {
    const lineTotal = calculateLineTotal(item);
    const taxRate = getTaxRate(item.taxCategory);
    totalTax += lineTotal * (taxRate / 100);
  });
  return totalTax;
}
```

### 4.4 Real-time Calculation
**Trigger:** Any change to:
- Line item quantity
- Line item price
- Line item discount
- Quote-level discount
- Deposit settings

**Update Sequence:**
```
1. Calculate each line item total
2. Sum line totals → Subtotal
3. Apply quote-level discount → Discounted Subtotal
4. Calculate tax on discounted subtotal → Tax Amount
5. Add tax to discounted subtotal → Total
6. Calculate deposit based on total → Deposit Amount
7. Subtract deposit from total → Balance Due
8. Update UI immediately
```

---

## 5. Approval Workflow Component

### 5.1 Purpose
Handle manager approval for high-value quotes or large discounts.

### 5.2 Trigger Conditions
- Discount > 20%
- Quote total > threshold (configurable, e.g., $5,000)
- Custom pricing override
- Manual price adjustment

### 5.3 Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│ ⚠️ APPROVAL REQUIRED                                            │
├────────────────────────────────────────────────────────────────┤
│ This quote requires manager approval due to:                   │
│ • Discount exceeds 20% (25% requested)                         │
│                                                                │
│ Justification (required):                                      │
│ [VIP customer, negotiated rate for ongoing contract...]        │
│                                                                │
│ [Submit for Approval]                                          │
└────────────────────────────────────────────────────────────────┘
```

### 5.4 Approval States
- **Draft:** Quote being created
- **Pending Approval:** Submitted, waiting for manager
- **Approved:** Manager approved, can be sent
- **Rejected:** Manager rejected, needs revision
- **Sent:** Quote sent to customer

### 5.5 Manager Approval UI (Separate Screen)
**Notification:** Email/SMS to manager  
**Approval Screen Shows:**
- Quote details (customer, items, totals)
- Discount/override details
- Staff justification
- Actions: Approve / Reject with comments

**API Integration:**
```javascript
POST /api/workflow/approval/{approvalId}/respond
Request: {
  action: "approve" | "reject",
  comments: "Approved for this customer",
  approvedBy: "MGR-001"
}
```

**On Approval:**
- Update quote status → "approved"
- Notify staff
- Enable "Send Quote" button

**On Rejection:**
- Update quote status → "rejected"
- Notify staff with comments
- Staff must revise quote

---

## 6. Terms & Notes Component

### 6.1 Purpose
Add terms, conditions, validity period, and notes to the quote.

### 6.2 Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│ 📝 TERMS & NOTES                                               │
├────────────────────────────────────────────────────────────────┤
│ Quote Valid Until                                              │
│ [📅 Nov 10, 2025] (14 days from today)                         │
│                                                                │
│ Terms & Conditions                                             │
│ [Use Template ▼] Standard Terms                               │
│ [___________________________________________________________]  │
│                                                                │
│ Notes for Customer (visible on quote)                         │
│ [___________________________________________________________]  │
│                                                                │
│ Internal Notes (staff only)                                   │
│ [___________________________________________________________]  │
└────────────────────────────────────────────────────────────────┘
```

### 6.3 Features

#### A. Validity Period
- Default: 14 days from creation
- Date picker for custom validity
- Auto-calculate expiry timestamp
- Warning if date is too far (>90 days)

#### B. Terms & Conditions Template
**Template Source:** Franchisor-defined templates  
**API Integration:**
```javascript
GET /api/settings/quote-templates
Response: [
  {
    id: "TPL-001",
    name: "Standard Terms",
    content: "Payment due within 7 days...",
    isDefault: true
  }
]
```

**Features:**
- Dropdown to select template
- Template auto-fills terms field
- Editable after selection
- Support for rich text formatting

#### C. Notes Fields
**Customer-facing Notes:**
- Visible on quote PDF
- Used for special instructions
- Highlighted section on quote

**Internal Notes:**
- Staff-only visibility
- Not sent to customer
- Used for job execution notes
- Examples: "Customer has 2 large dogs", "Gate code: 1234"

---

## 7. Quote Preview & Finalization Component

### 7.1 Purpose
Review quote before saving/sending, generate PDF preview.

### 7.2 Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│ 👁️ QUOTE PREVIEW                                               │
├────────────────────────────────────────────────────────────────┤
│ [Professional quote layout matching customer-facing design]    │
│                                                                │
│ Header: Company logo, Quote #, Date                           │
│ Customer: Name, address, contact                              │
│ Line Items: Table with all services                           │
│ Totals: Subtotal, tax, total, deposit                         │
│ Terms: Terms & conditions                                      │
│ Notes: Customer notes                                          │
│                                                                │
│ [Close Preview] [Download PDF] [Send Quote]                   │
└────────────────────────────────────────────────────────────────┘
```

### 7.3 PDF Generation
**API Integration:**
```javascript
POST /api/quotes/{id}/generate-pdf
Response: {
  pdfUrl: "https://cdn.../quotes/Q-001.pdf",
  expiresAt: "2025-10-28T10:00:00Z"
}
```

**PDF Contents:**
- Company branding (logo, colors)
- Quote metadata (number, date, validity)
- Customer information
- Itemized line items table
- Pricing breakdown
- Terms & conditions
- Payment instructions
- QR code to customer portal (if enabled)

---

## 8. Quote Delivery Component

### 8.1 Purpose
Send quote to customer via selected channel(s).

### 8.2 Component Structure

```
┌────────────────────────────────────────────────────────────────┐
│ 📤 SEND QUOTE                                                  │
├────────────────────────────────────────────────────────────────┤
│ Delivery Method:                                               │
│ ☑️ Email (john@email.com)                                      │
│ ☑️ SMS/WhatsApp (+61 400 123 456)                              │
│ ☐ Manual/Print                                                 │
│                                                                │
│ Email Subject:                                                 │
│ [Your Quote from ABC Cleaning Services]                       │
│                                                                │
│ Message:                                                       │
│ [Hi John,                                                      │
│                                                                │
│  Thank you for your interest in our services. Please find     │
│  your quote attached. Click the link below to view and        │
│  approve online:                                               │
│                                                                │
│  [VIEW QUOTE ONLINE]                                           │
│                                                                │
│  Best regards,                                                 │
│  ABC Cleaning Services]                                        │
│                                                                │
│ Attachments:                                                   │
│ ☑️ Quote PDF                                                   │
│                                                                │
│ [Cancel] [Send Quote]                                          │
└────────────────────────────────────────────────────────────────┘
```

### 8.3 Delivery Methods

#### A. Email Delivery
**API Integration:**
```javascript
POST /api/quotes/{id}/send
Request: {
  method: "email",
  to: "john@email.com",
  subject: "Your Quote from ABC Cleaning",
  message: "Hi John...",
  attachPDF: true,
  includePortalLink: true
}
Response: {
  sent: true,
  sentAt: "2025-10-27T10:30:00Z",
  portalLink: "https://portal.../quote/Q-001"
}
```

**Email Template:**
- HTML email with branding
- Quote summary in email body
- PDF attachment
- "View Online" button linking to portal
- Contact information

#### B. SMS/WhatsApp Delivery
**API Integration:**
```javascript
POST /api/quotes/{id}/send
Request: {
  method: "sms",
  to: "+61400123456",
  message: "Your quote is ready! View here: {link}"
}
```

**SMS Content:**
- Short message (160 chars)
- Link to customer portal
- Quote number for reference

#### C. Manual/Print
- Generate and download PDF
- Mark quote as "delivered" manually
- Staff records delivery method in notes

### 8.4 Post-Send Actions
**Automatic Actions:**
1. Update quote status → "sent"
2. Log delivery in CRM
3. Create follow-up task (default: 3 days)
4. Schedule reminder notification
5. Generate portal access link (if not manual)

**API Integration:**
```javascript
POST /api/crm/log-activity
Request: {
  customerId: "C-123",
  type: "quote_sent",
  quoteId: "Q-001",
  method: "email",
  sentAt: "2025-10-27T10:30:00Z"
}

POST /api/tasks/create
Request: {
  type: "follow_up_quote",
  quoteId: "Q-001",
  assignedTo: "STAFF-123",
  dueDate: "2025-10-30T10:00:00Z",
  description: "Follow up on Quote Q-001 with John Doe"
}
```

---

## 9. Customer Portal Integration

### 9.1 Purpose
Provide customer self-service quote viewing and response capabilities.

### 9.2 Portal Access
**Link Generation:**
```javascript
GET /api/quotes/{id}/portal-link
Response: {
  portalUrl: "https://portal.example.com/quote/Q-001?token=abc123",
  expiresAt: "2025-11-10T23:59:59Z"
}
```

**Security:**
- Unique token per quote
- Token expires with quote validity
- No login required (magic link)
- Optional: Request customer email verification

### 9.3 Portal Customer Actions

#### A. View Quote
- Professional quote display
- All line items with descriptions
- Pricing breakdown
- Terms & conditions
- Optional items can be toggled on/off

#### B. Accept Quote
**Flow:**
```
Customer clicks "Accept Quote"
  ↓
If deposit required → Payment form
  ↓
Customer pays deposit
  ↓
Quote status → "accepted"
  ↓
System creates booking/job
  ↓
Confirmation sent to customer & staff
```

**API Integration:**
```javascript
POST /api/quotes/{id}/accept
Request: {
  customerName: "John Doe",
  signature: "data:image/png;base64...",
  selectedOptionalItems: ["line-2", "line-5"],
  depositPaid: true,
  paymentId: "PAY-123"
}
Response: {
  jobId: "JOB-001",
  confirmationSent: true
}
```

#### C. Request Changes
**Flow:**
```
Customer clicks "Request Changes"
  ↓
Opens revision request form
  ↓
Customer enters requested changes
  ↓
System notifies staff
  ↓
Staff creates quote revision
```

**API Integration:**
```javascript
POST /api/quotes/{id}/request-revision
Request: {
  requestedChanges: "Please add carpet cleaning",
  customerNotes: "Also, can we do it on Saturday?"
}
```

**Notification to Staff:**
- Email/SMS alert
- Show revision request in dashboard
- Link to create new quote version

#### D. Decline Quote
**Flow:**
```
Customer clicks "Decline Quote"
  ↓
Optional: Request feedback form
  ↓
Quote status → "declined"
  ↓
Notify staff
```

**Feedback Collection:**
- Reason for decline (dropdown)
- Additional comments (textarea)
- Save feedback to CRM

---

## 10. State Management & Data Flow

### 10.1 Component State Structure

```javascript
const quoteCreateState = {
  // Quote metadata
  quote: {
    id: "Q-DRAFT-001",
    status: "draft",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: "STAFF-123"
  },
  
  // Customer section
  customer: {
    mode: "search" | "new" | "selected",
    selected: CustomerObject | null,
    previousQuotes: QuoteObject[],
    isCloning: boolean,
    clonedFrom: string | null
  },
  
  // Line items
  lineItems: [
    {
      id: "line-1",
      pricebookItemId: "PB-001",
      name: "House Cleaning",
      quantity: 1,
      unitPrice: 150.00,
      discountPercent: 0,
      isOptional: false,
      notes: "",
      subtotal: 150.00
    }
  ],
  
  // Pricing
  pricing: {
    subtotal: 0,
    quoteDiscount: 0,
    discountReason: "",
    taxAmount: 0,
    total: 0,
    depositRequired: false,
    depositType: "percentage",
    depositAmount: 0
  },
  
  // Approval
  approval: {
    required: false,
    status: "none" | "pending" | "approved" | "rejected",
    justification: "",
    approvedBy: null,
    approvedAt: null
  },
  
  // Terms
  terms: {
    validUntil: timestamp,
    template: "TPL-001",
    customTerms: "",
    customerNotes: "",
    internalNotes: ""
  },
  
  // UI state
  ui: {
    isLoading: false,
    isSaving: false,
    validationErrors: [],
    showPreview: false,
    showSendModal: false
  }
};
```

### 10.2 Data Flow Diagram

```
User Action → Component → State Update → API Call → Response → State Update → UI Update
                  ↓                                      ↓
            Validation                            Success/Error
                  ↓                                      ↓
          Error Handling                         Update UI
```

### 10.3 Key Actions

```javascript
// Customer actions
selectCustomer(customerId)
createNewCustomer(customerData)
cloneQuote(quoteId)

// Line item actions
addLineItem(pricebookItem)
removeLineItem(lineItemId)
updateLineItem(lineItemId, field, value)
reorderLineItems(fromIndex, toIndex)

// Pricing actions
applyDiscount(type, value, reason)
toggleDeposit(enabled)
setDepositConfig(type, value)
recalculateTotals()

// Approval actions
submitForApproval(justification)
checkApprovalRequired()

// Quote actions
saveDraft()
generatePreview()
sendQuote(deliveryMethod, options)

// Validation
validateForm()
validateSection(sectionName)
```

---

## 11. Validation Rules

### 11.1 Form-level Validation
**Required for Save as Draft:**
- Customer selected or created ✓
- At least 1 line item ✓

**Required for Send Quote:**
- All draft requirements ✓
- Customer email OR phone ✓
- Valid expiry date (future) ✓
- Terms & conditions added ✓
- All line items have qty > 0 ✓
- If approval required → status = "approved" ✓

### 11.2 Field-level Validation

```javascript
const validationRules = {
  customer: {
    name: { required: true, minLength: 2 },
    email: { required: true, format: "email" },
    phone: { required: true, format: "phone" },
    address: { required: true }
  },
  
  lineItem: {
    quantity: { required: true, min: 0.1, max: 9999 },
    unitPrice: { required: true, min: 0.01 },
    discountPercent: { min: 0, max: 100 }
  },
  
  pricing: {
    depositPercent: { min: 0, max: 100 },
    depositAmount: { min: 0, max: pricing.total }
  },
  
  terms: {
    validUntil: { required: true, futureDate: true },
    terms: { required: true, minLength: 10 }
  }
};
```

### 11.3 Business Validation

```javascript
// Discount validation
if (discountPercent > 20) {
  requireApproval = true;
  requireJustification = true;
}

// Quote total validation
if (total > 5000) {
  requireApproval = true;
}

// Line item validation
if (lineItems.length === 0) {
  error = "At least one line item required";
}

// Expiry validation
if (validUntil < today) {
  error = "Expiry date must be in the future";
}
if (daysUntilExpiry > 90) {
  warning = "Unusually long validity period";
}
```

---

## 12. Error Handling & User Feedback

### 12.1 Error Types

#### A. Validation Errors
**Display:** Inline next to field  
**Style:** Red text, red border on input  
**Example:**
```
Email *
[john@gmailcom___]
⚠️ Please enter a valid email address
```

#### B. API Errors
**Display:** Toast notification at top  
**Style:** Red background, white text  
**Auto-dismiss:** 5 seconds  
**Example:** "Failed to save quote. Please try again."

#### C. Network Errors
**Display:** Modal dialog  
**Actions:** Retry / Cancel  
**Message:** "Connection lost. Your changes have been saved locally."

### 12.2 Success Feedback

```javascript
// Save success
showToast("Quote saved as draft", "success");

// Send success
showModal({
  title: "Quote Sent Successfully!",
  message: "Quote Q-001 has been sent to john@email.com",
  icon: "✅",
  actions: [
    { label: "View Quote", action: () => navigate('quote-view') },
    { label: "Create New Quote", action: () => resetForm() }
  ]
});
```

---

## 13. Performance Considerations

### 13.1 Optimization Strategies

```javascript
// Debounce search
const debouncedSearch = debounce((query) => {
  searchPricebook(query);
}, 300);

// Lazy load pricebook images
<img src="placeholder.jpg" data-src={item.imageUrl} loading="lazy" />

// Cache customer data
const customerCache = new Map();
function getCachedCustomer(id) {
  if (!customerCache.has(id)) {
    customerCache.set(id, fetchCustomer(id));
  }
  return customerCache.get(id);
}

// Throttle calculation
const throttledCalculate = throttle(() => {
  recalculateTotals();
}, 200);

// Auto-save with debounce
const autoSave = debounce(() => {
  if (hasChanges) {
    saveDraft();
  }
}, 30000); // 30 seconds
```

### 13.2 Loading States

```javascript
const loadingStates = {
  initial: "Loading quote form...",
  savingDraft: "Saving draft...",
  sendingQuote: "Sending quote...",
  searchingCustomer: "Searching customers...",
  loadingPricebook: "Loading services...",
  generatingPDF: "Generating PDF..."
};
```

---

## 14. Accessibility Requirements

### 14.1 ARIA Labels
- Form sections with `role="region"` and `aria-label`
- Required fields marked with `aria-required="true"`
- Error messages linked with `aria-describedby`
- Loading states announced with `aria-live="polite"`

### 14.2 Keyboard Navigation
- Tab order follows visual layout
- Enter submits forms/modals
- Escape closes modals
- Arrow keys navigate tables
- Ctrl+S saves draft

### 14.3 Screen Reader Support
- Descriptive labels for all inputs
- Hidden instructions for complex interactions
- Announce calculation updates
- Confirm destructive actions

---

## 15. Testing Requirements

### 15.1 Unit Tests
- ✅ Calculation functions (totals, tax, deposit)
- ✅ Validation rules
- ✅ Data transformations
- ✅ State management

### 15.2 Integration Tests
- ✅ Customer search and selection
- ✅ Pricebook item addition
- ✅ Quote save as draft
- ✅ Quote send flow
- ✅ Approval workflow
- ✅ Portal link generation

### 15.3 E2E Tests
- ✅ Complete quote creation (existing customer)
- ✅ Complete quote creation (new customer)
- ✅ Clone previous quote
- ✅ Quote with approval required
- ✅ Send quote via email
- ✅ Customer accepts quote in portal

---

## 16. API Endpoints Summary

```javascript
// Customer Management
GET    /api/customers/search?q={query}
POST   /api/customers
GET    /api/customers/{id}/quotes

// Pricebook
GET    /api/pricebook/search?q={query}&type={type}
GET    /api/pricebook/items/{id}
POST   /api/pricebook/check-discounts

// Quotes
POST   /api/quotes                          // Create
PUT    /api/quotes/{id}                     // Update
GET    /api/quotes/{id}                     // Get
POST   /api/quotes/{id}/generate-pdf        // Generate PDF
POST   /api/quotes/{id}/send                // Send
GET    /api/quotes/{id}/portal-link         // Get portal link
POST   /api/quotes/{id}/clone               // Clone

// Workflow
POST   /api/workflow/approval                // Submit for approval
POST   /api/workflow/approval/{id}/respond   // Approve/Reject

// Tasks
POST   /api/tasks/create                     // Create follow-up

// CRM
POST   /api/crm/log-activity                 // Log quote sent

// Templates
GET    /api/settings/quote-templates         // Get terms templates
```

---

## 17. Next Steps

### Phase 1: Core Components (Week 1-2)
1. Customer selection component
2. Line items management
3. Basic calculation engine
4. Save as draft functionality

### Phase 2: Enhanced Features (Week 3-4)
1. Pricebook search integration
2. Discount & approval workflow
3. Terms & notes
4. PDF generation

### Phase 3: Delivery & Portal (Week 5-6)
1. Quote send functionality
2. Customer portal integration
3. Response handling
4. Follow-up tasks

### Phase 4: Polish & Testing (Week 7-8)
1. Error handling
2. Performance optimization
3. Accessibility improvements
4. Comprehensive testing

---

**Document End**  
For questions or clarifications, refer to quote_creation_sequence.md or contact the development team.

