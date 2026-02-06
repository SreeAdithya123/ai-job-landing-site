import React from 'react';
import type { ResumeData, TemplateSettings } from '@/types/resume';

interface MinimalProfessionalProps {
  data: ResumeData;
  settings: TemplateSettings;
}

const colorThemes = {
  blue: { primary: '#1e3a5f', accent: '#3b82f6' },
  green: { primary: '#1a4d3e', accent: '#10b981' },
  purple: { primary: '#4c1d6e', accent: '#a855f7' },
  gray: { primary: '#1f2937', accent: '#6b7280' },
  teal: { primary: '#134e4a', accent: '#14b8a6' }
};

const fontFamilies = {
  inter: "'Inter', sans-serif",
  sora: "'Sora', sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
  merriweather: "'Merriweather', Georgia, serif",
  lora: "'Lora', Georgia, serif",
  'source-serif': "'Source Serif 4', Georgia, serif"
};

export const MinimalProfessional: React.FC<MinimalProfessionalProps> = ({ data, settings }) => {
  const theme = colorThemes[settings.colorTheme];
  const headingFont = fontFamilies.playfair;
  const bodyFont = fontFamilies.lora;

  return (
    <div 
      className="bg-white text-gray-800 min-h-[1122px] w-[794px] mx-auto shadow-xl print:shadow-none"
      style={{ fontFamily: bodyFont }}
    >
      {/* Clean Header */}
      <header className="px-10 pt-10 pb-6">
        <h1 
          className="text-4xl font-light tracking-wide mb-2" 
          style={{ color: theme.primary, fontFamily: headingFont }}
        >
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 border-b pb-4" style={{ borderColor: theme.accent }}>
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
          {data.personalInfo.portfolio && <span>• {data.personalInfo.portfolio}</span>}
        </div>
      </header>

      <main className="px-10 pb-10">
        {/* Summary */}
        {data.careerSummary && (
          <section className="mb-6">
            <p className="text-gray-600 text-sm leading-relaxed italic">{data.careerSummary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-xs font-semibold uppercase tracking-widest mb-4" 
              style={{ color: theme.accent, fontFamily: headingFont }}
            >
              Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: theme.accent }}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium" style={{ color: theme.primary, fontFamily: headingFont }}>{exp.role}</h3>
                    <span className="text-xs text-gray-400">{exp.duration}</span>
                  </div>
                  <p className="text-sm text-gray-500">{exp.company}</p>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="text-sm text-gray-600">— {resp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-xs font-semibold uppercase tracking-widest mb-4" 
              style={{ color: theme.accent, fontFamily: headingFont }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-sm" style={{ color: theme.primary, fontFamily: headingFont }}>{edu.degree}</h3>
                    <p className="text-sm text-gray-500">{edu.institution}</p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>{edu.graduationYear}</p>
                    {edu.cgpa && <p>{edu.cgpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {(data.skills.core.length > 0 || data.skills.technologies.length > 0) && (
          <section className="mb-6">
            <h2 
              className="text-xs font-semibold uppercase tracking-widest mb-4" 
              style={{ color: theme.accent, fontFamily: headingFont }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {[...data.skills.core, ...data.skills.technologies, ...data.skills.tools].map((skill, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 text-xs rounded-full"
                  style={{ backgroundColor: `${theme.accent}15`, color: theme.primary }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-xs font-semibold uppercase tracking-widest mb-4" 
              style={{ color: theme.accent, fontFamily: headingFont }}
            >
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-medium text-sm" style={{ color: theme.primary, fontFamily: headingFont }}>{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{project.technologies.join(' · ')}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements in two columns */}
        <div className="grid grid-cols-2 gap-6">
          {data.certifications.length > 0 && (
            <section>
              <h2 
                className="text-xs font-semibold uppercase tracking-widest mb-3" 
                style={{ color: theme.accent, fontFamily: headingFont }}
              >
                Certifications
              </h2>
              <ul className="space-y-1">
                {data.certifications.map((cert) => (
                  <li key={cert.id} className="text-xs text-gray-600">
                    {cert.name} ({cert.year})
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.achievements.length > 0 && (
            <section>
              <h2 
                className="text-xs font-semibold uppercase tracking-widest mb-3" 
                style={{ color: theme.accent, fontFamily: headingFont }}
              >
                Achievements
              </h2>
              <ul className="space-y-1">
                {data.achievements.map((ach) => (
                  <li key={ach.id} className="text-xs text-gray-600">{ach.title}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
