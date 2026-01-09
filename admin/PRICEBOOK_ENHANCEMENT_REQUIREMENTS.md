# Pricebook Enhancement - Business Requirements Document

**Document Version:** 1.0  
**Date:** January 9, 2026  
**Author:** Product Management Team  
**Status:** Draft - Pending Approval

---

## Executive Summary

This document outlines the business requirements for enhancing the Pricebook module with two new fields that will improve service offering management and payment flexibility. These enhancements will enable better control over which services can be linked to learning service types and provide more flexible payment configuration options.

---

## 1. Business Context

### 1.1 Current State
The current Pricebook system allows users to create and manage service/product items with basic information including:
- Type (Service/Product)
- SKU/Code
- Name and Description
- Pricing and Tax information
- MOQ (Minimum Order Quantity) and Units

### 1.2 Business Challenge
Currently, the system lacks:
1. **Service Type Specificity**: When customers create learning services (Class, Group, or One-off), they can link any pricebook item regardless of whether it's suitable for that service type
2. **Payment Model Flexibility**: The system doesn't capture which payment models (Subscription, One-time, etc.) a pricebook item supports, leading to configuration issues when adding items to quotes

### 1.3 Proposed Solution
Add two new fields to the Pricebook module:
1. **Applicable Service Types** (multi-select)
2. **Supported Payment Models** (multi-select)

---

## 2. Detailed Requirements

### 2.1 Feature 1: Applicable Service Types

#### 2.1.1 Field Name Recommendation
**Recommended Name:** "Applicable Service Types"

**Alternative Names Considered:**
- Service Applicability
- Compatible Service Types
- Service Type Compatibility
- Eligible Service Types
- Valid for Service Types

**Rationale:** "Applicable Service Types" clearly communicates that this field defines which types of learning services this pricebook item can be applied to.

#### 2.1.2 Field Specifications

| Attribute | Details |
|-----------|---------|
| **Field Type** | Multi-select dropdown |
| **Required** | Optional (if not selected, item is applicable to all types) |
| **Options** | • Class<br>• Group<br>• One-off |
| **Default Value** | All selected (backwards compatibility) |
| **Display Location** | • Create Pricebook Item screen<br>• Edit Pricebook Item screen<br>• Pricebook Details/View screen |
| **Section** | Service Details (for Service type items only) |

#### 2.1.3 Business Rules

1. **Selection Logic**
   - Users can select one, multiple, or all service types
   - At least one option must be selected if the field is used
   - If no selection is made, default to "All types applicable"

2. **Visibility Rules**
   - This field should only appear when Type = "Service"
   - Hidden when Type = "Product"

3. **Backward Compatibility**
   - Existing pricebook items should default to "All types applicable"
   - Migration script should set all three types as selected for existing items

#### 2.1.4 Impact on System Behavior

**Impact Point 1: Learning Service Creation**
- **Location:** When creating/editing a Learning Service and linking pricebook items
- **Current Behavior:** All service-type pricebook items are available for selection
- **New Behavior:** Only pricebook items where the selected service type matches the learning service type being created will be available
- **Example:** 
  - If creating a "Class" type learning service, only pricebook items with "Class" selected in Applicable Service Types will appear in the item selection dropdown

**Impact Point 2: Quote Line Items**
- **Location:** When adding pricebook items to quotes for learning services
- **Current Behavior:** All items can be added
- **New Behavior:** System validates that the pricebook item's applicable service types match the learning service type
- **Validation Message:** "This item is not applicable for [Service Type] learning services. Please select an item that supports [Service Type]."

**Impact Point 3: Pricebook List View**
- **Location:** Pricebook table view
- **Enhancement:** Add a column or badge showing applicable service types
- **Display Format:** Icons or abbreviated text (e.g., "C, G, O" or icons representing Class, Group, One-off)

---

### 2.2 Feature 2: Supported Payment Models

#### 2.2.1 Field Specifications

