import React from 'react';
import type { ResumeData, TemplateSettings } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { getBodyFont, safeData } from './fontMapping';

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
  const headingFont = "'Playfair Display', Georgia, serif";
  const bodyFont = getBodyFont(settings.fontStyle);
  const d = safeData(data);

  return (
    <div 
      className="bg-white text-gray-900 p-8 min-h-[1122px] w-[794px] mx-auto shadow-xl print:shadow-none"
      style={{ fontFamily: bodyFont }}
    >
      {/* Header */}
      <header className="border-b-2 pb-6 mb-6" style={{ borderColor: theme.primary }}>
        <h1 
          className="text-3xl font-bold mb-1" 
          style={{ color: theme.primary, fontFamily: headingFont }}
        >
          {d.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {d.personalInfo.email && (
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {d.personalInfo.email}</span>
          )}
          {d.personalInfo.phone && (
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {d.personalInfo.phone}</span>
          )}
          {d.personalInfo.location && (
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.personalInfo.location}</span>
          )}
          {d.personalInfo.linkedin && (
            <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" /> {d.personalInfo.linkedin}</span>
          )}
          {d.personalInfo.portfolio && (
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {d.personalInfo.portfolio}</span>
          )}
        </div>
      </header>

      {d.careerSummary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 uppercase tracking-wide" style={{ color: theme.primary, fontFamily: headingFont }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{d.careerSummary}</p>
        </section>
      )}

      {(d.skills.core.length > 0 || d.skills.technologies.length > 0) && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 uppercase tracking-wide" style={{ color: theme.primary, fontFamily: headingFont }}>Skills</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {d.skills.technologies.length > 0 && (
              <div><span className="font-medium">Technologies:</span> <span className="text-gray-600">{d.skills.technologies.join(', ')}</span></div>
            )}
            {d.skills.tools.length > 0 && (
              <div><span className="font-medium">Tools:</span> <span className="text-gray-600">{d.skills.tools.join(', ')}</span></div>
            )}
            {d.skills.core.length > 0 && (
              <div><span className="font-medium">Core:</span> <span className="text-gray-600">{d.skills.core.join(', ')}</span></div>
            )}
            {d.skills.soft.length > 0 && (
              <div><span className="font-medium">Soft Skills:</span> <span className="text-gray-600">{d.skills.soft.join(', ')}</span></div>
            )}
          </div>
        </section>
      )}

      {d.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide" style={{ color: theme.primary, fontFamily: headingFont }}>Experience</h2>
          <div className="space-y-4">
            {d.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold" style={{ fontFamily: headingFont }}>{exp.role}</h3>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">{exp.duration}</span>
                </div>
                {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0">{resp}</li>
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
          <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide" style={{ color: theme.primary, fontFamily: headingFont }}>Projects</h2>
          <div className="space-y-3">
            {d.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-semibold" style={{ fontFamily: headingFont }}>{project.title}</h3>
                <p className="text-sm text-gray-700">{project.description}</p>
                {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1"><span className="font-medium">Tech:</span> {project.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {d.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide" style={{ color: theme.primary, fontFamily: headingFont }}>Education</h2>
          <div className="space-y-2">
            {d.education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: headingFont }}>{edu.degree}</h3>
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

      {d.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 uppercase tracking-wide" style={{ color: theme.primary, fontFamily: headingFont }}>Certifications</h2>
          <ul className="text-sm space-y-1">
            {d.certifications.map((cert) => (
              <li key={cert.id}>{cert.name} — {cert.platform} ({cert.year})</li>
            ))}
          </ul>
        </section>
      )}

      {d.achievements.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2 uppercase tracking-wide" style={{ color: theme.primary, fontFamily: headingFont }}>Achievements</h2>
          <ul className="text-sm space-y-1">
            {d.achievements.map((ach) => (
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
