# Learning Service & Schedule Management
## Business Requirements Document (BRD)

**Version:** 1.0  
**Date:** December 2025  
**Status:** For Customer Review

---

## 1. Executive Summary

This document outlines the business requirements for the **Learning Service & Schedule Management** feature, which enables businesses to create, schedule, and manage learning services with flexible booking capabilities. A **Learning Service** is the umbrella term for three distinct types: **Class**, **Group**, and **One-to-One**. The system simplifies learning service operations by automating session generation, managing staff assignments, and tracking customer slot inventory.

---

## 2. Business Objectives

| Objective | Description |
|:----------|:------------|
| **Streamline Scheduling** | Automate the creation of recurring learning service sessions to reduce manual effort |
| **Flexible Staff Management** | Support multiple instructors per learning service with easy session-by-session overrides |
| **Accurate Slot Tracking** | Track customer entitlements and remaining slots in real-time |
| **Improve Customer Experience** | Provide clear visibility into available sessions and booking status |
| **Support Multiple Service Types** | Accommodate Class, Group, and One-to-One learning service types with type-specific features |

---

## 3. Key Concepts

### 3.1 Learning Service (Umbrella Term)

A **Learning Service** is a schedulable educational service offering that can be delivered in three different formats:

| Type | Definition | Key Characteristics |
| :--- | :--- | :--- |
| **Class** | A regular, structured course of study with a defined curriculum, fixed start and end dates, and scheduled meetings. | Curriculum-driven, cohort-based, comprehensive content over extended period |
| **Group** | Multiple students (usually 2 or more) learning the same content simultaneously with one instructor. | High student-to-tutor ratio (2+:1), collaborative learning, lower cost per student |
| **One-to-One** | One tutor works exclusively with one student during a session. | 1:1 ratio, highly personalized, targeted instruction, highest cost per session |

**Common Properties (All Types):**
- Linked to a single purchasable product/service (Price Book Item)
- Has a defined recurring schedule (e.g., every Monday, Wednesday at 2 PM)
- Assigned default instructor(s)
- Set maximum capacity per session (always 1 for One-to-One)

**Examples:**
- **Class:** *AP Calculus Class* — Semester-long course with fixed curriculum, offered Mon/Wed/Fri at 2:00 PM
- **Group:** *Math Tutoring Group* — Flexible group sessions for algebra help, offered Tue/Thu at 4:00 PM
- **One-to-One:** *Personalized SAT Prep* — Individual tutoring sessions, scheduled on-demand

---

### 3.2 Learning Service Session
A **Learning Service Session** is a single occurrence of a Learning Service at a specific date and time.

**Key Properties:**
- Auto-generated based on the Learning Service schedule OR manually created
- Inherits default staff from the Learning Service (can be overridden)
- Tracks enrolled customers and available slots
- Type-specific behavior:
  - **Class Sessions:** Part of a structured curriculum progression
  - **Group Sessions:** Can be stand-alone or part of a series
  - **One-to-One Sessions:** Always 1:1 ratio, fully booked with one customer

**Example:** *Advanced Yoga Class on Mon, Dec 8, 2025 at 2:00 PM* — 15/20 slots booked (Class type).

---

### 3.3 Schedule (Recurring Pattern)
The **Schedule** defines when Learning Service Sessions occur automatically.

**Configurable Options:**
- Days of the week (e.g., Monday, Wednesday, Friday)
- Start and end time
- Session duration
- Start date and optional end date for the schedule (required for Class type)

**Example:** Every Tuesday and Thursday from 9:00 AM to 10:30 AM, starting Jan 1, 2025.

---

## 4. Core Business Requirements

### 4.1 Learning Service Management

| Requirement | Description |
|:------------|:------------|
| **Create Learning Service** | Create a new learning service with type selection (Class, Group, or One-to-One), name, description, and skill level |
| **Select Type** | Choose from three types: Class (structured course), Group (multiple students), or One-to-One (1:1 tutoring) |
| **Link to Product** | Each learning service must be linked to exactly one Price Book Item for billing purposes |
| **Define Schedule** | Configure recurring schedule including days, time, and duration |
| **Assign Instructors** | Assign one or more default instructors to the learning service |
| **Set Capacity** | Define maximum number of students per session (always 1 for One-to-One) |
| **Type-Specific Configuration** | Configure type-specific fields: curriculum/cohort dates for Class, min capacity for Group, focus area for One-to-One |

---

### 4.2 Session Scheduling

