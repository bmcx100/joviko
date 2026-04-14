'use client'

import { useReducer, useState, useEffect, useCallback } from 'react'
import { gameReducer } from './gameReducer'
import { generatePath } from './generatePath'
import {
  initialGameState,
  GRID_CONFIG,
  REVEAL_DURATION,
  FAILURE_DELAY,
} from './types'
import type { Difficulty } from './types'

export function useMemoryGrid(revealDuration?: number) {
  const duration = revealDuration ?? REVEAL_DURATION
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const [revealTimeLeft, setRevealTimeLeft] = useState(duration)

  // Reveal countdown timer
  useEffect(() => {
    if (state.phase !== 'reveal') return

    setRevealTimeLeft(duration)

    const interval = setInterval(() => {
      setRevealTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          dispatch({ type: 'END_REVEAL' })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state.phase, state.attempts, duration])

  // Failure delay — auto-transition to new attempt
  useEffect(() => {
    if (state.phase !== 'failure') return

    const timer = setTimeout(() => {
      dispatch({ type: 'NEW_ATTEMPT' })
    }, FAILURE_DELAY)

    return () => clearTimeout(timer)
  }, [state.phase])

  const startGame = useCallback((difficulty: Difficulty) => {
    const config = GRID_CONFIG[difficulty]
    const path = generatePath(config.cols, config.rows, config.pathLength)
    dispatch({ type: 'START_GAME', difficulty, path })
  }, [])

  const tapTile = useCallback((col: number, row: number) => {
    dispatch({ type: 'TAP_TILE', row, col })
  }, [])

  const elapsedTime = state.startTime > 0 ? Date.now() - state.startTime : 0

  return { state, revealTimeLeft, elapsedTime, startGame, tapTile }
}
