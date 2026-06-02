import type { Theme, ThemeColors, ThemeMeta, ThemeSettings } from '../types'
import { ColorSwatch } from './ColorSwatch'
import { useI18n } from '../i18n/context'
import type { Translations } from '../i18n/translations'
import { colorTranslationKey, colorSections } from '../colorMeta'

interface Props {
  theme: Theme
  onChange: (theme: Theme) => void
}

const FONT_FAMILIES = [
  { label: 'Inter / Segoe UI', value: '"Inter", "Segoe UI", Arial, sans-serif' },
  { label: 'Ubuntu', value: 'Ubuntu, "Open Sans", Arial, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", Arial, sans-serif' },
  { label: 'Roboto', value: 'Roboto, Arial, sans-serif' },
  { label: 'System default', value: 'system-ui, sans-serif' },
]

export function Sidebar({ theme, onChange }: Props) {
  const { t } = useI18n()

  function setColor(key: keyof ThemeColors, value: string) {
    onChange({ ...theme, colors: { ...theme.colors, [key]: value } })
  }

  function setMeta(key: keyof ThemeMeta, value: string) {
    onChange({ ...theme, meta: { ...theme.meta, [key]: value } })
  }

  function setSetting<K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) {
    onChange({ ...theme, settings: { ...theme.settings, [key]: value } })
  }

  const metaFields: { key: keyof ThemeMeta; labelKey: keyof Translations }[] = [
    { key: 'name', labelKey: 'fieldName' },
    { key: 'author', labelKey: 'fieldAuthor' },
    { key: 'description', labelKey: 'fieldDescription' },
  ]

  return (
    <aside className="w-72 bg-gray-950 border-r border-white/10 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h1 className="text-white font-bold text-base tracking-wide">Mixxx Themer</h1>
        <p className="text-gray-500 text-xs mt-0.5">{t.appSubtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* Skin metadata */}
        <section className="px-4 py-3 border-b border-white/10">
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">{t.skinInfo}</h2>
          {metaFields.map(({ key, labelKey }) => (
            <div key={key} className="mb-2">
              <label className="text-xs text-gray-400 block mb-0.5 capitalize">{t[labelKey] as string}</label>
              <input
                className="w-full bg-gray-800 text-white text-xs px-2 py-1.5 rounded border border-white/10 focus:outline-none focus:border-white/40"
                value={theme.meta[key]}
                onChange={e => setMeta(key, e.target.value)}
                placeholder={key === 'name' ? 'MySkin' : ''}
              />
            </div>
          ))}
        </section>

        {/* Typography */}
        <section className="px-4 py-3 border-b border-white/10">
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">{t.typography}</h2>

          <div className="mb-2">
            <label className="text-xs text-gray-400 block mb-0.5">{t.fontFamily}</label>
            <select
              className="w-full bg-gray-800 text-white text-xs px-2 py-1.5 rounded border border-white/10 focus:outline-none focus:border-white/40"
              value={theme.settings.fontFamily}
              onChange={e => setSetting('fontFamily', e.target.value)}
            >
              {FONT_FAMILIES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
              {!FONT_FAMILIES.find(f => f.value === theme.settings.fontFamily) && (
                <option value={theme.settings.fontFamily}>{theme.settings.fontFamily}</option>
              )}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">
              {t.fontSizeBase} — <span className="text-white">{theme.settings.fontSizeBase}px</span>
            </label>
            <input
              type="range" min={10} max={16} step={1}
              value={theme.settings.fontSizeBase}
              onChange={e => setSetting('fontSizeBase', parseInt(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
        </section>

        {/* Geometry */}
        <section className="px-4 py-3 border-b border-white/10">
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">{t.shape}</h2>

          <div className="mb-2">
            <label className="text-xs text-gray-400 block mb-1">
              {t.buttonRadius} — <span className="text-white">{theme.settings.buttonBorderRadius}px</span>
            </label>
            <input
              type="range" min={0} max={12} step={1}
              value={theme.settings.buttonBorderRadius}
              onChange={e => setSetting('buttonBorderRadius', parseInt(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">
              {t.panelRadius} — <span className="text-white">{theme.settings.panelBorderRadius}px</span>
            </label>
            <input
              type="range" min={0} max={8} step={1}
              value={theme.settings.panelBorderRadius}
              onChange={e => setSetting('panelBorderRadius', parseInt(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
        </section>

        {/* Color sections */}
        {colorSections.map(section => (
          <section key={section.labelKey} className="px-4 py-3 border-b border-white/10">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">
              {t[section.labelKey] as string}
            </h2>
            {section.keys.map(key => (
              <ColorSwatch
                key={key}
                label={t[colorTranslationKey[key]] as string}
                value={theme.colors[key]}
                onChange={v => setColor(key, v)}
              />
            ))}
          </section>
        ))}
      </div>
    </aside>
  )
}
