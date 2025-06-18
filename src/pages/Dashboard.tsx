
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProgressTracking from '../components/ProgressTracking';
import { Download, TrendingUp, Users, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import jsPDF from 'jspdf';

const Dashboard = () => {
  const [interviewCounts, setInterviewCounts] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    completed: 0,
    pending: 0
  });

  // Simulate loading interview counts
  useEffect(() => {
    const loadInterviewCounts = () => {
      setInterviewCounts({
        total: 47,
        thisWeek: 8,
        thisMonth: 23,
        completed: 42,
        pending: 5
      });
    };

    loadInterviewCounts();
  }, []);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('AI Interviewer Dashboard - Progress Report', 20, 30);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Add interview counts section
    doc.setFontSize(16);
    doc.text('Interview Statistics', 20, 65);
    
    doc.setFontSize(12);
    const stats = [
      `Total Interviews: ${interviewCounts.total}`,
      `This Week: ${interviewCounts.thisWeek}`,
      `This Month: ${interviewCounts.thisMonth}`,
      `Completed: ${interviewCounts.completed}`,
      `Pending: ${interviewCounts.pending}`
    ];
    
    stats.forEach((stat, index) => {
      doc.text(`• ${stat}`, 25, 80 + (index * 8));
    });
    
    // Add skill progress section
    doc.setFontSize(16);
    doc.text('Skill Progress', 20, 130);
    
    doc.setFontSize(12);
    const skills = [
      'Communication: 85%',
      'Technical Skills: 78%',
      'Problem Solving: 92%',
      'Confidence: 88%'
    ];
    
    skills.forEach((skill, index) => {
      doc.text(`• ${skill}`, 25, 145 + (index * 8));
    });
    
    // Save the PDF
    doc.save('ai-interviewer-progress-report.pdf');
  };

  const interviewStats = [
    {
      title: "Total Interviews",
      value: interviewCounts.total,
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "This Week",
      value: interviewCounts.thisWeek,
      icon: Clock,
      color: "from-green-500 to-green-600"
    },
    {
      title: "This Month",
      value: interviewCounts.thisMonth,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Completed",
      value: interviewCounts.completed,
      icon: Target,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                Welcome to Your AI Interviewer Dashboard
              </h1>
              <button
                onClick={generatePDFReport}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
              >
                <Download className="h-5 w-5" />
                <span>Download Report</span>
              </button>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your personalized space to practice interviews, track progress, and land your dream job.
            </p>
          </div>

          {/* Interview Counts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {interviewStats.map((stat, index) => (
              <Card key={stat.title} className="glass-card hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.title === "Total Interviews" && "All time"}
                    {stat.title === "This Week" && "Last 7 days"}
                    {stat.title === "This Month" && "Last 30 days"}
                    {stat.title === "Completed" && "Successfully finished"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Tracking Dashboard */}
          <ProgressTracking />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
