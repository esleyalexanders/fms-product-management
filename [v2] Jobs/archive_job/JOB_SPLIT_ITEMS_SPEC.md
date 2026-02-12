# Split Items Screen - Specification

## Overview

This screen allows users to distribute quote items across multiple jobs using an intuitive drag-and-drop interface. It provides both manual control and automated distribution options.

---

## Purpose

**Primary Goal:** Enable users to split a single quote into multiple jobs by distributing line items across different job cards.

**Use Cases:**
- Schedule services on different dates
- Assign different teams to different services
- Create phased projects
- Invoice separately for each completed job

---

## Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: Split Items into Multiple Jobs                         │
│ Quote Q-2024-001 | Sarah Johnson | 5 items • $1,650.00         │
│                                         [Back to Simple Mode]   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ℹ️ Distribute items across multiple jobs                        │
│ Drag items or use quick actions. All items must be assigned.   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────────────┐
│ AVAILABLE ITEMS  │ JOB CARDS                                    │
│ (Sticky Sidebar) │                                              │
│                  │                                              │
│ [5 items]        │ ┌────────────────────────────────────────┐   │
│                  │ │ Job 1                                  │   │
│ Quick Actions:   │ │ • Configuration (collapsible)          │   │
│ [Split Evenly]   │ │ • Drop Zone                            │   │
│ [By Type]        │ │ • Financial Summary                    │   │
│ [Clear All]      │ └────────────────────────────────────────┘   │
│                  │                                              │
│ Item Cards:      │ ┌────────────────────────────────────────┐   │
│ ☰ Math Tutoring  │ │ Job 2                                  │   │
│ ☰ Science        │ │ • Configuration (collapsible)          │   │
│ ☰ English        │ │ • Drop Zone                            │   │
│ ☰ Materials      │ │ • Financial Summary                    │   │
│ ☰ Assessment     │ └────────────────────────────────────────┘   │
│                  │                                              │
│                  │ [+ Add Another Job]                          │
│                  │                                              │
│                  │ [Cancel] [Create All Jobs]                   │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## Components Specification

### 1. Header Section

**Elements:**
- Page title: "Split Items into Multiple Jobs"
- Badge: "🔀 Split Mode" (blue)
- Quote reference: "Quote Q-2024-001"
- Customer name: "Sarah Johnson"
- Summary: "5 items • $1,650.00"
- Back button: Returns to simple job creation mode

**Purpose:** Context and navigation

---

### 2. Info Banner

**Content:**
```
ℹ️ Distribute items across multiple jobs
Drag items from the left panel to job cards, or use quick actions to auto-distribute. 
All items must be assigned before creating jobs.
```

**Style:** Blue background with info icon

**Purpose:** Provide clear instructions for users

---

### 3. Available Items Sidebar (Left Column)

#### Header
- Title: "Available Items"
- Badge: Remaining count (e.g., "5 items")
  - Orange when items remain
  - Green when all assigned

#### Quick Actions Section
**Split Evenly Button:**
- Icon: Horizontal lines
- Color: Blue outline
- Action: Distributes items evenly across all jobs
- Algorithm: 
  - If 5 items and 2 jobs: Job 1 gets 3, Job 2 gets 2
  - Remainder items go to first jobs

**Split by Type Button:**
- Icon: Tag
- Color: Purple outline
- Action: Groups items by category
- Algorithm:
  - Groups items by `category` field
  - Creates new jobs if needed (max 10)
  - Assigns each category to a job
  - Auto-names jobs (e.g., "Tutoring Services")

**Clear All Button:**
- Icon: Refresh
- Color: Red outline
- Action: Returns all items to available list
- Confirmation: None (can undo by redistributing)

#### Items List
**Item Card Structure:**
```
┌─────────────────────────────────────┐
│ ☰ Math Tutoring Session            │
│   2 hours of advanced mathematics   │
│   [Tutoring]              $300.00   │
└─────────────────────────────────────┘
```

