import { colors } from './colors'

export type ThemeMode = keyof typeof colors

export type ThemeTokens = (typeof colors)[ThemeMode]

export const appTheme = {
  mode: 'dark' as ThemeMode,
  tokens: colors.dark,
}
