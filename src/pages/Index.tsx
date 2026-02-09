import React from 'react';
import Hero from '../components/Hero';
import AIInterviewerSection from '../components/AIInterviewerSection';
import AboutSection from '../components/AboutSection';
import CommunitySection from '../components/CommunitySection';
import CareersSection from '../components/CareersSection';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Hero />
      <AIInterviewerSection />
      <AboutSection />
      <Features />
      <CommunitySection />
      <CareersSection />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
