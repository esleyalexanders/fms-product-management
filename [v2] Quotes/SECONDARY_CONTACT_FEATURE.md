# Quote Contact Selection - Secondary Contacts Support

## ✅ Feature Added

### **Quote Contact Selector**
When a customer has secondary contacts, you can now choose which contact should receive the quote.

---

## 🎯 Purpose

**Problem:** Some customers have multiple contacts (spouse, assistant, business partner, etc.), and you may want to send the quote to someone other than the primary contact.

**Solution:** Add a contact selector that appears when secondary contacts exist, allowing you to choose who receives the quote.

---

## 📊 How It Works

### **1. Customer with NO Secondary Contacts:**
```
┌────────────────────────────────────┐
│ ✓ Charlie Chen                     │
│   charlie.c@email.com              │
│   0414 567 890                     │
│                                    │
│ ─────────────────────────────────  │
│ Service Address                    │
│ ...                                │
└────────────────────────────────────┘
```
- No contact selector shown
- Quote automatically goes to primary contact

### **2. Customer WITH Secondary Contacts:**
```
┌────────────────────────────────────┐
│ ✓ Alice Anderson                   │
│   alice.a@email.com                │
│   0412 345 678                     │
│                                    │
│ ─────────────────────────────────  │
│ Quote Contact                      │
│ ┌────────────────────────────────┐ │
│ │ Primary: Alice Anderson        │ │
│ │ John Anderson - Spouse         │ │
│ └────────────────────────────────┘ │
│ Select who should receive quote    │
│                                    │
│ ─────────────────────────────────  │
│ Service Address                    │
│ ...                                │
└────────────────────────────────────┘
```
- Contact selector appears
- Shows primary + all secondary contacts
- Can choose who receives the quote

---

## 💻 Implementation Details

### **Customer Data Structure:**

```javascript
// Customer WITHOUT secondary contacts
{
  id: 3,
  name: 'Charlie Chen',
  email: 'charlie.c@email.com',
  phone: '0414 567 890',
  address: '3 Chapel St, Windsor VIC 3181',
  previousQuotes: 2
  // No secondaryContacts field
}

// Customer WITH secondary contacts
{
  id: 1,
  name: 'Alice Anderson',
  email: 'alice.a@email.com',
  phone: '0412 345 678',
  address: '1 Albert St, Melbourne VIC 3000',
  previousQuotes: 3,
  secondaryContacts: [
    {
      name: 'John Anderson',
      email: 'john.a@email.com',
      phone: '0412 345 679',
      role: 'Spouse'
    }
  ]
}

// Customer WITH multiple secondary contacts
{
  id: 2,
  name: 'Bob Brown',
  email: 'bob.brown@email.com',
  phone: '0413 456 789',
  address: '2 Bridge Rd, Richmond VIC 3121',
  previousQuotes: 5,
  secondaryContacts: [
    {
      name: 'Sarah Brown',
      email: 'sarah.b@email.com',
      phone: '0413 456 790',
      role: 'Assistant'
    },
    {
      name: 'Mike Brown',
      email: 'mike.b@email.com',
      phone: '0413 456 791',
      role: 'Business Partner'
    }
  ]
}
```

### **State Management:**

```javascript
const state = {
  selectedCustomer: null,           // The customer record
  selectedQuoteContact: null,       // The contact for this quote
  // ... other fields
};

// selectedQuoteContact structure:
{
  type: 'primary',        // or 'secondary'
  name: 'Alice Anderson',
  email: 'alice.a@email.com',
  phone: '0412 345 678'
  // If secondary, also includes:
  // role: 'Spouse'
}
```

### **Contact Selector Logic:**

```javascript
function selectCustomer(customerId) {
  const customer = customers.find(c => c.id === customerId);
  
  // Check if customer has secondary contacts
  if (customer.secondaryContacts && customer.secondaryContacts.length > 0) {
    // Show contact selector
    contactSelector.classList.remove('hidden');
    
    // Build dropdown options
    let options = `<option value="primary">Primary: ${customer.name} (${customer.email})</option>`;
    customer.secondaryContacts.forEach((contact, index) => {
      options += `<option value="secondary-${index}">${contact.name} - ${contact.role} (${contact.email})</option>`;
    });
    
    // Default to primary
    state.selectedQuoteContact = {
      type: 'primary',
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    };
  } else {
    // Hide selector, use primary by default
    contactSelector.classList.add('hidden');
    state.selectedQuoteContact = {
      type: 'primary',
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    };
  }
}
```

### **Contact Change Handler:**

```javascript
document.getElementById('quoteContactSelect').addEventListener('change', function(e) {
  const value = e.target.value;
  const customer = state.selectedCustomer;
  
  if (value === 'primary') {
    // Use primary contact
    state.selectedQuoteContact = {
      type: 'primary',
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    };
  } else if (value.startsWith('secondary-')) {
    // Use secondary contact
    const index = parseInt(value.split('-')[1]);
    const contact = customer.secondaryContacts[index];
    state.selectedQuoteContact = {
      type: 'secondary',
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      role: contact.role
    };
  }
});
```

---

## 📋 Quote Data Structure

### **Quote with Primary Contact:**

```javascript
{
  customer: {
    id: 3,
    name: 'Charlie Chen',
    email: 'charlie.c@email.com',
    phone: '0414 567 890',
    address: '3 Chapel St, Windsor VIC 3181'
  },
  quoteContact: {
    type: 'primary',
    name: 'Charlie Chen',
    email: 'charlie.c@email.com',
    phone: '0414 567 890'
  },
  items: [...],
  total: 462.00,
  status: 'active'
}
```