| Attribute | Details |
|-----------|---------|
| **Field Name** | Supported Payment Models |
| **Field Type** | Multi-select dropdown |
| **Required** | Optional (if not selected, all payment models supported) |
| **Options** | • Full Payment (Upfront)<br>• Down Payment (Deposit)<br>• Subscription (Recurring) |
| **Default Value** | All selected (backwards compatibility) |
| **Display Location** | • Create Pricebook Item screen<br>• Edit Pricebook Item screen<br>• Pricebook Details/View screen |
| **Section** | Pricing (applicable to both Service and Product) |

#### 2.2.2 Business Rules

1. **Selection Logic**
   - Users can select one, multiple, or all payment models
   - At least one option must be selected if the field is used
   - If no selection is made, default to "All payment models supported"

2. **Visibility Rules**
   - This field appears for both Service and Product types
   - Always visible in the Pricing section

3. **Backward Compatibility**
   - Existing pricebook items should default to "All payment models supported"
   - Migration script should set all payment models as selected for existing items

#### 2.2.3 Payment Model Definitions

| Payment Model | Description | Use Case | Configuration Details |
|---------------|-------------|----------|----------------------|
| **Full Payment (Upfront)** | Customer pays the entire amount upfront before service begins | One-time services, products, prepaid packages | No additional configuration needed |
| **Down Payment (Deposit)** | Customer pays a deposit now, with the remaining balance due later | High-value services, booking confirmations, split payments | Deposit amount/percentage configured at quote level |
| **Subscription (Recurring)** | Automatic recurring invoices at regular intervals | Memberships, ongoing services, recurring classes | **Frequency (weekly, monthly, quarterly, annually) is configured at quote level**, not in pricebook |

**Important Note:** The pricebook item only indicates that it *supports* subscription payment. The actual subscription frequency (weekly, monthly, etc.) is configured when adding the item to a quote, allowing the same pricebook item to be sold with different billing frequencies to different customers.

#### 2.2.4 Impact on System Behavior

**Impact Point 1: Quote Configuration**
- **Location:** When adding pricebook items to quote lines
- **Current Behavior:** All payment configuration options are available
- **New Behavior:** Only payment configuration options that match the pricebook item's supported payment models are available
- **Example:**
  - If a pricebook item only supports "Full Payment (Upfront)" and "Subscription (Recurring)"
  - When added to a quote, only these two payment options appear in the payment configuration dropdown
  - "Down Payment (Deposit)" option is hidden or disabled
  - **If "Subscription (Recurring)" is selected**, additional configuration appears for:
    - Billing frequency (Weekly, Monthly, Quarterly, Annually)
    - Start date
    - End date (optional)
    - Any other subscription-specific settings

**Impact Point 2: Payment Configuration UI**
- **Location:** Quote line item payment configuration section
- **Enhancement:** Display a helper text showing which payment models are supported
- **Display Format:** "Available payment options for this item: Full Payment (Upfront), Subscription (Recurring)"

**Impact Point 3: Validation**
- **Location:** Quote save/submit
- **Validation Rule:** Ensure selected payment configuration matches one of the supported payment models
- **Error Message:** "The selected payment configuration is not supported for [Item Name]. Supported models: [List of models]"

**Impact Point 4: Pricebook List View**
- **Location:** Pricebook table view
- **Enhancement:** Add a column showing supported payment models
- **Display Format:** Icons or abbreviated text (e.g., "Full, Deposit, Sub" or payment method icons)

#### 2.2.5 Configuration Workflow: Pricebook vs Quote

**Two-Level Configuration Approach:**

This feature implements a two-level configuration system that separates **capability** (pricebook) from **implementation** (quote):

**Level 1: Pricebook (Capability)**
- Defines **which payment models** the item supports
- Example: "This yoga class supports Full Payment and Subscription"
- Does NOT define specific details like subscription frequency or deposit amounts
- Purpose: Acts as a constraint/filter for what's possible

