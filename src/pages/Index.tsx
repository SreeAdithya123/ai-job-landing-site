
import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <Footer />
      </div>
    </Layout>
  );
};

export default Index;
