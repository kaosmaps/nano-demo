import { useState, useEffect } from 'react'

interface AppsData {
  apps: string[]
  updated: string
}

/**
 * Hook to fetch deployed apps from Traefik-generated apps.json
 *
 * The apps.json file is generated every 5 minutes from Traefik routes
 * and contains only the apps that are actually deployed on the server.
 *
 * Falls back to showing all demos if fetch fails (development mode).
 */
export function useDeployedApps() {
  const [deployedApps, setDeployedApps] = useState<string[] | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // In development, apps.json won't exist - fallback to showing all
        const response = await fetch('/apps.json', {
          cache: 'no-cache',
        })

        if (!response.ok) {
          // In dev mode or if file doesn't exist, show all demos
          console.log('[useDeployedApps] apps.json not found, showing all demos')
          setDeployedApps(null) // null means "show all"
          setIsLoading(false)
          return
        }

        const data: AppsData = await response.json()
        setDeployedApps(data.apps)
        setLastUpdated(data.updated)
        setError(null)
      } catch (err) {
        // Fetch failed (likely dev mode) - show all demos
        console.log('[useDeployedApps] Failed to fetch apps.json:', err)
        setDeployedApps(null) // null means "show all"
        setError(null) // Don't show error, just fall back gracefully
      } finally {
        setIsLoading(false)
      }
    }

    fetchApps()

    // Refresh every 5 minutes to stay in sync with Traefik
    const interval = setInterval(fetchApps, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return {
    deployedApps,
    lastUpdated,
    isLoading,
    error,
    // Helper: check if an app is deployed (null = show all)
    isDeployed: (appId: string) =>
      deployedApps === null || deployedApps.includes(appId.toLowerCase()),
  }
}
