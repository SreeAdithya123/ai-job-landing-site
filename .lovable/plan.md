
# Hide Nav Items, Remove Templates, and Build Resume Scanner

## Part 1: Hide Voice Interviewer and Virtual Interviewer

### Sidebar (`src/components/Sidebar.tsx`)
- Remove the `Voice Interviewer` (`/interviewer`) item from the Interview section
- Remove the `Virtual Interviewer` (`/virtual-interviewer`) item from the Interview section

### Dashboard (`src/pages/Dashboard.tsx`)
- Remove the "Virtual Interviewer" card (lines 457-477) from the Quick Actions grid
- Make the AI Interviewer card full-width since it will be the only one

---

## Part 2: Remove Executive Resume and Technical Engineer Templates

### Files to update:
1. **`src/components/resume-builder/TemplateGallery.tsx`** -- Remove `technical-engineer` and `executive-resume` from the templates array
2. **`src/components/resume-builder/TemplatePreview.tsx`** -- Remove those two options from `templateOptions` and remove their `case` branches from `renderTemplate()`. Remove imports for `TechnicalEngineer` and `ExecutiveResume`
3. **`src/types/resume.ts`** -- Remove `'technical-engineer'` and `'executive-resume'` from the `TemplateId` type union

The actual template component files (`TechnicalEngineer.tsx`, `ExecutiveResume.tsx`) can remain in the codebase but won't be referenced anywhere.

---

## Part 3: Build a Real Resume Scanner (Replace External Link)

Currently `/resume-scanner` just links to an external website. We will rebuild it as a fully functional in-app feature.

### How It Works

```text
User uploads PDF/DOCX resume (as text)
        |
        v
Edge function "resume-scanner" receives text
        |
        v
OpenRouter AI analyzes resume for ATS compatibility
        |
        v
Returns JSON: ATS score, section scores, suggestions
        |
        v
Frontend displays results with score chart and recommendations
```

### New Edge Function: `supabase/functions/resume-scanner/index.ts`
- Accepts `{ resumeText: string, targetRole?: string }` 
- Uses the existing `OPENROUTER_API_KEY` secret (already configured)
- Sends resume text to OpenRouter with a detailed prompt asking for:
  - Overall ATS score (0-100)
  - Section scores: Contact Info, Summary, Experience, Skills, Education, Keywords, Formatting
  - Specific improvement suggestions with priority levels
  - Missing keywords for the target role
- Returns structured JSON response

### Rebuilt Page: `src/pages/ResumeScanner.tsx`
Complete rewrite with these sections:

1. **Upload Area** -- Text paste area (textarea) where users paste their resume content, plus optional "Target Role" input field
2. **Scan Button** -- Calls the edge function with the pasted text
3. **Results Display**:
   - Large circular ATS score gauge (0-100) with color coding (red/yellow/green)
   - Section-by-section breakdown with individual scores and progress bars
   - Prioritized list of improvement suggestions (high/medium/low)
   - Missing keywords section
4. **Theme-compatible UI** -- Uses semantic Tailwind tokens (`bg-card`, `text-foreground`, `border-border`, etc.)

### Service Layer: `src/services/resumeScannerService.ts`
- `scanResume(resumeText: string, targetRole?: string)` function
- Calls the `resume-scanner` edge function via Supabase client
- Returns typed response with scores and suggestions

---

## Files to Create (2)
1. `supabase/functions/resume-scanner/index.ts`
2. `src/services/resumeScannerService.ts`

## Files to Modify (5)
1. `src/components/Sidebar.tsx` -- Remove Voice + Virtual Interviewer links
2. `src/pages/Dashboard.tsx` -- Remove Virtual Interviewer card
3. `src/components/resume-builder/TemplateGallery.tsx` -- Remove 2 templates
4. `src/components/resume-builder/TemplatePreview.tsx` -- Remove 2 templates from options and render
5. `src/types/resume.ts` -- Remove 2 template IDs from type
6. `src/pages/ResumeScanner.tsx` -- Complete rewrite with in-app scanner UI
7. `supabase/config.toml` -- Add resume-scanner function config
