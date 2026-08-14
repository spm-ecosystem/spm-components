# UiScrollPanel

## Purpose & Use Cases

`UiScrollPanel` provides a scrollable sidebar panel for detail views, media inspectors, and layout drawers. It aggregates search input (`UiSearchBar`), tag lists (`UiTagBadge`), categorized action buttons (`ButtonItem[]` automatically styled as `primary`, `nav`, or `ghost`), and raw statistics HTML blocks (`statisticsHtml`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `tags` | `TagItem[]` | `[]` | Array of tag badge objects (`{ name, count, type, url }`). |
| `buttons` | `ButtonItem[]` | `[]` | List of action buttons (`{ label, url, targetSelector }`) automatically classified by label intent. |
| `statisticsHtml` | `string` | `undefined` | Raw HTML content rendered inside a statistics panel block. |
| `showSearch` | `boolean` | `false` | Enables integrated search bar at top of panel. |
| `searchPlaceholder` | `string` | `undefined` | Search field placeholder text. |
| `searchSubmitUrl` | `string` | `undefined` | Search form action URL target. |
| `searchParamName` | `string` | `'q'` | Search field query parameter name. |
| `width` | `string` | `'280px'` | Fixed or responsive width of panel container. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |
| `onClose` | `() => void` | `undefined` | Optional callback executed when close button is clicked. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-secondary)` - Panel background color.
- `var(--spm-bg-tertiary)` - Section header and button background color.
- `var(--spm-border)` - Panel divider border color.
- `var(--spm-text-primary)` - Panel header and primary button text color.
- `var(--spm-text-secondary)` - Sub-heading and list item text color.
- `var(--spm-text-muted)` - Statistics label and count text color.
- `var(--spm-accent)` - Primary action button background and hover color.
- `var(--spm-radius)` - Border radius for buttons and search inputs.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#sidebar" -> UiScrollPanel {
    width: "300px";
    showSearch: true;
    searchPlaceholder: "Search tags...";
    searchSubmitUrl: "https://safebooru.org/index.php?page=post&s=list";
    searchParamName: "tags";

    bind statisticsHtml: "#stats ul | html";

    child tags extends TagItem {
        selector: "#tag-sidebar li";
        bind name: "a:last-of-type | text";
        bind count: "span.tag-count | text";
        bind type: "self | attr:class";
        bind url: "a:last-of-type | attr:href";
    }

    child buttons extends ButtonItem {
        selector: ".link-list a";
        bind label: "self | text";
        bind url: "self | hrefOrOnclick";
        bind targetSelector: "self | selector";
    }
}
```
