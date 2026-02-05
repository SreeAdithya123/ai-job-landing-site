 import React from 'react';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import type { PersonalInfo } from '@/types/resume';
 
 interface PersonalInfoStepProps {
   data: PersonalInfo;
   onChange: (data: PersonalInfo) => void;
 }
 
 export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onChange }) => {
   const handleChange = (field: keyof PersonalInfo, value: string) => {
     onChange({ ...data, [field]: value });
   };
 
   return (
     <div className="space-y-6">
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
         <p className="text-slate-400">Let's start with your basic details</p>
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2">
           <Label htmlFor="fullName" className="text-white">Full Name *</Label>
           <Input
             id="fullName"
             value={data.fullName}
             onChange={(e) => handleChange('fullName', e.target.value)}
             placeholder="John Doe"
             className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="email" className="text-white">Email Address *</Label>
           <Input
             id="email"
             type="email"
             value={data.email}
             onChange={(e) => handleChange('email', e.target.value)}
             placeholder="john@example.com"
             className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="phone" className="text-white">Phone Number *</Label>
           <Input
             id="phone"
             value={data.phone}
             onChange={(e) => handleChange('phone', e.target.value)}
             placeholder="+91 9876543210"
             className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="location" className="text-white">Location</Label>
           <Input
             id="location"
             value={data.location || ''}
             onChange={(e) => handleChange('location', e.target.value)}
             placeholder="Mumbai, India"
             className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="linkedin" className="text-white">LinkedIn Profile</Label>
           <Input
             id="linkedin"
             value={data.linkedin || ''}
             onChange={(e) => handleChange('linkedin', e.target.value)}
             placeholder="linkedin.com/in/johndoe"
             className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="portfolio" className="text-white">Portfolio / GitHub</Label>
           <Input
             id="portfolio"
             value={data.portfolio || ''}
             onChange={(e) => handleChange('portfolio', e.target.value)}
             placeholder="github.com/johndoe"
             className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
           />
         </div>
       </div>
     </div>
   );
 };