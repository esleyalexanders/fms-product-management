# Business Requirements Document (BRD): Quote-to-End Process Implementation

## 1. Introduction

### 1.1 Purpose
This Business Requirements Document (BRD) outlines the requirements for implementing the Quote-to-End process in the Franchise Management System (FMS). The process starts from quote creation by the franchisee admin and ends with job completion, payment, and reporting. The system must support both automated workflows and manual interventions, with a focus on web-based interfaces for staff and admin.

### 1.2 Scope
- **In Scope**: Quote creation, delivery, approval, conversion to work orders, scheduling, staff execution via web dashboard, invoicing, payment tracking, closure, and reporting.
- **Out of Scope**: Mobile app development, customer self-service portal, advanced AI features, integration with external payment gateways beyond basic recording.

### 1.3 Business Objectives
- Streamline the quote-to-cash cycle for franchisees.
- Reduce manual communication overhead (e.g., via WhatsApp/Email) by automating notifications and workflows.
- Ensure traceability and compliance for franchisor reporting and royalty calculations.
- Provide staff with a web-based dashboard for job management without requiring mobile apps.

### 1.4 Stakeholders
- Franchisee Admin: Creates quotes, manages approvals, schedules jobs.
- Staff/Technicians: Execute jobs via web dashboard, upload proof.
- Customers: Receive quotes/invoices, provide approvals/payments.
- Franchisor: Receives aggregated data for royalties and KPIs.
- System Developers: Implement the features.

## 2. Functional Requirements

### 2.1 Quote Creation & Delivery
**FR-1.1**: The system shall allow franchisee admin to create quotes using a pricebook, including line items, totals, customer details (name, email, WhatsApp number), and contact preferences.  
**FR-1.2**: Upon creation, the system shall generate a quote PDF or link.  
**FR-1.3**: The system shall automatically send the quote to the customer via email or WhatsApp based on recorded contact information and preferences.  
**Acceptance**: Admin can select customer, add items, generate PDF, and system auto-sends to customer also open a communication channel with client on that chat, so that admin can chat with client

### 2.2 Quote Review & Approval
**FR-2.1**: Customers shall review quotes manually via email/WhatsApp.  
**FR-2.2**: The system shall support recording customer responses: Approve, Request Changes, or No Response.  
**FR-2.3**: For approvals, the system shall convert the quote to a work order automatically.  
**FR-2.4**: For changes, the admin shall update the quote and the system shall automatically resend the updated quote to the customer.  
**FR-2.5**: For no response, the system shall allow admin to send follow-up reminders manually.  
**Acceptance**: Admin can mark approval in system, triggering work order creation; changes loop back to quote update with auto-resend.

### 2.3 Scheduling & Assignment
**FR-3.1**: Admin shall schedule jobs and assign staff in the system.  
**FR-3.2**: The system shall auto-send assignment notifications to staff.  
**FR-3.3**: Staff shall report issues manually via WhatsApp; admin can reassign.  
**Acceptance**: Assignment triggers notification; reassignments update staff notifications.

### 2.4 Job Execution
**FR-4.1**: Staff shall log into a web dashboard to start jobs.  
**FR-4.2**: Staff shall communicate progress/issues manually via WhatsApp.  
**FR-4.3**: For additional work, staff shall request quote changes manually with photos; admin updates and resends to customer.  
**FR-4.4**: Staff shall upload before/after photos via web dashboard.  
**FR-4.5**: Staff shall mark jobs completed in the system.  
**Acceptance**: Web dashboard shows assigned jobs, allows photo uploads, status updates.

### 2.5 Quality Control
**FR-5.1**: The system shall flag jobs for quality checks (e.g., based on rules).  
**FR-5.2**: Admin shall discuss issues manually with staff and reassign/rework if needed.  
**Acceptance**: Post-completion, system alerts admin for review; rework triggers reassignment.

### 2.6 Invoicing & Payment
**FR-6.1**: The system shall auto-generate invoices from completed work orders.  
**FR-6.2**: The system shall automatically send invoices to customers via email or WhatsApp.  
**FR-6.3**: Customers shall make payments manually; admin records in system.  
**FR-6.4**: The system shall track payment status and alert for overdue invoices.  
**FR-6.5**: Admin shall send payment reminders manually.  
**Acceptance**: Invoice generation on completion with auto-send; payment recording closes invoice.

### 2.7 Closure & Reporting
**FR-7.1**: The system shall close invoices upon payment confirmation.  
**FR-7.2**: Admin shall send thank-you and feedback requests manually.  
**FR-7.3**: The system shall aggregate data for franchisor reporting and royalty calculations.  
**Acceptance**: Closure triggers reporting; data available for franchisor dashboard.

## 3. Non-Functional Requirements

### 3.1 Performance
- System shall handle up to 100 concurrent users without degradation.
- Page load times < 3 seconds for web dashboard.

### 3.2 Usability
- Web dashboard shall be responsive and accessible on desktops/tablets.
- Manual steps shall have clear templates and copy-paste options.

### 3.3 Security
- All data shall be encrypted; access restricted by roles (admin, staff).
- Photo uploads shall be secure and stored temporarily.

### 3.4 Integration
- Basic integration with email/WhatsApp for notifications (e.g., via API or manual copy).

## 4. Assumptions
- Customers and staff have access to email/WhatsApp.
- Manual steps are acceptable where automation is complex.
- Franchisor has access to aggregated data via API or dashboard.

## 5. Constraints
- No mobile app; all staff interactions via web.
- Budget for development; prioritize core automation.

## 6. Acceptance Criteria
- All FRs implemented and tested with demo data.
- End-to-end flow from quote creation to closure works without errors.
- Manual steps have system support (e.g., templates).

## 7. Risks & Mitigations
- Manual dependencies: Train users on processes.
- Data accuracy: Implement validation and audits.

This BRD serves as the foundation for development. Review and approve before proceeding.