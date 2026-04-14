import { ABToggle } from '@/components/marketing/ABToggle'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="noise-overlay">
      <ABToggle />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
