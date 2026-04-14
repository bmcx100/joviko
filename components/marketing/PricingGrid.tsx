'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'All games',
      'Basic progress reports',
      'Grade-level questions',
      'Unlimited play',
    ],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    features: [
      'Everything in Free',
      'Custom curriculum matching',
      'Full progress dashboard',
      'School-specific content',
    ],
    cta: 'Start Pro',
    highlighted: true,
  },
  {
    name: 'Groups',
    price: 'Custom',
    period: 'per student / month',
    features: [
      'Everything in Pro',
      'Unlimited students',
      'Teacher dashboard',
      'Volume discounts',
    ],
    cta: 'Contact Us',
    highlighted: false,
  },
]

export function PricingGrid() {
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <h2 className="font-heading font-extrabold text-[32px] text-center mb-12 text-brand-ink">
        Simple Pricing
      </h2>
      <div className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            className={cn(
              'rounded-card p-7 text-center',
              tier.highlighted
                ? 'bg-brand-indigo text-white ring-2 ring-brand-indigo md:scale-[1.03] shadow-elevated'
                : 'bg-brand-cream border border-brand-cream-dark'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
          >
            <p
              className={cn(
                'font-heading font-bold text-sm mb-2',
                tier.highlighted ? 'text-white/70' : ''
              )}
            >
              {tier.name}
            </p>
            <p className="font-mono font-bold text-[36px]">{tier.price}</p>
            <p
              className={cn(
                'text-[13px] mb-4',
                tier.highlighted ? 'text-white/60' : 'text-brand-pencil'
              )}
            >
              {tier.period}
            </p>
            <ul className="text-left space-y-2 mb-6">
              {tier.features.map((feature) => (
                <li key={feature} className="text-sm">
                  <span className="mr-1">{'\u2713'}</span> {feature}
                </li>
              ))}
            </ul>
            <button
              className={cn(
                'w-full py-3 rounded-button font-heading font-bold text-sm transition-colors',
                tier.highlighted
                  ? 'bg-brand-terracotta text-white hover:bg-brand-terracotta-light'
                  : 'bg-brand-indigo text-white hover:bg-brand-indigo-light'
              )}
            >
              {tier.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
