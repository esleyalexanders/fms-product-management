# Workflow Examples: Complete System Flow

This document provides concrete examples for all workflow scenarios described in the system flowcharts.

---

## 1. Financial Flow Examples

### Case 1A: One-Time Service - Single Invoice (Simple Case)

**Scenario:** Customer needs a one-time carpet cleaning service for $500.

**Flow:**
1. **Quote Created:** Quote #Q-001 for $500 (Status: Draft)
2. **Quote Sent:** Customer receives quote (Status: Sent)
3. **Quote Accepted:** Customer approves (Status: Accepted)
4. **User Action:** Manager clicks "Create Invoice" on Quote #Q-001
5. **User Selects Items:** Manager selects all line items ($500)
6. **System Creates Invoice:** Invoice #INV-001 created (Status: UNPAID, Amount: $500)
7. **System Generates Payment Link:** `https://pay.example.com/inv-001`
8. **User Sends Link:** Manager sends link via email to customer
9. **Customer Pays:** Customer clicks link and pays $500
10. **System Updates:** Invoice #INV-001 (Status: PAID)
11. **Quote Check:** Quote 100% invoiced and paid → (Status: Paid)
12. **Result:** Quote fully completed ✓

---

### Case 1B: One-Time Service - Multiple Invoices (Progress Billing)

**Scenario:** Customer needs a $10,000 renovation project with 3 payment milestones.

**Flow:**

#### First Invoice (Down Payment)
1. **Quote Created:** Quote #Q-002 for $10,000 with 3 line items:
   - Down Payment: $3,000
   - Mid-Progress: $4,000
   - Final Payment: $3,000
2. **Quote Status:** Accepted
3. **User Action:** Manager clicks "Create Invoice"
4. **User Selects:** Only "Down Payment" line item ($3,000)
5. **System Creates:** Invoice #INV-002A (Status: UNPAID, Amount: $3,000)
6. **Payment Link:** `https://pay.example.com/inv-002a`
7. **Customer Pays:** $3,000 paid
8. **Invoice Status:** PAID
9. **Quote Status:** Partially Invoiced, Partially Paid (30% complete)
10. **System:** Waiting to invoice remaining items

#### Second Invoice (Mid-Progress)
11. **User Action:** Manager clicks "Create Invoice" again
12. **User Selects:** "Mid-Progress" line item ($4,000)
13. **System Creates:** Invoice #INV-002B (Status: UNPAID, Amount: $4,000)
14. **Customer Pays:** $4,000 paid
15. **Quote Status:** Partially Invoiced, Partially Paid (70% complete)

#### Final Invoice
16. **User Action:** Manager clicks "Create Invoice" again
17. **User Selects:** "Final Payment" line item ($3,000)
18. **System Creates:** Invoice #INV-002C (Status: UNPAID, Amount: $3,000)
19. **Customer Pays:** $3,000 paid
20. **Quote Check:** 100% invoiced and paid
21. **Quote Status:** Paid ✓
22. **Result:** Project fully completed

---

### Case 2A: Subscription - Auto-Charge Success (99% Case)

**Scenario:** Monthly lawn maintenance subscription at $150/month.

**Flow:**

#### Initial Setup
1. **Quote Created:** Quote #Q-003 for $150/month recurring
2. **Quote Accepted:** Customer approves subscription
3. **Customer Setup:** Customer saves credit card (Visa ending in 1234)
4. **System:** Subscription activated, next billing date: 1st of next month

#### Month 1 (Auto-Success)
5. **System Scheduler:** Triggers on January 1st at 12:00 AM
6. **System Check:** Customer has saved credit card? → YES
7. **System Auto-Charges:** Stripe charges $150 to card ending in 1234
8. **Charge Result:** Successful ✓
9. **System Creates:** Invoice #INV-003-JAN (Status: PAID, Amount: $150)
10. **System Sends:** Receipt email to customer automatically
11. **System:** Waits for next cycle (February 1st)

#### Month 2 (Auto-Success)
12. **System Scheduler:** Triggers on February 1st at 12:00 AM
13. **System Auto-Charges:** $150 charged successfully
14. **System Creates:** Invoice #INV-003-FEB (Status: PAID)
15. **System Sends:** Receipt email
16. **Loop Continues:** Every month automatically

---

### Case 2B: Subscription - Auto-Charge Failure (Card Error)

**Scenario:** Monthly pool cleaning subscription at $200/month, card expires.

