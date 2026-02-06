import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface FeedbackSummaryChartsProps {
  skillsData: Array<{
    skill: string;
    average: number;
    latest: number;
  }>;
  categoryData: Array<{
    category: string;
    value: number;
    color: string;
  }>;
}

const FeedbackSummaryCharts: React.FC<FeedbackSummaryChartsProps> = ({ 
  skillsData, 
  categoryData 
}) => {
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Skills Performance Bar Chart */}
      <Card className="glass-card">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="text-base sm:text-lg font-bold font-headline">Skills Performance</CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">Compare your latest scores with averages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 sm:h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="skill" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `${value}%`}
                  width={35}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value}%`, name === 'average' ? 'Average' : 'Latest']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="average" fill="hsl(var(--muted))" name="average" radius={[4, 4, 0, 0]} />
                <Bar dataKey="latest" fill="hsl(var(--primary))" name="latest" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Interview Categories Pie Chart */}
      <Card className="glass-card">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            <CardTitle className="text-base sm:text-lg font-bold font-headline">Interview Categories</CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">Distribution of your interview types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 sm:h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius="70%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value, 'Interviews']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackSummaryCharts;
