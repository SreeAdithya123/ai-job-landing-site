import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Video, Play, Calendar, Clock, Download, Search } from 'lucide-react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useInterviewAnalyses } from '@/hooks/useInterviewAnalysis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRecordingUrl } from '@/services/recordingStorageService';

const InterviewRecordings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const playId = searchParams.get('play');
  const { data: analyses, isLoading } = useInterviewAnalyses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecording, setSelectedRecording] = useState<string | null>(playId);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [isLoadingPlayback, setIsLoadingPlayback] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  // Show all analyses, highlight those with recordings
  const allAnalyses = useMemo(() => analyses || [], [analyses]);

  const filteredRecordings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allAnalyses;
    return allAnalyses.filter((recording) =>
      recording.interview_type.toLowerCase().includes(term)
    );
  }, [allAnalyses, searchTerm]);

  const currentRecording = useMemo(
    () => allAnalyses.find((r) => r.id === selectedRecording) || null,
    [allAnalyses, selectedRecording]
  );

  useEffect(() => {
    let cancelled = false;

    const loadPlaybackUrl = async () => {
      setPlaybackError(null);
      setPlaybackUrl(null);

      if (!currentRecording?.recording_url) return;

      setIsLoadingPlayback(true);
      try {
        const signed = await getRecordingUrl(currentRecording.recording_url);
        if (!signed) throw new Error('Could not generate playback URL');
        if (!cancelled) setPlaybackUrl(signed);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load recording';
        if (!cancelled) setPlaybackError(message);
      } finally {
        if (!cancelled) setIsLoadingPlayback(false);
      }
    };

    loadPlaybackUrl();

    return () => {
      cancelled = true;
    };
  }, [currentRecording?.id, currentRecording?.recording_url]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading recordings...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/interview-history')} 
                  className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-border rounded-lg hover:bg-white/90 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">Back to History</span>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Interview Recordings
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Watch and review your recorded interview sessions
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recording List */}
              <div className="lg:col-span-1">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search recordings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {filteredRecordings.length === 0 ? (
                    <div className="text-center py-12 glass-card rounded-xl">
                      <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Interviews Yet</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Complete an interview to see your sessions here
                      </p>
                      <Button onClick={() => navigate('/interview-copilot')}>
                        Start Interview
                      </Button>
                    </div>
                  ) : (
                    filteredRecordings.map((recording, index) => (
                      <motion.div
                        key={recording.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`glass-card p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedRecording === recording.id 
                            ? 'ring-2 ring-primary shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedRecording(recording.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            recording.recording_url ? 'bg-primary/10' : 'bg-muted'
                          }`}>
                            <Play className={`h-5 w-5 ${recording.recording_url ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">
                              {recording.interview_type}
                            </h4>
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(recording.created_at || '').toLocaleDateString()}</span>
                              </div>
                              {recording.duration_minutes && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{recording.duration_minutes}m</span>
                                </div>
                              )}
                            </div>
                            {recording.overall_score && (
                              <div className="mt-2 flex items-center">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  recording.overall_score >= 85 
                                    ? 'bg-green-100 text-green-700'
                                    : recording.overall_score >= 70
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  Score: {recording.overall_score}%
                                </span>
                                {!recording.recording_url && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground ml-2">
                                    No Recording
                                  </span>
                                )}
                              </div>
                            )}
                            {!recording.overall_score && !recording.recording_url && (
                              <div className="mt-2">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  No Recording
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Video Player */}
              <div className="lg:col-span-2">
                {currentRecording ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    {currentRecording.recording_url ? (
                      <div className="aspect-video bg-black">
                        {isLoadingPlayback ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-muted-foreground">Loading recording…</p>
                          </div>
                        ) : playbackUrl ? (
                          <video
                            key={playbackUrl}
                            controls
                            className="w-full h-full"
                            src={playbackUrl}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-muted-foreground">
                              {playbackError || 'Recording is unavailable'}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <div className="text-center">
                          <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No recording available for this interview</p>
                          <p className="text-xs text-muted-foreground mt-2">Recording was not captured during this session</p>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">
                            {currentRecording.interview_type}
                          </h2>
                          <p className="text-muted-foreground text-sm">
                            Recorded on {new Date(currentRecording.created_at || '').toLocaleDateString()}
                          </p>
                        </div>
                        {(!!playbackUrl || isLoadingPlayback) && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!playbackUrl}
                            onClick={() => {
                              if (!playbackUrl) return;
                              const a = document.createElement('a');
                              a.href = playbackUrl;
                              a.download = `interview-${currentRecording.id}.webm`;
                              a.click();
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>

                      {/* Score Summary */}
                      {currentRecording.overall_score && (
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-primary/5 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{currentRecording.overall_score}%</div>
                            <div className="text-xs text-muted-foreground">Overall</div>
                          </div>
                          {currentRecording.communication_score && (
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{currentRecording.communication_score}%</div>
                              <div className="text-xs text-muted-foreground">Communication</div>
                            </div>
                          )}
                          {currentRecording.technical_score && (
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">{currentRecording.technical_score}%</div>
                              <div className="text-xs text-muted-foreground">Technical</div>
                            </div>
                          )}
                          {currentRecording.confidence_score && (
                            <div className="text-center p-3 bg-amber-50 rounded-lg">
                              <div className="text-2xl font-bold text-amber-600">{currentRecording.confidence_score}%</div>
                              <div className="text-xs text-muted-foreground">Confidence</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Feedback */}
                      {currentRecording.feedback && (
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h3 className="font-medium text-foreground mb-2">Feedback</h3>
                          <p className="text-muted-foreground text-sm">{currentRecording.feedback}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass-card rounded-xl p-12 text-center">
                    <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Select a Recording
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a recording from the list to watch it here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default InterviewRecordings;
