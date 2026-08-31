# UiCommentListPage

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