**Level 2: Quote (Implementation)**
- Defines **how** the selected payment model is configured
- Example: "This customer will pay via Monthly Subscription starting Feb 1st"
- Includes all specific details:
  - **For Subscription:** Frequency (weekly/monthly/quarterly/annually), start date, end date
  - **For Down Payment:** Deposit amount or percentage, due dates
  - **For Full Payment:** Due date
- Purpose: Actual terms for this specific customer/sale

**Benefits of This Approach:**
1. **Flexibility:** Same pricebook item can be sold with different subscription frequencies
2. **Simplicity:** Pricebook remains clean and focused on what's possible
3. **Customer-Specific:** Each quote can have unique payment terms
4. **Reusability:** One pricebook item serves multiple billing scenarios

**Example Workflow:**
1. Admin creates pricebook item "Monthly Yoga Membership" 
2. Admin marks it as supporting "Subscription (Recurring)" ✓
3. Sales rep creates quote for Customer A
4. Sales rep adds "Monthly Yoga Membership" to quote
5. Sales rep selects "Subscription (Recurring)" payment model
6. **System shows subscription configuration:** Weekly / Monthly / Quarterly / Annually
7. Sales rep chooses "Monthly" with start date Feb 1, 2026
8. Different customer (Customer B) gets same item but with "Weekly" billing

---

## 3. User Interface Specifications

### 3.1 Create Pricebook Item Screen

#### 3.1.1 Field Placement

**Service Details Section** (for Service type items):
```
┌─────────────────────────────────────────────────────┐
│ Service Details                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│ [MOQ Field]              [Unit Field]               │
│                                                      │
│ Applicable Service Types *                          │
│ ┌────────────────────────────────────────────────┐  │
│ │ ☑ Class    ☑ Group    ☑ One-off              │  │
│ └────────────────────────────────────────────────┘  │
│ ℹ️ Select which learning service types can use     │
│   this item                                         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Pricing Section** (for both Service and Product):
```
┌─────────────────────────────────────────────────────┐
│ Pricing                                              │
├─────────────────────────────────────────────────────┤
│                                                      │
│ [Price Field]                                        │
│ [Tax Category Field]                                 │
│                                                      │
│ Supported Payment Models *                          │
│ ┌────────────────────────────────────────────────┐  │
│ │ ☑ Full Payment (Upfront)                       │  │
│ │ ☑ Down Payment (Deposit)                       │  │
│ │ ☑ Subscription (Recurring)                     │  │
│ └────────────────────────────────────────────────┘  │
│ ℹ️ Select payment models this item can support     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

#### 3.1.2 Interaction Design

**Multi-select Implementation:**
- Use checkbox-based multi-select for better UX
- All options visible at once (no dropdown needed for 3-4 options)
- Visual feedback when hovering over options
- "Select All" / "Clear All" quick actions

**Validation:**
- At least one option must be selected in each field
- Visual indicator (red border) if form is submitted with no selections
- Error message: "Please select at least one [service type/payment model]"

### 3.2 Edit Pricebook Item Screen

- Same layout as Create screen
- Pre-populate with existing selections
- For legacy items (created before this feature), all options should be pre-selected

### 3.3 Pricebook Details/View Screen

