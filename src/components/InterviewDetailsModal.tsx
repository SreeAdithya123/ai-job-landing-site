
import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, MessageCircle, TrendingUp, Target } from 'lucide-react';
import { InterviewAnalysis } from '@/services/interviewAnalysisService';
import { useInterviewQuestions } from '@/hooks/useInterviewQuestions';

interface InterviewDetailsModalProps {
  analysis: InterviewAnalysis;
  isOpen: boolean;
  onClose: () => void;
}

const InterviewDetailsModal: React.FC<InterviewDetailsModalProps> = ({
  analysis,
  isOpen,
  onClose,
}) => {
  const { data: questions, isLoading: questionsLoading } = useInterviewQuestions(analysis.id || '');

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-clay"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{analysis.interview_type}</h2>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
              <span>{new Date(analysis.created_at || '').toLocaleDateString()}</span>
              {analysis.duration_minutes && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{analysis.duration_minutes} min</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Overall Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {analysis.overall_score && (
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                <div className={`text-3xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                  {analysis.overall_score}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">Overall Score</div>
                <div className="text-xs text-muted-foreground">
                  {getScoreLabel(analysis.overall_score)}
                </div>
              </div>
            )}
            {analysis.communication_score && (
              <div className="text-center p-4 bg-primary/5 rounded-xl">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.communication_score)}`}>
                  {analysis.communication_score}%
                </div>
                <div className="text-sm text-muted-foreground">Communication</div>
              </div>
            )}
            {analysis.technical_score && (
              <div className="text-center p-4 bg-accent/5 rounded-xl">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.technical_score)}`}>
                  {analysis.technical_score}%
                </div>
                <div className="text-sm text-muted-foreground">Technical</div>
              </div>
            )}
            {analysis.confidence_score && (
              <div className="text-center p-4 bg-secondary/5 rounded-xl">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.confidence_score)}`}>
                  {analysis.confidence_score}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
            )}
          </div>

          {/* Strengths and Areas for Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-foreground">Strengths</h3>
                </div>
                <div className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.areas_for_improvement && analysis.areas_for_improvement.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Areas for Improvement</h3>
                </div>
                <div className="space-y-2">
                  {analysis.areas_for_improvement.map((area, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{area}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Overall Feedback */}
          {analysis.feedback && (
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-3">
                <MessageCircle className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold text-foreground">Overall Feedback</h3>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.feedback}</p>
              </div>
            </div>
          )}

          {/* Detailed Questions */}
          {questions && questions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Question-by-Question Breakdown</h3>
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id || index} className="border border-border rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-md font-medium text-foreground">
                        Question {question.question_order || index + 1}
                      </h4>
                      {question.question_score && (
                        <span className={`text-lg font-bold ${getScoreColor(question.question_score)}`}>
                          {question.question_score}%
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Question:</p>
                        <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
                          {question.question_text}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Your Answer:</p>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                          {question.user_answer}
                        </p>
                      </div>
                      
                      {question.ai_feedback && (
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">AI Feedback:</p>
                          <p className="text-sm text-muted-foreground bg-green-50 p-3 rounded-lg">
                            {question.ai_feedback}
                          </p>
                        </div>
                      )}
                      
                      {(question.fluency_score || question.confidence_score) && (
                        <div className="flex space-x-4 text-sm">
                          {question.fluency_score && (
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">Fluency:</span>
                              <span className={`font-medium ${getScoreColor(question.fluency_score)}`}>
                                {question.fluency_score}%
                              </span>
                            </div>
                          )}
                          {question.confidence_score && (
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">Confidence:</span>
                              <span className={`font-medium ${getScoreColor(question.confidence_score)}`}>
                                {question.confidence_score}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {questionsLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading question details...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewDetailsModal;
