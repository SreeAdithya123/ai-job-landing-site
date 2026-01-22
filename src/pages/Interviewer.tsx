import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import InterviewerControlPanel from '@/components/interviewer/InterviewerControlPanel';
import InterviewerConversationPanel from '@/components/interviewer/InterviewerConversationPanel';
import InterviewerRightPanel from '@/components/interviewer/InterviewerRightPanel';
import InterviewerHeader from '@/components/interviewer/InterviewerPageHeader';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface TranscriptChunk {
  id: string;
  text: string;
  isFinal: boolean;
  confidence: number;
  timestamp: Date;
}

export interface InterviewSettings {
  role: string;
  type: 'HR' | 'Behavioral' | 'Technical' | 'System Design' | 'Mixed';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  language: string;
  voice: string;
  targetLanguageCode: string;
  pace: number;
  pitch: number;
}

export interface LatencyStats {
  stt: number;
  llm: number;
  tts: number;
}

export interface ConnectionStatus {
  deepgram: 'connected' | 'disconnected' | 'connecting';
  sarvam: 'ready' | 'error' | 'loading';
  llm: 'groq' | 'openrouter' | 'disconnected';
}

const Interviewer = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { subscription, isPro, isPlus } = useSubscription();
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  
  // Audio controls
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [isPushToTalk, setIsPushToTalk] = useState(false);
  const [isPushToTalkActive, setIsPushToTalkActive] = useState(false);
  
  // Conversation state
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcriptChunks, setTranscriptChunks] = useState<TranscriptChunk[]>([]);
  const [currentInterimText, setCurrentInterimText] = useState('');
  const [eventLogs, setEventLogs] = useState<string[]>([]);
  
  // Connection status
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    deepgram: 'disconnected',
    sarvam: 'ready',
    llm: isPro || isPlus ? 'groq' : 'openrouter'
  });
  
  // Settings
  const [settings, setSettings] = useState<InterviewSettings>({
    role: 'Software Engineer',
    type: 'Technical',
    difficulty: 'Medium',
    duration: 30,
    language: 'English',
    voice: 'Anushka',
    targetLanguageCode: 'en-IN',
    pace: 1.0,
    pitch: 1.0
  });
  
  // Latency tracking
  const [latencyStats, setLatencyStats] = useState<LatencyStats>({
    stt: 0,
    llm: 0,
    tts: 0
  });
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processingRef = useRef(false);
  const audioQueueRef = useRef<HTMLAudioElement[]>([]);
  const isPlayingRef = useRef(false);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 99)]);
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Start interview session
  const startSession = useCallback(async () => {
    try {
      addLog('Starting interview session...');
      
      // Request mic permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      setIsSessionActive(true);
      setSessionStartTime(new Date());
      setConnectionStatus(prev => ({ ...prev, deepgram: 'connecting' }));
      
      addLog('Microphone access granted');
      
      // Initialize audio context
      audioContextRef.current = new AudioContext();
      
      // Set up MediaRecorder for capturing audio
      // Try to use a format Deepgram handles well
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      let chunkCount = 0;
      
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && !processingRef.current && isMicEnabled) {
          audioChunks.push(event.data);
          chunkCount++;
          
          // Buffer more audio - wait for 3 seconds worth (6 chunks at 500ms each)
          // This gives Deepgram enough audio to process properly
          if (chunkCount >= 6) {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            audioChunks.length = 0;
            chunkCount = 0;
            await processAudioChunk(audioBlob, mimeType);
          }
        }
      };
      
      mediaRecorder.start(500); // Capture every 500ms, but only process after 3 seconds
      setConnectionStatus(prev => ({ ...prev, deepgram: 'connected' }));
      addLog(`Audio recording started (${mimeType})`);
      
      // Get initial question from AI
      await getAIResponse(true);
      
    } catch (error: any) {
      console.error('Error starting session:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please enable microphone permissions.');
        navigate('/error/mic-camera-blocked');
      } else {
        toast.error('Failed to start interview session');
      }
      addLog(`Error: ${error.message}`);
    }
  }, [addLog, isMicEnabled, navigate]);

  // Process audio chunk through Deepgram STT
  const processAudioChunk = useCallback(async (audioBlob: Blob, mimeType: string = 'audio/webm') => {
    if (processingRef.current) return;
    
    try {
      processingRef.current = true;
      const sttStart = Date.now();
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(audioBlob);
      });
      
      const { data, error } = await supabase.functions.invoke('interviewer-stt', {
        body: { audioData: base64Audio, mimeType }
      });
      
      const sttLatency = Date.now() - sttStart;
      setLatencyStats(prev => ({ ...prev, stt: sttLatency }));
      
      if (error) throw error;
      
      if (data?.transcript) {
        const chunk: TranscriptChunk = {
          id: generateId(),
          text: data.transcript,
          isFinal: data.is_final ?? true,
          confidence: data.confidence ?? 0.9,
          timestamp: new Date()
        };
        
        if (data.is_final && data.transcript.trim()) {
          setTranscriptChunks(prev => [...prev, chunk]);
          setCurrentInterimText('');
          
          // Add as user message
          const userMessage: Message = {
            id: generateId(),
            role: 'user',
            text: data.transcript,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, userMessage]);
          
          addLog(`STT Final: "${data.transcript}" (${sttLatency}ms)`);
          
          // Get AI response
          await getAIResponse(false);
        } else {
          setCurrentInterimText(data.transcript);
        }
      }
    } catch (error: any) {
      console.error('STT Error:', error);
      addLog(`STT Error: ${error.message}`);
    } finally {
      processingRef.current = false;
    }
  }, [addLog]);

  // Get AI response from LLM
  const getAIResponse = useCallback(async (isInitial: boolean = false) => {
    try {
      const llmStart = Date.now();
      addLog(isInitial ? 'Getting initial question...' : 'Getting AI response...');
      
      const userPlan = isPro ? 'pro' : isPlus ? 'plus' : 'free';
      
      const { data, error } = await supabase.functions.invoke('interviewer-llm', {
        body: {
          messages: messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
          interview_settings: settings,
          user_plan: userPlan,
          is_initial: isInitial
        }
      });
      
      const llmLatency = Date.now() - llmStart;
      setLatencyStats(prev => ({ ...prev, llm: llmLatency }));
      
      if (error) throw error;
      
      if (data?.ai_text) {
        const aiMessage: Message = {
          id: generateId(),
          role: 'ai',
          text: data.ai_text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setQuestionStartTime(new Date());
        
        addLog(`LLM Response (${data.provider_used}): ${llmLatency}ms`);
        setConnectionStatus(prev => ({ ...prev, llm: data.provider_used }));
        
        // Convert to speech
        if (isSpeakerEnabled) {
          await speakText(data.ai_text);
        }
      }
    } catch (error: any) {
      console.error('LLM Error:', error);
      addLog(`LLM Error: ${error.message}`);
      toast.error('Failed to get AI response. Please try again.');
    }
  }, [messages, settings, isPro, isPlus, isSpeakerEnabled, addLog]);

  // Text-to-Speech using Sarvam
  const speakText = useCallback(async (text: string) => {
    try {
      const ttsStart = Date.now();
      setConnectionStatus(prev => ({ ...prev, sarvam: 'loading' }));
      addLog('Converting to speech...');
      
      const { data, error } = await supabase.functions.invoke('interviewer-tts', {
        body: {
          text,
          voice: settings.voice,
          target_language_code: settings.targetLanguageCode,
          pace: settings.pace,
          pitch: settings.pitch
        }
      });
      
      const ttsLatency = Date.now() - ttsStart;
      setLatencyStats(prev => ({ ...prev, tts: ttsLatency }));
      
      if (error) throw error;
      
      if (data?.audioData) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))],
          { type: 'audio/wav' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Update message with audio URL
        setMessages(prev => prev.map(m => 
          m.text === text && m.role === 'ai' ? { ...m, audioUrl } : m
        ));
        
        // Play audio
        const audio = new Audio(audioUrl);
        audioQueueRef.current.push(audio);
        
        if (!isPlayingRef.current) {
          playNextAudio();
        }
        
        addLog(`TTS Complete: ${ttsLatency}ms`);
        setConnectionStatus(prev => ({ ...prev, sarvam: 'ready' }));
      }
    } catch (error: any) {
      console.error('TTS Error:', error);
      addLog(`TTS Error: ${error.message}`);
      setConnectionStatus(prev => ({ ...prev, sarvam: 'error' }));
      toast.error('Text-to-speech failed. Continuing in text-only mode.');
    }
  }, [settings, addLog]);

  // Play audio queue
  const playNextAudio = useCallback(() => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }
    
    isPlayingRef.current = true;
    const audio = audioQueueRef.current.shift()!;
    audio.onended = playNextAudio;
    audio.play().catch(console.error);
  }, []);

  // Stop session
  const stopSession = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsSessionActive(false);
    setConnectionStatus(prev => ({ ...prev, deepgram: 'disconnected' }));
    addLog('Session stopped');
  }, [addLog]);

  // End session and generate report
  const endAndGenerateReport = useCallback(async () => {
    stopSession();
    
    if (messages.length === 0) {
      toast.error('No conversation to analyze');
      return;
    }
    
    try {
      addLog('Generating interview report...');
      toast.loading('Generating your interview report...');
      
      const { data, error } = await supabase.functions.invoke('interviewer-report', {
        body: {
          messages: messages.map(m => ({ role: m.role, content: m.text, timestamp: m.timestamp })),
          settings,
          duration_minutes: sessionStartTime 
            ? Math.round((Date.now() - sessionStartTime.getTime()) / 60000) 
            : 0
        }
      });
      
      if (error) throw error;
      
      toast.dismiss();
      toast.success('Interview report generated successfully!');
      addLog('Report generated and saved');
      
      // Navigate to interview history
      navigate('/interview-history');
      
    } catch (error: any) {
      console.error('Report generation error:', error);
      toast.dismiss();
      toast.error('Failed to generate report');
      addLog(`Report Error: ${error.message}`);
    }
  }, [messages, settings, sessionStartTime, stopSession, addLog, navigate]);

  // Send manual text message
  const sendTextMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    addLog(`Manual input: "${text.trim()}"`);
    await getAIResponse(false);
  }, [getAIResponse, addLog]);

  // Ask next question
  const askNextQuestion = useCallback(async () => {
    addLog('Requesting next question...');
    await getAIResponse(false);
  }, [getAIResponse, addLog]);

  // Replay TTS for a message
  const replayAudio = useCallback((audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
    addLog('Replaying audio');
  }, [addLog]);

  // Handle sign out
  const handleSignOut = async () => {
    stopSession();
    await signOut();
    navigate('/');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
          <InterviewerHeader 
            isSessionActive={isSessionActive}
            connectionStatus={connectionStatus}
            onSignOut={handleSignOut}
          />
          
          <div className="max-w-[1800px] mx-auto px-4 py-6">
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
              {/* Left Panel - Controls */}
              <div className="col-span-3">
                <InterviewerControlPanel
                  isSessionActive={isSessionActive}
                  isMicEnabled={isMicEnabled}
                  isSpeakerEnabled={isSpeakerEnabled}
                  isPushToTalk={isPushToTalk}
                  isPushToTalkActive={isPushToTalkActive}
                  sessionStartTime={sessionStartTime}
                  questionStartTime={questionStartTime}
                  connectionStatus={connectionStatus}
                  userPlan={subscription?.plan || 'free'}
                  onStartSession={startSession}
                  onStopSession={stopSession}
                  onToggleMic={() => setIsMicEnabled(!isMicEnabled)}
                  onToggleSpeaker={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
                  onTogglePushToTalk={() => setIsPushToTalk(!isPushToTalk)}
                  onPushToTalkStart={() => setIsPushToTalkActive(true)}
                  onPushToTalkEnd={() => setIsPushToTalkActive(false)}
                />
              </div>
              
              {/* Center Panel - Conversation */}
              <div className="col-span-5">
                <InterviewerConversationPanel
                  messages={messages}
                  currentInterimText={currentInterimText}
                  isSessionActive={isSessionActive}
                  onSendMessage={sendTextMessage}
                  onAskNextQuestion={askNextQuestion}
                  onRepeatQuestion={() => messages.length > 0 && replayAudio(messages[messages.length - 1].audioUrl || '')}
                  onFlagQuestion={() => addLog('Question flagged')}
                  onEndAndReport={endAndGenerateReport}
                  onReplayAudio={replayAudio}
                />
              </div>
              
              {/* Right Panel - Transcript & Settings */}
              <div className="col-span-4">
                <InterviewerRightPanel
                  transcriptChunks={transcriptChunks}
                  currentInterimText={currentInterimText}
                  settings={settings}
                  eventLogs={eventLogs}
                  latencyStats={latencyStats}
                  onSettingsChange={setSettings}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Interviewer;