**Display Format:**
```
┌─────────────────────────────────────────────────────┐
│ Service Details                                      │
├─────────────────────────────────────────────────────┤
│ MOQ: 1 hour                                          │
│ Unit: Hour                                           │
│                                                      │
│ Applicable Service Types:                           │
│ 🎓 Class  👥 Group  📅 One-off                      │
│                                                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Pricing                                              │
├─────────────────────────────────────────────────────┤
│ Price: AUD 79.00 per hour                            │
│ Tax: GST 10%                                         │
│                                                      │
│ Supported Payment Models:                           │
│ � Full Payment (Upfront)  � Down Payment (Deposit)│
│ 🔄 Subscription (Recurring)                         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 3.4 Pricebook List View

**Enhanced Table Columns:**

| Image | Item | SKU/Code | Price | Service Types | Payment Models | Tax | Status | Actions |
|-------|------|----------|-------|---------------|----------------|-----|--------|---------|
| [img] | Window Cleaning | WC100 | $120.00 | C, G, O | All | GST 10% | Published | [actions] |
| [img] | Yoga Class | YC200 | $25.00 | C | Full, Sub | GST 10% | Published | [actions] |

**Legend:**
- C = Class
- G = Group  
- O = One-off
- Full = Full Payment (Upfront)
- Deposit = Down Payment (Deposit)
- Sub = Subscription (Recurring)

**Responsive Design:**
- On mobile, these columns can be collapsed into expandable rows
- Use icons with tooltips for better space utilization

---

## 4. Data Model

### 4.1 Database Schema Changes

**Table:** `pricebook_items`

**New Columns:**

```sql
-- Applicable Service Types (stored as JSON array or separate junction table)
applicable_service_types TEXT NULL,  -- JSON: ["class", "group", "one-off"]

-- Supported Payment Models (stored as JSON array or separate junction table)
supported_payment_models TEXT NULL,  -- JSON: ["full_payment", "down_payment", "subscription"]

-- Metadata
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**Alternative Approach (Normalized):**

```sql
-- Junction table for service types
CREATE TABLE pricebook_item_service_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pricebook_item_id INT NOT NULL,
    service_type ENUM('class', 'group', 'one-off') NOT NULL,
    FOREIGN KEY (pricebook_item_id) REFERENCES pricebook_items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_item_type (pricebook_item_id, service_type)
);

-- Junction table for payment models
CREATE TABLE pricebook_item_payment_models (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pricebook_item_id INT NOT NULL,
    payment_model ENUM('full_payment', 'down_payment', 'subscription') NOT NULL,
    FOREIGN KEY (pricebook_item_id) REFERENCES pricebook_items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_item_model (pricebook_item_id, payment_model)
);
```

### 4.2 API Changes

**GET /api/pricebook/items**
```json
{
  "id": "1",
  "type": "service",
  "name": "Yoga Class",
  "sku": "YC200",
  "price": 25.00,
  "currency": "AUD",
  "tax": "GST 10%",
  "applicable_service_types": ["class"],
  "supported_payment_models": ["full_payment", "subscription"],
  "published": true
}
```

**POST /api/pricebook/items**
```json
{
  "type": "service",
  "name": "Yoga Class",
  "sku": "YC200",
  "price": 25.00,
  "currency": "AUD",
  "tax": "taxable_gst",
  "applicable_service_types": ["class"],
  "supported_payment_models": ["full_payment", "subscription"]
}
```

**New Endpoint: GET /api/pricebook/items/filter**
```
Query Parameters:
- service_type: class|group|one-off
- payment_model: full_payment|down_payment|subscription

Example: GET /api/pricebook/items/filter?service_type=class&payment_model=subscription
```

---

## 5. Business Impact Analysis

### 5.1 Benefits

#### 5.1.1 Operational Benefits
1. **Reduced Errors**: Prevents users from selecting incompatible pricebook items for learning services
2. **Improved Data Quality**: Ensures payment configurations match item capabilities
3. **Better User Experience**: Streamlined selection process with only relevant options shown
4. **Faster Quote Creation**: Less time spent validating compatibility manually

#### 5.1.2 Business Benefits
1. **Increased Flexibility**: Support for multiple payment models enables diverse business models
2. **Better Service Categorization**: Clear distinction between service types improves catalog management
3. **Scalability**: Foundation for future enhancements (e.g., pricing rules per service type)
4. **Compliance**: Better tracking of payment terms for financial reporting

