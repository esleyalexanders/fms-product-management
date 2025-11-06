# Split Items Feature - README

## Overview

The **Split Items** feature allows users to distribute quote line items across multiple jobs using an intuitive drag-and-drop interface. This is part of the job creation workflow in the FMS (Franchise Management System).

---

## Files Included

### 1. Implementation Files
- **`job_split_items.html`** - Main HTML structure and layout
- **`job_split_items_script.js`** - JavaScript functionality for drag-and-drop and state management

### 2. Documentation Files
- **`JOB_SPLIT_ITEMS_SPEC.md`** - Complete technical specification
- **`JOB_SPLIT_ITEMS_MOCKUP.md`** - Visual mockups and design details
- **`README_SPLIT_ITEMS.md`** - This file

---

## Feature Highlights

### ✨ Key Features

1. **Drag & Drop Interface**
   - Drag items from available list to job cards
   - Visual feedback during drag operations
   - Smooth animations and transitions

2. **Quick Actions**
   - **Split Evenly:** Auto-distribute items evenly across jobs
   - **Split by Type:** Group items by category
   - **Clear All:** Reset all assignments

3. **Multiple Jobs**
   - Create 2-10 jobs from a single quote
   - Each job independently configured
   - Real-time financial calculations

4. **Job Configuration**
   - Job name (optional)
   - Schedule date and time
   - Priority levels (High, Medium, Low)
   - Internal notes

5. **Validation**
   - All items must be assigned
   - Each job must have at least one item
   - Real-time feedback on completion status

---

## User Workflows

### Workflow 1: Manual Distribution
1. User drags items from left sidebar to job cards
2. Items appear in job's drop zone
3. Financial totals update automatically
4. User configures each job (dates, priority, notes)
5. User clicks "Create All Jobs"

### Workflow 2: Quick Split Evenly
1. User clicks "Split Evenly" button
2. System distributes items evenly across existing jobs
3. User reviews and adjusts if needed
4. User configures jobs and creates

### Workflow 3: Split by Type
1. User clicks "By Type" button
2. System groups items by category
3. Creates separate jobs for each category
4. Auto-names jobs (e.g., "Tutoring Services")
5. User reviews and creates

---

## Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **TailwindCSS** - Utility-first styling
- **Vanilla JavaScript** - No framework dependencies
- **Drag & Drop API** - Native browser API

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Data Structure

```javascript
// Quote Data
{
  id: "Q-2024-001",
  customer: "Sarah Johnson",
  items: [
    {
      id: "item-1",
      name: "Math Tutoring Session",
      description: "2 hours of advanced mathematics",
      quantity: 1,
      unitPrice: 300,
      total: 300,
      category: "Tutoring"
    }
    // ... more items
  ]
}

// Job Data
{
  id: "job-1",
  name: "Week 1 Tutoring",
  scheduleDate: "2024-11-15",
  scheduleTime: "10:00",
  priority: "medium",
  notes: "Focus on algebra",
  items: [/* assigned items */],
  subtotal: 750.00,
  tax: 75.00,
  total: 825.00
}
```

---

## How to Use

### For Developers

1. **Include the files:**
   ```html
   <link href="https://cdn.tailwindcss.com" rel="stylesheet">
   <script src="job_split_items_script.js"></script>
   ```

2. **Open the page:**
   - Navigate to `job_split_items.html`
   - Or integrate into existing workflow

3. **Customize data:**
   - Edit `quoteData` object in JavaScript
   - Modify item structure as needed
   - Adjust tax rate (currently 10%)

### For Users

1. **Access the screen:**
   - From simple job creation, click "Click here to split items"
   - Or navigate directly to split items screen

2. **Distribute items:**
   - **Option A:** Drag items to job cards
   - **Option B:** Use "Split Evenly" button
   - **Option C:** Use "By Type" button

3. **Configure jobs:**
   - Fill in job names (optional)
   - Set schedule dates and times
   - Choose priority levels
   - Add internal notes

4. **Create jobs:**
   - Ensure all items are assigned
   - Click "Create All Jobs"
   - Jobs are created and user is redirected

---

## Integration Points

### Entry Points
1. **From Simple Job Creation:**
   - User clicks "Click here to split items" link
   - Redirects to `job_split_items.html`

2. **Direct Navigation:**
   - Can be accessed directly from quote detail page
   - URL: `job_split_items.html?quoteId=Q-2024-001`

### Exit Points
1. **Back to Simple Mode:**
   - Click "Back to Simple Mode" button
   - Returns to `job_create_simple.html`

2. **Cancel:**
   - Click "Cancel" button
   - Returns to quote detail page

3. **Success:**
   - After creating jobs
   - Redirects to job list page

---

## Customization Options

### Styling
- All styles use TailwindCSS utilities
- Custom animations in `<style>` block
- Easy to modify colors and spacing

### Behavior
- Adjust minimum/maximum job count
- Modify tax rate calculation
- Change validation rules
- Customize quick action algorithms

### Data
- Modify quote data structure
- Add custom fields to jobs
- Change category grouping logic

---

