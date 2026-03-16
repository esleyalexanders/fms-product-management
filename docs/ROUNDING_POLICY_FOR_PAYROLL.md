# Rounding Policy for Payroll Calculation

## Question
Should we round duration values? How does it affect the hourly rate calculation?

## Answer: **DON'T ROUND - Use Precise Values** ✅

---

## The Problem with Rounding

### **Example: 70 Minutes Session**

| Approach | Duration | Hourly Rate | Calculation | Total Pay | Difference |
|----------|----------|-------------|-------------|-----------|------------|
| **No Rounding** | 1.1667 hours | $25/hour | 1.1667 × $25 | **$29.17** | Baseline |
| **Round to 2 decimals** | 1.17 hours | $25/hour | 1.17 × $25 | **$29.25** | +$0.08 |
| **Round to 1 decimal** | 1.2 hours | $25/hour | 1.2 × $25 | **$30.00** | +$0.83 |
| **Round to nearest 0.5** | 1.0 hours | $25/hour | 1.0 × $25 | **$25.00** | -$4.17 ❌ |

### **Impact Over Time:**

If you have **100 sessions per month** with similar rounding:
- Rounding to 2 decimals: **+$8/month** overpayment
- Rounding to 1 decimal: **+$83/month** overpayment
- Rounding to 0.5 hours: **-$417/month** underpayment ⚠️

---

## Recommended Approach

### **Option 1: NO ROUNDING (Store Precise Hours)** ⭐ **RECOMMENDED**

#### **Storage:**
```javascript
// Store exact decimal hours
const minutes = 70;
const hours = minutes / 60;  // 1.16666666...

// Store with full precision (or limit to 4 decimals for database)
session.duration = 1.1667;  // 4 decimal places = ~0.36 seconds precision
```

#### **Calculation:**
```javascript
// Use precise hours for payroll
const hours = 1.1667;
const rate = 25;
const totalPay = hours * rate;  // 29.1675

// Round ONLY the final payment amount (not the hours)
const finalPay = Math.round(totalPay * 100) / 100;  // $29.17
```

#### **Advantages:**
- ✅ Most accurate
- ✅ Fair to both employer and employee
- ✅ Complies with labor laws (pay for actual time worked)
- ✅ Audit-friendly (can trace exact calculations)

#### **Display:**
```javascript
// For display, show human-readable format
formatHours(1.1667);  // "1h 10m"

// For payroll reports, show precise hours
1.1667 hours × $25/hour = $29.17
```

---

### **Option 2: Round to Nearest Minute (2 Decimal Places)**

#### **Storage:**
```javascript
const minutes = 70;
const hours = minutes / 60;  // 1.16666...
const rounded = Math.round(hours * 100) / 100;  // 1.17 hours
```

#### **Impact:**
- Small rounding error: **±$0.25 per session** (at $25/hour)
- Over 100 sessions: **±$25/month** variance
- Generally acceptable for most businesses

---

### **Option 3: Round to Nearest 6 Minutes (0.1 hours)** ⚠️

Many companies use **6-minute rounding** (1/10th of an hour) for timekeeping:

#### **Rounding Table:**
| Actual Minutes | Rounds To | Hours |
|----------------|-----------|-------|
| 0-3 min | 0 min | 0.0 |
| 4-9 min | 6 min | 0.1 |
| 10-15 min | 12 min | 0.2 |
| 16-21 min | 18 min | 0.3 |
| ... | ... | ... |
| 67-72 min | 72 min | 1.2 |

#### **Example:**
```javascript
function roundToSixMinutes(hours) {
  // Convert to minutes, round to nearest 6, convert back
  const minutes = hours * 60;
  const roundedMinutes = Math.round(minutes / 6) * 6;
  return roundedMinutes / 60;
}

roundToSixMinutes(1.1667);  // 70 min → 72 min → 1.2 hours
// Payment: 1.2 × $25 = $30.00 (vs actual $29.17)
```

#### **Considerations:**
- ⚠️ Can favor employer or employee depending on actual time
- ⚠️ Must be applied consistently (legal requirement)
- ⚠️ May cause disputes if not clearly communicated

---

## Recommended Implementation

### **Store Precise, Round Display & Payment**

```javascript
// 1. STORAGE: Store precise hours (4 decimal places)
const timesheet = {
  sessionId: "SESSION-001",
  staffId: "STAFF-001",
  startTime: "09:00",
  endTime: "10:10",
  
  // Store precise duration
  durationMinutes: 70,
  durationHours: 1.1667,  // Precise value
  
  hourlyRate: 25.00,
  
  // Calculate payment from precise hours
  grossPay: 29.1675,  // 1.1667 × 25
  
  // Round only the final payment
  netPay: 29.17,  // Rounded to cents
  
  status: "approved"
};
```

