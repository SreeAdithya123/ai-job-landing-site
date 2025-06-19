
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Scan, ExternalLink, CheckCircle, BarChart, TrendingUp } from 'lucide-react';

const ResumeScanner = () => {
  const handleOpenResumeScanner = () => {
    window.open('https://resume-analyst.netlify.app/', '_blank');
  };

  const features = [
    {
      icon: Scan,
      title: 'AI-Powered Analysis',
      description: 'Get instant feedback on your resume with advanced AI scanning technology'
    },
    {
      icon: BarChart,
      title: 'Detailed Scoring',
      description: 'Receive comprehensive scores across multiple resume criteria'
    },
    {
      icon: TrendingUp,
      title: 'Improvement Suggestions',
      description: 'Get actionable recommendations to boost your resume effectiveness'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Resume Scanner</h1>
            <p className="text-gray-600">Scan your resume and see your score with AI-powered analysis</p>
          </div>

          {/* Main CTA Section */}
          <motion.div
            className="bg-gradient-to-r from-primary via-primary-light to-accent p-8 rounded-xl text-white mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scan className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Scan Your Resume and See Your Score</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Upload your resume and get instant AI-powered analysis with detailed scoring and personalized recommendations to improve your chances of landing your dream job.
            </p>
            <button
              onClick={handleOpenResumeScanner}
              className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 duration-200"
            >
              <span>Start Scanning Your Resume</span>
              <ExternalLink className="h-5 w-5" />
            </button>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Tips Section */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-6">Resume Scanning Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-primary mb-2">📊 What Gets Analyzed</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Keywords and skill matching</li>
                  <li>• Resume format and structure</li>
                  <li>• Content quality and relevance</li>
                  <li>• ATS compatibility score</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-accent mb-2">🎯 Improvement Areas</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Industry-specific recommendations</li>
                  <li>• Missing skills identification</li>
                  <li>• Content optimization suggestions</li>
                  <li>• Format enhancement tips</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeScanner;
