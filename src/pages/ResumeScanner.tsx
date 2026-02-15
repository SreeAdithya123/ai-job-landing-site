import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { Scan, Loader2, AlertTriangle, CheckCircle, Info, ArrowUp, Sparkles, Target, FileText, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { scanResume, type ScanResult } from '@/services/resumeScannerService';

const ScoreGauge = ({ score }: { score: number }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 75 ? 'hsl(var(--chart-2))' : score >= 50 ? 'hsl(45, 93%, 47%)' : 'hsl(var(--destructive))';

  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle cx="80" cy="80" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">ATS Score</span>
      </div>
    </div>
  );
};

const SECTION_LABELS: Record<string, string> = {
  contactInfo: 'Contact Info',
  summary: 'Summary',
  experience: 'Experience',
  skills: 'Skills',
  education: 'Education',
  keywords: 'Keywords',
  formatting: 'Formatting',
};

const ResumeScanner = () => {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleFilePicked = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) setResumeText(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFilePicked(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFilePicked(e.target.files[0]);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setResumeText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleScan = async () => {
    if (resumeText.trim().length < 50) {
      toast({ title: 'Too Short', description: 'Please paste at least 50 characters of resume content.', variant: 'destructive' });
      return;
    }
    setIsScanning(true);
    setResult(null);
    try {
      const data = await scanResume(resumeText, targetRole || undefined);
      setResult(data);
      toast({ title: 'Scan Complete!', description: `Your ATS score is ${data.overallScore}/100` });
    } catch (err: any) {
      toast({ title: 'Scan Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsScanning(false);
    }
  };

  const priorityIcon = (p: string) => {
    if (p === 'high') return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (p === 'medium') return <Info className="h-4 w-4 text-yellow-500" />;
    return <ArrowUp className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Scan className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Resume Scanner</h1>
            <p className="text-muted-foreground">Paste your resume content below to get an instant ATS compatibility score and improvement suggestions.</p>
          </motion.div>

          {/* Input Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 bg-card border-border space-y-4">
              {/* File Upload Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
                  dragActive ? 'border-primary bg-primary/5' : selectedFile ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-foreground text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); clearFile(); }} className="p-1 rounded-full hover:bg-muted">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Drop your resume here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports .txt, .pdf, .doc, .docx</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileInput} />

              <div className="relative flex items-center gap-3">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted-foreground">or paste text below</span>
                <div className="flex-1 border-t border-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      <Target className="h-3.5 w-3.5 inline mr-1" />Target Role (optional)
                    </label>
                    <Input
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="bg-muted border-border text-foreground"
                    />
                  </div>
                  <Button onClick={handleScan} disabled={isScanning || resumeText.trim().length < 50} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    {isScanning ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Scanning...</> : <><Scan className="h-4 w-4 mr-2" />Scan Resume</>}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Score + Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-card border-border flex flex-col items-center justify-center">
                  <ScoreGauge score={result.overallScore} />
                </Card>
                <Card className="md:col-span-2 p-6 bg-card border-border space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Summary</h3>
                  <p className="text-muted-foreground text-sm">{result.summary_text}</p>
                  {result.strengths?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.strengths.map((s, i) => (
                          <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            <CheckCircle className="h-3 w-3 mr-1" />{s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Section Breakdown */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Section Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(result.sections).map(([key, section]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-foreground">{SECTION_LABELS[key] || key}</span>
                        <span className="text-muted-foreground">{section.score}/100</span>
                      </div>
                      <Progress value={section.score} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{section.feedback}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Improvement Suggestions</h3>
                  <div className="space-y-3">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        {priorityIcon(s.priority)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs border-border">{s.category}</Badge>
                            <Badge variant={s.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">{s.priority}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{s.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Missing Keywords */}
              {result.missingKeywords?.length > 0 && (
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <Badge key={i} variant="outline" className="border-destructive/30 text-destructive">{kw}</Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Generate New Resume CTA */}
              <Card className="p-8 bg-card border-border text-center space-y-4">
                <FileText className="h-10 w-10 text-primary mx-auto" />
                <h3 className="text-xl font-semibold text-foreground">Ready to improve your resume?</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">Use our AI Resume Builder to create a new ATS-optimized resume incorporating these suggestions.</p>
                <Button onClick={() => navigate('/resume-builder')} size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <FileText className="h-4 w-4 mr-2" />Generate New Resume
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ResumeScanner;
