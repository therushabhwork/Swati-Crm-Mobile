import apiClient from './apiClient'

export const summaryReportSettingsApi = {
  getSettings: async () => {
    try {
      const response = await apiClient.get('/summary-report-settings')
      return response.data?.data || {}
    } catch (e) {
      console.error('Failed to get summary report settings', e)
      return {}
    }
  },

  updateSettings: async (settings) => {
    try {
      const response = await apiClient.put('/summary-report-settings', settings)
      return response.data?.data || settings
    } catch (e) {
      console.error('Failed to save summary report settings', e)
      throw e
    }
  }
}
