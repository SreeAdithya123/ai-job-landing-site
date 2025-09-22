import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Play, Square, MessageSquare, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PracticeResponse {
  transcript: string;
  aiQuestion: string;
  aiAudio: string;
}

const PracticeInterview: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAudio, setAiAudio] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processRecording(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak your answer now...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const { data, error } = await supabase.functions.invoke('sarvam-practice-interview', {
        body: { audioData: base64Audio }
      });

      if (error) throw error;

      const response: PracticeResponse = data;
      setTranscript(response.transcript);
      setAiQuestion(response.aiQuestion);
      setAiAudio(response.aiAudio);

      toast({
        title: "Processing complete!",
        description: "Your answer has been analyzed. Listen to the AI feedback!",
      });
    } catch (error) {
      console.error('Error processing recording:', error);
      toast({
        title: "Error",
        description: "Failed to process your recording. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const playAiAudio = () => {
    if (aiAudio && !isPlaying) {
      // Create audio from base64
      const audioData = `data:audio/wav;base64,${aiAudio}`;
      const audio = new Audio(audioData);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "Audio Error",
          description: "Could not play AI response audio.",
          variant: "destructive",
        });
      };

      audio.play();
    }
  };

  const getNextQuestion = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sarvam-practice-interview', {
        body: { getQuestion: true }
      });

      if (error) throw error;

      const response: PracticeResponse = data;
      setAiQuestion(response.aiQuestion);
      setAiAudio(response.aiAudio);
      setTranscript(''); // Clear previous transcript

      toast({
        title: "New question ready!",
        description: "Listen to the AI question and record your answer.",
      });
    } catch (error) {
      console.error('Error getting next question:', error);
      toast({
        title: "Error",
        description: "Failed to get next question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const endPractice = () => {
    setTranscript('');
    setAiQuestion('');
    setAiAudio(null);
    if (isRecording) {
      stopRecording();
    }
    toast({
      title: "Practice ended",
      description: "Great job! You can start a new practice session anytime.",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              onClick={() => window.history.back()}
            >
              ← Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Practice AI Interview</h1>
                <p className="text-sm text-slate-400">Speech & Voice Training</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-green-400 font-medium">Ready</div>
        </div>

        {/* Main Interview Interface */}
        <div className="px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* AI Interviewer */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'ring-4 ring-blue-400/50 scale-105' : ''}`}>
                    <MessageSquare className="h-12 w-12 text-white" />
                  </div>
                  {isPlaying && (
                    <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-blue-400 animate-ping"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Interviewer</h3>
                <p className="text-slate-400 text-sm mb-4">Practice Interview Assistant</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${aiQuestion ? 'bg-green-400' : 'bg-slate-600'}`}></div>
                  <span className="text-xs text-slate-400">
                    {aiQuestion ? 'Ready to respond' : 'Waiting for question'}
                  </span>
                </div>
              </div>

              {/* Candidate (You) */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center transition-all duration-300 ${isRecording ? 'ring-4 ring-red-400/50 scale-105' : ''}`}>
                    <div className="w-16 h-16 rounded-full bg-slate-500 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-slate-400"></div>
                    </div>
                  </div>
                  {isRecording && (
                    <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-red-400 animate-ping"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Candidate (You)</h3>
                <p className="text-slate-400 text-sm mb-4">Interview Participant</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-slate-600'}`}></div>
                  <span className="text-xs text-slate-400">
                    {isRecording ? 'Recording...' : 'Ready to record'}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Practice Session Indicator */}
            {(isRecording || aiQuestion) && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-900/50 text-green-300 rounded-full border border-green-700/50">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Practice Session</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {!isRecording && !isProcessing ? (
                <>
                  <Button 
                    onClick={getNextQuestion}
                    variant="outline"
                    className="flex items-center space-x-3 px-6 py-3 bg-slate-700/80 backdrop-blur-sm border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-600/80 transition-all duration-200"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Get AI Question</span>
                  </Button>
                  
                  <Button 
                    onClick={startRecording}
                    disabled={!aiQuestion}
                    className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mic className="h-5 w-5" />
                    <span>Start Recording</span>
                  </Button>
                </>
              ) : isRecording ? (
                <Button 
                  onClick={stopRecording}
                  className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <Square className="h-5 w-5" />
                  <span>Stop Recording</span>
                </Button>
              ) : (
                <div className="text-center">
                  <div className="animate-spin inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mb-2"></div>
                  <p className="text-slate-400">Processing your response...</p>
                </div>
              )}
            </div>

            {/* AI Question Display */}
            {aiQuestion && (
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-400" />
                    AI Interview Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-700/50">
                    <p className="text-purple-200 whitespace-pre-wrap">{aiQuestion}</p>
                  </div>
                  
                  {aiAudio && (
                    <Button 
                      onClick={playAiAudio}
                      disabled={isPlaying}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      {isPlaying ? 'Playing AI Response...' : 'Listen to Question'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Transcript Display */}
            {transcript && (
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Your Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                    <p className="text-slate-200 whitespace-pre-wrap">{transcript}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {!aiQuestion && !isRecording && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-white mb-4">Ready to Practice?</h3>
                  <p className="text-slate-400 mb-6">
                    Record your answer to practice for real interviews. AI will give instant feedback, questions, and voice responses!
                  </p>
                  <Button 
                    onClick={getNextQuestion}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Start Practice Session
                  </Button>
                </div>
              </div>
            )}

            {/* End Practice Button */}
            {(aiQuestion || transcript) && (
              <div className="text-center">
                <Button 
                  onClick={endPractice}
                  variant="outline"
                  className="border-slate-500 text-slate-300 hover:bg-slate-500/20"
                >
                  End Practice Session
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PracticeInterview;