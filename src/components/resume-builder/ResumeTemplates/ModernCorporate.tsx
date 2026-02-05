 import React from 'react';
 import type { ResumeData, TemplateSettings } from '@/types/resume';
 import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
 
 interface ModernCorporateProps {
   data: ResumeData;
   settings: TemplateSettings;
 }
 
 const colorThemes = {
   blue: { primary: '#2563eb', accent: '#1e40af' },
   green: { primary: '#059669', accent: '#047857' },
   purple: { primary: '#7c3aed', accent: '#5b21b6' },
   gray: { primary: '#4b5563', accent: '#374151' },
   teal: { primary: '#0d9488', accent: '#0f766e' }
 };
 
 export const ModernCorporate: React.FC<ModernCorporateProps> = ({ data, settings }) => {
   const theme = colorThemes[settings.colorTheme];
 
   return (
     <div 
       className="bg-white text-gray-900 p-8 min-h-[1122px] w-[794px] mx-auto shadow-xl print:shadow-none"
       style={{ fontFamily: settings.fontStyle === 'inter' ? 'Inter, sans-serif' : settings.fontStyle }}
     >
       {/* Header */}
       <header className="border-b-2 pb-6 mb-6" style={{ borderColor: theme.primary }}>
         <h1 className="text-3xl font-bold mb-1" style={{ color: theme.primary }}>
           {data.personalInfo.fullName || 'Your Name'}
         </h1>
         <div className="flex flex-wrap gap-4 text-sm text-gray-600">
           {data.personalInfo.email && (
             <span className="flex items-center gap-1">
               <Mail className="h-3 w-3" /> {data.personalInfo.email}
             </span>
           )}
           {data.personalInfo.phone && (
             <span className="flex items-center gap-1">
               <Phone className="h-3 w-3" /> {data.personalInfo.phone}
             </span>
           )}
           {data.personalInfo.location && (
             <span className="flex items-center gap-1">
               <MapPin className="h-3 w-3" /> {data.personalInfo.location}
             </span>
           )}
           {data.personalInfo.linkedin && (
             <span className="flex items-center gap-1">
               <Linkedin className="h-3 w-3" /> {data.personalInfo.linkedin}
             </span>
           )}
           {data.personalInfo.portfolio && (
             <span className="flex items-center gap-1">
               <Globe className="h-3 w-3" /> {data.personalInfo.portfolio}
             </span>
           )}
         </div>
       </header>
 
       {/* Professional Summary */}
       {data.careerSummary && (
         <section className="mb-6">
           <h2 className="text-lg font-semibold mb-2 uppercase tracking-wide" style={{ color: theme.primary }}>
             Professional Summary
           </h2>
           <p className="text-gray-700 text-sm leading-relaxed">{data.careerSummary}</p>
         </section>
       )}
 
       {/* Skills */}
       {(data.skills.core.length > 0 || data.skills.technologies.length > 0) && (
         <section className="mb-6">
           <h2 className="text-lg font-semibold mb-2 uppercase tracking-wide" style={{ color: theme.primary }}>
             Skills
           </h2>
           <div className="grid grid-cols-2 gap-4 text-sm">
             {data.skills.technologies.length > 0 && (
               <div>
                 <span className="font-medium">Technologies:</span>{' '}
                 <span className="text-gray-600">{data.skills.technologies.join(', ')}</span>
               </div>
             )}
             {data.skills.tools.length > 0 && (
               <div>
                 <span className="font-medium">Tools:</span>{' '}
                 <span className="text-gray-600">{data.skills.tools.join(', ')}</span>
               </div>
             )}
             {data.skills.core.length > 0 && (
               <div>
                 <span className="font-medium">Core:</span>{' '}
                 <span className="text-gray-600">{data.skills.core.join(', ')}</span>
               </div>
             )}
             {data.skills.soft.length > 0 && (
               <div>
                 <span className="font-medium">Soft Skills:</span>{' '}
                 <span className="text-gray-600">{data.skills.soft.join(', ')}</span>
               </div>
             )}
           </div>
         </section>
       )}
 
       {/* Experience */}
       {data.experience.length > 0 && (
         <section className="mb-6">
           <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide" style={{ color: theme.primary }}>
             Experience
           </h2>
           <div className="space-y-4">
             {data.experience.map((exp) => (
               <div key={exp.id}>
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-semibold">{exp.role}</h3>
                     <p className="text-sm text-gray-600">{exp.company}</p>
                   </div>
                   <span className="text-sm text-gray-500">{exp.duration}</span>
                 </div>
                 {exp.responsibilities.length > 0 && (
                   <ul className="mt-2 space-y-1 text-sm text-gray-700">
                     {exp.responsibilities.map((resp, i) => (
                       <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0">
                         {resp}
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
             ))}
           </div>
         </section>
       )}
 
       {/* Projects */}
       {data.projects.length > 0 && (
         <section className="mb-6">
           <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide" style={{ color: theme.primary }}>
             Projects
           </h2>
           <div className="space-y-3">
             {data.projects.map((project) => (
               <div key={project.id}>
                 <h3 className="font-semibold">{project.title}</h3>
                 <p className="text-sm text-gray-700">{project.description}</p>
                 {project.technologies.length > 0 && (
                   <p className="text-xs text-gray-500 mt-1">
                     <span className="font-medium">Tech:</span> {project.technologies.join(', ')}
                   </p>
                 )}
               </div>
             ))}
           </div>
         </section>
       )}
 
       {/* Education */}
       {data.education.length > 0 && (
         <section className="mb-6">
           <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide" style={{ color: theme.primary }}>
             Education
           </h2>
           <div className="space-y-2">
             {data.education.map((edu) => (
               <div key={edu.id} className="flex justify-between">
                 <div>
                   <h3 className="font-semibold">{edu.degree}</h3>
                   <p className="text-sm text-gray-600">{edu.institution}</p>
                 </div>
                 <div className="text-right text-sm text-gray-500">
                   <p>{edu.graduationYear}</p>
                   {edu.cgpa && <p>{edu.cgpa}</p>}
                 </div>
               </div>
             ))}
           </div>
         </section>
       )}
 
       {/* Certifications */}
       {data.certifications.length > 0 && (
         <section className="mb-6">
           <h2 className="text-lg font-semibold mb-2 uppercase tracking-wide" style={{ color: theme.primary }}>
             Certifications
           </h2>
           <ul className="text-sm space-y-1">
             {data.certifications.map((cert) => (
               <li key={cert.id}>
                 {cert.name} — {cert.platform} ({cert.year})
               </li>
             ))}
           </ul>
         </section>
       )}
 
       {/* Achievements */}
       {data.achievements.length > 0 && (
         <section>
           <h2 className="text-lg font-semibold mb-2 uppercase tracking-wide" style={{ color: theme.primary }}>
             Achievements
           </h2>
           <ul className="text-sm space-y-1">
             {data.achievements.map((ach) => (
               <li key={ach.id}>
                 <span className="font-medium">{ach.title}</span>
                 {ach.description && <span className="text-gray-600"> — {ach.description}</span>}
               </li>
             ))}
           </ul>
         </section>
       )}
     </div>
   );
 };