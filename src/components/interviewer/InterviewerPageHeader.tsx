import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, LayoutDashboard, LogOut, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConnectionStatus } from '@/pages/Interviewer';

interface InterviewerPageHeaderProps {
  isSessionActive: boolean;
  connectionStatus: ConnectionStatus;
  onSignOut: () => void;
}

const InterviewerPageHeader: React.FC<InterviewerPageHeaderProps> = ({
  isSessionActive,
  connectionStatus,
  onSignOut
}) => {
  const navigate = useNavigate();

  const getStatusIcon = () => {
    switch (connectionStatus.deepgram) {
      case 'connected': return <Wifi className="h-3.5 w-3.5" />;
      case 'connecting': return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
      default: return <WifiOff className="h-3.5 w-3.5" />;
    }
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                Voice Interviewer
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-Powered Interview Practice
              </p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="hidden md:flex items-center gap-2">
            {isSessionActive && (
              <Badge variant="default" className="bg-accent text-accent-foreground gap-1.5">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Live Session
              </Badge>
            )}
            
            <Badge 
              variant={connectionStatus.deepgram === 'connected' ? 'default' : 'secondary'}
              className="gap-1.5"
            >
              {getStatusIcon()}
              <span className="hidden lg:inline">STT:</span> {connectionStatus.deepgram}
            </Badge>
            
            <Badge 
              variant={connectionStatus.sarvam === 'ready' ? 'default' : connectionStatus.sarvam === 'error' ? 'destructive' : 'secondary'}
            >
              <span className="hidden lg:inline">TTS:</span> {connectionStatus.sarvam}
            </Badge>
            
            <Badge variant="outline" className="text-primary border-primary">
              <span className="hidden lg:inline">LLM:</span> {connectionStatus.llm}
            </Badge>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onSignOut}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default InterviewerPageHeader;
