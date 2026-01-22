import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ArrowRight, 
  RefreshCw, 
  Flag, 
  FileText, 
  Volume2,
  Bot,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/pages/Interviewer';

interface InterviewerConversationPanelProps {
  messages: Message[];
  currentInterimText: string;
  isSessionActive: boolean;
  onSendMessage: (text: string) => void;
  onAskNextQuestion: () => void;
  onRepeatQuestion: () => void;
  onFlagQuestion: () => void;
  onEndAndReport: () => void;
  onReplayAudio: (audioUrl: string) => void;
}

const InterviewerConversationPanel: React.FC<InterviewerConversationPanelProps> = ({
  messages,
  currentInterimText,
  isSessionActive,
  onSendMessage,
  onAskNextQuestion,
  onRepeatQuestion,
  onFlagQuestion,
  onEndAndReport,
  onReplayAudio
}) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentInterimText]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full bg-card border-border shadow-sm flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0 border-b border-border">
        <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          Conversation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0 p-4 space-y-4">
        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-2" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'ai' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-accent/10 text-accent'
                    }`}>
                      {message.role === 'ai' ? (
                        <Bot className="h-3.5 w-3.5" />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      message.role === 'ai'
                        ? 'bg-secondary text-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className={`flex items-center gap-2 mt-1.5 text-xs ${
                        message.role === 'ai' ? 'text-muted-foreground' : 'text-primary-foreground/70'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.role === 'ai' && message.audioUrl && (
                          <button 
                            onClick={() => onReplayAudio(message.audioUrl!)}
                            className="hover:text-primary transition-colors p-0.5"
                            title="Replay audio"
                          >
                            <Volume2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Interim Text */}
            {currentInterimText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] flex gap-2.5 flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <div className="bg-secondary/50 text-muted-foreground rounded-2xl px-4 py-2.5">
                    <p className="text-sm italic">{currentInterimText}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {messages.length === 0 && !isSessionActive && (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-1">
                  Ready to Practice
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Start a session to begin your AI-powered interview practice
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAskNextQuestion}
            disabled={!isSessionActive}
            className="text-xs h-8"
          >
            <ArrowRight className="h-3 w-3 mr-1" />
            Next
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRepeatQuestion}
            disabled={!isSessionActive || messages.length === 0}
            className="text-xs h-8"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Repeat
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onFlagQuestion}
            disabled={!isSessionActive}
            className="text-xs h-8"
          >
            <Flag className="h-3 w-3 mr-1" />
            Flag
          </Button>
          <Button 
            size="sm"
            onClick={onEndAndReport}
            disabled={messages.length === 0}
            className="text-xs h-8 ml-auto bg-primary hover:bg-primary/90"
          >
            <FileText className="h-3 w-3 mr-1" />
            Generate Report
          </Button>
        </div>

        {/* Text Input */}
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response..."
            className="flex-1 h-10"
          />
          <Button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            size="sm"
            className="h-10 px-4 bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewerConversationPanel;
