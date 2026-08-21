import { motion, type HTMLMotionProps } from 'motion/react'

export interface FadeInProps extends HTMLMotionProps<'div'> {
  delay?: number
}

/** Applies the approved viewport entrance transition to below-fold content. */
export function FadeIn({ delay = 0, children, ...props }: FadeInProps) {
  return <motion.div initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }} whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }} viewport={{ once: false, margin: '-80px' }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }} {...props}>{children}</motion.div>
}
