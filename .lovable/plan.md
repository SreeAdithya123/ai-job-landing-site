
# AI Resume Builder - Implementation Plan

## Overview
Build a complete AI-powered Resume Builder that replaces the current placeholder page at `/resume-builder`. The feature will include a multi-step questionnaire, AI content generation, premium template gallery, real-time template switching, ATS optimization, and PDF export functionality.

---

## Architecture Summary

```text
+------------------+     +-------------------+     +------------------+
|  Resume Builder  | --> | AI Edge Function  | --> | Supabase Storage |
|  (React Pages)   |     | (resume-generate) |     | (JSON + PDF)     |
+------------------+     +-------------------+     +------------------+
        |                         |
        v                         v
+------------------+     +-------------------+
| Template Gallery |     | Lovable AI Gateway|
| (6 Premium       |     | (google/gemini-   |
|  Templates)      |     |  3-flash-preview) |
+------------------+     +-------------------+
```

---

## Database Schema

### New Table: `resumes`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| title | text | Resume name/version |
| personal_info | jsonb | Name, email, phone, LinkedIn, portfolio, location |
| career_summary | text | AI-generated professional summary |
| education | jsonb[] | Array of education entries |
| skills | jsonb | Categorized skills (core, tools, technologies, soft) |
| projects | jsonb[] | Array of project entries |
| experience | jsonb[] | Array of work experiences |
| certifications | jsonb[] | Array of certifications |
| achievements | jsonb[] | Array of achievements/activities |
| selected_template | text | Template ID |
| template_settings | jsonb | Color theme, font style |
| status | text | draft / completed |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

RLS Policies:
- Users can CRUD their own resumes
- No public access

---

## Component Structure

```text
src/
  pages/
    ResumeBuilder.tsx              # Main orchestrator page
  components/
    resume-builder/
      ResumeBuilderLanding.tsx     # Hero + CTA section
      ResumeQuestionnaire.tsx      # Multi-step form wizard
      QuestionnaireSteps/
        PersonalInfoStep.tsx       # Step 1: Personal details
        CareerSummaryStep.tsx      # Step 2: Career goals (AI-assisted)
        EducationStep.tsx          # Step 3: Education entries
        SkillsStep.tsx             # Step 4: Skills input
        ProjectsStep.tsx           # Step 5: Projects (AI-enhanced)
        ExperienceStep.tsx         # Step 6: Work experience
        CertificationsStep.tsx     # Step 7: Certifications
        AchievementsStep.tsx       # Step 8: Achievements
      ResumeGeneration.tsx         # AI generation loader
      TemplateGallery.tsx          # Template selection grid
      TemplatePreview.tsx          # Live resume preview
      ResumeTemplates/
        ModernCorporate.tsx        # Template 1
        MinimalProfessional.tsx    # Template 2
        CreativeDesigner.tsx       # Template 3
        TechnicalEngineer.tsx      # Template 4
        AcademicOverleaf.tsx       # Template 5
        ExecutiveResume.tsx        # Template 6
      ResumeExport.tsx             # PDF/DOCX export controls
```

---

## User Flow Implementation

### Phase 1: Landing Screen
- Hero section with gradient background
- Title: "Build Your Resume with AI Precision"
- Subtitle: "ATS-optimized. Recruiter-ready. Designed to stand out."
- "Start Building" CTA button
- Feature cards showcasing capabilities

### Phase 2: Multi-Step Questionnaire
A wizard-style form with:
- Progress bar at top (8 steps)
- Step navigation (Previous/Next)
- Auto-save draft to localStorage
- Form validation using Zod schemas

**Step Details:**
1. **Personal Information**: Name, phone, email, LinkedIn, portfolio, location
2. **Career Summary**: AI asks targeted questions, generates professional summary
3. **Education**: Dynamic form for multiple degrees
4. **Skills**: Tag-based input with AI categorization
5. **Projects**: Multi-entry with AI description enhancement
6. **Experience**: Work history with AI bullet point optimization
7. **Certifications**: Simple multi-entry form
8. **Achievements**: Awards, hackathons, leadership roles

### Phase 3: AI Resume Generation
- Animated loader: "Designing your professional resume..."
- Edge function processes all form data
- AI enhances content with ATS-optimized terminology
- Returns structured resume JSON

### Phase 4: Template Gallery
- 6 premium templates in a responsive grid
- Each card shows:
  - Template preview thumbnail
  - Template name
  - Color theme indicator
- Click to select and apply

