'use client'

import { useEffect, useState } from 'react'
import { getVariant, setVariant, type Variant } from '@/lib/ab'

export function ABToggle() {
  const [variant, setLocal] = useState<Variant | null>(null)

  useEffect(() => {
    setLocal(getVariant())
  }, [])

  if (!variant) return null

  function handleSwitch(v: Variant) {
    setVariant(v)
    setLocal(v)
    // Dispatch a custom event so the hero can react without a full page reload
    window.dispatchEvent(new CustomEvent('ab-variant-change', { detail: v }))
  }

  return (
    <div className="flex items-center justify-center gap-2 py-2 bg-brand-cream">
      <span className="font-mono text-[11px] text-brand-ink/50 mr-1">Hero:</span>
      <div className="flex rounded-full overflow-hidden border border-brand-indigo/20">
        <button
          onClick={() => handleSwitch('B')}
          className={`px-3 py-1 text-[12px] font-mono font-semibold transition-colors ${
            variant === 'B'
              ? 'bg-brand-indigo text-white'
              : 'bg-brand-cream text-brand-ink/60 hover:bg-brand-cream-dark'
          }`}
        >
          Option A
        </button>
        <button
          onClick={() => handleSwitch('D')}
          className={`px-3 py-1 text-[12px] font-mono font-semibold transition-colors ${
            variant === 'D'
              ? 'bg-brand-indigo text-white'
              : 'bg-brand-cream text-brand-ink/60 hover:bg-brand-cream-dark'
          }`}
        >
          Option B
        </button>
      </div>
    </div>
  )
}
