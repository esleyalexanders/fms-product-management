# Terminology Standardization Recommendations

**Version:** 1.0  
**Date:** January 12, 2026  
**Purpose:** Specific recommendations for updating HTML files to match the Official Glossary

---

## 📋 Executive Summary

This document provides actionable recommendations for standardizing terminology across all HTML files in the FMS Product Management System. Changes are prioritized by impact and module.

**Total Files Requiring Updates:** 47 files  
**Estimated Effort:** 3-5 days  
**Priority Modules:** Learning Services, Timesheet Manager, Team Management

---

## 🎯 Change Priority Matrix

| Priority | Module | Files Affected | Impact | Effort |
|----------|--------|----------------|--------|--------|
| **P0 - Critical** | Learning Services (v3) | 8 files | High | Medium |
| **P1 - High** | Timesheet Manager | 6 files | High | Low |
| **P2 - Medium** | Team Management | 6 files | Medium | Low |
| **P3 - Low** | Quotes & Invoices | 12 files | Low | Medium |
| **P4 - Future** | Legacy Modules | 15 files | Low | High |

---

## 🔴 P0 - CRITICAL PRIORITY

### Learning Services Module (service_job_v3)

These are the **current/official** production files and must be updated first.

#### 1. `learning_service_list.html`
**Current Issues:**
- ✅ Already using correct terms (well done!)

**Status:** ✓ No changes needed

---

#### 2. `learning_service_create.html`
**File:** `[v2] Jobs/service_job_v3/learning_service_create.html`

**Changes Needed:**
```html
<!-- FIND: Any instances of "Course" or "Program" -->
<!-- REPLACE WITH: "Learning Service" -->

<!-- FIND: "1-on-1" or "1:1" or "one on one" -->
<!-- REPLACE WITH: "One-to-One" -->

<!-- FIND: "Maximum" or "Max Students" -->
<!-- REPLACE WITH: "Max Capacity" -->
```

**Estimated Effort:** 30 minutes

---

#### 3. `learning_service_detail.html`
**File:** `[v2] Jobs/service_job_v3/learning_service_detail.html`

**Changes Needed:**
```html
<!-- FIND: "Enrolled" or "Registrations" -->
<!-- REPLACE WITH: "Enrollment" -->

<!-- FIND: "Occupancy" or "Utilization" -->
<!-- REPLACE WITH: "Fill Rate" -->
```

**Estimated Effort:** 30 minutes

---

#### 4. `session_list.html`
**File:** `[v2] Jobs/service_job_v3/session_list.html`

**Changes Needed:**
```html
<!-- FIND: "Class" when referring to individual session -->
<!-- REPLACE WITH: "Session" -->

<!-- FIND: "Appointment" or "Meeting" -->
<!-- REPLACE WITH: "Session" -->
```

**Estimated Effort:** 20 minutes

---

#### 5. `session_create.html` & `session_detail.html`
**Files:** 
- `[v2] Jobs/service_job_v3/session_create.html`
- `[v2] Jobs/service_job_v3/session_detail.html`

**Changes Needed:**
```html
<!-- FIND: "Length" or "Time" when referring to duration -->
<!-- REPLACE WITH: "Duration" -->

<!-- FIND: "Start Time" and "End Time" labels -->
<!-- KEEP AS IS (these are correct) -->
```

**Estimated Effort:** 20 minutes each

---

#### 6. `schedule_calendar.html` & `my_calendar.html`
**Files:**
- `[v2] Jobs/service_job_v3/schedule_calendar.html`
- `[v2] Jobs/service_job_v3/my_calendar.html`

**Changes Needed:**
```html
<!-- FIND: "Timetable" -->
<!-- REPLACE WITH: "Schedule" -->

<!-- VERIFY: Consistent use of "Session" not "Class" or "Event" -->
```

**Estimated Effort:** 30 minutes each

---

## 🟠 P1 - HIGH PRIORITY

### Timesheet Manager Module

#### 1. `timesheet_manager_inbox.html`
**File:** `Timesheet_manager/timesheet_manager_inbox.html`

**Current Issues Found:**
- Line 100: "Timesheet Manager" ✓ (Correct)
- Line 84: "Timesheets" ✓ (Correct)
- Line 88: "Staff Management" - Should this be "Manage Team"?

