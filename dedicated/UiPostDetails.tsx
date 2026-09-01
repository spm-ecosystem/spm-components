import { UiTagBadge } from './UiTagBadge';
import { UiSearchBar } from './UiSearchBar';
import { triggerProxyClick } from '../../content/engine';
import React from 'react';

export interface TagItem {
  name: string;
  count: string;
  type: string;
  url: string;
  addUrl?: string;
  removeUrl?: string;
}

export interface GenericButtonItem {
  label: string;
  url: string;
  targetSelector?: string;
  iconSvg?: string; // Optional raw SVG path/code passed from manifest
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface TagGroupConfig {
  title: string;
  typeKey: string;
}

export interface UiPostDetailsProps {
  imageUrl?: string;
  imageAlt?: string;
  tags?: TagItem[];
  tagGroups?: TagGroupConfig[];
  statisticsHtml?: string;
  buttons?: GenericButtonItem[];
  
  // Customizable sidebar search configuration
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchSubmitUrl?: string;
  searchParamName?: string;

  // New Slots
  mediaSlot?: React.ReactNode;
  sidebarSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}

export function UiPostDetails({
  imageUrl,
  imageAlt,
  tags = [],
  tagGroups,
  statisticsHtml = '',
  buttons = [],
  showSearch = true,
  searchPlaceholder = 'Search…',
  searchSubmitUrl = '',
  searchParamName = 'tags',
  mediaSlot,
  sidebarSlot,
  actionsSlot,
  footerSlot,
}: UiPostDetailsProps) {

  const renderTagGroup = (title: string, groupTags: TagItem[]) => {
    if (groupTags.length === 0) return null;
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--spm-text-muted)',
            margin: '0 0 10px 0',
          }}
        >
          {title}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {groupTags.map((tag, i) => (
            <UiTagBadge
              key={i}
              label={tag.name}
              count={tag.count}
              href={tag.url}
              addUrl={tag.addUrl}
              removeUrl={tag.removeUrl}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderedTagGroups = (() => {
    if (tagGroups && tagGroups.length > 0) {
      return tagGroups.map((g, idx) => {
        const filtered = tags.filter(t => t.type && t.type.includes(g.typeKey));
        return (
          <React.Fragment key={idx}>
            {renderTagGroup(g.title, filtered)}
          </React.Fragment>
        );
      });
    }

    // Dynamic unique types fallback
    const uniqueTypes = Array.from(new Set(tags.map(t => t.type || 'general'))).filter(Boolean);
    return uniqueTypes.map((type, idx) => {
      const filtered = tags.filter(t => (t.type || 'general') === type);
      const title = type.charAt(0).toUpperCase() + type.slice(1).replace(/[-_]/g, ' ') + 's';
      return (
        <React.Fragment key={idx}>
          {renderTagGroup(title, filtered)}
        </React.Fragment>
      );
    });
  })();

  const getButtonStyles = (variant: 'primary' | 'secondary' | 'ghost') => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--spm-accent)',
          color: 'var(--spm-accent-fg, #ffffff)',
          border: '1px solid var(--spm-accent)',
          hoverBg: 'var(--spm-accent-hover)',
          hoverBorder: 'var(--spm-accent-hover)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--spm-text-primary)',
          border: '1px solid transparent',
          hoverBg: 'var(--spm-bg-tertiary)',
          hoverBorder: 'var(--spm-border)',
        };
      case 'secondary':
      default:
        return {
          background: 'var(--spm-bg-secondary)',
          color: 'var(--spm-text-primary)',
          border: '1px solid var(--spm-border)',
          hoverBg: 'var(--spm-bg-tertiary)',
          hoverBorder: 'var(--spm-accent)',
        };
    }
  };

  return (
    <div
      className="spm-post-details-container"
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 76px)',
        background: 'var(--spm-bg-primary)',
        color: 'var(--spm-text-primary)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <style>{`
        @media (max-width: 720px) {
          .spm-post-details-container {
            flex-direction: column !important;
            overflow-y: auto !important;
            height: auto !important;
            min-height: 100vh !important;
          }
          .spm-post-details-aside {
            width: 100% !important;
            border-right: none !important;
            border-top: 1px solid var(--spm-border) !important;
            order: 2 !important;
            flex-shrink: 0 !important;
            overflow-y: visible !important;
            background: var(--spm-bg-secondary) !important;
            padding: 16px !important;
          }
          .spm-post-details-main {
            width: 100% !important;
            padding: 16px !important;
            order: 1 !important;
            flex-shrink: 0 !important;
            overflow-y: visible !important;
          }
        }
      `}</style>

      {/* Sidebar: Configurable Search, Tags & Statistics */}
      <aside
        className="spm-post-details-aside"
        style={{
          width: '260px',
          flexShrink: 0,
          borderRight: '1px solid var(--spm-border)',
          background: 'var(--spm-bg-secondary)',
          padding: '20px',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {showSearch && searchSubmitUrl && (
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--spm-text-muted)',
                margin: '0 0 10px 0',
              }}
            >
              Search
            </h3>
            <UiSearchBar
              placeholder={searchPlaceholder}
              submitUrl={searchSubmitUrl}
              queryParamName={searchParamName}
            />
          </div>
        )}

        {renderedTagGroups}

        {/* Statistics section */}
        {statisticsHtml && (
          <div
            style={{
              marginTop: '24px',
              borderTop: '1px solid var(--spm-border)',
              paddingTop: '16px',
            }}
          >
            <h3
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--spm-text-muted)',
                margin: '0 0 10px 0',
              }}
            >
              Statistics
            </h3>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--spm-text-muted)',
                lineHeight: '1.6',
              }}
              dangerouslySetInnerHTML={{ __html: statisticsHtml }}
            />
          </div>
        )}

        {/* Custom Sidebar Slot */}
        {sidebarSlot && (
          <div
            className="spm-post-details-sidebar-slot"
            style={{
              marginTop: '24px',
              borderTop: '1px solid var(--spm-border)',
              paddingTop: '16px',
            }}
          >
            {sidebarSlot}
          </div>
        )}
      </aside>

      {/* Main Viewport & Dynamic Actions */}
      <main
        className="spm-post-details-main"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Dynamic Buttons & Actions Slot */}
        {(buttons.length > 0 || actionsSlot) && (
          <div
            className="spm-post-details-actions-bar"
            style={{
              width: '100%',
              maxWidth: '800px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            {buttons.map((btn, i) => {
              const isActionNav = btn.label.toLowerCase() === 'previous' || btn.label.toLowerCase() === 'next';
              const variant = btn.variant || (isActionNav ? 'primary' : 'secondary');
              const styles = getButtonStyles(variant);
              const isPrimary = variant === 'primary';

              return (
                <a
                  key={i}
                  href={btn.url || '#'}
                  onClick={e => {
                    if (btn.targetSelector) {
                      e.preventDefault();
                      triggerProxyClick(btn.targetSelector);
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: 'var(--spm-radius)',
                    fontSize: '12px',
                    fontWeight: isPrimary ? 700 : 500,
                    textDecoration: 'none',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                    background: styles.background,
                    color: styles.color,
                    border: styles.border,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = styles.hoverBg;
                    el.style.borderColor = styles.hoverBorder;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = styles.background;
                    el.style.borderColor = styles.border.replace('1px solid ', '');
                  }}
                >
                  {btn.iconSvg && (
                    <span
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                      dangerouslySetInnerHTML={{ __html: btn.iconSvg }}
                    />
                  )}
                  {btn.label}
                </a>
              );
            })}

            {actionsSlot && (
              <div className="spm-post-details-actions-slot" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {actionsSlot}
              </div>
            )}
          </div>
        )}

        {/* Media Container (supporting mediaSlot or imageUrl fallback) */}
        <div
          className="spm-post-details-media-container"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--spm-bg-secondary)',
            border: '1px solid var(--spm-border)',
            borderRadius: 'var(--spm-radius)',
            padding: '20px',
            width: '100%',
            maxWidth: '800px',
            boxSizing: 'border-box',
          }}
        >
          {mediaSlot ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {mediaSlot}
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || 'Post image'}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 'calc(var(--spm-radius) - 2px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            />
          ) : null}
        </div>

        {/* Footer Slot */}
        {footerSlot && (
          <div
            className="spm-post-details-footer-slot"
            style={{
              width: '100%',
              maxWidth: '800px',
              marginTop: '16px',
            }}
          >
            {footerSlot}
          </div>
        )}
      </main>
    </div>
  );
}
