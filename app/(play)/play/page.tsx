'use client'

import { mockChild, mockGames } from '@/lib/mockData'
import GameCard from '@/components/play/GameCard'
import StreakBanner from '@/components/play/StreakBanner'
import { motion } from 'framer-motion'

export default function PlayPage() {
  return (
    <div className="px-5 pt-5 pb-24">
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-full bg-brand-indigo text-white font-bold text-base flex items-center justify-center">
          {mockChild.initial}
        </div>
        <div className="font-mono font-bold text-[13px] text-brand-indigo bg-brand-indigo/10 px-3 py-1.5 rounded-full">
          ⭐ {mockChild.xp} XP
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-4">
        <h1 className="font-heading font-extrabold text-2xl text-brand-ink">
          Hi {mockChild.name}! 👋
        </h1>
        <p className="text-sm text-brand-pencil font-semibold mt-0.5">
          Ready for today&apos;s quest?
        </p>
      </div>

      {/* Streak banner */}
      <div className="mb-5">
        <StreakBanner streak={mockChild.streak} />
      </div>

      {/* Section label */}
      <div className="font-mono font-semibold text-[11px] uppercase tracking-[0.1em] text-brand-pencil mb-3">
        CHOOSE A QUEST
      </div>

      {/* Game list */}
      <div className="space-y-3">
        {mockGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 24,
              delay: index * 0.06,
            }}
          >
            <GameCard
              name={game.name}
              desc={game.desc}
              icon={game.icon}
              questions={game.questions}
              minutes={game.minutes}
              locked={game.locked}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
