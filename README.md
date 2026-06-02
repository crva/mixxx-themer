# Mixxx Themer

A visual skin builder for [Mixxx](https://mixxx.org/) — the free, open-source DJ software.

Design your skin in the browser, see changes live, and export a ready-to-install `.zip` in seconds.

---

## Features

- **Live preview** — a faithful Mixxx 2.5 interface that updates in real time as you edit
- **Click-to-edit** — click any colored region in the preview (deck background, waveform, transport buttons…) to open an inline color picker right there
- **38 color tokens** — covers every part of the Mixxx UI: backgrounds, waveform bands, VU meters, library, crossfader, status buttons, and more
- **Typography & geometry** — choose font family, base font size, button radius, and panel radius
- **5 built-in presets** — Tango, Midnight Blue, Dark Matter, Forest, Sunset
- **Import existing skins** — drag in a Mixxx skin `.zip` or raw `skin.xml` / `style.qss` files to use as a starting point
- **Export** — generates `skin.xml` + `style.qss` packed into a `.zip` ready to drop into Mixxx
- **Save / load** — persist your work as a `.json` theme file
- **English & French UI** — language toggle in the toolbar, persisted across sessions

---

## Getting started

```bash
git clone https://github.com/crva/mixxx-themer.git
cd mixxx-themer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## How to use

### Customize from scratch
1. Pick a preset from the toolbar as a starting point, or start from the default theme
2. Click any colored area in the preview — a color picker pops up right where you clicked
3. Fine-tune any token using the color swatches in the left sidebar
4. Adjust font, border radius, and skin metadata in the sidebar panels

### Import an existing skin
1. Click **Import Skin (.zip)** in the toolbar and select a Mixxx skin archive
   — or click **skin.xml** to select raw files
2. Review the import report (mapped tokens + derived fallbacks)
3. Click **Done** — the theme loads and the preview updates immediately

### Export
Click **Export Skin (.zip)** — a folder named after your skin is downloaded containing:
- `skin.xml` — color variables and layout declarations
- `style.qss` — Qt stylesheet covering all UI components
- `README.txt` — installation instructions for end users

### Install in Mixxx
Extract the exported folder into your Mixxx skins directory:

| OS | Path |
|---|---|
| Linux | `~/.mixxx/skins/` |
| macOS | `~/Library/Containers/org.mixxx.mixxx/Data/Library/Application Support/Mixxx/skins/` |
| Windows | `%LOCALAPPDATA%\Mixxx\skins\` |

Then restart Mixxx and select your skin in **Preferences → Interface**.

---

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-colorful](https://github.com/omgovich/react-colorful)
- [JSZip](https://stuk.github.io/jszip/) + [FileSaver.js](https://github.com/eligrey/FileSaver.js)

Fully client-side — no backend, no data sent anywhere.

---

## License

MIT
