const COOKIE_NAME = 'jv_hero'
const MAX_AGE_DAYS = 30

export type Variant = 'B' | 'D'

function setCookie(name: string, value: string, days: number) {
  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? match[1] : null
}

/**
 * Get the current A/B variant. If none is set, randomly assign one and persist it.
 */
export function getVariant(): Variant {
  const existing = getCookie(COOKIE_NAME)
  if (existing === 'B' || existing === 'D') {
    return existing
  }
  const variant: Variant = Math.random() < 0.5 ? 'B' : 'D'
  setCookie(COOKIE_NAME, variant, MAX_AGE_DAYS)
  return variant
}

/**
 * Explicitly set the A/B variant (used by the stakeholder toggle).
 */
export function setVariant(v: Variant) {
  setCookie(COOKIE_NAME, v, MAX_AGE_DAYS)
}
