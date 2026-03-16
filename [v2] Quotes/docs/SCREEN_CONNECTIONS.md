# Screen Connections Summary

## 🔗 All Navigation Links

### quote_list_simple.html
**Current Status:** ✅ Exists  
**Needs Updates:**
```html
<!-- Add at top of page -->
<nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex gap-6">
            <a href="quote_list_simple.html" class="text-blue-600 font-semibold border-b-2 border-blue-600 pb-3">Quotes</a>
            <a href="invoice_list_simple.html" class="text-gray-600 hover:text-gray-900 pb-3">Invoices</a>
        </div>
    </div>
</nav>

<!-- Update button -->
<button onclick="window.location.href='quote_create_simple.html'">+ New Quote</button>

<!-- Update quote card click -->
<div onclick="window.location.href='quote_edit_simple.html?id=' + quote.id">
```

---

### quote_create_simple.html
**Current Status:** ✅ Exists  
**Needs Updates:**
```html
<!-- Add navigation bar -->
<nav>...</nav>

<!-- Update cancel button -->
<button onclick="window.location.href='quote_list_simple.html'">Cancel</button>

<!-- Update success modal -->
<button onclick="window.location.href='quote_list_simple.html'">Back to Quotes</button>
```

---

### quote_edit_simple.html
**Current Status:** ✅ Exists  
**Needs Updates:**
```html
<!-- Add navigation bar -->
<nav>...</nav>

<!-- Update back button -->
<button onclick="window.location.href='quote_list_simple.html'">Back</button>

<!-- Update Create Invoice button -->
<button onclick="window.location.href='invoice_create_simple.html?quoteId=' + quoteId">Create Invoice</button>

<!-- Add View Invoice button (if invoice exists) -->
<button onclick="window.location.href='invoice_detail_simple.html?id=' + invoiceId">View Invoice</button>
```

---

### invoice_list_simple.html
**Current Status:** ✅ Exists (just created)  
**Needs Updates:**
```html
<!-- Add navigation bar -->
<nav class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex gap-6">
            <a href="quote_list_simple.html" class="text-gray-600 hover:text-gray-900 pb-3">Quotes</a>
            <a href="invoice_list_simple.html" class="text-purple-600 font-semibold border-b-2 border-purple-600 pb-3">Invoices</a>
        </div>
    </div>
</nav>

<!-- Update Create from Quote button -->
<button onclick="window.location.href='quote_list_simple.html'">Create from Quote</button>

<!-- Update invoice card click -->
<div onclick="window.location.href='invoice_detail_simple.html?id=' + invoice.id">

<!-- Add full JavaScript for rendering invoices -->
```

---

### invoice_create_simple.html
**Current Status:** ✅ Exists  
**Already Has:**
- ✅ Back button to quote_edit_simple.html
- ✅ Cancel button to quote_edit_simple.html
- ✅ Success modal with navigation

**Needs Updates:**
```html
<!-- Add navigation bar -->
<nav>...</nav>

<!-- Update success modal -->
<button onclick="window.location.href='invoice_detail_simple.html?id=' + invoiceId">View Invoice</button>
```

---

### invoice_detail_simple.html
**Current Status:** ✅ Exists  
**Already Has:**
- ✅ Payment setup link modal
- ✅ Send setup link functionality
- ✅ Mark as paid modal

**Needs Updates:**
```html
<!-- Add navigation bar -->
<nav>...</nav>

<!-- Add back button -->
<button onclick="window.location.href='invoice_list_simple.html'">
    <svg>...</svg>
    Back to Invoices
</button>

<!-- Add view quote button -->
<button onclick="window.location.href='quote_edit_simple.html?id=' + quoteId">
    View Quote
</button>

<!-- Update in JavaScript -->
const urlParams = new URLSearchParams(window.location.search);
const invoiceId = urlParams.get('id');
```

---

### customer_billing_setup.html
**Current Status:** ✅ Exists  
**Already Has:**
- ✅ Token parameter handling
- ✅ Form submission
- ✅ Success state

**No Updates Needed** - Standalone customer-facing page

---

## 🎯 Quick Implementation Guide

### Step 1: Create Shared Navigation Component
```html
<!-- Save as navigation snippet -->
<nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
            <div class="flex gap-6">
                <a href="quote_list_simple.html" class="nav-link" id="quotesNav">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Quotes
                </a>
                <a href="invoice_list_simple.html" class="nav-link" id="invoicesNav">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Invoices
                </a>
            </div>
            <div class="text-sm text-gray-600">
                Sunshine Tutoring - Melbourne East
            </div>
        </div>
    </div>
</nav>

<style>
.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    color: #6b7280;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
}
.nav-link:hover {
    color: #374151;
    background: #f9fafb;
}
.nav-link.active {
    color: #7c3aed;
    border-bottom-color: #7c3aed;
    background: #faf5ff;
}
</style>
```

