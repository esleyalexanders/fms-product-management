# Duration Calculation Standard Across System

## Question
Should the duration be calculated in **hours** for Learning Services, Sessions, and Timesheets?

## Answer: YES ✅

**All duration calculations across the system should use HOURS as the standard unit.**

---

## Current Implementation Analysis

### ✅ **Already Using Hours:**

#### 1. **Timesheets** 
- **Unit**: Hours (decimal format)
- **Fields**:
  - `estimatedHours` - Planned hours for the job
  - `actualHours` - Staff-reported hours worked
  - `finalHours` - Manager-approved hours (used for payroll)
- **Display Format**: `"24.5h"` or `"24h 30m"`
- **Calculation Priority**:
  ```
  finalHours → actualHours → estimatedHours
  ```

#### 2. **Sessions**
- **Unit**: Hours (calculated from time range)
- **Field**: `duration` (displayed as read-only)
- **Calculation**: Automatically computed from `startTime` and `endTime`
- **Example**: 
  - Start: 09:00 AM
  - End: 11:30 AM
  - Duration: **2.5 hours**

---

### ⚠️ **Inconsistency Found:**

#### 3. **Learning Services** (Some legacy files)
- **Issue**: Some old product files use **minutes** instead of hours
- **Example**: `add-product.html` has "Duration (minutes)" field
- **Impact**: Creates confusion and requires conversion

---

## Recommended Standard

### **Universal Duration Unit: HOURS**

| Module | Field Name | Data Type | Display Format | Notes |
|--------|-----------|-----------|----------------|-------|
| **Learning Service** | `estimatedDuration` | Decimal | `"2.5h"` or `"2h 30m"` | Estimated duration per session |
| **Session** | `duration` | Decimal | `"2.5h"` or `"2h 30m"` | Auto-calculated from start/end time |
| **Timesheet** | `estimatedHours` | Decimal | `"2.5h"` | Inherited from session |
| **Timesheet** | `actualHours` | Decimal | `"2.5h"` | Staff-reported actual time |
| **Timesheet** | `finalHours` | Decimal | `"2.5h"` | Manager-approved (for payroll) |

---

## Business Logic Flow

### **1. Learning Service Creation**
```
User inputs: Estimated Duration = 2.5 hours
↓
Stored as: estimatedDuration = 2.5
↓
Used for: Session planning and timesheet estimation
```

### **2. Session Creation**
```
User selects: Start Time = 09:00, End Time = 11:30
↓
System calculates: duration = 2.5 hours
↓
Inherits from Learning Service: estimatedDuration = 2.5 hours
↓
Creates timesheet entry with: estimatedHours = 2.5
```

### **3. Timesheet Completion**
```
Staff completes session
↓
Staff reports: actualHours = 3.0 (took longer than expected)
↓
Manager reviews and adjusts: finalHours = 2.5 (approves only estimated time)
↓
Payroll uses: finalHours = 2.5 for payment calculation
```

---

## Why Hours (Not Minutes)?

### ✅ **Advantages of Hours:**

1. **Payroll Compatibility**
   - Hourly rates are standard ($25/hour)
   - Direct multiplication: `hours × rate = pay`
   - No conversion needed

2. **Business Communication**
   - Managers think in hours: "This job takes 2.5 hours"
   - Easier to estimate and plan
   - Industry standard for professional services

3. **Decimal Precision**
   - 2.5 hours is clearer than 150 minutes
   - Supports half-hour increments (0.5)
   - Easy to aggregate: 2.5 + 3.0 + 1.5 = 7.0 hours

4. **Consistency Across Modules**
   - Learning Services → Sessions → Timesheets all use same unit
   - No conversion errors
   - Simpler data model

### ❌ **Problems with Minutes:**

1. Requires conversion for payroll (150 min ÷ 60 = 2.5 hours)
2. Less intuitive for business users
3. Larger numbers (150 vs 2.5)
4. Inconsistent with industry standards

---

## Data Model Alignment

### **Learning Service**
```javascript
{
  id: "LS-001",
  name: "Advanced Excel Training",
  type: "class",
  estimatedDuration: 2.5,  // hours
  schedule: "weekly",
  // ...
}
```

### **Session**
```javascript
{
  id: "SESSION-001",
  learningServiceId: "LS-001",
  date: "2026-01-15",
  startTime: "09:00",
  endTime: "11:30",
  duration: 2.5,  // hours (auto-calculated)
  status: "scheduled",
  // ...
}
```

### **Timesheet Entry**
```javascript
{
  id: "TS-001",
  sessionId: "SESSION-001",
  staffId: "STAFF-001",
  date: "2026-01-15",
  estimatedHours: 2.5,  // from session
  actualHours: 3.0,     // staff-reported
  finalHours: 2.5,      // manager-approved
  hourlyRate: 25,
  totalPay: 62.50,      // finalHours × hourlyRate
  status: "approved",
  // ...
}
```

---

## Display Format Recommendations

