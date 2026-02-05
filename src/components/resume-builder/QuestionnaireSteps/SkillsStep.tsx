 import React, { useState } from 'react';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Badge } from '@/components/ui/badge';
 import { X } from 'lucide-react';
 import type { SkillCategories } from '@/types/resume';
 
 interface SkillsStepProps {
   data: SkillCategories;
   onChange: (data: SkillCategories) => void;
 }
 
 const categoryLabels: Record<keyof SkillCategories, { label: string; placeholder: string }> = {
   core: { label: 'Core Skills', placeholder: 'e.g., Problem Solving, System Design' },
   tools: { label: 'Tools & Platforms', placeholder: 'e.g., Git, Docker, AWS' },
   technologies: { label: 'Technologies & Languages', placeholder: 'e.g., JavaScript, Python, React' },
   soft: { label: 'Soft Skills', placeholder: 'e.g., Leadership, Communication' }
 };
 
 export const SkillsStep: React.FC<SkillsStepProps> = ({ data, onChange }) => {
   const [inputs, setInputs] = useState<Record<keyof SkillCategories, string>>({
     core: '',
     tools: '',
     technologies: '',
     soft: ''
   });
 
   const addSkill = (category: keyof SkillCategories) => {
     const value = inputs[category].trim();
     if (value && !data[category].includes(value)) {
       onChange({
         ...data,
         [category]: [...data[category], value]
       });
       setInputs(prev => ({ ...prev, [category]: '' }));
     }
   };
 
   const removeSkill = (category: keyof SkillCategories, skill: string) => {
     onChange({
       ...data,
       [category]: data[category].filter(s => s !== skill)
     });
   };
 
   const handleKeyDown = (e: React.KeyboardEvent, category: keyof SkillCategories) => {
     if (e.key === 'Enter') {
       e.preventDefault();
       addSkill(category);
     }
   };
 
   return (
     <div className="space-y-6">
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-white mb-2">Skills</h2>
         <p className="text-slate-400">Add your technical and soft skills</p>
       </div>
 
       <div className="space-y-6">
         {(Object.keys(categoryLabels) as Array<keyof SkillCategories>).map((category) => (
           <div key={category} className="space-y-2">
             <Label className="text-white">{categoryLabels[category].label}</Label>
             <Input
               value={inputs[category]}
               onChange={(e) => setInputs(prev => ({ ...prev, [category]: e.target.value }))}
               onKeyDown={(e) => handleKeyDown(e, category)}
               placeholder={categoryLabels[category].placeholder}
               className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
             />
             {data[category].length > 0 && (
               <div className="flex flex-wrap gap-2 mt-2">
                 {data[category].map((skill, index) => (
                   <Badge 
                     key={index} 
                     variant="secondary" 
                     className="bg-primary/20 text-primary border-primary/30 px-3 py-1"
                   >
                     {skill}
                     <button 
                       onClick={() => removeSkill(category, skill)} 
                       className="ml-2 hover:text-red-400"
                     >
                       <X className="h-3 w-3" />
                     </button>
                   </Badge>
                 ))}
               </div>
             )}
           </div>
         ))}
       </div>
 
       <p className="text-sm text-slate-500 text-center">
         Press Enter to add each skill. AI will categorize and optimize them for ATS.
       </p>
     </div>
   );
 };