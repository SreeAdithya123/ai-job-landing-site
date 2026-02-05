import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useResumeBuilder } from '@/hooks/useResumeBuilder';
import { ResumeBuilderLanding } from '@/components/resume-builder/ResumeBuilderLanding';
import { ResumeQuestionnaire } from '@/components/resume-builder/ResumeQuestionnaire';
import { ResumeGeneration } from '@/components/resume-builder/ResumeGeneration';
import { TemplateGallery } from '@/components/resume-builder/TemplateGallery';
import { TemplatePreview } from '@/components/resume-builder/TemplatePreview';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    formData,
    generatedResume,
    selectedTemplate,
    templateSettings,
    isGenerating,
    isSaving,
    error,
    updateFormData,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    setSelectedTemplate,
    setTemplateSettings,
    generateResume,
    saveResume,
  } = useResumeBuilder();

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      });
    }
  }, [error]);

  const showHeader = currentStep !== 'landing' && currentStep !== 'generating' && currentStep !== 'preview';

  const renderContent = () => {
    switch (currentStep) {
      case 'landing':
        return <ResumeBuilderLanding onStart={() => goToStep('personal-info')} />;
      
      case 'personal-info':
      case 'career-summary':
      case 'education':
      case 'skills':
      case 'projects':
      case 'experience':
      case 'certifications':
      case 'achievements':
        return (
          <ResumeQuestionnaire
            currentStep={currentStep}
            formData={formData}
            onUpdateFormData={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            onGenerate={generateResume}
            isGenerating={isGenerating}
          />
        );
      
      case 'generating':
        return <ResumeGeneration />;
      
      case 'template-gallery':
        return (
          <TemplateGallery
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onProceed={() => goToStep('preview')}
          />
        );
      
      case 'preview':
        if (!generatedResume) {
          goToStep('template-gallery');
          return null;
        }
        return (
          <TemplatePreview
            data={generatedResume}
            selectedTemplate={selectedTemplate}
            settings={templateSettings}
            onChangeTemplate={setSelectedTemplate}
            onChangeSettings={setTemplateSettings}
            onBack={() => goToStep('template-gallery')}
            onSave={saveResume}
            isSaving={isSaving}
          />
        );
      
      default:
        return <ResumeBuilderLanding onStart={() => goToStep('personal-info')} />;
    }
  };

  return (
    <ProtectedRoute>
      <Layout fullSize>
        {/* Header - show only during questionnaire and template gallery */}
        {showHeader && (
          <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <h1 className="text-lg font-semibold text-white">AI Resume Builder</h1>
              
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ResumeBuilder;
