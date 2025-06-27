// AppointmentBooking.jsx
import React, { useState } from 'react';
import './appointmentBooking.css';

function AppointmentBooking() {
    const [step, setStep] = useState(1);
    const [validateMessage, setValidateMessage] = useState('');

    const [appointment, setAppointment] = useState({
        userId: '',
        serviceId: '',
        branch: '',
        appointmentType: '',
        appointmentDate: '',
        appointmentTime: '',
        deliveryMethod: '',
        appointmentNote: '',
        paymentMethod: ''
    });

    const [participants, setParticipants] = useState([{
        name: '',
        relationship: '',
        citizenId: '',
        address: '',
        birthDate: '',
        gender: ''
    }]);

    const [samples, setSamples] = useState([
        { participantName: '', sampleType: '' },
        { participantName: '', sampleType: '' }
    ]);

    const [caseFile, setCaseFile] = useState({
        caseCode: '',
        serviceId: '',
        createDate: '',
        status: ''
    });

    const handleInputChange = (e) => {
        setCaseFile({ ...caseFile, caseCode: e.target.value });
    };

    const handleServiceChange = (e) => {
        setAppointment({ ...appointment, serviceId: e.target.value });
    };

    const handleBranchChange = (e) => {
        setAppointment({ ...appointment, branch: e.target.value });
    };

    const handleDateChange = (e) => {
        setAppointment({ ...appointment, appointmentDate: e.target.value });
    };

    const handleTimeChange = (e) => {
        setAppointment({ ...appointment, appointmentTime: e.target.value });
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
        updated[index][e.target.name] = e.target.value;
        setSamples(updated);
    };

    const handlePaymentMethodChange = (e) => {
        setAppointment({ ...appointment, paymentMethod: e.target.value });
    };

    const handleSubmit = () => {
        console.log('Appointment:', appointment);
        console.log('Participants:', participants);
        console.log('Samples:', samples);
        console.log('Case File:', caseFile);
        alert('Lịch hẹn đã được đặt thành công!');
    };

    const nextStep = () => {
        if (step === 1 && !caseFile.caseCode) {
            setValidateMessage('Vui lòng chọn loại hồ sơ.');
            return;
        }
        if (step === 2 && (!appointment.serviceId || !appointment.branch || !appointment.appointmentDate || !appointment.appointmentTime)) {
            setValidateMessage('Vui lòng nhập đầy đủ thông tin dịch vụ.');
            return;
        }
        if (appointment.deliveryMethod === 'tannha' && caseFile.caseCode === 'hanhchinh') {
            setValidateMessage('Thủ tục hành chính chỉ được lấy mẫu tại cơ sở.');
            return;
        }
        if (step === 3 && participants.some(p => !p.name || !p.birthDate || !p.gender || !p.relationship)) {
            setValidateMessage('Vui lòng nhập đầy đủ thông tin người tham gia.');
            return;
        }
        if (step === 4 && samples.some(s => !s.participantName || !s.sampleType)) {
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
                            data-step = {stepNumber}
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
                            <select value={caseFile.caseCode} onChange={handleInputChange}>
                                <option value="">-- Chọn loại hồ sơ --</option>
                                <option value="hanhchinh">Hành chính</option>
                                <option value="dansu">Dân sự</option>
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
                                        <option value="huyetthong">Xét nghiệm huyết thống</option>
                                        <option value="cha-con">Xét nghiệm cha - con</option>
                                        <option value="gen">Giải mã gen di truyền</option>
                                    </select>
                                </div>
                                
                            </div>
                            <label>Chọn ngày hẹn:</label>
                            <input type="date" value={appointment.appointmentDate} onChange={handleDateChange} />
                            <label>Chọn giờ hẹn:</label>
                            <input type="time" value={appointment.appointmentTime} onChange={handleTimeChange} />
                            <label>Hình thức lấy mẫu:</label>
                            <select value={appointment.deliveryMethod} onChange={handleDeliveryChange}>
                                <option value="">-- Chọn hình thức --</option>
                                <option value="tannha">Tại nhà</option>
                                <option value="tancos">Tại cơ sở</option>
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
                                    <label>Giới tính:</label>
                                    <select name="gender" value={participant.gender} onChange={(e) => handleParticipantChange(index, e)}>
                                        <option value="">-- Chọn giới tính --</option>
                                        <option value="nam">Nam</option>
                                        <option value="nu">Nữ</option>
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
                                    <select name="participantName" value={sample.participantName} onChange={(e) => handleSampleChange(index, e)}>
                                        <option value="">-- Chọn người tham gia --</option>
                                        {participants.map((p, idx) => (
                                            <option key={idx} value={p.name}>{p.name}</option>
                                        ))}
                                    </select>
                                    <label>Loại mẫu:</label>
                                    <select name="sampleType" value={sample.sampleType} onChange={(e) => handleSampleChange(index, e)}>
                                        <option value="">-- Chọn loại mẫu --</option>
                                        <option value="mau">Máu</option>
                                        <option value="toc">Tóc</option>
                                        <option value="niemmac">Niêm mạc</option>
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
                                <p><strong>Dịch vụ:</strong> {appointment.serviceId}</p>
                                <p><strong>Địa điểm:</strong> {appointment.branch}</p>
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
                            <label>Chọn phương thức thanh toán:</label>
                            <select value={appointment.paymentMethod} onChange={handlePaymentMethodChange}>
                                <option value="">-- Chọn phương thức --</option>
                                <option value="tienmat">Tiền mặt</option>
                                <option value="chuyenkhoan">Chuyển khoản</option>
                                <option value="momo">Ví MoMo</option>
                            </select>
                            <div className="form-actions">
                                <button onClick={prevStep}>Quay lại</button>
                                <button onClick={handleSubmit}>Xác nhận & Đặt lịch</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default AppointmentBooking;