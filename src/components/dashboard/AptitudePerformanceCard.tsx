import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAptitudeStats } from '@/hooks/useAptitudeStats';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Calculator, 
  BookOpen, 
  Trophy, 
  Target, 
  Clock, 
  ArrowRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AptitudePerformanceCard: React.FC = () => {
  const { stats, recentTests, isLoading } = useAptitudeStats();
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'quantitative': return <Calculator className="h-4 w-4" />;
      case 'logical': return <Brain className="h-4 w-4" />;
      case 'verbal': return <BookOpen className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'quantitative': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'logical': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'verbal': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }

  const hasTests = stats && stats.total_tests > 0;

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-headline">
            <Brain className="h-5 w-5 text-primary" />
            Aptitude Test Performance
          </CardTitle>
          <CardDescription className="text-sm">
            Track your aptitude test scores and progress
          </CardDescription>
        </div>
        <Button onClick={() => navigate('/aptitude-test')} size="sm" className="w-full sm:w-auto">
          Take Test
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        {!hasTests ? (
          <div className="text-center py-6 sm:py-8">
            <Brain className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-base font-semibold mb-2">No Tests Taken Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start your first aptitude test to see your performance here.
            </p>
            <Button onClick={() => navigate('/aptitude-test')}>
              Start Your First Test
            </Button>
          </div>
        ) : (
          <>
            {/* Stats Overview - Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 sm:p-4 text-center">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1.5 text-primary" />
                <p className="text-xl sm:text-2xl font-bold font-metric">{stats.average_score?.toFixed(0) || 0}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-900/5 rounded-lg p-3 sm:p-4 text-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1.5 text-green-600" />
                <p className="text-xl sm:text-2xl font-bold font-metric">{stats.best_score || 0}%</p>
                <p className="text-xs text-muted-foreground">Best Score</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/5 rounded-lg p-3 sm:p-4 text-center">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1.5 text-blue-600" />
                <p className="text-xl sm:text-2xl font-bold font-metric">{stats.total_tests}</p>
                <p className="text-xs text-muted-foreground">Tests Taken</p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/5 rounded-lg p-3 sm:p-4 text-center">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1.5 text-orange-600" />
                <p className="text-xl sm:text-2xl font-bold font-metric">
                  {stats.total_questions_attempted > 0 
                    ? Math.round((stats.correct_answers_total / stats.total_questions_attempted) * 100)
                    : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>

            {/* Category Performance */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold font-headline mb-3">Category Performance</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 w-24 sm:w-32 shrink-0">
                    <Calculator className="h-4 w-4 text-blue-500" />
                    <span className="text-xs sm:text-sm truncate">Quantitative</span>
                  </div>
                  <Progress 
                    value={stats.quantitative_avg || 0} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs sm:text-sm font-medium font-metric w-10 sm:w-12 text-right">
                    {stats.quantitative_avg?.toFixed(0) || '-'}%
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 w-24 sm:w-32 shrink-0">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="text-xs sm:text-sm truncate">Logical</span>
                  </div>
                  <Progress 
                    value={stats.logical_avg || 0} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs sm:text-sm font-medium font-metric w-10 sm:w-12 text-right">
                    {stats.logical_avg?.toFixed(0) || '-'}%
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 w-24 sm:w-32 shrink-0">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span className="text-xs sm:text-sm truncate">Verbal</span>
                  </div>
                  <Progress 
                    value={stats.verbal_avg || 0} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs sm:text-sm font-medium font-metric w-10 sm:w-12 text-right">
                    {stats.verbal_avg?.toFixed(0) || '-'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Tests */}
            {recentTests.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold font-headline mb-3">Recent Tests</h4>
                <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
                  {recentTests.slice(0, 5).map((test) => (
                    <div 
                      key={test.id}
                      className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${getCategoryColor(test.category)}`}>
                          {getCategoryIcon(test.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium capitalize text-xs sm:text-sm truncate">{test.category}</p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant="outline" className={`text-[10px] sm:text-xs ${getDifficultyColor(test.difficulty)}`}>
                              {test.difficulty}
                            </Badge>
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                              {new Date(test.completed_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className={`font-bold text-sm sm:text-base font-metric ${test.score >= 60 ? 'text-green-600' : 'text-destructive'}`}>
                          {test.score}%
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-0.5 justify-end">
                          <Clock className="h-3 w-3" />
                          {formatTime(test.time_taken_seconds)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AptitudePerformanceCard;
