
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Users, Target, BookOpen, Filter, ExternalLink } from 'lucide-react';

const MockInterview = () => {
  const [completedInterviews, setCompletedInterviews] = useState<Array<{
    id: string;
    type: string;
    date: string;
    duration: string;
    status: string;
  }>>([]);

  const handleStartMockInterview = () => {
    // Open ElevenLabs link
    window.open('https://elevenlabs.io/app/talk-to?agent_id=agent_01jxyr90cgfbmsa93nmswvcfp7', '_blank');
    
    // Simulate saving the interview after it ends
    setTimeout(() => {
      const newInterview = {
        id: Date.now().toString(),
        type: 'Mock Interview',
        date: new Date().toLocaleDateString(),
        duration: '20-45 min',
        status: 'Completed'
      };
      setCompletedInterviews(prev => [newInterview, ...prev]);
    }, 5000); // Simulate 5 second interview for demo
  };

  const actionButtons = [
    {
      title: 'Start Job Readiness Assessment',
      description: 'Evaluate your current interview skills',
      icon: Target,
      color: 'bg-blue-500',
      action: null
    },
    {
      title: 'Start Mock Interview',
      description: 'Practice with AI interviewer',
      icon: Users,
      color: 'bg-orange-500',
      badge: 'Beta',
      action: handleStartMockInterview
    },
    {
      title: 'Start Practicing Questions',
      description: 'Drill common interview questions',
      icon: BookOpen,
      color: 'bg-green-500',
      action: null
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Mock Interview</h1>
            <p className="text-gray-600">Practice interviews with AI-powered feedback and assessment</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {actionButtons.map((button, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={button.action || undefined}
              >
                <div className={`w-12 h-12 ${button.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <button.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{button.title}</h3>
                  {button.badge && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {button.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{button.description}</p>
                
                {button.action && (
                  <div className="flex items-center space-x-1 text-orange-600 text-sm font-medium">
                    <span>Click to start</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Sessions Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Past Sessions</h2>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Scheduled</option>
                </select>
              </div>
            </div>
            
            {completedInterviews.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {completedInterviews.map((interview) => (
                  <div key={interview.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{interview.type}</h3>
                      <p className="text-sm text-gray-500">
                        {interview.date} • {interview.duration}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {interview.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No mock interview sessions yet.
                </h3>
                <p className="text-gray-500 mb-6">
                  Start your first mock interview to practice and improve your skills.
                </p>
                <button 
                  onClick={handleStartMockInterview}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Start Mock Interview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MockInterview;
