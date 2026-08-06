import api from './api'

export const referenceService = {
  async getStatuses() {
    const response = await api.get('/statuses')
    return response.data
  },

  async getPlatforms() {
    const response = await api.get('/platforms')
    return response.data
  },
}
