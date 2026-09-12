# UiImageViewer

## Purpose & Use Cases

`UiImageViewer` renders a full-container responsive image view. It centers the image within parent dimensions, applies CSS `object-fit` constraints (`contain` or `cover`), auto-detects extreme aspect ratios (> 2.2:1 or < 0.5:1) to automatically fallback from `cover` to `contain` preventing severe cropping, provides interactive click-to-zoom and fit toggle controls, supports customizable background fill colors, and displays a graceful fallback state when no source image is provided.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | `undefined` | Source URL of image to display. |
| `alt` | `string` | `''` | Alt text for image element. |
| `fit` | `'contain' \| 'cover'` | `'contain'` | CSS `object-fit` sizing behavior (`contain` keeps full image visible, `cover` fills bounds). |
| `imageFit` | `'contain' \| 'cover'` | `undefined` | Alias for `fit` with precedence over `fit`. |
| `background` | `string` | `var(--spm-bg-primary)` | Container background color. |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |
| `enableZoom` | `boolean` | `true` | Enables click-to-zoom on image and overlay toggle fit button. |
| `minScale` | `number` | `1` | Minimum allowed zoom scale ratio. |
| `maxScale` | `number` | `5` | Maximum allowed zoom scale ratio. |
| `onFitChange` | `(fit: 'contain' \| 'cover') => void` | `undefined` | Callback fired when user toggles fit mode. |
| `onScaleChange` | `(scale: number) => void` | `undefined` | Callback fired when zoom scale value changes. |

### Pan, Zoom & Unclipped `objectFit: 'contain'` Behavior

`UiImageViewer` enforces persistent `objectFit: 'contain'` on the image element (`<img style={{ objectFit: 'contain' }} />`) during panning and zooming operations. This guarantees that image aspect ratios remain unclipped and untruncated regardless of container size or zoom level. Panning and scaling are driven dynamically via GPU-accelerated CSS transforms (`transform: translate3d(x, y, 0) scale(effectiveScale)`), providing smooth 60fps pan/zoom interactions without triggering layout reflows or clipping edges.

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Default viewer background color.
- `var(--spm-bg-secondary)` - Background color for floating controls.
- `var(--spm-border)` - Border color for floating controls.
- `var(--spm-text-primary)` - Text color for floating controls.
- `var(--spm-text-muted)` - Text color displayed when image source is missing.
- `var(--spm-radius)` - Border radius for floating controls.

## Veneer Spec (.vnr) Example

```vnr
child imageSlot -> UiImageViewer {
    selector: "#image";
    fit: "contain";
    enableZoom: true;

    bind src: "self | attr:src";
    bind alt: "self | attr:alt";
}
```

