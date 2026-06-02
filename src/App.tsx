import { useState } from 'react'
import type { Theme, ThemeColors, ThemeSettings } from './types'
import { defaultColors, defaultSettings, defaultMeta } from './types'
import { Sidebar } from './components/Sidebar'
import { Preview } from './components/Preview'
import { Toolbar } from './components/Toolbar'
import { ColorPickPopover } from './components/ColorPickPopover'

export default function App() {
  const [theme, setTheme] = useState<Theme>({
    meta: defaultMeta,
    colors: defaultColors,
    settings: defaultSettings,
  })
  const [activePick, setActivePick] = useState<{ key: keyof ThemeColors; x: number; y: number } | null>(null)

  function handleLoadPreset(colors: ThemeColors, settings?: ThemeSettings) {
    setTheme(t => ({ ...t, colors, settings: settings ?? t.settings }))
  }

  function handleImport(imported: Theme) {
    setTheme(imported)
  }

  function handleColorPick(key: keyof ThemeColors, x: number, y: number) {
    setActivePick({ key, x, y })
  }

  function handlePickChange(v: string) {
    if (!activePick) return
    setTheme(t => ({ ...t, colors: { ...t.colors, [activePick.key]: v } }))
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-white">
      <Sidebar theme={theme} onChange={setTheme} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Toolbar theme={theme} onLoadPreset={handleLoadPreset} onImport={handleImport} />
        <Preview theme={theme} onColorPick={handleColorPick} />
      </div>
      {activePick && (
        <ColorPickPopover
          colorKey={activePick.key}
          value={theme.colors[activePick.key]}
          onChange={handlePickChange}
          x={activePick.x}
          y={activePick.y}
          onClose={() => setActivePick(null)}
        />
      )}
    </div>
  )
}
