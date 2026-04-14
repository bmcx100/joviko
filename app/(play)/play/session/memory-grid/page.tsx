'use client'

import { useMemoryGrid } from '@/lib/games/memoryGrid/useMemoryGrid'
import GameHeader from '@/components/play/memoryGrid/GameHeader'
import Grid from '@/components/play/memoryGrid/Grid'
import DifficultySelector from '@/components/play/memoryGrid/DifficultySelector'
import MascotBubble from '@/components/play/MascotBubble'

export default function MemoryGridPage() {
  const { state, revealTimeLeft, startGame, tapTile } = useMemoryGrid()

  if (state.phase === 'idle') {
    return <DifficultySelector onSelect={startGame} />
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

      <div className="px-5 pb-6">
        <div className="text-center font-mono font-semibold text-xs text-brand-pencil">
          {state.phase === 'reveal' && 'Watch carefully...'}
          {state.phase === 'walk' && `Row ${state.currentRow + 1} of ${state.rows}`}
          {state.phase === 'failure' && 'Starting new attempt...'}
        </div>
      </div>
    </div>
  )
}
