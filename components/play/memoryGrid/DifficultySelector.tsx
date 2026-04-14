'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Difficulty } from '@/lib/games/memoryGrid/types'

const VIEW_TIME_KEY = 'memoryGrid:viewTime'
const VIEW_TIME_OPTIONS = [5, 10, 15, 20, 30]
const DEFAULT_VIEW_TIME = 10

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty, viewTime: number) => void
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

export default function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const [viewTime, setViewTime] = useState(DEFAULT_VIEW_TIME)

  useEffect(() => {
    const stored = localStorage.getItem(VIEW_TIME_KEY)
    if (stored) {
      const parsed = parseInt(stored, 10)
      if (VIEW_TIME_OPTIONS.includes(parsed)) setViewTime(parsed)
    }
  }, [])

  const handleViewTimeChange = (time: number) => {
    setViewTime(time)
    localStorage.setItem(VIEW_TIME_KEY, String(time))
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      <div className="text-[48px] mb-4">🧠</div>

      <h1 className="font-heading font-extrabold text-2xl text-brand-ink mb-2">
        Memory Grid
      </h1>

      <p className="text-sm text-brand-pencil font-semibold mb-8 max-w-[280px]">
        Memorize the path, then walk it from memory. Wrong steps end your attempt — but
        each try reveals more of the path.
      </p>

      <div className="w-full space-y-3 mb-6">
        <motion.button
          className="w-full py-4 rounded-chunky bg-brand-indigo text-white font-heading font-bold text-base shadow-[0_4px_0_#2E4563] cursor-pointer"
          whileTap={{ y: 4 }}
          transition={springTransition}
          onClick={() => onSelect('easy', viewTime)}
        >
          <div>EASY</div>
          <div className="font-mono font-semibold text-xs text-white/70 mt-0.5">
            8 × 12 grid
          </div>
        </motion.button>

        <motion.button
          className="w-full py-4 rounded-chunky bg-brand-terracotta text-white font-heading font-bold text-base shadow-[0_4px_0_#9A4C2D] cursor-pointer"
          whileTap={{ y: 4 }}
          transition={springTransition}
          onClick={() => onSelect('hard', viewTime)}
        >
          <div>HARD</div>
          <div className="font-mono font-semibold text-xs text-white/70 mt-0.5">
            8 × 23 grid
          </div>
        </motion.button>
      </div>

      <div className="w-full">
        <div className="text-xs font-semibold text-brand-pencil mb-2">View Time</div>
        <div className="flex justify-center gap-2">
          {VIEW_TIME_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => handleViewTimeChange(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                viewTime === t
                  ? 'bg-brand-indigo text-white'
                  : 'bg-brand-cream-dark text-brand-pencil'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
