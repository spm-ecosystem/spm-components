import React from 'react';
import { UiSearchBar } from './UiSearchBar';

export interface NavLink {
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

  // Slots
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

  const textAlign = isCentered ? 'center' : 'left';
  const alignItems = isCentered ? 'center' : 'flex-start';

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

      {searchSubmitUrl && (
        <UiSearchBar
          placeholder={searchPlaceholder}
          submitUrl={searchSubmitUrl}
          queryParamName={searchParamName}
          style={{ maxWidth: '520px', marginBottom: '20px', width: '100%' }}
        />
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
    </div>
  );

  return (
    <div
      className={`spm-hero-landing spm-hero-${align} ${className}`.trim()}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: isCompact ? 'auto' : '100vh',
        background: 'var(--spm-bg-primary)',
        display: 'flex',
        flexDirection: isSplit || isCompact ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: isSplit || isCompact ? 'space-between' : 'center',
        padding: isCompact ? '24px 32px' : '48px 24px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        gap: isSplit ? '48px' : isCompact ? '24px' : '32px',
        ...style,
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .spm-hero-landing {
            flex-direction: column !important;
            padding: 32px 16px !important;
            min-height: auto !important;
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
  );
}
