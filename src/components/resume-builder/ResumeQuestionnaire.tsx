 import React from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Button } from '@/components/ui/button';
 import { Progress } from '@/components/ui/progress';
 import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
 import { PersonalInfoStep } from './QuestionnaireSteps/PersonalInfoStep';
 import { CareerSummaryStep } from './QuestionnaireSteps/CareerSummaryStep';
 import { EducationStep } from './QuestionnaireSteps/EducationStep';
 import { SkillsStep } from './QuestionnaireSteps/SkillsStep';
 import { ProjectsStep } from './QuestionnaireSteps/ProjectsStep';
 import { ExperienceStep } from './QuestionnaireSteps/ExperienceStep';
 import { CertificationsStep } from './QuestionnaireSteps/CertificationsStep';
 import { AchievementsStep } from './QuestionnaireSteps/AchievementsStep';
 import type { ResumeBuilderStep, QuestionnaireFormData } from '@/types/resume';
 import { STEP_LABELS, QUESTIONNAIRE_STEPS } from '@/types/resume';
 
 interface ResumeQuestionnaireProps {
   currentStep: ResumeBuilderStep;
   formData: QuestionnaireFormData;
   onUpdateFormData: <K extends keyof QuestionnaireFormData>(key: K, value: QuestionnaireFormData[K]) => void;
   onNext: () => void;
   onPrevious: () => void;
   onGenerate: () => void;
   isGenerating: boolean;
 }
 
 export const ResumeQuestionnaire: React.FC<ResumeQuestionnaireProps> = ({
   currentStep,
   formData,
   onUpdateFormData,
   onNext,
   onPrevious,
   onGenerate,
   isGenerating
 }) => {
   const currentIndex = QUESTIONNAIRE_STEPS.indexOf(currentStep);
   const progress = ((currentIndex + 1) / QUESTIONNAIRE_STEPS.length) * 100;
   const isLastStep = currentIndex === QUESTIONNAIRE_STEPS.length - 1;
 
   const renderStep = () => {
     switch (currentStep) {
       case 'personal-info':
         return (
           <PersonalInfoStep
             data={formData.personalInfo}
             onChange={(data) => onUpdateFormData('personalInfo', data)}
           />
         );
       case 'career-summary':
         return (
           <CareerSummaryStep
             data={formData.careerInfo}
             onChange={(data) => onUpdateFormData('careerInfo', data)}
           />
         );
       case 'education':
         return (
           <EducationStep
             data={formData.education}
             onChange={(data) => onUpdateFormData('education', data)}
           />
         );
       case 'skills':
         return (
           <SkillsStep
             data={formData.skills}
             onChange={(data) => onUpdateFormData('skills', data)}
           />
         );
       case 'projects':
         return (
           <ProjectsStep
             data={formData.projects}
             onChange={(data) => onUpdateFormData('projects', data)}
           />
         );
       case 'experience':
         return (
           <ExperienceStep
             data={formData.experience}
             onChange={(data) => onUpdateFormData('experience', data)}
           />
         );
       case 'certifications':
         return (
           <CertificationsStep
             data={formData.certifications}
             onChange={(data) => onUpdateFormData('certifications', data)}
           />
         );
       case 'achievements':
         return (
           <AchievementsStep
             data={formData.achievements}
             onChange={(data) => onUpdateFormData('achievements', data)}
           />
         );
       default:
         return null;
     }
   };
 
   return (
     <div className="min-h-screen flex flex-col">
       {/* Progress Header */}
       <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-4">
         <div className="max-w-3xl mx-auto">
           <div className="flex items-center justify-between mb-3">
             <span className="text-sm text-slate-400">
               Step {currentIndex + 1} of {QUESTIONNAIRE_STEPS.length}
             </span>
             <span className="text-sm font-medium text-primary">
               {STEP_LABELS[currentStep]}
             </span>
           </div>
           <Progress value={progress} className="h-2" />
         </div>
       </div>
 
       {/* Step Content */}
       <div className="flex-1 px-6 py-8">
         <div className="max-w-3xl mx-auto">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
             >
               {renderStep()}
             </motion.div>
           </AnimatePresence>
         </div>
       </div>
 
       {/* Navigation Footer */}
       <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-6 py-4">
         <div className="max-w-3xl mx-auto flex justify-between">
           <Button
             variant="outline"
             onClick={onPrevious}
             className="border-slate-700 text-slate-300 hover:bg-slate-800"
           >
             <ChevronLeft className="h-4 w-4 mr-2" />
             Previous
           </Button>
 
           {isLastStep ? (
             <Button
               onClick={onGenerate}
               disabled={isGenerating}
               className="bg-gradient-to-r from-primary to-accent text-white px-8"
             >
               {isGenerating ? (
                 <>
                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                   Generating...
                 </>
               ) : (
                 'Generate Resume'
               )}
             </Button>
           ) : (
             <Button
               onClick={onNext}
               className="bg-primary text-white"
             >
               Next
               <ChevronRight className="h-4 w-4 ml-2" />
             </Button>
           )}
         </div>
       </div>
     </div>
   );
 };