'use client'

import { useEffect, useState, createContext, useContext } from 'react'

const ThemeContext = createContext<{
  isDark: boolean
  toggleTheme: () => void
} | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check if theme preference is stored
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark
    
    setIsDark(shouldBeDark)
    applyTheme(shouldBeDark)
    setMounted(true)
  }, [])

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
      html.style.colorScheme = 'dark'
    } else {
      html.classList.remove('dark')
      html.style.colorScheme = 'light'
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    applyTheme(!isDark)
  }

  // To prevent hydration mismatch and useTheme context errors,
  // we always render the provider and same wrapper structure on the server and client.
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div data-theme={mounted ? (isDark ? 'dark' : 'light') : 'dark'} suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
