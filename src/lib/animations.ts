import type { Variants, TargetAndTransition } from 'framer-motion'

// Card entrance animation (staggered)
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
    },
  }),
}

// Container animation for staggered children
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Card hover animation (21st.dev inspired)
export const cardHover: TargetAndTransition = {
  y: -8,
  scale: 1.02,
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  },
}

// Image scale on card hover
export const imageHover: TargetAndTransition = {
  scale: 1.08,
  transition: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as const,
  },
}

// Badge pop animation
export const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
}

// Background orb float animation
export const orbVariants: Variants = {
  animate: {
    x: [0, 30, 0],
    y: [0, -20, 0],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Button arrow animation
export const arrowVariants: Variants = {
  rest: { x: 0 },
  hover: {
    x: 4,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
}

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
}
