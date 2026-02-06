

# Typography System Upgrade - Implementation Plan

## Overview
This plan implements a premium, product-grade typography system across the entire Vyoman website, replacing the current single-font setup with a multi-font hierarchy that reflects AI intelligence, career professionalism, and futuristic design.

---

## Font Family System

### Three-Font Hierarchy

| Font | Role | Usage |
|------|------|-------|
| **Sora** | Headlines & Branding | Hero headlines, section titles, navigation headings, CTA headlines |
| **Inter** | Body & UI | Paragraphs, forms, buttons, descriptions, dashboard labels |
| **Space Grotesk** | Metrics & Highlights | Scores, analytics numbers, performance stats, confidence metrics |

### Resume Builder Fonts (Document-Style)
- **Headings**: Playfair Display, Merriweather
- **Body**: Lora, Source Serif Pro

---

## Typography Scale

### Size System

| Token | Desktop Size | Mobile Size | Use Case |
|-------|-------------|-------------|----------|
| `text-display` | 56px | 36px | Hero headlines |
| `text-h1` | 40px | 32px | Page titles |
| `text-h2` | 28px | 24px | Section titles |
| `text-h3` | 22px | 20px | Card headers |
| `text-body-lg` | 18px | 16px | Featured paragraphs |
| `text-body` | 16px | 15px | Default body text |
| `text-sm` | 14px | 13px | Labels, captions |
| `text-metric` | Variable | Variable | Dashboard numbers |

### Line Height System

| Element | Line Height |
|---------|-------------|
| Headlines | 1.1 - 1.2 |
| Subheadings | 1.3 |
| Body text | 1.65 (optimal readability) |

### Letter Spacing

| Element | Spacing |
|---------|---------|
| Hero headlines | -0.02em |
| Section titles | -0.01em |
| Buttons | 0.02em |
| Labels | 0.03em |

---

## Implementation Details

### Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Add Google Fonts preconnect and import for Sora, Space Grotesk, Playfair Display, Merriweather, Lora, Source Serif Pro |
| `src/index.css` | Add font-family CSS variables, typography utility classes, micro-typography enhancements |
| `tailwind.config.ts` | Add fontFamily definitions, custom typography scale, line-height and letter-spacing tokens |
| `src/components/Hero.tsx` | Apply Sora for headlines, proper spacing |
| `src/pages/Dashboard.tsx` | Apply Space Grotesk for metrics, Inter for UI |
| `src/components/Features.tsx` | Apply typography hierarchy |
| `src/components/Pricing.tsx` | Apply typography with proper spacing |
| `src/components/Sidebar.tsx` | Apply Inter for navigation |
| `src/components/resume-builder/ResumeBuilderLanding.tsx` | Apply Sora for headlines |
| Resume template files (6 files) | Apply document fonts (Playfair, Merriweather, Lora, Source Serif) |

---

## Technical Implementation

### 1. Font Loading (index.html)

Preconnect to Google Fonts and load all required fonts with appropriate weights:
- Sora: 400, 500, 600, 700
- Inter: 300, 400, 500, 600, 700
- Space Grotesk: 400, 500, 600, 700
- Playfair Display: 400, 600, 700
- Merriweather: 400, 700
- Lora: 400, 500, 600
- Source Serif Pro: 400, 600

### 2. CSS Variables & Utilities (src/index.css)

New CSS custom properties:
```css
--font-headline: 'Sora', sans-serif;
--font-body: 'Inter', sans-serif;
--font-metric: 'Space Grotesk', sans-serif;
--font-resume-heading: 'Playfair Display', serif;
--font-resume-body: 'Lora', serif;
```

Utility classes:
- `.font-headline` - Sora
- `.font-body` - Inter
- `.font-metric` - Space Grotesk
- `.text-display` - 56px hero headlines
- `.tracking-headline` - -0.02em
- `.tracking-title` - -0.01em
- `.tracking-button` - 0.02em
- `.leading-headline` - 1.1
- `.leading-body` - 1.65

