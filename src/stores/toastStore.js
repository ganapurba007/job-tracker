import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const visible = ref(false)
  const message = ref('')
  const type = ref('success') // 'success' | 'error' | 'info'
  let timer = null

  function showToast(msg, toastType = 'success', duration = 3500) {
    if (timer) clearTimeout(timer)
    message.value = msg
    type.value = toastType
    visible.value = true

    if (duration > 0) {
      timer = setTimeout(() => {
        hideToast()
      }, duration)
    }
  }

  function hideToast() {
    visible.value = false
  }

  return {
    visible,
    message,
    type,
    showToast,
    hideToast,
  }
})
