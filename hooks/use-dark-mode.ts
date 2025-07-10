"use client"

import { useState, useEffect } from "react"

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // 로컬 스토리지에서 다크모드 설정 불러오기
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      const isDark = JSON.parse(savedMode)
      setIsDarkMode(isDark)
      updateTheme(isDark)
    } else {
      // 시스템 설정 확인
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(systemDark)
      updateTheme(systemDark)
    }
  }, [])

  const updateTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    updateTheme(newMode)
    localStorage.setItem("darkMode", JSON.stringify(newMode))
  }

  return { isDarkMode, toggleDarkMode }
}
