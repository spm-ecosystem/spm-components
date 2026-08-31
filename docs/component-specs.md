# Complete Component Specifications & Props API Reference (`component-specs.md`)

This is the authoritative React component documentation for the **Site Package Manager (SPM)** ecosystem (`spm-components`). All modern layout reconstructions in SPM rely on these components to replace legacy DOM structures in Shadow DOM.

---

## 1. Architectural Guidelines & Contracts

1. **Strict Typescript Interfaces**: All props are optional with sensible neutral fallbacks to prevent runtime NPE crashes.
2. **Design Tokens via CSS Variables**: Never use hardcoded hex colors or static dimensions. All styling uses `--spm-*` visual tokens (e.g. `var(--spm-bg-primary)`, `var(--spm-accent)`, `var(--spm-text-primary)`).
3. **Prop Spreading**: All components accept `className?: string` and `style?: React.CSSProperties` and spread them onto the host root element.
4. **Conditional Rendering**: Empty or un-scraped properties must render nothing (no orphan tags or zero-width containers).

---

## 2. Comprehensive Component Index & Props API

### 1. UiCommentListPage

## Purpose & Use Cases

`UiCommentListPage` modernizes comment discussion feeds and message boards. It renders thread cards displaying post thumbnails, post metadata (author, date, rating, score), tag badges, speech-bubble reply threads (`UiCommentReply`), header title, and bottom pagination controls (`UiPaginationBar`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pageTitle` | `string` | `'Comments'` | Title text displayed in header bar. |
| `threads` | `CommentThread[]` | `[]` | List of comment thread items containing post metadata and replies array. |
| `pageLinks` | `PageLink[]` | `[]` | Pagination links array (`{ label, url }`). |
| `showThumbnails` | `boolean` | `true` | Whether to render thread thumbnail image containers. |
| `height` | `string` | `'100vh'` | Height constraint of layout wrapper. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `CommentThread` Schema

- `id`: `string` - Unique thread identifier.
- `thumbnailUrl`: `string` (optional) - Image thumbnail associated with post.
- `postUrl`: `string` - Target link to main post page.
- `postDate`: `string` - Post creation date text.
- `postUser`: `string` - Original poster username.
- `postRating`: `string` - Post rating descriptor (e.g. `'Safe'`).
- `postScore`: `string` - Post popularity/score count.
- `tags`: `TagItem[]` (optional) - Array of associated tag badges (`label`, `url`, `type`).
- `comments`: `CommentItem[]` (optional) - Array of user replies (`author`, `authorUrl`, `date`, `body`).

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Page background color.
- `var(--spm-bg-secondary)` - Thread card background color.
- `var(--spm-bg-tertiary)` - Speech bubble reply background color.
- `var(--spm-border)` - Thread border and speech bubble outline color.
- `var(--spm-text-primary)` - Comment body text color.
- `var(--spm-text-secondary)` - Author username text color.
- `var(--spm-text-muted)` - Date stamp and post metadata text color.
- `var(--spm-accent)` - Author link hover color and accent badges.
- `var(--spm-radius)` - Border radius of speech bubbles and thread cards.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#content:has(#comment-list)" -> UiCommentListPage {
    urlPattern: "page=comment&s=list";
    pageTitle: "Comments";
    height: "calc(100vh - 78px)";

    child threads {
        selector: "#comment-list > div.post";
        bind id: "self | attr:id";
        bind thumbnailUrl: ".col1 img | attr:src";
        bind postUrl: ".col1 a | attr:href";
        bind postDate: ".col2 span.info:nth-child(1) | text";
        bind postUser: ".col2 span.info:nth-child(2) | text";
        bind postRating: ".col2 span.info:nth-child(3) | text";
        bind postScore: ".col2 span.info:nth-child(4) | text";

        child tags {
            selector: ".col2 .tags span";
            bind label: "a | text";
            bind url: "a | attr:href";
            bind type: "self | attr:class";
        }

        child comments {
            selector: ".response-list div.post";
            bind author: ".author h6 a | text";
            bind authorUrl: ".author h6 a | attr:href";
            bind date: ".author span.date | text";
            bind body: ".content .body | text";
        }
    }

    child pageLinks extends DocumentLink {
        selector: "#paginator .pagination a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }
}
```

---

### 2. UiDashboardPage

## Purpose & Use Cases

`UiDashboardPage` provides a card-based dashboard layout component suitable for user account control panels, settings menus, options hubs, and administrative pages. It features a header section with page title and optional subtitle, and a responsive grid of action cards (`DashboardCard`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pageTitle` | `string` | `'Dashboard'` | Title text displayed in header bar. |
| `subTitle` | `string` | `undefined` | Optional subtitle description text rendered below title. |
| `cards` | `DashboardCard[]` | `[]` | List of dashboard card objects (`{ title, description, url, urlLabel }`). |
| `height` | `string` | `'100vh'` | Height constraint of layout wrapper. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `DashboardCard` Schema

- `title`: `string` - Main title of the option card.
- `description`: `string` (optional) - Explanation or body text describing card action.
- `url`: `string` - Target URL destination for card action button.
- `urlLabel`: `string` (optional) - Custom button text label (defaults to `'Open'`).

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Layout background color.
- `var(--spm-bg-secondary)` - Header bar and card background color.
- `var(--spm-border)` - Border color for cards and header divider line.
- `var(--spm-text-primary)` - Header title and card heading text color.
- `var(--spm-text-secondary)` - Subtitle and card description text color.
- `var(--spm-accent)` - Card action button background and hover color.
- `var(--spm-accent-text)` - Text color for card action buttons.
- `var(--spm-radius)` - Border radius of dashboard cards and action buttons.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#user-index" -> UiDashboardPage {
    urlPattern: "page=account&s=home";
    pageTitle: "My Account Home";
    subTitle: "Manage your settings, options, and account status.";
    height: "calc(100vh - 78px)";

    child cards {
        selector: "#user-index h4";
        bind title: "self | text";
        bind url: "a | attr:href";
        bind urlLabel: "a | text";
        bind description: "self | nextSiblingText";
    }
}
```

---

### 3. UiHeroLanding

## Purpose & Use Cases

`UiHeroLanding` provides a full-viewport landing page hero component for modernized index pages. It features a brand header (logo or fallback site name), tagline headline, subtext summary, prominent Call-To-Action (CTA) button, an integrated search bar (`UiSearchBar`), and quick-navigation link pills.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `siteName` | `string` | `undefined` | Fallback brand name text displayed when no logo image is supplied. |
| `logoUrl` | `string` | `undefined` | Optional image URL for brand logo. |
| `logoHref` | `string` | `'/'` | Target destination URL when clicking logo. |
| `tagline` | `string` | `undefined` | Main hero headline text. |
| `subtext` | `string` | `undefined` | Subtitle description text rendered below tagline. |
| `ctaLabel` | `string` | `undefined` | Primary call-to-action button label. |
| `ctaUrl` | `string` | `undefined` | Destination URL for CTA button. |
| `searchPlaceholder` | `string` | `undefined` | Placeholder text for embedded search bar. |
| `searchSubmitUrl` | `string` | `undefined` | Form submit action URL for search bar. |
| `searchParamName` | `string` | `undefined` | Query string parameter key for search field (e.g., `'tags'`, `'q'`). |
| `primaryLinks` | `NavLink[]` | `[]` | List of pill navigation links (`{ label: string, url: string }`). |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Hero section full viewport background color.
- `var(--spm-bg-secondary)` - Background color for link pills and container elements.
- `var(--spm-border)` - Border color for link pills and input borders.
- `var(--spm-text-primary)` - Main tagline heading color.
- `var(--spm-text-secondary)` - Subtext description text color.
- `var(--spm-text-muted)` - Subtitle and helper label text color.
- `var(--spm-accent)` - Primary CTA button background color.
- `var(--spm-accent-text)` - Primary CTA button text color.
- `var(--spm-radius)` - Border radius for CTA button, input fields, and link pills.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#static-index" -> UiHeroLanding {
    urlPattern: R"(safebooru\.org\/?(?:index\.php)?$)";
    tagline: "Anime picture search engine";
    subtext: "Browse millions of safe anime illustrations, updated hourly.";
    ctaLabel: "Browse Gallery";
    ctaUrl: "https://safebooru.org/index.php?page=post&s=list&tags=all";
    searchPlaceholder: "Search tags... (e.g. blue_hair 1girl)";
    searchSubmitUrl: "https://safebooru.org/index.php?page=post&s=list";
    searchParamName: "tags";

    bind siteName: "img[alt='Safebooru'] | attr:alt";
    bind logoUrl: "img[alt='Safebooru'] | attr:src";

    child primaryLinks extends NavLink {
        selector: "#links a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }
}
```

---

### 4. UiImageCard

## Purpose & Use Cases

`UiImageCard` renders thumbnail card items for gallery feeds, grid layouts, and search results. It supports customizable aspect ratios (`square`, `video`, `portrait`, `auto`), hover scaling effects, object-fit options (`cover`, `contain`), optional title captions, and CSS variable custom width overrides.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `imageUrl` | `string` | **Required** | Source URL for card thumbnail image. |
| `linkUrl` | `string` | **Required** | Target hyperlink URL when clicking card. |
| `title` | `string` | **Required** | Title text used for caption and tooltip attributes. |
| `id` | `string` | **Required** | Unique DOM identifier assigned to card element. |
| `width` | `string` | `'160px'` | Default width of card container (overridden by `--spm-image-card-width` if defined). |
| `aspectRatio` | `'square' \| 'video' \| 'portrait' \| 'wide' \| 'auto'` | `'square'` | Predefined aspect ratio (`square` = 1/1, `video` = 16/9, `portrait` = 3/4, `wide` = 21/9, `auto` = intrinsic). |
| `imageFit` | `'cover' \| 'contain'` | `'cover'` | CSS `object-fit` property applied to image. |
| `showTitle` | `boolean` | `true` | Toggles rendering of bottom title caption block. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### Aspect Ratio Controls & Presets

`UiImageCard` enforces geometric proportions across gallery grid items to eliminate cumulative layout shift (CLS):
- `square` (default): 1:1 aspect ratio (`aspectRatio: '1 / 1'`), standard for avatars and booru post grids.
- `video`: 16:9 widescreen format (`aspectRatio: '16 / 9'`), ideal for video thumbnails and horizontal photography.
- `portrait`: 3:4 vertical poster format (`aspectRatio: '3 / 4'`), standard for book covers and portrait art.
- `wide`: 21:9 ultra-wide banner format (`aspectRatio: '21 / 9'`), suited for panoramic banners.
- `auto`: Intrinsic image aspect ratio without container constraint (`aspectRatio: 'auto'`).

### Broken Image Fallback Behavior

If the source `imageUrl` fails to load, returns a 404 HTTP status, or is invalid, `UiImageCard` catches the image `onError` event and automatically falls back to rendering a standardized placeholder SVG icon (`UiImage` fallback) with neutral styling to prevent browser broken image icon glitches.

## Design Tokens (CSS Variables)

- `var(--spm-image-card-width)` - Custom variable controlling card width dynamically.
- `var(--spm-bg-secondary)` - Card background color.
- `var(--spm-border)` - Default card border color.
- `var(--spm-text-primary)` - Title text color.
- `var(--spm-text-secondary)` - Hover title text color.
- `var(--spm-accent)` - Hover state border color.
- `var(--spm-radius)` - Border radius of card container.

## Veneer Spec (.vnr) Example

```vnr
child items -> UiImageCard {
    selector: "#post-list .thumb";
    width: "180px";
    aspectRatio: "square";
    imageFit: "cover";
    showTitle: true;

    bind imageUrl: "img | attr:src";
    bind linkUrl: "a | attr:href";
    bind title: "img | attr:title";
    bind id: "self | attr:id";
}
```

---

### 5. UiImageViewer

## Purpose & Use Cases

`UiImageViewer` renders a full-container responsive image view. It centers the image within parent dimensions, applies CSS `object-fit` constraints (`contain` or `cover`), auto-detects extreme aspect ratios (> 2.2:1 or < 0.5:1) to automatically fallback from `cover` to `contain` preventing severe cropping, provides interactive click-to-zoom and fit toggle controls, supports customizable background fill colors, and displays a graceful fallback state when no source image is provided.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | `undefined` | Source URL of image to display. |
| `alt` | `string` | `''` | Alt text for image element. |
| `fit` | `'contain' \| 'cover'` | `'contain'` | CSS `object-fit` sizing behavior (`contain` keeps full image visible, `cover` fills bounds). |
| `imageFit` | `'contain' \| 'cover'` | `undefined` | Alias for `fit` with precedence over `fit`. |
| `background` | `string` | `var(--spm-bg-primary)` | Container background color. |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |
| `enableZoom` | `boolean` | `true` | Enables click-to-zoom on image and overlay toggle fit button. |
| `onFitChange` | `(fit: 'contain' \| 'cover') => void` | `undefined` | Callback fired when user toggles fit mode. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Default viewer background color.
- `var(--spm-bg-secondary)` - Background color for floating controls.
- `var(--spm-border)` - Border color for floating controls.
- `var(--spm-text-primary)` - Text color for floating controls.
- `var(--spm-text-muted)` - Text color displayed when image source is missing.
- `var(--spm-radius)` - Border radius for floating controls.

## Veneer Spec (.vnr) Example

```vnr
child imageSlot -> UiImageViewer {
    selector: "#image";
    fit: "contain";
    enableZoom: true;

    bind src: "self | attr:src";
    bind alt: "self | attr:alt";
}
```

---

### 6. UiModernGridPage

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

---

### 7. UiNavHeader

## Purpose & Use Cases

`UiNavHeader` provides a responsive, customizable site header component for modernized layouts. It renders a brand identity section (logo image or fallback site name text), primary navigation links, secondary action/utility links, and supports multiple layout configurations (`standard`, `stacked`, `minimal`). It includes active URL matching logic to highlight current navigation routes automatically.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `siteName` | `string` | `'Site'` | Fallback site title text displayed when no logo image URL is provided. |
| `logoUrl` | `string` | `undefined` | Optional image URL for site logo. |
| `logoHref` | `string` | `'/'` | Target URL when clicking logo or site title. |
| `primaryLinks` | `NavLink[]` | `[]` | Primary navigation items (`{ label: string, url: string }`). |
| `secondaryLinks` | `NavLink[]` | `[]` | Secondary/user action items (`{ label: string, url: string }`). |
| `layout` | `'standard' \| 'stacked' \| 'minimal'` | `'standard'` | Header layout variant (`standard` = horizontal row, `stacked` = multi-tier header, `minimal` = compact container). |
| `sticky` | `boolean` | `false` | When `true`, fixes navigation header to top of viewport during scrolling with blur backdrop. |
| `hideOnMobile` | `boolean` | `false` | When `true`, hides navigation header on viewports narrower than `mobileBreakpoint`. |
| `mobileBreakpoint` | `number` | `720` | Pixel width threshold for mobile responsive hiding. |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### Sticky Navigation Behavior

When `sticky={true}` (or `sticky: true` in `.vnr`), `UiNavHeader` attaches to the top of the viewport (`top: 0`) and remains fixed in view while the user scrolls down the page.

The following CSS rules are applied to the header root element:
```css
position: sticky;
top: 0;
z-index: 1000;
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
```

This creates a modern semi-translucent frosted glass effect using `var(--spm-bg-secondary)` with opacity, ensuring navigation links and brand identity remain continuously accessible without obstructing visibility of the underlying scrolling page content.

## Design Tokens (CSS Variables)

- `var(--spm-bg-secondary)` - Background color of header bar.
- `var(--spm-bg-tertiary)` - Background for active navigation item pills.
- `var(--spm-border)` - Bottom border color of header bar.
- `var(--spm-text-primary)` - Site title and active link text color.
- `var(--spm-text-secondary)` - Inactive primary navigation link color.
- `var(--spm-text-muted)` - Secondary link text color.
- `var(--spm-accent)` - Hover accent color for links and brand elements.
- `var(--spm-radius)` - Border radius for nav link pills and logo wrapper.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#header" -> UiNavHeader {
    siteName: "Safebooru";
    logoHref: "/";
    layout: "standard";
    sticky: true;
    hideOnMobile: false;

    bind logoUrl: "#logo img | attr:src";

    child primaryLinks extends NavLink {
        selector: "#navbar ul.main-nav a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }

    child secondaryLinks extends NavLink {
        selector: "#navbar ul.user-nav a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }
}
```

---

### 8. UiNestedTreeTable

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

---

### 9. UiPaginationBar

## Purpose & Use Cases

`UiPaginationBar` renders page navigation links for paginated feeds, lists, and search results. It parses incoming `pageLinks` data, determines page offset values automatically based on query parameters (such as `pid` or `page`), renders Previous/Next controls, and highlights the currently active page.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pageLinks` | `PageLink[]` | `[]` | List of page link objects (`{ label: string, url: string }`). |
| `paramName` | `string` | `'pid'` | Query parameter key used to derive page offset and active status. |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-secondary)` - Inactive page button background color.
- `var(--spm-bg-tertiary)` - Button hover state background color.
- `var(--spm-border)` - Border color of pagination buttons and container.
- `var(--spm-text-primary)` - Inactive page number text color.
- `var(--spm-text-secondary)` - Secondary navigation control label color.
- `var(--spm-accent)` - Active page button background color and focus border.
- `var(--spm-accent-text)` - Active page button text color.
- `var(--spm-radius)` - Border radius of individual page buttons.

## Veneer Spec (.vnr) Example

```vnr
child pageLinks extends PageLink -> UiPaginationBar {
    selector: "#paginator .pagination a";
    paramName: "pid";
    bind label: "self | text";
    bind url: "self | attr:href";
}
```

---

### 10. UiPostDetails

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

---

### 11. UiScrollPanel

## Purpose & Use Cases

`UiScrollPanel` provides a scrollable sidebar panel for detail views, media inspectors, and layout drawers. It aggregates search input (`UiSearchBar`), tag lists (`UiTagBadge`), categorized action buttons (`ButtonItem[]` automatically styled as `primary`, `nav`, or `ghost`), and raw statistics HTML blocks (`statisticsHtml`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `tags` | `TagItem[]` | `[]` | Array of tag badge objects (`{ name, count, type, url }`). |
| `buttons` | `ButtonItem[]` | `[]` | List of action buttons (`{ label, url, targetSelector }`) automatically classified by label intent. |
| `statisticsHtml` | `string` | `undefined` | Raw HTML content rendered inside a statistics panel block. |
| `showSearch` | `boolean` | `false` | Enables integrated search bar at top of panel. |
| `searchPlaceholder` | `string` | `undefined` | Search field placeholder text. |
| `searchSubmitUrl` | `string` | `undefined` | Search form action URL target. |
| `searchParamName` | `string` | `'q'` | Search field query parameter name. |
| `width` | `string` | `'280px'` | Fixed or responsive width of panel container. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |
| `onClose` | `() => void` | `undefined` | Optional callback executed when close button is clicked. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-secondary)` - Panel background color.
- `var(--spm-bg-tertiary)` - Section header and button background color.
- `var(--spm-border)` - Panel divider border color.
- `var(--spm-text-primary)` - Panel header and primary button text color.
- `var(--spm-text-secondary)` - Sub-heading and list item text color.
- `var(--spm-text-muted)` - Statistics label and count text color.
- `var(--spm-accent)` - Primary action button background and hover color.
- `var(--spm-radius)` - Border radius for buttons and search inputs.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#sidebar" -> UiScrollPanel {
    width: "300px";
    showSearch: true;
    searchPlaceholder: "Search tags...";
    searchSubmitUrl: "https://safebooru.org/index.php?page=post&s=list";
    searchParamName: "tags";

    bind statisticsHtml: "#stats ul | html";

    child tags extends TagItem {
        selector: "#tag-sidebar li";
        bind name: "a:last-of-type | text";
        bind count: "span.tag-count | text";
        bind type: "self | attr:class";
        bind url: "a:last-of-type | attr:href";
    }

    child buttons extends ButtonItem {
        selector: ".link-list a";
        bind label: "self | text";
        bind url: "self | hrefOrOnclick";
        bind targetSelector: "self | selector";
    }
}
```

---

### 12. UiSearchBar

## Purpose & Use Cases

`UiSearchBar` provides a styled search input form component supporting GET/POST form target navigation, query parameter binding, hidden form input forwarding, and interactive focus states. It can function as a standalone form element or be embedded within components like `UiScrollPanel`, `UiHeroLanding`, and `UiModernGridPage`.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `placeholder` | `string` | `'Search…'` | Placeholder text displayed when input is empty. |
| `defaultValue` | `string` | `''` | Initial text value populated in search input field. |
| `submitUrl` | `string` | `undefined` | Target URL action for native browser form submission. |
| `queryParamName` | `string` | `'tags'` | The `name` attribute key used for the search text field. |
| `method` | `'get' \| 'post' \| 'GET' \| 'POST'` | `'GET'` | HTTP form submission method. |
| `hiddenFields` | `{ name: string; value: string }[] \| string` | `[]` | Array or JSON-parsed string of hidden form inputs (`{ name: string, value: string }`) to forward on submit. |
| `className` | `string` | `''` | Custom CSS class name appended to form wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |
| `onSearch` | `(value: string) => void` | `undefined` | Optional JS callback executed when form is submitted (prevents default navigation if specified). |

## Design Tokens (CSS Variables)

- `var(--spm-bg-tertiary)` - Input field container background color.
- `var(--spm-border)` - Default border color around search input.
- `var(--spm-text-primary)` - Input text color.
- `var(--spm-text-muted)` - Placeholder text color and default search icon color.
- `var(--spm-accent)` - Focused state border color and search submit button hover color.
- `var(--spm-radius)` - Border radius of search container.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#search-box" -> UiSearchBar {
    placeholder: "Search posts by tag...";
    submitUrl: "https://safebooru.org/index.php?page=post&s=list";
    queryParamName: "tags";
    method: "GET";
    hiddenFields: R"([
      { "name": "page", "value": "post" },
      { "name": "s", "value": "list" }
    ])";

    bind defaultValue: "form input[name='tags'] | attr:value";
}
```

---

### 13. UiSplitLayout

## Purpose & Use Cases

`UiSplitLayout` provides a two-column layout shell for detail and inspection views. It pairs a main media view (rendering an image via `UiImageViewer` or arbitrary rich markup via `mainHtml`) with a scrollable information sidebar (`UiScrollPanel`). Supports side swapping (`left`/`right`), customizable sidebar width, image fit control, and search bar forwarding.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `imageSlot` | `ImageSlotItem[]` | `[]` | Media image items (`{ src, alt }`) rendered in main view using `UiImageViewer`. |
| `tags` | `TagItem[]` | `[]` | Forwarded tag items rendered in sidebar. |
| `buttons` | `ButtonItem[]` | `[]` | Forwarded action buttons rendered in sidebar. |
| `statisticsHtml` | `string` | `undefined` | Forwarded HTML content string rendered in sidebar statistics block. |
| `sidebarWidth` | `string` | `'280px'` | Width of sidebar panel column. |
| `sidebarSide` | `'left' \| 'right'` | `'left'` | Position of sidebar column (`left` or `right`). |
| `imageFit` | `'contain' \| 'cover'` | `'contain'` | Image object-fit property passed to `UiImageViewer`. |
| `height` | `string` | `'100vh'` | Layout container height. |
| `splitButtons` | `boolean` | `false` | Enables separate button placement layout. |
| `showSearch` | `boolean` | `false` | Enables search bar in sidebar. |
| `searchPlaceholder` | `string` | `undefined` | Forwarded search bar placeholder text. |
| `searchSubmitUrl` | `string` | `undefined` | Forwarded search bar submission URL. |
| `searchParamName` | `string` | `'q'` | Forwarded query parameter key for search bar. |
| `mainHtml` | `string` | `undefined` | Generic HTML markup string rendered in main viewport when `imageSlot` is empty. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Main viewing pane background color.
- `var(--spm-bg-secondary)` - Sidebar column background color.
- `var(--spm-border)` - Divider border line separating main view and sidebar.
- `var(--spm-text-primary)` - Primary text color.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#post-view" -> UiSplitLayout {
    urlPattern: "page=post&s=view";
    sidebarWidth: "300px";
    sidebarSide: "left";
    imageFit: "contain";
    height: "calc(100vh - 78px)";
    showSearch: true;
    searchPlaceholder: "Search tags...";
    searchSubmitUrl: "https://safebooru.org/index.php?page=post&s=list";
    searchParamName: "tags";

    bind statisticsHtml: "#stats ul | html";

    child imageSlot {
        selector: "#image";
        bind src: "self | attr:src";
        bind alt: "self | attr:alt";
    }

    child tags {
        selector: "#tag-sidebar li[class*='tag-type-']";
        scope: "document";
        bind name: "a:last-of-type | text";
        bind count: "span.tag-count | text";
        bind type: "self | attr:class";
        bind url: "a:last-of-type | attr:href";
    }

    child buttons {
        selector: ".link-list a";
        scope: "document";
        bind label: "self | text";
        bind url: "self | hrefOrOnclick";
        bind targetSelector: "self | selector";
    }
}
```