**Flow:**

#### Months 1-6 (Normal)
1. **Subscription Active:** Auto-charges working fine
2. **Invoices Created:** INV-004-JAN through INV-004-JUN (all PAID)

#### Month 7 (Card Expired)
3. **System Scheduler:** Triggers on July 1st
4. **System Check:** Customer has saved card? → YES (but expired)
5. **System Auto-Charges:** Attempts to charge $200
6. **Charge Result:** FAILED - Card expired
7. **System Starts Dunning:**
   - Day 1: Email "Payment Failed - Please Update Card"
   - Day 3: Retry charge → FAILED
   - Day 5: Email "Urgent: Update Payment Method"
   - Day 7: Retry charge → FAILED
   - Day 10: Final email "Subscription Will Pause"
8. **System Action:** Subscription paused (Status: Payment Failed)
9. **Customer Action:** Customer updates card to new Visa ending in 5678
10. **Manager Action:** Manually reactivates subscription
11. **System:** Creates manual invoice for missed month
12. **Result:** Subscription resumes normal auto-charging

---

### Case 2C: Subscription - No Saved Card (Rare Case)

**Scenario:** Monthly pest control subscription at $100/month, customer doesn't save card.

**Flow:**

#### Each Month
1. **System Scheduler:** Triggers on 1st of month
2. **System Check:** Customer has saved card? → NO
3. **System Auto-Creates:** Invoice #INV-005-JAN (Status: UNPAID, Amount: $100)
4. **System Generates:** Payment link `https://pay.example.com/inv-005-jan`
5. **System Auto-Sends:** Email invoice with payment link to customer
6. **Customer Action:** Customer clicks link and pays manually
7. **System Updates:** Invoice status to PAID
8. **System:** Waits for next cycle

**Note:** This repeats every month - customer must manually pay each time.

---

## 2. Quote Operation Status Lifecycle Examples

### Case 3A: Quote Accepted on First Try

**Scenario:** Simple quote accepted immediately.

**Flow:**
1. **Start:** New Quote #Q-010 created
2. **Status:** Draft (Manager preparing quote)
3. **Manager Action:** Adds line items, finalizes pricing
4. **Manager Action:** Clicks "Send Quote"
5. **Status:** Sent (Awaiting customer response)
6. **Customer Action:** Reviews and clicks "Accept"
7. **Status:** Accepted ✓
8. **Next Step:** Ready for invoicing/job creation

---

### Case 3B: Quote Rejected and Revised

**Scenario:** Customer rejects initial quote, negotiates, accepts revised version.

**Flow:**
1. **Start:** New Quote #Q-011 created
2. **Status:** Draft
3. **Manager Sends:** Quote for $5,000
4. **Status:** Sent
5. **Customer Action:** Clicks "Reject" - "Price too high"
6. **Status:** Rejected
7. **Manager Action:** Edits quote (back to Draft)
8. **Status:** Draft
9. **Manager Revises:** Reduces to $4,500, adds discount
10. **Manager Sends:** Revised quote
11. **Status:** Sent
12. **Customer Action:** Accepts revised quote
13. **Status:** Accepted ✓

---

### Case 3C: Quote Expired (No Response)

**Scenario:** Customer never responds to quote.

**Flow:**
1. **Start:** New Quote #Q-012 created
2. **Status:** Draft
3. **Manager Sends:** Quote valid for 30 days
4. **Status:** Sent (Expiry date: 30 days from now)
5. **Days Pass:** Customer doesn't respond
6. **Day 30:** System auto-expires quote
7. **Status:** Expired
8. **Result:** Quote Closed (no further action)

---

### Case 3D: Quote Recalled for Editing

**Scenario:** Manager realizes error after sending quote.

**Flow:**
1. **Status:** Sent (Quote already sent to customer)
2. **Manager Notices:** Wrong pricing on line item
3. **Manager Action:** Clicks "Recall Quote"
4. **Status:** Draft (back to editing mode)
5. **Manager Fixes:** Corrects pricing error
6. **Manager Sends:** Quote again
7. **Status:** Sent (customer receives corrected version)

---

### Case 3E: Quote Canceled After Acceptance

**Scenario:** Customer accepts but later cancels project.

**Flow:**
1. **Status:** Accepted (Customer approved quote)
2. **Customer Calls:** "We need to cancel the project"
3. **Manager Action:** Clicks "Cancel Quote"
4. **Status:** Canceled
5. **Result:** Quote Closed (may charge cancellation fee)

