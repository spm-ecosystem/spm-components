import React, { useState, useEffect } from 'react';
import { DevDiagnosticCollector, DevDiagnosticCollectorClass, DevDiagnosticItem } from '../../content/devDiagnostics';

export interface UiDevDiagnosticPanelProps {
  collector?: DevDiagnosticCollectorClass;
  initialExpanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function UiDevDiagnosticPanel({
  collector = DevDiagnosticCollector,
  initialExpanded = false,
  className,
  style,
}: UiDevDiagnosticPanelProps) {
  const [items, setItems] = useState<DevDiagnosticItem[]>(() => collector.getItems());
  const [isExpanded, setIsExpanded] = useState<boolean>(initialExpanded);
  const [activeTab, setActiveTab] = useState<'all' | 'error' | 'warning'>('all');
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setItems(collector.getItems());
    const unsubscribe = collector.subscribe((newItems) => {
      setItems([...newItems]);
    });
    return () => {
      unsubscribe();
    };
  }, [collector]);

  const errorCount = items.filter((i) => i.severity === 'error').length;
  const warningCount = items.filter((i) => i.severity === 'warning').length;
  const totalCount = items.length;

  const getStatusColor = (): string => {
    if (errorCount > 0) return '#ef4444';
    if (warningCount > 0) return '#f59e0b';
    return '#10b981';
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'error') return item.severity === 'error';
    if (activeTab === 'warning') return item.severity === 'warning';
    return true;
  });

  const handleClear = () => {
    collector.clear();
  };

  const toggleDetails = (id: string) => {
    setExpandedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isExpanded) {
    return (
      <div
        className={`spm-dev-diagnostic-container ${className || ''}`}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 999999,
          pointerEvents: 'auto',
          ...style,
        }}
      >
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="spm-dev-diagnostic-badge"
          aria-label="Open Dev Diagnostics"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            background: 'var(--spm-bg-secondary, #18181b)',
            color: 'var(--spm-text-primary, #f4f4f5)',
            border: '1px solid var(--spm-border, rgba(255, 255, 255, 0.12))',
            borderRadius: '9999px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--spm-accent, #6366f1)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--spm-border, rgba(255, 255, 255, 0.12))';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            data-testid="status-dot"
          >
            <circle cx="4" cy="4" r="3.5" fill={getStatusColor()} />
          </svg>
          <span>SPM DEV</span>
          <span
            data-testid="badge-counter"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1px 6px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '9999px',
              background:
                totalCount > 0
                  ? errorCount > 0
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(245, 158, 11, 0.2)'
                  : 'rgba(255, 255, 255, 0.08)',
              color:
                totalCount > 0
                  ? errorCount > 0
                    ? '#f87171'
                    : '#fbbf24'
                  : 'var(--spm-text-muted, #a1a1aa)',
            }}
          >
            {totalCount}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`spm-dev-diagnostic-drawer ${className || ''}`}
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        width: '360px',
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 32px)',
        zIndex: 999999,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--spm-bg-secondary, #18181b)',
        border: '1px solid var(--spm-border, rgba(255, 255, 255, 0.12))',
        borderRadius: 'var(--spm-radius, 8px)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.65)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: 'var(--spm-text-primary, #f4f4f5)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderBottom: '1px solid var(--spm-border, rgba(255, 255, 255, 0.08))',
          background: 'var(--spm-bg-primary, #09090b)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            data-testid="header-status-dot"
          >
            <circle cx="4" cy="4" r="3.5" fill={getStatusColor()} />
          </svg>
          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em' }}>
            Dev Diagnostics
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={handleClear}
            className="spm-dev-diagnostic-clear-btn"
            title="Clear all diagnostics"
            style={{
              background: 'transparent',
              border: '1px solid var(--spm-border, rgba(255, 255, 255, 0.1))',
              borderRadius: '4px',
              color: 'var(--spm-text-muted, #a1a1aa)',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--spm-text-primary, #f4f4f5)';
              e.currentTarget.style.borderColor = 'var(--spm-text-muted, #a1a1aa)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--spm-text-muted, #a1a1aa)';
              e.currentTarget.style.borderColor = 'var(--spm-border, rgba(255, 255, 255, 0.1))';
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="spm-dev-diagnostic-close-btn"
            title="Close Dev Diagnostics Drawer"
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: 'var(--spm-text-muted, #a1a1aa)',
              padding: '4px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--spm-text-primary, #f4f4f5)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--spm-text-muted, #a1a1aa)')}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Severity Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--spm-border, rgba(255, 255, 255, 0.08))',
          background: 'var(--spm-bg-primary, #09090b)',
          padding: '0 8px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            flex: 1,
            padding: '8px 4px',
            fontSize: '11px',
            fontWeight: activeTab === 'all' ? 600 : 500,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'all' ? '2px solid var(--spm-accent, #6366f1)' : '2px solid transparent',
            color: activeTab === 'all' ? 'var(--spm-text-primary, #f4f4f5)' : 'var(--spm-text-muted, #a1a1aa)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'color 0.15s ease',
          }}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('error')}
          style={{
            flex: 1,
            padding: '8px 4px',
            fontSize: '11px',
            fontWeight: activeTab === 'error' ? 600 : 500,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'error' ? '2px solid #ef4444' : '2px solid transparent',
            color: activeTab === 'error' ? '#f87171' : 'var(--spm-text-muted, #a1a1aa)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'color 0.15s ease',
          }}
        >
          Errors ({errorCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('warning')}
          style={{
            flex: 1,
            padding: '8px 4px',
            fontSize: '11px',
            fontWeight: activeTab === 'warning' ? 600 : 500,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'warning' ? '2px solid #f59e0b' : '2px solid transparent',
            color: activeTab === 'warning' ? '#fbbf24' : 'var(--spm-text-muted, #a1a1aa)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'color 0.15s ease',
          }}
        >
          Warnings ({warningCount})
        </button>
      </div>

      {/* Card List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '10px 12px',
          overflowY: 'auto',
          maxHeight: '420px',
        }}
      >
        {filteredItems.length === 0 ? (
          <div
            style={{
              padding: '24px 12px',
              textAlign: 'center',
              color: 'var(--spm-text-muted, #a1a1aa)',
              fontSize: '12px',
            }}
          >
            No diagnostic issues detected.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isError = item.severity === 'error';
            const isDetailsExpanded = Boolean(expandedCardIds[item.id]);

            return (
              <div
                key={item.id}
                data-testid={`diagnostic-card-${item.id}`}
                style={{
                  background: 'var(--spm-bg-surface, var(--spm-bg-tertiary, #27272a))',
                  border: `1px solid ${
                    isError ? 'rgba(239, 68, 68, 0.3)' : 'var(--spm-border, rgba(255, 255, 255, 0.08))'
                  }`,
                  borderRadius: 'var(--spm-radius, 6px)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {/* Card Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isError ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-testid="error-icon"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-testid="warning-icon"
                      >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    )}
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        color: isError ? '#f87171' : '#fbbf24',
                      }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      color: 'var(--spm-text-muted, #71717a)',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    }}
                  >
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* Title */}
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--spm-text-primary, #f4f4f5)',
                    wordBreak: 'break-word',
                  }}
                >
                  {item.title}
                </div>

                {/* Monospace Message / Selector */}
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    color: 'var(--spm-text-secondary, #d4d4d8)',
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '4px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {item.message}
                </div>

                {/* Expandable Details */}
                {item.details && (
                  <div style={{ marginTop: '2px' }}>
                    <button
                      type="button"
                      onClick={() => toggleDetails(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--spm-accent, #818cf8)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        padding: '2px 0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 500,
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          transform: isDetailsExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.15s ease',
                        }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      {isDetailsExpanded ? 'Hide Details' : 'Details'}
                    </button>
                    {isDetailsExpanded && (
                      <pre
                        data-testid={`details-block-${item.id}`}
                        style={{
                          margin: '4px 0 0 0',
                          padding: '6px 8px',
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid var(--spm-border, rgba(255, 255, 255, 0.05))',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                          color: 'var(--spm-text-muted, #a1a1aa)',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          maxHeight: '140px',
                          overflowY: 'auto',
                        }}
                      >
                        {item.details}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