---

### 14. UiStatsDashboard

## Purpose & Use Cases

`UiStatsDashboard` provides a metrics and analytics leaderboard layout component. It presents top-ranked metrics and statistical breakdown tables (such as top tag usage, active users, or post upload counts) organized into section cards, complete with timeframe badges (`dateRangeText`) and navigation links (`navLinks`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pageTitle` | `string` | `'Statistics'` | Title text displayed in header bar. |
| `dateRangeText` | `string` | `'All time'` | Timeframe indicator text rendered in top date range badge. |
| `navLinks` | `NavLink[]` | `[]` | Navigation links array (`{ label, url }`) rendered below header. |
| `sections` | `StatSection[]` | `[]` | List of statistical leaderboard cards (`{ title, items }`). |
| `height` | `string` | `'100vh'` | Height constraint of layout wrapper. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `StatSection` & `StatItem` Schemas

- `StatSection`:
  - `title`: `string` - Heading title of leaderboard section card.
  - `items`: `StatItem[]` - Ranked item list.
- `StatItem`:
  - `place`: `string` (optional) - Rank index (e.g. `'#1'`).
  - `amount`: `string` - Metric value count or percentage label.
  - `name`: `string` - Item or entity name text.
  - `profileUrl`: `string` (optional) - Hyperlink URL associated with entity.

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Layout primary background color.
- `var(--spm-bg-secondary)` - Stat section card background color.
- `var(--spm-bg-tertiary)` - Date badge background and table row hover color.
- `var(--spm-border)` - Section card border and row divider color.
- `var(--spm-text-primary)` - Section title and item entity name text color.
- `var(--spm-text-secondary)` - Navigation link text color.
- `var(--spm-text-muted)` - Rank position label and metric count text color.
- `var(--spm-accent)` - Hover accent border and active tab link color.
- `var(--spm-radius)` - Border radius of stat cards and timeframe badges.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#content:has(div.toptencont)" -> UiStatsDashboard {
    urlPattern: "page=stats";
    pageTitle: "Booru Statistics Dashboard";
    height: "calc(100vh - 78px)";

    bind dateRangeText: "h2 | text";

    child navLinks extends NavLink {
        selector: "#content > a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }

    child sections {
        selector: "div.toptencont";
        bind title: "thead tr th | text";

        child items {
            selector: "tbody tr";
            bind place: "td:nth-child(1) | text";
            bind amount: "td:nth-child(2) | text";
            bind name: "td:nth-child(3) a | text";
            bind profileUrl: "td:nth-child(3) a | attr:href";
        }
    }
}
```

---

### 15. UiTable

## Purpose & Use Cases

`UiTable` provides a generic, styled HTML tabular grid component. It accepts a column configuration array (`columns`), row dataset (`data`), optional row click handler (`onRowClick`), column text alignment controls, custom widths, and custom cell rendering functions.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `ColumnConfig<T>[]` | **Required** | Column definitions (`{ key, header, width, align, render }`). |
| `data` | `T[]` | **Required** | Dataset array containing row objects to render. |
| `onRowClick` | `(item: T) => void` | `undefined` | Optional click event callback executed when a table row is clicked. |
| `className` | `string` | `''` | Custom CSS class name appended to container element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `ColumnConfig<T>` Schema

- `key`: `keyof T | string` - Object property key or identifier for column value.
- `header`: `string` - Text heading displayed in table header cell.
- `width`: `string` (optional) - Width constraint for column (e.g., `'120px'`, `'15%'`).
- `align`: `'left' | 'center' | 'right'` (optional) - Text alignment inside header and data cells (defaults to `'left'`).
- `render`: `(item: T) => React.ReactNode` (optional) - Custom cell rendering callback.

## Design Tokens (CSS Variables)

- `var(--spm-bg-secondary)` - Table container background color.
- `var(--spm-bg-tertiary)` - Table header row (`<thead>`) background color.
- `var(--spm-border)` - Outer border and table cell row divider color.
- `var(--spm-text-primary)` - Cell content text color.
- `var(--spm-text-secondary)` - Table header text color.
- `var(--spm-accent)` - Hover highlight background and border accent color.
- `var(--spm-radius)` - Border radius of table wrapper container.

## Veneer Spec (.vnr) Example

```vnr
child tableRows -> UiTable {
    columns: R"([
      { "key": "id", "header": "ID", "width": "60px", "align": "center" },
      { "key": "title", "header": "Title", "align": "left" },
      { "key": "author", "header": "Author", "width": "120px" }
    ])";
}
```

---

### 16. UiTableListPage

## Purpose & Use Cases

`UiTableListPage` provides a complete tabular list page layout for search result indexes, directory listings, and wiki page tables. It wraps a `UiTable` grid with page title headers, column cell formatting logic (`text`, `link`, `html`, `badge`, `checkbox`), optional infinite scroll (`onLoadMore`), and bottom pagination links (`UiPaginationBar`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `pageTitle` | `string` | `'List'` | Title text displayed in header bar. |
| `tableRows` | `any[]` | `[]` | Data row list array. |
| `columns` | `TableColumnConfig[]` | `undefined` | Column formatting configurations (`{ key, header, width, align, type, urlKey, badgeStyleKey }`). |
| `pageLinks` | `PageLink[]` | `[]` | Pagination links array (`{ label, url }`). |
| `height` | `string` | `'auto'` | Height constraint of page container. Defaults to `'auto'` for natural document page scrolling, or can be set to `'100vh'` / `'calc(100vh - 60px)'` for fixed viewport scrolling. |
| `className` | `string` | `''` | Custom CSS class name appended to root element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |
| `onLoadMore` | `() => Promise<{ tableRows: any[]; hasMore: boolean }>` | `undefined` | Optional async callback executed on reaching page end to load more rows. |

### `TableColumnConfig` Schema

- `key`: `string` - Row property key to extract cell data from.
- `header`: `string` - Table column header title text.
- `width`: `string` (optional) - Width constraint for column.
- `align`: `'left' | 'center' | 'right'` (optional) - Alignment of cell content.
- `type`: `'text' | 'link' | 'html' | 'badge' | 'checkbox' | 'date' | 'currency'` (optional) - Cell renderer type.
  - `'date'` - Renders a locale-aware date string from date strings or timestamps, supporting correct chronological sorting.
  - `'currency'` - Renders numbers as formatted USD currency values (e.g. `$1,200.00`), supporting correct numerical sorting.
- `urlKey`: `string` (optional) - Row property key containing hyperlink URL (used when `type` is `'link'`).
- `badgeStyleKey`: `string` (optional) - Row property key containing badge style identifier (used when `type` is `'badge'`).

## Design Tokens (CSS Variables)

- `var(--spm-bg-primary)` - Page layout primary background color.
- `var(--spm-bg-secondary)` - Table container and header bar background color.
- `var(--spm-bg-tertiary)` - Table header row (`<thead>`) background color.
- `var(--spm-border)` - Table border and row divider color.
- `var(--spm-text-primary)` - Page title and table text content color.
- `var(--spm-text-secondary)` - Column header text color.
- `var(--spm-accent)` - Hyperlink text color and active indicators.
- `var(--spm-radius)` - Table container border radius.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#content:has(table.highlightable)" -> UiTableListPage {
    urlPattern: "page=alias&s=list";
    pageTitle: "Tag Aliases";
    height: "calc(100vh - 78px)";
    columns: R"([
      { "key": "pending", "header": "Pending", "width": "60px", "type": "checkbox" },
      { "key": "aliasName", "header": "Alias", "type": "link", "urlKey": "aliasUrl" },
      { "key": "toName", "header": "To Tag", "type": "link", "urlKey": "toUrl" },
      { "key": "reason", "header": "Reason / Discussion", "type": "text" }
    ])";

    child tableRows {
        selector: "#aliases table.highlightable tr:not(.tableheader)";
        bind pending: "td:nth-child(1) input[type='checkbox'] | attr:class";
        bind aliasName: "td:nth-child(2) a | text";
        bind aliasUrl: "td:nth-child(2) a | attr:href";
        bind toName: "td:nth-child(3) a | text";
        bind toUrl: "td:nth-child(3) a | attr:href";
        bind reason: "td:nth-child(4) | text";
    }

    child pageLinks extends DocumentLink {
        selector: "#paginator .pagination a";
        bind label: "self | text";
        bind url: "self | attr:href";
    }
}
```

---

### 17. UiTabs

## Purpose & Use Cases

`UiTabs` provides a flexible tabbed navigation and content switching component. It supports:
- **Navigational Mode**: Tab items render as standard hyperlinks (`<a>` with `href`) for URL routing and multi-page layouts.
- **Local Panel Mode**: Tab items render as buttons switching embedded HTML tab panels (`contentHtml`) dynamically within the client without reloading.
- **Visual Variants**: `'underline'` (default), `'pill'`, and `'boxed'`.
- **Orientations**: `'horizontal'` (default) and `'vertical'`.
- **URL Parameter Sync**: Optional `activeParamName` to synchronize active tab selection with URL search parameters (e.g., `?tab=settings`).
- **Badges & Disabled State**: Tab items can display count/status badges (`badge`) and be individually disabled (`disabled`).

## Properties (Props API)

### `UiTabsProps`

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `tabs` | `UiTabItem[]` | `[]` | Array of tab descriptor items. |
| `activeParamName` | `string` | `undefined` | Optional URL search parameter key to synchronize active tab ID with browser URL query string. |
| `variant` | `'underline' \| 'pill' \| 'boxed'` | `'underline'` | Visual appearance variant (`'underline'`, `'pill'`, `'boxed'`). |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction for tab list and panels (`'horizontal'`, `'vertical'`). |
| `className` | `string` | `''` | Custom CSS class name appended to root wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `UiTabItem`

| Field | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Unique identifier for the tab. |
| `label` | `string` | No | Display label text for the tab button or link. |
| `href` | `string` | Yes | Target URL for navigational mode (used when `contentHtml` is not provided). |
| `badge` | `string \| number` | Yes | Optional count or status pill displayed next to the tab label. |
| `contentHtml` | `string` | Yes | Raw HTML content to render inside the active tab panel (Local Panel mode). |
| `active` | `boolean` | Yes | Whether the tab is initially active (overridden by URL query param if `activeParamName` matches). |
| `disabled` | `boolean` | Yes | Disables tab selection and navigation. |

## Design Tokens (CSS Variables)

- `var(--spm-border)` - Tab bar border line and boxed tab border outline.
- `var(--spm-accent)` - Active tab indicator underline, pill background, and active highlights.
- `var(--spm-accent-fg)` - Text color for active pill tabs.
- `var(--spm-text-primary)` - Active tab label text and active tab panel content color.
- `var(--spm-text-secondary)` - Inactive tab label color.
- `var(--spm-text-muted)` - Badge text color and muted secondary elements.
- `var(--spm-bg-secondary)` - Background color for boxed tab lists.
- `var(--spm-bg-surface)` - Background color for active boxed tab item.
- `var(--spm-bg-tertiary)` - Background color for inactive tab item badges.
- `var(--spm-radius)` - Border radius for boxed container and tab items.

## Veneer Spec (.vnr) Examples

### 1. Navigational Mode (URL Navigation)

```vnr
reconstruct "#subnav-tabs" -> UiTabs {
    variant: "underline";
    orientation: "horizontal";

    child tabs extends UiTabItem {
        selector: "#subnav ul li a";
        bind id: "self | attr:data-tab-id";
        bind label: "self | text";
        bind href: "self | attr:href";
        bind badge: "span.badge | text";
    }
}
```

### 2. Local Panel Mode (Client-Side Tab Switching)

```vnr
reconstruct "#content-sections" -> UiTabs {
    variant: "boxed";
    orientation: "horizontal";
    activeParamName: "tab";

    child tabs extends UiTabItem {
        selector: ".tab-section";
        bind id: "self | attr:id";
        bind label: "h3.tab-title | text";
        bind contentHtml: ".tab-body | html";
    }
}
```

---

### 18. UiTagBadge

## Purpose & Use Cases

`UiTagBadge` renders tag and category pill badges. It displays a category label, post count pill, primary hyperlink (`href`), and optional interactive action buttons for adding (`+` via `addUrl`) or removing (`-` via `removeUrl`) tags in search filter sidebars.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | **Required** | Text label of tag or category. |
| `count` | `string \| number` | `undefined` | Optional post/item count displayed next to tag label. |
| `href` | `string` | `undefined` | Hyperlink URL for tag search navigation. |
| `addUrl` | `string` | `undefined` | Optional URL for `+` action button to append tag to current search. |
| `removeUrl` | `string` | `undefined` | Optional URL for `-` action button to exclude tag from current search. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-tertiary)` - Background color of tag badge pill.
- `var(--spm-border)` - Border color of tag badge pill.
- `var(--spm-text-primary)` - Primary tag label text color.
- `var(--spm-text-muted)` - Item count text color and action button icon color.
- `var(--spm-accent)` - Hover border color and active state indicator.

