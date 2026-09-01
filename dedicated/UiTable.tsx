import React from 'react';

export interface ColumnConfig<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
}

export interface UiTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
  style?: React.CSSProperties;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  selectable?: boolean;
  selectedKeys?: (string | number)[];
  onSelectionChange?: (selectedKeys: (string | number)[]) => void;
  rowKey?: keyof T | ((item: T) => string | number);
}

export function UiTable<T>({
  columns,
  data,
  onRowClick,
  className = '',
  style = {},
  sortKey,
  sortDirection,
  onSort,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  rowKey,
}: UiTableProps<T>) {
  const getRowKey = (item: T, idx: number): string | number => {
    if (typeof rowKey === 'function') return rowKey(item);
    if (rowKey && (item as any)[rowKey] !== undefined) return (item as any)[rowKey];
    if ((item as any).id !== undefined) return (item as any).id;
    return idx;
  };

  const isAllSelected = data.length > 0 && data.every((item, idx) => selectedKeys.includes(getRowKey(item, idx)));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      const allKeys = data.map((item, idx) => getRowKey(item, idx));
      onSelectionChange(allKeys);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (itemKey: string | number, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    if (!onSelectionChange) return;
    if (selectedKeys.includes(itemKey)) {
      onSelectionChange(selectedKeys.filter((k) => k !== itemKey));
    } else {
      onSelectionChange([...selectedKeys, itemKey]);
    }
  };

  return (
    <div
      className={className}
      style={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: 'var(--spm-radius)',
        border: '1px solid var(--spm-border)',
        background: 'var(--spm-bg-secondary)',
        ...style,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
          textAlign: 'left',
          color: 'var(--spm-text-primary)',
          fontFamily: 'inherit',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '1px solid var(--spm-border)',
              background: 'var(--spm-bg-tertiary)',
            }}
          >
            {selectable && (
              <th
                style={{
                  width: '40px',
                  padding: '12px 16px',
                  textAlign: 'center',
                }}
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  style={{ accentColor: 'var(--spm-accent)', cursor: 'pointer' }}
                />
              </th>
            )}
            {columns.map((col, idx) => {
              const isSortable = !!onSort && !!col.key;
              const isSorted = sortKey === col.key;
              return (
                <th
                  key={idx}
                  onClick={() => isSortable && onSort(col.key as string)}
                  style={{
                    padding: '12px 16px',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: isSorted ? 'var(--spm-accent)' : 'var(--spm-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    width: col.width,
                    textAlign: col.align || 'left',
                    cursor: isSortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (isSortable) e.currentTarget.style.color = 'var(--spm-accent)';
                  }}
                  onMouseLeave={e => {
                    if (isSortable) {
                      e.currentTarget.style.color = isSorted ? 'var(--spm-accent)' : 'var(--spm-text-muted)';
                    }
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {col.header}
                    {isSorted && (
                      <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  color: 'var(--spm-text-muted)',
                }}
              >
                No items found.
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => {
              const itemKey = getRowKey(item, rowIdx);
              const isSelected = selectedKeys.includes(itemKey);

              return (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick && onRowClick(item)}
                  style={{
                    borderBottom: rowIdx === data.length - 1 ? 'none' : '1px solid var(--spm-border)',
                    background: isSelected ? 'var(--spm-bg-tertiary)' : 'transparent',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.background = 'var(--spm-bg-tertiary)';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {selectable && (
                    <td
                      style={{
                        padding: '16px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={e => handleSelectRow(itemKey, e)}
                        style={{ accentColor: 'var(--spm-accent)', cursor: 'pointer' }}
                      />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      style={{
                        padding: '16px',
                        verticalAlign: 'middle',
                        textAlign: col.align || 'left',
                      }}
                    >
                      {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
