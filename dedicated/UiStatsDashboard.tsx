import React from 'react';

export interface StatItem {
  place?: string | number;
  rank?: string | number;
  amount: string;
  name: string;
  profileUrl?: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

export interface StatSection {
  title: string;
  items: StatItem[];
  sparklineSlot?: React.ReactNode;
}

export interface NavLink {
  label: string;
  url: string;
}

export interface UiStatsDashboardProps {
  pageTitle?: string;
  dateRangeText?: string;
  navLinks?: NavLink[];
  sections?: StatSection[];
  height?: string;
  className?: string;
  style?: React.CSSProperties;

  // New Slots
  sparklineSlot?: React.ReactNode;
  headerSlot?: React.ReactNode;
  toolbarSlot?: React.ReactNode;
}

export function UiStatsDashboard({
  pageTitle = 'Statistics',
  dateRangeText = 'All time',
  navLinks = [],
  sections = [],
  height = '100vh',
  className = '',
  style = {},
  sparklineSlot,
  headerSlot,
  toolbarSlot,
}: UiStatsDashboardProps) {

  const renderTrendIndicator = (trend?: 'up' | 'down' | 'neutral', change?: string) => {
    if (!trend && !change) return null;

    let color = 'var(--spm-text-muted)';
    let icon = '→';

    if (trend === 'up') {
      color = '#ffffff';
      icon = '↑';
    } else if (trend === 'down') {
      color = 'var(--spm-text-muted, #a1a1aa)';
      icon = '↓';
    }

    return (
      <span
        className="spm-stat-trend-indicator"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          fontSize: '11px',
          fontWeight: 600,
          color,
          marginLeft: '8px',
        }}
      >
        <span>{icon}</span>
        {change && <span>{change}</span>}
      </span>
    );
  };

  const getRankColors = (rankVal: number) => {
    if (rankVal === 1) {
      return {
        background: 'var(--spm-rank-gold-bg, rgba(234, 179, 8, 0.15))',
        color: 'var(--spm-rank-gold-fg, rgb(234, 179, 8))',
      };
    }
    if (rankVal === 2) {
      return {
        background: 'var(--spm-rank-silver-bg, rgba(148, 163, 184, 0.15))',
        color: 'var(--spm-rank-silver-fg, rgb(148, 163, 184))',
      };
    }
    if (rankVal === 3) {
      return {
        background: 'var(--spm-rank-bronze-bg, rgba(217, 119, 6, 0.15))',
        color: 'var(--spm-rank-bronze-fg, rgb(217, 119, 6))',
      };
    }

    return {
      background: 'var(--spm-bg-tertiary)',
      color: 'var(--spm-text-muted)',
    };
  };

  const renderStatCard = (section: StatSection, sectionIdx: number) => {
    const { title, items, sparklineSlot: sectionSparkline } = section;

    return (
      <div
        key={sectionIdx}
        className="spm-stat-card"
        style={{
          flex: '1 1 280px',
          background: 'var(--spm-bg-secondary)',
          border: '1px solid var(--spm-border)',
          borderRadius: 'var(--spm-radius)',
          padding: '16px',
          boxSizing: 'border-box',
          minWidth: '240px',
        }}
      >
        <h3
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--spm-text-primary)',
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid var(--spm-border)',
            paddingBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {title}
        </h3>

        {sectionSparkline && (
          <div className="spm-stat-card-sparkline-slot" style={{ marginBottom: '12px' }}>
            {sectionSparkline}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.length === 0 ? (
            <div style={{ color: 'var(--spm-text-muted)', fontSize: '12px', textAlign: 'center', padding: '16px 0' }}>
              No entries found.
            </div>
          ) : (
            items.map((item, idx) => {
              const rawRank = item.rank ?? item.place ?? (idx + 1);
              const numericRank = typeof rawRank === 'number' ? rawRank : parseInt(String(rawRank), 10);
              const rankColors = getRankColors(isNaN(numericRank) ? idx + 1 : numericRank);

              return (
                <div
                  key={idx}
                  className="spm-stat-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    padding: '4px 0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: rankColors.background,
                        color: rankColors.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '10px',
                        flexShrink: 0,
                      }}
                    >
                      {rawRank}
                    </span>
                    {item.profileUrl ? (
                      <a
                        href={item.profileUrl}
                        style={{
                          color: 'var(--spm-text-primary)',
                          fontWeight: 500,
                          textDecoration: 'none',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--spm-accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--spm-text-primary)')}
                      >
                        {item.name || 'Anonymous'}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--spm-text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name || 'Anonymous'}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '8px',
                        background: 'var(--spm-bg-tertiary)',
                        border: '1px solid var(--spm-border)',
                        color: 'var(--spm-text-muted)',
                      }}
                    >
                      {item.amount}
                    </span>

                    {renderTrendIndicator(item.trend, item.change)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`spm-stats-dashboard ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height,
        background: 'var(--spm-bg-primary)',
        color: 'var(--spm-text-primary)',
        fontFamily: 'system-ui, sans-serif',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--spm-border)',
          background: 'var(--spm-bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {headerSlot ? (
          headerSlot
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {pageTitle}
            </h1>
            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: 'var(--spm-bg-tertiary)', border: '1px solid var(--spm-border)', color: 'var(--spm-text-muted)' }}>
              {dateRangeText}
            </span>
          </div>
        )}

        {navLinks.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', marginTop: '4px' }}>
            {navLinks.map((link, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span style={{ color: 'var(--spm-border)' }}>|</span>}
                <a
                  href={link.url}
                  style={{ color: 'var(--spm-accent)', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--spm-accent-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--spm-accent)')}
                >
                  {link.label}
                </a>
              </React.Fragment>
            ))}
          </div>
        )}

        {toolbarSlot && (
          <div className="spm-stats-dashboard-toolbar-slot" style={{ marginTop: '8px' }}>
            {toolbarSlot}
          </div>
        )}
      </header>

      {/* Main Grid content */}
      <main
        style={{
          padding: '24px',
          flex: 1,
          overflowY: 'auto',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {sparklineSlot && (
          <div className="spm-stats-dashboard-sparkline-slot" style={{ width: '100%' }}>
            {sparklineSlot}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {sections.map((section, idx) => renderStatCard(section, idx))}
        </div>
      </main>
    </div>
  );
}
