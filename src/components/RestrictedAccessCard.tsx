import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface RestrictedAccessCardProps {
  feature: string;
}

const RestrictedAccessCard: React.FC<RestrictedAccessCardProps> = ({ feature }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="h-10 w-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">
          Restricted Access
        </h2>
        
        <p className="text-slate-300 mb-6">
          {feature} is available for Plus and Pro plan subscribers. 
          Upgrade your plan to unlock this premium feature and enhance your interview preparation.
        </p>

        <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700/30">
          <div className="flex items-center justify-center gap-2 text-amber-400 mb-2">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">Upgrade Benefits</span>
          </div>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Access to Virtual Interviewer</li>
            <li>• Unlimited practice sessions</li>
            <li>• AI-powered feedback</li>
            <li>• Priority support</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate('/payments')}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
            size="lg"
          >
            <Crown className="h-5 w-5 mr-2" />
            Upgrade Plan
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50"
          >
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default RestrictedAccessCard;
