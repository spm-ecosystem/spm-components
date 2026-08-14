# UiImageViewer

## Purpose & Use Cases

`UiImageViewer` renders a full-container responsive image view. It centers the image within parent dimensions, applies CSS `object-fit` constraints (`contain` or `cover`), supports customizable background fill colors, and displays a graceful fallback state when no source image is provided.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | `undefined` | Source URL of image to display. |
| `alt` | `string` | `''` | Alt text for image element. |
| `fit` | `'contain' \| 'cover'` | `'contain'` | CSS `object-fit` sizing behavior (`contain` keeps full image visible, `cover` fills bounds). |
| `background` | `string` | `var(--spm-bg-primary)` | Container background color. |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Default viewer background color.
- `var(--spm-text-muted)` - Text color displayed when image source is missing.

## Veneer Spec (.vnr) Example

```vnr
child imageSlot -> UiImageViewer {
    selector: "#image";
    fit: "contain";

    bind src: "self | attr:src";
    bind alt: "self | attr:alt";
}
```
