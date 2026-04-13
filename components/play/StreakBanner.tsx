interface StreakBannerProps {
  streak: number
}

export default function StreakBanner({ streak }: StreakBannerProps) {
  return (
    <div className="bg-gradient-to-br from-brand-marigold to-brand-terracotta rounded-chunky p-4 flex items-center gap-3 text-white">
      <span className="text-[32px]" role="img" aria-label="fire">
        🔥
      </span>
      <div>
        <div className="font-extrabold text-base">{streak}-Day Streak!</div>
        <div className="text-xs font-semibold opacity-85">Play today to keep it going</div>
      </div>
    </div>
  )
}
