
import React from 'react';
import Hero from '../components/Hero';
import WhyAIInterviewer from '../components/WhyAIInterviewer';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <WhyAIInterviewer />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
