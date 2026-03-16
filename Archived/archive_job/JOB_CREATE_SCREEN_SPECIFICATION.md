# Job Creation Screen - Complete Specification

## Overview

This document provides the complete specification for the job creation screen that supports both single and multiple job creation from quotes.

---

## Screen Flow

```
1. Initial Modal → Choose Single or Multiple
2a. Single Job View → Configure one job → Create
2b. Multiple Jobs View → Distribute items → Configure jobs → Create All
3. Success → Redirect to Job List or Job Detail
```

---

## Component Structure

### 1. Initial Selection Modal

**Purpose:** Let admin choose between single or multiple job creation

**Elements:**
- Quote summary (ID, customer, address, item count, total)
- Two radio button options:
  - Create Single Job (default)
  - Create Multiple Jobs
- Continue button
- Cancel button

**Behavior:**
- Modal appears on page load
- Continue button proceeds to selected view
- Cancel returns to quote detail page

---

### 2. Single Job View

**Layout:** Single column form

**Sections:**

#### A. Job Configuration Form
- **Job Name** (optional text input)
  - Placeholder: "e.g., Complete Tutoring Package"
  - Max 100 characters
  
- **Schedule Date** (optional date picker)
  - Min date: Today
  - Default: Empty
  
- **Schedule Time** (optional time picker)
  - Format: 12-hour with AM/PM
  - Default: Empty
  
- **Priority** (required radio buttons)
  - Options: High (red), Medium (blue, default), Low (green)
  - Visual button group
  
- **Notes** (optional textarea)
  - Placeholder: "Add any specific notes for this job..."
  - Max 500 characters
  - Rows: 4

#### B. Line Items Preview
- Read-only list of all quote line items
- Shows: Name, description, quantity, unit price, total
- Displays item count
- Shows subtotal, tax, and total

#### C. Actions
- **Cancel** button → Returns to quote
- **Create Job** button (emerald green) → Creates job

**Validation:**
- No required fields (all optional except priority which has default)
- Job name max length
- Notes max length

---

### 3. Multiple Jobs View

**Layout:** 3-column grid (responsive: stacks on mobile)

#### Column 1: Available Items (Sticky Sidebar)

**Header:**
- Title: "Available Items"
- Badge: Remaining count (e.g., "5 items")

**Quick Split Actions:**
- **Split Evenly** button (blue outline)
  - Distributes items evenly across existing jobs
  - If 5 items and 2 jobs: Job 1 gets 3, Job 2 gets 2
  
- **Split by Type** button (purple outline)
  - Groups similar items together
  - Logic: Group by catalog category or service type

**Items List:**
- Scrollable container (max-height: 600px)
- Each item card shows:
  - Checkbox for selection
  - Item name (bold)
  - Description (small text)
  - Total price (bold)
  - Drag handle icon
- Items are draggable
- Items can be selected via checkbox

**States:**
- Default: All items visible
- Items assigned: Moved to job cards
- Empty state: "All items assigned ✓"

#### Column 2-3: Job Cards (Main Area)

**Initial State:**
- 2 empty job cards displayed
- Each card has drop zone for items

