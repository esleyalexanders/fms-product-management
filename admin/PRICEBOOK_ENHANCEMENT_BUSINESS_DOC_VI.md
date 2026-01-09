# Pricebook Enhancement - Business Requirements Document

---

## Executive Summary

Tài liệu này trình bày các yêu cầu nghiệp vụ để cải tiến module Pricebook với ba trường dữ liệu mới nhằm cải thiện quản lý dịch vụ và tính linh hoạt trong thanh toán. Các cải tiến này sẽ cho phép kiểm soát tốt hơn việc liên kết dịch vụ với các loại learning service và cung cấp nhiều tùy chọn cấu hình thanh toán linh hoạt hơn.

---

## 1. Business Context

### 1.1 Current State

Hệ thống Pricebook hiện tại cho phép người dùng tạo và quản lý các mục service/product với thông tin cơ bản bao gồm:
- Type (Service/Product)
- SKU/Code
- Tên và Mô tả
- Thông tin Giá và Thuế
- MOQ (Minimum Order Quantity) và Đơn vị


### 1.3 Proposed Solution

Thêm ba trường dữ liệu mới vào module Pricebook:
1. **Applicable Service Types** (multi-select) - Các loại dịch vụ áp dụng được
2. **Supported Payment Models** (multi-select) - Các mô hình thanh toán được hỗ trợ
3. **Subscription Frequency Options** (multi-select, conditional) - Các tùy chọn tần suất subscription

---

## 2. Detailed Requirements

### 2.1 Field 1: Applicable Service Types

#### 2.1.1 Field Name
**Tên được đề xuất:** "Applicable Service Types"

**Lý do:** Tên này truyền đạt rõ ràng rằng trường này xác định loại learning service nào có thể sử dụng mục pricebook này.

#### 2.1.2 Field Specifications

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Loại trường** | Multi-select toggle buttons |
| **Bắt buộc** | Không bắt buộc (nếu không chọn, mục áp dụng cho tất cả các loại) |
| **Tùy chọn** | • Class<br>• Group<br>• One-off |
| **Giá trị mặc định** | Tất cả được chọn (tương thích ngược) |
| **Vị trí hiển thị** | • Màn hình Create Pricebook Item<br>• Màn hình Edit Pricebook Item<br>• Màn hình Pricebook Details |
| **Section** | Service Details (chỉ cho Service type items) |

#### 2.1.3 Business Rules

1. **Logic Chọn Lựa**
   - Người dùng có thể chọn một, nhiều, hoặc tất cả các loại dịch vụ
   - Ít nhất một tùy chọn phải được chọn nếu trường được sử dụng
   - Nếu không có lựa chọn nào, mặc định là "Áp dụng cho tất cả các loại"

2. **Quy Tắc Hiển Thị**
   - Trường này chỉ xuất hiện khi Type = "Service"
   - Ẩn khi Type = "Product"

3. **Tương Thích Ngược**
   - Các mục pricebook hiện có nên mặc định là "Áp dụng cho tất cả các loại"
   - Script migration nên đặt cả ba loại là đã chọn cho các mục hiện có

#### 2.1.4 System Behavior Impact

**Điểm Tác Động 1: Tạo Learning Service**
- **Vị trí:** Khi tạo/chỉnh sửa Learning Service và liên kết các mục pricebook
- **Hành vi hiện tại:** Tất cả các mục pricebook loại service đều có sẵn để chọn
- **Hành vi mới:** Chỉ các mục pricebook có loại dịch vụ khớp với loại learning service đang được tạo mới có sẵn
- **Ví dụ:** 
  - Nếu tạo learning service loại "Class", chỉ các mục pricebook có "Class" được chọn trong Applicable Service Types mới xuất hiện trong dropdown chọn mục

**Điểm Tác Động 2: Quote Line Items**
- **Vị trí:** Khi thêm mục pricebook vào quote cho learning service
- **Hành vi hiện tại:** Tất cả các mục có thể được thêm
- **Hành vi mới:** Hệ thống xác thực rằng applicable service types của mục pricebook khớp với loại learning service
- **Thông báo xác thực:** "Mục này không áp dụng cho learning service loại [Service Type]. Vui lòng chọn mục hỗ trợ [Service Type]."

---

### 2.2 Field 2: Supported Payment Models

#### 2.2.1 Field Specifications

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Tên trường** | Supported Payment Models |
| **Loại trường** | Multi-select toggle buttons |
| **Bắt buộc** | Không bắt buộc (nếu không chọn, tất cả payment models được hỗ trợ) |
| **Tùy chọn** | • Full Payment (Upfront)<br>• Down Payment (Deposit)<br>• Subscription (Recurring) |
| **Giá trị mặc định** | Tất cả được chọn (tương thích ngược) |
| **Vị trí hiển thị** | • Màn hình Create Pricebook Item<br>• Màn hình Edit Pricebook Item<br>• Màn hình Pricebook Details |
| **Section** | Pricing (áp dụng cho cả Service và Product) |

#### 2.2.2 Business Rules

1. **Logic Chọn Lựa**
   - Người dùng có thể chọn một, nhiều, hoặc tất cả payment models
   - Ít nhất một tùy chọn phải được chọn nếu trường được sử dụng
   - Nếu không có lựa chọn nào, mặc định là "Tất cả payment models được hỗ trợ"

2. **Quy Tắc Hiển Thị**
   - Trường này xuất hiện cho cả Service và Product types
   - Luôn hiển thị trong section Pricing

3. **Tương Thích Ngược**
   - Các mục pricebook hiện có nên mặc định là "Tất cả payment models được hỗ trợ"
   - Script migration nên đặt tất cả payment models là đã chọn cho các mục hiện có

