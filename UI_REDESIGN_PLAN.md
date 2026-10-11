# Groww Gen Z — Full UI Redesign & Motion Design Plan

## 1. Executive Summary & Design System Audit

### Context & Goals
Transform the existing functional prototype into an authentic, production-grade Groww mobile experience tailored for Gen Z (ages 20–26, first-time investors in India).
The baseline prototype is functionally sound with resilient routing, persistent state, deterministic plan calculations, and complete user journeys. However, the current visual styling relies on an editorial serif aesthetic (`Fraunces` font, cream/sepia `#FAF7F2` background, deep navy `#14213D` ink, mustard accent `#E8A317`), resembling a bespoke boutique rather than the crisp, clean, confident, green-anchored fintech interface that defines Groww.

### Reference Analysis
1. **Figma UI Kit Reference (`Groww App UI (Community)`)**:
   - **Primary Brand Accent**: Groww Emerald / Tech Green (`#00D09C` / `#12D18E` / `#00BA88` hover, rgb(0, 208, 156)), paired with crisp clean surfaces.
   - **Background**: Modern crisp neutral `#FFFFFF` (pure white surface) and subtle off-white canvas `#F8FAFC` / `#F7F9FA` for clean segmentation.
   - **Text & Hierarchy**: Deep Slate `#1E222B` / `#191C1F` for primary headings and balances, Cool Muted Slate `#7C828A` / `#6B7280` for secondary metadata and subtitles.
   - **Borders & Dividers**: Ultra-fine hairline border `#EAECF0` / `#E5E7EB` (1px clean outlines).
   - **Typography**: Clean, geometric modern sans-serif: `Plus Jakarta Sans` / `Inter` across all headings, body, and tabular numbers. No serifs.
   - **Border Radii**: 16px–20px rounded cards (`rounded-2xl` / `rounded-[18px]`), 12px–14px inputs/chips, pill buttons (9999px or 12px crisp).
   - **Buttons**:
     - *Primary*: Vibrant Groww Green `#00D09C` with white text (bold, crisp, high-contrast, slight hover lift).
     - *Secondary*: Surface card `#FFFFFF` with 1px `#EAECF0` border, deep text `#1E222B`.
     - *Ghost / Light*: Soft green tint `#E6FAF5` or `#F0FDF9` with green text `#00B386` for tags and selected chips.

2. **Godly Design Interaction Principles**:
   - High-contrast clarity and data-first typography with `tabular-nums` for all rupee values.
   - Tactile spring motion (`type: 'spring', damping: 25, stiffness: 350`) for taps, buttons, and selections.
   - Smooth staggered entrance sequences (staggerChildren: 0.05, opacity + y: 8px to 0px).
   - Polished count-up transitions for financial balances.
   - Fluid segmented progress bars and micro-haptic visual feedback.

---

## 2. Design Tokens & Styling Architecture

### Color Palette (Tailwind V4 CSS Variables in `src/index.css`)
```css
--color-bg: #F8FAFC;            /* App backdrop */
--color-surface: #FFFFFF;       /* Card surfaces */
--color-surface-subtle: #F1F5F9;/* Hover / inactive containers */
--color-ink: #191C1F;           /* High-contrast primary text */
--color-ink-secondary: #44474E; /* Body text */
--color-muted: #7C828A;         /* Supporting captions & labels */
--color-hairline: #EAECF0;      /* Hairline borders & dividers */
--color-accent: #00D09C;        /* Signature Groww Green */
--color-accent-dark: #00BA88;   /* Active / hover state */
--color-accent-light: #E6FAF5;  /* Subtle green chip / badge tint */
--color-positive: #00D09C;      /* Positive growth / success */
--color-caution: #EB5757;       /* Market drops / loss / errors */
--color-warning: #F59E0B;       /* Warning notices */
--color-chart-1: #00D09C;       /* Index / Equity */
--color-chart-2: #3B82F6;       /* Liquid / Safety */
--color-chart-3: #8B5CF6;       /* Hybrid / Balance */
--color-chart-4: #F59E0B;       /* Short debt */
--color-chart-5: #64748B;       /* Flexible */
```

### Typography
- Primary Heading & Body font: **`Plus Jakarta Sans`** (weights: 400, 500, 600, 700, 800).
- Financial Figures: `font-bold tracking-tight tabular-nums`.

---

## 3. Screen-by-Screen Redesign & Implementation Inventory

