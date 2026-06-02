import type { ImportResult } from '../parseSkin'
import { useI18n } from '../i18n/context'

interface Props {
  result: ImportResult
  onClose: () => void
}

export function ImportDialog({ result, onClose }: Props) {
  const { mapped, warnings, theme } = result
  const { t } = useI18n()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 border border-white/20 rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-base">{t.importDialogTitle}</h2>
            <p className="text-gray-400 text-xs mt-0.5">
              "{theme.meta.name}"
              {theme.meta.author ? ` ${t.importDialogBy} ${theme.meta.author}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 max-h-80 overflow-y-auto space-y-3">
          {/* Mapped colors */}
          <div>
            <h3 className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2">
              {t.importDialogMapped(mapped.length)}
            </h3>
            <div className="space-y-1">
              {mapped.map(({ token, source, value }) => (
                <div key={token} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-4 h-4 rounded flex-shrink-0 border border-white/10"
                    style={{ backgroundColor: value }}
                  />
                  <span className="text-gray-300 w-40 flex-shrink-0 font-mono">{token}</span>
                  <span className="text-gray-600 text-[10px] truncate">{source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-2">
                {t.importDialogDerived(warnings.length)}
              </h3>
              <div className="space-y-0.5">
                {warnings.map((w, i) => (
                  <p key={i} className="text-xs text-gray-500">{w}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs rounded font-semibold text-white"
            style={{ backgroundColor: '#e94560' }}
          >
            {t.importDialogDone}
          </button>
        </div>
      </div>
    </div>
  )
}
