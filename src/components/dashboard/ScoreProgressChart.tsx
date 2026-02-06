import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ScoreProgressChartProps {
  data: Array<{
    date: string;
    score: number;
    interview: string;
  }>;
}

const ScoreProgressChart: React.FC<ScoreProgressChartProps> = ({ data }) => {
  const latestScore = data[data.length - 1]?.score || 0;
  const previousScore = data[data.length - 2]?.score || 0;
  const improvement = latestScore - previousScore;

  return (
    <Card className="w-full glass-card">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-xl font-bold font-headline">Score Progress</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Track your interview performance over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-4 w-4 sm:h-5 sm:w-5 ${improvement >= 0 ? 'text-green-500' : 'text-destructive'}`} />
            <span className={`text-xs sm:text-sm font-medium font-metric ${improvement >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              {improvement >= 0 ? '+' : ''}{improvement} pts
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 sm:h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `${value}%`}
                width={35}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Score']}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreProgressChart;
