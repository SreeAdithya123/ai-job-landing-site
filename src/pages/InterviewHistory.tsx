import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, TrendingUp, Filter, Search, Eye, Video, CheckSquare, Square, GitCompare } from 'lucide-react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useInterviewAnalyses } from '@/hooks/useInterviewAnalysis';
import InterviewDetailsModal from '../components/InterviewDetailsModal';
import InterviewComparisonView from '../components/interview/InterviewComparisonView';
import { InterviewAnalysis } from '@/services/interviewAnalysisService';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const InterviewHistory = () => {
  const navigate = useNavigate();
  const { data: analyses, isLoading, error } = useInterviewAnalyses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState<InterviewAnalysis | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    return 'Needs Improvement';
  };

  const filteredAnalyses = analyses?.filter(analysis => {
    const matchesSearch = analysis.interview_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (analysis.feedback && analysis.feedback.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || analysis.interview_type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  }) || [];

  const interviewTypes = ['all', 'general', 'coding', 'upsc', 'friendly'];

  const toggleCompareSelection = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(prev => prev.filter(i => i !== id));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison(prev => [...prev, id]);
    } else {
      toast({
        title: "Maximum 3 Interviews",
        description: "You can compare up to 3 interviews at a time. Remove one to add another.",
        variant: "destructive",
      });
    }
  };

  const comparisonInterviews = analyses?.filter(a => selectedForComparison.includes(a.id)) || [];

  const handleCardClick = (analysis: InterviewAnalysis) => {
    if (isCompareMode) {
      toggleCompareSelection(analysis.id);
    } else {
      setSelectedAnalysis(analysis);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your interview history...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading interview history</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-border rounded-lg hover:bg-white/90 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">Back to Dashboard</span>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Interview History
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Detailed breakdown of your past interviews
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/interview-recordings')}
                  className="flex items-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>Recordings</span>
                </Button>
                <Button
                  variant={isCompareMode ? "default" : "outline"}
                  onClick={() => {
                    setIsCompareMode(!isCompareMode);
                    if (isCompareMode) {
                      setSelectedForComparison([]);
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <GitCompare className="h-4 w-4" />
                  <span>{isCompareMode ? 'Cancel Compare' : 'Compare'}</span>
                </Button>
              </div>
            </div>

            {/* Compare Mode Banner */}
            <AnimatePresence>
              {isCompareMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GitCompare className="h-5 w-5 text-primary" />
                      <span className="text-foreground font-medium">
                        Select up to 3 interviews to compare
                      </span>
                      <span className="text-muted-foreground">
                        ({selectedForComparison.length}/3 selected)
                      </span>
                    </div>
                    {selectedForComparison.length >= 1 && (
                      <Button
                        size="sm"
                        onClick={() => setIsCompareMode(false)}
                      >
                        View Comparison
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Comparison View */}
            <AnimatePresence>
              {!isCompareMode && comparisonInterviews.length > 0 && (
                <div className="mb-8">
                  <InterviewComparisonView
                    interviews={comparisonInterviews}
                    onClose={() => setSelectedForComparison([])}
                    onRemove={(id) => setSelectedForComparison(prev => prev.filter(i => i !== id))}
                  />
                </div>
              )}
            </AnimatePresence>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search interviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
                >
                  {interviewTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interview List */}
            {filteredAnalyses.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchTerm || filterType !== 'all' ? 'No interviews found' : 'No interviews yet'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Start your first interview to see your history here.'}
                </p>
                {!searchTerm && filterType === 'all' && (
                  <button 
                    onClick={() => navigate('/interview-copilot')}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Start Your First Interview
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredAnalyses.map((analysis, index) => {
                  const isSelected = selectedForComparison.includes(analysis.id);
                  return (
                    <motion.div
                      key={analysis.id}
                      className={`glass-card p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                        isCompareMode 
                          ? isSelected 
                            ? 'ring-2 ring-primary shadow-xl' 
                            : 'hover:shadow-lg'
                          : 'hover:shadow-xl'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() => handleCardClick(analysis)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Selection Checkbox */}
                          {isCompareMode && (
                            <div className="flex-shrink-0 pt-1">
                              {isSelected ? (
                                <CheckSquare className="h-6 w-6 text-primary" />
                              ) : (
                                <Square className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <h3 className="text-lg font-semibold text-foreground">
                                {analysis.interview_type}
                              </h3>
                              {analysis.overall_score && (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.overall_score)}`}>
                                  {analysis.overall_score}% - {getScoreLabel(analysis.overall_score)}
                                </span>
                              )}
                              {analysis.recording_url && (
                                <span className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                  <Video className="h-3 w-3" />
                                  <span>Recording</span>
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(analysis.created_at || '').toLocaleDateString()}</span>
                              </div>
                              {analysis.duration_minutes && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{analysis.duration_minutes} minutes</span>
                                </div>
                              )}
                            </div>

                            {/* Score Breakdown */}
                            {(analysis.communication_score || analysis.technical_score || analysis.confidence_score) && (
                              <div className="flex space-x-4 mb-4">
                                {analysis.communication_score && (
                                  <div className="text-center">
                                    <div className="text-sm font-medium text-foreground">{analysis.communication_score}%</div>
                                    <div className="text-xs text-muted-foreground">Communication</div>
                                  </div>
                                )}
                                {analysis.technical_score && (
                                  <div className="text-center">
                                    <div className="text-sm font-medium text-foreground">{analysis.technical_score}%</div>
                                    <div className="text-xs text-muted-foreground">Technical</div>
                                  </div>
                                )}
                                {analysis.confidence_score && (
                                  <div className="text-center">
                                    <div className="text-sm font-medium text-foreground">{analysis.confidence_score}%</div>
                                    <div className="text-xs text-muted-foreground">Confidence</div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Quick Preview */}
                            {analysis.feedback && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {analysis.feedback}
                              </p>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                              {analysis.strengths && analysis.strengths.slice(0, 2).map((strength, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  {strength}
                                </span>
                              ))}
                              {analysis.areas_for_improvement && analysis.areas_for_improvement.slice(0, 1).map((area, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-6">
                          {analysis.recording_url && (
                            <button 
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/interview-recordings?play=${analysis.id}`);
                              }}
                            >
                              <Video className="h-5 w-5 text-purple-500" />
                            </button>
                          )}
                          <button 
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAnalysis(analysis);
                            }}
                          >
                            <Eye className="h-5 w-5 text-muted-foreground" />
                          </button>
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {selectedAnalysis && (
          <InterviewDetailsModal
            analysis={selectedAnalysis}
            isOpen={!!selectedAnalysis}
            onClose={() => setSelectedAnalysis(null)}
          />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default InterviewHistory;
