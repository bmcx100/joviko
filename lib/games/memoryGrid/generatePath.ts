/**
 * Generate a random path from bottom row (index 0) to top row (index rows-1).
 * Returns an array of column indices, one per row.
 * Each step is adjacent: directly above, above-left, or above-right.
 */
export function generatePath(cols: number, rows: number): number[] {
  const path: number[] = []

  path.push(Math.floor(Math.random() * cols))

  for (let row = 1; row < rows; row++) {
    const prev = path[row - 1]
    const options: number[] = [prev]
    if (prev > 0) options.push(prev - 1)
    if (prev < cols - 1) options.push(prev + 1)
    path.push(options[Math.floor(Math.random() * options.length)])
  }

  return path
}
