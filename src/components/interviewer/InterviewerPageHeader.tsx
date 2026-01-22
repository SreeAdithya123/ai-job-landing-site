import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Settings, LayoutDashboard, LogOut, Wifi, WifiOff, Loader2 } from 'lucide-react';
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

  const getDeepgramStatusColor = () => {
    switch (connectionStatus.deepgram) {
      case 'connected': return 'bg-accent text-accent-foreground';
      case 'connecting': return 'bg-yellow-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSarvamStatusColor = () => {
    switch (connectionStatus.sarvam) {
      case 'ready': return 'bg-accent text-accent-foreground';
      case 'loading': return 'bg-yellow-500 text-white';
      default: return 'bg-destructive text-destructive-foreground';
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Voice Interviewer
              </h1>
              <p className="text-muted-foreground text-sm">AI-Powered Interview Console</p>
            </div>
          </div>
          
          {/* Status Chips */}
          <div className="flex items-center space-x-3">
            <Badge className={`${getDeepgramStatusColor()} flex items-center gap-1.5`}>
              {connectionStatus.deepgram === 'connected' ? (
                <Wifi className="h-3 w-3" />
              ) : connectionStatus.deepgram === 'connecting' ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              Deepgram: {connectionStatus.deepgram}
            </Badge>
            
            <Badge className={getSarvamStatusColor()}>
              TTS: {connectionStatus.sarvam}
            </Badge>
            
            <Badge variant="outline" className="border-primary text-primary">
              LLM: {connectionStatus.llm}
            </Badge>
            
            {isSessionActive && (
              <Badge className="bg-accent text-accent-foreground animate-pulse">
                ● LIVE
              </Badge>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewerPageHeader;
