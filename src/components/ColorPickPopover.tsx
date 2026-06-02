import { useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useI18n } from '../i18n/context'
import { colorTranslationKey } from '../colorMeta'
import type { ThemeColors } from '../types'

interface Props {
  colorKey: keyof ThemeColors
  value: string
  onChange: (v: string) => void
  x: number
  y: number
  onClose: () => void
}

export function ColorPickPopover({ colorKey, value, onChange, x, y, onClose }: Props) {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const label = t[colorTranslationKey[colorKey]] as string

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    // Defer so the opening click doesn't immediately close
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler) }
  }, [onClose])

  const PICKER_W = 222
  const PICKER_H = 300
  const left = Math.min(x + 10, window.innerWidth - PICKER_W - 8)
  const top = Math.min(y + 10, window.innerHeight - PICKER_H - 8)

  return (
    <div
      ref={ref}
      className="fixed z-[200] shadow-2xl rounded-xl overflow-hidden border border-white/20"
      style={{ left, top }}
    >
      <div className="flex items-center gap-2 bg-gray-900 px-3 py-2 border-b border-white/10">
        <div className="w-4 h-4 rounded border border-white/20 flex-shrink-0" style={{ backgroundColor: value }} />
        <span className="text-xs text-gray-200 font-medium">{label}</span>
      </div>
      <HexColorPicker color={value} onChange={onChange} />
      <div className="bg-gray-900 px-3 py-2 flex items-center gap-2">
        <span className="text-xs text-gray-400">Hex</span>
        <input
          className="flex-1 bg-gray-800 text-white text-xs px-2 py-1 rounded font-mono border border-white/20 focus:outline-none focus:border-white/50"
          value={value}
          onChange={e => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
          }}
          maxLength={7}
        />
      </div>
    </div>
  )
}
