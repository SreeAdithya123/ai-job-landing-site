

# Fix Dark/Light Theme UI Issues Across All Pages

## Problem Summary
Many components use hardcoded colors (`text-white`, `bg-slate-800`, `bg-gray-50`, `text-gray-900`, etc.) instead of semantic Tailwind CSS variables (`text-foreground`, `bg-background`, `bg-card`, `border-border`, `text-muted-foreground`). This causes terrible UI in dark mode on some pages and washed-out appearance on others.

## Affected Pages and Components

### High Priority (Broken in dark/light mode)

| File | Issue |
|------|-------|
| `CareerCoach.tsx` | Hardcoded `text-white`, `bg-slate-800`, `border-slate-700` everywhere -- looks broken in light mode |
| `ChatBot.tsx` | `bg-white`, `border-gray-200`, `bg-gray-100`, `text-gray-900` -- invisible text in dark mode |
| `InterviewCopilot.tsx` | Main page uses `from-slate-50 via-white to-slate-100` -- invisible in dark mode |
| `InterviewHeader.tsx` | `bg-white/80`, `text-slate-600`, `border-slate-200` -- broken in dark mode |
| `InterviewTypeCard.tsx` | `bg-white/80`, `text-slate-800`, `border-slate-200` -- broken in dark mode |
| `InterviewSessionsPanel.tsx` | `bg-white/80`, `text-slate-800`, `border-slate-200` -- broken in dark mode |
| `InterviewActiveInterface.tsx` | Hardcoded `from-slate-900` dark bg -- broken in light mode |
| `MockInterview.tsx` | `bg-gray-50`, `bg-white`, `text-gray-900` -- broken in dark mode |
| `Profile.tsx` | Hardcoded `from-slate-900` dark bg -- broken in light mode |
| `ResumeQuestionnaire.tsx` | `bg-slate-900/95`, `border-slate-800`, `text-slate-400` -- broken in light mode |
| `PersonalInfoStep.tsx` | `text-white`, `bg-slate-800/50`, `border-slate-700` -- broken in light mode |
| `ResumeBuilder.tsx` | `bg-slate-900/95`, `border-slate-800` header -- broken in light mode |
| `Hero.tsx` | `to-slate-50` gradient -- slight issue in dark mode |
| `Payments.tsx` | `from-slate-100 to-slate-200` icon bg -- minor issue in dark mode |

### Low Priority (Already mostly correct)
- `Dashboard.tsx` -- uses semantic variables, mostly fine
- `Sidebar.tsx` -- already fixed
- `Footer.tsx` -- intentionally dark, acceptable

## Solution Strategy

Replace all hardcoded colors with semantic Tailwind CSS variables that automatically adapt to light/dark themes:

| Hardcoded | Replace With |
|-----------|-------------|
| `text-white` / `text-gray-900` / `text-slate-800` | `text-foreground` |
| `text-gray-600` / `text-slate-400` / `text-slate-600` | `text-muted-foreground` |
| `bg-white` / `bg-gray-50` / `bg-slate-50` | `bg-background` or `bg-card` |
| `bg-slate-800` / `bg-slate-900` | `bg-card` or `bg-muted` |
| `border-gray-200` / `border-slate-200` / `border-slate-700` | `border-border` |
| `bg-gray-100` / `bg-slate-100` | `bg-muted` |
| `bg-white/80 backdrop-blur` | `bg-card/80 backdrop-blur` (glass effect) |

## Detailed Changes

### 1. CareerCoach.tsx
- Header: `bg-slate-800/30` -> `bg-card/80 backdrop-blur-md border-b border-border`
- Back button: `bg-slate-800/50 border-slate-700` -> `bg-muted border-border`
- Text: `text-white` -> `text-foreground`, `text-slate-400` -> `text-muted-foreground`
- Feature cards: `bg-slate-800/50 border-slate-700` -> `glass-card`
- Settings/Dashboard buttons: use semantic colors

### 2. ChatBot.tsx
- Container: `bg-white border-gray-200` -> `bg-card border-border`
- Bot messages: `bg-gray-100 text-gray-900` -> `bg-muted text-foreground`
- User avatar: `bg-gray-300` -> `bg-muted`
- Loading: `text-gray-600` -> `text-muted-foreground`
- Input border: `border-gray-200` -> `border-border`

### 3. InterviewCopilot.tsx
- Main bg: `from-slate-50 via-white to-slate-100` -> `bg-background`