**Job Card Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ Job 1 (J-2024-001) - Week 1 Math Session     [▼] [✕]   │
├─────────────────────────────────────────────────────────┤
│ Configuration (collapsible):                            │
│ • Job Name: [                                        ]  │
│ • Schedule Date: [          ] Time: [        ]          │
│ • Priority: ○ High  ● Medium  ○ Low                     │
│ • Notes: [                                            ]  │
├─────────────────────────────────────────────────────────┤
│ Line Items (Drop Zone):                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✓ Math Tutoring Session - $300.00            [✕]   │ │
│ │ ✓ Study Materials Package - $150.00          [✕]   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Subtotal: $450.00 | Tax: $45.00 | Total: $495.00      │
│                                                         │
│ [Assign Selected Items]  [Remove Job]                  │
└─────────────────────────────────────────────────────────┘
```

**Job Card Features:**
- **Header:**
  - Job ID (auto-generated preview)
  - Job name (editable inline or in config)
  - Collapse/expand toggle
  - Remove job button (X)

- **Configuration Section:**
  - Job Name input
  - Schedule Date picker
  - Schedule Time picker
  - Priority radio buttons
  - Notes textarea
  - Can be collapsed to save space

- **Line Items Drop Zone:**
  - Accepts dragged items
  - Shows assigned items
  - Each item has remove button (X)
  - Empty state: "Drag items here or use Assign button"
  - Drag-over state: Blue dashed border

- **Financial Summary:**
  - Real-time calculation
  - Subtotal, tax, total
  - Updates when items added/removed

- **Actions:**
  - "Assign Selected Items" button
    - Assigns checked items from Available list
    - Only visible when items are selected
  - "Remove Job" button
    - Returns all items to Available list
    - Deletes job card
    - Minimum 2 jobs must remain

**Add Job Card:**
- "+ Add Another Job" button at bottom
- Creates new empty job card
- Maximum 10 jobs allowed
- New job gets next sequential ID

---

## Drag & Drop Functionality

### Drag Start (from Available Items)
1. User clicks and holds item
2. Item becomes semi-transparent (opacity: 0.5)
3. Cursor changes to "grabbing"
4. All job drop zones highlight

### Drag Over (job card drop zone)
1. Drop zone border changes to blue dashed
2. Background changes to light blue
3. Visual feedback that drop is allowed

### Drop (on job card)
1. Item moves from Available to job card
2. Item appears in job's line items list
3. Job totals recalculate
4. Remaining count updates
5. Validation checks run

### Drag End (anywhere)
1. If dropped outside drop zone: Item returns to original position
2. Visual states reset

---

## Checkbox Assignment

### Selection
1. User checks one or more items in Available list
2. "Assign Selected Items" button appears on job cards
3. Selected items have blue border

### Assignment
1. User clicks "Assign Selected Items" on a job card
2. All checked items move to that job
3. Checkboxes reset
4. Items appear in job's line items
5. Totals recalculate

---

## Quick Split Functions

### Split Evenly
**Algorithm:**
```javascript
function splitEvenly(items, jobCount) {
    const itemsPerJob = Math.floor(items.length / jobCount);
    const remainder = items.length % jobCount;
    
    let currentIndex = 0;
    for (let i = 0; i < jobCount; i++) {
        const count = itemsPerJob + (i < remainder ? 1 : 0);
        assignItemsToJob(items.slice(currentIndex, currentIndex + count), i);
        currentIndex += count;
    }
}
```

**Example:**
- 5 items, 2 jobs
- Job 1: 3 items
- Job 2: 2 items

### Split by Type
**Algorithm:**
```javascript
function splitByType(items) {
    // Group items by category
    const groups = {};
    items.forEach(item => {
        const category = item.category || 'Other';
        if (!groups[category]) groups[category] = [];
        groups[category].push(item);
    });
    
    // Assign each group to a job
    const categories = Object.keys(groups);
    categories.forEach((category, index) => {
        if (index >= jobs.length) addNewJob();
        assignItemsToJob(groups[category], index);
    });
}
```

**Example:**
- 3 Tutoring items → Job 1
- 1 Materials item → Job 2
- 1 Assessment item → Job 3

---

## Validation System

### Real-time Validations

**1. Items Assignment Check**
- Trigger: After any item move
- Rule: All items must be assigned
- Visual: Orange badge shows remaining count
- Error: "X items not assigned" warning

**2. Job Empty Check**
- Trigger: When job has no items
- Rule: Each job must have ≥1 item
- Visual: Job card shows warning border (orange)
- Error: "Job X has no items" message

**3. Total Match Check**
- Trigger: After any item move
- Rule: Sum of job totals = Quote total
- Visual: Total comparison at bottom
- Error: "Total mismatch" warning

**4. Job Count Check**
- Trigger: When adding new job
- Rule: Maximum 10 jobs
- Visual: "Add Job" button disabled at limit
- Error: "Maximum 10 jobs per quote" message

### Pre-submission Validation

**Before "Create All Jobs" is enabled:**
- ✓ All items assigned
- ✓ All jobs have items
- ✓ Totals match
- ✓ Job count ≤ 10

**Visual States:**
- All valid: "Create All Jobs" button enabled (green)
- Any invalid: Button disabled (gray) + error messages shown

---

## Financial Calculations

### Job Total Calculation
```javascript
function calculateJobTotal(lineItems) {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxBreakdown = calculateTaxByCategory(lineItems);
    const totalTax = taxBreakdown.reduce((sum, tax) => sum + tax.amount, 0);
    const total = subtotal + totalTax;
    
    return { subtotal, taxBreakdown, totalTax, total };
}
```

### Deposit Distribution
```javascript
function distributeDeposit(jobs, quoteDeposit, quoteTotal) {
    jobs.forEach(job => {
        job.depositAmount = (job.total / quoteTotal) * quoteDeposit;
        job.balanceDue = job.total - job.depositAmount;
    });
    
    // Handle rounding: adjust last job
    const totalDistributed = jobs.reduce((sum, job) => sum + job.depositAmount, 0);
    const difference = quoteDeposit - totalDistributed;
    if (Math.abs(difference) > 0.01) {
        jobs[jobs.length - 1].depositAmount += difference;
        jobs[jobs.length - 1].balanceDue -= difference;
    }
}
```

### Summary Display
```
┌─────────────────────────────────────────────────────────┐
│ Quote Total: $1,650.00                                  │
│ Jobs Total:  $1,650.00  ✓                               │
│ Remaining:   $0.00                                      │
│                                                         │
│ [Create All Jobs]                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Success Flow

