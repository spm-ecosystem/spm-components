import React, { useState } from 'react';

export interface DevDiagnosticItem {
  id: string;
  type: 'MISSING_SELECTOR' | 'BUILD_ERROR' | 'DEV_SERVER_DISCONNECTED' | 'INVALID_PROP' | string;
  severity: 'warning' | 'error';
  title: string;
  message: string;
  details?: string;
  timestamp: number;
  occurrenceCount?: number;
}

export interface UiDevDiagnosticPanelProps {
  items?: DevDiagnosticItem[];
  onClear?: () => void;
  initialExpanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function UiDevDiagnosticPanel({
  items = [],
  onClear,
  initialExpanded = false,
  className,
  style,
}: UiDevDiagnosticPanelProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialExpanded);
  const [activeTab, setActiveTab] = useState<'all' | 'error' | 'warning'>('all');
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

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
    onClear?.();
  };

  const toggleDetails = (id: string) => {
    setExpandedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Static SPM Extension System Styles — Isolated from Theme Overrides
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
            padding: '6px 14px',
            background: '#09090b',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.75)',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ffffff';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
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
          <span style={{ color: '#ffffff', letterSpacing: '0.02em' }}>SPM DEV</span>
          <span
            data-testid="badge-counter"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1px 7px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '9999px',
              background:
                totalCount > 0
                  ? errorCount > 0
                    ? 'rgba(239, 68, 68, 0.25)'
                    : 'rgba(245, 158, 11, 0.25)'
                  : 'rgba(255, 255, 255, 0.12)',
              color:
                totalCount > 0
                  ? errorCount > 0
                    ? '#f87171'
                    : '#fbbf24'
                  : '#a1a1aa',
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
        background: '#09090b',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '8px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, system-ui, -apple-system, sans-serif',
        color: '#ffffff',
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
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          background: '#000000',
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
          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em', color: '#ffffff' }}>
            Dev Diagnostics
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleClear}
            className="spm-dev-diagnostic-clear-btn"
            title="Clear all diagnostics"
            style={{
              background: '#18181b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#a1a1aa',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.background = '#27272a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#a1a1aa';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = '#18181b';
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
              color: '#a1a1aa',
              padding: '4px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#a1a1aa')}
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

      {/* Severity Tabs — Pure White Active Line matching SPM Popup */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          background: '#000000',
          padding: '0 8px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            flex: 1,
            padding: '10px 4px',
            fontSize: '11px',
            fontWeight: activeTab === 'all' ? 700 : 500,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'all' ? '2px solid #ffffff' : '2px solid transparent',
            color: activeTab === 'all' ? '#ffffff' : '#a1a1aa',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('error')}
          style={{
            flex: 1,
            padding: '10px 4px',
            fontSize: '11px',
            fontWeight: activeTab === 'error' ? 700 : 500,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'error' ? '2px solid #ef4444' : '2px solid transparent',
            color: activeTab === 'error' ? '#f87171' : '#a1a1aa',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          Errors ({errorCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('warning')}
          style={{
            flex: 1,
            padding: '10px 4px',
            fontSize: '11px',
            fontWeight: activeTab === 'warning' ? 700 : 500,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'warning' ? '2px solid #f59e0b' : '2px solid transparent',
            color: activeTab === 'warning' ? '#fbbf24' : '#a1a1aa',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.15s ease',
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
          padding: '12px',
          overflowY: 'auto',
          maxHeight: '420px',
          background: '#09090b',
        }}
      >
        {filteredItems.length === 0 ? (
          <div
            style={{
              padding: '28px 12px',
              textAlign: 'center',
              color: '#71717a',
              fontSize: '12px',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
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
                  background: '#18181b',
                  border: `1px solid ${
                    isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  borderRadius: '6px',
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
                      color: '#71717a',
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
                    color: '#ffffff',
                    wordBreak: 'break-word',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{item.title}</span>
                  {item.occurrenceCount && item.occurrenceCount > 1 ? (
                    <span
                      data-testid={`occurrence-badge-${item.id}`}
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                      }}
                    >
                      (x{item.occurrenceCount})
                    </span>
                  ) : null}
                </div>

                {/* Monospace Message / Selector */}
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    color: '#d4d4d8',
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                    background: '#09090b',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
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
                        color: '#ffffff',
                        fontSize: '11px',
                        cursor: 'pointer',
                        padding: '2px 0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 600,
                        textDecoration: 'underline',
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
                          margin: '6px 0 0 0',
                          padding: '8px 10px',
                          background: '#000000',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                          color: '#a1a1aa',
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
