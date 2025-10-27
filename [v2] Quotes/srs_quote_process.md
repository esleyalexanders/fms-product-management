# Software Requirements Specification (SRS): Quote-to-End Process Implementation

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) provides a detailed description of the Franchise Management System (FMS) features required to implement the Quote-to-End process. It translates the Business Requirements Document (BRD) into technical specifications, including features, user interfaces, and system behaviors.

### 1.2 Scope
The SRS covers the development of a web-based application supporting:
- Admin quote creation and management
- Automated customer communications
- Staff job execution via web dashboard
- Invoicing and payment tracking
- Basic reporting

### 1.3 Definitions, Acronyms, and Abbreviations
- FMS: Franchise Management System
- BRD: Business Requirements Document
- SRS: Software Requirements Specification
- UI: User Interface
- API: Application Programming Interface

### 1.4 References
- Business Requirements Document (BRD): quote_process_brd.md
- Process Flow Diagrams: quote_process_flow.md

## 2. Overall Description

### 2.1 Product Perspective
The FMS is a web-based application built with HTML, CSS, JavaScript, and localStorage for data persistence. It serves franchisee admins and staff, with automated integrations for email/WhatsApp communications.

### 2.2 Product Functions
- User authentication and role-based access
- Pricebook management
- Quote lifecycle management
- Job scheduling and staff assignment
- Staff job execution tracking
- Automated customer communications
- Invoicing and payment management
- Basic reporting

### 2.3 User Characteristics
- **Franchisee Admin**: Business-oriented, uses system daily for operations
- **Staff/Technicians**: Field workers, access via web dashboard for job updates
- **Customers**: External users, interact via email/WhatsApp only

### 2.4 Constraints
- Browser-based application (no mobile app)
- localStorage for data persistence
- Manual integrations for email/WhatsApp (no full API integrations assumed)

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces
The application shall consist of the following screens:

1. **Login Screen**
   - Fields: Username, Password, Role selection (Admin/Staff)
   - Functionality: Authenticate users, redirect to appropriate dashboard

2. **Admin Dashboard/Home Screen**
   - Navigation menu: Home, Quotes, Schedule, Manage Team, My Pricebook
   - Quick actions: Create Quote, View Pricebook
   - Recent activity feed

3. **Pricebook Management Screens**
   - **Pricebook List Screen**: Table of items with search/filter, actions (edit, delete, toggle publish)
   - **Pricebook Create/Edit Screen**: Form with fields for service/product details, pricing, image upload, preview modal, publish modal

4. **Quote Management Screens**
   - **Quotes List Screen**: Table of quotes with status, customer info, actions (view, edit, send, delete)
   - **Quote Create/Edit Screen**: Form with customer details (name, email, WhatsApp), line items from pricebook, totals, generate PDF

5. **Staff Dashboard Screen**
   - List of assigned jobs with status
   - Actions: Start job, upload photos, mark complete
   - Job details view with progress tracking

6. **Job Detail Screen (Staff)**
   - Job information, customer details
   - Photo upload sections (before/after)
   - Status update options

#### 3.1.2 Hardware Interfaces
- Standard web browsers (Chrome, Firefox, Safari, Edge)
- Minimum screen resolution: 1024x768

#### 3.1.3 Software Interfaces
- Email/WhatsApp integration: Manual copy-paste or basic API calls for sending
- PDF generation: Browser-based or library integration
- Image upload: File input with preview

#### 3.1.4 Communication Interfaces
- HTTPS for secure web access
- Email/WhatsApp APIs for automated sending

### 3.2 Functional Requirements

#### 3.2.1 Authentication Feature
- **FR-AUTH-1**: System shall authenticate users based on username/password/role
- **FR-AUTH-2**: Redirect to role-specific dashboard after login

#### 3.2.2 Pricebook Management Feature
- **FR-PB-1**: Admin can view list of pricebook items with search/filter
- **FR-PB-2**: Admin can create new pricebook items with image upload
- **FR-PB-3**: Admin can edit existing items with version history
- **FR-PB-4**: Admin can publish/unpublish items with confirmation modal
- **FR-PB-5**: Preview modal for item details before saving

#### 3.2.3 Quote Management Feature
- **FR-Q-1**: Admin can create quotes with customer details (email/WhatsApp)
- **FR-Q-2**: System auto-generates quote PDF/link
- **FR-Q-3**: System auto-sends quote via email/WhatsApp
- **FR-Q-4**: Admin can update quotes for changes, system auto-resends
- **FR-Q-5**: Admin can track quote status and customer responses
- **FR-Q-6**: Approved quotes auto-convert to work orders

#### 3.2.4 Job Scheduling Feature
- **FR-JS-1**: Admin can schedule jobs and assign staff
- **FR-JS-2**: System sends assignment notifications to staff
- **FR-JS-3**: Admin can reassign jobs based on staff issues

#### 3.2.5 Staff Job Execution Feature
- **FR-SJE-1**: Staff can view assigned jobs on web dashboard
- **FR-SJE-2**: Staff can start jobs and update status
- **FR-SJE-3**: Staff can upload before/after photos
- **FR-SJE-4**: Staff can request additional work via manual communication
- **FR-SJE-5**: Staff can mark jobs complete

#### 3.2.6 Invoicing and Payment Feature
- **FR-IP-1**: System auto-generates invoices on job completion
- **FR-IP-2**: System auto-sends invoices via email/WhatsApp
- **FR-IP-3**: Admin can record payment status
- **FR-IP-4**: System tracks overdue invoices and alerts admin

#### 3.2.7 Reporting Feature
- **FR-R-1**: System aggregates data for franchisor reporting
- **FR-R-2**: Basic dashboard for admin to view metrics

### 3.3 Non-Functional Requirements

#### 3.3.1 Performance
- Page load times < 3 seconds
- Support up to 100 concurrent users

#### 3.3.2 Usability
- Responsive design for desktop/tablet
- Intuitive navigation and clear CTAs

#### 3.3.3 Security
- Role-based access control
- Data encryption for sensitive information

#### 3.3.4 Reliability
- Data persistence via localStorage with backup options

## 4. Features Summary

The system comprises 7 main features:

1. **Authentication**: Login/logout functionality
2. **Pricebook Management**: CRUD operations for service/product catalog
3. **Quote Management**: Full quote lifecycle from creation to approval
4. **Job Scheduling**: Assignment and notification system
5. **Staff Job Execution**: Web-based job tracking and updates
6. **Invoicing & Payment**: Automated billing and payment tracking
7. **Reporting**: Data aggregation and basic analytics

## 5. Screen Inventory

Total screens required: 8

1. Login Screen
2. Admin Dashboard
3. Pricebook List
4. Pricebook Create/Edit
5. Quotes List
6. Quote Create/Edit
7. Staff Dashboard
8. Job Detail (Staff)

## 6. Assumptions and Dependencies

- Email/WhatsApp integrations will use existing APIs or manual workflows
- PDF generation will use browser capabilities or lightweight libraries
- Image storage will be local or cloud-based with security considerations

This SRS provides the technical foundation for implementing the Quote-to-End process. Development should follow agile methodologies with iterative testing.</content>
<filePath>c:\Users\Giang Esley\Downloads\fms-product-management\[v2] Quotes\srs_quote_process.md