
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent} from './ui/card';
import TimelineSteps from './TimelineSteps';

const Hero = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAuth = () => {
    if (email) {
      setIsAuthenticated(true);
      setShowForm(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-background via-background to-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center">
          <motion.h1 
            className="text-4xl lg:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Land Your Next Job in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-glow">
              30 Days*
            </span>
            <br />
            or Less with AI Interviewer.
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI-powered tools to help you ace interviews, apply faster, and land offers with confidence.
          </motion.p>
          
          {!isAuthenticated ? (
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {!showForm ? (
                <>
                  <Button 
                    size="lg"
                    onClick={() => setShowForm(true)}
                    className="shadow-glow hover:shadow-xl"
                  >
                    Get Started for Free
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => setShowForm(true)}
                    className="flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Start free with Google</span>
                  </Button>
                </>
              ) : (
                <Card className="w-full max-w-md mx-auto glass-card">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleAuth} className="flex-1">
                          Sign Up
                        </Button>
                        <Button variant="outline" onClick={() => setShowForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card max-w-2xl mx-auto">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to AI Interviewer!</h2>
                  <div className="space-y-3 text-lg text-muted-foreground">
                    <p className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      <span>Your AI-powered interview preparation starts now</span>
                    </p>
                    <p className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Get personalized feedback and practice sessions</span>
                    </p>
                    <p className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-primary-light rounded-full"></span>
                      <span>Track your progress and land your dream job</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
        
        <TimelineSteps />
      </div>
    </div>
  );
};

export default Hero;
