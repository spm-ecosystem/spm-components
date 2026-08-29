import React, { useState } from 'react';

export interface TreeNode {
  id: string;
  label: string;
  values?: Record<string, string>;
  children?: TreeNode[];
  icon?: string;
}

export interface TreeColumn {
  key: string;
  title: string;
  width?: string;
}

export interface UiNestedTreeTableProps {
  title?: string;
  columns?: TreeColumn[];
  data?: TreeNode[];
  expandedDepth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function UiNestedTreeTable({
  title,
  columns = [],
  data = [],
  expandedDepth = 1,
  className = '',
  style = {},
}: UiNestedTreeTableProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string, depth: number) => {
    setExpanded((prev) => {
      const current = prev[id] !== undefined ? prev[id] : depth < expandedDepth;
      return { ...prev, [id]: !current };
    });
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = expanded[node.id] !== undefined ? expanded[node.id] : depth < expandedDepth;

    return (
      <React.Fragment key={node.id}>
        <tr
          style={{
            borderBottom: '1px solid var(--spm-border, #334155)',
            backgroundColor: depth % 2 === 0 ? 'transparent' : 'var(--spm-bg-secondary, #1e293b)',
          }}
        >
          <td style={{ padding: '10px 12px', paddingLeft: `${12 + depth * 20}px` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleRow(node.id, depth)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--spm-text-primary, #f8fafc)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: 0,
                  }}
                >
                  {isExpanded ? '▼' : '►'}
                </button>
              ) : (
                <span style={{ width: '12px' }} />
              )}
              {node.icon && <span>{node.icon}</span>}
              <span style={{ fontWeight: hasChildren ? 600 : 400 }}>{node.label}</span>
            </div>
          </td>

          {columns.map((col) => (
            <td key={col.key} style={{ padding: '10px 12px', fontSize: '13px' }}>
              {node.values?.[col.key] || ''}
            </td>
          ))}
        </tr>

        {hasChildren && isExpanded && node.children!.map((child) => renderNode(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div
      className={`spm-tree-table-container ${className}`}
      style={{
        backgroundColor: 'var(--spm-bg-surface, #1e293b)',
        color: 'var(--spm-text-primary, #f8fafc)',
        borderRadius: 'var(--spm-radius, 8px)',
        border: '1px solid var(--spm-border, #334155)',
        overflow: 'hidden',
        width: '100%',
        ...style,
      }}
    >
      {title && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--spm-border, #334155)', fontWeight: 600 }}>
          {title}
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--spm-bg-primary, #0f172a)', borderBottom: '1px solid var(--spm-border, #334155)' }}>
            <th style={{ padding: '12px', fontSize: '12px', textTransform: 'uppercase' }}>Structure</th>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: '12px', fontSize: '12px', textTransform: 'uppercase', width: col.width }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((node) => renderNode(node, 0))}</tbody>
      </table>
    </div>
  );
}
