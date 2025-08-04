import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../service/api';

function PaymentPage() {
    const paymentOptions = [
        { value: 'CREDIT_CARD', label: 'Thẻ tín dụng' },
        { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng' },
        { value: 'CASH', label: 'Tiền mặt' },
        { value: 'E_WALLET', label: 'Ví điện tử (MoMo)' },
    ];

    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [appointmentInfo, setAppointmentInfo] = useState(null);
    const [serviceInfo, setServiceInfo] = useState(null);

    const [amount, setAmount] = useState('');

    const [loading, setLoading] = useState(false);
    const [appointmentLoading, setAppointmentLoading] = useState(true);

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH'); // 'CASH' là mặc định


    useEffect(() => {
        async function fetchData() {
            setError('');
            setAppointmentLoading(true);
            try {
                // 1. Lấy chi tiết lịch hẹn
                const appointment = await apiService.staff.getAppointmentById(appointmentId);
                console.log('Appointment:', appointment);
                setAppointmentInfo(appointment);

                // 2. Lấy chi tiết dịch vụ từ serviceId trong appointment
                if (appointment?.serviceId) {
                    const service = await apiService.staff.getServiceById(appointment.serviceId);
                    console.log('Service:', service);
                    setServiceInfo(service);

                    // Sử dụng giá tiền từ service nếu có, ngược lại lấy từ appointment
                    setAmount(service?.servicePrice ?? appointment.price ?? '');
                } else {
                    setServiceInfo(null);
                    // Nếu không có serviceId, dùng giá trong appointment hoặc để trống
                    setAmount(appointment.servicePrice ?? '');
                }
            } catch (err) {
                setError('Không tải được thông tin lịch hẹn hoặc dịch vụ');
            } finally {
                setAppointmentLoading(false);
            }
        }
        fetchData();
    }, [appointmentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!paymentMethod) {
            setError('Vui lòng chọn phương thức thanh toán.');
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError('Số tiền không hợp lệ.');
            return;
        }

        setLoading(true);
        try {
            await apiService.staff.createPayment(appointmentId, {
                paymentMethod,
                amount: Number(amount),
            });
            setSuccessMsg('Thanh toán thành công!');
            setTimeout(() => navigate('/staff/appointments'), 2000);
        } catch (err) {
            console.error('Lỗi thanh toán:', err);
            const msg =
                err?.response?.data?.message || err?.message || 'Thanh toán thất bại. Xin thử lại.';
            setError(msg);


        } finally {
            setLoading(false);
        }
    };

    if (appointmentLoading) return <p>Đang tải thông tin lịch hẹn...</p>;

    return (
        <div style={{ maxWidth: 480, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Thanh toán cho lịch hẹn #{appointmentId}</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {appointmentInfo && (
                <div style={{ marginBottom: 24 }}>
                    <p><strong>Dịch vụ:</strong> {serviceInfo?.serviceName || 'Chưa có dữ liệu'}</p>
                    <p><strong>Ngày hẹn:</strong> {appointmentInfo.appointmentDate || 'Chưa có dữ liệu'}</p>
                    <p><strong>Giờ hẹn:</strong> {appointmentInfo.appointmentTime || 'Chưa có dữ liệu'}</p>

                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label htmlFor="paymentMethod" style={{ fontWeight: 'bold', marginBottom: 4, display: 'block' }}>
                    Phương thức thanh toán
                </label>
                <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    required
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                >
                    {/* Chỉ có 1 lựa chọn thanh toán là Tiền mặt */}
                    <option value="CASH">Tiền mặt</option>
                </select>


                <div style={{ marginBottom: 12 }}>
                    <label style={{ fontWeight: 'bold', marginBottom: 4, display: 'block' }}>Số tiền (VNĐ)</label>
                    <input
                        type="number"
                        value={amount}
                        readOnly
                        style={{ width: '100%', padding: 8, marginTop: 4, backgroundColor: '#eee' }}
                    />
                </div>

                {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: 10, backgroundColor: '#1890ff', color: '#fff', border: 'none', borderRadius: 4 }}
                >
                    {loading ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
            </form>
        </div>
    );
}

export default PaymentPage;
