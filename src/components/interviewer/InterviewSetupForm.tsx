import React from 'react';
import { 
  Briefcase, 
  Layers, 
  Clock, 
  Gauge,
  Building
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewSettings } from '@/pages/Interviewer';
import { cn } from '@/lib/utils';

interface InterviewSetupFormProps {
  settings: InterviewSettings;
  onSettingsChange: (settings: InterviewSettings) => void;
  onStartInterview: () => void;
  isLoading?: boolean;
}

const ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Product Manager',
  'DevOps Engineer',
  'Mobile Developer',
  'QA Engineer',
  'UI/UX Designer',
  'Data Analyst',
  'Machine Learning Engineer',
  'Cloud Architect',
  'Security Engineer',
  'Other'
];

const INTERVIEW_TYPES: Array<{
  value: InterviewSettings['type'];
  label: string;
  description: string;
}> = [
  { value: 'Behavioral', label: 'Behavioral', description: 'STAR method questions' },
  { value: 'Technical', label: 'Technical', description: 'Coding & system design' },
  { value: 'System Design', label: 'System Design', description: 'Architecture focused' },
  { value: 'Mixed', label: 'Mixed', description: 'Combination of all types' },
];

const DIFFICULTY_LEVELS: Array<{ value: InterviewSettings['difficulty']; label: string }> = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

const InterviewSetupForm: React.FC<InterviewSetupFormProps> = ({
  settings,
  onSettingsChange,
  onStartInterview,
  isLoading = false
}) => {
  const [mockTitle, setMockTitle] = React.useState('');
  const [company, setCompany] = React.useState('');

  const handleTypeChange = (type: InterviewSettings['type']) => {
    onSettingsChange({ ...settings, type });
  };

  const handleDifficultyChange = (difficulty: InterviewSettings['difficulty']) => {
    onSettingsChange({ ...settings, difficulty });
  };

  const handleRoleChange = (role: string) => {
    onSettingsChange({ ...settings, role });
  };

  const handleDurationChange = (value: number[]) => {
    onSettingsChange({ ...settings, duration: value[0] });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          New Mock Interview
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure your mock interview settings and get started
        </p>
      </div>

      {/* Basic Information */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mock-title" className="text-sm text-muted-foreground">
                Mock Title (optional)
              </Label>
              <Input
                id="mock-title"
                placeholder="e.g., Google SWE Practice #1"
                value={mockTitle}
                onChange={(e) => setMockTitle(e.target.value)}
                className="bg-background border-input"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm text-muted-foreground">
                  Role Applying For <span className="text-destructive">*</span>
                </Label>
                <Select value={settings.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm text-muted-foreground">
                  Company (optional)
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="e.g., Google, Amazon..."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="pl-9 bg-background border-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview Type */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Interview Type</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {INTERVIEW_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => handleTypeChange(type.value)}
                className={cn(
                  "p-4 rounded-lg border-2 text-left transition-all",
                  "hover:border-primary/50",
                  settings.type === type.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    settings.type === type.value
                      ? "border-primary"
                      : "border-muted-foreground"
                  )}>
                    {settings.type === type.value && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">{type.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty & Duration */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Gauge className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Difficulty & Duration</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">Difficulty Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleDifficultyChange(level.value)}
                    className={cn(
                      "py-3 px-4 rounded-lg border-2 font-medium transition-all",
                      "hover:border-primary/50",
                      settings.difficulty === level.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-secondary/30 text-foreground"
                    )}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Duration
                </Label>
                <span className="text-sm font-medium text-primary">
                  {settings.duration} minutes
                </span>
              </div>
              <Slider
                value={[settings.duration]}
                onValueChange={handleDurationChange}
                min={10}
                max={60}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10 min</span>
                <span>60 min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Button
        onClick={onStartInterview}
        disabled={isLoading || !settings.role}
        className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Starting Interview...
          </>
        ) : (
          'Start Interview'
        )}
      </Button>
    </div>
  );
};

export default InterviewSetupForm;
