
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
        <div className="bg-slate-800/30 backdrop-blur-md border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
                >
                  <ArrowLeft className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
                  <span className="text-slate-300 group-hover:text-white font-medium transition-colors">Back</span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">AI Career Coach</h1>
                    <p className="text-slate-400 text-sm">Personalized career guidance and growth</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-all duration-200">
                  <Settings className="h-4 w-4 text-slate-300" />
                  <span className="text-slate-300 font-medium">Settings</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
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
              <h2 className="text-2xl font-semibold text-white mb-6">
                How I Can Help You
              </h2>
              {features.map((feature, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Chatbot */}
            <div className="lg:col-span-2">
              <ChatBot
                title="Your Personal Career Coach"
                placeholder="Ask me anything about your career..."
                initialMessage="Hello! I'm your personal AI Career Coach. I'm here to help you navigate your career journey, whether you need advice on skill development, interview preparation, resume optimization, or career planning. What would you like to discuss today?"
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
