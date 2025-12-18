/**
 * Admin Panel Component
 * Fixed position bottom-left panel for demo visibility controls
 * Password protected for admin access
 * Last Updated: 2025-12-18
 */

import { useState } from 'react'
import { Settings, X, Lock, LogOut, Eye, EyeOff, ToggleLeft, ToggleRight } from 'lucide-react'
import { useAdminPanel } from './AdminPanelContext'
import demosData from '@/data/demos.json'

function PasswordPrompt({ onAuthenticate }: { onAuthenticate: (username: string, password: string) => boolean }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = onAuthenticate(username, password)
    if (!success) {
      setError(true)
      setPassword('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Admin Access Required</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className={`w-full px-3 py-2 bg-muted border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
            error ? 'border-red-500' : 'border-border'
          }`}
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={`w-full px-3 py-2 bg-muted border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors ${
            error ? 'border-red-500' : 'border-border'
          }`}
        />
        {error && (
          <p className="text-xs text-red-400">Invalid credentials</p>
        )}
        <button
          type="submit"
          className="w-full px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
        >
          Unlock
        </button>
      </form>
    </div>
  )
}

function DemoToggle({ demoId, name, status }: { demoId: string; name: string; status: string }) {
  const { isDemoVisible, toggleDemoVisibility } = useAdminPanel()
  const visible = isDemoVisible(demoId)

  return (
    <button
      onClick={() => toggleDemoVisibility(demoId)}
      className={`w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 ${
        visible
          ? 'bg-primary/10 border border-primary/50'
          : 'bg-muted border border-border opacity-60'
      }`}
    >
      {visible ? (
        <Eye className="w-4 h-4 text-primary flex-shrink-0" />
      ) : (
        <EyeOff className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground truncate">{name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
            status === 'live'
              ? 'bg-success/20 text-success border border-success/30'
              : 'bg-muted-foreground/20 text-muted-foreground border border-muted-foreground/30'
          }`}>
            {status}
          </span>
        </div>
      </div>
      <div
        className={`w-10 h-6 rounded-full transition-colors flex items-center p-0.5 ${
          visible ? 'bg-primary' : 'bg-muted-foreground/30'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
            visible ? 'translate-x-4' : ''
          }`}
        />
      </div>
    </button>
  )
}

function DemoVisibilityTab() {
  const { showAllDemos, hideAllDemos, hiddenDemos, allDemoIds } = useAdminPanel()
  const visibleCount = allDemoIds.length - hiddenDemos.length

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">Visible demos</span>
        <span className="text-lg font-mono text-foreground">
          {visibleCount} / {allDemoIds.length}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={showAllDemos}
          className="flex-1 py-2 px-3 bg-muted hover:bg-muted/80 text-sm text-foreground rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <ToggleRight className="w-4 h-4" />
          Show All
        </button>
        <button
          onClick={hideAllDemos}
          className="flex-1 py-2 px-3 bg-muted hover:bg-muted/80 text-sm text-foreground rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <ToggleLeft className="w-4 h-4" />
          Hide All
        </button>
      </div>

      {/* Demo List */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground mb-2">Toggle demo visibility:</p>
        {demosData.demos.map((demo) => (
          <DemoToggle
            key={demo.id}
            demoId={demo.id}
            name={demo.name}
            status={demo.status}
          />
        ))}
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center">
        Changes are saved automatically and persist across sessions.
      </p>
    </div>
  )
}

export function AdminPanel() {
  const {
    isOpen,
    isAuthenticated,
    setIsOpen,
    toggleOpen,
    authenticate,
    logout,
  } = useAdminPanel()

  if (!isOpen) {
    return (
      <button
        onClick={toggleOpen}
        className="fixed bottom-4 left-4 z-50 p-2.5 bg-card rounded-lg border border-border hover:bg-muted transition-colors shadow-lg"
        title="Open Admin Panel (Ctrl+Shift+A)"
      >
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Admin Panel</span>
        </div>
        <div className="flex items-center gap-1">
          {isAuthenticated && (
            <button
              onClick={logout}
              className="p-1.5 hover:bg-muted rounded transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-muted rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isAuthenticated ? (
        <PasswordPrompt onAuthenticate={authenticate} />
      ) : (
        <>
          <div className="p-4 max-h-[400px] overflow-y-auto">
            <DemoVisibilityTab />
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              Ctrl+Shift+A to toggle
            </p>
          </div>
        </>
      )}
    </div>
  )
}
