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
  minScale?: number;
  maxScale?: number;
  onFitChange?: (fit: 'contain' | 'cover') => void;
  onScaleChange?: (scale: number) => void;
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
  minScale = 1,
  maxScale = 5,
  onFitChange,
  onScaleChange,
}: UiImageViewerProps) {
  const [userOverrideFit, setUserOverrideFit] = useState<'contain' | 'cover' | null>(null);
  const [isExtremeRatio, setIsExtremeRatio] = useState(false);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number }>({
    mouseX: 0,
    mouseY: 0,
    posX: 0,
    posY: 0,
  });
  const hasDraggedRef = useRef<boolean>(false);

  // Support both imageFit and fit prop naming (imageFit takes priority if provided, defaulting to 'contain')
  const baseFit: 'contain' | 'cover' = imageFit ?? fit ?? 'contain';

  // Reset override, ratio, scale and position state when source changes
  useEffect(() => {
    setUserOverrideFit(null);
    setIsExtremeRatio(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
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

  const handleZoomIn = () => {
    if (!enableZoom) return;
    setScale((prevScale) => {
      const nextScale = Math.min(maxScale, Number((prevScale + 0.5).toFixed(2)));
      if (nextScale !== prevScale) {
        onScaleChange?.(nextScale);
      }
      return nextScale;
    });
  };

  const handleZoomOut = () => {
    if (!enableZoom) return;
    setScale((prevScale) => {
      const nextScale = Math.max(minScale, Number((prevScale - 0.5).toFixed(2)));
      if (nextScale !== prevScale) {
        if (nextScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
        onScaleChange?.(nextScale);
      }
      return nextScale;
    });
  };

  const handleReset = () => {
    if (!enableZoom) return;
    setScale(1);
    setPosition({ x: 0, y: 0 });
    if (scale !== 1) {
      onScaleChange?.(1);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!enableZoom) return;
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setScale((prevScale) => {
      const target = Number((prevScale + delta).toFixed(2));
      const nextScale = Math.min(maxScale, Math.max(minScale, target));
      if (nextScale !== prevScale) {
        if (nextScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
        onScaleChange?.(nextScale);
      }
      return nextScale;
    });
    if (scale > 1 || e.deltaY < 0) {
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  };

  const isControlTarget = (target: EventTarget | null) => {
    if (!target) return false;
    const el = target as HTMLElement;
    return Boolean(el.closest && el.closest('.spm-image-viewer-controls'));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom || scale <= 1 || isControlTarget(e.target)) return;
    e.preventDefault();
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      hasDraggedRef.current = true;
    }
    setPosition({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy,
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!enableZoom || scale <= 1 || e.touches.length !== 1 || isControlTarget(e.target)) return;
    setIsDragging(true);
    hasDraggedRef.current = false;
    const touch = e.touches[0];
    dragStartRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.mouseX;
    const dy = touch.clientY - dragStartRef.current.mouseY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      hasDraggedRef.current = true;
    }
    setPosition({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy,
    });
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleImageClick = () => {
    if (!enableZoom) return;
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    handleToggleFit();
  };

  const controlBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'inherit',
    color: 'var(--spm-text-primary, #ffffff)',
    background: 'transparent',
    border: 'none',
    borderRadius: 'calc(var(--spm-radius, 6px) - 2px)',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  };

  return (
    <div
      className={`spm-image-viewer ${className}`.trim()}
      data-fit={effectiveFit}
      data-extreme-ratio={isExtremeRatio ? 'true' : 'false'}
      data-scale={scale}
      data-dragging={isDragging ? 'true' : 'false'}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: background ?? 'var(--spm-bg-primary)',
        overflow: 'hidden',
        position: 'relative',
        cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
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
            onClick={handleImageClick}
            className="spm-image-viewer-img"
            data-testid="image-viewer-img"
            data-fit={effectiveFit}
            data-scale={scale}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: effectiveFit === 'cover' ? '100%' : 'auto',
              height: effectiveFit === 'cover' ? '100%' : 'auto',
              objectFit: effectiveFit,
              display: 'block',
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : (enableZoom ? (effectiveFit === 'cover' ? 'zoom-out' : 'zoom-in') : 'default'),
              userSelect: 'none',
              transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out, object-fit 0.2s ease',
            }}
          />

          {enableZoom && (
            <div
              className="spm-image-viewer-controls"
              data-testid="zoom-controls"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 6px',
                background: 'var(--spm-bg-secondary, rgba(30, 30, 30, 0.75))',
                border: '1px solid var(--spm-border, rgba(255, 255, 255, 0.15))',
                borderRadius: 'var(--spm-radius, 6px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                zIndex: 10,
              }}
            >
              <button
                type="button"
                className="spm-image-viewer-control-btn"
                data-testid="zoom-in-btn"
                aria-label="Zoom in"
                title="Zoom in"
                onClick={handleZoomIn}
                disabled={scale >= maxScale}
                style={{
                  ...controlBtnStyle,
                  cursor: scale >= maxScale ? 'not-allowed' : 'pointer',
                  opacity: scale >= maxScale ? 0.5 : 1,
                }}
              >
                +
              </button>

              <button
                type="button"
                className="spm-image-viewer-control-btn"
                data-testid="zoom-out-btn"
                aria-label="Zoom out"
                title="Zoom out"
                onClick={handleZoomOut}
                disabled={scale <= minScale}
                style={{
                  ...controlBtnStyle,
                  cursor: scale <= minScale ? 'not-allowed' : 'pointer',
                  opacity: scale <= minScale ? 0.5 : 1,
                }}
              >
                -
              </button>

              <button
                type="button"
                className="spm-image-viewer-control-btn"
                data-testid="zoom-reset-btn"
                aria-label="Reset zoom"
                title="Reset zoom"
                onClick={handleReset}
                style={controlBtnStyle}
              >
                Reset
              </button>

              <button
                type="button"
                className="spm-image-viewer-zoom-btn"
                data-testid="zoom-toggle-btn"
                aria-label={effectiveFit === 'cover' ? 'Fit to container' : 'Zoom to fill'}
                title={effectiveFit === 'cover' ? 'Fit to container' : 'Zoom to fill'}
                onClick={handleToggleFit}
                style={controlBtnStyle}
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
            </div>
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
