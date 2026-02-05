 // Resume Builder TypeScript Types
 
 export interface PersonalInfo {
   fullName: string;
   email: string;
   phone: string;
   linkedin?: string;
   portfolio?: string;
   location?: string;
 }
 
 export interface Education {
   id: string;
   degree: string;
   institution: string;
   graduationYear: string;
   cgpa?: string;
   achievements?: string;
 }
 
 export interface Skill {
   id: string;
   name: string;
   category: 'core' | 'tools' | 'technologies' | 'soft';
 }
 
 export interface SkillCategories {
   core: string[];
   tools: string[];
   technologies: string[];
   soft: string[];
 }
 
 export interface Project {
   id: string;
   title: string;
   description: string;
   technologies: string[];
   role: string;
   outcome?: string;
 }
 
 export interface Experience {
   id: string;
   company: string;
   role: string;
   duration: string;
   responsibilities: string[];
   achievements?: string[];
 }
 
 export interface Certification {
   id: string;
   name: string;
   platform: string;
   year: string;
 }
 
 export interface Achievement {
   id: string;
   title: string;
   description: string;
   type: 'hackathon' | 'award' | 'leadership' | 'publication' | 'other';
 }
 
 export interface CareerInfo {
   targetRole: string;
   yearsOfExperience: string;
   keyStrengths: string[];
   careerObjective: string;
 }
 
 export interface ResumeData {
   personalInfo: PersonalInfo;
   careerInfo: CareerInfo;
   careerSummary: string;
   education: Education[];
   skills: SkillCategories;
   projects: Project[];
   experience: Experience[];
   certifications: Certification[];
   achievements: Achievement[];
 }
 
 export interface TemplateSettings {
   colorTheme: 'blue' | 'green' | 'purple' | 'gray' | 'teal';
   fontStyle: 'inter' | 'roboto' | 'helvetica' | 'sora';
 }
 
 export type TemplateId = 
   | 'modern-corporate'
   | 'minimal-professional'
   | 'creative-designer'
   | 'technical-engineer'
   | 'academic-overleaf'
   | 'executive-resume';
 
 export interface Resume {
   id: string;
   userId: string;
   title: string;
   data: ResumeData;
   selectedTemplate: TemplateId;
   templateSettings: TemplateSettings;
   status: 'draft' | 'completed';
   createdAt: string;
   updatedAt: string;
 }
 
 export interface QuestionnaireFormData {
   personalInfo: PersonalInfo;
   careerInfo: CareerInfo;
   education: Education[];
   skills: SkillCategories;
   projects: Project[];
   experience: Experience[];
   certifications: Certification[];
   achievements: Achievement[];
 }
 
 export type ResumeBuilderStep = 
   | 'landing'
   | 'personal-info'
   | 'career-summary'
   | 'education'
   | 'skills'
   | 'projects'
   | 'experience'
   | 'certifications'
   | 'achievements'
   | 'generating'
   | 'template-gallery'
   | 'preview';
 
 export const STEP_ORDER: ResumeBuilderStep[] = [
   'landing',
   'personal-info',
   'career-summary',
   'education',
   'skills',
   'projects',
   'experience',
   'certifications',
   'achievements',
   'generating',
   'template-gallery',
   'preview'
 ];
 
 export const QUESTIONNAIRE_STEPS: ResumeBuilderStep[] = [
   'personal-info',
   'career-summary',
   'education',
   'skills',
   'projects',
   'experience',
   'certifications',
   'achievements'
 ];
 
 export const STEP_LABELS: Record<ResumeBuilderStep, string> = {
   'landing': 'Welcome',
   'personal-info': 'Personal Info',
   'career-summary': 'Career Goals',
   'education': 'Education',
   'skills': 'Skills',
   'projects': 'Projects',
   'experience': 'Experience',
   'certifications': 'Certifications',
   'achievements': 'Achievements',
   'generating': 'Generating',
   'template-gallery': 'Templates',
   'preview': 'Preview'
 };