 import React, { useState } from 'react';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Button } from '@/components/ui/button';
 import { Card } from '@/components/ui/card';
 import { Plus, Trash2, X } from 'lucide-react';
 import type { Experience } from '@/types/resume';
 
 interface ExperienceStepProps {
   data: Experience[];
   onChange: (data: Experience[]) => void;
 }
 
 export const ExperienceStep: React.FC<ExperienceStepProps> = ({ data, onChange }) => {
   const [respInputs, setRespInputs] = useState<Record<string, string>>({});
   const [achInputs, setAchInputs] = useState<Record<string, string>>({});
 
   const addExperience = () => {
     const newExp: Experience = {
       id: crypto.randomUUID(),
       company: '',
       role: '',
       duration: '',
       responsibilities: [],
       achievements: []
     };
     onChange([...data, newExp]);
   };
 
   const updateExperience = (id: string, field: keyof Experience, value: string | string[]) => {
     onChange(data.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
   };
 
   const removeExperience = (id: string) => {
     onChange(data.filter(exp => exp.id !== id));
   };
 
   const addResponsibility = (expId: string) => {
     const value = (respInputs[expId] || '').trim();
     const exp = data.find(e => e.id === expId);
     if (value && exp) {
       updateExperience(expId, 'responsibilities', [...exp.responsibilities, value]);
       setRespInputs(prev => ({ ...prev, [expId]: '' }));
     }
   };
 
   const removeResponsibility = (expId: string, resp: string) => {
     const exp = data.find(e => e.id === expId);
     if (exp) {
       updateExperience(expId, 'responsibilities', exp.responsibilities.filter(r => r !== resp));
     }
   };
 
   const addAchievement = (expId: string) => {
     const value = (achInputs[expId] || '').trim();
     const exp = data.find(e => e.id === expId);
     if (value && exp) {
       updateExperience(expId, 'achievements', [...(exp.achievements || []), value]);
       setAchInputs(prev => ({ ...prev, [expId]: '' }));
     }
   };
 
   const removeAchievement = (expId: string, ach: string) => {
     const exp = data.find(e => e.id === expId);
     if (exp) {
       updateExperience(expId, 'achievements', (exp.achievements || []).filter(a => a !== ach));
     }
   };
 
   return (
     <div className="space-y-6">
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-foreground mb-2">Work Experience</h2>
         <p className="text-muted-foreground">Add your professional experience and internships</p>
       </div>
 
       <div className="space-y-4">
         {data.map((exp, index) => (
           <Card key={exp.id} className="bg-card border-border p-6">
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-lg font-semibold text-foreground">Experience #{index + 1}</h3>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => removeExperience(exp.id)}
                 className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
               >
                 <Trash2 className="h-4 w-4" />
               </Button>
             </div>
             
             <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label className="text-foreground">Company Name *</Label>
                   <Input
                     value={exp.company}
                     onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                     placeholder="Google"
                     className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label className="text-foreground">Role / Position *</Label>
                   <Input
                     value={exp.role}
                     onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                     placeholder="Software Engineer"
                     className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                   />
                 </div>
 
                 <div className="space-y-2 md:col-span-2">
                   <Label className="text-foreground">Duration</Label>
                   <Input
                     value={exp.duration}
                     onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                     placeholder="Jan 2022 - Present"
                     className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                   />
                 </div>
               </div>
 
               <div className="space-y-2">
                 <Label className="text-foreground">Responsibilities</Label>
                 <Input
                   value={respInputs[exp.id] || ''}
                   onChange={(e) => setRespInputs(prev => ({ ...prev, [exp.id]: e.target.value }))}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       e.preventDefault();
                       addResponsibility(exp.id);
                     }
                   }}
                   placeholder="Press Enter to add each responsibility"
                   className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                 />
                 {exp.responsibilities.length > 0 && (
                   <ul className="mt-2 space-y-1">
                     {exp.responsibilities.map((resp, i) => (
                       <li key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                         <span className="flex-1">• {resp}</span>
                         <button onClick={() => removeResponsibility(exp.id, resp)} className="text-red-400 hover:text-red-300">
                           <X className="h-3 w-3" />
                         </button>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
 
               <div className="space-y-2">
                 <Label className="text-foreground">Key Achievements</Label>
                 <Input
                   value={achInputs[exp.id] || ''}
                   onChange={(e) => setAchInputs(prev => ({ ...prev, [exp.id]: e.target.value }))}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       e.preventDefault();
                       addAchievement(exp.id);
                     }
                   }}
                   placeholder="Press Enter to add achievements"
                   className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                 />
                 {(exp.achievements || []).length > 0 && (
                   <ul className="mt-2 space-y-1">
                     {(exp.achievements || []).map((ach, i) => (
                       <li key={i} className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                         <span className="flex-1">★ {ach}</span>
                         <button onClick={() => removeAchievement(exp.id, ach)} className="text-red-400 hover:text-red-300">
                           <X className="h-3 w-3" />
                         </button>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
             </div>
           </Card>
         ))}
 
         <Button
           onClick={addExperience}
           variant="outline"
           className="w-full border-dashed border-border text-muted-foreground hover:bg-muted hover:text-foreground"
         >
           <Plus className="h-4 w-4 mr-2" />
           Add Experience
         </Button>
       </div>
 
       <p className="text-sm text-muted-foreground text-center">
         AI will rewrite responsibilities into impactful corporate bullet points.
       </p>
     </div>
   );
 };
