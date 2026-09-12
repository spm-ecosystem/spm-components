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
  showCard?: boolean;
  counterImageUrlPrefix?: string;
  counterImageHeight?: string | number;
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
  showCard = false,
  counterImageUrlPrefix,
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
  const [isDark, setIsDark] = React.useState(false);

  const isSplit = align === 'split-horizontal';
  const isCompact = align === 'compact-banner';
  const isCentered = align === 'centered';
  const isGlassmorphic = variant === 'glassmorphic' || variant === 'sky-glass';

  const navPosition = primaryLinksPosition || (isGlassmorphic ? 'top' : 'bottom');
  const textAlign = isCentered ? 'center' : 'left';
  const alignItems = isCentered ? 'center' : 'flex-start';

  const heroBg = isGlassmorphic
    ? isDark
      ? 'var(--spm-hero-bg-dark, linear-gradient(180deg, #09090b 0%, #121216 50%, #18181c 100%))'
      : 'var(--spm-hero-bg, linear-gradient(180deg, #cbe3fc 0%, #e2f0fd 40%, #eff6ff 100%))'
    : 'var(--spm-bg-primary)';

  const textColor = isGlassmorphic
    ? isDark
      ? 'var(--spm-glass-text-primary-dark, #f4f4f5)'
      : 'var(--spm-glass-text-primary, #2b3d52)'
    : 'var(--spm-text-primary)';

  const textMuted = isGlassmorphic
    ? isDark
      ? 'var(--spm-glass-text-muted-dark, #a1a1aa)'
      : 'var(--spm-glass-text-muted, #64748b)'
    : 'var(--spm-text-muted)';

  const navBg = isGlassmorphic
    ? isDark
      ? 'var(--spm-glass-nav-bg-dark, rgba(18, 18, 22, 0.85))'
      : 'var(--spm-glass-nav-bg, rgba(255, 255, 255, 0.85))'
    : 'var(--spm-bg-secondary)';

  const cardBg = isGlassmorphic
    ? isDark
      ? 'var(--spm-glass-card-bg-dark, rgba(18, 18, 22, 0.65))'
      : 'var(--spm-glass-card-bg, rgba(255, 255, 255, 0.55))'
    : 'transparent';

  const cardBorder = isGlassmorphic
    ? isDark
      ? '1px solid var(--spm-glass-border-dark, rgba(255, 255, 255, 0.12))'
      : '1px solid var(--spm-glass-border, rgba(255, 255, 255, 0.7))'
    : 'none';

  const searchBg = isGlassmorphic
    ? isDark
      ? 'var(--spm-glass-search-bg-dark, rgba(24, 24, 27, 0.9))'
      : 'var(--spm-glass-search-bg, #ffffff)'
    : 'var(--spm-bg-secondary)';

  const chipBg = isGlassmorphic
    ? isDark
      ? 'var(--spm-glass-chip-bg-dark, rgba(27, 27, 31, 0.8))'
      : 'var(--spm-glass-chip-bg, #ffffff)'
    : 'var(--spm-bg-element)';

  const digitBg = isGlassmorphic
    ? isDark
      ? 'var(--spm-glass-digit-bg-dark, #121216)'
      : 'var(--spm-glass-digit-bg, #ffffff)'
    : 'var(--spm-bg-surface)';

  const glassmorphicStyle: React.CSSProperties = isGlassmorphic
    ? {
        background: heroBg,
        color: textColor,
        ['--spm-text-primary' as any]: textColor,
        ['--spm-text-muted' as any]: textMuted,
        ['--spm-bg-secondary' as any]: searchBg,
        ['--spm-bg-surface' as any]: cardBg,
        ['--spm-bg-element' as any]: chipBg,
        ['--spm-border' as any]: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
        ['--spm-accent' as any]: isDark ? 'var(--spm-glass-accent-dark, #7c6af5)' : 'var(--spm-glass-accent, #3b82f6)',
        ['--spm-accent-fg' as any]: '#ffffff',
      }
    : {
        background: 'var(--spm-bg-primary)',
      };

  const glassCardStyle: React.CSSProperties = isGlassmorphic && showCard
    ? {
        background: cardBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: cardBorder,
        boxShadow: isDark ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(59, 130, 246, 0.12)',
        padding: isCompact ? '20px 24px' : '36px 48px',
        boxSizing: 'border-box',
      }
    : {
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: '0',
      };

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
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {counterImageUrlPrefix ? (
            digits.map((digit, idx) => (
              <img
                key={idx}
                src={`${counterImageUrlPrefix}${digit}.gif`}
                alt={digit}
                style={{
                  height: 'var(--spm-counter-image-height, 68px)',
                  width: 'auto',
                  display: 'inline-block',
                  imageRendering: 'pixelated',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12))',
                }}
              />
            ))
          ) : (
            digits.map((digit, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '36px',
                  background: digitBg,
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'}`,
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  fontWeight: 800,
                  fontSize: '16px',
                  fontFamily: 'monospace, sans-serif',
                  color: textColor,
                }}
              >
                {digit}
              </span>
            ))
          )}
        </div>
        <span style={{ fontSize: '11px', color: textMuted, fontWeight: 500 }}>
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
          {filterButtonSlot && (
            <div className="spm-hero-filter-slot" style={{ display: 'inline-flex', alignItems: 'center' }}>
              {filterButtonSlot}
            </div>
          )}
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
            <span className="spm-hero-tags-prefix" style={{ fontWeight: 600, color: textMuted }}>
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
                background: chipBg,
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
                color: textColor,
                fontSize: '12px',
                fontWeight: 600,
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
                el.style.background = chipBg;
                el.style.color = textColor;
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
          .spm-hero-top-nav {
            overflow-x: auto !important;
            justify-content: flex-start !important;
            padding: 8px 12px !important;
            border-radius: 16px !important;
          }
          .spm-hero-top-nav nav {
            flex-wrap: nowrap !important;
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
                background: navBg,
                backdropFilter: isGlassmorphic ? 'blur(16px)' : 'none',
                WebkitBackdropFilter: isGlassmorphic ? 'blur(16px)' : 'none',
                borderRadius: '999px',
                padding: '8px 20px',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
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
                      color: textColor,
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)';
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
                    <a href={userProfileUrl} style={{ display: 'flex', alignItems: 'center', color: textColor }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsDark(!isDark)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: isDark ? 'rgba(30, 41, 59, 0.9)' : '#ffffff',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'}`,
                      fontSize: '12px',
                      fontWeight: 700,
                      color: textColor,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>Theme</span>
                    <span>{isDark ? '☀️' : '🌙'}</span>
                  </button>
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
