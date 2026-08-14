# UiToastContainer

## Purpose & Use Cases

`UiToastContainer` provides global toast feedback notifications and confirmation modal portals for user feedback. It manages animated toast items (`UiToast`) supporting four variant types (`info`, `warning`, `success`, `error`), backdrop blurs, auto-dismissal timers, and portal listening above SPM Shadow DOM overlays.

## Properties (Props API)

### `UiToast` Item Props API

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `message` | `string` | **Required** | Message text rendered inside toast notification. |
| `type` | `'info' \| 'warning' \| 'success' \| 'error'` | `'info'` | Feedback variant type controlling indicator border color (`info` = accent, `success` = green, `warning` = amber, `error` = red). |
| `onClose` | `() => void` | **Required** | Callback function invoked when toast is closed or auto-dismissed. |
| `className` | `string` | `''` | Custom CSS class name appended to toast element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `UiToastContainer` Portal Props API

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Screen corner positioning anchor for toast stack. |
| `className` | `string` | `''` | Custom CSS class name appended to container wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-border)` - Border color of toast card container.
- `var(--spm-radius)` - Border radius for toast item cards.
- `var(--spm-text-primary)` - Toast message body text color.
- `var(--spm-accent)` - Default indicator border color for `info` type toasts.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#global-toast-portal" -> UiToastContainer {
    urlPattern: ".*";
    position: "bottom-right";
}
```
