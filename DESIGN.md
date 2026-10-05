# DESIGN.md - Visual Design & Implementation Bridge

## 1. Visual Direction
**Selected Direction:** Direction B (Paytm + subtle Kyun? intelligence).
The core app visually resembles Paytm (navy headers, cyan accents, high-density service grids, compact spacing). Kyun? operates as an "intelligence layer" on top of this foundation, marked by a distinct purple-to-cyan gradient, a "Kyun?" badge, and specific intervention cards.

## 2. Global Tokens (Converged with design-system/MASTER.md)

### Brand & Semantic Colors
- `--color-paytm-navy`: `#233266`
- `--color-paytm-cyan`: `#00BAF2`
- `--color-kyun-purple`: `#6C3CE9`
- `--color-kyun-cyan`: `#00BAF2`
- `--color-background`: `#F6F8FB`
- `--color-surface`: `#FFFFFF`
- `--color-text-primary`: `#172033`
- `--color-text-secondary`: `#667085`
- `--color-text-muted`: `#98A2B3`
- `--color-border`: `#E6EAF0`
- `--gradient-kyun`: `linear-gradient(135deg, #6C3CE9 0%, #00BAF2 100%)`

### Typography (Inter)
- `--font-title`: 20px, 600 weight
- `--font-section`: 18px, 600 weight
- `--font-card`: 15px, 500 weight
- `--font-body`: 14px, 400 weight
- `--font-meta`: 12px, 400 weight
- `--font-finance`: 28px, 700 weight

### Spacing Scale
`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`

### Border Radii
- `--radius-sm`: `12px` (badges, buttons, icons)
- `--radius-md`: `16px` (standard cards, event cards)
- `--radius-lg`: `18px` (bottom sheets, hero elements)

### Shadows
- `--shadow-card`: `0 2px 8px rgba(35, 50, 102, 0.08)`
- `--shadow-elevated`: `0 8px 24px rgba(35, 50, 102, 0.12)`

## 3. Component Rules

- **Header:** Compact, navy background. Must contain Avatar, Logo, Search, Bell.
- **Service Grid:** 4 columns. Icons must be consistent SVGs (Lucide) embedded in light blue squircle backgrounds.
- **Cards:** White background, subtle border/shadow. Do not wrap every single element in a card. Group logical items.
- **Kyun? Intervention:** When Kyun? explains an event (like a loan rejection), the button/badge should use `--gradient-kyun` to stand out from the Paytm base.
- **Bottom Navigation:** 5 items. Center item (Scan QR) is elevated and circular, dark navy.

## 4. Mobile Breakpoints
Primary target widths: 360px, 390px, 414px. Max width 430px (constrained by `PhoneFrame`). No horizontal scrolling allowed.

## 5. Accessibility
- All text must meet 4.5:1 contrast.
- Buttons must have minimum 44px touch targets.
- Interactive elements must show clear visual states without shifting layout.
