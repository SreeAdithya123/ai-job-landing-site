
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Laptop, Code, Star, Phone, Settings, Plus, ExternalLink, Users } from 'lucide-react';

const InterviewCopilot = () => {
  const [selectedType, setSelectedType] = useState('general');
  const [completedInterviews, setCompletedInterviews] = useState<Array<{
    id: string;
    type: string;
    date: string;
    duration: string;
    status: string;
  }>>([]);
  
  const navigate = useNavigate();

  const interviewTypes = [
    {
      id: 'general',
      name: 'General Interview',
      icon: Laptop,
      description: 'Standard behavioral and situational questions'
    },
    {
      id: 'coding',
      name: 'Coding Interview',
      icon: Code,
      description: 'Technical programming challenges and algorithms'
    },
    {
      id: 'upsc',
      name: 'UPSC Interviewer',
      icon: Star,
      description: 'Civil services interview preparation and mock tests'
    },
    {
      id: 'friendly',
      name: 'Friendly Interview',
      icon: Users,
      description: 'Casual conversation-style interview practice'
    }
  ];

  const handleStartInterview = (type: string) => {
    if (type === 'general' || type === 'coding') {
      // Open ElevenLabs link
      window.open('https://elevenlabs.io/app/talk-to?agent_id=agent_01jxyr90cgfbmsa93nmswvcfp7', '_blank');
      
      // Simulate saving the interview after it ends (in a real app, this would be triggered by the actual end event)
      setTimeout(() => {
        const newInterview = {
          id: Date.now().toString(),
          type: type === 'general' ? 'General Interview' : 'Coding Interview',
          date: new Date().toLocaleDateString(),
          duration: '15-30 min',
          status: 'Completed'
        };
        setCompletedInterviews(prev => [newInterview, ...prev]);
      }, 5000); // Simulate 5 second interview for demo
    } else if (type === 'upsc') {
      // Navigate to UPSC Interviewer page
      navigate('/upsc-interviewer');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">AI Interviewer</h1>
              <p className="text-muted-foreground">Real-time AI assistance during your interviews</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 glass-card border border-primary/20 rounded-lg hover:bg-white/90 transition-colors">
              <Settings className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">Settings</span>
            </button>
          </div>

          {/* Interview Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {interviewTypes.map((type, index) => (
              <motion.div
                key={type.id}
                className={`p-6 glass-card rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-glow ${
                  selectedType === type.id 
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/10 shadow-glow-accent' 
                    : 'border-gray-200 hover:border-primary/30'
                }`}
                onClick={() => setSelectedType(type.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  selectedType === type.id 
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <type.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{type.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartInterview(type.id);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-200 text-sm font-medium transform hover:scale-105"
                >
                  <span>Start Interview</span>
                  {(type.id === 'general' || type.id === 'coding') && <ExternalLink className="h-4 w-4" />}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Sessions Section */}
          <div className="glass-card rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">Your Sessions</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-200 font-medium">
                <Plus className="h-4 w-4" />
                <span>New Session</span>
              </button>
            </div>
            
            {completedInterviews.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {completedInterviews.map((interview) => (
                  <div key={interview.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors">
                    <div>
                      <h3 className="font-medium text-foreground">{interview.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {interview.date} • {interview.duration}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border border-green-200">
                      {interview.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Laptop className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  You don't have any AI Interviewer™ sessions.
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start your first session to get real-time AI assistance during interviews.
                </p>
                <button 
                  onClick={() => handleStartInterview('general')}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-200 font-medium transform hover:scale-105"
                >
                  Start Your First Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewCopilot;
