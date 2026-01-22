import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import InterviewerControlPanel from '@/components/interviewer/InterviewerControlPanel';
import InterviewerConversationPanel from '@/components/interviewer/InterviewerConversationPanel';
import InterviewerRightPanel from '@/components/interviewer/InterviewerRightPanel';
import InterviewerPageHeader from '@/components/interviewer/InterviewerPageHeader';
import InterviewSetupForm from '@/components/interviewer/InterviewSetupForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
  
  // Setup state - shows form before interview starts
  const [showSetupForm, setShowSetupForm] = useState(true);
  const [isStartingInterview, setIsStartingInterview] = useState(false);
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  
  // Audio controls
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [isPushToTalk, setIsPushToTalk] = useState(false);
  const [isPushToTalkActive, setIsPushToTalkActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  
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
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioQueueRef = useRef<HTMLAudioElement[]>([]);
  const isPlayingRef = useRef(false);
  const vadIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mimeTypeRef = useRef<string>('audio/webm');

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 99)]);
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Voice Activity Detection (VAD) - detect when user stops speaking
  const startVAD = useCallback(() => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const SILENCE_THRESHOLD = 20; // Audio level below this = silence
    const SILENCE_DURATION = 1500; // 1.5s of silence = end of utterance
    
    let isSpeaking = false;
    
    vadIntervalRef.current = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      
      if (average > SILENCE_THRESHOLD) {
        // User is speaking
        if (!isSpeaking && !isRecording && isMicEnabled) {
          isSpeaking = true;
          startRecording();
        }
        // Reset silence timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      } else {
        // Silence detected
        if (isSpeaking && isRecording && !silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            isSpeaking = false;
            stopRecording();
            silenceTimeoutRef.current = null;
          }, SILENCE_DURATION);
        }
      }
    }, 100);
  }, [isRecording, isMicEnabled]);

  // Start recording a single utterance
  const startRecording = useCallback(() => {
    if (!streamRef.current || isRecording) return;
    
    try {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';
      
      mimeTypeRef.current = mimeType;
      const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          audioChunksRef.current = [];
          
          // Only process if blob is substantial (>5KB)
          if (audioBlob.size > 5000) {
            await processCompleteAudio(audioBlob, mimeType);
          } else {
            addLog('Audio too short, skipping');
          }
        }
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setCurrentInterimText('Listening...');
      addLog('Recording started (VAD detected speech)');
    } catch (error: any) {
      console.error('Recording start error:', error);
      addLog(`Recording error: ${error.message}`);
    }
  }, [isRecording, addLog]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      addLog('Recording stopped (silence detected)');
    }
  }, [addLog]);

  // Process complete audio through Deepgram STT
  const processCompleteAudio = useCallback(async (audioBlob: Blob, mimeType: string) => {
    if (isProcessingAudio) return;
    
    try {
      setIsProcessingAudio(true);
      setCurrentInterimText('Processing speech...');
      const sttStart = Date.now();
      
      addLog(`Processing audio: ${(audioBlob.size / 1024).toFixed(1)}KB`);
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });
      
      const { data, error } = await supabase.functions.invoke('interviewer-stt', {
        body: { audioData: base64Audio, mimeType }
      });
      
      const sttLatency = Date.now() - sttStart;
      setLatencyStats(prev => ({ ...prev, stt: sttLatency }));
      
      if (error) throw error;
      
      setCurrentInterimText('');
      
      if (data?.transcript && data.transcript.trim()) {
        const chunk: TranscriptChunk = {
          id: generateId(),
          text: data.transcript,
          isFinal: true,
          confidence: data.confidence ?? 0.9,
          timestamp: new Date()
        };
        
        setTranscriptChunks(prev => [...prev, chunk]);
        
        // Add as user message
        const userMessage: Message = {
          id: generateId(),
          role: 'user',
          text: data.transcript,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        
        addLog(`STT: "${data.transcript.substring(0, 50)}..." (${sttLatency}ms, ${Math.round(data.confidence * 100)}% conf)`);
        
        // Get AI response
        await getAIResponse(false);
      } else {
        addLog('No speech detected in audio');
      }
    } catch (error: any) {
      console.error('STT Error:', error);
      addLog(`STT Error: ${error.message}`);
      setCurrentInterimText('');
    } finally {
      setIsProcessingAudio(false);
    }
  }, [isProcessingAudio, addLog]);

  // Start interview from setup form
  const handleStartFromSetup = useCallback(async () => {
    setIsStartingInterview(true);
    try {
      await startSession();
      setShowSetupForm(false);
    } catch (error) {
      console.error('Failed to start interview:', error);
    } finally {
      setIsStartingInterview(false);
    }
  }, []);

  // Start interview session
  const startSession = useCallback(async () => {
    try {
      addLog('Starting interview session...');
      
      // Request mic permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      streamRef.current = stream;
      
      setIsSessionActive(true);
      setSessionStartTime(new Date());
      setConnectionStatus(prev => ({ ...prev, deepgram: 'connecting' }));
      
      addLog('Microphone access granted');
      
      // Initialize audio context and analyser for VAD
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      setConnectionStatus(prev => ({ ...prev, deepgram: 'connected' }));
      addLog('Audio pipeline ready');
      
      // Only start VAD if NOT in push-to-talk mode
      if (!isPushToTalk) {
        startVAD();
      }
      
      // Get initial question from AI
      await getAIResponse(true);
      
    } catch (error: any) {
      console.error('Error starting session:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please enable microphone permissions.');
      } else {
        toast.error('Failed to start interview session');
      }
      addLog(`Error: ${error.message}`);
      throw error;
    }
  }, [addLog, startVAD, isPushToTalk]);

  // Push-to-talk start - begins recording
  const handlePushToTalkStart = useCallback(() => {
    if (!isSessionActive || !streamRef.current) return;
    setIsPushToTalkActive(true);
    startRecording();
  }, [isSessionActive, startRecording]);

  // Push-to-talk end - stops recording and processes audio
  const handlePushToTalkEnd = useCallback(() => {
    if (!isPushToTalkActive) return;
    setIsPushToTalkActive(false);
    stopRecording();
  }, [isPushToTalkActive, stopRecording]);

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
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsSessionActive(false);
    setIsRecording(false);
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
          user_plan: subscription?.plan || 'free',
          duration_minutes: sessionStartTime 
            ? Math.round((Date.now() - sessionStartTime.getTime()) / 60000) 
            : 0
        }
      });
      
      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to generate report');
      }
      
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
  }, [messages, settings, sessionStartTime, stopSession, addLog, navigate, subscription]);

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
    if (!audioUrl) return;
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
        <div className="min-h-screen bg-background">
          <InterviewerPageHeader 
            isSessionActive={isSessionActive}
            connectionStatus={connectionStatus}
            onSignOut={handleSignOut}
          />
          
          <div className="max-w-[1800px] mx-auto px-6 py-8">
            {/* Setup Form - shown before interview starts */}
            {showSetupForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <InterviewSetupForm
                  settings={settings}
                  onSettingsChange={setSettings}
                  onStartInterview={handleStartFromSetup}
                  isLoading={isStartingInterview}
                />
              </motion.div>
            )}

            {/* Interview Interface - shown after setup is complete */}
            {!showSetupForm && (
              <>
                {/* Recording Indicator */}
                {isRecording && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                  >
                    <div className="flex items-center gap-3 px-6 py-3 bg-destructive text-destructive-foreground rounded-full shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      <span className="font-medium">Recording...</span>
                    </div>
                  </motion.div>
                )}

                {/* Processing Indicator */}
                {isProcessingAudio && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                  >
                    <div className="flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-lg">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium">Processing speech...</span>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-12 gap-8">
                  {/* Left Panel - Controls */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-12 lg:col-span-3"
                  >
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
                      onPushToTalkStart={handlePushToTalkStart}
                      onPushToTalkEnd={handlePushToTalkEnd}
                    />
                  </motion.div>
                  
                  {/* Center Panel - Conversation */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-12 lg:col-span-5"
                  >
                    <div className="h-[calc(100vh-280px)] min-h-[500px]">
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
                  </motion.div>
                  
                  {/* Right Panel - Transcript & Settings */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="col-span-12 lg:col-span-4"
                  >
                    <div className="h-[calc(100vh-280px)] min-h-[500px]">
                      <InterviewerRightPanel
                        transcriptChunks={transcriptChunks}
                        currentInterimText={currentInterimText}
                        settings={settings}
                        eventLogs={eventLogs}
                        latencyStats={latencyStats}
                        onSettingsChange={setSettings}
                      />
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Interviewer;
