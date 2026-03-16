# Overdue Invoice Logic - All Possible Cases

## Core Overdue Detection Logic

```javascript
const today = new Date();
const dueDate = new Date(invoice.dueDate);
const isOverdue = (invoice.status === 'unpaid' || invoice.status === 'partially_paid') && dueDate < today;
```

**Criteria:**
- Invoice status must be `'unpaid'` OR `'partially_paid'`
- Due date must be **before** today's date
- Invoice is NOT cancelled

---

## Payment Type 1: Full Payment (Upfront)

**Creates:** 1 invoice for full amount

### All Possible Cases

| Case | Invoice Status | Due Date vs Today | Is Overdue? | Description |
|------|---------------|-------------------|-------------|-------------|
| 1.1 | `unpaid` | Due date in future | ❌ No | Invoice not yet due |
| 1.2 | `unpaid` | Due date = today | ❌ No | Invoice due today (grace period) |
| 1.3 | `unpaid` | Due date in past | ✅ **Yes** | **OVERDUE** - Payment not received |
| 1.4 | `partially_paid` | Due date in past | ✅ **Yes** | **OVERDUE** - Partial payment received but not full |
| 1.5 | `paid` | Any date | ❌ No | Fully paid - never overdue |
| 1.6 | `cancelled` | Any date | ❌ No | Cancelled invoices ignored |

### Examples

**Case 1.1 - Not Yet Due**
```javascript
{
  status: 'unpaid',
  invoiceDate: '2024-12-01',
  dueDate: '2024-12-31',  // Future
  amount: 750.00
}
// Today: Dec 25, 2024 → NOT OVERDUE
```

**Case 1.3 - Overdue**
```javascript
{
  status: 'unpaid',
  invoiceDate: '2024-11-01',
  dueDate: '2024-12-01',  // Past
  amount: 750.00
}
// Today: Dec 25, 2024 → OVERDUE (24 days)
```

**Case 1.4 - Partially Paid but Overdue**
```javascript
{
  status: 'partially_paid',
  invoiceDate: '2024-11-01',
  dueDate: '2024-12-01',  // Past
  amount: 750.00,
  paidAmount: 300.00
}
// Today: Dec 25, 2024 → OVERDUE (24 days, $450 outstanding)
```

---

## Payment Type 2: Down Payment (Deposit + Balance)

**Creates:** 2 separate invoices

### Deposit Invoice - All Possible Cases

| Case | Invoice Status | Due Date vs Today | Is Overdue? | Description |
|------|---------------|-------------------|-------------|-------------|
| 2.1 | `unpaid` | Due date in future | ❌ No | Deposit not yet due |
| 2.2 | `unpaid` | Due date = today | ❌ No | Deposit due today |
| 2.3 | `unpaid` | Due date in past | ✅ **Yes** | **DEPOSIT OVERDUE** |
| 2.4 | `partially_paid` | Due date in past | ✅ **Yes** | **DEPOSIT OVERDUE** - Partial deposit paid |
| 2.5 | `paid` | Any date | ❌ No | Deposit fully paid |
| 2.6 | `cancelled` | Any date | ❌ No | Deposit invoice cancelled |

### Balance Invoice - All Possible Cases

| Case | Invoice Status | Due Date vs Today | Is Overdue? | Description |
|------|---------------|-------------------|-------------|-------------|
| 2.7 | Not created yet | N/A | ❌ No | Balance invoice not yet created |
| 2.8 | `unpaid` | Due date in future | ❌ No | Balance not yet due |
| 2.9 | `unpaid` | Due date = today | ❌ No | Balance due today |
| 2.10 | `unpaid` | Due date in past | ✅ **Yes** | **BALANCE OVERDUE** |
| 2.11 | `partially_paid` | Due date in past | ✅ **Yes** | **BALANCE OVERDUE** - Partial balance paid |
| 2.12 | `paid` | Any date | ❌ No | Balance fully paid |
| 2.13 | `cancelled` | Any date | ❌ No | Balance invoice cancelled |

### Combined Scenarios

