 import React from 'react';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Button } from '@/components/ui/button';
 import { Card } from '@/components/ui/card';
 import { Plus, Trash2 } from 'lucide-react';
 import type { Education } from '@/types/resume';
 
 interface EducationStepProps {
   data: Education[];
   onChange: (data: Education[]) => void;
 }
 
 export const EducationStep: React.FC<EducationStepProps> = ({ data, onChange }) => {
   const addEducation = () => {
     const newEducation: Education = {
       id: crypto.randomUUID(),
       degree: '',
       institution: '',
       graduationYear: '',
       cgpa: '',
       achievements: ''
     };
     onChange([...data, newEducation]);
   };
 
   const updateEducation = (id: string, field: keyof Education, value: string) => {
     onChange(data.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
   };
 
   const removeEducation = (id: string) => {
     onChange(data.filter(edu => edu.id !== id));
   };
 
   return (
     <div className="space-y-6">
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-foreground mb-2">Education</h2>
         <p className="text-muted-foreground">Add your educational background</p>
       </div>
 
       <div className="space-y-4">
         {data.map((edu, index) => (
           <Card key={edu.id} className="bg-card border-border p-6">
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-lg font-semibold text-foreground">Education #{index + 1}</h3>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => removeEducation(edu.id)}
                 className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
               >
                 <Trash2 className="h-4 w-4" />
               </Button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label className="text-foreground">Degree *</Label>
                 <Input
                   value={edu.degree}
                   onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                   placeholder="B.Tech in Computer Science"
                   className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                 />
               </div>
 
               <div className="space-y-2">
                 <Label className="text-foreground">Institution *</Label>
                 <Input
                   value={edu.institution}
                   onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                   placeholder="IIT Delhi"
                   className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                 />
               </div>
 
               <div className="space-y-2">
                 <Label className="text-foreground">Graduation Year</Label>
                 <Input
                   value={edu.graduationYear}
                   onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                   placeholder="2024"
                   className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                 />
               </div>
 
               <div className="space-y-2">
                 <Label className="text-foreground">CGPA / Percentage</Label>
                 <Input
                   value={edu.cgpa || ''}
                   onChange={(e) => updateEducation(edu.id, 'cgpa', e.target.value)}
                   placeholder="8.5 CGPA or 85%"
                   className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                 />
               </div>
 
               <div className="space-y-2 md:col-span-2">
                 <Label className="text-foreground">Key Achievements</Label>
                 <Input
                   value={edu.achievements || ''}
                   onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value)}
                   placeholder="Dean's List, Academic Excellence Award"
                   className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                 />
               </div>
             </div>
           </Card>
         ))}
 
         <Button
           onClick={addEducation}
           variant="outline"
           className="w-full border-dashed border-border text-muted-foreground hover:bg-muted hover:text-foreground"
         >
           <Plus className="h-4 w-4 mr-2" />
           Add Education
         </Button>
       </div>
     </div>
   );
 };