### **Quote with Secondary Contact:**

```javascript
{
  customer: {
    id: 1,
    name: 'Alice Anderson',
    email: 'alice.a@email.com',
    phone: '0412 345 678',
    address: '1 Albert St, Melbourne VIC 3000'
  },
  quoteContact: {
    type: 'secondary',
    name: 'John Anderson',
    email: 'john.a@email.com',
    phone: '0412 345 679',
    role: 'Spouse'
  },
  items: [...],
  total: 462.00,
  status: 'active'
}
```

**Note:** The `customer` field always contains the account holder, while `quoteContact` specifies who receives the quote.

---

## 🎨 UI Components

### **HTML Structure:**

```html
<!-- Quote Contact Selector (shown only if secondary contacts exist) -->
<div id="quoteContactSelector" class="hidden border-t border-blue-200 pt-3 mt-3">
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Quote Contact
  </label>
  <select 
    id="quoteContactSelect" 
    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
  >
    <!-- Options populated dynamically -->
  </select>
  <p class="text-xs text-gray-500 mt-1">
    Select who should receive this quote
  </p>
</div>
```

### **Dropdown Options Format:**

```html
<select id="quoteContactSelect">
  <option value="primary">
    Primary: Alice Anderson (alice.a@email.com)
  </option>
  <option value="secondary-0">
    John Anderson - Spouse (john.a@email.com)
  </option>
  <option value="secondary-1">
    Sarah Anderson - Assistant (sarah.a@email.com)
  </option>
</select>
```

---

## 💡 Use Cases

### **Use Case 1: Spouse Handles Finances**
```
Customer: Alice Anderson (Primary)
Secondary Contact: John Anderson (Spouse)

Scenario: Alice books the service but John handles all payments
Action: Select "John Anderson - Spouse" as quote contact
Result: Quote is sent to John's email, but account is under Alice
```

### **Use Case 2: Business Assistant**
```
Customer: Bob Brown (Business Owner)
Secondary Contact: Sarah Brown (Assistant)

Scenario: Bob is busy, Sarah manages all bookings
Action: Select "Sarah Brown - Assistant" as quote contact
Result: Quote is sent to Sarah for review and approval
```

### **Use Case 3: Business Partner**
```
Customer: Bob Brown (Primary)
Secondary Contact: Mike Brown (Business Partner)

Scenario: Mike is handling this specific project
Action: Select "Mike Brown - Business Partner" as quote contact
Result: Quote is sent to Mike, but billing is under Bob's account
```

### **Use Case 4: No Secondary Contacts**
```
Customer: Charlie Chen (Only contact)

Scenario: Individual customer with no additional contacts
Action: No selector shown, automatically uses primary
Result: Quote is sent to Charlie
```

---

## ✨ Benefits

### **1. Flexibility**
- ✅ Send quotes to the right person
- ✅ Accommodate different business structures
- ✅ Support family accounts

### **2. Better Communication**
- ✅ Quote reaches the decision-maker
- ✅ Reduces back-and-forth
- ✅ Faster quote approvals

### **3. Professional**
- ✅ Respects customer preferences
- ✅ Proper contact management
- ✅ Clear communication chain

### **4. Accurate Records**
- ✅ Track who received each quote
- ✅ Maintain customer relationships
- ✅ Audit trail for communications

---

## 🔄 Workflow

```
1. Select Customer
   ↓
2. Check for Secondary Contacts
   ↓
   ├─ NO → Use primary contact (hidden selector)
   │
   └─ YES → Show contact selector
      ↓
3. Choose Quote Contact
   - Primary (default)
   - Secondary Contact 1
   - Secondary Contact 2
   - etc.
   ↓
4. Create Quote
   ↓
5. Quote Data Includes:
   - customer: Account holder
   - quoteContact: Who receives quote
   ↓
6. Success Message Shows:
   "Quote created for Alice Anderson!
    Quote will be sent to: John Anderson (Spouse)"
```

---

## 📝 Sample Data

### **Customers with Secondary Contacts:**

1. **Alice Anderson** (ID: 1)
   - Primary: alice.a@email.com
   - Secondary: John Anderson (Spouse) - john.a@email.com

2. **Bob Brown** (ID: 2)
   - Primary: bob.brown@email.com
   - Secondary: Sarah Brown (Assistant) - sarah.b@email.com
   - Secondary: Mike Brown (Business Partner) - mike.b@email.com

### **Customers without Secondary Contacts:**
- All other customers (Charlie Chen, David Davis, etc.)
- Contact selector hidden
- Quote automatically sent to primary

---

## 🎯 Key Points

1. **Automatic Detection**
   - System checks for `secondaryContacts` array
   - Shows selector only when needed

2. **Default Behavior**
   - Always defaults to primary contact
   - User must explicitly choose secondary

3. **Data Integrity**
   - `customer` field = account holder (billing)
   - `quoteContact` field = quote recipient (communication)

4. **Backward Compatible**
   - Works with existing customers (no secondary contacts)
   - No changes needed for simple cases

---

## ✅ Summary

**Added:**
- ✅ Quote contact selector dropdown
- ✅ Support for secondary contacts
- ✅ Contact selection in quote data
- ✅ Sample customers with secondary contacts

**Features:**
- 🎯 Choose primary or secondary contact for quote
- 📧 Quote sent to selected contact's email
- 👥 Support for multiple secondary contacts
- 🔄 Automatic show/hide based on customer data

**Result:** Flexible quote contact management that accommodates various business and family structures! 🚀

---

**Updated:** November 3, 2025  
**Status:** ✅ Complete and Ready for Use