### Single Job Creation
1. Validate inputs
2. Show loading spinner on button
3. Create job record in database
4. Generate Job ID: J-2024-001
5. Link to quote
6. Update quote status
7. Show success toast
8. Redirect to Job Detail page

### Multiple Jobs Creation
1. Validate all jobs
2. Show loading overlay
3. Create all job records in batch
4. Generate Job IDs: J-2024-001, 002, 003
5. Link all to quote
6. Distribute deposit
7. Update quote status
8. Show success modal with job list
9. Redirect to Job List filtered by quote

**Success Modal:**
```
┌─────────────────────────────────────────────────────────┐
│ ✓ Successfully Created 3 Jobs from Quote Q-2024-001    │
├─────────────────────────────────────────────────────────┤
│ • Job J-2024-001 - Week 1 Math Session ($495.00)       │
│ • Job J-2024-002 - Week 2 Science & English ($660.00)  │
│ • Job J-2024-003 - Final Assessment ($110.00)          │
│                                                         │
│ [View All Jobs]  [Schedule Jobs]  [Close]              │
└─────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Validation Errors
- Display inline with red text
- Highlight invalid fields with red border
- Disable submit button
- Show error summary at top

### Network Errors
- Show error toast
- Keep form data intact
- Allow retry
- Provide "Save Draft" option

### Partial Success (Multiple Jobs)
- If some jobs fail to create
- Show which succeeded and which failed
- Allow retry for failed jobs only
- Don't lose progress

---

## Responsive Design

### Desktop (≥1024px)
- 3-column layout
- Sidebar sticky
- All features visible

### Tablet (768px - 1023px)
- 2-column layout
- Available items in collapsible panel
- Job cards stack vertically

### Mobile (<768px)
- Single column
- Available items in bottom sheet
- Drag & drop disabled (checkbox only)
- Simplified job cards
- One job visible at a time

---

## Accessibility

- **Keyboard Navigation:**
  - Tab through all interactive elements
  - Enter/Space to select
  - Arrow keys for radio buttons
  - Escape to close modals

- **Screen Readers:**
  - ARIA labels on all buttons
  - ARIA live regions for validation messages
  - ARIA drag-and-drop announcements

- **Visual:**
  - High contrast mode support
  - Focus indicators on all elements
  - Color not sole indicator (icons + text)

---

## Performance Considerations

- **Lazy Loading:** Load quote data on demand
- **Debouncing:** Debounce validation checks (300ms)
- **Virtual Scrolling:** For large item lists (>50 items)
- **Optimistic Updates:** Update UI immediately, sync later
- **Batch Operations:** Create all jobs in single API call

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Document Version

- **Version:** 1.0
- **Date:** November 6, 2024
- **Status:** Ready for Implementation
