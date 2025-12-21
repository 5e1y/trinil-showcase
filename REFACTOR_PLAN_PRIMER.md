# 📋 PLAN DE REFACTOR COMPLET - Trinil Icon Browser → GitHub Primer Design System

**Date**: 21 Décembre 2025  
**Objectif**: Migrer vers Primer Design System avec altérations MINIMALES  
**Statut**: PLANIFICATION COMPLÈTE

---

## 📊 RÉSUMÉ EXÉCUTIF

### Ce qui change
- ✅ **Design system** : Custom tokens → `@primer/primitives` (GitHub official)
- ✅ **Composants** : Custom CSS → `@primer/react` (GitHub official)
- ✅ **Typographie** : Geist → Primer typography (system fonts optimisés)
- ✅ **Couleurs** : Palette grise custom → Palette Primer (light/dark/high-contrast)
- ✅ **Dependencies** : Supprimer `@tailwindcss/vite`, `tailwindcss`

### Ce qui reste IDENTIQUE
- ✅ Architecture React (useState, useMemo, useEffect)
- ✅ Data structure (iconTags.ts, filtrage par thème)
- ✅ Logique applicative (SearchQuery, IconSize, SelectedTags)
- ✅ Intégration Trinil Icons (trinil-react package)
- ✅ Layout principal (Sidebar, IconGrid, DetailsPanel, MobileHeader)

### Composants à créer en CUSTOM
Uniquement si Primer n'a pas d'équivalent :
1. **IconGrid avec selection ring** : Primer a ActionList mais pas "grid d'icônes avec anneau de sélection"
2. **IconSlider** : Primer a Slider mais pas configuration visuelle identique
3. **Tag custom selection** : Peux réutiliser Primer Button ou Label avec estados custom

---

## 🔍 ÉTAPE 1 : PLANIFICATION EXTRÊMEMENT POUSSÉE

### Phase 1.1 : Audit du projet ACTUEL

#### Structure actuelle
```
src/
├── app/
│   ├── App.tsx (layout principal)
│   ├── components/ (11 composants custom)
│   │   ├── Button.tsx + Button.css (REMPLACER par Primer Button)
│   │   ├── IconSlider.tsx + IconSlider.css (ADAPTER ou CUSTOM)
│   │   ├── Select.tsx + Select.css (REMPLACER par Primer Select)
│   │   ├── Sidebar.tsx + Sidebar.css (ADAPTER avec Primer Stack + NavList)
│   │   ├── MobileHeader.tsx + MobileHeader.css (CUSTOM avec Primer Box)
│   │   ├── IconGrid.tsx + IconGrid.css (CUSTOM avec Primer Grid patterns)
│   │   ├── Tag.tsx + Tag.css (REMPLACER par Primer Label ou Button)
│   │   ├── TagFilter.tsx (REMPLACER par Primer ActionList)
│   │   ├── TagMenu.tsx + TagMenu.css (REMPLACER par Primer Sheet)
│   │   ├── DetailsPanel.tsx + DetailsPanel.css (CUSTOM avec Primer Box/Stack)
│   │   └── Tooltip.tsx + Tooltip.css (REMPLACER par Primer Tooltip)
│   ├── data/
│   │   └── iconTags.ts (GARDER IDENTIQUE)
├── styles/
│   ├── index.css (REMPLACER imports)
│   ├── theme.css (SUPPRIMER - remplacer par @primer/primitives)
│   ├── fonts.css (SUPPRIMER - remplacer par Primer)
│   ├── tailwind.css (SUPPRIMER)
│   └── ...
└── main.tsx
```

#### Dependencies ACTUELLES
```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "trinil-react": "1.1.2",
  "vite": "6.3.5"
}
```

#### Dependencies À AJOUTER
```json
{
  "@primer/primitives": "^10.x.x",
  "@primer/react": "^37.x.x",
  "@radix-ui/*": "^latest" (dépendances de Primer)
}
```

#### Dependencies À SUPPRIMER
```json
{
  "@tailwindcss/vite": "4.1.12",
  "tailwindcss": "4.1.12"
}
```

---

### Phase 1.2 : Analyse détaillée des Composants Primer

#### Composants Primer disponibles & MAPPING

