import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md'
}

export function Logo({ className, size = 'md' }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'bg-brand-indigo rounded-[10px] flex items-center justify-center text-white',
          size === 'md' ? 'w-8 h-8 text-lg' : 'w-7 h-7 text-base'
        )}
      >
        <span className="font-heading font-extrabold leading-none">J</span>
      </div>
      <span
        className={cn(
          'font-heading font-extrabold text-brand-indigo',
          size === 'md' ? 'text-[17px]' : 'text-[15px]'
        )}
      >
        Joviko
      </span>
    </div>
  )
}
