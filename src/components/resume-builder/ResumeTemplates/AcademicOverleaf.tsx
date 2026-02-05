 import React from 'react';
 import type { ResumeData, TemplateSettings } from '@/types/resume';
 
 interface AcademicOverleafProps {
   data: ResumeData;
   settings: TemplateSettings;
 }
 
 const colorThemes = {
   blue: { primary: '#1e40af', accent: '#2563eb' },
   green: { primary: '#166534', accent: '#22c55e' },
   purple: { primary: '#581c87', accent: '#9333ea' },
   gray: { primary: '#374151', accent: '#6b7280' },
   teal: { primary: '#115e59', accent: '#14b8a6' }
 };
 
 export const AcademicOverleaf: React.FC<AcademicOverleafProps> = ({ data, settings }) => {
   const theme = colorThemes[settings.colorTheme];
 
   return (
     <div 
       className="bg-white min-h-[1122px] w-[794px] mx-auto shadow-xl print:shadow-none p-12"
       style={{ 
         fontFamily: settings.fontStyle === 'sora' ? 'Georgia, serif' : 'Times New Roman, serif'
       }}
     >
       {/* Academic Header */}
       <header className="text-center border-b-2 pb-4 mb-6" style={{ borderColor: theme.primary }}>
         <h1 className="text-3xl font-bold tracking-wide" style={{ color: theme.primary }}>
           {data.personalInfo.fullName?.toUpperCase() || 'YOUR NAME'}
         </h1>
         <div className="flex justify-center flex-wrap gap-3 mt-3 text-sm text-gray-600">
           {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
           {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
           {data.personalInfo.location && <span>| {data.personalInfo.location}</span>}
         </div>
         <div className="flex justify-center gap-3 mt-1 text-sm">
           {data.personalInfo.linkedin && (
             <span style={{ color: theme.accent }}>{data.personalInfo.linkedin}</span>
           )}
           {data.personalInfo.portfolio && (
             <span style={{ color: theme.accent }}>| {data.personalInfo.portfolio}</span>
           )}
         </div>
       </header>
 
       {/* Summary */}
       {data.careerSummary && (
         <section className="mb-5">
           <h2 
             className="text-sm font-bold uppercase tracking-widest border-b mb-2 pb-1"
             style={{ color: theme.primary, borderColor: theme.primary }}
           >
             Research Interests / Objective
           </h2>
           <p className="text-sm text-gray-700 leading-relaxed text-justify">{data.careerSummary}</p>
         </section>
       )}
 
       {/* Education - Primary for Academic */}
       {data.education.length > 0 && (
         <section className="mb-5">
           <h2 
             className="text-sm font-bold uppercase tracking-widest border-b mb-2 pb-1"
             style={{ color: theme.primary, borderColor: theme.primary }}
           >
             Education
           </h2>
           <div className="space-y-3">
             {data.education.map((edu) => (
               <div key={edu.id}>
                 <div className="flex justify-between">
                   <div>
                     <p className="font-semibold">{edu.degree}</p>
                     <p className="text-sm italic text-gray-600">{edu.institution}</p>
                   </div>
                   <div className="text-right text-sm text-gray-500">
                     <p>{edu.graduationYear}</p>
                     {edu.cgpa && <p>GPA: {edu.cgpa}</p>}
                   </div>
                 </div>
                 {edu.achievements && (
                   <p className="text-sm text-gray-600 mt-1 italic">{edu.achievements}</p>
                 )}
               </div>
             ))}
           </div>
         </section>
       )}
 
       {/* Experience */}
       {data.experience.length > 0 && (
         <section className="mb-5">
           <h2 
             className="text-sm font-bold uppercase tracking-widest border-b mb-2 pb-1"
             style={{ color: theme.primary, borderColor: theme.primary }}
           >
             Research & Professional Experience
           </h2>
           <div className="space-y-3">
             {data.experience.map((exp) => (
               <div key={exp.id}>
                 <div className="flex justify-between">
                   <div>
                     <p className="font-semibold">{exp.role}</p>
                     <p className="text-sm italic text-gray-600">{exp.company}</p>
                   </div>
                   <span className="text-sm text-gray-500">{exp.duration}</span>
                 </div>
                 {exp.responsibilities.length > 0 && (
                   <ul className="mt-1 space-y-0.5">
                     {exp.responsibilities.map((resp, i) => (
                       <li key={i} className="text-sm text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0">
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
 
       {/* Projects / Publications */}
       {data.projects.length > 0 && (
         <section className="mb-5">
           <h2 
             className="text-sm font-bold uppercase tracking-widest border-b mb-2 pb-1"
             style={{ color: theme.primary, borderColor: theme.primary }}
           >
             Projects & Publications
           </h2>
           <div className="space-y-2">
             {data.projects.map((project) => (
               <div key={project.id}>
                 <p className="font-semibold text-sm">
                   {project.title}
                   {project.technologies.length > 0 && (
                     <span className="font-normal text-gray-500"> [{project.technologies.join(', ')}]</span>
                   )}
                 </p>
                 <p className="text-sm text-gray-700 text-justify">{project.description}</p>
               </div>
             ))}
           </div>
         </section>
       )}
 
       {/* Skills */}
       {(data.skills.core.length > 0 || data.skills.technologies.length > 0) && (
         <section className="mb-5">
           <h2 
             className="text-sm font-bold uppercase tracking-widest border-b mb-2 pb-1"
             style={{ color: theme.primary, borderColor: theme.primary }}
           >
             Technical Skills
           </h2>
           <div className="text-sm space-y-1">
             {data.skills.technologies.length > 0 && (
               <p><strong>Programming:</strong> {data.skills.technologies.join(', ')}</p>
             )}
             {data.skills.tools.length > 0 && (
               <p><strong>Tools & Frameworks:</strong> {data.skills.tools.join(', ')}</p>
             )}
             {data.skills.core.length > 0 && (
               <p><strong>Core Competencies:</strong> {data.skills.core.join(', ')}</p>
             )}
           </div>
         </section>
       )}
 
       {/* Awards & Achievements */}
       {(data.achievements.length > 0 || data.certifications.length > 0) && (
         <section>
           <h2 
             className="text-sm font-bold uppercase tracking-widest border-b mb-2 pb-1"
             style={{ color: theme.primary, borderColor: theme.primary }}
           >
             Honors & Awards
           </h2>
           <ul className="text-sm space-y-1">
             {data.achievements.map((ach) => (
               <li key={ach.id} className="pl-4 relative before:content-['•'] before:absolute before:left-0">
                 <strong>{ach.title}</strong>
                 {ach.description && <span className="text-gray-600"> — {ach.description}</span>}
               </li>
             ))}
             {data.certifications.map((cert) => (
               <li key={cert.id} className="pl-4 relative before:content-['•'] before:absolute before:left-0">
                 {cert.name}, {cert.platform} ({cert.year})
               </li>
             ))}
           </ul>
         </section>
       )}
     </div>
   );
 };