# Detailed Requirement Traceability Matrix (RTM)

**Project Name:** Franchise Management System (FMS)  
**Document Context:** Detailed Functional Breakdown for BA Handover & UAT Verification  
**Status Key:** ✅ Completed, ⚠️ Pending, ❌ Failed/Blocked

This matrix proves that all agreed-upon business requirements, across the 9 primary operational areas, have been successfully built and tested in the final system.

---

### 1. Home & Dashboard (`home.html`)
| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **DASH-01** | Display a centralized Home Dashboard showing high-level business metrics. | `home.html` / `home-script.js` | UAT-DASH-01 | ✅ Completed |
| **DASH-02** | Secure navigation sidebar linking to all core functional modules (Quotes, Jobs, Schedule, Timesheets, etc.). | `home.html` (Sidebar UI) | UAT-DASH-02 | ✅ Completed |
| **DASH-03** | Display statistical KPI cards summarizing operations (e.g., active jobs, pending timesheets). | `home-dashboard-stats.js` | UAT-DASH-03 | ✅ Completed |

### 2. Pricebook Management (`pricebook/`)
| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **PB-01** | Ability to view a paginated, search-enabled list of all service/product catalog items. | `pricebook/pricebook.html` | UAT-PB-01 | ✅ Completed |
| **PB-02** | Ability to create new catalog items, defining unit prices, descriptions, and categories. | `pricebook/pricebook-create.html` | UAT-PB-02 | ✅ Completed |
| **PB-03** | Ability to edit existing catalog items to reflect pricing or description updates. | `pricebook/pricebook-edit.html` | UAT-PB-03 | ✅ Completed |
| **PB-04** | Ability to import large pricebook datasets in bulk. | `PRICEBOOK_IMPORT` Module | UAT-PB-04 | ✅ Completed |

### 3. Customer Management (`Customer Management/`)
| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **CUST-01** | Maintain a searchable CRM database of all active and archived customers. | Customer List UI | UAT-CUST-01 | ✅ Completed |
| **CUST-02** | Ability to create new customer profiles, capturing contact and billing information. | Customer Create Form | UAT-CUST-02 | ✅ Completed |
| **CUST-03** | Ability to update or archive existing customer records. | Customer Edit Forms | UAT-CUST-03 | ✅ Completed |

### 4. Manage Team (`manage-team/`)
| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TEAM-01** | Ability for Franchise Managers to view the complete staff roster. | `manage-team/manage-team.html` | UAT-TEAM-01 | ✅ Completed |
| **TEAM-02** | Ability to add new team members, defining their roles and default hourly pay rates. | Team Creation Logic | UAT-TEAM-02 | ✅ Completed |
| **TEAM-03** | Ability to deactivate/reactivate staff members based on employment status. | Team Update Logic | UAT-TEAM-03 | ✅ Completed |

### 5. Quote & Invoice (`[v2] Quotes/`)
| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **QT-01** | Generate distinct Quotes pulling pricing data from the Pricebook. | `quote_simple_create.html` (Implied) | UAT-QT-01 | ✅ Completed |
| **QT-02** | Edit and update Quotes before they are sent or approved by the customer. | `quote_edit_simple.html` | UAT-QT-02 | ✅ Completed |
| **INV-01** | Generate formal Invoices linked to finalized interactions, tracking payment fulfillment. | Invoice Generation Logic | UAT-INV-01 | ✅ Completed |
| **INV-02** | Record payments against Invoices to update their status from Outstanding to Paid. | Payment Record Logic | UAT-INV-02 | ✅ Completed |

### 6. Job Management (`[v2] Jobs/`)
| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **JOB-01** | Convert accepted Quotes into active operational "Jobs". | Quote to Job Conversion | UAT-JOB-01 | ✅ Completed |
| **JOB-02** | Display a master list of all Jobs with filtering by status or client. | `job_list_simple.html` | UAT-JOB-02 | ✅ Completed |
| **JOB-03** | Provide a detailed drilled-down view of a specific Job's requirements and history. | `job_detail_simple.html` | UAT-JOB-03 | ✅ Completed |

### 7. Learning Services, Sessions & Slots (`[v2] Jobs/Sessions/`)
*Note: Terminology mapped as requested (Learning Service = Session Template, Session = Recurrence Series, Session Slots = Individual Instances).*

| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **SES-01** | **Learning Service:** Create base service templates defining the structure and rules of an offering. | Learning Service Setup | UAT-SES-01 | ✅ Completed |
| **SES-02** | **Session (Recurrence):** Generate recurring schedules (e.g., Every Monday for 10 weeks) based on a Learning Service. | Recurrence Configuration | UAT-SES-02 | ✅ Completed |
| **SES-03** | **Session Slots:** Manage the individual generated slots (e.g., "Monday, Oct 2nd Class"), handling staff overrides or cancellations. | Slot Management Logic | UAT-SES-03 | ✅ Completed |
| **SES-04** | Enroll and track specific attendees enrolled in either the Master Session or individual Slots. | Attendee Roster | UAT-SES-04 | ✅ Completed |

### 8. Schedules (`[v2] Jobs/Schedule/`)
| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **SCH-01** | Provide a full calendar view of all upcoming scheduled Session Slots branch-wide. | Franchise Schedule Overview | UAT-SCH-01 | ✅ Completed |
| **SCH-02** | Individualized "My Calendar" view showing only the specific Session Slots assigned to the logged-in staff member. | `my_calendar_script.js` | UAT-SCH-02 | ✅ Completed |

### 9. Timesheet & Payroll Analytics (`Timesheet_manager/`)
| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TS-01** | **Staff View:** Allow staff to view their personal timesheets and submit actual working hours. | `staff_view.html` | UAT-TS-01 | ✅ Completed |
| **TS-02** | **Manager Inbox:** Display an inbox for Managers to review all pending timesheets from staff. | `timesheet_manager_inbox.html` | UAT-TS-02 | ✅ Completed |
| **TS-03** | **Financial Engine:** Auto-calculate total pay (`Actual Hours` * `Hourly Rate`). | `timesheet_data_service.js` | UAT-TS-03 | ✅ Completed |
| **TS-04** | **Discrepancy Alerts:** Visually flag when a staff member submits "Actual Hours" that differ from the Session Slot's "Estimated Hours". | Alert Rendering Logic | UAT-TS-04 | ✅ Completed |
| **TS-05** | **Approvals:** Allow Managers to efficiently Approve or Decline timesheet entries, updating the payroll status. | Manager Actions / Store | UAT-TS-05 | ✅ Completed |

### 10. Platform Administration (System Scope)
| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **USER-01** | Account security management including Changing Passwords, updating profiles, and toggling strict MFA. | `USER_PROFILE` Logic | UAT-USR-01 | ⚠️ Pending |
| **ROLE-01** | Create custom system Roles, assign members, and map specific permissions from the Permission Tree. | `ROLE_PERMISSIONS` Logic | UAT-ROL-01 | ⚠️ Pending |
| **UNIT-01** | Multi-site management enabling the creation, updating, and global viewing of Franchise Tenants. | `UNIT_MANAGEMENT` Core | UAT-UNI-01 | ⚠️ Pending |
| **PAY-01** | Configure and update core Payment Gateway integrations for the branch. | `PAYMENT_CONFIG` Module | UAT-PAY-01 | ⚠️ Pending |

### 11. Extended Sales & Operations (Secondary Scope)
| Req ID | Business Requirement Description | Associated File / Component | UAT Case ID | Status |
| :--- | :--- | :--- | :--- | :--- |
| **QT-04** | Advanced Quote lifecycle actions including Sending to Client, Cloning Quotes, Exporting PDFs, and modifying ad-hoc prices. | `quote_simple` Actions | UAT-QT-04 | ⚠️ Pending |
| **INV-03** | Ability to view historical Payment Logs and securely Cancel previous payments. | `INVOICE_PAYMENT` Engine | UAT-INV-03 | ⚠️ Pending |
| **CUST-04** | Bulk Import and Export of massive Customer CRM datasets via CSV. | `CUSTOMER_IMPORT` Logic | UAT-CUST-04 | ⚠️ Pending |
| **TEAM-04** | Securely view and manually override direct Staff Pay Rates independently of default unit roles. | `TEAM_PAY_RATE` Module | UAT-TEAM-04 | ⚠️ Pending |
| **TS-06** | Export formal timesheet data streams to external banking integrations (Xero/API). | `TIMESHEET_EXPORT` Logic | UAT-TS-06 | ⚠️ Pending |

---
**Verification Statement:**  
*I hereby verify that all core functionalities documented across these 9 critical business areas have been successfully built, mapped to existing code architectures, and verified via UAT.*

**Signed:** __________________________   **(Business Analyst)**
**Date:** ____________________________
