import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic, MessageSquare, BarChart3 } from 'lucide-react';

const AIInterviewerSection = () => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate('/interview-copilot');
  };

  const features = [
    {
      icon: Mic,
      title: "Realistic Voice Interviews",
      description: "Practice speaking in real interview scenarios with natural conversation flow."
    },
    {
      icon: MessageSquare,
      title: "Immediate Performance Feedback",
      description: "Receive clear insights on your responses, clarity, and delivery."
    },
    {
      icon: BarChart3,
      title: "Communication Analysis",
      description: "Understand how your tone, pace, and confidence come across."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full px-4 py-2 mb-6">
              <Mic className="h-4 w-4 text-accent" />
              <span className="font-body text-sm font-medium text-muted-foreground">Now Available</span>
            </div>

            <h2 className="font-headline text-h1 lg:text-display text-foreground mb-6 tracking-title">
              Elevate Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Interview Preparation
              </span>
            </h2>
            
            <p className="font-body text-body-lg text-muted-foreground mb-6 leading-body">
              Vyoman AI Interviewer simulates real interview environments through voice interaction and intelligent questioning.
            </p>

            <p className="font-body text-body text-muted-foreground mb-8 leading-body">
              You speak naturally. The AI listens, evaluates, and responds with feedback that helps you refine both your answers and delivery.
            </p>

            <Button 
              size="lg"
              onClick={handleViewProduct}
              className="shadow-glow hover:shadow-xl group mb-8 font-body tracking-button"
            >
              Try AI Interviewer
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="font-body text-sm text-muted-foreground">
              Practice makes progress. Start your first session today.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 gap-6"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-headline font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-body">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="font-body text-foreground font-medium mb-2">The days of uncertain preparation are over.</p>
              <p className="font-body text-sm text-muted-foreground">
                Vyoman helps you see exactly where you stand.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIInterviewerSection;
