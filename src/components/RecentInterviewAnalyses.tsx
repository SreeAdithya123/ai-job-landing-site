
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserInterviewAnalyses, InterviewAnalysis } from '@/services/interviewAnalysisService';
import InterviewAnalysisCard from './InterviewAnalysisCard';
import InterviewDetailsModal from './InterviewDetailsModal';
import AnalysisFeedbackButton from './AnalysisFeedbackButton';

const RecentInterviewAnalyses = () => {
  const navigate = useNavigate();
  const [selectedAnalysis, setSelectedAnalysis] = useState<InterviewAnalysis | null>(null);
  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ['interview-analyses'],
    queryFn: getUserInterviewAnalyses,
  });

  if (isLoading) {
    return (
      <motion.div
        className="glass-card p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="glass-card p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading interview analyses</div>
          <div className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <motion.div
        className="glass-card p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Recent Interview Analyses</h3>
          </div>
          <AnalysisFeedbackButton />
        </div>
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-2">No interview analyses yet</div>
          <div className="text-sm text-muted-foreground mb-4">
            Complete an interview to see your analysis here, or trigger analysis for existing transcripts
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Recent Interview Analyses</h3>
            <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>{analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <AnalysisFeedbackButton />
            {analyses.length > 2 && (
              <button
                onClick={() => navigate('/interview-history')}
                className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors text-sm font-medium"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analyses.slice(0, 4).map((analysis) => (
            <div key={analysis.id} onClick={() => setSelectedAnalysis(analysis)}>
              <InterviewAnalysisCard analysis={analysis} />
            </div>
          ))}
        </div>

        {analyses.length > 4 && (
          <div className="text-center">
            <button 
              onClick={() => navigate('/interview-history')}
              className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              View All Analyses ({analyses.length})
            </button>
          </div>
        )}
      </motion.div>

      {/* Details Modal */}
      {selectedAnalysis && (
        <InterviewDetailsModal
          analysis={selectedAnalysis}
          isOpen={!!selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
        />
      )}
    </>
  );
};

export default RecentInterviewAnalyses;
