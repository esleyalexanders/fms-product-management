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
1. [Phase 1: Team Setup](#phase-1-team-setup)
2. [Phase 2: Pricebook Configuration](#phase-2-pricebook-configuration)
3. [Phase 3: Customer Management](#phase-3-customer-management)
4. [Phase 4: Quote Creation](#phase-4-quote-creation)
5. [Phase 5: Invoice Generation](#phase-5-invoice-generation)
6. [Verification Checklist](#verification-checklist)

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

**✅ Phase 1 Complete:** Team members are set up and ready to be assigned to quotes/jobs

---

## Phase 2: Pricebook Configuration

### Objective
Create pricebook items (services/products) that will be used in quotes.

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

### Step 2.4: Create Product Item - Cleaning Supplies Package
1. **Action:** Click "Create Pricebook Item"
2. **Fill Basic Information:**
   - **Type:** Product
   - **SKU/Code:** PROD-SUPPLIES-001
   - **Name:** Premium Cleaning Supplies Package
   - **Description:** Complete set of eco-friendly cleaning supplies including detergents, sponges, and microfiber cloths
   - **Category:** Products

3. **Fill Pricing Information:**
   - **Currency:** AUD ($)
   - **Price:** $89.99
   - **Tax Rate:** 10% (GST)
   - **Unit:** Per Package

4. **Action:** Click "Save"
5. **Expected Result:** Product item added to pricebook

### Step 2.5: Verify Pricebook Items
1. **Action:** Review the Pricebook list
2. **Verify:**
   - All three items are visible
   - Prices display correctly
   - Search functionality works
   - Items can be filtered by type (Service/Product)

**✅ Phase 2 Complete:** Pricebook items are ready to be used in quotes

---

## Phase 3: Customer Management

### Objective
Create a customer record that will receive quotes and invoices.

### Step 3.1: Navigate to Customers
1. **Action:** Click on "Customers" in the sidebar menu
2. **Expected Result:** Customer List page displays

### Step 3.2: Create New Customer
1. **Action:** Click "Create Customer" or "+ Add Customer" button
2. **Fill Basic Information:**
   - **Full Name:** Alice Anderson *
   - **Company Name:** Anderson Home Services (Optional)
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

### Step 3.3: Verify Customer Creation
1. **Action:** Click on Alice Anderson's name to view details
2. **Verify:**
   - All information is saved correctly
   - Secondary contact is visible
   - Customer can be edited if needed

**✅ Phase 3 Complete:** Customer is ready to receive quotes

---

## Phase 4: Quote Creation

### Objective
Create a quote for the customer using pricebook items.

### Step 4.1: Navigate to Quotes
1. **Action:** Click on "Quotes" in the sidebar menu
2. **Expected Result:** Quote List page displays

### Step 4.2: Create New Quote
1. **Action:** Click "Create Quote" or "+ New Quote" button
2. **Expected Result:** Quote creation page opens

### Step 4.3: Select Customer
1. **Action:** In the "Customer" section, click "Select Customer" or search field
2. **Action:** Search for "Alice Anderson" or select from the list
3. **Expected Result:**
   - Customer information populates
   - Customer contact details displayed
   - Option to select quote recipient (Primary or Secondary contact)

4. **Action:** Select "Primary Contact" (Alice Anderson) as quote recipient

### Step 4.4: Add Quote Items
1. **Action:** Navigate to the "Items" or "Add Services" section
2. **Add First Item - Basic Cleaning:**
   - Click "Add Item" or "Browse Catalog"
   - Search for "Basic House Cleaning" or select from catalog
   - **Quantity:** 1
   - **Service Date:** (Optional - select a future date)
   - **Notes:** (Optional - "Standard weekly cleaning")
   - Item appears in quote items list

3. **Add Second Item - Deep Cleaning:**
   - Click "Add Item" again
   - Search for "Deep Cleaning Service"
   - **Quantity:** 1
   - **Service Date:** (Optional - select a future date)
   - **Notes:** (Optional - "Initial deep clean before regular service")
   - Item appears in quote items list

4. **Add Third Item - Cleaning Supplies:**
   - Click "Add Item"
   - Search for "Premium Cleaning Supplies Package"
   - **Quantity:** 1
   - Item appears in quote items list

### Step 4.5: Review Quote Summary
1. **Action:** Review the quote summary panel (usually on the right side)
2. **Verify:**
   - Subtotal: $589.99 (150 + 350 + 89.99)
   - Tax (10% GST): $59.00
   - **Total:** $648.99
   - All three items listed correctly

### Step 4.6: Configure Quote Details
1. **Action:** Fill in quote configuration:
   - **Valid Until Date:** Select a date 30 days from today
   - **Customer Notes:** "Thank you for choosing our services. This quote is valid for 30 days."
   - **Internal Notes:** (Optional - "Follow up in 1 week if no response")

### Step 4.7: Configure Payment Settings (Optional)
1. **Action:** Navigate to "Payment Configuration" tab (if available)
2. **Configure Payment Model:**
   - **Payment Model:** Select "One-Time Payment" or "Full Payment"
   - **Payment Terms:** Net 30 (or as per business rules)
   - **Payment Methods:** Credit Card, Bank Transfer (select available methods)

### Step 4.8: Save and Send Quote
1. **Action:** Review all information one final time
2. **Action:** Click "Create Quote" or "Save & Send Quote"
3. **Expected Result:**
   - Success message: "Quote created successfully for Alice Anderson!"
   - Quote ID generated (e.g., Q-2024-001)
   - Quote status: "Active" or "Sent"
   - Option to download PDF
   - Option to send via email

4. **Action:** (Optional) Click "Download PDF" to verify quote format
5. **Action:** (Optional) Click "Send Email" to send quote to customer

### Step 4.9: Verify Quote Creation
1. **Action:** Navigate back to Quote List
2. **Verify:**
   - New quote appears in the list
   - Customer name: Alice Anderson
   - Total amount: $648.99
   - Status: Active/Sent
   - Quote ID is visible

3. **Action:** Click on the quote to view details
4. **Verify:**
   - All items are listed correctly
   - Totals are accurate
   - Customer information is correct
   - Quote can be edited if needed

**✅ Phase 4 Complete:** Quote is created and ready for customer approval

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
1. **Action:** Go back to quote detail page
2. **Action:** Click "Create Invoice" again
3. **Action:** Select "Partial Invoice" option (if available)
4. **Action:** Select specific items to invoice:
   - Select only "Basic House Cleaning" ($150.00)
   - Select "Premium Cleaning Supplies Package" ($89.99)
   - Total: $239.99 + Tax ($24.00) = $263.99

5. **Action:** Click "Create Invoice"
6. **Expected Result:**
   - Partial invoice created
   - Remaining quote amount tracked
   - Multiple invoices can exist for one quote

### Step 5.10: Download and Send Invoice
1. **Action:** From invoice detail page, click "Download PDF"
2. **Expected Result:** PDF invoice downloads with proper formatting
3. **Action:** Click "Send Email" (if available)
4. **Expected Result:** Invoice email sent to customer (Alice Anderson)

**✅ Phase 5 Complete:** Invoice generated and ready for payment processing

---

## Verification Checklist

Use this checklist to verify all functionality during UAT:

### Team Management
- [ ] Staff members can be created successfully
- [ ] Staff information is saved correctly
- [ ] Staff list displays all active members
- [ ] Search and filter functionality works
- [ ] Staff can be edited and updated

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
- [ ] Quote status updates correctly
- [ ] Quote can be edited after creation

### Invoice Generation
- [ ] Invoices can be created from quotes
- [ ] Invoice amounts match quote totals
- [ ] Invoice items are correctly transferred from quote
- [ ] Invoice PDF can be generated
- [ ] Invoice can be sent via email
- [ ] Partial invoices can be created (if applicable)
- [ ] Multiple invoices can be created for one quote
- [ ] Invoice status tracking works correctly

### Data Integrity
- [ ] All data persists after page refresh
- [ ] Relationships between entities are maintained (Customer → Quote → Invoice)
- [ ] Calculations are accurate throughout the workflow
- [ ] No data loss during navigation

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
1. Create another quote for Alice Anderson with different items
2. Verify both quotes are tracked separately
3. Generate invoices for both quotes independently

### Scenario 3: Quote Editing
1. Edit the quote after creation
2. Add/remove items
3. Verify totals recalculate correctly
4. Save changes and verify persistence

### Scenario 4: Invoice Payment Tracking
1. Mark invoice as "Paid" (if payment tracking is available)
2. Verify quote status updates (if applicable)
3. Verify payment history is recorded

### Scenario 5: Error Handling
1. Try to create quote without customer (should show error)
2. Try to create invoice without quote (should show error)
3. Try to save with invalid data (should show validation errors)

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
   - **Q: Can quotes be edited after sending?** A: Yes, quotes can typically be edited, but status may change
   - **Q: Can multiple invoices be created from one quote?** A: Yes, partial invoicing is supported
   - **Q: How are taxes calculated?** A: Taxes are calculated based on item-level tax rates
   - **Q: Can staff be assigned to quotes?** A: Yes, staff assignment is typically available in quote creation

4. **Troubleshooting:**
   - If items don't appear in quote creation, verify pricebook items are active
   - If customer doesn't appear in search, verify customer is saved correctly
   - If calculations are wrong, check tax rates and item prices

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

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Prepared for:** UAT Testing & Client Demonstration

