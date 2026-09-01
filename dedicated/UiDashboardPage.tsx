import React from 'react';

export interface DashboardCard {
  title: string;
  description?: string;
  url?: string;
  urlLabel?: string;
  value?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  [key: string]: any;
}

export interface UiDashboardPageProps {
  pageTitle?: string;
  subTitle?: string;
  cards?: DashboardCard[] | any[];
  height?: string;
  className?: string;
  style?: React.CSSProperties;

  // Layout mode variants
  layoutMode?: 'grid-2-col' | 'grid-3-col' | 'masonry' | 'vertical-stack';

  // Custom card renderer
  renderCard?: (card: any, index: number) => React.ReactNode;

  // Layout slots
  sidebarSlot?: React.ReactNode;
  headerSlot?: React.ReactNode;
}

export function UiDashboardPage({
  pageTitle = 'Dashboard',
  subTitle,
  cards = [],
  height = '100vh',
  className = '',
  style = {},
  layoutMode = 'vertical-stack',
  renderCard,
  sidebarSlot,
  headerSlot,
}: UiDashboardPageProps) {
  const mainLayoutStyles: React.CSSProperties = React.useMemo(() => {
    switch (layoutMode) {
      case 'grid-2-col':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '16px',
          maxWidth: '1200px',
          width: '100%',
        };
      case 'grid-3-col':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '16px',
          maxWidth: '1400px',
          width: '100%',
        };
      case 'masonry':
        return {
          columnCount: 3,
          columnGap: '16px',
          maxWidth: '1400px',
          width: '100%',
        };
      case 'vertical-stack':
      default:
        return {
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '800px',
          width: '100%',
        };
    }
  }, [layoutMode]);

  return (
    <div
      className={`spm-dashboard-page spm-dashboard-${layoutMode} ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'row',
        height,
        background: 'var(--spm-bg-primary)',
        color: 'var(--spm-text-primary)',
        fontFamily: 'system-ui, sans-serif',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Sidebar Slot */}
      {sidebarSlot && (
        <aside
          className="spm-dashboard-sidebar"
          style={{
            width: '240px',
            flexShrink: 0,
            borderRight: '1px solid var(--spm-border)',
            background: 'var(--spm-bg-secondary)',
            padding: '16px',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {sidebarSlot}
        </aside>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
        {/* Header Slot or Default Header */}
        {headerSlot ? (
          headerSlot
        ) : (
          <header
            style={{
              padding: '24px',
              borderBottom: '1px solid var(--spm-border)',
              background: 'var(--spm-bg-secondary)',
              flexShrink: 0,
            }}
          >
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {pageTitle}
            </h1>
            {subTitle && (
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--spm-text-muted)', lineHeight: '1.4' }}>
                {subTitle}
              </p>
            )}
          </header>
        )}

        {/* Main List */}
        <main
          style={{
            padding: '24px',
            flex: 1,
            overflowY: 'auto',
            boxSizing: 'border-box',
            ...mainLayoutStyles,
          }}
        >
          {cards.length === 0 ? (
            <div style={{ color: 'var(--spm-text-muted)', fontSize: '14px', padding: '32px 0' }}>
              No options available.
            </div>
          ) : (
            cards.map((card, idx) => {
              if (renderCard) {
                return <React.Fragment key={idx}>{renderCard(card, idx)}</React.Fragment>;
              }

              return (
                <div
                  key={idx}
                  className="spm-dashboard-card"
                  style={{
                    background: 'var(--spm-bg-secondary)',
                    border: '1px solid var(--spm-border)',
                    borderRadius: 'var(--spm-radius)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'border-color 0.15s, transform 0.15s',
                    breakInside: layoutMode === 'masonry' ? 'avoid' : undefined,
                    marginBottom: layoutMode === 'masonry' ? '16px' : undefined,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--spm-accent)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--spm-border)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                      {card.title}
                    </h3>
                    {card.url && (
                      <a
                        href={card.url}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--spm-accent-fg)',
                          background: 'var(--spm-accent)',
                          padding: '4px 12px',
                          borderRadius: 'calc(var(--spm-radius) - 2px)',
                          textDecoration: 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--spm-accent-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--spm-accent)')}
                      >
                        {card.urlLabel || 'Open →'}
                      </a>
                    )}
                  </div>

                  {card.value && (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 800 }}>{card.value}</span>
                      {card.change && (
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: card.trend === 'up' ? '#ffffff' : 'var(--spm-text-muted, #a1a1aa)',
                          }}
                        >
                          {card.change}
                        </span>
                      )}
                    </div>
                  )}

                  {card.description && (
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--spm-text-muted)', lineHeight: '1.5' }}>
                      {card.description}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}
