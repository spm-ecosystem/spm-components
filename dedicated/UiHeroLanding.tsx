import React from 'react';
import { UiSearchBar } from './UiSearchBar';

export interface NavLink {
  label: string;
  url: string;
}

export interface TagItem {
  label: string;
  url: string;
}

export type HeroAlignVariant = 'centered' | 'split-horizontal' | 'left-aligned' | 'compact-banner';

export interface UiHeroLandingProps {
  siteName?: string;
  logoUrl?: string;
  logoHref?: string;
  tagline?: string;
  subtext?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  searchPlaceholder?: string;
  searchSubmitUrl?: string;
  searchParamName?: string;
  primaryLinks?: NavLink[];
  primaryLinksPosition?: 'top' | 'bottom';
  align?: HeroAlignVariant;

  // Glassmorphic & Sky Theme Enhancements
  variant?: 'standard' | 'glassmorphic' | 'sky-glass';
  popularTags?: TagItem[];
  popularTagsPrefix?: string;
  statsText?: string;
  visitorCount?: string | number;
  visitorCounterHtml?: string;
  showThemeToggle?: boolean;
  userProfileUrl?: string;
  footerAttribution?: string;
  extensionLinks?: { label: string; url: string }[];

  // Slots
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  counterSlot?: React.ReactNode;
  filterButtonSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  mediaSlot?: React.ReactNode;
  brandSlot?: React.ReactNode;
  backgroundSlot?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
}

