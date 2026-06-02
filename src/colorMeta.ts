import type { ThemeColors } from './types'
import type { Translations } from './i18n/translations'

export const colorTranslationKey: Record<keyof ThemeColors, keyof Translations> = {
  bgBase: 'colorBgBase', bgSurface: 'colorBgSurface', bgElevated: 'colorBgElevated',
  bgDeep: 'colorBgDeep', bgDeck1: 'colorBgDeck1', bgDeck2: 'colorBgDeck2',
  textPrimary: 'colorTextPrimary', textSecondary: 'colorTextSecondary', textMuted: 'colorTextMuted',
  knobBg: 'colorKnobBg', knobArc: 'colorKnobArc',
  buttonBg: 'colorButtonBg', buttonBgActive: 'colorButtonBgActive',
  buttonText: 'colorButtonText', buttonTextActive: 'colorButtonTextActive',
  hoverBorder: 'colorHoverBorder', focusBorder: 'colorFocusBorder',
  colorPlay: 'colorColorPlay', colorCue: 'colorColorCue', colorSync: 'colorColorSync',
  colorRecord: 'colorColorRecord', colorEndOfTrack: 'colorColorEndOfTrack',
  waveformBg: 'colorWaveformBg', waveformLow: 'colorWaveformLow', waveformMid: 'colorWaveformMid',
  waveformHigh: 'colorWaveformHigh', waveformPreview: 'colorWaveformPreview', playhead: 'colorPlayhead',
  accentDeck1: 'colorAccentDeck1', accentDeck2: 'colorAccentDeck2',
  spinny: 'colorSpinny',
  vuMeterLow: 'colorVuMeterLow', vuMeterMid: 'colorVuMeterMid', vuMeterHigh: 'colorVuMeterHigh',
  crossfaderBg: 'colorCrossfaderBg', crossfaderHandle: 'colorCrossfaderHandle',
  libraryBg: 'colorLibraryBg', libraryAltBg: 'colorLibraryAltBg', libraryText: 'colorLibraryText',
  librarySelectedBg: 'colorLibrarySelectedBg', librarySelectedText: 'colorLibrarySelectedText',
  librarySidebarSelectedBg: 'colorLibrarySidebarSelectedBg',
  inputBg: 'colorInputBg', inputText: 'colorInputText', inputBorder: 'colorInputBorder',
  borderColor: 'colorBorderColor',
}

export type ColorSection = { labelKey: keyof Translations; keys: (keyof ThemeColors)[] }

export const colorSections: ColorSection[] = [
  { labelKey: 'sectionBackgrounds', keys: ['bgBase', 'bgSurface', 'bgElevated', 'bgDeep', 'bgDeck1', 'bgDeck2'] },
  { labelKey: 'sectionText', keys: ['textPrimary', 'textSecondary', 'textMuted'] },
  { labelKey: 'sectionDeckAccents', keys: ['accentDeck1', 'accentDeck2'] },
  { labelKey: 'sectionStatusColors', keys: ['colorPlay', 'colorCue', 'colorSync', 'colorRecord', 'colorEndOfTrack'] },
  { labelKey: 'sectionFocusHover', keys: ['hoverBorder', 'focusBorder'] },
  { labelKey: 'sectionButtons', keys: ['buttonBg', 'buttonBgActive', 'buttonText', 'buttonTextActive'] },
  { labelKey: 'sectionKnobs', keys: ['knobBg', 'knobArc'] },
  { labelKey: 'sectionWaveform', keys: ['waveformBg', 'waveformLow', 'waveformMid', 'waveformHigh', 'waveformPreview', 'playhead'] },
  { labelKey: 'sectionVuMeter', keys: ['vuMeterLow', 'vuMeterMid', 'vuMeterHigh'] },
  { labelKey: 'sectionCrossfader', keys: ['crossfaderBg', 'crossfaderHandle'] },
  { labelKey: 'sectionLibrary', keys: ['libraryBg', 'libraryAltBg', 'libraryText', 'librarySelectedBg', 'librarySelectedText', 'librarySidebarSelectedBg'] },
  { labelKey: 'sectionInputFields', keys: ['inputBg', 'inputText', 'inputBorder'] },
  { labelKey: 'sectionMisc', keys: ['spinny', 'borderColor'] },
]
