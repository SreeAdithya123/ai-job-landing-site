import React from 'react';
import type { ResumeData, TemplateSettings } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { getBodyFont, safeData } from './fontMapping';

interface CreativeDesignerProps {
  data: ResumeData;
  settings: TemplateSettings;
}

const colorThemes = {
  blue: { primary: '#0ea5e9', secondary: '#0284c7', bg: '#f0f9ff' },
  green: { primary: '#22c55e', secondary: '#16a34a', bg: '#f0fdf4' },
  purple: { primary: '#a855f7', secondary: '#9333ea', bg: '#faf5ff' },
  gray: { primary: '#71717a', secondary: '#52525b', bg: '#fafafa' },
  teal: { primary: '#2dd4bf', secondary: '#14b8a6', bg: '#f0fdfa' }
};

export const CreativeDesigner: React.FC<CreativeDesignerProps> = ({ data, settings }) => {
  const theme = colorThemes[settings.colorTheme];
  const headingFont = "'Sora', sans-serif";
  const bodyFont = getBodyFont(settings.fontStyle);
  const metricFont = "'Space Grotesk', sans-serif";
  const d = safeData(data);

  return (
    <div 
      className="bg-white min-h-[1122px] w-[794px] mx-auto shadow-xl print:shadow-none flex"
      style={{ fontFamily: bodyFont }}
    >
      {/* Left Sidebar */}
      <aside className="w-[280px] text-white p-6" style={{ backgroundColor: theme.primary }}>
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold" style={{ fontFamily: headingFont }}>
              {d.personalInfo.fullName?.split(' ').map(n => n[0]).join('') || 'YN'}
            </span>
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: headingFont }}>
            {d.personalInfo.fullName || 'Your Name'}
          </h1>
          {d.careerInfo?.targetRole && (
            <p className="text-sm opacity-80 mt-1">{d.careerInfo.targetRole}</p>
          )}
        </div>

        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70" style={{ fontFamily: headingFont }}>Contact</h2>
          <div className="space-y-2 text-sm">
            {d.personalInfo.email && <div className="flex items-center gap-2 opacity-90"><Mail className="h-3 w-3" /> <span className="text-xs">{d.personalInfo.email}</span></div>}
            {d.personalInfo.phone && <div className="flex items-center gap-2 opacity-90"><Phone className="h-3 w-3" /> <span className="text-xs">{d.personalInfo.phone}</span></div>}
            {d.personalInfo.location && <div className="flex items-center gap-2 opacity-90"><MapPin className="h-3 w-3" /> <span className="text-xs">{d.personalInfo.location}</span></div>}
            {d.personalInfo.linkedin && <div className="flex items-center gap-2 opacity-90"><Linkedin className="h-3 w-3" /> <span className="text-xs">{d.personalInfo.linkedin}</span></div>}
            {d.personalInfo.portfolio && <div className="flex items-center gap-2 opacity-90"><Globe className="h-3 w-3" /> <span className="text-xs">{d.personalInfo.portfolio}</span></div>}
          </div>
        </section>

        {(d.skills.core.length > 0 || d.skills.technologies.length > 0) && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70" style={{ fontFamily: headingFont }}>Skills</h2>
            <div className="space-y-2">
              {[...d.skills.core, ...d.skills.technologies].slice(0, 8).map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${85 - i * 5}%` }} />
                  </div>
                  <span className="text-xs w-20" style={{ fontFamily: metricFont }}>{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {d.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70" style={{ fontFamily: headingFont }}>Education</h2>
            <div className="space-y-3">
              {d.education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-sm font-medium" style={{ fontFamily: headingFont }}>{edu.degree}</p>
                  <p className="text-xs opacity-80">{edu.institution}</p>
                  <p className="text-xs opacity-60" style={{ fontFamily: metricFont }}>{edu.graduationYear}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {d.certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70" style={{ fontFamily: headingFont }}>Certifications</h2>
            <ul className="space-y-1">
              {d.certifications.map((cert) => (
                <li key={cert.id} className="text-xs opacity-90">• {cert.name}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8" style={{ backgroundColor: theme.bg }}>
        {d.careerSummary && (
          <section className="mb-6 p-4 rounded-lg bg-white shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: theme.secondary, fontFamily: headingFont }}>About Me</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{d.careerSummary}</p>
          </section>
        )}

        {d.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: theme.secondary, fontFamily: headingFont }}>Experience</h2>
            <div className="space-y-4">
              {d.experience.map((exp) => (
                <div key={exp.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800" style={{ fontFamily: headingFont }}>{exp.role}</h3>
                      <p className="text-sm" style={{ color: theme.primary }}>{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: metricFont }}>{exp.duration}</span>
                  </div>
                  {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                    <ul className="space-y-1">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span style={{ color: theme.primary }}>▸</span> {resp}
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
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: theme.secondary, fontFamily: headingFont }}>Projects</h2>
            <div className="grid grid-cols-2 gap-3">
              {d.projects.map((project) => (
                <div key={project.id} className="bg-white p-3 rounded-lg shadow-sm">
                  <h3 className="font-medium text-sm text-gray-800" style={{ fontFamily: headingFont }}>{project.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                  {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${theme.primary}20`, color: theme.secondary, fontFamily: metricFont }}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {d.achievements.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.secondary, fontFamily: headingFont }}>Achievements</h2>
            <div className="flex flex-wrap gap-2">
              {d.achievements.map((ach) => (
                <span key={ach.id} className="text-xs px-3 py-1.5 rounded-full bg-white shadow-sm" style={{ color: theme.secondary }}>🏆 {ach.title}</span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
