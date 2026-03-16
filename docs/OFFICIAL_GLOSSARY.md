# Official Glossary - FMS Product Management System

**Version:** 1.0  
**Last Updated:** January 12, 2026  
**Purpose:** Standardized terminology for consistent use across all system modules

---

## 📋 Table of Contents

1. [Core Business Entities](#core-business-entities)
2. [People & Roles](#people--roles)
3. [Work & Services](#work--services)
4. [Financial Terms](#financial-terms)
5. [Time & Scheduling](#time--scheduling)
6. [Status & Workflow](#status--workflow)
7. [System & Technical](#system--technical)
8. [UI Components](#ui-components)

---

## 🏢 Core Business Entities

### Customer
**Definition:** An individual or organization that purchases services or products  
**Usage:** Use "Customer" consistently across all modules  
**Avoid:** Client, Buyer, Patron  
**Context:** Customer Management, Quotes, Invoices, Jobs  
**Examples:**
- "Customer Name"
- "Customer List"
- "Customer Details"

### Pricebook
**Definition:** A catalog of services and products offered by the business with pricing  
**Usage:** Always use "Pricebook" as one word (not "Price Book")  
**Avoid:** Catalog, Price List, Service List  
**Context:** Admin module, Quote creation, Invoice creation  
**Examples:**
- "My Pricebook"
- "Pricebook Item"
- "Add to Pricebook"

### Pricebook Item
**Definition:** A single service or product entry in the pricebook  
**Usage:** Use when referring to individual entries  
**Avoid:** Product, Service (when referring to pricebook entries)  
**Context:** Pricebook management  
**Examples:**
- "Create Pricebook Item"
- "Edit Pricebook Item"

---

## 👥 People & Roles

### Staff / Staff Member
**Definition:** An employee or contractor who works for the business  
**Usage:** Use "Staff" or "Staff Member" consistently  
**Avoid:** Employee, Worker, Team Member (except in specific contexts)  
**Context:** Team Management, Timesheets, Job Assignment, Scheduling  
**Examples:**
- "Staff List"
- "Staff Member Details"
- "Assign Staff"
- "Staff Management"

**Note:** "Team Member" may be used in the context of "Manage Team" module for UI consistency, but "Staff" should be used in data fields and technical documentation.

### Team
**Definition:** The collective group of staff members in the organization  
**Usage:** Use when referring to the group collectively  
**Context:** Team Management module  
**Examples:**
- "Manage Team"
- "Team Overview"

### Role
**Definition:** A defined set of permissions and responsibilities assigned to staff  
**Usage:** Use "Role" for permission-based groupings  
**Avoid:** Position, Level, Rank  
**Context:** Permission management, Staff management  
**Examples:**
- "Staff Role"
- "Manage Roles"
- "Role Permissions"

### Job Title
**Definition:** The professional title or position name of a staff member  
**Usage:** Use "Job Title" for the staff member's professional designation  
**Avoid:** Position, Title (alone), Role (when referring to job designation)  
**Context:** Staff profiles, HR management  
**Examples:**
- "Job Title: Tutor"
- "Job Title: Manager"

---

## 💼 Work & Services

### Learning Service
**Definition:** An educational offering that can be of type Class, Group, or One-to-One  
**Usage:** Use "Learning Service" for the parent concept  
**Avoid:** Course, Program, Offering  
**Context:** Service Job v3 module (current/official)  
**Examples:**
- "Learning Service List"
- "Create Learning Service"
- "Learning Service Details"

### Learning Service Types:

#### Class
**Definition:** A curriculum-based learning service with structured lessons  
**Usage:** Use "Class" for structured, curriculum-based services  
**Context:** Learning Services  
**Examples:**
- "Class Type Learning Service"
- "Mathematics Class"

#### Group
**Definition:** A multi-student learning service without formal curriculum  
**Usage:** Use "Group" for informal group sessions  
**Context:** Learning Services  
**Examples:**
- "Group Type Learning Service"
- "Study Group"

#### One-to-One
**Definition:** Private tutoring or individual instruction  
**Usage:** Always hyphenated: "One-to-One"  
**Avoid:** 1-on-1, One on One, Private Session  
**Context:** Learning Services  
**Examples:**
- "One-to-One Type Learning Service"
- "One-to-One Tutoring"

### Session
**Definition:** A single scheduled occurrence of a Learning Service  
**Usage:** Use "Session" for individual scheduled events  
**Avoid:** Class (when referring to a single occurrence), Meeting, Appointment  
**Context:** Learning Services, Scheduling  
**Examples:**
- "Session List"
- "Create Session"
- "Session Details"
- "Upcoming Sessions"

### Job
**Definition:** A work order or service delivery task (legacy term in older modules)  
**Usage:** Use in legacy contexts; prefer "Learning Service" in new development  
**Context:** Job management (legacy modules)  
**Examples:**
- "Job List"
- "Job Details"

---

## 💰 Financial Terms

### Quote
**Definition:** A formal price estimate provided to a customer  
**Usage:** Use "Quote" consistently  
**Avoid:** Estimate, Proposal, Quotation  
**Context:** Quote management, Sales process  
**Examples:**
- "Create Quote"
- "Quote List"
- "Send Quote"

### Invoice
**Definition:** A bill for services rendered or products sold  
**Usage:** Use "Invoice" consistently  
**Avoid:** Bill, Statement  
**Context:** Invoicing, Payments  
**Examples:**
- "Create Invoice"
- "Invoice Details"
- "Invoice List"

### Payment Status
**Definition:** The current state of payment for an invoice or quote  
**Usage:** Use standardized payment status terms  
**Standard Values:**
- "Not Invoiced"
- "Partially Invoiced"
- "Invoiced Unpaid" (or "Unpaid")
- "Partially Paid"
- "Fully Paid" (or "Paid")

**Avoid:** Pending Payment, Awaiting Payment, Complete  
**Context:** Quotes, Invoices, Financial tracking  

### Price / Rate
**Definition:** The monetary amount charged for a service or product  
**Usage:** 
- Use "Price" for products and fixed-cost services
- Use "Rate" for hourly or time-based services  
**Context:** Pricebook, Quotes, Invoices  
**Examples:**
- "Service Price"
- "Hourly Rate"

---

## ⏰ Time & Scheduling

### Timesheet
**Definition:** A record of hours worked by a staff member  
**Usage:** Use "Timesheet" as one word  
**Avoid:** Time Sheet, Time Card, Hours Log  
**Context:** Timesheet management, Payroll  
**Examples:**
- "Timesheet Manager"
- "Submit Timesheet"
- "Timesheet Entry"

### Schedule
**Definition:** A plan of upcoming sessions, jobs, or activities  
**Usage:** Use "Schedule" for planning and calendar views  
**Avoid:** Calendar (when referring to the plan itself), Timetable  
**Context:** Scheduling, Calendar management  
**Examples:**
- "Schedule Calendar"
- "My Schedule"
- "Session Schedule"

### Calendar
**Definition:** A visual representation of scheduled items over time  
**Usage:** Use "Calendar" for the UI component showing dates  
**Context:** Scheduling views  
**Examples:**
- "Schedule Calendar"
- "My Calendar"

### Duration
**Definition:** The length of time for a session or service  
**Usage:** Use "Duration" for time length  
**Avoid:** Length, Time, Period  
**Context:** Sessions, Services, Timesheets  
**Examples:**
- "Session Duration"
- "Duration: 2 hours"

### Estimated Hours (Est. Hrs)
**Definition:** The planned or expected number of hours for a task  
**Usage:** Use "Estimated Hours" or abbreviate as "Est. Hrs"  
**Avoid:** Planned Hours, Expected Hours  
**Context:** Timesheets, Job planning  

### Actual Hours (Act. Hrs)
**Definition:** The real number of hours worked or spent  
**Usage:** Use "Actual Hours" or abbreviate as "Act. Hrs"  
**Avoid:** Real Hours, Worked Hours  
**Context:** Timesheets, Job tracking  

### Final Hours
**Definition:** The approved or confirmed hours for payroll or billing  
**Usage:** Use "Final Hours" for the confirmed amount  
**Context:** Timesheet approval, Payroll  
**Examples:**
- "Final Hours: 8.5"
- "Approve Final Hours"

---

## 🔄 Status & Workflow

### Quote Status
**Standard Values:**
- **Draft** - Quote is being prepared
- **Sent** - Quote has been sent to customer
- **Accepted** - Customer has accepted the quote
- **Declined** - Customer has declined the quote
- **Converted** - Quote has been converted to a job/invoice

**Usage:** Always use these exact terms  
**Avoid:** Pending, In Progress, Approved  

### Timesheet Status
**Standard Values:**
- **Pending** - Awaiting manager review
- **Approved** - Approved by manager
- **Declined** - Rejected by manager

**Usage:** Always use these exact terms  
**Avoid:** Submitted, Rejected, Accepted  

### Learning Service Status
**Standard Values:**
- **Active** - Currently available and running
- **Paused** - Temporarily suspended
- **Archived** - No longer active, historical record

**Usage:** Always use these exact terms  
**Avoid:** Inactive, Disabled, Deleted  

### Staff Status
**Standard Values:**
- **Active** - Currently employed and working
- **Inactive** - No longer active (terminated, on leave, etc.)

**Usage:** Always use these exact terms  
**Avoid:** Enabled/Disabled, Current/Former  

### Pricebook Item Status
**Standard Values:**
- **Published** - Visible and available for use
- **Draft** - Not yet published, in preparation

**Usage:** Always use these exact terms  
**Avoid:** Active/Inactive, Enabled/Disabled  

---

## 🖥️ System & Technical

### Franchisor
**Definition:** The parent company or entity that owns the franchise brand and grants franchise rights to franchisees  
**Usage:** Use "Franchisor" when referring to the brand owner or parent organization  
**Avoid:** Parent Company, Brand Owner, Head Office (in franchise context)  
**Context:** Franchise agreements, System administration, Multi-tenant architecture  
**Examples:**
- "Franchisor Dashboard"
- "Franchisor Settings"
- "Franchisor-level Reports"
- "Managed by Franchisor"

**Note:** The franchisor typically has system-wide administrative access and manages franchise agreements, branding standards, and overall system configuration.

### Franchisee
**Definition:** An individual or entity that has purchased the right to operate a franchise location under the franchisor's brand  
**Usage:** Use "Franchisee" when referring to the franchise owner/operator  
**Avoid:** Franchise Owner, Operator, Licensee  
**Context:** Franchise management, User roles, Permissions  
**Examples:**
- "Franchisee Login"
- "Franchisee Profile"
- "Franchisee Permissions"
- "Franchisee Dashboard"

**Note:** A franchisee operates their own franchise location(s) and has access limited to their own business data and operations.

### Franchise
**Definition:** A business location or branch in the franchise system operated by a franchisee  
**Usage:** Use "Franchise" for individual business units/locations  
**Avoid:** Branch, Location, Store (except in specific branding contexts)  
**Context:** Multi-tenant system, Franchise management  
**Examples:**
- "Franchise Location"
- "Franchise List"
- "Select Franchise"

**Relationship:** Franchisor → Franchisee → Franchise(s)
- One **Franchisor** grants rights to multiple **Franchisees**
- Each **Franchisee** can operate one or more **Franchise** locations

### Tenant
**Definition:** A business entity using the system (technical term)  
**Usage:** Use "Tenant" in technical contexts and backend  
**Avoid:** User, Client, Business  
**Context:** System architecture, Multi-tenancy  

**Note:** In the franchise context, each franchisee's business is a separate tenant in the multi-tenant system.  

### Store
**Definition:** The business name or brand (user-facing term)  
**Usage:** Use "Store" in user-facing contexts  
**Context:** UI branding, User interface  
**Examples:**
- "My Store"
- "Store Name"

### SKU (Stock Keeping Unit)
**Definition:** A unique identifier for a pricebook item  
**Usage:** Always use "SKU" in uppercase  
**Avoid:** Code, ID, Product Code  
**Context:** Pricebook, Inventory  

### Tax
**Definition:** Government-mandated charges on sales  
**Usage:** Use "Tax" with specific type when applicable (e.g., "GST 10%")  
**Context:** Pricebook, Quotes, Invoices  

---

## 🎨 UI Components

### Stat Card / Summary Card
**Definition:** A dashboard widget showing key metrics  
**Usage:** Use "Stat Card" in technical documentation  
**Avoid:** Widget, Metric Card, KPI Card  
**Context:** Dashboard, Analytics  

### Filter
**Definition:** A UI control to narrow down displayed data  
**Usage:** Use "Filter" for data filtering controls  
**Avoid:** Search (when filtering), Refine  
**Context:** List views, Data tables  

### Search
**Definition:** A text input for finding specific items  
**Usage:** Use "Search" for text-based lookups  
**Avoid:** Find, Lookup  
**Context:** List views, Data tables  

### Modal / Dialog
**Definition:** An overlay window for focused interaction  
**Usage:** Use "Modal" in technical contexts  
**Avoid:** Popup, Window, Dialog Box  
**Context:** UI interactions  

### Badge
**Definition:** A small label showing status or category  
**Usage:** Use "Badge" for status indicators  
**Avoid:** Label, Tag, Pill  
**Context:** Status display, Categories  

---

## 📊 Data & Metrics

### Enrollment
**Definition:** The number of students registered for a Learning Service  
**Usage:** Use "Enrollment" for student registration count  
**Avoid:** Registration, Attendance, Participants  
**Context:** Learning Services (Class and Group types only)  
**Note:** One-to-One services do not track enrollment  

### Capacity / Max Capacity
**Definition:** The maximum number of students allowed in a Learning Service  
**Usage:** Use "Capacity" or "Max Capacity"  
**Avoid:** Limit, Maximum, Seats  
**Context:** Learning Services  
**Examples:**
- "Max Capacity: 20"
- "Capacity: 15 students"

### Fill Rate
**Definition:** The percentage of capacity that is enrolled  
**Usage:** Use "Fill Rate" as a percentage  
**Formula:** (Enrollment / Max Capacity) × 100  
**Context:** Learning Services analytics  
**Examples:**
- "Fill Rate: 85%"

---

## 🔑 Key Principles

### 1. Consistency Over Familiarity
Always use the official term, even if another term might be more familiar in certain contexts.

### 2. Singular vs. Plural
- Use **singular** for: entity names, types, statuses
  - Example: "Learning Service Type: Class"
- Use **plural** for: lists, collections, counts
  - Example: "Learning Services List", "Total Sessions: 5"

### 3. Capitalization Rules
- **Title Case:** Page titles, section headers, button labels
  - Example: "Learning Service Details", "Create New Quote"
- **Sentence case:** Descriptions, help text, messages
  - Example: "Select a learning service type to continue"
- **ALL CAPS:** Abbreviations only
  - Example: "SKU", "GST"

### 4. Abbreviations
Only use approved abbreviations:
- **Est. Hrs** - Estimated Hours
- **Act. Hrs** - Actual Hours
- **SKU** - Stock Keeping Unit
- **GST** - Goods and Services Tax

Avoid abbreviating:
- Learning Service (not LS)
- Customer (not Cust.)
- Invoice (not Inv.)

### 5. Hyphenation
- **Always hyphenate:** One-to-One
- **Never hyphenate:** Pricebook, Timesheet
- **Context-dependent:** Follow standard English rules for compound adjectives

---

## 📝 Usage Examples by Module

### Learning Services Module
✅ **Correct:**
- "Learning Services"
- "Create Learning Service"
- "Session List"
- "One-to-One Type"
- "Max Capacity: 15"
- "Fill Rate: 80%"

❌ **Incorrect:**
- "Courses"
- "Add New Course"
- "Class List" (when referring to all types)
- "1-on-1 Type"
- "Maximum: 15"
- "Occupancy: 80%"

### Timesheet Module
✅ **Correct:**
- "Timesheet Manager"
- "Pending Reviews"
- "Est. Hrs: 8.0"
- "Act. Hrs: 7.5"
- "Final Hours: 7.5"
- "Status: Approved"

❌ **Incorrect:**
- "Time Sheet Manager"
- "Pending Approvals"
- "Estimated: 8.0"
- "Actual: 7.5"
- "Billable Hours: 7.5"
- "Status: Accepted"

### Quote Module
✅ **Correct:**
- "Quotes Management"
- "Create New Quote"
- "Quote Status: Sent"
- "Payment Status: Partially Paid"
- "Convert to Job"

❌ **Incorrect:**
- "Quotations Management"
- "New Estimate"
- "Quote Status: Pending"
- "Payment Status: Partial"
- "Create Job"

### Team Management Module
✅ **Correct:**
- "Manage Team"
- "Staff Member"
- "Staff List"
- "Job Title: Tutor"
- "Role: Manager"
- "Status: Active"

❌ **Incorrect:**
- "Manage Staff"
- "Employee"
- "Team Member List"
- "Position: Tutor"
- "Permission Level: Manager"
- "Status: Enabled"

### Pricebook Module
✅ **Correct:**
- "My Pricebook"
- "Pricebook Item"
- "SKU: WC100"
- "Status: Published"
- "Price: $120.00"

❌ **Incorrect:**
- "My Price Book"
- "Service Item"
- "Code: WC100"
- "Status: Active"
- "Cost: $120.00"

---

## 🔄 Migration Notes

### Terms Being Phased Out
The following terms are from legacy modules and should be replaced in new development:

| **Legacy Term** | **Official Term** | **Context** |
|-----------------|-------------------|-------------|
| Job | Learning Service | Service Job v3 |
| Class (standalone) | Learning Service (Class type) | When referring to the service itself |
| Employee | Staff / Staff Member | All contexts |
| Time Sheet | Timesheet | All contexts |
| Price Book | Pricebook | All contexts |
| Estimate | Quote | All contexts |

### Backward Compatibility
- Legacy modules (Class Job v1, Class Job v2) may retain old terminology
- New development should use official glossary terms
- When updating legacy modules, prioritize user-facing terms first

---

## 📚 Related Documents

- `HTML_FILES_INVENTORY.md` - Complete list of system HTML files
- `TERMINOLOGY_CHANGES_RECOMMENDATIONS.md` - Specific change recommendations
- `DURATION_CALCULATION_STANDARD.md` - Time calculation standards
- `ROUNDING_POLICY_FOR_PAYROLL.md` - Payroll rounding rules

---

## ✅ Approval & Maintenance

**Document Owner:** Product Management Team  
**Review Cycle:** Quarterly  
**Last Review:** January 12, 2026  
**Next Review:** April 12, 2026

**Change Request Process:**
1. Submit proposed terminology changes to Product Management
2. Review for consistency and impact
3. Update glossary and notify development team
4. Update affected documentation and code

---

*This glossary is the single source of truth for terminology in the FMS Product Management System. All new development, documentation, and UI text must adhere to these standards.*
