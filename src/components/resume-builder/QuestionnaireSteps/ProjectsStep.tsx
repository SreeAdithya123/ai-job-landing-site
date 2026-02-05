 import React from 'react';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Button } from '@/components/ui/button';
 import { Card } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Plus, Trash2, X } from 'lucide-react';
 import type { Project } from '@/types/resume';
 
 interface ProjectsStepProps {
   data: Project[];
   onChange: (data: Project[]) => void;
 }
 
 export const ProjectsStep: React.FC<ProjectsStepProps> = ({ data, onChange }) => {
   const [techInputs, setTechInputs] = React.useState<Record<string, string>>({});
 
   const addProject = () => {
     const newProject: Project = {
       id: crypto.randomUUID(),
       title: '',
       description: '',
       technologies: [],
       role: '',
       outcome: ''
     };
     onChange([...data, newProject]);
   };
 
   const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
     onChange(data.map(proj => proj.id === id ? { ...proj, [field]: value } : proj));
   };
 
   const removeProject = (id: string) => {
     onChange(data.filter(proj => proj.id !== id));
     setTechInputs(prev => {
       const next = { ...prev };
       delete next[id];
       return next;
     });
   };
 
   const addTech = (projectId: string) => {
     const value = (techInputs[projectId] || '').trim();
     const project = data.find(p => p.id === projectId);
     if (value && project && !project.technologies.includes(value)) {
       updateProject(projectId, 'technologies', [...project.technologies, value]);
       setTechInputs(prev => ({ ...prev, [projectId]: '' }));
     }
   };
 
   const removeTech = (projectId: string, tech: string) => {
     const project = data.find(p => p.id === projectId);
     if (project) {
       updateProject(projectId, 'technologies', project.technologies.filter(t => t !== tech));
     }
   };
 
   return (
     <div className="space-y-6">
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-white mb-2">Projects</h2>
         <p className="text-slate-400">Showcase your best work</p>
       </div>
 
       <div className="space-y-4">
         {data.map((project, index) => (
           <Card key={project.id} className="bg-slate-800/50 border-slate-700 p-6">
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-lg font-semibold text-white">Project #{index + 1}</h3>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => removeProject(project.id)}
                 className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
               >
                 <Trash2 className="h-4 w-4" />
               </Button>
             </div>
             
             <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label className="text-white">Project Title *</Label>
                   <Input
                     value={project.title}
                     onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                     placeholder="E-commerce Platform"
                     className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label className="text-white">Your Role</Label>
                   <Input
                     value={project.role}
                     onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                     placeholder="Lead Developer"
                     className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                   />
                 </div>
               </div>
 
               <div className="space-y-2">
                 <Label className="text-white">Description</Label>
                 <Textarea
                   value={project.description}
                   onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                   placeholder="Describe what you built and the problem it solved..."
                   rows={3}
                   className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                 />
               </div>
 
               <div className="space-y-2">
                 <Label className="text-white">Technologies Used</Label>
                 <Input
                   value={techInputs[project.id] || ''}
                   onChange={(e) => setTechInputs(prev => ({ ...prev, [project.id]: e.target.value }))}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       e.preventDefault();
                       addTech(project.id);
                     }
                   }}
                   placeholder="Press Enter to add technologies"
                   className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                 />
                 {project.technologies.length > 0 && (
                   <div className="flex flex-wrap gap-2 mt-2">
                     {project.technologies.map((tech, i) => (
                       <Badge key={i} variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                         {tech}
                         <button onClick={() => removeTech(project.id, tech)} className="ml-2 hover:text-red-400">
                           <X className="h-3 w-3" />
                         </button>
                       </Badge>
                     ))}
                   </div>
                 )}
               </div>
 
               <div className="space-y-2">
                 <Label className="text-white">Outcome / Impact</Label>
                 <Input
                   value={project.outcome || ''}
                   onChange={(e) => updateProject(project.id, 'outcome', e.target.value)}
                   placeholder="e.g., Increased sales by 30%, Reduced load time by 50%"
                   className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                 />
               </div>
             </div>
           </Card>
         ))}
 
         <Button
           onClick={addProject}
           variant="outline"
           className="w-full border-dashed border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white"
         >
           <Plus className="h-4 w-4 mr-2" />
           Add Project
         </Button>
       </div>
 
       <p className="text-sm text-slate-500 text-center">
         AI will enhance descriptions with action verbs and quantifiable results.
       </p>
     </div>
   );
 };