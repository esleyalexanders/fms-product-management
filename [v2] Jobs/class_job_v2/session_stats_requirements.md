# Session List - Stat Cards Requirements

## Overview
The Session List page displays 5 stat cards providing key metrics about sessions across all learning services (Classes, Groups, One-to-One).

---

## Stat Card 1: Total Sessions

**Purpose**: Show the total count of all sessions regardless of status.

**Calculation**:
- Count all sessions in the system
- Include: Scheduled, In Progress, Completed, Cancelled

**Display**:
- Number only (e.g., "24")
- Color: Gray/Neutral

---

## Stat Card 2: Upcoming

**Purpose**: Show count of sessions that are scheduled for the future.

**Calculation**:
- Count sessions where:
  - Status = "Scheduled"
  - Start Date/Time > Current Date/Time

**Display**:
- Number only (e.g., "12")
- Color: Emerald/Green (positive indicator)

---

## Stat Card 3: Today

**Purpose**: Show count of sessions happening today.

**Calculation**:
- Count sessions where:
  - Start Date = Today's Date (regardless of time)
  - Any status (Scheduled, In Progress, Completed)
  - Exclude: Cancelled sessions

**Display**:
- Number only (e.g., "3")
- Color: Indigo/Blue

---

## Stat Card 4: Avg. Enrollment

**Purpose**: Show average enrollment percentage across all applicable sessions.

**Calculation**:
1. For each session with enrollment tracking:
   - Calculate: (Current Enrolled / Max Capacity) × 100
2. Average all enrollment percentages
3. Round to nearest whole number

**Rules**:
- **Include**: Only sessions from learning services that track enrollment (Group, One-to-One)
- **Exclude**: 
  - Class-type sessions (no enrollment tracking)
  - Sessions with Max Capacity = 0
  - Cancelled sessions

**Display**:
- Percentage with "%" symbol (e.g., "67%")
- Color: Purple
- Show "0%" if no applicable sessions exist

---

## Stat Card 5: By Type

**Purpose**: Show breakdown of sessions by learning service type.

**Calculation**:
- Count sessions grouped by learning service type:
  - Class sessions
  - Group sessions  
  - One-to-One sessions
- Include all statuses except Cancelled

**Display**:
- Multi-line text showing counts per type
- Format: "📚 Class: X | 👥 Group: Y | 👤 1-on-1: Z"
- Or stacked format:
  ```
  Class: 10
  Group: 8
  1-on-1: 6
  ```
- Color: Amber/Orange
- Show "-" if no sessions exist

---

## General Rules

1. **Real-time Updates**: All stats should update immediately when:
   - New session is created
   - Session is edited (date, capacity, enrollment changes)
   - Session status changes
   - Session is deleted

2. **Filter Independence**: Stats show ALL sessions, not filtered by current search/filter selections

3. **Empty State**: When no sessions exist, all cards show "0" or appropriate empty value

4. **Performance**: Calculations should be efficient for large datasets (100+ sessions)
