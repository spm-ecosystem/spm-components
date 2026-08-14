# UiTagBadge

## Purpose & Use Cases

`UiTagBadge` renders tag and category pill badges. It displays a category label, post count pill, primary hyperlink (`href`), and optional interactive action buttons for adding (`+` via `addUrl`) or removing (`-` via `removeUrl`) tags in search filter sidebars.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | **Required** | Text label of tag or category. |
| `count` | `string \| number` | `undefined` | Optional post/item count displayed next to tag label. |
| `href` | `string` | `undefined` | Hyperlink URL for tag search navigation. |
| `addUrl` | `string` | `undefined` | Optional URL for `+` action button to append tag to current search. |
| `removeUrl` | `string` | `undefined` | Optional URL for `-` action button to exclude tag from current search. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-tertiary)` - Background color of tag badge pill.
- `var(--spm-border)` - Border color of tag badge pill.
- `var(--spm-text-primary)` - Primary tag label text color.
- `var(--spm-text-muted)` - Item count text color and action button icon color.
- `var(--spm-accent)` - Hover border color and active state indicator.

## Veneer Spec (.vnr) Example

```vnr
child tags extends TagItem -> UiTagBadge {
    selector: "#tag-sidebar li";
    bind label: "a:nth-of-type(1) | text";
    bind count: "span.tag-count | text";
    bind href: "a:nth-of-type(1) | attr:href";
    bind addUrl: "a:nth-of-type(2) | attr:href";
    bind removeUrl: "a:nth-of-type(3) | attr:href";
}
```
