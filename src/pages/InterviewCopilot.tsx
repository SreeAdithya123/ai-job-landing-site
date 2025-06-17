
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Laptop, Code, Star, Phone, Settings, Plus } from 'lucide-react';

const InterviewCopilot = () => {
  const [selectedType, setSelectedType] = useState('general');

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
      id: 'hirevue',
      name: 'HireVue Interview',
      icon: Star,
      description: 'Video interview with AI-powered analysis'
    },
    {
      id: 'phone',
      name: 'Phone Interview',
      icon: Phone,
      description: 'Voice-only interview preparation'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Copilot</h1>
              <p className="text-gray-600">Real-time AI assistance during your interviews</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Interview Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {interviewTypes.map((type, index) => (
              <motion.div
                key={type.id}
                className={`p-6 bg-white rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedType === type.id 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedType(type.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  selectedType === type.id 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <type.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Sessions Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Your Sessions</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <Plus className="h-4 w-4" />
                <span>New Session</span>
              </button>
            </div>
            
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Laptop className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                You don't have any Interview Copilot™ sessions.
              </h3>
              <p className="text-gray-500 mb-6">
                Start your first session to get real-time AI assistance during interviews.
              </p>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                Start Your First Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewCopilot;
