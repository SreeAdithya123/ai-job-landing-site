
import React from 'react';
import Layout from '../components/Layout';
import ProgressTracking from '../components/ProgressTracking';

const Dashboard = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
              Welcome to Your AI Interview Dashboard
            </h1>
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
