# User Acceptance Testing (UAT) Feedback & Action Report
**Project:** Franchise Management System (FMS)
**UAT Cycle Dates:** March 13, 2026 – March 23, 2026
**Document Owner:** Business Analysis Team

---

## 1. Executive Summary
This document categorizes the findings from the recent UAT cycle into **Bugs** (system defects) and **Change Requests (CRs)** (scope evolution). Items have been classified by module, current resolution status, and Estimated Effort. 

**Effort Range Key:**
*   **Minor:** < 3 Man-Days
*   **Medium:** 4 to 10 Man-Days
*   **Major:** > 10 Man-Days

---

## 2. UAT Defect (Bug) Log
These items were identified as deviations from the agreed-upon system behavior and represent active bug fixes.

| Module | Issue Description | Expected Resolution | Status | Effort |
| :--- | :--- | :--- | :--- | :--- |
| **Pricebook** | Decimal inability for product pricing. | Round price up to 2 decimals (e.g., $25.10). | ✅ **Deployed to PROD** | Minor |
| **Job Mfg** | Incorrect sessions linked during calendar conversion. | Show franchisee information on preview and email. | ✅ **Fixed on PROD** | Medium |
| **Schedules** | Search filtering system not returning results. | Allow users to filter by staff name or session info. | ✅ **Deployed to PROD** | Medium |
| **System** | SSO functionality broken across web/tenant/unit sites. | Restore Single Sign-On token handling. | ✅ **Deployed to PROD** | Medium |
| **Sessions** | Enrollment slot limits failing for future sessions. | Await cron job execution for slot generation verification. | ⏳ **In Testing** | Minor |

---

## 3. Change Requests (CRs) - Phase 1 Delivery
These Change Requests evolved during UAT and have already been successfully executed and deployed to the Production environment.

| Module | Change Request Description | Status | Actual Effort |
| :--- | :--- | :--- | :--- |
| **Pricebook** | Default 'Service Address' to identical 'Customer Address'. | ✅ **Deployed to PROD** | Minor |
| **Schedules** | Highlight specific Staff Information directly on Session cards. | ✅ **Deployed to PROD** | Minor |
| **System** | Allow Super Admin to view Franchise Unit Lists natively. | ✅ **Deployed to PROD** | Medium |
| **System** | Allow Franchisor to completely customize UI appearance for their Franchisee units. | ✅ **Deployed to PROD** | Medium |

---

## 4. Product Backlog: Next Phase action Plan
The following CRs represent the pipeline for the next major development sprint. They require BA spec-confirmation, client sign-off, or deployment scheduling.

### 4.1 Pricebook & Catalog
| Priority | Change Request | Specification / Action | Status | Effort |
| :--- | :--- | :--- | :--- | :--- |
| **Low** | Enlarge Photo/Instruction Descriptions. | Move description text to preview cards and increase CSS sizing. | 📋 **To Do** | Minor |
| **Low** | Display Tax Info in Item Preview. | Show specific tax category and calculate the final appended tax amount. | 📋 **To Do** | Minor |

### 4.2 Quote & Invoice Management
| Priority | Change Request | Specification / Action | Status | Effort |
| :--- | :--- | :--- | :--- | :--- |
| **Med** | Multi-item expansion for Quotes. | Course/Products allow unlimited items. Subscriptions restricted to 1 item. | 📋 **To Do** | Medium |
| **Med** | Unlocked Quote Editing. | Allow editing on Draft/Sent quotes until explicitly Approved/Rejected. | 📋 **To Do** | Medium |
| **High** | Reconcile Pre-Start Deposits. | Add payment UI to Quote Summary allowing conversion to incomplete jobs. | 📋 **To Do** | Medium |
| **Low** | Lock Subscription Quantity. | Prevent quantity edits (>1) if a Subscription service type is chosen. | 📦 **Ready for PROD** | Minor |
| **Low** | Date Taxonomy Update. | Rename "Service date" to "Start date" on the Quote UI. | 📦 **Ready for PROD** | Minor |
| **Med** | Franchise Branding on Docs. | Add Logo and Franchise Address to Invoice/Quote emails and previews. | 📋 **To Do** (Needs Account # clarity) | Medium |
| **Med** | Lock Payment Configuration. | Prevent altering payment config post-approval. *(Requires Persuasion Session with Client).* | 💬 **Client Clarification** | Medium |
| **Med** | Stripe Credit Card Integration. | Allow franchisee owner to update their active CC. | 💬 **Client Clarification** | TBD |
| **High** | Bank Details missing on Invoices. | Append Bank/Cheque data on preview/email for non-Stripe payment routes. | 🔎 **Spec Confirming** | Medium |
| **Low** | Cash Taxonomy Update. | Append "Bank deposit or cheque" text to Cash payment descriptions. | 📦 **Ready for PROD** | Minor |

### 4.3 Job Management
| Priority | Change Request | Specification / Action | Status | Effort |
| :--- | :--- | :--- | :--- | :--- |
| **High** | Isolate 'Product-Only' Jobs. | Add UI support for Product-Only jobs and create dedicated filtering logic. | 📋 **To Do** | **Major** |
| **High** | Job State Lifecycle mapping. | Add explicit status flags (Complete, Cancel, Pending) strictly for Product-type Jobs. | 📋 **To Do** | **Major** |

### 4.4 Scheduling & Sessions 
| Priority | Change Request | Specification / Action | Status | Effort |
| :--- | :--- | :--- | :--- | :--- |
| **Low** | Future Lesson Color Coding. | Remove inactive grey out; use lighter shade of base color for future slots. | 📦 **Ready for PROD** | Minor |
| **High** | Missing Student Rosters on future sessions. | Currently only visible on generated sessions. Must architect future viewing. | 💬 **Client Clarification** | **Major** |
| **High** | Teacher reallocation locked on future sessions. | Currently only allows swapping staff on actively generated session slots. | 💬 **Client Clarification** | **Major** |

### 4.5 Global / System Extensibility
| Priority | Change Request | Specification / Action | Status | Effort |
| :--- | :--- | :--- | :--- | :--- |
| **Med** | Exact Geographic Coordinates. | Implement third-party Google Maps API to force absolute address matching. | 🔎 **Spec Confirming** | Med-Major |

---
**BA Recommendation for Next Steps:**
1. Focus immediate deployment on the 4 features currently `Ready for PROD`.
2. Schedule a 30-minute alignment call with the Client to clarify the 4 items currently marked `Client Clarification` (especially regarding the locked payment configurations and future-session calendar tracking, as these are Major effort tasks).
