
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleViewAIInterviewer = () => {
    navigate('/interview-copilot');
  };

  return (
    <div className="bg-gradient-to-br from-background via-background to-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center">
          <motion.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-4 py-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Tools for the Minds Shaping Tomorrow</span>
          </motion.div>

          <motion.h1 
            className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The Sky Isn't the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Limit
            </span>
            <br />
            It's the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary animate-glow">
              Foundation
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            At Vyoman, we understand that the future is not just something that happens; it's something we actively create. 
            Our mission is to equip the architects of tomorrow with intelligent software that transforms potential into reality.
          </motion.p>

          <motion.p 
            className="text-lg text-muted-foreground/80 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We craft tools that are not merely functional, but truly transformative — designed to foster deep learning, 
            accelerate personal growth, and prepare you for the challenges and opportunities that lie ahead.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="shadow-glow hover:shadow-xl group"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleViewAIInterviewer}
              className="glass-card hover:bg-white/90"
            >
              View AI Interviewer Product
            </Button>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold">🎯</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Purpose-Built Intelligence</h3>
              <p className="text-sm text-muted-foreground">Every feature designed with specific human needs in mind</p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold">🔄</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Adaptive Learning</h3>
              <p className="text-sm text-muted-foreground">Systems that learn from your unique patterns and goals</p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold">⚖️</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Ethical AI First</h3>
              <p className="text-sm text-muted-foreground">Transparent, explainable AI that keeps you in control</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