### 5.2 Risks and Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| User confusion with new fields | Medium | Medium | • Provide clear help text<br>• Add tooltips<br>• Create user guide<br>• Default to "all selected" |
| Data migration issues | High | Low | • Thorough testing of migration script<br>• Backup before migration<br>• Rollback plan |
| Performance impact on filtering | Medium | Low | • Add database indexes<br>• Implement caching<br>• Optimize queries |
| Existing integrations break | High | Medium | • Maintain backward compatibility<br>• Version API endpoints<br>• Communicate changes early |

### 5.3 Dependencies

**Upstream Dependencies:**
- Learning Service Management module must be updated to filter pricebook items
- Quote Management module must validate payment model compatibility

**Downstream Dependencies:**
- Reporting module may need updates to include new fields
- Export/Import functionality must handle new fields

---

## 6. Implementation Approach

### 6.1 Phased Rollout

**Phase 1: Foundation (Week 1-2)**
- Database schema updates
- API endpoint modifications
- Backend validation logic

**Phase 2: UI Implementation (Week 3-4)**
- Update Create Pricebook Item screen
- Update Edit Pricebook Item screen
- Update Pricebook List view
- Update Pricebook Details view

**Phase 3: Integration (Week 5-6)**
- Integrate with Learning Service creation flow
- Integrate with Quote line item configuration
- Add filtering logic

**Phase 4: Testing & Refinement (Week 7-8)**
- User acceptance testing
- Performance testing
- Bug fixes and refinements
- Documentation updates

### 6.2 Data Migration Strategy

**Migration Script Requirements:**
1. Add new columns to `pricebook_items` table
2. Set default values for existing items:
   - `applicable_service_types`: `["class", "group", "one-off"]`
   - `supported_payment_models`: `["full_payment", "down_payment", "subscription"]`
3. Create audit log of migration
4. Validate data integrity post-migration

**Rollback Plan:**
- Keep backup of pre-migration database
- Document rollback SQL scripts
- Test rollback procedure in staging environment

---

## 7. Success Metrics

### 7.1 Key Performance Indicators (KPIs)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Adoption Rate** | 80% of new pricebook items use the new fields within 3 months | Track field usage in database |
| **Error Reduction** | 50% reduction in incompatible item selections | Compare error logs before/after |
| **User Satisfaction** | 4.5/5 rating for new feature | User survey |
| **Quote Creation Time** | 20% reduction in time to create quotes | Analytics tracking |
| **Support Tickets** | <5 tickets related to new fields in first month | Support ticket analysis |

### 7.2 Success Criteria

**Must Have:**
- ✅ All existing pricebook items migrated successfully
- ✅ New fields appear in Create/Edit/View screens
- ✅ Filtering works correctly in Learning Service creation
- ✅ Payment model validation works in Quote configuration
- ✅ No regression in existing functionality

**Should Have:**
- ✅ Enhanced pricebook list view with new columns
- ✅ Comprehensive help documentation
- ✅ API documentation updated
- ✅ Performance benchmarks met

**Nice to Have:**
- ✅ Bulk edit capability for new fields
- ✅ Import/Export support for new fields
- ✅ Advanced filtering in pricebook list
- ✅ Analytics dashboard for field usage

---

## 8. User Stories

### 8.1 As a Service Provider

**Story 1: Creating a Class-Specific Service**
```
As a yoga studio owner,
I want to mark my "Group Yoga Class" pricebook item as applicable only to "Class" type learning services,
So that it doesn't appear as an option when creating one-off private sessions.

Acceptance Criteria:
- I can select "Class" only in the Applicable Service Types field
- When creating a "One-off" learning service, this item doesn't appear in the selection list
- When creating a "Class" learning service, this item appears in the selection list
```

**Story 2: Configuring Payment Models**
```
As a service provider,
I want to specify that my "Yoga Membership" item supports subscription payments,
So that when creating quotes, I can offer customers flexible billing frequencies (weekly, monthly, etc.).

Acceptance Criteria:
- I can select "Subscription (Recurring)" in the Supported Payment Models field in the pricebook
- The pricebook does NOT ask me to specify the frequency (weekly/monthly) - this is configured later
- When adding this item to a quote and selecting "Subscription (Recurring)", the system shows frequency options
- I can choose different frequencies for different customers using the same pricebook item
- System prevents saving the quote if a non-subscription payment is selected for this item
```

