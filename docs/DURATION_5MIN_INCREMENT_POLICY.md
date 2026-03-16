# Duration Increment Policy: 5-Minute Blocks

## Recommendation: **5-Minute Increments** ⭐

Restrict all duration inputs to **5-minute blocks**: 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60...

---

## Why 5-Minute Increments?

### ✅ **Advantages:**

1. **Simple & Practical**
   - Easy for users to select: 1h 10m, 1h 15m, 1h 20m
   - Matches common time picker increments
   - Realistic for session planning

2. **Accurate Enough**
   - 5-minute precision = 0.0833 hours
   - At $25/hour: 5 min = $2.08 difference
   - Acceptable margin of error for most businesses

3. **Clean Calculations**
   - Converts to clean decimals
   - No confusing values like 1.1666...
   - Easy to verify manually

4. **User-Friendly**
   - Dropdown/picker shows: 1h 00m, 1h 05m, 1h 10m, 1h 15m...
   - No need to type decimals
   - Reduces input errors

5. **Industry Standard**
   - Many scheduling systems use 5-min increments
   - Calendar apps default to 5-min blocks
   - Familiar to users

---

## Conversion Table: 5-Minute Increments

| Minutes | Hours (Decimal) | Display | Use Case |
|---------|----------------|---------|----------|
| 0 min   | 0.00 h         | `"0m"` | - |
| 5 min   | 0.08 h         | `"5m"` | Very short task |
| 10 min  | 0.17 h         | `"10m"` | Quick check-in |
| 15 min  | 0.25 h         | `"15m"` | Brief meeting |
| 20 min  | 0.33 h         | `"20m"` | Short session |
| 25 min  | 0.42 h         | `"25m"` | - |
| 30 min  | 0.50 h         | `"30m"` | Half hour |
| 35 min  | 0.58 h         | `"35m"` | - |
| 40 min  | 0.67 h         | `"40m"` | - |
| 45 min  | 0.75 h         | `"45m"` | Three-quarters |
| 50 min  | 0.83 h         | `"50m"` | - |
| 55 min  | 0.92 h         | `"55m"` | - |
| 60 min  | 1.00 h         | `"1h"` | One hour |
| 65 min  | 1.08 h         | `"1h 05m"` | - |
| 70 min  | 1.17 h         | `"1h 10m"` | - |
| 75 min  | 1.25 h         | `"1h 15m"` | - |
| 90 min  | 1.50 h         | `"1h 30m"` | Standard class |
| 120 min | 2.00 h         | `"2h"` | Two hours |
| 150 min | 2.50 h         | `"2h 30m"` | Extended session |
| 180 min | 3.00 h         | `"3h"` | Three hours |

---

## Implementation

### **1. Input Validation**

```javascript
function validateDuration(minutes) {
  // Must be a multiple of 5
  if (minutes % 5 !== 0) {
    return "Duration must be in 5-minute increments (0, 5, 10, 15, 20, 25...)";
  }
  
  // Minimum 5 minutes
  if (minutes < 5) {
    return "Duration must be at least 5 minutes";
  }
  
  // Maximum 12 hours (720 minutes)
  if (minutes > 720) {
    return "Duration cannot exceed 12 hours";
  }
  
  return null; // Valid
}

// Examples
validateDuration(70);   // Valid ✅
validateDuration(72);   // Invalid: "Duration must be in 5-minute increments"
validateDuration(75);   // Valid ✅
validateDuration(3);    // Invalid: "Duration must be at least 5 minutes"
```

### **2. Auto-Rounding Function**

```javascript
function roundToNearest5Minutes(minutes) {
  return Math.round(minutes / 5) * 5;
}

// Examples
roundToNearest5Minutes(67);  // 65 minutes
roundToNearest5Minutes(68);  // 70 minutes
roundToNearest5Minutes(72);  // 70 minutes
roundToNearest5Minutes(73);  // 75 minutes
```

### **3. Time Picker with 5-Min Increments**