| Screen | Route | Key Visual & Motion Changes | Status |
|--------|-------|-----------------------------|--------|
| **Welcome** | `/welcome` | Groww brand mark, clean hero card, emerald green CTA with spring tap, clean disclaimer modal. | Planned |
| **Situation** | `/onboarding/situation` | 4 selection cards with emerald selection border and soft green bg tint, crisp name input. | Planned |
| **Income** | `/onboarding/income` | Hero number input with large tabular rupee counter, custom toggle for irregular income. | Planned |
| **Expenses** | `/onboarding/expenses` | Live animated "Available after expenses" pill card in emerald tint, chip selectors for emergency buffer. | Planned |
| **Goals** | `/onboarding/goals` | Goal cards with checkmark pills, emerald icons, multi-select motion feedback. | Planned |
| **Timeline** | `/onboarding/timeline` | Segmented time horizon chips, clean card containers. | Planned |
| **Risk** | `/onboarding/risk` | Hypothetical market scenario cards with letter badges, clear non-judgmental guidance. | Planned |
| **Calculating** | `/onboarding/calculating` | Seamless 4-step checklist with spinning green pulse, smooth fade into Plan. | Planned |
| **Plan (Hero)** | `/plan` | Big bold available balance, stacked segmented allocation bar with Groww palette, individual bucket cards with progress meters, action CTAs. | Planned |
| **Why Plan** | `/plan/why` | Numbered reasoning cards with emerald indices, smooth expandable "Show the math" drawer. | Planned |
| **Recommended** | `/invest/recommended` | Curated recommendation cards with risk dots, key rationale bullet points, and instant review triggers. | Planned |
| **Category Detail**| `/explore/:categoryId` | Risk meter visual, illustrative market fall bar, clear "Best for" badge, "Invest in this" CTA. | Planned |
| **Before Invest** | `/learn/before-you-invest` | 3 interactive cards with drag slider showing simulated fall and educational copy. | Planned |
| **Review Invest** | `/invest/review` | Interactive rupee stepper with quick preset chips (`+Rs 500`, `+Rs 1,000`), simulated consent checkbox, processing animation. | Planned |
| **Confirmed** | `/invest/confirmed` | Bouncing emerald checkmark badge, large confirmed figure, clear "What happens next" bullet points. | Planned |
| **Home (Dashboard)**| `/home` | Portfolio card with count-up animation, profit/loss percentage tag, quick action banner, holdings accordion, learning shortcuts. | Planned |
| **Explore** | `/explore` | Instant search input, "Built for your plan" section, category cards with risk badges. | Planned |
| **Learn** | `/learn` | Circular progress ring with % completed, structured lesson cards with status indicators. | Planned |
| **Lesson Detail** | `/learn/:lessonId` | Interactive cards, market fall slider, compare tab, basket reveal component. | Planned |
| **You (Profile)** | `/you` | Clean summary card, situation tag, financial stats, navigation links to plan & demo controls. | Planned |
| **Profile Edit** | `/you/profile` | Inline numbers editor, before/after delta comparison cards, quick recalculation toast. | Planned |
| **Scenario** | `/scenario` | Fall/Rally toggle tabs, interactive % slider, horizon buttons, real holdings impact simulation. | Planned |
| **Demo Controls** | `/you/demo` | Fast persona switcher (Student, First Job, Freelancer), Jump Month action, Reset modal. | Planned |
| **BottomNav** | Layout | Sticky frosted blur bar (`backdrop-blur-md`), emerald active indicators, clean micro-tap animations. | Planned |
| **AppShell / Layout**| Layout | Mobile-first container with max-w-[430px], clean borders on desktop viewport, safe-area padding. | Planned |

---

## 4. Execution Sequence
1. Update `src/index.css` with Groww design tokens, modern sans typography, colors, shadows, and base styles.
2. Upgrade UI primitives: `Button`, `Card`, `Chip`, `NumberInput`, `ProgressBar`, `RiskMeter`, `BottomSheet`, `Toast`.
3. Redesign Layout & Navigation: `AppShell`, `OnboardingShell`, `BottomNav`.
4. Redesign Onboarding flow screens (`Welcome`, `Situation`, `Income`, `Expenses`, `Goals`, `Timeline`, `Risk`, `Calculating`).
5. Redesign Hero Money Plan & Explanations (`Plan`, `WhyPlan`, `Recommended`).
6. Redesign Investment, Simulation & Learning flows (`CategoryDetail`, `BeforeInvestLesson`, `ReviewInvest`, `ConfirmedInvest`, `Learn`, `LessonDetail`).
7. Redesign Home Dashboard, Explore, Profile, Scenario & Demo controls (`Home`, `Explore`, `You`, `ProfileEdit`, `Scenario`, `DemoControls`).
8. Run comprehensive TypeScript typecheck and browser tests across mobile viewport sizes (375x812, 390x844, 430x932).
