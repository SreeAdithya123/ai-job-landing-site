
import React from 'react';
import Layout from '../components/Layout';
import ChatBot from '../components/ChatBot';
import { Star, Target, TrendingUp, Award } from 'lucide-react';

const CareerCoach = () => {
  const features = [
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Define and achieve your career objectives'
    },
    {
      icon: TrendingUp,
      title: 'Skill Development',
      description: 'Identify and develop in-demand skills'
    },
    {
      icon: Award,
      title: 'Career Growth',
      description: 'Strategic advice for career advancement'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Star className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                AI Career Coach
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Get personalized career guidance and accelerate your professional growth with our AI-powered career coach.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Features */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                How I Can Help You
              </h2>
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Chatbot */}
            <div className="lg:col-span-2">
              <ChatBot
                title="Your Personal Career Coach"
                placeholder="Ask me anything about your career..."
                initialMessage="Hello! I'm your personal AI Career Coach. I'm here to help you navigate your career journey, whether you need advice on skill development, interview preparation, resume optimization, or career planning. What would you like to discuss today?"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CareerCoach;
