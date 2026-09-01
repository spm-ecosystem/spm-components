import React from 'react';
import { UiImageViewer } from './UiImageViewer';
import { UiScrollPanel } from './UiScrollPanel';

function triggerProxyClick(selector: string) {
  if (typeof window !== 'undefined' && (window as any).spmTriggerProxyClick) {
    (window as any).spmTriggerProxyClick(selector);
    return;
  }
  const el = document.querySelector(selector) as HTMLElement;
  if (el) el.click();
}

export interface ImageSlotItem {
  src?: string;
  alt?: string;
}

export interface TagItem {
  name: string;
  count?: string;
  type?: string;
  url?: string;
}

export interface ButtonItem {
  label: string;
  url?: string;
  targetSelector?: string;
}

export interface UiSplitLayoutProps {
  // Generic Content Slots
  mainContent?: React.ReactNode;
  mainHtml?: string;
  sidebarContent?: React.ReactNode;
  sidebarHtml?: string;

  // Media Explorer & Legacy Image Slots (Backward Compatible)
  imageSlot?: ImageSlotItem[];
  tags?: TagItem[];
  buttons?: ButtonItem[];
  statisticsHtml?: string;

  // Layout Configuration
  sidebarWidth?: string;
  sidebarSide?: 'left' | 'right';
  collapsible?: boolean;
  imageFit?: 'contain' | 'cover';
  height?: string;
  splitButtons?: boolean;

  // Search & Navigation Options
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchSubmitUrl?: string;
  searchParamName?: string;

  // Overrides
  className?: string;
  style?: React.CSSProperties;
}

export function UiSplitLayout({
  mainContent,
  mainHtml,
  sidebarContent,
  sidebarHtml,
  imageSlot = [],
  tags = [],
  buttons = [],
  statisticsHtml,
  sidebarWidth = '300px',
  sidebarSide = 'left',
  collapsible = true,
  imageFit = 'contain',
  height = '100%',
  splitButtons = true,
  showSearch = false,
  searchPlaceholder = 'Search documentation…',
  searchSubmitUrl,
  searchParamName = 'q',
  className = '',
  style = {},
}: UiSplitLayoutProps) {
  const image = imageSlot[0];
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [_drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const imgLabels = ['previous', 'next', 'original image'];
  const imageButtons = splitButtons
    ? buttons.filter(b => imgLabels.some(lbl => b.label.toLowerCase().includes(lbl)))
    : [];
  const sidebarButtons = splitButtons
    ? buttons.filter(b => !imgLabels.some(lbl => b.label.toLowerCase().includes(lbl)))
    : buttons;

  // Render Sidebar Content Pane
  const renderSidebar = () => {
    if (isCollapsed && !isMobile) return null;

    if (sidebarContent) {
      return (
        <div
          className="spm-split-sidebar-custom"
          style={{
            width: isMobile ? '100%' : sidebarWidth,
            flexShrink: 0,
            background: 'var(--spm-bg-surface, #121215)',
            borderRight: sidebarSide === 'left' ? '1px solid var(--spm-border, #27272a)' : 'none',
            borderLeft: sidebarSide === 'right' ? '1px solid var(--spm-border, #27272a)' : 'none',
            padding: '1.25rem',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {sidebarContent}
        </div>
      );
    }

    if (sidebarHtml) {
      return (
        <div
          className="spm-split-sidebar-html"
          dangerouslySetInnerHTML={{ __html: sidebarHtml }}
          style={{
            width: isMobile ? '100%' : sidebarWidth,
            flexShrink: 0,
            background: 'var(--spm-bg-surface, #121215)',
            borderRight: sidebarSide === 'left' ? '1px solid var(--spm-border, #27272a)' : 'none',
            borderLeft: sidebarSide === 'right' ? '1px solid var(--spm-border, #27272a)' : 'none',
            padding: '1.25rem',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        />
      );
    }

    // Default Scroll Panel Sidebar
    return (
      <UiScrollPanel
        className="spm-scroll-panel"
        tags={tags}
        buttons={sidebarButtons}
        statisticsHtml={statisticsHtml}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        searchSubmitUrl={searchSubmitUrl}
        searchParamName={searchParamName}
        width={sidebarWidth}
        onClose={() => setDrawerOpen(false)}
      />
    );
  };

  // Render Main Content Pane
  const renderMain = () => {
    if (mainContent) {
      return (
        <div style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '1.5rem', boxSizing: 'border-box' }}>
          {mainContent}
        </div>
      );
    }

    if (mainHtml) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: mainHtml }}
          style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '1.5rem', boxSizing: 'border-box' }}
        />
      );
    }

    return (
      <div
        className="spm-image-viewer-container"
        style={{ flex: 1, height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <UiImageViewer
            src={image?.src}
            alt={image?.alt}
            fit={imageFit}
            style={{ height: '100%' }}
          />
        </div>

        {imageButtons.length > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(18, 18, 21, 0.95)',
              border: '1px solid var(--spm-border, #27272a)',
              borderRadius: '999px',
              padding: '6px 12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              zIndex: 10,
            }}
          >
            {imageButtons.map((btn, i) => {
              const isNav = btn.label.toLowerCase().includes('previous') || btn.label.toLowerCase().includes('next');
              return (
                <a
                  key={i}
                  href={btn.url ?? '#'}
                  onClick={e => {
                    if (btn.targetSelector) {
                      e.preventDefault();
                      triggerProxyClick(btn.targetSelector);
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 16px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    background: isNav ? '#ffffff' : 'transparent',
                    color: isNav ? '#000000' : '#ffffff',
                  }}
                >
                  {btn.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`spm-split-layout ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: sidebarSide === 'left' ? 'row' : 'row-reverse',
        width: '100%',
        height,
        minHeight: 400,
        background: 'var(--spm-bg-primary, #09090b)',
        border: '1px solid var(--spm-border, #27272a)',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: 'var(--spm-text-primary, #ffffff)',
        ...style,
      }}
    >
      {/* Sidebar Toggle Handle for Desktop */}
      {collapsible && !isMobile && (
        <button
          type="button"
          onClick={() => setIsCollapsed(prev => !prev)}
          style={{
            position: 'absolute',
            top: '12px',
            left: sidebarSide === 'left' ? (isCollapsed ? '12px' : `calc(${sidebarWidth} - 16px)`) : 'auto',
            right: sidebarSide === 'right' ? (isCollapsed ? '12px' : `calc(${sidebarWidth} - 16px)`) : 'auto',
            zIndex: 20,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#ffffff',
            color: '#000000',
            border: '1px solid var(--spm-border, #27272a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
          }}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (sidebarSide === 'left' ? '→' : '←') : (sidebarSide === 'left' ? '←' : '→')}
        </button>
      )}

      {renderSidebar()}
      {renderMain()}
    </div>
  );
}
