# Manage Team Business Requirements

## Overview
The Manage Team feature allows Franchisees and Single Store owners to efficiently manage their staff members. This includes adding, viewing, editing, and deactivating staff accounts, assigning roles and permissions, and tracking basic staff information. The system should support different user roles with appropriate access controls.

## Business Context
- Franchisees need to manage staff across multiple locations
- Single store owners need to manage their local team
- Staff management should integrate with scheduling and quote assignment
- Compliance with labor laws and data privacy requirements

## User Roles
1. **Franchisee Admin**: Can manage staff across all locations under their franchise
2. **Store Manager**: Can manage staff for their specific store/location
3. **Staff Member**: Can view their own profile and schedule

## Functional Requirements

### Staff Management (CRUD)
1. **Create Staff**
   - Add new staff members with basic information
   - Assign roles and permissions
   - Set employment details (start date, hourly rate, etc.)
   - Upload profile photo (optional)

2. **View Staff**
   - List all active staff with key information
   - Filter by role, location, status
   - Search by name, email, phone
   - View detailed staff profiles

3. **Edit Staff**
   - Update staff information
   - Change roles and permissions
   - Modify employment details
   - Update contact information

4. **Deactivate/Reactivate Staff**
   - Soft delete staff accounts
   - Maintain historical data
   - Prevent access to deactivated accounts

### Role and Permission Management
1. **Predefined Roles**
   - Administrator: Full access to all features
   - Manager: Can manage staff and schedules
   - Technician: Can view and update assigned jobs
   - Receptionist: Can manage bookings and customer inquiries

2. **Custom Permissions**
   - Granular permissions for specific features
   - Location-based access control

### Staff Information Fields
- **Personal Information**
  - First Name, Last Name
  - Email (unique identifier)
  - Phone Number
  - Date of Birth
  - Address

- **Employment Information**
  - Employee ID
  - Start Date
  - Employment Type (Full-time, Part-time, Contractor)
  - Hourly Rate/Salary
  - Tax Information

- **System Access**
  - Username/Email
  - Password (secure)
  - Role Assignment
  - Active/Inactive Status

### Integration Requirements
1. **Schedule Integration**
   - Link staff to scheduling system
   - View staff availability
   - Assign shifts and jobs

2. **Quote/Job Integration**
   - Assign staff to quotes and jobs
   - Track staff workload
   - Generate reports on staff performance

3. **Customer Management Integration**
   - Staff can be assigned as primary contacts for customers

## Data Model

### Staff Entity
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "date",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "postalCode": "string",
    "country": "string"
  },
  "employeeId": "string",
  "startDate": "date",
  "employmentType": "enum",
  "hourlyRate": "number",
  "role": "string",
  "permissions": ["string"],
  "locationId": "string",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "profilePhoto": "string"
}
```

### Role Entity
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "permissions": ["string"],
  "isSystemRole": "boolean"
}
```

## User Interface Requirements

### Staff List Page
- Table view with columns: Name, Role, Email, Phone, Status
- Search and filter functionality
- Bulk actions (activate/deactivate)
- Pagination for large staff lists

### Staff Detail/Create/Edit Forms
- Tabbed interface for different information sections
- Real-time validation
- Preview of staff card
- File upload for profile photos

### Role Management
- List of available roles
- Permission matrix
- Role assignment interface

## Business Rules

### Validation Rules
1. Email must be unique across all staff
2. Employee ID must be unique per location
3. Start date cannot be in the future
4. Required fields: First Name, Last Name, Email, Role

### Security Rules
1. Only admins can create/edit staff accounts
2. Staff can only view their own profile
3. Franchisee admins can manage staff across locations
4. Store managers limited to their location

### Business Logic
1. Deactivated staff cannot be assigned to new jobs
2. Role changes require admin approval
3. Staff information updates trigger audit logs

## Acceptance Criteria

### Functional Acceptance Criteria
- [ ] Admin can create new staff member with all required information
- [ ] Admin can edit existing staff information
- [ ] Admin can deactivate/reactivate staff accounts
- [ ] Staff list displays correctly with search and filter
- [ ] Role-based permissions work correctly
- [ ] Integration with scheduling system works
- [ ] Profile photo upload functions properly

### Non-Functional Acceptance Criteria
- [ ] Page load time < 2 seconds
- [ ] Mobile responsive design
- [ ] Data export functionality (CSV)
- [ ] Audit trail for all staff changes
- [ ] GDPR compliance for personal data
- [ ] Multi-language support (future)

## Future Enhancements
1. Staff performance tracking
2. Automated scheduling
3. Time clock integration
4. Staff training modules
5. Performance reviews
6. Payroll integration

## Technical Considerations
- Secure password storage
- API rate limiting
- Data backup and recovery
- Scalability for multiple locations
- Integration with existing authentication system</content>
<parameter name="filePath">c:\Users\Giang Esley\Downloads\fms-product-management\manage-team\manage-team-spec.md