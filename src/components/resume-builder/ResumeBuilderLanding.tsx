import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, Target, Download, Palette, Shield } from 'lucide-react';

interface ResumeBuilderLandingProps {
  onStart: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Content',
    description: 'Intelligent enhancement of your experience and skills'
  },
  {
    icon: Target,
    title: 'ATS Optimized',
    description: 'Designed to pass Applicant Tracking Systems'
  },
  {
    icon: Palette,
    title: 'Premium Templates',
    description: '6 professionally designed resume layouts'
  },
  {
    icon: Download,
    title: 'Instant Download',
    description: 'Export as PDF ready for applications'
  },
  {
    icon: Shield,
    title: 'Recruiter Ready',
    description: 'Formatted for maximum recruiter impact'
  },
  {
    icon: FileText,
    title: 'Easy Editing',
    description: 'Switch templates without regenerating'
  }
];

export const ResumeBuilderLanding: React.FC<ResumeBuilderLandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
            <FileText className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
          Build Your Resume with
          <span className="text-primary"> AI Precision</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          ATS-optimized. Recruiter-ready. Designed to stand out.
        </p>

        <Button
          onClick={onStart}
          size="lg"
          className="px-8 py-6 text-lg font-semibold"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Start Building
        </Button>

        <p className="text-sm text-muted-foreground mt-4">
          Takes about 5 minutes • Auto-saves your progress
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="px-6 pb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-glow transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};