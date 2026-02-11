 import { useState, useCallback, useEffect } from 'react';
 import { useAuth } from '@/contexts/AuthContext';
 import { resumeService } from '@/services/resumeService';
import {
  QUESTIONNAIRE_STEPS,
  type ResumeBuilderStep,
  type QuestionnaireFormData,
  type ResumeData,
  type TemplateId,
  type TemplateSettings,
  type PersonalInfo,
  type CareerInfo,
  type SkillCategories,
} from '@/types/resume';

// Removed unused imports:
// Education, Project, Experience, Certification, Achievement
// These are used via QuestionnaireFormData and ResumeData

export type {
   ResumeBuilderStep,
   QuestionnaireFormData,
   ResumeData,
   TemplateId,
   TemplateSettings,
};
 
 const STORAGE_KEY = 'resume-builder-draft';
 
 const initialPersonalInfo: PersonalInfo = {
   fullName: '',
   email: '',
   phone: '',
   linkedin: '',
   portfolio: '',
   location: ''
 };
 
 const initialCareerInfo: CareerInfo = {
   targetRole: '',
   yearsOfExperience: '',
   keyStrengths: [],
   careerObjective: ''
 };
 
 const initialSkills: SkillCategories = {
   core: [],
   tools: [],
   technologies: [],
   soft: []
 };
 
 const initialFormData: QuestionnaireFormData = {
   personalInfo: initialPersonalInfo,
   careerInfo: initialCareerInfo,
   education: [],
   skills: initialSkills,
   projects: [],
   experience: [],
   certifications: [],
   achievements: []
 };
 
 const initialTemplateSettings: TemplateSettings = {
   colorTheme: 'blue',
   fontStyle: 'inter'
 };
 
 export function useResumeBuilder() {
   const { user } = useAuth();
   const [currentStep, setCurrentStep] = useState<ResumeBuilderStep>('landing');
   const [formData, setFormData] = useState<QuestionnaireFormData>(initialFormData);
   const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null);
   const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern-corporate');
   const [templateSettings, setTemplateSettings] = useState<TemplateSettings>(initialTemplateSettings);
   const [isGenerating, setIsGenerating] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [savedResumeId, setSavedResumeId] = useState<string | null>(null);
 
   // Load draft from localStorage on mount
   useEffect(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.formData) {
            // Merge with defaults to handle missing fields from older drafts
            const merged: QuestionnaireFormData = {
              ...initialFormData,
              ...parsed.formData,
              skills: {
                ...initialSkills,
                ...(parsed.formData.skills || {}),
              },
              careerInfo: {
                ...initialCareerInfo,
                ...(parsed.formData.careerInfo || {}),
                keyStrengths: parsed.formData.careerInfo?.keyStrengths || [],
              },
            };
            setFormData(merged);
          }
         if (parsed.currentStep && parsed.currentStep !== 'landing') {
           // Don't auto-restore to generating or beyond
           const questionnaireSteps: ResumeBuilderStep[] = [
             'personal-info', 'career-summary', 'education', 'skills',
             'projects', 'experience', 'certifications', 'achievements'
           ];
           if (questionnaireSteps.includes(parsed.currentStep)) {
             setCurrentStep(parsed.currentStep);
           }
         }
       }
     } catch (e) {
       console.error('Failed to load draft:', e);
     }
   }, []);
 
   // Save draft to localStorage on form changes
   useEffect(() => {
     if (currentStep !== 'landing' && currentStep !== 'generating') {
       try {
         localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
       } catch (e) {
         console.error('Failed to save draft:', e);
       }
     }
   }, [formData, currentStep]);
 
   // Update form data for a specific section
   const updateFormData = useCallback(<K extends keyof QuestionnaireFormData>(
     key: K,
     value: QuestionnaireFormData[K]
   ) => {
     setFormData(prev => ({ ...prev, [key]: value }));
   }, []);
 
   // Navigation
   const goToStep = useCallback((step: ResumeBuilderStep) => {
     setCurrentStep(step);
     setError(null);
   }, []);
 
   const goToNextStep = useCallback(() => {
     const questionnaireSteps: ResumeBuilderStep[] = [
       'personal-info', 'career-summary', 'education', 'skills',
       'projects', 'experience', 'certifications', 'achievements'
     ];
     const currentIndex = questionnaireSteps.indexOf(currentStep);
     
     if (currentIndex === questionnaireSteps.length - 1) {
       // Last questionnaire step, go to generating
       setCurrentStep('generating');
     } else if (currentIndex >= 0) {
       setCurrentStep(questionnaireSteps[currentIndex + 1]);
     }
   }, [currentStep]);
 
   const goToPreviousStep = useCallback(() => {
     const questionnaireSteps: ResumeBuilderStep[] = [
       'personal-info', 'career-summary', 'education', 'skills',
       'projects', 'experience', 'certifications', 'achievements'
     ];
     const currentIndex = questionnaireSteps.indexOf(currentStep);
     
     if (currentIndex > 0) {
       setCurrentStep(questionnaireSteps[currentIndex - 1]);
     } else if (currentIndex === 0) {
       setCurrentStep('landing');
     }
   }, [currentStep]);
 
   // Get current step index (for progress bar)
   const getCurrentStepIndex = useCallback(() => {
     const questionnaireSteps: ResumeBuilderStep[] = [
       'personal-info', 'career-summary', 'education', 'skills',
       'projects', 'experience', 'certifications', 'achievements'
     ];
     return questionnaireSteps.indexOf(currentStep);
   }, [currentStep]);
 
   // Generate resume with AI
   const generateResume = useCallback(async () => {
     setIsGenerating(true);
     setError(null);
     setCurrentStep('generating');
 
     try {
       const result = await resumeService.generateResume({ formData });
       
       if (result.success && result.data) {
         setGeneratedResume(result.data);
         setCurrentStep('template-gallery');
         // Clear draft after successful generation
         localStorage.removeItem(STORAGE_KEY);
       } else {
         setError(result.error || 'Failed to generate resume');
         setCurrentStep('achievements'); // Go back to last step
       }
     } catch (e) {
       setError(e instanceof Error ? e.message : 'An error occurred');
       setCurrentStep('achievements');
     } finally {
       setIsGenerating(false);
     }
   }, [formData]);
 
   // Save resume to database
   const saveResume = useCallback(async (title?: string) => {
     if (!user || !generatedResume) return { success: false };
 
     setIsSaving(true);
     setError(null);
 
     try {
       if (savedResumeId) {
         // Update existing
         const result = await resumeService.updateResume(savedResumeId, {
           title,
           data: generatedResume,
           selectedTemplate,
           templateSettings,
           status: 'completed'
         });
         setIsSaving(false);
         return result;
       } else {
         // Create new
         const result = await resumeService.saveResume({
           userId: user.id,
           title,
           data: generatedResume,
           selectedTemplate,
           templateSettings,
           status: 'completed'
         });
         if (result.success && result.id) {
           setSavedResumeId(result.id);
         }
         setIsSaving(false);
         return result;
       }
     } catch (e) {
       setIsSaving(false);
       return { success: false, error: e instanceof Error ? e.message : 'Failed to save' };
     }
   }, [user, generatedResume, savedResumeId, selectedTemplate, templateSettings]);
 
   // Reset builder
   const resetBuilder = useCallback(() => {
     setCurrentStep('landing');
     setFormData(initialFormData);
     setGeneratedResume(null);
     setSelectedTemplate('modern-corporate');
     setTemplateSettings(initialTemplateSettings);
     setSavedResumeId(null);
     setError(null);
     localStorage.removeItem(STORAGE_KEY);
   }, []);
 
   // Clear draft
   const clearDraft = useCallback(() => {
     localStorage.removeItem(STORAGE_KEY);
     setFormData(initialFormData);
   }, []);
 
   return {
     // State
     currentStep,
     formData,
     generatedResume,
     selectedTemplate,
     templateSettings,
     isGenerating,
     isSaving,
     error,
     savedResumeId,
     
     // Form updates
     updateFormData,
     
     // Navigation
     goToStep,
     goToNextStep,
     goToPreviousStep,
     getCurrentStepIndex,
     
     // Template
     setSelectedTemplate,
     setTemplateSettings,
     
     // Actions
     generateResume,
     saveResume,
     resetBuilder,
     clearDraft,
     
     // Computed
     totalSteps: 8,
     isQuestionnaireStep: ['personal-info', 'career-summary', 'education', 'skills', 'projects', 'experience', 'certifications', 'achievements'].includes(currentStep)
   };
 }