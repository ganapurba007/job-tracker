import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useToastStore } from '@/stores/toastStore'

describe('toastStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows toast notification with type and message', () => {
    const store = useToastStore()
    expect(store.visible).toBe(false)

    store.showToast('Test Notification', 'success', 0)
    expect(store.visible).toBe(true)
    expect(store.message).toBe('Test Notification')
    expect(store.type).toBe('success')

    store.hideToast()
    expect(store.visible).toBe(false)
  })
})
