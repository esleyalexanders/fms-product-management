# KỊCH BẢN DEMO ĐẦY ĐỦ - TẤT CẢ CÁC LUỒNG HỆ THỐNG

## Tổng quan Demo
Kịch bản này demo **TẤT CẢ** các luồng trong hệ thống thông qua 8 khách hàng với các tình huống khác nhau.

---

## 🎬 PHẦN 1: QUOTE OPERATION STATUS LIFECYCLE

### **Khách hàng 1: Nguyễn Văn A - Quote Accepted Ngay**
**Dịch vụ:** Vệ sinh thảm văn phòng - $500  
**Thời gian:** 3 phút

#### Các bước chi tiết:

**BƯỚC 1: Tạo Quote mới**
1. Click button **"New Quote"** trên dashboard
2. Chọn customer: **Nguyễn Văn A** từ dropdown
   - Email: nguyenvana@email.com
   - Phone: 0901234567
3. Nhập thông tin quote:
   - Quote Name: "Vệ sinh thảm văn phòng - Công ty ABC"
   - Valid Until: 30 ngày từ hôm nay
4. Thêm line item:
   - Click **"Add Line Item"**
   - Service: "Vệ sinh thảm văn phòng"
   - Quantity: 1
   - Unit Price: $500
   - Total: $500
5. Thêm notes: "Bao gồm vệ sinh sâu và khử mùi"
6. Click **"Save as Draft"**
7. ✅ **Verify: Quote Status = Draft**
8. ✅ **Verify: Quote Financial Status = Not Invoiced**

**BƯỚC 2: Gửi Quote cho khách hàng**
1. Từ Quote detail page, click **"Send Quote"**
2. Confirm email address: nguyenvana@email.com
3. Preview email template
4. Click **"Send"**
5. ✅ **Verify: Quote Status = Sent**
6. ✅ **Verify: Email sent notification hiển thị**
7. ✅ **Verify: Sent date được ghi nhận**

**BƯỚC 3: Khách hàng Accept Quote**
1. (Giả lập) Khách hàng nhận email và xem quote PDF
2. Khách hàng gọi điện/nhắn tin cho Manager: "Tôi đồng ý với báo giá này"
3. Manager ghi nhận và vào hệ thống
4. Manager vào Quote #Q-001 detail page
5. Click button **"Mark as Accepted"**
6. Confirm dialog hiển thị
7. Click **"Confirm"**
8. ✅ **Verify: Quote Status = Accepted**
9. ✅ **Verify: Accepted date được ghi nhận**
10. ✅ **Verify: Accepted by = Manager name**

---

### **Khách hàng 2: Trần Thị B - Quote Rejected & Revised**
**Dịch vụ:** Sửa chữa điện nước - $2,000 → $1,700  
**Thời gian:** 5 phút

#### Các bước chi tiết:

**BƯỚC 1: Tạo Quote ban đầu**
1. Click **"New Quote"**
2. Customer: **Trần Thị B** (tranthib@email.com)
3. Quote Name: "Sửa chữa điện nước - Nhà riêng"
4. Thêm line items:
   - "Sửa chữa hệ thống điện" - $1,200
   - "Sửa chữa hệ thống nước" - $800
   - **Total: $2,000**
5. Save as Draft
6. ✅ **Verify: Status = Draft**

**BƯỚC 2: Gửi Quote lần 1**
1. Click **"Send Quote"**
2. Email sent to: tranthib@email.com
3. ✅ **Verify: Status = Sent**

**BƯỚC 3: Khách hàng Reject**
1. (Giả lập) Khách hàng xem quote và gọi điện cho Manager
2. Khách hàng nói: "Giá cao quá, vượt ngân sách của tôi"
3. Manager ghi nhận và vào hệ thống
4. Manager vào Quote #Q-002 detail page
5. Click button **"Mark as Rejected"**
6. Rejection dialog hiển thị:
   - Reason field: Nhập "Giá cao quá, vượt ngân sách"
7. Click **"Confirm Rejection"**
8. ✅ **Verify: Status = Rejected**
9. ✅ **Verify: Rejection reason hiển thị trong quote**
10. ✅ **Verify: Rejected date được ghi nhận**

