export type Lang = 'en' | 'fr'

export const translations = {
  en: {
    // App
    appSubtitle: 'Visual skin builder',

    // Toolbar
    presets: 'Presets',
    importSkinZip: 'Import Skin (.zip)',
    importingLabel: 'Importing…',
    saveJson: 'Save JSON',
    loadJson: 'Load JSON',
    exportSkin: 'Export Skin (.zip)',
    invalidJson: 'Invalid JSON theme file.',
    noSkinXml: 'No skin.xml selected.',

    // Sidebar sections
    skinInfo: 'Skin Info',
    typography: 'Typography',
    shape: 'Shape',

    // Skin info fields
    fieldName: 'name',
    fieldAuthor: 'author',
    fieldDescription: 'description',

    // Typography fields
    fontFamily: 'Font family',
    fontSizeBase: 'Base font size',

    // Shape fields
    buttonRadius: 'Button radius',
    panelRadius: 'Panel radius',

    // Color section names
    sectionBackgrounds: 'Backgrounds',
    sectionText: 'Text',
    sectionDeckAccents: 'Deck Accents',
    sectionStatusColors: 'Status Colors',
    sectionFocusHover: 'Focus & Hover',
    sectionButtons: 'Buttons',
    sectionKnobs: 'Knobs',
    sectionWaveform: 'Waveform',
    sectionVuMeter: 'VU Meter',
    sectionCrossfader: 'Crossfader',
    sectionLibrary: 'Library',
    sectionInputFields: 'Input Fields',
    sectionMisc: 'Misc',

    // Color labels
    colorBgBase: 'Base',
    colorBgSurface: 'Surface',
    colorBgElevated: 'Elevated',
    colorBgDeep: 'Deep (darkest)',
    colorBgDeck1: 'Deck 1 bg',
    colorBgDeck2: 'Deck 2 bg',
    colorTextPrimary: 'Primary',
    colorTextSecondary: 'Secondary',
    colorTextMuted: 'Muted',
    colorKnobBg: 'Knob body',
    colorKnobArc: 'Knob arc / value',
    colorButtonBg: 'Button bg',
    colorButtonBgActive: 'Button active bg',
    colorButtonText: 'Button text',
    colorButtonTextActive: 'Button active text',
    colorHoverBorder: 'Hover border',
    colorFocusBorder: 'Focus / active border',
    colorColorPlay: 'Play active',
    colorColorCue: 'Cue / hotcue active',
    colorColorSync: 'Sync / loop active',
    colorColorRecord: 'Recording on',
    colorColorEndOfTrack: 'End-of-track flash',
    colorWaveformBg: 'Background',
    colorWaveformLow: 'Lows',
    colorWaveformMid: 'Mids',
    colorWaveformHigh: 'Highs',
    colorWaveformPreview: 'Played overlay',
    colorPlayhead: 'Playhead',
    colorAccentDeck1: 'Deck 1 accent',
    colorAccentDeck2: 'Deck 2 accent',
    colorSpinny: 'Spinny disc',
    colorVuMeterLow: 'Low',
    colorVuMeterMid: 'Mid',
    colorVuMeterHigh: 'Clip',
    colorCrossfaderBg: 'Track',
    colorCrossfaderHandle: 'Handle',
    colorLibraryBg: 'Background',
    colorLibraryAltBg: 'Alternating rows',
    colorLibraryText: 'Track text',
    colorLibrarySelectedBg: 'Selected row bg',
    colorLibrarySelectedText: 'Selected row text',
    colorLibrarySidebarSelectedBg: 'Sidebar selected',
    colorInputBg: 'Background',
    colorInputText: 'Text',
    colorInputBorder: 'Border',
    colorBorderColor: 'Borders',

    // Import dialog
    importDialogTitle: 'Skin imported',
    importDialogBy: 'by',
    importDialogMapped: (n: number) => `Mapped (${n})`,
    importDialogDerived: (n: number) => `Derived from defaults (${n})`,
    importDialogDone: 'Done',
  },

  fr: {
    // App
    appSubtitle: 'Créateur de skin visuel',

    // Toolbar
    presets: 'Préréglages',
    importSkinZip: 'Importer un skin (.zip)',
    importingLabel: 'Importation…',
    saveJson: 'Sauvegarder JSON',
    loadJson: 'Charger JSON',
    exportSkin: 'Exporter le skin (.zip)',
    invalidJson: 'Fichier JSON invalide.',
    noSkinXml: 'Aucun skin.xml sélectionné.',

    // Sidebar sections
    skinInfo: 'Infos du skin',
    typography: 'Typographie',
    shape: 'Forme',

    // Skin info fields
    fieldName: 'nom',
    fieldAuthor: 'auteur',
    fieldDescription: 'description',

    // Typography fields
    fontFamily: 'Police de caractères',
    fontSizeBase: 'Taille de police de base',

    // Shape fields
    buttonRadius: 'Rayon des boutons',
    panelRadius: 'Rayon des panneaux',

    // Color section names
    sectionBackgrounds: 'Arrière-plans',
    sectionText: 'Texte',
    sectionDeckAccents: 'Accents de platine',
    sectionStatusColors: 'Couleurs de statut',
    sectionFocusHover: 'Focus et survol',
    sectionButtons: 'Boutons',
    sectionKnobs: 'Potentiomètres',
    sectionWaveform: "Forme d'onde",
    sectionVuMeter: 'Vumètre',
    sectionCrossfader: 'Crossfader',
    sectionLibrary: 'Bibliothèque',
    sectionInputFields: 'Champs de saisie',
    sectionMisc: 'Divers',

    // Color labels
    colorBgBase: 'Base',
    colorBgSurface: 'Surface',
    colorBgElevated: 'Élevé',
    colorBgDeep: 'Profond (plus sombre)',
    colorBgDeck1: 'Fond platine 1',
    colorBgDeck2: 'Fond platine 2',
    colorTextPrimary: 'Principal',
    colorTextSecondary: 'Secondaire',
    colorTextMuted: 'Atténué',
    colorKnobBg: 'Corps du potentiomètre',
    colorKnobArc: 'Arc / valeur',
    colorButtonBg: 'Fond du bouton',
    colorButtonBgActive: 'Fond actif du bouton',
    colorButtonText: 'Texte du bouton',
    colorButtonTextActive: 'Texte actif du bouton',
    colorHoverBorder: 'Bordure au survol',
    colorFocusBorder: 'Bordure de focus / actif',
    colorColorPlay: 'Lecture active',
    colorColorCue: 'Cue / hotcue actif',
    colorColorSync: 'Sync / boucle active',
    colorColorRecord: 'Enregistrement actif',
    colorColorEndOfTrack: 'Flash fin de piste',
    colorWaveformBg: 'Arrière-plan',
    colorWaveformLow: 'Basses',
    colorWaveformMid: 'Médiums',
    colorWaveformHigh: 'Aigus',
    colorWaveformPreview: 'Superposition lue',
    colorPlayhead: 'Tête de lecture',
    colorAccentDeck1: 'Accent platine 1',
    colorAccentDeck2: 'Accent platine 2',
    colorSpinny: 'Disque rotatif',
    colorVuMeterLow: 'Bas',
    colorVuMeterMid: 'Médium',
    colorVuMeterHigh: 'Écrêtage',
    colorCrossfaderBg: 'Piste',
    colorCrossfaderHandle: 'Curseur',
    colorLibraryBg: 'Arrière-plan',
    colorLibraryAltBg: 'Lignes alternées',
    colorLibraryText: 'Texte des pistes',
    colorLibrarySelectedBg: 'Fond de la ligne sélectionnée',
    colorLibrarySelectedText: 'Texte de la ligne sélectionnée',
    colorLibrarySidebarSelectedBg: 'Sélection barre latérale',
    colorInputBg: 'Arrière-plan',
    colorInputText: 'Texte',
    colorInputBorder: 'Bordure',
    colorBorderColor: 'Bordures',

    // Import dialog
    importDialogTitle: 'Skin importé',
    importDialogBy: 'par',
    importDialogMapped: (n: number) => `Mappé (${n})`,
    importDialogDerived: (n: number) => `Dérivé des valeurs par défaut (${n})`,
    importDialogDone: 'Terminé',
  },
} satisfies Record<Lang, Record<string, string | ((...args: never[]) => string)>>

export type Translations = typeof translations.en
