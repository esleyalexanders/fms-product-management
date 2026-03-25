# FMS Platform: Executive BRD Summary
## Project Profile
*   **Project Name:** Franchise Management System (FMS)
*   **System Architecture:** Cloud-based Multitenant SaaS mapped across 4 distinct hierarchical levels.
*   **Primary Domain Root:** `*.myhappylife.ai`
*   **Target Audience:** System Integrators, Enterprise Investors, Brand Franchisors, and Local Service Staff.
*   **Project Status:** Functional UI/UX established; actively passing internal UAT logic mapping.

---

## Document Index & Reading Guide
Because the software is strictly segregated into four hierarchical tiers, the requirements have been modularized into four distinct Business Requirement Documents (BRDs). 

### Recommended Reading Paths
*   **For Infrastructure Engineers & Investors:** Start at **Level 1** and read *downwards*. This maps how the SaaS billing logic and enterprise constraints are physically engineered.
*   **For Developers, Designers, & Service Managers:** Start entirely at **Level 4 (`BRD_Master_FMS.md`)**. This expansive document maps the daily operational tools, the Sales CRM pipeline, and internal scheduling logic used by actual employees.

| Document Name | Architectural Level | Target Audience | Core Focus |
| :--- | :--- | :--- | :--- |
| **`BRD_Level1_SuperAdmin.md`** | Level 1 (Root) | System Admins | Defining global SaaS constraints and internal portal access. |
| **`BRD_Level2_FranchiseWeb.md`** | Level 2 (Account) | Account Owners | Centralized Subscription selection and Stripe billing loops. | 
| **`BRD_Level3_Tenant.md`** | Level 3 (Franchisor) | Brand Managers | Instantiating/styling physical location branches globally. |
| **`BRD_Master_FMS.md`** | Level 4 (Operations) | Branch Managers | The massive operational Franchisee CRM & Sales Pipeline. |

---

## Architecture Overview
The FMS ecosystem has successfully been fully mapped into a localized **4-Tier SaaS Architectural format**. This multi-level hierarchy ensures complete data security, separating global technical operations from frontline service staff.

The specific documentation for each layer has been rigorously validated via live UAT testing against the actual web environments, removing all unsupported edge-feature assumptions.

---

### Level 1: Super Admin Site
**Document:** `BRD_Level1_SuperAdmin.md`
**URL:** `superadmin.myhappylife.ai`
**Primary Actor:** System Administrator (`myhappylife.ai` internal staff).

This is the ultimate root-level control plane of the architecture. It is strictly used by internal engineers to manage the lifecycle of the actual software platform.
*   **Super Admin Management:** Secure table to Create, Read, and Update the master admins managing the system.
*   **Tenant Management:** A sweeping global overview capable of seeing all active SaaS entities across the globe. Admins can view individual Brand metrics, count active physical franchisees, and legally `Suspend` or `Close` massive corporate tenants if necessary.
*   **Service Package Configuration:** The rule-setting module where engineers build the structure of what a SaaS client buys (e.g., defining how many `Max Staff` or `Max Franchisees` a $99 tier is allowed to contain).

---

### Level 2: Franchise-Web Site
**Document:** `BRD_Level2_FranchiseWeb.md`
**URL:** `franchise-web.myhappylife.ai`
**Primary Actor:** Account Owner (Primary Billing Contact / Investor).

This portal acts as the commercial billing bridge. It is where a large corporate Account Owner (who may own multiple totally different Service Brands) handles their financial liability to `myhappylife.ai`.
*   **Global Dashboard:** A personalized `Home` screen showing incomplete brand deployments.
*   **Franchise Management:** A directory listing every discrete `Brand` (Tenant) the Account Owner has instantiated along with its exact System Status (Active/Pending).
*   **Subscription Architecture:** Full Stripe-enabled checkout queues. Owners select between *Single Store* and *Franchisor* plans, pay standard Monthly/Annual prices, and manage complex system upgrades bounded by strict "No Refund/Proration" logic.

---

### Level 3: Tenant Site 
**Document:** `BRD_Level3_Tenant.md`
**URL:** e.g., `airservice.myhappylife.ai`
**Primary Actor:** Franchisor (Brand Manager).

Once a SaaS package is effectively bought in Level 2, the `Tenant Site` is where that specific Brand Manager actually operates. Their sole focus is the strategic oversight and expansion of physical branches.
*   **"My Franchisees" Grid:** Central UI tracking the deployment status of every child website running globally under this Brand URL.
*   **Environment Creation:** A heavily validated wizard requiring strict Address and Director inputs that spins up new sub-URL namespaces (e.g., `.../au/sydney`).
*   **Theme Control:** The portal acts as a design inheritance node—allowing the Franchisor to upload singular PNG/JPG Logos and Primary Hex Colors that automatically copy downwards into every individual child branch.

---

### Level 4: The Operational Franchisee Site (Master BRD)
**Document:** `BRD_Master_FMS.md` (Formerly distinct Phases 1, 2, and 3).
**URL:** e.g., `.../au/sydney`
**Primary Actor:** Branch Manager, Planners, Service Field Staff.

This massive document represents the actual frontline CRM and daily operational logic for the physical businesses. It successfully consolidates all standard usage rules across three massive operational arcs:
*   **Arc 1 (Core Ops):** The localized branch Dashboard, complex Team visibility (Unit masking/Access roles), and the global Service Pricebook.
*   **Arc 2 (Sales Pipeline):** Advanced logic bridging the CRM creation of Quotes, generating absolute 1-to-1 matched Invoices, and securely transitioning those configurations into actionable live Jobs.
*   **Arc 3 (Service & Execution):** Live management of calendar scheduling, mapping Teachers to recurrent Sessions, and a fully functional Timesheet reporting loop governed by discrepancy verification algorithms.
