import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/themeStore'

describe('themeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('starts with isDark false by default when no localStorage', () => {
    const store = useThemeStore()
    expect(store.isDark).toBe(false)
  })

  it('initializes from localStorage if available', () => {
    localStorage.setItem('theme', 'dark')
    const store = useThemeStore()
    store.initTheme()
    expect(store.isDark).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggles theme state and updates localStorage and document root', () => {
    const store = useThemeStore()
    expect(store.isDark).toBe(false)

    store.toggleTheme()
    expect(store.isDark).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    store.toggleTheme()
    expect(store.isDark).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
