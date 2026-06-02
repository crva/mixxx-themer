import { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorSwatch({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative flex items-center gap-2 py-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-7 h-7 rounded border border-white/20 flex-shrink-0 shadow-inner"
        style={{ backgroundColor: value }}
        title={value}
      />
      <span className="text-xs text-gray-300 flex-1 leading-tight">{label}</span>
      {open && (
        <div className="absolute left-0 top-9 z-50 shadow-xl rounded-lg overflow-hidden border border-white/20">
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
      )}
    </div>
  )
}
