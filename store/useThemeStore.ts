import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// Applies the theme to <html data-theme="...">
// CSS selectors use [data-theme="dark"], NOT .dark — see docs/pitfalls/README.md PITFALL-003
function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',

      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },

      toggleTheme: () =>
        set((s) => {
          const next: Theme = s.theme === 'light' ? 'dark' : 'light'
          applyTheme(next)
          return { theme: next }
        }),
    }),
    {
      name: 'arm-theme', // localStorage key
      // Apply the persisted theme as soon as localStorage is read,
      // before React renders, to avoid a flash of wrong theme.
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    }
  )
)
