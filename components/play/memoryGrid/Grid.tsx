'use client'

import { useRef, useState, useEffect, memo } from 'react'
import Tile from './Tile'
import { getTileState } from '@/lib/games/memoryGrid/getTileState'
import type { GameState } from '@/lib/games/memoryGrid/types'

interface GridProps {
  state: GameState
  onTapTile: (col: number, row: number) => void
}

const MemoTile = memo(Tile)

function Minimap({ state }: { state: GameState }) {
  const { cols, rows, path, currentStep, freshSteps, permanentSteps } = state
  const cellSize = 6
  const gap = 2
  const width = cols * (cellSize + gap) - gap
  const height = rows * (cellSize + gap) - gap

  // Build a set of path positions for quick lookup
  const pathMap = new Map<string, number>()
  path.forEach((p, i) => pathMap.set(`${p.row},${p.col}`, i))

  const cells = []
  for (let visualRow = 0; visualRow < rows; visualRow++) {
    const gameRow = rows - 1 - visualRow
    for (let col = 0; col < cols; col++) {
      const stepIndex = pathMap.get(`${gameRow},${col}`)
      let fill = 'var(--color-brand-cream-dark)'
      if (stepIndex !== undefined) {
        if (freshSteps.has(stepIndex) || permanentSteps.has(stepIndex)) {
          fill = 'var(--color-brand-success)'
        } else {
          fill = 'var(--color-brand-cream-dark)'
        }
      }
      // Current position marker
      const cur = path[currentStep]
      if (cur && cur.row === gameRow && cur.col === col) {
        fill = 'var(--color-brand-indigo)'
      }

      cells.push(
        <rect
          key={`${gameRow}-${col}`}
          x={col * (cellSize + gap)}
          y={visualRow * (cellSize + gap)}
          width={cellSize}
          height={cellSize}
          rx={1}
          fill={fill}
        />
      )
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="rounded border border-brand-cream-dark/50"
        style={{ maxHeight: '240px' }}
      >
        {cells}
      </svg>
    </div>
  )
}

export default function Grid({ state, onTapTile }: GridProps) {
  const { cols, rows, phase, difficulty } = state
  const gridRef = useRef<HTMLDivElement>(null)
  const [gridNaturalHeight, setGridNaturalHeight] = useState(0)

  const isHard = difficulty === 'hard'
  const isReveal = phase === 'reveal'
  const isWalk = phase === 'walk'
  const gap = 4 // px

  // Current position on the path for adjacency checks
  const currentPos = isWalk ? state.path[state.currentStep] : null

  // Measure natural grid height for hard mode scaling
  useEffect(() => {
    if (isHard && gridRef.current) {
      setGridNaturalHeight(gridRef.current.scrollHeight)
    }
  }, [isHard, rows])

  // Calculate hard-mode transforms
  const containerMaxHeight = 500
  const revealScale =
    gridNaturalHeight > 0
      ? Math.min(1, containerMaxHeight / gridNaturalHeight)
      : 0.4

  // Walk phase: show 8 rows for better visibility
  const activeGameRow = currentPos ? currentPos.row : 0
  const activeVisualRow = rows - 1 - activeGameRow
  const tileApproxSize = gridNaturalHeight > 0 ? gridNaturalHeight / rows : 48
  const visibleRows = 10
  const walkWindowHeight = visibleRows * tileApproxSize
  // Position active row roughly centered in the window
  const targetOffset = activeVisualRow * tileApproxSize - walkWindowHeight / 2 + tileApproxSize / 2
  const clampedOffset = Math.max(0, Math.min(targetOffset, gridNaturalHeight - walkWindowHeight))

  const gridTransform = isHard
    ? isReveal || phase === 'idle'
      ? `scale(${revealScale})`
      : `translateY(-${clampedOffset}px)`
    : 'none'

  const gridOrigin = 'top center'

  // Render tiles: visual row 0 = top of screen = game row (rows-1)
  const tiles = []
  for (let visualRow = 0; visualRow < rows; visualRow++) {
    const gameRow = rows - 1 - visualRow
    for (let col = 0; col < cols; col++) {
      const tileState = getTileState(col, gameRow, state)
      const isAdjacentToCurrent = isWalk && currentPos != null && (
        (Math.abs(currentPos.row - gameRow) === 1 && currentPos.col === col) ||
        (currentPos.row === gameRow && Math.abs(currentPos.col - col) === 1)
      )
      const interactive = isAdjacentToCurrent
      tiles.push(
        <MemoTile
          key={`${gameRow}-${col}`}
          state={tileState}
          interactive={interactive}
          onClick={() => onTapTile(col, gameRow)}
        />
      )
    }
  }

  const gridElement = (
    <div
      ref={gridRef}
      className="grid"
      role="grid"
      aria-label={`Memory grid, ${rows} rows by ${cols} columns`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {tiles}
    </div>
  )

  if (isHard) {
    const showMinimap = isWalk || phase === 'failure'
    return (
      <div className="flex items-start justify-center gap-3">
        <div
          className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] flex-1"
          style={{
            height: isReveal || phase === 'idle' ? `${containerMaxHeight}px` : `${walkWindowHeight}px`,
          }}
        >
          <div
            className="transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              transform: gridTransform,
              transformOrigin: gridOrigin,
            }}
          >
            {gridElement}
          </div>
        </div>
        {showMinimap && (
          <div className="flex-shrink-0 pt-1">
            <Minimap state={state} />
          </div>
        )}
      </div>
    )
  }

  return <div className="mx-5">{gridElement}</div>
}
