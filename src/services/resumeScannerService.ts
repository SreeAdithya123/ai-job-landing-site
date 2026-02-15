import { supabase } from '@/integrations/supabase/client';

export interface SectionScore {
  score: number;
  feedback: string;
}

export interface Suggestion {
  priority: 'high' | 'medium' | 'low';
  category: string;
  text: string;
}

export interface ScanResult {
  overallScore: number;
  sections: {
    contactInfo: SectionScore;
    summary: SectionScore;
    experience: SectionScore;
    skills: SectionScore;
    education: SectionScore;
    keywords: SectionScore;
    formatting: SectionScore;
  };
  suggestions: Suggestion[];
  missingKeywords: string[];
  strengths: string[];
  summary_text: string;
}

export async function scanResume(resumeText: string, targetRole?: string): Promise<ScanResult> {
  const { data, error } = await supabase.functions.invoke('resume-scanner', {
    body: { resumeText, targetRole },
  });

  if (error) throw new Error(error.message || 'Failed to scan resume');
  if (data?.error) throw new Error(data.error);
  return data as ScanResult;
}
