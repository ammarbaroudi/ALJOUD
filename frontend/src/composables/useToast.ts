import { ref } from 'vue'

export type ToastType = 'error' | 'success' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])
let _id = 0

export function useToast() {
  function show(message: string, type: ToastType = 'error') {
    const id = ++_id
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), 3000)
  }

  function dismiss(id: number) {
    const i = toasts.value.findIndex((t) => t.id === id)
    if (i !== -1) toasts.value.splice(i, 1)
  }

  return { toasts, show, dismiss }
}
