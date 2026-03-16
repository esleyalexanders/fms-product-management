# SaaS Platform Glossary - Multi-Tier Franchise Management System

**Version:** 1.0  
**Last Updated:** January 12, 2026  
**Purpose:** Standardized terminology for the 3-tier SaaS franchise management platform

---

## 🏗️ Platform Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PLATFORM PROVIDER (YOU)                   │
│                  SaaS Franchise Management System            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ sells packages to
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        FRANCHISOR                            │
│              (Your Customer - Buys Packages)                 │
│              Creates & Manages Franchisees                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ grants franchise rights to
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        FRANCHISEE                            │
│           (Franchisor's Customer - Pays Franchisor)          │
│              Operates Franchise Location(s)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ manages
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRANCHISE LOCATION                        │
│              (Business Unit with Staff & Customers)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Table of Contents

1. [Platform Levels](#platform-levels)
2. [User Roles & Access](#user-roles--access)
3. [Site/Portal Terminology](#siteportal-terminology)
4. [Business Entities](#business-entities)
5. [Financial Relationships](#financial-relationships)
6. [Technical Terms](#technical-terms)
7. [Navigation & UI Labels](#navigation--ui-labels)

---

## 🎯 Platform Levels

### Level 1: Platform Provider (Your Company)
**Who:** Your SaaS company  
**What:** Provides the franchise management system  
**Revenue:** Sells packages/subscriptions to Franchisors  
**Access:** Super admin access to entire platform  
**Portal:** Platform Admin Portal (internal use)

### Level 2: Franchisor
**Who:** Your customer (e.g., "Sunshine Tutoring", "Clean Pro Services")  
**What:** Brand owner who manages multiple franchisees  
**Revenue:** Pays you for the platform; receives payments from franchisees  
**Access:** Franchisor Portal - can manage all their franchisees  
**Portal:** Franchisor Portal

### Level 3: Franchisee
**Who:** Franchisor's customer (individual franchise owner/operator)  
**What:** Operates one or more franchise locations  
**Revenue:** Pays franchisor for franchise rights and ongoing fees  
**Access:** Franchisee Portal - can only see their own franchise(s)  
**Portal:** Franchisee Portal (Main Application)

### Level 4: Franchise Location
**Who:** The actual business unit  
**What:** Physical or virtual location where services are delivered  
**Staff:** Employees who work at this location  
**Customers:** End customers who purchase services  

---

## 👤 User Roles & Access

### Platform Administrator (Your Team)
**Definition:** Your company's staff who manage the entire SaaS platform  
**Usage:** Use "Platform Admin" or "Platform Administrator"  
**Access Level:** Full system access across all franchisors and franchisees  
**Portal:** Platform Admin Portal  
**Responsibilities:**
- Manage franchisor accounts and packages
- System configuration and maintenance
- Platform-wide analytics and reporting
- Billing and subscription management

**Examples:**
- "Platform Admin Dashboard"
- "Platform Administrator Settings"
- "Platform-level Reports"

---

### Franchisor
**Definition:** A business entity that purchases your SaaS platform to manage their franchise network  
**Usage:** Use "Franchisor" consistently  
**Access Level:** Can view and manage all their franchisees  
**Portal:** Franchisor Portal  
**Responsibilities:**
- Create and manage franchisee accounts
- Set franchise-wide policies and branding
- Monitor all franchisee performance
- Manage franchise agreements
- Configure pricebooks and services for franchisees

**Examples:**
- "Franchisor Account"
- "Franchisor Dashboard"
- "Franchisor Settings"
- "Franchisor-level Analytics"

**UI Labels:**
- Login page: "Franchisor Login"
- Dashboard: "Franchisor Dashboard"
- Navigation: "My Franchisees", "Franchise Network"

---

### Franchisee
**Definition:** An individual or entity that operates franchise location(s) under a franchisor's brand  
**Usage:** Use "Franchisee" consistently  
**Access Level:** Can only view and manage their own franchise location(s)  
**Portal:** Franchisee Portal (Main Application)  
**Responsibilities:**
- Manage their franchise location(s)
- Manage staff and schedules
- Create quotes and invoices for customers
- Track timesheets and payroll
- Deliver services to end customers

**Examples:**
- "Franchisee Account"
- "Franchisee Dashboard"
- "Franchisee Profile"
- "My Franchise(s)"

**UI Labels:**
- Login page: "Franchisee Login" or "Franchise Owner Login"
- Dashboard: "My Dashboard" or "Franchise Dashboard"
- Navigation: "My Store", "My Team", "My Customers"

---

### Franchisee Staff
**Definition:** Employees who work at a franchise location  
**Usage:** Use "Staff" or "Staff Member"  
**Access Level:** Limited to their assigned tasks and schedules  
**Portal:** Staff Portal (subset of Franchisee Portal)  
**Responsibilities:**
- View their schedules
- Submit timesheets
- Complete assigned jobs/sessions
- View customer information (as needed)

**Examples:**
- "Staff Portal"
- "Staff Schedule"
- "Staff Timesheet"

---

## 🌐 Site/Portal Terminology

### 1. Platform Admin Portal
**Purpose:** Internal portal for your team to manage the entire SaaS platform  
**URL Pattern:** `admin.yourplatform.com` or `platform.yourplatform.com`  
**Users:** Platform Administrators only  
**Official Name:** "Platform Admin Portal" or "Admin Portal"

**Key Features:**
- Franchisor account management
- Package and subscription management
- Platform-wide analytics
- System configuration
- Billing and payments

**Navigation Labels:**
- "Franchisors" (list of all franchisor accounts)
- "Packages & Pricing"
- "Platform Settings"
- "System Analytics"
- "Billing & Subscriptions"

---

### 2. Franchisor Portal
**Purpose:** Portal for franchisors to manage their franchise network  
**URL Pattern:** `franchisor.yourplatform.com` or `{franchisor-name}.yourplatform.com`  
**Users:** Franchisor administrators and managers  
**Official Name:** "Franchisor Portal" or "Franchise Management Portal"

**Key Features:**
- Create and manage franchisee accounts
- View all franchisee performance
- Configure franchise-wide settings
- Manage branding and pricebooks
- Network-wide analytics

**Navigation Labels:**
- "My Franchisees" or "Franchise Network"
- "Create Franchisee"
- "Network Analytics"
- "Franchise Settings"
- "Branding & Templates"
- "Pricebook Management"

**Page Titles:**
- "Franchisee Management"
- "Create New Franchisee"
- "Franchisee Details"
- "Network Performance"

---

### 3. Franchisee Portal (Main Application)
**Purpose:** Main application for franchisees to operate their business  
**URL Pattern:** `app.yourplatform.com` or `{franchisee-name}.yourplatform.com`  
**Users:** Franchisees and their staff  
**Official Name:** "Franchisee Portal" or simply "The Application"

**Key Features:**
- Manage franchise location(s)
- Staff and team management
- Customer management
- Quotes and invoices
- Learning services and sessions
- Timesheets and payroll
- Scheduling and calendar

**Navigation Labels:**
- "Home" or "Dashboard"
- "My Store" or "My Franchise"
- "Manage Team"
- "Customers"
- "Learning Services"
- "Quotes & Invoices"
- "Timesheets"
- "My Pricebook"

**Page Titles:**
- "Dashboard"
- "Manage Team"
- "Customer Management"
- "Learning Services"
- "Timesheet Manager"

---

### 4. Staff Portal
**Purpose:** Simplified view for franchise staff members  
**URL Pattern:** `staff.yourplatform.com` or `app.yourplatform.com/staff`  
**Users:** Franchise staff members  
**Official Name:** "Staff Portal"

**Key Features:**
- View schedule
- Submit timesheets
- View assigned jobs/sessions
- Clock in/out

**Navigation Labels:**
- "My Schedule"
- "My Timesheets"
- "My Jobs"
- "Profile"

---

## 🏢 Business Entities

### Franchisor Account
**Definition:** A customer account in your SaaS platform representing a franchise brand  
**Usage:** Use "Franchisor Account" or "Franchisor"  
**Database:** One record per franchisor  
**Relationship:** One franchisor → Many franchisees

**Attributes:**
- Franchisor Name (e.g., "Sunshine Tutoring")
- Package/Subscription Level
- Billing Information
- Brand Settings
- Number of Franchisees (count)

**Examples:**
- "Create Franchisor Account"
- "Franchisor Account Settings"
- "Franchisor Subscription"

---

### Franchisee Account
**Definition:** An account representing a franchise owner within a franchisor's network  
**Usage:** Use "Franchisee Account" or "Franchisee"  
**Database:** One record per franchisee  
**Relationship:** Many franchisees → One franchisor  
**Relationship:** One franchisee → One or more franchise locations

**Attributes:**
- Franchisee Name (e.g., "John Smith")
- Business Name (e.g., "Sunshine Tutoring - Melbourne East")
- Franchisor (parent)
- Franchise Location(s)
- Status (Active/Inactive)
- Agreement Details

**Examples:**
- "Create Franchisee Account"
- "Franchisee Profile"
- "Franchisee Status"

---

### Franchise / Franchise Location
**Definition:** A specific business location operated by a franchisee  
**Usage:** Use "Franchise" or "Franchise Location"  
**Database:** One record per location  
**Relationship:** Many franchises → One franchisee

**Attributes:**
- Location Name (e.g., "Melbourne East")
- Address
- Staff Members
- Customers
- Pricebook
- Settings

**Examples:**
- "Franchise Location"
- "Select Franchise"
- "Franchise Settings"

**Note:** A franchisee may operate multiple franchise locations. Use "Franchise Location" when clarity is needed.

---

### Store
**Definition:** User-facing term for a franchise location  
**Usage:** Use "Store" in franchisee-facing UI  
**Context:** Franchisee Portal, branding  
**Examples:**
- "My Store"
- "Store Name"
- "Store Settings"

**Note:** "Store" and "Franchise Location" refer to the same entity, but "Store" is more user-friendly for the franchisee portal.

---

## 💰 Financial Relationships

### Platform Provider ← Franchisor
**Relationship:** Franchisor is your customer  
**Payment Flow:** Franchisor pays Platform Provider  
**Payment Type:** Subscription/Package fees  
**Terminology:**
- "Franchisor Subscription"
- "Package Plan"
- "Monthly/Annual Fee"
- "Platform Subscription"

**Examples:**
- "Upgrade Franchisor Package"
- "Franchisor Billing"
- "Subscription Status: Active"

---

### Franchisor ← Franchisee
**Relationship:** Franchisee is franchisor's customer  
**Payment Flow:** Franchisee pays Franchisor  
**Payment Type:** Franchise fees, royalties, ongoing fees  
**Terminology:**
- "Franchise Fee"
- "Royalty Payment"
- "Franchisee Payment"
- "Franchise Agreement"

**Note:** These payments are between franchisor and franchisee. Your platform may facilitate tracking but doesn't process these payments.

**Examples:**
- "Franchisee Payment Status"
- "Franchise Agreement Terms"
- "Royalty Rate"

---

### Franchisee ← Customer
**Relationship:** Customer purchases services from franchisee  
**Payment Flow:** Customer pays Franchisee  
**Payment Type:** Service payments, product purchases  
**Terminology:**
- "Customer Payment"
- "Invoice"
- "Quote"
- "Service Fee"

**Examples:**
- "Customer Invoice"
- "Payment Received"
- "Quote Sent to Customer"

---

## 🔧 Technical Terms

### Multi-Tenancy Architecture

#### Tenant
**Definition:** A logically isolated instance within the system  
**Usage:** Use "Tenant" in technical/backend contexts  
**Levels:**
- **Franchisor Tenant:** Each franchisor is a tenant
- **Franchisee Tenant:** Each franchisee is a sub-tenant (optional architecture)

**Examples:**
- "Tenant ID"
- "Tenant Configuration"
- "Multi-tenant Database"

---

#### Tenant Hierarchy
```
Platform (Super Tenant)
└── Franchisor Tenant 1
    ├── Franchisee Tenant 1.1
    │   ├── Franchise Location 1.1.1
    │   └── Franchise Location 1.1.2
    ├── Franchisee Tenant 1.2
    │   └── Franchise Location 1.2.1
    └── Franchisee Tenant 1.3
        └── Franchise Location 1.3.1
└── Franchisor Tenant 2
    ├── Franchisee Tenant 2.1
    └── Franchisee Tenant 2.2
```

---

### Account vs User

#### Account
**Definition:** A business entity record (Franchisor or Franchisee)  
**Usage:** Use "Account" for the business entity  
**Examples:**
- "Franchisor Account"
- "Franchisee Account"
- "Account Settings"

#### User
**Definition:** An individual person who logs into the system  
**Usage:** Use "User" for individual login credentials  
**Examples:**
- "User Login"
- "User Permissions"
- "User Profile"

**Relationship:**
- One Account → Many Users
- Example: A franchisor account may have multiple users (admin, manager, analyst)

---

### Subscription vs License

#### Subscription (Platform Level)
**Definition:** Franchisor's payment plan for using the platform  
**Usage:** Use "Subscription" for franchisor's platform access  
**Examples:**
- "Franchisor Subscription"
- "Subscription Plan: Enterprise"
- "Subscription Status: Active"

#### License (Franchise Level)
**Definition:** Franchisee's right to operate under the franchisor's brand  
**Usage:** Use "License" or "Franchise Agreement" for franchisee rights  
**Examples:**
- "Franchise License"
- "License Agreement"
- "License Status"

---

## 🎨 Navigation & UI Labels

### Platform Admin Portal

#### Main Navigation
```
- Dashboard
- Franchisors
  - All Franchisors
  - Create Franchisor
  - Packages & Plans
- Analytics
  - Platform Analytics
  - Revenue Reports
- Settings
  - Platform Settings
  - Billing Configuration
- Support
```

#### Page Titles
- "Platform Dashboard"
- "Franchisor Management"
- "Create New Franchisor"
- "Franchisor Details: [Name]"
- "Package Management"
- "Platform Analytics"

---

### Franchisor Portal

#### Main Navigation
```
- Dashboard
- My Franchisees
  - All Franchisees
  - Create Franchisee
  - Franchisee Performance
- Network Analytics
  - Performance Overview
  - Revenue Reports
- Settings
  - Franchise Settings
  - Branding
  - Pricebook Templates
- My Account
  - Subscription
  - Billing
  - Profile
```

#### Page Titles
- "Franchisor Dashboard"
- "Franchisee Management"
- "Create New Franchisee"
- "Franchisee Details: [Name]"
- "Network Performance"
- "Franchise Settings"

#### Terminology in UI
- Use "Franchisee" not "Franchise Owner"
- Use "My Franchisees" not "My Franchises" (when referring to people)
- Use "Franchise Network" for collective view
- Use "Create Franchisee" not "Add Franchise"

---

### Franchisee Portal (Main Application)

#### Main Navigation
```
- Home / Dashboard
- Learning Services
  - Learning Services
  - Sessions
  - Schedule Calendar
- Quotes & Invoices
  - Quotes
  - Invoices
- Customers
- Manage Team
  - Team Members
  - Roles & Permissions
- Timesheets
- My Pricebook
- Settings
  - My Store
  - Profile
```

#### Page Titles
- "Dashboard"
- "Learning Services"
- "Manage Team"
- "Customer Management"
- "Timesheet Manager"
- "My Pricebook"

#### Terminology in UI
- Use "My Store" not "My Franchise" (more user-friendly)
- Use "Manage Team" not "Staff Management"
- Use "My Pricebook" not "Services Catalog"
- Avoid showing "Franchisee" label (they know who they are)

---

### Staff Portal

#### Main Navigation
```
- My Schedule
- My Timesheets
- My Jobs
- Profile
```

#### Page Titles
- "My Schedule"
- "Submit Timesheet"
- "My Jobs"
- "My Profile"

---

## 📊 Data Ownership & Visibility

### Platform Admin Can See:
- ✅ All franchisors
- ✅ All franchisees (across all franchisors)
- ✅ All franchise locations
- ✅ Platform-wide analytics
- ✅ All billing and subscriptions

### Franchisor Can See:
- ✅ Their own franchisor account
- ✅ All their franchisees
- ✅ All franchise locations under their franchisees
- ✅ Network-wide analytics (their network only)
- ❌ Other franchisors' data
- ❌ Platform-level data

### Franchisee Can See:
- ✅ Their own franchisee account
- ✅ Their franchise location(s)
- ✅ Their staff, customers, quotes, invoices
- ✅ Their analytics
- ❌ Other franchisees' data
- ❌ Franchisor's network data
- ❌ Platform-level data

### Staff Can See:
- ✅ Their own schedule
- ✅ Their timesheets
- ✅ Their assigned jobs/sessions
- ✅ Customer information (as needed for their work)
- ❌ Other staff members' data (unless manager)
- ❌ Financial data
- ❌ Franchise-level analytics

---

## 🔑 Key Principles for Consistency

### 1. Use Role-Appropriate Language
- **Platform Admin Portal:** Technical, administrative language
- **Franchisor Portal:** Business management language
- **Franchisee Portal:** Operational, user-friendly language
- **Staff Portal:** Simple, task-focused language

### 2. Avoid Ambiguity
- ✅ "Create Franchisee" (clear - creating a franchisee account)
- ❌ "Add Franchise" (ambiguous - franchisee or location?)

### 3. Consistent Hierarchy
Always maintain the hierarchy in language:
```
Platform Provider → Franchisor → Franchisee → Franchise Location → Staff
```

### 4. Context-Aware Terminology
- **In Platform Admin Portal:** "Franchisor Account", "Franchisee Account"
- **In Franchisor Portal:** "My Franchisees", "Franchisee Performance"
- **In Franchisee Portal:** "My Store", "My Team" (avoid "franchisee" label)

### 5. Payment Clarity
- **Platform ← Franchisor:** "Subscription", "Package Fee"
- **Franchisor ← Franchisee:** "Franchise Fee", "Royalty"
- **Franchisee ← Customer:** "Invoice", "Payment"

---

## 📝 Common Scenarios & Terminology

### Scenario 1: Platform Admin Creates Franchisor
**Portal:** Platform Admin Portal  
**Action:** "Create Franchisor Account"  
**Page Title:** "Create New Franchisor"  
**Form Fields:**
- Franchisor Name
- Contact Information
- Package Plan
- Subscription Start Date

---

### Scenario 2: Franchisor Creates Franchisee
**Portal:** Franchisor Portal  
**Action:** "Create Franchisee"  
**Page Title:** "Create New Franchisee"  
**Form Fields:**
- Franchisee Name
- Business Name (Franchise Location Name)
- Contact Information
- Franchise Agreement Details
- Initial Settings

---

### Scenario 3: Franchisee Manages Their Business
**Portal:** Franchisee Portal  
**Navigation:** "My Store" → "Settings"  
**Page Title:** "Store Settings" or "Franchise Settings"  
**Sections:**
- Store Information
- Branding
- Business Hours
- Contact Details

---

### Scenario 4: Franchisee Adds Staff
**Portal:** Franchisee Portal  
**Navigation:** "Manage Team" → "Add Staff"  
**Page Title:** "Add Staff Member"  
**Form Fields:**
- Staff Member Name
- Job Title
- Role
- Contact Information

---

## ✅ Terminology Checklist

### When Building Platform Admin Portal:
- [ ] Use "Franchisor" for your customers
- [ ] Use "Franchisee" for franchisor's customers
- [ ] Use "Platform Admin" for your role
- [ ] Use "Subscription" for franchisor's payment plan
- [ ] Show full hierarchy and relationships

### When Building Franchisor Portal:
- [ ] Use "My Franchisees" in navigation
- [ ] Use "Franchisee" consistently (not "franchise owner")
- [ ] Use "Create Franchisee" for action buttons
- [ ] Use "Network" for collective views
- [ ] Show franchisee performance and analytics

### When Building Franchisee Portal:
- [ ] Use "My Store" (not "My Franchise")
- [ ] Use "Manage Team" (not "Staff Management")
- [ ] Use "My Pricebook" (not "Services")
- [ ] Avoid showing "Franchisee" label in UI
- [ ] Focus on operational language

### When Building Staff Portal:
- [ ] Use "My" prefix (My Schedule, My Timesheets)
- [ ] Keep language simple and task-focused
- [ ] Avoid business management terminology
- [ ] Focus on individual tasks

---

## 📚 Related Documents

- `OFFICIAL_GLOSSARY.md` - Complete terminology reference for franchisee portal
- `TERMINOLOGY_QUICK_REFERENCE.md` - Quick lookup for developers
- `HTML_FILES_INVENTORY.md` - Complete file listing

---

## 🎯 Summary Table

| Term | Platform Admin Uses | Franchisor Uses | Franchisee Uses | Staff Uses |
|------|-------------------|-----------------|-----------------|------------|
| **Franchisor** | ✅ Franchisor Account | ✅ My Account | ❌ (hidden) | ❌ (hidden) |
| **Franchisee** | ✅ Franchisee Account | ✅ My Franchisees | ❌ (hidden) | ❌ (hidden) |
| **Franchise/Store** | ✅ Franchise Location | ✅ Franchise Location | ✅ My Store | ❌ (just "work location") |
| **Staff** | ✅ Staff Member | ✅ Staff Member | ✅ Team Member / Staff | ✅ (self reference) |
| **Customer** | ❌ (not visible) | ✅ (in analytics) | ✅ Customer | ✅ Customer |
| **Subscription** | ✅ Franchisor Subscription | ✅ My Subscription | ❌ (hidden) | ❌ (hidden) |
| **Package** | ✅ Package Plan | ✅ My Package | ❌ (hidden) | ❌ (hidden) |

---

**Version:** 1.0  
**Last Updated:** January 12, 2026  
**Document Owner:** Product Management Team

*This glossary ensures consistent terminology across all three portals of the SaaS franchise management platform.*
