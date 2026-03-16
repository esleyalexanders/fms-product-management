# Quote Status Workflow Implementation

## Overview
This document describes the status-based workflow system implemented in `quote_edit_simple.html`.

## Status Definitions

### 1. **Draft** (📝)
- **Description**: Quote is being created or edited, not yet sent to customer
- **Can Edit**: ✅ Yes
- **Can Delete**: ✅ Yes
- **Available Actions**:
  - Save Changes → Stays in Draft
  - Send Quote → Changes to **Sent**
  - Download PDF
  - Delete Quote

### 2. **Sent** (📤)
- **Description**: Quote has been sent to customer, awaiting response
- **Can Edit**: ✅ Yes
- **Can Delete**: ❌ No
- **Available Actions**:
  - Save Changes → Stays in Sent
  - Resend Quote → Stays in Sent
  - Mark as Approved → Changes to **Approved**
  - Mark as Rejected → Changes to **Rejected**
  - Download PDF

### 3. **Approved** (✅)
- **Description**: Customer has accepted the quote, ready for invoicing
- **Can Edit**: ❌ No (Read-only)
- **Can Delete**: ❌ No
- **Available Actions**:
  - Create Invoice → Can create invoices
  - Download PDF
  - Clone Quote → Creates new **Draft**

### 4. **Rejected** (❌)
- **Description**: Customer has declined the quote
- **Can Edit**: ❌ No (Read-only)
- **Can Delete**: ❌ No
- **Available Actions**:
  - Clone Quote → Creates new **Draft**
  - Download PDF
  - Archive Quote

### 5. **Expired** (⏰)
- **Description**: Quote validity period has passed (auto-detected)
- **Can Edit**: ❌ No (Read-only)
- **Can Delete**: ❌ No
- **Available Actions**:
  - Renew Quote → Creates new **Draft** with extended date
  - Clone Quote → Creates new **Draft**
  - Download PDF
  - Archive Quote

### 6. **Invoiced** (💰)
- **Description**: At least one invoice has been created from this quote
- **Can Edit**: ❌ No (Read-only)
- **Can Delete**: ❌ No
- **Available Actions**:
  - View Invoices → Switches to Invoices tab
  - Create Invoice → Create additional invoice
  - Download PDF

## Status Transitions

```
Draft ──────(Send)──────> Sent
              │
Sent ─────(Approve)─────> Approved
  │
  └──────(Reject)──────> Rejected

Approved ───(Invoice)──> Invoiced

Any Status ──(Clone)──> Draft (new quote)

Any Status ─(Auto)────> Expired (when validUntil date passes)

Expired ────(Renew)───> Draft (with new date)
```

## Features

### Dynamic Action Buttons
- Action buttons in the header change based on current status
- Primary actions are highlighted (e.g., "Send Quote" in Draft)
- Irrelevant actions are hidden for each status

### Read-Only Mode
When quote is not editable (Approved, Rejected, Expired, Invoiced):
- All input fields are disabled
- Add/remove item buttons are hidden
- Visual indicators (grayed out fields) show editing is disabled
- Informational banner explains the status

### Auto-Detection
- Quotes are automatically marked as **Expired** if the `validUntil` date has passed
- This happens on page load and doesn't require manual status change

### Status Information Banners
Non-editable statuses show colored banners with:
- Status icon and title
- Clear explanation of why editing is disabled
- Suggested actions users can take

## Developer Tools

### Testing Different Statuses
Open browser console and use the `testStatus()` function:

```javascript
// Test different statuses
testStatus("draft")     // Editable, can send/delete
testStatus("sent")      // Editable, can approve/reject  
testStatus("approved")  // Read-only, can create invoice
testStatus("rejected")  // Read-only, can clone
testStatus("expired")   // Read-only, can renew/clone
testStatus("invoiced")  // Read-only, view invoices
```

## Configuration

Status configuration is defined in the `statusConfig` object:

```javascript
const statusConfig = {
    draft: {
        label: '📝 Draft',
        color: 'bg-yellow-100 text-yellow-700',
        canEdit: true,
        canDelete: true,
        actions: [...]
    },
    // ... other statuses
};
```

## Implementation Details

### Key Functions

1. **`isQuoteExpired()`** - Checks if quote has passed validity date
2. **`getCurrentStatus()`** - Returns effective status (auto-detects expired)
3. **`renderStatusActions()`** - Renders buttons and updates UI based on status
4. **`disableEditing()`** - Locks all form fields for read-only statuses
5. **`handleStatusAction(actionId)`** - Routes action button clicks to appropriate handlers

### Action Handlers

Each action has a corresponding handler function:
- `saveQuoteChanges()` - Saves modifications
- `sendQuote()` - Sends quote and changes status to Sent
- `resendQuote()` - Resends quote email
- `approveQuote()` - Marks as Approved
- `rejectQuote()` - Marks as Rejected
- `createInvoiceFromQuote()` - Creates invoice
- `downloadQuotePDF()` - Downloads PDF
- `deleteQuote()` - Deletes quote (Draft only)
- `cloneQuote()` - Creates copy as new Draft
- `archiveQuote()` - Archives quote
- `renewQuote()` - Renews expired quote with new date

## Future Enhancements

Potential improvements:
1. **Status History**: Track all status changes with timestamps
2. **Email Templates**: Customize email content for Send/Resend
3. **Approval Workflow**: Multi-level approval process
4. **Partial Approval**: Approve specific line items only
5. **Status Notifications**: Email notifications on status changes
6. **Status Permissions**: Role-based access control for status transitions
7. **Audit Trail**: Log all actions taken on the quote

## Business Rules

1. **Draft → Sent**: Requires customer and at least one line item
2. **Sent → Approved**: Typically done by customer, but can be manual
3. **Approved → Invoiced**: Happens when first invoice is created
4. **Cannot Edit After Approval**: Ensures quote integrity
5. **Auto-Expiration**: Prevents use of outdated pricing
6. **Clone for Modifications**: Preserves original quote history

## User Experience

### Visual Indicators
- **Status Badge**: Shows current status with emoji and color
- **Action Buttons**: Color-coded (blue=primary, green=success, red=danger)
- **Info Banners**: Clear explanation for locked statuses
- **Disabled Fields**: Gray background indicates read-only

### Confirmation Dialogs
Critical actions require confirmation:
- Delete Quote
- Mark as Approved/Rejected
- Archive Quote
- Status transitions

### Success Messages
All actions show confirmation alerts:
- "Quote sent successfully!"
- "Quote marked as Approved!"
- "Quote renewed! Please update and send to customer."

