---
name: design-system-avada-accountant
description: >
  Apply the Avada Accountant design system when building or updating UI.
  Use when creating components, choosing colors or typography,
  or reviewing designs for marketing interfaces.
---

# Avada Accountant — Design System Skill

## When to Use

- Building new UI components for Avada Accountant.
- Reviewing or updating existing component styles.
- Choosing colors, typography, or spacing for marketing pages.
- Checking designs against the extracted token set.

## Context

- **Product:** Avada Accountant — https://avada.website/accountant/
- **Surface:** marketing
- **Audience:** Business decision-makers and potential customers
- **Character:** Conversion-focused marketing presence with a rich, diverse color palette and 6 typefaces.

## Tokens

### Colors

| Token | Value | Role |
|-------|-------|------|
| color-12 | `#E3E3E3` | Surface |
| color-13 | `#E0ECF0` | Surface |
| color-1 | `#023A51` | Text Primary |
| color-2 | `#33475B` | Text Primary |
| color-3 | `#4A5259` | Text Primary |
| color-5 | `#59667D` | Text Primary |
| color-8 | `#93999F` | Text Secondary |
| color-4 | `#3B5998` | Accent |
| color-6 | `#CD201F` | Accent |
| color-7 | `#3F729B` | Accent |
| color-9 | `#2CBC63` | Accent |
| color-11 | `#DDDDDD` | Border |
| color-14 | `#E8EBEF` | Border |
| color-10 | `#65BC7B` | Background Dark |
| color-15 | `#FFFFFF` | Text Light |

### Typography

**Font stack:** Manrope, Open Sans, Arial, awb-icons, Accountant-Pro, Times New Roman

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 12px | Captions, metadata |
| text-sm | 15px | Labels, secondary text |
| text-base | 17px | Body text (default) |
| text-lg | 20px | Subheadings, emphasis |
| text-xl | 24px | Section headings |
| text-2xl | 26px | Section headings |
| text-3xl | 32px | Section headings |
| text-4xl | 36px | Section headings |
| text-9 | 48px | General use |
| text-10 | 60px | General use |

**Weight scale:** 400 · 600 · 700
**Line heights:** 69.6px · 57.6px · 34.08px · 46.8px · 20px · 20.4px · 27.2px · 28.9px · 30.6px · 21px · 36px · 25.5px · 34px · 15px · 32px · 18px · 40.8px · 12px · 19.5px · 61.2px

### Spacing

**Base unit:** 4px

`space-1: 2px` · `space-2: 3px` · `space-3: 4px` · `space-4: 6px` · `space-5: 8px` · `space-6: 9px` · `space-7: 10px` · `space-8: 11px` · `space-9: 12px` · `space-10: 15px` · `space-11: 16px` · `space-12: 17px` · `space-13: 20px` · `space-14: 21px` · `space-15: 24px` · `space-16: 25px` · `space-17: 26px` · `space-18: 29px` · `space-19: 30px` · `space-20: 32px` · `space-21: 36px` · `space-22: 40px` · `space-23: 60px` · `space-24: 120px`

### Shapes

**Border radius:** `radius-sm: 6px` · `radius-md: 8px` · `radius-lg: 9.9px` · `radius-xl: 10px` · `radius-full: 12px` · `radius-6: 32px` · `radius-full: 50%`

### Elevation

- **shadow-sm:** `rgba(0, 0, 0, 0.05) 0px 2px 4px -1px`
- **shadow-md:** `rgba(0, 0, 0, 0.15) 0px 10px 20px 5px`
- **shadow-lg:** `rgba(0, 0, 0, 0.15) 0px -5px 20px 5px`

### Motion

