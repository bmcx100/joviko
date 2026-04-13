export default function SessionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 bg-brand-parchment-warm flex justify-center">
      <div className="w-full max-w-[480px] relative flex flex-col h-full overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
