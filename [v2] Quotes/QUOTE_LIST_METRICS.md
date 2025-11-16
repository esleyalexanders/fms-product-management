# Quote List Summary Metrics - Calculations

This document explains how the metrics are calculated in the Quote List page.

---

## Main Summary Cards (Top of Page)

### 1. Active Quotes
**Count of active quotes in the pipeline**

```javascript
activeQuotes = quotes.filter(q => 
    q.status === 'draft' || 
    q.status === 'sent' || 
    q.status === 'accepted'
).length
```

---

### 2. Total Value
**Sum of all active quote amounts**

```javascript
totalValue = quotes
    .filter(q => 
        q.status === 'draft' || 
        q.status === 'sent' || 
        q.status === 'accepted'
    )
    .reduce((sum, q) => sum + q.total, 0)
```

---

### 3. Outstanding
**Amount invoiced but not yet paid**

```javascript
outstanding = quotes.reduce((sum, q) => {
    const unpaidAmount = q.amountInvoiced - q.amountPaid;
    return sum + unpaidAmount;
}, 0)
```

**Alternative:**
```javascript
outstanding = sum(amountInvoiced) - sum(amountPaid)
```

**Unpaid Count:**
```javascript
unpaidCount = quotes.filter(q => 
    q.amountInvoiced > 0 && q.amountPaid === 0
).length
```

---

### 4. This Month
**Total value of quotes created this month**

```javascript
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const thisMonthQuotes = quotes.filter(q => {
    const quoteDate = new Date(q.dateCreated);
    return quoteDate.getMonth() === currentMonth && 
           quoteDate.getFullYear() === currentYear;
});

thisMonthValue = thisMonthQuotes.reduce((sum, q) => sum + q.total, 0);
thisMonthCount = thisMonthQuotes.length;
```

---

## Filter Summary Panel

Appears when filters are active. Shows metrics for filtered quotes only.

### 1. Filtered Quotes
**Count of currently displayed quotes**

```javascript
filteredQuotes = state.filteredQuotes.length
```

---

### 2. Total Value
**Sum of filtered quote amounts**

```javascript
totalValue = state.filteredQuotes.reduce((sum, q) => sum + q.total, 0)
```

---

### 3. Average Value
**Average amount per quote**

```javascript
averageValue = state.filteredQuotes.length > 0 
    ? state.filteredQuotes.reduce((sum, q) => sum + q.total, 0) / state.filteredQuotes.length
    : 0
```

**Formula:** `Total Value ÷ Number of Filtered Quotes`

---

### 4. Outstanding
**Unpaid amount from filtered quotes**

```javascript
outstanding = state.filteredQuotes.reduce((sum, q) => {
    const unpaidAmount = q.amountInvoiced - q.amountPaid;
    return sum + unpaidAmount;
}, 0)
```

---

## Key Differences

| Metric | Main Cards | Filter Summary |
|--------|------------|----------------|
| **Data Source** | All quotes | Filtered quotes only |
| **Active Quotes** | Only draft/sent/accepted | All statuses |
| **Total Value** | Only active quotes | All filtered quotes |
