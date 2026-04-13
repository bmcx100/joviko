'use client'

import { motion } from 'framer-motion'

export function AppMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-brand-parchment-warm rounded-[24px] p-4 shadow-elevated border border-brand-cream-dark"
    >
      {/* Mini status bar */}
      <div className="flex items-center gap-4 mb-3">
        <span className="text-[13px] font-bold text-brand-terracotta">
          &#10084;&#65039; 4
        </span>
        <span className="text-[13px] font-bold text-brand-marigold">
          &#128293; 12
        </span>
        <span className="text-[13px] font-bold text-brand-indigo">
          &#11088; 340
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-brand-parchment-dark mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-indigo-light"
          style={{ width: '60%' }}
        />
      </div>

      {/* Owlbert speech bubble */}
      <div className="flex items-start gap-2 mb-4">
        <div className="w-9 h-9 rounded-full bg-brand-indigo flex items-center justify-center shrink-0 text-lg">
          &#129417;
        </div>
        <div className="bg-brand-parchment-dark rounded-2xl rounded-tl-sm px-3 py-2 text-[13px] font-semibold text-brand-ink">
          Which number comes next in the pattern?
        </div>
      </div>

      {/* Number blocks */}
      <div className="flex items-center gap-2 justify-center mb-4">
        {[2, 4, 6].map((num) => (
          <div
            key={num}
            className="w-9 h-9 rounded-lg bg-brand-indigo text-white font-extrabold text-[15px] flex items-center justify-center"
          >
            {num}
          </div>
        ))}
        <div className="w-9 h-9 rounded-lg bg-brand-parchment-dark border-2 border-dashed border-brand-cream-dark text-brand-pencil font-extrabold text-[15px] flex items-center justify-center">
          ?
        </div>
      </div>

      {/* Answer buttons */}
      <div className="flex items-center gap-2 mb-4">
        {[
          { letter: 'A', value: '7', selected: false },
          { letter: 'B', value: '8', selected: true },
          { letter: 'C', value: '9', selected: false },
        ].map((option) => (
          <div
            key={option.letter}
            className={
              option.selected
                ? 'flex-1 bg-brand-indigo border-2 border-brand-indigo-dark text-white rounded-xl p-2 flex items-center gap-2 text-[13px] font-semibold'
                : 'flex-1 bg-brand-parchment-warm border-2 border-brand-cream-dark rounded-xl p-2 flex items-center gap-2 text-[13px] font-semibold'
            }
          >
            <span
              className={
                option.selected
                  ? 'w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center bg-white/20 text-white'
                  : 'w-5 h-5 rounded text-[11px] font-bold flex items-center justify-center bg-brand-parchment-dark text-brand-pencil'
              }
            >
              {option.letter}
            </span>
            {option.value}
          </div>
        ))}
      </div>

      {/* CHECK button */}
      <div className="bg-brand-terracotta text-white font-bold text-[13px] uppercase tracking-wide text-center py-2.5 rounded-xl">
        Check
      </div>
    </motion.div>
  )
}
