# Franchisee/Single Store Owner/Manager - Full Permissions

## Overview
This document defines the complete permission matrix for **Franchisee**, **Single Store Owner**, and **Manager** roles in the Franchise Management System (FMS). These roles have similar or identical access rights as they represent the business owner/operator level.

## Role Descriptions

### Franchisee
A franchise business owner who operates one or more locations under a franchise agreement. Has full operational control over their business unit.

### Single Store Owner
The proprietor of a standalone store/business unit. Has complete control over their single location.

### Manager
The appointed administrator for a franchise/single store location. Typically assigned by the owner to manage day-to-day operations.

**Note**: For the purposes of this permission matrix, these three roles have the same access rights and are collectively referred to as **Owner/Manager**.

---

## Permission Matrix

### 1. Staff Management

#### ✓ Full Access
- **View Staff**: View all staff members in their location(s)
- **Create Staff**: Add new staff members with complete information
- **Edit Staff**: Update staff information, roles, and permissions
- **Delete Staff**: Deactivate staff accounts (soft delete)
- **Assign Roles**: Assign and modify staff roles and permissions
- **Manage Roles**: Create, edit, and delete custom roles
- **View Employee Data**: Access all employment information, schedules, and performance data
- **Set Permissions**: Configure granular permissions for staff members

**Business Justification**: Owners/managers must have complete control over their team composition and access rights.

---

### 2. Schedule Management

#### ✓ Full Access
- **View Schedule**: See all scheduled jobs, appointments, and staff availability
- **Edit Schedule**: Modify job assignments, times, and dates
- **Create Schedule**: Add new appointments and job assignments
- **Assign Jobs**: Assign jobs to specific staff members
- **Reassign Jobs**: Reassign jobs from one staff member to another
- **View Staff Availability**: Check staff availability for scheduling
- **Cancel/Reschedule Jobs**: Cancel or reschedule appointments as needed
- **Bulk Schedule Operations**: Perform bulk scheduling and assignment operations

**Business Justification**: Operations management requires complete scheduling control to ensure efficient service delivery.

---

### 3. Quote Management

#### ✓ Full Access
- **View Quotes**: Access all quotes in their location(s)
- **Create Quotes**: Generate new quotes for customers
- **Edit Quotes**: Modify existing quotes and create revisions
- **Delete Quotes**: Remove quotes from the system
- **Send Quotes**: Send quotes via email, SMS, or other channels
- **Convert Quotes**: Convert approved quotes to work orders
- **Approve Quotes**: Approve quotes for conversion to jobs (if approval workflow exists)
- **Manage Quote Templates**: Create and manage quote templates
- **View Quote History**: Access version history and audit logs
- **Generate Quote PDFs**: Export quotes to PDF format

**Business Justification**: Quote management is core to sales and revenue generation. Owners/managers need full control to serve customers effectively.

---

### 4. Customer Management

#### ✓ Full Access
- **View Customers**: Access all customer records
- **Create Customers**: Add new customers to the system
- **Edit Customers**: Update customer information and contact details
- **Delete Customers**: Remove customer records (with appropriate safeguards)
- **View Customer History**: Access complete customer interaction history
- **Manage Customer Notes**: Add and edit customer notes and special instructions
- **Customer Communication**: Send messages and updates to customers
- **Customer Segmentation**: Create and manage customer groups and segments
- **Import/Export Customers**: Bulk import and export customer data

**Business Justification**: Customer relationships are the foundation of the business. Complete access is necessary for customer service and retention.

---

### 5. Pricebook Management

#### ✓ Full Access
- **View Pricebook**: Access all service and product items
- **Create Items**: Add new services and products to the pricebook
- **Edit Items**: Update pricing, descriptions, and specifications
- **Delete Items**: Remove items from the pricebook
- **Manage Pricing**: Set and modify pricing for all items
- **Tax Categories**: Configure tax categories and rates
- **Manage Units**: Define and modify units of measurement
- **Image Management**: Upload and manage item images
- **Pricebook Versioning**: Access version history and revert changes
- **Import/Export Pricebook**: Bulk operations for pricebook items
- **Publish/Unpublish Items**: Control item visibility and availability

**Business Justification**: Pricing control is essential for profitability and competitive positioning.

---

## Additional Permissions & Capabilities

### Quote-to-End Process
- ✓ Create quotes and convert to work orders
- ✓ Approve quotes for execution
- ✓ Manage quote-to-invoice workflow
- ✓ Track payment status and collections
- ✓ Generate invoices and payment records
- ✓ Process refunds and adjustments

### Job Management
- ✓ View all jobs across all staff
- ✓ Reassign jobs between staff members
- ✓ Mark jobs as complete
- ✓ Review job photos and documentation
- ✓ Approve additional work requests
- ✓ Close jobs and generate invoices

### Financial Management
- ✓ Track receivables and aging
- ✓ Process payments and record transactions
- ✓ Generate financial statements
- ✓ View payment history
- ✓ Manage deposits and retainers

