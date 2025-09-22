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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Practice Interview</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Record your answer to practice for real interviews. AI will give instant feedback, questions, and voice responses!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recording Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Recording Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording} 
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={getNextQuestion}
                    disabled={isProcessing}
                    variant="outline"
                    className="flex-1 border-purple-500 text-purple-300 hover:bg-purple-500/20"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Get Next AI Question
                  </Button>

                  <Button 
                    onClick={endPractice}
                    variant="outline"
                    className="flex-1 border-slate-500 text-slate-300 hover:bg-slate-500/20"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    End Practice
                  </Button>
                </div>

                {isProcessing && (
                  <div className="text-center text-slate-400">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mb-2"></div>
                    <p>Processing...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Response */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  AI Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiQuestion && (
                  <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-700/50">
                    <p className="text-purple-200 whitespace-pre-wrap">{aiQuestion}</p>
                  </div>
                )}

                {aiAudio && (
                  <Button 
                    onClick={playAiAudio}
                    disabled={isPlaying}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isPlaying ? 'Playing...' : 'Play AI Response'}
                  </Button>
                )}

                {!aiQuestion && (
                  <div className="text-center text-slate-400 py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click "Get Next AI Question" to start practicing!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Your Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                {transcript ? (
                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                    <p className="text-slate-200 whitespace-pre-wrap">{transcript}</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your spoken words will appear here after recording...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PracticeInterview;