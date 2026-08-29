# UiNestedTreeTable

The `UiNestedTreeTable` component provides an expandable/collapsible hierarchical tree table for rendering structured data such as file directories, nested categories, or legacy Bill-of-Materials (BOM) trees.

## Props Interface

```typescript
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
```

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#legacy-bom-table" -> UiNestedTreeTable {
  title: "Bill of Materials Hierarchy";
  expandedDepth: 2;
}
```

## Theme Variables Used
- `--spm-bg-surface`, `--spm-bg-primary`, `--spm-bg-secondary`
- `--spm-text-primary`, `--spm-border`, `--spm-radius`
