import JSZip from 'jszip'
import type { Theme, ThemeColors, ThemeMeta, ThemeSettings } from './types'
import { defaultColors, defaultSettings, defaultMeta } from './types'

export interface ImportResult {
  theme: Theme
  mapped: Array<{ token: string; source: string; value: string }>
  warnings: string[]
}

// ── Public entry points ───────────────────────────────────────────────────────

export async function parseSkinZip(file: File): Promise<ImportResult> {
  const zip = await JSZip.loadAsync(file)
  let skinXml: string | null = null
  let styleQss: string | null = null

  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue
    const name = path.split('/').pop()!.toLowerCase()
    if (name === 'skin.xml' && !skinXml) skinXml = await entry.async('text')
    if ((name === 'style.qss' || name === 'style-dark.qss') && !styleQss)
      styleQss = await entry.async('text')
  }
  if (!skinXml) throw new Error('No skin.xml found in the ZIP.')
  return parseSkinFiles(skinXml, styleQss)
}

export async function parseSkinFiles(
  skinXml: string,
  styleQss: string | null,
): Promise<ImportResult> {
  const parser = new DOMParser()
  const doc = parser.parseFromString(skinXml, 'text/xml')

  const meta = parseMeta(doc)
  const setVars = parseSetVariables(doc)
  const schemeColors = parseSchemeColors(doc)
  const qssMap = styleQss ? parseQss(styleQss) : {}

  const mapped: ImportResult['mapped'] = []
  const warnings: string[] = []

  const colors = buildColors(setVars, schemeColors, qssMap, mapped, warnings)
  const settings = buildSettings(qssMap, mapped)

  return { theme: { meta, colors, settings }, mapped, warnings }
}

// ── Parsers ───────────────────────────────────────────────────────────────────

function parseMeta(doc: Document): ThemeMeta {
  const text = (sel: string) =>
    doc.querySelector(sel)?.textContent?.trim() ?? ''
  return {
    name: text('manifest title') || text('skin title') || defaultMeta.name,
    author: text('manifest author') || '',
    description: text('manifest description') || '',
    license: text('manifest license') || defaultMeta.license,
  }
}

function parseSetVariables(doc: Document): Record<string, string> {
  const result: Record<string, string> = {}
  doc.querySelectorAll('SetVariable[name]').forEach(el => {
    const name = el.getAttribute('name')!
    const raw = el.textContent?.trim() ?? ''
    // Skip variables that reference other variables
    if (raw.startsWith('<') || raw.includes('Variable')) return
    const val = normalizeColor(raw)
    if (val) result[name] = val
  })
  doc.querySelectorAll('variable[name]').forEach(el => {
    const name = el.getAttribute('name')!
    const val = normalizeColor(el.textContent?.trim() ?? '')
    if (val) result[name] = val
  })
  return result
}

function parseSchemeColors(doc: Document): Record<string, string> {
  const result: Record<string, string> = {}
  const scheme = doc.querySelector('scheme') ?? doc.querySelector('schemes scheme')
  if (!scheme) return result
  scheme.querySelectorAll('*').forEach(el => {
    const val = normalizeColor(el.textContent?.trim() ?? '')
    if (val) result[el.tagName] = val
  })
  return result
}

