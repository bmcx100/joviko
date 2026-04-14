export type Difficulty = 'easy' | 'hard'

export type GamePhase = 'idle' | 'reveal' | 'walk' | 'failure' | 'victory'

export type TileVisualState =
  | 'default'
  | 'revealed'
  | 'active'
  | 'correct-fresh'
  | 'correct-permanent'
  | 'wrong'

export interface GameState {
  difficulty: Difficulty
  cols: number
  rows: number
  path: number[]
  phase: GamePhase
  currentRow: number
  permanentRows: Set<number>
  freshRows: Set<number>
  wrongTile: { row: number; col: number } | null
  attempts: number
  startTime: number
}

export type GameAction =
  | { type: 'START_GAME'; difficulty: Difficulty; path: number[] }
  | { type: 'END_REVEAL' }
  | { type: 'TAP_TILE'; col: number }
  | { type: 'NEW_ATTEMPT' }

export const GRID_CONFIG = {
  easy: { cols: 8, rows: 12 },
  hard: { cols: 8, rows: 23 },
} as const

export const REVEAL_DURATION = 10

export const FAILURE_DELAY = 800

export const initialGameState: GameState = {
  difficulty: 'easy',
  cols: 8,
  rows: 12,
  path: [],
  phase: 'idle',
  currentRow: 0,
  permanentRows: new Set(),
  freshRows: new Set(),
  wrongTile: null,
  attempts: 0,
  startTime: 0,
}
