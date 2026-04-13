'use client'

interface ResultsScreenProps {
  score: number
  total: number
  xp: number
}

export default function ResultsScreen({ score, total, xp }: ResultsScreenProps) {
  const ratio = score / total

  const scoreColor = ratio >= 0.8 ? 'text-brand-success' : 'text-brand-indigo'

  let stars = ''
  if (ratio >= 0.9) stars = '\u2B50\u2B50\u2B50'
  else if (ratio >= 0.7) stars = '\u2B50\u2B50'
  else if (ratio >= 0.5) stars = '\u2B50'

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
      <div className="text-[48px] mb-4">🦉</div>

      <div className={`font-heading font-extrabold text-[56px] leading-none ${scoreColor}`}>
        {score}/{total}
      </div>

      <div className="text-sm text-brand-pencil font-semibold mt-1">
        Questions Correct
      </div>

      {stars && (
        <div className="text-[32px] tracking-[4px] my-4">{stars}</div>
      )}

      <div className="font-mono font-bold text-xl text-brand-indigo bg-brand-indigo/10 px-5 py-2 rounded-full mb-6">
        +{xp} XP
      </div>

      <div className="w-full space-y-3 px-5">
        <button className="w-full py-3.5 rounded-chunky border-[2.5px] border-brand-cream-dark bg-transparent font-heading font-bold text-[15px] text-brand-ink shadow-[0_3px_0_#DDD6CA] text-center">
          Review Mistakes
        </button>
        <button className="w-full py-4 rounded-chunky bg-brand-terracotta text-white font-heading font-bold text-base uppercase tracking-wide shadow-[0_4px_0_#9A4C2D] text-center">
          CONTINUE
        </button>
      </div>
    </div>
  )
}
