# HƯỚNG DẪN CHỌN NGÀY THÁNG - QUẢN LÝ DÒNG TIỀN

## 🎯 Các tính năng chọn ngày tháng

### 1. **Quick Time Range Selector** (Dropdown nhanh)
- **Vị trí**: Dropdown bên trái RangePicker
- **Mục đích**: Chọn nhanh các khoảng thời gian phổ biến
- **Các tùy chọn**:
  - `Tháng hiện tại`: Dữ liệu tháng đang diễn ra
  - `Tháng trước`: Dữ liệu tháng vừa qua
  - `3 tháng gần đây`: Dữ liệu 3 tháng gần nhất
  - `6 tháng gần đây`: Dữ liệu 6 tháng gần nhất
  - `Năm hiện tại`: Dữ liệu từ đầu năm đến nay
  - `Năm trước`: Dữ liệu toàn bộ năm trước

### 2. **Custom Date Range Picker** (Chọn tùy chỉnh)
- **Vị trí**: RangePicker bên phải dropdown
- **Mục đích**: Chọn khoảng thời gian tùy ý
- **Tính năng**:
  - Chọn theo tháng (picker="month")
  - Có thể xóa lựa chọn (allowClear)
  - Placeholder hướng dẫn: "Từ tháng" và "Đến tháng"

### 3. **Date Range Display** (Hiển thị khoảng thời gian)
- **Vị trí**: Dưới header, trên các thống kê
- **Mục đích**: Hiển thị rõ ràng khoảng thời gian đang xem
- **Format**: "Đang xem dữ liệu từ: MM/YYYY đến: MM/YYYY"

## 🔧 Cách hoạt động

### **Quick Time Range Selector:**
```javascript
const getDateRangeByTimeRange = (range) => {
  const now = dayjs();
  switch (range) {
    case 'current_month':
      return [now.startOf('month'), now.endOf('month')];
    case 'last_month':
      return [now.subtract(1, 'month').startOf('month'), now.subtract(1, 'month').endOf('month')];
    // ... các case khác
  }
};
```

### **Custom Date Range:**
```javascript
const handleDateRangeChange = (dates) => {
  setDateRange(dates);
  if (dates && dates.length === 2) {
    const [start, end] = dates;
    loadRevenueData(start.toDate(), end.toDate());
  }
};
```

### **Data Filtering:**
```javascript
const filteredData = useMemo(() => {
  if (!dateRange || dateRange.length !== 2) return revenueData.monthlyData;
  
  const [start, end] = dateRange;
  return revenueData.monthlyData.filter(d => {
    const dMonth = dayjs(`${d.year}-${d.month.toString().padStart(2, '0')}-01`);
    return dMonth.isSameOrAfter(start, 'month') && dMonth.isSameOrBefore(end, 'month');
  });
}, [dateRange, revenueData]);
```

## 📊 Dữ liệu được hiển thị theo ngày tháng

### **1. Thống kê tổng quan:**
- Tổng doanh thu trong khoảng thời gian
- Số lượng hồ sơ trong khoảng thời gian
- Doanh thu trung bình/hồ sơ
- Tăng trưởng so với khoảng thời gian trước

### **2. Biểu đồ doanh thu:**
- Hiển thị doanh thu theo từng tháng
- Chỉ hiển thị các tháng trong khoảng thời gian chọn
- Tooltip hiển thị chi tiết doanh thu từng tháng

### **3. Thống kê theo dịch vụ:**
- Doanh thu từng dịch vụ trong khoảng thời gian
- Số lượng hồ sơ từng dịch vụ

## 🎨 UI/UX Features

### **Visual Indicators:**
- Icon calendar bên cạnh khoảng thời gian
- Background màu xám nhạt cho thông tin khoảng thời gian
- Format ngày tháng rõ ràng: MM/YYYY

### **Responsive Design:**
- Dropdown và RangePicker responsive trên mobile
- Layout tự động wrap khi màn hình nhỏ
- Gap 12px giữa các elements

### **User Experience:**
- Mặc định hiển thị tháng hiện tại
- Có thể xóa lựa chọn để xem tất cả dữ liệu
- Loading state khi thay đổi khoảng thời gian
- Error handling nếu không có dữ liệu

## 🚀 Cách sử dụng

### **Bước 1: Chọn khoảng thời gian nhanh**
1. Click vào dropdown "Chọn khoảng thời gian"
2. Chọn một trong các tùy chọn có sẵn
3. Dữ liệu sẽ tự động load và hiển thị

### **Bước 2: Chọn khoảng thời gian tùy chỉnh**
1. Click vào RangePicker
2. Chọn tháng bắt đầu và tháng kết thúc
3. Dữ liệu sẽ load theo khoảng thời gian đã chọn

### **Bước 3: Xem thông tin khoảng thời gian**
- Thông tin hiển thị rõ ràng dưới header
- Format: "Đang xem dữ liệu từ: MM/YYYY đến: MM/YYYY"

## ⚠️ Lưu ý quan trọng

### **1. Dayjs Configuration:**
```javascript
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
```

### **2. Data Format:**
- Backend trả về dữ liệu theo format: `{year: 2024, month: 5, revenue: 5000000}`
- Frontend convert thành dayjs object để so sánh
- Format hiển thị: MM/YYYY

### **3. Error Handling:**
- Kiểm tra null/undefined trước khi sử dụng
- Fallback về dữ liệu mẫu nếu API lỗi
- Loading state để tránh UI freeze

## 🎯 Kết quả mong đợi

Sau khi implement, người dùng có thể:
- ✅ Chọn nhanh các khoảng thời gian phổ biến
- ✅ Chọn tùy chỉnh khoảng thời gian bất kỳ
- ✅ Xem rõ ràng khoảng thời gian đang xem
- ✅ Dữ liệu được filter chính xác theo thời gian
- ✅ UI responsive và user-friendly
- ✅ Không còn lỗi dayjs.isSameOrAfter 