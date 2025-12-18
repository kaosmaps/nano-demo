import { motion } from 'framer-motion'

export function Header() {
  return (
    <header className="py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        {/* Logo / Brand */}
        <div className="mb-6">
          <motion.h1
            className="text-4xl md:text-5xl font-bold tracking-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              KaosMaps
            </span>
            <span className="text-foreground"> Demos</span>
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Explore our portfolio of AI-powered applications and innovative solutions.
          <span className="hidden md:inline"> Each demo showcases cutting-edge technology in action.</span>
        </motion.p>

        {/* Stats or highlights */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-8 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-muted-foreground">Live demos available</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="text-muted-foreground">
            Built with <span className="font-medium text-foreground">FastAPI</span> +{' '}
            <span className="font-medium text-foreground">React</span>
          </div>
        </motion.div>
      </motion.div>
    </header>
  )
}