### Phase 5: Template Customization
- Live preview panel
- Template switcher (instant, no regeneration)
- Color theme picker
- Font style selector

### Phase 6: Export
- Download PDF button (using jsPDF)
- Share link option
- Save to account

---

## Edge Function: `resume-generate`

**Location:** `supabase/functions/resume-generate/index.ts`

**Responsibilities:**
1. Receive questionnaire data from frontend
2. Call Lovable AI Gateway (google/gemini-3-flash-preview)
3. Generate:
   - Professional summary from career goals
   - Enhanced project descriptions with action verbs
   - Corporate-style experience bullet points
   - ATS-optimized content integration
4. Return structured resume JSON

**ATS Keywords Integration:**
The AI prompt will naturally embed terminology like:
- "Cross-functional collaboration"
- "Scalable system design"
- "Data-driven decision making"
- "Agile development lifecycle"
- "Performance optimization"

---

## Template System Design

Each template component receives the same `resumeData` prop and renders it differently:

```typescript
interface ResumeData {
  personalInfo: PersonalInfo;
  careerSummary: string;
  education: Education[];
  skills: SkillCategories;
  projects: Project[];
  experience: Experience[];
  certifications: Certification[];
  achievements: Achievement[];
}

interface TemplateSettings {
  colorTheme: 'blue' | 'green' | 'purple' | 'gray' | 'teal';
  fontStyle: 'inter' | 'roboto' | 'helvetica' | 'sora';
}
```

Templates are pure React components that:
- Accept resume data and settings
- Render styled HTML
- Are print-friendly (CSS @media print)
- Export to PDF via html-to-canvas + jsPDF

---

## PDF Export Implementation

Using jsPDF (already installed v3.0.0):
1. Capture template HTML using html-to-canvas
2. Convert to PDF maintaining layout
3. Ensure ATS readability (text-based, not image-based)
4. Trigger download

---

## Responsiveness

- Desktop: Side-by-side preview + form
- Tablet: Stacked sections with toggle
- Mobile: Scroll wizard with sticky progress bar

---

## Technical Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/ResumeBuilder.tsx` | Complete rewrite of main page |
| `src/components/resume-builder/ResumeBuilderLanding.tsx` | Landing hero |
| `src/components/resume-builder/ResumeQuestionnaire.tsx` | Multi-step form |
| `src/components/resume-builder/QuestionnaireSteps/*.tsx` | 8 step components |
| `src/components/resume-builder/ResumeGeneration.tsx` | AI generation loader |
| `src/components/resume-builder/TemplateGallery.tsx` | Template grid |
| `src/components/resume-builder/TemplatePreview.tsx` | Live preview |
| `src/components/resume-builder/ResumeTemplates/*.tsx` | 6 template components |
| `src/components/resume-builder/ResumeExport.tsx` | Export controls |
| `src/hooks/useResumeBuilder.ts` | State management hook |
| `src/types/resume.ts` | TypeScript interfaces |
| `src/services/resumeService.ts` | API service layer |
| `supabase/functions/resume-generate/index.ts` | AI edge function |

### Files to Modify

| File | Changes |
|------|---------|
| `supabase/config.toml` | Add `[functions.resume-generate]` config |
| `src/App.tsx` | No changes needed (route exists) |

### Database Migration

```sql
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My Resume',
  personal_info JSONB NOT NULL DEFAULT '{}',
  career_summary TEXT,
  education JSONB DEFAULT '[]',
  skills JSONB DEFAULT '{}',
  projects JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  selected_template TEXT DEFAULT 'modern-corporate',
  template_settings JSONB DEFAULT '{"colorTheme": "blue", "fontStyle": "inter"}',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes" ON public.resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes" ON public.resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON public.resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON public.resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Implementation Order

1. **Database Setup**: Create `resumes` table with RLS policies
2. **Types & Services**: Create TypeScript interfaces and service layer
3. **Edge Function**: Build `resume-generate` with Lovable AI integration
4. **Landing Page**: Build the hero and CTA section
5. **Questionnaire Steps**: Build all 8 form steps with validation
6. **AI Generation**: Build the generation loader and integration
7. **Template System**: Build 6 template components
8. **Template Gallery**: Build selection UI with live switching
9. **PDF Export**: Implement jsPDF export functionality
10. **Polish**: Add responsiveness, animations, error handling

---

## Estimated Scope

- ~20 new files
- ~2,500-3,000 lines of code
- 1 new database table
- 1 new edge function
- Full integration with existing auth and subscription system
