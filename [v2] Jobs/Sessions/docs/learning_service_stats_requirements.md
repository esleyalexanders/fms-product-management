# Learning Service List - Stat Cards Requirements

## Overview
The Learning Service List page displays 7 stat cards organized in 2 rows, providing key metrics about learning services and their sessions.

---

## Row 1: Service Status Overview (4 Cards)

### Stat Card 1: Total Services

**Purpose**: Show the total count of all learning services in the system.

**Calculation**:
- Count all learning services regardless of type or status
- Include: Active, Paused, and Archived services

**Display**:
- Number only (e.g., "15")
- Color: Indigo

---

### Stat Card 2: Active

**Purpose**: Show count of learning services currently active.

**Calculation**:
- Count learning services where:
  - Status = "Active"

**Display**:
- Number only (e.g., "12")
- Color: Emerald/Green (positive indicator)

---

### Stat Card 3: Paused

**Purpose**: Show count of learning services that are paused.

**Calculation**:
- Count learning services where:
  - Status = "Paused"

**Display**:
- Number only (e.g., "2")
- Color: Amber/Orange (warning indicator)

---

### Stat Card 4: Total Sessions

**Purpose**: Show the total count of all sessions across all learning services.

**Calculation**:
- Count all sessions from all learning services
- Include: Scheduled, In Progress, Completed, Cancelled sessions

**Display**:
- Number only (e.g., "48")
- Color: Blue

---

## Row 2: Type Breakdown (3 Cards - Interactive Filters)

### Stat Card 5: Classes

**Purpose**: Show count of Class-type learning services and provide quick filter.

**Calculation**:
- Count learning services where:
  - Type = "Class"
  - All statuses included

**Interaction**:
- Clickable card that filters the list to show only Class-type services
- Hover effect to indicate interactivity

**Display**:
- Large number showing count (e.g., "5")
- Type badge with "Class" label
- Descriptive text: "Curriculum-based courses"
- Color: Purple theme
- Left border accent (4px)

---

### Stat Card 6: Groups

**Purpose**: Show count of Group-type learning services and provide quick filter.

**Calculation**:
- Count learning services where:
  - Type = "Group"
  - All statuses included

**Interaction**:
- Clickable card that filters the list to show only Group-type services
- Hover effect to indicate interactivity

**Display**:
- Large number showing count (e.g., "6")
- Type badge with "Group" label
- Descriptive text: "Multi-student sessions"
- Color: Amber theme
- Left border accent (4px)

---

### Stat Card 7: One-to-One

**Purpose**: Show count of One-to-One type learning services and provide quick filter.

**Calculation**:
- Count learning services where:
  - Type = "One-to-One"
  - All statuses included

**Interaction**:
- Clickable card that filters the list to show only One-to-One type services
- Hover effect to indicate interactivity

**Display**:
- Large number showing count (e.g., "4")
- Type badge with "One-to-One" label
- Descriptive text: "Private tutoring"
- Color: Cyan theme
- Left border accent (4px)

---

## General Rules

1. **Real-time Updates**: All stats should update immediately when:
   - New learning service is created
   - Learning service is edited (type or status changes)
   - Learning service is deleted
   - Sessions are added/removed from any learning service

2. **Filter Independence**: Row 1 stats show ALL services/sessions, not filtered by current search/filter selections

3. **Type Card Filtering**: 
   - Clicking a type card (Row 2) should filter the main list
   - Visual feedback should indicate which filter is active
   - Clicking the same card again should clear the filter

4. **Empty State**: When no learning services exist, all cards show "0"

5. **Layout**: 
   - Row 1: 4-column grid (responsive to 1 column on mobile)
   - Row 2: 3-column grid (responsive to 1 column on mobile)

6. **Performance**: Calculations should be efficient for large datasets (100+ learning services, 500+ sessions)
