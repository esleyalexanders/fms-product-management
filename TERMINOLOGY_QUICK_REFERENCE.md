# Quick Reference Card - Official Terminology

**Print this and keep it handy while coding!**

---

## 🎯 Most Common Terms

| ✅ USE THIS | ❌ NOT THIS |
|------------|------------|
| **Customer** | Client, Buyer |
| **Staff** / **Staff Member** | Employee, Worker |
| **Franchisor** | Parent Company, Brand Owner |
| **Franchisee** | Franchise Owner, Operator |
| **Franchise** | Branch, Location (in franchise context) |
| **Learning Service** | Course, Program |
| **Session** | Class (for single occurrence), Meeting |
| **One-to-One** | 1-on-1, 1:1, Private |
| **Pricebook** | Price Book, Catalog |
| **Timesheet** | Time Sheet, Time Card |
| **Quote** | Estimate, Quotation |
| **Invoice** | Bill |
| **Job Title** | Position, Title |
| **Role** | Permission Level |
| **SKU** | Code, Product Code |
| **Max Capacity** | Maximum, Limit |
| **Fill Rate** | Occupancy, Utilization |
| **Enrollment** | Registration |
| **Duration** | Length, Time |
| **Estimated Hours** | Planned Hours |
| **Actual Hours** | Worked Hours |
| **Final Hours** | Billable Hours |

---

## 📊 Status Values

### Quote Status
```
Draft → Sent → Accepted/Declined → Converted
```

### Timesheet Status
```
Pending → Approved/Declined
```

### Learning Service Status
```
Active / Paused / Archived
```

### Staff Status
```
Active / Inactive
```

### Pricebook Item Status
```
Published / Draft
```

---

## 🏷️ Learning Service Types

```
Learning Service
├── Class (curriculum-based)
├── Group (multi-student, informal)
└── One-to-One (private tutoring)
```

**Each type has Sessions**

---

## ⏱️ Time Fields

| Field | Abbreviation | Usage |
|-------|--------------|-------|
| Estimated Hours | Est. Hrs | Planned time |
| Actual Hours | Act. Hrs | Time worked |
| Final Hours | (none) | Approved for payroll |
| Duration | (none) | Length of session |

---

## 👥 People Terms

| Term | When to Use |
|------|-------------|
| **Staff** | General reference to employees |
| **Staff Member** | Referring to individual |
| **Team** | Collective group |
| **Role** | Permission-based grouping |
| **Job Title** | Professional designation |

---

## 💰 Financial Terms

```
Quote → Invoice → Payment
```

**Payment Status:**
- Not Invoiced
- Partially Invoiced
- Invoiced Unpaid (or Unpaid)
- Partially Paid
- Fully Paid (or Paid)

---

## 📝 Capitalization

**Title Case:** Page titles, buttons, headers
- "Learning Service Details"
- "Create New Quote"

**Sentence case:** Descriptions, help text
- "Select a learning service type to continue"

**ALL CAPS:** Abbreviations only
- SKU, GST

---

## 🔗 Module Names (for navigation)

| Module | Label |
|--------|-------|
| Team Management | "Manage Team" |
| Pricebook | "My Pricebook" |
| Learning Services | "Learning Services" |
| Timesheets | "Timesheets" |
| Customers | "Customers" |

---

## ⚠️ Common Mistakes

### ❌ DON'T
```html
<h1>Price Book</h1>
<label>Employee Name:</label>
<span>1-on-1 Session</span>
<div>Time Sheet</div>
<button>Create Estimate</button>
```

### ✅ DO
```html
<h1>Pricebook</h1>
<label>Staff Member Name:</label>
<span>One-to-One Session</span>
<div>Timesheet</div>
<button>Create Quote</button>
```

---

## 🎨 UI Components

| Component | Official Name |
|-----------|---------------|
| Status indicator | Badge |
| Overlay window | Modal |
| Data filter | Filter |
| Text lookup | Search |
| Metric widget | Stat Card |

---

## 📏 Abbreviations (Approved)

- **Est. Hrs** - Estimated Hours
- **Act. Hrs** - Actual Hours
- **SKU** - Stock Keeping Unit
- **GST** - Goods and Services Tax

**Don't abbreviate:**
- Learning Service
- Customer
- Invoice

---

## 🔍 Quick Checks

Before committing code, verify:

- [ ] "Pricebook" is one word
- [ ] "Timesheet" is one word
- [ ] "One-to-One" is hyphenated
- [ ] Status values match glossary exactly
- [ ] "Staff" not "Employee"
- [ ] "Customer" not "Client"
- [ ] "Quote" not "Estimate"

---

## 📚 Full Documentation

See `OFFICIAL_GLOSSARY.md` for complete reference

---

**Version:** 1.0 | **Date:** Jan 12, 2026
