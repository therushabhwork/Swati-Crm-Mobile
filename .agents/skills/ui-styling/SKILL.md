---
name: ui-styling
description: Primary skill for application UI implementation and styling rules.
---

# UI Styling

Use for application UI implementation.

## Authority

When rules conflict, use:

1. project requirements
2. existing components/tokens
3. `design-system`
4. task-specific UX guidance
5. `ui-styling`
6. general design recommendations

## Rules

- Preserve the existing project's visual language.
- Reuse existing components and tokens before creating new ones.
- Use consistent spacing, typography, color, radius and elevation.
- Build responsive layouts.
- Implement loading, empty, error and disabled states where applicable.
- Interactive elements must have appropriate touch targets and accessibility labels.
- Avoid unnecessary dependencies.
- Prefer platform-native React Native behavior.
- Do not redesign existing UI unless requested.

## References

Load only when needed:
- `references/accessibility.md`
- `references/responsive.md`
- `references/forms.md`
- `references/lists.md`
- `references/animation.md`
- `references/shadcn-components.md`
- `references/shadcn-theming.md`
- `references/shadcn-accessibility.md`
- `references/tailwind-utilities.md`
- `references/tailwind-responsive.md`
- `references/tailwind-customization.md`
- `references/canvas-design-system.md`
- `references/ui-styling-examples.md`
