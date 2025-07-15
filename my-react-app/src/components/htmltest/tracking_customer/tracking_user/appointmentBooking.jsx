import React, { useEffect, useState } from 'react';
import './appointmentBooking.css';
import apiService from '../../../../service/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllowedAreas } from '../../../../service/adminService';
import { Form, Input, Select, message } from 'antd';

function AppointmentBooking() {
  const [step, setStep] = useState(1);
  const [validateMessage, setValidateMessage] = useState('');
  const [minDate, setMinDate] = useState("");
  const [today, setToday] = useState("");
  const [addressForm] = Form.useForm();
  const [allowedAreas, setAllowedAreas] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);


  const usedata = localStorage.getItem('userInfo');
  const user = usedata ? JSON.parse(usedata) : null;

  const [appointment, setAppointment] = useState({
    userId: '',
    serviceId: '',
    appointmentType: '',
    appointmentDate: '',
    appointmentTime: '',
    deliveryMethod: '',
    appointmentNote: '',
    collectionAddress: '',
    paymentMethod: '',
  });

  const [timeSlot, setTimeSlot] = useState([{
    id: '',
    startTime: '',
    endTime: '',
    maxAppointment: ''
  }]);

  const [participants, setParticipants] = useState([{
    name: '',
    relationship: '',
    citizenId: '',
    address: '',
    birthDate: '',
    gender: '',
  }]);

  const [samples, setSamples] = useState([
    { participantCitizenId: '', sampleType: '' },
  ]);

  const [caseFile, setCaseFile] = useState({
    userId: '',
    caseCode: '',
    limit_people : '',
    caseType: '',
    serviceId: '',
    status: 'ARCHIVED'
  });

  const [service, setService] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Khi mount, nếu có state serviceId truyền sang thì tự động set
  useEffect(() => {
    if (location.state && location.state.serviceId) {
      setAppointment(prev => ({ ...prev, serviceId: location.state.serviceId }));
      setCaseFile(prev => ({ ...prev, serviceId: location.state.serviceId }));
    }
  }, [location.state]);

  // Format price to VND
  const formatVND = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Fetch Service API
  useEffect(() => {
    const fetchService = async () => {
      try {
        const userData = localStorage.getItem("userInfo");
        const userItem = userData ? JSON.parse(userData) : null;

        if (userItem?.user_Id) {
          setAppointment(prev => ({
            ...prev,
            userId: userItem.user_Id
          }));
        }

        const response = await apiService.user.getService();
        const timeSlot = await apiService.user.getTimeSlot();
        console.log(response)
        setTimeSlot(timeSlot);
        setService(response);
      } catch (error) {
        console.log("Không thể tải các dịch vụ lên được", error);
      }

      const now = new Date();
      now.setDate(now.getDate() + 1);
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      setMinDate(`${yyyy}-${mm}-${dd}`);

      // Set today's date for birthDate validation
      const todayDate = new Date();
      const tyyyy = todayDate.getFullYear();
      const tmm = String(todayDate.getMonth() + 1).padStart(2, "0");
      const tdd = String(todayDate.getDate()).padStart(2, "0");
      setToday(`${tyyyy}-${tmm}-${tdd}`);
    };
    fetchService();
  }, []);

  useEffect(() => {
    // Fetch allowed areas for address dropdowns
    const fetchAllowedAreas = async () => {
      setAddressLoading(true);
      try {
        const data = await getAllowedAreas();
        setAllowedAreas(data);
        // Lấy danh sách tỉnh/thành phố duy nhất
        const cities = Array.from(new Set(data.map(a => a.city)));
        setCityOptions(cities);
      } catch  {
        message.error('Không thể tải danh sách khu vực lấy mẫu!');
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAllowedAreas();
  }, []);

  // Khi chọn tỉnh/thành phố, lọc quận/huyện tương ứng
  const handleCityChange = (city) => {
    addressForm.setFieldsValue({ district: undefined });
    const districts = allowedAreas.filter(a => a.city === city).map(a => a.district);
    setDistrictOptions(Array.from(new Set(districts)));
  };


  const checkAvailability = async () => {
    try {
      const response = await apiService.user.checkAvailability({
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime
      });
      if (response === "Lịch trống.") {
        return true;
      } else {
        setValidateMessage(response);
        return false;
      }
    } catch {
      setValidateMessage("Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
      return false;
    }
  };

  const handleInputChange = (e) => {
    setCaseFile({ ...caseFile, caseType: e.target.value });
    setAppointment({ ...appointment, appointmentType: e.target.value });
  };

  const handleServiceChange = (e) => {
    setAppointment({ ...appointment, serviceId: e.target.value });
    setCaseFile({ ...caseFile, serviceId: e.target.value });
  };

  const handleDateChange = (e) => {
    setAppointment({ ...appointment, appointmentDate: e.target.value });
  };

  const handleTimeChange = (startTime) => {
    setSelectedTime(startTime);
    setAppointment({ ...appointment, appointmentTime: startTime });
  };

  const handleDeliveryChange = (e) => {
    setAppointment({ ...appointment, deliveryMethod: e.target.value });
  };

  const handleParticipantChange = (index, e) => {
    const updated = [...participants];
    updated[index][e.target.name] = e.target.value;
    setParticipants(updated);
  };

  const addParticipant = () => {
    const newParticipant = {
      name: '',
      relationship: '',
      citizenId: '',
      address: '',
      birthDate: '',
      gender: ''
    };
    setParticipants(prev => [...prev, newParticipant]);
    setSamples(prev => [...prev, { participantCitizenId: '', sampleType: '' }]);
  };

  const removeParticipant = (index) => {
    const updatedParticipants = participants.filter((_, i) => i !== index);
    setParticipants(updatedParticipants);
    const updatedSamples = samples.filter((_, i) => i !== index);
    setSamples(updatedSamples);
  };

  const handleSampleChange = (index, e) => {
    const updated = [...samples];
    const { name, value } = e.target;
    updated[index][name] = value;
    if (name === 'participantCitizenId') {
      const matched = participants.find(p => p.citizenId.trim() === value);
      updated[index]['participantName'] = matched?.name || '';
    }
    setSamples(updated);
  };

  const handlePaymentMethodChange = (e) => {
    setAppointment({ ...appointment, paymentMethod: e.target.value });
  };

  const handleSubmit = async () => {
    const updateAppointment = {
      ...appointment, userId: user?.user_Id
    };
    const updatedCaseFile = {
      ...caseFile,
      userId: user?.user_Id
    };

    try {
      if (appointment.deliveryMethod === 'HOME_COLLECTION') {
        try {
          const values = await addressForm.validateFields();
          // Gọi API kiểm tra khu vực hợp lệ
          const token = localStorage.getItem('authToken');
          const res = await fetch(`/api/areas/check?city=${encodeURIComponent(values.city)}&district=${encodeURIComponent(values.district)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const isAllowed = await res.json();
          if (!isAllowed) {
            message.error('Khu vực này chưa hỗ trợ lấy mẫu tại nhà. Vui lòng chọn khu vực khác!');
            return;
          }
          // Lưu địa chỉ vào appointment
          setAppointment(prev => ({
            ...prev,
            collectionAddress: values.addressDetail,
            collectionCity: values.city,
            collectionDistrict: values.district
          }));
        } catch  {
          // Nếu validate lỗi thì không submit
          return;
        }
      }

      const filteredSamples = samples.filter(s =>
        s.participantCitizenId?.trim() !== '' && s.sampleType?.trim() !== ''
      );

      const payLoad = {
        appointment: updateAppointment,
        participants: participants,
        samples: filteredSamples,
        caseFile: updatedCaseFile
      };

      // Nếu chọn VNPay
      if (appointment.paymentMethod === "vnpay") {
        const paymentRequest = {
          amount: selectedService.servicePrice, // số tiền
          orderInfo: `Thanh toán dịch vụ ${selectedService.serviceName}`,
          txnRef: "ORDER" + Date.now(), // mã đơn hàng duy nhất
          bankCode: "", // hoặc để trống
        };
        const res = await apiService.user.creatPaymentVnPay(paymentRequest);
        if (res) {
          window.location.href = res; // redirect đến trang thanh toán
        }
      } else {
        // Các phương thức khác
        await apiService.user.create_app(payLoad)
          .then(() => {
            alert("Lịch hẹn được đặt thành công!");
            navigate("/tracking_user");
          })
          .catch((error) => {
            // Hiển thị thông báo lỗi trả về từ backend
            setValidateMessage(error.message || "Đặt lịch thất bại, vui lòng đặt lại");
          });
      }
    } catch (error) {
      setValidateMessage(error.message || "Đặt lịch thất bại, vui lòng đặt lại");
    }
  };


  const nextStep = async () => {
    console.log('nextStep được gọi, step:', step, 'deliveryMethod:', appointment.deliveryMethod);
    if (step === 1 && !caseFile.caseType) {
      setValidateMessage('Vui lòng chọn loại hồ sơ.');
      return;
    }
 if (step === 2) {
  if (!appointment.serviceId) {
    setValidateMessage("Vui lòng chọn dịch vụ.");
    return;
  }

  if (
    appointment.deliveryMethod === "SELF_DROP_OFF" &&
    (!appointment.appointmentDate || !appointment.appointmentTime)
  ) {
    setValidateMessage("Vui lòng chọn ngày giờ hẹn khi đến cơ sở.");
    return;
  }

  // ... thêm các điều kiện riêng nếu cần
}

    if (appointment.deliveryMethod === 'HOME_COLLECTION' && caseFile.caseType === 'ADMINISTRATIVE') {
      setValidateMessage('Thủ tục hành chính chỉ được lấy mẫu tại cơ sở.');
      return;
    }
    if (step === 2 && appointment.deliveryMethod ==="SELF_DROP_OFF") {
      const available = await checkAvailability();
      if (!available) {
        setValidateMessage('Khung giờ này đã đầy, vui lòng chọn thời gian khác.');
        return;
      }
    }
    if (step === 3 && participants.some(p => !p.name || !p.birthDate || !p.gender || !p.relationship)) {
      setValidateMessage('Vui lòng nhập đầy đủ thông tin người tham gia.');
      return;
    }
    if (step === 3 && participants.some(p => p.birthDate > today)) {
      setValidateMessage('Ngày sinh không được lớn hơn ngày hiện tại.');
      return;
    }
    if (
      step === 4 &&
      (appointment.deliveryMethod === "HOME_COLLECTION" || appointment.deliveryMethod === "HOME_DELIVERY")
    ) {
      if (samples.some(s => !s.participantCitizenId || !s.sampleType)) {
        setValidateMessage('Vui lòng nhập đầy đủ thông tin mẫu xét nghiệm.');
        return;
      }
    }
    if (step === 6 && !appointment.paymentMethod) {
      setValidateMessage('Vui lòng chọn phương thức thanh toán.');
      return;
    }
    setValidateMessage('');
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const selectedService = service.find(s => s.serviceId === parseInt(appointment.serviceId));
  useEffect(() => {
  if (step === 3 && selectedService?.limitPeople) {
    const requiredCount = selectedService.limitPeople;

    // Nếu số người hiện tại nhỏ hơn thì thêm vào
    if (participants.length < requiredCount) {
      const diff = requiredCount - participants.length;
      const additional = Array.from({ length: diff }, () => ({
        name: '',
        relationship: '',
        citizenId: '',
        address: '',
        birthDate: '',
        gender: '',
      }));
      setParticipants(prev => [...prev, ...additional]);
      setSamples(prev => [...prev, ...Array.from({ length: diff }, () => ({ participantCitizenId: '', sampleType: '' }))]);
    }

    // Nếu nhiều hơn thì cắt bớt
    if (participants.length > requiredCount) {
      setParticipants(prev => prev.slice(0, requiredCount));
      setSamples(prev => prev.slice(0, requiredCount));
    }
  }
}, [step, selectedService, participants.length]);
  return (
    <div>
      <header>
        <h1>Đặt lịch hẹn xét nghiệm ADN</h1>
      </header>
      <div className="step-container">
        <div className="step-nav">
          {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`step ${stepNumber === step ? 'active' : stepNumber < step ? 'completed' : ''}`}
              data-step={stepNumber}
            >
              <span className="step-number">{stepNumber}</span>.{' '}
              {['Chọn loại hồ sơ', 'Thông tin dịch vụ', 'Người tham gia', 'Mẫu xét nghiệm', 'Xác nhận', 'Thanh toán'][stepNumber - 1]}
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(step - 1) * 20}%` }}></div>
        </div>
      </div>
      <div className="container">
        <div className="form-container">
          {validateMessage && <div className="validate-message">{validateMessage}</div>}
          {step === 1 && (
            <div className="form-section">
              <h2>1. Chọn loại hồ sơ</h2>
              <label>Loại hồ sơ:</label>
              <select value={caseFile.caseType} onChange={handleInputChange}>
                <option value="">-- Chọn loại hồ sơ --</option>
                <option value="ADMINISTRATIVE">Hành chính</option>
                <option value="CIVIL">Dân sự</option>
              </select>
              <div className="form-actions">
                <button onClick={nextStep}>Tiếp theo</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="form-section">
              <h2>2. Thông tin dịch vụ</h2>
              <div className="row">
                <div>
                  <label>Chọn dịch vụ:</label>
                  <select value={appointment.serviceId} onChange={handleServiceChange}>
                    <option value="">-- Chọn dịch vụ --</option>
                    {service.map(service => (
                      <option key={service.serviceId} value={service.serviceId}>{service.serviceName}</option>
                    ))}
                  </select>
                </div>
              </div>
             
              <label>Hình thức lấy mẫu:</label>
              <select value={appointment.deliveryMethod} onChange={handleDeliveryChange}>
                <option value="">-- Chọn hình thức --</option>
                <option value="SELF_DROP_OFF">Tại cơ sở</option>
                <option
                  value="HOME_COLLECTION"
                  disabled={caseFile.caseType === 'ADMINISTRATIVE'}
                >
                  Tại nhà
                </option>
                <option
                  value="HOME_DELIVERY"
                  disabled={caseFile.caseType === 'ADMINISTRATIVE'}
                >
                  Nhân viên đến lấy tận nhà
                </option>
              </select>
                { appointment.deliveryMethod ==="SELF_DROP_OFF" && (
                    <><label>Chọn ngày hẹn:</label>
              <input type="date" value={appointment.appointmentDate} min={minDate} onChange={handleDateChange} />
              <div className="grid grid-cols-2 gap-3">
                {timeSlot.map((slot) => (
                  <button
                    key={slot.startTime}
                    onClick={() => handleTimeChange(slot.startTime)}
                    type="button"
                    className={`border rounded-lg p-2 transition duration-200 text-center ${selectedTime === slot.startTime
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'bg-white hover:bg-blue-100'
                      }`}
                  >
                    {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                  </button>
                ))}
              </div></>
                          

                )}
             
              <div className="form-actions">
                <button onClick={prevStep}>Quay lại</button>
                <button onClick={nextStep}>Tiếp theo</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="form-section">
              <h2>3. Người tham gia</h2>
              <p>Vui lòng nhập thông tin cho <strong>{selectedService?.limitPeople}</strong> người tham gia.</p>

              {participants.map((participant, index) => (
                <div key={index} className="participant">
                  <label>Họ tên:</label>
                  <input type="text" name="name" placeholder="Nhập họ tên" value={participant.name} onChange={(e) => handleParticipantChange(index, e)} />
                  <label>Ngày sinh:</label>
                  <input type="date" name="birthDate" value={participant.birthDate} max={today} onChange={(e) => handleParticipantChange(index, e)} />
                  <label>Căn cước công dân :</label>
                  <input name="citizenId" value={participant.citizenId} onChange={(e) => handleParticipantChange(index, e)} />
                  <label>Giới tính:</label>
                  <select name="gender" value={participant.gender} onChange={(e) => handleParticipantChange(index, e)}>
                    <option value="">-- Chọn giới tính --</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                  <label>Quan hệ:</label>
                  <input type="text" name="relationship" placeholder="Cha, con, mẹ..." value={participant.relationship} onChange={(e) => handleParticipantChange(index, e)} />
                  {index === participants.length - 1 && participants.length < selectedService?.limitPeople && (
  <button className="btn-add" onClick={addParticipant}>+ Thêm người</button>
)}

                  <button
                    className="btn-remove"
                    onClick={() => removeParticipant(index)}
                    style={{ color: 'white', background: '#e57373', marginLeft: '10px' }}
                    disabled={participants.length <= 1}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              ))}
              <div className="form-actions">
                <button onClick={prevStep}>Quay lại</button>
                <button onClick={nextStep}>Tiếp theo</button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="form-section">
              <h2>4. Mẫu xét nghiệm</h2>
              {appointment?.deliveryMethod === "SELF_DROP_OFF" && (
                <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '5px', border: '1px solid #ffeeba' }}>
                  <strong>Lưu ý:</strong> Vui lòng đến cơ sở để lấy mẫu và đem đầy đủ giấy tờ cần thiết.
                </div>
              )}
              {appointment?.deliveryMethod === "HOME_DELIVERY" && (
                <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, boxShadow: '0 2px 8px #eee' }}>
                  <h3>Địa chỉ lấy mẫu tại nhà</h3>
                  <Form
                    form={addressForm}
                    layout="vertical"
                    style={{ maxWidth: 900 }}
                    initialValues={{ city: undefined, district: undefined }}
                  >
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <Form.Item name="addressDetail" label="Số nhà, đường, xã/phường..." rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]} style={{ flex: 2, minWidth: 220, marginBottom: 0 }}>
                        <Input placeholder="Nhập số nhà, đường, xã/phường..." />
                      </Form.Item>
                      <Form.Item name="city" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]} style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                        <Select
                          showSearch
                          placeholder="Chọn tỉnh/thành phố"
                          loading={addressLoading}
                          onChange={handleCityChange}
                          filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                        >
                          {cityOptions.map(city => (
                            <Select.Option key={city} value={city}>{city}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]} style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
                        <Select
                          showSearch
                          placeholder="Chọn quận/huyện"
                          loading={addressLoading}
                          disabled={!addressForm.getFieldValue('city')}
                          filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                        >
                          {districtOptions.map(district => (
                            <Select.Option key={district} value={district}>{district}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </Form>
                </div>
              )}
              {samples.map((sample, index) => {
                const participant = participants.find(p => p.citizenId === sample.participantCitizenId);
                return (
                  <div key={index} className="sample-info">
                    <label>Mẫu số {index + 1} của ai:</label>
                    <select
                      name="participantCitizenId"
                      value={sample.participantCitizenId}
                      onChange={(e) => handleSampleChange(index, e)}
                    >
                      <option value="">-- Chọn người tham gia --</option>
                      {participants.map((p, idx) => (
                        <option key={idx} value={p.citizenId}>
                          {p.name} - {p.citizenId}
                        </option>
                      ))}
                    </select>
                    {participant && (
                      <div
                        className="participant-details"
                        style={{
                          marginTop: '10px',
                          padding: '10px',
                          background: '#f9f9f9',
                          borderRadius: '5px',
                        }}
                      >
                        <p><strong>Họ tên:</strong> {participant.name}</p>
                        <p><strong>Ngày sinh:</strong> {participant.birthDate}</p>
                        <p><strong>Giới tính:</strong> {participant.gender}</p>
                      </div>
                    )}
                    <label>Loại mẫu:</label>
                    <select
                      name="sampleType"
                      value={sample.sampleType || ''}
                      onChange={(e) => handleSampleChange(index, e)}
                    >
                      <option value="">-- Chọn loại mẫu --</option>
                      <option value="BLOOD">Máu</option>
                      <option value="HAIR">Tóc</option>
                      <option value="SALIVA">Niêm mạc</option>
                    </select>
                  </div>
                );
              })}
              <div className="form-actions">
                <button onClick={prevStep}>Quay lại</button>
                <button onClick={nextStep}>Tiếp theo</button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="form-section">
              <h2>5. Xác nhận thông tin</h2>
              <div className="confirmation-card">
                <p><strong>Loại hồ sơ:</strong> {caseFile.caseType}</p>
                <p><strong>Dịch vụ:</strong> {selectedService ? selectedService.serviceName : ''}</p>
                <p><strong>Lịch hẹn:</strong> {appointment.appointmentDate}, {appointment.appointmentTime}</p>
                <p><strong>Người tham gia:</strong> {participants.map(p => p.name).join(', ')}</p>
                <p><strong>Loại mẫu:</strong> {samples.map(s => s.participantName ? `${s.participantName} (${s.sampleType})` : s.sampleType).join(', ')}</p>
                <p><strong>Hình thức lấy mẫu:</strong> {appointment.deliveryMethod}</p>
              </div>
              <div className="form-actions">
                <button onClick={prevStep}>Quay lại</button>
                <button onClick={nextStep}>Tiếp theo</button>
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="form-section">
              <h2>6. Thanh toán</h2>
              <div className="summary">
                <p><strong>Dịch vụ:</strong> {selectedService ? selectedService.serviceName : ''} ({caseFile.caseType === 'ADMINISTRATIVE' ? 'Hành chính' : 'Dân sự'})</p>
                <p><strong>Số người tham gia:</strong> {participants.length}</p>
                <p><strong>Loại mẫu:</strong> {samples.map(s => s.sampleType).join(', ')}</p>
                <p><strong>Ngày hẹn:</strong> {appointment.appointmentDate}</p>
                <p><strong>Tổng chi phí:</strong> <span className="price">{selectedService ? formatVND(selectedService.servicePrice) : ''}</span></p>
              </div>
              <label>Phương thức thanh toán:</label>
              <select value={appointment.paymentMethod} onChange={handlePaymentMethodChange}>
                <option value="">-- Chọn phương thức --</option>
                <option value="vnpay">VNPay</option>
                <option value="momo">Momo</option>
                <option value="bank">Chuyển khoản ngân hàng</option>
                <option value="offline">Thanh toán tại cơ sở</option>
              </select>
              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button onClick={prevStep}>Quay lại</button>
                <button className="btn-primary" onClick={handleSubmit}>Xác nhận thanh toán</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentBooking;