#### 2.2.3 Payment Model Definitions

| Payment Model | Mô tả | Use Case | Chi tiết Cấu hình |
|---------------|-------|----------|-------------------|
| **Full Payment (Upfront)** | Khách hàng thanh toán toàn bộ số tiền trước khi dịch vụ bắt đầu | Dịch vụ một lần, sản phẩm, gói trả trước | Không cần cấu hình thêm |
| **Down Payment (Deposit)** | Khách hàng thanh toán đặt cọc ngay, số dư còn lại thanh toán sau | Dịch vụ giá trị cao, xác nhận đặt chỗ, thanh toán chia nhỏ | Số tiền/phần trăm đặt cọc được cấu hình ở cấp quote |
| **Subscription (Recurring)** | Hóa đơn tự động lặp lại theo khoảng thời gian đều đặn | Membership, dịch vụ liên tục, lớp học định kỳ | **Tần suất (weekly/monthly/quarterly/annually) được cấu hình ở cấp quote**, không phải trong pricebook |

**Lưu ý Quan Trọng:** Mục pricebook chỉ chỉ ra rằng nó *hỗ trợ* subscription payment. Tần suất subscription thực tế (weekly, monthly, v.v.) được cấu hình khi thêm mục vào quote, cho phép cùng một mục pricebook được bán với các tần suất thanh toán khác nhau cho các khách hàng khác nhau.

#### 2.2.4 System Behavior Impact

**Điểm Tác Động 1: Cấu Hình Quote**
- **Vị trí:** Khi thêm mục pricebook vào quote lines
- **Hành vi hiện tại:** Tất cả các tùy chọn cấu hình thanh toán đều có sẵn
- **Hành vi mới:** Chỉ các tùy chọn cấu hình thanh toán khớp với supported payment models của mục pricebook mới có sẵn
- **Ví dụ:**
  - Nếu một mục pricebook chỉ hỗ trợ "Full Payment (Upfront)" và "Subscription (Recurring)"
  - Khi thêm vào quote, chỉ hai tùy chọn thanh toán này xuất hiện trong dropdown cấu hình thanh toán
  - Tùy chọn "Down Payment (Deposit)" bị ẩn hoặc vô hiệu hóa
  - **Nếu "Subscription (Recurring)" được chọn**, các cấu hình bổ sung xuất hiện cho:
    - Tần suất thanh toán (Weekly, Monthly, Quarterly, Annually)
    - Ngày bắt đầu
    - Ngày kết thúc (tùy chọn)
    - Các cài đặt khác liên quan đến subscription

**Điểm Tác Động 2: Giao Diện Cấu Hình Thanh Toán**
- **Vị trí:** Section cấu hình thanh toán của quote line item
- **Cải tiến:** Hiển thị văn bản hướng dẫn cho biết payment models nào được hỗ trợ
- **Định dạng hiển thị:** "Các tùy chọn thanh toán có sẵn cho mục này: Full Payment (Upfront), Subscription (Recurring)"

**Điểm Tác Động 3: Xác Thực**
- **Vị trí:** Lưu/gửi quote
- **Quy tắc xác thực:** Đảm bảo cấu hình thanh toán được chọn khớp với một trong các supported payment models
- **Thông báo lỗi:** "Cấu hình thanh toán được chọn không được hỗ trợ cho [Tên Mục]. Các models được hỗ trợ: [Danh sách models]"

---

### 2.3 Field 3: Subscription Frequency Options

#### 2.3.1 Field Specifications

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Tên trường** | Subscription Frequency Options |
| **Loại trường** | Multi-select toggle buttons |
| **Bắt buộc** | Có (khi Subscription được chọn) |
| **Tùy chọn** | • Weekly<br>• Monthly<br>• Quarterly<br>• Annually |
| **Giá trị mặc định** | Tất cả được chọn |
| **Vị trí hiển thị** | • Màn hình Create Pricebook Item<br>• Màn hình Edit Pricebook Item |
| **Điều kiện hiển thị** | Chỉ hiển thị khi "Subscription (Recurring)" được chọn trong Supported Payment Models |

#### 2.3.2 Business Rules

1. **Logic Hiển Thị**
   - Trường này chỉ xuất hiện khi "Subscription (Recurring)" được chọn
   - Tự động ẩn khi "Subscription (Recurring)" bị bỏ chọn
   - Tự động hiện lại khi "Subscription (Recurring)" được chọn lại

2. **Logic Chọn Lựa**
   - Ít nhất một tần suất phải được chọn khi trường hiển thị
   - Người dùng có thể chọn một, nhiều, hoặc tất cả các tần suất
   - Nếu Subscription không được chọn, không cần xác thực trường này

3. **Mục Đích**
   - Xác định các tùy chọn tần suất nào sẽ có sẵn khi mục này được thêm vào quote với subscription payment
   - Cung cấp sự linh hoạt để hạn chế hoặc mở rộng các tùy chọn tần suất dựa trên tính chất của dịch vụ

#### 2.3.3 System Behavior Impact

**Điểm Tác Động: Cấu Hình Subscription Trong Quote**
- **Vị trí:** Khi cấu hình subscription payment trong quote line item
- **Hành vi:** Chỉ các tần suất được chọn trong pricebook mới xuất hiện trong dropdown tần suất
- **Ví dụ:**
  - Nếu mục pricebook chỉ có "Monthly" và "Annually" được chọn
  - Khi thêm vào quote và chọn Subscription, chỉ "Monthly" và "Annually" xuất hiện
  - "Weekly" và "Quarterly" bị ẩn

