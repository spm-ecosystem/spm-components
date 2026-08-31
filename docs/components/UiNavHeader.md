# UiNavHeader

## Purpose & Use Cases

`UiNavHeader` provides a responsive, customizable site header component for modernized layouts. It renders a brand identity section (logo image or fallback site name text), primary navigation links, secondary action/utility links, and supports multiple layout configurations (`standard`, `stacked`, `minimal`). It includes active URL matching logic to highlight current navigation routes automatically.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `siteName` | `string` | `'Site'` | Fallback site title text displayed when no logo image URL is provided. |
| `logoUrl` | `string` | `undefined` | Optional image URL for site logo. |
| `logoHref` | `string` | `'/'` | Target URL when clicking logo or site title. |
| `primaryLinks` | `NavLink[]` | `[]` | Primary navigation items (`{ label: string, url: string }`). |
| `secondaryLinks` | `NavLink[]` | `[]` | Secondary/user action items (`{ label: string, url: string }`). |
| `layout` | `'standard' \| 'stacked' \| 'minimal'` | `'standard'` | Header layout variant (`standard` = horizontal row, `stacked` = multi-tier header, `minimal` = compact container). |
| `sticky` | `boolean` | `false` | When `true`, fixes navigation header to top of viewport during scrolling with blur backdrop. |
| `hideOnMobile` | `boolean` | `false` | When `true`, hides navigation header on viewports narrower than `mobileBreakpoint`. |
| `mobileBreakpoint` | `number` | `720` | Pixel width threshold for mobile responsive hiding. |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

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

This creates a modern semi-translucent frosted glass effect using `var(--spm-bg-secondary)` with opacity, ensuring navigation links and brand identity remain continuously accessible without obstructing visibility of the underlying scrolling page content.

## Design Tokens (CSS Variables)

- `var(--spm-bg-secondary)` - Background color of header bar container.
- `var(--spm-bg-surface)` - Background color for active navigation item pills and hover highlights.
- `var(--spm-bg-tertiary)` - Background color for active pills in stacked layout.
- `var(--spm-border)` - Outer border color of header bar container (`1px solid var(--spm-border)`).
- `var(--spm-text-primary)` - Site title and active link text color.
- `var(--spm-text-muted)` - Inactive navigation link color.
- `var(--spm-accent)` - Accent indicator line for active primary navigation items.
- `var(--spm-radius)` - Border radius for nav container (`var(--spm-radius, 8px)`) and nav link pills (`6px`).

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#header" -> UiNavHeader {
    siteName: "Safebooru";
    logoHref: "/";
    layout: "standard";
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
