import { useEffect, useState, useRef } from 'react';

export interface NavLink {
  label: string;
  url?: string;
  href?: string;
}

export interface UiNavHeaderProps {
  siteName?: string;
  logoUrl?: string;
  logoHref?: string;
  primaryLinks?: NavLink[];
  secondaryLinks?: NavLink[];
  items?: NavLink[];
  layout?: 'standard' | 'stacked' | 'minimal';
  hideOnMobile?: boolean;
  mobileBreakpoint?: number;
  className?: string;
  style?: React.CSSProperties;
  sticky?: boolean;
}

function isLinkActive(url: string): boolean {
  if (!url || url === '#' || url === '/') return false;
  try {
    const current = new URL(window.location.href);
    const target = new URL(url, window.location.origin);
    return current.pathname === target.pathname &&
      current.searchParams.get('page') === target.searchParams.get('page') &&
      current.searchParams.get('s') === target.searchParams.get('s');
  } catch {
    return false;
  }
}

export function UiNavHeader({
  siteName = 'Site',
  logoUrl,
  logoHref = '/',
  primaryLinks = [],
  secondaryLinks = [],
  items = [],
  layout = 'standard',
  hideOnMobile = false,
  mobileBreakpoint = 720,
  className = '',
  style = {},
  sticky = false,
}: UiNavHeaderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const isMinimal = layout === 'minimal';
  const isStacked = layout === 'stacked';
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [mobileBreakpoint]);

  useEffect(() => {
    try {
      const root = headerRef.current?.getRootNode();
      if (root && 'host' in root) {
        const host = root.host as HTMLElement;
        if (host) {
          if (sticky) {
            host.setAttribute('sticky', 'true');
            host.style.position = 'sticky';
            host.style.top = '0';
            host.style.zIndex = '1000';
            host.style.display = 'block';
          } else {
            host.removeAttribute('sticky');
            host.style.position = '';
            host.style.top = '';
            host.style.zIndex = '';
            host.style.display = '';
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [sticky]);

  if (hideOnMobile && isMobile) return null;

  // Consolidate primary links and items (supporting url/href fallback)
  const rawLinks = items.length > 0 ? items : primaryLinks;
  const resolvedPrimaryLinks = rawLinks.map(link => ({
    label: link.label,
    url: link.url || link.href || '',
  }));

  const resolvedSecondaryLinks = secondaryLinks.map(link => ({
    label: link.label,
    url: link.url || link.href || '',
  }));

  return (
    <header
      ref={headerRef}
      className={className}
      style={{
        width: '100%',
        fontFamily: 'system-ui, sans-serif',
        ...style,
      }}
    >
      <style>{`
        :host {
          box-sizing: border-box;
        }
        :host([sticky="true"]) {
          position: sticky !important;
          top: 0 !important;
          z-index: 1000 !important;
          display: block !important;
        }
        ${sticky ? `
          :host {
            position: sticky !important;
            top: 0 !important;
            z-index: 1000 !important;
            display: block !important;
          }
        ` : ''}
        .spm-nav-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Primary Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: isStacked ? 'column' : 'row',
          alignItems: isStacked ? 'flex-start' : 'center',
          gap: isStacked ? '8px' : '4px',
          flexWrap: 'wrap',
          background: 'var(--spm-bg-secondary)',
          border: '1px solid var(--spm-border)',
          borderRadius: 'var(--spm-radius, 8px)',
          padding: isStacked ? '12px 16px' : '0 16px',
          minHeight: isStacked ? 'auto' : '48px',
          boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.3)',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo/Site Name */}
        <a
          href={logoHref}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '15px',
            fontWeight: 800,
            color: 'var(--spm-text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.03em',
            marginRight: isStacked ? '0' : '16px',
            flexShrink: 0,
            height: isStacked ? 'auto' : '48px',
          }}
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt={siteName}
              style={{
                height: '24px',
                borderRadius: '4px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          )}
          <span>{siteName}</span>
        </a>

        {/* Primary nav links */}
        {!isMinimal && (
          <div
            className="spm-nav-container"
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '4px',
              overflowX: 'auto',
              flexGrow: 1,
              minWidth: 0,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {resolvedPrimaryLinks.map((link, i) => {
              const active = isLinkActive(link.url);
              return (
                <a
                  key={i}
                  href={link.url}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: isStacked ? '32px' : '36px',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--spm-accent, #ff6600)' : 'var(--spm-text-muted)',
                    textDecoration: 'none',
                    borderBottom: !isStacked && active ? '2px solid var(--spm-accent, #ff6600)' : '2px solid transparent',
                    borderRadius: '6px',
                    background: active ? 'rgba(255, 102, 0, 0.12)' : 'transparent',
                    boxShadow: active ? '0 0 8px rgba(255, 102, 0, 0.25)' : 'none',
                    transition: 'color 0.15s, border-color 0.15s, background-color 0.15s, box-shadow 0.15s',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    if (!active) {
                      el.style.color = 'var(--spm-text-primary)';
                      el.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    if (!active) {
                      el.style.color = 'var(--spm-text-muted)';
                      el.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Secondary Bar */}
      {!isMinimal && resolvedSecondaryLinks.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            flexWrap: 'wrap',
            background: 'var(--spm-bg-primary)',
            borderBottom: '1px solid var(--spm-border)',
            padding: '0 16px',
            minHeight: '32px',
          }}
        >
          {resolvedSecondaryLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '32px',
                padding: '0 8px',
                fontSize: '11px',
                color: 'var(--spm-text-muted)',
                textDecoration: 'none',
                borderRadius: '4px',
                transition: 'color 0.12s, background 0.12s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--spm-text-primary)';
                (e.currentTarget as HTMLElement).style.background = 'var(--spm-bg-secondary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--spm-text-muted)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