## Veneer Spec (.vnr) Example

```vnr
child tags extends TagItem -> UiTagBadge {
    selector: "#tag-sidebar li";
    bind label: "a:nth-of-type(1) | text";
    bind count: "span.tag-count | text";
    bind href: "a:nth-of-type(1) | attr:href";
    bind addUrl: "a:nth-of-type(2) | attr:href";
    bind removeUrl: "a:nth-of-type(3) | attr:href";
}
```

---

### 19. UiTerminalConsole

The `UiTerminalConsole` component renders a dark, monospace live terminal output for log streams, system events, audit trails, and debug consoles.

## Props Interface

```typescript
export interface LogEntry {
  id?: string;
  timestamp?: string;
  level?: 'info' | 'warn' | 'error' | 'debug';
  message: string;
}

export interface UiTerminalConsoleProps {
  title?: string;
  logs?: LogEntry[];
  autoScroll?: boolean;
  maxLines?: number;
  filterLevel?: 'all' | 'info' | 'warn' | 'error';
  className?: string;
  style?: React.CSSProperties;
}
```

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#live-logs-container" -> UiTerminalConsole {
  title: "System Audit Console";
  filterLevel: "all";
}
```

## Theme Variables Used
- Dark theme monospace variables (`#090d16`, `#0f172a`, `#1e293b`)
- Level badge colors (`#38bdf8`, `#fbbf24`, `#f87171`)