### Communication
- ✓ Send automated and manual communications to customers
- ✓ Manage SMS and email templates
- ✓ Access communication history
- ✓ Configure notification triggers
- ✓ Contact customer support (escalation to franchisor if applicable)


---

## Restrictions & Limitations

### What Owners/Managers CANNOT Do

1. **Franchisor-Level Changes**
   - Cannot modify system-wide configurations managed by franchisor
   - Cannot access other franchisee data (if applicable)
   - Cannot modify core system architecture or permissions assigned by franchisor

2. **Franchisor-Branded Assets**
   - May have limited ability to modify franchisor-supplied branding
   - Must comply with franchisor brand guidelines

3. **System Infrastructure**
   - Cannot access system infrastructure or hosting settings (unless self-hosted)
   - Cannot modify core security policies set by franchisor
   - Cannot bypass payment gateway or financial controls set by franchisor

4. **Other Franchise Data** (Multi-Unit Context)
   - Cannot view other franchisee operations or data

---

## Permissions Reference

### Permission IDs (for system implementation)

#### Staff Management
- `perm_view_staff`: View Staff
- `perm_create_staff`: Create Staff
- `perm_edit_staff`: Edit Staff
- `perm_delete_staff`: Delete Staff
- `perm_manage_team`: Manage Team
- `perm_manage_roles`: Manage Roles

#### Schedule Management
- `perm_view_schedule`: View Schedule
- `perm_edit_schedule`: Edit Schedule
- `perm_assign_jobs`: Assign Jobs

#### Quote Management
- `perm_view_quotes`: View Quotes
- `perm_create_quotes`: Create Quotes
- `perm_edit_quotes`: Edit Quotes
- `perm_delete_quotes`: Delete Quotes

#### Customer Management
- `perm_view_customers`: View Customers
- `perm_create_customers`: Create Customers
- `perm_edit_customers`: Edit Customers
- `perm_delete_customers`: Delete Customers

#### Pricebook Management
- `perm_view_pricebook`: View Pricebook
- `perm_create_pricebook`: Create Items
- `perm_edit_pricebook`: Edit Items

**Total Permissions for Owner/Manager Role**: ALL (16 permissions as defined above, plus system-level permissions for complete access)

---

## Implementation Notes

### For Development Team

1. **Role Assignment**: The system should have three role types that map to the same permission set:
   - `franchisee`: Franchise owner
   - `store_owner`: Single store owner
   - `manager`: Business manager

2. **Permission Inheritance**: All three roles should inherit from the same base permission set for "Owner/Manager" level access.

3. **UI Restrictions**: While permissions are identical, UI may show different branding or context based on role type.

4. **Multi-Location Scope**: If a franchisee operates multiple locations, they should have access across all their locations, while managers may be scoped to a single location.

5. **Audit Trail**: All actions performed by owner/manager roles should be logged for accountability and franchisor oversight.

6. **Permission Matrix Source**: Reference the detailed permission spreadsheet at:
   [https://docs.google.com/spreadsheets/d/1xhTq7LWqrWBGs-tv_cjMSzcYmLxAA0MX/edit?gid=1434039830#gid=1434039830](https://docs.google.com/spreadsheets/d/1xhTq7LWqrWBGs-tv_cjMSzcYmLxAA0MX/edit?gid=1434039830#gid=1434039830)

---

## Business Rationale

### Why Complete Access?

1. **Operational Autonomy**: Franchisees and store owners need complete control to run their business day-to-day without needing approval for routine operations.

2. **Customer Service**: Immediate access to all tools and data ensures prompt customer service and competitive responsiveness.

3. **Financial Control**: Direct control over pricing, quotes, and invoicing enables optimal profitability management.

4. **Team Management**: Independent hiring, scheduling, and staff management capabilities are essential for business operations.

5. **Data-Driven Decisions**: Complete reporting and analytics access supports informed business decisions.

6. **Compliance**: While having full access, owners/managers are responsible for compliance with franchisor standards and applicable laws.

---

## Security Considerations

### Data Protection
- All data access must be logged and auditable
- Sensitive financial data should have additional encryption
- Personal information (staff/customer) must comply with privacy regulations

### Access Control
- Strong authentication required (2FA recommended)
- Session management and timeout policies
- Role-based UI rendering (show/hide features based on permissions)
- API-level permission enforcement (backend validation)

### Audit & Compliance
- All permission changes must be logged
- Regular access reviews recommended
- Anomaly detection for unusual access patterns

---

## Version History

- **v1.0** (Current): Initial comprehensive permission definition for Franchisee/Store Owner/Manager roles

---

## Related Documents

- `manage-team/manage-team-spec.md`: Staff management specifications
- `manage-team/manage-team-permission.html`: Permission configuration UI
- `[v2] Quotes/srs_quote_process.md`: Quote management specifications
- `[v2] Quotes/user_stories.md`: User stories and requirements
- `manage-team/manage-team-roles.html`: Role management UI

