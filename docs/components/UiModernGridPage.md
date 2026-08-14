# UiModernGridPage

## Purpose & Use Cases

`UiModernGridPage` provides a comprehensive gallery page layout. It combines a responsive thumbnail grid (`UiImageCard`), a sidebar panel supporting grouped tag lists (`tagGroups`) or raw HTML, an integrated search bar (`UiSearchBar`), page title header, and bottom pagination controls (`UiPaginationBar`). Includes responsive mobile drawer/column adaptation.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pageTitle` | `string` | **Required** | Title displayed at top of gallery feed. |
| `items` | `GridItem[]` | **Required** | Array of image thumbnail items (`{ imageUrl, linkUrl, title, id }`). |
| `pageLinks` | `PageLink[]` | `[]` | Pagination links array (`{ label, url }`). |
| `sidebarHtml` | `string` | `undefined` | Raw HTML content fallback for sidebar slot. |
| `tags` | `TagItem[]` | `[]` | List of tag badges rendered in sidebar. |
| `tagGroups` | `TagGroupConfig[]` | `[]` | Group definitions (`{ title: string, typeKey: string }`) to organize tags into categorized sections. |
| `showSearch` | `boolean` | `false` | Enables embedded search bar. |
| `searchPlaceholder` | `string` | `undefined` | Placeholder text for search field. |
| `searchSubmitUrl` | `string` | `undefined` | Form submit action URL for search field. |
| `searchParamName` | `string` | `'tags'` | Search field query string parameter key. |
| `searchDefaultValue` | `string` | `''` | Initial search query string. |
| `height` | `string` | `'100vh'` | Height constraint of gallery container. |
| `sidebarWidth` | `string` | `'280px'` | Width of sidebar panel. |
| `hideSidebarOnMobile` | `boolean` | `true` | Hides sidebar panel on narrow viewports. |
| `mobileBreakpoint` | `number` | `720` | Responsive mobile width threshold in pixels. |
| `mobileColumns` | `number` | `2` | Number of grid columns on mobile screens. |
| `mobileGap` | `string` | `'8px'` | Grid gap spacing on mobile screens. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Grid page background color.
- `var(--spm-bg-secondary)` - Header bar and sidebar background color.
- `var(--spm-border)` - Divider line border color.
- `var(--spm-text-primary)` - Gallery title text color.
- `var(--spm-text-muted)` - Empty feed notification text color.
- `var(--spm-accent)` - Hover accent border and active indicators.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#post-list" -> UiModernGridPage {
    urlPattern: "page=post&s=list";
    pageTitle: "Gallery";
    height: "calc(100vh - 78px)";
    sidebarWidth: "260px";
    hideSidebarOnMobile: true;
    showSearch: true;
    searchPlaceholder: "Search tags…";
    searchSubmitUrl: "https://safebooru.org/index.php?page=post&s=list";
    searchParamName: "tags";

    mobileBreakpoint: 720;
    mobileColumns: 2;
    mobileGap: "8px";

    tagGroups: R"([
      { "title": "Artists", "typeKey": "artist" },
      { "title": "Copyrights", "typeKey": "copyright" },
      { "title": "Characters", "typeKey": "character" },
      { "title": "General", "typeKey": "general" },
      { "title": "Meta", "typeKey": "metadata" }
    ])";

    bind searchDefaultValue: ".sidebar form input[name='tags'] | attr:value";

    child items {
        selector: "#post-list .thumb";
        bind imageUrl: "img | attr:src";
        bind linkUrl: "a | attr:href";
        bind title: "img | attr:title";
        bind id: "self | attr:id";
    }

    child pageLinks extends StandardLink {
        selector: "#paginator .pagination a";
    }

    child tags extends TagItem {
        selector: "#tag-sidebar li";
        bind addUrl: "a:nth-of-type(2) | attr:href";
        bind removeUrl: "a:nth-of-type(3) | attr:href";
    }
}
```