---

### 20. UiToastContainer

## Purpose & Use Cases

`UiToastContainer` provides global toast feedback notifications and confirmation modal portals for user feedback. It manages animated toast items (`UiToast`) supporting four variant types (`info`, `warning`, `success`, `error`), backdrop blurs, auto-dismissal timers, and portal listening above SPM Shadow DOM overlays.

## Properties (Props API)

### `UiToast` Item Props API

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `message` | `string` | **Required** | Message text rendered inside toast notification. |
| `type` | `'info' \| 'warning' \| 'success' \| 'error'` | `'info'` | Feedback variant type controlling indicator border color (`info` = accent, `success` = green, `warning` = amber, `error` = red). |
| `onClose` | `() => void` | **Required** | Callback function invoked when toast is closed or auto-dismissed. |
| `className` | `string` | `''` | Custom CSS class name appended to toast element. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### `UiToastContainer` Portal Props API

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'bottom-right'` | Screen corner positioning anchor for toast stack. |
| `className` | `string` | `''` | Custom CSS class name appended to container wrapper. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-border)` - Border color of toast card container.
- `var(--spm-radius)` - Border radius for toast item cards.
- `var(--spm-text-primary)` - Toast message body text color.
- `var(--spm-accent)` - Default indicator border color for `info` type toasts.

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#global-toast-portal" -> UiToastContainer {
    urlPattern: ".*";
    position: "bottom-right";
}
```

---

### 21. UiDevDiagnosticPanel

## Purpose & Use Cases

`UiDevDiagnosticPanel` is an isolated developer overlay component designed to monitor runtime modernization health, missing DOM selectors, WebSocket hot-reloading events, and system notifications during extension development mode (`isDev`).

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `items` | `DevDiagnosticItem[]` | `[]` | List of diagnostic events (`id`, `type`, `severity`, `title`, `message`, `details`, `timestamp`, `occurrenceCount`). |
| `onClear` | `() => void` | `undefined` | Callback invoked when the user clicks the "Clear" button. |
| `initialExpanded` | `boolean` | `false` | Initial state of the drawer expansion. |
| `className` | `string` | `''` | Custom CSS class name. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `#09090b` / `#000000` - Main drawer background color.
- `rgba(255, 255, 255, 0.15)` - Border divider color.
- `#ffffff` - Primary text color and active tab indicator.
- `#a1a1aa` - Muted metadata text color.

