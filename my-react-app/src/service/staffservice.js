import BaseApiService from "./api/BaseApiService";
class StaffService extends BaseApiService {
   

    async getAppointment(params = {}) {
        return this.get('/staff/appointment', { params });
    }


    async updateAppointmentStatus(appointmentId, newStatus) {
    return this.put(`/staff/apointment/update/${appointmentId}?status=${newStatus}`, {});
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
}

export default StaffService;