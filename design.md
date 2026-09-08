---
name: Precision Booth Ops
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#464555'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#004c76'
  on-tertiary: '#ffffff'
  tertiary-container: '#00659a'
  on-tertiary-container: '#bedfff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
typography:
  display:
    fontFamily: Geist
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.125rem
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.625rem
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.375rem
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: -0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.01em
  mono-data:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter-desktop: 1.5rem
  gutter-mobile: 1rem
  sidebar-width: 16rem
  sidebar-collapsed: 4.5rem
  container-max: 88rem
---

## Brand & Style

This design system establishes an architectural, high-utility workspace tailored for photobooth operators, event tech directors, and experiential rental companies managing fleets of physical and virtual booths.

The aesthetic fuses contemporary Swiss grid discipline with developer-grade SaaS refinement—inspired by modern modular component patterns, linear data flows, and dark-slate precision. It avoids playful consumer novelty in favor of calm operational clarity, high information density, and rapid incident resolution.

Key principles:
- **Calm Mastery:** Dense telemetry data, remote trigger actions, and media pipelines are balanced by systematic spacing and serene contrast.
- **Hardware-Software Tactility:** Interfaces reflect physical device telemetry (paper levels, camera uptime, thermal profiles, upload queues) through explicit, instant-feedback states.
- **Utilitarian Elegance:** Restrained neutral surfaces prioritize visual assets, live capture feeds, and revenue analytics without chromatic distraction.

## Colors

The palette leverages calibrated Zinc neutral tiers paired with an authoritative Indigo primary accent and functional telemetry status tokens.

### Color Tiers
- **Canvas Base:** Pure `#ffffff` for primary content panels; subdued slate `#f8fafc` (Zinc/Slate 50) for global workspace backgrounds.
- **Surfaces & Cards:** `#ffffff` framed by subtle 1px borders (`#e4e4e7` / Zinc 200). Muted background containers use `#f4f4f5` (Zinc 100).
- **Typography & Icons:** High-contrast `#09090b` (Zinc 950) for primary headlines and data values; `#71717a` (Zinc 500) for labels, metadata, and structural dividers; `#a1a1aa` (Zinc 400) for placeholder states.
- **Primary Accent (`#4f46e5`):** Deep indigo reserved for deliberate actions: primary CTA buttons, active tab indicators, focus rings, and active state toggles. Hover: `#4338ca`.
- **Operational & Telemetry Semantic Scale:**
  - **Online / Healthy:** Emerald (`#059669` text on `#ecfdf5` background, border `#a7f3d0`).
  - **Warning / Degraded / Low Consumables:** Amber (`#d97706` text on `#fffbeb` background, border `#fde68a`).
  - **Offline / Camera Failure / Jammed:** Rose (`#e11d48` text on `#fff1f2` background, border `#fecdd3`).
  - **Syncing / Capturing:** Sky/Cyan (`#0284c7` text on `#f0f9ff` background, border `#bae6fd`).

## Typography

The typography is powered exclusively by Geist, exploiting its neutral, mechanical metrics, engineered tabular tracking, and clean legibility at compact micro-copy sizes.

Rules for application:
- Numeric metrics, hardware IPs, upload rates, and event logs should always utilize tabular figures (`font-variant-numeric: tabular-nums`) to ensure zero jitter during real-time dashboard data polling.
- Headlines employ tight negative letter-spacing for crisp contrast against compact, legible body copy.
- Hierarchy is achieved primarily through weight shifts (`400` to `600`) and value steps (Zinc 950 down to Zinc 500) rather than disproportionate jumps in scale.

## Layout & Spacing

The architecture operates on an uncompromising 4px/8px incremental rhythm within a fluid-grid shell.

### Grid Structure
- **Desktop (1024px+):** Fixed left navigation rail (16rem/256px), followed by a dynamic fluid main content area with 24px (`space-lg`) gutters. Max-width constraints cap at 88rem for readability while allowing wide-format data grids.
- **Tablet (768px - 1023px):** Collapsible sidebar rail (4.5rem icon-only mode) with 16px content margins. Tables switch to horizontal swipe mode with fixed pinned left ID columns.
- **Mobile (<768px):** Off-canvas drawer navigation, single-column stack, 16px page margins, cards condensed to 12px inner padding.

