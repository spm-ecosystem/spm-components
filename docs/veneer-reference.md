# Veneer Spec Language Reference Manual

The Veneer Spec (`.vnr`) configuration language is a custom declarative Domain Specific Language (DSL) built for the Site Package Manager (SPM) compiler. 

---

## 1. Introduction & Rationale

Traditionally, layout overrides and DOM modernization mappings in SPM were written directly as raw JSON files (`manifest.json`). However, as configuration complexity scales (with hundreds of properties, nested loops, data scraping selectors, and layout variables), writing raw JSON becomes extremely verbose, difficult to validate at write-time, and error-prone due to character escaping.

Veneer Spec solves these issues by providing:
1. **Strong Typing and Semantic Syntax**: Structural keywords instead of generic JSON key-value pairs.
2. **Object-Oriented Blue-printing (`class` / `extends`)**: Allows creating base layouts and inheriting selectors/bindings, removing duplication (DRY configuration).
3. **Raw String Literal Blocks**: Bypasses backslash escaping for regexes and pure JSON lists/tables.
4. **Static Validation and Compiler Diagnostics**: Resolves inheritance paths, detects circular dependencies, checks type compatibility, and reports exact syntax error lines before compiling.

---

## 2. Core Concepts & Mental Model

### The Layout Override Paradigm
SPM works by intercepting the legacy site's HTML, hiding targeted sections, and injecting modern React views. The Veneer DSL defines **what** parts of the page to target, **which** React component to mount, and **how** to extract unstructured data from the legacy DOM to populate the React component's props.

### Scraping Mappings & Bindings
A key concept of the Veneer Spec is the declarative binding of HTML nodes to component props using the extraction syntax:

$$\text{Selector} \quad | \quad \text{BaseExtractor} \quad [ \ | \ \text{Pipe} \ ]^*$$

The Veneer engine evaluates this query at runtime against the page structure, scraping text content, attributes, or raw HTML, and then running any subsequent pipeline operations sequentially.

#### 1. Base Extractors
* `text` - Extracts the `textContent` of the matched element.
* `html` - Extracts the `innerHTML` of the matched element.
* `attr:<name>` - Extracts the specified attribute value (e.g. `attr:src`, `attr:href`).
* `hrefOrOnclick` - Automatically resolves link destination from `href` or fallback inline `onclick` assignment.
* `nextSiblingText` - Extracts the text content of the immediate next sibling element.
* `hiddenInputs` - Collects all `<input type="hidden">` tags within the element as a JSON array string.
* `selector` - Generates a unique selector string for the element.

#### 2. Pipe Operations (Sequential Processing)
Pipes can be chained together sequentially using the `|` character.
* `split` - Splits a space-separated text string into a JSON stringified array of tokens (e.g. `"tag1 tag2"` -> `["tag1", "tag2"]`).
* `split:<delimiter>` - Splits a string by a custom delimiter and trims each token (e.g. `split:,` turns `"tag1, tag2"` -> `["tag1", "tag2"]`).
* `number` - Converts a valid number string directly into a JSON numeric value.
* `cleanNumber` - Strips currency symbols (`$`, `R$`, `€`), commas, and spacing, parsing multipliers (`k`, `m`) and numeric values into a JSON float number (e.g. `"$ 1,200.50"` -> `1200.5`, `"2.4k"` -> `2400`).

---

## 3. Keyword-by-Keyword Reference

### `theme`
The `theme` block defines the metadata, visual design tokens (CSS custom properties), and raw CSS stylesheet modifications injected into the global document scope.

* **Role**: Groups styling tokens and global page overrides under a single visual label.
* **Rules**:
  * Only one `theme` block is allowed per compiled project.
  * Variables are defined inside the `variables` sub-block and compile to the manifest's `"cssVariables"`.
  * Custom stylesheet rules are defined under `customStyles: "<raw-css>";`.
* **Syntax**:
  ```scss
  theme "ModernDark" {
      variables {
          --spm-accent: "#7c6af5";
          --spm-bg-primary: "#000000";
      }
      customStyles: "#advertisement-banner { display: none !important; }";
  }
  ```
* **Compiled Output**:
  ```json
  "theme": {
    "label": "ModernDark",
    "cssVariables": {
      "--spm-accent": "#7c6af5",
      "--spm-bg-primary": "#000000"
    },
    "customStyles": "#advertisement-banner { display: none !important; }"
  }
  ```

---

### `class` & `extends`
Classes act as blueprints defining reusable data extraction fields, bind patterns, and scope configurations.

