# Shelfly — Design System (Corrected)

> This file replaces the original style-reference draft. Fixes applied are listed
> at the bottom under "Corrections Log." Tokens, type scale, spacing, radius and
> shadow values are unchanged from the original draft except where noted — those
> were sound. What was wrong was (a) one broken hex value, (b) an entire set of
> sections written for a different product (a notebook/stationery brand called
> "SuperrBook"), and (c) three pasted-in components that violate this file's own
> Do's and Don'ts.

**Theme:** light

## Product Context

Shelfly is a personal reading tracker. Users add books, move them through
`Want to Read → Reading → Finished`, and browse/filter/search their shelf from
a single dashboard. There is no e-commerce, checkout, or pre-order flow —
every section below is written against that reality.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#fdfbf9` | `--color-cream-paper` | Page canvas, card surfaces, button fills |
| Charcoal | `#171717` | `--color-charcoal` | Borders, structural text, the only "ink" color |
| Cocoa Ink | `#2b1a07` | `--color-cocoa-ink` | Headline color, decorative borders |
| True Black | `#000000` | `--color-true-black` | Reserved for rare highest-emphasis moments |
| Dew Drop | `#f7efe9` | `--color-dew-drop` | Secondary surface tint (never pure white) |
| Marker Orange | `#ff6f1e` | `--color-marker-orange` | Handwritten captions, inline emphasis, footer band, "Reading" status accent |
| Burnt Sienna | `#ce500a` | `--color-burnt-sienna` | Heavier orange for text/border accents on cream |
| Sky Sticker | `#3b82f6` | `--color-sky-sticker` | Decorative only — sticker illustrations. Never UI |
| Bubblegum Sticker | `#ff66cf` | `--color-bubblegum-sticker` | Decorative only — stickers. Never UI |
| Sprout Sticker | `#22c55e` | `--color-sprout-sticker` | Green outline for tags/dividers — usable for "Finished" status accent |
| Shadow Mist | `#bebcbb` | `--color-shadow-mist` | Base tone for card/button drop shadows |

**Fix applied:** the "Surfaces" table originally listed the footer band as
`#ff6f1` (5-digit, invalid CSS hex). Corrected to `#ff6f1e` everywhere,
including the CSS variable block at the end of this file.

## Tokens — Typography

### gelica — display, headings, and most body text
- Weights: 400, 500, 600
- Sizes: 16, 20, 24, 28, 32, 36, 40, 46, 104
- Line height: 1.08–1.50, letter-spacing normal, lowercase by default

### Geist — secondary/UI text
- Weights: 400, 500
- Sizes: 18, 20, 32
- Used for nav items, fine print, and — see note below — `body-sm`

**Fix applied:** the type-scale table maps `body-sm` to 18px, but 18px only
exists in the Geist size list, not gelica's. This was previously undocumented,
so `body-sm` would silently fall back to whatever font a component happened to
inherit. Stated explicitly now: **`--text-body-sm` renders in Geist**, not
gelica. Every other scale step (caption, body, subheading, heading-sm,
heading, heading-lg, display) renders in gelica.

### Type Scale

| Role | Size | Line Height | Font |
|------|------|-------------|------|
| caption | 16px | 1.5 | gelica |
| body-sm | 18px | 1.5 | **Geist** |
| body | 20px | 1.5 | gelica |
| subheading | 24px | 1.4 | gelica |
| heading-sm | 28px | 1.4 | gelica |
| heading | 36px | 1.2 | gelica |
| heading-lg | 46px | 1.2 | gelica |
| display | 104px | 1.08 | gelica |

## Tokens — Spacing & Shapes

Base unit: 4px. Density: comfortable.

Scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 116 (px)

### Border Radius (named, functional)

| Element | Value |
|---------|-------|
| tags | 20px |
| cards | 12px |
| footer | 56px |
| inputs | 8px |
| buttons | 20px |