**BƯỚC 4: Chỉnh sửa Quote**
1. Manager click **"Edit Quote"** từ rejected quote
2. ✅ **Verify: Status quay lại = Draft**
3. Điều chỉnh line items:
   - "Sửa chữa hệ thống điện" - $1,000 (giảm $200)
   - "Sửa chữa hệ thống nước" - $700 (giảm $100)
   - **New Total: $1,700**
4. Thêm note: "Giảm giá 15% - Khách hàng thân thiết"
5. Thêm discount line: "Discount 15%" - (-$300)
6. Click **"Save"**

**BƯỚC 5: Gửi Quote lần 2**
1. Click **"Send Quote"** lại
2. Email subject: "Revised Quote - Giá mới $1,700"
3. ✅ **Verify: Status = Sent**
4. ✅ **Verify: Version history hiển thị v2**

**BƯỚC 6: Khách hàng Accept Quote đã sửa**
1. (Giả lập) Khách hàng xem revised quote
2. Khách hàng gọi: "OK, giá mới này tôi đồng ý"
3. Manager vào Quote #Q-002
4. Click **"Mark as Accepted"**
5. Confirm
6. ✅ **Verify: Status = Accepted**
7. ✅ **Verify: Accepted amount = $1,700**

---

### **Khách hàng 3: Lê Văn C - Quote Expired**
**Dịch vụ:** Sơn nhà - $3,000  
**Thời gian:** 2 phút (+ giả lập 30 ngày)

#### Các bước chi tiết:

**BƯỚC 1: Tạo Quote với expiry date**
1. Click **"New Quote"**
2. Customer: **Lê Văn C** (levanc@email.com)
3. Quote Name: "Sơn nhà 3 tầng"
4. **Valid Until: Set 30 ngày từ hôm nay**
5. Line items:
   - "Sơn tầng 1" - $1,000
   - "Sơn tầng 2" - $1,000
   - "Sơn tầng 3" - $1,000
   - **Total: $3,000**
6. Save as Draft
7. ✅ **Verify: Expiry date = [Date + 30 days]**

**BƯỚC 2: Gửi Quote**
1. Click **"Send Quote"**
2. Email includes expiry warning: "Valid until [Date]"
3. ✅ **Verify: Status = Sent**
4. ✅ **Verify: Countdown timer hiển thị (30 days remaining)**

**BƯỚC 3: Giả lập thời gian trôi qua**
1. (Demo) Thay đổi system date hoặc giải thích:
   - "Khách hàng không phản hồi trong 30 ngày"
2. System cron job chạy daily check
3. Detect quote passed expiry date

**BƯỚC 4: System tự động expire**
1. ✅ **Verify: Status = Expired**
2. ✅ **Verify: Expired date được ghi nhận**
3. ✅ **Verify: Quote Closed = true**
4. ✅ **Verify: Email notification gửi cho manager**
5. ✅ **Verify: Quote không thể edit hoặc accept nữa**

---

### **Khách hàng 4: Phạm Thị D - Quote Recalled**
**Dịch vụ:** Lắp đặt điều hòa - $1,500 → $1,800  
**Thời gian:** 4 phút

#### Các bước chi tiết:

**BƯỚC 1: Tạo và gửi Quote ban đầu**
1. Click **"New Quote"**
2. Customer: **Phạm Thị D** (phamthid@email.com)
3. Quote Name: "Lắp đặt điều hòa 2 chiều"
4. Line items:
   - "Máy điều hòa Daikin 12000 BTU" - $1,200
   - "Chi phí lắp đặt" - $300
   - **Total: $1,500**
5. Save → Send Quote
6. ✅ **Verify: Status = Sent**

**BƯỚC 2: Phát hiện lỗi**
1. Manager review quote và nhận ra:
   - Quên tính chi phí vật tư (ống đồng, dây điện)
   - Giá lắp đặt chưa bao gồm phụ kiện
2. Manager cần sửa lại trước khi customer accept

**BƯỚC 3: Recall Quote**
1. Click button **"Unlock to edit Quote"**
2. Confirm dialog: "Are you sure? Customer will be notified."
3. Click **"Confirm"**
4. ✅ **Verify: Status quay lại = Draft**
5. ✅ **Verify: Email notification gửi cho customer: "Quote has been recalled for revision"**

