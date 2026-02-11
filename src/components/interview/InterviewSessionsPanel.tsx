
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Brain } from 'lucide-react';

interface InterviewSession {
  id: string;
  type: string;
  date: string;
  duration: string;
  status: string;
}

interface InterviewSessionsPanelProps {
  completedInterviews: InterviewSession[];
  onStartFirstInterview: () => void;
}

const InterviewSessionsPanel: React.FC<InterviewSessionsPanelProps> = ({
  completedInterviews,
  onStartFirstInterview
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border"
    >
      <div className="px-8 py-6 border-b border-border flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Interview Sessions</h2>
          <p className="text-muted-foreground mt-1">Track your progress and review past interviews</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium">
          <Plus className="h-5 w-5" />
          <span>New Session</span>
        </button>
      </div>
      
      {completedInterviews.length > 0 ? (
        <div className="divide-y divide-border">
          {completedInterviews.map((interview) => (
            <div key={interview.id} className="px-8 py-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{interview.type}</h3>
                <p className="text-muted-foreground">
                  {interview.date} • {interview.duration}
                </p>
              </div>
              <span className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border border-green-200 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 dark:border-green-700/50">
                {interview.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            Ready to start your first interview?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Begin your interview preparation journey with our AI-powered system and get instant feedback on your performance.
          </p>
          <button 
            onClick={onStartFirstInterview}
            className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold transform hover:scale-105"
          >
            Start Your First Interview
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default InterviewSessionsPanel;
