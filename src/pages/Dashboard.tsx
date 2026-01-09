import React from 'react';
import Layout from '../components/Layout';
import ProgressTracking from '../components/ProgressTracking';
import RecentInterviewAnalyses from '../components/RecentInterviewAnalyses';
import InterviewResultsNotification from '../components/InterviewResultsNotification';
import InterviewHistoryTable from '../components/InterviewHistoryTable';
import ProtectedRoute from '../components/ProtectedRoute';
import AnalysisFeedbackButton from '../components/AnalysisFeedbackButton';
import ElevenLabsAnalyticsDashboard from '../components/dashboard/ElevenLabsAnalyticsDashboard';
import SubscriptionCard from '../components/SubscriptionCard';
import { Download, Play, Menu, BarChart3, History, Video, MessageSquare, Settings, Shield } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
          {/* Interview Results Notification */}
          <InterviewResultsNotification />
          
          {/* Enhanced Dashboard Header */}
          <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button className="lg:hidden p-2 rounded-md hover:bg-gray-100">
                    <Menu className="h-6 w-6" />
                  </button>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                        Dashboard Overview
                      </h1>
                      <p className="text-slate-600 text-lg">Track your progress and manage interviews</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <nav className="hidden md:flex items-center space-x-6">
                    <button
                      onClick={() => navigate('/virtual-interviewer')}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Virtual Interviewer
                    </button>
                    <button
                      onClick={() => navigate('/interview-copilot')}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      AI Interviewer
                    </button>
                    <button
                      onClick={() => navigate('/interview-history')}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
                    >
                      <History className="h-4 w-4" />
                      <span>History</span>
                    </button>
                    <button
                      onClick={() => navigate('/resume-builder')}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Resume Builder
                    </button>
                    <button
                      onClick={() => navigate('/material-generator')}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Materials
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => navigate('/admin')}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center space-x-1"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Admin</span>
                      </button>
                    )}
                  </nav>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-slate-300/50 rounded-xl hover:bg-white/80 transition-all duration-200 shadow-sm">
                    <Settings className="h-5 w-5 text-slate-600" />
                    <span className="text-slate-700 font-medium">Settings</span>
                  </button>
                  <button 
                    onClick={handleSignOut} 
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                  {isNewUser ? 'Welcome to Your AI Interviewer Dashboard' : 'Your AI Interviewer Dashboard'}
                </h1>
                <div className="flex space-x-2">
                  <button
                    onClick={generatePDFReport}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Report</span>
                  </button>
                  <AnalysisFeedbackButton className="inline-flex" />
                  {!isNewUser && (
                    <button
                      onClick={() => navigate('/interview-history')}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                    >
                      <History className="h-5 w-5" />
                      <span>View History</span>
                    </button>
                  )}
                  {isNewUser && (
                    <button
                      onClick={() => navigate('/interview-copilot')}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                    >
                      <Play className="h-5 w-5" />
                      <span>Start First Interview</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                {isNewUser 
                  ? 'Get started with your first AI interview to begin tracking your progress and improving your skills.'
                  : `Your personalized space to practice interviews, track progress, and land your dream job. You've completed ${totalSessions} interview${totalSessions !== 1 ? 's' : ''} so far!`
                }
              </p>
            </div>

            {/* Subscription and Progress Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-1">
                <SubscriptionCard />
              </div>
              <div className="md:col-span-2">
                <ProgressTracking />
              </div>
            </div>

            {/* Interview Options Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* AI Interviewer Section */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-glow">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">AI Interviewer</h3>
                    <p className="text-gray-600">Practice with our advanced AI interviewer</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Get personalized interview practice with real-time feedback, custom questions, and detailed performance analysis.
                </p>
                <Button
                  onClick={() => navigate('/interview-copilot')}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg"
                  size="lg"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Start AI Interview
                </Button>
              </div>

              {/* Virtual Interviewer Section */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-glow">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Virtual Interviewer</h3>
                    <p className="text-gray-600">Experience immersive video interviews</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Practice with our virtual interviewer featuring video calls, body language analysis, and realistic interview scenarios.
                </p>
                <Button
                  onClick={() => navigate('/virtual-interviewer')}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg"
                  size="lg"
                >
                  <Video className="h-5 w-5 mr-2" />
                  Start Virtual Interview
                </Button>
              </div>
            </div>

            {/* Interview History Button */}
            <div className="mb-8 text-center">
              <Button
                onClick={() => navigate('/interview-history')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
              >
                <History className="h-5 w-5" />
                <span>View Interview History</span>
              </Button>
            </div>

            {/* Interview History Table */}
            <div className="mb-12">
              <InterviewHistoryTable />
            </div>

            {/* Analytics Visualizations */}
            <div className="mb-12">
              <ElevenLabsAnalyticsDashboard />
            </div>

            {/* Recent Interview Analyses */}
            <div data-interview-analyses>
              <RecentInterviewAnalyses />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