- **duration-fast:** `all`
- **duration-fast:** `cubic-bezier(0.42, 0.01, 0.58, 1)`
- **duration-fast:** `opacity cubic-bezier(0.42, 0.01, 0.58, 1)`
- **duration-fast:** `color cubic-bezier(0.42, 0.01, 0.58, 1), font-size cubic-bezier(0.42, 0.01, 0.58, 1)`
- **duration-fast:** `color cubic-bezier(0.42, 0.01, 0.58, 1), background-color cubic-bezier(0.42, 0.01, 0.58, 1)`
- **duration-fast:** `min-height cubic-bezier(0.42, 0.01, 0.58, 1), font-size cubic-bezier(0.42, 0.01, 0.58, 1)`
- **duration-fast:** `none`
- **duration-fast:** `max-width 0.1s ease-in-out`
- **duration-base:** `color 0.2s, font-size 0.2s, background-color 0.2s, background-image 0.2s, border-color 0.2s, border-width 0.2s, border-style 0.2s, border-radius 0.2s, box-shadow 0.2s, opacity 0.2s, transform 0.2s`
- **duration-base:** `color 0.2s linear, background-color 0.2s linear, border-color 0.2s linear`
- **duration-base:** `color 0.2s cubic-bezier(0.21, 0.6, 0.35, 1)`
- **duration-base:** `border-color 0.2s cubic-bezier(0.21, 0.6, 0.35, 1)`
- **duration-base:** `color 0.2s cubic-bezier(0.21, 0.6, 0.35, 1), background-color 0.2s cubic-bezier(0.21, 0.6, 0.35, 1)`
- **duration-base:** `transform 0.2s cubic-bezier(0.21, 0.6, 0.35, 1)`
- **duration-base:** `transform 0.3s, filter 0.3s, -webkit-backdrop-filter 0.3s, backdrop-filter 0.3s, background-color 0.3s, border-color 0.3s`
- **duration-base:** `background-color 0.3s ease-in-out 0.3s, width 0s ease-in-out 0.6s, padding 0s ease-in-out 0.6s`
- **duration-base:** `background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s, min-height 0.1s ease-in-out`
- **duration-base:** `opacity 0.3s cubic-bezier(0.21, 0.6, 0.35, 1), transform 0.3s cubic-bezier(0.21, 0.6, 0.35, 1)`
- **duration-base:** `transform 0.3s cubic-bezier(0.21, 0.6, 0.35, 1), box-shadow 0.3s cubic-bezier(0.21, 0.6, 0.35, 1)`
- **duration-slow:** `opacity 0.4s cubic-bezier(0.21, 0.6, 0.35, 1), width 0.4s cubic-bezier(0.21, 0.6, 0.35, 1), height 0.4s cubic-bezier(0.21, 0.6, 0.35, 1), transform 0.2s cubic-bezier(0.21, 0.6, 0.35, 1)`

## Component Inventory

- **Buttons:** 27 detected
- **Links:** 207 detected
- **Inputs:** 45 detected
- **Navigation:** 7 elements
- **Lists:** 15 detected
- **Forms:** 1 detected
- **Images:** 139 detected

## Constraints

### Always

- Use tokens from the tables above — do not introduce new values.
- Include hover, focus-visible, and disabled states for interactive elements.
- Follow the 4px spacing grid.
- Meet WCAG 2.2 AA contrast minimums.

### Never

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (6px, 8px, 9.9px, 10px, 12px, 32px, 50%).
- Do not use full-uppercase text for body or paragraph content.
- Do not nest interactive elements (e.g. buttons inside links).
- Do not ship components without defining hover, focus-visible, and disabled states.

## Tone

Concise, confident, implementation-focused. Avoid filler preambles.

## Authoring Workflow

When creating or documenting a component for this system:

1. State intent — one sentence on purpose.
2. Map tokens — list every token the component uses.
3. Define anatomy — named parts with token assignments.
4. Specify states — default, hover, focus-visible, active, disabled, loading, error, empty.
5. Describe interactions — keyboard, pointer, touch, edge cases.
6. Add a11y criteria — testable pass/fail checks.
7. List anti-patterns — concrete misuse examples.
8. Close with the Definition of Done checklist.

## Output Structure

Component guidelines must contain, in order:

1. Overview (purpose, when to use, when not to use)
2. Tokens and foundations
3. Anatomy, variants, responsive behavior
4. States and interactions
5. Accessibility (ARIA, contrast, focus, screen reader)
6. Content guidelines (copy rules, tone)
7. Anti-patterns with reasoning

## Component Requirements

- Reference only tokens from the tables above.
- Define all states: default, hover, focus-visible, active, disabled, loading, error.
- Handle edge cases: empty, overflow, truncation, max content.
- Include keyboard navigation behavior.
- Document ARIA roles and labels.

## Definition of Done

- Default state renders (smoke test).
- All states visually verified.
- Zero hardcoded visual values — tokens only.
- Keyboard navigation works without pointer.
- No critical a11y violations.
- Tested at min and max breakpoint.
- At least one anti-pattern documented.
- Purpose, usage, and limitations documented.
