# `UiDevDiagnosticPanel` Component Specification

- **Component Name**: `UiDevDiagnosticPanel`
- **Category**: Dedicated Layout Component
- **Source File**: `src/components/dedicated/UiDevDiagnosticPanel.tsx`
- **Registry Key**: `UiDevDiagnosticPanel`

---

## 1. Overview & Purpose

`UiDevDiagnosticPanel` is an isolated developer overlay component designed to monitor runtime modernization health, missing DOM selectors, WebSocket hot-reloading events, and system notifications during extension development mode (`isDev`).

It renders as an encapsulated dark surface drawer (`#09090b` / `#000000`) inside a dedicated Shadow DOM root (`#spm-dev-diagnostic-host`), ensuring 100% style isolation from host website CSS or user theme variables.

---

## 2. Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `items` | `DevDiagnosticItem[]` | `[]` | List of diagnostic events (`id`, `type`, `severity`, `title`, `message`, `details`, `timestamp`, `occurrenceCount`). |
| `onClear` | `() => void` | `undefined` | Callback invoked when the user clicks the "Clear" button. |
| `initialExpanded` | `boolean` | `false` | Initial state of the drawer expansion. |
| `className` | `string` | `''` | Custom CSS class name. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `DevDiagnosticItem` Schema

- `id`: `string` - Unique identifier for the diagnostic entry.
- `type`: `'MISSING_SELECTOR' \| 'BUILD_ERROR' \| 'WEBSOCKET_DISCONNECTED' \| 'SYSTEM_INFO'` - Diagnostic event category.
- `severity`: `'warning' \| 'error'` - Severity level determining badge indicator color.
- `title`: `string` - Technical summary heading.
- `message`: `string` - Detailed description or seletor name.
- `details`: `string` (optional) - Additional technical stack trace or context.
- `timestamp`: `number` - Epoch timestamp of the event.
- `occurrenceCount`: `number` (optional) - Deduplication count for duplicate events (renders `xN` badge).

---

## 3. Design Tokens (SPM Extension System Surface)

- `var(--spm-system-bg)` / `#09090b` - Main drawer background color.
- `var(--spm-system-header)` / `#000000` - Header bar background color.
- `var(--spm-system-border)` / `rgba(255, 255, 255, 0.15)` - Border divider color.
- `var(--spm-system-text)` / `#ffffff` - Primary text color.
- `var(--spm-system-muted)` / `#a1a1aa` - Muted metadata text color.
- `var(--spm-system-active-line)` / `#ffffff` - Active tab underline border.

---

## 4. Usage Example

```tsx
import { UiDevDiagnosticPanel } from 'spm-components';

<UiDevDiagnosticPanel
  items={[
    {
      id: 'diag-1',
      type: 'MISSING_SELECTOR',
      severity: 'warning',
      title: 'Missing Selector',
      message: 'table.legacy-grid -> UiTableListPage',
      timestamp: Date.now(),
      occurrenceCount: 2,
    }
  ]}
  onClear={() => console.log('Diagnostics cleared')}
/>
```
