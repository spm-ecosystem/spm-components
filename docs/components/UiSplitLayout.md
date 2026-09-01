# UiSplitLayout

## Purpose & Use Cases

`UiSplitLayout` provides a responsive two-column split layout shell for documentation workspaces, detail inspection views, and content managers. It pairs a main view (rendering custom React content via `mainContent`, HTML markup via `mainHtml`, or media via `imageSlot` with `UiImageViewer`) with a sidebar column (`sidebarContent`, `sidebarHtml`, or default `UiScrollPanel`). Supports desktop toggle collapsing (`collapsible`), side positioning (`sidebarSide`: `"left"` | `"right"`), customizable column widths (`sidebarWidth`), image fit modes (`contain` | `cover`), and search forwarding.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `mainContent` | `React.ReactNode` | `undefined` | Custom React node content rendered inside the main viewport area. |
| `mainHtml` | `string` | `undefined` | HTML markup string rendered inside the main viewport when `mainContent` and `imageSlot` are empty. |
| `sidebarContent` | `React.ReactNode` | `undefined` | Custom React node content rendered inside the sidebar column. |
| `sidebarHtml` | `string` | `undefined` | HTML markup string rendered inside the sidebar container when `sidebarContent` is omitted. |
| `collapsible` | `boolean` | `true` | Enables a desktop toggle handle button to expand or collapse the sidebar column. |
| `sidebarSide` | `'left' \| 'right'` | `'left'` | Position of sidebar column (`left` or `right`). |
| `sidebarWidth` | `string` | `'300px'` | Width of sidebar panel column. |
| `imageSlot` | `ImageSlotItem[]` | `[]` | Media image items (`{ src, alt }`) rendered in main view using `UiImageViewer`. |
| `tags` | `TagItem[]` | `[]` | Forwarded tag items rendered in default sidebar panel. |
| `buttons` | `ButtonItem[]` | `[]` | Forwarded action buttons rendered in default sidebar panel. |
| `statisticsHtml` | `string` | `undefined` | Forwarded HTML content string rendered in sidebar statistics block. |
| `imageFit` | `'contain' \| 'cover'` | `'contain'` | Image object-fit property passed to `UiImageViewer`. |
| `height` | `string` | `'100%'` | Layout container height. |
| `splitButtons` | `boolean` | `true` | Enables separate button placement layout. |
| `showSearch` | `boolean` | `false` | Enables search bar in default sidebar panel. |
| `searchPlaceholder` | `string` | `'Search documentation…'` | Forwarded search bar placeholder text. |
| `searchSubmitUrl` | `string` | `undefined` | Forwarded search bar submission URL. |
| `searchParamName` | `string` | `'q'` | Forwarded query parameter key for search bar. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Main viewing pane background color (`#09090b`).
- `var(--spm-bg-surface)` - Sidebar column background color (`#121215`).
- `var(--spm-border)` - Divider border line separating main view and sidebar (`#27272a`).
- `var(--spm-text-primary)` - Primary text color (`#ffffff`).

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#doc-workspace" -> UiSplitLayout {
    sidebarWidth: "300px";
    sidebarSide: "left";
    collapsible: true;
    height: "calc(100vh - 64px)";
    showSearch: true;
    searchPlaceholder: "Search documentation...";
    searchSubmitUrl: "/docs/search";
    searchParamName: "q";

    bind statisticsHtml: "#doc-stats | html";
    bind mainHtml: "#doc-body | html";

    child tags extends TagItem {
        selector: "#doc-toc .toc-item";
        scope: "document";
        bind name: "a.toc-link | text";
        bind count: "span.doc-count | text";
        bind type: "self | attr:data-category";
        bind url: "a.toc-link | attr:href";
    }

    child buttons extends ButtonItem {
        selector: "#doc-actions a";
        scope: "document";
        bind label: "self | text";
        bind url: "self | hrefOrOnclick";
        bind targetSelector: "self | selector";
    }
}
```
