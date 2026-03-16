# Simple Job Creation Screen - Specification

## Overview

This screen provides a **simple, default approach** to creating jobs from quotes. It creates **one job with all items** by default, with an option to switch to advanced mode for splitting items.

---

## Design Philosophy

### Default: Single Job (Simple)
- **80% use case:** Most users want to create one job with all quote items
- **Quick workflow:** Minimal clicks, straightforward form
- **Clear layout:** Focus on scheduling and configuration, not item distribution

### Optional: Multiple Jobs (Advanced)
- **20% use case:** Users who need to split items across multiple jobs
- **Opt-in:** Accessible via "Click here to split items" link
- **Seamless transition:** Redirects to advanced multi-job creation screen

---

## Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: Create Job from Quote                                   │
│ Quote Q-2024-001 | Sarah Johnson | 5 items • $1,650.00         │
│                                                    [Back to Quote]│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ℹ️ Creating one job with all quote items                        │
│ Need to split? → Click here to split items                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────────────┐
│ LEFT COLUMN (2/3 width)      │ RIGHT COLUMN (1/3 width)         │
│                              │                                  │
│ ┌──────────────────────────┐ │ ┌──────────────────────────────┐ │
│ │ Job Details              │ │ │ Customer Info                │ │
│ │ • Job Name (optional)    │ │ │ • Name, email, phone         │ │
│ │ • Priority (required)    │ │ │ • Service address            │ │
│ └──────────────────────────┘ │ └──────────────────────────────┘ │
│                              │                                  │
│ ┌──────────────────────────┐ │ ┌──────────────────────────────┐ │
│ │ Schedule (optional)      │ │ │ Line Items (5 items)         │ │
│ │ • Date & Time            │ │ │ • All quote items listed     │ │
│ │ • Duration               │ │ │ • Financial summary          │ │
│ │ • Team Assignment        │ │ │ • Deposit info               │ │
│ └──────────────────────────┘ │ └──────────────────────────────┘ │
│                              │                                  │
│ ┌──────────────────────────┐ │ ┌──────────────────────────────┐ │
│ │ Notes                    │ │ │ Actions                      │ │
│ │ • Internal notes         │ │ │ [Create Job]                 │ │
│ │ • Customer notes (read)  │ │ │ [Save as Draft]              │ │
│ └──────────────────────────┘ │ │ [Cancel]                     │ │
│                              │ └──────────────────────────────┘ │
└──────────────────────────────┴──────────────────────────────────┘
```

---

## Components Specification

### 1. Header Section

**Elements:**
- Page title: "Create Job from Quote"
- Badge: "📝 Single Job" (blue)
- Quote reference: "Quote Q-2024-001"
- Customer name: "Sarah Johnson"
- Summary: "5 items • $1,650.00"
- Back button: Returns to quote detail page

**Purpose:** Context and navigation

---

### 2. Info Banner

**Content:**
```
ℹ️ Creating one job with all quote items
Need to split into multiple jobs? Click here to split items
```

**Behavior:**
- "Click here to split items" is a clickable link
- Opens confirmation modal
- Modal explains benefits of splitting
- Confirms user wants to switch to advanced mode
- Redirects to `job_create_from_quote.html` (multi-job screen)

**Purpose:** Educate users about the option without overwhelming them

---

### 3. Job Details Card

#### Job Name
- **Type:** Text input
- **Label:** "Job Name (Optional)"
- **Placeholder:** "e.g., Complete Tutoring Package"
- **Help text:** "Leave blank to use default: 'Job from Quote Q-2024-001'"
- **Max length:** 100 characters
- **Default:** Empty (system generates if blank)

#### Priority
- **Type:** Radio buttons (visual button group)
- **Options:**
  - 🔴 High (red border on hover)
  - 🔵 Medium (blue border, selected by default)
  - 🟢 Low (green border on hover)
- **Required:** Yes (default: Medium)
- **Layout:** 3 equal-width columns

---

### 4. Schedule Card

**Header:** "Schedule" with subtitle "Optional - can schedule later"

#### Date
- **Type:** Date picker
- **Label:** "📅 Date"
- **Min date:** Today
- **Default:** Empty
- **Optional:** Yes

#### Time
- **Type:** Time picker
- **Label:** "🕐 Time"
- **Format:** 24-hour or 12-hour based on locale
- **Default:** Empty
- **Optional:** Yes

#### Estimated Duration
- **Type:** Two number inputs (hours, minutes)
- **Label:** "⚡ Estimated Duration"
- **Inputs:**
  - Hours: 0-24
  - Minutes: 0-59, step 15
- **Help text:** "Auto-calculated from line items: 6 hours"
- **Optional:** Yes (uses auto-calculated if empty)

#### Team Assignment
- **Type:** Dropdown select
- **Label:** "👥 Assign Team (Optional)"
- **Options:**
  - "Auto-assign (Recommended)" - default
  - "Team 1 - John & Sarah"
  - "Team 2 - Mike & Lisa"
  - "Team 3 - David & Emma"
- **Default:** Auto-assign
- **Optional:** Yes

---

### 5. Notes Card

#### Internal Notes
- **Type:** Textarea
- **Label:** "Internal Notes (Staff only)"
- **Placeholder:** "Add any internal notes for the team..."
- **Rows:** 3
- **Max length:** 500 characters
- **Optional:** Yes

#### Customer Notes (Read-only)
- **Type:** Read-only display box
- **Label:** "Customer Notes (From quote)"
- **Style:** Gray background, border
- **Content:** Pulled from quote
- **Purpose:** Reference for staff

---

### 6. Customer Info Card (Right Sidebar)

**Content:**
- Customer name (bold)
- Email
- Phone
- Service address (with map icon)

**Style:** Sticky position (stays visible on scroll)

---

### 7. Line Items Card (Right Sidebar)

**Header:** "Line Items" with count badge "5 items"

**Item Display:**
- Item name (bold)
- Description (small text): "2 hrs × $150.00"
- Total price (right-aligned, bold)

**Financial Summary:**
- Subtotal
- Tax (10% GST)
- **Total** (bold, larger)
- Deposit Paid (green box)
- Balance Due

**Purpose:** Show complete job value at a glance

---

### 8. Actions Card (Right Sidebar)

#### Create Job Button
- **Style:** Full width, emerald green
- **Icon:** Checkmark
- **Text:** "Create Job"
- **Action:** Validates and creates job

#### Save as Draft Button
- **Style:** Full width, gray border
- **Icon:** Download
- **Text:** "Save as Draft"
- **Action:** Saves job as draft status

#### Cancel Link
- **Style:** Text link, gray
- **Text:** "Cancel"
- **Action:** Returns to quote detail

---

### 9. Split Items Modal

**Trigger:** User clicks "Click here to split items" link

**Modal Content:**
```
┌─────────────────────────────────────────────────────┐
│ Split into Multiple Jobs                      [×]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ⚠️ Switching to advanced mode                       │
│ You'll be able to distribute items across          │
│ multiple jobs for different dates or teams.        │
│                                                     │
│ Why split into multiple jobs?                      │
│ ✓ Schedule services on different dates             │
│ ✓ Assign different teams to different services     │
│ ✓ Create phased projects                           │
│ ✓ Invoice separately for each completed job        │
│                                                     │
│ [Continue to Split Items]  [Stay with Single Job]  │
└─────────────────────────────────────────────────────┘
```

**Buttons:**
- **Continue to Split Items:** Redirects to `job_create_from_quote.html`
- **Stay with Single Job:** Closes modal, stays on current page
- **[×] Close:** Same as "Stay with Single Job"

---

## Workflow

### Happy Path: Create Single Job

1. User arrives from quote detail page (clicked "Convert to Job")
2. Page loads with all quote data pre-populated
3. User optionally fills in:
   - Job name
   - Schedule date/time
   - Team assignment
   - Internal notes
4. User clicks "Create Job"
5. System validates inputs
6. System creates job record:
   - Job ID: J-2024-001
   - Status: Scheduled (if date provided) or Created (if no date)
   - All quote line items included
   - Links to quote
7. System updates quote status to "Converted (1 job)"
8. Success message appears
9. User redirected to Job Detail page

**Time to complete:** 30 seconds to 2 minutes

---

### Alternative Path: Switch to Multiple Jobs

1. User arrives on simple creation page
2. User reads info banner
3. User clicks "Click here to split items"
4. Modal appears explaining benefits
5. User clicks "Continue to Split Items"
6. System redirects to `job_create_from_quote.html`
7. User proceeds with multi-job creation workflow

---

### Draft Path: Save for Later

1. User fills in some fields
2. User clicks "Save as Draft"
3. System saves partial job data
4. Job status: Draft
5. User can return later to complete
6. Draft appears in "Draft Jobs" section

---

## Validation Rules

### On Submit (Create Job)

**No required fields except Priority (has default)**

**Optional validations:**
- Job name: Max 100 characters
- Internal notes: Max 500 characters
- Date: Must be today or future
- Duration hours: 0-24
- Duration minutes: 0-59

**All validations are soft** - user can create job without filling anything except priority

---

## Data Model

### Job Record Created

```javascript
{
  id: "J-2024-001",
  
  // Quote Reference
  quoteId: "Q-2024-001",
  isPartOfMultiJobQuote: false,
  
  // Job Details
  jobName: "Complete Tutoring Package" || "Job from Quote Q-2024-001",
  priority: "medium", // high | medium | low
  
  // Schedule
  scheduledDate: "2024-10-28" || null,
  scheduledTime: "10:00" || null,
  estimatedDuration: 360, // minutes
  assignedTeam: "team1" || null,
  
  // Customer
  customerId: "C-001",
  customerName: "Sarah Johnson",
  customerEmail: "sarah.j@email.com",
  customerPhone: "+61 400 123 456",
  serviceAddress: {
    street: "123 Main Street",
    city: "Melbourne",
    state: "VIC",
    postcode: "3000"
  },
  
  // Line Items (all from quote)
  lineItems: [
    {
      id: 1,
      catalogItemId: 501,
      name: "Math Tutoring Session",
      description: "2 hours",
      quantity: 1,
      unitPrice: 300.00,
      total: 300.00,
      quoteLineItemId: "QLI-001"
    },
    // ... all 5 items
  ],
  
  // Financials
  subtotal: 1500.00,
  totalTax: 150.00,
  total: 1650.00,
  depositAmount: 825.00,
  balanceDue: 825.00,
  
  // Notes
  internalNotes: "Student needs extra help with algebra",
  customerNotes: "Prefer morning sessions",
  
  // Status
  status: "Scheduled" || "Created",
  
  // Audit
  createdBy: "admin@franchise.com",
  createdAt: "2024-11-06T08:52:00Z",
  updatedAt: "2024-11-06T08:52:00Z"
}
```

---

## Success Flow

### After Job Creation

1. **Success Toast:**
   ```
   ✓ Job J-2024-001 created successfully!
   ```

2. **Quote Update:**
   - Status: "Converted (1 job)"
   - jobsCreated: true
   - jobIds: ["J-2024-001"]
   - jobCount: 1

3. **Redirect:**
   - Destination: Job Detail page (`job_detail.html?id=J-2024-001`)
   - Delay: 1 second (show toast first)

4. **Notification (Optional):**
   - If team assigned: Notify team members
   - If scheduled: Add to calendar
   - Email to customer (optional setting)

---

## UI States

### Loading State
- Show spinner on "Create Job" button
- Disable all inputs
- Text: "Creating job..."

### Error State
- Show error message above form
- Highlight invalid fields with red border
- Keep form data intact
- Allow user to fix and retry

### Draft Saved State
- Show success toast: "Draft saved"
- Keep user on page
- Update button to "Update Draft"

---

## Responsive Design

### Desktop (≥1024px)
- 2-column layout (2/3 + 1/3)
- Right sidebar sticky
- All features visible

### Tablet (768px - 1023px)
- 2-column layout
- Right sidebar scrolls with page
- Slightly narrower spacing

### Mobile (<768px)
- Single column
- Customer info and line items collapse into accordions
- Actions fixed at bottom
- Simplified form layout

---

## Accessibility

- **Keyboard Navigation:** Tab through all fields
- **Screen Readers:** ARIA labels on all inputs
- **Focus Indicators:** Visible focus states
- **Error Announcements:** ARIA live regions
- **Color Contrast:** WCAG AA compliant

---

## Performance

- **Page Load:** <1 second
- **Form Validation:** Real-time (debounced)
- **Job Creation:** <2 seconds
- **Redirect:** Immediate after success

---

## Comparison: Simple vs Advanced

| Feature | Simple (This Screen) | Advanced (Multi-Job) |
|---------|---------------------|----------------------|
| **Default behavior** | One job, all items | Choose single or multiple |
| **Item distribution** | Automatic (all items) | Manual (drag & drop) |
| **Configuration** | One form | Multiple job cards |
| **Complexity** | Low | High |
| **Time to complete** | 30 seconds | 2-5 minutes |
| **Use case** | 80% of jobs | 20% of jobs |
| **Best for** | Quick job creation | Complex scheduling |

---

## Implementation Notes

### Phase 1: Core Functionality
- ✅ Single job creation form
- ✅ All quote data pre-populated
- ✅ Basic validation
- ✅ Success redirect

### Phase 2: Enhanced Features
- ✅ Draft saving
- ✅ Team assignment
- ✅ Duration calculation
- ✅ Split items modal

### Phase 3: Polish
- ✅ Responsive design
- ✅ Accessibility
- ✅ Loading states
- ✅ Error handling

---

## Document Version

- **Version:** 1.0
- **Date:** November 6, 2024
- **Status:** Ready for Implementation
- **Companion:** JOB_CREATE_SCREEN_SPECIFICATION.md (advanced mode)
