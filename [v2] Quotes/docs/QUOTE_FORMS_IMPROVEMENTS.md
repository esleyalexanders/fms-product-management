# Quote Create & Edit Forms - Required Changes

## 📋 Analysis Based on Financial Flow

After reviewing the `new_flowchart.md`, here are the critical changes needed for `quote_create.html` and `quote_edit.html` to support the enhanced financial flow.

---

## 🎯 Key Insights from Flowchart

### **1. Service Type Distinction**
The flowchart shows two distinct financial flows:
- **One-Time Service** → Manual invoicing with selective line items
- **Subscription Service** → Automated recurring billing

### **2. Payment Flow Requirements**
- **One-Time:** User creates invoice → Selects line items → Generates payment link → Manual send
- **Subscription:** System auto-charges → Auto-creates invoice → Auto-sends receipt

### **3. Quote Financial Statuses**
- Not Invoiced (Initial)
- Partially Invoiced (Some items billed)
- Fully Invoiced (All items billed)
- Partially Paid (Some payments received)
- Paid (Complete)

---

## ✅ Required Changes

### **CRITICAL: Add Service Type Selection**

Both forms MUST distinguish between one-time and subscription services.

#### **Location:** After Customer Information section
#### **Priority:** HIGH (Blocking)

```html
<!-- Service Type Section -->
<div class="bg-white rounded-lg shadow-sm p-4">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
        Service Type <span class="text-red-500">*</span>
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- One-Time Service -->
        <label class="relative flex cursor-pointer">
            <input 
                type="radio" 
                name="serviceType" 
                value="one-time" 
                checked
                class="peer sr-only"
                onchange="handleServiceTypeChange('one-time')"
            >
            <div class="w-full border-2 border-gray-300 rounded-lg p-4 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-gray-400 transition">
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-900 mb-1">One-Time Service</h3>
                        <p class="text-sm text-gray-600">
                            Single project or service. Invoice manually after work completion.
                        </p>
                        <div class="mt-2 text-xs text-gray-500">
                            ✓ Manual invoicing<br>
                            ✓ Flexible payment terms<br>
                            ✓ Progress billing available
                        </div>
                    </div>
                </div>
            </div>
        </label>

        <!-- Subscription Service -->
        <label class="relative flex cursor-pointer">
            <input 
                type="radio" 
                name="serviceType" 
                value="subscription" 
                class="peer sr-only"
                onchange="handleServiceTypeChange('subscription')"
            >
            <div class="w-full border-2 border-gray-300 rounded-lg p-4 peer-checked:border-purple-600 peer-checked:bg-purple-50 hover:border-gray-400 transition">
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-900 mb-1">Subscription Service</h3>
                        <p class="text-sm text-gray-600">
                            Recurring service. Auto-charge customer on schedule.
                        </p>
                        <div class="mt-2 text-xs text-gray-500">
                            ✓ Auto-billing<br>
                            ✓ Recurring payments<br>
                            ✓ Auto-invoice generation
                        </div>
                    </div>
                </div>
            </div>
        </label>
    </div>

    <!-- Subscription Settings (Conditional) -->
    <div id="subscriptionSettings" class="hidden mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 class="font-semibold text-gray-900 mb-3">Subscription Settings</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Billing Frequency -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Billing Frequency <span class="text-red-500">*</span>
                </label>
                <select 
                    id="billingFrequency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annually">Semi-Annually</option>
                    <option value="annually">Annually</option>
                </select>
            </div>

            <!-- Start Date -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span class="text-red-500">*</span>
                </label>
                <input 
                    type="date" 
                    id="subscriptionStartDate"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
            </div>

            <!-- Billing Day -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Billing Day <span class="text-red-500">*</span>
                </label>
                <select 
                    id="billingDay"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                    <option value="1">1st of month</option>
                    <option value="15">15th of month</option>
                    <option value="last">Last day of month</option>
                </select>
            </div>
        </div>

        <!-- Auto-Charge Notice -->
        <div class="mt-3 p-3 bg-purple-100 rounded-lg">
            <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm text-purple-800">
                    <strong>Auto-Charge Enabled:</strong> Customer's saved payment method will be automatically charged on the billing day. Invoice and receipt will be auto-generated and sent.
                </p>
            </div>
        </div>
    </div>
</div>
```

