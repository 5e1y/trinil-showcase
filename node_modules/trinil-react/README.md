# trinil-react

React 16.8+ icon components. Tree-shakeable, zero dependencies, 765 outline icons with locked stroke styles.

## Installation

```bash
npm install trinil-react
```

## Quick Start

```tsx
import { ArrowDown, Check, UsersSearch } from 'trinil-react';

export function App() {
  return (
    <div>
      <ArrowDown size={24} />
      <Check size={32} color="green" />
      <UsersSearch ariaLabel="Search users" />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `24` | Width/height in pixels |
| `color` | `string` | `"currentColor"` | Stroke color (inherits from CSS) |
| `className` | `string` | — | CSS classes |
| `title` | `string` | — | SVG `<title>` (accessibility) |
| `ariaLabel` | `string` | — | `aria-label` attribute |

## Styling

Inherit color from CSS:

```tsx
<div style={{ color: 'blue' }}>
  <ArrowDown /> {/* Blue */}
</div>
```

Or set directly:

```tsx
<ArrowDown color="#ff5733" size={40} className="my-icon" />
```

## Accessibility

Add `ariaLabel` or `title` for standalone icons:

```tsx
<button>
  <ArrowDown ariaLabel="Scroll down" />
</button>
```

## Note

Stroke properties (`stroke-width`, `stroke-linecap`, `stroke-linejoin`) are **locked** to ensure visual consistency. Only `size`, `color`, `className`, `title`, and `ariaLabel` are customizable.

## License

MIT
