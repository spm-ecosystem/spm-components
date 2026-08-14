# UiSplitLayout

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
