# Session List - Stat Card Calculation Formulas

## 1. Total Sessions

**Formula**: Count of all sessions

---

## 2. Upcoming Sessions

**Formula**: Count sessions where:
- Session date/time >= Current date/time
- Status is NOT 'cancelled'
- Status is NOT 'completed'

---

## 3. Today's Sessions

**Formula**: Count sessions where:
- Session date = Today's date (exact match)
- Status is NOT 'cancelled'

---

## 4. Average Enrollment

**Formula**:
1. Filter sessions with Max Capacity > 0
2. For each session: Calculate (Enrolled / Max Capacity) × 100
3. Sum all enrollment percentages
4. Divide by number of sessions with capacity
5. Round to nearest whole number

**Display**: Percentage with % symbol (e.g., "67%")

**Edge Case**: Returns 0% if no sessions have capacity

---

## 5. Sessions By Type

**Formula**: Count sessions grouped by Learning Service Type:
- Class sessions (Type = 'Class')
- Group sessions (Type = 'Group')
- One-to-One sessions (Type = 'One-to-One')

**Display**: `📚 [Class Count] • 👥 [Group Count] • 👤 [One-to-One Count]`

Example: `📚 5 • 👥 3 • 👤 2`

---

## Important Notes

### Filter Dependency
⚠️ **Current Implementation**: Stats are calculated from filtered sessions, meaning they change based on active search/filter selections.

**Recommended**: Stats should show ALL sessions regardless of filters for consistency with requirements.

### Date/Time Logic
- **Upcoming**: Compares full date and time (future sessions only)
- **Today**: Compares date only (ignores time of day)

### Enrollment Calculation
- Only includes sessions where Max Capacity > 0
- Prevents division by zero errors
- All session types (Class, Group, One-to-One) can have enrollment data