**BƯỚC 4: Sửa lại Quote**
1. Edit quote trong Draft mode
2. Thêm line items mới:
   - "Vật tư lắp đặt (ống đồng, dây điện)" - $200
   - "Phụ kiện điều hòa" - $100
3. Cập nhật:
   - "Chi phí lắp đặt" - $300 (giữ nguyên)
   - **New Total: $1,800**
4. Thêm note: "Đã bao gồm đầy đủ vật tư và phụ kiện"
5. Click **"Save"**

**BƯỚC 5: Gửi lại Quote đã sửa**
1. Click **"Send Quote"**
2. Email subject: "Updated Quote - Complete pricing"
3. ✅ **Verify: Status = Sent**
4. ✅ **Verify: Version = v2**

**BƯỚC 6: Khách hàng Accept**
1. (Giả lập) Khách hàng xem updated quote
2. Khách hàng gọi: "OK, báo giá mới này tôi chấp nhận"
3. Manager click **"Mark as Accepted"**
4. ✅ **Verify: Status = Accepted**
5. ✅ **Verify: Final amount = $1,800**

---

### **Khách hàng 5: Hoàng Văn E - Quote Canceled After Acceptance**
**Dịch vụ:** Sửa chữa mái nhà - $5,000  
**Thời gian:** 4 phút

#### Các bước chi tiết:

**BƯỚC 1: Tạo Quote**
1. Click **"New Quote"**
2. Customer: **Hoàng Văn E** (hoangvane@email.com)
3. Quote Name: "Sửa chữa mái nhà bị dột"
4. Line items:
   - "Tháo dỡ mái cũ" - $1,000
   - "Vật liệu mái mới" - $2,500
   - "Lắp đặt mái mới" - $1,200
   - "Chống thấm" - $300
   - **Total: $5,000**
5. Save as Draft

**BƯỚC 2: Gửi và Accept Quote**
1. Click **"Send Quote"**
2. ✅ **Verify: Status = Sent**
3. (Giả lập) Khách hàng xem và đồng ý
4. Khách hàng gọi: "Tôi đồng ý báo giá này"
5. Manager click **"Mark as Accepted"**
6. ✅ **Verify: Status = Accepted**
7. ✅ **Verify: Accepted date ghi nhận**

**BƯỚC 3: Khách hàng gọi hủy dự án**
1. (Giả lập) Sau 3 ngày, khách hàng gọi điện:
   - "Tôi cần hủy dự án vì lý do tài chính"
   - "Gia đình có việc đột xuất"
2. Manager ghi nhận yêu cầu

**BƯỚC 4: Manager Cancel Quote**
1. Vào Quote detail page (Status: Accepted)
2. Click button **"Cancel Quote"**
3. Dialog hiển thị:
   - "This quote has been accepted. Are you sure?"
   - Reason field: "Customer requested cancellation - financial reason"
4. Click **"Confirm Cancellation"**
5. ✅ **Verify: Status = Canceled**
6. ✅ **Verify: Cancellation reason được lưu**
7. ✅ **Verify: Canceled date ghi nhận**

**BƯỚC 5: Verify Quote Closed**
1. ✅ **Verify: Quote Closed = true**
2. ✅ **Verify: Không thể tạo invoice từ quote này**
3. ✅ **Verify: Không thể tạo job từ quote này**
4. ✅ **Verify: Email confirmation gửi cho customer**
5. ✅ **Verify: Quote hiển thị trong "Closed Quotes" list**

---

## 🎬 PHẦN 2: FINANCIAL FLOW - ONE-TIME SERVICE

### **Case A: Single Invoice (Khách hàng 1)**
**Quote: $500 - Vệ sinh thảm**  
**Thời gian:** 5 phút

#### Các bước chi tiết:

**BƯỚC 1: Tạo Invoice từ Quote**
1. Vào Quote #Q-001 (Status: Accepted)
2. Click button **"Create Invoice"**
3. Invoice creation dialog hiển thị:
   - Quote Total: $500
   - Available to invoice: $500
4. **Select line items to invoice:**
   - ☑ "Vệ sinh thảm văn phòng" - $500
5. Review invoice details:
   - Invoice Date: Today
   - Due Date: 15 days from today
   - Amount: $500
