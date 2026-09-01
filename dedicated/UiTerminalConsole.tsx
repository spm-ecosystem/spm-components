import React, { useState, useRef, useEffect } from 'react';

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
  filterLevel?: 'all' | 'info' | 'warn' | 'error' | 'debug';
  onClear?: () => void;
  onCopy?: (copiedText: string) => void;
  logRenderer?: (log: LogEntry, index: number) => React.ReactNode;
  toolbarSlot?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function UiTerminalConsole({
  title = 'Console Output',
  logs = [],
  autoScroll = true,
  maxLines,
  filterLevel = 'all',
  onClear,
  onCopy,
  logRenderer,
  toolbarSlot,
  className = '',
  style = {},
}: UiTerminalConsoleProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>(filterLevel);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'error':
        return 'var(--spm-console-log-error, #f87171)';
      case 'warn':
        return 'var(--spm-console-log-warn, #fbbf24)';
      case 'debug':
        return 'var(--spm-console-log-debug, #94a3b8)';
      default:
        return 'var(--spm-console-log-info, #38bdf8)';
    }
  };

  const processedLogs = maxLines && maxLines > 0 ? logs.slice(-maxLines) : logs;

  const filteredLogs = processedLogs.filter((l) => {
    if (selectedFilter !== 'all' && (l.level || 'info') !== selectedFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const msgMatch = l.message.toLowerCase().includes(q);
      const levelMatch = (l.level || 'info').toLowerCase().includes(q);
      const timeMatch = l.timestamp ? l.timestamp.toLowerCase().includes(q) : false;
      return msgMatch || levelMatch || timeMatch;
    }
    return true;
  });

  useEffect(() => {
    if (autoScroll && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, filteredLogs.length, autoScroll]);

  const handleCopy = () => {
    const formattedText = filteredLogs
      .map((l) => {
        const parts: string[] = [];
        if (l.timestamp) parts.push(`[${l.timestamp}]`);
        parts.push(`[${(l.level || 'info').toUpperCase()}]`);
        parts.push(l.message);
        return parts.join(' ');
      })
      .join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(formattedText).catch(() => {});
    }
    if (onCopy) {
      onCopy(formattedText);
    }
  };

  return (
    <div
      className={`spm-terminal-console ${className}`}
      style={{
        backgroundColor: 'var(--spm-console-bg, #090d16)',
        color: 'var(--spm-console-text, #e2e8f0)',
        borderRadius: 'var(--spm-radius, 8px)',
        border: '1px solid var(--spm-console-border, #1e293b)',
        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        className="spm-terminal-console-header"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          backgroundColor: 'var(--spm-console-header-bg, #0f172a)',
          borderBottom: '1px solid var(--spm-console-border, #1e293b)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>{title}</span>
          <span
            className="spm-terminal-console-counter"
            style={{
              fontSize: '11px',
              color: 'var(--spm-console-text-muted, #64748b)',
              fontFamily: 'system-ui, sans-serif',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {filteredLogs.length} / {logs.length} lines
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="spm-terminal-search-input"
            aria-label="Search logs"
            style={{
              fontSize: '12px',
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid var(--spm-console-border, #1e293b)',
              backgroundColor: 'var(--spm-console-bg, #090d16)',
              color: 'var(--spm-console-text, #e2e8f0)',
              outline: 'none',
              width: '130px',
            }}
          />

          <div style={{ display: 'flex', gap: '4px' }}>
            {['all', 'info', 'warn', 'error', 'debug'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedFilter(lvl)}
                style={{
                  fontSize: '11px',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedFilter === lvl ? '#ffffff' : 'var(--spm-console-border, #27272a)',
                  color: selectedFilter === lvl ? '#000000' : 'var(--spm-text-muted, #a1a1aa)',
                  textTransform: 'uppercase',
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy all logs"
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid var(--spm-console-border, #1e293b)',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: 'var(--spm-console-text, #e2e8f0)',
            }}
          >
            Copy All
          </button>

          {onClear && (
            <button
              type="button"
              onClick={onClear}
              title="Clear logs"
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--spm-console-border, #1e293b)',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: 'var(--spm-console-log-error, #f87171)',
              }}
            >
              Clear Logs
            </button>
          )}

          {toolbarSlot}
        </div>
      </div>

      <div
        ref={logsContainerRef}
        className="spm-terminal-console-body"
        style={{
          padding: '12px 16px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontSize: '13px',
          lineHeight: '1.6',
        }}
      >
        {filteredLogs.length === 0 ? (
          <div style={{ color: 'var(--spm-console-text-muted, #64748b)' }}>No console logs.</div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div key={log.id || idx} className="spm-terminal-log-row" style={{ display: 'flex', gap: '10px' }}>
              {logRenderer ? (
                logRenderer(log, idx)
              ) : (
                <>
                  {log.timestamp && (
                    <span style={{ color: 'var(--spm-console-text-muted, #64748b)' }}>[{log.timestamp}]</span>
                  )}
                  <span style={{ color: getLevelColor(log.level), fontWeight: 600, minWidth: '45px' }}>
                    {(log.level || 'info').toUpperCase()}
                  </span>
                  <span style={{ flex: 1, wordBreak: 'break-word' }}>{log.message}</span>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

