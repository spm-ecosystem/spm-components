# Site Package Manager (SPM) - Theme Manifest Schema

The `manifest.json` file is the compiled output configuration generated from Veneer Spec (`.vnr`) sources. It is evaluated at runtime by the SPM content script to reconstruct legacy HTML elements or layout sections with React components inside isolated Shadow DOM trees.

---

## Root Fields

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `targetUrl` | `string` | Yes | Matching URL glob pattern indicating which domains this theme should activate on (e.g. `*://example.com/*`). |
| `version` | `string` | No | Version of the theme package (e.g. `"1.0.0"`). |
| `minEngineVersion` | `string` | No | Minimum compatible version of the SPM extension engine (e.g. `"1.0.0"`). |
| `theme` | `object` | Yes | Defines global styling variables, custom styles overrides, and descriptive metadata. |
| `components` | `array` | No | List of selector overrides that target, hide, replace, or wrap individual legacy DOM elements. |
| `reconstructs` | `array` | No | List of page-level section replacements that mount React layout components inside isolated Shadow DOM hosts. |

---

## 1. Theme Configuration

Defines styling variables (custom property mappings) and custom CSS rules injected globally.

```json
"theme": {
  "label": "Obsidian",
  "author": "spm-ecosystem",
  "description": "Auto-versioning Obsidian dark theme on pipeline",
  "cssVariables": {
    "--spm-bg-primary": "#000000",
    "--spm-bg-secondary": "#111111",
    "--spm-bg-tertiary": "#222222",
    "--spm-text-primary": "#ffffff",
    "--spm-text-muted": "#a1a1aa",
    "--spm-accent": "#7c6af5",
    "--spm-accent-fg": "#ffffff",
    "--spm-accent-hover": "#9d8fff",
    "--spm-border": "#333333",
    "--spm-radius": "10px"
  },
  "customStyles": "#notice, #long-notice { display: none !important; }",
  "noticeSelector": "#has-mail-notice"
}
```

### Properties
* `label` (string): Human-readable name of the theme shown in the extension popup.
* `author` (string): Developer signature.
* `description` (string): Short explanation of theme styling goals.
* `cssVariables` (object): Map of custom CSS property names to valid CSS color, spacing, or sizing values. Components should exclusively rely on these variables.
* `customStyles` (string): Raw CSS stylesheet injected globally into the main document to hide ads, banners, or apply global page layout overrides.
* `noticeSelector` (string): Optional selector targeting notices that should trigger extension banner overlays.

---

## 2. Components Configuration

The `components` array configures individual element-level modifications without reconstructing entire page sections. Each entry targets a legacy DOM selector and performs an action (`replace`, `hide`, or `wrap`).

```json
"components": [
  {
    "name": "UiSearchBar",
    "selector": ".sidebar form",
    "action": "replace",
    "props": {
      "placeholder": "Search…",
      "submitUrl": "https://example.com/search",
      "queryParamName": "q"
    },
    "propsMap": {
      "defaultValue": "input[name='q'] | attr:value"
    }
  },
  {
    "selector": "#subnavbar, #advertisement",
    "action": "hide"
  },
  {
    "name": "UiBox",
    "selector": "#legacy-table-wrapper",
    "action": "wrap",
    "props": {
      "className": "spm-wrapped-container"
    }
  }
]
```

### Properties
* `selector` (string, required): Standard CSS selector targeting the legacy DOM element(s).
* `action` (string, required): Action to perform on the matched element. Formally supported enum values:
  * `"replace"`: Hides the targeted legacy DOM element and mounts the specified React component in its place inside an isolated host container. Requires the `name` property.
  * `"hide"`: Sets `display: none !important` on the targeted selector to remove it visually from the page. Does not mount a React component. The `name` property is omitted.
  * `"wrap"`: Encapsulates the targeted legacy DOM element inside a React container component wrapper, preserving the original element as child content inside the component host. Requires the `name` property.
* `name` (string, required when `action` is `"replace"` or `"wrap"`; omitted for `"hide"`): React component name matching an entry in the React component registry.
* `props` (object, optional): Static prop values passed directly to the mounted React component.
* `propsMap` (object, optional): Dynamic prop mappings extracted live from the DOM at injection time (see *Prop Mapping Rules* below).

### Selector Action Rules & Precedence
1. **Idempotent Hide**: The `"hide"` action is strictly idempotent. If the targeted selector is absent or already hidden, the engine performs a safe no-op without emitting runtime errors.
2. **Conflict Resolution (`replace > hide`)**: When multiple selector configurations target the same DOM element, the `"replace"` action takes strict precedence over `"hide"`. If both a `replace` and a `hide` rule match the same element, the component is mounted in place of the element.
3. **Wrap Action Semantics**: When `"wrap"` is specified, the legacy DOM element is retained and reparented inside the React component's DOM container node rather than removed or hidden.

---

## 3. Reconstructs Configuration

Reconstructs entire sections or full page contents with isolated React structures in the Shadow DOM.

```json
"reconstructs": [
  {
    "containerSelector": "#gallery",
    "layoutComponent": "UiModernGridPage",
    "urlPattern": "page=gallery",
    "props": {
      "pageTitle": "Gallery",
      "mobileColumns": 2,
      "mobileGap": "8px"
    },
    "propsMap": {
      "searchDefaultValue": ".sidebar form input[name='q'] | attr:value"
    },
    "preserve": {
      "sidebarSlot": ".sidebar"
    },
    "infiniteScroll": {
      "nextSelector": "div.pagination a.next",
      "itemsSelector": "#post-list .thumb",
      "targetProp": "items"
    },
    "children": [
      {
        "name": "items",
        "selector": "#gallery .item",
        "propsMap": {
          "id": "self | attr:id",
          "imageUrl": "img | attr:src",
          "linkUrl": "a | attr:href",
          "title": "img | attr:title"
        }
      }
    ]
  }
]
```

