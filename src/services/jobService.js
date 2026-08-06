import api from './api'

export const jobService = {
  async getApplications(params = {}) {
    const response = await api.get('/job-applications', { params })
    return response.data
  },

  async getApplication(id) {
    const response = await api.get(`/job-applications/${id}`)
    return response.data
  },

  async createApplication(data) {
    const response = await api.post('/job-applications', data)
    return response.data
  },

  async updateApplication(id, data) {
    const response = await api.put(`/job-applications/${id}`, data)
    return response.data
  },

  async deleteApplication(id) {
    const response = await api.delete(`/job-applications/${id}`)
    return response.data
  },

  async addStatusHistory(id, historyData) {
    const response = await api.post(`/job-applications/${id}/histories`, historyData)
    return response.data
  },
}