* **Role**: Simplifies declaring repetitive structures (such as image cards, table rows, comment replies, or navigation links) by letting subclasses and child blocks inherit and override properties.
* **Rules**:
  * Classes are resolved at compile-time by `spm-cli` and are completely omitted from the final `manifest.json` output (zero runtime cost).
  * A class can inherit properties from a parent class using the `extends` keyword: `class SubClass extends ParentClass`.
  * **Scope Inheritance Semantics**:
    * The `scope` directive defined in the parent class is automatically inherited by any extending class or child block.
    * An extending class or child block can override the inherited `scope` by explicitly declaring a new `scope` directive.
    * If no scope is specified anywhere in the inheritance hierarchy, `scope` defaults to `"container"`.
  * **Bind Override Precedence**:
    * If a `bind` rule is defined in both the parent class and the child/subclass for the same property, the child's `bind` rule takes precedence and overrides the parent.
    * Subclasses and child blocks can freely introduce extra `bind` declarations not present in the parent class.
* **Syntax**:
  ```scss
  class LinkBase {
      scope: "container";
      bind label: "self | text";
      bind url: "self | attr:href";
  }

  class DocumentLink extends LinkBase {
      scope: "document"; // Overrides LinkBase scope
  }
  ```

---

### `selector`
A `selector` block targets an individual legacy element in the DOM to replace it with an isolated React component, hide it entirely, or wrap it within a container component.

* **Role**: Alters targeted, individual legacy elements (like headers, sidebars, ads, or search bars) without replacing the whole page grid.
* **Actions**:
  * `action: replace;` — Hides the element and mounts the specified React component in its place.
  * `action: hide;` — Sets `display: none !important` on the selector to remove it visually.
  * `action: wrap;` — Encapsulates the legacy element inside a React component wrapper.
* **Conflict Resolution & Idempotency**:
  * **Idempotent Hide**: Hiding a missing element is a safe no-op.
  * **Precedence (`replace > hide`)**: When multiple `selector` blocks target the same DOM element, `replace` takes precedence over `hide`.
* **Syntax**:
  ```scss
  selector "#sub-navbar" {
      action: hide;
  }

  selector "#search-input" -> UiSearchBar {
      action: replace;
      placeholder: "Search…";
      submitUrl: "https://example.com/search";
      bind defaultValue: "input[name='q'] | attr:value";
  }

  selector "#legacy-data-table" -> UiBox {
      action: wrap;
      className: "spm-wrapped-table";
  }
  ```
* **Compiled Output**:
  ```json
  "components": [
    {
      "selector": "#sub-navbar",
      "action": "hide"
    },
    {
      "selector": "#search-input",
      "name": "UiSearchBar",
      "action": "replace",
      "props": {
        "placeholder": "Search…",
        "submitUrl": "https://example.com/search"
      },
      "propsMap": {
        "defaultValue": "input[name='q'] | attr:value"
      }
    },
    {
      "selector": "#legacy-data-table",
      "name": "UiBox",
      "action": "wrap",
      "props": {
        "className": "spm-wrapped-table"
      }
    }
  ]
  ```

---

### `reconstruct`
The `reconstruct` block is the core building block of full-section and page modernizations.

* **Role**: Injects a React layout component into the targeted container selector via an isolated Shadow DOM root.
* **Syntax**:
  ```scss
  reconstruct "#page-container" -> UiModernGridPage {
      urlPattern: "page=gallery";
      pageTitle: "Gallery Feed";
      mobileColumns: 2;

      bind searchDefaultValue: ".sidebar input[name='q'] | attr:value";

      preserve {
          sidebarSlot: "#legacy-sidebar";
      }

      child items -> UiImageCard {
          selector: "#gallery-grid .item";
          bind imageUrl: "img | attr:src";
          bind linkUrl: "a | attr:href";
          bind title: "img | attr:title";
          bind id: "self | attr:id";
      }
  }
  ```
* **Compiled Output**:
  ```json
  "reconstructs": [
    {
      "containerSelector": "#page-container",
      "layoutComponent": "UiModernGridPage",
      "urlPattern": "page=gallery",
      "props": {
        "pageTitle": "Gallery Feed",
        "mobileColumns": 2
      },
      "propsMap": {
        "searchDefaultValue": ".sidebar input[name='q'] | attr:value"
      },
      "preserve": {
        "sidebarSlot": "#legacy-sidebar"
      },
      "children": [
        {
          "name": "items",
          "selector": "#gallery-grid .item",
          "propsMap": {
            "imageUrl": "img | attr:src",
            "linkUrl": "a | attr:href",
            "title": "img | attr:title",
            "id": "self | attr:id"
          }
        }
      ]
    }
  ]
  ```

