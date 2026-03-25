# Full FMS Platform: Documentation Implementation Plan

**Objective:** Expand the Business Requirements Documentation (BRD) beyond the operational `Franchisee Site` (Level 4) to cover the structural SaaS platforms driving the entire business model (Level 1-3).

---

## The 4-Tier FMS SaaS Architecture
To correctly document the product, we must logically separate the platform into 4 distinct hierarchical levels. We have completed Level 4, so this execution plan covers documenting Levels 1, 2, and 3.

| Level | Portal Designation | Primary Actor | URL Pattern | Core Function | Documentation Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Level 1** | Super Admin Site | System Administrators | `superadmin.myhappylife.ai` | Global system control and cross-franchise visibility. | **[ To Do : Phase 6 ]** |
| **Level 2** | Franchise-Web | Franchise Owners (Account Holders) | `franchise-web.myhappylife.ai` | Account creation, billing/packages, and global franchise creation. | **[ To Do : Phase 5 ]** |
| **Level 3** | Tenant Site | Franchisor (Brand Manager) | `airservice.myhappylife.ai` | Creating physical locations ("Franchisees") bound by Level 2 package limits. | **[ To Do : Phase 4 ]** |
| **Level 4** | Franchisee Site | Branch Managers & Service Staff | `.../au/sydney` | Daily CRM, Quoting, Invoicing, Jobs, and Timesheets. | ✅ **[ Completed ]** |

---

## Execution Strategy: Writing the Remaining BRDs

Because the fundamental `ACID` (Acceptance Criteria) format was highly successful for Level 4, we will utilize the exact same methodology to write the BRDs for Levels 1 through 3. 

### Phase 4: Tenant Site (The Franchisor Level)
**Focus:** Management of physical branch locations ("Franchisees") under a single brand entity.
*   **Step 1:** Define the Role-Based Access logic for a `Franchisor`.
*   **Step 2: Create User Stories for Core Functionality:**
    *   `TEN-01 (View Franchisees)`: Filtering and tracking health metrics across all active branches.
    *   `TEN-02 (Create Franchisee)`: Form logic to spin up a new branch URL (e.g., `.../au/perth`).
    *   `TEN-03 (Creation Constraint)`: Logic enforcing the maximum amount of created Franchisees based strictly on the Package tier purchased in Level 2.
    *   `TEN-04 (Edit/Delete Franchisee)`: Archiving or modifying branch settings.
*   **Step 3:** Perform live UAT on a specific tenant URL to map UI statuses (Pass/Fail).

### Phase 5: Franchise-Web (The Account/Billing Level)
**Focus:** Commercial billing, package selection, and massive overarching Franchise entities.
*   **Step 1:** Define the User Journey for a brand new enterprise customer purchasing an FMS license.
*   **Step 2: Create User Stories for Core Functionality:**
    *   `WEB-01 (View/Filter Franchises)`: Global dashboard for an owner who might run multiple separate brands (e.g., "AirService" and "WaterService").
    *   `WEB-02 (Create Franchise)`: Instantiating the brand name which subsequently defines the URL string for Level 3 (e.g., generating `water.myhappylife.ai`).
    *   `WEB-03 (Package Selection)`: Upgrading/Downgrading SaaS packages.
    *   `WEB-04 (Subscription Payment)`: Integration of credit card logic to actually pay for the package.
    *   `WEB-05 (Terminate Franchise)`: Logic for halting billing and freezing all descendant Levels 3 and 4.
*   **Step 3:** Perform live UAT on `franchise-web.myhappylife.ai/` tracking payment flow validations.

### Phase 6: Super Admin Site (The Master Root Level)
**Focus:** Total technical system oversight for `myhappylife.ai` engineers and support staff.
*   **Step 1:** Define the ultimate `Super Admin` overriding access boundaries.
*   **Step 2: Create User Stories for Core Functionality:**
    *   `SUP-01 (Global Dashboard)`: Visibility over massive system metrics (e.g., total active franchises globally, total server load).
    *   `SUP-02 (System Overrides)`: Ability to manually unlock billing cycles, suspend malicious accounts, or reset Franchisor passwords.
    *   `SUP-03 (Version Control)`: Push notifications or feature flags deployed globally to all lower levels.
*   **Step 3:** Perform live UAT via `superadmin.myhappylife.ai` using provided standard credentials (`superadmin` / `Bestday@1`).

---

## Next Action Required
To begin executing this plan:
1. Please confirm if you want me to write the formal BRD for **Phase 4 (Tenant Site)** right now.
2. Once the BRD is written, we can immediately UAT test the Tenant limits to verify the system correctly blocks extra branches from being created if they exceed the purchased package limit.
