import React from 'react';
import type { ResumeData, TemplateSettings } from '@/types/resume';
import { Terminal, Code2, Cpu, Database } from 'lucide-react';
import { getBodyFont, safeData } from './fontMapping';

interface TechnicalEngineerProps {
  data: ResumeData;
  settings: TemplateSettings;
}

const colorThemes = {
  blue: { primary: '#3b82f6', dark: '#1e3a8a', light: '#dbeafe' },
  green: { primary: '#22c55e', dark: '#14532d', light: '#dcfce7' },
  purple: { primary: '#8b5cf6', dark: '#4c1d95', light: '#ede9fe' },
  gray: { primary: '#64748b', dark: '#1e293b', light: '#f1f5f9' },
  teal: { primary: '#14b8a6', dark: '#134e4a', light: '#ccfbf1' }
};

export const TechnicalEngineer: React.FC<TechnicalEngineerProps> = ({ data, settings }) => {
  const theme = colorThemes[settings.colorTheme];
  const headingFont = "'Sora', sans-serif";
  const bodyFont = getBodyFont(settings.fontStyle);
  const monoFont = "'Space Grotesk', monospace";
  const d = safeData(data);

  return (
    <div 
      className="bg-white min-h-[1122px] w-[794px] mx-auto shadow-xl print:shadow-none"
      style={{ fontFamily: bodyFont }}
    >
      <header className="p-6 text-white" style={{ backgroundColor: theme.dark }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs opacity-50" style={{ fontFamily: monoFont }}>resume.tsx</span>
        </div>
        <div style={{ fontFamily: monoFont }}>
          <p className="text-xs opacity-50">// Software Engineer</p>
          <h1 className="text-2xl font-bold mt-1">
            <span style={{ color: theme.primary }}>const</span> developer = "{d.personalInfo.fullName || 'Your Name'}"
          </h1>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-xs opacity-80" style={{ fontFamily: monoFont }}>
          {d.personalInfo.email && <span>📧 {d.personalInfo.email}</span>}
          {d.personalInfo.phone && <span>📱 {d.personalInfo.phone}</span>}
          {d.personalInfo.location && <span>📍 {d.personalInfo.location}</span>}
          {d.personalInfo.linkedin && <span>💼 {d.personalInfo.linkedin}</span>}
          {d.personalInfo.portfolio && <span>🌐 {d.personalInfo.portfolio}</span>}
        </div>
      </header>

      <main className="p-6">
        {d.careerSummary && (
          <section className="mb-6 p-4 rounded-lg text-sm" style={{ backgroundColor: theme.light, fontFamily: monoFont }}>
            <p className="text-gray-500">/**</p>
            <p className="text-gray-700 pl-2"> * {d.careerSummary}</p>
            <p className="text-gray-500"> */</p>
          </section>
        )}

        {(d.skills.technologies.length > 0 || d.skills.tools.length > 0) && (
          <section className="mb-6">
            <h2 className="flex items-center gap-2 text-sm font-bold mb-3" style={{ color: theme.dark, fontFamily: headingFont }}>
              <Terminal className="h-4 w-4" /> Tech Stack
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {d.skills.technologies.length > 0 && (
                <div className="p-3 rounded-lg border" style={{ borderColor: theme.primary }}>
                  <div className="flex items-center gap-1 text-xs font-semibold mb-2" style={{ color: theme.primary, fontFamily: headingFont }}><Code2 className="h-3 w-3" /> Languages</div>
                  <div className="flex flex-wrap gap-1">
                    {d.skills.technologies.map((skill, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100" style={{ fontFamily: monoFont }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {d.skills.tools.length > 0 && (
                <div className="p-3 rounded-lg border" style={{ borderColor: theme.primary }}>
                  <div className="flex items-center gap-1 text-xs font-semibold mb-2" style={{ color: theme.primary, fontFamily: headingFont }}><Cpu className="h-3 w-3" /> Tools</div>
                  <div className="flex flex-wrap gap-1">
                    {d.skills.tools.map((skill, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100" style={{ fontFamily: monoFont }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {d.skills.core.length > 0 && (
                <div className="p-3 rounded-lg border" style={{ borderColor: theme.primary }}>
                  <div className="flex items-center gap-1 text-xs font-semibold mb-2" style={{ color: theme.primary, fontFamily: headingFont }}><Database className="h-3 w-3" /> Core</div>
                  <div className="flex flex-wrap gap-1">
                    {d.skills.core.map((skill, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100" style={{ fontFamily: monoFont }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {d.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold mb-3" style={{ color: theme.dark, fontFamily: headingFont }}>Experience Log</h2>
            <div className="space-y-3">
              {d.experience.map((exp, idx) => (
                <div key={exp.id} className="relative pl-6 pb-3 border-l-2" style={{ borderColor: theme.primary }}>
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: theme.primary }} />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: theme.light, color: theme.dark, fontFamily: monoFont }}>v{d.experience.length - idx}.0</span>
                      <h3 className="font-semibold mt-1" style={{ fontFamily: headingFont }}>{exp.role}</h3>
                      <p className="text-sm" style={{ color: theme.primary }}>{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-400" style={{ fontFamily: monoFont }}>{exp.duration}</span>
                  </div>
                  {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="text-sm text-gray-600" style={{ fontFamily: monoFont }}><span className="text-green-600">+</span> {resp}</li>
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
            <h2 className="text-sm font-bold mb-3" style={{ color: theme.dark, fontFamily: headingFont }}>Projects</h2>
            <div className="grid grid-cols-2 gap-3">
              {d.projects.map((project) => (
                <div key={project.id} className="p-3 rounded-lg" style={{ backgroundColor: theme.light }}>
                  <h3 className="font-semibold text-sm" style={{ color: theme.dark, fontFamily: monoFont }}>📁 {project.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{project.description}</p>
                  {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-white" style={{ fontFamily: monoFont }}>{tech}</span>
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
              <h2 className="text-sm font-bold mb-3" style={{ color: theme.dark, fontFamily: headingFont }}>Education</h2>
              {d.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <p className="font-medium text-sm" style={{ fontFamily: headingFont }}>{edu.degree}</p>
                  <p className="text-xs text-gray-500">{edu.institution} • {edu.graduationYear}</p>
                </div>
              ))}
            </section>
          )}
          {d.certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold mb-3" style={{ color: theme.dark, fontFamily: headingFont }}>Certifications</h2>
              {d.certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <p className="font-medium text-sm" style={{ fontFamily: headingFont }}>🏅 {cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.platform} • {cert.year}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
