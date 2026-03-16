# Payment Method Constraints by Payment Model

## Overview
Different payment models support different payment methods based on their technical capabilities and business requirements.

---

## Supported Payment Methods

### 1. **Stripe**
- **Type:** Online payment processor
- **Capabilities:** Credit/debit cards, auto-charge, recurring billing
- **Best for:** Digital payments, subscriptions, automatic charges

### 2. **PayPal**
- **Type:** Digital wallet & payment processor
- **Capabilities:** PayPal balance, cards, auto-charge, recurring billing
- **Best for:** International payments, subscriptions, customer trust

### 3. **Google Wallet**
- **Type:** Digital wallet
- **Capabilities:** One-time payments, mobile payments
- **Best for:** Android users, quick checkout

### 4. **Apple Pay**
- **Type:** Digital wallet
- **Capabilities:** One-time payments, mobile payments
- **Best for:** iOS users, quick checkout

### 5. **Cash**
- **Type:** Physical payment
- **Capabilities:** In-person payment only
- **Best for:** Local services, deposit payments

---

## Payment Model Constraints

### Full Payment (Upfront)

**All payment methods available**

```
✅ Stripe
✅ PayPal
✅ Google Wallet
✅ Apple Pay
✅ Cash
```

**Rationale:**
- Customer pays entire amount upfront
- No recurring charges needed
- All payment types acceptable
- Maximum flexibility for customer

**Use Cases:**
- One-time service purchases
- Project-based work
- Prepaid services

---

### Down Payment (Deposit)

**Limited to methods that support split payments**

```
✅ Stripe
✅ PayPal
✅ Cash
❌ Google Wallet (not supported)
❌ Apple Pay (not supported)
```

**Rationale:**
- Requires initial payment + later balance payment
- Digital wallets don't support split payment tracking
- Need payment methods that can handle multiple transactions
- Cash allows flexible in-person payment scheduling

**Why Digital Wallets Excluded:**
- Google Wallet and Apple Pay are designed for single transactions
- No built-in support for tracking remaining balances
- Cannot automatically charge remaining balance later
- Better user experience with traditional payment processors

**Use Cases:**
- Large projects requiring upfront commitment
- Services with milestone-based payments
- High-value items with deposit requirements

---

### Subscription (Recurring)

**Only auto-charge capable methods**

```
✅ Stripe (Required for auto-charge)
✅ PayPal (Required for auto-charge)
❌ Google Wallet (no recurring support)
❌ Apple Pay (no recurring support)
❌ Cash (cannot auto-charge)
```

**Rationale:**
- Requires automatic recurring charges
- Must support tokenized payment methods
- Need secure storage of payment credentials
- Must handle failed payment retries

**Why Others Excluded:**
- **Google Wallet:** No recurring billing API
- **Apple Pay:** No subscription management
- **Cash:** Cannot be charged automatically

**Technical Requirements:**
- Payment method tokenization
- Recurring billing API support
- Webhook notifications for payment status
- Failed payment retry logic
- Customer payment method management

**Use Cases:**
- Monthly tutoring subscriptions
- Ongoing service contracts
- Membership programs

---

## Implementation Details

### Payment Method Selection UI

**Full Payment:**
```
All methods enabled and selectable
Hint: "All payment methods available for full payment"
```

**Deposit Payment:**
```
Stripe, PayPal, Cash: Enabled
Google Wallet, Apple Pay: Disabled (grayed out)
Hint: "Deposit payments support Stripe, PayPal, and Cash only 
       (Digital wallets not supported for deposit payments)"
```

**Subscription:**
```
Stripe, PayPal: Enabled with "Required for auto-charge" tag
Google Wallet, Apple Pay, Cash: Disabled (grayed out)
Hint: "Subscription requires auto-charge capable methods (Stripe or PayPal)
       (Only Stripe and PayPal support recurring automatic charges)"
```

---

## Validation Rules

### Full Payment
```javascript
// All methods allowed
allowed: ['stripe', 'paypal', 'google_wallet', 'apple_pay', 'cash']
// At least 1 method required
minRequired: 1
```

### Deposit Payment
```javascript
// Limited methods
allowed: ['stripe', 'paypal', 'cash']
// At least 1 method required
minRequired: 1
// Validation error if digital wallets selected
invalidMethods: ['google_wallet', 'apple_pay']
```

