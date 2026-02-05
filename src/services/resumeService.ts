 import { supabase } from '@/integrations/supabase/client';
 import type { ResumeData, TemplateId, TemplateSettings, QuestionnaireFormData } from '@/types/resume';
 
 const SUPABASE_URL = "https://gsqiupbfspkatnvvllzc.supabase.co";
 
 export interface SaveResumeParams {
   userId: string;
   title?: string;
   data: ResumeData;
   selectedTemplate: TemplateId;
   templateSettings: TemplateSettings;
   status: 'draft' | 'completed';
 }
 
 export interface GenerateResumeParams {
   formData: QuestionnaireFormData;
 }
 
 export interface GenerateResumeResponse {
   success: boolean;
   data?: ResumeData;
   error?: string;
 }
 
 export const resumeService = {
   // Generate AI-enhanced resume content
   async generateResume(params: GenerateResumeParams): Promise<GenerateResumeResponse> {
     try {
       const response = await fetch(`${SUPABASE_URL}/functions/v1/resume-generate`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
         },
         body: JSON.stringify(params.formData)
       });
 
       if (!response.ok) {
         const error = await response.json();
         throw new Error(error.message || 'Failed to generate resume');
       }
 
       const result = await response.json();
       return { success: true, data: result.data };
     } catch (error) {
       console.error('Resume generation error:', error);
       return { 
         success: false, 
         error: error instanceof Error ? error.message : 'Unknown error occurred' 
       };
     }
   },
 
   // Save resume to database
   async saveResume(params: SaveResumeParams): Promise<{ success: boolean; id?: string; error?: string }> {
     try {
      const session = await supabase.auth.getSession();
      const response = await fetch(`${SUPABASE_URL}/rest/v1/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcWl1cGJmc3BrYXRudnZsbHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTc0MzYsImV4cCI6MjA2NTc5MzQzNn0.DgNFyuAwEi2LKgiluXs1w3GMfwpyOgyX61Dojcjzb0M',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: params.userId,
          title: params.title || 'My Resume',
          personal_info: params.data.personalInfo,
          career_summary: params.data.careerSummary,
          education: params.data.education,
          skills: params.data.skills,
          projects: params.data.projects,
          experience: params.data.experience,
          certifications: params.data.certifications,
          achievements: params.data.achievements,
          selected_template: params.selectedTemplate,
          template_settings: params.templateSettings,
          status: params.status
        })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
      
      const result = await response.json();
      return { success: true, id: result[0]?.id };
     } catch (error) {
       console.error('Save resume error:', error);
       return { 
         success: false, 
         error: error instanceof Error ? error.message : 'Failed to save resume' 
       };
     }
   },
 
   // Update existing resume
   async updateResume(
     resumeId: string, 
     updates: Partial<SaveResumeParams>
   ): Promise<{ success: boolean; error?: string }> {
     try {
      const updateData: Record<string, unknown> = {};
       
       if (updates.title) updateData.title = updates.title;
       if (updates.data) {
        updateData.personal_info = updates.data.personalInfo;
         updateData.career_summary = updates.data.careerSummary;
        updateData.education = updates.data.education;
        updateData.skills = updates.data.skills;
        updateData.projects = updates.data.projects;
        updateData.experience = updates.data.experience;
        updateData.certifications = updates.data.certifications;
        updateData.achievements = updates.data.achievements;
       }
       if (updates.selectedTemplate) updateData.selected_template = updates.selectedTemplate;
      if (updates.templateSettings) updateData.template_settings = updates.templateSettings;
       if (updates.status) updateData.status = updates.status;
 
      const session = await supabase.auth.getSession();
      const response = await fetch(`${SUPABASE_URL}/rest/v1/resumes?id=eq.${resumeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcWl1cGJmc3BrYXRudnZsbHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTc0MzYsImV4cCI6MjA2NTc5MzQzNn0.DgNFyuAwEi2LKgiluXs1w3GMfwpyOgyX61Dojcjzb0M'
        },
        body: JSON.stringify(updateData)
      });
 
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
      
       return { success: true };
     } catch (error) {
       console.error('Update resume error:', error);
       return { 
         success: false, 
         error: error instanceof Error ? error.message : 'Failed to update resume' 
       };
     }
   },
 
   // Get user's resumes
   async getUserResumes(userId: string) {
     try {
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/resumes?user_id=eq.${userId}&order=updated_at.desc`,
        {
          headers: {
            'Authorization': `Bearer ${session.data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcWl1cGJmc3BrYXRudnZsbHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTc0MzYsImV4cCI6MjA2NTc5MzQzNn0.DgNFyuAwEi2LKgiluXs1w3GMfwpyOgyX61Dojcjzb0M'
          }
        }
      );
 
      if (!response.ok) throw new Error('Failed to fetch resumes');
      const data = await response.json();
      return { success: true, resumes: data as unknown[] };
     } catch (error) {
       console.error('Get resumes error:', error);
       return { success: false, resumes: [], error };
     }
   },
 
   // Get single resume by ID
   async getResumeById(resumeId: string) {
     try {
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/resumes?id=eq.${resumeId}`,
        {
          headers: {
            'Authorization': `Bearer ${session.data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcWl1cGJmc3BrYXRudnZsbHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTc0MzYsImV4cCI6MjA2NTc5MzQzNn0.DgNFyuAwEi2LKgiluXs1w3GMfwpyOgyX61Dojcjzb0M'
          }
        }
      );
 
      if (!response.ok) throw new Error('Failed to fetch resume');
      const data = await response.json();
      return { success: true, resume: data[0] || null };
     } catch (error) {
       console.error('Get resume error:', error);
       return { success: false, resume: null, error };
     }
   },
 
   // Delete resume
   async deleteResume(resumeId: string): Promise<{ success: boolean; error?: string }> {
     try {
      const session = await supabase.auth.getSession();
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/resumes?id=eq.${resumeId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzcWl1cGJmc3BrYXRudnZsbHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTc0MzYsImV4cCI6MjA2NTc5MzQzNn0.DgNFyuAwEi2LKgiluXs1w3GMfwpyOgyX61Dojcjzb0M'
          }
        }
      );
 
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }
      
       return { success: true };
     } catch (error) {
       console.error('Delete resume error:', error);
       return { 
         success: false, 
         error: error instanceof Error ? error.message : 'Failed to delete resume' 
       };
     }
   }
 };