---

## 3. Quote Financial Status Lifecycle Examples

### Case 4A: Direct Full Payment (Rare)

**Scenario:** Small job, customer pays everything upfront.

**Flow:**
1. **Quote #Q-020:** $300 total (Status: Not Invoiced)
2. **Manager Creates Invoice:** All items at once ($300)
3. **Invoice Created:** INV-020 (Status: UNPAID)
4. **Customer Pays:** Full $300 immediately
5. **Invoice Status:** PAID
6. **Quote Status:** Fully Invoiced → Paid ✓
7. **Result:** Single-step completion

---

### Case 4B: Partial Invoicing, Then Full Payment

**Scenario:** Invoice half now, half later, customer pays both.

**Flow:**
1. **Quote #Q-021:** $2,000 total (Status: Not Invoiced)
2. **Manager Invoices:** $1,000 (50% of items)
3. **Quote Status:** Partially Invoiced
4. **Customer Pays:** $1,000
5. **Quote Status:** Partially Invoiced, Partially Paid
6. **Manager Invoices:** Remaining $1,000 (100% of items)
7. **Quote Status:** Fully Invoiced, Partially Paid
8. **Customer Pays:** Final $1,000
9. **Quote Status:** Paid ✓

---

### Case 4C: Full Invoicing, Split Payments

**Scenario:** Invoice everything, customer pays in installments.

**Flow:**
1. **Quote #Q-022:** $5,000 total (Status: Not Invoiced)
2. **Manager Invoices:** All items ($5,000)
3. **Quote Status:** Fully Invoiced
4. **Customer Pays:** $2,000 (40%)
5. **Quote Status:** Fully Invoiced, Partially Paid
6. **Customer Pays:** $1,500 (30%)
7. **Quote Status:** Fully Invoiced, Partially Paid (70% paid)
8. **Customer Pays:** $1,500 (30%)
9. **Quote Status:** Paid ✓

---

### Case 4D: Multiple Invoices, Multiple Payments

**Scenario:** Complex project with 3 invoices, various payment timings.

**Flow:**
1. **Quote #Q-023:** $9,000 total (Status: Not Invoiced)
   - Item A: $3,000
   - Item B: $4,000
   - Item C: $2,000

2. **First Invoice:**
   - Manager invoices Item A ($3,000)
   - Quote Status: Partially Invoiced
   - Customer pays $3,000
   - Quote Status: Partially Invoiced, Partially Paid (33%)

3. **Second Invoice:**
   - Manager invoices Item B ($4,000)
   - Quote Status: Partially Invoiced (77% invoiced)
   - Customer pays $1,000 (partial payment on Item B)
   - Quote Status: Partially Invoiced, Partially Paid (44% paid)

4. **Customer Pays More:**
   - Customer pays $3,000 (completes Item B)
   - Quote Status: Partially Invoiced, Partially Paid (77% paid)

5. **Final Invoice:**
   - Manager invoices Item C ($2,000)
   - Quote Status: Fully Invoiced, Partially Paid
   - Customer pays $2,000
   - Quote Status: Paid ✓

---

## 4. Job Status Lifecycle Examples

### Case 5A: One-Time Job - Smooth Execution

**Scenario:** Single carpet cleaning job from manual quote.

**Flow:**
1. **Trigger:** Manager creates job from Quote #Q-030 (Manual)
2. **Job Created:** Job #J-001 (Status: Unscheduled)
3. **Manager Assigns:** Date: Jan 15, Staff: John Smith
4. **Status:** Scheduled
5. **Jan 15 Morning:** John starts job, clicks "Start"
6. **Status:** In Progress
7. **Jan 15 Afternoon:** John completes job, clicks "Complete"
8. **Status:** Completed
9. **System Check:** One-time job? → YES
10. **Result:** Job ends, no loop back

---

### Case 5B: Job Paused and Resumed

**Scenario:** Job encounters issue mid-work.

**Flow:**
1. **Job #J-002:** Scheduled for plumbing repair (Status: Scheduled)
2. **Staff Starts:** Status: In Progress
3. **Issue Discovered:** Missing part needed
4. **Staff Action:** Clicks "Pause Job" - "Need to order part"
5. **Status:** On Hold
6. **3 Days Later:** Part arrives
7. **Staff Action:** Clicks "Resume Job"
8. **Status:** In Progress
9. **Staff Completes:** Work finished
10. **Status:** Completed

