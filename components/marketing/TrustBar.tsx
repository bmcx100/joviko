export function TrustBar() {
  const items = [
    { icon: '\u2728', label: 'Free to start' },
    { icon: '\uD83D\uDCDA', label: 'Curriculum aligned' },
    { icon: '\uD83D\uDD12', label: 'COPPA compliant' },
    { icon: '\uD83D\uDEAB', label: 'No ads, ever' },
    { icon: '\uD83D\uDCF1', label: 'No app store redirects' },
    { icon: '\uD83D\uDEAB\uD83D\uDCB3', label: 'No in-app purchases' },
  ]

  return (
    <div className="py-6 flex flex-wrap justify-center gap-x-10 gap-y-3 border-t border-b border-brand-parchment-dark">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 font-heading font-semibold text-[13px] text-brand-pencil"
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