**Changes Needed:**
```html
<!-- LINE 88 -->
<!-- FIND: -->
<a href="#" class="nav-item"><i class="fas fa-users"></i><span>Staff Management</span></a>

<!-- REPLACE WITH: -->
<a href="../manage-team/manage-team.html" class="nav-item"><i class="fas fa-users"></i><span>Manage Team</span></a>

<!-- VERIFY: All status badges use "Pending", "Approved", "Declined" -->
<!-- VERIFY: Column headers use "Est / Act" and "Final Hrs" -->
```

**Estimated Effort:** 15 minutes

---

#### 2. `staff_view.html`
**File:** `Timesheet_manager/staff_view.html`

**Changes Needed:**
```html
<!-- VERIFY: Consistent use of "Staff" not "Employee" -->
<!-- VERIFY: Use "Timesheet" not "Time Sheet" -->
<!-- VERIFY: Status values are "Pending", "Approved", "Declined" -->
```

**Estimated Effort:** 15 minutes

---

#### 3. `staff-timesheet-detail.html`
**File:** `Timesheet_manager/staff-timesheet-detail.html`

**Changes Needed:**
```html
<!-- VERIFY: "Estimated Hours", "Actual Hours", "Final Hours" labels -->
<!-- VERIFY: Not using "Billable Hours" or "Worked Hours" -->
```

**Estimated Effort:** 15 minutes

---

#### 4. `staff-timesheets.html`
**File:** `Timesheet_manager/staff-timesheets.html`

**Changes Needed:**
```html
<!-- VERIFY: Consistent terminology -->
<!-- CHECK: Navigation links use correct module names -->
```

**Estimated Effort:** 10 minutes

---

#### 5. `timesheet_inbox.html` & `timesheet_overview.html`
**Files:**
- `Timesheet_manager/timesheet_inbox.html`
- `Timesheet_manager/timesheet_overview.html`

**Changes Needed:**
```html
<!-- VERIFY: All timesheet-related terms are consistent -->
<!-- CHECK: Status badges match official glossary -->
```

**Estimated Effort:** 10 minutes each

---

## 🟡 P2 - MEDIUM PRIORITY

### Team Management Module

#### 1. `manage-team.html`
**File:** `manage-team/manage-team.html`

**Current Issues Found:**
- Line 76: "Manage Team" ✓ (Correct)
- Line 80: "Add Staff" ✓ (Correct)
- Line 100: "Role" ✓ (Correct)
- Line 101: "Job Title" ✓ (Correct)

**Changes Needed:**
```html
<!-- VERIFY: Consistent use of "Staff" vs "Team Member" -->
<!-- Current usage is correct, but ensure consistency in any dynamic content -->

<!-- CHECK: Status values are "Active" / "Inactive" only -->
```

**Estimated Effort:** 10 minutes

---

#### 2. `manage-team-create.html`
**File:** `manage-team/manage-team-create.html`

**Changes Needed:**
```html
<!-- VERIFY: Form labels use "Staff Member" -->
<!-- VERIFY: "Job Title" field (not "Position" or "Title") -->
<!-- VERIFY: "Role" field for permissions -->
<!-- VERIFY: Status options are "Active" / "Inactive" -->
```

**Estimated Effort:** 15 minutes

---

#### 3. `manage-team-edit.html`
**File:** `manage-team/manage-team-edit.html`

**Changes Needed:**
```html
<!-- Same as manage-team-create.html -->
```

**Estimated Effort:** 15 minutes

---

#### 4. `manage-team-detail.html`
**File:** `manage-team/manage-team-detail.html`

**Changes Needed:**
```html
<!-- VERIFY: Display labels match glossary -->
<!-- VERIFY: "Job Title" and "Role" are distinct -->
```

**Estimated Effort:** 10 minutes

---

#### 5. `manage-team-roles.html`
**File:** `manage-team/manage-team-roles.html`

**Changes Needed:**
```html
<!-- VERIFY: "Role" terminology (not "Permission Level" or "Access Level") -->
<!-- VERIFY: Clear distinction between Role and Job Title -->
```

**Estimated Effort:** 15 minutes

---

#### 6. `manage-team-permission.html`
**File:** `manage-team/manage-team-permission.html`

**Changes Needed:**
```html
<!-- VERIFY: "Role Permissions" or "Permissions" -->
<!-- AVOID: "Access Rights", "Privileges" -->
```

**Estimated Effort:** 10 minutes

