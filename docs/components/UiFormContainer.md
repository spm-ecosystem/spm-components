# `UiFormContainer` Component Specification

- **Component Name**: `UiFormContainer`
- **Category**: Dedicated Layout Component
- **Source File**: `src/components/dedicated/UiFormContainer.tsx`
- **Registry Key**: `UiFormContainer`

---

## 1. Overview & Purpose

`UiFormContainer` is a dedicated layout component used to modernize legacy HTML input forms, search bars, authentication forms, and submission forms into a clean, accessible card container.

It encapsulates form inputs, handles form submission events, forwards hidden input fields automatically, styles submit buttons using SPM design tokens, and supports multi-tab form switching (e.g. Login / Register mode toggling).

---

## 2. Properties (Props API)

| Prop Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `undefined` | Header title text above the form. |
| `subTitle` | `string` | `undefined` | Subtitle description text. |
| `actionUrl` | `string` | `''` | Target URL for form submission. |
| `method` | `string` | `'POST'` | Form HTTP submission method (`GET`, `POST`). |
| `fields` | `FormField[]` | `[]` | Form field configurations (`id`, `label`, `type`, `defaultValue`, `placeholder`, `required`, `options`). |
| `submitLabel` | `string` | `'Submit'` | Text label for the submission button. |
| `hiddenInputs` | `Record<string, string>` | `{}` | Key-value map of hidden form fields to forward upon submission. |
| `tabs` | `FormTab[]` | `[]` | Multi-tab form configuration array (`id`, `label`, `title`, `subTitle`, `submitLabel`, `actionUrl`, `method`, `fields`, `hiddenInputs`). |
| `activeTabId` | `string` | `undefined` | Initial active tab ID when `tabs` is provided. |
| `className` | `string` | `''` | Custom CSS class name. |
| `style` | `React.CSSProperties` | `{}` | Custom inline style overrides. |

### Interface: `FormTab`
```typescript
export interface FormTab {
  id: string;
  label: string;
  title?: string;
  subTitle?: string;
  submitLabel?: string;
  actionUrl?: string;
  method?: string;
  fields?: FormField[];
  hiddenInputs?: Record<string, string>;
}
```

---

## 3. Veneer Spec (.vnr) Example

### Single Form Mode
```vnr
reconstruct "form#login-form" -> UiFormContainer {
    title: "Account Login";
    subTitle: "Enter your credentials to continue.";
    actionUrl: "/login.php";
    method: "post";
    submitLabel: "Log In";
}
```

### Multi-Tab Auth Mode (Login / Register Toggle)
```vnr
reconstruct "div.auth-container" -> UiFormContainer {
    activeTabId: "login";

    tabs: [
        {
            id: "login",
            label: "Login",
            title: "Access Account",
            subTitle: "Welcome back!",
            actionUrl: "/login",
            submitLabel: "Log In"
        },
        {
            id: "register",
            label: "Create Account",
            title: "Join Us",
            subTitle: "Create your new account today.",
            actionUrl: "/register",
            submitLabel: "Register"
        }
    ];
}
```
