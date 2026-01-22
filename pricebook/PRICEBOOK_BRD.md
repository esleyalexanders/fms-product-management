# Business Requirements Document
## Pricebook Item Management - Package Model Enhancement

**Document Version:** 2.0  
**Date:** January 13, 2026  
**Status:** Implemented  
**Change Type:** Enhancement

---

## 1. Document Purpose

This document outlines the **changes** made to the Pricebook Item Management forms to improve the handling of subscription-based services and simplify the user experience.

---

## 2. Summary of Changes

This enhancement restructures how services are categorized and configured, replacing the previous multi-select payment model approach with a clearer binary package model system.

### Key Changes:
- Replaced "Payment Models" with "Package Model" (Subscription vs Non-Subscription)
- Changed Service Type from multi-select to single-select
- Changed Subscription Frequency from multi-select to single-select
- Implemented conditional unit selection based on package model
- Enhanced MOQ display to include frequency information for subscriptions

---

## 3. Detailed Changes

### 3.1 Package Model Selection (NEW)

**Previous Behavior:**
- Field: "Supported Payment Models"
- Type: Multi-select checkboxes
- Options: Full Payment, Down Payment, Subscription
- Multiple selections allowed
- Subscription frequency shown separately

**New Behavior:**
- Field: "Package Model"
- Type: Single-select radio buttons
- Options: Subscription, Non-Subscription
- Only one selection allowed
- Subscription frequency conditionally displayed

**Business Rationale:**
Simplifies the service offering model by focusing on the core distinction: recurring vs one-time services.

---

### 3.2 Service Type Selection (MODIFIED)

**Previous Behavior:**
- Type: Multi-select checkboxes
- Options: Class, Group, One-off
- Multiple selections allowed
- Indicated which service types could use this item

**New Behavior:**
- Type: Single-select radio buttons
- Options: Class, Group, One-to-One
- Only one selection allowed
- Defines the specific service delivery type

**Changes:**
- ❌ Removed: Multi-select capability
- ❌ Removed: "One-off" option
- ✅ Added: "One-to-One" option
- ✅ Changed: Single-choice selection

**Business Rationale:**
Each pricebook item should represent a specific service type, not multiple types.

---

### 3.3 Subscription Frequency (MODIFIED)

**Previous Behavior:**
- Type: Multi-select checkboxes
- Options: Weekly, Monthly, Quarterly, Annually
- Multiple selections allowed
- Always visible when subscription payment model was checked
- Indicated which frequencies were available for quotes

**New Behavior:**
- Type: Single-select radio buttons
- Options: Weekly, Monthly, Quarterly, Annually
- Only one selection allowed
- Only visible when "Subscription" package model is selected
- Defines the specific billing frequency for this item

**Changes:**
- ❌ Removed: Multi-select capability
- ✅ Added: Conditional visibility (only shows for subscriptions)
- ✅ Changed: Single-choice selection

**Business Rationale:**
Each subscription service should have a defined billing frequency, not multiple options.

---

### 3.4 Unit Selection - Services (MODIFIED)

**Previous Behavior:**
- Unit dropdown always enabled
- Options: Hour, Each, Square Foot, Square Meter, Custom
- User could select any unit regardless of payment model

**New Behavior:**

| Package Model | Unit Behavior | Available Options |
|---------------|---------------|-------------------|
| Subscription | **Locked to "Hour"** (disabled) | Hour only |
| Non-Subscription | Enabled | Hour, Each, Square Foot, Square Meter, Custom |

**Changes:**
- ✅ Added: Conditional locking based on package model
- ✅ Added: Automatic unit selection for subscriptions

**Business Rationale:**
Subscription services are billed by time (hours), while non-subscription services can use various units.

---

### 3.5 MOQ Display Format (ENHANCED)

**Previous Behavior:**
- Display: "MOQ: {value}" (e.g., "MOQ: 20")
- No unit or frequency information shown
- Same format for all item types

**New Behavior:**

| Item Type | Package Model | Previous | New | Example |
|-----------|---------------|----------|-----|---------|
| Service | Subscription | `MOQ: 20` | `MOQ: {qty} {unit}/{frequency}` | `MOQ: 20 hour/weekly` |
| Service | Non-Subscription | `MOQ: 5` | `MOQ: {qty} {unit}` | `MOQ: 5 each` |
| Product | N/A | `MOQ: 1` | `MOQ: {qty} {unit}` | `MOQ: 1 box` |

**Changes:**
- ✅ Added: Unit display in MOQ
- ✅ Added: Frequency display for subscriptions
- ✅ Added: Dynamic formatting based on package model

**Business Rationale:**
Provides clearer context about what the MOQ represents and how often it applies.