---

## 🟢 P3 - LOW PRIORITY

### Quotes & Invoices Module

#### 1. `quote_list_v2.html` (OFFICIAL VERSION)
**File:** `[v2] Quotes/quote_list_v2.html`

**Current Issues Found:**
- Line 296: "Quotes Management" ✓ (Correct)
- Line 313: "Create New Quote" ✓ (Correct)
- Status badges (lines 661-665): ✓ (Correct - Draft, Sent, Accepted, Declined, Converted)
- Payment status badges (lines 674-678): ✓ (Correct)

**Changes Needed:**
```html
<!-- VERIFY: All quote status values match glossary -->
<!-- VERIFY: All payment status values match glossary -->
<!-- Status appears correct, minimal changes needed -->
```

**Estimated Effort:** 10 minutes

---

#### 2. `quote_create.html`
**File:** `[v2] Quotes/quote_create.html`

**Changes Needed:**
```html
<!-- VERIFY: "Customer" not "Client" -->
<!-- VERIFY: "Pricebook" not "Price Book" or "Catalog" -->
<!-- VERIFY: "Quote" not "Estimate" or "Quotation" -->
```

**Estimated Effort:** 20 minutes

---

#### 3. `quote_edit.html`
**File:** `[v2] Quotes/quote_edit.html`

**Changes Needed:**
```html
<!-- Same as quote_create.html -->
```

**Estimated Effort:** 20 minutes

---

#### 4. `invoice_create.html` & `invoice_detail.html`
**Files:**
- `[v2] Quotes/invoice_create.html`
- `[v2] Quotes/invoice_detail.html`

**Changes Needed:**
```html
<!-- VERIFY: "Invoice" not "Bill" -->
<!-- VERIFY: "Customer" not "Client" -->
<!-- VERIFY: Payment status values match glossary -->
```

**Estimated Effort:** 15 minutes each

---

#### 5. Quote Simple Module (Alternative Flow)
**Files:** `[v2] Quotes/quote_simple/*.html` (40 files)

**Recommendation:** 
- **Defer** updates to quote_simple module until it's confirmed as the primary flow
- Current priority is quote_list_v2.html and related files
- If quote_simple becomes primary, allocate 2-3 days for full update

**Estimated Effort:** 2-3 days (if activated)

---

### Customer Management Module

#### 1. `customer-list.html`
**File:** `Customer Management/customer-list.html`

**Current Issues Found:**
- Line 85: "Customers" ✓ (Correct)
- Line 94: "Add Customer" ✓ (Correct)
- Line 143: "Company" ✓ (Correct)

**Changes Needed:**
```html
<!-- VERIFY: Consistent use of "Customer" -->
<!-- CHECK: Status filter uses "Active" / "Archived" (line 118-120) ✓ Correct -->
<!-- No major changes needed -->
```

**Estimated Effort:** 5 minutes

---

#### 2. `customer-create.html` & `customer-edit.html`
**Files:**
- `Customer Management/customer-create.html`
- `Customer Management/customer-edit.html`

**Changes Needed:**
```html
<!-- VERIFY: All labels use "Customer" -->
<!-- VERIFY: Status options are "Active" / "Archived" -->
```

**Estimated Effort:** 10 minutes each

---

### Pricebook Module

#### 1. `pricebook.html`
**File:** `admin/pricebook.html`

**Current Issues Found:**
- Line 92: "My pricebook" ✓ (Correct - lowercase in UI is acceptable)
- Line 118: "SKU / Code" - Should be "SKU" only
- Line 123: "Status" with "Published" / "Draft" ✓ (Correct)

**Changes Needed:**
```html
<!-- LINE 120 -->
<!-- FIND: -->
<th>SKU / Code</th>

<!-- REPLACE WITH: -->
<th>SKU</th>

<!-- VERIFY: "Pricebook Item" terminology in text -->
<!-- VERIFY: Status values are "Published" / "Draft" only -->
```

**Estimated Effort:** 10 minutes

---

#### 2. `pricebook-create.html` & `pricebook-edit.html`
**Files:**
- `admin/pricebook-create.html`
- `admin/pricebook-edit.html`

**Changes Needed:**
```html
<!-- VERIFY: "Pricebook Item" in page title -->
<!-- VERIFY: "SKU" field label (not "Code" or "Product Code") -->
<!-- VERIFY: "Price" for products, "Rate" for hourly services -->
<!-- VERIFY: Status options are "Published" / "Draft" -->
```

