import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InterviewAnalysis } from '@/services/interviewAnalysisService';

interface InterviewComparisonViewProps {
  interviews: InterviewAnalysis[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

const InterviewComparisonView: React.FC<InterviewComparisonViewProps> = ({
  interviews,
  onClose,
  onRemove,
}) => {
  const scoreCategories = [
    { key: 'overall_score', label: 'Overall Score', color: 'primary' },
    { key: 'communication_score', label: 'Communication', color: 'blue' },
    { key: 'technical_score', label: 'Technical', color: 'purple' },
    { key: 'confidence_score', label: 'Confidence', color: 'amber' },
    { key: 'problem_solving_score', label: 'Problem Solving', color: 'green' },
  ];

  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (current: number | null | undefined, index: number) => {
    if (index === 0 || !current) return null;
    const previous = interviews[index - 1];
    const prevScore = previous?.overall_score;
    if (!prevScore) return null;

    if (current > prevScore) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (current < prevScore) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getBestScore = (key: string) => {
    const scores = interviews.map(i => (i as any)[key]).filter(Boolean) as number[];
    return Math.max(...scores);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Interview Comparison</h2>
          <p className="text-muted-foreground text-sm">
            Comparing {interviews.length} interview{interviews.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Clear Comparison
        </Button>
      </div>

      {/* Interview Cards */}
      <div className={`grid gap-4 mb-6 ${
        interviews.length === 1 ? 'grid-cols-1' : 
        interviews.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
      }`}>
        {interviews.map((interview, index) => (
          <div
            key={interview.id}
            className="relative border border-border rounded-lg p-4 bg-card"
          >
            <button
              onClick={() => onRemove(interview.id)}
              className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{interview.interview_type}</h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(interview.created_at || '').toLocaleDateString()}</span>
                  {interview.duration_minutes && (
                    <>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{interview.duration_minutes}m</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${getScoreColor(interview.overall_score)}`}>
                {interview.overall_score || '-'}%
              </span>
              {getTrendIcon(interview.overall_score, index)}
            </div>
          </div>
        ))}
      </div>

      {/* Score Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
              {interviews.map((interview, index) => (
                <th key={interview.id} className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Interview {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scoreCategories.map((category) => {
              const best = getBestScore(category.key);
              return (
                <tr key={category.key} className="border-b border-border/50">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{category.label}</td>
                  {interviews.map((interview) => {
                    const score = (interview as any)[category.key] as number | null;
                    const isBest = score === best && score !== null;
                    return (
                      <td key={interview.id} className="text-center py-3 px-4">
                        <span className={`text-lg font-semibold ${
                          isBest ? 'text-green-600' : getScoreColor(score)
                        }`}>
                          {score ?? '-'}
                          {score && <span className="text-xs">%</span>}
                        </span>
                        {isBest && interviews.length > 1 && (
                          <span className="ml-1 text-xs text-green-600">★</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Strengths & Improvements Comparison */}
      <div className={`grid gap-6 mt-6 ${
        interviews.length === 1 ? 'grid-cols-1' : 
        interviews.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
      }`}>
        {interviews.map((interview, index) => (
          <div key={interview.id} className="space-y-4">
            <h4 className="font-medium text-foreground text-sm">Interview {index + 1} Highlights</h4>
            
            {interview.strengths && interview.strengths.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Strengths</p>
                <div className="flex flex-wrap gap-1">
                  {interview.strengths.slice(0, 3).map((strength, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {interview.areas_for_improvement && interview.areas_for_improvement.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Areas to Improve</p>
                <div className="flex flex-wrap gap-1">
                  {interview.areas_for_improvement.slice(0, 3).map((area, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default InterviewComparisonView;
