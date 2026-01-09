# Thẻ Thống Kê Timesheet - Business Logic

## Tổng Quan
Tài liệu này mô tả business logic cho các thẻ thống kê hiển thị trên màn hình Timesheet Manager và Timesheet Overview. Các thẻ này cung cấp cho manager những thông tin nhanh về dữ liệu timesheet và tình trạng payroll.

---

## 1. Timesheet Manager Inbox (`timesheet_manager_inbox.html`)

### Mục Đích
Manager Inbox là dashboard hướng đến hành động, nơi manager xem xét, phê duyệt hoặc từ chối các timesheet entry riêng lẻ. Các thống kê tập trung vào **các mục cần xử lý** và **nghĩa vụ tài chính**.

### Các Thẻ Thống Kê

#### 1.1 Pending Reviews
- **Hiển thị gì**: Số lượng timesheet entry đang chờ manager phê duyệt
- **Ý nghĩa business**: Chỉ số khối lượng công việc - có bao nhiêu mục cần xử lý ngay
- **Cách tính**: Đếm tất cả timesheet entry có status = "pending"
- **Hành động của user**: Manager cần xem xét và approve/decline các entry này
- **Màu sắc**: Amber (cảnh báo/cần chú ý)

#### 1.2 Total Payable
- **Hiển thị gì**: Tổng số tiền phải trả cho staff cho các giờ đã approved
- **Ý nghĩa business**: Cam kết tài chính - số tiền sẽ được thanh toán trong lần chạy payroll tiếp theo
- **Cách tính**: Tổng của (approved hours × hourly rate) cho tất cả timesheet entry đã approved
- **Hành động của user**: Team Finance sử dụng để lập ngân sách và chuẩn bị payroll
- **Màu sắc**: Green (tích cực/tiền)

#### 1.3 Hours Alerts
- **Hiển thị gì**: Số lượng timesheet entry có sai lệch hoặc vấn đề
- **Ý nghĩa business**: Kiểm soát chất lượng - các entry cần chú ý đặc biệt trước khi approve
- **Cách tính**: Đếm các entry có:
  - Actual hours khác biệt đáng kể so với estimated hours (ví dụ: chênh lệch >20%)
  - Hours vượt quá ngưỡng mong đợi
  - Thiếu thông tin bắt buộc
- **Hành động của user**: Manager cần điều tra các entry này trước khi approve
- **Màu sắc**: Red (cảnh báo/warning)

#### 1.4 Total Entries
- **Hiển thị gì**: Tổng số timesheet entry trong view/period hiện tại
- **Ý nghĩa business**: Chỉ số khối lượng - mức độ hoạt động tổng thể
- **Cách tính**: Đếm tất cả timesheet entry khớp với filter hiện tại (date range, staff, status)
- **Hành động của user**: Thông tin - giúp manager hiểu khối lượng công việc
- **Màu sắc**: Indigo (trung lập/thông tin)

---

## 2. Timesheet Overview (`timesheet_overview.html`)

### Mục Đích
Màn hình Overview cung cấp cái nhìn tổng hợp, cấp cao về dữ liệu timesheet **theo staff member**. Tập trung vào **phân bổ hours** và **approval status** thay vì các entry riêng lẻ.

### Các Thẻ Thống Kê

#### 2.1 Total Hours
- **Hiển thị gì**: Tổng tất cả hours của tất cả staff member
- **Ý nghĩa business**: Tổng năng lực lao động được sử dụng trong period
- **Cách tính**: Tổng tất cả final hours từ tất cả timesheet entry (bất kể status)
- **Hành động của user**: Workforce planning - hiểu tổng số giờ lao động đã tiêu thụ
- **Màu sắc**: Indigo (metric chính)

#### 2.2 Pending Approval
- **Hiển thị gì**: Tổng hours đang chờ manager phê duyệt
- **Ý nghĩa business**: Hours lao động chưa xử lý - công việc đã hoàn thành nhưng chưa được xác nhận
- **Cách tính**: Tổng hours từ các entry có status = "pending"
- **Hành động của user**: Chỉ ra backlog - manager cần xử lý các approval đang chờ
- **Màu sắc**: Amber (cần chú ý)

#### 2.3 Approved Hours
- **Hiển thị gì**: Tổng hours đã được approved
- **Ý nghĩa business**: Giờ làm việc đã xác nhận, sẵn sàng cho xử lý payroll
- **Cách tính**: Tổng hours từ các entry có status = "approved"
- **Hành động của user**: Các hours này sẽ được bao gồm trong lần chạy payroll tiếp theo
- **Màu sắc**: Green (đã approved/sẵn sàng)

