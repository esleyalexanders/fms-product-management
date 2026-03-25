# Learning Service Detail - Summary Stats Business Logic

These 5 metrics provide a quick snapshot of a specific learning service's operational status and performance.

## Price Book Item
**"What am I selling?"**

*   **Definition**: The pricebook item that this learning service is linked to.
*   **Business Value**: Shows the product/service offering and pricing model at a glance.
*   **Logic**: Display the name of the associated pricebook item (e.g., "Chemistry Lab - Weekly").
*   **Display**: Highlighted in indigo background for prominence.

---

## 1. Next Session
**"When is my next commitment?"**

*   **Definition**: The date and time of the next upcoming scheduled session.
*   **Business Value**: Immediate action visibility—tells you what's coming up next for this service.
*   **Logic**:
    *   Find the earliest session where:
        *   Session date/time >= Current date/time
        *   Status is NOT 'cancelled' or 'completed'
    *   Display format: `MMM DD, HH:MM AM/PM` (e.g., "Oct 24, 10:00 AM")
*   **Edge Case**: Shows "-" or "No upcoming sessions" if none exist.

---

## 2. Enrollment
**"How many students am I serving?"**

*   **Definition**: The number of currently active students enrolled in this learning service.
*   **Business Value**: Shows current demand and capacity usage for this specific service.
*   **Logic**: Count distinct students with active enrollments/subscriptions for this learning service.
*   **Display**: Number + "Active" label (e.g., "12 Active").

---

## 3. Next 30 Days
**"What's my upcoming workload?"**

*   **Definition**: The number of sessions scheduled in the next 30 days for this learning service.
*   **Business Value**: Short-term planning metric—helps anticipate resource needs.
*   **Logic**:
    *   Count sessions where:
        *   Session date is between Today and Today + 30 days
        *   Status is NOT 'cancelled'
*   **Display**: Number + "Sessions" label (e.g., "4 Sessions").

---

## 4. Est. Revenue
**"How much will this service generate?"**

*   **Definition**: The estimated revenue this learning service will generate in the next 30 days.
*   **Business Value**: Financial projection for this specific service.
*   **Logic**:
    *   Calculate based on pricing model:
        *   **Weekly**: `Weekly Price × (Number of weeks in next 30 days)`
        *   **Monthly**: `Monthly Price × 1`
        *   **Per Session**: `Session Price × Number of sessions in next 30 days`
    *   Sum across all active enrollments for this service.
*   **Display**: Currency format (e.g., "$2,400").
*   **Color**: Emerald/green to indicate positive financial metric.

---

## Summary Purpose

This summary section is designed to answer the key questions a manager has when viewing a learning service:
1. **What** am I selling? (Price Book Item)
2. **When** is the next session? (Next Session)
3. **Who** is enrolled? (Enrollment)
4. **How busy** will I be? (Next 30 Days)
5. **How much** will I earn? (Est. Revenue)

All metrics are **service-specific** (not global) and focus on **actionable, near-term** information rather than historical data.
