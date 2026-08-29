import React, { useState } from 'react';

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

export function UiTerminalConsole({
  title = 'Console Output',
  logs = [],
  filterLevel = 'all',
  className = '',
  style = {},
}: UiTerminalConsoleProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>(filterLevel);

  const filteredLogs = logs.filter((l) => {
    if (selectedFilter === 'all') return true;
    return (l.level || 'info') === selectedFilter;
  });

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'error': return '#f87171';
      case 'warn': return '#fbbf24';
      case 'debug': return '#94a3b8';
      default: return '#38bdf8';
    }
  };

  return (
    <div
      className={`spm-terminal-console ${className}`}
      style={{
        backgroundColor: '#090d16',
        color: '#e2e8f0',
        borderRadius: 'var(--spm-radius, 8px)',
        border: '1px solid #1e293b',
        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>{title}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'info', 'warn', 'error'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedFilter(lvl)}
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedFilter === lvl ? '#3b82f6' : '#1e293b',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px', maxHeight: '400px', overflowY: 'auto', fontSize: '13px', lineHeight: '1.6' }}>
        {filteredLogs.length === 0 ? (
          <div style={{ color: '#64748b' }}>No console logs.</div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div key={log.id || idx} style={{ display: 'flex', gap: '10px' }}>
              {log.timestamp && <span style={{ color: '#64748b' }}>[{log.timestamp}]</span>}
              <span style={{ color: getLevelColor(log.level), fontWeight: 600, minWidth: '45px' }}>
                {(log.level || 'info').toUpperCase()}
              </span>
              <span style={{ flex: 1, wordBreak: 'break-word' }}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
