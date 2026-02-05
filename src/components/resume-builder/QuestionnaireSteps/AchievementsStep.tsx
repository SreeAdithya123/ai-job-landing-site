 import React from 'react';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Button } from '@/components/ui/button';
 import { Card } from '@/components/ui/card';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Plus, Trash2, Trophy, Award, Users, BookOpen, Star } from 'lucide-react';
 import type { Achievement } from '@/types/resume';
 
 interface AchievementsStepProps {
   data: Achievement[];
   onChange: (data: Achievement[]) => void;
 }
 
 const typeIcons: Record<Achievement['type'], React.ReactNode> = {
   hackathon: <Trophy className="h-4 w-4" />,
   award: <Award className="h-4 w-4" />,
   leadership: <Users className="h-4 w-4" />,
   publication: <BookOpen className="h-4 w-4" />,
   other: <Star className="h-4 w-4" />
 };
 
 const typeLabels: Record<Achievement['type'], string> = {
   hackathon: 'Hackathon',
   award: 'Award',
   leadership: 'Leadership',
   publication: 'Publication',
   other: 'Other'
 };
 
 export const AchievementsStep: React.FC<AchievementsStepProps> = ({ data, onChange }) => {
   const addAchievement = () => {
     const newAch: Achievement = {
       id: crypto.randomUUID(),
       title: '',
       description: '',
       type: 'award'
     };
     onChange([...data, newAch]);
   };
 
   const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
     onChange(data.map(ach => ach.id === id ? { ...ach, [field]: value } : ach));
   };
 
   const removeAchievement = (id: string) => {
     onChange(data.filter(ach => ach.id !== id));
   };
 
   return (
     <div className="space-y-6">
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-white mb-2">Achievements & Activities</h2>
         <p className="text-slate-400">Highlight your accomplishments and leadership roles</p>
       </div>
 
       <div className="space-y-4">
         {data.map((ach, index) => (
           <Card key={ach.id} className="bg-slate-800/50 border-slate-700 p-6">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-2">
                 <span className="text-primary">{typeIcons[ach.type]}</span>
                 <h3 className="text-lg font-semibold text-white">Achievement #{index + 1}</h3>
               </div>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => removeAchievement(ach.id)}
                 className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
               >
                 <Trash2 className="h-4 w-4" />
               </Button>
             </div>
             
             <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2 md:col-span-2">
                   <Label className="text-white">Title *</Label>
                   <Input
                     value={ach.title}
                     onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)}
                     placeholder="Winner - Smart India Hackathon 2024"
                     className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label className="text-white">Type</Label>
                   <Select
                     value={ach.type}
                     onValueChange={(value) => updateAchievement(ach.id, 'type', value)}
                   >
                     <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="bg-slate-800 border-slate-700">
                       {(Object.keys(typeLabels) as Achievement['type'][]).map((type) => (
                         <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                           <div className="flex items-center gap-2">
                             {typeIcons[type]}
                             {typeLabels[type]}
                           </div>
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               </div>
 
               <div className="space-y-2">
                 <Label className="text-white">Description</Label>
                 <Textarea
                   value={ach.description}
                   onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)}
                   placeholder="Brief description of your achievement..."
                   rows={2}
                   className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                 />
               </div>
             </div>
           </Card>
         ))}
 
         <Button
           onClick={addAchievement}
           variant="outline"
           className="w-full border-dashed border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white"
         >
           <Plus className="h-4 w-4 mr-2" />
           Add Achievement
         </Button>
       </div>
     </div>
   );
 };