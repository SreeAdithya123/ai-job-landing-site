
import React from 'react';
import Layout from '../components/Layout';
import ProgressTracking from '../components/ProgressTracking';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

const Dashboard = () => {
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
      'Total Sessions: 24 (+12%)',
      'Hours Practiced: 18.5 (+8%)', 
      'Completed Interviews: 15 (+15%)',
      'Success Rate: 85% (+5%)'
    ];
    
    stats.forEach((stat, index) => {
      doc.text(`• ${stat}`, 25, 80 + (index * 8));
    });
    
    // Add skill progress section
    doc.setFontSize(16);
    doc.text('Skill Progress', 20, 120);
    
    doc.setFontSize(12);
    const skills = [
      'Communication: 85%',
      'Technical Skills: 78%',
      'Problem Solving: 92%',
      'Confidence: 88%'
    ];
    
    skills.forEach((skill, index) => {
      doc.text(`• ${skill}`, 25, 135 + (index * 8));
    });
    
    // Add recent activities section
    doc.setFontSize(16);
    doc.text('Recent Activities', 20, 175);
    
    doc.setFontSize(12);
    const activities = [
      'Mock Interview - 2 hours ago - 92%',
      'Coding Interview - 1 day ago - 88%',
      'General Interview - 2 days ago - 90%',
      'UPSC Interview - 3 days ago - 85%'
    ];
    
    activities.forEach((activity, index) => {
      doc.text(`• ${activity}`, 25, 190 + (index * 8));
    });
    
    // Save the PDF
    doc.save('ai-interviewer-progress-report.pdf');
  };

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

          {/* Progress Tracking Dashboard */}
          <ProgressTracking />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
