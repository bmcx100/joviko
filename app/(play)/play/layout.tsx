import BottomNav from '@/components/play/BottomNav'

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-brand-parchment-warm min-h-screen flex justify-center">
      <div className="w-full max-w-[480px] relative flex flex-col min-h-screen">
        {children}
        <BottomNav activeTab="trail" />
      </div>
    </div>
  )
}
