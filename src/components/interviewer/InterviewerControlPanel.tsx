import React, { useState, useEffect } from 'react';
import { 
  Square, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Hand,
  Clock
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

  const getPlanLabel = () => {
    switch (userPlan) {
      case 'pro': return { label: 'Pro', variant: 'default' as const };
      case 'plus': return { label: 'Plus', variant: 'default' as const };
      case 'beginner': return { label: 'Beginner', variant: 'secondary' as const };
      default: return { label: 'Free', variant: 'outline' as const };
    }
  };

  const planInfo = getPlanLabel();

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground">
            Session Controls
          </CardTitle>
          <Badge variant={planInfo.variant}>
            {planInfo.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Session Control - Only End Session (Start is handled via setup form) */}
        <div>
          {isSessionActive && (
            <Button 
              onClick={onStopSession}
              variant="destructive"
              className="w-full py-6 text-base font-medium"
            >
              <Square className="h-5 w-5 mr-2" />
              End Session
            </Button>
          )}
          {!isSessionActive && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Interview session is starting...
            </div>
          )}
        </div>

        <Separator />

        {/* Timers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              Session
            </div>
            <span className="font-mono text-xl font-semibold text-foreground">
              {sessionTimer}
            </span>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              Question
            </div>
            <span className="font-mono text-xl font-semibold text-foreground">
              {questionTimer}
            </span>
          </div>
        </div>

        <Separator />

        {/* Audio Controls */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Audio
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2.5">
                {isMicEnabled ? (
                  <Mic className="h-4 w-4 text-accent" />
                ) : (
                  <MicOff className="h-4 w-4 text-muted-foreground" />
                )}
                <Label className="text-sm font-normal">Microphone</Label>
              </div>
              <Switch 
                checked={isMicEnabled} 
                onCheckedChange={onToggleMic}
                disabled={!isSessionActive}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2.5">
                {isSpeakerEnabled ? (
                  <Volume2 className="h-4 w-4 text-accent" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
                <Label className="text-sm font-normal">Speaker</Label>
              </div>
              <Switch 
                checked={isSpeakerEnabled} 
                onCheckedChange={onToggleSpeaker}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2.5">
                <Hand className="h-4 w-4 text-primary" />
                <Label className="text-sm font-normal">Push-to-Talk</Label>
              </div>
              <Switch 
                checked={isPushToTalk} 
                onCheckedChange={onTogglePushToTalk}
              />
            </div>
          </div>

          {isPushToTalk && isSessionActive && (
            <Button 
              variant="outline"
              className={`w-full py-8 transition-all ${
                isPushToTalkActive 
                  ? 'bg-accent text-accent-foreground border-accent' 
                  : 'hover:bg-secondary'
              }`}
              onMouseDown={onPushToTalkStart}
              onMouseUp={onPushToTalkEnd}
              onMouseLeave={onPushToTalkEnd}
              onTouchStart={onPushToTalkStart}
              onTouchEnd={onPushToTalkEnd}
            >
              <Hand className="h-5 w-5 mr-2" />
              {isPushToTalkActive ? 'Listening...' : 'Hold to Talk'}
            </Button>
          )}
        </div>

        {/* Connection Status - Compact */}
        <div className="pt-2">
          <div className="flex flex-wrap gap-1.5">
            <Badge 
              variant={connectionStatus.deepgram === 'connected' ? 'default' : 'secondary'}
              className="text-xs"
            >
              STT: {connectionStatus.deepgram}
            </Badge>
            <Badge 
              variant={connectionStatus.sarvam === 'ready' ? 'default' : 'secondary'}
              className="text-xs"
            >
              TTS: {connectionStatus.sarvam}
            </Badge>
            <Badge variant="outline" className="text-xs">
              LLM: {connectionStatus.llm}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewerControlPanel;