**Features:**
- Drag handle icon (☰)
- Item name (bold)
- Description (small text)
- Category badge
- Price (bold, emerald)
- Draggable
- Hover effect (lift and shadow)

**States:**
- Default: All items visible
- Dragging: Semi-transparent (opacity 0.5)
- Empty: Shows success checkmark and message

#### Empty State
**Display when:** All items assigned
**Content:**
```
✓ All items assigned!
Ready to create jobs
```
**Style:** Green checkmark icon, centered

---

### 4. Job Cards (Right Area)

#### Initial State
- 2 empty job cards displayed
- Each card ready to receive items

#### Job Card Structure

**Header:**
- Job number badge (white on emerald)
- Job title: "Job 1", "Job 2", etc.
- Item count and total: "3 items • $750.00"
- Collapse/expand toggle button
- Remove job button (X) - only if more than 2 jobs

**Configuration Section (Collapsible):**

**Job Name:**
- Type: Text input
- Label: "Job Name (Optional)"
- Placeholder: "e.g., Week 1 Tutoring"
- Max length: 100 characters

**Schedule:**
- Date picker: "📅 Date"
- Time picker: "🕐 Time"
- Both optional
- Side by side layout

**Priority:**
- Radio buttons (visual button group)
- Options:
  - 🔴 High (red border when selected)
  - 🔵 Medium (blue border, default)
  - 🟢 Low (green border when selected)
- Default: Medium

**Internal Notes:**
- Textarea
- Placeholder: "Add notes for this job..."
- Rows: 2
- Max length: 500 characters

**Drop Zone:**

**Empty State:**
```
┌─────────────────────────────────────┐
│         📦                          │
│     Drop items here                 │
│  Drag items from the left panel     │
└─────────────────────────────────────┘
```
- Dashed border
- Gray background
- Drop icon
- Instructional text
- Min height: 200px

**With Items:**
- Solid border
- Each item in emerald card
- Item name and description
- Price
- Remove button (X) per item

**Drag States:**
- Drag over: Blue dashed border, light blue background
- Drag leave: Return to normal

**Financial Summary (Only when items present):**
```
Subtotal:        $750.00
Tax (10%):        $75.00
─────────────────────────
Total:           $825.00
```
- Gray background
- Subtotal, tax, total
- Total in larger emerald text

---

### 5. Add Job Button

**Style:** 
- Full width
- Dashed border
- White background
- Hover: Blue border and background

**Icon:** Plus sign

**Text:** "Add Another Job"

**Behavior:**
- Adds new empty job card
- Maximum 10 jobs allowed
- Shows error toast if limit reached

---

### 6. Action Buttons (Bottom)

**Container:**
- White background
- Rounded card
- Shadow

**Layout:**
- Left: Informational text
- Right: Action buttons

**Cancel Button:**
- Style: Gray border, white background
- Text: "Cancel"
- Action: Returns to simple job creation

**Create All Jobs Button:**
- Style: Emerald background, white text
- Icon: Checkmark
- Text: "Create All Jobs"
- Disabled state: Gray background, not clickable
- Enabled when: All items assigned AND all jobs have items

---

## Drag & Drop Functionality

### Drag Start
1. User clicks and holds item card
2. Item becomes semi-transparent (opacity: 0.5)
3. Cursor changes to "grabbing"
4. All job drop zones are ready to receive

