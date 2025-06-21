
import React from 'react';

interface InterviewAnalysis {
  confidence: number;
  clarity: number;
  relevance: number;
  suggestions: string[];
}

interface RealTimeAnalysisProps {
  analysis: InterviewAnalysis;
  isInterviewActive: boolean;
}

const RealTimeAnalysis: React.FC<RealTimeAnalysisProps> = ({
  analysis,
  isInterviewActive
}) => {
  if (!analysis || !isInterviewActive) return null;

  return (
    <div className="mt-8 bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Real-time Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-sm text-slate-400">Confidence</div>
          <div className="text-2xl font-bold text-green-400">{analysis.confidence}%</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-sm text-slate-400">Clarity</div>
          <div className="text-2xl font-bold text-blue-400">{analysis.clarity}%</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-sm text-slate-400">Relevance</div>
          <div className="text-2xl font-bold text-purple-400">{analysis.relevance}%</div>
        </div>
      </div>
      {analysis.suggestions.length > 0 && (
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">Suggestions</div>
          <ul className="text-sm text-slate-200 space-y-1">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RealTimeAnalysis;
