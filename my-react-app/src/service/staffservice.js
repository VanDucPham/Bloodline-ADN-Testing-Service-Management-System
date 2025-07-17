import BaseApiService from "./api/BaseApiService";
class StaffService extends BaseApiService {
   

    async getAppointment(params = {}) {
        return this.get('/staff/appointment', { params });
    }

    async getAppointmentById(appointmentId) {
        return this.get(`/staff/appointment/${appointmentId}`); 
    }

    async getServiceById(serviceId) {
        return this.get(`/staff/service/${serviceId}`);
    }
    /**
     * Cập nhật trạng thái lịch hẹn và/hoặc trạng thái thu mẫu.
     * Nếu chỉ muốn cập nhật 1 trường, truyền trường còn lại là giá trị hiện tại.
     */
    async updateAppointmentStatusAndCollectionStatus(appointmentId, status, collectionStatus) {
        return this.put(`/staff/apointment/update/${appointmentId}?status=${status}&collectionStatus=${collectionStatus}`, {});
    }

    async getParticipantsByAppointmentId(appointmentId) {
        return this.get(`/staff/participant/${appointmentId}`);
    }

    async getSampleByParticipantId(participantId) {
        return this.get(`/staff/sample/get/${participantId}`);
    }

    async updateSample({ sampleId, quality, result, notes }) {
        // Chỉ gửi các trường cần thiết cho BE
        return this.put('/staff/sample/update', { sampleId, quality, result, notes });
    }

    async createAppointment(appointmentData) {
        return this.post('/staff/appointment/create', appointmentData);
    }
    async getAllServices() {
        return this.get('/staff/services');
    }
    async getStaffProfile(){
        return this.get('/staff/profile');
    }


    async addParticipants(participantList) {
        return this.post('/staff/participant/create', participantList);
    }


    async createSample(sampleData) {
        return this.post('/staff/sample/offline', [sampleData]);
    }

    async createResult(resultData) {
        return this.post('/staff/result/create', resultData);
    }

    async getResultByAppointmentId(appointmentId) {
        return this.get(`/staff/result/get/${appointmentId}`);
    }

    async exportAppointmentResult(appointmentId) {
        return this.get(`/staff/export-pdf/${appointmentId}`, { responseType: 'blob' });//blob xử lí nhị phân
    }

    async createPayment(appointmentId, paymentData) {
        return this.post(`/staff/payment/${appointmentId}`, paymentData);
    }
}

export default StaffService;