| Deposit Status | Balance Status | Overall Status | Description |
|---------------|---------------|----------------|-------------|
| Not overdue | Not created | ✅ On Track | Waiting for deposit payment |
| Not overdue | Not yet due | ✅ On Track | Deposit paid, balance not yet due |
| **Overdue** | Not created | ⚠️ **Deposit Overdue** | Customer hasn't paid deposit |
| Paid | **Overdue** | ⚠️ **Balance Overdue** | Deposit paid, balance overdue |
| **Overdue** | Not yet due | ⚠️ **Deposit Overdue** | Deposit late, balance not yet due |
| **Overdue** | **Overdue** | 🚨 **Both Overdue** | Both invoices overdue |
| Paid | Paid | ✅ Fully Paid | All payments complete |
| Cancelled | Any | ⚠️ Cancelled | Deposit cancelled |
| Any | Cancelled | ⚠️ Cancelled | Balance cancelled |

### Examples

**Case 2.3 - Deposit Overdue, Balance Not Created**
```javascript
// Deposit Invoice
{
  type: 'deposit',
  status: 'unpaid',
  invoiceDate: '2024-11-01',
  dueDate: '2024-12-01',  // Past
  amount: 600.00
}
// Balance Invoice: Not created yet
// Today: Dec 25, 2024 → DEPOSIT OVERDUE (24 days)
```

**Case 2.10 - Deposit Paid, Balance Overdue**
```javascript
// Deposit Invoice
{
  type: 'deposit',
  status: 'paid',
  invoiceDate: '2024-11-01',
  dueDate: '2024-12-01',
  amount: 600.00,
  paidAmount: 600.00,
  paidDate: '2024-11-28'
}

// Balance Invoice
{
  type: 'partial',
  status: 'unpaid',
  invoiceDate: '2024-11-28',
  dueDate: '2024-12-15',  // Past
  amount: 600.00
}
// Today: Dec 25, 2024 → BALANCE OVERDUE (10 days)
```

**Case: Both Overdue**
```javascript
// Deposit Invoice
{
  type: 'deposit',
  status: 'unpaid',
  invoiceDate: '2024-11-01',
  dueDate: '2024-12-01',  // Past
  amount: 600.00
}

// Balance Invoice
{
  type: 'partial',
  status: 'unpaid',
  invoiceDate: '2024-11-15',
  dueDate: '2024-12-10',  // Past
  amount: 600.00
}
// Today: Dec 25, 2024 → BOTH OVERDUE (Deposit: 24 days, Balance: 15 days)
```

---

## Payment Type 3: Subscription (Recurring)

**Creates:** Multiple invoices (one per billing cycle)

### Single Invoice Cases (applies to each invoice independently)

| Case | Invoice Status | Due Date vs Today | Is Overdue? | Description |
|------|---------------|-------------------|-------------|-------------|
| 3.1 | `unpaid` | Due date in future | ❌ No | Future invoice not yet due |
| 3.2 | `unpaid` | Due date = today | ❌ No | Invoice due today |
| 3.3 | `unpaid` | Due date in past | ✅ **Yes** | **OVERDUE** - This cycle overdue |
| 3.4 | `partially_paid` | Due date in past | ✅ **Yes** | **OVERDUE** - Partial payment |
| 3.5 | `paid` | Any date | ❌ No | This cycle paid |
| 3.6 | `cancelled` | Any date | ❌ No | This cycle cancelled |

### Multi-Invoice Scenarios

| Scenario | Description | Example |
|----------|-------------|---------|
| All paid | All invoices paid on time | ✅ Good standing |
| Current overdue | Only current invoice overdue | ⚠️ 1 overdue invoice |
| Multiple overdue | 2+ invoices overdue | 🚨 Multiple overdue (e.g., 3 months unpaid) |
| Mixed | Some paid, some overdue | ⚠️ Partial compliance |
| Auto-charge failed | Auto-charge enabled but failed | ⚠️ Payment method issue |
| Subscription ended | No more invoices generated | ℹ️ Subscription completed/cancelled |

### Examples

**Case 3.3 - Single Invoice Overdue**
```javascript
// November Invoice
{
  type: 'subscription',
  status: 'paid',
  invoiceDate: '2024-11-10',
  dueDate: '2024-11-10',
  amount: 199.00,
  paidDate: '2024-11-10'
}

// December Invoice
{
  type: 'subscription',
  status: 'unpaid',
  invoiceDate: '2024-12-10',
  dueDate: '2024-12-10',  // Past
  amount: 199.00
}
// Today: Dec 25, 2024 → DECEMBER INVOICE OVERDUE (15 days)
```