### 4. InterviewHeader.tsx
- Header bg: `bg-white/80` -> `bg-card/80 backdrop-blur-md border-b border-border`
- Text: `text-slate-600`/`text-slate-700` -> `text-muted-foreground`/`text-foreground`
- Buttons: `bg-white/60 border-slate-300` -> `bg-muted/60 border-border`

### 5. InterviewTypeCard.tsx
- Card: `bg-white/80` -> `bg-card/80`
- Text: `text-slate-800` -> `text-foreground`, `text-slate-600` -> `text-muted-foreground`
- Border: `border-slate-200` -> `border-border`

### 6. InterviewSessionsPanel.tsx
- Container: `bg-white/80 border-slate-200` -> `bg-card/80 border-border`
- Text: `text-slate-800` -> `text-foreground`, `text-slate-600` -> `text-muted-foreground`
- Hover: `hover:bg-slate-50` -> `hover:bg-muted`

### 7. InterviewActiveInterface.tsx
- Main bg: `from-slate-900 via-slate-800 to-slate-900` -> `bg-background`
- Header: `bg-slate-800/30 border-slate-700` -> `bg-card/80 backdrop-blur-md border-border`
- Buttons: `bg-slate-800/50 border-slate-700` -> `bg-muted border-border`
- Text: `text-white` -> `text-foreground`, `text-slate-300`/`text-slate-400` -> `text-muted-foreground`

### 8. MockInterview.tsx
- Main bg: `bg-gray-50` -> `bg-background`
- Cards: `bg-white border-gray-200` -> `bg-card border-border`
- Text: `text-gray-900` -> `text-foreground`, `text-gray-600` -> `text-muted-foreground`
- Active interview section: same dark-to-semantic conversion

### 9. Profile.tsx
- Main bg: `from-slate-900 via-slate-800` -> `bg-background`
- Cards: `bg-slate-800/50 border-slate-700` -> `glass-card`
- Text: `text-white` -> `text-foreground`

### 10. ResumeQuestionnaire.tsx
- Header/Footer: `bg-slate-900/95 border-slate-800` -> `bg-card/95 backdrop-blur-md border-border`
- Text: `text-slate-400` -> `text-muted-foreground`
- Buttons: `border-slate-700 text-slate-300 hover:bg-slate-800` -> `border-border text-muted-foreground hover:bg-muted`

### 11. PersonalInfoStep.tsx (and other questionnaire steps)
- Headings: `text-white` -> `text-foreground`
- Labels: `text-white` -> `text-foreground`
- Inputs: `bg-slate-800/50 border-slate-700 text-white` -> `bg-muted/50 border-border text-foreground`
- Descriptions: `text-slate-400` -> `text-muted-foreground`

### 12. ResumeBuilder.tsx
- Header: `bg-slate-900/95 border-slate-800` -> `bg-card/95 backdrop-blur-md border-border`
- Buttons: `text-slate-400 hover:text-white` -> `text-muted-foreground hover:text-foreground`
- Title: `text-white` -> `text-foreground`

### 13. Hero.tsx
- Background gradient: `to-slate-50` -> remove, use `bg-background`

### 14. Payments.tsx
- Icon backgrounds: `from-slate-100 to-slate-200 text-slate-600` -> `from-muted to-muted text-muted-foreground`
- Background gradient: `via-slate-50/50` -> clean up

## Files to Modify (16 total)

1. `src/pages/CareerCoach.tsx`
2. `src/components/ChatBot.tsx`
3. `src/pages/InterviewCopilot.tsx`
4. `src/components/interview/InterviewHeader.tsx`
5. `src/components/interview/InterviewTypeCard.tsx`
6. `src/components/interview/InterviewSessionsPanel.tsx`
7. `src/components/interview/InterviewActiveInterface.tsx`
8. `src/pages/MockInterview.tsx`
9. `src/pages/Profile.tsx`
10. `src/components/resume-builder/ResumeQuestionnaire.tsx`
11. `src/components/resume-builder/QuestionnaireSteps/PersonalInfoStep.tsx`
12. `src/pages/ResumeBuilder.tsx`
13. `src/components/Hero.tsx`
14. `src/pages/Payments.tsx`
15. Other questionnaire steps (Education, Skills, Experience, etc.) -- same pattern as PersonalInfoStep

## Expected Outcome
- All pages render correctly in both light and dark themes
- No invisible text, no washed-out backgrounds
- Consistent, polished look using the AI Neural Light design system
- Smooth theme transitions across every page

