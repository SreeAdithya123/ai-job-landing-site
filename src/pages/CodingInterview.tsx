import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { ArrowLeft, Play, Send, RotateCcw, Code2, Timer, CheckCircle, XCircle, Sparkles, History, ArrowRight } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import ProtectedRoute from '../components/ProtectedRoute';
import CreditCheckModal from '../components/CreditCheckModal';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  constraints?: string[];
  testCases?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
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
  const [showHistory, setShowHistory] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const { hasCredits, deductCredit } = useSubscription();

  const { data: history, refetch: refetchHistory } = useQuery({
    queryKey: ['coding-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('coding_interview_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

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

  const handleRunCode = async () => {
    if (!problem || !code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code before running",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setOutput('Analyzing your code against test cases...');
    setIsCorrect(null);
    setExecutionTime(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke('coding-evaluate', {
        body: { code, language, problem, mode: 'run' },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`
        } : {}
      });

      if (error) throw error;

      if (data.success) {
        setOutput(data.output || data.analysis || 'Code analysis complete.');
        setIsCorrect(data.isCorrect);
      } else {
        throw new Error(data.error || 'Run failed');
      }
    } catch (error: any) {
      console.error('Error running code:', error);
      setOutput(`Error: ${error.message || 'Failed to analyze code'}`);
      toast({
        title: "Run Error",
        description: "Failed to analyze your code",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    
    if (!hasCredits) {
      setShowCreditModal(true);
      return;
    }

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
        body: { code, language, problem, mode: 'evaluate' },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`
        } : {}
      });

      if (error) throw error;

      if (data.success) {
        setEvaluation(data.evaluation);
        setIsCorrect(data.evaluation.isCorrect ?? null);
        refetchHistory();
        deductCredit({ interviewType: 'coding' });
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

  const handleNextProblem = () => {
    setEvaluation(null);
    setOutput('');
    setExecutionTime(null);
    setIsCorrect(null);
    loadRandomProblem();
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
        <div className="border-b border-border bg-card/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/interview-copilot')}
                className="text-foreground hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Coding Interview</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="w-4 h-4 mr-2" />
                {showHistory ? 'Hide' : 'Show'} History
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadRandomProblem}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Problem
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Real-time Coding Challenges
            </h2>
            <p className="text-muted-foreground text-lg">
              Practice with AI-powered feedback • 35 problems across all difficulty levels
            </p>
          </div>

          {showHistory ? (
            <Card className="clay-card">
              <CardHeader>
                <CardTitle className="text-foreground">Submission History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {history && history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((item) => (
                        <Card key={item.id} className="clay-card">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg text-foreground">{item.problem_title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(item.created_at).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={difficultyColors[item.difficulty as keyof typeof difficultyColors]}>
                                  {item.difficulty}
                                </Badge>
                                {item.score && (
                                  <Badge variant="outline">
                                    Score: {item.score}/10
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex gap-4">
                                <span className="text-muted-foreground">Language:</span>
                                <span className="font-mono text-foreground">{item.language}</span>
                              </div>
                              {item.time_complexity && (
                                <div className="flex gap-4">
                                  <span className="text-muted-foreground">Time Complexity:</span>
                                  <span className="font-mono text-foreground">{item.time_complexity}</span>
                                </div>
                              )}
                              {item.space_complexity && (
                                <div className="flex gap-4">
                                  <span className="text-muted-foreground">Space Complexity:</span>
                                  <span className="font-mono text-foreground">{item.space_complexity}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No submissions yet</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 clay-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Problem</CardTitle>
                    {problem && (
                      <Badge className={`${difficultyColors[problem.difficulty as keyof typeof difficultyColors]} border`}>
                        {problem.difficulty}
                      </Badge>
                    )}
                  </div>
                  {problem && (
                    <CardDescription className="text-foreground/80 text-lg font-semibold">
                      {problem.title}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-400px)]">
                    {problem ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-foreground font-semibold mb-2">Description</h3>
                          <p className="text-muted-foreground text-sm whitespace-pre-wrap">{problem.description}</p>
                        </div>

                        {problem.constraints && problem.constraints.length > 0 && (
                          <div>
                            <h3 className="text-foreground font-semibold mb-2">Constraints</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {problem.constraints.map((constraint, idx) => (
                                <li key={idx}>{constraint}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {problem.testCases && problem.testCases.length > 0 && (
                          <div>
                            <h3 className="text-foreground font-semibold mb-2">Test Cases</h3>
                            <div className="space-y-3">
                              {problem.testCases.map((testCase, idx) => (
                                <div key={idx} className="bg-muted/50 p-3 rounded-lg">
                                  <p className="text-sm text-muted-foreground"><strong>Input:</strong> {testCase.input}</p>
                                  <p className="text-sm text-muted-foreground"><strong>Output:</strong> {testCase.output}</p>
                                  {testCase.explanation && (
                                    <p className="text-sm text-muted-foreground/70 mt-1">
                                      <strong>Explanation:</strong> {testCase.explanation}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center py-8">Loading problem...</div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Card className="clay-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary" />
                        Code Editor
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-40">
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
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-t border-border">
                      <CodeEditor
                        language={language}
                        value={code}
                        onChange={setCode}
                        height="400px"
                      />
                    </div>
                    <div className="flex gap-3 p-4 border-t border-border">
                      <Button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {isRunning ? 'Analyzing...' : 'Run Code'}
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isEvaluating || !code.trim()}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isEvaluating ? 'Evaluating...' : 'Submit Solution'}
                      </Button>
                      {evaluation && (
                        <Button
                          onClick={handleNextProblem}
                          variant="outline"
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Next Problem
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {output && (
                  <Card className="clay-card">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Timer className="w-5 h-5 text-accent" />
                        Output
                        {isCorrect !== null && (
                          <Badge className={isCorrect ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}>
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
                      <pre className="bg-muted p-4 rounded-lg text-sm text-foreground font-mono whitespace-pre-wrap">
                        {output}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {evaluation && (
                  <Card className="clay-card border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        AI Evaluation
                        <Badge className="bg-primary/10 text-primary ml-auto text-lg">
                          Score: {evaluation.score}/10
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-foreground font-semibold mb-2">Feedback</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{evaluation.feedback}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <h5 className="text-muted-foreground text-xs mb-1">Time Complexity</h5>
                          <p className="text-foreground font-mono">{evaluation.timeComplexity}</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <h5 className="text-muted-foreground text-xs mb-1">Space Complexity</h5>
                          <p className="text-foreground font-mono">{evaluation.spaceComplexity}</p>
                        </div>
                      </div>

                      {evaluation.strengths.length > 0 && (
                        <div>
                          <h4 className="text-green-500 font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Strengths
                          </h4>
                          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                            {evaluation.strengths.map((strength, idx) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {evaluation.improvements.length > 0 && (
                        <div>
                          <h4 className="text-yellow-500 font-semibold mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Improvements
                          </h4>
                          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
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
          )}
        </div>

        <CreditCheckModal open={showCreditModal} onOpenChange={setShowCreditModal} />
      </div>
    </ProtectedRoute>
  );
};

export default CodingInterview;