### 8.2 As a Sales Representative

**Story 3: Creating a Quote**
```
As a sales representative,
I want to see only compatible pricebook items when creating a quote for a group learning service,
So that I don't waste time reviewing incompatible options.

Acceptance Criteria:
- When creating a quote for a "Group" learning service, only items with "Group" selected appear
- Items marked for "Class" or "One-off" only are hidden
- I can see a badge or indicator showing which service types each item supports
```

**Story 4: Configuring Subscription Frequency**
```
As a sales representative,
I want to configure the subscription billing frequency when adding a subscription-enabled item to a quote,
So that I can offer different billing options to different customers.

Acceptance Criteria:
- When I add a pricebook item that supports "Subscription (Recurring)" to a quote
- And I select "Subscription (Recurring)" as the payment model
- The system shows me frequency options: Weekly, Monthly, Quarterly, Annually
- I can select the appropriate frequency for this customer
- I can also configure start date and optional end date
- The same pricebook item can be used with different frequencies for different customers
- The configured frequency is saved with the quote line item, not the pricebook item
```

**Story 5: Configuring Payment Options**
```
As a sales representative,
I want the payment configuration options to automatically adjust based on the selected pricebook item,
So that I only see valid payment options and avoid configuration errors.

Acceptance Criteria:
- Payment dropdown shows only models supported by the selected pricebook item
- Unsupported payment models are hidden or disabled
- Helper text shows which payment models are available
```

### 8.3 As a System Administrator

**Story 5: Managing Existing Items**
```
As a system administrator,
I want all existing pricebook items to default to "all types" and "all payment models",
So that the system remains backward compatible and existing workflows aren't disrupted.

Acceptance Criteria:
- After migration, all existing items have all service types selected
- After migration, all existing items have all payment models selected
- No existing quotes or learning services are affected
```

---

## 9. Testing Requirements

### 9.1 Unit Testing

**Test Cases for Applicable Service Types:**
1. Create pricebook item with single service type
2. Create pricebook item with multiple service types
3. Create pricebook item with all service types
4. Validate that at least one service type is selected
5. Test visibility rules (show only for Service type items)

**Test Cases for Supported Payment Models:**
1. Create pricebook item with single payment model
2. Create pricebook item with multiple payment models
3. Create pricebook item with all payment models
4. Validate that at least one payment model is selected
5. Test visibility for both Service and Product types

### 9.2 Integration Testing

**Test Cases:**
1. Create learning service and verify only compatible pricebook items appear
2. Add pricebook item to quote and verify payment options are filtered
3. Attempt to save quote with incompatible payment model (should fail)
4. Edit pricebook item and verify changes reflect in learning service selection
5. Test API endpoints with new fields

### 9.3 User Acceptance Testing (UAT)

**Scenarios:**
1. Service provider creates new pricebook items with specific service types
2. Sales rep creates quote for different learning service types
3. Administrator migrates existing pricebook items
4. User edits existing pricebook item to add restrictions
5. User views pricebook list and filters by service type/payment model

### 9.4 Performance Testing

**Benchmarks:**
1. Pricebook list load time with 1000+ items: <2 seconds
2. Filtering by service type: <500ms
3. Quote creation with payment model filtering: <1 second
4. Database query performance with new indexes: <100ms

---

## 10. Documentation Requirements

### 10.1 User Documentation

**Required Documents:**
1. **Feature Guide**: "Managing Service Types and Payment Models in Pricebook"
2. **Quick Start Guide**: "Setting Up Your First Service-Specific Pricebook Item"
3. **FAQ**: Common questions about new fields
4. **Video Tutorial**: 5-minute walkthrough of new features

