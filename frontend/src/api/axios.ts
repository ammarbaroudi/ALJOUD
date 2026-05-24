import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'
import { useToast } from '../composables/useToast'

const instance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api',
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('aljoud_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error.response?.status

    if (status === 401) {
      const auth = useAuthStore()
      auth.logout()
      return Promise.reject(error)
    }

    // Show a toast for all other API errors
    const { show } = useToast()
    if (status === 403) {
      show('غير مصرح لك بهذا الإجراء', 'error')
    } else if (status === 404) {
      show('العنصر المطلوب غير موجود', 'error')
    } else if (status != null && status >= 500) {
      show('خطأ في الخادم، يرجى المحاولة لاحقاً', 'error')
    } else if (!error.response) {
      show('تعذّر الاتصال بالخادم', 'error')
    }

    return Promise.reject(error)
  },
)

export default instance
