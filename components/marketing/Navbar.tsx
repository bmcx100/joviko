'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from '@/components/shared/Logo'

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Games', href: '#games' },
  { label: 'Pricing', href: '#pricing' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-brand-parchment/80 backdrop-blur-xl border-b border-brand-cream-dark">
      <div className="h-16 px-6 max-w-[1200px] mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Logo />

        {/* Center-right: nav links (desktop) */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading font-medium text-[13px] text-brand-pencil hover:text-brand-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: CTA (desktop) */}
        <a
          href="#start"
          className="hidden md:block bg-brand-terracotta text-white font-heading font-bold text-xs px-5 py-2 rounded-button hover:bg-brand-terracotta-light transition-colors"
        >
          Get started free
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-brand-ink"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-brand-parchment flex flex-col"
          >
            {/* Top bar */}
            <div className="h-16 px-6 flex items-center justify-between">
              <Logo />
              <button
                className="p-2 text-brand-ink"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-6 px-6 pt-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-lg font-semibold text-brand-ink hover:text-brand-terracotta transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="px-6 pt-8">
              <a
                href="#start"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-brand-terracotta text-white font-heading font-bold text-sm px-5 py-3 rounded-button hover:bg-brand-terracotta-light transition-colors"
              >
                Get started free
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
