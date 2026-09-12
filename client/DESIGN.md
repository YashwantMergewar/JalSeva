---
name: Jal Seva
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#424654'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#737785'
  outline-variant: '#c3c6d6'
  surface-tint: '#0056d2'
  primary: '#0040a1'
  on-primary: '#ffffff'
  primary-container: '#0056d2'
  on-primary-container: '#ccd8ff'
  inverse-primary: '#b2c5ff'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#8df1e0'
  on-secondary-container: '#006f63'
  tertiary: '#454748'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c5f60'
  on-tertiary-container: '#d8d9da'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a1'
  secondary-fixed: '#90f4e3'
  secondary-fixed-dim: '#73d8c7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  margin-mobile: 16px
  margin-tablet: 24px
  gutter: 16px
  touch-target-min: 48px
---

## Brand & Style

This design system is engineered for the Indian public sector, prioritizing **Modern Professionalism** and **Institutional Trust**. The aesthetic blends a systematic, clean interface with high-accessibility standards to ensure usability across diverse demographics.

The visual style follows a **Corporate / Modern** approach with subtle **Tonal Layering**. It avoids unnecessary ornamentation to maintain a "government-official" weight while remaining approachable and helpful. The primary emotional response should be one of reliability, clarity, and civic efficiency.

## Colors

The palette is anchored in **Water Blue** (Primary) to signify the municipality's core service and **Sanitation Teal** (Secondary) for environmental health. 

- **Primary (#0056D2):** Used for primary actions, headers, and branding elements. High contrast against white for WCAG AA compliance.
- **Secondary (#008577):** Used for sanitation-related features, secondary progress indicators, and health-focused callouts.
- **Background:** A neutral light gray (`#F8F9FA`) is used to reduce screen glare while maintaining a crisp, paper-like feel.
- **Semantic Colors:** Derived from standard safety palettes but deepened slightly to maintain the "official" tone. Ensure all status text meets at least 4.5:1 contrast ratio against the background.

## Typography

The design system utilizes **Inter** for its exceptional legibility on mobile screens and neutral, systematic character. 

- **Scale:** A strong typographic hierarchy ensures that citizens can quickly scan for bill amounts, due dates, and status updates.
- **Weight:** Use `SemiBold` (600) for headlines to establish authority and `Medium` (500) for labels to ensure they remain legible at small sizes.
- **Accessibility:** Avoid using light weights (300 or less). The minimum body size is set to 16px to accommodate senior citizens and users with visual impairments.

## Layout & Spacing

This design system uses a **Fluid Grid** model with a base unit of **4px**. 

- **Mobile Layout:** A 4-column grid with 16px side margins.
- **Tablet Layout:** An 8-column grid with 24px side margins.
- **Rhythm:** Use increments of 8px (8, 16, 24, 32, 48) for vertical spacing between sections to create a clear, organized flow.
- **Touch Targets:** All interactive elements (buttons, links, checkboxes) must maintain a minimum hit area of **48x48px** to ensure ease of use for all citizens, including those with limited motor precision.

## Elevation & Depth

Elevation is used sparingly to maintain a clean, official look. 

- **Surface Layers:** Use white (`#FFFFFF`) for primary cards and containers atop the light gray background.
- **Shadows:** Use a single, consistent shadow style for floating elements (like FABs or active cards): `0px 4px 12px rgba(0, 0, 0, 0.08)`. Shadows should be soft and diffused, never harsh.
- **Outlines:** Use 1px borders in a soft gray (`#E0E0E0`) for input fields and static containers to define boundaries without relying on depth.

## Shapes

The shape language uses **Rounded** (Level 2) geometry to soften the institutional feel and make the app appear modern and user-friendly.

- **Standard Elements:** Buttons and input fields use an **8px (0.5rem)** radius.
- **Containers:** Large cards and modals use a **16px (1rem)** radius to clearly differentiate them from background elements.
- **Icons:** Use rounded icon sets (e.g., Material Symbols Rounded) to harmonize with the UI's corner radius.

## Components

### Buttons
- **Primary:** Solid Primary Blue with White text. Used for "Pay Bill," "Submit Complaint," or "Register."
- **Secondary:** Outlined Blue or Solid Secondary Teal for environmental actions.
- **States:** Include a clear 10% dark overlay on press/tap.

### Input Fields
- **Style:** Outlined with a 1px border. Labels should remain visible above the field (Floating Label) to assist users during data entry.
- **Focus:** 2px solid Primary Blue border.

### Cards
- **Usage:** Essential for "Current Balance," "Last Payment," or "Service Status."
- **Structure:** White background, 1px border or subtle shadow, 16px internal padding.

### Chips & Tags
- **Status Tags:** Use tinted backgrounds (e.g., light green background with dark green text) for "Resolved," "Pending," or "Overdue" statuses.

### Lists
- **Style:** Clean dividers between items. Every list item should have a chevron icon or a clear action indicator if it is tappable.

### Additional Government Components
- **Identity Header:** A dedicated area at the top for the Municipal Seal and the Government of India branding.
- **Step Indicators:** Clear, numbered progress bars for multi-step forms like "New Water Connection Request."