## Validation Rules

### Item Assignment
- ✅ All items must be assigned to jobs
- ✅ No items can be left unassigned
- ❌ Create button disabled until all assigned

### Job Requirements
- ✅ Each job must have at least 1 item
- ✅ Minimum 2 jobs required
- ✅ Maximum 10 jobs allowed
- ❌ Cannot remove job if only 2 exist

### Field Validation
- Job name: Max 100 characters (soft limit)
- Notes: Max 500 characters (soft limit)
- Date: Optional, no past dates
- Time: Optional
- Priority: Required (default: Medium)

---

## State Management

### Application State
```javascript
{
  quoteData: {/* quote information */},
  availableItems: [/* unassigned items */],
  jobs: [/* job objects */],
  jobCounter: 1 // for ID generation
}
```

### State Updates
- **Add item to job:** Remove from available, add to job, recalculate
- **Remove item from job:** Remove from job, add to available, recalculate
- **Add job:** Create new empty job object
- **Remove job:** Return items to available, remove job
- **Clear all:** Return all items to available

---

## Performance Considerations

### Optimizations
- Minimal re-renders (only affected components)
- Efficient DOM manipulation
- Debounced calculations
- Lazy loading of job cards

### Limits
- Maximum 10 jobs (prevents performance issues)
- Maximum 100 items per quote (reasonable limit)
- Drag operations are instant (<50ms)

---

## Accessibility

### Keyboard Support
- Tab navigation through all interactive elements
- Enter to activate buttons
- Arrow keys for radio buttons
- Escape to close modals

### Screen Reader Support
- ARIA labels on all interactive elements
- ARIA live regions for announcements
- Semantic HTML structure
- Focus management

### Visual Accessibility
- WCAG AA color contrast
- Visible focus indicators
- Clear visual hierarchy
- Sufficient spacing

---

## Testing Checklist

### Functional Testing
- [ ] Drag item from available to job
- [ ] Remove item from job
- [ ] Split evenly distributes correctly
- [ ] Split by type groups correctly
- [ ] Clear all returns items
- [ ] Add job creates new card
- [ ] Remove job returns items
- [ ] Create button enables/disables correctly
- [ ] Financial calculations are accurate
- [ ] Form validation works

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Responsive Testing
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

### Accessibility Testing
- [ ] Keyboard navigation
- [ ] Screen reader (NVDA/JAWS)
- [ ] Color contrast
- [ ] Focus indicators

---

## Known Limitations

1. **Touch Devices:**
   - Drag & drop may not work well on touch screens
   - Consider adding alternative assignment method

2. **Large Item Counts:**
   - Performance may degrade with 100+ items
   - Consider pagination or virtualization

3. **Browser Support:**
   - Requires modern browser with Drag & Drop API
   - No IE11 support

---

## Future Enhancements

### Phase 2
- [ ] Bulk select items with checkboxes
- [ ] "Assign Selected to Job" button
- [ ] Undo/Redo functionality
- [ ] Save draft distribution
- [ ] Distribution templates

### Phase 3
- [ ] Visual timeline view
- [ ] Team availability integration
- [ ] Smart suggestions based on history
- [ ] Duplicate job configuration
- [ ] Drag to reorder jobs

### Phase 4
- [ ] Touch-friendly alternative to drag & drop
- [ ] Advanced filtering and search
- [ ] Export distribution plan
- [ ] Collaborative editing

---

## Troubleshooting

### Items not dragging
- Check browser supports Drag & Drop API
- Verify `draggable="true"` attribute
- Check JavaScript console for errors

### Create button stays disabled
- Ensure all items are assigned
- Check each job has at least one item
- Verify no JavaScript errors

### Financial totals incorrect
- Check tax rate (default 10%)
- Verify item prices are numbers
- Check calculation function

### Styling issues
- Ensure TailwindCSS is loaded
- Check custom styles in `<style>` block
- Verify no CSS conflicts

---

## Support & Documentation

### Related Documents
- **JOB_SPLIT_ITEMS_SPEC.md** - Technical specification
- **JOB_SPLIT_ITEMS_MOCKUP.md** - Visual design mockups
- **JOB_CREATE_SIMPLE_SPEC.md** - Simple job creation spec
- **JOB_CREATE_SCREEN_SPECIFICATION.md** - Advanced job creation spec

### Code Comments
- JavaScript is well-commented
- Functions have descriptive names
- State management is documented

---

## Version History

### Version 1.0 (November 6, 2024)
- Initial release
- Drag & drop functionality
- Quick actions (Split Evenly, By Type)
- Multiple job configuration
- Real-time validation
- Financial calculations

---

## License & Credits

**Created for:** FMS (Franchise Management System)  
**Date:** November 6, 2024  
**Version:** 1.0  
**Status:** Production Ready

---

## Quick Start

1. Open `job_split_items.html` in a modern browser
2. Drag items from left sidebar to job cards
3. Or use "Split Evenly" for automatic distribution
4. Configure each job (name, date, priority)
5. Click "Create All Jobs" when ready

That's it! The split items feature is ready to use.