---

### 22. UiFormContainer

## Purpose & Use Cases

`UiFormContainer` modernizes legacy HTML input forms, search bars, login fields, and comment submission forms into a clean, accessible card container. It encapsulates form inputs, handles form submission events, forwards hidden input fields automatically, and styles submit buttons using SPM design tokens.

## Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `undefined` | Header title text above the form. |
| `description` | `string` | `undefined` | Subtitle description text. |
| `submitUrl` | `string` | `undefined` | Target URL for form submission. |
| `method` | `'GET' \| 'POST'` | `'POST'` | Form HTTP submission method. |
| `fields` | `FormField[]` | `[]` | Form field configurations (`name`, `label`, `type`, `defaultValue`, `placeholder`, `required`). |
| `submitLabel` | `string` | `'Submit'` | Text label for the submission button. |
| `hiddenFields` | `Record<string, string>` | `{}` | Key-value map of hidden form fields to forward upon submission. |
| `className` | `string` | `''` | Custom CSS class name. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

- `var(--spm-bg-secondary)` - Card background color.
- `var(--spm-border)` - Card border color.
- `var(--spm-text-primary)` - Form title and label text color.
- `var(--spm-accent)` - Submit button background and focus ring color.

---

### Layout Primitives

## Purpose & Use Cases

Layout Primitives are foundational, lightweight React structural components (`UiBox`, `UiFlexRow`, `UiFlexColumn`, `UiGrid`, `UiText`, `UiImage`, `UiLink`, `UiScrollBox`) defined in `primitives/LayoutPrimitives.tsx`. They provide generic HTML layout primitives for constructing custom UI views without hardcoding visual styles or visual overrides.

