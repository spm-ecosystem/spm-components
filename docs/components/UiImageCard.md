# UiImageCard

## Purpose & Use Cases

`UiImageCard` renders thumbnail card items for gallery feeds, grid layouts, and search results. It supports customizable aspect ratios (`square`, `video`, `portrait`, `auto`), hover scaling effects, object-fit options (`cover`, `contain`), optional title captions, and CSS variable custom width overrides.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `imageUrl` | `string` | **Required** | Source URL for card thumbnail image. |
| `linkUrl` | `string` | **Required** | Target hyperlink URL when clicking card. |
| `title` | `string` | **Required** | Title text used for caption and tooltip attributes. |
| `id` | `string` | **Required** | Unique DOM identifier assigned to card element. |
| `width` | `string` | `'160px'` | Default width of card container (overridden by `--spm-image-card-width` if defined). |
| `aspectRatio` | `'square' \| 'video' \| 'portrait' \| 'wide' \| 'auto'` | `'square'` | Predefined aspect ratio (`square` = 1/1, `video` = 16/9, `portrait` = 3/4, `wide` = 21/9, `auto` = intrinsic). |
| `imageFit` | `'cover' \| 'contain'` | `'cover'` | CSS `object-fit` property applied to image. |
| `showTitle` | `boolean` | `true` | Toggles rendering of bottom title caption block. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### Aspect Ratio Controls & Presets

`UiImageCard` enforces geometric proportions across gallery grid items to eliminate cumulative layout shift (CLS):
- `square` (default): 1:1 aspect ratio (`aspectRatio: '1 / 1'`), standard for avatars and media post grids.
- `video`: 16:9 widescreen format (`aspectRatio: '16 / 9'`), ideal for video thumbnails and horizontal photography.
- `portrait`: 3:4 vertical poster format (`aspectRatio: '3 / 4'`), standard for book covers and portrait art.
- `wide`: 21:9 ultra-wide banner format (`aspectRatio: '21 / 9'`), suited for panoramic banners.
- `auto`: Intrinsic image aspect ratio without container constraint (`aspectRatio: 'auto'`).

### Broken Image Fallback Behavior

If the source `imageUrl` fails to load, returns a 404 HTTP status, or is invalid, `UiImageCard` catches the image `onError` event and automatically falls back to rendering a standardized placeholder SVG icon (`UiImage` fallback) with neutral styling to prevent browser broken image icon glitches.

## Design Tokens (CSS Variables)

- `var(--spm-image-card-width)` - Custom variable controlling card width dynamically.
- `var(--spm-bg-secondary)` - Card background color.
- `var(--spm-border)` - Default card border color.
- `var(--spm-text-primary)` - Title text color.
- `var(--spm-text-secondary)` - Hover title text color.
- `var(--spm-accent)` - Hover state border color.
- `var(--spm-radius)` - Border radius of card container.

## Veneer Spec (.vnr) Example

```vnr
child items -> UiImageCard {
    selector: "#post-list .thumb";
    width: "180px";
    aspectRatio: "square";
    imageFit: "cover";
    showTitle: true;

    bind imageUrl: "img | attr:src";
    bind linkUrl: "a | attr:href";
    bind title: "img | attr:title";
    bind id: "self | attr:id";
}
```
