import React from 'react';

export interface UiTagBadgeProps {
  label: string;
  count?: string | number;
  href?: string;
  addUrl?: string;
  removeUrl?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'active' | 'error' | string;
  style?: React.CSSProperties;
}

export function UiTagBadge({ label, count, href, addUrl, removeUrl, variant = 'default', style: customStyle = {} }: UiTagBadgeProps) {
  const getVariantStyles = (): React.CSSProperties => {
    const v = String(variant).toLowerCase();
    if (v === 'success' || v === 'active') {
      return {
        background: 'rgba(34, 197, 94, 0.12)',
        color: '#4ade80',
        border: '1px solid rgba(34, 197, 94, 0.3)',
      };
    }
    if (v === 'danger' || v === 'error') {
      return {
        background: 'rgba(239, 68, 68, 0.12)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.3)',
      };
    }
    if (v === 'warning') {
      return {
        background: 'rgba(245, 158, 11, 0.12)',
        color: '#fbbf24',
        border: '1px solid rgba(245, 158, 11, 0.3)',
      };
    }
    if (v === 'info') {
      return {
        background: 'rgba(59, 130, 246, 0.12)',
        color: '#60a5fa',
        border: '1px solid rgba(59, 130, 246, 0.3)',
      };
    }
    return {
      background: 'var(--spm-bg-tertiary)',
      color: 'var(--spm-text-primary)',
      border: '1px solid var(--spm-border)',
    };
  };

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '16px',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: 500,
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    gap: '6px',
    ...getVariantStyles(),
    ...customStyle,
  };

  const actionStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    color: 'var(--spm-text-muted)',
    textDecoration: 'none',
    transition: 'all 0.12s ease',
    fontWeight: 700,
    fontSize: '10px',
    lineHeight: 1,
  };

  return (
    <span
      className="spm-tag-badge-container"
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <div
        style={badgeStyle}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--spm-accent)';
          e.currentTarget.style.background = 'var(--spm-bg-secondary)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--spm-border)';
          e.currentTarget.style.background = 'var(--spm-bg-tertiary)';
        }}
      >
        {/* Optional Action Controls (+ / -) */}
        {(addUrl || removeUrl) && (
          <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid var(--spm-border)', paddingRight: '6px', marginRight: '2px' }}>
            {addUrl && (
              <a
                href={addUrl}
                style={actionStyle}
                title="Add to search"
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#22c55e';
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--spm-text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                +
              </a>
            )}
            {removeUrl && (
              <a
                href={removeUrl}
                style={actionStyle}
                title="Exclude from search"
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--spm-text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                -
              </a>
            )}
          </div>
        )}

        {/* Main Tag Link */}
        {href ? (
          <a
            href={href}
            style={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 600,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--spm-accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'inherit';
            }}
          >
            {label}
          </a>
        ) : (
          <span style={{ fontWeight: 600 }}>{label}</span>
        )}

        {/* Count Badge */}
        {count !== undefined && count !== null && count !== '' && (
          <span style={{ color: 'var(--spm-text-muted)', fontSize: '9px', fontWeight: 400 }}>
            {count}
          </span>
        )}
      </div>
    </span>
  );
}