#### 2.4 Active Staff
- **Hiển thị gì**: Số lượng staff member duy nhất có timesheet entry
- **Ý nghĩa business**: Mức độ tham gia của workforce - có bao nhiêu người đã làm việc trong period này
- **Cách tính**: Đếm số staff member riêng biệt có ít nhất một timesheet entry trong period
- **Hành động của user**: Phân tích workforce - hiểu quy mô team và sự tham gia
- **Màu sắc**: Purple (metric về người)

---

## 3. Sự Khác Biệt Chính Giữa Hai Màn Hình

| Khía Cạnh | Manager Inbox | Overview |
|-----------|---------------|----------|
| **Focus** | Entry riêng lẻ (hướng hành động) | Tổng hợp theo staff (phân tích) |
| **Primary User** | Manager approve timesheet | HR/Finance xem xét tổng số |
| **Time Sensitivity** | Hành động real-time cần thiết | Phân tích theo period |
| **Metrics Type** | Đếm entry + tài chính | Tổng hours + đếm staff |
| **Decision Support** | "Tôi cần approve gì hôm nay?" | "Team đã làm bao nhiêu giờ tháng này?" |

---

## 4. Business Rules

### 4.1 Định Nghĩa Status
- **Pending**: Timesheet entry được staff submit, đang chờ manager xem xét
- **Approved**: Manager đã xác nhận và phê duyệt hours
- **Declined**: Manager đã từ chối entry (yêu cầu staff sửa lại)

### 4.2 Ưu Tiên Tính Hours
Khi tính hours cho thống kê:
1. Sử dụng **Final Hours** (manager điều chỉnh) nếu có
2. Dùng **Actual Hours** (staff báo cáo) nếu final hours chưa được set
3. Chỉ dùng **Estimated Hours** nếu cả hai cái trên đều thiếu

### 4.3 Điều Kiện Kích Hoạt Alert (Manager Inbox)
Một entry tạo alert khi:
- Actual hours vượt quá estimated hours >20%
- Actual hours ít hơn estimated hours >30%
- Tổng hours cho một entry vượt quá 12 giờ (vấn đề overtime tiềm ẩn)
- Thiếu các field bắt buộc (job reference, activity description)

### 4.4 Date Filtering
- Thống kê cập nhật động dựa trên date range được chọn
- View mặc định: Tháng hiện tại
- Quick filter có sẵn: Today, Week, Month, Quarter
- Hỗ trợ custom date range

---

## 5. User Workflow

### 5.1 Manager Inbox Workflow
1. Manager mở inbox → thấy pending reviews count
2. Xem xét các entry có alert trước (thẻ đỏ)
3. Approve/decline entry → pending count giảm, approved hours tăng
4. Theo dõi total payable để giữ trong ngân sách
5. Export các entry đã approved để xử lý payroll

### 5.2 Overview Workflow
1. HR/Finance mở overview → thấy total hours cho period
2. Filter theo date range để phân tích các period cụ thể
3. Xem xét pending hours → follow up với manager nếu backlog cao
4. Kiểm tra active staff count → so sánh với headcount dự kiến
5. Export dữ liệu tổng hợp để báo cáo/phân tích

---

## 6. Data Refresh Logic

### Real-time Update
- Thống kê tính toán lại ngay lập tức khi:
  - Manager approve/decline một entry
  - Date filter thay đổi
  - Staff filter thay đổi
  - Status filter thay đổi

### Performance Considerations
- Với dataset lớn (>1000 entry), thống kê có thể sử dụng giá trị cached/pre-aggregated
- Nút Refresh có sẵn để force tính toán lại
- Loading state hiển thị trong quá trình tính toán

---

## 7. Export Functionality

### Manager Inbox Export
Export các timesheet entry riêng lẻ với các cột:
- Date, Staff Name, Job/Activity, Estimated Hours, Actual Hours, Final Hours, Total Pay, Status

### Overview Export
Export dữ liệu tổng hợp theo staff với các cột:
- Staff Name, Pending Hours, Approved Hours, Declined Hours, Total Hours

---

## Ghi Chú Cho Development Team
- Tất cả tính toán phải xử lý edge case (giá trị null, zero hours, thiếu rate)
- Format currency phải tuân theo locale setting
- Hiển thị hour phải dùng format nhất quán (ví dụ: "24h 30m" hoặc "24.5h")
- Thống kê phải cập nhật mà không cần reload toàn bộ page (dùng JavaScript)
- Cân nhắc thêm trend indicator (↑↓) hiển thị thay đổi so với period trước
