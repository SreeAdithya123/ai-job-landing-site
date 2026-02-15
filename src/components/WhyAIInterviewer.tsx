
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Brain, Clock, Target, TrendingUp } from 'lucide-react';

const WhyAIInterviewer = () => {
  const reasons = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced AI analyzes your responses, body language, and speech patterns to provide personalized feedback that human interviewers might miss."
    },
    {
      icon: Clock,
      title: "Practice Anytime, Anywhere",
      description: "No scheduling conflicts or geographic limitations. Practice interviews 24/7 from the comfort of your home at your own pace."
    },
    {
      icon: Target,
      title: "Targeted Skill Development",
      description: "Focus on specific areas that need improvement with customized practice sessions tailored to your industry and role."
    },
    {
      icon: TrendingUp,
      title: "Proven Results",
      description: "Our users report 3x higher interview success rates and 40% faster job placement compared to traditional preparation methods."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
            Why Choose AI Interviewer?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your interview skills with cutting-edge AI technology that adapts to your unique needs and learning style.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="clay-card h-full hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-glow">
                        <reason.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {reason.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="clay-card p-8 rounded-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join 50,000+ Job Seekers Who've Transformed Their Interview Skills
            </h3>
            <p className="text-muted-foreground text-lg">
              Our AI-powered platform has helped professionals across all industries land their dream jobs faster and with more confidence than ever before.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyAIInterviewer;
