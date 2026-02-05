# Session List - Stat Cards Business Logic

These 4 key metrics are designed to give a high-level overview of business health and operational capacity.

## 1. Weekly Sessions
**"How busy is my week?"**

*   **Definition**: The average number of sessions scheduled per week.
*   **Business Value**: Measures operational volume. Helps in staffing and resource planning.
*   **Logic**:
    *   Count all *future* scheduled sessions for the next 4 weeks.
    *   Divide by 4 to get the weekly average.
    *   *Includes:* Classes, Groups, and One-to-Ones. (Status: Scheduled)

## 2. Active Jobs
**"How many active contracts do I have?"**

*   **Definition**: The total number of currently active subscriptions or enrollments.
*   **Business Value**: The primary driver of recurring revenue. This is your "customer base" size.
*   **Logic**:
    *   Count distinct student subscriptions where:
        *   Status is 'Active'
        *   End Date is either null (ongoing) or in the future.

## 3. Weekly Revenue
**"How much money is coming in per week?"**

*   **Definition**: The projected revenue for the current week based on active jobs.
*   **Business Value**: Short-term financial forecasting.
*   **Logic**:
    *   Sum of (Price per Session × Sessions per Week) for all Active Jobs.
    *   *Calculation:*
        *   For Weekly jobs: `Weekly Price`
        *   For Monthly jobs: `Monthly Price / 4.33`
        *   For Per-Session jobs: `Session Price * Avg Sessions/Week`

## 4. Percentage Fill
**"Am I efficient this week?"**

*   **Definition**: The average capacity utilization across sessions in the upcoming week.
*   **Business Value**: Immediate efficiency metric.
*   **Logic**:
    *   `(Total Enrolled Students / Total Capacity Slots) * 100`
    *   Calculated across all upcoming sessions for the **next 7 days**.
    *   *Excludes* sessions with 0 capacity.
