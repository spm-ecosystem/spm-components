# UiScrollPanel

## Purpose & Use Cases

`UiScrollPanel` provides a scrollable sidebar panel for detail views, media inspectors, and layout drawers. It aggregates search input (`UiSearchBar`), dynamic category tag grouping (`UiTagBadge`), categorized action buttons (`ButtonItem[]` automatically styled as `primary` or `ghost`), and raw statistics HTML blocks (`statisticsHtml`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `tags` | `TagItem[]` | `[]` | Array of tag badge objects (`{ name, count, type, url }`). Dynamically grouped into categories based on `type`. |
| `buttons` | `ButtonItem[]` | `[]` | List of action buttons (`{ label, url, targetSelector }`) automatically classified by label intent (`primary` vs `ghost`). |
| `statisticsHtml` | `string` | `undefined` | Raw HTML content rendered inside a statistics panel block. |
| `showSearch` | `boolean` | `false` | Enables integrated search bar at top of panel. |
| `searchPlaceholder` | `string` | `'Filter items…'` | Search field placeholder text. |
| `searchSubmitUrl` | `string` | `undefined` | Search form action URL target. |
| `searchParamName` | `string` | `'q'` | Search field query parameter name. |
| `width` | `string` | `'280px'` | Fixed or responsive width of panel container. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |
| `onClose` | `() => void` | `undefined` | Optional callback executed when close button is clicked. |

### Dynamic Category Tag Grouping

`UiScrollPanel` groups tag items (`TagItem[]`) dynamically by evaluating the `type` field of each item (`(t.type || 'GENERAL').toUpperCase()`). Each group is rendered under an uppercase section heading:

- `MODULES`: Package and extension component modules.
- `TECHNOLOGY`: Language, framework, and engine dependencies.
- `STATUS`: Build status, health checks, and lifecycle states.
- `TAGS`: Topic labels, keywords, and general categorization.

If `type` is omitted on a tag item, it is automatically assigned to the `GENERAL` category group.

## Design Tokens (CSS Variables)

- `var(--spm-bg-surface)` - Panel background color (`#121215`).
- `var(--spm-bg-element)` - Ghost action button background color (`#1e1e24`).
- `var(--spm-border)` - Panel divider border color (`#27272a`).
- `var(--spm-text-primary)` - Primary text color (`#ffffff`).
- `var(--spm-text-muted)` - Category section header and statistics label text color (`#94a3b8` / `#a1a1aa`).
- `var(--spm-accent)` - Primary action button background (`#ffffff`).
- `var(--spm-accent-fg)` - Primary action button text color (`#000000`).

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#sidebar" -> UiScrollPanel {
    width: "300px";
    showSearch: true;
    searchPlaceholder: "Filter modules...";
    searchSubmitUrl: "/docs/search";
    searchParamName: "q";

    bind statisticsHtml: "#stats-summary | html";

    child tags extends TagItem {
        selector: "#meta-sidebar .tag-group-item";
        bind name: "a.tag-name | text";
        bind count: "span.tag-count | text";
        bind type: "self | attr:data-category";
        bind url: "a.tag-name | attr:href";
    }

    child buttons extends ButtonItem {
        selector: "#actions-list a";
        bind label: "self | text";
        bind url: "self | hrefOrOnclick";
        bind targetSelector: "self | selector";
    }
}
```
