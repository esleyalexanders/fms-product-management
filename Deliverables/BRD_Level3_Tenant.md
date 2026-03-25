# Business Requirements Document: Level 3 (Tenant Site)
**Platform Layer:** Franchisor (Brand Manager)
**Target URL:** `https://airservice.myhappylife.ai/`

---

## 1. Introduction
### 1.1 Executive Summary
The Tenant Site (Level 3) serves as the primary management interface for a "Franchisor" or Brand Owner. Once a Brand is established in Level 2, the owner uses this portal to spin up and manage independent physical locations (e.g., the Sydney branch or the Perth branch). It acts as the direct parent to the operational Level 4 dashboard.

### 1.2 Stakeholder Profiles & Actors
*   **Franchisor (Actor):** The brand owner who oversees their individual branch (franchisee) performances and dictates global branding themes.

---

## 2. Functional Requirements
### 2.1 Feature Specifications (User Stories)

> **Story (TEN-01 - My Franchisees Dashboard)**
> *As a Franchisor, I want to view a centralized list of all my physical store locations (Franchisees) so I can verify their deployment status.*
> *   **SC 1 [Functionality]:** The `Home` sidebar tab must load the "My Franchisees" data grid.
> *   **SC 2 [Data/Logic]:** The grid must definitively map the columns: `Name`, `Unit` (the branch shorthand code), `Director` (Name + Email string), `Status`, and `Actions`.
> *   **SC 3 [Navigation]:** Immediate "Keyword" (by name/code), "Email", and "Status" dropdown filters must rest above the table, triggering instantly upon hitting 'Filter'.
> *   **SC 4 [Validation]:** A bright green `Create Franchisee` button must be anchored precisely to the top right of this data view.
> *   **SC 5 [Security]:** The data returned must be strictly bound; a Franchisor can never see branches owned by a different Level 2 Brand.

> **Story (TEN-02 - Create & Edit Franchisee)**
> *As a Franchisor, I want to deploy a new physical location with its own isolated database instance and sub-URL string.*
> *   **SC 1 [Functionality]:** The Create/Edit form must be divided into rigid logical sections: Franchisee Info, Contract Dates, Director Info, and Secondary Contact.
> *   **SC 2 [Data/Logic]:** The form structurally requires the `Unit` branch code (which functions as the URL locator), Country, Address, and a locked 'Director Email' that becomes biologically immutable post-creation.
> *   **SC 3 [Navigation]:** A distinct `Save & Create` button anchors the bottom of the creation workflow, whereas the Edit permutation features a `Save & Update` and a red `Delete` action.
> *   **SC 4 [Validation]:** If an optional "Secondary Contact" is registered, the form logic explicitly requires a 'Relationship' parameter to be selected.
> *   **SC 5 [Security]:** The creation action physically attempts to spin up a descendant Level 4 database schema mapped to this Tenant context.

> **Story (TEN-03 - Theme Customization)**
> *As a Franchisor, I want to upload my corporate logo and brand colors so that all my child franchisees automatically inherit my branding.*
> *   **SC 1 [Functionality]:** The `Settings` sidebar menu natively exposes a "Themes" tab.
> *   **SC 2 [Data/Logic]:** The UX must provide a file upload drag-and-drop zone explicitly bounded to `PNG` or `JPG` formats strictly under 5MB.
> *   **SC 3 [Navigation]:** N/A (Standard binary save).
> *   **SC 4 [Validation]:** A Hex color-picker UI component must allow the overriding of the system's "Primary Color".
> *   **SC 5 [Security]:** Executing the green `Save changes` button securely cascades this new UI constraint down to all Level 4 environments owned by the Tenant.
