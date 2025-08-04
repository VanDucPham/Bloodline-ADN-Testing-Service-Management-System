# Tính năng Form Participant Động

## Mô tả
Tính năng này cho phép form điền participant hiển thị động dựa trên các loại người tham gia (participantType) được định nghĩa trong dịch vụ (Service).

## Cách hoạt động

### 1. Cấu trúc dữ liệu
- **Service** có field `participantsType` (List<ParticipantType>)
- **ParticipantType** có field `participantName` (ví dụ: "bà", "cháu", "cha", "con")

### 2. Logic hiển thị form
- Nếu service có `participantsType`:
  - Form sẽ hiển thị đúng số lượng ô input tương ứng với số participantType
  - Mỗi ô input sẽ có field "Quan hệ" được điền sẵn và readonly
  - Không cho phép thêm/xóa ô input
  - Hiển thị thông báo về yêu cầu người tham gia

- Nếu service không có `participantsType`:
  - Form hiển thị 1 ô input mặc định
  - Cho phép thêm/xóa ô input tự do
  - Field "Quan hệ" có thể chỉnh sửa

### 3. Ví dụ
**Service: "Xét nghiệm ADN bà cháu"**
- `participantsType`: ["bà", "cháu"]
- Form sẽ hiển thị 2 ô input:
  - Ô 1: Quan hệ = "bà" (readonly)
  - Ô 2: Quan hệ = "cháu" (readonly)

## Các thay đổi đã thực hiện

### 1. ParticipantModal.jsx
- Thêm prop `service` để nhận thông tin service
- Thêm logic khởi tạo form dựa trên `service.participantsType`
- Cập nhật UI để hiển thị thông báo và disable các nút thêm/xóa khi cần
- Thêm CSS cho input readonly

### 2. StaffAppointments.jsx
- Cập nhật `handleShowParticipants` để lấy thông tin service
- Truyền prop `service` vào `ParticipantModal`

### 3. StaffAppointments.css
- Thêm CSS cho form participant
- Thêm style cho input readonly

## API Endpoints
- `GET /api/staff/service/{id}` - Lấy thông tin service với participantType
- Trả về `ServiceManagerDTO` với field `participantsType`

## Cách test
1. Sử dụng file `ParticipantModalDemo.jsx` để test
2. Tạo service với participantType trong database
3. Test với appointment có service có/không có participantType

## Lưu ý
- Field "Quan hệ" sẽ được tự động điền và readonly khi có participantType
- Số lượng ô input sẽ khớp với số participantType
- Form vẫn validate đầy đủ thông tin trước khi submit 