 import React from 'react';
 import { motion } from 'framer-motion';
 import { Card } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Check, Eye } from 'lucide-react';
 import type { TemplateId } from '@/types/resume';
 
 interface TemplateGalleryProps {
   selectedTemplate: TemplateId;
   onSelectTemplate: (template: TemplateId) => void;
   onProceed: () => void;
 }
 
 const templates: { id: TemplateId; name: string; description: string; color: string }[] = [
   {
     id: 'modern-corporate',
     name: 'Modern Corporate',
     description: 'Clean, professional design for corporate roles',
     color: 'from-blue-500 to-blue-600'
   },
   {
     id: 'minimal-professional',
     name: 'Minimal Professional',
     description: 'Elegant simplicity with focus on content',
     color: 'from-gray-500 to-gray-600'
   },
   {
     id: 'creative-designer',
     name: 'Creative Designer',
     description: 'Bold layout for creative professionals',
     color: 'from-purple-500 to-pink-500'
   },
   {
     id: 'technical-engineer',
     name: 'Technical Engineer',
     description: 'Structured format for tech roles',
     color: 'from-green-500 to-emerald-600'
   },
   {
     id: 'academic-overleaf',
     name: 'Academic Overleaf',
     description: 'LaTeX-inspired scholarly style',
     color: 'from-amber-500 to-orange-600'
   },
   {
     id: 'executive-resume',
     name: 'Executive Resume',
     description: 'Premium design for senior positions',
     color: 'from-slate-600 to-slate-800'
   }
 ];
 
 export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
   selectedTemplate,
   onSelectTemplate,
   onProceed
 }) => {
   return (
     <div className="min-h-screen px-6 py-12">
       <div className="max-w-6xl mx-auto">
         <motion.div
           className="text-center mb-12"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
         >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Choose Your Template
            </h1>
            <p className="text-muted-foreground">
             Select a design that best represents your professional style
           </p>
         </motion.div>
 
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
           {templates.map((template, index) => (
             <motion.div
               key={template.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
             >
               <Card
                 className={`relative cursor-pointer overflow-hidden transition-all duration-300 ${
                   selectedTemplate === template.id
                  ? 'ring-2 ring-primary border-primary'
                      : 'border-border hover:border-muted-foreground'
                 }`}
                 onClick={() => onSelectTemplate(template.id)}
               >
                 {/* Template Preview */}
                 <div className={`h-48 bg-gradient-to-br ${template.color} p-4`}>
                   <div className="bg-white/90 rounded-lg h-full p-3 text-left">
                     <div className="h-3 w-24 bg-slate-800 rounded mb-2" />
                     <div className="h-2 w-16 bg-slate-400 rounded mb-4" />
                     <div className="space-y-1.5">
                       <div className="h-1.5 w-full bg-slate-200 rounded" />
                       <div className="h-1.5 w-4/5 bg-slate-200 rounded" />
                       <div className="h-1.5 w-3/4 bg-slate-200 rounded" />
                     </div>
                     <div className="mt-3 h-2 w-20 bg-slate-300 rounded" />
                     <div className="mt-2 space-y-1">
                       <div className="h-1.5 w-full bg-slate-200 rounded" />
                       <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
                     </div>
                   </div>
                 </div>
 
                 {/* Template Info */}
                  <div className="p-4 bg-card">
                    <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                 </div>
 
                 {/* Selected Badge */}
                 {selectedTemplate === template.id && (
                   <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1">
                     <Check className="h-4 w-4" />
                   </div>
                 )}
               </Card>
             </motion.div>
           ))}
         </div>
 
         <motion.div
           className="text-center"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
         >
           <Button
             onClick={onProceed}
             size="lg"
             className="bg-gradient-to-r from-primary to-accent text-white px-12"
           >
             <Eye className="mr-2 h-5 w-5" />
             Preview Resume
           </Button>
         </motion.div>
       </div>
     </div>
   );
 };