**Fix applied:** the original CSS block also defined a generic radius scale
(`--radius-sm: 2px`, `--radius-lg: 8px`, `--radius-xl: 12px`,
`--radius-2xl: 16px`, `--radius-2xl-2: 20px`) alongside the named tokens
above. `--radius-2xl` (16px) mapped to nothing — no element in this system
uses a 16px radius. Removed it. Keep only the named tokens (`tags`, `cards`,
`footer`, `inputs`, `buttons`) plus `--radius-sm: 2px` for anything that
needs a near-square corner (e.g. checkbox inputs). Don't reintroduce an
unmapped generic scale — every radius value here should trace to a named use.

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg (card) | `rgba(0,0,0,0.06) 0px 2px 20px 0px` | `--shadow-lg` |
| subtle (button) | `rgba(0,0,0,0.25) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout
- Page max-width: 1200px
- Section gap: 64px
- Card padding: 32px
- Element gap: 12px

## Do's and Don'ts (unchanged — this is the part everything else must obey)

**Do**
- Headlines in gelica 600, lowercase, Cocoa Ink, line-height 1.08
- Marker Orange only for handwritten captions, inline emphasis, footer band
- Charcoal as the only ink color for text/borders/strokes
- 20px pill radius on buttons/tags, 12px on cards, 56px on the footer
- Cream Paper canvas, Dew Drop as the only secondary surface tint
- Scatter sticker illustrations at random 5–15° rotations

**Don't**
- No Sky/Bubblegum/Sprout as functional UI color — decoration only
- No filled CTA buttons — dark border on cream, never a solid fill
- No capitalized headlines, no letter-spacing
- No shadows heavier than the two defined above
- **No gradients, no glassmorphism, no neon accents** — matte and warm only

## Components (Shelfly-specific)

These replace the original file's product-photography components
(Product Notebook, Name Label Sticker), which described physical notebook
merchandise and don't apply to a reading tracker.

### Pill Action Button
Cream fill, 1.5px Charcoal border, 20px radius, 28px/10px padding, gelica
16/500 Charcoal text, `--shadow-subtle`. No fill state on hover — identity
is the border, not the background. Used for "+ Add Book" and modal submit.

### Book Card
The primary content unit. Cream Paper surface, 12px radius, `--shadow-lg`.
Cover image top, title in gelica heading-sm (28px) Cocoa Ink, author in
gelica body (20px) weight 400 Charcoal at reduced opacity, a Status Badge,
then a row with a status-update control and a `•••` menu. Hover: 2px lift +
`--shadow-lg` intensifies slightly — no color shift, no scale beyond ~1.01,
transition 150–200ms.

### Status Badge
Pill radius (20px), 1px border, small dot + label. Suggested mapping:
- **Want to Read** — Charcoal border/text on Dew Drop fill
- **Reading** — Marker Orange border/text on Cream fill
- **Finished** — Sprout Sticker (#22c55e) border/text on Cream fill

This is the one place a "sticker" color is promoted to UI, scoped narrowly
to the status dot/border only — it does not violate the Do's/Don'ts rule
against sticker colors in buttons, links, or surfaces.

### Dashboard Stat Pill
Cream fill, 1px Charcoal border, 20px radius, gelica body-sm (Geist 18px)
label + gelica heading-sm (28px) number. Used for Total / Want to Read /
Reading / Finished counts in the dashboard header row.

### Add Book Modal
Cream Paper surface, 12px radius, `--shadow-lg`, 32px padding. Inputs use
8px radius, 1px Charcoal border, Dew Drop fill on focus (Sprout Sticker
green permitted here as a focus-ring accent per the color token table).
Cancel = ghost/no-border text button; Add Book = Pill Action Button.

### Handwritten Caption
gelica 20–24px weight 400, Marker Orange, slight rotation, paired with a
thin hand-drawn arrow. Used sparingly — e.g. labeling the empty-state
illustration — not on every screen.

### Marker Highlight
Inline emphasis word in Marker Orange with a rough 2–3px underline. Reserve
for the welcome heading's key word (e.g. "shelf") — do not overuse in body
copy.

### Footer Brand Band
Marker Orange full-width band, 56px asymmetric top radius, gelica text in
Charcoal or cream. One per page, at the very bottom.

### Sticker Illustration
Flat 2px-outlined characters in Sky/Bubblegum/Sprout, rotated 5–15°,
scattered near empty states and the welcome heading only — never inside
functional list/grid areas where they'd compete with book covers.

### Top-left Brand Mark / Top-right Action
32px icon top-left linking home; Pill Action Button top-right ("+ Add Book"
on the dashboard).

## On the "Vengeance" component set (GlassDock, LightLines, TestimonialsCard)

These were supplied as available implementation code but **as written they
break this system's own rules** and should not be used unmodified:

- **GlassDock** — `backdrop-blur-xl` + translucent black/white fill is
  glassmorphism, explicitly banned above. If a dock/nav like this is
  wanted, rebuild it opaque: Cream Paper fill, 1.5px Charcoal border, no
  blur, no transparency.
- **LightLines** — default gradient (`#2462F6 → #5999F8`) is a cool neon
  blue gradient background, banned on two counts (gradient + off-palette
  hue). If an animated background is wanted for an empty-state screen, it
  would need a from/to of Cream Paper → Dew Drop with no visible gradient
  banding — or be dropped in favor of static stickers.