6. Click **"Create Invoice"**
7. ✅ **Verify: Invoice #INV-001 created**
8. ✅ **Verify: Invoice Status = Unpaid**
9. ✅ **Verify: Quote Financial Status = Partially Invoiced**

**BƯỚC 2: System tạo Payment Link**
1. System tự động generate payment link
2. ✅ **Verify: Payment link = https://pay.example.com/inv-001**
3. ✅ **Verify: Link hiển thị trong invoice detail**
4. Copy link to clipboard

**BƯỚC 3: Gửi Payment Link cho khách hàng**
1. Click **"Send Payment Link"**
2. Chọn phương thức gửi:
   - ☑ Email
   - ☐ SMS
   - ☐ WhatsApp
3. Email template preview:
   - Subject: "Invoice #INV-001 - $500"
   - Body: Include payment link và invoice details
4. Click **"Send"**
5. ✅ **Verify: Email sent notification**
6. ✅ **Verify: Sent date được ghi nhận**

**BƯỚC 4: Khách hàng thanh toán**
1. (Giả lập) Customer mở email và click payment link
2. Redirect to payment page (Stripe/PayPal)
3. Customer nhập thông tin thẻ:
   - Card: Visa ending 1234
   - Amount: $500
4. Click **"Pay $500"**
5. Payment processing...
6. ✅ **Verify: Payment successful**
7. Customer nhận receipt email

**BƯỚC 5: System cập nhật Invoice**
1. System nhận webhook từ payment gateway
2. ✅ **Verify: Invoice Status = Paid**
3. ✅ **Verify: Paid Date ghi nhận**
4. ✅ **Verify: Payment method: Visa 1234**
5. System gửi receipt email cho customer

**BƯỚC 6: Kiểm tra Quote Status**
1. System check: Quote 100% invoiced & paid?
   - Total Quote: $500
   - Total Invoiced: $500 (100%)
   - Total Paid: $500 (100%)
2. ✅ **Verify: Quote Financial Status = Paid**
3. ✅ **Verify: Quote fully completed**
4. ✅ **Verify: Manager nhận notification**

---

### **Case B: Multiple Invoices - Progress Billing (Khách hàng 2)**
**Quote: $1,700 - Sửa chữa điện nước (3 milestones)**  
**Thời gian:** 12 phút

#### Setup Quote với milestones:
- Down Payment: $500 (29%)
- Mid-Progress: $800 (47%)
- Final Payment: $400 (24%)
- **Total: $1,700**

#### Các bước chi tiết:

**INVOICE 1 - DOWN PAYMENT**

**BƯỚC 1: Tạo Invoice đầu tiên**
1. Vào Quote #Q-002 (Status: Accepted, Amount: $1,700)
2. Click **"Create Invoice"**
3. Invoice dialog hiển thị:
   - Available to invoice: $1,700
   - Line items:
     ☐ "Sửa chữa hệ thống điện" - $1,000
     ☐ "Sửa chữa hệ thống nước" - $700
4. **Chọn chỉ Down Payment:**
   - Create custom line item: "Down Payment (30%)" - $500
5. Click **"Create Invoice"**
6. ✅ **Verify: Invoice #INV-002A created**
7. ✅ **Verify: Invoice Status = Unpaid**
8. ✅ **Verify: Invoice Amount = $500**
9. ✅ **Verify: Quote Financial Status = Partially Invoiced**
10. ✅ **Verify: Quote progress = 29% invoiced**

**BƯỚC 2: Gửi và thanh toán Invoice 1**
1. Send payment link via email
2. Customer pays $500
3. ✅ **Verify: Invoice #INV-002A Status = Paid**
4. ✅ **Verify: Quote Financial Status = Partially Paid**
5. ✅ **Verify: Quote progress = 29% paid, 71% remaining**

**BƯỚC 3: System waiting**
1. ✅ **Verify: System status = "Waiting to invoice remaining items"**
2. ✅ **Verify: Remaining amount = $1,200**
3. Quote detail hiển thị:
   - Invoiced: $500 / $1,700 (29%)
   - Paid: $500 / $1,700 (29%)
   - Remaining: $1,200

---

**INVOICE 2 - MID-PROGRESS (2 tuần sau)**