---

### **2. Payment Terms Section Enhancement**

#### **Location:** Right sidebar (Summary section)
#### **Priority:** HIGH

Add conditional payment terms based on service type:

```html
<!-- Payment Terms (Enhanced) -->
<div class="bg-white rounded-lg shadow-sm p-4">
    <h3 class="font-semibold text-gray-900 mb-3">Payment Terms</h3>
    
    <!-- One-Time Payment Terms -->
    <div id="oneTimePaymentTerms">
        <div class="space-y-3">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Payment Due
                </label>
                <select 
                    id="paymentDue"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option value="upon_receipt">Upon Receipt</option>
                    <option value="net_7">Net 7 Days</option>
                    <option value="net_15">Net 15 Days</option>
                    <option value="net_30">Net 30 Days</option>
                    <option value="net_60">Net 60 Days</option>
                    <option value="custom">Custom</option>
                </select>
            </div>

            <!-- Deposit Option -->
            <div class="border-t pt-3">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        id="requireDeposit"
                        class="w-4 h-4 text-blue-600 rounded"
                        onchange="toggleDepositSettings()"
                    >
                    <span class="text-sm font-medium text-gray-700">Require Deposit</span>
                </label>
                
                <div id="depositSettings" class="hidden mt-3 space-y-2">
                    <div class="flex gap-2">
                        <input 
                            type="number" 
                            id="depositAmount"
                            placeholder="Amount"
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                        <select 
                            id="depositType"
                            class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="percentage">%</option>
                            <option value="fixed">$</option>
                        </select>
                    </div>
                    <p class="text-xs text-gray-500">
                        Deposit required before work begins
                    </p>
                </div>
            </div>

            <!-- Progress Billing -->
            <div class="border-t pt-3">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        id="enableProgressBilling"
                        class="w-4 h-4 text-blue-600 rounded"
                    >
                    <span class="text-sm font-medium text-gray-700">Enable Progress Billing</span>
                </label>
                <p class="text-xs text-gray-500 mt-1 ml-6">
                    Invoice line items separately as work progresses
                </p>
            </div>
        </div>
    </div>

    <!-- Subscription Payment Info -->
    <div id="subscriptionPaymentInfo" class="hidden">
        <div class="p-3 bg-purple-50 rounded-lg">
            <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <div>
                    <p class="text-sm font-medium text-purple-900">Auto-Payment</p>
                    <p class="text-xs text-purple-700 mt-1">
                        Customer will be charged automatically on the billing day. Payment method must be saved during quote acceptance.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

### **3. Line Items Enhancement**

#### **Location:** Services/Line Items section
#### **Priority:** MEDIUM

Add "Invoiceable" flag for one-time services:

```html
<!-- Enhanced Line Item Row -->
<tr class="line-item-row">
    <td class="p-2">
        <input 
            type="text" 
            class="item-description w-full px-2 py-1 border rounded text-sm"
            placeholder="Description"
        >
    </td>
    <td class="p-2">
        <input 
            type="number" 
            class="item-quantity w-full px-2 py-1 border rounded text-sm text-center"
            value="1"
            min="1"
        >
    </td>
    <td class="p-2">
        <input 
            type="number" 
            class="item-rate w-full px-2 py-1 border rounded text-sm text-right"
            placeholder="0.00"
            step="0.01"
        >
    </td>
    
    <!-- NEW: Invoiceable Checkbox (One-Time Only) -->
    <td class="p-2 text-center invoiceable-column">
        <label class="flex items-center justify-center gap-1 cursor-pointer">
            <input 
                type="checkbox" 
                class="item-invoiceable w-4 h-4 text-blue-600 rounded"
                checked
                title="Can be invoiced separately"
            >
            <span class="text-xs text-gray-500">✓</span>
        </label>
    </td>
    
    <td class="p-2 text-right">
        <span class="item-total font-medium">$0.00</span>
    </td>
    <td class="p-2 text-center">
        <button class="remove-item-btn text-red-600 hover:text-red-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
        </button>
    </td>