function parseQss(qss: string): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {}
  const cleaned = qss.replace(/\/\*[\s\S]*?\*\//g, '')
  const blockRe = /([^{}]+)\{([^{}]*)\}/g
  let m: RegExpExecArray | null

  while ((m = blockRe.exec(cleaned)) !== null) {
    const selectors = m[1].split(',').map(s => s.trim()).filter(Boolean)
    const body = m[2]
    const props: Record<string, string> = {}
    const propRe = /([\w-]+)\s*:\s*([^;]+)/g
    let pm: RegExpExecArray | null

    while ((pm = propRe.exec(body)) !== null) {
      const prop = pm[1].trim().toLowerCase()
      const rawVal = pm[2].replace(/!important/i, '').trim()

      if (COLOR_PROPS.has(prop)) {
        const color = normalizeColor(rawVal)
        if (color) props[prop] = color
      } else if (prop === 'font-family') {
        props[prop] = rawVal.replace(/['"]/g, '').split(',')[0].trim()
      } else if (prop === 'font-size') {
        const px = rawVal.match(/(\d+)px/)
        if (px) props[prop] = px[1]
      } else if (prop === 'border-radius') {
        const px = rawVal.match(/(\d+)px/)
        if (px) props[prop] = px[1]
      }
    }

    if (Object.keys(props).length === 0) continue
    for (const sel of selectors) {
      const key = sel.replace(/\s+/g, ' ').toLowerCase()
      result[key] = { ...(result[key] ?? {}), ...props }
    }
  }
  return result
}

// ── Color mapping ─────────────────────────────────────────────────────────────

function buildColors(
  vars: Record<string, string>,
  scheme: Record<string, string>,
  qss: Record<string, Record<string, string>>,
  mapped: ImportResult['mapped'],
  warnings: string[],
): ThemeColors {
  const colors = { ...defaultColors }

  function assign(token: keyof ThemeColors, candidates: Array<{ src: string; val: string | undefined }>) {
    for (const { src, val } of candidates) {
      if (val) {
        colors[token] = val
        mapped.push({ token, source: src, value: val })
        return
      }
    }
    warnings.push(`"${token}" — kept default ${defaultColors[token]}`)
  }

  const v = varLookup(vars)
  const s = schemeLookup(scheme)
  const q = qssLookup(qss)

  // ── Backgrounds ──────────────────────────────────────────────────────────
  assign('bgBase', [
    v('BgBase', 'Background', 'BgColor'),
    s('BgColor', 'BgColorBase'),
    q('#mixxx', 'background-color'),
    q('#skincontainer', 'background-color'),
    q('wwidget', 'background-color'),
  ])

  assign('bgSurface', [
    v('BgSurface', 'BgSecondary'),
    s('BgColorSecondary'),
    q('#unconfiguredheadphonetopbar', 'background-color'),
    { src: 'derived', val: lighten(colors.bgBase, 0.1) },
  ])

  assign('bgElevated', [
    v('BgElevated'),
    { src: 'derived', val: lighten(colors.bgBase, 0.05) },
  ])

  assign('bgDeep', [
    v('BgDeep', 'WaveformBg'),
    s('BgColorDeep'),
    q('#hotcues_sampler_preview', 'background-color'),
    q('#deckoverviewrow1', 'background-color'),
    { src: 'derived', val: darken(colors.bgBase, 0.35) },
  ])

  assign('bgDeck1', [
    v('SignalBgColor_12', 'BgDeck1'),
    { src: 'derived', val: colors.bgBase },
  ])

  assign('bgDeck2', [
    v('SignalBgColor_34', 'BgDeck2'),
    { src: 'derived', val: colors.bgBase },
  ])

  // ── Text ─────────────────────────────────────────────────────────────────
  assign('textPrimary', [
    v('FgColor', 'TextPrimary', 'TextColor'),
    s('FgColor', 'TextColor'),
    q('wlabel', 'color'),
    q('wwidget', 'color'),
  ])

  assign('textSecondary', [
    v('TextSecondary', 'FgColorSecondary'),
    { src: 'derived', val: darken(colors.textPrimary, 0.15) },
  ])

  assign('textMuted', [
    v('TextMuted'),
    { src: 'derived', val: darken(colors.textPrimary, 0.4) },
  ])

  // ── Deck accents ─────────────────────────────────────────────────────────
  assign('accentDeck1', [
    v('SignalColor_12', 'AccentDeck1', 'Accent'),
    q('qprogressbar::chunk', 'background-color'),
    s('AccentColor'),
  ])

  assign('accentDeck2', [
    v('SignalColor_34', 'AccentDeck2'),
    { src: 'derived', val: complementary(colors.accentDeck1) },
  ])

  // ── Status colors ─────────────────────────────────────────────────────────
  assign('colorPlay', [
    v('PlayColor', 'PlayActiveColor'),
    q('#playcue[displayvalue="1"]', 'background-color'),
    q('#playindicator[value="1"]', 'background-color'),
    { src: 'derived', val: colors.accentDeck1 },
  ])

  assign('colorCue', [
    v('CueActiveColor', 'HotcueBg'),
    q('#hotcuebutton[displayvalue="1"]', 'background-color'),
    q('#cueunderlay[displayvalue="1"]', 'background-color'),
    { src: 'derived', val: lighten(colors.bgBase, 0.25) },
  ])

  assign('colorSync', [
    v('SyncColor', 'SyncActiveColor', 'LoopColor'),
    q('#reloopbutton[displayvalue="1"]', 'background-color'),
    q('#loopsizebutton[displayvalue="1"]', 'border-color'),
    { src: 'derived', val: lighten(colors.accentDeck1, 0.2) },
  ])

  assign('colorRecord', [
    v('RecordColor', 'RecordingColor'),
    q('#recordingbutton[displayvalue="1"]', 'background-color'),
    { src: 'derived', val: '#cc2200' },
  ])

  assign('colorEndOfTrack', [
    v('EndOfTrackColor'),
    { src: 'derived', val: colors.accentDeck2 },
  ])

  // ── Hover / focus ─────────────────────────────────────────────────────────
  assign('hoverBorder', [
    v('HoverBorder'),
    { src: 'derived', val: lighten(colors.bgBase, 0.45) },
  ])

  assign('focusBorder', [
    v('FocusBorder'),
    q('wtrackpropertyeditor', 'border-color'),
    q('wtracktableview:focus', 'border-color'),
    { src: 'derived', val: colors.accentDeck1 },
  ])

  // ── Buttons ───────────────────────────────────────────────────────────────
  assign('buttonBg', [
    v('ButtonBg', 'ButtonColor', 'BtnBg'),
    q('wpushbutton', 'background-color'),
    { src: 'derived', val: lighten(colors.bgBase, 0.08) },
  ])

  assign('buttonBgActive', [
    v('ButtonBgActive', 'ButtonActiveColor'),
    q('wpushbutton:checked', 'background-color'),
    q('wpushbutton:pressed', 'background-color'),
    { src: 'derived', val: colors.accentDeck1 },
  ])

  assign('buttonText', [
    v('ButtonText', 'BtnText'),
    q('wpushbutton', 'color'),
    { src: 'derived', val: colors.textMuted },
  ])

  assign('buttonTextActive', [
    v('ButtonTextActive'),
    q('wpushbutton:checked', 'color'),
    { src: 'derived', val: '#ffffff' },
  ])

  // ── Knobs ─────────────────────────────────────────────────────────────────
  assign('knobBg', [
    v('KnobBg'),
    q('wknob', 'background-color'),
    { src: 'derived', val: lighten(colors.bgBase, 0.08) },
  ])

  assign('knobArc', [
    v('KnobArc', 'KnobColor', 'PotiColor'),
    { src: 'derived', val: colors.accentDeck1 },
  ])

  // ── Waveform ──────────────────────────────────────────────────────────────
  assign('waveformBg', [
    v('WaveformBg', 'WaveformBackground', 'SignalBgColor'),
    q('wwaveform', 'background-color'),
    { src: 'derived', val: colors.bgDeep },
  ])

  assign('waveformLow', [
    v('SignalRGBLowColor', 'WaveformLow', 'WaveformColorLow'),
  ])

  assign('waveformMid', [
    v('SignalRGBMidColor', 'WaveformMid', 'WaveformColorMid', 'SignalColor'),
    { src: 'derived', val: colors.accentDeck1 },
  ])

  assign('waveformHigh', [
    v('SignalRGBHighColor', 'WaveformHigh', 'WaveformColorHigh'),
  ])

  assign('waveformPreview', [
    v('WaveformPreview', 'PlayedOverlayColor'),
    { src: 'derived', val: lighten(colors.waveformBg, 0.06) },
  ])

  assign('playhead', [
    v('Playhead', 'PlayheadColor', 'PositionMarkerColor'),
    { src: 'derived', val: '#ffffff' },
  ])

  // ── VU meter ──────────────────────────────────────────────────────────────
  assign('vuMeterLow', [v('VuLow', 'VuMeterLow'), { src: 'derived', val: '#00d4aa' }])
  assign('vuMeterMid', [v('VuMid', 'VuMeterMid'), { src: 'derived', val: '#f5a623' }])
  assign('vuMeterHigh', [v('VuHigh', 'VuMeterHigh'), { src: 'derived', val: colors.accentDeck1 }])

  // ── Crossfader ────────────────────────────────────────────────────────────
  assign('crossfaderBg', [
    v('CrossfaderBg'),
    { src: 'derived', val: lighten(colors.bgBase, 0.06) },
  ])
  assign('crossfaderHandle', [
    v('CrossfaderHandle'),
    { src: 'derived', val: colors.accentDeck1 },
  ])

  // ── Library ───────────────────────────────────────────────────────────────
  assign('libraryBg', [
    v('LibraryBg'),
    q('wtracktableview', 'background-color'),
    q('wlibrarytextbrowser', 'background-color'),
    { src: 'derived', val: colors.bgDeep },
  ])

  assign('libraryAltBg', [
    v('LibraryAltBg'),
    q('wtracktableview', 'alternate-background-color'),
    { src: 'derived', val: lighten(colors.libraryBg, 0.06) },
  ])

  assign('libraryText', [
    v('LibraryText'),
    q('wtracktableview', 'color'),
    q('wlibrarysidebar', 'color'),
    { src: 'derived', val: colors.textMuted },
  ])

  assign('librarySelectedBg', [
    v('LibrarySelectedBg'),
    q('wtracktableview', 'selection-background-color'),
    { src: 'derived', val: lighten(colors.bgBase, 0.2) },
  ])

  assign('librarySelectedText', [
    v('LibrarySelectedText'),
    q('wtracktableview', 'selection-color'),
    { src: 'derived', val: '#ffffff' },
  ])

  assign('librarySidebarSelectedBg', [
    v('LibrarySidebarSelectedBg'),
    q('wlibrarysidebar::item:selected', 'background-color'),
    { src: 'derived', val: lighten(colors.bgBase, 0.12) },
  ])

  // ── Input fields ──────────────────────────────────────────────────────────
  assign('inputBg', [
    v('InputBg'),
    q('wsearchlineedit', 'background-color'),
    q('wbeatspinbox', 'background-color'),
    { src: 'derived', val: colors.bgDeep },
  ])

  assign('inputText', [
    v('InputText'),
    q('wsearchlineedit', 'color'),
    q('wbeatspinbox', 'color'),
    { src: 'derived', val: colors.textSecondary },
  ])

  assign('inputBorder', [
    v('InputBorder'),
    q('wbeatspinbox', 'border-color'),
    { src: 'derived', val: lighten(colors.bgBase, 0.25) },
  ])

  // ── Spinny + misc ─────────────────────────────────────────────────────────
  assign('spinny', [
    v('SpinnyBg', 'SpinnyColor'),
    { src: 'derived', val: lighten(colors.bgBase, 0.06) },
  ])

  assign('borderColor', [
    v('BorderColor', 'Border', 'DividerColor'),
    s('BorderColor'),
    { src: 'derived', val: lighten(colors.bgBase, 0.15) },
  ])

  return colors
}

// ── Settings mapping ──────────────────────────────────────────────────────────

function buildSettings(
  qss: Record<string, Record<string, string>>,
  mapped: ImportResult['mapped'],
): ThemeSettings {
  const settings = { ...defaultSettings }

  // Font family: look for it on common text widgets
  const fontSelectors = ['wlabel', 'wpushbutton', 'wwidget', 'qwidget', '#mixxx']
  for (const sel of fontSelectors) {
    const ff = qss[sel]?.['font-family']
    if (ff) {
      settings.fontFamily = ff
      mapped.push({ token: 'fontFamily', source: `qss:${sel}:font-family`, value: ff })
      break
    }
  }

  // Font size from #Mixxx or WWidget
  const fsSelectors = ['#mixxx', 'wwidget', 'qwidget']
  for (const sel of fsSelectors) {
    const fs = qss[sel]?.['font-size']
    if (fs) {
      const n = parseInt(fs)
      if (!isNaN(n)) {
        settings.fontSizeBase = n
        mapped.push({ token: 'fontSizeBase', source: `qss:${sel}:font-size`, value: `${n}px` })
        break
      }
    }
  }

  // Button border-radius from WPushButton
  const br = qss['wpushbutton']?.['border-radius']
  if (br) {
    const n = parseInt(br)
    if (!isNaN(n)) {
      settings.buttonBorderRadius = n
      mapped.push({ token: 'buttonBorderRadius', source: 'qss:wpushbutton:border-radius', value: `${n}px` })
    }
  }

  // Panel border-radius from WWidgetGroup
  const pbr = qss['wwidgetgroup']?.['border-radius']
  if (pbr) {
    const n = parseInt(pbr)
    if (!isNaN(n)) {
      settings.panelBorderRadius = n
      mapped.push({ token: 'panelBorderRadius', source: 'qss:wwidgetgroup:border-radius', value: `${n}px` })
    }
  }

  return settings
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const COLOR_PROPS = new Set([
  'background-color', 'color', 'border-color',
  'border-top-color', 'border-bottom-color',
  'alternate-background-color', 'selection-color',
  'selection-background-color',
])

function varLookup(vars: Record<string, string>) {
  return (...names: string[]) => {
    for (const name of names) {
      const key = Object.keys(vars).find(k => k.toLowerCase() === name.toLowerCase())
      if (key) return { src: `var:${key}`, val: vars[key] }
    }
    return { src: '', val: undefined as string | undefined }
  }
}

function schemeLookup(scheme: Record<string, string>) {
  return (...names: string[]) => {
    for (const name of names) {
      const key = Object.keys(scheme).find(k => k.toLowerCase() === name.toLowerCase())
      if (key) return { src: `scheme:${key}`, val: scheme[key] }
    }
    return { src: '', val: undefined as string | undefined }
  }
}

function qssLookup(qss: Record<string, Record<string, string>>) {
  return (selector: string, prop: string) => {
    const key = Object.keys(qss).find(k => k.toLowerCase() === selector.toLowerCase())
    const val = key ? qss[key]?.[prop] : undefined
    return { src: `qss:${selector}`, val }
  }
}

export function normalizeColor(raw: string): string | null {
  if (!raw) return null
  const v = raw.trim()

  if (/^#[0-9a-fA-F]{3}$/.test(v))
    return '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toLowerCase()
  // 8-digit ARGB (#aarrggbb) — strip alpha
  if (/^#[0-9a-fA-F]{8}$/.test(v)) return ('#' + v.slice(3)).toLowerCase()

  const rgba = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgba)
    return ('#' + [rgba[1], rgba[2], rgba[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('')).toLowerCase()

  const named: Record<string, string> = {
    black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000',
    blue: '#0000ff', yellow: '#ffff00', orange: '#ffa500', purple: '#800080',
    cyan: '#00ffff', magenta: '#ff00ff', grey: '#808080', gray: '#808080',
    transparent: '#000000',
  }
  return named[v.toLowerCase()] ?? null
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(n => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, '0')).join('')
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount)
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount))
}

function complementary(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(255 - r, 255 - g, 255 - b)
}
