import { useEffect, useMemo } from 'react'

/**
 * Hook for client-based filtering via URL params
 *
 * URL patterns:
 * - demo.kaosmaps.com/         → Full portfolio (all demos)
 * - demo.kaosmaps.com/?client=lawpilots    → Only LawPilots
 * - demo.kaosmaps.com/?client=lawpilots,x  → Multiple demos
 */
export function useClientFilter() {
  // Get client param from URL
  const params = new URLSearchParams(window.location.search)
  const clientParam = params.get('client')

  // Parse comma-separated clients
  const filterIds = useMemo(() => {
    if (!clientParam) return null
    return clientParam
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean)
  }, [clientParam])

  // Persist to sessionStorage for consistency
  useEffect(() => {
    if (filterIds && filterIds.length > 0) {
      sessionStorage.setItem('demo_filter', JSON.stringify(filterIds))
    } else {
      sessionStorage.removeItem('demo_filter')
    }
  }, [filterIds])

  // Clear filter by removing URL param
  const clearFilter = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('client')
    window.history.pushState({}, '', url.toString())
    window.location.reload()
  }

  return {
    filterIds,
    isFiltered: filterIds !== null && filterIds.length > 0,
    clearFilter,
    filterCount: filterIds?.length ?? 0,
  }
}
