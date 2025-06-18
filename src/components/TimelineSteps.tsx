
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Mic, BarChart3 } from 'lucide-react';

const TimelineSteps = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Add resume',
      description: 'Upload resume to customize AI'
    },
    {
      icon: FileText,
      title: 'Add position',
      description: 'Upload or enter position/cover letter to customize AI'
    },
    {
      icon: Mic,
      title: 'Run Interview',
      description: 'Launch Interview Copilot™ for real-time support'
    },
    {
      icon: BarChart3,
      title: 'Interview Report',
      description: 'Review notes and post-interview performance'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {/* Timeline line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 hidden md:block" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative text-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            >
              {/* Step icon container */}
              <div className="relative mx-auto w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-glow group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                <step.icon className="h-8 w-8 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
              </div>
              
              {/* Step content */}
              <div className="glass-card p-4 rounded-xl">
                <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TimelineSteps;
