import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { DemoCard } from './DemoCard'
import { useClientFilter } from '@/hooks/useClientFilter'
import { useAdminPanel } from '@/components/admin'
import { containerVariants } from '@/lib/animations'
import type { Demo } from '@/types'

interface DemoGridProps {
  demos: Demo[]
}

export function DemoGrid({ demos }: DemoGridProps) {
  const { filterIds, isFiltered, clearFilter, filterCount } = useClientFilter()
  const { isDemoVisible } = useAdminPanel()

  // Filter and sort demos
  const filteredDemos = useMemo(() => {
    let result = [...demos]

    // Apply admin visibility filter (feature flags)
    result = result.filter((demo) => isDemoVisible(demo.id))

    // Apply client filter if active (URL params)
    if (filterIds && filterIds.length > 0) {
      result = result.filter((demo) => filterIds.includes(demo.id.toLowerCase()))
    }

    // Sort by order, then by featured status
    result.sort((a, b) => {
      // Featured first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      // Then by order
      return a.order - b.order
    })

    return result
  }, [demos, filterIds, isDemoVisible])

  return (
    <div className="w-full">
      {/* Filter indicator */}
      {isFiltered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center gap-2">
            <span>
              Showing {filterCount} {filterCount === 1 ? 'demo' : 'demos'}
            </span>
            <button
              onClick={clearFilter}
              className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
              aria-label="Clear filter"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            Filtered view •{' '}
            <button
              onClick={clearFilter}
              className="underline hover:text-foreground transition-colors"
            >
              View all demos
            </button>
          </span>
        </motion.div>
      )}

      {/* Demo grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredDemos.map((demo, index) => (
          <DemoCard key={demo.id} demo={demo} index={index} />
        ))}
      </motion.div>

      {/* Empty state */}
      {filteredDemos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center"
        >
          <p className="text-muted-foreground">
            No demos found{isFiltered ? ' for this filter' : ''}.
          </p>
          {isFiltered && (
            <button
              onClick={clearFilter}
              className="mt-4 text-primary underline hover:no-underline"
            >
              View all demos
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}