```html
<!-- Duration Picker -->
<div class="duration-picker">
  <label>Duration</label>
  <div class="flex gap-2">
    <!-- Hours -->
    <select id="durationHours" class="form-select">
      <option value="0">0h</option>
      <option value="1">1h</option>
      <option value="2">2h</option>
      <option value="3">3h</option>
      <option value="4">4h</option>
      <option value="5">5h</option>
      <option value="6">6h</option>
      <option value="7">7h</option>
      <option value="8">8h</option>
      <option value="9">9h</option>
      <option value="10">10h</option>
      <option value="11">11h</option>
      <option value="12">12h</option>
    </select>
    
    <!-- Minutes (5-min increments) -->
    <select id="durationMinutes" class="form-select">
      <option value="0">00m</option>
      <option value="5">05m</option>
      <option value="10">10m</option>
      <option value="15">15m</option>
      <option value="20">20m</option>
      <option value="25">25m</option>
      <option value="30">30m</option>
      <option value="35">35m</option>
      <option value="40">40m</option>
      <option value="45">45m</option>
      <option value="50">50m</option>
      <option value="55">55m</option>
    </select>
  </div>
</div>
```

```javascript
// Get total minutes
function getTotalMinutes() {
  const hours = parseInt(document.getElementById('durationHours').value);
  const minutes = parseInt(document.getElementById('durationMinutes').value);
  return (hours * 60) + minutes;
}

// Example: 1h 10m = 70 minutes
```

### **4. Start/End Time Picker (Auto-Round)**

```javascript
function calculateDuration(startTime, endTime) {
  // Calculate exact minutes
  const start = parseTime(startTime);  // e.g., "09:00"
  const end = parseTime(endTime);      // e.g., "10:12"
  
  const exactMinutes = (end - start) / (1000 * 60);  // 72 minutes
  
  // Round to nearest 5 minutes
  const roundedMinutes = roundToNearest5Minutes(exactMinutes);  // 70 minutes
  
  return {
    exactMinutes: exactMinutes,      // 72
    roundedMinutes: roundedMinutes,  // 70
    hours: roundedMinutes / 60       // 1.17 (1h 10m)
  };
}

// Example
const duration = calculateDuration("09:00", "10:12");
// {
//   exactMinutes: 72,
//   roundedMinutes: 70,
//   hours: 1.1666... (store as 1.17)
// }
```

---

## Storage Format

### **Database Schema:**

```javascript
{
  // Store in minutes (integer)
  durationMinutes: 70,  // Always a multiple of 5
  
  // Store in hours (decimal, 2 places)
  durationHours: 1.17,  // 70 / 60 = 1.1666... → 1.17
  
  // For display
  durationDisplay: "1h 10m"
}
```

### **Conversion Functions:**

```javascript
// Minutes to Hours (2 decimal places)
function minutesToHours(minutes) {
  return Math.round((minutes / 60) * 100) / 100;
}

// Hours to Minutes
function hoursToMinutes(hours) {
  return Math.round(hours * 60);
}

// Format for Display
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

// Examples
minutesToHours(70);      // 1.17
hoursToMinutes(1.17);    // 70
formatDuration(70);      // "1h 10m"
formatDuration(120);     // "2h"
formatDuration(45);      // "45m"
```

---

## Payroll Calculation

### **With 5-Minute Increments:**

```javascript
function calculatePayment(durationMinutes, hourlyRate) {
  // Validate: must be multiple of 5
  if (durationMinutes % 5 !== 0) {
    throw new Error("Duration must be in 5-minute increments");
  }
  
  // Convert to hours (precise)
  const hours = durationMinutes / 60;
  
  // Calculate payment
  const grossPay = hours * hourlyRate;
  
  // Round to cents
  const netPay = Math.round(grossPay * 100) / 100;
  
  return {
    minutes: durationMinutes,
    hours: hours,
    rate: hourlyRate,
    grossPay: grossPay,
    netPay: netPay
  };
}

// Examples
calculatePayment(70, 25);
// {
//   minutes: 70,
//   hours: 1.1666666666666667,
//   rate: 25,
//   grossPay: 29.166666666666668,
//   netPay: 29.17
// }

calculatePayment(75, 25);
// {
//   minutes: 75,
//   hours: 1.25,
//   rate: 25,
//   grossPay: 31.25,
//   netPay: 31.25
// }
```

