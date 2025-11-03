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

---

## Permission Tree Structure

This section defines the hierarchical permission tree for **Franchisee**, **Single Store Owner**, and **Manager** roles.

| Text | Permission ID | Parent-ID | Level | Note |
|------|---------------|-----------|-------|------|
| **Role & Permission** | 1000 | 0 | 0 | Root category for user and role management |
| User Management | 1001 | 1000 | 1 | Staff/user management module |
| View Staff | 1010 | 1001 | 2 | View all staff members |
| Create Staff | 1011 | 1001 | 2 | Add new staff members |
| Edit Staff | 1012 | 1001 | 2 | Update staff information |
| Delete Staff | 1013 | 1001 | 2 | Deactivate staff accounts (soft delete) |
| View Employee Data | 1014 | 1001 | 2 | Access employment info, schedules, performance |
| Role | 1002 | 1000 | 1 | Role and permission management |
| Manage Roles | 1020 | 1002 | 2 | Create, edit, delete custom roles |
| Assign Roles | 1021 | 1002 | 2 | Assign and modify staff roles |
| Set Permissions | 1022 | 1002 | 2 | Configure granular permissions |
| **Service Management** | 2000 | 0 | 0 | Root category for service operations |
| Schedule Management | 2001 | 2000 | 1 | Job scheduling and assignments |
| View Schedule | 2010 | 2001 | 2 | See all scheduled jobs and appointments |
| Create Schedule | 2011 | 2001 | 2 | Add new appointments and job assignments |
| Edit Schedule | 2012 | 2001 | 2 | Modify job assignments, times, dates |
| Assign Jobs | 2013 | 2001 | 2 | Assign jobs to specific staff |
| Reassign Jobs | 2014 | 2001 | 2 | Reassign jobs between staff |
| View Staff Availability | 2015 | 2001 | 2 | Check staff availability |
| Cancel/Reschedule Jobs | 2016 | 2001 | 2 | Cancel or reschedule appointments |
| Bulk Schedule Operations | 2017 | 2001 | 2 | Perform bulk scheduling operations |
| Quote Management | 2002 | 2000 | 1 | Quote creation and management |
| View Quotes | 2020 | 2002 | 2 | Access all quotes |
| Create Quotes | 2021 | 2002 | 2 | Generate new quotes |
| Edit Quotes | 2022 | 2002 | 2 | Modify existing quotes |
| Delete Quotes | 2023 | 2002 | 2 | Remove quotes from system |
| Send Quotes | 2024 | 2002 | 2 | Send quotes via email/SMS |
| Convert Quotes | 2025 | 2002 | 2 | Convert quotes to work orders |
| Approve Quotes | 2026 | 2002 | 2 | Approve quotes for conversion |
| Manage Quote Templates | 2027 | 2002 | 2 | Create and manage templates |
| View Quote History | 2028 | 2002 | 2 | Access version history and audit logs |
| Generate Quote PDFs | 2029 | 2002 | 2 | Export quotes to PDF |
| Job Management | 2003 | 2000 | 1 | Work order and job execution |
| View All Jobs | 2030 | 2003 | 2 | View all jobs across all staff |
| Reassign Jobs | 2031 | 2003 | 2 | Reassign jobs between staff |
| Mark Jobs Complete | 2032 | 2003 | 2 | Mark jobs as complete |
| Review Job Documentation | 2033 | 2003 | 2 | Review job photos and docs |
| Approve Additional Work | 2034 | 2003 | 2 | Approve additional work requests |
| Close Jobs | 2035 | 2003 | 2 | Close jobs and generate invoices |
| Customer Management | 2004 | 2000 | 1 | Customer records and relationships |
| View Customers | 2040 | 2004 | 2 | Access all customer records |
| Create Customers | 2041 | 2004 | 2 | Add new customers |
| Edit Customers | 2042 | 2004 | 2 | Update customer information |
| Delete Customers | 2043 | 2004 | 2 | Remove customer records |
| View Customer History | 2044 | 2004 | 2 | Access complete interaction history |
| Manage Customer Notes | 2045 | 2004 | 2 | Add and edit customer notes |
| Customer Communication | 2046 | 2004 | 2 | Send messages to customers |
| Customer Segmentation | 2047 | 2004 | 2 | Create and manage customer groups |
| Import/Export Customers | 2048 | 2004 | 2 | Bulk import and export customer data |
| Pricebook | 2005 | 2000 | 1 | Service and product pricing |
| View Pricebook | 2050 | 2005 | 2 | Access all service and product items |
| Create Items | 2051 | 2005 | 2 | Add new services and products |
| Edit Items | 2052 | 2005 | 2 | Update pricing and descriptions |
| Delete Items | 2053 | 2005 | 2 | Remove items from pricebook |
| Manage Pricing | 2054 | 2005 | 2 | Set and modify pricing |
| Tax Categories | 2055 | 2005 | 2 | Configure tax categories and rates |
| Manage Units | 2056 | 2005 | 2 | Define units of measurement |
| Image Management | 2057 | 2005 | 2 | Upload and manage item images |
| Pricebook Versioning | 2058 | 2005 | 2 | Access version history |
| Import/Export Pricebook | 2059 | 2005 | 2 | Bulk operations for pricebook |
| Publish/Unpublish Items | 2060 | 2005 | 2 | Control item visibility |
| **Financial Management** | 3000 | 0 | 0 | Root category for financial operations |
| Receivables | 3001 | 3000 | 1 | Accounts receivable management |
| Track Receivables | 3010 | 3001 | 2 | Track receivables and aging |
| Process Payments | 3011 | 3001 | 2 | Process payments and record transactions |
| Generate Statements | 3012 | 3001 | 2 | Generate financial statements |
| View Payment History | 3013 | 3001 | 2 | View payment history |
| Manage Deposits | 3014 | 3001 | 2 | Manage deposits and retainers |
| Invoicing | 3002 | 3000 | 1 | Invoice generation and management |
| Generate Invoices | 3020 | 3002 | 2 | Generate invoices from jobs |
| Process Refunds | 3021 | 3002 | 2 | Process refunds and adjustments |
| **Communication** | 4000 | 0 | 0 | Root category for communication |
| Customer Communication | 4001 | 4000 | 1 | Customer messaging and notifications |
| Send Communications | 4010 | 4001 | 2 | Send automated and manual communications |
| Manage Templates | 4011 | 4001 | 2 | Manage SMS and email templates |
| Access Communication History | 4012 | 4001 | 2 | Access communication history |
| Configure Notifications | 4013 | 4001 | 2 | Configure notification triggers |
| Contact Support | 4014 | 4001 | 2 | Contact customer support/franchisor |
| **System** | 5000 | 0 | 0 | Root category for system settings |
| Site Configuration | 5001 | 5000 | 1 | Store/location settings |
| Upload Logo | 5010 | 5001 | 2 | Upload and manage store logo |
| Theme Colors | 5011 | 5001 | 2 | Configure theme colors |
| Store Settings | 5012 | 5001 | 2 | Configure store information and settings |

### Permission Levels Explained

#### Level 0 (Root Categories)
Top-level permission groups that organize all permissions:
- **Role & Permission** (1000): User and role management
- **Service Management** (2000): Core business operations
- **Financial Management** (3000): Financial operations
- **Communication** (4000): Customer and internal communications
- **System** (5000): System and store configuration

#### Level 1 (Main Modules)
Major functional areas within each root category:
- User Management, Role, Schedule Management, Quote Management, Job Management, Customer Management, Pricebook, etc.

#### Level 2 (Specific Actions)
Granular permissions for specific operations (CRUD and specialized actions):
- View, Create, Edit, Delete, and other specific actions

### Permission ID Ranges
- **1000-1999**: Role & Permission management
- **2000-2999**: Service Management operations
- **3000-3999**: Financial Management
- **4000-4999**: Communication
- **5000-5999**: System configuration

### Parent-Child Relationships
- Each permission has a `Parent-ID` that links it to its parent
- Level 0 permissions have `Parent-ID = 0` (root level)
- Level 1 permissions have a Level 0 parent
- Level 2 permissions have a Level 1 parent

### For Franchisee/Store Owner/Manager Role
**ALL permissions in this tree are granted** to these roles, providing complete operational control.

