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

  // Auto-scroll to bottom on new messages
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
    <Card className="h-full glass-panel border-border/50 flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Bot className="h-4 w-4 text-accent-foreground" />
          </div>
          Conversation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] ${message.role === 'ai' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'ai' 
                          ? 'bg-gradient-primary' 
                          : 'bg-accent'
                      }`}>
                        {message.role === 'ai' ? (
                          <Bot className="h-4 w-4 text-white" />
                        ) : (
                          <User className="h-4 w-4 text-accent-foreground" />
                        )}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.role === 'ai'
                          ? 'bg-secondary text-foreground'
                          : 'bg-gradient-primary text-white'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <div className={`flex items-center gap-2 mt-2 text-xs ${
                          message.role === 'ai' ? 'text-muted-foreground' : 'text-white/70'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.role === 'ai' && message.audioUrl && (
                            <button 
                              onClick={() => onReplayAudio(message.audioUrl!)}
                              className="hover:text-primary transition-colors"
                            >
                              <Volume2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Interim Text (Current speech being recognized) */}
            {currentInterimText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] bg-accent/20 text-muted-foreground rounded-2xl px-4 py-3 italic">
                  <p className="text-sm">{currentInterimText}...</p>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {messages.length === 0 && !isSessionActive && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Bot className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No conversation yet</h3>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Start a session to begin your AI interview
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAskNextQuestion}
            disabled={!isSessionActive}
            className="flex items-center gap-1.5"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            Ask Next Question
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRepeatQuestion}
            disabled={!isSessionActive || messages.length === 0}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Repeat
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onFlagQuestion}
            disabled={!isSessionActive}
            className="flex items-center gap-1.5"
          >
            <Flag className="h-3.5 w-3.5" />
            Flag
          </Button>
          <Button 
            variant="default"
            size="sm"
            onClick={onEndAndReport}
            disabled={messages.length === 0}
            className="flex items-center gap-1.5 ml-auto bg-gradient-primary hover:opacity-90"
          >
            <FileText className="h-3.5 w-3.5" />
            End & Generate Report
          </Button>
        </div>

        {/* Text Input */}
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewerConversationPanel;