**Estimated Effort:** 15 minutes each

---

## ⚪ P4 - FUTURE / LEGACY

### Legacy Job Modules

These modules are deprecated but may still be in use. Update only if actively maintained.

#### Class Job v1 (Legacy)
**Files:** `[v2] Jobs/Class_job/*.html` (4 files)

**Recommendation:** 
- Mark as **DEPRECATED** in documentation
- Do not invest time in terminology updates
- Plan migration to Service Job v3

---

#### Class Job v2 (Deprecated)
**Files:** `[v2] Jobs/class_job_v2/*.html` (19 files)

**Recommendation:**
- Mark as **DEPRECATED** in documentation
- Do not invest time in terminology updates
- Plan migration to Service Job v3

---

#### Main Job Module
**Files:** `[v2] Jobs/job_*.html` (11 files)

**Recommendation:**
- **Evaluate** if still in use
- If active, update to use "Learning Service" terminology
- If deprecated, mark for removal

**Estimated Effort (if active):** 1-2 days

---

### Staff Portal
**Files:** `Staff/*.html` (4 files)

**Changes Needed:**
```html
<!-- VERIFY: "Job" vs "Learning Service" terminology -->
<!-- UPDATE: Navigation links to use correct module names -->
<!-- VERIFY: "Staff" terminology is consistent -->
```

**Estimated Effort:** 1 hour

---

## 🛠️ Implementation Strategy

### Phase 1: Critical Updates (Week 1)
**Focus:** Learning Services (v3) + Timesheet Manager

1. **Day 1-2:** Learning Services Module
   - Update all 8 files in service_job_v3
   - Test functionality after changes
   - Update related JavaScript if needed

2. **Day 3:** Timesheet Manager Module
   - Update all 6 files
   - Verify status badges and labels
   - Test manager and staff views

3. **Day 4:** Testing & QA
   - Full regression testing
   - UI/UX review
   - Documentation updates

4. **Day 5:** Deployment & Monitoring
   - Deploy to staging
   - User acceptance testing
   - Deploy to production

---

### Phase 2: High Priority Updates (Week 2)
**Focus:** Team Management + Pricebook

1. **Day 1:** Team Management Module
   - Update all 6 files
   - Test role and permission flows

2. **Day 2:** Pricebook Module
   - Update all 3 files
   - Test create/edit flows

3. **Day 3-4:** Quotes & Invoices (Primary Flow)
   - Update quote_list_v2, quote_create, quote_edit
   - Update invoice_create, invoice_detail
   - Test end-to-end quote-to-invoice flow

4. **Day 5:** Testing & Deployment
   - Full regression testing
   - Deploy to production

---

### Phase 3: Medium Priority Updates (Week 3)
**Focus:** Customer Management + Remaining Files

1. **Day 1:** Customer Management
   - Update all 3 files
   - Test CRUD operations

2. **Day 2-3:** Staff Portal
   - Evaluate current usage
   - Update if active
   - Test staff-facing views

3. **Day 4:** Root Level Pages
   - Update landing pages
   - Update home.html
   - Update navigation consistency

4. **Day 5:** Final Testing & Documentation
   - Complete regression testing
   - Update all documentation
   - Create change log

---

### Phase 4: Legacy Evaluation (Future)
**Focus:** Determine fate of legacy modules

1. **Evaluate Usage:**
   - Check analytics for legacy module usage
   - Survey users about Class Job v1/v2
   - Determine migration timeline

2. **Decision:**
   - **If active:** Plan migration to Service Job v3
   - **If inactive:** Mark for deprecation and removal

3. **Action:**
   - Create migration guide if needed
   - Update or remove legacy files
   - Clean up codebase

---

## 📊 Detailed Change Checklist

### Global Find & Replace (Safe)

These changes can be made globally across all files:

```
FIND: "Time Sheet"
REPLACE: "Timesheet"

FIND: "Price Book"
REPLACE: "Pricebook"

FIND: "1-on-1" OR "1:1" OR "one on one"
REPLACE: "One-to-One"

FIND: "Employee" (in staff context)
REPLACE: "Staff Member"

FIND: "Estimate" (in quote context)
REPLACE: "Quote"
```

### Context-Specific Changes

These require manual review:

