'use client'

import { motion } from 'framer-motion'
import { AppMockup } from '@/components/marketing/AppMockup'

const stagger = (index: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    delay: index * 0.08,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  },
})

export function Hero() {
  return (
    <section className="py-20 lg:py-28">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-12">
        {/* Left column */}
        <div className="lg:w-[60%]">
          <motion.div {...stagger(0)}>
            <span className="font-mono font-semibold text-[11px] uppercase tracking-[0.1em] text-brand-indigo mb-3 block">
              ADAPTIVE LEARNING ENGINE
            </span>
          </motion.div>

          <motion.h1 {...stagger(1)}>
            <span className="font-heading font-extrabold text-[32px] lg:text-[42px] leading-[1.08] tracking-[-0.02em] text-brand-ink block">
              Learning that feels like
            </span>
          </motion.h1>

          <motion.h1 {...stagger(2)}>
            <span className="font-heading font-extrabold text-[32px] lg:text-[42px] leading-[1.05] tracking-tight text-brand-indigo uppercase block">
              AN ADVENTURE.
            </span>
          </motion.h1>

          <motion.p
            {...stagger(3)}
            className="font-body text-brand-pencil text-base leading-relaxed max-w-[420px] mt-4"
          >
            Educational games that develop critical thinking through
            story-driven quests. Real learning data for parents. Pure fun for
            kids.
          </motion.p>

          <motion.div {...stagger(4)}>
            <a
              href="#start"
              className="bg-brand-terracotta text-white font-heading font-bold text-[15px] px-7 py-4 rounded-button mt-6 hover:bg-brand-terracotta-light transition-colors inline-block lg:inline-block w-full lg:w-auto text-center"
            >
              Start Free Trial
            </a>
          </motion.div>

          <motion.p
            {...stagger(5)}
            className="font-body text-brand-pencil text-xs mt-2"
          >
            No credit card required
          </motion.p>
        </div>

        {/* Right column */}
        <div className="lg:w-[40%]">
          <AppMockup />
        </div>
      </div>
    </section>
  )
}
