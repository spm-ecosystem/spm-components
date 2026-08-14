# UiTableListPage

## Purpose & Use Cases

`UiTableListPage` provides a complete tabular list page layout for search result indexes, directory listings, and wiki page tables. It wraps a `UiTable` grid with page title headers, column cell formatting logic (`text`, `link`, `html`, `badge`, `checkbox`), optional infinite scroll (`onLoadMore`), and bottom pagination links (`UiPaginationBar`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pageTitle` | `string` | `'List'` | Title text displayed in header bar. |
| `tableRows` | `any[]` | `[]` | Data row list array. |
| `columns` | `TableColumnConfig[]` | `undefined` | Column formatting configurations (`{ key, header, width, align, type, urlKey, badgeStyleKey }`). |
| `pageLinks` | `PageLink[]` | `[]` | Pagination links array (`{ label, url }`). |
| `height` | `string` | `'100vh'` | Height constraint of page container. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |
| `onLoadMore` | `() => Promise<{ tableRows: any[]; hasMore: boolean }>` | `undefined` | Optional async callback executed on reaching page end to load more rows. |

### `TableColumnConfig` Schema

- `key`: `string` - Row property key to extract cell data from.
- `header`: `string` - Table column header title text.
- `width`: `string` (optional) - Width constraint for column.
- `align`: `'left' | 'center' | 'right'` (optional) - Alignment of cell content.
- `type`: `'text' | 'link' | 'html' | 'badge' | 'checkbox'` (optional) - Cell renderer type.
- `urlKey`: `string` (optional) - Row property key containing hyperlink URL (used when `type` is `'link'`).
- `badgeStyleKey`: `string` (optional) - Row property key containing badge style identifier (used when `type` is `'badge'`).

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Page layout primary background color.
- `var(--spm-bg-secondary)` - Table container and header bar background color.
- `var(--spm-bg-tertiary)` - Table header row (`<thead>`) background color.
- `var(--spm-border)` - Table border and row divider color.
- `var(--spm-text-primary)` - Page title and table text content color.
- `var(--spm-text-secondary)` - Column header text color.
- `var(--spm-accent)` - Hyperlink text color and active indicators.
- `var(--spm-radius)` - Table container border radius.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#content:has(table.highlightable)" -> UiTableListPage {
    urlPattern: "page=alias&s=list";
    pageTitle: "Tag Aliases";
    height: "calc(100vh - 78px)";
    columns: R"([
      { "key": "pending", "header": "Pending", "width": "60px", "type": "checkbox" },
      { "key": "aliasName", "header": "Alias", "type": "link", "urlKey": "aliasUrl" },
      { "key": "toName", "header": "To Tag", "type": "link", "urlKey": "toUrl" },
      { "key": "reason", "header": "Reason / Discussion", "type": "text" }
    ])";

    child tableRows {
        selector: "#aliases table.highlightable tr:not(.tableheader)";
        bind pending: "td:nth-child(1) input[type='checkbox'] | attr:class";
        bind aliasName: "td:nth-child(2) a | text";
        bind aliasUrl: "td:nth-child(2) a | attr:href";
        bind toName: "td:nth-child(3) a | text";
        bind toUrl: "td:nth-child(3) a | attr:href";
        bind reason: "td:nth-child(4) | text";
    }

    child pageLinks extends DocumentLink {
        selector: "#paginator .pagination a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }
}
```
