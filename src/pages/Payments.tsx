import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Zap, Shield, Crown, Clock, Users, ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, PLAN_DETAILS, SubscriptionPlan } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';

const Payments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription } = useSubscription();

  const plans = [
    {
      id: 'free' as SubscriptionPlan,
      name: "Free",
      price: "0",
      period: "month",
      currency: "₹",
      description: "Get started - upgrade required to practice",
      features: [
        "No interview credits",
        "Basic feedback and scoring",
        "General interview questions",
        "Email support",
        "Progress tracking",
      ],
      buttonText: "Get Started",
      popular: false,
      icon: Clock,
      highlight: "Free to explore"
    },
    {
      id: 'beginner' as SubscriptionPlan,
      name: "Beginner",
      price: "299",
      period: "month",
      currency: "₹",
      description: "Get started with 3 interviews per month",
      features: [
        "3 interviews per month (1 credit = 10 min)",
        "Basic feedback and scoring",
        "General interview questions",
        "Email support",
        "Progress tracking",
      ],
      buttonText: "Get Beginner",
      popular: false,
      icon: Clock,
      highlight: "3 interviews"
    },
    {
      id: 'plus' as SubscriptionPlan,
      name: "Plus",
      price: "399",
      period: "month",
      currency: "₹",
      description: "More practice time for serious job seekers",
      features: [
        "5 interviews per month",
        "Advanced AI feedback & analysis",
        "Industry-specific questions",
        "Video interview practice",
        "Performance analytics dashboard",
        "Priority email support",
      ],
      buttonText: "Upgrade to Plus",
      popular: false,
      icon: Star,
      highlight: "More practice time"
    },
    {
      id: 'pro' as SubscriptionPlan,
      name: "Pro",
      price: "599",
      period: "month",
      currency: "₹",
      description: "Maximum interviews + all premium features",
      features: [
        "10 interviews per month",
        "All Plus features included",
        "AI Career Coach",
        "Priority Support",
        "Advanced Analytics",
        "Resume Builder Access",
        "Mock panel interviews",
        "Custom question banks",
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
      icon: Crown,
      highlight: "Best value"
    }
  ];

  const handleSelectPlan = (planId: SubscriptionPlan) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // For now, show contact info - can integrate Stripe later
    window.location.href = 'mailto:support@vyoman.com?subject=Plan Upgrade Request - ' + planId.toUpperCase();
  };

  const isCurrentPlan = (planId: SubscriptionPlan) => {
    return subscription?.plan === planId;
  };

  const isPlanDowngrade = (planId: SubscriptionPlan) => {
    const planOrder = { beginner: 0, free: 1, plus: 2, pro: 3 };
    const currentPlanOrder = planOrder[subscription?.plan || 'beginner'];
    const targetPlanOrder = planOrder[planId];
    return targetPlanOrder < currentPlanOrder;
  };

  const content = (
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-50/50 to-background">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mb-6 border border-primary/20">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Trusted by 50,000+ job seekers</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock your interview potential with our AI-powered practice platform
          </p>

          {subscription && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm text-muted-foreground">Current Plan:</span>
              <Badge variant="default" className="capitalize">
                {subscription.plan}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ({subscription.credits_remaining} credits remaining)
              </span>
            </div>
          )}

          {/* Credit info */}
          <div className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">1 credit = 10 minutes of interview time</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2 border-2 border-white">
                    <Crown className="h-4 w-4 fill-current" />
                    <span>Best Value</span>
                  </div>
                </div>
              )}
              {isCurrentPlan(plan.id) && (
                <div className="absolute -top-4 right-4 z-10">
                  <Badge className="bg-accent text-accent-foreground">Current Plan</Badge>
                </div>
              )}
              
              <Card className={`h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary/30 shadow-xl ring-2 ring-primary/20 scale-105' 
                  : 'border-border hover:border-primary/20'
              }`}>
                <CardHeader className="text-center pb-8 pt-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg' 
                        : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600'
                    }`}>
                      <plan.icon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="text-sm text-primary font-medium mb-4">
                    {plan.highlight}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.currency}{plan.price}
                      </span>
                    </div>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6 px-6 pb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mt-0.5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    variant={plan.popular ? "default" : "outline"}
                    disabled={isCurrentPlan(plan.id)}
                    className={`w-full h-12 font-semibold ${
                      plan.popular 
                        ? 'shadow-xl hover:shadow-2xl bg-gradient-to-r from-primary to-accent text-white' 
                        : 'hover:bg-primary/10 hover:border-primary/30'
                    } ${isCurrentPlan(plan.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isCurrentPlan(plan.id) 
                      ? 'Current Plan' 
                      : isPlanDowngrade(plan.id) 
                        ? 'Contact to Downgrade'
                        : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Need Help Choosing?
              </h3>
              <p className="text-muted-foreground mb-4">
                Contact our team to discuss which plan is right for you or to request a custom enterprise solution.
              </p>
              <Button 
                variant="outline"
                onClick={() => window.location.href = 'mailto:support@vyoman.com?subject=Plan Inquiry'}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="space-y-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Money-back guarantee */}
          <div className="p-8 rounded-2xl border border-border text-center bg-card">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              30-Day Money-Back Guarantee
            </h3>
            <p className="text-muted-foreground">
              Not satisfied with your results? Get a full refund within 30 days, no questions asked.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Instant Access</h4>
              <p className="text-sm text-muted-foreground">Start practicing immediately after signup</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">No Setup Required</h4>
              <p className="text-sm text-muted-foreground">Works in any browser, no downloads needed</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Expert Support</h4>
              <p className="text-sm text-muted-foreground">Get help from our interview specialists</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // If user is logged in, wrap with Layout (sidebar), otherwise show standalone
  if (user) {
    return <Layout>{content}</Layout>;
  }

  return content;
};

export default Payments;
