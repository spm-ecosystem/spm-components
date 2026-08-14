# UiSearchBar

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
