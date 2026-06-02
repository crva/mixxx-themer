import { createContext, useContext } from 'react'
import type { Theme } from '../types'

type C = Theme['colors']
type S = Theme['settings']
type PickFn = (key: keyof C, x: number, y: number) => void

const PickCtx = createContext<PickFn | null>(null)

function usePickColor() {
  const onPick = useContext(PickCtx)
  return (key: keyof C) => (e: React.MouseEvent) => {
    e.stopPropagation()
    onPick?.(key, e.clientX, e.clientY)
  }
}

interface Props { theme: Theme; onColorPick?: PickFn }

export function Preview({ theme, onColorPick }: Props) {
  const { colors: c, settings: s, meta } = theme
  return (
    <PickCtx.Provider value={onColorPick ?? null}>
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div
          className="w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl border"
          style={{ borderColor: c.borderColor, backgroundColor: c.bgBase, fontFamily: s.fontFamily, fontSize: s.fontSizeBase }}
        >
          <MixxxToolbar c={c} s={s} skinName={meta.name} />
          <DecksMixerRow c={c} s={s} />
          <WaveformRow c={c} />
          <EffectsRack c={c} s={s} />
          <LibraryPanel c={c} s={s} />
        </div>
      </div>
    </PickCtx.Provider>
  )
}

// ── Toolbar ───────────────────────────────────────────────────────────────────

function MixxxToolbar({ c, s, skinName }: { c: C; s: S; skinName: string }) {
  const br = `${s.buttonBorderRadius}px`
  const sections = ['WAVEFORMS', '4 DECKS', 'MIXER', 'EFFECTS', 'SAMPLERS', 'MICS']
  const pc = usePickColor()
  return (
    <div className="color-hint flex items-center gap-1.5 px-3 py-1.5 border-b" onClick={pc('bgSurface')} title="bgSurface" style={{ backgroundColor: c.bgSurface, borderColor: c.borderColor }}>
      <span className="font-bold mr-2" style={{ color: c.accentDeck1, fontSize: s.fontSizeBase + 1 }}>{skinName || 'MySkin'}</span>
      {sections.map((sec, i) => (
        <div key={sec} className="px-1.5 py-0.5 font-bold"
          style={{ backgroundColor: i === 0 ? c.buttonBgActive : c.buttonBg, color: i === 0 ? c.buttonTextActive : c.buttonText, borderRadius: br, fontSize: 9, cursor: 'default' }}>
          {sec}
        </div>
      ))}
      <div className="flex-1" />
      {/* Master + head section */}
      {[['VOL', c.knobArc], ['BAL', c.knobArc], ['HEAD', c.knobArc]].map(([l, arc]) => (
        <div key={l} className="flex flex-col items-center gap-0.5">
          <Knob arc={arc as string} bg={c.knobBg} size={20} pct={0.5} />
          <span style={{ color: c.textMuted, fontSize: 8 }}>{l}</span>
        </div>
      ))}
      <DualVU low={c.vuMeterLow} mid={c.vuMeterMid} high={c.vuMeterHigh} bg={c.bgDeep} level={0.65} height={22} />
      <MiniBtn label="● REC" bg={c.colorRecord} text="#fff" br={br} colorKey="colorRecord" />
      <MiniBtn label="⚙" bg={c.buttonBg} text={c.buttonText} br={br} />
    </div>
  )
}

// ── Decks + Mixer row ─────────────────────────────────────────────────────────

function DecksMixerRow({ c, s }: { c: C; s: S }) {
  return (
    <div className="flex border-b" style={{ borderColor: c.borderColor }}>
      <DeckPanel ch={1} c={c} s={s} />
      <CenterMixer c={c} s={s} />
      <DeckPanel ch={2} c={c} s={s} flip />
    </div>
  )
}

