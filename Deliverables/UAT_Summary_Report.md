# User Acceptance Testing (UAT) Summary & Sign-off Report

**Project Name:** Franchise Management System (FMS)  
**Testing Period:** March 13, 2026 – March 23, 2026
**Prepared By:** Business Analysis Team  
**Target Audience:** Project Sponsors, Client Leads, IT Outsourcing Management

---

## 1. Executive Summary
This document summarizes the outcomes of the User Acceptance Testing (UAT) conducted for the Franchise Management System (FMS). The purpose of UAT was to validate that the delivered software conforms to the expanded **Requirement Traceability Matrix (RTM)** which maps the primary operational areas of the business.

During this cycle, the testing team executed scenarios across the platform. While structural modules passed validation, a set of 5 distinct functionality bugs and several Change Requests (CRs) were identified. Critical bugs and immediate Phase 1 CRs have already been deployed to the Production environment, bringing the software to a stable, sign-off-ready state.

## 2. Defect Management & Status (Bug Log)
These items were identified as deviations from the intended system logic.

| Module | Issue Description | Expected Resolution | Status | Severity/Effort |
| :--- | :--- | :--- | :--- | :--- |
| **Pricebook** | Decimal inability for product pricing. | Round price up to 2 decimals (e.g., $25.10). | ✅ **Deployed to PROD** | Minor |
| **Job Mfg** | Incorrect sessions linked during calendar conversion. | Show franchisee information on preview and email. | ✅ **Fixed on PROD** | Medium |
| **Schedules** | Search filtering system not returning results. | Allow users to filter by staff name or session info. | ✅ **Deployed to PROD** | Medium |
| **System** | SSO functionality broken across web/tenant/unit sites. | Restore Single Sign-On token handling. | ✅ **Deployed to PROD** | Medium |
| **Sessions** | Enrollment slot limits failing for future sessions. | Await cron job execution for slot generation verification. | ⏳ **In Testing** | Minor |

## 3. Change Requests (CRs) Successfully Deployed
These Change Requests reflect scope evolution requested during UAT that have already been developed and pushed to the live environment.

| Module | Change Request Description | Status | Actual Effort |
| :--- | :--- | :--- | :--- |
| **Pricebook** | Default 'Service Address' to identical 'Customer Address'. | ✅ **Deployed to PROD** | Minor |
| **Schedules** | Highlight specific Staff Information directly on Session cards. | ✅ **Deployed to PROD** | Minor |
| **System** | Allow Super Admin to view Franchise Unit Lists natively. | ✅ **Deployed to PROD** | Medium |
| **System** | Allow Franchisor to completely customize UI appearance for their Franchisee units. | ✅ **Deployed to PROD** | Medium |

## 4. Known Issues & Product Backlog (Next Phase Pipeline)
The following functionality upgrades fall outside the immediate handover parameters and are slated for the next development sprint.

**High/Major Priority Pipeline items:**
1.  **Job Management:** Isolate UI logic specifically for 'Product-Only' jobs and define explicit status flags (Complete, Cancel, Pending). *(Expected: Major Effort)*
2.  **Scheduling:** Architectural update to display Student Rosters natively on *future* (non-generated) sessions. *(Client Clarification required - Major Effort)*
3.  **Scheduling:** Allow teacher reallocation on future sessions, rather than just active slots. *(Client Clarification required - Major Effort)*

**Medium Priority Pipeline items:**
*   Add multi-item expansion for Quotes (Unlimited products, 1 subscription).
*   Add Payment execution directly onto Quote Summaries for Pre-Start deposits.
*   Incorporate Franchise branding/logos onto Quote and Invoice emails.
*   Lock payment configurations strictly post-quote-approval.
*   Implement Google Maps API for absolute geographic coordinate matching.

*A total of 18 Change Requests have been officially logged in the backlog for continuous deployment sizing.*

---

## 5. Formal Sign-off and Acceptance

By signing below, the Client acknowledges that:
1. They have reviewed the UAT results tracing back to the major sub-modules of the system.
2. They agree that the Franchise Management System (FMS) Phase 1 delivery meets the mandated business functionality and scope, with logged bugs formally addressed in Section 2.
3. They formally accept the current software build for full production deployment, understanding that the items in Section 4 represent Phase 2/Warranty work.

**For the Client (Acceptance of System):**

**Name:** ___________________________  
**Title:** ____________________________  
**Signature:** ________________________  
**Date:** _____________________________

**For the Service Provider (Handover Representative):**

**Name:** ___________________________  
**Title:** ____________________________  
**Signature:** ________________________  
**Date:** _____________________________