| Composant Actuel | État | Composant Primer | Effort | Notes |
|---|---|---|---|---|
| Button.tsx | ✅ Remplaçable | `<Button>` | 📍 Minimal | Primer Button a variant/size identiques |
| Select.tsx | ✅ Remplaçable | `<Select>` | 📍 Minimal | Même API |
| Tooltip.tsx | ✅ Remplaçable | `<Tooltip>` | 📍 Minimal | Composant natif Primer |
| Tag.tsx | ⚠️ Partiellement | `<Label>` ou `<Button>` | 📍 Minimal | Adapter la logique de sélection |
| TagFilter.tsx | ✅ Remplaçable | `<ActionList>` | 📍 Minimal | Parfait pour filtres |
| TagMenu.tsx | ✅ Remplaçable | `<ActionMenu>` + `<ActionList>` | 📍 Minimal | Menu déroulant parfait |
| Sidebar.tsx | ⚠️ À adapter | `<Box>` + `<Stack>` + `<NavList>` | 📍 Faible | Layout primitives |
| MobileHeader.tsx | ⚠️ À adapter | `<Box>` + `<Stack>` + `<PageHeader>` | 📍 Faible | Layout primitives |
| IconGrid.tsx | ❌ CUSTOM | N/A - créer avec Primer primitives | 🔴 Moyen | Pas d'équivalent grille d'icônes |
| IconSlider.tsx | ⚠️ À adapter | `<Slider>` | 🟡 Moyen | Primer a Slider, adapter styles |
| DetailsPanel.tsx | ⚠️ À adapter | `<Box>` + `<Stack>` + `<Dialog>` | 📍 Faible | Layout primitives |

---

### Phase 1.3 : Stratégie de tokens Primer

#### Imports CSS requis pour Primer Primitives
```css
/* SIZE & SPACING */
@import '@primer/primitives/dist/css/base/size/size.css';
@import '@primer/primitives/dist/css/functional/size/border.css';
@import '@primer/primitives/dist/css/functional/size/breakpoints.css';
@import '@primer/primitives/dist/css/functional/size/size.css';

/* TYPOGRAPHY */
@import '@primer/primitives/dist/css/base/typography/typography.css';
@import '@primer/primitives/dist/css/functional/typography/typography.css';

/* COLORS - Par thème */
@import '@primer/primitives/dist/css/functional/themes/light.css';
@import '@primer/primitives/dist/css/functional/themes/dark.css';
/* Optional: high-contrast, colorblind modes */
```

#### Variables CSS Primer à utiliser
```css
/* COLORS */
var(--fgColor-default)       /* Texte principal */
var(--fgColor-muted)         /* Texte secondaire */
var(--fgColor-subtle)        /* Texte très discret */
var(--bgColor-default)       /* Fond principal */
var(--bgColor-secondary)     /* Fond secondaire */
var(--bgColor-tertiary)      /* Fond tertiaire */
var(--borderColor-default)   /* Bordures */
var(--borderColor-muted)     /* Bordures discrètes */

/* ACCENT (Brand color) */
var(--borderColor-accent)    /* Pour sélections */
var(--fgColor-accent)        /* Pour highlights */
var(--bgColor-accent)        /* Pour boutons primaires */

/* TYPOGRAPHY */
var(--fontFamily-default)    /* Système font stack */
var(--fontFamily-monospace)  /* Pour code */
var(--fontSize-body)         /* Taille standard */
var(--fontWeight-semibold)   /* Pour titres */

/* SPACING */
var(--spacing-1)             /* 4px */
var(--spacing-2)             /* 8px */
var(--spacing-3)             /* 16px */
var(--spacing-4)             /* 24px */
var(--spacing-5)             /* 32px */
var(--spacing-6)             /* 40px */

/* RADIUS */
var(--borderRadius-small)    /* 6px */
var(--borderRadius-medium)   /* 8px */
var(--borderRadius-large)    /* 12px */

/* SHADOWS */
var(--shadow-small)
var(--shadow-medium)
var(--shadow-large)

/* BREAKPOINTS */
var(--breakpoint-sm)         /* 544px */
var(--breakpoint-md)         /* 768px */
var(--breakpoint-lg)         /* 1012px */
var(--breakpoint-xl)         /* 1280px */
```

#### Theming setup (index.html)
```html
<html data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
```

---

### Phase 1.4 : Mapping détaillé Component → Primer

#### A. COMPOSANTS 100% REMPLAÇABLES

**Button.tsx → `<Button>` (Primer React)**
```tsx
// AVANT
<button className="ds-button primary md">Click</button>

// APRÈS
<Button variant="primary">Click</Button>
```
- Variants: `primary`, `default`, `danger` ✅
- Sizes: `small`, `medium`, `large` ✅
- Props: `loading`, `disabled`, `fullWidth` ✅

**Select.tsx → `<Select>` (Primer React)**
```tsx
// AVANT
<Select value={language} onValueChange={setLanguage} />

// APRÈS
<FormControl>
  <FormControl.Label>Language</FormControl.Label>
  <Select value={language} onChange={setLanguage}>
    <Select.Option value="react">React</Select.Option>
  </Select>
</FormControl>
```

**Tooltip.tsx → `<Tooltip>` (Primer React)**
```tsx
// AVANT
<Tooltip iconName={name} x={x} top={y} />

// APRÈS
<Tooltip direction="n" text={name}>
  <button>{name}</button>
</Tooltip>
```

