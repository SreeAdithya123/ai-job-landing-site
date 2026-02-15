import React from 'react';
import Layout from '../components/Layout';
import ProgressTracking from '../components/ProgressTracking';
import RecentInterviewAnalyses from '../components/RecentInterviewAnalyses';
import InterviewResultsNotification from '../components/InterviewResultsNotification';
import InterviewHistoryTable from '../components/InterviewHistoryTable';
import ProtectedRoute from '../components/ProtectedRoute';
import AnalysisFeedbackButton from '../components/AnalysisFeedbackButton';
import ElevenLabsAnalyticsDashboard from '../components/dashboard/ElevenLabsAnalyticsDashboard';
import AptitudePerformanceCard from '../components/dashboard/AptitudePerformanceCard';
import SubscriptionCard from '../components/SubscriptionCard';
import { Download, Play, BarChart3, History, Video, MessageSquare, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStats } from '@/hooks/useUserStats';
import { useElevenLabsAnalytics } from '@/hooks/useElevenLabsAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isAdmin } = useAdminRole();
  const { totalSessions, totalHours, completedInterviews, averageScore, analyses, interviewSessions } = useUserStats();
  const { data: analyticsData, isLoading: analyticsLoading } = useElevenLabsAnalytics();
  const isNewUser = totalSessions === 0;

  const generatePDFReport = () => {
    if (isNewUser) {
      toast.error('Complete your first interview to generate a report');
      return;
    }

    toast.info('Generating comprehensive report...');
    
    const doc = new jsPDF();
    let yPos = 20;
    
    // Header
    doc.setFillColor(139, 92, 246);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Interviewer', 20, 20);
    doc.setFontSize(16);
    doc.text('Comprehensive Performance Analysis Report', 20, 32);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPos = 55;
    
    // Report metadata
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPos);
    doc.text(`Total Sessions Analyzed: ${totalSessions}`, 20, yPos + 5);
    yPos += 18;
    
    // Executive Summary
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('Executive Summary', 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Interview Sessions', totalSessions.toString()],
      ['Hours Practiced', `${totalHours} hrs`],
      ['Completed Interviews', completedInterviews.toString()],
      ['Average Overall Score', `${averageScore}%`],
      ['Total Analyses', analyses.length.toString()]
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246], fontSize: 11, fontStyle: 'bold' },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
    
    // Skills Performance Breakdown
    if (analyticsData && analyticsData.skillsPerformance.length > 0) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(139, 92, 246);
      doc.text('Skills Performance Analysis', 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      
      const skillsData = [
        ['Skill', 'Average Score', 'Latest Score', 'Trend'],
        ...analyticsData.skillsPerformance.map(skill => [
          skill.skill,
          `${Math.round(skill.average)}%`,
          `${Math.round(skill.latest)}%`,
          skill.latest >= skill.average ? '↑ Improving' : '↓ Needs Focus'
        ])
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [skillsData[0]],
        body: skillsData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246], fontSize: 11 },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Score Progression
    if (analyticsData && analyticsData.scoreProgression.length > 0) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(139, 92, 246);
      doc.text('Score Progression History', 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      
      const progressionData = [
        ['Date', 'Interview Type', 'Score'],
        ...analyticsData.scoreProgression.slice(-10).map(entry => [
          new Date(entry.date).toLocaleDateString(),
          entry.interview,
          `${entry.score}%`
        ])
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [progressionData[0]],
        body: progressionData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246], fontSize: 11 },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Strengths Analysis
    if (analyticsData && analyticsData.strengthsWeaknesses.strengths.length > 0) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 197, 94);
      doc.text('Top Strengths', 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      
      const strengthsData = [
        ['Strength', 'Frequency'],
        ...analyticsData.strengthsWeaknesses.strengths.slice(0, 5).map(s => [
          s.text,
          s.count.toString()
        ])
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [strengthsData[0]],
        body: strengthsData.slice(1),
        theme: 'plain',
        headStyles: { fillColor: [34, 197, 94], fontSize: 11, textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Areas for Improvement
    if (analyticsData && analyticsData.strengthsWeaknesses.weaknesses.length > 0) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68);
      doc.text('Areas for Improvement', 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      
      const weaknessesData = [
        ['Area', 'Frequency'],
        ...analyticsData.strengthsWeaknesses.weaknesses.slice(0, 5).map(w => [
          w.text,
          w.count.toString()
        ])
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [weaknessesData[0]],
        body: weaknessesData.slice(1),
        theme: 'plain',
        headStyles: { fillColor: [239, 68, 68], fontSize: 11, textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Interview Type Distribution
    if (analyticsData && analyticsData.interviewCategories.length > 0) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(139, 92, 246);
      doc.text('Interview Type Distribution', 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
      
      const categoryData = [
        ['Interview Type', 'Count', 'Percentage'],
        ...analyticsData.interviewCategories.map(cat => [
          cat.category,
          cat.value.toString(),
          `${Math.round((cat.value / totalSessions) * 100)}%`
        ])
      ];
      
      autoTable(doc, {
        startY: yPos,
        head: [categoryData[0]],
        body: categoryData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246], fontSize: 11 },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Recommendations
    doc.addPage();
    yPos = 20;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('Personalized Recommendations', 20, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const recommendations = [];
    if (averageScore < 70) {
      recommendations.push('• Focus on consistent practice - aim for 3-4 sessions per week');
      recommendations.push('• Review feedback from previous interviews carefully');
    } else if (averageScore < 85) {
      recommendations.push('• You\'re doing well! Focus on refining specific weak areas');
      recommendations.push('• Try more challenging interview types');
    } else {
      recommendations.push('• Excellent performance! Maintain your practice routine');
      recommendations.push('• Consider mentoring others or exploring advanced topics');
    }
    
    if (analyticsData?.skillsPerformance) {
      const lowestSkill = analyticsData.skillsPerformance.reduce((min, skill) => 
        skill.latest < min.latest ? skill : min
      );
      recommendations.push(`• Priority: Improve your ${lowestSkill.skill} skills (currently ${Math.round(lowestSkill.latest)}%)`);
    }
    
    recommendations.forEach(rec => {
      doc.text(rec, 20, yPos);
      yPos += 8;
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${pageCount} | AI Interviewer Dashboard | Confidential`,
        105,
        285,
        { align: 'center' }
      );
    }
    
    doc.save(`ai-interviewer-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Report downloaded successfully!');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-background">
          {/* Interview Results Notification */}
          <InterviewResultsNotification />
          
          {/* Compact Sticky Header */}
          <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Title Section */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-headline text-foreground">
                      Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground hidden sm:block">
                      Track your progress and manage interviews
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={generatePDFReport}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    <Download className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Download</span> Report
                  </Button>
                  <AnalysisFeedbackButton className="text-xs sm:text-sm" />
                  {isAdmin && (
                    <Button
                      onClick={() => navigate('/admin')}
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                    >
                      <Shield className="h-4 w-4 mr-1.5" />
                      Admin
                    </Button>
                  )}
                  <Button 
                    onClick={handleSignOut} 
                    variant="destructive"
                    size="sm"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            
            {/* Welcome Message */}
            <div className="clay-card p-4 sm:p-6 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold font-headline text-foreground">
                    {isNewUser ? 'Welcome to Vyoman! 🎉' : 'Great Progress! 📈'}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    {isNewUser 
                      ? 'Complete your first interview to start tracking your progress.'
                      : `You've completed ${totalSessions} interview${totalSessions !== 1 ? 's' : ''}. Keep practicing!`
                    }
                  </p>
                </div>
                {isNewUser ? (
                  <Button
                    onClick={() => navigate('/interview-copilot')}
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground shrink-0"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start First Interview
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate('/interview-history')}
                    variant="outline"
                    className="shrink-0"
                  >
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Actions - Interview Options */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* AI Interviewer */}
              <div className="clay-card p-4 sm:p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-md shrink-0">
                    <MessageSquare className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold font-headline text-foreground">AI Interviewer</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      Practice with personalized questions and real-time feedback.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/interview-copilot')}
                  className="w-full mt-4 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start AI Interview
                </Button>
              </div>
            </div>

            {/* Your Plan */}
            <SubscriptionCard />

            {/* Skill Progress & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ProgressTracking />
              <div data-interview-analyses>
                <RecentInterviewAnalyses />
              </div>
            </div>

            {/* Aptitude Test Performance */}
            <AptitudePerformanceCard />

            {/* Analytics Dashboard */}
            <ElevenLabsAnalyticsDashboard />

            {/* Interview History Table */}
            <InterviewHistoryTable />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
