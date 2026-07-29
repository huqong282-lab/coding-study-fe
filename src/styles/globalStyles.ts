import { colors } from './colors'
import { appTheme, type ThemeMode } from './theme'

const variableMap = {
  '--text': 'text',
  '--text-h': 'textHeading',
  '--text-muted': 'textMuted',
  '--bg': 'background',
  '--surface-muted': 'surfaceMuted',
  '--surface-elevated': 'surfaceElevated',
  '--border': 'border',
  '--code-bg': 'codeBackground',
  '--accent': 'accent',
  '--accent-bg': 'accentBackground',
  '--accent-border': 'accentBorder',
} as const

export function applyGlobalTheme(mode: ThemeMode = appTheme.mode) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const tokens = colors[mode]

  root.dataset.theme = mode

  Object.entries(variableMap).forEach(([cssVariable, tokenName]) => {
    root.style.setProperty(cssVariable, tokens[tokenName])
  })
}