---

### Case 5C: Job Canceled Before Start

**Scenario:** Customer cancels before scheduled date.

**Flow:**
1. **Job #J-003:** Scheduled for Jan 20 (Status: Scheduled)
2. **Jan 18:** Customer calls to cancel
3. **Manager Action:** Clicks "Cancel Job"
4. **Status:** Canceled
5. **Result:** Job ends, staff reassigned

---

### Case 5D: Job Unscheduled and Rescheduled

**Scenario:** Manager needs to change schedule.

**Flow:**
1. **Job #J-004:** Scheduled for Jan 25, Staff: Mike (Status: Scheduled)
2. **Manager Realizes:** Mike is on vacation that day
3. **Manager Action:** Clicks "Unschedule"
4. **Status:** Unscheduled
5. **Manager Reassigns:** Date: Jan 27, Staff: Sarah
6. **Status:** Scheduled
7. **Jan 27:** Sarah completes job normally
8. **Status:** Completed

---

### Case 5E: Subscription Job - Recurring Cycle

**Scenario:** Monthly lawn maintenance subscription.

**Flow:**

#### Month 1
1. **Trigger:** System auto-creates from subscription (Auto)
2. **Job Created:** Job #J-005-JAN (Status: Unscheduled)
3. **Manager Assigns:** Date: Jan 5, Staff: Team A
4. **Status:** Scheduled
5. **Team Completes:** Job done
6. **Status:** Completed
7. **System Check:** Subscription? → YES
8. **System:** Waits for scheduler

#### Month 2
9. **Scheduler Triggers:** Feb 1st (next cycle)
10. **System Auto-Creates:** Job #J-005-FEB (Status: Unscheduled)
11. **Manager Assigns:** Date: Feb 5, Staff: Team A
12. **Status:** Scheduled
13. **Team Completes:** Job done
14. **Status:** Completed
15. **Loop Continues:** Every month automatically

---

### Case 5F: Subscription Job - Canceled Mid-Cycle

**Scenario:** Customer cancels subscription after 3 months.

**Flow:**

#### Months 1-3 (Normal)
1. **Jobs Completed:** J-006-JAN, J-006-FEB, J-006-MAR

#### Month 4 (Cancellation)
2. **System Creates:** Job #J-006-APR (Status: Unscheduled)
3. **Customer Cancels:** Subscription canceled
4. **Manager Action:** Cancels Job #J-006-APR
5. **Status:** Canceled
6. **System:** Stops creating new jobs
7. **Result:** Subscription loop broken

---

### Case 5G: Job Paused by Manager (Administrative)

**Scenario:** Manager pauses job for business reasons.

**Flow:**
1. **Job #J-007:** Scheduled for Jan 30 (Status: Scheduled)
2. **Manager Discovers:** Customer payment issue
3. **Manager Action:** Clicks "Pause Job" - "Awaiting payment"
4. **Status:** On Hold
5. **Payment Resolved:** Customer pays outstanding invoice
6. **Manager Action:** Clicks "Reschedule"
7. **Status:** Scheduled (new date assigned)
8. **Job Proceeds:** Completed normally

---

## Summary Matrix

| Scenario Type | Key Characteristic | Loop Back? | User Involvement |
|--------------|-------------------|------------|------------------|
| One-Time Service | Single or multiple invoices | No | High (manual invoicing) |
| Subscription Auto-Charge | Card on file | Yes | Low (automated) |
| Subscription Manual | No card on file | Yes | Medium (send links) |
| Quote Draft→Sent→Accepted | Linear flow | No | Medium |
| Quote Rejected→Revised | Iteration | No | High |
| Quote Expired | Time-based | No | None |
| One-Time Job | Single execution | No | Medium |
| Subscription Job | Recurring | Yes | Medium (scheduling) |
| Job On Hold | Temporary pause | No | High (resolution) |

---

## Key Takeaways

1. **One-Time vs Subscription:** The fundamental difference is whether the system loops back to create new invoices/jobs automatically.

2. **User Control Points:** 
   - One-time: User selects what to invoice and when
   - Subscription: System automates, user only intervenes on failures

3. **Status Progression:** All entities (quotes, invoices, jobs) follow predictable state machines with clear transitions.

4. **Error Handling:** System has built-in dunning and retry logic for subscription failures.

5. **Flexibility:** Users can pause, cancel, reschedule, or revise at multiple points in each workflow.
