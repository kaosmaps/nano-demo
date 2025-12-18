/**
 * Admin Panel Context
 * Provides admin panel state and demo visibility controls
 * Last Updated: 2025-12-18
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import demosData from '@/data/demos.json'

// Credentials for admin panel access
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'spamsoak!!imtheadmin42'

const STORAGE_KEYS = {
  isOpen: 'showcase-admin-open',
  isAuthenticated: 'showcase-admin-auth',
  hiddenDemos: 'showcase-hidden-demos',
}

function getStorageValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function setStorageValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or disabled
  }
}

export interface AdminPanelState {
  isOpen: boolean
  isAuthenticated: boolean
  hiddenDemos: string[]
  allDemoIds: string[]
  setIsOpen: (open: boolean) => void
  toggleOpen: () => void
  authenticate: (username: string, password: string) => boolean
  logout: () => void
  toggleDemoVisibility: (demoId: string) => void
  showAllDemos: () => void
  hideAllDemos: () => void
  isDemoVisible: (demoId: string) => boolean
}

const AdminPanelContext = createContext<AdminPanelState | null>(null)

export function AdminPanelProvider({ children }: { children: ReactNode }) {
  const allDemoIds = demosData.demos.map(d => d.id)

  const [isOpen, setIsOpenState] = useState<boolean>(() =>
    getStorageValue(STORAGE_KEYS.isOpen, false)
  )

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    getStorageValue(STORAGE_KEYS.isAuthenticated, false)
  )

  const [hiddenDemos, setHiddenDemosState] = useState<string[]>(() =>
    getStorageValue(STORAGE_KEYS.hiddenDemos, [])
  )

  // Authentication
  const authenticate = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setStorageValue(STORAGE_KEYS.isAuthenticated, true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    localStorage.removeItem(STORAGE_KEYS.isAuthenticated)
  }, [])

  // Panel state
  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open)
    setStorageValue(STORAGE_KEYS.isOpen, open)
  }, [])

  const toggleOpen = useCallback(() => {
    setIsOpenState(prev => {
      const next = !prev
      setStorageValue(STORAGE_KEYS.isOpen, next)
      return next
    })
  }, [])

  // Demo visibility
  const toggleDemoVisibility = useCallback((demoId: string) => {
    setHiddenDemosState(prev => {
      const next = prev.includes(demoId)
        ? prev.filter(id => id !== demoId)
        : [...prev, demoId]
      setStorageValue(STORAGE_KEYS.hiddenDemos, next)
      return next
    })
  }, [])

  const showAllDemos = useCallback(() => {
    setHiddenDemosState([])
    setStorageValue(STORAGE_KEYS.hiddenDemos, [])
  }, [])

  const hideAllDemos = useCallback(() => {
    setHiddenDemosState(allDemoIds)
    setStorageValue(STORAGE_KEYS.hiddenDemos, allDemoIds)
  }, [allDemoIds])

  const isDemoVisible = useCallback((demoId: string) => {
    return !hiddenDemos.includes(demoId)
  }, [hiddenDemos])

  // Keyboard shortcut: Ctrl+Shift+A
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        toggleOpen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleOpen])

  return (
    <AdminPanelContext.Provider
      value={{
        isOpen,
        isAuthenticated,
        hiddenDemos,
        allDemoIds,
        setIsOpen,
        toggleOpen,
        authenticate,
        logout,
        toggleDemoVisibility,
        showAllDemos,
        hideAllDemos,
        isDemoVisible,
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  )
}

export function useAdminPanel(): AdminPanelState {
  const context = useContext(AdminPanelContext)
  if (!context) {
    throw new Error('useAdminPanel must be used within AdminPanelProvider')
  }
  return context
}