export function UiHeroLanding({
  siteName,
  logoUrl,
  logoHref = '/',
  tagline,
  subtext,
  ctaLabel,
  ctaUrl,
  searchPlaceholder = 'Search tags, artists, characters…',
  searchSubmitUrl,
  searchParamName = 'tags',
  primaryLinks = [],
  primaryLinksPosition,
  align = 'centered',
  popularTags,
  popularTagsPrefix = 'Popular:',
  statsText,
  visitorCount,
  visitorCounterHtml,
  showThemeToggle,
  userProfileUrl,
  footerAttribution,
  extensionLinks,
  variant = 'standard',
  headerSlot,
  footerSlot,
  counterSlot,
  filterButtonSlot,
  actionsSlot,
  mediaSlot,
  brandSlot,
  backgroundSlot,
  className = '',
  style = {},
}: UiHeroLandingProps) {
  const isSplit = align === 'split-horizontal';
  const isCompact = align === 'compact-banner';
  const isCentered = align === 'centered';
  const isGlassmorphic = variant === 'glassmorphic' || variant === 'sky-glass';

  const navPosition = primaryLinksPosition || (isGlassmorphic ? 'top' : 'bottom');
  const textAlign = isCentered ? 'center' : 'left';
  const alignItems = isCentered ? 'center' : 'flex-start';

  const glassmorphicStyle: React.CSSProperties = isGlassmorphic
    ? {
        background: 'var(--spm-hero-bg, linear-gradient(180deg, #cbe3fc 0%, #e2f0fd 40%, #eff6ff 100%))',
        color: 'var(--spm-text-primary, #1e293b)',
        ['--spm-text-primary' as any]: 'var(--spm-glass-text-primary, #1e293b)',
        ['--spm-text-muted' as any]: 'var(--spm-glass-text-muted, #64748b)',
        ['--spm-bg-secondary' as any]: 'var(--spm-glass-search-bg, #ffffff)',
        ['--spm-bg-surface' as any]: 'var(--spm-glass-surface-bg, #ffffff)',
        ['--spm-bg-element' as any]: 'var(--spm-glass-element-bg, #ffffff)',
        ['--spm-border' as any]: 'var(--spm-glass-border, rgba(0, 0, 0, 0.08))',
        ['--spm-accent' as any]: 'var(--spm-glass-accent, #3b82f6)',
        ['--spm-accent-fg' as any]: '#ffffff',
      }
    : {
        background: 'var(--spm-bg-primary)',
      };

  const glassCardStyle: React.CSSProperties = isGlassmorphic
    ? {
        background: 'var(--spm-glass-card-bg, rgba(255, 255, 255, 0.45))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 12px 40px rgba(59, 130, 246, 0.12)',
        padding: isCompact ? '20px 24px' : '36px 48px',
        boxSizing: 'border-box',
      }
    : {};

  const renderBrand = () => {
    if (brandSlot) {
      return <div className="spm-hero-brand-slot" style={{ marginBottom: isCompact ? '0' : '24px' }}>{brandSlot}</div>;
    }

    if (!logoUrl && !siteName) return null;

    return (
      <a
        href={logoHref}
        style={{
          display: 'inline-block',
          marginBottom: isCompact ? '12px' : '24px',
          textDecoration: 'none',
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={siteName || 'Logo'}
            style={{
              maxWidth: isCompact ? '180px' : '340px',
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: isGlassmorphic ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))' : 'none',
            }}
          />
        ) : (
          <span
            style={{
              fontSize: isCompact ? '28px' : '42px',
              fontWeight: 900,
              color: 'var(--spm-text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            {siteName}
          </span>
        )}
      </a>
    );
  };

  const renderActions = () => {
    if (!ctaUrl && !ctaLabel && !actionsSlot) return null;

    return (
      <div
        className="spm-hero-actions-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCentered ? 'center' : 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: navPosition === 'bottom' && primaryLinks.length > 0 ? '24px' : '0',
        }}
      >
        {ctaUrl && ctaLabel && (
          <a
            href={ctaUrl}
            className="spm-hero-cta-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '9px 22px',
              borderRadius: 'var(--spm-radius, 999px)',
              background: 'var(--spm-accent, #3b82f6)',
              border: '1px solid var(--spm-accent, #3b82f6)',
              color: 'var(--spm-accent-fg, #ffffff)',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'border-color 0.15s, color 0.15s, background 0.15s',
              boxShadow: isGlassmorphic ? '0 4px 14px rgba(59, 130, 246, 0.35)' : 'none',
            }}
          >
            {ctaLabel}
          </a>
        )}

        {actionsSlot && (
          <div className="spm-hero-actions-slot" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {actionsSlot}
          </div>
        )}
      </div>
    );
  };

  const renderVisitorCounter = () => {
    if (counterSlot) {
      return <div className="spm-hero-counter-slot">{counterSlot}</div>;
    }

    if (visitorCounterHtml) {
      return <div className="spm-hero-counter-html" dangerouslySetInnerHTML={{ __html: visitorCounterHtml }} />;
    }

    if (!visitorCount) return null;

    const digits = visitorCount.toString().split('');

    return (
      <div
        className="spm-hero-visitor-counter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCentered ? 'center' : 'flex-start',
          gap: '6px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {digits.map((digit, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '36px',
                background: 'var(--spm-bg-surface, #ffffff)',
                border: '1px solid var(--spm-border, rgba(0, 0, 0, 0.12))',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                fontWeight: 800,
                fontSize: '16px',
                fontFamily: 'monospace, sans-serif',
                color: 'var(--spm-text-primary, #1e293b)',
              }}
            >
              {digit}
            </span>
          ))}
        </div>
        <span style={{ fontSize: '11px', color: 'var(--spm-text-muted, #64748b)', fontWeight: 500 }}>
          Total visitors so far
        </span>
      </div>
    );
  };

  const renderTextAndControls = () => (
    <div
      className="spm-hero-text-controls"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems,
        textAlign,
        zIndex: 1,
        maxWidth: isSplit ? '540px' : isCompact ? '100%' : '680px',
        width: '100%',
        ...glassCardStyle,
      }}
    >
      {renderBrand()}

      {tagline && (
        <h1
          style={{
            margin: '0 0 8px 0',
            fontSize: isCompact ? '18px' : '22px',
            fontWeight: 700,
            color: 'var(--spm-text-primary)',
            letterSpacing: '-0.01em',
            textAlign,
          }}
        >
          {tagline}
        </h1>
      )}

      {subtext && (
        <p
          style={{
            margin: '0 0 24px 0',
            fontSize: isCompact ? '13px' : '14px',
            color: 'var(--spm-text-muted)',
            textAlign,
            maxWidth: '520px',
            lineHeight: 1.6,
          }}
        >
          {subtext}
        </p>
      )}

      {(searchSubmitUrl || filterButtonSlot) && (
        <div
          className="spm-hero-search-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '540px',
            width: '100%',
            marginBottom: (popularTags && popularTags.length > 0) || statsText || visitorCount ? '12px' : '20px',
          }}
        >
          {searchSubmitUrl && (
            <UiSearchBar
              placeholder={searchPlaceholder}
              submitUrl={searchSubmitUrl}
              queryParamName={searchParamName}
              style={{
                flex: 1,
                width: '100%',
                ['--spm-card-radius' as any]: '999px',
                ['--spm-radius' as any]: '999px',
                boxShadow: isGlassmorphic ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none',
              }}
            />
          )}
          {filterButtonSlot ? (
            <div className="spm-hero-filter-slot" style={{ display: 'inline-flex', alignItems: 'center' }}>
              {filterButtonSlot}
            </div>
          ) : isGlassmorphic ? (
            <button
              type="button"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--spm-accent, #3b82f6)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                flexShrink: 0,
              }}
              title="Advanced Filters"
              aria-label="Filter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>
          ) : null}
        </div>
      )}

      {popularTags && popularTags.length > 0 && (
        <div
          className="spm-hero-popular-tags"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: isCentered ? 'center' : 'flex-start',
            marginBottom: statsText || visitorCount ? '12px' : '20px',
            fontSize: '12px',
          }}
        >
          {popularTagsPrefix && (
            <span className="spm-hero-tags-prefix" style={{ fontWeight: 600, color: 'var(--spm-text-muted, #64748b)' }}>
              {popularTagsPrefix}
            </span>
          )}
          {popularTags.map((tag, i) => (
            <a
              key={i}
              href={tag.url}
              className="spm-hero-tag-chip"
              style={{
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'var(--spm-bg-element, rgba(255, 255, 255, 0.8))',
                border: '1px solid var(--spm-border, rgba(0, 0, 0, 0.08))',
                color: 'var(--spm-text-primary, #334155)',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s, transform 0.15s',
                boxShadow: isGlassmorphic ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--spm-accent, #3b82f6)';
                el.style.color = '#ffffff';
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--spm-bg-element, rgba(255, 255, 255, 0.8))';
                el.style.color = 'var(--spm-text-primary, #334155)';
                el.style.transform = 'translateY(0)';
              }}
            >
              {tag.label}
            </a>
          ))}
        </div>
      )}

      {statsText && (
        <div
          className="spm-hero-stats-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'var(--spm-bg-surface, rgba(219, 234, 254, 0.6))',
            border: '1px solid var(--spm-border-contrast, rgba(147, 197, 253, 0.6))',
            color: 'var(--spm-accent, #2563eb)',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: visitorCount || counterSlot ? '16px' : '20px',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.08)',
          }}
        >
          {statsText}
        </div>
      )}

      {renderVisitorCounter()}

      {renderActions()}

      {navPosition === 'bottom' && primaryLinks.length > 0 && (
        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: isCentered ? 'center' : 'flex-start',
            maxWidth: '560px',
            marginTop: '8px',
          }}
        >
          {primaryLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              style={{
                padding: '5px 14px',
                borderRadius: '999px',
                background: 'var(--spm-bg-secondary)',
                border: '1px solid var(--spm-border)',
                color: 'var(--spm-text-muted)',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.12s, border-color 0.12s, background 0.12s',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}

      {footerAttribution && (
        <div
          className="spm-hero-footer-attribution"
          style={{
            fontSize: '11px',
            color: 'var(--spm-text-muted, #64748b)',
            marginTop: '12px',
          }}
        >
          {footerAttribution}
        </div>
      )}

      {extensionLinks && extensionLinks.length > 0 && (
        <div
          className="spm-hero-extension-links"
          style={{
            fontSize: '11px',
            color: 'var(--spm-text-muted, #64748b)',
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>Get the search extension for</span>
          {extensionLinks.map((ext, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              <a
                href={ext.url}
                style={{
                  color: 'var(--spm-accent, #3b82f6)',
                  textDecoration: 'underline',
                  fontWeight: 500,
                }}
              >
                {ext.label}
              </a>
            </React.Fragment>
          ))}
        </div>
      )}

      {footerSlot && (
        <div
          className="spm-hero-footer-slot"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCentered ? 'center' : 'flex-start',
            marginTop: '16px',
            width: '100%',
          }}
        >
          {footerSlot}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`spm-hero-landing spm-hero-${align} ${isGlassmorphic ? 'spm-hero-glassmorphic' : ''} ${className}`.trim()}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: isCompact ? 'auto' : '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isCompact ? '16px 24px' : '24px 24px 40px 24px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        ...glassmorphicStyle,
        ...style,
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .spm-hero-landing {
            padding: 16px 12px !important;
            min-height: auto !important;
          }
          .spm-hero-body {
            flex-direction: column !important;
          }
          .spm-hero-text-controls {
            align-items: center !important;
            text-align: center !important;
            padding: 24px 16px !important;
          }
        }
      `}</style>

      {/* Background Slot */}
      {backgroundSlot && (
        <div
          className="spm-hero-background-slot"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {backgroundSlot}
        </div>
      )}

      {/* Header Slot or Top Navigation Header Bar */}
      {(headerSlot || (navPosition === 'top' && primaryLinks.length > 0)) && (
        <header
          className="spm-hero-header-slot"
          style={{
            width: '100%',
            maxWidth: '1200px',
            zIndex: 2,
            marginBottom: isCompact ? '12px' : '24px',
          }}
        >
          {headerSlot ? (
            headerSlot
          ) : (
            <div
              className="spm-hero-top-nav"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: isGlassmorphic ? 'rgba(255, 255, 255, 0.55)' : 'var(--spm-bg-secondary)',
                backdropFilter: isGlassmorphic ? 'blur(16px)' : 'none',
                WebkitBackdropFilter: isGlassmorphic ? 'blur(16px)' : 'none',
                borderRadius: '999px',
                padding: '8px 20px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                boxSizing: 'border-box',
              }}
            >
              <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {primaryLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      color: 'var(--spm-text-primary, #334155)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {showThemeToggle && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {userProfileUrl && (
                    <a href={userProfileUrl} style={{ display: 'flex', alignItems: 'center', color: '#475569' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </a>
                  )}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Theme</span>
                    <span>🌙</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </header>
      )}

      {/* Main Hero Body */}
      <div
        className="spm-hero-body"
        style={{
          display: 'flex',
          flexDirection: isSplit || isCompact ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: isSplit || isCompact ? 'space-between' : 'center',
          width: '100%',
          flex: 1,
          zIndex: 1,
          gap: isSplit ? '48px' : isCompact ? '24px' : '32px',
        }}
      >
        {/* Text & Primary Controls */}
        {renderTextAndControls()}

        {/* Hero Media Slot */}
        {mediaSlot && (
          <div
            className="spm-hero-media-slot"
            style={{
              zIndex: 1,
              flex: isSplit ? 1 : undefined,
              width: isSplit ? '100%' : 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {mediaSlot}
          </div>
        )}
      </div>
    </div>
  );
}
