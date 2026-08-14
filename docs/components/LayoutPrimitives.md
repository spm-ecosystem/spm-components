# LayoutPrimitives

## Purpose & Use Cases

Layout Primitives are foundational, lightweight React structural components (`UiBox`, `UiFlexRow`, `UiFlexColumn`, `UiGrid`, `UiText`, `UiImage`, `UiLink`, `UiScrollBox`) defined in `primitives/LayoutPrimitives.tsx`. They provide generic HTML layout primitives for constructing custom UI views without hardcoding visual styles or visual overrides.

## Component Overview

| Primitive | Underlying HTML Element | Key Props | Description |
| :--- | :--- | :--- | :--- |
| `UiBox` | `<div>` | `className`, `children` | Generic container block wrapper for borders, padding, and layout bounds. |
| `UiFlexRow` | `<div>` (flex row) | `className`, `children` | Horizontal Flexbox row container (`flex flex-row`). |
| `UiFlexColumn` | `<div>` (flex col) | `className`, `children` | Vertical Flexbox column container (`flex flex-col`). |
| `UiGrid` | `<div>` (grid layout) | `className`, `children` | CSS Grid container (`grid`). |
| `UiText` | `<span>` | `className`, `content` | Inline text span for rendering dynamic text content. |
| `UiImage` | `<img>` | `className`, `src`, `alt` | Standard image element for rendering responsive media. |
| `UiLink` | `<a>` | `className`, `href`, `children` | Standard hyperlink element for navigation links. |
| `UiScrollBox` | `<div>` (scrollable) | `height`, `maxHeight`, `overflow` | Scrollable container box with explicit overflow and height controls. |

## Properties (Props API)

### `PrimitiveProps` (`UiBox`, `UiFlexRow`, `UiFlexColumn`, `UiGrid`)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `className` | `string` | `undefined` | CSS class string appended to root container. |
| `children` | `React.ReactNode` | `undefined` | Nested child components or elements. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | Standard HTML `div` attributes forwarded to element. |

### `UiText` (`TextProps`)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `content` | `string` | `undefined` | Dynamic text content string rendered inside `<span>`. |
| `className` | `string` | `undefined` | Custom CSS class string. |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | - | Standard HTML `span` attributes forwarded to element. |

### `UiImage` (`ImageProps`)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | `undefined` | Source URL of image. |
| `alt` | `string` | `undefined` | Alternative text description for image. |
| `className` | `string` | `undefined` | Custom CSS class string. |
| `...props` | `ImgHTMLAttributes<HTMLImageElement>` | - | Standard HTML `img` attributes forwarded to element. |

### `UiLink` (`LinkProps`)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `href` | `string` | `undefined` | Target destination hyperlink URL. |
| `className` | `string` | `undefined` | Custom CSS class string. |
| `children` | `React.ReactNode` | `undefined` | Link label or child elements. |
| `...props` | `AnchorHTMLAttributes<HTMLAnchorElement>` | - | Standard HTML `a` attributes forwarded to element. |

### `UiScrollBox` (`ScrollBoxProps`)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `height` | `string` | `undefined` | Explicit container height (e.g. `'300px'`, `'100%'`). |
| `maxHeight` | `string` | `undefined` | Container maximum height constraint. |
| `overflow` | `'auto' \| 'scroll' \| 'hidden' \| 'visible'` | `'auto'` | CSS overflow behavior. |
| `overflowX` | `'auto' \| 'scroll' \| 'hidden' \| 'visible'` | `undefined` | Horizontal overflow behavior. |
| `overflowY` | `'auto' \| 'scroll' \| 'hidden' \| 'visible'` | `undefined` | Vertical overflow behavior. |
| `className` | `string` | `''` | Custom CSS class string. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

Layout Primitives are unstyled structural components. They accept styling via `className` and `style` properties, seamlessly inheriting SPM theme design tokens:
- `var(--spm-bg-primary)`, `var(--spm-bg-secondary)`, `var(--spm-bg-tertiary)`
- `var(--spm-text-primary)`, `var(--spm-text-secondary)`, `var(--spm-text-muted)`
- `var(--spm-border)`, `var(--spm-radius)`, `var(--spm-accent)`

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#custom-panel" -> UiFlexColumn {
    className: "my-custom-panel";
    
    child header -> UiFlexRow {
        className: "panel-header";
        child title -> UiText {
            content: "Panel Title";
        }
    }

    child image -> UiImage {
        bind src: "img | attr:src";
        bind alt: "img | attr:alt";
    }

    child link -> UiLink {
        bind href: "a | attr:href";
        child text -> UiText {
            content: "View Details";
        }
    }
}
```
