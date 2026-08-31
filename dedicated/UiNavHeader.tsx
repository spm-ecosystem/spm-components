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

      {/* Unified Single Primary Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          background: 'var(--spm-bg-secondary)',
          border: '1px solid var(--spm-border)',
          borderRadius: 'var(--spm-radius, 8px)',
          padding: '0 16px',
          minHeight: '48px',
          boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.4)',
          boxSizing: 'border-box',
        }}
      >
        {/* LEFT: Logo & Site Name */}
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
            flexShrink: 0,
            height: '48px',
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

        {/* CENTER: Primary Navigation Links */}
        {!isMinimal && (
          <div
            className="spm-nav-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              flexGrow: 1,
              minWidth: 0,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
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
                    height: '36px',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--spm-accent)' : 'var(--spm-text-muted)',
                    textDecoration: 'none',
                    borderBottom: active ? '2px solid var(--spm-accent)' : '2px solid transparent',
                    borderRadius: '6px',
                    background: active ? 'color-mix(in srgb, var(--spm-accent) 15%, transparent)' : 'transparent',
                    boxShadow: active ? '0 0 10px color-mix(in srgb, var(--spm-accent) 30%, transparent)' : 'none',
                    transition: 'color 0.15s, border-color 0.15s, background-color 0.15s, box-shadow 0.15s',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    if (!active) {
                      el.style.color = 'var(--spm-accent)';
                      el.style.backgroundColor = 'color-mix(in srgb, var(--spm-accent) 8%, transparent)';
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

        {/* RIGHT: Secondary Action Links (e.g. Login) */}
        {!isMinimal && resolvedSecondaryLinks.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
            }}
          >
            {resolvedSecondaryLinks.map((link, i) => {
              const active = isLinkActive(link.url);
              return (
                <a
                  key={i}
                  href={link.url}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '32px',
                    padding: '0 10px',
                    fontSize: '12px',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--spm-accent)' : 'var(--spm-text-muted)',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    background: active ? 'color-mix(in srgb, var(--spm-accent) 15%, transparent)' : 'transparent',
                    transition: 'color 0.15s, background-color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    if (!active) {
                      el.style.color = 'var(--spm-accent)';
                      el.style.backgroundColor = 'color-mix(in srgb, var(--spm-accent) 8%, transparent)';
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
    </header>
  );
}
