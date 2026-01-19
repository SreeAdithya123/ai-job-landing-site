import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Calculator, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  Target,
  Timer,
  Play,
  Loader2,
  Lock
} from 'lucide-react';

type Category = 'quantitative' | 'logical' | 'verbal';
type Difficulty = 'easy' | 'medium' | 'hard';
type TestPhase = 'setup' | 'loading' | 'test' | 'results';

interface MCQQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  accuracy: number;
  answers: Record<number, string>;
}

const QUESTION_TIME_LIMIT = 60; // seconds per question

const AptitudeTest: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isFree, isPro, isPlus } = useSubscription();
  const navigate = useNavigate();

  // Test state
  const [phase, setPhase] = useState<TestPhase>('setup');
  const [category, setCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME_LIMIT);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [monthlyTestCount, setMonthlyTestCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  // Check monthly test count
  useEffect(() => {
    const checkMonthlyCount = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.rpc('get_monthly_aptitude_test_count', {
          p_user_id: user.id
        });
        
        if (error) throw error;
        setMonthlyTestCount(data || 0);
      } catch (error) {
        console.error('Error checking monthly test count:', error);
      } finally {
        setIsLoadingCount(false);
      }
    };

    checkMonthlyCount();
  }, [user]);

  // Timer effect
  useEffect(() => {
    if (phase !== 'test') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto move to next question
          handleNextQuestion();
          return QUESTION_TIME_LIMIT;
        }
        return prev - 1;
      });
      setTotalTimeTaken(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, currentQuestionIndex]);

  const canTakeTest = useCallback(() => {
    if (isPro || isPlus) return true;
    if (isFree && monthlyTestCount < 1) return true;
    return monthlyTestCount < 1; // Default beginner plan
  }, [isPro, isPlus, isFree, monthlyTestCount]);

  const getTestLimit = () => {
    if (isPro) return 'Unlimited';
    if (isPlus) return '10/month';
    if (isFree) return '1/month';
    return '1/month';
  };

  const handleStartTest = async () => {
    if (!category || !difficulty) {
      toast.error('Please select category and difficulty');
      return;
    }

    if (!canTakeTest()) {
      toast.error('You have reached your monthly test limit. Upgrade to take more tests!');
      return;
    }

    setPhase('loading');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('generate-aptitude-questions', {
        body: { category, difficulty, count: 20 },
      });

      if (response.error || !response.data?.success) {
        throw new Error(response.data?.error || 'Failed to generate questions');
      }

      const generatedQuestions = response.data.questions as MCQQuestion[];

      // Create test session in database
      const { data: sessionData, error: sessionError } = await supabase
        .from('aptitude_test_sessions')
        .insert({
          user_id: user!.id,
          category,
          difficulty,
          questions: generatedQuestions as unknown as any,
          total_questions: generatedQuestions.length,
          status: 'in_progress'
        } as any)
        .select('id')
        .single();

      if (sessionError) throw sessionError;

      setSessionId(sessionData.id);
      setQuestions(generatedQuestions);
      setTestStartTime(new Date());
      setPhase('test');
      setTimeRemaining(QUESTION_TIME_LIMIT);
      toast.success('Test started! Good luck!');

    } catch (error) {
      console.error('Error starting test:', error);
      toast.error('Failed to start test. Please try again.');
      setPhase('setup');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(QUESTION_TIME_LIMIT);
    } else {
      handleSubmitTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTimeRemaining(QUESTION_TIME_LIMIT);
    }
  };

  const handleSubmitTest = async () => {
    const endTime = new Date();
    const timeTaken = testStartTime 
      ? Math.round((endTime.getTime() - testStartTime.getTime()) / 1000)
      : totalTimeTaken;

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const accuracy = Math.round((correctCount / Object.keys(answers).length) * 100) || 0;

    const testResult: TestResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      timeTaken,
      accuracy,
      answers
    };

    setResult(testResult);

    // Update session in database
    if (sessionId) {
      try {
        await supabase
          .from('aptitude_test_sessions')
          .update({
            answers,
            score,
            correct_answers: correctCount,
            time_taken_seconds: timeTaken,
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId);
      } catch (error) {
        console.error('Error saving test results:', error);
      }
    }

    setPhase('results');
    toast.success('Test completed!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'quantitative': return <Calculator className="h-6 w-6" />;
      case 'logical': return <Brain className="h-6 w-6" />;
      case 'verbal': return <BookOpen className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case 'quantitative': return 'from-blue-500 to-blue-600';
      case 'logical': return 'from-purple-500 to-purple-600';
      case 'verbal': return 'from-green-500 to-green-600';
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  // Setup Phase
  if (phase === 'setup') {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                  Aptitude Test
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Test your skills with AI-generated questions. Choose your category and difficulty to begin.
                </p>
                
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    Tests this month: {monthlyTestCount} / {getTestLimit()}
                  </Badge>
                  {!canTakeTest() && (
                    <Badge variant="destructive">
                      <Lock className="h-3 w-3 mr-1" />
                      Limit Reached
                    </Badge>
                  )}
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Select Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['quantitative', 'logical', 'verbal'] as Category[]).map((cat) => (
                    <Card 
                      key={cat}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        category === cat 
                          ? 'ring-2 ring-primary shadow-lg' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setCategory(cat)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(cat)} text-white mb-4`}>
                          {getCategoryIcon(cat)}
                        </div>
                        <h3 className="font-semibold capitalize text-lg">{cat}</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {cat === 'quantitative' && 'Numbers, calculations & data'}
                          {cat === 'logical' && 'Reasoning & problem solving'}
                          {cat === 'verbal' && 'Language & comprehension'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Select Difficulty</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                    <Card 
                      key={diff}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        difficulty === diff 
                          ? 'ring-2 ring-primary shadow-lg' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setDifficulty(diff)}
                    >
                      <CardContent className="p-6 text-center">
                        <Badge className={`${getDifficultyColor(diff)} mb-4`}>
                          {diff.toUpperCase()}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {diff === 'easy' && 'Basic questions for beginners'}
                          {diff === 'medium' && 'Moderate challenge level'}
                          {diff === 'hard' && 'Advanced difficulty'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Test Info */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Questions</p>
                      <p className="font-bold text-lg">20</p>
                    </div>
                    <div>
                      <Timer className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Per Question</p>
                      <p className="font-bold text-lg">60 sec</p>
                    </div>
                    <div>
                      <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Total Time</p>
                      <p className="font-bold text-lg">~20 min</p>
                    </div>
                    <div>
                      <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Passing</p>
                      <p className="font-bold text-lg">60%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Start Button */}
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="px-12 py-6 text-lg"
                  onClick={handleStartTest}
                  disabled={!category || !difficulty || !canTakeTest()}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Test
                </Button>
                
                {!canTakeTest() && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    <Button variant="link" onClick={() => navigate('/payments')}>
                      Upgrade your plan
                    </Button>
                    to take more tests this month.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Loading Phase
  if (phase === 'loading') {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-slate-50">
            <Card className="w-full max-w-md">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Generating Questions...</h2>
                <p className="text-muted-foreground">
                  Our AI is creating unique {difficulty} {category} questions for you.
                </p>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Test Phase
  if (phase === 'test' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const timerProgress = (timeRemaining / QUESTION_TIME_LIMIT) * 100;

    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </Badge>
                  <Badge className={getDifficultyColor(difficulty!)}>
                    {difficulty?.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 ${timeRemaining <= 10 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    <Clock className="h-5 w-5" />
                    <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <Progress value={progress} className="h-2" />
              </div>

              {/* Timer Progress */}
              <div className="mb-6">
                <Progress 
                  value={timerProgress} 
                  className={`h-1 ${timeRemaining <= 10 ? '[&>div]:bg-red-500' : ''}`}
                />
              </div>

              {/* Question Card */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl leading-relaxed">
                    {currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          answers[currentQuestionIndex] === key
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                        onClick={() => handleAnswerSelect(key)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            answers[currentQuestionIndex] === key
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            {key}
                          </div>
                          <span className="text-base">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full cursor-pointer ${
                        index === currentQuestionIndex
                          ? 'bg-primary'
                          : answers[index]
                            ? 'bg-green-500'
                            : 'bg-muted'
                      }`}
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setTimeRemaining(QUESTION_TIME_LIMIT);
                      }}
                    />
                  ))}
                </div>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={handleNextQuestion}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmitTest} className="bg-green-600 hover:bg-green-700">
                    Submit Test
                    <CheckCircle2 className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Results Phase
  if (phase === 'results' && result) {
    const passed = result.score >= 60;

    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
              {/* Result Header */}
              <div className="text-center mb-12">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                  passed ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {passed ? (
                    <Trophy className="h-10 w-10 text-green-600" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-600" />
                  )}
                </div>
                <h1 className={`text-4xl font-bold mb-4 ${
                  passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {passed ? 'Congratulations!' : 'Keep Practicing!'}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {passed 
                    ? 'You passed the test! Great job!' 
                    : 'You didn\'t pass this time, but don\'t give up!'}
                </p>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-3xl font-bold">{result.score}%</p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-3xl font-bold">{result.correctAnswers}/{result.totalQuestions}</p>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-3xl font-bold">{result.accuracy}%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-3xl font-bold">{formatTime(result.timeTaken)}</p>
                    <p className="text-sm text-muted-foreground">Time Taken</p>
                  </CardContent>
                </Card>
              </div>

              {/* Question Review */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Question Review</CardTitle>
                  <CardDescription>See how you performed on each question</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {questions.map((q, index) => {
                      const userAnswer = result.answers[index];
                      const isCorrect = userAnswer === q.correctAnswer;
                      
                      return (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg border ${
                            isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCorrect ? 'bg-green-500' : 'bg-red-500'
                            } text-white text-xs`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium mb-2">{q.question}</p>
                              <div className="text-sm space-y-1">
                                <p>
                                  <span className="text-muted-foreground">Your answer: </span>
                                  <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                    {userAnswer ? `${userAnswer}. ${q.options[userAnswer as keyof typeof q.options]}` : 'Not answered'}
                                  </span>
                                </p>
                                {!isCorrect && (
                                  <p>
                                    <span className="text-muted-foreground">Correct answer: </span>
                                    <span className="text-green-600 font-medium">
                                      {q.correctAnswer}. {q.options[q.correctAnswer]}
                                    </span>
                                  </p>
                                )}
                                <p className="text-muted-foreground italic mt-2">
                                  {q.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
                <Button onClick={() => {
                  setPhase('setup');
                  setCategory(null);
                  setDifficulty(null);
                  setQuestions([]);
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setResult(null);
                  setSessionId(null);
                  setTotalTimeTaken(0);
                }}>
                  Take Another Test
                </Button>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return null;
};

export default AptitudeTest;
