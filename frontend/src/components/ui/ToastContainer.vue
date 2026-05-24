<script setup lang="ts">
import { useToast } from '../../composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-wrapper" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          role="alert"
          @click="dismiss(toast.id)"
        >
          <!-- Icon -->
          <svg
            v-if="toast.type === 'error'"
            class="toast-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
          <svg
            v-else-if="toast.type === 'success'"
            class="toast-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          <svg
            v-else
            class="toast-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
          </svg>

          <span class="toast-msg">{{ toast.message }}</span>

          <button class="toast-close" aria-label="إغلاق" @click.stop="dismiss(toast.id)">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-wrapper {
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: center;
  pointer-events: none;
  width: max-content;
  max-width: calc(100vw - 2rem);
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 6px 24px rgba(0,0,0,0.18);
  cursor: pointer;
  pointer-events: all;
  min-width: 260px;
  max-width: 420px;
}

.toast--error   { background: #3D1C0E; color: #F5EDD8; }
.toast--success { background: #166534; color: #dcfce7; }
.toast--info    { background: #1e3a5f; color: #dbeafe; }

.toast-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.toast-msg {
  flex: 1;
  line-height: 1.4;
}
.toast-close {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0 0 0 0.25rem;
  flex-shrink: 0;
  line-height: 1;
}
.toast-close:hover { opacity: 1; }

/* Transition */
.toast-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-enter-from   { opacity: 0; transform: translateY(-14px) scale(0.95); }
.toast-leave-to     { opacity: 0; transform: translateY(-8px) scale(0.95); }
.toast-move         { transition: transform 0.2s ease; }
</style>
