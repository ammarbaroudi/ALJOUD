<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth.store'

const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  error.value = null
  loading.value = true
  try {
    await auth.login(form.email, form.password)
  } catch {
    error.value = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Logo -->
      <div class="login-logo">
        <span class="logo-main">ALJOUD</span>
        <span class="logo-sub">REAL ESTATE</span>
      </div>

      <h2 class="login-title">تسجيل الدخول</h2>

      <form class="login-form" @submit.prevent="submit">
        <div class="field">
          <label class="label">البريد الإلكتروني</label>
          <input
            v-model="form.email"
            type="email"
            class="input"
            placeholder="admin@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="field">
          <label class="label">كلمة المرور</label>
          <input
            v-model="form.password"
            type="password"
            class="input"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading" class="spinner" />
          <span v-else>دخول</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5EDD8;
  font-family: 'Cairo', sans-serif;
  padding: 1.5rem;
}

.login-card {
  background: #FAF6EE;
  border: 1.5px solid #c9b99a;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(61, 28, 14, 0.1);
}

.login-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}
.logo-main {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #3D1C0E;
}
.logo-sub {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #6B3A2A;
}

.login-title {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: #3D1C0E;
  margin: 0 0 1.75rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #3D1C0E;
}
.input {
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #c9b99a;
  border-radius: 8px;
  background: #fff;
  color: #3D1C0E;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.input:focus { border-color: #3D1C0E; }

.error-msg {
  font-size: 0.85rem;
  color: #b91c1c;
  margin: 0;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 0.45rem 0.75rem;
}

.submit-btn {
  margin-top: 0.5rem;
  padding: 0.7rem;
  background: #3D1C0E;
  color: #F5EDD8;
  border: none;
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  transition: background 0.2s;
}
.submit-btn:hover:not(:disabled) { background: #6B3A2A; }
.submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(245,237,216,0.4);
  border-top-color: #F5EDD8;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
