
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, FileText, BarChart3, Download } from 'lucide-react';

interface InterviewSession {
  id: string;
  type: string;
  date: string;
  duration: string;
  status: string;
  transcript?: Array<{
    speaker: 'AI' | 'User';
    text: string;
    timestamp: string;
  }>;
  analysis?: {
    confidence: number;
    clarity: number;
    relevance: number;
    suggestions: string[];
  };
  timestamp: string;
}

const InterviewSessions = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
    setSessions(savedSessions);
  }, []);

  const downloadTranscript = (session: InterviewSession) => {
    if (!session.transcript) return;
    
    const transcriptText = session.transcript
      .map(entry => `[${entry.timestamp}] ${entry.speaker}: ${entry.text}`)
      .join('\n');
    
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.type}-${session.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Recent Interview Sessions</h2>
        <span className="text-sm text-muted-foreground">{sessions.length} sessions completed</span>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No interview sessions yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{session.type}</h3>
                    <p className="text-sm text-muted-foreground">{session.date} • {session.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {session.status}
                  </span>
                  {session.transcript && (
                    <button
                      onClick={() => downloadTranscript(session)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {session.analysis && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Performance Analysis</h4>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{session.analysis.confidence}%</div>
                      <div className="text-xs text-muted-foreground">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{session.analysis.clarity}%</div>
                      <div className="text-xs text-muted-foreground">Clarity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{session.analysis.relevance}%</div>
                      <div className="text-xs text-muted-foreground">Relevance</div>
                    </div>
                  </div>
                  {session.analysis.suggestions.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-foreground mb-1">Suggestions:</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {session.analysis.suggestions.map((suggestion, idx) => (
                          <li key={idx}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {session.transcript && (
                <div>
                  <button
                    onClick={() => setSelectedSession(selectedSession?.id === session.id ? null : session)}
                    className="text-sm text-primary hover:text-primary-dark transition-colors"
                  >
                    {selectedSession?.id === session.id ? 'Hide Transcript' : 'View Transcript'}
                  </button>

                  {selectedSession?.id === session.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto"
                    >
                      <div className="space-y-2">
                        {session.transcript.slice(0, 5).map((entry, idx) => (
                          <div key={idx} className="text-sm">
                            <span className={`font-medium ${entry.speaker === 'AI' ? 'text-primary' : 'text-accent'}`}>
                              {entry.speaker === 'AI' ? 'Interviewer' : 'You'}:
                            </span>
                            <span className="text-muted-foreground ml-2">{entry.text}</span>
                          </div>
                        ))}
                        {session.transcript.length > 5 && (
                          <div className="text-xs text-muted-foreground">
                            ...and {session.transcript.length - 5} more entries
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewSessions;
