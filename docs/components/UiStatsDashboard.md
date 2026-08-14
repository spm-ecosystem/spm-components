# UiStatsDashboard

## Purpose & Use Cases

`UiStatsDashboard` provides a metrics and analytics leaderboard layout component. It presents top-ranked metrics and statistical breakdown tables (such as top tag usage, active users, or post upload counts) organized into section cards, complete with timeframe badges (`dateRangeText`) and navigation links (`navLinks`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pageTitle` | `string` | `'Statistics'` | Title text displayed in header bar. |
| `dateRangeText` | `string` | `'All time'` | Timeframe indicator text rendered in top date range badge. |
| `navLinks` | `NavLink[]` | `[]` | Navigation links array (`{ label, url }`) rendered below header. |
| `sections` | `StatSection[]` | `[]` | List of statistical leaderboard cards (`{ title, items }`). |
| `height` | `string` | `'100vh'` | Height constraint of layout wrapper. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `StatSection` & `StatItem` Schemas

- `StatSection`:
  - `title`: `string` - Heading title of leaderboard section card.
  - `items`: `StatItem[]` - Ranked item list.
- `StatItem`:
  - `place`: `string` (optional) - Rank index (e.g. `'#1'`).
  - `amount`: `string` - Metric value count or percentage label.
  - `name`: `string` - Item or entity name text.
  - `profileUrl`: `string` (optional) - Hyperlink URL associated with entity.

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Layout primary background color.
- `var(--spm-bg-secondary)` - Stat section card background color.
- `var(--spm-bg-tertiary)` - Date badge background and table row hover color.
- `var(--spm-border)` - Section card border and row divider color.
- `var(--spm-text-primary)` - Section title and item entity name text color.
- `var(--spm-text-secondary)` - Navigation link text color.
- `var(--spm-text-muted)` - Rank position label and metric count text color.
- `var(--spm-accent)` - Hover accent border and active tab link color.
- `var(--spm-radius)` - Border radius of stat cards and timeframe badges.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#content:has(div.toptencont)" -> UiStatsDashboard {
    urlPattern: "page=stats";
    pageTitle: "Booru Statistics Dashboard";
    height: "calc(100vh - 78px)";

    bind dateRangeText: "h2 | text";

    child navLinks extends NavLink {
        selector: "#content > a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }

    child sections {
        selector: "div.toptencont";
        bind title: "thead tr th | text";

        child items {
            selector: "tbody tr";
            bind place: "td:nth-child(1) | text";
            bind amount: "td:nth-child(2) | text";
            bind name: "td:nth-child(3) a | text";
            bind profileUrl: "td:nth-child(3) a | attr:href";
        }
    }
}
```