</tr>
```

---

### **4. Quote Actions Enhancement**

#### **Location:** Bottom action buttons
#### **Priority:** HIGH

Different actions based on service type:

```html
<!-- Action Buttons (Enhanced) -->
<div class="bg-white rounded-lg shadow-sm p-4">
    <div class="flex justify-between items-center">
        <button 
            onclick="window.location.href='quote_list.html'"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
            Cancel
        </button>
        
        <div class="flex gap-2">
            <button 
                id="saveDraftBtn"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
                Save as Draft
            </button>
            
            <!-- One-Time Service Actions -->
            <div id="oneTimeActions">
                <button 
                    id="sendQuoteBtn"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Send Quote
                </button>
            </div>
            
            <!-- Subscription Service Actions -->
            <div id="subscriptionActions" class="hidden">
                <button 
                    id="sendSubscriptionQuoteBtn"
                    class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Send Subscription Quote
                </button>
            </div>
        </div>
    </div>
    
    <!-- Info Notice -->
    <div class="mt-3 p-3 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-800" id="actionNotice">
            <strong>Next Step:</strong> <span id="actionNoticeText">Customer will receive quote via email and can accept/decline online.</span>
        </p>
    </div>
</div>
```

---

### **5. JavaScript Functions Required**

#### **Priority:** HIGH

```javascript
// Service Type Handler
function handleServiceTypeChange(type) {
    const subscriptionSettings = document.getElementById('subscriptionSettings');
    const oneTimePaymentTerms = document.getElementById('oneTimePaymentTerms');
    const subscriptionPaymentInfo = document.getElementById('subscriptionPaymentInfo');
    const oneTimeActions = document.getElementById('oneTimeActions');
    const subscriptionActions = document.getElementById('subscriptionActions');
    const invoiceableColumns = document.querySelectorAll('.invoiceable-column');
    const actionNoticeText = document.getElementById('actionNoticeText');
    
    if (type === 'subscription') {
        // Show subscription UI
        subscriptionSettings.classList.remove('hidden');
        subscriptionPaymentInfo.classList.remove('hidden');
        subscriptionActions.classList.remove('hidden');
        
        // Hide one-time UI
        oneTimePaymentTerms.classList.add('hidden');
        oneTimeActions.classList.add('hidden');
        invoiceableColumns.forEach(col => col.classList.add('hidden'));
        
        // Update notice
        actionNoticeText.textContent = 'Customer will be auto-charged on the billing day. Payment method required during acceptance.';
    } else {
        // Show one-time UI
        oneTimePaymentTerms.classList.remove('hidden');
        oneTimeActions.classList.remove('hidden');
        invoiceableColumns.forEach(col => col.classList.remove('hidden'));
        
        // Hide subscription UI
        subscriptionSettings.classList.add('hidden');
        subscriptionPaymentInfo.classList.add('hidden');
        subscriptionActions.classList.add('hidden');
        
        // Update notice
        actionNoticeText.textContent = 'Customer will receive quote via email and can accept/decline online.';
    }
}

// Deposit Settings Toggle
function toggleDepositSettings() {
    const depositSettings = document.getElementById('depositSettings');
    const requireDeposit = document.getElementById('requireDeposit');
    
    if (requireDeposit.checked) {
        depositSettings.classList.remove('hidden');
    } else {
        depositSettings.classList.add('hidden');
    }
}

// Validate Subscription Settings
function validateSubscriptionSettings() {
    const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
    
    if (serviceType === 'subscription') {
        const frequency = document.getElementById('billingFrequency').value;
        const startDate = document.getElementById('subscriptionStartDate').value;
        const billingDay = document.getElementById('billingDay').value;
        
        if (!frequency || !startDate || !billingDay) {
            alert('Please complete all subscription settings');
            return false;
        }
    }
    
    return true;
}

