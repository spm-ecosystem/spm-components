import { useMemo } from 'react';
import { UiTagBadge } from './UiTagBadge';
import { UiSearchBar } from './UiSearchBar';

function triggerProxyClick(selector: string) {
  if (typeof window !== 'undefined' && (window as any).spmTriggerProxyClick) {
    (window as any).spmTriggerProxyClick(selector);
    return;
  }
  const el = document.querySelector(selector) as HTMLElement;
  if (el) el.click();
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

export interface UiScrollPanelProps {
  // Content slots - all optional, all JSON-driven
  tags?: TagItem[];
  buttons?: ButtonItem[];
  statisticsHtml?: string;
  // Search config
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchSubmitUrl?: string;
  searchParamName?: string;
  // Layout
  width?: string;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
}

// Classify buttons by label so primary actions stand out
const NAV_LABELS = ['previous', 'next'];
const PRIMARY_LABELS = ['original image', 'add to favorites', 'download', 'submit', 'export'];

function getButtonVariant(label: string): 'nav' | 'primary' | 'ghost' {
  const l = label.toLowerCase();
  if (NAV_LABELS.some(k => l.includes(k))) return 'nav';
  if (PRIMARY_LABELS.some(k => l.includes(k))) return 'primary';
  return 'ghost';
}

export function UiScrollPanel({
  tags = [],
  buttons = [],
  statisticsHtml,
  showSearch = false,
  searchPlaceholder = 'Search…',
  searchSubmitUrl,
  searchParamName = 'q',
  width = '280px',
  className = '',
  style = {},
  onClose,
}: UiScrollPanelProps) {
  const hasSearch = Boolean(showSearch && searchSubmitUrl);
  const hasButtons = Boolean(buttons && buttons.length > 0);
  const hasTags = Boolean(tags && tags.length > 0);
  const hasStats = Boolean(statisticsHtml && statisticsHtml.trim().length > 0);

  if (!hasSearch && !hasButtons && !hasTags && !hasStats) {
    return null;
  }

  // Dynamic tag grouping by enterprise category
  const groupedTags = useMemo(() => {
    const groups: Record<string, TagItem[]> = {};
    tags.forEach(t => {
      let rawType = t.type ? t.type.trim().toLowerCase() : '';
      let categoryName = 'TAGS';
      if (rawType.includes('module')) {
        categoryName = 'MODULES';
      } else if (rawType.includes('tech')) {
        categoryName = 'TECHNOLOGY';
      } else if (rawType.includes('category')) {
        categoryName = 'CATEGORIES';
      } else if (rawType.includes('status')) {
        categoryName = 'SYSTEM STATUS';
      } else if (rawType.includes('meta')) {
        categoryName = 'METADATA';
      } else if (t.type) {
        categoryName = t.type.toUpperCase();
      }

      if (!groups[categoryName]) groups[categoryName] = [];
      groups[categoryName].push(t);
    });
    return groups;
  }, [tags]);

  const navButtons     = buttons.filter(b => getButtonVariant(b.label) === 'nav');
  const primaryButtons = buttons.filter(b => getButtonVariant(b.label) === 'primary');
  const ghostButtons   = buttons.filter(b => getButtonVariant(b.label) === 'ghost');

  const renderSection = (title: string, groupTags: TagItem[]) => {
    if (!groupTags || !groupTags.length) return null;
    return (
      <div key={title} style={{ marginBottom: '20px' }}>
        <p style={{
          margin: '0 0 8px 0',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--spm-text-muted, #94a3b8)',
          fontWeight: 600,
        }}>
          {title}
        </p>
        <div
          className="spm-tag-group-container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
        >
          {groupTags.map((t, idx) => (
            <UiTagBadge
              key={idx}
              label={t.name}
              count={t.count}
              href={t.url}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                maxWidth: '100%',
                whiteSpace: 'normal',
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderButtonGroup = (btns: ButtonItem[], variant: 'nav' | 'primary' | 'ghost') => {
    if (!btns.length) return null;
    const isNav = variant === 'nav';
    const isPrimary = variant === 'primary';
    return (
      <div style={{
        display: isNav ? 'grid' : 'flex',
        gridTemplateColumns: isNav ? `repeat(${Math.min(btns.length, 2)}, 1fr)` : undefined,
        flexDirection: isNav ? undefined : 'column',
        gap: '6px',
        marginBottom: '10px',
      }}>
        {btns.map((btn, i) => (
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
              justifyContent: 'center',
              padding: isNav ? '6px 12px' : '7px 12px',
              borderRadius: isNav ? '999px' : 'var(--spm-radius, 6px)',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
              background: isPrimary || isNav ? 'var(--spm-accent, #ffffff)' : 'var(--spm-bg-element, #1e1e24)',
              color: isPrimary || isNav ? 'var(--spm-accent-fg, #000000)' : 'var(--spm-text-primary, #ffffff)',
              border: isPrimary || isNav ? 'none' : '1px solid var(--spm-border, #27272a)',
            }}
          >
            {btn.label}
          </a>
        ))}
      </div>
    );
  };

  return (
    <aside
      className={`spm-scroll-panel ${className}`.trim()}
      style={{
        width,
        minWidth: width,
        boxSizing: 'border-box',
        backgroundColor: 'var(--spm-bg-surface, #121215)',
        borderRight: '1px solid var(--spm-border, #27272a)',
        padding: '20px 16px',
        overflowY: 'auto',
        overflowX: 'hidden',
        fontSize: '13px',
        color: 'var(--spm-text-primary, #ffffff)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        ...style,
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
      }}
    >
      {onClose && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--spm-text-muted, #a1a1aa)',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {hasSearch && (
        <div style={{ marginBottom: '16px' }}>
          <UiSearchBar
            placeholder={searchPlaceholder}
            submitUrl={searchSubmitUrl}
            queryParamName={searchParamName}
          />
        </div>
      )}

      {renderButtonGroup(navButtons, 'nav')}
      {renderButtonGroup(primaryButtons, 'primary')}
      {ghostButtons.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {renderButtonGroup(ghostButtons, 'ghost')}
        </div>
      )}

      {hasButtons && (hasTags || hasStats) && (
        <hr style={{ border: 'none', borderTop: '1px solid var(--spm-border, #27272a)', margin: '8px 0 16px 0' }} />
      )}

      {hasTags && (
        <div>
          {Object.entries(groupedTags).map(([catTitle, groupTags]) =>
            renderSection(catTitle, groupTags as TagItem[])
          )}
        </div>
      )}

      {hasStats && (
        <div>
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--spm-text-muted, #94a3b8)',
            fontWeight: 600,
          }}>
            Statistics
          </p>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--spm-text-muted, #94a3b8)',
              lineHeight: 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: statisticsHtml || '' }}
          />
        </div>
      )}
    </aside>
  );
}
