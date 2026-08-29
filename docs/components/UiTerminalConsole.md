# UiTerminalConsole

The `UiTerminalConsole` component renders a dark, monospace live terminal output for log streams, system events, audit trails, and debug consoles.

## Props Interface

```typescript
export interface LogEntry {
  id?: string;
  timestamp?: string;
  level?: 'info' | 'warn' | 'error' | 'debug';
  message: string;
}

export interface UiTerminalConsoleProps {
  title?: string;
  logs?: LogEntry[];
  autoScroll?: boolean;
  maxLines?: number;
  filterLevel?: 'all' | 'info' | 'warn' | 'error';
  className?: string;
  style?: React.CSSProperties;
}
```

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#live-logs-container" -> UiTerminalConsole {
  title: "System Audit Console";
  filterLevel: "all";
}
```

## Theme Variables Used
- Dark theme monospace variables (`#090d16`, `#0f172a`, `#1e293b`)
- Level badge colors (`#38bdf8`, `#fbbf24`, `#f87171`)
