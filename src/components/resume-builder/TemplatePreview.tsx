import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Save, Palette, Type, ArrowLeft, Loader2 } from 'lucide-react';
import { ModernCorporate } from './ResumeTemplates/ModernCorporate';
import { MinimalProfessional } from './ResumeTemplates/MinimalProfessional';
import { CreativeDesigner } from './ResumeTemplates/CreativeDesigner';
import { AcademicOverleaf } from './ResumeTemplates/AcademicOverleaf';
import type { ResumeData, TemplateId, TemplateSettings } from '@/types/resume';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';

interface TemplatePreviewProps {
  data: ResumeData;
  selectedTemplate: TemplateId;
  settings: TemplateSettings;
  onChangeTemplate: (template: TemplateId) => void;
  onChangeSettings: (settings: TemplateSettings) => void;
  onBack: () => void;
  onSave: () => Promise<{ success: boolean }>;
  isSaving: boolean;
}

const templateOptions: { value: TemplateId; label: string }[] = [
  { value: 'modern-corporate', label: 'Modern Corporate' },
  { value: 'minimal-professional', label: 'Minimal Professional' },
  { value: 'creative-designer', label: 'Creative Designer' },
  { value: 'academic-overleaf', label: 'Academic Overleaf' }
];

const colorOptions = [
  { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { value: 'green', label: 'Green', color: 'bg-green-500' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
  { value: 'gray', label: 'Gray', color: 'bg-gray-500' },
  { value: 'teal', label: 'Teal', color: 'bg-teal-500' }
];

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  data,
  selectedTemplate,
  settings,
  onChangeTemplate,
  onChangeSettings,
  onBack,
  onSave,
  isSaving
}) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportPDF = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${data.personalInfo?.fullName || 'resume'}_resume.pdf`);
      toast({ title: 'PDF Downloaded!', description: 'Your resume has been saved to your downloads folder.' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: 'Export Failed', description: 'Failed to generate PDF. Please try again.', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = async () => {
    const result = await onSave();
    if (result.success) {
      toast({ title: 'Resume Saved!', description: 'Your resume has been saved to your account.' });
    } else {
      toast({ title: 'Save Failed', description: 'Failed to save resume. Please try again.', variant: 'destructive' });
    }
  };

  const renderTemplate = () => {
     switch (selectedTemplate) {
       case 'modern-corporate': return <ModernCorporate data={data} settings={settings} />;
       case 'minimal-professional': return <MinimalProfessional data={data} settings={settings} />;
      case 'creative-designer': return <CreativeDesigner data={data} settings={settings} />;
      case 'academic-overleaf': return <AcademicOverleaf data={data} settings={settings} />;
       default: return <ModernCorporate data={data} settings={settings} />;
     }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Controls Sidebar */}
      <motion.div
        className="lg:w-80 bg-card border-b lg:border-b-0 lg:border-r border-border p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>

        <h2 className="text-xl font-bold text-foreground mb-6">Customize Resume</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Type className="h-4 w-4" /> Template
            </label>
            <Select value={selectedTemplate} onValueChange={(v) => onChangeTemplate(v as TemplateId)}>
              <SelectTrigger className="bg-muted border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {templateOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Palette className="h-4 w-4" /> Color Theme
            </label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onChangeSettings({ ...settings, colorTheme: color.value as TemplateSettings['colorTheme'] })}
                  className={`w-8 h-8 rounded-full ${color.color} transition-all ${
                    settings.colorTheme === color.value ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Font Style</label>
            <Select
              value={settings.fontStyle}
              onValueChange={(v) => onChangeSettings({ ...settings, fontStyle: v as TemplateSettings['fontStyle'] })}
            >
              <SelectTrigger className="bg-muted border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="helvetica">Helvetica</SelectItem>
                <SelectItem value="sora">Sora</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-primary to-accent text-white"
          >
            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {isExporting ? 'Generating...' : 'Download PDF'}
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="outline"
            className="w-full border-border text-muted-foreground hover:bg-muted"
          >
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isSaving ? 'Saving...' : 'Save to Account'}
          </Button>
        </div>
      </motion.div>

      {/* Preview Area */}
      <div className="flex-1 bg-muted/50 p-6 lg:p-12 overflow-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[850px] mx-auto"
        >
          <div ref={resumeRef} className="transform origin-top scale-[0.85] lg:scale-100">
            {renderTemplate()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
