# Hướng dẫn Debug - Vấn đề 401 và số lượng mẫu

## 🔍 Vấn đề cần kiểm tra

### 1. Lỗi 401 - Authentication
**Nguyên nhân có thể:**
- JWT token không được gửi đúng cách
- Token đã hết hạn
- User không có quyền truy cập endpoint

**Cách kiểm tra:**
1. Mở Developer Tools (F12) → Console
2. Kiểm tra localStorage:
   ```javascript
   console.log("Auth Token:", localStorage.getItem('authToken'));
   console.log("User Info:", localStorage.getItem('userInfo'));
   ```
3. Kiểm tra Network tab khi gọi API:
   - Xem request headers có `Authorization: Bearer <token>` không
   - Xem response status code

### 2. Số lượng mẫu không khớp
**Vấn đề:** Có 4 người tham gia nhưng chỉ hiển thị 2 mẫu

**Nguyên nhân có thể:**
- localStorage chưa được clear khi chọn service mới
- Dữ liệu cũ vẫn còn trong localStorage
- State không được reset khi clear localStorage

**Cách kiểm tra:**
1. Mở Console và xem debug logs:
   ```javascript
   // Khi chọn dịch vụ
   console.log("Selected Service:", selectedService);
   console.log("ParticipantTypes:", selectedService.participantsType);
   
   // Khi vào step 3
   console.log("DEBUG - Creating participants and samples:");
   console.log("Required count:", requiredCount);
   console.log("Current participants count:", participants.length);
   
   // Khi submit
   console.log("DEBUG - Submit Data:");
   console.log("Participants count:", participants.length);
   console.log("Samples count:", samples.length);
   ```

2. Kiểm tra localStorage:
   ```javascript
   // Kiểm tra dữ liệu trong localStorage
   console.log("Stored appointment:", localStorage.getItem("appointment"));
   console.log("Stored participants:", localStorage.getItem("participants"));
   console.log("Stored samples:", localStorage.getItem("sample"));
   console.log("Stored caseFile:", localStorage.getItem("caseFile"));
   console.log("Stored payment:", localStorage.getItem("payment"));
   ```

## 🛠️ Các bước debug

### Bước 1: Clear localStorage và kiểm tra Authentication
```javascript
// 1. Clear localStorage
localStorage.clear();
// hoặc clear từng item
localStorage.removeItem("appointment");
localStorage.removeItem("caseFile");
localStorage.removeItem("participants");
localStorage.removeItem("sample");
localStorage.removeItem("payment");

// 2. Kiểm tra authentication
console.log("Auth Token:", localStorage.getItem('authToken'));
console.log("User Info:", localStorage.getItem('userInfo'));
```

### Bước 2: Sử dụng Debug Button
1. **Nhấn nút "Clear Data (Debug)"** ở góc phải trên cùng
2. **Refresh trang** để clear state
3. **Chọn service mới** và xem console logs
4. **Kiểm tra localStorage** sau mỗi bước

### Bước 3: Test lại flow từ đầu
1. **Refresh trang** để clear state
2. **Chọn service mới** và xem console logs
3. **Kiểm tra localStorage** sau mỗi bước
4. **Submit** và xem debug logs

### Bước 4: Kiểm tra Service Data
```javascript
// Trong console browser
// 1. Chọn dịch vụ và xem data
console.log("Service ID:", appointment.serviceId);
console.log("Selected Service:", selectedService);
console.log("ParticipantTypes:", selectedService.participantsType);

// 2. Kiểm tra số lượng
console.log("Expected participants:", selectedService.participantsType.length);
console.log("Actual participants:", participants.length);
console.log("Actual samples:", samples.length);
```

### Bước 5: Kiểm tra Database
```sql
-- Kiểm tra service có bao nhiêu participant types
SELECT s.service_name, COUNT(pt.participant_id) as participant_count
FROM service s
LEFT JOIN service_participant_type spt ON s.service_id = spt.service_id
LEFT JOIN participant_type pt ON spt.participant_id = pt.participant_id
WHERE s.service_id = 7
GROUP BY s.service_id, s.service_name;

-- Kiểm tra participant types của service
SELECT pt.participant_name, pt.participant_id
FROM service s
JOIN service_participant_type spt ON s.service_id = spt.service_id
JOIN participant_type pt ON spt.participant_id = pt.participant_id
WHERE s.service_id = 7;
```

