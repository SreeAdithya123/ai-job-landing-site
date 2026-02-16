
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ChatBot from '../components/ChatBot';
import ProtectedRoute from '../components/ProtectedRoute';
import { Star, Target, TrendingUp, Award, Settings, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CareerCoach = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  

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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <ProtectedRoute>
      <Layout fullSize>
        {/* Full Screen Header */}
        <div className="bg-card/80 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="flex items-center space-x-2 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-all duration-200 group"
                >
                  <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-muted-foreground group-hover:text-foreground font-medium transition-colors">Back</span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">CareerBot</h1>
                    <p className="text-muted-foreground text-sm">Personalized career guidance and growth</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/settings')}
                  className="flex items-center space-x-2 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-all duration-200"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">Settings</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center space-x-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Features */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                How I Can Help You
              </h2>
              {features.map((feature, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 shadow-lg">
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
                title="CareerBot"
                placeholder="Ask me anything about your career..."
                initialMessage="Hey there! I'm CareerBot. I'm here to help you with your career, whether it's skill development, interview prep, resume tips, or career planning. What's on your mind?"
                context="career"
              />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CareerCoach;
