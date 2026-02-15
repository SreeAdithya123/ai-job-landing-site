import type { ResumeData } from '@/types/resume';

export const fontFamilyMap: Record<string, string> = {
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  helvetica: "Helvetica, Arial, sans-serif",
  sora: "'Sora', sans-serif",
};

export const getBodyFont = (fontStyle: string): string =>
  fontFamilyMap[fontStyle] || fontFamilyMap.inter;

/** Safe defaults for all resume data fields */
export const safeData = (data: ResumeData) => ({
  personalInfo: data?.personalInfo || { fullName: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
  careerSummary: data?.careerSummary || '',
  careerInfo: data?.careerInfo || { targetRole: '', yearsOfExperience: '', keyStrengths: [], careerObjective: '' },
  skills: {
    core: Array.isArray(data?.skills?.core) ? data.skills.core : [],
    tools: Array.isArray(data?.skills?.tools) ? data.skills.tools : [],
    technologies: Array.isArray(data?.skills?.technologies) ? data.skills.technologies : [],
    soft: Array.isArray(data?.skills?.soft) ? data.skills.soft : [],
  },
  experience: Array.isArray(data?.experience) ? data.experience : [],
  education: Array.isArray(data?.education) ? data.education : [],
  projects: Array.isArray(data?.projects) ? data.projects : [],
  certifications: Array.isArray(data?.certifications) ? data.certifications : [],
  achievements: Array.isArray(data?.achievements) ? data.achievements : [],
});