---

## UI/UX Examples

### **Session Creation Form:**

```
┌─────────────────────────────────────┐
│ Create Session                      │
├─────────────────────────────────────┤
│                                     │
│ Start Time:  [09:00] ▼             │
│ End Time:    [10:10] ▼             │
│                                     │
│ Duration:    1h 10m (auto-calc)    │
│                                     │
│ OR manually set:                    │
│ Duration:    [1h] ▼ [10m] ▼        │
│              (5-min increments)     │
│                                     │
└─────────────────────────────────────┘
```

### **Timesheet Entry:**

```
┌─────────────────────────────────────┐
│ Timesheet Entry                     │
├─────────────────────────────────────┤
│ Session: Advanced Excel Training   │
│ Date: Jan 15, 2026                 │
│                                     │
│ Estimated: 1h 30m                  │
│ Actual:    [1h] ▼ [10m] ▼          │
│            (Worked 1h 10m)         │
│                                     │
│ Hourly Rate: $25.00                │
│ Total Pay:   $29.17                │
│                                     │
└─────────────────────────────────────┘
```

---

## Comparison: Different Increment Options

| Increment | Precision | Ease of Use | Payroll Impact | Recommendation |
|-----------|-----------|-------------|----------------|----------------|
| **1 minute** | Highest | Complex | Minimal | Overkill for most businesses |
| **5 minutes** ⭐ | High | Easy | Very small | **RECOMMENDED** |
| **6 minutes** | Medium | Moderate | Small | Common in US (1/10 hour) |
| **15 minutes** | Low | Very easy | Moderate | Too coarse for accurate tracking |
| **30 minutes** | Very low | Very easy | High | Not recommended (too inaccurate) |

### **5-Minute Increment Impact:**

At $25/hour:
- 5 minutes = $2.08
- Maximum rounding error: ±2.5 minutes = ±$1.04
- Over 100 sessions: ±$104/month (acceptable for most businesses)

---

## Business Rules

### **Rule 1: All Durations Must Be Multiples of 5**
```javascript
// Valid
70 minutes ✅
75 minutes ✅
90 minutes ✅

// Invalid
72 minutes ❌ (round to 70 or 75)
68 minutes ❌ (round to 70)
```

### **Rule 2: Auto-Round When Calculated from Time**
```javascript
// User selects: 09:00 to 10:12
// Exact duration: 72 minutes
// Auto-round to: 70 minutes (nearest 5-min increment)
// Display: "1h 10m"
```

### **Rule 3: Dropdowns Only Show 5-Min Options**
```javascript
// Minutes dropdown shows:
[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

// NOT:
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...]
```

---

## Summary

### ✅ **RECOMMENDED: 5-Minute Increments**

**Allowed values:** 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75...

**Benefits:**
- ✅ Simple and practical
- ✅ Accurate enough for payroll
- ✅ User-friendly (dropdown selection)
- ✅ Industry standard
- ✅ Clean calculations
- ✅ Reduces input errors

**Implementation:**
1. **Input**: Dropdown with 5-min increments
2. **Storage**: Store as minutes (integer) and hours (decimal)
3. **Validation**: Reject non-multiples of 5
4. **Auto-round**: When calculated from start/end time
5. **Display**: Show as "1h 10m" format

**Example:**
- Duration: **70 minutes** (1h 10m)
- Hours: **1.17** (70 ÷ 60)
- Rate: **$25/hour**
- Payment: **$29.17** (1.17 × 25)

This gives you the perfect balance of accuracy and simplicity! 🎯
