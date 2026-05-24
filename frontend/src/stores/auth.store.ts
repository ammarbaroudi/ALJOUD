import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from '../api/axios'

interface AuthUser {
  id: string
  email: string
}

const TOKEN_KEY = 'aljoud_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<AuthUser | null>(null)
  const router = useRouter()

  const isLoggedIn = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const { data } = await axios.post<{ access_token: string; user: AuthUser }>(
      '/auth/login',
      { email, password },
    )
    token.value = data.access_token
    user.value = data.user
    localStorage.setItem(TOKEN_KEY, data.access_token)
    router.push('/dashboard')
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    router.push('/login')
  }

  return { token, user, isLoggedIn, login, logout }
})