function DeckPanel({ ch, c, s, flip }: { ch: number; c: C; s: S; flip?: boolean }) {
  const accent = ch === 1 ? c.accentDeck1 : c.accentDeck2
  const deckBg = ch === 1 ? c.bgDeck1 : c.bgDeck2
  const deckBgKey: keyof C = ch === 1 ? 'bgDeck1' : 'bgDeck2'
  const br = `${s.buttonBorderRadius}px`
  const edge = flip ? { borderRight: `3px solid ${accent}` } : { borderLeft: `3px solid ${accent}` }
  const pc = usePickColor()
  const row = (content: React.ReactNode) => (
    <div className={`flex gap-1 ${flip ? 'flex-row-reverse' : ''}`}>{content}</div>
  )

  return (
    <div className="color-hint flex-1 flex flex-col gap-1.5 p-2" style={{ backgroundColor: deckBg, ...edge }} onClick={pc(deckBgKey)} title={deckBgKey as string}>

      {/* ── Track info ── */}
      <div className={`flex gap-2 items-start ${flip ? 'flex-row-reverse' : ''}`}>
        {/* Cover art */}
        <div className="w-12 h-12 flex-shrink-0 rounded flex items-center justify-center"
          style={{ backgroundColor: accent + '22', border: `1px solid ${accent}44`, borderRadius: br }}>
          <span style={{ fontSize: 20 }}>♪</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold truncate" style={{ color: c.textPrimary, fontSize: s.fontSizeBase + 1 }}>Track Title</div>
          <div className="truncate" style={{ color: c.textSecondary, fontSize: s.fontSizeBase - 1 }}>Artist Name</div>
          <div className="flex gap-2 mt-0.5">
            <span style={{ color: c.accentDeck1, fontSize: 9, fontWeight: 'bold' }}>128.0 BPM</span>
            <span style={{ color: c.textMuted, fontSize: 9 }}>4A</span>
            <span style={{ color: c.textMuted, fontSize: 9 }}>-1:24 rem</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="font-bold" style={{ color: c.textPrimary, fontSize: s.fontSizeBase + 3, fontVariantNumeric: 'tabular-nums' }}>3:06</div>
          <div style={{ color: c.textMuted, fontSize: 8 }}>elapsed</div>
        </div>
      </div>

      {/* ── Waveform overview ── */}
      <Overview accent={accent} c={c} />

      {/* ── Option buttons (Slip, Quantize, Keylock, Repeat, Eject) ── */}
      {row(<>
        {[
          { label: 'SLIP', active: false },
          { label: 'QUANT', active: true },
          { label: 'KEY', active: true },
          { label: 'REP', active: false },
          { label: 'EJECT', active: false },
        ].map(({ label, active }) => (
          <OptionBtn key={label} label={label} active={active} c={c} br={br} />
        ))}
      </>)}

      {/* ── Transport buttons ── */}
      {row(<>
        <MiniBtn label="◄◄" bg={c.buttonBg} text={c.buttonText} br={br} />
        <MiniBtn label="REV" bg={c.buttonBg} text={c.buttonText} br={br} />
        <MiniBtn label="CUE" bg={c.colorCue} text={c.buttonTextActive} br={br} flex colorKey="colorCue" />
        <MiniBtn label="▶ PLAY" bg={c.colorPlay} text={c.buttonTextActive} br={br} flex colorKey="colorPlay" />
        <MiniBtn label="SYNC" bg={c.colorSync} text={c.bgDeep} br={br} flex colorKey="colorSync" />
      </>)}

      {/* ── Rate controls ── */}
      {row(<>
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
          <div className="px-1.5 font-bold" style={{ color: c.textPrimary, backgroundColor: c.bgDeep, borderRadius: br, fontSize: 9, fontVariantNumeric: 'tabular-nums', border: `1px solid ${c.borderColor}` }}>+0.0%</div>
        </div>
        <RateSlider accent={accent} bg={c.bgElevated} border={c.borderColor} />
        <div className="flex flex-col gap-0.5">
          <div className="px-1 text-center font-bold" style={{ backgroundColor: c.buttonBg, color: c.buttonText, borderRadius: br, fontSize: 8, border: `1px solid ${c.borderColor}` }}>▲</div>
          <div className="px-1 text-center font-bold" style={{ backgroundColor: c.buttonBg, color: c.buttonText, borderRadius: br, fontSize: 8, border: `1px solid ${c.borderColor}` }}>▼</div>
        </div>
      </>)}

      {/* ── Loop controls ── */}
      {row(<>
        <MiniBtn label="÷2" bg={c.buttonBg} text={c.buttonText} br={br} />
        <MiniBtn label="IN" bg={c.buttonBg} text={c.buttonText} br={br} />
        <div className="px-1.5 font-bold text-center flex-shrink-0" style={{ backgroundColor: c.bgDeep, color: c.textPrimary, borderRadius: br, fontSize: 9, border: `1px solid ${c.borderColor}`, minWidth: 22 }}>4</div>
        <MiniBtn label="LOOP" bg={c.colorSync} text={c.bgDeep} br={br} flex />
        <MiniBtn label="OUT" bg={c.buttonBg} text={c.buttonText} br={br} />
        <MiniBtn label="×2" bg={c.buttonBg} text={c.buttonText} br={br} />
        <MiniBtn label="RELOOP" bg={c.buttonBg} text={c.colorSync} br={br} />
      </>)}

      {/* ── Beatjump ── */}
      {row(<>
        <MiniBtn label="◄" bg={c.buttonBg} text={c.buttonText} br={br} flex />
        <div className="px-2 font-bold text-center" style={{ backgroundColor: c.bgDeep, color: c.textPrimary, borderRadius: br, fontSize: 9, border: `1px solid ${c.borderColor}` }}>4 beat</div>
        <MiniBtn label="►" bg={c.buttonBg} text={c.buttonText} br={br} flex />
      </>)}

      {/* ── Hotcues ── */}
      {row(<>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
          <HotcueBtn key={n} n={n} c={c} br={br} active={n <= 3} />
        ))}
      </>)}

      {/* ── EQ knobs + kills + filter + PFL ── */}
      {row(<>
        <div className="flex flex-col items-center gap-0.5">
          <Knob arc={c.knobArc} bg={c.knobBg} size={20} pct={0.7} />
          <span style={{ color: c.textMuted, fontSize: 8 }}>GAIN</span>
        </div>
        {[['HI', 0.6], ['MID', 0.5], ['LOW', 0.4]].map(([lbl, pct]) => (
          <div key={lbl as string} className="flex flex-col items-center gap-0.5">
            <Knob arc={c.knobArc} bg={c.knobBg} size={18} pct={pct as number} />
            <KillBtn c={c} br={br} />
            <span style={{ color: c.textMuted, fontSize: 7 }}>{lbl}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-0.5">
          <Knob arc={accent} bg={c.knobBg} size={18} pct={0.5} />
          <span style={{ color: c.textMuted, fontSize: 7 }}>FX</span>
        </div>
        <div className="ml-auto flex flex-col items-center gap-0.5">
          <MiniBtn label="PFL" bg={c.accentDeck1 + '33'} text={c.accentDeck1} br={br} />
        </div>
      </>)}

      {/* ── Volume fader + VU ── */}
      <div className={`flex items-end gap-2 ${flip ? 'flex-row-reverse' : ''}`}>
        <VolFader accent={accent} bg={c.bgElevated} border={c.borderColor} />
        <DualVU low={c.vuMeterLow} mid={c.vuMeterMid} high={c.vuMeterHigh} bg={c.bgDeep} level={0.72} height={44} />
      </div>

    </div>
  )
}

// ── Center mixer ──────────────────────────────────────────────────────────────

function CenterMixer({ c, s }: { c: C; s: S }) {
  const br = `${s.buttonBorderRadius}px`
  const pc = usePickColor()
  return (
    <div className="color-hint w-24 flex-shrink-0 flex flex-col items-center gap-2 py-2 px-1"
      style={{ backgroundColor: c.bgElevated, borderLeft: `1px solid ${c.borderColor}`, borderRight: `1px solid ${c.borderColor}` }}
      onClick={pc('bgElevated')} title="bgElevated">
      <span style={{ color: c.textMuted, fontSize: 8, fontWeight: 'bold' }}>MASTER</span>
      <DualVU low={c.vuMeterLow} mid={c.vuMeterMid} high={c.vuMeterHigh} bg={c.bgDeep} level={0.6} height={36} />
      <div className="flex gap-1.5">
        {[['MST', 0.75], ['BAL', 0.5]].map(([l, p]) => (
          <div key={l as string} className="flex flex-col items-center gap-0.5">
            <Knob arc={c.knobArc} bg={c.knobBg} size={20} pct={p as number} />
            <span style={{ color: c.textMuted, fontSize: 7 }}>{l}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {[['MIX', 0.3], ['HD', 0.8]].map(([l, p]) => (
          <div key={l as string} className="flex flex-col items-center gap-0.5">
            <Knob arc={c.knobArc} bg={c.knobBg} size={18} pct={p as number} />
            <span style={{ color: c.textMuted, fontSize: 7 }}>{l}</span>
          </div>
        ))}
      </div>
      <MiniBtn label="SPLIT" bg={c.buttonBg} text={c.buttonText} br={br} />
      <div className="mt-auto w-full">
        <span style={{ color: c.textMuted, fontSize: 7, display: 'block', textAlign: 'center', marginBottom: 3 }}>XFADER</span>
        <Crossfader bg={c.crossfaderBg} handle={c.crossfaderHandle} border={c.borderColor} onClickBg={pc('crossfaderBg')} onClickHandle={pc('crossfaderHandle')} />
      </div>
    </div>
  )
}

// ── Waveform row ──────────────────────────────────────────────────────────────

function WaveformRow({ c }: { c: C }) {
  return (
    <div className="flex border-b" style={{ borderColor: c.borderColor }}>
      <WaveformDisplay c={c} ch={1} />
      <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center gap-0.5 border-l border-r"
        style={{ backgroundColor: c.bgDeep, borderColor: c.borderColor }}>
        <span style={{ color: c.accentDeck1, fontSize: 9, fontWeight: 'bold' }}>128.0</span>
        <span style={{ color: c.textMuted, fontSize: 7 }}>BPM</span>
        <span style={{ color: c.colorSync, fontSize: 8, fontWeight: 'bold' }}>♩ 4A</span>
      </div>
      <WaveformDisplay c={c} ch={2} />
    </div>
  )
}

function WaveformDisplay({ c, ch }: { c: C; ch: number }) {
  const bars = 100
  const pc = usePickColor()
  return (
    <div className="color-hint flex-1 relative overflow-hidden" style={{ height: 72, backgroundColor: c.waveformBg }} onClick={pc('waveformBg')} title="waveformBg">
      <svg width="100%" height="72" preserveAspectRatio="none" style={{ display: 'block' }}>
        {/* Waveform bars */}
        {Array.from({ length: bars }, (_, i) => {
          const x = i * (100 / bars)
          const seed = i * 0.41 + ch * 1.7
          const h = 6 + Math.abs(Math.sin(seed) * 24 + Math.sin(seed * 2.3) * 12 + Math.sin(seed * 0.7) * 8)
          const color = h > 34 ? c.waveformHigh : h > 22 ? c.waveformMid : c.waveformLow
          return <rect key={i} x={`${x}%`} y={(72 - h) / 2} width="1.1%" height={h} fill={color} opacity={0.9} />
        })}
        {/* Played overlay */}
        <rect x="0" y="0" width="32%" height="72" fill={c.waveformPreview} opacity={0.28} />
        {/* Beat markers */}
        {[32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80].map(x => (
          <line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="72" stroke="#ffffff" strokeWidth="0.5" opacity={0.25} />
        ))}
        {/* Loop region */}
        <rect x="48%" y="0" width="16%" height="72" fill={c.colorSync} opacity={0.18} />
        <line x1="48%" y1="0" x2="48%" y2="72" stroke={c.colorSync} strokeWidth="1.5" />
        <line x1="64%" y1="0" x2="64%" y2="72" stroke={c.colorSync} strokeWidth="1.5" />
        {/* Cue marker triangle */}
        <polygon points={`32,0 38,0 32,8`} fill={c.colorCue} opacity={0.9} />
        {/* Hotcue markers */}
        {[45, 55, 70].map((x, i) => (
          <g key={i}>
            <line x1={`${x}%`} y1="0" x2={`${x}%`} y2="10" stroke={[c.accentDeck1, c.accentDeck2, c.colorPlay][i]} strokeWidth="1.5" />
            <rect x={`${x - 1}%`} y="0" width="6" height="8" fill={[c.accentDeck1, c.accentDeck2, c.colorPlay][i]} rx="1" />
          </g>
        ))}
        {/* Intro marker */}
        <line x1="18%" y1="0" x2="18%" y2="72" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,2" opacity={0.4} />
        {/* Outro marker */}
        <line x1="88%" y1="0" x2="88%" y2="72" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,2" opacity={0.4} />
        {/* End-of-track warning */}
        <rect x="92%" y="0" width="8%" height="72" fill={c.colorEndOfTrack} opacity={0.22} />
        {/* Playhead */}
        <line x1="32%" y1="0" x2="32%" y2="72" stroke="#ffffff" strokeWidth="2" />
        <polygon points={`${0.32 * 100}%,0 ${0.32 * 100 + 1}%,0`} />
      </svg>
    </div>
  )
}

// ── Effects rack ──────────────────────────────────────────────────────────────

function EffectsRack({ c, s }: { c: C; s: S }) {
  const br = `${s.buttonBorderRadius}px`
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b" style={{ backgroundColor: c.bgSurface, borderColor: c.borderColor }}>
      <span style={{ color: c.textMuted, fontSize: 9, fontWeight: 'bold' }}>FX</span>
      {[1, 2, 3, 4].map(n => (
        <div key={n} className="flex items-center gap-1.5 px-2 py-0.5 rounded border" style={{ backgroundColor: c.bgElevated, borderColor: c.borderColor, borderRadius: br }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: n === 1 ? c.colorSync : c.buttonBg, border: `1px solid ${c.borderColor}` }} />
          <span style={{ color: c.textMuted, fontSize: 8 }}>FX {n}</span>
          <Knob arc={c.knobArc} bg={c.knobBg} size={14} pct={n === 1 ? 0.6 : 0.5} />
          <Knob arc={c.knobArc} bg={c.knobBg} size={14} pct={0.5} />
          <Knob arc={c.knobArc} bg={c.knobBg} size={14} pct={0.5} />
        </div>
      ))}
      <div className="flex-1" />
      <span style={{ color: c.textMuted, fontSize: 8 }}>▼ collapse</span>
    </div>
  )
}

// ── Library ───────────────────────────────────────────────────────────────────

function LibraryPanel({ c, s }: { c: C; s: S }) {
  const br = `${s.buttonBorderRadius}px`
  const pc = usePickColor()
  const tracks = [
    { title: 'Selected Track Title', artist: 'Artist One', album: 'Album A', bpm: '128', key: '4A', dur: '6:12', rating: 4, played: false, sel: true, alt: false },
    { title: 'Another Good Track', artist: 'Artist Two', album: 'Album B', bpm: '140', key: '2B', dur: '5:44', rating: 3, played: true, sel: false, alt: false },
    { title: 'Third Song Here', artist: 'Artist Three', album: 'Album C', bpm: '132', key: '7A', dur: '7:01', rating: 5, played: false, sel: false, alt: true },
    { title: 'Fourth Track Name', artist: 'Artist Four', album: 'Album D', bpm: '126', key: '1A', dur: '4:55', rating: 2, played: true, sel: false, alt: false },
    { title: 'Fifth Banger', artist: 'Artist Five', album: 'Album E', bpm: '135', key: '6B', dur: '5:20', rating: 4, played: false, sel: false, alt: true },
  ]
  const cols = ['', 'Title', 'Artist', 'Album', 'BPM', 'Key', 'Dur', '★']

  return (
    <div>
      {/* Search row */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b" style={{ backgroundColor: c.bgBase, borderColor: c.borderColor }}>
        <div className="flex-1 flex items-center gap-1.5 px-2 py-0.5 text-xs"
          style={{ backgroundColor: c.inputBg, color: c.inputText, border: `1px solid ${c.inputBorder}`, borderRadius: br, fontSize: s.fontSizeBase - 1 }}>
          <span style={{ color: c.textMuted }}>🔍</span>
          <span style={{ color: c.textMuted }}>Search library…</span>
        </div>
        {['Tracks', 'Playlists', 'Crates', 'History', 'iTunes', 'Recording'].map((f, i) => (
          <div key={f} className="px-1.5 py-0.5 font-bold"
            style={{ backgroundColor: i === 0 ? c.librarySidebarSelectedBg : 'transparent', color: i === 0 ? c.textPrimary : c.libraryText, borderRadius: br, fontSize: 8, cursor: 'default' }}>
            {f}
          </div>
        ))}
      </div>

      <div className="flex" style={{ minHeight: 120 }}>
        {/* Sidebar */}
        <div className="color-hint w-28 flex-shrink-0 border-r" style={{ backgroundColor: c.libraryBg, borderColor: c.borderColor }} onClick={pc('libraryBg')} title="libraryBg">
          {[
            { label: 'Tracks', active: true },
            { label: '  All Tracks', sub: true, active: false },
            { label: '  Hidden', sub: true, active: false },
            { label: 'Playlists', active: false },
            { label: 'Crates', active: false },
            { label: 'Computer', active: false },
            { label: 'History', active: false },
          ].map(({ label, active, sub }) => (
            <div key={label} className="px-2 py-0.5 truncate"
              style={{ backgroundColor: active ? c.librarySidebarSelectedBg : 'transparent', color: active ? c.textPrimary : sub ? c.libraryText : c.textSecondary, fontSize: s.fontSizeBase - 2, fontFamily: s.fontFamily }}>
              {label}
            </div>
          ))}
        </div>

        {/* Track table */}
        <div className="flex-1 overflow-hidden" style={{ fontFamily: s.fontFamily, fontSize: s.fontSizeBase - 2 }}>
          {/* Column headers */}
          <div className="flex border-b px-1.5" style={{ backgroundColor: c.bgSurface, borderColor: c.borderColor }}>
            {cols.map(h => (
              <div key={h} className="py-0.5 font-bold truncate" style={{ color: c.textSecondary, flex: h === 'Title' || h === 'Artist' || h === 'Album' ? 2 : 1, minWidth: h === '' ? 14 : undefined }}>
                {h === '' ? '♦' : h}
              </div>
            ))}
          </div>
          {/* Rows */}
          {tracks.map((t, i) => (
            <div key={i} className="color-hint flex items-center px-1.5 py-0.5"
              onClick={pc(t.sel ? 'librarySelectedBg' : t.alt ? 'libraryAltBg' : 'libraryBg')}
              title={t.sel ? 'librarySelectedBg' : t.alt ? 'libraryAltBg' : 'libraryBg'}
              style={{
                backgroundColor: t.sel ? c.librarySelectedBg : t.alt ? c.libraryAltBg : c.libraryBg,
                color: t.sel ? c.librarySelectedText : t.played ? c.textMuted : c.libraryText,
              }}>
              {/* Color dot */}
              <div style={{ flex: 1, minWidth: 14 }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: [c.accentDeck1, c.accentDeck2, c.colorSync, c.colorPlay, c.colorCue][i % 5] }} />
              </div>
              <div className="truncate" style={{ flex: 2 }}>{t.title}</div>
              <div className="truncate" style={{ flex: 2 }}>{t.artist}</div>
              <div className="truncate" style={{ flex: 2 }}>{t.album}</div>
              <div style={{ flex: 1 }}>{t.bpm}</div>
              <div style={{ flex: 1 }}>{t.key}</div>
              <div style={{ flex: 1 }}>{t.dur}</div>
              <div style={{ flex: 1, color: c.colorSync }}>{'★'.repeat(t.rating)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Waveform overview (inside deck) ──────────────────────────────────────────

function Overview({ accent, c }: { accent: string; c: C }) {
  const bars = 80
  return (
    <div className="w-full relative overflow-hidden rounded" style={{ height: 28, backgroundColor: c.waveformBg, border: `1px solid ${c.borderColor}` }}>
      <svg width="100%" height="28" preserveAspectRatio="none" style={{ display: 'block' }}>
        {Array.from({ length: bars }, (_, i) => {
          const x = i * (100 / bars)
          const h = 4 + Math.abs(Math.sin(i * 0.5) * 10 + Math.sin(i * 1.1) * 6)
          return <rect key={i} x={`${x}%`} y={(28 - h) / 2} width="1.4%" height={h} fill={accent} opacity={0.5} />
        })}
        {/* Played overlay */}
        <rect x="0" y="0" width="32%" height="28" fill={c.waveformPreview} opacity={0.35} />
        {/* Hotcue markers */}
        {[20, 35, 55, 72].map((x, i) => (
          <rect key={i} x={`${x}%`} y="0" width="2" height="8" fill={i < 3 ? accent : c.colorPlay} opacity={0.9} />
        ))}
        {/* Playhead */}
        <line x1="32%" y1="0" x2="32%" y2="28" stroke="#ffffff" strokeWidth="1.5" />
        {/* End-of-track warning stripe */}
        <rect x="90%" y="0" width="10%" height="28" fill={c.colorEndOfTrack} opacity={0.2} />
      </svg>
    </div>
  )
}

// ── Primitives ────────────────────────────────────────────────────────────────

function knobArcD(from: number, to: number, arcR: number, r: number) {
  function polar(deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: r + arcR * Math.cos(rad), y: r + arcR * Math.sin(rad) }
  }
  const s = polar(from), e = polar(to)
  const large = Math.abs(to - from) > 180 ? 1 : 0
  return `M${s.x},${s.y} A${arcR},${arcR} 0 ${large} 1 ${e.x},${e.y}`
}

function Knob({ arc, bg, size, pct }: { arc: string; bg: string; size: number; pct: number }) {
  const r = size / 2, arcR = r - 2.5
  const startDeg = -220, totalDeg = 260
  const endDeg = startDeg + totalDeg * pct
  function polar(deg: number, radius: number) {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: r + radius * Math.cos(rad), y: r + radius * Math.sin(rad) }
  }
  const dot = polar(endDeg, arcR - 2)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r - 1} fill={bg} />
      <path d={knobArcD(startDeg, startDeg + totalDeg, arcR, r)} fill="none" stroke={bg} strokeWidth={2.2} opacity={0.4} />
      <path d={knobArcD(startDeg, endDeg, arcR, r)} fill="none" stroke={arc} strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={dot.x} cy={dot.y} r={1.2} fill={arc} />
    </svg>
  )
}

function DualVU({ low, mid, high, bg, level, height }: { low: string; mid: string; high: string; bg: string; level: number; height: number }) {
  const bars = 12
  const clip = Math.floor(bars * 0.85)
  const warn = Math.floor(bars * 0.7)
  return (
    <div className="flex gap-px" style={{ height }}>
      {[level * 0.95, level].map((lvl, ci) => (
        <div key={ci} className="flex flex-col-reverse gap-px" style={{ height }}>
          {Array.from({ length: bars }, (_, i) => {
            const lit = i < Math.floor(bars * lvl)
            const color = i >= clip ? high : i >= warn ? mid : low
            return <div key={i} className="w-1.5" style={{ flex: 1, backgroundColor: lit ? color : bg, opacity: lit ? 1 : 0.15, borderRadius: 1 }} />
          })}
        </div>
      ))}
    </div>
  )
}

function MiniBtn({ label, bg, text, br, flex, colorKey }: { label: string; bg: string; text: string; br: string; flex?: boolean; colorKey?: keyof C }) {
  const pc = usePickColor()
  return (
    <div
      className={`${colorKey ? 'color-hint' : ''} flex items-center justify-center font-bold select-none ${flex ? 'flex-1' : ''}`}
      style={{ backgroundColor: bg, color: text, borderRadius: br, fontSize: 8, padding: '2px 4px', cursor: colorKey ? 'pointer' : 'default' }}
      onClick={colorKey ? pc(colorKey) : undefined}
      title={colorKey as string | undefined}
    >
      {label}
    </div>
  )
}

function OptionBtn({ label, active, c, br }: { label: string; active: boolean; c: C; br: string }) {
  return (
    <div className="flex-1 text-center font-bold"
      style={{ backgroundColor: active ? c.colorSync + '33' : c.buttonBg, color: active ? c.colorSync : c.buttonText, border: `1px solid ${active ? c.colorSync : c.borderColor}`, borderRadius: br, fontSize: 7, padding: '1px 0', cursor: 'default' }}>
      {label}
    </div>
  )
}

function HotcueBtn({ n, c, br, active }: { n: number; c: C; br: string; active: boolean }) {
  const colors = [c.accentDeck1, c.accentDeck2, c.colorPlay, c.colorSync, c.colorCue, c.accentDeck1, c.accentDeck2, c.colorPlay]
  const col = active ? colors[(n - 1) % colors.length] : c.buttonBg
  return (
    <div className="flex-1 flex items-center justify-center font-bold"
      style={{ backgroundColor: col, color: active ? c.buttonTextActive : c.buttonText, border: `1px solid ${active ? col : c.borderColor}`, borderRadius: br, fontSize: 8, height: 16, cursor: 'default' }}>
      {n}
    </div>
  )
}

function KillBtn({ c }: { c: C; br?: string }) {
  return (
    <div className="w-full flex items-center justify-center"
      style={{ backgroundColor: c.buttonBg, border: `1px solid ${c.borderColor}`, borderRadius: 2, fontSize: 6, color: c.buttonText, height: 6, cursor: 'default' }}>
    </div>
  )
}

function RateSlider({ accent, bg, border }: { accent: string; bg: string; border: string }) {
  return (
    <div className="flex-1 relative" style={{ height: 14, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 3 }}>
      <div className="absolute top-0 bottom-0 rounded" style={{ left: '48%', width: 8, backgroundColor: accent }} />
    </div>
  )
}

function VolFader({ accent, bg, border }: { accent: string; bg: string; border: string }) {
  return (
    <div className="w-3 rounded relative" style={{ height: 44, backgroundColor: bg, border: `1px solid ${border}` }}>
      <div className="absolute left-0 right-0 rounded-sm" style={{ bottom: '28%', height: 5, backgroundColor: accent, margin: '0 1px' }} />
    </div>
  )
}

function Crossfader({ bg, handle, border, onClickBg, onClickHandle }: { bg: string; handle: string; border: string; onClickBg?: (e: React.MouseEvent) => void; onClickHandle?: (e: React.MouseEvent) => void }) {
  return (
    <div className="w-full rounded relative color-hint" style={{ height: 10, backgroundColor: bg, border: `1px solid ${border}` }} onClick={onClickBg}>
      <div className="absolute top-0 bottom-0 w-5 rounded color-hint" style={{ left: '40%', backgroundColor: handle }} onClick={e => { e.stopPropagation(); onClickHandle?.(e) }} />
    </div>
  )
}
