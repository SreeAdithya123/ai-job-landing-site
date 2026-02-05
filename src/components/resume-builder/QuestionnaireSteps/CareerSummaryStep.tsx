 import React from 'react';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Badge } from '@/components/ui/badge';
 import { X } from 'lucide-react';
 import type { CareerInfo } from '@/types/resume';
 
 interface CareerSummaryStepProps {
   data: CareerInfo;
   onChange: (data: CareerInfo) => void;
 }
 
 export const CareerSummaryStep: React.FC<CareerSummaryStepProps> = ({ data, onChange }) => {
   const [strengthInput, setStrengthInput] = React.useState('');
 
   const handleChange = (field: keyof CareerInfo, value: string | string[]) => {
     onChange({ ...data, [field]: value });
   };
 
   const addStrength = () => {
     if (strengthInput.trim() && !data.keyStrengths.includes(strengthInput.trim())) {
       handleChange('keyStrengths', [...data.keyStrengths, strengthInput.trim()]);
       setStrengthInput('');
     }
   };
 
   const removeStrength = (strength: string) => {
     handleChange('keyStrengths', data.keyStrengths.filter(s => s !== strength));
   };
 
   const handleKeyDown = (e: React.KeyboardEvent) => {
     if (e.key === 'Enter') {
       e.preventDefault();
       addStrength();
     }
   };
 
   return (
     <div className="space-y-6">
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-white mb-2">Career Goals</h2>
         <p className="text-slate-400">Tell us about your career aspirations</p>
       </div>
 
       <div className="space-y-6">
         <div className="space-y-2">
           <Label htmlFor="targetRole" className="text-white">What role are you targeting? *</Label>
           <Input
             id="targetRole"
             value={data.targetRole}
             onChange={(e) => handleChange('targetRole', e.target.value)}
             placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
             className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="experience" className="text-white">Years of Experience</Label>
           <Input
             id="experience"
             value={data.yearsOfExperience}
             onChange={(e) => handleChange('yearsOfExperience', e.target.value)}
             placeholder="e.g., 2 years, Fresher, 5+ years"
             className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="strengths" className="text-white">Key Strengths</Label>
           <div className="flex gap-2">
             <Input
               id="strengths"
               value={strengthInput}
               onChange={(e) => setStrengthInput(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="Type a strength and press Enter"
               className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
             />
           </div>
           {data.keyStrengths.length > 0 && (
             <div className="flex flex-wrap gap-2 mt-3">
               {data.keyStrengths.map((strength, index) => (
                 <Badge key={index} variant="secondary" className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
                   {strength}
                   <button onClick={() => removeStrength(strength)} className="ml-2 hover:text-red-400">
                     <X className="h-3 w-3" />
                   </button>
                 </Badge>
               ))}
             </div>
           )}
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="objective" className="text-white">Career Objective</Label>
           <Textarea
             id="objective"
             value={data.careerObjective}
             onChange={(e) => handleChange('careerObjective', e.target.value)}
             placeholder="Briefly describe your career goals and what you're looking for..."
             rows={4}
             className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
           />
           <p className="text-xs text-slate-500">AI will enhance this into a professional summary</p>
         </div>
       </div>
     </div>
   );
 };