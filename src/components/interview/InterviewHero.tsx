
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap } from 'lucide-react';

const InterviewHero: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Advanced AI technology provides realistic interview scenarios',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      title: 'Real-time Feedback',
      description: 'Get instant feedback on your responses and performance',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: Zap,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed analytics and insights',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-5xl font-bold text-slate-800 mb-4">
          Choose Your Interview Experience
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Practice with our AI-powered interview system designed to help you succeed. 
          Get real-time feedback, personalized questions, and detailed performance analytics.
        </p>
      </motion.div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
            <p className="text-slate-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterviewHero;