## 🔧 Giải pháp đã thực hiện

### 1. Clear localStorage và state khi chọn service mới
```javascript
const handleServiceChange = (e) => {
  setAppointment({ ...appointment, serviceId: e.target.value });
  setCaseFile({ ...caseFile, serviceId: e.target.value });
  
  // Clear localStorage và state khi chọn service mới
  clearLocalStorage();
  
  console.log("DEBUG - Service changed, cleared localStorage and state");
};
```

### 2. Clear localStorage và state khi component mount
```javascript
const clearLocalStorage = () => {
  localStorage.removeItem("appointment");
  localStorage.removeItem("caseFile");
  localStorage.removeItem("participants");
  localStorage.removeItem("sample");
  localStorage.removeItem("payment");
  
  // Clear tất cả state cũ
  setParticipants([{
    name: '',
    citizenId: '',
    address: '',
    birthDate: '',
    participantType: '',
  }]);
  setSamples([]);
  
  console.log("DEBUG - localStorage and state cleared");
};
```

### 3. Debug button để clear data
```javascript
<button onClick={clearLocalStorage}>
  Clear Data (Debug)
</button>
```

### 4. Debug logging chi tiết
```javascript
// Trước khi lưu
console.log("DEBUG - Before saving to localStorage:");
console.log("Participants:", participants);
console.log("Samples:", filteredSamples);

// Kiểm tra localStorage trước khi lưu
console.log("DEBUG - localStorage before saving:");
console.log("Existing appointment:", localStorage.getItem("appointment"));
console.log("Existing participants:", localStorage.getItem("participants"));
console.log("Existing samples:", localStorage.getItem("sample"));

// Sau khi lưu
console.log("DEBUG - After saving to localStorage:");
console.log("Stored participants:", localStorage.getItem("participants"));
console.log("Stored samples:", localStorage.getItem("sample"));
```

## 📋 Checklist Debug

- [ ] **localStorage đã được clear** khi chọn service mới
- [ ] **State đã được reset** khi clear localStorage
- [ ] **Debug button** hoạt động
- [ ] JWT token tồn tại trong localStorage
- [ ] Token chưa hết hạn
- [ ] User có role CUSTOMER
- [ ] Service có đúng số lượng participant types
- [ ] Frontend tạo đúng số lượng participants
- [ ] Frontend tạo đúng số lượng samples
- [ ] API request có Authorization header
- [ ] Backend nhận được đúng dữ liệu

## 🚨 Lưu ý quan trọng

1. **localStorage persistence** - Dữ liệu cũ có thể tồn tại từ lần test trước
2. **State persistence** - State cũ có thể không được reset khi clear localStorage
3. **Service ID 7** có thể có 4 participant types nhưng API chỉ trả về 2
4. **Authentication** có thể bị lỗi do token format hoặc expiration
5. **Frontend logic** có thể không sync với backend data

## 🎯 Các bước test mới

1. **Nhấn nút "Clear Data (Debug)"** hoặc **Refresh trang**
2. **Chọn service mới** và xem console logs
3. **Kiểm tra số lượng participants và samples**
4. **Submit** và xem debug logs
5. **Kiểm tra localStorage** sau khi submit
6. **So sánh dữ liệu hiển thị** với dữ liệu trong localStorage

## 🔧 Cách sử dụng Debug Button

1. **Nhấn nút "Clear Data (Debug)"** ở góc phải trên cùng
2. **Xem console logs** để confirm data đã được clear
3. **Bắt đầu lại flow** từ đầu
4. **Kiểm tra** không còn dữ liệu cũ

Hãy chạy các bước debug trên và cung cấp kết quả để tôi có thể hỗ trợ cụ thể hơn! 