import { cn } from '@/lib/utils'

interface GameCardProps {
  name: string
  desc: string
  icon: string
  questions: number
  minutes: number
  locked: boolean
}

export default function GameCard({ name, desc, icon, questions, minutes, locked }: GameCardProps) {
  return (
    <div
      className={cn(
        'group bg-brand-cream border-2 border-brand-cream-dark rounded-chunky p-3.5 flex items-center gap-3.5 cursor-pointer hover:border-brand-indigo transition-colors',
        locked && 'opacity-50 pointer-events-none'
      )}
    >
      <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl bg-brand-indigo/10">
        {icon}
      </div>

      <div>
        <div className="font-bold text-[15px] text-brand-ink">{name}</div>
        <div className="text-xs text-brand-pencil font-semibold mt-0.5">{desc}</div>
        <div className="font-mono font-semibold text-[11px] text-brand-pencil mt-1">
          {questions} questions &middot; ~{minutes} min
        </div>
      </div>

      <span className="text-brand-cream-dark text-xl font-bold ml-auto shrink-0 group-hover:text-brand-indigo">
        &rsaquo;
      </span>
    </div>
  )
}
