'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light')

  useEffect(() => {
    const curMode = document.documentElement.getAttribute('data-theme') || 'light'
    setMode(curMode)
  }, [])

  const toggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    document.documentElement.setAttribute('data-theme', newMode)
  };

  return (
    <ThemeContext.Provider value={[ mode, toggle ]}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext)
