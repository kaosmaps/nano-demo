import { motion } from 'framer-motion'
import { Github, Mail, ExternalLink } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-auto py-8 border-t border-border/50"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <div className="text-sm text-muted-foreground">
          &copy; {currentYear} KaosMaps. All rights reserved.
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/kaosmaps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="mailto:hello@kaosmaps.com"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm"
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </a>
          <a
            href="https://kaosmaps.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Main Site</span>
          </a>
        </div>

        {/* Tech attribution */}
        <div className="text-xs text-muted-foreground/60">
          Built with React + Vite + shadcn/ui
        </div>
      </div>
    </motion.footer>
  )
}
