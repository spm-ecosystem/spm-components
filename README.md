# spm-components

The official shared React UI component library for the Site Package Manager (SPM) ecosystem.

---

## What is spm-components?
`spm-components` is the shared layout library that holds the user interface elements used to reconstruct legacy web interfaces. The components are written in React and styled with vanilla CSS custom properties matching the visual design tokens of active themes.

---

## Component Architecture

The library is organized into two primary categories:

1.  **Primitives (`primitives/`)**:
    Base modular layout components and helper blocks (such as primitive grids, flex slots, container wrappers, indicators, or loading state skeletons).
2.  **Dedicated Components (`dedicated/`)**:
    Specific functional layouts designed to replace key sections of legacy pages (such as header navigation bars `UiNavHeader`, search utilities `UiSearchBar`, or catalog boards `UiGridPage`).

---

## Development & Extension Integration

This repository is linked as a Git submodule under `src/components/` in the main `extension` repository.

### Component Design Rules
When building or extending components in this library:
- **CSS Variables**: Never use hardcoded colors. Always style items using custom property tokens (e.g. `var(--spm-bg-primary)`, `var(--spm-text-primary)`).
- **Props Flexibility**: Always include `className` and `style` in prop interfaces and spread them onto the root elements.
- **Conditional Rendering**: Keep rendering checks conditional on data presence to avoid orphan markup or visual gaps when scraping rules fail.
- **Auto-Registration**: After adding a component, run `npm run build-registry` in the extension repository to parse the props interface and rebuild the manifest schema registry.

---

## License

This project is licensed under the MIT License - see the [LICENSE](file:///home/watashi/Projects/spm-components/LICENSE) file for details.
