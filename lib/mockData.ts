export const mockSessions = [
  { id: '1', date: 'Today, 3:42 PM', topic: 'Number Patterns', score: 9, total: 10, duration: '4:32', xp: 45 },
  { id: '2', date: 'Today, 3:28 PM', topic: 'Addition to 20', score: 8, total: 10, duration: '5:11', xp: 38 },
  { id: '3', date: 'Yesterday', topic: 'Shapes & Geometry', score: 6, total: 10, duration: '6:45', xp: 28 },
  { id: '4', date: 'Apr 11', topic: 'Counting Objects', score: 10, total: 10, duration: '3:58', xp: 50 },
  { id: '5', date: 'Apr 10', topic: 'Subtraction Basics', score: 4, total: 10, duration: '7:22', xp: 18 },
]

export const mockTopics = [
  { id: '1', name: 'Number Patterns', icon: '📐', pct: 85, learned: 34, remaining: 6 },
  { id: '2', name: 'Addition to 20', icon: '➕', pct: 72, learned: 28, remaining: 11 },
  { id: '3', name: 'Shapes & Geometry', icon: '🔷', pct: 45, learned: 18, remaining: 22 },
  { id: '4', name: 'Subtraction Basics', icon: '➖', pct: 30, learned: 12, remaining: 28 },
]

export const mockLeitnerBoxes = [
  { label: 'New', count: 8, level: 1 },
  { label: 'Learning', count: 12, level: 2 },
  { label: 'Review', count: 6, level: 3 },
  { label: 'Known', count: 4, level: 4 },
  { label: 'Mastered', count: 10, level: 5 },
]

export const mockGames = [
  { id: 'memory-grid', name: 'Memory Grid', desc: 'Memorize the path, walk it from memory', icon: '🧠', color: 'brand-indigo', questions: 0, minutes: 5, locked: false, href: '/play/session/memory-grid' },
  { id: '1', name: 'Number Patterns', desc: 'Find the missing number in each sequence', icon: '🔢', color: 'brand-indigo', questions: 10, minutes: 5, locked: true, href: '/play/session' },
  { id: '2', name: 'Addition Quest', desc: 'Add numbers up to 20', icon: '➕', color: 'brand-terracotta', questions: 10, minutes: 5, locked: true, href: '/play/session' },
  { id: '3', name: 'Shape Explorer', desc: 'Identify and compare shapes', icon: '🔷', color: 'brand-success', questions: 10, minutes: 5, locked: true, href: '/play/session' },
  { id: '4', name: 'Word Explorer', desc: 'Build vocabulary through word puzzles', icon: '🔒', color: 'brand-cream-dark', questions: 10, minutes: 5, locked: true, href: '#' },
]

export const mockChild = {
  name: 'Emma',
  initial: 'E',
  grade: 'Grade 1',
  age: 6,
  xp: 340,
  streak: 12,
  bestStreak: 18,
  hearts: 4,
  topicsMastered: 7,
  topicsTotal: 24,
  topicsInProgress: 3,
  timeToday: 14,
  timeGoal: 15,
}
