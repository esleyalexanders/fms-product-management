# Design Improvement Suggestion for Class/Group/One-to-One Types

## Current Problem

The current design treats "Class", "Group", and "One-to-One" as mutually exclusive types, but according to the definitions:

- **Class** = A structured course/program (curriculum-driven, cohort-based)
- **Group** = Delivery method (multiple students, 2+:1 ratio)  
- **One-to-One** = Delivery method (1:1 ratio)

These are **two different dimensions** that are being conflated:
1. **Structure Type**: Class (structured course) vs Stand-alone Session
2. **Delivery Method**: Group (multiple students) vs One-to-One (1:1)

## Recommended Design Fix

### Option 1: Two Separate Fields (Recommended)

Separate the concerns into two fields:

#### Field 1: Structure Type
- **Label**: "Structure Type" or "Program Type"
- **Options**:
  - `Class` - Structured course with curriculum, fixed dates, cohort-based
  - `Stand-alone Session` - Individual session not part of a structured course

#### Field 2: Delivery Method  
- **Label**: "Delivery Method" or "Session Type"
- **Options**:
  - `Group` - Multiple students (2+ students per instructor)
  - `One-to-One` - One student per instructor

#### Logic:
- If Structure Type = "Class" → Delivery Method can be "Group" or "One-to-One"
- If Structure Type = "Stand-alone Session" → Delivery Method can be "Group" or "One-to-One"

### Option 2: Single Field with Clearer Options (Simpler)

Keep one field but rename and clarify:

#### Field: "Type"
- **Options**:
  - `Class (Group)` - Structured course with multiple students
  - `Class (One-to-One)` - Structured course with one-on-one instruction
  - `Group Session` - Stand-alone session with multiple students
  - `One-to-One Session` - Stand-alone one-on-one session

### Option 3: Primary Type + Secondary Attribute (Hybrid)

#### Field 1: Primary Type (Required)
- `Class` - Structured course/program
- `Session` - Stand-alone session

#### Field 2: Delivery Method (Required, shown conditionally)
- If Type = "Class": Options are `Group` or `One-to-One`
- If Type = "Session": Options are `Group Session` or `One-to-One Session`

## Recommended Implementation: Option 1

### Benefits:
1. **Clear separation of concerns** - Structure vs Delivery
2. **More flexible** - Can combine any structure with any delivery method
3. **Better data model** - Two distinct attributes
4. **Easier filtering** - Can filter by structure OR delivery method independently

### UI Changes Needed:

1. **group_create.html**:
   - Replace single "Type" field with two fields:
     - "Structure Type" (Class / Stand-alone Session)
     - "Delivery Method" (Group / One-to-One)
   - Add conditional logic: Show delivery method field after structure type is selected

2. **group_detail.html**:
   - Update to show both fields
   - Display as: "Class (Group)" or "Stand-alone Session (One-to-One)" etc.

3. **group_list.html**:
   - Update filters to allow filtering by both dimensions
   - Show badges for both: e.g., "Class" badge + "Group" badge

4. **JavaScript Updates**:
   - Update form validation
   - Update data model to store both `structureType` and `deliveryMethod`
   - Update display logic throughout

## Example Data Model

```javascript
{
  id: "CLASS-2024-001",
  name: "AP Calculus Class",
  structureType: "Class",        // or "Stand-alone Session"
  deliveryMethod: "Group",        // or "One-to-One"
  // ... other fields
}
```

## Display Examples

- **Class (Group)**: "AP Calculus Class" - Shows as "Class • Group"
- **Class (One-to-One)**: "Personalized SAT Prep" - Shows as "Class • One-to-One"  
- **Stand-alone Session (Group)**: "Essay Writing Workshop" - Shows as "Session • Group"
- **Stand-alone Session (One-to-One)**: "Math Tutoring" - Shows as "Session • One-to-One"

## Migration Considerations

If you want to keep backward compatibility:
- Map old "Type" values:
  - "Class" → structureType: "Class", deliveryMethod: "Group" (default)
  - "Group" → structureType: "Stand-alone Session", deliveryMethod: "Group"
  - "One-to-One" → structureType: "Stand-alone Session", deliveryMethod: "One-to-One"