### Step 2: Add to Each Screen
Add this navigation bar right after `<body>` tag in:
- quote_list_simple.html (set quotesNav as active)
- quote_create_simple.html (set quotesNav as active)
- quote_edit_simple.html (set quotesNav as active)
- invoice_list_simple.html (set invoicesNav as active)
- invoice_create_simple.html (set invoicesNav as active)
- invoice_detail_simple.html (set invoicesNav as active)

### Step 3: Update URL Parameter Handling

**invoice_create_simple.html:**
```javascript
// Get quote ID from URL
const urlParams = new URLSearchParams(window.location.search);
const quoteId = urlParams.get('quoteId');

// Load quote data
if (quoteId) {
    // Fetch quote data and populate form
}
```

**invoice_detail_simple.html:**
```javascript
// Get invoice ID from URL
const urlParams = new URLSearchParams(window.location.search);
const invoiceId = urlParams.get('id');

// Load invoice data
if (invoiceId) {
    // Fetch invoice data and display
}
```

**quote_edit_simple.html:**
```javascript
// Get quote ID from URL
const urlParams = new URLSearchParams(window.location.search);
const quoteId = urlParams.get('id');

// Load quote data
if (quoteId) {
    // Fetch quote data and populate form
}
```

---

## 📊 Connection Matrix

| From Screen | To Screen | Trigger | URL Parameters |
|------------|-----------|---------|----------------|
| quote_list | quote_create | + New Quote button | None |
| quote_list | quote_edit | Click quote card | ?id={quoteId} |
| quote_list | invoice_list | Invoices nav link | None |
| quote_create | quote_list | Save/Cancel | None |
| quote_edit | quote_list | Back/Save | None |
| quote_edit | invoice_create | Create Invoice | ?quoteId={quoteId} |
| quote_edit | invoice_detail | View Invoice | ?id={invoiceId} |
| invoice_list | quote_list | Quotes nav link | None |
| invoice_list | invoice_detail | Click invoice card | ?id={invoiceId} |
| invoice_create | quote_edit | Back/Cancel | ?id={quoteId} |
| invoice_create | invoice_detail | Create success | ?id={invoiceId} |
| invoice_detail | invoice_list | Back button | None |
| invoice_detail | quote_edit | View Quote | ?id={quoteId} |
| invoice_detail | customer_billing | Send Setup Link | ?token={setupToken} |

---

## ✅ Implementation Checklist

### Navigation Bar
- [ ] Add nav to quote_list_simple.html
- [ ] Add nav to quote_create_simple.html
- [ ] Add nav to quote_edit_simple.html
- [ ] Add nav to invoice_list_simple.html
- [ ] Add nav to invoice_create_simple.html
- [ ] Add nav to invoice_detail_simple.html

### URL Parameters
- [ ] Add parameter handling to quote_edit_simple.html
- [ ] Add parameter handling to invoice_create_simple.html
- [ ] Add parameter handling to invoice_detail_simple.html

### Button Updates
- [ ] Update all "Back" buttons
- [ ] Update all "Cancel" buttons
- [ ] Update all "Create" buttons
- [ ] Update all "View" buttons
- [ ] Update all card click handlers

### Testing
- [ ] Test Quote → Create → List flow
- [ ] Test Quote → Edit → Create Invoice flow
- [ ] Test Invoice → Detail → Back flow
- [ ] Test Navigation bar switching
- [ ] Test all URL parameters
- [ ] Test customer billing setup link

---

## 🚀 Priority Order

**Phase 1 - Critical (Do First):**
1. Add navigation bar to all 6 main screens
2. Update invoice_list_simple.html with full functionality
3. Add URL parameter handling to all screens

**Phase 2 - Important:**
4. Update all back/cancel buttons
5. Update all "Create" and "View" buttons
6. Test all navigation flows

**Phase 3 - Polish:**
7. Add breadcrumbs where appropriate
8. Add loading states
9. Add error handling for missing parameters

---

## 📝 Notes

- **customer_billing_setup.html** is standalone and doesn't need navigation bar
- All screens should handle missing URL parameters gracefully
- Navigation bar should highlight current section (Quotes vs Invoices)
- All buttons should use consistent styling
- Consider adding a "Home" or "Dashboard" link in the future

The system is well-structured with clear separation between Quote and Invoice flows. The main work needed is adding the navigation bar and ensuring URL parameters are properly passed and handled.
