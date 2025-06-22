
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Mic, BarChart3, Clock, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const TimelineSteps = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Upload,
      title: 'Add resume',
      description: 'Upload resume to customize AI',
      timeEstimate: '2 min',
      difficulty: 'Easy',
      successRate: '98%',
      detailedDescription: 'Simply upload your resume and our AI will analyze it to create personalized interview questions that match your experience.',
      ctaText: 'Upload Resume',
      ctaAction: () => navigate('/resume-scanner')
    },
    {
      icon: FileText,
      title: 'Add position',
      description: 'Upload or enter position/cover letter to customize AI',
      timeEstimate: '3 min',
      difficulty: 'Easy',
      successRate: '95%',
      detailedDescription: 'Add the job description or paste the job posting to get industry-specific questions tailored to the role.',
      ctaText: 'Add Job Details',
      ctaAction: () => navigate('/mock-interview')
    },
    {
      icon: Mic,
      title: 'Run Interview',
      description: 'Launch Interview Copilot™ for real-time support',
      timeEstimate: '15-30 min',
      difficulty: 'Medium',
      successRate: '92%',
      detailedDescription: 'Practice with our AI interviewer that adapts to your responses and provides real-time feedback and suggestions.',
      ctaText: 'Start Interview',
      ctaAction: () => navigate('/mock-interview')
    },
    {
      icon: BarChart3,
      title: 'Interview Report',
      description: 'Review notes and post-interview performance',
      timeEstimate: '5 min',
      difficulty: 'Easy',
      successRate: '100%',
      detailedDescription: 'Get detailed analytics on your performance, including areas for improvement and personalized recommendations.',
      ctaText: 'View Sample Report',
      ctaAction: () => navigate('/dashboard')
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {/* Timeline line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 hidden lg:block" />
        
        {/* Success Stats Banner */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="glass-card p-6 rounded-xl border border-white/20 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-semibold text-foreground">Success Stories</span>
            </div>
            <p className="text-muted-foreground">
              <span className="font-bold text-primary">10,000+</span> candidates landed their dream jobs using our platform
            </p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative text-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Step icon container */}
              <div className="relative mx-auto w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-glow group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                <step.icon className="h-8 w-8 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
              </div>
              
              {/* Step content */}
              <div className="glass-card p-6 rounded-xl group-hover:bg-white/90 transition-all duration-300 h-full flex flex-col">
                <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">{step.description}</p>
                
                {/* Time estimate and difficulty */}
                <div className="flex justify-between items-center mb-4 text-xs">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{step.timeEstimate}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(step.difficulty)}`}>
                    {step.difficulty}
                  </span>
                </div>
                
                {/* Success rate */}
                <div className="flex items-center justify-center space-x-1 mb-4">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">{step.successRate} success rate</span>
                </div>
                
                {/* Expanded description on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-4">
                  <p className="text-xs text-muted-foreground">{step.detailedDescription}</p>
                </div>
                
                {/* Call to action button */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={step.ctaAction}
                    className="w-full text-xs"
                  >
                    {step.ctaText}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
              
              {/* Progress indicator line to next step */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-accent/50 to-primary/50 transform translate-x-0 group-hover:from-accent group-hover:to-primary transition-all duration-300" />
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Call to action section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-8 rounded-xl border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of successful candidates who've landed their dream jobs with our AI-powered interview preparation.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="shadow-glow hover:shadow-xl"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TimelineSteps;
