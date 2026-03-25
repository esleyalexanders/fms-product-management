# Business Requirements Document: Level 1 (Super Admin Site)
**Platform Layer:** System Administration
**Target URL:** `https://superadmin.myhappylife.ai/`

---

## 1. Introduction
### 1.1 Executive Summary
The Super Admin site is the ultimate root level of the FMS ecosystem. It acts as the core administrative control plane where the `myhappylife.ai` engine team explicitly manages other top-level administrators, instantiates or freezes macroscopic brand Tenant ecosystems, and defines the global constraints of the SaaS packages that drive billing down the chain.

---

## 2. Functional Requirements
### 2.1 Feature Specifications (User Stories)

> **Story (SUP-01 - Super Admin Management)**
> *As a Root User, I want to manage the internal administrative accounts that have access to this overarching dashboard so I can strictly control system-level security.*
> *   **SC 1 [Functionality]:** The system shall provide a localized user management screen strictly for `System Administrator` roles under the "Super Admin Management" tab.
> *   **SC 2 [Data/Logic]:** The data table must permanently record and display Username, Full Name, Email, and current active Status.
> *   **SC 3 [Navigation]:** Interaction buttons must include 'Create User' and an 'Edit' action on existing rows.
> *   **SC 4 [Validation]:** Hard deletion of a Super Admin account is blocked at the UI level and must prompt the user that "Delete requires development team assistance."
> *   **SC 5 [Security]:** Extremely restricted to current Master/Root administrative credentials. 

> **Story (SUP-02 - Tenant Management)**
> *As a System Admin, I want to view, track, and manage the top-level Brand accounts (Tenants) so I can control the life cycle of our enterprise clients.*
> *   **SC 1 [Functionality]:** The "Tenant Management" screen must provide full Create, Read, and Update workflows, alongside explicit 'Close Tenant' and 'Suspend Tenant' penalty actions.
> *   **SC 2 [Data/Logic]:** The detailed Edit/Create screen must formally capture four data blocks: Tenant Owner Info (Name, Email), Basic Info (Brand Name, strictly verified Tenant Subdomain string), Contact Info, and Address Info (with a billing default checkout).
> *   **SC 3 [Navigation]:** Interaction with 'Edit' on a grid row explicitly routes the user to the dedicated `Edit Tenant` form. Sticky bottom-action buttons exist for Save, Close, and Suspend.
> *   **SC 4 [Validation]:** Forms must enforce mandatory fields (`*`) preventing the 'Save & Update' button from executing if the Subdomain or Owner arrays are malformed.
> *   **SC 5 [Security]:** 'Close Tenant' and 'Suspend Tenant' actions represent absolute top-level namespace locks restricting lower-level user access, executable strictly by Super Admin.

> **Story (SUP-03 - Service Packages Configuration)**
> *As a System Admin, I want to define and constrain the SaaS licensing packages so that lower-level owners are automatically bound by our pricing architecture.*
> *   **SC 1 [Functionality]:** The system shall contain a "Create service package" wizard split into three structured sections: General Information, Pricing, and Features.
> *   **SC 2 [Data/Logic]:** The General block must capture Business Type, a 'Most popular' UI toggle, and the mandatory `Max Staff Accounts` limit featuring a discrete 'Unlimited' bypass checkbox. 
> *   **SC 3 [Navigation]:** An explicit 'Features' grid must allow the Admin to binary-select specific capabilities unlocked by this tier (e.g., *API access, Custom branding, White-label solution, SLA guarantee*).
> *   **SC 4 [Validation]:** The structural Pricing block supports exact numerical inputs for Monthly, Annual, and One Time Prices, strongly bound to a specific Currency Code dropdown (e.g., AUD). The green 'Save & Create' button evaluates required (`*`) fields prior to compilation.
> *   **SC 5 [Security]:** Creating or modifying a package inherently creates the constraint boundary logic for Level 2 and Level 3 users, gating what the Franchisor is legally permitted to execute in their tenant.