- **TestimonialsCard** — styled with generic `neutral-200/800` grays
  instead of Cream Paper/Charcoal/Dew Drop, and there's no natural place
  for testimonials in Shelfly's workflow.

Recommendation: leave all three out of the Shelfly build. None of Shelfly's
required screens (dashboard, book grid, add-book modal, empty states) need
a glass dock, an animated light background, or a testimonial carousel.

## Quick Start — CSS Custom Properties (corrected)

```css
:root {
  /* Colors */
  --color-cream-paper: #fdfbf9;
  --color-charcoal: #171717;
  --color-cocoa-ink: #2b1a07;
  --color-true-black: #000000;
  --color-dew-drop: #f7efe9;
  --color-marker-orange: #ff6f1e;
  --color-burnt-sienna: #ce500a;
  --color-sky-sticker: #3b82f6;
  --color-bubblegum-sticker: #ff66cf;
  --color-sprout-sticker: #22c55e;
  --color-shadow-mist: #bebcbb;

  /* Typography */
  --font-gelica: 'gelica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  --text-caption: 16px;      --leading-caption: 1.5;
  --text-body-sm: 18px;      --leading-body-sm: 1.5;   /* Geist, not gelica */
  --text-body: 20px;         --leading-body: 1.5;
  --text-subheading: 24px;  --leading-subheading: 1.4;
  --text-heading-sm: 28px;  --leading-heading-sm: 1.4;
  --text-heading: 36px;     --leading-heading: 1.2;
  --text-heading-lg: 46px;  --leading-heading-lg: 1.2;
  --text-display: 104px;    --leading-display: 1.08;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;   --spacing-8: 8px;   --spacing-12: 12px;
  --spacing-16: 16px; --spacing-20: 20px; --spacing-24: 24px;
  --spacing-28: 28px; --spacing-32: 32px; --spacing-40: 40px;
  --spacing-48: 48px; --spacing-64: 64px; --spacing-116: 116px;

  /* Border Radius — named only, no orphaned generic scale */
  --radius-sm: 2px;
  --radius-tags: 20px;
  --radius-cards: 12px;
  --radius-footer: 56px;
  --radius-inputs: 8px;
  --radius-buttons: 20px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.06) 0px 2px 20px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-canvas: #fdfbf9;
  --surface-tint: #f7efe9;
  --surface-brand-band: #ff6f1e; /* fixed: was invalid #ff6f1 */
}
```

## Corrections Log

1. `--surface-brand-band` hex fixed from invalid `#ff6f1` → `#ff6f1e`.
2. Removed unrelated "SuperrBook" notebook-brand content (Imagery, Layout,
   Agent Prompt Guide, Similar Brands, example prompts) and replaced with
   Shelfly-specific component specs (Book Card, Status Badge, Dashboard
   Stat Pill, Add Book Modal).
3. Removed orphaned `--radius-2xl: 16px` (unmapped to any element).
4. Documented that `--text-body-sm` (18px) renders in Geist, not gelica —
   previously implicit and easy to implement wrong.
5. Flagged GlassDock, LightLines, and TestimonialsCard as incompatible with
   the Do's/Don'ts (glassmorphism, gradient/neon, off-palette grays) and
   recommended excluding them from the build.
