
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

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
  apiKey?: string;
  context?: 'career' | 'recruiter';
}

const ChatBot = ({ title, placeholder = "Type your message...", initialMessage, apiKey, context }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialMessage) {
      setMessages([
        {
          id: '1',
          content: initialMessage,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callOpenAI = async (userInput: string, context?: string): Promise<string> => {
    if (!apiKey) {
      throw new Error('API key not available');
    }

    const systemPrompts = {
      career: 'You are an expert career coach with years of experience helping professionals advance their careers. Provide personalized, actionable advice on career development, resume optimization, interview preparation, skill development, and job search strategies.',
      recruiter: 'You are a professional recruiter with extensive connections across top companies. Help users connect with recruiters, understand hiring processes, and navigate job opportunities at their target companies.'
    };

    const systemPrompt = systemPrompts[context as keyof typeof systemPrompts] || 
      'You are a helpful AI assistant focused on career and professional development.';

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  };

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

    try {
      let botResponse: string;
      
      if (apiKey) {
        console.log('Processing message with API key:', apiKey);
        console.log('Context:', context);
        console.log('User input:', currentInput);
        
        botResponse = await callOpenAI(currentInput, context);
      } else {
        // Fallback to basic responses
        botResponse = getBotResponse(currentInput, title);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error processing your message. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEnhancedBotResponse = (userInput: string, botTitle: string, context?: string): string => {
    const input = userInput.toLowerCase();
    
    if (context === 'career') {
      return "Thank you for your question! With our enhanced AI capabilities, I can provide you with personalized career guidance based on current market trends and your specific situation. Let me analyze your query and provide detailed insights...";
    } else if (context === 'recruiter') {
      return "Great! I'm connecting you with our enhanced recruiter network. Based on your profile and preferences, I can match you with the most suitable opportunities from our partner companies. Let me process your request...";
    }
    
    return getBotResponse(userInput, botTitle);
  };

  const getBotResponse = (userInput: string, botTitle: string): string => {
    const input = userInput.toLowerCase();
    
    if (botTitle.includes('Career Coach')) {
      if (input.includes('resume') || input.includes('cv')) {
        return "I'd be happy to help you with your resume! Focus on highlighting your achievements with specific metrics, use action verbs, and tailor it to each job application. Would you like specific tips for any particular section?";
      }
      if (input.includes('interview') || input.includes('job')) {
        return "Great question about interviews! Preparation is key - research the company, practice common questions, and prepare specific examples using the STAR method. What type of interview are you preparing for?";
      }
      if (input.includes('career') || input.includes('path')) {
        return "Career planning is crucial for long-term success. Consider your values, interests, and skills when exploring career paths. What industry or role are you most interested in?";
      }
      return "I'm here to help guide your career journey! I can assist with resume optimization, interview preparation, career planning, and skill development. What specific area would you like to focus on today?";
    } else {
      if (input.includes('recruiter') || input.includes('hiring')) {
        return "I can help you connect with recruiters from top companies! They're looking for talented candidates like you. What type of role or industry are you targeting?";
      }
      if (input.includes('company') || input.includes('job')) {
        return "Excellent! I have connections with recruiters from various industries including tech, finance, healthcare, and more. What's your dream company or preferred company size?";
      }
      if (input.includes('salary') || input.includes('compensation')) {
        return "Salary negotiations are important! I can connect you with recruiters who are transparent about compensation ranges. What's your experience level and target salary range?";
      }
      return "I'm here to connect you with recruiters from your dream companies! Whether you're looking for startups, Fortune 500 companies, or specific industries, I can help make those connections. What type of opportunity interests you most?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white p-4 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <h3 className="text-lg font-semibold">{title}</h3>
          {apiKey && (
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Enhanced AI</span>
          )}
        </div>
      </div>

      {/* Messages */}
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
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
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