---

### 3.6 Price Label (ENHANCED)

**Previous Behavior:**
- Static label: "Price (per hour)" for services
- Static label: "Price (per unit)" for products
- Did not update based on selected unit

**New Behavior:**
- Dynamic label that updates based on selected unit
- Examples:
  - Subscription service: "Price (per hour)"
  - Non-subscription service with "each" unit: "Price (per each)"
  - Product with "box" unit: "Price (per box)"

**Changes:**
- ✅ Added: Dynamic label updates
- ✅ Added: Unit-specific pricing context

**Business Rationale:**
Provides immediate clarity on what the price represents.

---

### 3.7 Product Handling (MODIFIED)

**Previous Behavior:**
- Products had access to payment model selection
- Separate MOQ field (`productMOQ`)
- Could theoretically be configured as subscription

**New Behavior:**
- Package Model section hidden for products
- Info message: "Products are always non-subscription items"
- Uses same MOQ field as services
- Automatic non-subscription handling

**Changes:**
- ❌ Removed: Package model selection for products
- ✅ Added: Informational message
- ✅ Added: Automatic non-subscription enforcement

**Business Rationale:**
Products are inherently non-subscription items; simplifies the form and prevents configuration errors.

---

## 4. User Interface Changes

### Form Section Changes

| Section | Previous | New | Change Type |
|---------|----------|-----|-------------|
| Payment Models | Multi-select checkboxes | Removed | Deleted |
| Package Model | N/A | Single-select radio buttons | Added |
| Service Type | Multi-select checkboxes | Single-select radio buttons | Modified |
| Subscription Frequency | Multi-select checkboxes, always visible | Single-select radio buttons, conditional | Modified |
| Unit (Services) | Always enabled | Conditionally locked | Modified |
| MOQ Display | Number only | Number + unit + frequency | Enhanced |
| Price Label | Static | Dynamic | Enhanced |

---

## 5. Validation Changes

### New Validation Rules

| Field | Rule | When Applied |
|-------|------|--------------|
| Package Model | Required | When item type = Service |
| Service Type | Required | When item type = Service |
| Subscription Frequency | Required | When package model = Subscription |
| Unit | Must be "hour" | When package model = Subscription (enforced by UI) |

### Removed Validation Rules

- ❌ Multiple service types validation
- ❌ Multiple frequency options validation
- ❌ Payment model combination validation

---

## 6. Backward Compatibility

### Data Migration Considerations

**Existing Items:**
- Items with multiple service types → Need to select primary service type
- Items with multiple frequencies → Need to select primary frequency
- Items with payment model = "Subscription" → Map to package model = "Subscription"
- Items with payment model = "Full Payment" or "Down Payment" → Map to package model = "Non-Subscription"

**Recommended Migration:**
1. Review existing items with multiple service types
2. Determine primary service type for each
3. Create duplicate items if multiple service types are truly needed
4. Update package model field based on payment model mapping

---

## 7. Impact Assessment

### User Impact
- **Low**: Forms are more intuitive with single-select options
- **Medium**: Users need to understand new package model concept
- **Training Required**: Brief explanation of Subscription vs Non-Subscription

### System Impact
- **Frontend Only**: No backend API changes required initially
- **Database**: New field needed for package model (future enhancement)
- **Quotes**: Quote generation logic may need updates to respect package model

---

## 8. Benefits

| Benefit | Description |
|---------|-------------|
| **Clarity** | Clear distinction between subscription and non-subscription services |
| **Simplicity** | Single-choice selections reduce confusion |
| **Consistency** | Unit selection aligns with package model |
| **Transparency** | MOQ display shows complete information (quantity + unit + frequency) |
| **Error Prevention** | Conditional logic prevents invalid configurations |

---

## 9. Implementation Status

**Status:** ✅ Complete  
**Implementation Date:** January 13, 2026  
**Files Modified:**
- `pricebook/pricebook-create.html` - Create form
- `pricebook/pricebook-edit.html` - Edit form

**Testing Status:** ✅ Browser testing completed

---

## 10. Next Steps

### Immediate (Complete)
- ✅ Update HTML forms
- ✅ Update JavaScript logic
- ✅ Test all scenarios
- ✅ Document changes

### Short-term (Recommended)
- [ ] Update backend API to support package model field
- [ ] Database migration for existing items
- [ ] Update quote generation logic
- [ ] User training materials

### Long-term (Future)
- [ ] Reporting enhancements
- [ ] Bulk import/export updates
- [ ] Analytics on subscription vs non-subscription usage

---

**Document Owner:** Product Management  
**Change Approved By:** [Pending]  
**Effective Date:** January 13, 2026