---

### `child`
Defines a nested data array scraped from matching legacy elements inside the page.

* **Role**: Generates an array of objects passed as a prop to the parent layout component.

#### Child Block with Class Inheritance (`child ... extends ClassName`)
A `child` block can inherit structure from a `class` blueprint using the `extends` keyword:

* **Scope Inheritance**: The `scope` directive defined in the parent class is inherited by the child. The child can redefine `scope` to override the parent's value.
* **Bind Override Precedence**: If a `bind` rule is defined in both the parent class and the child block for the same property, the child's `bind` rule takes precedence and overrides the parent.
* **Extra Bind Declarations**: You can seamlessly mix inherited bindings with extra `bind` declarations directly in the child block for context-specific extractions.

```scss
class ItemBase {
    scope: "container";
    bind id: "self | attr:id";
    bind title: "h4 | text";
    bind url: "a | attr:href";
}

reconstruct "#feed" -> UiModernGridPage {
    child items extends ItemBase {
        selector: ".post-card";
        scope: "document"; // Overrides ItemBase scope
        bind thumbnail: "img | attr:src"; // Extra binding specific to this child
        bind title: ".custom-title | text"; // Overrides ItemBase title binding
    }
}
```

---

### `bind`
Maps a property on the React component to a dynamic extraction query evaluated live against the legacy DOM at runtime.

* **Syntax**:
  ```scss
  bind propName: "<css-selector> | <extractor> | <pipe>";
  ```

---

### `preserve`
Prevents specific interactive elements (like a legacy comment form, search widget, or complex sidebar) from being destroyed when the container is reconstructed, and reparents them inside designated layout slot containers.

* **Syntax Variants**:
  1. **Scalar Form**: Used when mapping a single unnamed slot or extracting multiple hidden inputs.
     ```scss
     reconstruct "#form-view" -> UiFormLayout {
         preserve: "form | hiddenInputs";
     }
     ```
     *Compiled Output*:
     ```json
     "preserve": "form | hiddenInputs"
     ```

  2. **Dictionary Form**: Used when mapping multiple named slots to specific selectors.
     ```scss
     reconstruct "#item-view" -> UiItemDetailsPage {
         preserve {
             sidebarSlot: ".sidebar";
             commentForm: "#reply-form";
         }
     }
     ```
     *Compiled Output*:
     ```json
     "preserve": {
       "sidebarSlot": ".sidebar",
       "commentForm": "#reply-form"
     }
     ```

* **Fallback Behavior**:
  If a targeted preserve slot is missing from the live DOM, it gracefully resolves to `null` and logs a development warning (`[SPM Runtime] Preserved slot "${slotName}" selector "${selector}" matched no DOM elements.`).

---

### `scope`
Configures the boundary limits of CSS selector scraping queries.

* **Role**: Tells the runtime engine whether it should search for elements only within the container element's boundary (`scope: "container"`), search the entire page (`scope: "document"`), or within a specific custom DOM ancestor matching a CSS selector.
* **Supported Values**:
  1. `"container"` (Default): Selectors inside child nodes only query descendants of the parent reconstruct container. Omitted from compiled JSON output.
  2. `"document"`: Queries the entire document root. Useful for items like global pagination elements or secondary search bars located outside the main layout container.
  3. Custom CSS Selector String (e.g. `scope: ".result-row";`, `scope: "#sidebar";`): The engine queries elements relative to the first matching ancestor or globally matched element corresponding to that selector, rather than the reconstruct container.
* **Syntax**:
  ```scss
  reconstruct "#results" -> UiTableListPage {
      child pageLinks {
          scope: "document";
          selector: "#paginator .pagination a";
          bind label: "self | text";
          bind url: "self | attr:href";
      }

      child rows {
          scope: ".result-row";
          selector: ".item";
          bind title: "h3 | text";
      }
  }
  ```
* **Compiled Output**:
  ```json
  "children": [
    {
      "name": "pageLinks",
      "scope": "document",
      "selector": "#paginator .pagination a",
      "propsMap": {
        "label": "self | text",
        "url": "self | attr:href"
      }
    },
    {
      "name": "rows",
      "scope": ".result-row",
      "selector": ".item",
      "propsMap": {
        "title": "h3 | text"
      }
    }
  ]
  ```

---

### `media`
Defines responsive breakpoints or media-query specific property overrides within layout reconstructs.

* **Syntax**:
  ```scss
  reconstruct "#gallery" -> UiModernGridPage {
      media "(max-width: 768px)" {
          mobileColumns: 1;
      }
  }
  ```