### Drag Over Job Card
1. Drop zone border changes to blue dashed
2. Background changes to light blue (#eff6ff)
3. Visual feedback that drop is allowed

### Drop on Job Card
1. Item moves from available list to job card
2. Item appears in job's items list
3. Job totals recalculate automatically
4. Remaining count updates
5. Create button state updates

### Drag End (Invalid Drop)
1. If dropped outside drop zone: Item returns to original position
2. Visual states reset
3. No changes made

---

## Quick Actions Algorithms

### Split Evenly

**Logic:**
```javascript
function splitEvenly(items, jobs) {
    const itemsPerJob = Math.floor(items.length / jobs.length);
    const remainder = items.length % jobs.length;
    
    // First jobs get extra items from remainder
    for (let i = 0; i < jobs.length; i++) {
        const count = itemsPerJob + (i < remainder ? 1 : 0);
        assignItemsToJob(items.slice(startIndex, startIndex + count), jobs[i]);
        startIndex += count;
    }
}
```

**Example:**
- 5 items, 2 jobs → Job 1: 3 items, Job 2: 2 items
- 7 items, 3 jobs → Job 1: 3, Job 2: 2, Job 3: 2

### Split by Type

**Logic:**
```javascript
function splitByType(items) {
    // Group by category
    const groups = groupBy(items, 'category');
    
    // Ensure enough jobs exist
    while (jobs.length < groups.length && jobs.length < 10) {
        addNewJob();
    }
    
    // Assign each group to a job
    groups.forEach((group, index) => {
        jobs[index].items = group;
        jobs[index].name = `${group[0].category} Services`;
    });
}
```

**Example:**
- 3 Tutoring items → Job 1 "Tutoring Services"
- 1 Materials item → Job 2 "Materials Services"
- 1 Assessment item → Job 3 "Assessment Services"

---

## Validation Rules

### Real-time Validations

**1. Items Assignment Check**
- Trigger: After any item move
- Rule: Track remaining items
- Visual: Orange badge shows count
- Create button: Disabled if items remain

**2. Job Empty Check**
- Trigger: When attempting to create jobs
- Rule: Each job must have ≥1 item
- Error: Toast message "Each job must have at least one item"

**3. Job Count Limits**
- Minimum: 2 jobs
- Maximum: 10 jobs
- Remove button: Hidden when at minimum
- Add button: Disabled when at maximum

**4. Field Validations**
- Job name: Max 100 characters (soft limit)
- Notes: Max 500 characters (soft limit)
- Date: No past dates (optional)
- All fields optional except priority (has default)

---

## User Workflows

### Workflow 1: Manual Distribution

1. User arrives from simple job creation screen
2. Page loads with 2 empty job cards
3. User drags "Math Tutoring" to Job 1
4. User drags "Science Tutoring" to Job 1
5. User drags "English Tutoring" to Job 2
6. User drags "Materials" to Job 2
7. User drags "Assessment" to Job 2
8. All items assigned, Create button enables
9. User optionally fills in job details (dates, names)
10. User clicks "Create All Jobs"
11. System creates 2 jobs
12. Success message appears
13. Redirect to job list

**Time:** 2-5 minutes

### Workflow 2: Quick Split Evenly

1. User arrives on split screen
2. User clicks "Split Evenly"
3. System distributes 3 items to Job 1, 2 items to Job 2
4. User reviews distribution
5. User adjusts if needed (drag items between jobs)
6. User fills in job details
7. User clicks "Create All Jobs"
8. Jobs created successfully

**Time:** 1-3 minutes

### Workflow 3: Split by Type

1. User arrives on split screen
2. User clicks "By Type"
3. System creates 3 jobs:
   - Job 1: "Tutoring Services" (3 items)
   - Job 2: "Materials Services" (1 item)
   - Job 3: "Assessment Services" (1 item)
4. User reviews and adjusts
5. User fills in schedules (different dates for each)
6. User clicks "Create All Jobs"
7. Jobs created successfully

**Time:** 2-4 minutes

### Workflow 4: Remove and Redistribute

1. User uses "Split Evenly"
2. User realizes distribution isn't ideal
3. User clicks "Clear All"
4. All items return to available list
5. User manually drags items to preferred jobs
6. User proceeds with creation

**Time:** 3-6 minutes

---

## Data Model

### Job Record Structure

```javascript
{
  id: "job-1",
  name: "Week 1 Tutoring",
  scheduleDate: "2024-11-15",
  scheduleTime: "10:00",
  priority: "medium",
  notes: "Focus on algebra",
  items: [
    {
      id: "item-1",
      name: "Math Tutoring Session",
      description: "2 hours of advanced mathematics tutoring",
      quantity: 1,
      unitPrice: 300,
      total: 300,
      category: "Tutoring"
    }
  ],
  subtotal: 300.00,
  tax: 30.00,
  total: 330.00
}
```

### State Management

```javascript
{
  quoteData: {
    id: "Q-2024-001",
    customer: "Sarah Johnson",
    items: [/* all quote items */]
  },
  availableItems: [/* unassigned items */],
  jobs: [/* job objects */],
  jobCounter: 1 // for generating IDs
}
```

---

## UI States

### Loading State
- Show spinner on "Create All Jobs" button
- Disable all inputs and drag functionality
- Text: "Creating X jobs..."

### Success State
- Green toast: "X jobs created successfully!"
- Redirect to job list after 1.5 seconds

### Error States

**Items Not Assigned:**
- Red toast: "All items must be assigned"
- Highlight remaining count in orange

**Empty Jobs:**
- Red toast: "Each job must have at least one item"
- Highlight empty job cards

**Maximum Jobs:**
- Red toast: "Maximum 10 jobs allowed"
- Disable "Add Job" button

---

## Responsive Design

### Desktop (≥1024px)
- 2-column layout (1/3 + 2/3)
- Left sidebar sticky
- Job cards in single column
- All features visible

### Tablet (768px - 1023px)
- 2-column layout maintained
- Sidebar scrolls with page
- Slightly reduced spacing

### Mobile (<768px)
- Single column layout
- Available items at top (collapsible)
- Job cards stack vertically
- Touch-friendly drag (may need alternative)
- Simplified job configuration

---

## Accessibility

- **Keyboard Navigation:** Tab through all interactive elements
- **Screen Readers:** ARIA labels on drag zones
- **Focus Indicators:** Visible focus states on all inputs
- **Drag Alternative:** Consider "Assign to Job" dropdown for keyboard users
- **Color Contrast:** WCAG AA compliant
- **ARIA Live Regions:** Announce item movements

---

## Performance

- **Page Load:** <1 second
- **Drag Response:** Immediate (<50ms)
- **Re-render:** <100ms after item move
- **Job Creation:** <2 seconds for all jobs

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Drag & Drop API required

---

## Future Enhancements

### Phase 2
- [ ] Bulk select items (checkboxes)
- [ ] "Assign Selected to Job" button
- [ ] Undo/Redo functionality
- [ ] Save draft distribution
- [ ] Templates for common splits

### Phase 3
- [ ] Visual timeline view
- [ ] Team availability integration
- [ ] Smart suggestions based on history
- [ ] Duplicate job configuration
- [ ] Reorder jobs

---

## Comparison: Simple vs Split Mode

| Feature | Simple Mode | Split Mode |
|---------|-------------|------------|
| **Jobs created** | 1 | 2-10 |
| **Item distribution** | All items in one job | Manual distribution |
| **Configuration** | Single form | Multiple job cards |
| **Complexity** | Low | Medium |
| **Time to complete** | 30 seconds | 2-5 minutes |
| **Use case** | 80% of conversions | 20% of conversions |
| **Best for** | Quick job creation | Complex scheduling |
| **Drag & drop** | No | Yes |
| **Quick actions** | No | Yes (Split Evenly, By Type) |

---

## Implementation Notes

### Technical Requirements
- Drag & Drop API
- Real-time calculation
- State management
- Form validation
- Toast notifications

### Dependencies
- TailwindCSS for styling
- Vanilla JavaScript (no framework required)
- Modern browser with Drag & Drop support

### File Structure
```
job_split_items.html          # Main HTML structure
job_split_items_script.js     # JavaScript functionality
JOB_SPLIT_ITEMS_SPEC.md       # This specification
```

---

## Document Version

- **Version:** 1.0
- **Date:** November 6, 2024
- **Status:** Ready for Implementation
- **Related:** JOB_CREATE_SIMPLE_SPEC.md, JOB_CREATE_SCREEN_SPECIFICATION.md