**BƯỚC 4: Tạo Invoice thứ hai**
1. (Giả lập) Công việc hoàn thành 50%
2. Manager vào Quote #Q-002
3. Click **"Create Invoice"** lại
4. Invoice dialog:
   - Available to invoice: $1,200 (remaining)
5. **Chọn Mid-Progress:**
   - Create line item: "Mid-Progress Payment (47%)" - $800
6. Click **"Create Invoice"**
7. ✅ **Verify: Invoice #INV-002B created**
8. ✅ **Verify: Invoice Status = Unpaid**
9. ✅ **Verify: Quote Financial Status = Partially Invoiced**
10. ✅ **Verify: Quote progress = 76% invoiced (29% + 47%)**

**BƯỚC 5: Gửi và thanh toán Invoice 2**
1. Send payment link
2. Customer pays $800
3. ✅ **Verify: Invoice #INV-002B Status = Paid**
4. ✅ **Verify: Quote Financial Status = Partially Paid**
5. ✅ **Verify: Quote progress = 76% paid, 24% remaining**
6. ✅ **Verify: Remaining amount = $400**

---

**INVOICE 3 - FINAL PAYMENT (1 tháng sau)**

**BƯỚC 6: Tạo Invoice cuối cùng**
1. (Giả lập) Công việc hoàn thành 100%
2. Manager vào Quote #Q-002
3. Click **"Create Invoice"** lần cuối
4. Invoice dialog:
   - Available to invoice: $400 (remaining)
5. **Chọn Final Payment:**
   - Create line item: "Final Payment (24%)" - $400
6. Click **"Create Invoice"**
7. ✅ **Verify: Invoice #INV-002C created**
8. ✅ **Verify: Invoice Status = Unpaid**
9. ✅ **Verify: Quote Financial Status = Fully Invoiced**
10. ✅ **Verify: Quote progress = 100% invoiced, 76% paid**

**BƯỚC 7: Gửi và thanh toán Invoice 3**
1. Send payment link
2. Customer pays $400
3. ✅ **Verify: Invoice #INV-002C Status = Paid**

**BƯỚC 8: Verify Quote hoàn thành**
1. System check: 100% invoiced & paid?
   - Total: $1,700
   - Invoiced: $500 + $800 + $400 = $1,700 ✓
   - Paid: $500 + $800 + $400 = $1,700 ✓
2. ✅ **Verify: Quote Financial Status = Paid**
3. ✅ **Verify: Quote fully completed**
4. ✅ **Verify: All 3 invoices visible in quote history**

---

## 🎬 PHẦN 3: FINANCIAL FLOW - SUBSCRIPTION

### **Case A: Auto-Charge Success (Khách hàng 6 - Nguyễn Thị F)**
**Dịch vụ:** Bảo trì cỏ hàng tháng - $150/tháng  
**Thời gian:** 8 phút

#### Các bước chi tiết:

**SETUP SUBSCRIPTION**

**BƯỚC 1: Tạo Quote Subscription**
1. Click **"New Quote"**
2. Customer: **Nguyễn Thị F** (nguyenthif@email.com)
3. Quote Name: "Bảo trì cỏ hàng tháng - Villa"
4. **Quote Type: Chọn "Recurring/Subscription"** ✓
5. Line items:
   - "Cắt cỏ" - $80
   - "Tỉa cây" - $50
   - "Phun thuốc" - $20
   - **Total: $150/month**
6. Save as Draft
7. ✅ **Verify: Quote Type = Subscription**
8. Send Quote → Customer Accept
9. ✅ **Verify: Status = Accepted**

**BƯỚC 1.5: Setup Subscription Billing (khi tạo invoice đầu tiên)**
1. Manager vào Quote #Q-006 (Accepted)
2. Click **"Create Subscription Invoice"**
3. Subscription billing dialog hiển thị:
   - Frequency: **Monthly** (default)
   - Start Date: **01/02/2025**
   - Billing Day: **1st of month**
   - Amount: $150
4. Click **"Create Subscription"**
5. ✅ **Verify: Subscription created**
6. ✅ **Verify: Billing settings saved**

