
# Claymorphism UI Consistency Fix + Material Generator OpenAI Integration

## Overview
Two tasks: (1) Fix remaining UI inconsistencies across all pages by replacing leftover `glass-card` references and hardcoded colors with the claymorphism system, and (2) update the `material-generator` edge function to use the user's OpenAI API key directly.

---

## Part 1: Replace All Remaining `glass-card` with `clay-card`

Several components still use `glass-card` instead of `clay-card`. These need to be updated:

| File | Occurrences |
|------|-------------|
| `src/pages/Dashboard.tsx` | Lines 399, 436 - welcome card and AI Interviewer card |
| `src/components/ProgressTracking.tsx` | Lines 134, 158, 197, 224, 255, 291 - all stat/chart/skill cards |
| `src/components/RecentInterviewAnalyses.tsx` | Lines 36, 56, 74 - loading, error, empty states |
| `src/components/SubscriptionCard.tsx` | Lines 17, 65 - main card wrapper |
| `src/components/interview/InterviewHero.tsx` | Line 52 - feature cards |
| `src/components/WhyAIInterviewer.tsx` | Lines 58, 88 - feature cards |
| `src/components/CareersSection.tsx` | Lines 65, 87, 107, 126, 135 - multiple cards |
| `src/components/OutputDisplay.tsx` | Line 72 - output container |

## Part 2: Fix Hardcoded Colors in Remaining Files

| File | Issues | Fix |
|------|--------|-----|
| `src/components/UploadModal.tsx` | `glass-card`, `border-white/20`, `hover:bg-gray-100`, `text-gray-500`, `border-gray-300`, `bg-green-50`, `text-green-800/600`, `text-gray-700/500/400`, `bg-white`, `border-gray-200`, `hover:bg-gray-50`, `bg-blue-50`, `border-blue-200`, `text-blue-900/700/600`, `text-gray-700` | Replace with semantic tokens |
| `src/components/OutputDisplay.tsx` | `glass-card`, `border-gray-200`, `text-gray-700` | Replace with semantic tokens |
| `src/pages/AptitudeTest.tsx` | `to-slate-50` gradient endings (lines 297, 443, 468, 592) | Replace with `to-background` |
| `src/pages/CareerCoach.tsx` | `from-blue-500 to-blue-600`, `from-red-500 to-red-600` hardcoded button colors | Replace with semantic primary/destructive |

## Part 3: Material Generator - OpenAI Integration

The `material-generator` edge function currently uses an `OPENAI_API_KEY` environment variable but the user has already added this secret. The function code itself already calls `api.openai.com` correctly, so it should work. However, I'll verify and ensure it matches the same pattern as the other updated edge functions for consistency.

No changes needed to the edge function code itself -- it already uses `OPENAI_API_KEY` from `Deno.env.get()` and calls OpenAI directly. The secret was already added in the previous step.

---

## File Change Summary

| File | Changes |
|------|---------|
| `src/pages/Dashboard.tsx` | Replace `glass-card` with `clay-card` (2 occurrences) |
| `src/components/ProgressTracking.tsx` | Replace `glass-card` with `clay-card` (6 occurrences) |
| `src/components/RecentInterviewAnalyses.tsx` | Replace `glass-card` with `clay-card` (3 occurrences) |
| `src/components/SubscriptionCard.tsx` | Replace `glass-card` with `clay-card` (2 occurrences) |
| `src/components/interview/InterviewHero.tsx` | Replace `glass-card` with `clay-card` (1 occurrence) |
| `src/components/WhyAIInterviewer.tsx` | Replace `glass-card` with `clay-card` (2 occurrences) |
| `src/components/CareersSection.tsx` | Replace `glass-card` with `clay-card` (5 occurrences) |
| `src/components/OutputDisplay.tsx` | Replace `glass-card` with `clay-card`, fix hardcoded gray colors |
| `src/components/UploadModal.tsx` | Replace `glass-card` with `clay-card`, replace all hardcoded gray/white/blue colors with semantic tokens |
| `src/pages/AptitudeTest.tsx` | Replace `to-slate-50` with `to-background` (4 occurrences) |
| `src/pages/CareerCoach.tsx` | Replace hardcoded blue/red button gradients with semantic `from-primary to-primary-hover` and `from-destructive to-destructive` |

No edge function changes needed -- `material-generator` already uses OpenAI correctly with the `OPENAI_API_KEY` secret.