**Tag.tsx → `<Label>` (Primer React)**
```tsx
// AVANT
<Tag selected={isSelected} onClick={toggle} />

// APRÈS
<Label variant={isSelected ? "primary" : "secondary"}>
  {tagName}
</Label>
// ou
<Button variant="ghost" selected={isSelected}>
  {tagName}
</Button>
```

#### B. COMPOSANTS À ADAPTER (Primer + custom CSS)

**Sidebar.tsx**
```tsx
// Primer primitives: Box, Stack, NavList
<Box paddingX={4} paddingY={6}>
  <Stack gap={6} direction="vertical">
    <Text size="large" weight="semibold">Trinil</Text>
    <Stack gap={2} direction="vertical">
      <TextInput />
      <IconSlider />
      <ActionList>
        {/* Thèmes */}
      </ActionList>
    </Stack>
  </Stack>
</Box>
```

**MobileHeader.tsx**
```tsx
// Primer primitives: Box, Stack, IconButton
<Box backgroundColor="bgColor-secondary" paddingX={3} paddingY={2}>
  <Stack gap={2} direction="horizontal">
    <TextInput placeholder="Search" />
    <IconButton icon={MenuIcon} />
  </Stack>
</Box>
```

**DetailsPanel.tsx**
```tsx
// Primer primitives: Box, Stack, Dialog
<Box 
  borderLeft="1px solid"
  borderColor="borderColor-default"
  paddingX={4} paddingY={6}
>
  <Stack gap={6} direction="vertical">
    <Text size="large" weight="semibold">Details</Text>
    {/* Contenu */}
  </Stack>
</Box>
```

#### C. COMPOSANTS CUSTOM AVEC TOKENS PRIMER

**IconGrid.tsx (CUSTOM)**
- Utiliser `display: grid` ou `display: flex` (Primer primitives)
- Couleurs: `var(--bgColor-default)`, `var(--borderColor-accent)` pour sélection
- Spacing: `var(--spacing-3)` pour gaps
- Border-radius: `var(--borderRadius-medium)`
- Transition & hover: Suivre patterns Primer

```tsx
// Custom IconGrid.css avec Primer tokens
.icon-button {
  background: var(--bgColor-default);
  border: 1px solid var(--borderColor-default);
  border-radius: var(--borderRadius-medium);
  padding: var(--spacing-2);
  transition: all 0.2s;
}

.icon-button:hover {
  background: var(--bgColor-secondary);
  border-color: var(--borderColor-muted);
}

.icon-button.selected {
  outline: 2px solid var(--borderColor-accent);
  outline-offset: 2px;
  background: var(--bgColor-accent);
  color: var(--fgColor-onEmphasis);
}
```

**IconSlider.tsx (ADAPTER)**
- Utiliser `<Slider>` Primer React si compatible
- Sinon créer avec `<input type="range">`
- Styles via Primer tokens pour background, track, thumb

---

### Phase 1.5 : Architecture CSS finale

#### Structure après refactor
```
src/
├── styles/
│   ├── index.css (NEW - imports Primer)
│   ├── theme.css (NEW - custom overrides Primer si besoin)
│   └── custom-components.css (NEW - IconGrid, IconSlider custom)
├── app/
│   ├── components/
│   │   ├── IconGrid.tsx + IconGrid.css (CUSTOM)
│   │   ├── IconSlider.tsx + IconSlider.css (ADAPT)
│   │   ├── DetailsPanel.tsx (Primer Box/Stack)
│   │   ├── MobileHeader.tsx (Primer Box/Stack)
│   │   ├── Sidebar.tsx (Primer NavList/Stack)
│   │   ├── Button.tsx (SUPPRIMER - utiliser Primer)
│   │   ├── Select.tsx (SUPPRIMER - utiliser Primer)
│   │   ├── Tooltip.tsx (SUPPRIMER - utiliser Primer)
│   │   ├── Tag.tsx (SUPPRIMER - utiliser Primer)
│   │   ├── TagFilter.tsx (ADAPT avec Primer ActionList)
│   │   └── TagMenu.tsx (ADAPT avec Primer ActionMenu)
│   └── ...
```

#### index.css (NEW)
```css
/* Primer Design System */
@import '@primer/primitives/dist/css/base/size/size.css';
@import '@primer/primitives/dist/css/functional/size/border.css';
@import '@primer/primitives/dist/css/functional/size/size.css';
@import '@primer/primitives/dist/css/base/typography/typography.css';
@import '@primer/primitives/dist/css/functional/typography/typography.css';
@import '@primer/primitives/dist/css/functional/themes/light.css';
@import '@primer/primitives/dist/css/functional/themes/dark.css';

/* Typos */ 
body {
  font-family: var(--fontFamily-default);
  color: var(--fgColor-default);
  background: var(--bgColor-default);
}

h1, h2, h3, h4 {
  font-weight: var(--fontWeight-bold);
}

/* Custom components */
@import './custom-components.css';
```