### Subscription
```javascript
// Only auto-charge capable
allowed: ['stripe', 'paypal']
// At least 1 auto-charge method required
minRequired: 1
// Must have at least one of: stripe OR paypal
requiredAutoCharge: true
// Validation error if others selected
invalidMethods: ['google_wallet', 'apple_pay', 'cash']
```

---

## User Experience

### When Switching Payment Models

**From Full → Deposit:**
1. Google Wallet unchecked and disabled
2. Apple Pay unchecked and disabled
3. Hint updated to explain limitation
4. If only digital wallets were selected, auto-select Stripe

**From Full → Subscription:**
1. Google Wallet, Apple Pay, Cash unchecked and disabled
2. "Required for auto-charge" tag appears on Stripe/PayPal
3. Hint updated to explain auto-charge requirement
4. If no auto-charge method selected, auto-select Stripe

**From Deposit → Full:**
1. All methods re-enabled
2. Previously selected methods remain checked
3. Hint updated to show all available

**From Subscription → Full:**
1. All methods re-enabled
2. Tags removed from Stripe/PayPal
3. Hint updated to show all available

---

## Error Messages

### No Payment Method Selected
```
"Please select at least one payment method"
```

### Invalid Method for Deposit
```
"Invalid payment methods for deposit payment model. 
Digital wallets not supported for deposit payments"
```

### Invalid Method for Subscription
```
"Invalid payment methods for subscription payment model. 
Only Stripe and PayPal support recurring automatic charges"
```

### No Auto-Charge Method for Subscription
```
"Subscription requires at least one auto-charge capable payment method 
(Stripe or PayPal)"
```

---

## API Integration

### Stripe Integration
```javascript
// One-time payment
stripe.charges.create({
    amount: 34100,
    currency: 'usd',
    source: token
});

// Recurring subscription
stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete'
});
```

### PayPal Integration
```javascript
// One-time payment
paypal.payment.create({
    intent: 'sale',
    transactions: [{ amount: { total: '341.00', currency: 'USD' } }]
});

// Recurring subscription
paypal.billingAgreement.create({
    plan: { id: planId },
    payer: { payment_method: 'paypal' }
});
```

---

## Business Rules Summary

| Payment Model | Stripe | PayPal | Google Wallet | Apple Pay | Cash |
|--------------|--------|--------|---------------|-----------|------|
| **Full Payment** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Deposit** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Subscription** | ✅ Required | ✅ Required | ❌ | ❌ | ❌ |

---

## Testing Checklist

### Full Payment
- [ ] All 5 payment methods selectable
- [ ] Can select any combination
- [ ] Hint shows "all methods available"
- [ ] No methods disabled

### Deposit Payment
- [ ] Stripe, PayPal, Cash selectable
- [ ] Google Wallet disabled and grayed out
- [ ] Apple Pay disabled and grayed out
- [ ] Hint explains digital wallet limitation
- [ ] Switching to deposit unchecks digital wallets

### Subscription
- [ ] Only Stripe and PayPal selectable
- [ ] "Required for auto-charge" tag visible
- [ ] Google Wallet, Apple Pay, Cash disabled
- [ ] Hint explains auto-charge requirement
- [ ] At least one of Stripe/PayPal auto-selected
- [ ] Cannot submit without auto-charge method

### Switching Models
- [ ] Methods correctly enabled/disabled on switch
- [ ] Invalid methods unchecked automatically
- [ ] Hints update correctly
- [ ] Auto-selection works for subscription
- [ ] No errors when switching back and forth

---

## Future Enhancements

### Potential Additions
1. **Bank Transfer (ACH/SEPA)**
   - Full: ✅
   - Deposit: ✅
   - Subscription: ✅ (with mandate)

2. **Cryptocurrency**
   - Full: ✅
   - Deposit: ❌ (volatility issues)
   - Subscription: ❌ (no auto-charge)

3. **Buy Now Pay Later (Afterpay, Klarna)**
   - Full: ✅
   - Deposit: ✅
   - Subscription: ❌ (not designed for recurring)

4. **Wire Transfer**
   - Full: ✅
   - Deposit: ✅
   - Subscription: ❌ (manual process)

---

## Summary

The payment method constraints ensure:
- ✅ **Technical feasibility** - Only methods that support the required features
- ✅ **Business logic** - Appropriate methods for each payment model
- ✅ **User experience** - Clear guidance on available options
- ✅ **Error prevention** - Invalid combinations blocked at UI level
- ✅ **Flexibility** - Maximum options where technically possible

This creates a robust, user-friendly payment system that guides users to appropriate payment methods based on their chosen payment model.
