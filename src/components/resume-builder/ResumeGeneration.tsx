 import React from 'react';
 import { motion } from 'framer-motion';
 import { Loader2, FileText, Sparkles, Wand2 } from 'lucide-react';
 
 export const ResumeGeneration: React.FC = () => {
   const steps = [
     { icon: FileText, text: 'Analyzing your profile...' },
     { icon: Sparkles, text: 'Enhancing content with AI...' },
     { icon: Wand2, text: 'Optimizing for ATS...' }
   ];
 
   return (
     <div className="min-h-screen flex items-center justify-center px-6">
       <motion.div
         className="text-center max-w-md"
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5 }}
       >
         <div className="relative mb-8">
           <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/30">
             <Loader2 className="h-12 w-12 text-white animate-spin" />
           </div>
           <motion.div
             className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl"
             animate={{ opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
           />
         </div>
 
         <h2 className="text-2xl font-bold text-white mb-2">
           Designing your professional resume...
         </h2>
         <p className="text-slate-400 mb-8">
           Our AI is crafting ATS-optimized content tailored to your experience
         </p>
 
         <div className="space-y-4">
           {steps.map((step, index) => (
             <motion.div
               key={index}
               className="flex items-center gap-3 justify-center text-slate-300"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: index * 0.5, duration: 0.4 }}
             >
               <step.icon className="h-5 w-5 text-primary" />
               <span>{step.text}</span>
             </motion.div>
           ))}
         </div>
       </motion.div>
     </div>
   );
 };