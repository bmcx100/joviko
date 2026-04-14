import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Domain-based routing middleware.
 *
 * - games.* subdomain → serves only /play routes (kids' game shell)
 * - main domain       → serves marketing + dashboard, redirects /play to games subdomain
 *
 * In development, use localhost:3000 as main domain and
 * games.localhost:3000 as the games subdomain (add to /etc/hosts or use
 * NEXT_PUBLIC_GAMES_DOMAIN env var to override).
 */

const GAMES_SUBDOMAIN_PREFIX = 'games.'

function isGamesDomain(host: string): boolean {
  // Strip port for comparison
  const hostname = host.split(':')[0]
  return hostname.startsWith(GAMES_SUBDOMAIN_PREFIX)
}

function getMainDomain(host: string): string {
  const [hostname, port] = host.split(':')
  const main = hostname.replace(GAMES_SUBDOMAIN_PREFIX, '')
  return port ? `${main}:${port}` : main
}

function getGamesDomain(host: string): string {
  const [hostname, port] = host.split(':')
  const games = hostname.startsWith(GAMES_SUBDOMAIN_PREFIX)
    ? hostname
    : `${GAMES_SUBDOMAIN_PREFIX}${hostname}`
  return port ? `${games}:${port}` : games
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const { pathname } = request.nextUrl
  const protocol = request.nextUrl.protocol

  // In development, skip domain routing so /play works on localhost
  if (process.env.NODE_ENV === 'development' && !isGamesDomain(host)) {
    return NextResponse.next()
  }

  // --- Games subdomain (games.edtech.com) ---
  if (isGamesDomain(host)) {
    // Root → rewrite to /play (so kids see game selector at games.edtech.com/)
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/play', request.url))
    }

    // Allow /play/* routes as-is
    if (pathname.startsWith('/play')) {
      return NextResponse.next()
    }

    // Allow static assets and API routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // Block everything else — redirect to main domain
    const mainDomain = getMainDomain(host)
    return NextResponse.redirect(
      new URL(`${protocol}//${mainDomain}${pathname}`)
    )
  }

  // --- Main domain (edtech.com) ---
  // Redirect /play/* to games subdomain
  if (pathname.startsWith('/play')) {
    const gamesDomain = getGamesDomain(host)
    const gamePath = pathname === '/play' ? '/' : pathname.replace('/play', '')
    return NextResponse.redirect(
      new URL(`${protocol}//${gamesDomain}${gamePath}`)
    )
  }

  // Everything else (marketing, dashboard) passes through
  return NextResponse.next()
}

export const config = {
  // Match all paths except static files and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
