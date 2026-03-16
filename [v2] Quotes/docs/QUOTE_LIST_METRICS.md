# Quote List Summary Metrics - Calculations

This document explains how the metrics are calculated in the Quote List page.

---

## Main Summary Cards (Top of Page)

### 1. Active Quotes
**What it shows:** Total number of quotes currently in the pipeline

**How it's calculated:** Count of all quotes with status:
- Draft
- Sent
- Accepted

**Excludes:** Declined and Converted quotes

---

### 2. Total Value
**What it shows:** Total dollar amount of active quotes

**How it's calculated:** Sum of all quote amounts where status is:
- Draft
- Sent
- Accepted

**Excludes:** Declined and Converted quotes

---

### 3. Outstanding
**What it shows:** Money that has been invoiced but not yet received from customers

**How it's calculated:** 
- Total Amount Invoiced (across all quotes)
- Minus Total Amount Paid (across all quotes)
- **Outstanding = Amount Invoiced - Amount Paid**

**Unpaid Count:** Number of quotes that have been invoiced but have zero payment

---

### 4. This Month
**What it shows:** Total value and count of quotes created in the current calendar month

**How it's calculated:**
- Filter all quotes created in the current month and year
- Sum the total amounts
- Count the number of quotes

**Includes:** All quotes regardless of status (draft, sent, accepted, declined, converted)

---

## Filter Summary Panel

**When it appears:** Shows when any filter is active (search, status, date range, etc.)

**What it shows:** Real-time calculations based only on the currently filtered/displayed quotes

### 1. Filtered Quotes
**What it shows:** Number of quotes currently displayed after filters are applied

**How it's calculated:** Count of all quotes that match the current filter criteria

---

### 2. Total Value
**What it shows:** Sum of all currently filtered quote amounts

**How it's calculated:** Add up the total amounts of all displayed quotes

**Includes:** All quotes that pass the current filters, regardless of status

---

### 3. Average Value
**What it shows:** Average dollar amount per quote in the filtered results

**How it's calculated:** 
- Total Value of filtered quotes
- Divided by Number of filtered quotes
- **Average Value = Total Value ÷ Filtered Quotes**

**Example:** $21,603.75 ÷ 13 quotes = $1,661.83 average

---

### 4. Outstanding
**What it shows:** Unpaid invoiced amounts from the filtered quotes only

**How it's calculated:**
- Sum of Amount Invoiced from filtered quotes
- Minus Sum of Amount Paid from filtered quotes
- **Outstanding = Invoiced - Paid** (for filtered quotes only)

---

## Key Differences

| Metric | Main Cards | Filter Summary |
|--------|------------|----------------|
| **Data Source** | All quotes in system | Only currently filtered/displayed quotes |
| **Active Quotes** | Only draft/sent/accepted statuses | All statuses that pass the filter |
| **Total Value** | Only from active quotes | From all filtered quotes regardless of status |
| **Purpose** | Overall business health snapshot | Analyze specific segments or subsets |

---

## Examples

### Main Cards Example:
- **Active Quotes:** 13 (all draft/sent/accepted quotes)
- **Total Value:** $21,600 (sum of those 13 quotes)
- **Outstanding:** $5,300 (invoiced but unpaid across ALL quotes)
- **This Month:** $11,100 (8 quotes created in November)

### Filter Summary Example (when filtering by customer "Sarah Johnson"):
- **Filtered Quotes:** 3 (only Sarah's quotes)
- **Total Value:** $6,462.50 (sum of Sarah's 3 quotes)
- **Average Value:** $2,154.17 (average of Sarah's quotes)
- **Outstanding:** $3,250 (unpaid from Sarah only)
