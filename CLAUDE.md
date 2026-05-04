# CLAUDE.md — Sheet Folders

## Architecture

- `app/Code.gs` — serveur Google Apps Script, expose les fonctions appelées par la sidebar
- `app/Sidebar.html` — sidebar complète en un seul fichier HTML/CSS/JS
- `docs/index.html` + `docs/styles.css` — page GitHub Pages séparés
- `docs/CASE_STUDY.md` + `docs/README.md` — documentation
- Stockage : `PropertiesService.getDocumentProperties()` — clé-valeur lié au fichier Google Sheets
- Zéro serveur externe, zéro dépendance npm

## Stack

- Google Apps Script (ES2020, runtime V8)
- HTML/CSS/JS vanilla — pas de framework
- Fonts : Google Sans, Roboto, Roboto Mono (Google Fonts)
- Thème : Google Workspace natif (`#f0f4f9` background, `#ffffff` surfaces, `#1a73e8` accent)

## Conventions Sidebar.html

**État**
- `state` — source de vérité : `{ data: { folders, assignments }, sheets }`
- `openFolders`, `hiddenFolders`, `hiddenSheets` — Sets JS
- Mutations via helpers uniquement : `setSheetHidden(name, bool)`, `syncFolderHidden(id)`, `folderSheets(id)`

**Rendu**
- `render()` → `renderFolders()` ou `renderAssign()` selon l'onglet actif
- Tout le HTML généré via fonctions templates : `tplFolderCard`, `tplSheet`, `tplFolderActions`, `tplSwatch`, `tplAssignRow`, `tplEmpty`
- Re-render complet à chaque action — pas de diff partiel

**Optimistic UI**
```js
optimistic(localUpdate, serverFn, ...args)
// 1. localUpdate() — mutation état local
// 2. render()      — re-render immédiat
// 3. google.script.run[serverFn](...args) — sync arrière-plan
```

**Couleurs**
- Toujours stocker dans `dataset.color` — jamais lire `style.background` (retourne `rgb()`)
- Passer `null` à `setTabColor()` si pas de couleur — une chaîne vide applique du bleu par défaut

## Conventions Code.gs

- `getData()` / `saveData(data)` — seuls points d'accès à `PropertiesService`
- `setTabColor(color || null)` — systématiquement, jamais `setTabColor(color)`
- `createFolder` stocke `color: ''` si pas de couleur — pas de fallback coloré

## Règles critiques — ne jamais enfreindre

- **Un seul `<script>` tag** dans Sidebar.html — deux tags = double `init()` = doublons à la création
- **Vérification côté client** avant tout masquage — Google Sheets exige au moins une feuille visible
- **`dataset.color`** pour lire/écrire la couleur du swatch — `style.background` est interdit
- **`onfocus` interdit** sur `<input type="color">` — ferme le panel trop tôt

## Auteur

Claire — développeuse front-end. Spécifie, teste, valide le code construit avec Claude.ai (Anthropic).