**Case: Multiple Invoices Overdue**
```javascript
// October Invoice
{
  type: 'subscription',
  status: 'unpaid',
  invoiceDate: '2024-10-10',
  dueDate: '2024-10-10',  // Past
  amount: 199.00
}

// November Invoice
{
  type: 'subscription',
  status: 'unpaid',
  invoiceDate: '2024-11-10',
  dueDate: '2024-11-10',  // Past
  amount: 199.00
}

// December Invoice
{
  type: 'subscription',
  status: 'unpaid',
  invoiceDate: '2024-12-10',
  dueDate: '2024-12-10',  // Past
  amount: 199.00
}
// Today: Dec 25, 2024 → 3 INVOICES OVERDUE (76, 45, 15 days)
// Total overdue: $597.00
```

**Case: Auto-Charge Failed**
```javascript
{
  type: 'subscription',
  status: 'unpaid',
  invoiceDate: '2024-12-10',
  dueDate: '2024-12-10',  // Past
  amount: 199.00,
  autoCharge: true,
  autoChargeAttempts: [
    { date: '2024-12-10', status: 'failed', reason: 'Card declined' },
    { date: '2024-12-12', status: 'failed', reason: 'Insufficient funds' }
  ]
}
// Today: Dec 25, 2024 → OVERDUE (15 days) - Auto-charge failed
```

---

## Special Cases (All Payment Types)

### Partial Payments

| Scenario | Status | Is Overdue? | Description |
|----------|--------|-------------|-------------|
| Partial payment before due date | `partially_paid` | ❌ No | Some paid, not yet due |
| Partial payment after due date | `partially_paid` | ✅ **Yes** | Some paid, but overdue for remainder |
| Multiple partial payments | `partially_paid` | Depends on due date | Accumulated but not full |

**Example:**
```javascript
{
  status: 'partially_paid',
  invoiceDate: '2024-11-01',
  dueDate: '2024-12-01',  // Past
  amount: 1000.00,
  paymentHistory: [
    { date: '2024-11-15', amount: 300.00 },
    { date: '2024-12-05', amount: 200.00 }
  ],
  paidAmount: 500.00,
  outstanding: 500.00
}
// Today: Dec 25, 2024 → OVERDUE (24 days, $500 outstanding)
```

### Cancelled Invoices

| Scenario | Is Overdue? | Description |
|----------|-------------|-------------|
| Cancelled before due date | ❌ No | Never becomes overdue |
| Cancelled after due date | ❌ No | Overdue status removed upon cancellation |
| Cancelled while overdue | ❌ No | Overdue cleared |

**Example:**
```javascript
{
  status: 'cancelled',
  invoiceDate: '2024-11-01',
  dueDate: '2024-12-01',  // Past
  amount: 750.00,
  cancelledDate: '2024-12-20',
  cancelReason: 'Service not delivered'
}
// Today: Dec 25, 2024 → NOT OVERDUE (cancelled)
```

### Grace Period Edge Cases

| Scenario | Is Overdue? | Description |
|----------|-------------|-------------|
| Due date = today, unpaid | ❌ No | Same day = not overdue yet |
| Due date = yesterday, unpaid | ✅ **Yes** | 1 day overdue |
| Paid on due date | ❌ No | Paid on time |
| Paid 1 day after due date | Was overdue | Was overdue for 1 day, now paid |

---

## Summary: All Overdue Conditions

### When an Invoice Becomes Overdue

✅ **ALL of these must be true:**
1. Invoice status is `'unpaid'` OR `'partially_paid'`
2. Due date is **before** today (not including today)
3. Invoice is NOT cancelled

### When an Invoice is NOT Overdue

❌ **ANY of these makes it NOT overdue:**
1. Invoice status is `'paid'`
2. Invoice status is `'cancelled'`
3. Due date is today or in the future
4. Invoice doesn't exist yet (e.g., balance invoice not created)

### Total Possible Overdue States

| Payment Type | Max Overdue Invoices | Worst Case Scenario |
|-------------|---------------------|---------------------|
| Full Payment | 1 invoice | 1 invoice overdue |
| Down Payment | 2 invoices | Both deposit and balance overdue |
| Subscription | Unlimited | Multiple months/cycles overdue |

---

## Notification Triggers

### When Overdue Emails are Sent

1. **Immediate** - When invoice first becomes overdue (day after due date)
2. **Recurring** - Every X days while still overdue (e.g., every 7 days)
3. **Escalation** - After certain thresholds (e.g., 30 days, 60 days, 90 days)

### Email Content Varies By

- Days overdue
- Amount outstanding
- Payment type (deposit vs balance vs subscription)
- Number of overdue invoices
- Previous payment history
