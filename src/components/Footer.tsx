
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold">AI Interviewer</span>
            </div>
            <p className="text-gray-300 mb-4">
              AI-powered tools to help you ace interviews, apply faster, and land offers with confidence.
            </p>
            <p className="text-sm text-gray-400">
              © 2025 AI Interviewer | Made with 💡 using ElevenLabs + GPT
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/interview-copilot" className="hover:text-accent transition-colors">Interview Copilot</a></li>
              <li><a href="/mock-interview" className="hover:text-accent transition-colors">Mock Interview</a></li>
              <li><a href="/resume-builder" className="hover:text-accent transition-colors">AI Resume Builder</a></li>
              <li><a href="/pricing" className="hover:text-accent transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/about" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="/careers" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-accent transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
