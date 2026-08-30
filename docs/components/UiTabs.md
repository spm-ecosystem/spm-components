# UiTabs

## Purpose & Use Cases

`UiTabs` provides a flexible tabbed navigation and content switching component. It supports:
- **Navigational Mode**: Tab items render as standard hyperlinks (`<a>` with `href`) for URL routing and multi-page layouts.
- **Local Panel Mode**: Tab items render as buttons switching embedded HTML tab panels (`contentHtml`) dynamically within the client without reloading.
- **Visual Variants**: `'underline'` (default), `'pill'`, and `'boxed'`.
- **Orientations**: `'horizontal'` (default) and `'vertical'`.
- **URL Parameter Sync**: Optional `activeParamName` to synchronize active tab selection with URL search parameters (e.g., `?tab=settings`).
- **Badges & Disabled State**: Tab items can display count/status badges (`badge`) and be individually disabled (`disabled`).

## Properties (Props API)

### `UiTabsProps`

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `tabs` | `UiTabItem[]` | `[]` | Array of tab descriptor items. |
| `activeParamName` | `string` | `undefined` | Optional URL search parameter key to synchronize active tab ID with browser URL query string. |
| `variant` | `'underline' \| 'pill' \| 'boxed'` | `'underline'` | Visual appearance variant (`'underline'`, `'pill'`, `'boxed'`). |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction for tab list and panels (`'horizontal'`, `'vertical'`). |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `UiTabItem`

| Field | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Unique identifier for the tab. |
| `label` | `string` | No | Display label text for the tab button or link. |
| `href` | `string` | Yes | Target URL for navigational mode (used when `contentHtml` is not provided). |
| `badge` | `string \| number` | Yes | Optional count or status pill displayed next to the tab label. |
| `contentHtml` | `string` | Yes | Raw HTML content to render inside the active tab panel (Local Panel mode). |
| `active` | `boolean` | Yes | Whether the tab is initially active (overridden by URL query param if `activeParamName` matches). |
| `disabled` | `boolean` | Yes | Disables tab selection and navigation. |

## Design Tokens (CSS Variables)

- `var(--spm-border)` - Tab bar border line and boxed tab border outline.
- `var(--spm-accent)` - Active tab indicator underline, pill background, and active highlights.
- `var(--spm-accent-fg)` - Text color for active pill tabs.
- `var(--spm-text-primary)` - Active tab label text and active tab panel content color.
- `var(--spm-text-secondary)` - Inactive tab label color.
- `var(--spm-text-muted)` - Badge text color and muted secondary elements.
- `var(--spm-bg-secondary)` - Background color for boxed tab lists.
- `var(--spm-bg-surface)` - Background color for active boxed tab item.
- `var(--spm-bg-tertiary)` - Background color for inactive tab item badges.
- `var(--spm-radius)` - Border radius for boxed container and tab items.

## Veneer Spec (.vnr) Examples

### 1. Navigational Mode (URL Navigation)

```vnr
reconstruct "#subnav-tabs" -> UiTabs {
    variant: "underline";
    orientation: "horizontal";

    child tabs extends UiTabItem {
        selector: "#subnav ul li a";
        bind id: "self | attr:data-tab-id";
        bind label: "self | text";
        bind href: "self | attr:href";
        bind badge: "span.badge | text";
    }
}
```

### 2. Local Panel Mode (Client-Side Tab Switching)

```vnr
reconstruct "#content-sections" -> UiTabs {
    variant: "boxed";
    orientation: "horizontal";
    activeParamName: "tab";

    child tabs extends UiTabItem {
        selector: ".tab-section";
        bind id: "self | attr:id";
        bind label: "h3.tab-title | text";
        bind contentHtml: ".tab-body | html";
    }
}
```
