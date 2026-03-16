# Demo Scenario: Complete Quote-to-Invoice Workflow
## UAT Testing & Client Demonstration Guide

**Purpose:** This document provides a comprehensive step-by-step scenario for User Acceptance Testing (UAT) and client demonstrations, covering the complete workflow from team setup to invoice generation.

**Estimated Duration:** 45-60 minutes

**Prerequisites:**
- Admin/Franchisee Owner access
- System access with appropriate permissions
- Test data environment ready

---

## Table of Contents
1. [Phase 1: Team Setup & Role Permissions](#phase-1-team-setup--role-permissions)
2. [Phase 2: Pricebook Configuration](#phase-2-pricebook-configuration)
3. [Phase 3: Customer Management](#phase-3-customer-management)
4. [Phase 4: Quote Creation & Email Actions](#phase-4-quote-creation--email-actions)
5. [Phase 5: Invoice Generation & Email Notifications](#phase-5-invoice-generation--email-notifications)
6. [Phase 6: List Management & Bulk Operations](#phase-6-list-management--bulk-operations)
7. [Verification Checklist](#verification-checklist)

---

## Phase 1: Team Setup

### Objective
Set up staff members who will be involved in quote creation and customer management.

### Step 1.1: Navigate to Manage Team
1. **Action:** Log into the system as Admin/Franchisee Owner
2. **Navigation:** Click on "Manage Team" in the sidebar menu
3. **Expected Result:** You should see the Team List page with existing staff members (if any)

### Step 1.2: Create First Staff Member
1. **Action:** Click the "Add Staff" or "+ Add Staff Member" button
2. **Fill Personal Information:**
   - **Full Name:** Sarah Johnson
   - **Email:** sarah.johnson@example.com
   - **Phone:** +61 400 123 456
   - **Date of Birth:** 15/03/1990
   - **Address:** 
     - Street: 123 Collins Street
     - City: Melbourne
     - State: VIC
     - Postal Code: 3000
   - **Profile Photo:** (Optional - upload a test image)

3. **Fill Employment Information:**
   - **Employee ID:** EMP-001
   - **Start Date:** Today's date
   - **Employment Type:** Full-time
   - **Hourly Rate:** $35.00
   - **Role:** Manager (or select from available roles)
   - **Status:** Active

4. **Action:** Click "Save" or "Create Staff"
5. **Expected Result:** 
   - Success message displayed
   - Redirected to Team List
   - Sarah Johnson appears in the staff list

### Step 1.3: Create Second Staff Member (Sales Representative)
1. **Action:** Click "Add Staff" again
2. **Fill Personal Information:**
   - **Full Name:** Michael Chen
   - **Email:** michael.chen@example.com
   - **Phone:** +61 400 789 012
   - **Date of Birth:** 22/07/1995
   - **Address:**
     - Street: 456 Bourke Street
     - City: Melbourne
     - State: VIC
     - Postal Code: 3000

3. **Fill Employment Information:**
   - **Employee ID:** EMP-002
   - **Start Date:** Today's date
   - **Employment Type:** Part-time
   - **Hourly Rate:** $28.00
   - **Role:** Sales Representative (or Receptionist)
   - **Status:** Active

4. **Action:** Click "Save"
5. **Expected Result:** Michael Chen added to staff list

### Step 1.4: Verify Staff Creation
1. **Action:** Review the Team List page
2. **Verify:**
   - Both staff members are visible
   - Status shows as "Active"
   - Contact information is displayed correctly
   - Search functionality works (search by name, email)

---

### **ROLE AND PERMISSION MANAGEMENT**

### Step 1.5: Navigate to Role Management
1. **Action:** Click on "Manage Roles" in the sidebar (usually in footer section) or navigate from Team Management page
2. **Expected Result:** Role Management page displays with list of existing roles

### Step 1.6: View Existing Roles
1. **Action:** Review the roles list
2. **Verify:**
   - Default roles are visible (e.g., Administrator, Manager, Technician, Receptionist)
   - Each role shows assigned staff count
   - Permissions summary is displayed

### Step 1.7: Create Custom Role - Sales Representative
1. **Action:** Click "Create Role" or "+ Add Role" button
2. **Fill Role Information:**
   - **Role Name:** Sales Representative *
   - **Description:** Can create and manage quotes, view customers, but cannot manage staff or approve large quotes
   - **Status:** Active

3. **Configure Permissions:**
   - **Customer Management:**
     - ✓ View Customers
     - ✓ Create Customers
     - ✓ Edit Customers
     - ✗ Delete Customers (unchecked)
   
   - **Quote Management:**
     - ✓ View Quotes
     - ✓ Create Quotes
     - ✓ Edit Quotes (own quotes only)
     - ✓ Send Quotes
     - ✗ Delete Quotes (unchecked)
     - ✗ Approve Quotes (unchecked - requires manager approval)
   
   - **Invoice Management:**
     - ✓ View Invoices
     - ✓ Create Invoices
     - ✗ Delete Invoices (unchecked)
   
   - **Staff Management:**
     - ✗ View Staff (unchecked - no access)
     - ✗ Create Staff (unchecked)
     - ✗ Edit Staff (unchecked)
   
   - **Schedule Management:**
     - ✓ View Schedule (read-only)
     - ✗ Edit Schedule (unchecked)
     - ✗ Assign Jobs (unchecked)

4. **Action:** Click "Save Role" or "Create Role"
5. **Expected Result:**
   - Success message displayed
   - New role appears in roles list
   - Role can be assigned to staff members

### Step 1.8: Assign Role to Staff Member
1. **Action:** Navigate back to Team List
2. **Action:** Click on "Michael Chen" (or click Edit)
3. **Action:** In the staff edit form, find "Role" dropdown
4. **Action:** Select "Sales Representative" from the role list
5. **Action:** Click "Save"
6. **Expected Result:**
   - Michael Chen's role updated to "Sales Representative"
   - Permissions automatically applied based on role

### Step 1.9: Verify Role Permissions
1. **Action:** (Optional) Log in as Michael Chen (or simulate his access level)
2. **Verify:**
   - Can access: Customers, Quotes, Invoices
   - Cannot access: Staff Management, Schedule Editing
   - Quote creation is available
   - Staff management is hidden/restricted

### Step 1.10: Edit Existing Role Permissions
1. **Action:** Navigate back to "Manage Roles"
2. **Action:** Click on "Sales Representative" role to edit
3. **Action:** Modify permissions (e.g., enable "Delete Quotes" permission)
4. **Action:** Click "Save"
5. **Expected Result:**
   - Permissions updated
   - All staff with this role automatically get updated permissions

**✅ Phase 1 Complete:** Team members are set up with proper roles and permissions

---

## Phase 2: Pricebook Configuration

### Objective
Create pricebook items (services/products) that will be used in quotes. This phase covers both **Cleaning Services** and **Tutoring Services**, plus various **Products**.

---

### **CLEANING SERVICES SECTION**

### Step 2.1: Navigate to Pricebook
1. **Action:** Click on "My Pricebook" in the sidebar menu
2. **Expected Result:** Pricebook list page displays (may be empty initially)

### Step 2.2: Create Service Item - Basic Cleaning
1. **Action:** Click "Create Pricebook Item" or "+ Add Item"
2. **Fill Basic Information:**
   - **Type:** Service
   - **SKU/Code:** CLEAN-BASIC-001
   - **Name:** Basic House Cleaning
   - **Description:** Standard house cleaning service including vacuuming, mopping, dusting, and bathroom cleaning
   - **Category:** Cleaning Services

3. **Fill Pricing Information:**
   - **Currency:** AUD ($)
   - **Price:** $150.00
   - **Tax Rate:** 10% (GST)
   - **Unit:** Per Service

4. **Fill Additional Details:**
   - **Duration:** 2 hours
   - **Image:** (Optional - upload cleaning service image)

5. **Action:** Click "Save" or "Create Item"
6. **Expected Result:** 
   - Success message displayed
   - Item appears in pricebook list

### Step 2.3: Create Service Item - Deep Cleaning
1. **Action:** Click "Create Pricebook Item" again
2. **Fill Basic Information:**
   - **Type:** Service
   - **SKU/Code:** CLEAN-DEEP-001
   - **Name:** Deep Cleaning Service
   - **Description:** Comprehensive deep cleaning including inside appliances, windows, baseboards, and detailed scrubbing
   - **Category:** Cleaning Services

3. **Fill Pricing Information:**
   - **Currency:** AUD ($)
   - **Price:** $350.00
   - **Tax Rate:** 10% (GST)
   - **Unit:** Per Service

4. **Fill Additional Details:**
   - **Duration:** 4 hours

5. **Action:** Click "Save"
6. **Expected Result:** Deep Cleaning Service added to pricebook

---

### **TUTORING SERVICES SECTION**

### Step 2.4: Create Service Item - One-on-One Tutoring Session
1. **Action:** Click "Create Pricebook Item"
2. **Fill Basic Information:**
   - **Type:** Service
   - **SKU/Code:** TUTOR-1ON1-001
   - **Name:** One-on-One Tutoring Session
   - **Description:** Individual tutoring session for any subject, personalized learning plan, homework help
   - **Category:** Tutoring Services

3. **Fill Pricing Information:**
   - **Currency:** AUD ($)
   - **Price:** $85.00
   - **Tax Rate:** 10% (GST)
   - **Unit:** Per Hour

4. **Fill Additional Details:**
   - **Duration:** 1 hour (standard session)
   - **Image:** (Optional - upload tutoring service image)

5. **Action:** Click "Save"
6. **Expected Result:** One-on-One Tutoring Session added to pricebook

### Step 2.5: Create Service Item - Group Tutoring Session
1. **Action:** Click "Create Pricebook Item"
2. **Fill Basic Information:**
   - **Type:** Service
   - **SKU/Code:** TUTOR-GROUP-001
   - **Name:** Group Tutoring Session (2-4 students)
   - **Description:** Small group tutoring session for collaborative learning, ideal for exam preparation
   - **Category:** Tutoring Services

3. **Fill Pricing Information:**
   - **Currency:** AUD ($)
   - **Price:** $60.00
   - **Tax Rate:** 10% (GST)
   - **Unit:** Per Hour (per student)

4. **Fill Additional Details:**
   - **Duration:** 1 hour (standard session)

5. **Action:** Click "Save"
6. **Expected Result:** Group Tutoring Session added to pricebook

### Step 2.6: Create Service Item - Exam Preparation Package
1. **Action:** Click "Create Pricebook Item"
2. **Fill Basic Information:**
   - **Type:** Service
   - **SKU/Code:** TUTOR-EXAM-001
   - **Name:** Exam Preparation Package (10 sessions)
   - **Description:** Comprehensive exam preparation package including 10 tutoring sessions, practice tests, and study materials
   - **Category:** Tutoring Services

3. **Fill Pricing Information:**
   - **Currency:** AUD ($)
   - **Price:** $750.00
   - **Tax Rate:** 10% (GST)
   - **Unit:** Per Package

4. **Fill Additional Details:**
   - **Duration:** 10 hours (10 x 1-hour sessions)

5. **Action:** Click "Save"
6. **Expected Result:** Exam Preparation Package added to pricebook

---

### **PRODUCTS SECTION**

### Step 2.7: Create Product Item - Cleaning Supplies Package
1. **Action:** Click "Create Pricebook Item"
2. **Fill Basic Information:**
   - **Type:** Product
   - **SKU/Code:** PROD-CLEAN-001
   - **Name:** Premium Cleaning Supplies Package
   - **Description:** Complete set of eco-friendly cleaning supplies including detergents, sponges, and microfiber cloths
   - **Category:** Products / Cleaning Supplies

3. **Fill Pricing Information:**
   - **Currency:** AUD ($)
   - **Price:** $89.99
   - **Tax Rate:** 10% (GST)
   - **Unit:** Per Package

4. **Action:** Click "Save"
5. **Expected Result:** Cleaning Supplies Package added to pricebook

### Step 2.8: Create Product Item - Textbooks Set
1. **Action:** Click "Create Pricebook Item"
2. **Fill Basic Information:**
   - **Type:** Product
   - **SKU/Code:** PROD-BOOK-001
   - **Name:** Mathematics Textbook Set (Year 10)
   - **Description:** Complete set of Year 10 Mathematics textbooks including workbook and practice exams
   - **Category:** Products / Educational Materials

3. **Fill Pricing Information:**
   - **Currency:** AUD ($)
   - **Price:** $125.00
   - **Tax Rate:** 10% (GST)
   - **Unit:** Per Set

4. **Action:** Click "Save"
5. **Expected Result:** Textbooks Set added to pricebook

### Step 2.9: Create Product Item - Study Materials Kit
1. **Action:** Click "Create Pricebook Item"
2. **Fill Basic Information:**
   - **Type:** Product
   - **SKU/Code:** PROD-STUDY-001
   - **Name:** Study Materials Kit
   - **Description:** Comprehensive study kit including notebooks, pens, highlighters, flashcards, and planner
   - **Category:** Products / Educational Materials

3. **Fill Pricing Information:**
   - **Currency:** AUD ($)
   - **Price:** $45.00
   - **Tax Rate:** 10% (GST)
   - **Unit:** Per Kit

4. **Action:** Click "Save"
5. **Expected Result:** Study Materials Kit added to pricebook

### Step 2.10: Verify Pricebook Items
1. **Action:** Review the Pricebook list
2. **Verify:**
   - All items are visible (3 cleaning services, 3 tutoring services, 3 products = 9 total)
   - Prices display correctly
   - Search functionality works
   - Items can be filtered by type (Service/Product)
   - Items can be filtered by category (Cleaning Services, Tutoring Services, Products)

**✅ Phase 2 Complete:** Pricebook items are ready to be used in quotes. You now have:
- **Cleaning Services:** Basic Cleaning, Deep Cleaning
- **Tutoring Services:** One-on-One, Group Session, Exam Package
- **Products:** Cleaning Supplies, Textbooks, Study Materials

---

## Phase 3: Customer Management

### Objective
Create customer records that will receive quotes and invoices. We'll create **two customers** - one for cleaning services and one for tutoring services.

---

### **CUSTOMER 1: CLEANING SERVICES**

### Step 3.1: Navigate to Customers
1. **Action:** Click on "Customers" in the sidebar menu
2. **Expected Result:** Customer List page displays

### Step 3.2: Create Customer for Cleaning Services
1. **Action:** Click "Create Customer" or "+ Add Customer" button
2. **Fill Basic Information:**
   - **Full Name:** Alice Anderson *
   - **Company Name:** (Leave blank - residential customer)
   - **Role:** Homeowner (Optional)

3. **Fill Contact Information:**
   - **Email:** alice.anderson@email.com *
   - **Phone:** +61 400 555 789 *
   - **Address:**
     - Street: 789 Flinders Street
     - City: Melbourne
     - State: VIC
     - Postal Code: 3000
     - Country: Australia

4. **Add Secondary Contact (Optional):**
   - Click "Add Secondary Contact"
   - **Name:** John Anderson
   - **Email:** john.anderson@email.com
   - **Phone:** +61 400 555 790
   - **Role:** Spouse

5. **Fill Additional Information:**
   - **Customer Notes:** Prefers eco-friendly cleaning products. Available for service on weekends.
   - **Tags:** Residential, Premium Customer (if available)

6. **Action:** Click "Save Customer"
7. **Expected Result:**
   - Success message displayed
   - Redirected to Customer List
   - Alice Anderson appears in customer list

---

### **CUSTOMER 2: TUTORING SERVICES**

### Step 3.3: Create Customer for Tutoring Services
1. **Action:** Click "Create Customer" again
2. **Fill Basic Information:**
   - **Full Name:** David Martinez *
   - **Company Name:** (Leave blank - individual customer)
   - **Role:** Parent/Guardian (Optional)

3. **Fill Contact Information:**
   - **Email:** david.martinez@email.com *
   - **Phone:** +61 400 555 123 *
   - **Address:**
     - Street: 456 Swanston Street
     - City: Melbourne
     - State: VIC
     - Postal Code: 3000
     - Country: Australia

4. **Add Secondary Contact (Optional):**
   - Click "Add Secondary Contact"
   - **Name:** Emma Martinez (Student)
   - **Email:** emma.martinez@email.com
   - **Phone:** +61 400 555 124
   - **Role:** Student

5. **Fill Additional Information:**
   - **Customer Notes:** Student needs help with Year 10 Mathematics. Prefers afternoon sessions after school.
   - **Tags:** Educational, Student (if available)

6. **Action:** Click "Save Customer"
7. **Expected Result:**
   - Success message displayed
   - David Martinez appears in customer list

### Step 3.4: Verify Customer Creation
1. **Action:** Review the Customer List page
2. **Verify:**
   - Both customers are visible (Alice Anderson and David Martinez)
   - All information is saved correctly
   - Secondary contacts are visible (if added)
   - Customers can be edited if needed
   - Search functionality works (search by name, email)

**✅ Phase 3 Complete:** Two customers are ready to receive quotes:
- **Alice Anderson** - for cleaning services
- **David Martinez** - for tutoring services

---

## Phase 4: Quote Creation

### Objective
Create quotes for both customers using pricebook items. We'll create **two quotes** - one for cleaning services and one for tutoring services.

---

### **QUOTE 1: CLEANING SERVICES (Alice Anderson)**

### Step 4.1: Navigate to Quotes
1. **Action:** Click on "Quotes" in the sidebar menu
2. **Expected Result:** Quote List page displays

### Step 4.2: Create New Quote for Cleaning Services
1. **Action:** Click "Create Quote" or "+ New Quote" button
2. **Expected Result:** Quote creation page opens

### Step 4.3: Select Customer (Cleaning)
1. **Action:** In the "Customer" section, click "Select Customer" or search field
2. **Action:** Search for "Alice Anderson" or select from the list
3. **Expected Result:**
   - Customer information populates
   - Customer contact details displayed
   - Option to select quote recipient (Primary or Secondary contact)

4. **Action:** Select "Primary Contact" (Alice Anderson) as quote recipient

### Step 4.4: Add Quote Items (Cleaning Services)
1. **Action:** Navigate to the "Items" or "Add Services" section
2. **Add First Item - Basic Cleaning (Service):**
   - Click "Add Item" or "Browse Catalog"
   - Search for "Basic House Cleaning" or select from catalog
   - **Quantity:** 1
   - **Service Date:** (Optional - select a future date, e.g., next Saturday)
   - **Notes:** (Optional - "Standard weekly cleaning")
   - Item appears in quote items list

3. **Add Second Item - Deep Cleaning (Service):**
   - Click "Add Item" again
   - Search for "Deep Cleaning Service"
   - **Quantity:** 1
   - **Service Date:** (Optional - select a future date)
   - **Notes:** (Optional - "Initial deep clean before regular service")
   - Item appears in quote items list

4. **Add Third Item - Cleaning Supplies (Product):**
   - Click "Add Item"
   - Search for "Premium Cleaning Supplies Package"
   - **Quantity:** 1
   - **Notes:** (Optional - "Eco-friendly supplies as requested")
   - Item appears in quote items list

### Step 4.5: Review Quote Summary (Cleaning)
1. **Action:** Review the quote summary panel (usually on the right side)
2. **Verify Calculations:**
   - **Item 1:** Basic Cleaning: $150.00 + Tax ($15.00) = $165.00
   - **Item 2:** Deep Cleaning: $350.00 + Tax ($35.00) = $385.00
   - **Item 3:** Cleaning Supplies: $89.99 + Tax ($9.00) = $98.99
   - **Subtotal:** $589.99 (150 + 350 + 89.99)
   - **Total Tax:** $59.00 (calculated per item: 15 + 35 + 9)
   - **Grand Total:** $648.99
   - All three items listed correctly

> **⚠️ IMPORTANT NOTE:** Tax is calculated **per item** based on each item's tax rate, not as a flat percentage on the total. This ensures accurate tax reporting.

### Step 4.6: Configure Quote Details (Cleaning)
1. **Action:** Fill in quote configuration:
   - **Valid Until Date:** Select a date 30 days from today
   - **Customer Notes:** "Thank you for choosing our services. This quote is valid for 30 days."
   - **Internal Notes:** (Optional - "Follow up in 1 week if no response")

### Step 4.7: Configure Payment Settings (Cleaning)
1. **Action:** Navigate to "Payment Configuration" tab (usually visible in the quote creation form)
2. **Configure Payment Model:**
   - **Payment Model:** Select "One-Time Payment" or "Full Payment"
   - **Payment Terms:** Net 30 (or as per business rules)
   - **Payment Methods:** Credit Card, Bank Transfer (select available methods)

> **⚠️ NOTE:** If "Payment Configuration" tab is not visible, it may be integrated into the main quote form or available after quote creation.

### Step 4.8: Save and Send Quote (Cleaning)
1. **Action:** Review all information one final time
2. **Action:** Click "Create Quote" or "Save & Send Quote"
3. **Expected Result:**
   - Success message: "Quote created successfully for Alice Anderson!"
   - Quote ID generated (e.g., Q-2024-001)
   - Quote status: "Active" or "Sent"
   - Option to download PDF
   - Option to send via email

4. **Action:** (Optional) Click "Download PDF" to verify quote format
5. **Action:** Click "Send Email" to send quote to customer

### Step 4.8a: Send Quote via Email
1. **Action:** Click "Send Email" button (usually visible after quote creation)
2. **Email Configuration:**
   - **Recipient:** Alice Anderson (alice.anderson@email.com) - pre-filled
   - **Subject:** "Your Quote from [Company Name] - Q-2024-001" (auto-generated)
   - **Message:** (Optional - can customize or use default template)
   - **Attach PDF:** ✓ Checked (default)
   - **Include Portal Link:** ✓ Checked (default)

3. **Action:** Click "Send Email"
4. **Expected Result:**
   - Success message: "Quote email sent successfully to alice.anderson@email.com"
   - Email sent with:
     - Quote details in email body
     - PDF attachment
     - Portal link to view quote online
     - Payment link (if applicable)
   - Email delivery logged in system
   - Quote status may update to "Sent"

5. **Verify Email Delivery (Customer Side):**
   - Customer (Alice Anderson) receives email
   - Email contains professional template with company branding
   - PDF attachment is included
   - "View Quote Online" button/link works
   - Customer can view quote details in email
   - Customer can download PDF from email

---

### **QUOTE 2: TUTORING SERVICES (David Martinez)**

### Step 4.9: Create New Quote for Tutoring Services
1. **Action:** Navigate back to Quote List
2. **Action:** Click "Create Quote" or "+ New Quote" button again
3. **Expected Result:** Quote creation page opens

### Step 4.10: Select Customer (Tutoring)
1. **Action:** In the "Customer" section, search for "David Martinez"
2. **Action:** Select David Martinez from the list
3. **Expected Result:**
   - Customer information populates
   - Customer contact details displayed

4. **Action:** Select "Primary Contact" (David Martinez) as quote recipient

### Step 4.11: Add Quote Items (Tutoring Services + Products)
1. **Action:** Navigate to the "Items" or "Add Services" section
2. **Add First Item - One-on-One Tutoring (Service):**
   - Click "Add Item" or "Browse Catalog"
   - Search for "One-on-One Tutoring Session"
   - **Quantity:** 8 (8 hours of tutoring)
   - **Service Date:** (Optional - select multiple dates or leave blank)
   - **Notes:** (Optional - "Weekly sessions for Mathematics")
   - Item appears in quote items list
   - **Line Total:** $85.00 × 8 = $680.00

3. **Add Second Item - Exam Preparation Package (Service):**
   - Click "Add Item" again
   - Search for "Exam Preparation Package"
   - **Quantity:** 1
   - **Notes:** (Optional - "For Year 10 Mathematics exam")
   - Item appears in quote items list
   - **Line Total:** $750.00

4. **Add Third Item - Textbooks Set (Product):**
   - Click "Add Item"
   - Search for "Mathematics Textbook Set (Year 10)"
   - **Quantity:** 1
   - **Notes:** (Optional - "Required materials for course")
   - Item appears in quote items list
   - **Line Total:** $125.00

5. **Add Fourth Item - Study Materials Kit (Product):**
   - Click "Add Item"
   - Search for "Study Materials Kit"
   - **Quantity:** 1
   - Item appears in quote items list
   - **Line Total:** $45.00

### Step 4.12: Review Quote Summary (Tutoring)
1. **Action:** Review the quote summary panel
2. **Verify Calculations:**
   - **Item 1:** One-on-One Tutoring (8 hrs): $680.00 + Tax ($68.00) = $748.00
   - **Item 2:** Exam Preparation Package: $750.00 + Tax ($75.00) = $825.00
   - **Item 3:** Textbooks Set: $125.00 + Tax ($12.50) = $137.50
   - **Item 4:** Study Materials Kit: $45.00 + Tax ($4.50) = $49.50
   - **Subtotal:** $1,600.00 (680 + 750 + 125 + 45)
   - **Total Tax:** $160.00 (calculated per item: 68 + 75 + 12.50 + 4.50)
   - **Grand Total:** $1,760.00
   - All four items listed correctly (2 services + 2 products)

> **✅ KEY DEMONSTRATION POINT:** This quote shows:
> - **Multiple quantities** of a service (8 hours of tutoring)
> - **Mix of services and products** in one quote
> - **Proper tax calculation** per item type

### Step 4.13: Configure Quote Details (Tutoring)
1. **Action:** Fill in quote configuration:
   - **Valid Until Date:** Select a date 30 days from today
   - **Customer Notes:** "Thank you for choosing our tutoring services. This quote is valid for 30 days. Sessions can be scheduled flexibly."
   - **Internal Notes:** (Optional - "Student needs help with Year 10 Math")

### Step 4.14: Save and Send Quote (Tutoring)
1. **Action:** Click "Create Quote" or "Save & Send Quote"
2. **Expected Result:**
   - Success message: "Quote created successfully for David Martinez!"
   - Quote ID generated (e.g., Q-2024-002)
   - Quote status: "Active" or "Sent"

### Step 4.15: Verify Both Quotes
1. **Action:** Navigate to Quote List
2. **Verify:**
   - **Quote 1:** Alice Anderson - Cleaning Services - $648.99
   - **Quote 2:** David Martinez - Tutoring Services - $1,760.00
   - Both quotes appear in the list
   - Status: Active/Sent
   - Quote IDs are visible

3. **Action:** Click on each quote to view details
4. **Verify:**
   - All items are listed correctly
   - Totals are accurate
   - Customer information is correct
   - Quotes can be edited if needed

**✅ Phase 4 Complete:** Two quotes created successfully:
- **Quote 1:** Cleaning Services (3 items: 2 services + 1 product)
- **Quote 2:** Tutoring Services (4 items: 2 services + 2 products)

---

## Phase 5: Invoice Generation

### Objective
Generate invoices from the approved quote.

### Step 5.1: Navigate to Quote Details
1. **Action:** From Quote List, click on the quote created for Alice Anderson
2. **Expected Result:** Quote detail/edit page opens

### Step 5.2: Review Quote Status
1. **Action:** Check quote status badge
2. **Expected Result:** Status should be "Active", "Approved", or "Accepted" (depending on workflow)

### Step 5.3: Navigate to Invoice Section
1. **Action:** Click on "Invoices" tab (if available) or look for "Create Invoice" button
2. **Expected Result:** Invoice management section displays

### Step 5.4: Generate Full Invoice
1. **Action:** Click "Create Invoice" or "Generate Invoice" button
2. **Expected Result:** Invoice creation page opens with quote information pre-filled

### Step 5.5: Review Invoice Details
1. **Verify Pre-filled Information:**
   - Customer: Alice Anderson
   - Quote ID: (should reference the original quote)
   - Items: All three items from quote should be listed
   - Amounts: Should match quote totals

2. **Review Invoice Configuration:**
   - **Invoice Type:** Full Amount Invoice
   - **Invoice Amount:** $648.99 (should match quote total)
   - **Due Date:** (Default: 30 days from today, or as per payment terms)
   - **Payment Terms:** Net 30 (or configured terms)

### Step 5.6: Configure Invoice Settings
1. **Action:** Review and adjust if needed:
   - **Due Date:** Verify or adjust due date
   - **Invoice Notes:** (Optional - "Payment due within 30 days. Thank you for your business.")
   - **Payment Methods:** Verify available payment methods

### Step 5.7: Create Invoice
1. **Action:** Click "Create Invoice" or "Generate Invoice"
2. **Expected Result:**
   - Success message: "Invoice created successfully!"
   - Invoice ID generated (e.g., INV-2024-001)
   - Invoice status: "Pending" or "Unpaid"
   - Redirected to invoice detail page or invoice list

### Step 5.8: Verify Invoice Creation
1. **Action:** Navigate to "Invoices" section (from main menu or quote detail page)
2. **Verify:**
   - New invoice appears in invoice list
   - Customer: Alice Anderson
   - Amount: $648.99
   - Status: Pending/Unpaid
   - Due Date: Correct
   - Invoice ID visible

3. **Action:** Click on the invoice to view details
4. **Verify:**
   - All items from quote are included
   - Subtotal: $589.99
   - Tax: $59.00
   - Total: $648.99
   - Customer information correct
   - Payment terms displayed
   - Option to download PDF
   - Option to send via email

### Step 5.9: Generate Partial Invoice (Alternative Scenario)
1. **Action:** Go back to quote detail page (Alice Anderson's cleaning quote)
2. **Action:** Click "Create Invoice" again
3. **Action:** Select "Partial Invoice" option (if available)
4. **Action:** Select specific items to invoice:
   - Select only "Basic House Cleaning" ($150.00)
   - Select "Premium Cleaning Supplies Package" ($89.99)
   - **Calculation:**
     - Item 1: $150.00 + Tax ($15.00) = $165.00
     - Item 2: $89.99 + Tax ($9.00) = $98.99
     - **Subtotal:** $239.99
     - **Total Tax:** $24.00 (15 + 9)
     - **Total:** $263.99

> **⚠️ IMPORTANT:** Tax must be calculated per item, not as a flat rate on the subtotal. Each item maintains its own tax calculation.

5. **Action:** Click "Create Invoice"
6. **Expected Result:**
   - Partial invoice created
   - Remaining quote amount tracked ($648.99 - $263.99 = $385.00 remaining)
   - Multiple invoices can exist for one quote
   - System shows which items have been invoiced and which remain

### Step 5.10: Download and Send Invoice
1. **Action:** From invoice detail page, click "Download PDF"
2. **Expected Result:** PDF invoice downloads with proper formatting
3. **Action:** Click "Send Email" button

### Step 5.10a: Send Invoice via Email
1. **Action:** Click "Send Email" button on invoice detail page
2. **Email Configuration:**
   - **Recipient:** Alice Anderson (alice.anderson@email.com) - pre-filled
   - **Subject:** "Invoice INV-2024-001 from [Company Name]" (auto-generated)
   - **Message:** (Optional - can customize or use default template)
   - **Attach PDF:** ✓ Checked (default)
   - **Include Payment Link:** ✓ Checked (default)

3. **Action:** Click "Send Email"
4. **Expected Result:**
   - Success message: "Invoice email sent successfully to alice.anderson@email.com"
   - Email sent with:
     - Invoice details in email body
     - PDF attachment
     - Payment link/button (prominent)
     - Due date highlighted
     - Payment methods listed
   - Email delivery logged in system
   - Invoice status may update to "Sent"

5. **Verify Email Delivery (Customer Side):**
   - Customer receives invoice email
   - Email contains professional template
   - "Pay Now" button/link is prominent
   - Payment link directs to secure payment page
   - Customer can view invoice details
   - Customer can download PDF

### Step 5.11: Customer Receives Payment Reminder Email (Automated)
1. **Scenario:** Invoice due date is approaching (e.g., 3 days before due date)
2. **Expected Result (Automated):**
   - System automatically sends payment reminder email
   - Email contains:
     - Invoice details
     - Due date reminder
     - Payment link
     - Friendly reminder message
   - Email logged in system
   - Reminder can be configured (7 days, 3 days, 1 day before due date)

### Step 5.12: Customer Receives Payment Confirmation Email
1. **Scenario:** Customer makes payment (via payment link or manual entry)
2. **Expected Result (Automated):**
   - System automatically sends payment confirmation email
   - Email contains:
     - Payment confirmation
     - Transaction details
     - Receipt PDF attachment
     - Payment amount and date
   - Email sent to customer's registered email
   - Payment receipt logged in system

### Step 5.13: Customer Receives Overdue Payment Notice
1. **Scenario:** Invoice becomes overdue (past due date)
2. **Expected Result (Automated):**
   - System automatically sends overdue payment notice
   - Email contains:
     - Overdue amount
     - Days overdue
     - Late fees (if applicable)
     - Urgent payment link
     - Contact information for support
   - Email sent immediately when overdue
   - Recurring reminders may be sent (weekly, etc.)

**✅ Phase 5 Complete:** Invoice generated and ready for payment processing

---

## Phase 6: List Management & Bulk Operations

### Objective
Demonstrate how to manage and work with lists of customers, staff, quotes, invoices, and other entities in the system.

---

### **CUSTOMER LIST MANAGEMENT**

### Step 6.1: Navigate to Customer List
1. **Action:** Click on "Customers" in the sidebar menu
2. **Expected Result:** Customer List page displays with all customers

### Step 6.2: Customer List Features
1. **View Customer List:**
   - **Action:** Review the customer list table
   - **Verify Columns:**
     - Customer Name
     - Email
     - Phone
     - Total Quotes
     - Total Invoices
     - Last Activity Date
     - Status (Active/Inactive)
     - Actions (View, Edit, Delete)

2. **Search Customers:**
   - **Action:** Use the search bar at the top
   - **Test Searches:**
     - Search by name: "Alice"
     - Search by email: "alice.anderson"
     - Search by phone: "400 555"
   - **Expected Result:** List filters in real-time as you type

3. **Filter Customers:**
   - **Action:** Click on filter dropdown
   - **Filter Options:**
     - By Status: Active, Inactive, All
     - By Tags: Residential, Premium Customer, Educational, etc.
     - By Date Range: Created date, Last activity
   - **Action:** Select a filter (e.g., "Active" customers only)
   - **Expected Result:** List updates to show only matching customers

4. **Sort Customers:**
   - **Action:** Click on column headers to sort
   - **Test Sorting:**
     - Sort by Name (A-Z, Z-A)
     - Sort by Last Activity (Newest, Oldest)
     - Sort by Total Quotes (High to Low)
   - **Expected Result:** List reorders based on selected column

5. **Bulk Actions:**
   - **Action:** Select multiple customers using checkboxes
   - **Action:** Click "Bulk Actions" dropdown
   - **Available Actions:**
     - Export Selected
     - Add Tags
     - Remove Tags
     - Mark as Inactive
     - Send Email (bulk email)
   - **Action:** Select "Export Selected"
   - **Expected Result:** CSV/Excel file downloads with selected customer data

6. **Pagination:**
   - **Action:** If list has many customers, navigate through pages
   - **Verify:**
     - Page numbers display correctly
     - Items per page selector works (10, 25, 50, 100)
     - Total count is accurate

---

### **STAFF LIST MANAGEMENT**

### Step 6.3: Navigate to Team List
1. **Action:** Click on "Manage Team" in the sidebar
2. **Expected Result:** Team List page displays with all staff members

### Step 6.4: Staff List Features
1. **View Staff List:**
   - **Action:** Review the staff list
   - **Verify Columns:**
     - Staff Name
     - Email
     - Role
     - Employment Type
     - Status (Active/Inactive)
     - Last Login
     - Actions (View, Edit, Deactivate)

2. **Search Staff:**
   - **Action:** Use search bar
   - **Test Searches:**
     - Search by name: "Sarah"
     - Search by email: "sarah.johnson"
     - Search by role: "Manager"
   - **Expected Result:** List filters dynamically

3. **Filter Staff:**
   - **Action:** Use filter options
   - **Filter By:**
     - Role: Manager, Sales Representative, Technician, etc.
     - Status: Active, Inactive, All
     - Employment Type: Full-time, Part-time, Contractor
     - Location (if multi-location)
   - **Action:** Filter by "Active" and "Full-time"
   - **Expected Result:** Only active full-time staff shown

4. **Sort Staff:**
   - **Action:** Sort by different columns
   - **Test:**
     - Sort by Name
     - Sort by Role
     - Sort by Last Login
   - **Expected Result:** List reorders correctly

5. **Bulk Staff Actions:**
   - **Action:** Select multiple staff members
   - **Available Actions:**
     - Export Selected
     - Change Role (bulk role assignment)
     - Activate/Deactivate
     - Send Notification
   - **Action:** Select "Export Selected"
   - **Expected Result:** Staff data exported

---

### **QUOTE LIST MANAGEMENT**

### Step 6.5: Navigate to Quote List
1. **Action:** Click on "Quotes" in the sidebar
2. **Expected Result:** Quote List page displays with all quotes

### Step 6.6: Quote List Features
1. **View Quote List:**
   - **Action:** Review the quote list
   - **Verify Columns:**
     - Quote ID
     - Customer Name
     - Total Amount
     - Status (Draft, Active, Sent, Accepted, Rejected, Expired)
     - Created Date
     - Valid Until Date
     - Actions (View, Edit, Send, Convert to Invoice)

2. **Search Quotes:**
   - **Action:** Use search bar
   - **Test Searches:**
     - Search by Quote ID: "Q-2024"
     - Search by Customer: "Alice"
     - Search by Amount: "$648"
   - **Expected Result:** Relevant quotes appear

3. **Filter Quotes:**
   - **Action:** Use filter dropdown
   - **Filter By:**
     - Status: Draft, Active, Sent, Accepted, Rejected, Expired
     - Date Range: Created date, Valid until date
     - Amount Range: Min/Max amount
     - Customer: Select specific customer
     - Staff: Select staff member who created quote
   - **Action:** Filter by "Sent" status
   - **Expected Result:** Only sent quotes displayed

4. **Sort Quotes:**
   - **Action:** Sort by different columns
   - **Test:**
     - Sort by Date (Newest, Oldest)
     - Sort by Amount (High to Low, Low to High)
     - Sort by Status
   - **Expected Result:** List reorders correctly

5. **Bulk Quote Actions:**
   - **Action:** Select multiple quotes
   - **Available Actions:**
     - Export Selected
     - Send Selected (bulk email)
     - Change Status
     - Delete Selected
     - Convert to Invoices (if applicable)
   - **Action:** Select 2 quotes and click "Export Selected"
   - **Expected Result:** Quotes exported as CSV/PDF

6. **Quote Status Badges:**
   - **Action:** Review status indicators
   - **Verify:**
     - Color-coded status badges
     - Status counts in filter sidebar
     - Quick filter by clicking status badge

---

### **INVOICE LIST MANAGEMENT**

### Step 6.7: Navigate to Invoice List
1. **Action:** Click on "Invoices" in the sidebar or from Quotes menu
2. **Expected Result:** Invoice List page displays with all invoices

### Step 6.8: Invoice List Features
1. **View Invoice List:**
   - **Action:** Review the invoice list
   - **Verify Columns:**
     - Invoice ID
     - Customer Name
     - Amount
     - Status (Pending, Paid, Overdue, Cancelled)
     - Due Date
     - Created Date
     - Actions (View, Send, Mark as Paid, Download PDF)

2. **Search Invoices:**
   - **Action:** Use search bar
   - **Test Searches:**
     - Search by Invoice ID: "INV-2024"
     - Search by Customer: "Alice"
     - Search by Amount: "$648"
   - **Expected Result:** Matching invoices appear

3. **Filter Invoices:**
   - **Action:** Use filter options
   - **Filter By:**
     - Status: Pending, Paid, Overdue, Cancelled
     - Date Range: Created date, Due date
     - Amount Range: Min/Max amount
     - Payment Method: Credit Card, Bank Transfer, Cash
     - Customer: Select specific customer
   - **Action:** Filter by "Overdue" status
   - **Expected Result:** Only overdue invoices shown

4. **Sort Invoices:**
   - **Action:** Sort by different columns
   - **Test:**
     - Sort by Due Date (Urgent first)
     - Sort by Amount
     - Sort by Status
   - **Expected Result:** List reorders correctly

5. **Bulk Invoice Actions:**
   - **Action:** Select multiple invoices
   - **Available Actions:**
     - Export Selected
     - Send Reminders (bulk email)
     - Mark as Paid
     - Download PDFs (bulk download)
     - Export for Accounting
   - **Action:** Select overdue invoices and click "Send Reminders"
   - **Expected Result:** Reminder emails sent to all selected customers

6. **Invoice Summary Dashboard:**
   - **Action:** Review summary cards at top of list
   - **Verify:**
     - Total Pending Amount
     - Total Paid Amount
     - Overdue Count
     - This Month's Revenue
   - **Expected Result:** Summary cards show accurate totals

---

### **PRICEBOOK LIST MANAGEMENT**

### Step 6.9: Navigate to Pricebook List
1. **Action:** Click on "My Pricebook" in the sidebar
2. **Expected Result:** Pricebook List page displays with all items

### Step 6.10: Pricebook List Features
1. **View Pricebook List:**
   - **Action:** Review the pricebook list
   - **Verify Columns:**
     - Item Name
     - SKU/Code
     - Type (Service/Product)
     - Category
     - Price
     - Tax Rate
     - Status (Active/Inactive)
     - Actions (View, Edit, Delete)

2. **Search Pricebook Items:**
   - **Action:** Use search bar
   - **Test Searches:**
     - Search by name: "Cleaning"
     - Search by SKU: "CLEAN"
     - Search by category: "Tutoring"
   - **Expected Result:** Matching items appear

3. **Filter Pricebook Items:**
   - **Action:** Use filter options
   - **Filter By:**
     - Type: Service, Product, All
     - Category: Cleaning Services, Tutoring Services, Products
     - Status: Active, Inactive, All
     - Price Range: Min/Max price
   - **Action:** Filter by "Service" type
   - **Expected Result:** Only services displayed

4. **Sort Pricebook Items:**
   - **Action:** Sort by different columns
   - **Test:**
     - Sort by Name (A-Z)
     - Sort by Price (High to Low)
     - Sort by Category
   - **Expected Result:** List reorders correctly

5. **Bulk Pricebook Actions:**
   - **Action:** Select multiple items
   - **Available Actions:**
     - Export Selected
     - Activate/Deactivate
     - Change Category
     - Bulk Price Update (percentage or fixed amount)
     - Delete Selected
   - **Action:** Select items and click "Export Selected"
   - **Expected Result:** Pricebook data exported

---

### **GENERAL LIST MANAGEMENT FEATURES**

### Step 6.11: Common List Operations
1. **Export Lists:**
   - **Action:** Click "Export" button on any list page
   - **Export Options:**
     - Export All (current view)
     - Export Selected
     - Export with Filters Applied
   - **Format Options:**
     - CSV
     - Excel (XLSX)
     - PDF (for quotes/invoices)
   - **Action:** Export Customer List as CSV
   - **Expected Result:** File downloads with all customer data

2. **Print Lists:**
   - **Action:** Click "Print" button
   - **Expected Result:**
     - Print preview opens
     - Formatted for printing
     - Includes headers and footers
     - Can select specific columns to print

3. **Column Customization:**
   - **Action:** Click "Customize Columns" or column settings icon
   - **Action:** Show/hide specific columns
   - **Action:** Reorder columns by dragging
   - **Action:** Save column preferences
   - **Expected Result:**
     - Columns update immediately
     - Preferences saved for next visit

4. **List Views:**
   - **Action:** Toggle between view types (if available)
   - **View Options:**
     - Table View (default)
     - Card View
     - Grid View
   - **Expected Result:** List displays in selected format

5. **Quick Actions:**
   - **Action:** Hover over list items
   - **Verify:**
     - Quick action buttons appear
     - Context menu available (right-click)
     - Keyboard shortcuts work (if applicable)

**✅ Phase 6 Complete:** List management features demonstrated across all modules

---

## Verification Checklist

Use this checklist to verify all functionality during UAT:

### Team Management
- [ ] Staff members can be created successfully
- [ ] Staff information is saved correctly
- [ ] Staff list displays all active members
- [ ] Search and filter functionality works
- [ ] Staff can be edited and updated
- [ ] Roles can be created and configured
- [ ] Permissions can be assigned to roles
- [ ] Staff can be assigned to roles
- [ ] Role permissions are enforced correctly

### Pricebook Management
- [ ] Pricebook items can be created (Services and Products)
- [ ] Pricing information is saved correctly
- [ ] Tax rates are applied properly
- [ ] Items appear in quote creation catalog
- [ ] Search functionality works in pricebook

### Customer Management
- [ ] Customers can be created successfully
- [ ] Customer information is saved correctly
- [ ] Secondary contacts can be added
- [ ] Customers appear in quote creation customer search
- [ ] Customer details can be viewed and edited

### Quote Creation
- [ ] Quotes can be created for customers
- [ ] Pricebook items can be added to quotes
- [ ] Quote totals calculate correctly (subtotal + tax)
- [ ] Quote PDF can be generated
- [ ] Quote can be sent via email
- [ ] Quote email template displays correctly
- [ ] Customer receives quote email with PDF attachment
- [ ] Quote status updates correctly
- [ ] Quote can be edited after creation

### Invoice Generation
- [ ] Invoices can be created from quotes
- [ ] Invoice amounts match quote totals
- [ ] Invoice items are correctly transferred from quote
- [ ] Invoice PDF can be generated
- [ ] Invoice can be sent via email
- [ ] Invoice email template displays correctly
- [ ] Customer receives invoice email with payment link
- [ ] Payment reminder emails are sent automatically
- [ ] Payment confirmation emails are sent automatically
- [ ] Overdue payment notices are sent automatically
- [ ] Partial invoices can be created (if applicable)
- [ ] Multiple invoices can be created for one quote
- [ ] Invoice status tracking works correctly

### Data Integrity
- [ ] All data persists after page refresh
- [ ] Relationships between entities are maintained (Customer → Quote → Invoice)
- [ ] Calculations are accurate throughout the workflow
- [ ] No data loss during navigation

### List Management
- [ ] Customer list displays correctly with all columns
- [ ] Staff list displays correctly with all columns
- [ ] Quote list displays correctly with all columns
- [ ] Invoice list displays correctly with all columns
- [ ] Pricebook list displays correctly with all columns
- [ ] Search functionality works on all lists
- [ ] Filter functionality works on all lists
- [ ] Sort functionality works on all lists
- [ ] Bulk actions work correctly
- [ ] Export functionality works (CSV, Excel, PDF)
- [ ] Pagination works correctly
- [ ] Column customization works

### Email Notifications
- [ ] Quote sent emails are delivered correctly
- [ ] Invoice sent emails are delivered correctly
- [ ] Payment reminder emails are sent automatically
- [ ] Payment confirmation emails are sent automatically
- [ ] Overdue payment notices are sent automatically
- [ ] Email templates render correctly
- [ ] Email attachments (PDFs) are included
- [ ] Email links (portal, payment) work correctly

### User Experience
- [ ] Navigation is intuitive
- [ ] Error messages are clear and helpful
- [ ] Success messages confirm actions
- [ ] Forms validate input correctly
- [ ] Loading states are appropriate
- [ ] Mobile responsiveness (if applicable)

---

## Common Test Scenarios

### Scenario 1: Complete Workflow
Follow all phases sequentially as described above.

### Scenario 2: Multiple Quotes for Same Customer
1. Create another quote for Alice Anderson with different items (e.g., add more cleaning services)
2. Verify both quotes are tracked separately
3. Generate invoices for both quotes independently
4. Verify customer can see all their quotes

### Scenario 3: Quote Editing
1. Edit the quote after creation
2. Add/remove items
3. Verify totals recalculate correctly (especially tax per item)
4. Save changes and verify persistence
5. Verify quote version history (if available)

### Scenario 4: Invoice Payment Tracking
1. Mark invoice as "Paid" (if payment tracking is available)
2. Verify quote status updates (if applicable)
3. Verify payment history is recorded
4. Test payment success and failure pages (invoice_payment_success.html and invoice_payment_failed.html)

### Scenario 5: Products-Only Quote
1. Create a quote with only products (no services)
2. Verify tax calculation works correctly for products
3. Generate invoice from products-only quote
4. Verify invoice displays products properly

### Scenario 6: Services-Only Quote
1. Create a quote with only services (no products)
2. Verify service-specific fields (duration, scheduling) work
3. Generate invoice from services-only quote

### Scenario 7: Mixed Services and Products with Different Quantities
1. Create a quote with:
   - Service with quantity > 1 (e.g., 5 tutoring sessions)
   - Multiple different products
   - Products with quantity > 1
2. Verify calculations are correct for each line item
3. Verify tax is calculated per item, not on total

### Scenario 8: Error Handling
1. Try to create quote without customer (should show error)
2. Try to create invoice without quote (should show error)
3. Try to save with invalid data (should show validation errors)
4. Try to create invoice for more than quote amount (should show error or warning)
5. Try to add item with zero or negative quantity (should show validation error)

---

## Notes for Demo Presenter

1. **Preparation:**
   - Have test data ready before the demo
   - Prepare realistic customer names and scenarios
   - Ensure all pricebook items are created in advance (optional)

2. **During Demo:**
   - Explain each step clearly
   - Highlight key features and benefits
   - Show how the system handles edge cases
   - Demonstrate search and filter capabilities

3. **Common Questions:**
   - **Q: Can quotes be edited after sending?** A: Yes, quotes can typically be edited, but status may change. Some systems may require creating a new version.
   - **Q: Can multiple invoices be created from one quote?** A: Yes, partial invoicing is supported. The system tracks remaining amounts.
   - **Q: How are taxes calculated?** A: Taxes are calculated **per item** based on each item's individual tax rate, not as a flat percentage on the total. This ensures accurate tax reporting.
   - **Q: Can staff be assigned to quotes?** A: Yes, staff assignment is typically available in quote creation or editing.
   - **Q: What's the difference between services and products?** A: Services are time-based offerings (cleaning, tutoring) while products are physical items (supplies, books). Services may have scheduling options.
   - **Q: Can I mix services and products in one quote?** A: Yes, quotes can contain any combination of services and products.

4. **Troubleshooting:**
   - **If items don't appear in quote creation:** Verify pricebook items are active and not archived
   - **If customer doesn't appear in search:** Verify customer is saved correctly and check for typos
   - **If calculations are wrong:** 
     - Check tax rates are set correctly per item
     - Verify tax is calculated per item, not on total
     - Check quantity multipliers are applied correctly
   - **If partial invoice shows wrong remaining amount:** Verify the system tracks invoiced amounts per item, not just total
   - **If payment configuration tab is missing:** Check if it's integrated into the main form or available after quote creation

---

## Success Criteria

The demo is successful if:
1. ✅ All phases can be completed without errors
2. ✅ Data flows correctly between modules (Team → Pricebook → Customer → Quote → Invoice)
3. ✅ Calculations are accurate
4. ✅ PDFs generate correctly
5. ✅ Email functionality works (if tested)
6. ✅ User experience is smooth and intuitive
7. ✅ All verification checklist items pass

---

## Next Steps After UAT

1. Document any issues or bugs found during testing
2. Gather feedback on user experience
3. Note any feature requests or improvements
4. Schedule follow-up sessions if needed
5. Update system based on UAT findings

---

---

## Issues Identified and Fixed

### Logical Issues Found and Corrected:

1. **Tax Calculation Clarification:**
   - **Issue:** Original document implied tax was calculated as a flat 10% on total
   - **Fix:** Clarified that tax is calculated **per item** based on each item's tax rate
   - **Impact:** More accurate tax reporting and compliance

2. **Product Coverage:**
   - **Issue:** Only one product example was provided
   - **Fix:** Added multiple products (Cleaning Supplies, Textbooks, Study Materials) to better demonstrate product functionality

3. **Service Diversity:**
   - **Issue:** Only cleaning services were demonstrated
   - **Fix:** Added tutoring services (One-on-One, Group, Exam Package) to show system flexibility

4. **Customer Scenarios:**
   - **Issue:** Only one customer scenario
   - **Fix:** Added two customers (one for cleaning, one for tutoring) to demonstrate different use cases

5. **Payment Configuration Location:**
   - **Issue:** Vague reference to "Payment Configuration" tab location
   - **Fix:** Added note that it may be integrated into main form or available after creation

6. **Partial Invoice Calculation:**
   - **Issue:** Tax calculation in partial invoice example was unclear
   - **Fix:** Clarified that tax must be calculated per item, not on subtotal

7. **Quantity Handling:**
   - **Issue:** No demonstration of quantities > 1
   - **Fix:** Added example with 8 hours of tutoring to show quantity handling

8. **Mixed Services and Products:**
   - **Issue:** Limited demonstration of mixing services and products
   - **Fix:** Created comprehensive quote with multiple services and products together

---

**Document Version:** 3.0  
**Last Updated:** December 2024  
**Prepared for:** UAT Testing & Client Demonstration  
**Changes:** 
- Added tutoring services, expanded product coverage, fixed logical issues
- Added role and permission management steps
- Added email actions and automated email notifications
- Added comprehensive list management scenarios (customers, staff, quotes, invoices, pricebook)
- Added bulk operations and export functionality