```
CONTEXT: Learning Services
FIND: "Class" (when referring to service type)
VERIFY: Should be "Class" (type) or "Learning Service" (entity)

CONTEXT: Timesheets
FIND: "Billable Hours"
REPLACE: "Final Hours"

CONTEXT: Status Fields
VERIFY: All status values match glossary exactly
```

---

## 🧪 Testing Checklist

After each module update:

### Functional Testing
- [ ] All forms submit correctly
- [ ] All lists display correctly
- [ ] All filters work as expected
- [ ] All navigation links work
- [ ] All modals/dialogs function properly

### Visual Testing
- [ ] No layout breaks
- [ ] Labels are properly aligned
- [ ] Status badges display correctly
- [ ] Responsive design intact
- [ ] No text overflow

### Data Integrity
- [ ] Existing data displays correctly
- [ ] New data saves with correct terminology
- [ ] Status values are valid
- [ ] No data loss or corruption

### Accessibility
- [ ] Screen reader compatibility
- [ ] Keyboard navigation works
- [ ] ARIA labels are correct
- [ ] Color contrast maintained

---

## 📝 Documentation Updates Required

After terminology changes:

1. **Update README files** in each module
2. **Update API documentation** if backend terms change
3. **Update user guides** and help documentation
4. **Update training materials**
5. **Create change log** for users
6. **Update database schema documentation** if field names change

---

## ⚠️ Risks & Mitigation

### Risk 1: Breaking Changes
**Impact:** High  
**Probability:** Medium  
**Mitigation:**
- Thorough testing before deployment
- Staged rollout (staging → production)
- Backup before changes
- Rollback plan ready

### Risk 2: User Confusion
**Impact:** Medium  
**Probability:** High  
**Mitigation:**
- Communicate changes to users in advance
- Provide change summary document
- Offer training if needed
- Gradual rollout to minimize shock

### Risk 3: Inconsistent Updates
**Impact:** High  
**Probability:** Medium  
**Mitigation:**
- Use this checklist religiously
- Peer review all changes
- Automated testing where possible
- Final QA review before deployment

### Risk 4: Database Field Mismatches
**Impact:** Critical  
**Probability:** Low  
**Mitigation:**
- Verify backend field names before UI changes
- Update backend and frontend together
- Test data flow end-to-end
- Have database rollback ready

---

## 📈 Success Metrics

Track these metrics to measure success:

1. **Consistency Score:** % of files using correct terminology
   - Target: 100% for P0-P2 files
   
2. **User Confusion Tickets:** Support tickets about terminology
   - Target: < 5 tickets in first month

3. **Developer Velocity:** Time to understand codebase
   - Target: 20% reduction in onboarding time

4. **Documentation Accuracy:** % of docs matching implementation
   - Target: 100%

---

## 🎯 Quick Win Recommendations

If time is limited, prioritize these high-impact, low-effort changes:

### Top 5 Quick Wins:

1. **`timesheet_manager_inbox.html`** (15 min)
   - Fix "Staff Management" → "Manage Team" link
   - High visibility, easy fix

2. **`pricebook.html`** (10 min)
   - Change "SKU / Code" → "SKU"
   - Simple, clear improvement

3. **Global Find & Replace** (30 min)
   - "Time Sheet" → "Timesheet"
   - "Price Book" → "Pricebook"
   - Affects multiple files, easy to automate

4. **`learning_service_list.html`** (Already correct!)
   - Verify and document as reference
   - Use as template for other files

5. **Status Badge Standardization** (1 hour)
   - Create reusable status badge components
   - Apply across all modules
   - Ensures consistency going forward

**Total Time for Quick Wins:** ~2.5 hours  
**Impact:** Immediate improvement in consistency

---

## 📞 Support & Questions

For questions about this document or terminology standards:

- **Product Management Team:** For glossary clarifications
- **Development Lead:** For implementation questions
- **QA Team:** For testing strategy
- **Documentation Team:** For user-facing content

---

## ✅ Sign-Off

**Prepared By:** AI Assistant  
**Date:** January 12, 2026  
**Status:** Ready for Review

**Approval Required From:**
- [ ] Product Manager
- [ ] Development Lead
- [ ] UX/UI Lead
- [ ] QA Lead

---

*This document should be used in conjunction with `OFFICIAL_GLOSSARY.md` for all terminology standardization work.*
