'use client'

import { useState, useCallback } from 'react'
import { useMemoryGrid } from '@/lib/games/memoryGrid/useMemoryGrid'
import GameHeader from '@/components/play/memoryGrid/GameHeader'
import Grid from '@/components/play/memoryGrid/Grid'
import DifficultySelector from '@/components/play/memoryGrid/DifficultySelector'
import GameResults from '@/components/play/memoryGrid/GameResults'
import MascotBubble from '@/components/play/MascotBubble'
import type { Difficulty } from '@/lib/games/memoryGrid/types'

export default function MemoryGridPage() {
  const [viewTime, setViewTime] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('memoryGrid:viewTime')
      if (stored) return parseInt(stored, 10)
    }
    return 10
  })
  const { state, revealTimeLeft, elapsedTime, startGame, tapTile } = useMemoryGrid(viewTime)
  const [finalTime, setFinalTime] = useState(0)

  const handleStart = useCallback(
    (difficulty: Difficulty, selectedViewTime: number) => {
      setViewTime(selectedViewTime)
      localStorage.setItem('memoryGrid:viewTime', String(selectedViewTime))
      setFinalTime(0)
      startGame(difficulty)
    },
    [startGame]
  )

  // Capture elapsed time at victory
  if (state.phase === 'victory' && finalTime === 0) {
    setFinalTime(elapsedTime)
  }

  if (state.phase === 'idle') {
    return <DifficultySelector onSelect={handleStart} />
  }

  if (state.phase === 'victory') {
    return (
      <GameResults
        attempts={state.attempts}
        elapsedMs={finalTime}
        difficulty={state.difficulty}
        rows={state.rows}
        cols={state.cols}
        onPlayAgain={() => handleStart(state.difficulty, viewTime)}
      />
    )
  }

  const phaseMessage =
    state.phase === 'reveal'
      ? 'Memorize the path!'
      : state.phase === 'walk'
        ? 'Walk the path from memory!'
        : state.phase === 'failure'
          ? 'Oops! Wrong tile.'
          : ''

  return (
    <div className="flex flex-col h-full">
      <GameHeader
        phase={state.phase}
        timeLeft={revealTimeLeft}
        attempts={state.attempts}
      />

      {phaseMessage && <MascotBubble message={phaseMessage} />}

      <div className="flex-1 flex flex-col justify-center pb-6">
        <Grid state={state} onTapTile={tapTile} />
      </div>

    </div>
  )
}
