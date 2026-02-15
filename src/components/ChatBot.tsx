
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  title: string;
  placeholder?: string;
  initialMessage?: string;
  context?: 'career' | 'recruiter';
}

const ChatBot = ({ title, placeholder = "Type your message...", initialMessage, context }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialMessage) {
      setMessages([{
        id: '1',
        content: initialMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();

    try {
      const requestType = context === 'recruiter' ? 'recruiter-chat' : 'career-coach';

      // Get session for auth header
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/unified-ai-api`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
          },
          body: JSON.stringify({
            type: requestType,
            data: {
              message: currentInput,
              conversationHistory: messages
                .filter(m => m.id !== '1')
                .map(m => ({
                  role: m.sender === 'user' ? 'user' : 'assistant',
                  content: m.content
                }))
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Add empty bot message that we'll stream into
      setMessages(prev => [...prev, {
        id: botMessageId,
        content: '',
        sender: 'bot',
        timestamp: new Date()
      }]);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                accumulated += token;
                const current = accumulated;
                setMessages(prev => prev.map(m =>
                  m.id === botMessageId ? { ...m, content: current } : m
                ));
              }
            } catch {
              // skip unparseable lines
            }
          }
        }
      }

      // If no content was streamed, set a fallback
      if (!accumulated) {
        setMessages(prev => prev.map(m =>
          m.id === botMessageId ? { ...m, content: "I'm here to help! Please try asking your question again." } : m
        ));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => {
        const hasBot = prev.some(m => m.id === botMessageId);
        if (hasBot) {
          return prev.map(m =>
            m.id === botMessageId ? { ...m, content: "I'm sorry, I encountered an error. Please try again." } : m
          );
        }
        return [...prev, {
          id: botMessageId,
          content: "I'm sorry, I encountered an error. Please try again.",
          sender: 'bot' as const,
          timestamp: new Date()
        }];
      });

      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border h-[600px] flex flex-col">
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Enhanced AI</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && !messages.some(m => m.sender === 'bot' && m.content === '' && m.id !== '1') && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-primary to-accent hover:shadow-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