### Properties
* `containerSelector` (string, required): CSS selector of the container element that will be replaced. The element will have its children hidden, and a Shadow DOM root host appended.
* `layoutComponent` (string, required): Name of the React component that acts as the container layout.
* `urlPattern` (string): JavaScript regular expression matched against the current page URL path/query (e.g. `page=gallery`). The reconstruct will only load if the pattern matches.
* `props` (object): Static prop values passed directly to the layout component.
* `propsMap` (object): Dynamic properties extracted from the container element's DOM before it is hidden.
* `preserve` (string | object): Defines elements to preserve and re-mount into layout slots (see *Preserve Syntax Variants* below).
* `infiniteScroll` (object, optional): Configuration for automated infinite scroll pagination.
  * `nextSelector`: CSS selector targeting the next page anchor element (`<a>`).
  * `itemsSelector`: CSS selector targeting child items to append from newly fetched pages.
  * `targetProp`: Name of the items array prop on the layout component to append new items into.
* `children` (array): Array of nested data extractions. Each child queries matching elements and generates an array of objects passed as a prop array to the layout component.
  * `name`: Prop array name on the React component.
  * `selector`: CSS selector targeting matching children.
  * `scope`: (Optional) `"container"` (default), `"document"`, or custom CSS selector string (e.g. `".result-row"`).
  * `propsMap`: Data extraction rules for child item fields.
  * `children`: Recursive nested child array definitions for complex layouts (e.g. threads containing comments).

---

## 4. `preserve` Configuration & Syntax Variants

The `preserve` property retains specific interactive legacy elements (such as comment submission forms, reCAPTCHA widgets, or native search sidebars) before the reconstruct container's children are hidden, and reparents them inside designated slot containers within the Shadow DOM (elements with `id="{slotName}-container"`).

### Syntax Variants

1. **Scalar String Form** (`preserve: "selector"`):
   Used when targeting a single unnamed element or extracting hidden input nodes directly into layout props.
   ```json
   "preserve": "form[name='search'] | hiddenInputs"
   ```
   Or targeting a single legacy container:
   ```json
   "preserve": "#native-login-box"
   ```

2. **Dictionary Object Form** (`preserve: { "slotName": "selector" }`):
   Used when mapping multiple named layout slots to specific legacy DOM elements.
   ```json
   "preserve": {
     "sidebarSlot": "#legacy-sidebar",
     "commentForm": "#post-comment-form",
     "loginModal": "#auth-modal"
   }
   ```

### Fallback Behavior
If a targeted legacy DOM selector in a `preserve` configuration does not match any element on the live page:
* The runtime engine gracefully resolves the slot to `null` (rendering an empty slot container without throwing an exception or crashing the React tree).
* In development/debug mode, a descriptive console warning is emitted:
  ```
  [SPM Runtime] Preserved slot "${slotName}" selector "${selector}" matched no DOM elements.
  ```

---

## 5. Prop Mapping Rules

Dynamic extractions extract content from matching DOM nodes and bind it to props. Extractions follow the format:

$$\text{Selector} \quad | \quad \text{Extractor} \quad [ \ | \ \text{Pipe} \ ]^*$$

| Rule Syntax | Targeted Element | Result |
| :--- | :--- | :--- |
| `<css-selector> \| text` | First matching descendant | Text content (`textContent`) of the node. |
| `<css-selector> \| html` | First matching descendant | Inner HTML (`innerHTML`) of the node. |
| `<css-selector> \| attr:<name>` | First matching descendant | Value of the specified attribute (e.g. `attr:src` for images). |
| `self \| text` | Targeted element itself | Text content of the targeted element itself. |
| `self \| html` | Targeted element itself | Inner HTML of the targeted element itself. |
| `self \| attr:<name>` | Targeted element itself | Value of the specified attribute of the targeted element itself. |
| `self \| hrefOrOnclick` | Targeted element itself | Resolves `href` value, or extracts navigation destination from an inline `onclick` handler if `href` is empty. |
| `<css-selector> \| nextSiblingText` | Matching descendant | Extracts text content from the sibling node immediately following the matched element. |
| `<css-selector> \| hiddenInputs` | Matching descendant / form | Serializes all `<input type="hidden">` descendants into a JSON array string. |
| `<extractor> \| split` | Extracted string | Splits a space-separated string into an array of string tokens. |
| `<extractor> \| split:<delim>` | Extracted string | Splits a string by the specified delimiter into an array of trimmed tokens. |
| `<extractor> \| number` | Extracted string | Parses a numeric string into a JSON number. |
| `<extractor> \| cleanNumber` | Extracted string | Strips currency symbols and formatting, parsing metric multipliers (`k`, `m`) and numeric values into a float. |

---

## 6. Metadata Merging

During compilation via `spm compile`, the CLI automatically parses any preexisting target `manifest.json` file. It performs a **deep merge** on the `"theme"` block:
- Global properties like `author`, `description`, `targetUrl`, and `minEngineVersion` present in the destination JSON file are **preserved** and merged back into the compilation output.
- This ensures GitOps metadata is maintained across compilations without manual restoration.