**BƯỚC 2: Khách hàng lưu thẻ thanh toán**
1. Manager click **"Send Payment Setup Link"** trong subscription detail
2. System tạo **secure one-time link** (có token):
   - Link: `https://pay.example.com/setup/abc123xyz` 
   - **Expires in: 7 days**
   - **One-time use only** (sau khi setup xong sẽ invalid)
3. Email gửi tới customer với link
4. Customer click link và nhập thông tin thẻ:
   - Card Number: 4242 4242 4242 1234
   - Expiry: 12/2027
   - CVV: 123
   - Name: Nguyen Thi F
5. Click **"Save Card"**
6. System lưu vào Stripe/PayPal
7. ✅ **Verify: Link becomes invalid after use**
8. Manager kiểm tra trong hệ thống:
9. ✅ **Verify: Card on file = YES**
10. ✅ **Verify: Card display = Visa ending 1234**
11. ✅ **Verify: Subscription Status = Active**

---

**DEMO THÁNG 1 (Tự động)**

**BƯỚC 3: System Scheduler triggers**
1. (Giả lập) Ngày 01/02/2025 - 00:00 AM
2. **Cron job chạy: Check subscriptions due today**
3. System detect: Subscription #SUB-001 due
4. ✅ **Verify: Scheduler triggered**
5. ✅ **Verify: Event logged: "Subscription billing triggered"**

**BƯỚC 4: System kiểm tra Card**
1. System query: Customer has saved card?
2. Database check: card_id = "card_xxx"
3. ✅ **Verify: Card on file = YES**
4. ✅ **Verify: Card status = Active**
5. Proceed to auto-charge

**BƯỚC 5: System AUTO-CHARGES**
1. **System calls Stripe API: Create charge**
2. Request:
   - Amount: $150
   - Card: card_xxx (Visa 1234)
   - Description: "Bảo trì cỏ - Tháng 02/2025"
3. ✅ **Verify: API call sent**
4. Stripe processing...
5. Response: **"Charge Successful"**
6. ✅ **Verify: Charge ID = ch_xxx**
7. ✅ **Verify: Amount charged = $150**

**BƯỚC 6: System tạo Invoice tự động**
1. **System creates Invoice #INV-SUB-001-FEB**
2. Invoice details:
   - Amount: $150
   - **Status: PAID** (tự động) ✓
   - Payment Method: Visa 1234
   - Paid Date: 01/02/2025
3. ✅ **Verify: Invoice created with Status = PAID**
4. ✅ **Verify: No manual action needed**

**BƯỚC 7: System gửi Receipt**
1. System auto-send email receipt
2. Email content:
   - Subject: "Receipt - $150 paid"
   - Body: Invoice details + payment confirmation
   - Attachment: Invoice PDF
3. ✅ **Verify: Email sent to customer**
4. ✅ **Verify: Receipt logged in system**

**BƯỚC 8: Wait for next cycle**
1. System update: Next billing date = 01/03/2025
2. ✅ **Verify: Subscription Status = Active**
3. ✅ **Verify: Next billing date set**
4. ✅ **Verify: System waiting for next cycle**

---

**DEMO THÁNG 2 (Lặp lại tự động)**

**BƯỚC 9: Tháng 2 - Auto-charge lại**
1. Ngày 01/03/2025 - Scheduler triggers
2. System auto-charges $150
3. Invoice #INV-SUB-001-MAR created (Status: PAID)
4. Receipt sent
5. ✅ **Verify: Loop continues automatically**
6. ✅ **Verify: No manual intervention needed**
7. Next billing: 01/04/2025

---

### **Case B: Auto-Charge Failed (Khách hàng 7)**
**Dịch vụ:** Vệ sinh hồ bơi - $200/tháng

**Demo Tháng 7 (Card expired):**
1. Scheduler triggers
2. Auto-charge → **FAILED** ✓
3. **Start Dunning Process** ✓
   - Day 1: Email warning
   - Day 3: Retry → Failed
   - Day 7: Final notice
   - Day 10: **Pause Subscription** ✓
4. Customer updates card
5. Manager reactivates
6. Create manual invoice
7. Resume subscription

---

### **Case C: No Saved Card (Khách hàng 8)**
**Dịch vụ:** Diệt côn trùng - $100/tháng