### Section Spacing
Content groups, summary metric cards, and filter rows maintain strict 16px gaps. Tables maximize data density with 10px vertical cell padding and 16px horizontal cell padding.

## Elevation & Depth

This system avoids expressive drop shadows, relying instead on structural 1px borders, subtle surface fills, and hyper-diffused ambient lift.

- **Level 0 (Flat/Base):** `background-color: #f8fafc; border: none;`
- **Level 1 (Cards, Data Panels, Sidebar):** `background-color: #ffffff; border: 1px solid #e4e4e7; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);`
- **Level 2 (Popovers, Select Menus, Dropdowns):** `background-color: #ffffff; border: 1px solid #e4e4e7; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);`
- **Level 3 (Modals, Overlays):** `background-color: #ffffff; border: 1px solid #d4d4d8; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);`
- **Focus Rings:** Non-blurry dual rings: `0 0 0 2px #ffffff, 0 0 0 4px #4f46e5;`

## Shapes

Corner radii adhere strictly to a crisp `rounded-md` (6px) to `rounded-lg` (8px) system:
- **Inner Controls (Inputs, Buttons, Badges, Tabs):** `6px` (`0.375rem`).
- **Containers (Cards, Dialogs, Dropdown Panels, Sheets):** `8px` (`0.5rem`).
- **Telemetry Indicators & Avatar Markers:** Full pill `9999px` strictly for dot pings and status tags.

## Components

### Buttons
- **Primary:** Background `#4f46e5`, text `#ffffff`, border `1px solid transparent`, height 36px, font-size 14px, weight 500. Hover: `#4338ca`. Active: `#3730a3`.
- **Secondary / Outline:** Background `#ffffff`, text `#09090b`, border `1px solid #e4e4e7`. Hover: `#f4f4f5`.
- **Ghost:** Background transparent, text `#71717a`. Hover: `#f4f4f5`, text `#09090b`.
- **Destructive:** Background `#ffffff`, text `#e11d48`, border `1px solid #fecdd3`. Hover: `#fff1f2`.

### Inputs & Selects
- Height 36px, background `#ffffff`, border `1px solid #e4e4e7`, radius 6px, horizontal padding 12px.
- Focus: Border color `#4f46e5`, outer ring 2px translucent indigo (`#4f46e5` at 15%).
- Search variants include a left-aligned 16px search icon in `#a1a1aa`.

### Cards & Metrics
- Background `#ffffff`, border `1px solid #e4e4e7`, radius 8px, padding 20px.
- Metric Card Layout: Small label (12px, `#71717a`, uppercase, 0.05em tracking) on top, big numeric stat (28px tabular, `#09090b`) in the center, trend/delta badge or mini progress bar at the bottom.

### Data Tables
- Table header: Height 40px, background `#f8fafc`, text `#71717a`, 12px, font-weight 500, uppercase letter spacing. Bottom border `1px solid #e4e4e7`.
- Table row: Height 48px, hover background `#f8fafc`, border-bottom `1px solid #f4f4f5`. Tabular numbers for device uptime, paper counts, and session durations.

### Photobooth Operational Status Badges
- Pill shape (height 22px, radius 9999px, padding 2px 8px, font-size 12px, font-weight 500).
- Contains a left-aligned 6px animated or solid status circle.
- **Online:** Dot `#10b981`, background `#ecfdf5`, text `#047857`, border `1px solid #a7f3d0`.
- **Warning (Low Media/Paper):** Dot `#f59e0b`, background `#fffbeb`, text `#b45309`, border `1px solid #fde68a`.
- **Error (Offline/Jam):** Dot `#f43f5e`, background `#fff1f2`, text `#be123c`, border `1px solid #fecdd3`.
- **Active Capture:** Pulsing Dot `#0284c7`, background `#f0f9ff`, text `#0369a1`, border `1px solid #bae6fd`.

### Checkboxes & Radios
- Size 16x16px, radius 4px (checkbox) or 9999px (radio).
- Unchecked: Border `1px solid #d4d4d8`, background `#ffffff`.
- Checked: Border `1px solid #4f46e5`, background `#4f46e5`, white indicator icon.