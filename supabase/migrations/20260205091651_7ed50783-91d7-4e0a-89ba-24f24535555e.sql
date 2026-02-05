-- Create resumes table for AI Resume Builder
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
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

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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