import React, { useState, useEffect, useRef } from 'react';

export interface UiImageViewerProps {
  src?: string;
  alt?: string;
  fit?: 'contain' | 'cover';
  imageFit?: 'contain' | 'cover';
  background?: string;
  className?: string;
  style?: React.CSSProperties;
  enableZoom?: boolean;
  onFitChange?: (fit: 'contain' | 'cover') => void;
}

export function UiImageViewer({
  src,
  alt = '',
  fit,
  imageFit,
  background,
  className = '',
  style = {},
  enableZoom = true,
  onFitChange,
}: UiImageViewerProps) {
  const [userOverrideFit, setUserOverrideFit] = useState<'contain' | 'cover' | null>(null);
  const [isExtremeRatio, setIsExtremeRatio] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Support both imageFit and fit prop naming (imageFit takes priority if provided, defaulting to 'contain')
  const baseFit: 'contain' | 'cover' = imageFit ?? fit ?? 'contain';

  // Reset override and ratio state when source changes
  useEffect(() => {
    setUserOverrideFit(null);
    setIsExtremeRatio(false);
  }, [src]);

  // Check if image is already loaded (e.g. from cache or pre-rendered)
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth && imgRef.current.naturalHeight) {
      const ratio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      setIsExtremeRatio(ratio > 2.2 || ratio < 0.5);
    }
  }, [src]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight && img.naturalHeight > 0) {
      const ratio = img.naturalWidth / img.naturalHeight;
      const extreme = ratio > 2.2 || ratio < 0.5;
      setIsExtremeRatio(extreme);
    }
  };

  // Determine effective fit mode:
  // If user has explicitly toggled zoom, use their preference.
  // Otherwise, if base fit is 'cover' and aspect ratio is extreme (> 2.2 or < 0.5), fallback to 'contain'.
  const effectiveFit: 'contain' | 'cover' =
    userOverrideFit ?? (isExtremeRatio && baseFit === 'cover' ? 'contain' : baseFit);

  const handleToggleFit = () => {
    if (!enableZoom) return;
    const nextFit: 'contain' | 'cover' = effectiveFit === 'cover' ? 'contain' : 'cover';
    setUserOverrideFit(nextFit);
    onFitChange?.(nextFit);
  };

  return (
    <div
      className={`spm-image-viewer ${className}`.trim()}
      data-fit={effectiveFit}
      data-extreme-ratio={isExtremeRatio ? 'true' : 'false'}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: background ?? 'var(--spm-bg-primary)',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {src ? (
        <>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            onClick={enableZoom ? handleToggleFit : undefined}
            className="spm-image-viewer-img"
            data-testid="image-viewer-img"
            data-fit={effectiveFit}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: effectiveFit === 'cover' ? '100%' : 'auto',
              height: effectiveFit === 'cover' ? '100%' : 'auto',
              objectFit: effectiveFit,
              display: 'block',
              cursor: enableZoom ? (effectiveFit === 'cover' ? 'zoom-out' : 'zoom-in') : 'default',
              userSelect: 'none',
              transition: 'object-fit 0.2s ease',
            }}
          />

          {enableZoom && (
            <button
              type="button"
              className="spm-image-viewer-zoom-btn"
              data-testid="zoom-toggle-btn"
              aria-label={effectiveFit === 'cover' ? 'Fit to container' : 'Zoom to fill'}
              title={effectiveFit === 'cover' ? 'Fit to container' : 'Zoom to fill'}
              onClick={handleToggleFit}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: 'inherit',
                color: 'var(--spm-text-primary, #ffffff)',
                background: 'var(--spm-bg-secondary, rgba(30, 30, 30, 0.75))',
                border: '1px solid var(--spm-border, rgba(255, 255, 255, 0.15))',
                borderRadius: 'var(--spm-radius, 6px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'background 0.15s ease, border-color 0.15s ease',
              }}
            >
              {effectiveFit === 'cover' ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-testid="zoom-out-icon"
                  >
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                  <span>Fit</span>
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-testid="zoom-in-icon"
                  >
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                  <span>Fill</span>
                </>
              )}
            </button>
          )}
        </>
      ) : (
        <span className="spm-image-viewer-empty" style={{ color: 'var(--spm-text-muted)', fontSize: '13px' }}>
          No image
        </span>
      )}
    </div>
  );
}

