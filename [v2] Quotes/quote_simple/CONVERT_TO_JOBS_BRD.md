# Business Requirement Document (BRD) - Convert Quote to Jobs Feature

## 1. Overview
The "Convert to Jobs" feature allows users to seamlessly transform approved quote items into actionable Job records. This process bridges the gap between the Sales (Quote) and Operations (Jobs/Sessions) workflows.

## 2. Trigger
The process is initiated from the **Quote Edit/Detail Page** (`quote_edit_simple.html`) by clicking the "Convert to Jobs" button in the header action bar.

## 3. User Interface: Conversion Modal
Upon triggering the action, a modal appears with the following components:

### 3.1. Job Details Confirmation Card
A unified card displaying the essential information for the jobs to be created.
*   **Customer Name**: Read-only field displaying the customer associated with the quote.
*   **Quote Items to Convert**: A list of items from the quote that will be converted into jobs.
    *   Displays Item Name, Package Type, and Service Type.
    *   Displays Quantity (number of jobs to be created) and Unit Price.

### 3.2. Action Options
The user is presented with two distinct paths to proceed:

1.  **Continue to Enroll**
    *   **Description**: Create jobs AND immediately proceed to enroll the customer in sessions.
    *   **Visual**: Highlighted primary action path (e.g., purple styling).
    *   **Outcome**: Jobs are created in the background, the current modal closes, and the "Convert to Sessions" modal opens.

2.  **Create Jobs**
    *   **Description**: Only create the job records now. Linking to sessions can be done later.
    *   **Visual**: Secondary action path (e.g., gray/white styling).
    *   **Outcome**: Jobs are created, the modal closes, a success message is shown, and the user is redirected to the **Job List** to view the newly created jobs.

## 4. Functional Requirements

### 4.1. Validation
*   **Empty Quote Check**: The system must verify that the quote contains at least one line item. If no items exist, an alert is shown, and the modal does not open.

### 4.2. Job Creation Logic
For each line item in the quote, the system creates Job records based on the item's **Quantity**.
*   *Example*: If "Math Tutoring" has a Quantity of 2, two separate Job records are created.

