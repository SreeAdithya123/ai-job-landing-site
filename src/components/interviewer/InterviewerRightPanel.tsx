import React from 'react';
import { FileText, Settings, Terminal, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InterviewSettings, TranscriptChunk, LatencyStats } from '@/pages/Interviewer';

interface InterviewerRightPanelProps {
  transcriptChunks: TranscriptChunk[];
  currentInterimText: string;
  settings: InterviewSettings;
  eventLogs: string[];
  latencyStats: LatencyStats;
  onSettingsChange: (settings: InterviewSettings) => void;
}

const InterviewerRightPanel: React.FC<InterviewerRightPanelProps> = ({
  transcriptChunks,
  currentInterimText,
  settings,
  eventLogs,
  latencyStats,
  onSettingsChange
}) => {
  const updateSetting = <K extends keyof InterviewSettings>(
    key: K, 
    value: InterviewSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card className="h-full glass-panel border-border/50">
      <Tabs defaultValue="transcript" className="h-full flex flex-col">
        <CardHeader className="pb-2 flex-shrink-0">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="transcript" className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              Logs
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 pt-4">
          {/* Transcript Tab */}
          <TabsContent value="transcript" className="h-full m-0">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-3">
                {/* Interim text */}
                {currentInterimText && (
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm text-muted-foreground italic opacity-70">
                      {currentInterimText}...
                    </p>
                  </div>
                )}

                {/* Finalized chunks */}
                {transcriptChunks.map((chunk) => (
                  <div 
                    key={chunk.id} 
                    className="p-3 rounded-lg bg-secondary/50 border border-border/50"
                  >
                    <p className="text-sm text-foreground">{chunk.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {chunk.timestamp.toLocaleTimeString()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(chunk.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                ))}

                {transcriptChunks.length === 0 && !currentInterimText && (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Transcript will appear here
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="h-full m-0">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {/* Interview Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Interview Settings</h4>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Role</Label>
                    <Input
                      value={settings.role}
                      onChange={(e) => updateSetting('role', e.target.value)}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Interview Type</Label>
                    <Select 
                      value={settings.type} 
                      onValueChange={(v) => updateSetting('type', v as InterviewSettings['type'])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Behavioral">Behavioral</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="System Design">System Design</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Difficulty</Label>
                    <Select 
                      value={settings.difficulty} 
                      onValueChange={(v) => updateSetting('difficulty', v as InterviewSettings['difficulty'])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.duration}
                      onChange={(e) => updateSetting('duration', parseInt(e.target.value) || 30)}
                      min={5}
                      max={60}
                    />
                  </div>
                </div>

                {/* Voice Settings */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground">Voice Settings</h4>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Sarvam Voice</Label>
                    <Select 
                      value={settings.voice} 
                      onValueChange={(v) => updateSetting('voice', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Anushka">Anushka (Female)</SelectItem>
                        <SelectItem value="Manisha">Manisha (Female)</SelectItem>
                        <SelectItem value="Vidya">Vidya (Female)</SelectItem>
                        <SelectItem value="Arjun">Arjun (Male)</SelectItem>
                        <SelectItem value="Amol">Amol (Male)</SelectItem>
                        <SelectItem value="Amartya">Amartya (Male)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Pace</Label>
                      <span className="text-xs text-muted-foreground">{settings.pace.toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={[settings.pace]}
                      onValueChange={([v]) => updateSetting('pace', v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Pitch</Label>
                      <span className="text-xs text-muted-foreground">{settings.pitch.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[settings.pitch]}
                      onValueChange={([v]) => updateSetting('pitch', v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="h-full m-0">
            <div className="h-full flex flex-col space-y-4">
              {/* Latency Stats */}
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-lg bg-secondary/50 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Clock className="h-3 w-3" />
                    STT
                  </div>
                  <span className="font-mono font-semibold text-foreground">{latencyStats.stt}ms</span>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-secondary/50 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Clock className="h-3 w-3" />
                    LLM
                  </div>
                  <span className="font-mono font-semibold text-foreground">{latencyStats.llm}ms</span>
                </div>
                <div className="flex-1 p-3 rounded-lg bg-secondary/50 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Clock className="h-3 w-3" />
                    TTS
                  </div>
                  <span className="font-mono font-semibold text-foreground">{latencyStats.tts}ms</span>
                </div>
              </div>

              {/* Event Logs */}
              <ScrollArea className="flex-1">
                <div className="space-y-1 font-mono text-xs">
                  {eventLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded ${
                        log.includes('Error') 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-secondary/30 text-muted-foreground'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                  {eventLogs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <Terminal className="h-8 w-8 text-muted-foreground/30 mb-2" />
                      <p className="text-muted-foreground">No events yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default InterviewerRightPanel;
