import React, { useEffect, useState } from 'react';
import './appointmentBooking.css';
import apiService from '../../../../service/api';

function AppointmentBooking() {
    const [step, setStep] = useState(1);
    const [validateMessage, setValidateMessage] = useState('');
    const [minDate, setMinDate] = useState("") ;

    const [appointment, setAppointment] = useState({
        userId: '',
        serviceId: '',
        appointmentType: '',
        appointmentDate: '',
        appointmentTime: '',
        deliveryMethod: '',
        appointmentNote: '',
        paymentMethod: '',
        
    });
    const [timeSlot, setTimeSlot] = useState([{
        id : '',
        startTime : '' ,
        endTime : '',
        maxAppointment : ''
    }])
    const [participants, setParticipants] = useState([{
        name: '',
        relationship: '',
        citizenId: '',
        address: '',
        birthDate: '',
        gender: '',

    }]);

    const [samples, setSamples] = useState([
        {  participantCitizenId : '',sampleType: '' },
        {  participantCitizenId : '',sampleType: '' }
    ]);

    const [caseFile, setCaseFile] = useState({
        caseCode: '',
        caseType:'',
        serviceId: '',
        createDate: '',
        status: 'ARCHIVED'
    });

    const [service, setService] = useState([]);

    const userInfo = localStorage.getItem("authToken")

    console.log(userInfo);
    const username = userInfo?.email ;

    // 👉 Fetch Service API
    useEffect(() => {
        const fetchService = async () => {
            try {

                const response = await apiService.user.getService();
                const timeSlot = await apiService.user.getTimeSlot()
                setTimeSlot(timeSlot)
                setService(response);
                console.log("Các slot time:" , timeSlot)
                console.log("Các dịch vụ hiện có là:", response);
            } catch (error) {
                console.log("Không thể tải các dịch vụ lên được", error);
            }
            
                const now = new Date();
                now.setDate(now.getDate()+ 1);
                const yyyy = now.getFullYear();
                const mm = String(now.getMonth()+ 1).padStart(2,"0");
                const dd = String(now.getDate()).padStart(2, "0");
                setMinDate(`${yyyy}-${mm}-${dd}`);
            
        };
        fetchService(); // GỌI HÀM
    }, []);
    const checkAvailability = async () => {
    try {
        const response = await apiService.user.checkAvailability({
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime
        });

        console.log("Response message:", response); // "Lịch trống." hoặc "Lịch không trống."
        
        if (response === "Lịch trống.") {
            return true;
        } else {
            setValidateMessage(response); // Hiển thị thông báo từ BE
            return false;
        }
    } catch (error) {
        console.log("Lỗi khi kiểm tra lịch hẹn", error);
        setValidateMessage("Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
        return false;
    }
}
    const handleTimeSlotChange = (e) => {
        
    }

    const handleInputChange = (e) => {
        setCaseFile({ ...caseFile, caseType: e.target.value });
    };

    const handleServiceChange = (e) => {
        setAppointment({ ...appointment, serviceId: e.target.value });
    };

    const handleDateChange = (e) => {
        setAppointment({ ...appointment, appointmentDate: e.target.value });
    };

    const [selectedTime, setSelectedTime] = useState('');

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
        setParticipants([...participants, {
            name: '',
            relationship: '',
            citizenId: '',
            address: '',
            birthDate: '',
            gender: ''
        }]);
    };
    
    const handleSampleChange = (index, e) => {
    const updated = [...samples];
    const { name, value } = e.target;

    updated[index][name] = value;

    // Nếu thay đổi CCCD => tự động cập nhật tên người tham gia
    if (name === 'participantCitizenId') {
        console.log("Giá trị chọn từ dropdown:", value);
    console.log("Danh sách participants:", participants);
    
        const matched = participants.find(p => p.citizenId.trim() === value);
        updated[index]['participantName'] = matched?.name || '';
    }

    setSamples(updated);
};


    const handlePaymentMethodChange = (e) => {
        setAppointment({ ...appointment, paymentMethod: e.target.value });
    };

    const handleSubmit = async () => {
        console.log('Appointment:', appointment);
        console.log('Participants:', participants);
        console.log('Samples:', samples);
        console.log('Case File:', caseFile);
        
        try {
            const payLoad = {
                appointment: appointment,
                participants : participants,
                samples : samples,
                caseFile : caseFile
            };
            console.log(payLoad)
            await apiService.user.create_app(payLoad);
            alert('Lịch hẹn được đặt thành công!')
            
        } catch (error) {
            console.error('Lỗi khi tạo lịch:', error) ;
            alert("Đặt lịch thất bại, vui lòng đặt lại")
        }
    };

    const nextStep = async () => {
    if (step === 1 && !caseFile.caseType) {
        setValidateMessage('Vui lòng chọn loại hồ sơ.');
        return;
    }

    if (step === 2 && (!appointment.serviceId || !appointment.appointmentDate || !appointment.appointmentTime)) {
        setValidateMessage('Vui lòng nhập đầy đủ thông tin dịch vụ.');
        return;
    }

    if (appointment.deliveryMethod === 'HOME-COLLECTION' && caseFile.caseCode === 'hanhchinh') {
        setValidateMessage('Thủ tục hành chính chỉ được lấy mẫu tại cơ sở.');
        return;
    }

    if (step === 2) {
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

    if (step === 4 && samples.some(s => !s.participantCitizenId || !s.sampleType)) {
        setValidateMessage('Vui lòng nhập đầy đủ thông tin mẫu xét nghiệm.');
        return;
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
                            className={`step ${stepNumber === step ? 'active' : ''}`}
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
                            <label>Chọn ngày hẹn:</label>
                            <input type="date" value={appointment.appointmentDate} min={minDate} onChange={handleDateChange} />
                            <div className="grid grid-cols-2 gap-3">
  {timeSlot.map((slot) => (
    <button
      key={slot.startTime}
      onClick={() => handleTimeChange(slot.startTime)}
      type="button"
      className={`border rounded-lg p-2 transition duration-200 text-center ${
        selectedTime === slot.startTime
          ? 'bg-blue-500 text-white font-semibold'
          : 'bg-white hover:bg-blue-100'
      }`}
    >
      {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
    </button>
  ))}
</div>

                            
                            <label>Hình thức lấy mẫu:</label>
                            <select value={appointment.deliveryMethod} onChange={handleDeliveryChange}>
                                <option value="">-- Chọn hình thức --</option>
                                <option value="HOME_COLLECTION">Tại nhà</option>
                                <option value="SELF_DROP_OFF">Tại cơ sở</option>
                            </select>
                            <div className="form-actions">
                                <button onClick={prevStep}>Quay lại</button>
                                <button onClick={nextStep}>Tiếp theo</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="form-section">
                            <h2>3. Người tham gia</h2>
                            {participants.map((participant, index) => (
                                <div key={index} className="participant">
                                    <label>Họ tên:</label>
                                    <input type="text" name="name" placeholder="Nhập họ tên" value={participant.name} onChange={(e) => handleParticipantChange(index, e)} />
                                    <label>Ngày sinh:</label>
                                    <input type="date" name="birthDate" value={participant.birthDate} onChange={(e) => handleParticipantChange(index, e)} />
                                    <label>Căn cước công dân :</label>
                                     <input name="citizenId"  value={participant.citizenId} onChange={(e) => handleParticipantChange(index,e)}/>
                                    <label>Giới tính:</label>
                                    <select name="gender" value={participant.gender} onChange={(e) => handleParticipantChange(index, e)}>
                                        <option value="">-- Chọn giới tính --</option>
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">khac</option>
                                    </select>
                                    <label>Quan hệ:</label>
                                    <input type="text" name="relationship" placeholder="Cha, con, mẹ..." value={participant.relationship} onChange={(e) => handleParticipantChange(index, e)} />
                                </div>
                            ))}
                            <button className="btn-add" onClick={addParticipant}>+ Thêm người</button>
                            <div className="form-actions">
                                <button onClick={prevStep}>Quay lại</button>
                                <button onClick={nextStep}>Tiếp theo</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
    <div className="form-section">
        <h2>4. Mẫu xét nghiệm</h2>
        {samples.map((sample, index) => (
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

                {/* Tự động hiển thị tên người tham gia đã chọn */}
                {sample.participantCitizenId && (
                    <div className="participant-details" style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
                        <p><strong>Họ tên:</strong> {sample.participantName}</p>
                        <p><strong>Ngày sinh:</strong> {
                            participants.find(p => p.citizenId === sample.participantCitizenId)?.birthDate
                        }</p>
                        <p><strong>Giới tính:</strong> {
                            participants.find(p => p.citizenId === sample.participantCitizenId)?.gender
                        }</p>
                    </div>
                )}

                <label>Loại mẫu:</label>
                <select
                    name="sampleType"
                    value={sample.sampleType}
                    onChange={(e) => handleSampleChange(index, e)}
                >
                    <option value="">-- Chọn loại mẫu --</option>
                    <option value="BLOOD">Máu</option>
                    <option value="HAIR">Tóc</option>
                    <option value="SALIVA">Niêm mạc</option>
                </select>
            </div>
        ))}
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
                                <p><strong>Loại hồ sơ:</strong> {caseFile.caseCode}</p>
                                <p><strong>Dịch vụ:</strong> {selectedService ? selectedService.serviceName : ''}</p>
                                <p><strong>Lịch hẹn:</strong> {appointment.appointmentDate}, {appointment.appointmentTime}</p>
                                <p><strong>Người tham gia:</strong> {participants.map(p => p.name).join(', ')}</p>
                                <p><strong>Loại mẫu:</strong> {samples.map(s => `${s.participantName} (${s.sampleType})`).join(', ')}</p>
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
                                <p><strong>Dịch vụ:</strong> {selectedService ? selectedService.serviceName : ''} ({caseFile.caseCode === 'hanhchinh' ? 'Hành chính' : 'Dân sự'})</p>
                                <p><strong>Số người tham gia:</strong> {participants.length}</p>
                                <p><strong>Loại mẫu:</strong> {samples.map(s => s.sampleType).join(', ')}</p>
                                <p><strong>Ngày hẹn:</strong> {appointment.appointmentDate}</p>
                                <p><strong>Tổng chi phí:</strong> <span style={{ color: '#e74c3c', fontSize: '18px', fontWeight: 'bold' }}>2.500.000đ</span></p>
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