Micro-typography enhancements:
- `-webkit-font-smoothing: antialiased`
- `-moz-osx-font-smoothing: grayscale`
- `text-rendering: optimizeLegibility`
- `font-feature-settings: 'kern' 1`

### 3. Tailwind Configuration (tailwind.config.ts)

New fontFamily tokens:
```js
fontFamily: {
  headline: ['Sora', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
  metric: ['Space Grotesk', 'sans-serif'],
  'resume-heading': ['Playfair Display', 'serif'],
  'resume-body': ['Lora', 'serif']
}
```

Extended fontSize scale with responsive variants and line-height:
```js
fontSize: {
  'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
  'h2': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
  'h3': ['1.375rem', { lineHeight: '1.4' }],
  'body-lg': ['1.125rem', { lineHeight: '1.65' }],
  'body': ['1rem', { lineHeight: '1.65' }]
}
```

---

## Component Updates

### Hero Section (Hero.tsx)
- Main headline: `font-headline text-display tracking-headline`
- Subtitle: `font-body text-body-lg leading-body`
- Badge text: `font-body text-sm tracking-button`

### Dashboard (Dashboard.tsx)
- Page title: `font-headline text-h1`
- Stats/metrics: `font-metric text-3xl`
- Labels: `font-body text-sm`
- Body text: `font-body text-body leading-body`

### Features Section (Features.tsx)
- Section title: `font-headline text-h1 tracking-title`
- Card titles: `font-headline text-h3`
- Descriptions: `font-body text-body leading-body`

### Pricing Section (Pricing.tsx)
- Main headline: `font-headline text-display tracking-headline`
- Plan names: `font-headline text-h2`
- Prices: `font-metric text-4xl`
- Features list: `font-body text-sm leading-body`

### Sidebar (Sidebar.tsx)
- Section headers: `font-headline text-xs uppercase tracking-wider`
- Nav items: `font-body text-sm`

### Resume Templates (6 files)
- Headings: `font-resume-heading` (Playfair Display)
- Body text: `font-resume-body` (Lora/Source Serif)
- Name/titles: Merriweather
- Skills/labels: Space Grotesk

---

## Text Color Hierarchy

Following the existing design system colors:
- **Primary text**: `text-foreground` (#0F172A in light mode)
- **Secondary text**: `text-muted-foreground` (#64748B)
- **Accent links**: `text-secondary` (Sky Blue #38BDF8)

---

## Performance Optimization

1. **Font Display**: Use `font-display: swap` for all fonts
2. **Preconnect**: Add preconnect hints for Google Fonts
3. **Subset**: Load only required character sets (latin, latin-ext)
4. **Variable Fonts**: Consider using variable font versions where available

---

## Responsive Behavior

Typography scales automatically:
- **Desktop**: Full size scale
- **Tablet** (< 1024px): 90% scale for display/h1
- **Mobile** (< 768px): 75-80% scale for large headings

Implemented via Tailwind responsive prefixes:
```jsx
className="text-3xl md:text-4xl lg:text-display font-headline"
```

---

## Implementation Order

1. **Font Loading**: Update `index.html` with Google Fonts imports
2. **CSS Foundation**: Add CSS variables and utilities to `src/index.css`
3. **Tailwind Config**: Extend theme with font families and typography scale
4. **Global Base**: Update base body styles
5. **Component Updates**: Apply typography classes to key components:
   - Hero.tsx
   - Dashboard.tsx
   - Features.tsx
   - Pricing.tsx
   - Sidebar.tsx
   - ResumeBuilderLanding.tsx
6. **Resume Templates**: Update document fonts in all 6 template components

---

## Expected Outcome

The typography upgrade will transform the website from a generic SaaS look to a premium, product-grade experience with:
- Clear visual hierarchy
- AI-native, intelligent feel
- Excellent readability
- Consistent spacing and rhythm
- Professional resume documents
- Futuristic yet human-centered design

