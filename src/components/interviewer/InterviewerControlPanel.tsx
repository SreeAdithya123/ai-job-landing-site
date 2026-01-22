import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Hand,
  Wifi,
  WifiOff,
  Loader2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ConnectionStatus } from '@/pages/Interviewer';

interface InterviewerControlPanelProps {
  isSessionActive: boolean;
  isMicEnabled: boolean;
  isSpeakerEnabled: boolean;
  isPushToTalk: boolean;
  isPushToTalkActive: boolean;
  sessionStartTime: Date | null;
  questionStartTime: Date | null;
  connectionStatus: ConnectionStatus;
  userPlan: string;
  onStartSession: () => void;
  onStopSession: () => void;
  onToggleMic: () => void;
  onToggleSpeaker: () => void;
  onTogglePushToTalk: () => void;
  onPushToTalkStart: () => void;
  onPushToTalkEnd: () => void;
}

const InterviewerControlPanel: React.FC<InterviewerControlPanelProps> = ({
  isSessionActive,
  isMicEnabled,
  isSpeakerEnabled,
  isPushToTalk,
  isPushToTalkActive,
  sessionStartTime,
  questionStartTime,
  connectionStatus,
  userPlan,
  onStartSession,
  onStopSession,
  onToggleMic,
  onToggleSpeaker,
  onTogglePushToTalk,
  onPushToTalkStart,
  onPushToTalkEnd
}) => {
  const [sessionTimer, setSessionTimer] = useState('00:00');
  const [questionTimer, setQuestionTimer] = useState('00:00');

  // Session timer
  useEffect(() => {
    if (!sessionStartTime || !isSessionActive) {
      setSessionTimer('00:00');
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      setSessionTimer(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime, isSessionActive]);

  // Question timer
  useEffect(() => {
    if (!questionStartTime || !isSessionActive) {
      setQuestionTimer('00:00');
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartTime.getTime()) / 1000);
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      setQuestionTimer(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [questionStartTime, isSessionActive]);

  const getPlanBadgeColor = () => {
    switch (userPlan) {
      case 'pro': return 'bg-gradient-primary text-white';
      case 'plus': return 'bg-accent text-accent-foreground';
      case 'beginner': return 'bg-primary/20 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="h-full glass-panel border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Mic className="h-4 w-4 text-white" />
          </div>
          Controls
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Session Controls */}
        <div className="space-y-3">
          {!isSessionActive ? (
            <Button 
              onClick={onStartSession}
              className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-6 text-lg shadow-glow"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Session
            </Button>
          ) : (
            <Button 
              onClick={onStopSession}
              variant="destructive"
              className="w-full py-6 text-lg"
            >
              <Square className="h-5 w-5 mr-2" />
              Stop Session
            </Button>
          )}
        </div>

        <Separator />

        {/* Audio Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              {isMicEnabled ? (
                <Mic className="h-5 w-5 text-accent" />
              ) : (
                <MicOff className="h-5 w-5 text-muted-foreground" />
              )}
              <Label className="text-sm font-medium">Microphone</Label>
            </div>
            <Switch 
              checked={isMicEnabled} 
              onCheckedChange={onToggleMic}
              disabled={!isSessionActive}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              {isSpeakerEnabled ? (
                <Volume2 className="h-5 w-5 text-accent" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
              <Label className="text-sm font-medium">Speaker (TTS)</Label>
            </div>
            <Switch 
              checked={isSpeakerEnabled} 
              onCheckedChange={onToggleSpeaker}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <Hand className="h-5 w-5 text-primary" />
              <Label className="text-sm font-medium">Push-to-Talk</Label>
            </div>
            <Switch 
              checked={isPushToTalk} 
              onCheckedChange={onTogglePushToTalk}
            />
          </div>

          {isPushToTalk && isSessionActive && (
            <Button 
              variant="outline"
              className={`w-full py-8 transition-all ${isPushToTalkActive ? 'bg-accent text-accent-foreground border-accent' : ''}`}
              onMouseDown={onPushToTalkStart}
              onMouseUp={onPushToTalkEnd}
              onMouseLeave={onPushToTalkEnd}
              onTouchStart={onPushToTalkStart}
              onTouchEnd={onPushToTalkEnd}
            >
              <Hand className="h-6 w-6 mr-2" />
              {isPushToTalkActive ? 'Listening...' : 'Hold to Talk'}
            </Button>
          )}
        </div>

        <Separator />

        {/* Timers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Session Timer</span>
            </div>
            <span className="font-mono text-lg font-semibold text-foreground">{sessionTimer}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Question Timer</span>
            </div>
            <span className="font-mono text-lg font-semibold text-foreground">{questionTimer}</span>
          </div>
        </div>

        <Separator />

        {/* Status Indicators */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Status</h4>
          
          <div className="flex items-center justify-between p-2 rounded-md">
            <span className="text-sm">Deepgram</span>
            <Badge variant={connectionStatus.deepgram === 'connected' ? 'default' : 'secondary'} className="flex items-center gap-1">
              {connectionStatus.deepgram === 'connected' ? (
                <Wifi className="h-3 w-3" />
              ) : connectionStatus.deepgram === 'connecting' ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {connectionStatus.deepgram}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-2 rounded-md">
            <span className="text-sm">Sarvam TTS</span>
            <Badge variant={connectionStatus.sarvam === 'ready' ? 'default' : connectionStatus.sarvam === 'error' ? 'destructive' : 'secondary'}>
              {connectionStatus.sarvam}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-2 rounded-md">
            <span className="text-sm">LLM Provider</span>
            <Badge variant="outline" className="border-primary text-primary">
              {connectionStatus.llm}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-2 rounded-md">
            <span className="text-sm">Plan</span>
            <Badge className={getPlanBadgeColor()}>
              {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewerControlPanel;
