# Preferred Schedule - Per Service Item

## ✅ Feature Update

### **Moved Preferred Schedule from Customer Section to Individual Service Items**

Previously, the preferred schedule was a single field at the customer level. Now, each **service item** in the quote can have its own preferred schedule.

---

## 🎯 Why This Change?

**Problem:** A customer might book multiple services that need to happen at different times.

**Example:**
- Service 1: One-on-One Tutoring - Math → **Morning (9 AM)**
- Service 2: Assessment & Report → **Afternoon (2 PM)**
- Service 3: Small Group Tutoring → **Evening (6 PM)**

**Solution:** Move the preferred schedule to each service line item, allowing different scheduling preferences per service.

---

## 📊 How It Works

### **Product Items:**
```
┌────────────────────────────────────────────────┐
│ 📦 Study Materials Package                     │
│ 🟢 Product  📋 GST (10%)                       │
│ ┌────────────────────────────────────────────┐ │
│ │ 📝 Delivery instructions...                │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```
- No schedule fields (products don't need scheduling)

### **Service Items:**
```
┌────────────────────────────────────────────────┐
│ 🔧 One-on-One Tutoring - Math                 │
│ 🔵 Service  📋 GST (10%)                       │
│ ┌────────────────────────────────────────────┐ │
│ │ 📝 Service requirements...                 │ │
│ └────────────────────────────────────────────┘ │
│ ──────────────────────────────────────────────  │
│ 📅 Preferred Schedule                          │
│ ┌──────────────────┬──────────────────┐        │
│ │ ▼ Morning        │ [Exact Time]     │        │
│ │   (8AM-12PM)     │ (if exact)       │        │
│ └──────────────────┴──────────────────┘        │
│ ┌────────────────────────────────────────────┐ │
│ │ Schedule notes...                          │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```
- Schedule fields appear for services only
- Time slot selector
- Exact time field (shown when "Exact Time" selected)
- Schedule notes

---

## 💻 Implementation Details

### **Data Structure:**

```javascript
// Service item with schedule
{
  id: 't1',
  name: 'One-on-One Tutoring - Math',
  type: 'service',
  price: 75,
  quantity: 2,
  serviceDate: '2025-11-15',
  
  // Schedule fields (services only)
  preferredTime: 'morning',      // 'morning', 'afternoon', 'evening', 'flexible', 'exact'
  exactTime: '09:00',            // Only if preferredTime === 'exact'
  scheduleNotes: 'Student prefers morning sessions',
  
  notes: 'Advanced level, Grade 10',
  discount: 10,
  discountType: 'percentage'
}

// Product item (no schedule)
{
  id: 'p1',
  name: 'Study Materials Package',
  type: 'product',
  price: 45,
  quantity: 5,
  serviceDate: '2025-11-20',     // Delivery date
  
  // No schedule fields for products
  
  notes: 'Deliver to reception',
  discount: 0,
  discountType: 'percentage'
}
```

### **Time Slot Options:**

```javascript
const timeSlots = [
  { value: '', label: 'Select time...' },
  { value: 'morning', label: 'Morning (8AM-12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
  { value: 'evening', label: 'Evening (5PM-8PM)' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'exact', label: 'Exact Time' }
];
```

### **Conditional Rendering:**

```javascript
// In renderQuoteItems function
${item.type === 'service' ? `
  <div class="mt-3 border-t border-gray-200 pt-2">
    <div class="text-xs font-medium text-gray-600 mb-2">📅 Preferred Schedule</div>
    
    <!-- Time slot selector -->
    <select onchange="updateItemPreferredTime(${index}, this.value)">
      <option value="">Select time...</option>
      <option value="morning">Morning (8AM-12PM)</option>
      <option value="afternoon">Afternoon (12PM-5PM)</option>
      <option value="evening">Evening (5PM-8PM)</option>
      <option value="flexible">Flexible</option>
      <option value="exact">Exact Time</option>
    </select>
    
    <!-- Exact time field (shown only when 'exact' selected) -->
    <input 
      type="time"
      class="${item.preferredTime === 'exact' ? '' : 'hidden'}"
      onchange="updateItemExactTime(${index}, this.value)"
    />
    
    <!-- Schedule notes -->
    <textarea 
      placeholder="Schedule notes..."
      onchange="updateItemScheduleNotes(${index}, this.value)"
    >${item.scheduleNotes || ''}</textarea>
  </div>
` : ''}
```

### **Handler Functions:**

```javascript
function updateItemPreferredTime(index, value) {
  state.quoteItems[index].preferredTime = value;
  renderQuoteItems(); // Re-render to show/hide exact time field
}

function updateItemExactTime(index, value) {
  state.quoteItems[index].exactTime = value;
}

function updateItemScheduleNotes(index, value) {
  state.quoteItems[index].scheduleNotes = value;
}
```

---

## 🎨 UI Layout

### **Service Item with Schedule:**

```
┌──────────────────────────────────────────────────────────┐
│ One-on-One Tutoring - Math                               │
│ 🔵 Service  📋 GST (10%)                                 │
│                                                           │
│ ┌───────────────────────────────────────────────────────┐│
│ │ 📝 Student is Grade 10, preparing for finals.        ││
│ │    Prefers afternoon sessions after 3 PM.            ││
│ └───────────────────────────────────────────────────────┘│
│ ─────────────────────────────────────────────────────────│
│ 📅 Preferred Schedule                                    │
│ ┌─────────────────────┬─────────────────────┐           │
│ │ ▼ Afternoon         │                     │           │
│ │   (12PM-5PM)        │                     │           │
│ └─────────────────────┴─────────────────────┘           │
│ ┌───────────────────────────────────────────────────────┐│
│ │ Prefers 3 PM or later                                ││
│ └───────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
│ Service │ Nov 15, 2025 │ 2hr │ $75 │ 10% │ $135.00 │ 🗑️│
```

### **Service Item with Exact Time:**

```
┌──────────────────────────────────────────────────────────┐
│ Assessment & Report                                       │
│ 🔵 Service  📋 GST (10%)                                 │
│                                                           │
│ ┌───────────────────────────────────────────────────────┐│
│ │ 📝 Comprehensive assessment required                  ││
│ └───────────────────────────────────────────────────────┘│
│ ─────────────────────────────────────────────────────────│
│ 📅 Preferred Schedule                                    │
│ ┌─────────────────────┬─────────────────────┐           │
│ │ ▼ Exact Time        │ [14:00]             │           │
│ │                     │                     │           │
│ └─────────────────────┴─────────────────────┘           │
│ ┌───────────────────────────────────────────────────────┐│
│ │ Must be exactly 2 PM                                 ││
│ └───────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
│ Service │ Nov 16, 2025 │ 1   │ $120 │ 0%  │ $120.00 │ 🗑️│
```

---

## 💡 Use Cases

### **Use Case 1: Multiple Services, Different Times**
```
Customer: Alice Anderson
Services:
1. One-on-One Tutoring - Math
   - Date: Nov 15, 2025
   - Time: Morning (9 AM preferred)
   - Notes: "Student is most alert in morning"

2. Assessment & Report
   - Date: Nov 16, 2025
   - Time: Afternoon (2 PM exact)
   - Notes: "Parents will be present"

3. Small Group Tutoring
   - Date: Nov 17, 2025
   - Time: Evening (6 PM)
   - Notes: "After school hours"
```

### **Use Case 2: Flexible Scheduling**
```
Service: Educational Counseling
- Date: Nov 20, 2025
- Time: Flexible
- Notes: "Any time works, customer is available all day"
```

### **Use Case 3: Recurring Service**
```
Service: One-on-One Tutoring - English
- Date: Nov 15, 2025 (first session)
- Time: Afternoon (3-5 PM)
- Notes: "Weekly recurring, same time every week"
```

### **Use Case 4: Product (No Schedule)**
```
Product: Study Materials Package
- Date: Nov 20, 2025 (delivery date)
- No schedule fields shown
- Notes: "Deliver to reception desk"
```

---

## 🔄 Workflow

```
1. Add Service to Quote
   ↓
2. Service Item Appears with Schedule Section
   ↓
3. Fill Schedule Details:
   - Select time slot (Morning/Afternoon/Evening/Flexible/Exact)
   - If Exact: Enter specific time
   - Add schedule notes
   ↓
4. Repeat for Each Service
   ↓
5. Create Quote
   ↓
6. Quote Data Includes Schedule Per Service:
   {
     items: [
       {
         name: 'Tutoring - Math',
         serviceDate: '2025-11-15',
         preferredTime: 'morning',
         scheduleNotes: 'Student prefers 9 AM'
       },
       {
         name: 'Assessment',
         serviceDate: '2025-11-16',
         preferredTime: 'exact',
         exactTime: '14:00',
         scheduleNotes: 'Parents will attend'
       }
     ]
   }
```

---

## ✨ Benefits

### **1. Flexibility**
- ✅ Different services can have different schedules
- ✅ Accommodates complex booking scenarios
- ✅ Better resource planning

### **2. Clarity**
- ✅ Clear scheduling per service
- ✅ No confusion about which service is when
- ✅ Better communication with staff

### **3. Accuracy**
- ✅ Precise scheduling information
- ✅ Reduces scheduling conflicts
- ✅ Easier work order conversion

### **4. Professional**
- ✅ Detailed service planning
- ✅ Shows attention to detail
- ✅ Better customer experience

---

## 📋 Field Descriptions

### **Preferred Time:**
- **Morning:** 8 AM - 12 PM
- **Afternoon:** 12 PM - 5 PM
- **Evening:** 5 PM - 8 PM
- **Flexible:** Any time works
- **Exact Time:** Specific time required

### **Exact Time:**
- Only shown when "Exact Time" is selected
- 24-hour time picker
- Example: 14:00 = 2:00 PM

### **Schedule Notes:**
- Additional scheduling requirements
- Timing preferences
- Special instructions
- Recurring schedule details

---

## 🎯 Key Points

1. **Service-Specific**
   - Schedule fields only appear for service items
   - Products don't have schedule fields

2. **Per-Item Scheduling**
   - Each service has its own schedule
   - Independent from other services

3. **Flexible Options**
   - Time slots for general preferences
   - Exact time for specific requirements
   - Notes for additional details

4. **Automatic Show/Hide**
   - Exact time field appears only when needed
   - Clean, uncluttered interface

---

## ✅ Summary

**Changed:**
- ❌ Removed: Global preferred schedule in customer section
- ✅ Added: Per-service schedule in quote line items

**Features:**
- 📅 Time slot selector (Morning/Afternoon/Evening/Flexible/Exact)
- ⏰ Exact time picker (when needed)
- 📝 Schedule notes per service
- 🎯 Service-only (not for products)

**Benefits:**
- 🔄 Multiple services with different schedules
- ✅ More accurate scheduling
- 💼 Better resource planning
- 🎨 Cleaner, more organized

**Result:** Flexible, per-service scheduling that accommodates complex booking scenarios! 🚀

---

**Updated:** November 4, 2025  
**Status:** ✅ Complete and Ready for Use
