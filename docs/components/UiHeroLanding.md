# UiHeroLanding

## Purpose & Use Cases

`UiHeroLanding` provides a full-viewport landing page hero component for modernized index pages. It features a brand header (logo or fallback site name), tagline headline, subtext summary, prominent Call-To-Action (CTA) button, an integrated search bar (`UiSearchBar`), and quick-navigation link pills.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `siteName` | `string` | `undefined` | Fallback brand name text displayed when no logo image is supplied. |
| `logoUrl` | `string` | `undefined` | Optional image URL for brand logo. |
| `logoHref` | `string` | `'/'` | Target destination URL when clicking logo. |
| `tagline` | `string` | `undefined` | Main hero headline text. |
| `subtext` | `string` | `undefined` | Subtitle description text rendered below tagline. |
| `ctaLabel` | `string` | `undefined` | Primary call-to-action button label. |
| `ctaUrl` | `string` | `undefined` | Destination URL for CTA button. |
| `searchPlaceholder` | `string` | `undefined` | Placeholder text for embedded search bar. |
| `searchSubmitUrl` | `string` | `undefined` | Form submit action URL for search bar. |
| `searchParamName` | `string` | `undefined` | Query string parameter key for search field (e.g., `'q'`, `'search'`). |
| `primaryLinks` | `NavLink[]` | `[]` | List of pill navigation links (`{ label: string, url: string }`). |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Hero section full viewport background color.
- `var(--spm-bg-secondary)` - Background color for link pills and container elements.
- `var(--spm-border)` - Border color for link pills and input borders.
- `var(--spm-text-primary)` - Main tagline heading color.
- `var(--spm-text-secondary)` - Subtext description text color.
- `var(--spm-text-muted)` - Subtitle and helper label text color.
- `var(--spm-accent)` - Primary CTA button background color.
- `var(--spm-accent-text)` - Primary CTA button text color.
- `var(--spm-radius)` - Border radius for CTA button, input fields, and link pills.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#static-index" -> UiHeroLanding {
    urlPattern: R"(spm\.dev\/?$)";
    tagline: "Modern Component Platform";
    subtext: "High-performance modular web component architecture and documentation engine.";
    ctaLabel: "Get Started";
    ctaUrl: "/docs/overview";
    searchPlaceholder: "Search components... (e.g. UiSplitLayout, UiNavHeader)";
    searchSubmitUrl: "/docs/search";
    searchParamName: "q";

    bind siteName: "img[alt='SPM Platform'] | attr:alt";
    bind logoUrl: "img[alt='SPM Platform'] | attr:src";

    child primaryLinks extends NavLink {
        selector: "#links a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }
}
```