**Demo mỗi tháng:**
1. Scheduler triggers
2. **Card on file: NO** ✓
3. **System creates Invoice: UNPAID** ✓
4. **System auto-sends payment link** ✓
5. Customer pays manually
6. **Invoice: Paid**
7. **Loop continues** (manual payment mỗi tháng)

---

## 🎬 PHẦN 4: JOB STATUS LIFECYCLE

### **Case A: One-Time Job - Smooth**
**Từ Quote Khách hàng 1**

**Demo:**
1. Create Job → **Status: Unscheduled** ✓
2. Assign staff + date → **Status: Scheduled** ✓
3. Staff starts → **Status: In Progress** ✓
4. Staff completes → **Status: Completed** ✓
5. **Check: One-Time → Job ends** ✓

---

### **Case B: Job Paused & Resumed**
**Sửa ống nước**

**Demo:**
1. Job Scheduled → In Progress
2. Thiếu linh kiện → Pause → **Status: On Hold** ✓
3. Linh kiện về → Resume → **Status: In Progress** ✓
4. Complete → **Status: Completed**

---

### **Case C: Job Canceled**
**Lắp camera**

**Demo:**
1. Job Scheduled
2. Customer cancels → **Status: Canceled** ✓
3. **Job ends** ✓

---

### **Case D: Job Unscheduled & Rescheduled**
**Sơn tường**

**Demo:**
1. Scheduled (Staff A, 25/01)
2. Staff conflict → **Status: Unscheduled** ✓
3. Reschedule (Staff B, 27/01) → **Status: Scheduled** ✓
4. Complete

---

### **Case E: Job Paused by Manager**
**Lắp điện**

**Demo:**
1. Job Scheduled
2. Payment issue → Manager pause → **Status: On Hold** ✓
3. Payment resolved → Reschedule → **Status: Scheduled** ✓
4. Complete

---

### **Case F: Subscription Job - Recurring**
**Từ Subscription Khách hàng 6**

**Demo Tháng 1:**
1. **System auto-creates Job** ✓
2. **Status: Unscheduled** ✓
3. Manager schedules → Complete
4. **Check: Subscription → YES** ✓
5. **Wait for scheduler** ✓

**Demo Tháng 2:**
6. **Scheduler triggers** ✓
7. System creates new Job
8. **Loop continues** ✓

---

### **Case G: Subscription Job Canceled**
**Tháng 4 - Customer cancels**

**Demo:**
1. System creates Job tháng 4
2. Customer cancels subscription
3. Manager cancels Job → **Status: Canceled** ✓
4. **Loop broken** ✓

---

## 🎬 PHẦN 5: INVOICE STATUS LIFECYCLE

### **Case A: Unpaid → Paid**
1. Invoice created → **Status: Unpaid** ✓
2. Customer pays → **Status: Paid** ✓

---

### **Case B: Unpaid → Overdue → Paid**
1. Invoice created (Due: 15/01)
2. Ngày 16/01 → **Status: Overdue** ✓
3. Customer pays → **Status: Paid** ✓

---

### **Case C: Unpaid → Void**
1. Invoice created → **Status: Unpaid**
2. Customer cancels → **Status: Void** ✓
3. **Invoice Closed** ✓

---

### **Case D: Paid → Void (Refund)**
1. Invoice paid → **Status: Paid**
2. Issue refund → **Status: Void** ✓
3. **Invoice Closed** ✓

---

### **Case E: Overdue → Void**
1. Invoice overdue 60 days
2. Write off → **Status: Void** ✓
3. **Invoice Closed** ✓

---

## 📊 CHECKLIST TẤT CẢ TRẠNG THÁI

### ✅ Quote Operation:
- [x] Draft, Sent, Accepted, Rejected, Expired, Canceled, Closed

### ✅ Quote Financial:
- [x] Not Invoiced, Partially Invoiced, Fully Invoiced, Partially Paid, Paid

### ✅ Invoice:
- [x] Unpaid, Paid, Overdue, Void, Closed

### ✅ Job:
- [x] Unscheduled, Scheduled, In Progress, On Hold, Completed, Canceled

### ✅ Financial Flows:
- [x] One-Time Single, One-Time Multiple, Subscription Auto, Subscription Failed, Subscription Manual

### ✅ Job Triggers:
- [x] Manual, Auto, Loop Back

---