| Requirement | Description |
|:------------|:------------|
| **Auto-Generation** | System automatically generates sessions weekly based on the learning service schedule |
| **Manual Creation** | Managers can manually create additional sessions as needed |
| **Staff Override** | Override default instructors for specific sessions (e.g., substitutes) |
| **Cancel Sessions** | Cancel individual sessions when needed |
| **Session Status** | Track session status: Scheduled, In Progress, Completed, Cancelled |
| **Type-Specific Handling** | Handle sessions differently based on type: Class sessions follow curriculum, Group sessions require min capacity, One-to-One sessions are always 1:1 |

---

### 4.3 Customer Slot Booking

| Requirement | Description |
|:------------|:------------|
| **Purchase Slots** | Customers purchase learning service slots through quotes/invoices |
| **Aggregate Entitlements** | System totals all purchased slots across customer's quotes |
| **Book into Sessions** | Staff books customers into available sessions |
| **Deduct Slots** | Each booking deducts one slot from customer's available balance |
| **Track Inventory** | View remaining slots per customer at any time |
| **Restore on Cancellation** | Cancelled bookings restore slots to customer |
| **Type-Specific Booking** | One-to-One sessions: Only one customer per session; Group sessions: Multiple customers up to max capacity; Class sessions: Multiple customers within cohort structure |

---

## 5. User Stories

### As a Manager, I want to:
1. **Create a learning service** (Class, Group, or One-to-One) with a recurring schedule so sessions are generated automatically
2. **Select the appropriate type** (Class for structured courses, Group for flexible group sessions, One-to-One for personalized tutoring)
3. **Assign default instructors** so each session has staff assigned by default
4. **Override instructors** for specific sessions when substitutes are needed
5. **View all sessions** in a calendar or list format, with ability to filter by type
6. **Book customers** into sessions and track their remaining slots
7. **Cancel sessions** when needed and notify enrolled customers

### As a Front Desk Staff, I want to:
1. **See upcoming sessions** for today and the week
2. **Check customer slot balance** before booking them
3. **View session details** including enrolled customers and assigned staff

---

## 6. Example Workflow

### Scenario: Customer Miss A Enrolls in Yoga Classes

1. **Purchase:** Miss A purchases 5 slots of "Yoga - Aerobic" across two invoices
   - Invoice 1: 2 slots
   - Invoice 2: 3 slots

2. **Inventory:** System shows Miss A has **5 available slots**

3. **Booking:** Manager books Miss A into 3 upcoming sessions
   - Session 1: Dec 8, 2025
   - Session 2: Dec 10, 2025
   - Session 3: Dec 15, 2025

4. **Balance:** Miss A now has **2 remaining slots** (5 - 3 = 2)

5. **Cancellation:** Session 2 is cancelled due to instructor illness
   - Miss A's balance restored to **3 remaining slots**

---

## 7. Business Rules Summary

| Category | Rule |
|:---------|:-----|
| **Learning Service** | Must be linked to exactly one Price Book Item |
| **Learning Service** | Must have at least one default instructor |
| **Learning Service** | Type must be specified: Class, Group, or One-to-One |
| **Class Type** | Must have curriculum, cohort start date, and cohort end date |
| **Group Type** | Must have minimum capacity defined |
| **One-to-One Type** | Maximum capacity must always be 1 |
| **Schedule** | Must include at least one day of the week |
| **Session** | Cannot be created in the past |
| **Session** | Cannot exceed maximum capacity |
| **Booking** | Customer must have available slots to book |
| **Booking** | Cannot double-book same customer in same session |
| **One-to-One Booking** | Only one customer per session (max capacity = 1) |
| **Slots** | Only deducted from approved quotes |
| **Cancellation** | Restores slots to customer inventory |

---

## 8. Key Benefits

- ✅ **Time Savings** — Automated session generation eliminates repetitive scheduling tasks
- ✅ **Flexibility** — Easy staff overrides handle real-world scheduling changes
- ✅ **Accuracy** — Real-time slot tracking prevents overbooking
- ✅ **Visibility** — Clear calendar views and customer inventory reports
- ✅ **Scalability** — Supports multiple learning services, schedules, and instructors
- ✅ **Versatility** — Supports three distinct service types (Class, Group, One-to-One) with type-specific features

---

## 9. Future Enhancements (Not in Current Scope)

The following features are planned for future releases:
- Customer self-service booking portal
- Automated email/SMS notifications
- Staff availability checking and conflict detection
- Holiday and break schedule exceptions
- Session attendance tracking
- Analytics and reporting dashboard

---

**Document Owner:** Product Management  
**For Questions:** Contact your account representative

