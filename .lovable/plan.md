

# Claymorphism UI Overhaul + OpenAI Integration + Report Charts

## Overview

Three major changes: (1) switch to a light-only claymorphism design system across all pages, (2) replace AI backends (chatbots, resume scanner, resume builder) with OpenAI via a direct API key, and (3) embed visual charts (pie charts, graphs) into the downloadable PDF reports.

---

## Part 1: Claymorphism Light-Only Theme

Claymorphism is a soft, 3D-embossed look with pastel backgrounds, rounded corners, and layered inner/outer shadows that make elements look like sculpted clay.

### What changes

**Global CSS (`src/index.css`)**
- Remove the entire `.dark` block (no dark mode)
- Update `:root` light variables for a warmer, pastel-tinted background (e.g., `--background: 220 20% 97%`, slightly warm white)
- Keep primary Neural Indigo and accent colors

**Tailwind Config (`tailwind.config.ts`)**
- Remove `darkMode: ["class"]`
- Add claymorphism shadow utilities:
  - `clay`: outer shadow + inset highlight creating a 3D raised effect
  - `clay-pressed`: inset shadow for pressed/active states

**Utility Classes (`src/index.css`)**
- Replace `.glass-card` with `.clay-card` using:
  ```
  background: hsl(var(--card));
  border-radius: 1.25rem;
  box-shadow:
    8px 8px 16px rgba(0,0,0,0.08),
    -4px -4px 12px rgba(255,255,255,0.9),
    inset 1px 1px 2px rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.5);
  ```
- Replace `.glass-panel` similarly
- Update `.btn-primary` and `.btn-secondary` with clay-style shadows
- Update `.input-field` with subtle inset shadow

**Remove Theme Toggle**
- Remove `ThemeToggle` component from `Sidebar.tsx` and `Index.tsx`
- Remove the dark-mode blocking script from `index.html`
- Can keep the ThemeToggle component file but not import/use it

### Pages to update (hardcoded colors to semantic tokens)

These pages have hardcoded `bg-white`, `border-gray-200`, `text-gray-600`, etc. that break consistency:

| Page | Issues |
|------|--------|
| `Recruiters.tsx` | `bg-white`, `border-gray-100`, `text-gray-600` throughout |
| `InterviewHistory.tsx` | `bg-white/80`, `border-gray-200`, `text-gray-600`, `bg-gray-100` |
| `MaterialGenerator.tsx` | `border-gray-200`, `divide-gray-200`, `bg-white/50` |
| `InterviewDetailsModal.tsx` | `bg-white`, `border-gray-200`, `bg-gray-50`, `bg-blue-50`, `bg-purple-50`, `bg-green-50`, `text-gray-600` |
| `AptitudeTest.tsx` | `to-slate-50` gradient endings |
| `Auth.tsx` | `border-white/20`, `to-slate-50` |

All will be converted to use `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-muted` and the new `clay-card` utility.

Every `.glass-card` usage across all components will be replaced with `.clay-card`.

---

## Part 2: OpenAI API Integration

The user wants their own OpenAI API key. We will:

1. **Add the secret**: Use the secrets tool to request the user's `OPENAI_API_KEY`
2. **Update edge functions** to call OpenAI directly instead of OpenRouter/Lovable Gateway

### Functions to update

**`unified-ai-api/index.ts`** (chatbots + interview analysis)
- Replace OpenRouter model list and Lovable Gateway fallback with a direct call to `https://api.openai.com/v1/chat/completions`
- Use model `gpt-4o-mini` for chat (career-coach, recruiter-chat) -- fast and cheap
- Use model `gpt-4o` for interview-analysis -- higher quality
- Keep streaming for chat types
- Remove OpenRouter headers and API key usage

**`resume-scanner/index.ts`**
- Replace OpenRouter call with direct OpenAI call
- Use `gpt-4o-mini` (good for structured JSON output)
- Keep the same prompt and JSON parsing logic

**`resume-generate/index.ts`**
- Already uses Lovable AI Gateway; switch to OpenAI directly
- Use `gpt-4o-mini` with `response_format: { type: "json_object" }`
- Keep the same prompt structure and fallback logic

### All three functions will follow this pattern:
```typescript
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [...],
    stream: true/false
  })
});
```

---

## Part 3: Charts in PDF Reports

Currently, `Dashboard.tsx`'s `generatePDFReport` function only outputs tables. We'll add visual charts using `html2canvas` (already installed).

### Approach
- Before generating the PDF, temporarily render chart components into a hidden container
- Use `html2canvas` to capture them as images
- Embed those images into the PDF using `doc.addImage()`

### Charts to add to the report
1. **Score Progression Line Chart** -- from `ScoreProgressChart`
2. **Interview Types Pie Chart** -- from `ProgressTracking`
3. **Skills Performance Bar Chart** -- from `FeedbackSummaryCharts`
4. **Weekly Activity Bar Chart** -- from `ProgressTracking`

### Implementation in `Dashboard.tsx`
- Create a hidden `div` (off-screen, `position: absolute; left: -9999px`) containing the Recharts components with the same data
- After rendering, use `html2canvas(element)` to capture each chart
- Insert the canvas as a PNG image into the PDF at appropriate positions
- Remove the hidden container after PDF generation

---

## File Change Summary

| File | Changes |
|------|---------|
| `src/index.css` | Remove `.dark` block, add clay-card utilities, update glass-card |
| `tailwind.config.ts` | Remove darkMode, add clay shadows |
| `index.html` | Remove dark-mode blocking script |
| `src/components/Sidebar.tsx` | Remove ThemeToggle import/usage |
| `src/pages/Index.tsx` | Remove ThemeToggle import/usage |
| `src/pages/Recruiters.tsx` | Replace hardcoded colors with semantic tokens + clay-card |
| `src/pages/InterviewHistory.tsx` | Replace hardcoded colors with semantic tokens + clay-card |
| `src/pages/MaterialGenerator.tsx` | Replace hardcoded colors + clay-card |
| `src/components/InterviewDetailsModal.tsx` | Replace hardcoded bg-white/gray colors + clay-card |
| `src/pages/AptitudeTest.tsx` | Replace slate-50 gradients + clay-card |
| `src/pages/Auth.tsx` | Replace glass references with clay + fix hardcoded colors |
| `src/pages/Dashboard.tsx` | Add chart image generation for PDF reports |
| `src/pages/CareerCoach.tsx` | Update to clay-card styling |
| `src/pages/Profile.tsx` | Update to clay-card styling |
| `src/pages/Payments.tsx` | Update to clay-card styling |
| `src/components/ChatBot.tsx` | Update to clay-card styling |
| `src/components/ProgressTracking.tsx` | Update glass-card to clay-card |
| `src/components/Hero.tsx` | Update glass-card to clay-card |
| `src/components/Features.tsx` | Update glass-card to clay-card |
| `src/components/Pricing.tsx` | Update glass-card to clay-card |
| `src/components/RecentInterviewAnalyses.tsx` | Update glass-card to clay-card |
| `src/components/SubscriptionCard.tsx` | Update glass-card to clay-card |
| `src/components/Layout.tsx` | Update to clay-card sidebar styling |
| `supabase/functions/unified-ai-api/index.ts` | Switch to OpenAI API |
| `supabase/functions/resume-scanner/index.ts` | Switch to OpenAI API |
| `supabase/functions/resume-generate/index.ts` | Switch to OpenAI API |

### Secrets needed
- `OPENAI_API_KEY` -- user will be asked to provide this

