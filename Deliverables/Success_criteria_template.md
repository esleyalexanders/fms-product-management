For an IT outsourcing deliverable, a **Success Criteria (SC)** template needs to move away from "wishful thinking" and toward **testable requirements**. If a QA engineer or a Client Lead cannot say "Pass" or "Fail" with 100% certainty, the SC is not ready.

Here is a professional template designed for a Business Analyst:

---

## 1. The "ACID" Template for Success Criteria
Use this structure for every User Story in your final document:

| Component | Description | Example (for DASH-01) |
| :--- | :--- | :--- |
| **Functional Goal** | The "Must-Have" action. | The card displays the total USD value of all "Active" quotes. |
| **Data Logic** | The specific calculation or source. | "Active" = Status is 'Draft' or 'Sent'. Exclude 'Expired'. |
| **UI/UX Rule** | How it looks or navigates. | Clicking the card redirects to the Quotes module with the 'Active' filter applied. |
| **Edge Case** | What happens when data is missing? | If no active quotes exist, the card displays "$0" (not blank). |
| **Permission** | Who can see it? | Only visible to roles: Franchise Manager, Admin. |

---

## 2. Standardized SC Format (Copy-Paste Ready)
When you put this in your **Functional Requirements** or **Jira/Azure DevOps** export, use this format:

> **[Story ID] - [Feature Name]**
>
> **Acceptance Criteria / Success Criteria:**
> * **SC 1 [Functionality]:** The system shall [action] when [trigger].
> * **SC 2 [Data/Logic]:** Values must be calculated based on [specific logic/fields].
> * **SC 3 [Navigation]:** Interaction with [element] must lead to [destination/modal].
> * **SC 4 [Validation]:** Error messages or "Empty States" must appear if [condition].
> * **SC 5 [Security]:** Access is restricted to [User Roles].

---

## 3. Example Applied: Your Dashboard Stories
Let’s transform your draft into the professional template format:

### **DASH-01: Status Cards**
* **SC 1:** Dashboard displays three cards: Active Quotes, Pending Invoices, and Upcoming Sessions.
* **SC 2:** **Active Quotes** value is the sum of `grand_total` for all records where `status` = 'Sent'.
* **SC 3:** **Pending Invoices** count includes all records where `due_date` is < Current Date and `payment_status` = 'Unpaid'.
* **SC 4:** Clicking "View All" opens the respective module in a new tab, pre-filtered to the specific status shown on the card.

### **DASH-03: System Tools (The Branding Feature)**
* **SC 1:** The 'Edit Store' button is only clickable for users with 'Franchise Owner' permissions.
* **SC 2:** Clicking 'Edit Store' opens a side-drawer allowing the upload of `.PNG` or `.JPG` files (Max 5MB).
* **SC 3:** Upon "Save," the new logo must replace the header logo across all system pages without a manual browser refresh.
* **SC 4:** The Notification Bell shows a red badge with a numerical count of "Unread" alerts only.

---

### **BA Delivery Tip**
In your closing document, I highly recommend adding a **"Definition of Done" (DoD)** at the bottom of your SC list. For an IT outsourcing company, the DoD usually includes:
1.  Code is reviewed and merged.
2.  UAT sign-off is attached.
3.  User Manual is updated with the new feature.
4.  No "Critical" or "High" bugs remain open.

**Would you like me to help you create a "Data Mapping Table" for your Dashboard cards so the developers know exactly which database fields to pull?**