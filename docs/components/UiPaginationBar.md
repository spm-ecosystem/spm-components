# UiPaginationBar

## Purpose & Use Cases

`UiPaginationBar` renders page navigation links for paginated feeds, lists, and search results. It parses incoming `pageLinks` data, determines page offset values automatically based on query parameters (such as `pid` or `page`), renders Previous/Next controls, and highlights the currently active page.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pageLinks` | `PageLink[]` | `[]` | List of page link objects (`{ label: string, url: string }`). |
| `paramName` | `string` | `'pid'` | Query parameter key used to derive page offset and active status. |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-secondary)` - Inactive page button background color.
- `var(--spm-bg-tertiary)` - Button hover state background color.
- `var(--spm-border)` - Border color of pagination buttons and container.
- `var(--spm-text-primary)` - Inactive page number text color.
- `var(--spm-text-secondary)` - Secondary navigation control label color.
- `var(--spm-accent)` - Active page button background color and focus border.
- `var(--spm-accent-text)` - Active page button text color.
- `var(--spm-radius)` - Border radius of individual page buttons.

## Veneer Spec (.vnr) Example

```vnr
child pageLinks extends PageLink -> UiPaginationBar {
    selector: "#paginator .pagination a";
    paramName: "pid";
    bind label: "self | text";
    bind url: "self | attr:href";
}
```
