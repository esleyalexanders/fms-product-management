# Learning Service Fill Rate Logic

The **Fill Rate** represents how efficiently a learning service is utilizing its **total available capacity across all scheduled time slots**.

## 1. Simple Explanation

Think of it like a building with multiple classrooms running simultaneously:
- "Algebra Basics" has **20 seats per session**
- It runs **3 sessions every Monday** (5 PM, 7 PM, 9 PM)
- Total available seats = **20 × 3 = 60**
- If **45 students** are enrolled across all sessions → Fill Rate = **75%**

It answers the question: *"Of all the seats across all scheduled slots, how many are actually taken?"*

---

## 2. Logic & Formula

### Step 1 — Count Enrolled Students
Count confirmed enrollments for the service (students who have an active confirmed enrollment).

### Step 2 — Count Slots
The system reads the service's **schedule configuration** to count distinct time slots:

| Schedule Type | Slot Count Example |
| :--- | :--- |
| Weekly (Mon 5pm, Mon 7pm, Mon 9pm) | 3 slots |
| Daily (9am, 12pm) | 2 slots |
| Monthly (1st Monday 10am) | 1 slot |

### Step 3 — Calculate Total Capacity

$$\text{Total Capacity} = \text{Max Capacity per Slot} \times \text{Slot Count}$$

### Step 4 — Calculate Fill Rate

$$\text{Fill Rate} = \left( \frac{\text{Total Enrolled}}{\text{Total Capacity}} \right) \times 100$$

### Examples

| Service | Max Cap | Slots | Total Capacity | Enrolled | Fill Rate |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Algebra Basics (Class) | 20 | 3 | 60 | 45 | **75%** |
| Music Theory (Group) | 6 | 2 | 12 | 4 | **33%** |
| SAT Prep 1-on-1 | 1 | 5 | 5 | 5 | **100%** |
| New French Class | 15 | 1 | 15 | 0 | **0%** |

> **Why multiply by slot count?**
> Each time slot is independently bookable. A student in the Monday 5 PM slot is a *different* seat from a student in the Monday 7 PM slot. So total revenue potential and utilization must account for all slots.

---

## 3. Performance Color Coding

| Color | Threshold | Business Meaning |
| :--- | :--- | :--- |
| 🟢 **Green** | ≥ 70% | **Healthy** — Service is well-utilized and popular |
| 🟡 **Amber** | 40% – 69% | **Under-utilized** — Consider marketing or schedule changes |
| 🔴 **Red** | < 40% | **Low demand** — Review pricing, timing, or promotion |

---

## 4. Capacity Display in the Service Catalog

When a service has multiple slots, the Capacity column shows the full breakdown:

```
20 × 3 = 60
```

This means: 20 seats per slot × 3 slots = 60 total seats. Single-slot services simply show `Max 20`.

---

## 5. One-to-One Services

For 1:1 private sessions, capacity is always **1 seat per slot**:
- Total Capacity = 1 × slot count
- Each slot is either **Enrolled** (1) or **Available** (1)
- Fill Rate is the % of slots that have an assigned student

---

## 6. Technical Reference

| Property | Value |
| :--- | :--- |
| **Enrolled source** | `service.enrollments[].filter(e => e.status === 'confirmed').length` |
| **Slot count source** | `countSlotsForService(service)` in `learning_service_list_script.js` |
| **Total Capacity** | `service.maxCapacity × slotCount` |
| **Fill Rate formula** | `Math.round((enrolled / totalCapacity) * 100)` |
| **Display location** | `learning_service_list.html` — Capacity column + Fill Rate column |
| **Stats card** | Avg. Fill Rate across all active services |
