import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cardVariants, cardHover, imageHover, badgeVariants } from '@/lib/animations'
import type { Demo } from '@/types'

interface DemoCardProps {
  demo: Demo
  index: number
}

const statusConfig = {
  live: {
    label: 'Live',
    dotColor: 'bg-[#10b981]',
    textColor: 'text-[#10b981]',
    bgColor: 'bg-[#10b981]/10',
    pulse: true,
  },
  maintenance: {
    label: 'Maintenance',
    dotColor: 'bg-[#f59e0b]',
    textColor: 'text-[#f59e0b]',
    bgColor: 'bg-[#f59e0b]/10',
    pulse: false,
  },
  'coming-soon': {
    label: 'Coming Soon',
    dotColor: 'bg-[#64748b]',
    textColor: 'text-[#64748b]',
    bgColor: 'bg-[#64748b]/10',
    pulse: false,
  },
}

export function DemoCard({ demo, index }: DemoCardProps) {
  const status = statusConfig[demo.status]
  const isClickable = demo.status === 'live'

  const CardWrapper = isClickable ? motion.a : motion.div

  return (
    <CardWrapper
      href={isClickable ? demo.demoUrl : undefined}
      target={isClickable ? '_blank' : undefined}
      rel={isClickable ? 'noopener noreferrer' : undefined}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={isClickable ? cardHover : undefined}
      className={cn(
        'group relative flex flex-col overflow-hidden',
        'rounded-2xl bg-white',
        'border border-[#e2e8f0]',
        'shadow-[0_4px_20px_-4px_rgba(199,0,155,0.08)]',
        'transition-all duration-300 ease-out',
        isClickable && [
          'cursor-pointer',
          'hover:shadow-[0_20px_40px_-8px_rgba(199,0,155,0.15)]',
          'hover:border-[rgba(199,0,155,0.3)]',
          'hover:-translate-y-2',
        ],
        !isClickable && 'opacity-75'
      )}
    >
      {/* Featured badge */}
      {demo.featured && (
        <motion.div
          variants={badgeVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff00c3] to-[#c7009b] text-white text-xs font-semibold shadow-lg"
        >
          Featured
        </motion.div>
      )}

      {/* Preview image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f8fafc]">
        <motion.img
          src={demo.previewImage}
          alt={`${demo.name} preview`}
          className="w-full h-full object-cover object-top"
          whileHover={isClickable ? imageHover : undefined}
          onError={(e) => {
            // Fallback to gradient placeholder
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.classList.remove('hidden')
          }}
        />
        {/* Gradient fallback placeholder */}
        <div className="hidden absolute inset-0 bg-gradient-to-br from-[#c7009b]/20 via-[#00b8d4]/10 to-[#68faac]/20 flex items-center justify-center">
          <span className="text-5xl font-bold text-[#c7009b]/30">{demo.name[0]}</span>
        </div>

        {/* Hover overlay for live demos */}
        {isClickable && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <span className="text-white text-sm font-medium flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              Launch Demo
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        )}

        {/* Status overlay for non-live demos */}
        {!isClickable && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className={cn('text-sm font-semibold px-4 py-2 rounded-full', status.bgColor, status.textColor)}>
              {status.label}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Header with status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-[#1a1a2e] group-hover:text-[#c7009b] transition-colors truncate" style={{ fontFamily: "'Red Hat Display', sans-serif" }}>
              {demo.name}
            </h3>
            <p className="text-sm text-[#64748b] mt-1 truncate">{demo.tagline}</p>
          </div>

          {/* Status indicator */}
          <div className={cn('flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full', status.bgColor)}>
            <span className="relative flex h-2 w-2">
              {status.pulse && (
                <span className={cn(
                  'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
                  status.dotColor
                )} />
              )}
              <span className={cn('relative inline-flex rounded-full h-2 w-2', status.dotColor)} />
            </span>
            <span className={cn('text-xs font-medium', status.textColor)}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#64748b] mb-4 line-clamp-2 leading-relaxed">
          {demo.description}
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {demo.features.map((feature) => (
            <span
              key={feature}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-[#c7009b]/10 to-[#00b8d4]/10 text-[#c7009b] border border-[#c7009b]/20"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </CardWrapper>
  )
}