### **Option 1: Decimal Hours** (Recommended for calculations)
- Format: `"2.5h"`
- Use case: Stats, totals, payroll
- Example: "Total Hours: 24.5h"

### **Option 2: Hours and Minutes** (Recommended for user input/display)
- Format: `"2h 30m"`
- Use case: Session details, human-readable displays
- Example: "Duration: 2h 30m"

### **Conversion Helper Function**
```javascript
function formatHours(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

// Examples:
formatHours(2.5)  // "2h 30m"
formatHours(3.0)  // "3h"
formatHours(1.75) // "1h 45m"
```

---

## Migration Plan (If Needed)

### **For Legacy Files Using Minutes:**

1. **Identify all files** with "duration (minutes)" fields
2. **Convert data**:
   ```javascript
   const hours = minutes / 60;
   ```
3. **Update UI labels** from "minutes" to "hours"
4. **Update validation** to accept decimal hours (0.5 increments)
5. **Test calculations** end-to-end

---

## Validation Rules

### **Hours Input Validation:**
- **Minimum**: 0.1 hours (6 minutes) - allows flexibility for short tasks
- **Maximum**: 12 hours (single session limit)
- **Increment**: Any decimal value (system supports precise tracking)
- **Format**: Decimal number with up to 2 decimal places (e.g., 1.17, 2.5, 3.0)
- **Precision**: Rounded to nearest minute (0.02 hours = ~1 minute)

### **Common Duration Examples:**

| Minutes | Hours (Decimal) | Display Format | Use Case |
|---------|----------------|----------------|----------|
| 30 min  | 0.5 h          | `"0.5h"` or `"30m"` | Short meeting |
| 45 min  | 0.75 h         | `"0.75h"` or `"45m"` | Quick session |
| **70 min** | **1.17 h** | **`"1.17h"` or `"1h 10m"`** | **Actual session time** |
| 90 min  | 1.5 h          | `"1.5h"` or `"1h 30m"` | Standard class |
| 2 hrs   | 2.0 h          | `"2h"` | Standard session |
| 2.5 hrs | 2.5 h          | `"2.5h"` or `"2h 30m"` | Extended session |
| 3 hrs   | 3.0 h          | `"3h"` | Long workshop |

### **Conversion Formula:**
```javascript
// Minutes to Hours
const hours = minutes / 60;

// Examples:
70 minutes → 70 / 60 = 1.1666... → 1.17 hours (rounded to 2 decimals)
45 minutes → 45 / 60 = 0.75 hours
90 minutes → 90 / 60 = 1.5 hours
```

### **Example Validation (Flexible):**
```javascript
function validateDuration(hours) {
  // Allow any positive duration up to 12 hours
  if (hours <= 0) {
    return "Duration must be greater than 0";
  }
  if (hours > 12) {
    return "Duration cannot exceed 12 hours for a single session";
  }
  // Round to 2 decimal places for consistency
  const rounded = Math.round(hours * 100) / 100;
  if (rounded !== hours) {
    return `Duration rounded to ${rounded} hours for precision`;
  }
  return null; // Valid
}

// Examples:
validateDuration(1.17)  // Valid (70 minutes)
validateDuration(0.75)  // Valid (45 minutes)
validateDuration(2.5)   // Valid (2h 30m)
validateDuration(0)     // Invalid: "Duration must be greater than 0"
validateDuration(15)    // Invalid: "Duration cannot exceed 12 hours"
```

### **Recommended Input Approach:**

#### **Option 1: Time Picker (Start/End Time)**
- User selects: Start = 09:00, End = 10:10
- System calculates: 70 minutes = 1.17 hours
- **Advantage**: Most accurate, no manual calculation

#### **Option 2: Duration Input (Hours + Minutes)**
- User inputs: 1 hour, 10 minutes
- System converts: (1 × 60 + 10) / 60 = 1.17 hours
- **Advantage**: Intuitive for users

#### **Option 3: Direct Decimal Input**
- User inputs: 1.17
- System accepts: 1.17 hours
- **Advantage**: Fast for power users

---

## Summary

### ✅ **Decision: Use HOURS everywhere**

1. **Learning Services**: Store `estimatedDuration` in hours
2. **Sessions**: Calculate and display `duration` in hours
3. **Timesheets**: Use hours for all fields (`estimatedHours`, `actualHours`, `finalHours`)
4. **Payroll**: Calculate directly: `finalHours × hourlyRate`
5. **Display**: Show as `"2.5h"` or `"2h 30m"` based on context

### 🎯 **Benefits:**
- ✅ Consistent across all modules
- ✅ No conversion errors
- ✅ Payroll-ready
- ✅ Industry standard
- ✅ Business-friendly
- ✅ Simpler calculations

### 📋 **Action Items:**
1. Audit all duration fields in the codebase
2. Convert any minute-based fields to hours
3. Update UI labels and placeholders
4. Standardize display format helper functions
5. Update documentation and training materials
