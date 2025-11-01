import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Play, Send, RotateCcw, Code2, Timer, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import ProtectedRoute from '../components/ProtectedRoute';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  starterCode: {
    python: string;
    cpp: string;
    c: string;
    java: string;
    javascript: string;
  };
}

interface Evaluation {
  feedback: string;
  timeComplexity: string;
  spaceComplexity: string;
  score: number;
  strengths: string[];
  improvements: string[];
}

const CodingInterview = () => {
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const difficultyColors = {
    easy: 'bg-green-500/10 text-green-500 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  useEffect(() => {
    loadRandomProblem();
  }, []);

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language as keyof typeof problem.starterCode]);
    }
  }, [language, problem]);

  const loadRandomProblem = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('coding-problem-generator', {
        body: { difficulty: null }
      });

      if (error) throw error;

      if (data.success && data.problem) {
        setProblem(data.problem);
        setCode(data.problem.starterCode.python);
        setEvaluation(null);
        setOutput('');
        setIsCorrect(null);
      }
    } catch (error) {
      console.error('Error loading problem:', error);
      toast({
        title: "Error",
        description: "Failed to load coding problem",
        variant: "destructive"
      });
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setExecutionTime(null);
    
    const startTime = Date.now();
    
    // Simulated execution for demonstration
    setTimeout(() => {
      const endTime = Date.now();
      const execTime = (endTime - startTime) / 1000;
      setExecutionTime(execTime);
      setOutput(`Code executed successfully!\nExecution time: ${execTime.toFixed(3)}s\n\nNote: This is a simulated execution. In production, code would be executed securely on a backend server.`);
      setIsRunning(false);
      
      // Simulate correctness check (in real implementation, this would come from test cases)
      setIsCorrect(Math.random() > 0.3); // 70% chance of being "correct" for demo
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!problem) return;
    
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsEvaluating(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('coding-evaluate', {
        body: {
          code,
          language,
          output: output || 'No output generated',
          problem,
          executionTime,
          isCorrect: isCorrect ?? false
        },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`
        } : {}
      });

      if (error) throw error;

      if (data.success) {
        setEvaluation(data.evaluation);
        toast({
          title: "Evaluation Complete",
          description: `Your solution scored ${data.evaluation.score}/10`
        });
      }
    } catch (error) {
      console.error('Error evaluating code:', error);
      toast({
        title: "Evaluation Error",
        description: "Failed to evaluate your solution",
        variant: "destructive"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    if (problem) {
      setCode(problem.starterCode[language as keyof typeof problem.starterCode]);
      setOutput('');
      setEvaluation(null);
      setIsCorrect(null);
      setExecutionTime(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/interview-copilot')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to AI Interviewer
              </Button>
              <Separator orientation="vertical" className="h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold text-white">Coding Interview</h1>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadRandomProblem}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Problem
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Hero */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Real-time Coding Challenges
            </h2>
            <p className="text-slate-300 text-lg">
              Practice with AI-powered feedback and evaluation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Problem Panel */}
            <Card className="lg:col-span-1 bg-slate-800/50 border-purple-500/20 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Problem</CardTitle>
                  {problem && (
                    <Badge className={`${difficultyColors[problem.difficulty as keyof typeof difficultyColors]} border`}>
                      {problem.difficulty}
                    </Badge>
                  )}
                </div>
                {problem && (
                  <CardDescription className="text-slate-300 text-lg font-semibold">
                    {problem.title}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-400px)]">
                  {problem ? (
                    <div className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                      {problem.description}
                    </div>
                  ) : (
                    <div className="text-slate-400 text-center py-8">
                      Loading problem...
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Code Editor & Output */}
            <div className="lg:col-span-2 space-y-6">
              {/* Editor */}
              <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      Code Editor
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="c">C</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-t border-slate-700">
                    <CodeEditor
                      language={language}
                      value={code}
                      onChange={setCode}
                      height="400px"
                    />
                  </div>
                  <div className="flex gap-3 p-4 border-t border-slate-700">
                    <Button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isEvaluating || !code.trim()}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isEvaluating ? 'Evaluating...' : 'Submit Solution'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output */}
              {output && (
                <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Timer className="w-5 h-5 text-accent" />
                      Output
                      {isCorrect !== null && (
                        <Badge className={isCorrect ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                          {isCorrect ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Correct
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Incorrect
                            </>
                          )}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300 font-mono whitespace-pre-wrap">
                      {output}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* AI Feedback */}
              {evaluation && (
                <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      AI Evaluation
                      <Badge className="bg-white/20 text-white ml-auto text-lg">
                        Score: {evaluation.score}/10
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Feedback</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{evaluation.feedback}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <h5 className="text-slate-400 text-xs mb-1">Time Complexity</h5>
                        <p className="text-white font-mono">{evaluation.timeComplexity}</p>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <h5 className="text-slate-400 text-xs mb-1">Space Complexity</h5>
                        <p className="text-white font-mono">{evaluation.spaceComplexity}</p>
                      </div>
                    </div>

                    {evaluation.strengths.length > 0 && (
                      <div>
                        <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                          {evaluation.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {evaluation.improvements.length > 0 && (
                      <div>
                        <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Improvements
                        </h4>
                        <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                          {evaluation.improvements.map((improvement, idx) => (
                            <li key={idx}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CodingInterview;