## Component Overview

| Primitive | Underlying HTML Element | Key Props | Description |
| :--- | :--- | :--- | :--- |
| `UiBox` | `<div>` | `className`, `children` | Generic container block wrapper for borders, padding, and layout bounds. |
| `UiFlexRow` | `<div>` (flex row) | `className`, `children` | Horizontal Flexbox row container (`flex flex-row`). |
| `UiFlexColumn` | `<div>` (flex col) | `className`, `children` | Vertical Flexbox column container (`flex flex-col`). |
| `UiGrid` | `<div>` (grid layout) | `className`, `children` | CSS Grid container (`grid`). |
| `UiText` | `<span>` | `className`, `content` | Inline text span for rendering dynamic text content. |
| `UiImage` | `<img>` | `className`, `src`, `alt` | Standard image element for rendering responsive media. |
| `UiLink` | `<a>` | `className`, `href`, `children` | Standard hyperlink element for navigation links. |
| `UiScrollBox` | `<div>` (scrollable) | `height`, `maxHeight`, `overflow` | Scrollable container box with explicit overflow and height controls. |

## Properties (Props API)

### `PrimitiveProps` (`UiBox`, `UiFlexRow`, `UiFlexColumn`, `UiGrid`)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `className` | `string` | `undefined` | CSS class string appended to root container. |
| `children` | `React.ReactNode` | `undefined` | Nested child components or elements. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | - | Standard HTML `div` attributes forwarded to element. |

