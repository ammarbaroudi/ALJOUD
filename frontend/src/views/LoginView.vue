<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../stores/auth.store'

const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)
const showPass = ref(false)

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
    <!-- Background decoration -->
    <div class="login-bg" aria-hidden="true">
      <div class="bg-blob bg-blob--1" />
      <div class="bg-blob bg-blob--2" />
    </div>

    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      class="login-card"
    >
      <!-- Logo -->
      <div class="login-logo">
        <img src="/logo.png" alt="الجود للعقارات" class="logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
        <div class="logo-fallback">
          <span class="logo-main">ALJOUD</span>
          <span class="logo-sub">REAL ESTATE</span>
        </div>
      </div>

      <div class="login-header">
        <h2 class="login-title">مرحباً بعودتك</h2>
        <p class="login-sub">تسجيل الدخول للوحة التحكم</p>
      </div>

      <form class="login-form" @submit.prevent="submit">
        <div class="field">
          <label class="label">
            <Icon icon="mdi:email-outline" class="label-icon" />
            البريد الإلكتروني
          </label>
          <input
            v-model="form.email"
            type="email"
            class="input"
            placeholder="admin@aljoud.com"
            required
            autocomplete="email"
            dir="ltr"
          />
        </div>

        <div class="field">
          <label class="label">
            <Icon icon="mdi:lock-outline" class="label-icon" />
            كلمة المرور
          </label>
          <div class="input-wrap">
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              class="input input--pass"
              placeholder="••••••••"
              required
              autocomplete="current-password"
              dir="ltr"
            />
            <button type="button" class="pass-toggle" @click="showPass = !showPass">
              <Icon :icon="showPass ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
            </button>
          </div>
        </div>

        <Transition name="err">
          <p v-if="error" class="error-msg">
            <Icon icon="mdi:alert-circle-outline" class="err-icon" />
            {{ error }}
          </p>
        </Transition>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading" class="spinner" />
          <template v-else>
            <Icon icon="mdi:login" />
            دخول
          </template>
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
  background: linear-gradient(145deg, #F5EDD8 0%, #EDE0C4 60%, #E0CBA8 100%);
  font-family: 'Cairo', sans-serif;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}
.bg-blob--1 {
  width: 400px;
  height: 400px;
  background: rgba(107,58,42,0.1);
  top: -100px;
  right: -100px;
}
.bg-blob--2 {
  width: 300px;
  height: 300px;
  background: rgba(61,28,14,0.08);
  bottom: -80px;
  left: -80px;
}

.login-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(201,185,154,0.5);
  border-radius: 24px;
  padding: 2.5rem 2.25rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(61, 28, 14, 0.15), 0 4px 16px rgba(61,28,14,0.08);
  position: relative;
  z-index: 1;
}

.login-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}
.logo-img {
  height: 70px;
  width: auto;
  object-fit: contain;
}
.logo-fallback {
  display: none;
  flex-direction: column;
  align-items: center;
}
.logo-main {
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #2C1208;
}
.logo-sub {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: #6B3A2A;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f0e8d8;
}
.login-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #2C1208;
  margin: 0 0 0.25rem;
}
.login-sub {
  font-size: 0.85rem;
  color: #9a8a72;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #3D1C0E;
}
.label-icon { font-size: 1rem; color: #6B3A2A; }

.input {
  padding: 0.75rem 1rem;
  border: 1.5px solid #d6c9aa;
  border-radius: 10px;
  background: #fdfaf4;
  color: #2C1208;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.input:focus {
  border-color: #3D1C0E;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(61,28,14,0.08);
}

.input-wrap {
  position: relative;
}
.input--pass { padding-left: 2.8rem; }
.pass-toggle {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9a8a72;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;
}
.pass-toggle:hover { color: #3D1C0E; }

.error-msg {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 0.5rem 0.85rem;
  margin: 0;
}
.err-icon { font-size: 1rem; flex-shrink: 0; }

.submit-btn {
  margin-top: 0.5rem;
  padding: 0.85rem;
  background: linear-gradient(135deg, #3D1C0E, #5a2a18);
  color: #F5EDD8;
  border: none;
  border-radius: 12px;
  font-family: 'Cairo', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(61,28,14,0.3);
}
.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a2a18, #3D1C0E);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(61,28,14,0.35);
}
.submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(245,237,216,0.35);
  border-top-color: #F5EDD8;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Transitions */
.err-enter-active, .err-leave-active { transition: opacity 0.2s, transform 0.2s; }
.err-enter-from, .err-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