// Save Quote with Service Type
function saveQuote() {
    if (!validateSubscriptionSettings()) {
        return;
    }
    
    const serviceType = document.querySelector('input[name="serviceType"]:checked').value;
    const quoteData = {
        serviceType: serviceType,
        // ... other quote data
    };
    
    if (serviceType === 'subscription') {
        quoteData.subscription = {
            frequency: document.getElementById('billingFrequency').value,
            startDate: document.getElementById('subscriptionStartDate').value,
            billingDay: document.getElementById('billingDay').value
        };
    } else {
        quoteData.paymentTerms = {
            due: document.getElementById('paymentDue').value,
            requireDeposit: document.getElementById('requireDeposit').checked,
            depositAmount: document.getElementById('depositAmount').value,
            depositType: document.getElementById('depositType').value,
            progressBilling: document.getElementById('enableProgressBilling').checked
        };
    }
    
    // Save logic here
    console.log('Saving quote:', quoteData);
}
```

---

## 📊 Summary of Changes

### **quote_create.html**
| Section | Change | Priority | Impact |
|---------|--------|----------|--------|
| Service Type | Add radio selection | HIGH | Blocking |
| Subscription Settings | Add conditional panel | HIGH | Blocking |
| Payment Terms | Enhance with conditions | HIGH | Major |
| Line Items | Add invoiceable flag | MEDIUM | Minor |
| Actions | Conditional buttons | HIGH | Major |

### **quote_edit.html**
| Section | Change | Priority | Impact |
|---------|--------|----------|--------|
| Service Type | Display + edit | HIGH | Blocking |
| Subscription Info | Show settings | HIGH | Major |
| Payment Terms | Display conditions | MEDIUM | Minor |
| Status Actions | Context-aware | HIGH | Major |

---

## 🎯 Implementation Priority

### **Phase 1: Critical (Week 1)**
1. ✅ Add Service Type selection (One-Time vs Subscription)
2. ✅ Add Subscription Settings panel
3. ✅ Update action buttons based on type
4. ✅ Add JavaScript handlers

### **Phase 2: Important (Week 2)**
5. ✅ Enhance Payment Terms section
6. ✅ Add deposit and progress billing options
7. ✅ Add invoiceable flags to line items
8. ✅ Update validation logic

### **Phase 3: Polish (Week 3)**
9. ✅ Add visual indicators and notices
10. ✅ Improve UX with tooltips
11. ✅ Add help text and examples
12. ✅ Test all scenarios

---

## 🔗 Integration Points

### **With Quote List**
- Display service type badge (🔄 for subscription, 📋 for one-time)
- Filter by service type
- Show subscription status (Active, Paused, Canceled)

### **With Invoice Creation**
- One-Time: Show line item selection
- Subscription: Auto-create full invoice
- Track invoicing progress

### **With Payment Processing**
- One-Time: Manual payment link generation
- Subscription: Auto-charge integration
- Dunning process for failed charges

---

## 📝 Data Model Changes

### **Quote Object Enhancement**
```javascript
{
    id: 'Q-2024-001',
    serviceType: 'one-time' | 'subscription',
    
    // One-Time specific
    paymentTerms: {
        due: 'net_30',
        requireDeposit: true,
        depositAmount: 500,
        depositType: 'fixed',
        progressBilling: true
    },
    
    // Subscription specific
    subscription: {
        frequency: 'monthly',
        startDate: '2024-11-01',
        billingDay: 1,
        status: 'active' | 'paused' | 'canceled',
        nextBillingDate: '2024-12-01'
    },
    
    // Line items
    items: [
        {
            description: 'Service A',
            quantity: 1,
            rate: 100,
            invoiceable: true // One-time only
        }
    ]
}
```

---

## ✅ Testing Checklist

### **One-Time Service**
- [ ] Can create quote with one-time service
- [ ] Can set payment terms (Net 30, etc.)
- [ ] Can require deposit
- [ ] Can enable progress billing
- [ ] Line items show invoiceable checkbox
- [ ] Send button shows correct text

### **Subscription Service**
- [ ] Can create quote with subscription
- [ ] Can set billing frequency
- [ ] Can set start date and billing day
- [ ] Payment terms hidden
- [ ] Line items hide invoiceable checkbox
- [ ] Send button shows subscription text
- [ ] Auto-charge notice displayed

### **Edit Mode**
- [ ] Service type displayed correctly
- [ ] Can't change service type after sent
- [ ] Subscription settings editable
- [ ] Payment terms editable

---

*This document outlines all required changes to support the enhanced financial flow from the flowchart.*
