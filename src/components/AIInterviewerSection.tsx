
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Target, Zap } from 'lucide-react';

const AIInterviewerSection = () => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate('/interview-copilot');
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your responses, body language, and vocal patterns"
    },
    {
      icon: Target,
      title: "Hyper-Realistic Simulations",
      description: "Practice with tailored scenarios for your target role and industry"
    },
    {
      icon: Zap,
      title: "Instant Actionable Feedback",
      description: "Precise insights that human interviewers might miss"
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
              <Brain className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Now Available</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Elevate Your Interview Game.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Powered by Vyoman AI.
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We are thrilled to announce the launch of <strong>AI Interviewer</strong>, our latest innovation 
              designed to revolutionize how you prepare for your next career opportunity.
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Built on Vyoman's foundational principles of intelligent, ethical, and human-centric AI, 
              AI Interviewer is your personal, AI-powered interview coach, providing unparalleled insights 
              and practice to help you ace every interview and land your dream job faster.
            </p>

            <Button 
              size="lg"
              onClick={handleViewProduct}
              className="shadow-glow hover:shadow-xl group mb-8"
            >
              View AI Interviewer Product
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-sm text-muted-foreground italic">
              This is more than just a tool; it's a strategic advantage, meticulously crafted to accelerate your career trajectory.
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
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
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
              <p className="text-foreground font-medium mb-2">Gone are the days of generic advice and uncertain preparation.</p>
              <p className="text-sm text-muted-foreground">
                Experience the future of interview preparation, backed by the trusted intelligence of Vyoman.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIInterviewerSection;
