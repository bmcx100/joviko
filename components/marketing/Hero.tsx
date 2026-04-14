'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getVariant, type Variant } from '@/lib/ab'

const stagger = (index: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    delay: index * 0.08,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  },
})

const copy: Record<Variant, { headline: string[]; subtext: string[] }> = {
  B: {
    headline: ['Buy back their focus.', 'Stop selling their attention.'],
    subtext: [
      'Fun games for them.',
      'Transparent, guided learning for you both.',
    ],
  },
  D: {
    headline: ['Screen time you can be proud of.'],
    subtext: [
      "Their device doesn't have to be a vice. Buy back their focus with games they love and learning you can see.",
    ],
  },
}

export function Hero() {
  const [variant, setVariant] = useState<Variant | null>(null)

  useEffect(() => {
    setVariant(getVariant())

    function handleChange(e: Event) {
      const v = (e as CustomEvent<Variant>).detail
      setVariant(v)
    }

    window.addEventListener('ab-variant-change', handleChange)
    return () => window.removeEventListener('ab-variant-change', handleChange)
  }, [])

  // Show nothing until variant is loaded (avoid flash)
  if (!variant) return null

  const { headline, subtext } = copy[variant]

  return (
    <section className="py-20 lg:py-28">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-12">
        {/* Left column */}
        <div className="lg:w-[60%]">
          <motion.h1 {...stagger(0)} key={`headline-${variant}`}>
            {headline.map((line, i) => (
              <span key={i} className="font-heading font-extrabold text-[32px] lg:text-[42px] leading-[1.08] tracking-[-0.02em] text-brand-ink block">
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.div
            {...stagger(1)}
            key={`subtext-${variant}`}
            className="font-body text-brand-pencil text-base leading-relaxed max-w-[420px] mt-4"
          >
            {subtext.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </motion.div>

          <motion.div {...stagger(2)}>
            <a
              href="/play/session/memory-grid"
              className="bg-brand-terracotta text-white font-heading font-bold text-[15px] px-7 py-4 rounded-button mt-6 hover:bg-brand-terracotta-light transition-colors inline-block lg:inline-block w-full lg:w-auto text-center"
            >
              Try a game
            </a>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="lg:w-[40%]">
          <motion.div
            {...stagger(3)}
            className="bg-brand-parchment-warm rounded-2xl flex items-center justify-center aspect-[4/3] w-full border border-brand-cream-dark"
          >
            <span className="font-body text-brand-pencil text-sm text-center px-6">
              Mom on laptop, son on phone, son leaning up against mother, both engaged and happy, L-sectional couch
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
