import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { cardVariants, cardHover, imageHover, badgeVariants, arrowVariants } from '@/lib/animations'
import type { Demo } from '@/types'

interface DemoCardProps {
  demo: Demo
  index: number
}

const statusConfig = {
  live: {
    label: 'Live',
    dotColor: 'bg-success',
    textColor: 'text-success',
    pulse: true,
  },
  maintenance: {
    label: 'Maintenance',
    dotColor: 'bg-warning',
    textColor: 'text-warning',
    pulse: false,
  },
  'coming-soon': {
    label: 'Coming Soon',
    dotColor: 'bg-muted-foreground',
    textColor: 'text-muted-foreground',
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
        'group relative flex flex-col overflow-hidden rounded-2xl',
        'bg-card border border-border/50',
        'shadow-card transition-shadow duration-500',
        isClickable && 'cursor-pointer hover:shadow-card-hover hover:border-border',
        !isClickable && 'opacity-80'
      )}
    >
      {/* Featured badge */}
      {demo.featured && (
        <motion.div
          variants={badgeVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium backdrop-blur-sm"
        >
          Featured
        </motion.div>
      )}

      {/* Preview image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <motion.img
          src={demo.previewImage}
          alt={`${demo.name} preview`}
          className="w-full h-full object-cover"
          whileHover={isClickable ? imageHover : undefined}
          onError={(e) => {
            // Fallback to gradient placeholder
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.classList.remove('hidden')
          }}
        />
        {/* Gradient fallback placeholder */}
        <div className="hidden absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary/30">{demo.name[0]}</span>
        </div>

        {/* Status overlay for non-live demos */}
        {!isClickable && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className={cn('text-sm font-medium', status.textColor)}>
              {status.label}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Header with status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {demo.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{demo.tagline}</p>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={cn('relative flex h-2 w-2', status.pulse && 'animate-pulse')}>
              <span className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75',
                status.dotColor,
                status.pulse && 'animate-ping'
              )} />
              <span className={cn('relative inline-flex rounded-full h-2 w-2', status.dotColor)} />
            </span>
            <span className={cn('text-xs font-medium', status.textColor)}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground/80 mb-4 line-clamp-2">
          {demo.description}
        </p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {demo.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto">
          {isClickable ? (
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              <span>Launch Demo</span>
              <motion.span variants={arrowVariants}>
                <ExternalLink className="w-4 h-4" />
              </motion.span>
            </motion.div>
          ) : (
            <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>Coming Soon</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}