### `UiText` (`TextProps`)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `content` | `string` | `undefined` | Dynamic text content string rendered inside `<span>`. |
| `className` | `string` | `undefined` | Custom CSS class string. |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | - | Standard HTML `span` attributes forwarded to element. |

### `UiImage` (`ImageProps`)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | `undefined` | Source URL of image. |
| `alt` | `string` | `undefined` | Alternative text description for image. |
| `className` | `string` | `undefined` | Custom CSS class string. |
| `...props` | `ImgHTMLAttributes<HTMLImageElement>` | - | Standard HTML `img` attributes forwarded to element. |

### `UiLink` (`LinkProps`)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `href` | `string` | `undefined` | Target destination hyperlink URL. |
| `className` | `string` | `undefined` | Custom CSS class string. |
| `children` | `React.ReactNode` | `undefined` | Link label or child elements. |
| `...props` | `AnchorHTMLAttributes<HTMLAnchorElement>` | - | Standard HTML `a` attributes forwarded to element. |

### `UiScrollBox` (`ScrollBoxProps`)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `height` | `string` | `undefined` | Explicit container height (e.g. `'300px'`, `'100%'`). |
| `maxHeight` | `string` | `undefined` | Container maximum height constraint. |
| `overflow` | `'auto' \| 'scroll' \| 'hidden' \| 'visible'` | `'auto'` | CSS overflow behavior. |
| `overflowX` | `'auto' \| 'scroll' \| 'hidden' \| 'visible'` | `undefined` | Horizontal overflow behavior. |
| `overflowY` | `'auto' \| 'scroll' \| 'hidden' \| 'visible'` | `undefined` | Vertical overflow behavior. |
| `className` | `string` | `''` | Custom CSS class string. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

## Design Tokens (CSS Variables)

Layout Primitives are unstyled structural components. They accept styling via `className` and `style` properties, seamlessly inheriting SPM theme design tokens:
- `var(--spm-bg-primary)`, `var(--spm-bg-secondary)`, `var(--spm-bg-tertiary)`
- `var(--spm-text-primary)`, `var(--spm-text-secondary)`, `var(--spm-text-muted)`
- `var(--spm-border)`, `var(--spm-radius)`, `var(--spm-accent)`

## Veneer Spec (.vnr) Example

```vnr
reconstruct "#custom-panel" -> UiFlexColumn {
    className: "my-custom-panel";
    
    child header -> UiFlexRow {
        className: "panel-header";
        child title -> UiText {
            content: "Panel Title";
        }
    }

    child image -> UiImage {
        bind src: "img | attr:src";
        bind alt: "img | attr:alt";
    }

    child link -> UiLink {
        bind href: "a | attr:href";
        child text -> UiText {
            content: "View Details";
        }
    }
}
```
