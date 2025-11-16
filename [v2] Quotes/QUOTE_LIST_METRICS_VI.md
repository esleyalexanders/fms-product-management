# Quote List Summary Metrics - Cách Tính Toán

Tài liệu này giải thích cách tính toán các chỉ số trong trang Quote List.

---

## Thẻ Tổng Hợp Chính (Đầu Trang)

### 1. Active Quotes (Báo Giá Đang Hoạt Động)
**Hiển thị gì:** Tổng số quote hiện đang trong quy trình làm việc

**Cách tính:** Đếm tất cả quote có status:
- Draft
- Sent
- Accepted

**Loại trừ:** Quote có status Declined và Converted

---

### 2. Total Value (Tổng Giá Trị)
**Hiển thị gì:** Tổng số tiền của các quote đang hoạt động

**Cách tính:** Cộng tất cả số tiền quote có status:
- Draft
- Sent
- Accepted

**Loại trừ:** Quote có status Declined và Converted

---

### 3. Outstanding (Công Nợ)
**Hiển thị gì:** Số tiền đã invoice nhưng chưa thu được từ khách hàng

**Cách tính:** 
- Tổng Amount Invoiced (trên tất cả quote)
- Trừ đi Tổng Amount Paid (trên tất cả quote)
- **Outstanding = Amount Invoiced - Amount Paid**

**Unpaid Count:** Số lượng quote đã invoice nhưng chưa có payment nào

---

### 4. This Month (Tháng Này)
**Hiển thị gì:** Tổng giá trị và số lượng quote được tạo trong tháng hiện tại

**Cách tính:**
- Filter tất cả quote được tạo trong tháng và năm hiện tại
- Cộng tổng số tiền
- Đếm số lượng quote

**Bao gồm:** Tất cả quote bất kể status (Draft, Sent, Accepted, Declined, Converted)

---

## Filter Summary Panel (Bảng Tóm Tắt Lọc)

**Khi nào xuất hiện:** Hiển thị khi có bất kỳ filter nào được kích hoạt (search, status, date range, v.v.)

**Hiển thị gì:** Tính toán theo thời gian thực chỉ dựa trên các quote hiện đang được filter/hiển thị

### 1. Filtered Quotes (Số Quote Được Lọc)
**Hiển thị gì:** Số lượng quote hiện đang hiển thị sau khi áp dụng filter

**Cách tính:** Đếm tất cả quote phù hợp với tiêu chí filter hiện tại

---

### 2. Total Value (Tổng Giá Trị)
**Hiển thị gì:** Tổng số tiền của tất cả quote hiện đang được filter

**Cách tính:** Cộng tổng số tiền của tất cả quote đang hiển thị

**Bao gồm:** Tất cả quote đạt tiêu chí filter hiện tại, bất kể status

---

### 3. Average Value (Giá Trị Trung Bình)
**Hiển thị gì:** Số tiền trung bình mỗi quote trong kết quả được filter

**Cách tính:** 
- Total Value của các quote được filter
- Chia cho số lượng quote được filter
- **Average Value = Total Value ÷ Filtered Quotes**

**Ví dụ:** $21,603.75 ÷ 13 quotes = $1,661.83 trung bình

---

### 4. Outstanding (Công Nợ)
**Hiển thị gì:** Số tiền đã invoice chưa thanh toán chỉ từ các quote được filter

**Cách tính:**
- Tổng Amount Invoiced từ các quote được filter
- Trừ đi Tổng Amount Paid từ các quote được filter
- **Outstanding = Invoiced - Paid** (chỉ cho các quote được filter)

---

## Sự Khác Biệt Chính

| Chỉ Số | Main Cards | Filter Summary Panel |
|--------|------------|----------------------|
| **Nguồn Dữ Liệu** | Tất cả quote trong hệ thống | Chỉ các quote hiện đang được filter/hiển thị |
| **Active Quotes** | Chỉ status Draft/Sent/Accepted | Tất cả status đạt tiêu chí filter |
| **Total Value** | Chỉ từ active quotes | Từ tất cả quote được filter bất kể status |
| **Mục Đích** | Tổng quan tình hình kinh doanh | Phân tích các segment hoặc nhóm cụ thể |

---

## Ví Dụ

### Ví Dụ Main Cards:
- **Active Quotes:** 13 (tất cả quote Draft/Sent/Accepted)
- **Total Value:** $21,600 (tổng của 13 quote đó)
- **Outstanding:** $5,300 (đã invoice nhưng chưa paid trên TẤT CẢ quote)
- **This Month:** $11,100 (8 quote được tạo trong tháng 11)

### Ví Dụ Filter Summary Panel (khi filter theo customer "Sarah Johnson"):
- **Filtered Quotes:** 3 (chỉ quote của Sarah)
- **Total Value:** $6,462.50 (tổng 3 quote của Sarah)
- **Average Value:** $2,154.17 (trung bình quote của Sarah)
- **Outstanding:** $3,250 (chưa paid chỉ từ Sarah)
