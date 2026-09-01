# UiNavHeader

## Purpose & Use Cases

`UiNavHeader` provides a responsive, customizable site header component for modernized layouts. It renders a brand identity section (logo image or fallback site name text) on the left, primary navigation links centered in the middle, secondary action/utility links (such as login/user status) on the right, and supports multiple layout configurations (`standard`, `stacked`, `minimal`). It includes active URL matching logic to highlight current navigation routes automatically using CSS `color-mix()` based on `var(--spm-accent)`.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `siteName` | `string` | `'Site'` | Fallback site title text displayed when no logo image URL is provided. |
| `logoUrl` | `string` | `undefined` | Optional image URL for site logo. |
| `logoHref` | `string` | `'/'` | Target URL when clicking logo or site title. |
| `primaryLinks` | `NavLink[]` | `[]` | Primary navigation items centered in main bar (`{ label: string, url: string }`). |
| `secondaryLinks` | `NavLink[]` | `[]` | Secondary/user action items aligned to right corner (`{ label: string, url: string }`). |
| `items` | `NavLink[]` | `[]` | Alias for `primaryLinks` navigation items array. |
| `extraHtml` | `string` | `undefined` | Sanitized raw HTML block rendered on the right side of the navigation bar. |
| `layout` | `'standard' \| 'stacked' \| 'minimal'` | `'standard'` | Header layout variant (`standard` = single bar with centered links, `stacked` = 2-tier header bar with secondary actions on top and primary nav on bottom, `minimal` = compact brand-only container). |
| `sticky` | `boolean` | `false` | When `true`, fixes navigation header to top of viewport during scrolling with blur backdrop filter. |
| `hideOnMobile` | `boolean` | `false` | When `true`, hides navigation header on viewports narrower than `mobileBreakpoint`. |
| `mobileBreakpoint` | `number` | `720` | Pixel width threshold for mobile responsive hiding. |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### Layout Variants

- `"standard"`: Single-row header bar containing brand logo/title on the left, primary navigation links centered in the middle, and secondary action links / extra HTML aligned to the right.
- `"stacked"`: 2-tier header bar layout. Top tier contains brand logo/title and secondary user action links; bottom tier features a dedicated, horizontally scrollable primary navigation bar.
- `"minimal"`: Compact single-row container that centers the brand logo/title, hiding primary and secondary navigation links.

### Sticky Navigation Behavior

When `sticky={true}` (or `sticky: true` in `.vnr`), `UiNavHeader` attaches to the top of the viewport (`top: 0`) and remains fixed in view while the user scrolls down the page.

The following CSS rules are applied to the header root element:
```css
position: sticky;
top: 0;
z-index: 1000;
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
```

This creates a modern semi-translucent frosted glass effect using `rgba(18, 18, 21, 0.92)` with blur, ensuring navigation links and brand identity remain continuously accessible without obstructing visibility of the underlying scrolling page content.

## Design Tokens (CSS Variables)

- `var(--spm-bg-surface)` - Background color of header bar container (`rgba(18, 18, 21, 0.92)`).
- `var(--spm-accent)` - Dynamic accent color for active link text, bottom indicator line, pill background, and glow.
- `var(--spm-border)` - Outer border color of header bar container (`1px solid var(--spm-border)`).
- `var(--spm-text-primary)` - Site title text color.
- `var(--spm-text-muted)` - Inactive navigation link color.
- `var(--spm-radius)` - Border radius for nav container (`var(--spm-radius, 8px)`) and nav link pills (`6px`).

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#header" -> UiNavHeader {
    siteName: "SPM Portal";
    logoHref: "/";
    layout: "stacked";
    sticky: true;
    hideOnMobile: false;

    bind logoUrl: "#logo img | attr:src";

    child primaryLinks extends NavLink {
        selector: "#navbar ul.main-nav a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }

    child secondaryLinks extends NavLink {
        selector: "#navbar ul.user-nav a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }
}
```
