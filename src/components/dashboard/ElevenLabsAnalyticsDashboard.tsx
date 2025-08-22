import React from 'react';
import { useElevenLabsAnalytics } from '@/hooks/useElevenLabsAnalytics';
import ScoreProgressChart from './ScoreProgressChart';
import StrengthsWeaknessesCloud from './StrengthsWeaknessesCloud';
import FeedbackSummaryCharts from './FeedbackSummaryCharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Loader2 } from 'lucide-react';

const ElevenLabsAnalyticsDashboard: React.FC = () => {
  const { data: analytics, isLoading, error } = useElevenLabsAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Analytics Dashboard</CardTitle>
          </div>
          <CardDescription>Loading your interview analytics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-destructive" />
            <CardTitle>Analytics Dashboard</CardTitle>
          </div>
          <CardDescription>Error loading analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load analytics data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics || analytics.scoreProgression.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Analytics Dashboard</CardTitle>
          </div>
          <CardDescription>Complete interviews to see your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your analytics will appear here after completing your first interview with ElevenLabs AI.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Interview Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Track your progress with visual insights from your AI interview sessions
        </p>
      </div>

      {/* Score Progress Chart */}
      <ScoreProgressChart data={analytics.scoreProgression} />

      {/* Strengths and Weaknesses Word Clouds */}
      <StrengthsWeaknessesCloud 
        strengths={analytics.strengthsWeaknesses.strengths}
        weaknesses={analytics.strengthsWeaknesses.weaknesses}
      />

      {/* Skills Performance and Category Charts */}
      <FeedbackSummaryCharts 
        skillsData={analytics.skillsPerformance}
        categoryData={analytics.interviewCategories}
      />
    </div>
  );
};

export default ElevenLabsAnalyticsDashboard;