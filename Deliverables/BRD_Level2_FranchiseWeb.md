# Business Requirements Document: Level 2 (Franchise-Web)
**Platform Layer:** Franchise Owner (Account/Billing Hub)
**Target URL:** `https://franchise-web.myhappylife.ai/`

---

## 1. Introduction
### 1.1 Executive Summary
The Franchise-Web portal serves as the commercial hub where overarching system Brand Owners (the physical users who pay for the software) log in, manage their enterprise instances (Tenants), and actively select and pay for SaaS subscription packages. 

### 1.2 Stakeholder Profiles & Actors
*   **Account Owner (Actor):** The primary billing user. The `Home` dashboard recognizes this profile specifically (e.g., *Welcome back, User Name!*).

---

## 2. Functional Requirements
### 2.1 Feature Specifications (User Stories)

> **Story (WEB-01 - Home Dashboard View)**
> *As an Account Owner, I want a landing dashboard that prompts me to finish setting up my brands or quickly generate new ones.*
> *   **SC 1 [Functionality]:** The `Home` tab must render a personalized greeting banner alongside a 'Create account' quick-action card.
> *   **SC 2 [Data/Logic]:** The screen must display a contextual "Continue where you left off" data grid mapping previously customized brands.
> *   **SC 3 [Navigation]:** When the user logs into the system, they must natively land directly onto this `Home` dashboard.
> *   **SC 4 [Validation]:** A user must be securely authenticated and logged in to process exactly which tenant instances they have not successfully finished creating.
> *   **SC 5 [Security]:** Information strictly bound to the logged-in session profile.

> **Story (WEB-02 - Franchise Management Directory)**
> *As an Account Owner, I want a global grid mapping every single Brand I own, tracking if their subscription plans are active or pending.*
> *   **SC 1 [Functionality]:** The `Franchise Management` sidebar tab opens a detailed `Tenant Management` datagrid natively linked to the user's root account.
> *   **SC 2 [Data/Logic]:** The table explicitly maps: `Brand Name`, `Contact`, `Franchisees` (numerical active count), `System Status` (Active/Pending), `Subscription Plan` (+ monthly cost), and `Actions`.
> *   **SC 3 [Navigation]:** An explicit 'New Tenant' button on the top right must initiate the creation wizard. The 'Edit' inline action must open the specific tenant settings.
> *   **SC 4 [Validation]:** A "Keyword" search filter and accompanying "Filter/Reset" buttons must successfully parse local records by name.
> *   **SC 5 [Security]:** Distinct horizontal separation from other external account holders.

> **Story (WEB-03 - Choose Subscription Plan)**
> *As an Account Owner, I want to clearly view distinct operational limits and select a billing cycle (Monthly/Annually) before executing a system checkout.*
> *   **SC 1 [Functionality]:** The "Choose Your Subscription Plan" screen must dynamically render cards for all natively available SaaS packages.
> *   **SC 2 [Data/Logic]:** The UI must contain toggle buttons for `Monthly`, `Annually`, and `One Time` pricing structures to dynamically calculate the integer costs.
> *   **SC 3 [Navigation]:** Proceeding to checkout triggers a primary `Pay Now ->` button. Clicking this must explicitly redirect the user away from the FMS to the secure external **Stripe gateway** to configure their payment instrument and register the package.
> *   **SC 4 [Validation]:** Each plan card must visibly lock the package rules visually indicating integer caps for `Max franchisees` and `Max Staff` limits.
> *   **SC 5 [Security]:** Integrating the 'Pay Now' button must securely lock the generated Tenant (`Brand Name`) within the exact constraints of the chosen package, triggering the Tenant's "Active" system status.

> **Story (WEB-04 - Change Plan & View Billing)**
> *As an Account Owner, I want to manage my historical invoices and alter my subscription tiers directly from an existing Tenant's edit page.*
> *   **SC 1 [Functionality]:** The dedicated Tenant `Edit` page must surface active modules/tabs enabling the user to natively `Change Plan` and `View Billing`.
> *   **SC 2 [Data/Logic]:** The UI must reliably map the current active SaaS package associated specifically with this Tenant UUID.
> *   **SC 3 [Navigation]:** Sourcing the `Change Plan` workflow must structurally re-open the pricing tier selection grid mapping (intersecting with WEB-03 logic).
> *   **SC 4 [Validation]:** The system must enforce dynamic availability logic: If currently on a **Franchisor plan**, the user is blocked from choosing `Single store plans` or their current active plan. If currently on a **Single store plan**, the user varies linearly and may explicitly select any available plan *except* their current plan. Upon checkout, the user must pay the full native package price via Stripe. The prior plan is programmatically formally canceled and overwritten *without refund* or proration. 
> *   **SC 5 [Security]:** Modification of a billing state or package limit must physically mandate a sync check against the active Stripe Customer ID to finalize the upgrade/downgrade.
