import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StrengthsWeaknessesCloudProps {
  strengths: Array<{ text: string; count: number }>;
  weaknesses: Array<{ text: string; count: number }>;
}

const StrengthsWeaknessesCloud: React.FC<StrengthsWeaknessesCloudProps> = ({ 
  strengths, 
  weaknesses 
}) => {
  const getWordSize = (count: number, maxCount: number) => {
    const minSize = 12;
    const maxSize = 24;
    return minSize + ((count / maxCount) * (maxSize - minSize));
  };

  const maxStrengthCount = Math.max(...strengths.map(s => s.count), 1);
  const maxWeaknessCount = Math.max(...weaknesses.map(w => w.count), 1);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Strengths Word Cloud */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg font-bold text-green-700">Top Strengths</CardTitle>
          </div>
          <CardDescription>Most frequently mentioned positive traits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 justify-center min-h-[120px] items-center">
            {strengths.length > 0 ? (
              strengths.map((strength, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                  style={{ 
                    fontSize: `${getWordSize(strength.count, maxStrengthCount)}px`,
                    padding: '4px 12px'
                  }}
                >
                  {strength.text} ({strength.count})
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-center">Complete more interviews to see your strengths</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weaknesses Word Cloud */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-lg font-bold text-orange-700">Areas for Improvement</CardTitle>
          </div>
          <CardDescription>Most frequently mentioned areas to work on</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 justify-center min-h-[120px] items-center">
            {weaknesses.length > 0 ? (
              weaknesses.map((weakness, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                  style={{ 
                    fontSize: `${getWordSize(weakness.count, maxWeaknessCount)}px`,
                    padding: '4px 12px'
                  }}
                >
                  {weakness.text} ({weakness.count})
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-center">Complete more interviews to identify improvement areas</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrengthsWeaknessesCloud;