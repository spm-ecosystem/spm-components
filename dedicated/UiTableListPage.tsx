import React from 'react';
import { UiTable, ColumnConfig } from './UiTable';
import { UiPaginationBar } from './UiPaginationBar';
import { UiTagBadge } from './UiTagBadge';

export interface TableColumnConfig {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'link' | 'html' | 'badge' | 'checkbox' | 'date' | 'currency';
  urlKey?: string;
  badgeStyleKey?: string;
}

export interface PageLink {
  label: string;
  url: string;
}

export interface UiTableListPageProps {
  pageTitle?: string;
  tableRows?: any[];
  columns?: TableColumnConfig[];
  pageLinks?: PageLink[];
  height?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoadMore?: () => Promise<{ tableRows: any[]; hasMore: boolean }>;
}

export function UiTableListPage({
  pageTitle = 'List',
  tableRows = [],
  columns: columnsProp,
  pageLinks = [],
  height = 'auto',
  className = '',
  style = {},
  onLoadMore,
}: UiTableListPageProps) {
  const [rows, setRows] = React.useState(tableRows);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedRows = React.useMemo(() => {
    if (!sortConfig) return rows;

    const { key, direction } = sortConfig;
    const col = columnsProp?.find((c) => c.key === key);
    const colType = col?.type;

    return [...rows].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      const isValAEmpty = valA === undefined || valA === null || valA === '';
      const isValBEmpty = valB === undefined || valB === null || valB === '';

      if (isValAEmpty && isValBEmpty) return 0;
      if (isValAEmpty) return 1;
      if (isValBEmpty) return -1;

      if (colType === 'currency') {
        const parseCurrency = (v: any) => {
          if (typeof v === 'number') return v;
          const cleaned = String(v).replace(/[^0-9.-]/g, '');
          const parsed = parseFloat(cleaned);
          return isNaN(parsed) ? 0 : parsed;
        };
        const numA = parseCurrency(valA);
        const numB = parseCurrency(valB);
        return direction === 'asc' ? numA - numB : numB - numA;
      }

      if (colType === 'date') {
        const parseDate = (v: any) => {
          const d = new Date(v);
          return isNaN(d.getTime()) ? 0 : d.getTime();
        };
        const dateA = parseDate(valA);
        const dateB = parseDate(valB);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return direction === 'asc' ? -1 : 1;
      if (strA > strB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig, columnsProp]);

  const prevLink = pageLinks.find((l) => l.label.toLowerCase().includes('prev'));
  const nextLink = pageLinks.find((l) => l.label.toLowerCase().includes('next'));

  const columns: ColumnConfig<any>[] = React.useMemo(() => {
    if (columnsProp && columnsProp.length > 0) {
      return columnsProp.map((col) => ({
        key: col.key,
        header: col.header,
        width: col.width,
        align: col.align,
        sortable: true,
        render: (item: any) => {
          const val = item[col.key];
          if (col.type === 'link') {
            const url = col.urlKey ? item[col.urlKey] : item.url || '#';
            return (
              <a
                href={url}
                style={{
                  color: 'var(--spm-accent)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--spm-accent-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--spm-accent)')}
              >
                {val || 'Link'}
              </a>
            );
          }
          if (col.type === 'badge') {
            const badgeStyle = col.badgeStyleKey ? item[col.badgeStyleKey] : 'neutral';
            return <UiTagBadge label={String(val || '')} variant={badgeStyle as any} />;
          }
          if (col.type === 'html') {
            return <span dangerouslySetInnerHTML={{ __html: String(val || '') }} />;
          }
          if (col.type === 'checkbox') {
            return <input type="checkbox" checked={Boolean(val)} readOnly style={{ accentColor: 'var(--spm-accent)' }} />;
          }
          if (col.type === 'date') {
            if (val === undefined || val === null || val === '') return <span>-</span>;
            const d = new Date(val);
            const formatted = !isNaN(d.getTime()) 
              ? d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
              : String(val);
            return <span>{formatted}</span>;
          }
          if (col.type === 'currency') {
            if (val === undefined || val === null || val === '') return <span>-</span>;
            const parsed = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
            const formatted = !isNaN(parsed)
              ? parsed.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
              : String(val);
            return <span>{formatted}</span>;
          }
          return <span>{val || '-'}</span>;
        },
      }));
    }

    return [
      {
        key: 'icon',
        header: '',
        width: '50px',
        align: 'center',
        render: (item: any) => (
          item.iconUrl ? (
            <a href={item.iconLink || '#'} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <img
                src={item.iconUrl}
                alt="icon"
                style={{
                  width: '20px',
                  height: '20px',
                  opacity: 0.6,
                  filter: 'brightness(0) invert(1)',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
              />
            </a>
          ) : null
        ),
      },
      {
        key: 'title',
        header: 'Title / Last Updated',
        render: (item: any) => (
          <div>
            <a
              href={item.titleUrl || '#'}
              style={{
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--spm-accent)',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--spm-accent-hover)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--spm-accent)')}
            >
              {item.title || 'Untitled Item'}
            </a>
            {item.subtitle && (
              <div style={{ fontSize: '12px', color: 'var(--spm-text-secondary)', marginTop: '2px' }}>
                {item.subtitle}
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'badge',
        header: 'Status',
        width: '120px',
        align: 'center',
        render: (item: any) => (
          item.badge ? (
            <UiTagBadge label={item.badge} variant={(item.badgeVariant as any) || 'neutral'} />
          ) : null
        ),
      },
      {
        key: 'version',
        header: 'Version',
        width: '100px',
        align: 'center',
        render: (item: any) => (
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              color: 'var(--spm-text-muted)',
            }}
          >
            {item.version || 'Version 1'}
          </span>
        ),
      },
    ];
  }, [columnsProp]);

  const mainRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!onLoadMore || !mainRef.current) return;

    const el = mainRef.current;
    const handleScroll = async () => {
      if (loadingMore) return;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
        setLoadingMore(true);
        try {
          const res = await onLoadMore();
          if (res.tableRows && res.tableRows.length > 0) {
            setRows((prev) => [...prev, ...res.tableRows]);
          }
        } catch (e) {
          console.error('Failed to load more items:', e);
        } finally {
          setLoadingMore(false);
        }
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, loadingMore]);

  const isFixedHeight = height !== 'auto' && height !== '100%';

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        minHeight: isFixedHeight ? height : undefined,
        height: isFixedHeight ? height : 'auto',
        background: 'var(--spm-bg-primary)',
        color: 'var(--spm-text-primary)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: isFixedHeight ? 'hidden' : 'visible',
        ...style,
      }}
    >
      <style>{`
        #sidebarSlot-container:empty {
          display: none !important;
        }
      `}</style>
      
      {/* Sidebar slot - legacy sidebar nodes reparented here */}
      <aside
        id="sidebarSlot-container"
        style={{
          width: '240px',
          flexShrink: 0,
          borderRight: '1px solid var(--spm-border)',
          background: 'var(--spm-bg-secondary)',
          padding: '16px',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      />

      {/* Main content scroll container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: isFixedHeight ? '100%' : 'auto' }}>
        {/* Header */}
        <header
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--spm-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'var(--spm-bg-secondary)',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--spm-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {pageTitle}
          </h1>

          {!onLoadMore && <UiPaginationBar pageLinks={pageLinks} />}
        </header>

        {/* Scrollable list of table rows */}
        <main
          ref={mainRef as any}
          style={{
            padding: '24px',
            flex: 1,
            overflowY: isFixedHeight ? 'auto' : 'visible',
            boxSizing: 'border-box',
          }}
        >
          <UiTable
            columns={columns}
            data={sortedRows}
            sortKey={sortConfig?.key}
            sortDirection={sortConfig?.direction}
            onSort={handleSort}
          />
          {loadingMore && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid var(--spm-border)',
                borderTopColor: 'var(--spm-accent)',
                animation: 'spm-spin-table 0.6s linear infinite'
              }} />
              <style>{`
                @keyframes spm-spin-table {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
        </main>
      </div>

      {!onLoadMore && pageLinks && pageLinks.length > 0 && (prevLink || nextLink) && (
        <div
          className="spm-floating-pagination"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(26, 26, 26, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--spm-border)',
            borderRadius: '24px',
            padding: '6px 12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {prevLink && (
            <a
              href={prevLink.url}
              style={{
                color: 'var(--spm-text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '16px',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'var(--spm-accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--spm-text-primary)';
              }}
            >
              ← Prev
            </a>
          )}
          {prevLink && nextLink && <div style={{ width: '1px', height: '16px', background: 'var(--spm-border)' }} />}
          {nextLink && (
            <a
              href={nextLink.url}
              style={{
                color: 'var(--spm-text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '16px',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'var(--spm-accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--spm-text-primary)';
              }}
            >
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
