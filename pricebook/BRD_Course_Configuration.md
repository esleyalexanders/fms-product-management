# Business Requirements Document (BRD): Course-Based Learning Services

## 1. Executive Summary
This document outlines the requirements and implementation details for the **Course Configuration** feature. The goal is to enable the sale and scheduling of fixed-volume learning programs (e.g., Bootcamps, Certification Courses) by selecting "Course" as the Package Type.

## 2. Business Objectives
*   **Flexible Inventory**: Support "Course" products where value is defined by total sessions (volume).
*   **Automated Calculation**: Automatically calculate Total Sessions based on "Days per Period" and "Duration".
*   **Simplified Configuration**: Direct configuration based on Package Type (Subscription vs. Course) without an extra "Commitment Type" toggle.

## 3. Scope of Changes

### 3.1 Course Configuration Logic
When `Package Type` is **Course**:
1.  **Recurrence Section**:
    *   **Chosen Period**: Dropdown (Week, Month).
    *   **Days per Chosen Period**: Number (e.g., 4 days/week).
    *   **Duration (Chosen Period)**: Number (e.g., 3 weeks).
    *   *System Calculation*: **Total Sessions** = `Days per Chosen Period` * `Duration (Chosen Period)`.

2.  **Pricing Section**:
    *   **Price Input**: User enters **Price per Session**.
    *   *System Calculation*: **Total Course Price** = `Price per Session` * `Total Sessions`.

### 3.2 Logic Flow Diagram

```mermaid
graph TD
    A[Start: Create Item] --> B{Package Type?}
    
    B -->|Subscription| C[Frequency: Weekly/Monthly]
    
    B -->|Course| D[Period Configuration]
    D --> D1[Select Period: Week/Month]
    D --> D2[Enter Days per Period (e.g., 4)]
    D --> D3[Enter Duration (e.g., 3 Weeks)]
    
    D3 --> E[Calculate Total Sessions]
    E -->|4 * 3 = 12| F[Total Sessions: 12]
    
    F --> G[Pricing]
    G --> G1[Input: Price per Session ($50)]
    G1 --> G2[Calculate Total Price: 12 * 50 = $600]
```

## 4. Key Functional Requirements

| Feature | Description |
| :--- | :--- |
| **Package Type** | Options: "Subscription" (Recurring) vs. "Course" (Fixed Volume). |
| **Course Inputs** | Period Type, Days per Period, Duration. |
| **Auto-Calculation** | Total Sessions and Total Price are auto-calculated read-only fields. |

## 5. Technical Implementation Notes
*   **UI Updates**: Modify `pricebook-create.html` and `pricebook-edit.html`.
*   **Removal**: Remove "Commitment Type" toggle. "Course" is now a top-level Package Type option replacing "Non-subscription".
