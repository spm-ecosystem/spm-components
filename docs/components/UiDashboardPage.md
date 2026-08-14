# UiDashboardPage

## Purpose & Use Cases

`UiDashboardPage` provides a card-based dashboard layout component suitable for user account control panels, settings menus, options hubs, and administrative pages. It features a header section with page title and optional subtitle, and a responsive grid of action cards (`DashboardCard`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pageTitle` | `string` | `'Dashboard'` | Title text displayed in header bar. |
| `subTitle` | `string` | `undefined` | Optional subtitle description text rendered below title. |
| `cards` | `DashboardCard[]` | `[]` | List of dashboard card objects (`{ title, description, url, urlLabel }`). |
| `height` | `string` | `'100vh'` | Height constraint of layout wrapper. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `DashboardCard` Schema

- `title`: `string` - Main title of the option card.
- `description`: `string` (optional) - Explanation or body text describing card action.
- `url`: `string` - Target URL destination for card action button.
- `urlLabel`: `string` (optional) - Custom button text label (defaults to `'Open'`).

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Layout background color.
- `var(--spm-bg-secondary)` - Header bar and card background color.
- `var(--spm-border)` - Border color for cards and header divider line.
- `var(--spm-text-primary)` - Header title and card heading text color.
- `var(--spm-text-secondary)` - Subtitle and card description text color.
- `var(--spm-accent)` - Card action button background and hover color.
- `var(--spm-accent-text)` - Text color for card action buttons.
- `var(--spm-radius)` - Border radius of dashboard cards and action buttons.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#user-index" -> UiDashboardPage {
    urlPattern: "page=account&s=home";
    pageTitle: "My Account Home";
    subTitle: "Manage your settings, options, and account status.";
    height: "calc(100vh - 78px)";

    child cards {
        selector: "#user-index h4";
        bind title: "self | text";
        bind url: "a | attr:href";
        bind urlLabel: "a | text";
        bind description: "self | nextSiblingText";
    }
}
```
