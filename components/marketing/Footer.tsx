const productLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Games', href: '#games' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'For Schools', href: '#schools' },
]

const companyLinks = [
  { label: 'About', href: '#about' },
  { label: 'Blog', href: '#blog' },
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
]

export function Footer() {
  return (
    <footer className="bg-brand-ink rounded-t-[2rem] mt-16 py-12 px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 md:gap-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-heading font-bold text-brand-parchment text-[17px]">
                Joviko
              </span>
            </div>
            <p className="font-body text-sm text-brand-parchment/60 leading-relaxed max-w-[300px]">
              Fun games for kids. Guided learning for parents.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="font-mono font-semibold text-[11px] uppercase tracking-[0.08em] text-brand-parchment/40 mb-4">
              Product
            </h3>
            {productLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-[13px] text-brand-parchment/60 hover:text-brand-parchment py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-mono font-semibold text-[11px] uppercase tracking-[0.08em] text-brand-parchment/40 mb-4">
              Company
            </h3>
            {companyLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-[13px] text-brand-parchment/60 hover:text-brand-parchment py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div className="mt-8 pt-4 border-t border-brand-parchment/10">
          <p className="font-mono text-[11px] text-brand-parchment/40">
            &copy; 2026 Joviko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
