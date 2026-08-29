# UiPostDetails

The `UiPostDetails` component provides a split layout for displaying detailed view pages, such as image board posts, article details, or media inspect views. It includes a metadata sidebar (tag groups, search bar, statistics) and a main content viewport with action buttons.

## Props Interface

```typescript
export interface TagItem {
  name: string;
  count: string;
  type: string;
  url: string;
  addUrl?: string;
  removeUrl?: string;
}

export interface GenericButtonItem {
  label: string;
  url: string;
  targetSelector?: string;
  iconSvg?: string;
}

export interface TagGroupConfig {
  title: string;
  typeKey: string;
}

export interface UiPostDetailsProps {
  imageUrl: string;
  imageAlt?: string;
  tags?: TagItem[];
  tagGroups?: TagGroupConfig[];
  statisticsHtml?: string;
  buttons?: GenericButtonItem[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchSubmitUrl?: string;
  searchParamName?: string;
}
```

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#post-view" -> UiPostDetails {
  bind imageUrl: "img#main-image | attr:src";
  bind imageAlt: "img#main-image | attr:alt";
  bind statisticsHtml: "#stats-block | html";
  
  child tags {
    selector: "#tag-sidebar li";
    bind name: "a.tag-name | text";
    bind count: "span.count | text | cleanNumber";
    bind type: "self | attr:class";
    bind url: "a.tag-name | hrefOrOnclick";
  }
}
```

## Theme Variables Used
- `--spm-bg-primary`, `--spm-bg-secondary`, `--spm-bg-tertiary`
- `--spm-text-primary`, `--spm-text-muted`
- `--spm-accent`, `--spm-border`, `--spm-radius`
