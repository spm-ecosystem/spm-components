import { useState, useEffect } from 'react';

export interface UiImageCardProps {
  imageUrl: string;
  linkUrl: string;
  title: string;
  id: string;
  width?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  imageFit?: 'cover' | 'contain';
  showTitle?: boolean;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

const RATIO_MAP = {
  square: '1 / 1',
  video: '16 / 9',
  portrait: '3 / 4',
  auto: 'auto',
};

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";

export function UiImageCard({
  imageUrl,
  linkUrl,
  title,
  id,
  width = '160px',
  aspectRatio = 'auto',
  imageFit = 'cover',
  showTitle = true,
  className = '',
  style = {},
  loading = 'lazy',
}: UiImageCardProps) {
  const calculatedRatio = RATIO_MAP[aspectRatio] || 'auto';
  const [imgSrc, setImgSrc] = useState(imageUrl);

  useEffect(() => {
    setImgSrc(imageUrl);
  }, [imageUrl]);

  const handleError = () => {
    if (imgSrc !== FALLBACK_IMAGE) {
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  const isFallback = imgSrc === FALLBACK_IMAGE;

  return (
    <a
      id={id}
      href={linkUrl}
      className={`spm-image-card ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: `var(--spm-image-card-width, ${width})`,
        borderRadius: 'var(--spm-card-radius, var(--spm-radius, 16px))',
        overflow: 'hidden',
        border: '1px solid var(--spm-border)',
        background: 'var(--spm-bg-secondary)',
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        flexShrink: 0,
        ...style,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--spm-accent)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--spm-border)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
    >
      <div
        className="spm-image-card-media"
        style={{
          width: '100%',
          aspectRatio: calculatedRatio !== 'auto' ? calculatedRatio : undefined,
          overflow: 'hidden',
          background: 'var(--spm-bg-tertiary)',
        }}
      >
        <img
          src={imgSrc}
          alt={title}
          style={{
            width: '100%',
            height: calculatedRatio === 'auto' ? 'auto' : '100%',
            objectFit: isFallback ? 'contain' : (calculatedRatio === 'auto' ? 'contain' : imageFit),
            display: 'block',
            padding: isFallback ? '24px' : '0',
            boxSizing: 'border-box',
          }}
          loading={loading}
          onError={handleError}
        />
      </div>
      {showTitle && (
        <div
          className="spm-image-card-caption"
          style={{
            padding: '8px',
            borderTop: '1px solid var(--spm-border)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '11px',
              color: 'var(--spm-text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
            title={title}
          >
            {title}
          </p>
        </div>
      )}
    </a>
  );
}
