 import React from 'react';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Button } from '@/components/ui/button';
 import { Card } from '@/components/ui/card';
 import { Plus, Trash2 } from 'lucide-react';
 import type { Certification } from '@/types/resume';
 
 interface CertificationsStepProps {
   data: Certification[];
   onChange: (data: Certification[]) => void;
 }
 
 export const CertificationsStep: React.FC<CertificationsStepProps> = ({ data, onChange }) => {
   const addCertification = () => {
     const newCert: Certification = {
       id: crypto.randomUUID(),
       name: '',
       platform: '',
       year: ''
     };
     onChange([...data, newCert]);
   };
 
   const updateCertification = (id: string, field: keyof Certification, value: string) => {
     onChange(data.map(cert => cert.id === id ? { ...cert, [field]: value } : cert));
   };
 
   const removeCertification = (id: string) => {
     onChange(data.filter(cert => cert.id !== id));
   };
 
   return (
     <div className="space-y-6">
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-foreground mb-2">Certifications</h2>
         <p className="text-muted-foreground">Add your professional certifications and courses</p>
       </div>
 
       <div className="space-y-4">
         {data.map((cert, index) => (
           <Card key={cert.id} className="bg-card border-border p-6">
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-lg font-semibold text-foreground">Certification #{index + 1}</h3>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => removeCertification(cert.id)}
                 className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
               >
                 <Trash2 className="h-4 w-4" />
               </Button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-2 md:col-span-2">
                 <Label className="text-foreground">Certification Name *</Label>
                 <Input
                   value={cert.name}
                   onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                   placeholder="AWS Certified Solutions Architect"
                   className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                 />
               </div>
 
               <div className="space-y-2">
                 <Label className="text-foreground">Year</Label>
                 <Input
                   value={cert.year}
                   onChange={(e) => updateCertification(cert.id, 'year', e.target.value)}
                   placeholder="2024"
                   className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                 />
               </div>
 
               <div className="space-y-2 md:col-span-3">
                 <Label className="text-foreground">Issuing Organization / Platform</Label>
                 <Input
                   value={cert.platform}
                   onChange={(e) => updateCertification(cert.id, 'platform', e.target.value)}
                   placeholder="Amazon Web Services, Coursera, Udemy"
                   className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                 />
               </div>
             </div>
           </Card>
         ))}
 
         <Button
           onClick={addCertification}
           variant="outline"
           className="w-full border-dashed border-border text-muted-foreground hover:bg-muted hover:text-foreground"
         >
           <Plus className="h-4 w-4 mr-2" />
           Add Certification
         </Button>
       </div>
     </div>
   );
 };
