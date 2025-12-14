'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export type ScrollRevealDirection = 'up' | 'left' | 'right';

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: ScrollRevealDirection;
  delay?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
}: ScrollRevealProps) {
  const initial = {
    opacity: 0,
    y: direction === 'up' ? 30 : 0,
    x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
  };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
