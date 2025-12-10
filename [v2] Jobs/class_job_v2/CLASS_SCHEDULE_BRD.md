# Class & Schedule Management
## Business Requirements Document (BRD)

**Version:** 1.0  
**Date:** December 2025  
**Status:** For Customer Review

---

## 1. Executive Summary

This document outlines the business requirements for the **Class & Schedule Management** feature, which enables businesses to create, schedule, and manage classes with flexible booking capabilities. The system simplifies class operations by automating session generation, managing staff assignments, and tracking customer slot inventory.

---

## 2. Business Objectives

| Objective | Description |
|:----------|:------------|
| **Streamline Scheduling** | Automate the creation of recurring class sessions to reduce manual effort |
| **Flexible Staff Management** | Support multiple instructors per class with easy session-by-session overrides |
| **Accurate Slot Tracking** | Track customer entitlements and remaining slots in real-time |
| **Improve Customer Experience** | Provide clear visibility into available sessions and booking status |

---

## 3. Key Concepts

### 3.1 Class
A **Class** is a schedulable service offering that serves as the master template for lessons or sessions.

**Key Properties:**
- Linked to a single purchasable product/service (Price Book Item)
- Has a defined recurring schedule (e.g., every Monday, Wednesday at 2 PM)
- Assigned default instructor(s)
- Set maximum capacity per session

**Example:** *Advanced Yoga Class* — offered Mon/Wed/Fri at 2:00 PM, taught by Instructor A.

---

### 3.2 Class Session
A **Class Session** is a single occurrence of a Class at a specific date and time.

**Key Properties:**
- Auto-generated based on the Class schedule OR manually created
- Inherits default staff from the Class (can be overridden)
- Tracks enrolled customers and available slots

**Example:** *Advanced Yoga Class on Mon, Dec 8, 2025 at 2:00 PM* — 15/20 slots booked.

---

### 3.3 Schedule (Recurring Pattern)
The **Schedule** defines when Class Sessions occur automatically.

**Configurable Options:**
- Days of the week (e.g., Monday, Wednesday, Friday)
- Start and end time
- Session duration
- Start date and optional end date for the schedule

**Example:** Every Tuesday and Thursday from 9:00 AM to 10:30 AM, starting Jan 1, 2025.

---

## 4. Core Business Requirements

### 4.1 Class Management

| Requirement | Description |
|:------------|:------------|
| **Create Class** | Create a new class with name, description, and skill level |
| **Link to Product** | Each class must be linked to exactly one Price Book Item for billing purposes |
| **Define Schedule** | Configure recurring schedule including days, time, and duration |
| **Assign Instructors** | Assign one or more default instructors to the class |
| **Set Capacity** | Define maximum number of students per session |

---

### 4.2 Session Scheduling

| Requirement | Description |
|:------------|:------------|
| **Auto-Generation** | System automatically generates sessions weekly based on the class schedule |
| **Manual Creation** | Managers can manually create additional sessions as needed |
| **Staff Override** | Override default instructors for specific sessions (e.g., substitutes) |
| **Cancel Sessions** | Cancel individual sessions when needed |
| **Session Status** | Track session status: Scheduled, In Progress, Completed, Cancelled |

---

### 4.3 Customer Slot Booking

| Requirement | Description |
|:------------|:------------|
| **Purchase Slots** | Customers purchase class slots through quotes/invoices |
| **Aggregate Entitlements** | System totals all purchased slots across customer's quotes |
| **Book into Sessions** | Staff books customers into available sessions |
| **Deduct Slots** | Each booking deducts one slot from customer's available balance |
| **Track Inventory** | View remaining slots per customer at any time |
| **Restore on Cancellation** | Cancelled bookings restore slots to customer |

---

## 5. User Stories

### As a Manager, I want to:
1. **Create a class** with a recurring schedule so sessions are generated automatically
2. **Assign default instructors** so each session has staff assigned by default
3. **Override instructors** for specific sessions when substitutes are needed
4. **View all sessions** in a calendar or list format
5. **Book customers** into sessions and track their remaining slots
6. **Cancel sessions** when needed and notify enrolled customers

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
| **Class** | Must be linked to exactly one Price Book Item |
| **Class** | Must have at least one default instructor |
| **Schedule** | Must include at least one day of the week |
| **Session** | Cannot be created in the past |
| **Session** | Cannot exceed maximum capacity |
| **Booking** | Customer must have available slots to book |
| **Booking** | Cannot double-book same customer in same session |
| **Slots** | Only deducted from approved quotes |
| **Cancellation** | Restores slots to customer inventory |

---

## 8. Key Benefits

- ✅ **Time Savings** — Automated session generation eliminates repetitive scheduling tasks
- ✅ **Flexibility** — Easy staff overrides handle real-world scheduling changes
- ✅ **Accuracy** — Real-time slot tracking prevents overbooking
- ✅ **Visibility** — Clear calendar views and customer inventory reports
- ✅ **Scalability** — Supports multiple classes, schedules, and instructors

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