---

### Phase 1.6 : Impact par fichier

| Fichier | État | Impact | Effort |
|---|---|---|---|
| package.json | 🔄 Modifier | Ajouter Primer, supprimer Tailwind | Faible |
| vite.config.ts | 🔄 Modifier | Supprimer plugin Tailwind | Faible |
| index.html | 📋 Vérifier | Ajouter data-color-mode si besoin | Faible |
| src/styles/index.css | 🔄 Remplacer | Nouveaux imports Primer | Faible |
| src/styles/theme.css | ❌ Supprimer | Remplacé par Primer | - |
| src/styles/fonts.css | ❌ Supprimer | Remplacé par Primer typography | - |
| src/styles/tailwind.css | ❌ Supprimer | Plus nécessaire | - |
| src/app/App.tsx | 🔄 Modifier | Adapter layout avec Primer | Faible |
| src/app/components/*.tsx | 🔄 Modifier | Importer Primer components | Moyen |
| src/app/components/App.css | ❌ Supprimer | Remplacé par Primer + custom | - |
| src/app/components/*.css | 🔄 Modifier | Utiliser uniquement Primer tokens | Moyen |
| src/app/data/iconTags.ts | ✅ Garder | AUCUN CHANGEMENT | - |
| package-lock.json | 🔄 Régénérer | Après npm install | - |

---

## 🚀 ÉTAPE 2 : EXÉCUTION (ORDRE D'OPÉRATION CRITIQUE)

### Ordre d'exécution pour éviter les conflits

1. **Installer Primer packages** (avant suppression Tailwind)
   ```bash
   npm install @primer/primitives @primer/react
   ```

2. **Créer nouveau branch**
   ```bash
   git checkout -b refactor/primer-design-system
   ```

3. **Supprimer dépendances Tailwind**
   ```bash
   npm uninstall @tailwindcss/vite tailwindcss
   ```

4. **Remplacer fichiers de styles**
   - Supprimer: theme.css, fonts.css, tailwind.css
   - Créer: index.css (avec imports Primer), custom-components.css

5. **Mettre à jour vite.config.ts**
   - Supprimer import tailwindcss

6. **Refactoriser composants** (dans cet ordre de dépendances)
   - Phase 1: Button, Select, Tooltip (simples remplacements)
   - Phase 2: Tag, TagFilter, TagMenu
   - Phase 3: Sidebar, MobileHeader, DetailsPanel
   - Phase 4: IconGrid, IconSlider (custom complexes)

7. **Tester visuellement** avant commit

8. **Commit progressifs**
   ```
   - refactor: install @primer packages
   - refactor: remove Tailwind, migrate to Primer theme
   - refactor: replace Button, Select, Tooltip with Primer
   - refactor: adapt Tag filtering with Primer ActionList
   - refactor: adapt sidebar/header layout with Primer Box/Stack
   - refactor: create custom IconGrid with Primer tokens
   - refactor: adapt IconSlider with Primer design
   ```

---

## ✅ ÉTAPE 3 : VÉRIFICATION

### Checklist de vérification

- [ ] **Build sans erreurs** : `npm run build`
- [ ] **Dev server lance** : `npm run dev` sans erreurs
- [ ] **Visual pass** : Tous les composants affichent correctement
- [ ] **Responsive** : Mobile, tablet, desktop fonctionnent
- [ ] **Dark mode** : Toggle fonctionne si setup
- [ ] **Interactions** : Click buttons, selects, filters réagissent
- [ ] **Performance** : Pas de ralentissements
- [ ] **Git history** : Commits organisés et explicites

---

## 📝 NOTES IMPORTANTES

### Respecter la philosophie Primer
- ✅ Utiliser les tokens CSS Primer autant que possible
- ✅ Garder les patterns de Primer (ActionList, Box, Stack)
- ✅ Suivre la hiérarchie typographique Primer
- ✅ Utiliser les palettes de couleurs Primer (light/dark)
- ❌ NE PAS créer de tokens custom inutiles
- ❌ NE PAS duplicater styles Primer

### Custom IconGrid rationale
- Primer n'a pas de composant "grille d'icônes avec sélection ring"
- C'est un cas d'usage spécifique à ce projet
- Solution: Custom CSS utilisant **uniquement** Primer tokens
- Pas de hardcoded colors - tout via `var(--xxx)`

### Timeframe estimé
- Planification ✅ (4h - déjà fait)
- Installation & migration styles (30min)
- Refactor composants simples (1h)
- Refactor composants complexes (2h)
- Tests & validation (1h)
- **Total : ~4.5 heures**

---

**Document de planification : COMPLET ✅**  
**Prêt pour passage à Étape 2 (Exécution)**
