import { describe, it, expect } from 'vitest'
import { generatePath } from './generatePath'

describe('generatePath', () => {
  it('returns an array with length equal to rows', () => {
    const path = generatePath(8, 12)
    expect(path).toHaveLength(12)
  })

  it('each column index is within bounds [0, cols)', () => {
    const path = generatePath(8, 23)
    for (const col of path) {
      expect(col).toBeGreaterThanOrEqual(0)
      expect(col).toBeLessThan(8)
    }
  })

  it('each step is adjacent to the previous (above, above-left, or above-right)', () => {
    const path = generatePath(8, 23)
    for (let i = 1; i < path.length; i++) {
      const diff = Math.abs(path[i] - path[i - 1])
      expect(diff).toBeLessThanOrEqual(1)
    }
  })

  it('produces different paths on different calls (probabilistic)', () => {
    const paths = Array.from({ length: 20 }, () => generatePath(8, 12))
    const unique = new Set(paths.map((p) => p.join(',')))
    expect(unique.size).toBeGreaterThan(1)
  })

  it('works with small grids', () => {
    const path = generatePath(3, 2)
    expect(path).toHaveLength(2)
    expect(path[0]).toBeGreaterThanOrEqual(0)
    expect(path[0]).toBeLessThan(3)
    expect(Math.abs(path[1] - path[0])).toBeLessThanOrEqual(1)
  })

  it('handles single-column grid (only one possible path)', () => {
    const path = generatePath(1, 5)
    expect(path).toHaveLength(5)
    expect(path.every((col) => col === 0)).toBe(true)
  })
})
