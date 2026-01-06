import { motion } from 'framer-motion'

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* KaosMaps mesh gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(199, 0, 155, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(104, 250, 172, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(0, 184, 212, 0.05) 0%, transparent 60%),
            #ffffff
          `
        }}
      />

      {/* Animated orbs - magenta */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{ background: 'rgba(199, 0, 155, 0.06)' }}
      />

      {/* Animated orbs - mint */}
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-3/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[80px]"
        style={{ background: 'rgba(104, 250, 172, 0.06)' }}
      />

      {/* Animated orbs - cyan */}
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -35, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full blur-[60px]"
        style={{ background: 'rgba(0, 184, 212, 0.05)' }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c7009b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
