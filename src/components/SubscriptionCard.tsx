import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Zap, Crown, Star } from 'lucide-react';
import { useSubscription, PLAN_DETAILS } from '@/hooks/useSubscription';
import { Skeleton } from './ui/skeleton';

const SubscriptionCard = () => {
  const { subscription, isLoading, planDetails } = useSubscription();

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-8 w-24" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return null;
  }

  const creditsUsed = subscription.credits_per_month - subscription.credits_remaining;
  const usagePercent = (creditsUsed / subscription.credits_per_month) * 100;

  const getPlanIcon = () => {
    switch (subscription.plan) {
      case 'pro':
        return <Crown className="h-5 w-5 text-amber-500" />;
      case 'plus':
        return <Star className="h-5 w-5 text-primary" />;
      case 'free':
        return <Zap className="h-5 w-5 text-green-500" />;
      default:
        return <Zap className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPlanBadgeVariant = () => {
    switch (subscription.plan) {
      case 'pro':
        return 'default';
      case 'plus':
        return 'secondary';
      case 'free':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const isBeginner = subscription.plan === 'beginner';

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getPlanIcon()}
            Your Plan
          </CardTitle>
          <Badge variant={getPlanBadgeVariant()} className="capitalize">
            {planDetails.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isBeginner ? (
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <p className="text-sm text-amber-600 font-medium mb-2">
              You're on the Beginner plan with no interview credits.
            </p>
            <p className="text-xs text-muted-foreground">
              Upgrade to Free or higher to start practicing interviews.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Interview Credits</span>
              <span className="font-medium">
                {subscription.credits_remaining} / {subscription.credits_per_month}
              </span>
            </div>
            <Progress value={100 - usagePercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {subscription.credits_remaining} credit{subscription.credits_remaining !== 1 ? 's' : ''} remaining this month
            </p>
          </div>
        )}

        {!isBeginner && subscription.credits_remaining === 0 && (
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive font-medium">
              No credits remaining. Upgrade your plan to continue practicing.
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>1 credit = 10 minutes of interview time</p>
          <p className="mt-1">Credits reset monthly</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
