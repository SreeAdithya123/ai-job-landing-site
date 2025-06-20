
import React from 'react';
import Layout from '../components/Layout';
import ChatBot from '../components/ChatBot';
import { Users, Building, Briefcase, Star } from 'lucide-react';

const Recruiters = () => {
  // API key for Recruiters
  const API_KEY = 'WaDmYbqdMO9gegCw2qxd17m1XrfmAY2sPXp9hkxA';

  const companies = [
    { name: 'Google', logo: '🔍', industry: 'Technology' },
    { name: 'Microsoft', logo: '🪟', industry: 'Technology' },
    { name: 'Apple', logo: '🍎', industry: 'Technology' },
    { name: 'Amazon', logo: '📦', industry: 'E-commerce/Cloud' },
    { name: 'Meta', logo: '📘', industry: 'Social Media' },
    { name: 'Netflix', logo: '🎬', industry: 'Entertainment' },
    { name: 'Tesla', logo: '⚡', industry: 'Automotive/Energy' },
    { name: 'Spotify', logo: '🎵', industry: 'Music/Tech' }
  ];

  const benefits = [
    {
      icon: Building,
      title: 'Top Companies',
      description: 'Connect with recruiters from Fortune 500 companies'
    },
    {
      icon: Briefcase,
      title: 'Diverse Roles',
      description: 'Opportunities across all industries and experience levels'
    },
    {
      icon: Star,
      title: 'Direct Access',
      description: 'Skip the application queue with direct recruiter contact'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                Speak with Recruiters
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect directly with recruiters from your dream companies and unlock exclusive job opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left sidebar with benefits and companies */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Why Use Our Platform
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-lg border border-gray-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                          <benefit.icon className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Featured Companies
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {companies.map((company, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center">
                      <div className="text-2xl mb-1">{company.logo}</div>
                      <div className="text-sm font-medium text-foreground">{company.name}</div>
                      <div className="text-xs text-muted-foreground">{company.industry}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side with chatbot */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-center text-foreground">
                  Talk With Your Dream Company Recruiters
                </h2>
              </div>
              <ChatBot
                title="Recruiter Connection Assistant"
                placeholder="Tell me about your dream job..."
                initialMessage="Welcome! I'm here to help you connect with recruiters from top companies. Whether you're looking for your next role at a tech giant, startup, or Fortune 500 company, I can help facilitate those connections. What type of role and company are you interested in?"
                apiKey={API_KEY}
                context="recruiter"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Recruiters;
