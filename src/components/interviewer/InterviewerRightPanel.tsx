import React from 'react';
import { FileText, Settings, Terminal, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
    <Card className="h-full bg-card border-border shadow-sm">
      <Tabs defaultValue="transcript" className="h-full flex flex-col">
        <CardHeader className="pb-0 flex-shrink-0">
          <TabsList className="w-full grid grid-cols-3 h-9">
            <TabsTrigger value="transcript" className="text-xs gap-1.5">
              <FileText className="h-3 w-3" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs gap-1.5">
              <Settings className="h-3 w-3" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs gap-1.5">
              <Terminal className="h-3 w-3" />
              Logs
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 pt-4">
          {/* Transcript Tab */}
          <TabsContent value="transcript" className="h-full m-0">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-2">
                {/* Interim text */}
                {currentInterimText && (
                  <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <p className="text-sm text-muted-foreground italic">
                      {currentInterimText}
                    </p>
                  </div>
                )}

                {/* Finalized chunks */}
                {transcriptChunks.map((chunk) => (
                  <div 
                    key={chunk.id} 
                    className="p-3 rounded-lg bg-secondary/30 border border-border/50"
                  >
                    <p className="text-sm text-foreground leading-relaxed">{chunk.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {chunk.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <Badge variant="outline" className="text-xs h-5 gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {Math.round(chunk.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}

                {transcriptChunks.length === 0 && !currentInterimText && (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground/20 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Your speech will appear here
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="h-full m-0">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-6">
                {/* Interview Settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Interview
                  </h4>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Role</Label>
                    <Input
                      value={settings.role}
                      onChange={(e) => updateSetting('role', e.target.value)}
                      placeholder="e.g., Software Engineer"
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Type</Label>
                      <Select 
                        value={settings.type} 
                        onValueChange={(v) => updateSetting('type', v as InterviewSettings['type'])}
                      >
                        <SelectTrigger className="h-9 text-sm">
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

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Difficulty</Label>
                      <Select 
                        value={settings.difficulty} 
                        onValueChange={(v) => updateSetting('difficulty', v as InterviewSettings['difficulty'])}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Duration (min)</Label>
                    <Input
                      type="number"
                      value={settings.duration}
                      onChange={(e) => updateSetting('duration', parseInt(e.target.value) || 30)}
                      min={5}
                      max={60}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Voice Settings */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Voice
                  </h4>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">AI Voice</Label>
                    <Select 
                      value={settings.voice} 
                      onValueChange={(v) => updateSetting('voice', v)}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Anushka">Anushka</SelectItem>
                        <SelectItem value="Manisha">Manisha</SelectItem>
                        <SelectItem value="Vidya">Vidya</SelectItem>
                        <SelectItem value="Arjun">Arjun</SelectItem>
                        <SelectItem value="Amol">Amol</SelectItem>
                        <SelectItem value="Amartya">Amartya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Speed</Label>
                      <span className="text-xs text-foreground font-medium">{settings.pace.toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={[settings.pace]}
                      onValueChange={([v]) => updateSetting('pace', v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Pitch</Label>
                      <span className="text-xs text-foreground font-medium">{settings.pitch.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[settings.pitch]}
                      onValueChange={([v]) => updateSetting('pitch', v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="py-2"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="h-full m-0">
            <div className="h-full flex flex-col space-y-3">
              {/* Latency Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-secondary/30 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    STT
                  </div>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {latencyStats.stt}ms
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-secondary/30 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    LLM
                  </div>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {latencyStats.llm}ms
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-secondary/30 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    TTS
                  </div>
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {latencyStats.tts}ms
                  </span>
                </div>
              </div>

              {/* Event Logs */}
              <ScrollArea className="flex-1">
                <div className="space-y-1 font-mono text-xs">
                  {eventLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`px-2 py-1.5 rounded text-xs ${
                        log.includes('Error') 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-secondary/20 text-muted-foreground'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                  {eventLogs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-24 text-center">
                      <Terminal className="h-6 w-6 text-muted-foreground/20 mb-1" />
                      <p className="text-muted-foreground text-xs">No logs yet</p>
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
