import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterviewTimerProps {
  timeRemaining: string;
  isWarning?: boolean;
}

const InterviewTimer: React.FC<InterviewTimerProps> = ({
  timeRemaining,
  isWarning = false,
}) => {
  // Parse time to determine if we're in warning zone (< 2 minutes)
  const parts = timeRemaining.split(':');
  const minutes = parseInt(parts[0], 10);
  const showWarning = isWarning || minutes < 2;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300',
        showWarning
          ? 'bg-red-900/50 text-red-300 border-red-700/50 animate-pulse'
          : 'bg-slate-800/50 text-slate-300 border-slate-700/50'
      )}
    >
      <Clock className={cn('h-4 w-4', showWarning && 'animate-bounce')} />
      <span className="font-mono">{timeRemaining}</span>
      {showWarning && <span className="text-xs ml-1">remaining</span>}
    </div>
  );
};

export default InterviewTimer;
