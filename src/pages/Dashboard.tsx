
import React from 'react';
import Layout from '../components/Layout';
import ProgressTracking from '../components/ProgressTracking';
import RecentInterviewAnalyses from '../components/RecentInterviewAnalyses';
import InterviewResultsNotification from '../components/InterviewResultsNotification';
import InterviewHistoryTable from '../components/InterviewHistoryTable';
import ProtectedRoute from '../components/ProtectedRoute';
import { Download, Play, Menu, BarChart3, History, Video, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStats } from '@/hooks/useUserStats';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { totalSessions, totalHours, completedInterviews, averageScore } = useUserStats();
  const isNewUser = totalSessions === 0;

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('AI Interviewer Dashboard - Progress Report', 20, 30);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Add stats section
    doc.setFontSize(16);
    doc.text('Performance Statistics', 20, 65);
    
    doc.setFontSize(12);
    const stats = [
      `Total Sessions: ${totalSessions}`,
      `Hours Practiced: ${totalHours}`, 
      `Completed Interviews: ${completedInterviews}`,
      `Success Rate: ${averageScore}%`
    ];
    
    stats.forEach((stat, index) => {
      doc.text(`• ${stat}`, 25, 80 + (index * 8));
    });
    
    // Add a note for new users
    if (isNewUser) {
      doc.setFontSize(14);
      doc.text('Welcome to AI Interviewer!', 20, 120);
      doc.setFontSize(12);
      doc.text('Complete your first interview to start building your progress report.', 20, 135);
    }
    
    // Save the PDF
    doc.save('ai-interviewer-progress-report.pdf');
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
          {/* Interview Results Notification */}
          <InterviewResultsNotification />
          
          {/* Dashboard Navigation Bar */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="lg:hidden p-2 rounded-md hover:bg-gray-100">
                  <Menu className="h-6 w-6" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">Dashboard Overview</h2>
              </div>
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
              </nav>
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

            {/* Progress Tracking Dashboard */}
            <div className="mb-12">
              <ProgressTracking />
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
