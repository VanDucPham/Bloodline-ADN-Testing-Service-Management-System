import React, { useEffect, useState } from 'react';
import './appointmentBooking.css';
import apiService from '../../../../service/api';
import {  useLocation } from 'react-router-dom';

import { Form, Input, Select, message, Tooltip, Spin } from 'antd';
import { InfoCircleOutlined, LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';

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
  const [loadingService, setLoadingService] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);

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

  // Cập nhật cấu trúc participants để bao gồm participantType
  const [participants, setParticipants] = useState([{
    name: '',
    citizenId: '',
    address: '',
    birthDate: '',
    participantType: '', // Thêm participantType
  }]);

  // Cập nhật cấu trúc samples để tự động điền
  const [samples, setSamples] = useState([]);

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

  const location = useLocation();

  // Function để clear localStorage
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

  // Khi mount, clear localStorage và set serviceId nếu có
  useEffect(() => {
    clearLocalStorage();
    
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
      setLoadingService(true);
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
        console.log("API Response:", response); // Debug logging
        const timeSlot = await apiService.user.getTimeSlot();
        setTimeSlot(timeSlot);
        setService(response);
      } catch (error) {
        message.error("Không thể tải các dịch vụ lên được");
      } finally {
        setLoadingService(false);
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
      setLoadingAreas(true);
      try {
        const data = await apiService.user.getAllowedAreas();
        setAllowedAreas(data);
        // Lấy danh sách tỉnh/thành phố duy nhất
        const cities = Array.from(new Set(data.map(a => a.city)));
        setCityOptions(cities);
      } catch  {
        message.error('Không thể tải danh sách khu vực lấy mẫu!');
      } finally {
        setLoadingAreas(false);
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
    
    // Clear localStorage và state khi chọn service mới
    clearLocalStorage();
    
    console.log("DEBUG - Service changed, cleared localStorage and state");
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
    
    // Tự động cập nhật sample khi CCCD thay đổi
    if (e.target.name === 'citizenId') {
      updateSampleForParticipant(index, e.target.value);
    }
  };

  // Validate CCCD không được trùng
  const validateCitizenId = (citizenId, currentIndex) => {
    if (!citizenId) return true; // Cho phép trống trong quá trình nhập
    const duplicates = participants.filter((p, idx) => 
      idx !== currentIndex && p.citizenId === citizenId
    );
    return duplicates.length === 0;
  };

  // Tự động điền loại mẫu dựa trên participantType
  const getDefaultSampleType = (participantType) => {
    const sampleTypeMap = {
      'CHA': 'BLOOD',
      'ME': 'BLOOD', 
      'CON': 'BLOOD',
      'ANH_EM': 'BLOOD',
      'CHI_EM': 'BLOOD',
      'ONG': 'BLOOD',
      'BA': 'BLOOD',
      'CHU': 'BLOOD',
      'CO': 'BLOOD',
      'CAU': 'BLOOD',
      'MO': 'BLOOD',
      'DI': 'BLOOD',
      'BAC': 'BLOOD',
      'CHAU': 'BLOOD',
      'Father': 'BLOOD',
      'Child': 'BLOOD',
      'Mother': 'BLOOD',
      'Son': 'BLOOD',
      'Daughter': 'BLOOD'
    };
    return sampleTypeMap[participantType] || 'BLOOD';
  };

  // Xử lý thay đổi loại mẫu
  const handleSampleTypeChange = (sampleIndex, sampleType) => {
    const updatedSamples = [...samples];
    updatedSamples[sampleIndex].sampleType = sampleType;
    setSamples(updatedSamples);
  };

  // Cập nhật participantType và tự động điền sample
  const handleParticipantTypeChange = (index, participantType) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index].participantType = participantType;
    setParticipants(updatedParticipants);

    // Tự động cập nhật sample tương ứng
    const updatedSamples = [...samples];
    const participant = updatedParticipants[index];
    const sampleIndex = updatedSamples.findIndex(s => s.participantCitizenId === participant.citizenId);
    
    if (sampleIndex !== -1) {
      updatedSamples[sampleIndex].participantType = participantType;
      updatedSamples[sampleIndex].sampleType = getDefaultSampleType(participantType);
    }
    setSamples(updatedSamples);
  };

  const addParticipant = () => {
    const newParticipant = {
      name: '',
      citizenId: '',
      address: '',
      birthDate: '',
      participantType: ''
    };
    setParticipants(prev => [...prev, newParticipant]);
  };

  const removeParticipant = (index) => {
    const updatedParticipants = participants.filter((_, i) => i !== index);
    setParticipants(updatedParticipants);
  };

  // Tự động cập nhật sample khi participant thay đổi
  const updateSampleForParticipant = (participantIndex, citizenId) => {
    const updatedSamples = [...samples];
    const sampleIndex = updatedSamples.findIndex(s => s.participantIndex === participantIndex);
    
    if (sampleIndex !== -1) {
      updatedSamples[sampleIndex].participantCitizenId = citizenId;
      const participant = participants[participantIndex];
      if (participant) {
        updatedSamples[sampleIndex].participantName = participant.name;
      }
    }
    setSamples(updatedSamples);
  };

  const handlePaymentMethodChange = (e) => {
    setAppointment({ ...appointment, paymentMethod: e.target.value });
  };

    const handleSubmit = async () => {
   const updateAppointment = {
   ...appointment,
   userId: user?.user_Id,
   appointmentDate: appointment.appointmentDate || null, // chuyển "" thành null
   appointmentTime: appointment.appointmentTime || null
 };
     const updatedCaseFile = {
       ...caseFile,
       userId: user?.user_Id
     };

     try {
       const filteredSamples = samples.filter(s =>
         s.participantCitizenId?.trim() !== '' && s.sampleType?.trim() !== ''
       );

               // Debug logging
        console.log("DEBUG - Submit Data:");
        console.log("Participants count:", participants.length);
        console.log("Samples count:", samples.length);
        console.log("Filtered samples count:", filteredSamples.length);
        console.log("Participants:", participants);
        console.log("Samples:", samples);
        console.log("Filtered samples:", filteredSamples);
        console.log("Selected service:", selectedService);
        
        // Kiểm tra localStorage trước khi lưu
        console.log("DEBUG - localStorage before saving:");
        console.log("Existing appointment:", localStorage.getItem("appointment"));
        console.log("Existing participants:", localStorage.getItem("participants"));
        console.log("Existing samples:", localStorage.getItem("sample"));

       const paymentRequest = {
         amount: selectedService.servicePrice, // số tiền
         orderInfo: `Thanh toán dịch vụ ${selectedService.serviceName}`,
         txnRef: "ORDER" + Date.now(), // mã đơn hàng duy nhất
         bankCode: "", // hoặc để trống
         paymentMethod: "BANK_TRANSFER"
       };
       
               // Debug logging trước khi lưu localStorage
        console.log("DEBUG - Before saving to localStorage:");
        console.log("UpdateAppointment:", updateAppointment);
        console.log("UpdatedCaseFile:", updatedCaseFile);
        console.log("Participants:", participants);
        console.log("FilteredSamples:", filteredSamples);
        console.log("PaymentRequest:", paymentRequest);
        
        localStorage.setItem("appointment", JSON.stringify(updateAppointment));
        localStorage.setItem("caseFile", JSON.stringify(updatedCaseFile));
        localStorage.setItem("participants", JSON.stringify(participants));
        localStorage.setItem("sample", JSON.stringify(filteredSamples));
        localStorage.setItem("payment", JSON.stringify(paymentRequest));
        
        // Debug logging sau khi lưu localStorage
        console.log("DEBUG - After saving to localStorage:");
        console.log("Stored appointment:", localStorage.getItem("appointment"));
        console.log("Stored participants:", localStorage.getItem("participants"));
        console.log("Stored samples:", localStorage.getItem("sample"));

       const res = await apiService.user.createPay(paymentRequest);
       console.log(res);
       if (res) {
        window.open(res, "_blank");
       }

   } catch (error) {
     alert("Đặt lịch thất bại, vui lòng đặt lại");
         setValidateMessage(error.message || "Đặt lịch thất bại, vui lòng đặt lại");
     }
 };

  const nextStep = async () => {
    if (step === 1 && !caseFile.caseType) {
      setValidateMessage('Vui lòng chọn loại hồ sơ.');
      return;
    }
    if (step === 2) {
      if (!appointment.serviceId) {
        setValidateMessage("Vui lòng chọn dịch vụ.");
        return;
      }
      if (!appointment.deliveryMethod) {
        setValidateMessage("Vui lòng chọn hình thức lấy mẫu.");
        return;
      }
      if (!appointment.appointmentDate || !appointment.appointmentTime) {
        setValidateMessage("Vui lòng chọn ngày giờ hẹn.");
        return;
      }
    }
    if (step === 2 && appointment.deliveryMethod) {
      const available = await checkAvailability();
      if (!available) {
        setValidateMessage('Khung giờ này đã đầy, vui lòng chọn thời gian khác.');
        return;
      }
    }
    if (step === 3) {
      const errors = participants.map(validateParticipant);
      setParticipantErrors(errors);
      if (errors.some(e => Object.keys(e).length > 0)) {
        setValidateMessage('Vui lòng nhập đầy đủ thông tin người tham gia.');
        return;
      }
    }
if (step === 4) {
  try {
    // Chỉ ép validate địa chỉ nếu là lấy mẫu tại nhà
    if (appointment.deliveryMethod === 'HOME_COLLECTION' || appointment.deliveryMethod === 'HOME_DELIVERY') {
      await addressForm.validateFields();
    }

    const errors = samples.map(validateSample);
    setSampleErrors(errors);
    if (errors.some(e => Object.keys(e).length > 0)) {
      setValidateMessage('Vui lòng nhập đầy đủ thông tin mẫu xét nghiệm.');
      return;
    }
  } catch (err) {
    setValidateMessage('Vui lòng nhập địa chỉ lấy mẫu.');
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

  const prevStep = () => {
    setValidateMessage('');
    setStep(step - 1);
  };

  const selectedService = service.find(s => s.serviceId === parseInt(appointment.serviceId));

  // Debug logging for selectedService
  useEffect(() => {
    if (selectedService) {
      console.log("Selected Service:", selectedService);
      console.log("ParticipantTypes:", selectedService.participantsType);
    }
  }, [selectedService]);

  // Cập nhật logic để sử dụng participantType thay vì limitPeople
  useEffect(() => {
    if (step === 3 && selectedService?.participantsType) {
      const requiredCount = selectedService.participantsType.length;
      console.log("DEBUG - Creating participants and samples:");
      console.log("Required count:", requiredCount);
      console.log("Current participants count:", participants.length);
      console.log("ParticipantTypes:", selectedService.participantsType);

      // Nếu số người hiện tại khác với số participantType thì cập nhật
      if (participants.length !== requiredCount) {
        const newParticipants = selectedService.participantsType.map(pt => ({
          name: '',
          citizenId: '',
          address: '',
          birthDate: '',
          participantType: pt.participantType, // Tự động set participantType
        }));
        setParticipants(newParticipants);
        
        // Tự động tạo samples cho từng participant
        const newSamples = selectedService.participantsType.map((pt, index) => ({
          participantCitizenId: '', // Sẽ được cập nhật khi người dùng nhập CCCD
          sampleType: getDefaultSampleType(pt.participantType), // Tự động điền loại mẫu
          participantType: pt.participantType,
          participantIndex: index // Để liên kết với participant
        }));
        setSamples(newSamples);
        
        console.log("Created participants:", newParticipants);
        console.log("Created samples:", newSamples);
      }
    }
  }, [step, selectedService]);

  // Validate realtime cho participant
  const validateParticipant = (participant) => {
    const errors = {};
    if (!participant.name) errors.name = 'Vui lòng nhập họ tên';
    if (!participant.birthDate) errors.birthDate = 'Vui lòng nhập ngày sinh';
    else if (participant.birthDate > today) errors.birthDate = 'Ngày sinh không hợp lệ';
    if (!participant.citizenId) errors.citizenId = 'Vui lòng nhập CCCD';
    else if (!validateCitizenId(participant.citizenId, participants.indexOf(participant))) {
      errors.citizenId = 'CCCD đã được sử dụng';
    }
    if (!participant.participantType) errors.participantType = 'Vui lòng chọn loại người tham gia';
    return errors;
  };

  // Validate realtime cho sample
  // const validateSample = (sample) => {
  //   const errors = {};
  //   if(appointment.deliveryMethod != 'SELF_DROP_OFF'){
  //     if(!districtOptions){
  //           errors
  //     }
  //   }
  //   if (!sample.participantCitizenId) errors.participantCitizenId = 'Chưa có CCCD';
  //   if (!sample.sampleType) errors.sampleType = 'Chưa có loại mẫu';
  //   return errors;
  // };
const validateSample = (sample) => {
  const errors = {};

  // Chỉ validate địa chỉ nếu là lấy mẫu tại nhà
 

  if (!sample.participantCitizenId) errors.participantCitizenId = 'Chưa có CCCD';
  if (!sample.sampleType) errors.sampleType = 'Chưa có loại mẫu';
  return errors;
};

  // Validate realtime cho từng bước
  const [participantErrors, setParticipantErrors] = useState([]);
  const [sampleErrors, setSampleErrors] = useState([]);
  
  useEffect(() => {
    if (step === 3) {
      setParticipantErrors(participants.map(validateParticipant));
    }
    if (step === 4) {
      setSampleErrors(samples.map(validateSample));
    }
  }, [participants, samples, step]);

  return (
    <div>
             <header>
         <h1>Đặt dịch vụ xét nghiệm ADN</h1>
         <button 
           onClick={clearLocalStorage}
           style={{
             position: 'absolute',
             top: '10px',
             right: '10px',
             padding: '5px 10px',
             background: '#ff4d4f',
             color: 'white',
             border: 'none',
             borderRadius: '4px',
             cursor: 'pointer',
             fontSize: '12px'
           }}
         >
           Clear Data (Debug)
         </button>
       </header>
      <div className="step-container">
        <div className="step-nav">
          {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`step ${stepNumber === step ? 'active' : stepNumber < step ? 'completed' : ''}`}
              data-step={stepNumber}
            >
              {stepNumber < step ? <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} /> : null}
              <Tooltip title={['Chọn loại hồ sơ', 'Thông tin dịch vụ', 'Người tham gia', 'Mẫu xét nghiệm', 'Xác nhận', 'Thanh toán'][stepNumber - 1]}>
                {['Chọn loại hồ sơ', 'Thông tin dịch vụ', 'Người tham gia', 'Mẫu xét nghiệm', 'Xác nhận', 'Thanh toán'][stepNumber - 1]}
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(step - 1) * 20}%` }}></div>
        </div>
      </div>
      <div className="container">
        <div className="form-container improved-form-layout">
          {validateMessage && <div className="validate-message">{validateMessage}</div>}
          {step === 1 && (
            <div className="form-section">
              <h2>1. Chọn loại hồ sơ <Tooltip title="Chọn mục đích hồ sơ"><InfoCircleOutlined /></Tooltip></h2>
              <label>Loại hồ sơ:</label>
              <select value={caseFile.caseType} onChange={handleInputChange} className="styled-select">
                <option value="">-- Chọn loại hồ sơ --</option>
                <option value="ADMINISTRATIVE">Hành chính</option>
                <option value="CIVIL">Dân sự</option>
              </select>
              <div className="form-actions">
                <button className="btn-primary" onClick={nextStep} disabled={!caseFile.caseType}>Tiếp theo</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="form-section">
              <h2>2. Thông tin dịch vụ</h2>
              <div className="row">
                <div>
                  <label>Chọn dịch vụ:</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <select value={appointment.serviceId} onChange={handleServiceChange} className="styled-select">
                      <option value="">-- Chọn dịch vụ --</option>
                      {service.map(service => (
                        <option key={service.serviceId} value={service.serviceId}>{service.serviceName}</option>
                      ))}
                    </select>
                    {loadingService && <Spin indicator={<LoadingOutlined spin />} style={{ marginLeft: 8 }} />}
                  </div>
                </div>
              </div>
              <label>Hình thức lấy mẫu:</label>
              <select value={appointment.deliveryMethod} onChange={handleDeliveryChange} className="styled-select">
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
              {appointment.deliveryMethod && (
                <><label>Chọn ngày hẹn:</label>
                <input type="date" value={appointment.appointmentDate} min={minDate} onChange={handleDateChange} className="styled-input" />
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
                <button className="btn-secondary" onClick={prevStep}>Quay lại</button>
                <button className="btn-primary" onClick={nextStep} disabled={!appointment.serviceId || !appointment.deliveryMethod}>Tiếp theo</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="form-section">
              <h2>3. Người tham gia <Tooltip title="Nhập thông tin từng người"><InfoCircleOutlined /></Tooltip></h2>
              {selectedService?.participantsType && (
                <p>Vui lòng nhập thông tin cho <strong>{selectedService.participantsType.length}</strong> người tham gia theo yêu cầu của dịch vụ.</p>
              )}
                             {participants.map((participant, index) => (
                 <div key={index} className="participant">
                   <h3>{selectedService?.participantsType?.[index]?.participantType || `Người tham gia ${index + 1}`}</h3>
                  <label>Họ tên:</label>
                  <input type="text" name="name" placeholder="Nhập họ tên" value={participant.name} onChange={(e) => handleParticipantChange(index, e)} className="styled-input" />
                  {participantErrors[index]?.name && <div className="input-error">{participantErrors[index].name}</div>}
                  <label>Ngày sinh:</label>
                  <input type="date" name="birthDate" value={participant.birthDate} max={today} onChange={(e) => handleParticipantChange(index, e)} className="styled-input" />
                  {participantErrors[index]?.birthDate && <div className="input-error">{participantErrors[index].birthDate}</div>}
                                     <label>Căn cước công dân:</label>
                   <input name="citizenId" value={participant.citizenId} onChange={(e) => handleParticipantChange(index, e)} className="styled-input" />
                   {participantErrors[index]?.citizenId && <div className="input-error">{participantErrors[index].citizenId}</div>}
                </div>
              ))}
              <div className="form-actions">
                <button className="btn-secondary" onClick={prevStep}>Quay lại</button>
                <button className="btn-primary" onClick={nextStep} disabled={participantErrors.some(e => Object.keys(e).length > 0)}>Tiếp theo</button>
              </div>
            </div>
          )}
        {step === 4 && (
  <div className="form-section">
    <h2>4. Mẫu xét nghiệm</h2>

    {/* Nếu tự đến */}
    {appointment?.deliveryMethod === "SELF_DROP_OFF" && (
      <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '5px', border: '1px solid #ffeeba' }}>
        <strong>Lưu ý:</strong> Vui lòng đến cơ sở để lấy mẫu và đem đầy đủ giấy tờ cần thiết.
      </div>
    )}

    {/* Nếu lấy mẫu tại nhà */}
    {(appointment?.deliveryMethod === "HOME_DELIVERY" || appointment?.deliveryMethod === "HOME_COLLECTION") && (
      <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, boxShadow: '0 2px 8px #eee' }}>
        <h3>Địa chỉ lấy mẫu tại nhà</h3>
        <Form
          form={addressForm}
          layout="vertical"
          style={{ maxWidth: 900 }}
          initialValues={{ city: undefined, district: undefined }}
        >
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Form.Item
              name="addressDetail"
              label="Số nhà, đường, xã/phường..."
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
              style={{ flex: 2, minWidth: 220, marginBottom: 0 }}
            >
              <Input placeholder="Nhập số nhà, đường, xã/phường..." />
            </Form.Item>
            <Form.Item
              name="city"
              label="Tỉnh/Thành phố"
              rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
              style={{ flex: 1, minWidth: 180, marginBottom: 0 }}
            >
              <Select
                showSearch
                placeholder="Chọn tỉnh/thành phố"
                loading={loadingAreas}
                onChange={handleCityChange}
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {cityOptions.map(city => (
                  <Select.Option key={city} value={city}>{city}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
              style={{ flex: 1, minWidth: 180, marginBottom: 0 }}
            >
              <Select
                showSearch
                placeholder="Chọn quận/huyện"
                loading={loadingAreas}
                disabled={!addressForm.getFieldValue('city')}
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
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

    {/* Hiển thị danh sách mẫu */}
    {samples.map((sample, index) => {
      const participant = participants[sample.participantIndex];
      return (
        <div key={index} className="sample-info">
          <h3>Mẫu cho {sample.participantType}</h3>
          {participant && participant.citizenId ? (
            <div
              className="participant-details"
              style={{
                marginTop: '10px',
                padding: '10px',
                background: '#e8f5e8',
                borderRadius: '5px',
                border: '1px solid #4caf50'
              }}
            >
              <p><strong>Họ tên:</strong> {participant.name}</p>
              <p><strong>CCCD:</strong> {participant.citizenId}</p>
              <p><strong>Ngày sinh:</strong> {participant.birthDate}</p>
              <div style={{ marginTop: '10px' }}>
                <label><strong>Chọn loại mẫu:</strong></label>
                <select
                  value={sample.sampleType}
                  onChange={(e) => handleSampleTypeChange(index, e.target.value)}
                  className="styled-select"
                  style={{ marginTop: '5px', width: '100%' }}
                >
                  <option value="BLOOD">Máu</option>
                  <option value="SALIVA">Nước bọt</option>
                  <option value="HAIR">Tóc</option>
                  <option value="NAIL">Móng tay</option>
                  <option value="BUCCAL">Niêm mạc miệng</option>
                </select>
              </div>
            </div>
          ) : (
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                background: '#fff3cd',
                borderRadius: '5px',
                border: '1px solid #ffeaa7'
              }}
            >
              <p><em>Vui lòng nhập thông tin người tham gia ở bước trước</em></p>
            </div>
          )}
        </div>
      );
    })}

    {/* Nút điều hướng */}
    <div className="form-actions">
      <button className="btn-secondary" onClick={prevStep}>Quay lại</button>
      <button className="btn-primary" onClick={async () => {
        try {
          // Nếu là lấy mẫu tại nhà -> validate & build địa chỉ
          if (appointment.deliveryMethod === "HOME_DELIVERY" || appointment.deliveryMethod === "HOME_COLLECTION") {
            await addressForm.validateFields();
            const addr = addressForm.getFieldsValue();
            const fullAddress = `${addr.addressDetail}, ${addr.district}, ${addr.city}`;
            setAppointment(prev => ({
              ...prev,
              collectionAddress: fullAddress
            }));
          }
          nextStep();
        } catch {
          setValidateMessage("Vui lòng nhập đầy đủ địa chỉ lấy mẫu.");
        }
      }}
        disabled={sampleErrors.some(e => Object.keys(e).length > 0)}>
        Tiếp theo
      </button>
    </div>
  </div>
)}

          {step === 5 && (
            <div className="form-section">
              <h2>5. Xác nhận thông tin</h2>
              <div className="confirmation-card">
                <p><strong>Loại hồ sơ:</strong> {caseFile.caseType === 'ADMINISTRATIVE' ? 'Hành chính' : 'Dân sự'}</p>
                <p><strong>Dịch vụ:</strong> {selectedService ? selectedService.serviceName : ''}</p>
                <p><strong>Lịch hẹn:</strong> {appointment.appointmentDate || 'Chưa chọn ngày'}, {appointment.appointmentTime || 'Chưa chọn giờ'}</p>
                <p><strong>Người tham gia:</strong> {participants.map(p => `${p.name} (${p.participantType})`).join(', ')}</p>
                                 <p><strong>Loại mẫu:</strong> {samples.map(s => `${s.participantType} (${s.sampleType})`).join(', ')}</p>
             <p>
  <strong>Hình thức lấy mẫu:</strong>{" "}
  
  {appointment.deliveryMethod === "SELF_DROP_OFF"
    ? "Tại cơ sở"
    : appointment.deliveryMethod === "HOME_COLLECTION"
    ? "Tại nhà"
    : appointment.deliveryMethod === "HOME_DELIVERY"
    ? "Nhân viên đến lấy mẫu"
    : ""}
</p>
 {/* <p><strong>Địa chỉ:</strong> {addressForm ? addressForm : ''}</p> */}

              </div>
              <div className="form-actions">
                <button className="btn-secondary" onClick={prevStep}>Quay lại</button>
                <button className="btn-primary" onClick={nextStep}>Tiếp theo</button>
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
                <p><strong>Ngày hẹn:</strong> {appointment.appointmentDate || 'Chưa chọn ngày'}</p>
                <p><strong>Tổng chi phí:</strong> <span className="price">{selectedService ? formatVND(selectedService.servicePrice) : ''}</span></p>
              </div>
              <label>Phương thức thanh toán:</label>
              <select value={appointment.paymentMethod} onChange={handlePaymentMethodChange} className="styled-select">
               
                <option value="vnpay">VNPay</option>
              </select>
              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button className="btn-secondary" onClick={prevStep}>Quay lại</button>
                <button className="btn-primary" onClick={handleSubmit} >Xác nhận thanh toán</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentBooking;
