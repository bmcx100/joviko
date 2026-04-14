import type { Metadata } from 'next'
import { Nunito, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Joviko',
  description: 'Fun games for kids. Transparent, guided learning for parents. No ads, ever.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${ibmPlexMono.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  )
}
