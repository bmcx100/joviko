'use client'

import { motion } from 'framer-motion'
import type { Difficulty } from '@/lib/games/memoryGrid/types'

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

export default function DifficultySelector({ onSelect }: DifficultySelectorProps) {
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

      <div className="w-full space-y-3">
        <motion.button
          className="w-full py-4 rounded-chunky bg-brand-indigo text-white font-heading font-bold text-base shadow-[0_4px_0_#2E4563] cursor-pointer"
          whileTap={{ y: 4 }}
          transition={springTransition}
          onClick={() => onSelect('easy')}
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
          onClick={() => onSelect('hard')}
        >
          <div>HARD</div>
          <div className="font-mono font-semibold text-xs text-white/70 mt-0.5">
            8 × 23 grid
          </div>
        </motion.button>
      </div>
    </div>
  )
}
