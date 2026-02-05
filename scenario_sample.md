# Scenario Walkthrough: Multi-Student Enrollment (Fixed Duration)

**Scenario**: A Manager sells the "Advanced Math for 4th Grade" course to a parent (Customer).
*   **Quantity**: 2 (likely for siblings or two spots).
*   **Configuration**: Repeat every week, stop after 12 occurrences.
*   **Payment**: Upfront (Paid in full).

---

## 1. Pre-requisites (System State)

Before the quote is created, the system has:

1.  **Pricebook Item**: "Advanced Math 4th Grade"
    *   `type`: `service`
    *   `recurrence`: `weekly`
    *   `default_duration`: 60 mins
2.  **Existing Sessions (Inventory)**:
    *   **Slot A**: "Mon 5:00 PM Cohort" (Start: Sep 1, Capacity: 5/10)
    *   **Slot B**: "Tue 7:00 PM Cohort" (Start: Sep 2, Capacity: 8/10)

---

## 2. The Quote Stage

**User Action**: Manager creates Quote #Q-1001.
*   **Customer**: Mrs. Anderson.
*   **Line Item**: 
    *   **Item**: Advanced Math 4th Grade
    *   **Quantity**: **2**
    *   **Recurrence**: Repeat every **1 week**
    *   **End Condition**: After **12 occurrences**
    *   **Price**: $500 total ($250 x 2).

**System State**: Quote is Saved. Payment is recorded. Status is `Accepted`.

---

## 3. The Conversion Logic (The Split)

**User Action**: Manager clicks "Convert to Sessions".

**System Logic**:
1.  System checks the Item.
2.  Detects `recurrence` (Weekly) -> Triggers **Enrollment Flow**.
3.  Detects `Qty = 2` -> Triggers **Split Logic**.

**UI Presentation (The Modal)**:
The modal displays **2 distinct allocation rows** for this single line item.

| # | Item Name | Allocation Target (Session) | Status |
| :--- | :--- | :--- | :--- |
| 1 | Adv Math (Unit 1) | `[ Select Session... ]` | Pending |
| 2 | Adv Math (Unit 2) | `[ Select Session... ]` | Pending |

---

## 4. Session Selection & Assignment

**User Action**:
*   For **Row 1**, Manager selects: **"Mon 5:00 PM Cohort"** (Intended for Sibling A).
*   For **Row 2**, Manager selects: **"Tue 7:00 PM Cohort"** (Intended for Sibling B).

**Validation**:
*   System checks availability.
*   Row 1: Slot A has space (5/10). OK.
*   Row 2: Slot B has space (8/10). OK.

**User Action**: Manager clicks **"Confirm & Enroll"**.

---

## 5. Execution (Records Created)

The system generates **2 Jobs** and **2 Enrollments** to track these explicitly.

### Job #1 (For Sibling A)
*   **ID**: `JOB-A1`
*   **Source**: Quote #Q-1001
*   **Target**: Mon 5:00 PM Session
*   **Configuration**: 
    *   `max_occurrences`: **12**
    *   `current_count`: 0
*   **Status**: `Active`

### Enrollment #1 (For Sibling A)
*   **ID**: `ENR-A1`
*   **Student**: Mrs. Anderson (or specific Dependent if supported)
*   **Session**: Mon 5:00 PM
*   **Type**: `Fixed-Term`
*   **EndDate**: *Calculated* (Sep 1 + 12 weeks = Nov 17)

---

### Job #2 (For Sibling B)
*   **ID**: `JOB-B2`
*   **Source**: Quote #Q-1001 (Same source)
*   **Target**: Tue 7:00 PM Session
*   **Configuration**: 
    *   `max_occurrences`: **12**
    *   `current_count`: 0
*   **Status**: `Active`

### Enrollment #2 (For Sibling B)
*   **ID**: `ENR-B2`
*   **Student**: Mrs. Anderson
*   **Session**: Tue 7:00 PM
*   **Type**: `Fixed-Term`
*   **EndDate**: *Calculated* (Sep 2 + 12 weeks = Nov 18)

---

## 6. Lifecycle & Auto-Stop Logic

### Week 1
*   **Mon 5 PM**: Sibling A attends. `JOB-A1.current_count` becomes **1**.
*   **Tue 7 PM**: Sibling B attends. `JOB-B2.current_count` becomes **1**.

### Week 10
*   **Mon 5 PM**: Sibling A attends. `JOB-A1.current_count` becomes **10**.
*   **Tue 7 PM**: Sibling B attends. `JOB-B2.current_count` becomes **10**.

### Week 12 (The Final Week)
*   **Mon 5 PM**: Sibling A attends. 
    *   Logic: `current_count` (11) + 1 = 12.
    *   Check: `12` >= `max_occurrences` (12)? **YES**.
    *   **Action**: 
        1.  Mark `JOB-A1` as **Completed**.
        2.  Mark `ENR-A1` as **Finished**.
        3.  Student removed from future "Mon 5 PM" rosters.

*   **Tue 7 PM**: Sibling B attends.
    *   Logic: `current_count` (11) + 1 = 12.
    *   Check: `12` >= `max_occurrences` (12)? **YES**.
    *   **Action**: 
        1.  Mark `JOB-B2` as **Completed**.
        2.  Mark `ENR-B2` as **Finished**.

### Week 13
*   Neither student appears on the roster. 
*   No billing generated (since it was paid upfront).
*   Process Complete.
