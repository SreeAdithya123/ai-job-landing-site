
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LayoutDashboard, Brain } from 'lucide-react';

interface InterviewHeaderProps {
  onSignOut: () => void;
}

const InterviewHeader: React.FC<InterviewHeaderProps> = ({ onSignOut }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                AI Interview Studio
              </h1>
              <p className="text-slate-600 text-lg mt-1">Master your interview skills with advanced AI technology</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-slate-300/50 rounded-xl hover:bg-white/80 transition-all duration-200 shadow-sm">
              <Settings className="h-5 w-5 text-slate-600" />
              <span className="text-slate-700 font-medium">Settings</span>
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-slate-300/50 rounded-xl hover:bg-white/80 transition-all duration-200 shadow-sm"
            >
              <LayoutDashboard className="h-5 w-5 text-slate-600" />
              <span className="text-slate-700 font-medium">Dashboard</span>
            </button>
            <button 
              onClick={onSignOut} 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewHeader;
