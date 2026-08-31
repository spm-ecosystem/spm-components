# `UiFormContainer` Component Specification

- **Component Name**: `UiFormContainer`
- **Category**: Dedicated Layout Component
- **Source File**: `src/components/dedicated/UiFormContainer.tsx`
- **Registry Key**: `UiFormContainer`

---

## 1. Overview & Purpose

`UiFormContainer` is a dedicated layout component used to modernize legacy HTML input forms, search bars, login fields, and comment submission forms into a clean, accessible card container.

It encapsulates form inputs, handles form submission events, forwards hidden input fields automatically, and styles submit buttons using SPM design tokens.

---

## 2. Properties (Props API)

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

---

## 3. Veneer Spec (.vnr) Example

```vnr
reconstruct "form#login-form" -> UiFormContainer {
    title: "Account Login";
    description: "Enter your credentials to continue.";
    submitUrl: "/login.php";
    method: "POST";
    submitLabel: "Log In";

    bind hiddenFields: "form | hiddenInputs";
}
```
