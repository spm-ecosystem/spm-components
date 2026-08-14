# UiTable

## Purpose & Use Cases

`UiTable` provides a generic, styled HTML tabular grid component. It accepts a column configuration array (`columns`), row dataset (`data`), optional row click handler (`onRowClick`), column text alignment controls, custom widths, and custom cell rendering functions.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `ColumnConfig<T>[]` | **Required** | Column definitions (`{ key, header, width, align, render }`). |
| `data` | `T[]` | **Required** | Dataset array containing row objects to render. |
| `onRowClick` | `(item: T) => void` | `undefined` | Optional click event callback executed when a table row is clicked. |
| `className` | `string` | `''` | Custom CSS class name appended to container element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `ColumnConfig<T>` Schema

- `key`: `keyof T | string` - Object property key or identifier for column value.
- `header`: `string` - Text heading displayed in table header cell.
- `width`: `string` (optional) - Width constraint for column (e.g., `'120px'`, `'15%'`).
- `align`: `'left' | 'center' | 'right'` (optional) - Text alignment inside header and data cells (defaults to `'left'`).
- `render`: `(item: T) => React.ReactNode` (optional) - Custom cell rendering callback.

## Design Tokens (CSS Variables)

- `var(--spm-bg-secondary)` - Table container background color.
- `var(--spm-bg-tertiary)` - Table header row (`<thead>`) background color.
- `var(--spm-border)` - Outer border and table cell row divider color.
- `var(--spm-text-primary)` - Cell content text color.
- `var(--spm-text-secondary)` - Table header text color.
- `var(--spm-accent)` - Hover highlight background and border accent color.
- `var(--spm-radius)` - Border radius of table wrapper container.

## Veneer Spec (.vnr) Example

```vnr
child tableRows -> UiTable {
    columns: R"([
      { "key": "id", "header": "ID", "width": "60px", "align": "center" },
      { "key": "title", "header": "Title", "align": "left" },
      { "key": "author", "header": "Author", "width": "120px" }
    ])";
}
```
