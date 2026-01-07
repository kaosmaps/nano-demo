import { motion } from 'framer-motion'

export function Header() {
  return (
    <header className="py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        {/* Logo */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <img
            src="/kaosmaps-logo.png"
            alt="KaosMaps - Show, Don't Tell"
            className="h-20 md:h-28 lg:h-32 w-auto"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Experience our portfolio of{' '}
          <span className="text-foreground font-medium">AI-powered applications</span>{' '}
          and innovative solutions.
        </motion.p>

        {/* Stats or highlights */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center gap-2.5 glass px-4 py-2 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]" />
            </span>
            <span className="text-sm font-medium text-foreground/80">6 Live Apps</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Built with</span>
            <span className="text-gradient font-bold text-base">NanoBricks</span>
          </div>
        </motion.div>
      </motion.div>
    </header>
  )
}