```javascript
// 2. CALCULATION FUNCTION
function calculatePayment(durationMinutes, hourlyRate) {
  // Convert to precise hours
  const hours = durationMinutes / 60;
  
  // Calculate gross pay (don't round hours!)
  const grossPay = hours * hourlyRate;
  
  // Round only the final payment to 2 decimals (cents)
  const netPay = Math.round(grossPay * 100) / 100;
  
  return {
    hours: hours,  // Store precise: 1.1667
    grossPay: grossPay,  // Store precise: 29.1675
    netPay: netPay  // Rounded: 29.17
  };
}

// Example
const result = calculatePayment(70, 25);
console.log(result);
// {
//   hours: 1.1666666666666667,
//   grossPay: 29.166666666666668,
//   netPay: 29.17
// }
```

```javascript
// 3. DISPLAY FUNCTION
function formatPayrollLine(timesheet) {
  return {
    duration: formatHours(timesheet.durationHours),  // "1h 10m"
    rate: `$${timesheet.hourlyRate.toFixed(2)}`,  // "$25.00"
    calculation: `${timesheet.durationHours.toFixed(4)} × $${timesheet.hourlyRate}`,  // "1.1667 × $25"
    payment: `$${timesheet.netPay.toFixed(2)}`  // "$29.17"
  };
}
```

---

## Database Schema

### **Recommended Fields:**

```sql
CREATE TABLE timesheet_entries (
  id VARCHAR(50) PRIMARY KEY,
  session_id VARCHAR(50),
  staff_id VARCHAR(50),
  
  -- Time tracking (precise)
  start_time TIME,
  end_time TIME,
  duration_minutes INT,  -- Store exact minutes: 70
  duration_hours DECIMAL(10, 4),  -- Store precise hours: 1.1667
  
  -- Estimated vs Actual
  estimated_hours DECIMAL(10, 4),
  actual_hours DECIMAL(10, 4),
  final_hours DECIMAL(10, 4),  -- Manager-approved
  
  -- Payment calculation
  hourly_rate DECIMAL(10, 2),  -- $25.00
  gross_pay DECIMAL(10, 4),  -- Precise: 29.1675
  net_pay DECIMAL(10, 2),  -- Rounded: 29.17
  
  status VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Business Rules

### **Rule 1: Never Round Hours Before Calculation**
```javascript
// ❌ WRONG - Rounds hours first
const roundedHours = Math.round(1.1667 * 10) / 10;  // 1.2
const payment = roundedHours * 25;  // $30.00 (overpaid by $0.83)

// ✅ CORRECT - Use precise hours
const payment = 1.1667 * 25;  // $29.1675
const finalPayment = Math.round(payment * 100) / 100;  // $29.17
```

### **Rule 2: Round Only the Final Payment Amount**
```javascript
// Calculate with precision
const hours = 1.1667;
const rate = 25.00;
const grossPay = hours * rate;  // 29.1675

// Round to cents (2 decimal places)
const netPay = Math.round(grossPay * 100) / 100;  // 29.17
```

### **Rule 3: Store Both Precise and Rounded Values**
```javascript
{
  durationHours: 1.1667,  // For audit trail
  grossPay: 29.1675,      // For verification
  netPay: 29.17           // For payment
}
```

---

## Legal Considerations

### **Fair Labor Standards Act (FLSA) - US**
- Employers must pay for **all time worked**
- Rounding is allowed if it **doesn't consistently favor the employer**
- Common practice: Round to nearest 1/10th hour (6 minutes)
- Must be applied **consistently** to all employees

### **Recommendation:**
1. **Store precise hours** (no rounding)
2. **Calculate payment** from precise hours
3. **Round only the final payment** to cents
4. **Document the policy** clearly
5. **Apply consistently** to all staff

---

## Display Examples

### **Timesheet Detail View:**
```
Session: Advanced Excel Training
Date: January 15, 2026
Time: 09:00 - 10:10

Duration: 1h 10m (1.1667 hours)
Hourly Rate: $25.00/hour
Calculation: 1.1667 × $25.00 = $29.17
Total Payment: $29.17
```

### **Payroll Summary:**
```
Staff: John Doe
Period: January 1-31, 2026

Total Hours: 87.3333 hours
Hourly Rate: $25.00/hour
Gross Pay: $2,183.33
Deductions: $218.33
Net Pay: $1,965.00
```

---

## Summary & Recommendation

### ✅ **RECOMMENDED APPROACH:**

1. **Store**: Precise hours (4 decimal places) → `1.1667`
2. **Calculate**: Use precise hours → `1.1667 × $25 = $29.1675`
3. **Round**: Only the final payment → `$29.17`
4. **Display**: Human-readable format → `"1h 10m"`

### 🎯 **Benefits:**
- ✅ Accurate payroll
- ✅ Fair to employees
- ✅ Legally compliant
- ✅ Audit-friendly
- ✅ No cumulative rounding errors

### ⚠️ **DON'T:**
- ❌ Round hours before calculation
- ❌ Use 30-minute increments (too coarse)
- ❌ Round inconsistently
- ❌ Favor employer over employee

### 📊 **Impact:**
- **70 minutes** = 1.1667 hours × $25/hour = **$29.17** ✅
- **NOT** 1.2 hours × $25/hour = $30.00 (overpaid)
- **NOT** 1.0 hours × $25/hour = $25.00 (underpaid)

**Bottom line: Store precise, calculate precise, round only the final payment amount!**
