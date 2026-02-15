import React from 'react';
import type { ResumeData, TemplateSettings } from '@/types/resume';
import { Award, Briefcase, GraduationCap, Star, Wrench } from 'lucide-react';
import { getBodyFont, safeData } from './fontMapping';

interface ExecutiveResumeProps {
  data: ResumeData;
  settings: TemplateSettings;
}

const colorThemes = {
  blue: { primary: '#1e3a5f', accent: '#c9a227', light: '#f8f6f0' },
  green: { primary: '#1a3c34', accent: '#b8860b', light: '#f5f7f5' },
  purple: { primary: '#2d1b4e', accent: '#d4af37', light: '#f8f5fa' },
  gray: { primary: '#2c2c2c', accent: '#a0a0a0', light: '#f5f5f5' },
  teal: { primary: '#1a3a3a', accent: '#cd853f', light: '#f5f8f8' }
};

export const ExecutiveResume: React.FC<ExecutiveResumeProps> = ({ data, settings }) => {
  const theme = colorThemes[settings.colorTheme];
  const headingFont = "'Playfair Display', Georgia, serif";
  const bodyFont = getBodyFont(settings.fontStyle);
  const metricFont = "'Space Grotesk', sans-serif";
  const d = safeData(data);

  return (
    <div 
      className="min-h-[1122px] w-[794px] mx-auto shadow-xl print:shadow-none"
      style={{ fontFamily: bodyFont, backgroundColor: theme.light }}
    >
      <header className="text-white p-8 relative overflow-hidden" style={{ backgroundColor: theme.primary }}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className="w-full h-full border-8 rounded-full" style={{ borderColor: theme.accent }} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: headingFont }}>
            {d.personalInfo.fullName || 'Your Name'}
          </h1>
          {d.careerInfo?.targetRole && (
            <p className="text-lg mt-1 font-light" style={{ color: theme.accent, fontFamily: headingFont }}>{d.careerInfo.targetRole}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-90">
            {d.personalInfo.email && <span>✉ {d.personalInfo.email}</span>}
            {d.personalInfo.phone && <span>☎ {d.personalInfo.phone}</span>}
            {d.personalInfo.location && <span>📍 {d.personalInfo.location}</span>}
          </div>
          <div className="flex gap-4 mt-2 text-sm">
            {d.personalInfo.linkedin && <span style={{ color: theme.accent }}>LinkedIn: {d.personalInfo.linkedin}</span>}
            {d.personalInfo.portfolio && <span style={{ color: theme.accent }}>Portfolio: {d.personalInfo.portfolio}</span>}
          </div>
        </div>
      </header>

      <main className="p-8">
        {d.careerSummary && (
          <section className="mb-6 p-4 border-l-4 bg-white" style={{ borderColor: theme.accent }}>
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2" style={{ color: theme.primary, fontFamily: headingFont }}>
              <Star className="h-4 w-4" style={{ color: theme.accent }} /> Executive Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{d.careerSummary}</p>
          </section>
        )}

        {(d.skills.core.length > 0 || d.skills.technologies.length > 0) && (
          <section className="mb-6">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.primary, fontFamily: headingFont }}>
              <Wrench className="h-4 w-4" style={{ color: theme.accent }} /> Core Competencies
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {[...d.skills.core, ...d.skills.technologies, ...d.skills.tools].slice(0, 12).map((skill, i) => (
                <div key={i} className="text-center py-2 px-3 text-sm bg-white rounded shadow-sm" style={{ borderBottom: `2px solid ${theme.accent}`, fontFamily: metricFont }}>{skill}</div>
              ))}
            </div>
          </section>
        )}

        {d.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4" style={{ color: theme.primary, fontFamily: headingFont }}>
              <Briefcase className="h-4 w-4" style={{ color: theme.accent }} /> Professional Experience
            </h2>
            <div className="space-y-5">
              {d.experience.map((exp) => (
                <div key={exp.id} className="bg-white p-4 rounded shadow-sm">
                  <div className="flex justify-between items-start border-b pb-2 mb-3" style={{ borderColor: theme.accent }}>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: theme.primary, fontFamily: headingFont }}>{exp.role}</h3>
                      <p className="font-medium" style={{ color: theme.accent }}>{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded" style={{ fontFamily: metricFont }}>{exp.duration}</span>
                  </div>
                  {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.accent }} />
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

        {d.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.primary, fontFamily: headingFont }}>Key Projects & Initiatives</h2>
            <div className="grid grid-cols-2 gap-3">
              {d.projects.map((project) => (
                <div key={project.id} className="bg-white p-3 rounded shadow-sm">
                  <h3 className="font-semibold" style={{ color: theme.primary, fontFamily: headingFont }}>{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${theme.accent}30`, color: theme.primary, fontFamily: metricFont }}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {d.education.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.primary, fontFamily: headingFont }}>
                <GraduationCap className="h-4 w-4" style={{ color: theme.accent }} /> Education
              </h2>
              <div className="bg-white p-3 rounded shadow-sm space-y-2">
                {d.education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-semibold text-sm" style={{ color: theme.primary, fontFamily: headingFont }}>{edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.institution} • {edu.graduationYear}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(d.achievements.length > 0 || d.certifications.length > 0) && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.primary, fontFamily: headingFont }}>
                <Award className="h-4 w-4" style={{ color: theme.accent }} /> Awards & Certifications
              </h2>
              <div className="bg-white p-3 rounded shadow-sm space-y-2">
                {d.achievements.map((ach) => (
                  <p key={ach.id} className="text-sm"><span className="font-medium" style={{ color: theme.accent }}>★</span> {ach.title}</p>
                ))}
                {d.certifications.map((cert) => (
                  <p key={cert.id} className="text-sm text-gray-600">{cert.name} ({cert.year})</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
