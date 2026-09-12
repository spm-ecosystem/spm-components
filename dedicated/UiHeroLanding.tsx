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
  align?: HeroAlignVariant;

  // Enhancements
  popularTags?: TagItem[];
  popularTagsPrefix?: string;
  statsText?: string;
  variant?: 'standard' | 'glassmorphic';

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
  searchPlaceholder,
  searchSubmitUrl,
  searchParamName,
  primaryLinks = [],
  align = 'centered',
  popularTags,
  popularTagsPrefix = 'Popular:',
  statsText,
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
  const isGlassmorphic = variant === 'glassmorphic';

  const textAlign = isCentered ? 'center' : 'left';
  const alignItems = isCentered ? 'center' : 'flex-start';

  const glassmorphicStyle: React.CSSProperties = isGlassmorphic
    ? {
        background: 'var(--spm-glass-bg, rgba(255, 255, 255, 0.65))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
      }
    : {
        background: 'var(--spm-bg-primary)',
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
              maxWidth: isCompact ? '180px' : '320px',
              width: '100%',
              height: 'auto',
              display: 'block',
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
          marginBottom: primaryLinks.length > 0 ? '24px' : '0',
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
              borderRadius: 'var(--spm-radius)',
              background: 'var(--spm-accent)',
              border: '1px solid var(--spm-accent)',
              color: 'var(--spm-accent-fg, #ffffff)',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'border-color 0.15s, color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'var(--spm-accent-hover)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'var(--spm-accent)';
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
            maxWidth: '520px',
            width: '100%',
            marginBottom: (popularTags && popularTags.length > 0) || statsText || counterSlot ? '12px' : '20px',
          }}
        >
          {searchSubmitUrl && (
            <UiSearchBar
              placeholder={searchPlaceholder}
              submitUrl={searchSubmitUrl}
              queryParamName={searchParamName}
              style={{ flex: 1, width: '100%' }}
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
            marginBottom: statsText || counterSlot ? '12px' : '20px',
            fontSize: '12px',
          }}
        >
          {popularTagsPrefix && (
            <span className="spm-hero-tags-prefix" style={{ fontWeight: 600, color: 'var(--spm-text-muted)' }}>
              {popularTagsPrefix}
            </span>
          )}
          {popularTags.map((tag, i) => (
            <a
              key={i}
              href={tag.url}
              className="spm-hero-tag-chip"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--spm-radius)',
                background: 'var(--spm-bg-element)',
                color: 'var(--spm-text-primary)',
                fontSize: '12px',
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--spm-accent)';
                el.style.color = 'var(--spm-accent-fg, #ffffff)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--spm-bg-element)';
                el.style.color = 'var(--spm-text-primary)';
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
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'var(--spm-bg-surface)',
            border: '1px solid var(--spm-border-contrast)',
            color: 'var(--spm-text-muted)',
            fontSize: '12px',
            fontWeight: 500,
            marginBottom: counterSlot ? '12px' : '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          {statsText}
        </div>
      )}

      {counterSlot && (
        <div
          className="spm-hero-counter-slot"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCentered ? 'center' : 'flex-start',
            marginBottom: '20px',
            width: '100%',
          }}
        >
          {counterSlot}
        </div>
      )}

      {renderActions()}

      {primaryLinks.length > 0 && (
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
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = 'var(--spm-text-primary)';
                el.style.borderColor = 'var(--spm-accent)';
                el.style.background = 'var(--spm-bg-tertiary)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = 'var(--spm-text-muted)';
                el.style.borderColor = 'var(--spm-border)';
                el.style.background = 'var(--spm-bg-secondary)';
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}

      {footerSlot && (
        <div
          className="spm-hero-footer-slot"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCentered ? 'center' : 'flex-start',
            marginTop: '20px',
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
        justifyContent: 'center',
        padding: isCompact ? '24px 32px' : '48px 24px',
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
            padding: 32px 16px !important;
            min-height: auto !important;
          }
          .spm-hero-body {
            flex-direction: column !important;
          }
          .spm-hero-text-controls {
            align-items: center !important;
            text-align: center !important;
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

      {/* Header Slot */}
      {headerSlot && (
        <header
          className="spm-hero-header-slot"
          style={{
            width: '100%',
            zIndex: 2,
            marginBottom: isCompact ? '12px' : '24px',
          }}
        >
          {headerSlot}
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