### 10.2 Technical Documentation

**Required Documents:**
1. **API Documentation**: Updated endpoint specifications
2. **Database Schema**: Updated ERD and data dictionary
3. **Migration Guide**: Step-by-step migration instructions
4. **Developer Guide**: Integration guidelines for other modules

### 10.3 Training Materials

**Required Materials:**
1. **Admin Training**: 30-minute session on managing new fields
2. **Sales Training**: 15-minute session on using filtered selections
3. **Support Training**: Troubleshooting guide for common issues

---

## 11. Compliance and Security

### 11.1 Data Privacy

- New fields contain business configuration data (no PII)
- Standard data retention policies apply
- No additional privacy concerns

### 11.2 Security Considerations

- Field validation to prevent injection attacks
- Access control: Only users with pricebook management permissions can edit
- Audit logging for all changes to these fields
- API rate limiting to prevent abuse

### 11.3 Compliance

- No regulatory compliance impacts identified
- Standard business data handling procedures apply

---

## 12. Support and Maintenance

### 12.1 Support Plan

**Level 1 Support (Help Desk):**
- Handle basic questions about field usage
- Provide links to documentation
- Escalate technical issues to Level 2

**Level 2 Support (Technical Support):**
- Troubleshoot filtering issues
- Assist with data migration problems
- Resolve integration issues

**Level 3 Support (Engineering):**
- Fix bugs in filtering logic
- Optimize performance
- Handle complex data issues

### 12.2 Maintenance Plan

**Regular Maintenance:**
- Monthly review of field usage analytics
- Quarterly review of user feedback
- Annual review of payment model options (add new ones if needed)

**Monitoring:**
- Track API error rates for new endpoints
- Monitor database query performance
- Alert on validation failures

---

## 13. Future Enhancements

### 13.1 Potential Features (Post-MVP)

1. **Dynamic Pricing by Service Type**
   - Different prices for Class vs. Group vs. One-off
   - Bulk discount rules per service type

2. **Advanced Filtering**
   - Filter pricebook list by multiple criteria
   - Save filter presets
   - Export filtered results

3. **Bulk Operations**
   - Bulk update service types for multiple items
   - Bulk update payment models
   - Template-based item creation

4. **Analytics Dashboard**
   - Most popular service type combinations
   - Payment model usage statistics
   - Revenue by service type

5. **Smart Recommendations**
   - AI-suggested service types based on item description
   - Recommended payment models based on pricing
   - Similar item suggestions

### 13.2 Integration Opportunities

1. **CRM Integration**: Sync pricebook items with CRM for better customer insights
2. **Accounting Integration**: Map payment models to accounting categories
3. **Marketing Integration**: Use service types for targeted campaigns
4. **Reporting Integration**: Enhanced reports with new dimensions

---

## 14. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Pricebook** | Catalog of services and products offered by the business |
| **Learning Service** | Educational service offering (Class, Group, or One-off) |
| **Service Type** | Category of learning service (Class, Group, One-off) |
| **Payment Model** | Method of payment (Subscription, One-time, Installment, Pay-per-session) |
| **Quote Line Item** | Individual item added to a customer quote |
| **MOQ** | Minimum Order Quantity |

### Appendix B: Wireframes

*(Wireframes would be attached as separate files or embedded here)*

### Appendix C: API Specifications

*(Detailed API specs would be included here or linked)*

### Appendix D: Database Migration Scripts

*(SQL scripts would be included here or linked)*

---

## 15. Approval and Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Product Owner** | _______________ | _______________ | ____/____/____ |
| **Technical Lead** | _______________ | _______________ | ____/____/____ |
| **UX Designer** | _______________ | _______________ | ____/____/____ |
| **QA Lead** | _______________ | _______________ | ____/____/____ |
| **Business Stakeholder** | _______________ | _______________ | ____/____/____ |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-09 | Product Management | Initial draft |

---

**End of Document**
