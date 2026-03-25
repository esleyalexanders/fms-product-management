# BRD Implementation Plan for FMS Project

This plan outlines the strategy to systematically draft, review, and finalize the Business Requirements Documents (BRDs) for all **9 core FMS modules** (Home/Dashboard, Pricebook, Customers, Manage Team, Quote/Invoice, Jobs, Sessions, Schedules, and Timesheets). 

Given the scale of the system, we will use a **Modular BRD Strategy**. Instead of writing one massive, unreadable 200-page document, we will build a Master Template and then execute the BRDs in three logical "Delivery Phanches."

---

## 1. The Standardized BRD Structure
Every BRD we produce will strictly follow this 7-part outline to ensure consistency for the client:
1.  **Executive Summary & Context:** Business Objective (Why) and Project Scope (In/Out of scope).
2.  **Stakeholder Profiles:** Internal (Devs, PMs) vs. Client (Owner, Staff).
3.  **Process Models:** "To-Be" flowcharts validating the new optimized workflow (No "As-Is" required).
4.  **Functional Requirements & User Stories:** Granular requirements formatted as Agile User Stories ("As a... I want to... So that...") mapped directly from the RTM, paired with explicit Success Criteria.
5.  **Non-Functional Requirements:** Security (`permission_tree`), Performance, and Availability.
6.  **Data Requirements & Business Rules:** Data dictionaries and complex logic (e.g., `Total Pay = Actual Hours * Rate`).
7.  **User Interface (UI) Mapping:** A list of the specific `.html` URLs associated with the module functionalities (No screenshots required).

---

## 2. Phased Execution Plan

We will group the 9 modules into three logical "Business Epics" so the client can review them without feeling overwhelmed.

### Phase 1: Core Operations & Catalog (BRD Set 1)
**Focus:** Foundational setup required before any active franchise operations can occur.
*   **Module 1: Pricebook Management** (Focus on catalog structures and bulk importing rules).
*   **Module 2: Customer Management** (Focus on CRM logic and data dictionaries).
*   **Module 3: Manage Team** (Focus on staff profiles, access/roles via `permission_tree`, and default pay rates).
*   **Module 4: Home & Dashboard** (Focus on high-level KPI aggregation from the above data).

### Phase 2: Sales & Financial Pipeline (BRD Set 2)
**Focus:** The money-making workflow—from initial pricing to getting paid.
*   **Module 5: Quote & Invoice** (Focus on the logic of pulling Pricebook items into Quotes, and tracking payment statuses).
*   **Module 6: Job Management** (Focus on the exact business rules of converting an "Approved Quote" into an "Active Job").

### Phase 3: Service Delivery & Payroll (BRD Set 3)
**Focus:** The operational execution of jobs and staff compensation.
*   **Module 7: Learning Services, Sessions & Slots** (Focus on the deep hierarchy: Service Template -> Recurrence Session -> Individual Slot overrides).
*   **Module 8: Schedules** (Focus on Franchise-wide vs. 'My Calendar' UI logic).
*   **Module 9: Timesheet & Business Analytics** (Focus heavily on the complex Business Rules: The Discrepancy Alert logic (`Actual vs Estimated`) and Payroll auto-calculations).

---

## 3. Step-by-Step Task Checklist for the BA

For **each** of the 3 phases above, the Business Analyst will execute the following cycle:

- [ ] **Step 1:** Copy the Master BRD Template into a new document.
- [ ] **Step 2 (The "Why"):** Draft Section 1 (Executive Summary) and Section 2 (Stakeholders) based on the specific module goals.
- [ ] **Step 3 (The Value):** Use a tool (like Draw.io, Mermaid, or Visio) to create the "To-Be" flowchart for Section 3 detailing the new system workflow.
- [ ] **Step 4 (The "What"):** Expand the Req IDs from the `RTM_FMS_Project.md` into Agile User Stories, writing out the exact Success Criteria for each one (Section 4).
- [ ] **Step 5 (The Rules):** Write the specific Data Dictionaries and Mathematical Logic (Section 5 & 6). *Crucial for Timesheets and Quotes.*
- [ ] **Step 6 (The Visuals):** Map the features to their exact `.html` file paths in the codebase (e.g., `timesheet_manager_inbox.html`) for Section 7.
- [ ] **Step 7:** Submit the completed BRD Set to the Client Product Owner for review and sign-off.

---

### Suggested Next Action
Would you like me to generate the **Master BRD Template Document** for you to copy/paste, or should we immediately start drafting the full structured BRD for **Phase 3: Service Delivery (Sessions, Schedules, Timesheets)** since that contains the most complex business logic?
