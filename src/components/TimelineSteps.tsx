
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
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-200 via-pink-200 to-orange-200 hidden md:block" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            >
              {/* Step number and icon */}
              <div className="relative mx-auto w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <step.icon className="h-8 w-8 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                </div>
              </div>
              
              {/* Step content */}
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TimelineSteps;
