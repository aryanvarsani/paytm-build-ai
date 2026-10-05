# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/kyun/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Kyun?
**Category:** Mobile Fintech Explainability Application

---

## Global Rules

### Color Palette & Tokens

The application has two identities.
1. **PAYTM FOUNDATION** (Primary visual language): navy, cyan, white, light gray.
2. **KYUN? INTELLIGENCE** (Secondary visual language): purple, cyan, gradient. The Kyun? gradient should be used selectively (Kyun? logo, badge, AI CTA, active Kyun? navigation, progress, What-If emphasis).

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Paytm Navy | `#233266` | `--color-paytm-navy` |
| Paytm Cyan | `#00BAF2` | `--color-paytm-cyan` |
| Kyun Purple | `#6C3CE9` | `--color-kyun-purple` |
| Kyun Cyan | `#00BAF2` | `--color-kyun-cyan` |
| App Background | `#F6F8FB` | `--color-background` |
| Surface | `#FFFFFF` | `--color-surface` |
| Primary Text | `#172033` | `--color-text-primary` |
| Secondary Text | `#667085` | `--color-text-secondary` |
| Muted Text | `#98A2B3` | `--color-text-muted` |
| Border | `#E6EAF0` | `--color-border` |
| Success | `#16A34A` | `--color-success` |
| Warning | `#F59E0B` | `--color-warning` |
| Error | `#DC2626` | `--color-error` |

**Gradient Token:**
`--gradient-kyun`: `linear-gradient(135deg, #6C3CE9 0%, #00BAF2 100%)`

### Typography

- **Font Family:** Inter (Modern sans-serif)
- **Scale:**
  - Screen title: `20–22px`, font-weight: `600`
  - Section title: `17–19px`, font-weight: `600`
  - Card title: `15–16px`, font-weight: `500`
  - Body text: `13–14px`, font-weight: `400`
  - Metadata: `11–12px`, font-weight: `400`
  - Financial amount: `28–34px`, font-weight: `700`

### Spacing

Use an intentional spacing scale. Do not use random values like 13px or 17px.

| Token | Value |
|-------|-------|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |

### Border Radius (Cards & Surfaces)

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `10px - 12px` | Badges, small inputs, buttons |
| `--radius-md` | `14px - 16px` | Standard cards (FinancialCard, EventCard, etc.) |
| `--radius-lg` | `18px` | Hero cards, large sections, bottom sheet top corners |

### Iconography

- **Library:** Lucide React or SVG equivalents.
- **Rule:** Do NOT use emojis. Do not mix icon sets.
- **Service Mapping:**
  - Scan & Pay → QR code
  - To Mobile → Smartphone
  - To Bank → Building2
  - Personal Loan → Banknote
  - Wallet → Wallet
  - Credit Card → CreditCard
  - Motor Insurance → CarFront
  - Health Insurance → HeartPulse / Shield
  - Mutual Fund → TrendingUp
  - Search → Search
  - Notification → Bell
  - Kyun? → Custom question-mark mark or Sparkles

### Component Architecture

**Core Components to Implement:**
- `AppHeader` / `PaytmHeader` (Compact, Avatar, Logo, Search, Notification)
- `BottomNav` (Home, Wealth, Scan QR [centered, elevated], Garage, Kyun AI)
- `ServiceGrid` / `ServiceItem`
- `PromoBanner`
- `NetWorthCard`
- `FinancialEventCard`
- `KyunBadge` (Gradient accent)
- `KyunCard` / `FactorCard` / `ImpactBadge`
- `ShowDataSheet` (Bottom sheet, draggable)
- `ScenarioSlider` / `ScenarioComparison`
- `ActionPlan` / `PlanTimeline`
- `ProgressMetric` / `ProgressBar`
- `AskKyun` / `ChatBubble`

### Anti-Patterns (Do NOT Use)

- ❌ Emojis as primary UI icons.
- ❌ Making every component a card.
- ❌ Excessively rounded cards (e.g., 24-32px).
- ❌ Giant purple backgrounds / excessive gradients.
- ❌ Making Kyun? visually dominate the Paytm foundation.
- ❌ Generic SaaS dashboard layouts with huge whitespace.
- ❌ Inconsistent icon sets.
- ❌ Speculative financial outcomes sounding "guaranteed" (use "likely", "illustrative scenario").

### Pre-Delivery Checklist

- [ ] Information density resembles real Paytm app (compact, functional).
- [ ] No horizontal overflow or text clipping on 360px, 390px, 414px mobile widths.
- [ ] Kyun? intervention is visible but clearly embedded inside the Paytm framework.
- [ ] Typography scale is adhered to (no giant headings).
- [ ] Contrast ratios meet accessibility standards for primary/secondary text.
