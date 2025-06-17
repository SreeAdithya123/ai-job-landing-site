
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { 
  Mic, 
  Video, 
  MessageSquare, 
  BarChart3, 
  FileText, 
  Users, 
  Zap, 
  Shield,
  Clock
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Video,
      title: "AI Video Interviews",
      description: "Practice with realistic video interviews that simulate real-world scenarios with AI interviewers."
    },
    {
      icon: Mic,
      title: "Voice Analysis",
      description: "Get feedback on your tone, pace, clarity, and confidence level through advanced voice recognition."
    },
    {
      icon: MessageSquare,
      title: "Real-time Feedback",
      description: "Receive instant feedback on your answers, body language, and overall performance during practice."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics and identify areas for improvement over time."
    },
    {
      icon: FileText,
      title: "Custom Question Banks",
      description: "Access industry-specific questions tailored to your field and experience level."
    },
    {
      icon: Users,
      title: "Mock Panel Interviews",
      description: "Practice with multiple AI interviewers to simulate panel interview scenarios."
    },
    {
      icon: Zap,
      title: "Instant Scoring",
      description: "Get immediate scores and rankings based on your interview performance."
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your practice sessions are completely private and secure with end-to-end encryption."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Practice interviews on your schedule, no appointments or waiting required."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
            Powerful Features for Interview Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to master your interview skills and land your dream job, powered by advanced AI technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card h-full hover:shadow-xl transition-all duration-300 border border-white/20 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4 mx-auto shadow-glow">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
