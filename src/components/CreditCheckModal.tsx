import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Zap, Crown } from 'lucide-react';
import { useSubscription, PLAN_DETAILS } from '@/hooks/useSubscription';

interface CreditCheckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreditCheckModal: React.FC<CreditCheckModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { subscription, planDetails } = useSubscription();

  const handleViewPlans = () => {
    onOpenChange(false);
    navigate('/payments');
  };

  const handleGoToDashboard = () => {
    onOpenChange(false);
    navigate('/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">No Interview Credits</DialogTitle>
          <DialogDescription className="text-center">
            You've used all your interview credits for this month.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Plan</span>
              <span className="font-medium capitalize">{planDetails.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Credits Used</span>
              <span className="font-medium">
                {subscription?.credits_per_month ?? 0} / {subscription?.credits_per_month ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next Reset</span>
              <span className="font-medium">Beginning of next month</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Need more interviews?</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Upgrade to Plus (5/month) or Pro (10/month) for more practice time and premium features.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleViewPlans} className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            View Upgrade Options
          </Button>
          <Button variant="outline" onClick={handleGoToDashboard} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditCheckModal;
