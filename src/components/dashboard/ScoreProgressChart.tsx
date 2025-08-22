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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Score Progress</CardTitle>
            <CardDescription>Track your interview performance over time</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className={`h-5 w-5 ${improvement >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {improvement >= 0 ? '+' : ''}{improvement} pts
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Score']}
                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreProgressChart;