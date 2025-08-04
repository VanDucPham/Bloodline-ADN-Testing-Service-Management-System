import BaseApiService from "./api/BaseApiService";
class ManagerService extends BaseApiService {
  async getAllTracking() {
    return this.get('/manager/tracking');
  }

  async getCaseDetails(caseId) {
    return this.get(`/manager/tracking/${caseId}`);
  }

  async updateCaseStatus(caseId, statusData) {
    return this.put(`/manager/tracking/${caseId}/status`, statusData);
  }

  async assignStaff(caseId, staffData) {
    return this.put(`/manager/tracking/${caseId}/assign`, staffData);
  }

  async getAllPayments() {
    return this.get('/manager/payments');
  }

  async completedPayment(id) {
    return this.put(`/manager/payments/${id}`);
  }
  }
export default ManagerService;