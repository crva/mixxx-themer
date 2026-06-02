export interface ThemeColors {
  // Backgrounds (4 levels like Tango: #1e1e1e / #333 / #252525 / #0f0f0f)
  bgBase: string
  bgSurface: string
  bgElevated: string
  bgDeep: string
  bgDeck1: string
  bgDeck2: string

  // Text
  textPrimary: string
  textSecondary: string
  textMuted: string

  // Controls
  knobBg: string
  knobArc: string
  buttonBg: string
  buttonBgActive: string
  buttonText: string
  buttonTextActive: string

  // Hover / focus borders
  hoverBorder: string
  focusBorder: string

  // Status / active-state colors
  colorPlay: string          // play active, loop indicator on (Tango #ff8000)
  colorCue: string           // hotcue/cue active button bg (Tango #666)
  colorSync: string          // sync active, loop active border (Tango #ff8f00)
  colorRecord: string        // recording indicator (Tango red)
  colorEndOfTrack: string    // waveform end-of-track flash (Tango #00ffff)

  // Waveform
  waveformBg: string
  waveformLow: string
  waveformMid: string
  waveformHigh: string
  waveformPreview: string
  playhead: string

  // Deck accents
  accentDeck1: string
  accentDeck2: string

  // VU Meter
  spinny: string
  vuMeterLow: string
  vuMeterMid: string
  vuMeterHigh: string

  // Crossfader
  crossfaderBg: string
  crossfaderHandle: string

  // Library
  libraryBg: string
  libraryAltBg: string
  libraryText: string
  librarySelectedBg: string
  librarySelectedText: string
  librarySidebarSelectedBg: string

  // Input / search fields
  inputBg: string
  inputText: string
  inputBorder: string

  // Misc
  borderColor: string
}

export interface ThemeSettings {
  fontFamily: string
  fontSizeBase: number       // px
  buttonBorderRadius: number // px
  panelBorderRadius: number  // px
}

export interface ThemeMeta {
  name: string
  author: string
  description: string
  license: string
}

export interface Theme {
  meta: ThemeMeta
  colors: ThemeColors
  settings: ThemeSettings
}

export const defaultColors: ThemeColors = {
  bgBase: '#1a1a2e',
  bgSurface: '#16213e',
  bgElevated: '#0f3460',
  bgDeep: '#0d0d1a',
  bgDeck1: '#1a1a2e',
  bgDeck2: '#1a1a2e',

  textPrimary: '#e0e0e0',
  textSecondary: '#a0a0b0',
  textMuted: '#606070',

  knobBg: '#2a2a3e',
  knobArc: '#e94560',
  buttonBg: '#2a2a3e',
  buttonBgActive: '#e94560',
  buttonText: '#a0a0b0',
  buttonTextActive: '#ffffff',

  hoverBorder: '#888888',
  focusBorder: '#e94560',

  colorPlay: '#e94560',
  colorCue: '#555577',
  colorSync: '#e97045',
  colorRecord: '#cc2200',
  colorEndOfTrack: '#00d4aa',

  waveformBg: '#0d0d1a',
  waveformLow: '#1a6b8a',
  waveformMid: '#e94560',
  waveformHigh: '#f5a623',
  waveformPreview: '#2a2a3e',
  playhead: '#ffffff',

  accentDeck1: '#e94560',
  accentDeck2: '#00d4aa',

  spinny: '#2a2a3e',
  vuMeterLow: '#00d4aa',
  vuMeterMid: '#f5a623',
  vuMeterHigh: '#e94560',
  crossfaderBg: '#2a2a3e',
  crossfaderHandle: '#e94560',

  libraryBg: '#0d0d1a',
  libraryAltBg: '#16162a',
  libraryText: '#909090',
  librarySelectedBg: '#3a3a5e',
  librarySelectedText: '#ffffff',
  librarySidebarSelectedBg: '#2a2a3e',

  inputBg: '#0d0d1a',
  inputText: '#c0c0d0',
  inputBorder: '#3a3a5e',

  borderColor: '#2a2a4e',
}

export const defaultSettings: ThemeSettings = {
  fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
  fontSizeBase: 12,
  buttonBorderRadius: 3,
  panelBorderRadius: 2,
}

export const defaultMeta: ThemeMeta = {
  name: 'MyTheme',
  author: '',
  description: '',
  license: 'Creative Commons Attribution 4.0 International',
}
