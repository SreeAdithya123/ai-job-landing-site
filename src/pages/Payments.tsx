import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Zap, Shield, Crown, Clock, Users, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, PLAN_DETAILS, SubscriptionPlan } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, refetch } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free' as SubscriptionPlan,
      name: "Free",
      price: "0",
      period: "month",
      currency: "₹",
      description: "Demo plan for marketing & conversions",
      features: [
        "1 mock interview (10 min)",
        "AI questions & live transcript",
        "Basic evaluation",
        "Resume Builder (1 basic template)",
        "Resume Scanner (1 scan/month)",
        "CareerBot (10 messages/day)",
        "Material Generator (3/month)",
      ],
      buttonText: "Start Free",
      popular: false,
      icon: Clock,
      highlight: "Free Demo"
    },
    {
      id: 'beginner' as SubscriptionPlan,
      name: "Basic",
      price: "199",
      period: "month",
      currency: "₹",
      description: "Best for students starting their journey",
      features: [
        "3 mocks/month (10 min each)",
        "AI questions, transcript & evaluation",
        "PDF export (1-page summary)",
        "Resume Builder (full + PDF export)",
        "Resume Scanner (5 scans + suggestions)",
        "CareerBot (200 messages/month)",
        "YourDream Bot (50 messages/month)",
        "Material Generator (10/month)",
      ],
      buttonText: "Get Basic",
      popular: false,
      icon: Clock,
      highlight: "Best for Students"
    },
    {
      id: 'plus' as SubscriptionPlan,
      name: "Plus",
      price: "399",
      period: "month",
      currency: "₹",
      description: "For serious job seekers",
      features: [
        "6 mocks/month (10-15 min)",
        "Follow-up questions & detailed evaluation",
        "Full PDF report + session compare (2)",
        "Resume Builder (premium templates)",
        "Resume Scanner (15 scans + optimization)",
        "CareerBot (600 messages/month)",
        "YourDream Bot (300 messages/month)",
        "Cold email/DM drafting",
        "Material Generator (30/month)",
        "Role-based Q bank + answers",
      ],
      buttonText: "Upgrade to Plus",
      popular: false,
      icon: Star,
      highlight: "Serious Job Seekers"
    },
    {
      id: 'pro' as SubscriptionPlan,
      name: "Pro",
      price: "599",
      period: "month",
      currency: "₹",
      description: "For high intent users who want it all",
      features: [
        "15 mocks/month (up to 30 min)",
        "Best AI model (Groq) + strong evaluation",
        "Multi-page PDF + session compare (4)",
        "All premium resume templates",
        "Unlimited resume scans (fair-use)",
        "AI rewrite per job description",
        "ATS keyword matching",
        "Unlimited CareerBot (fair-use)",
        "Unlimited YourDream Bot (fair-use)",
        "Offer negotiation assistant",
        "Unlimited materials + weekly roadmap",
        "Priority support",
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
      icon: Crown,
      highlight: "Best Value"
    }
  ];

  const handleSelectPlan = async (planId: SubscriptionPlan) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Free plan - no payment needed
    if (planId === 'free') {
      toast.info('You are already on the free plan or can explore without payment.');
      return;
    }

    setIsProcessing(true);
    setProcessingPlan(planId);

    try {
      // Create order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('razorpay-create-order', {
        body: { plan: planId }
      });

      if (orderError || !orderData) {
        console.error('Order creation error:', orderError);
        toast.error('Failed to create payment order. Please try again.');
        return;
      }

      console.log('Order created:', orderData);

      // Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AI Interviewer',
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan - ${orderData.credits} Credits`,
        order_id: orderData.orderId,
        prefill: {
          email: orderData.userEmail || '',
          name: orderData.userName || '',
        },
        theme: {
          color: '#6366f1',
        },
        handler: async function (response: any) {
          console.log('Payment successful:', response);
          
          // Verify payment
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('razorpay-verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planId,
              }
            });

            if (verifyError || !verifyData?.success) {
              console.error('Payment verification error:', verifyError);
              toast.error('Payment verification failed. Please contact support.');
              return;
            }

            toast.success(`Successfully upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan!`);
            
            // Refetch subscription data
            if (refetch) {
              refetch();
            }
            
            // Navigate to dashboard
            navigate('/dashboard');
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setIsProcessing(false);
            setProcessingPlan(null);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
        setProcessingPlan(null);
      });
      
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingPlan(null);
    }
  };

  const isCurrentPlan = (planId: SubscriptionPlan) => {
    return subscription?.plan === planId;
  };

  const isPlanDowngrade = (planId: SubscriptionPlan) => {
    const planOrder = { free: 0, beginner: 1, plus: 2, pro: 3 };
    const currentPlanOrder = planOrder[subscription?.plan || 'free'];
    const targetPlanOrder = planOrder[planId];
    return targetPlanOrder < currentPlanOrder;
  };

  const content = (
    <div className="min-h-screen bg-background">
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
            <span className="text-primary font-medium">1 credit = 15 minutes of interview time</span>
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
                        : 'bg-muted text-muted-foreground'
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
                    <div className="flex items-center justify-center space-x-2">
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
                    disabled={isCurrentPlan(plan.id) || (isProcessing && processingPlan === plan.id)}
                    className={`w-full h-12 font-semibold ${
                      plan.popular 
                        ? 'shadow-xl hover:shadow-2xl bg-gradient-to-r from-primary to-accent text-white' 
                        : 'hover:bg-primary/10 hover:border-primary/30'
                    } ${isCurrentPlan(plan.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing && processingPlan === plan.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan(plan.id) 
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
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Instant Access</h4>
              <p className="text-sm text-muted-foreground">Start practicing immediately after signup</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">No Setup Required</h4>
              <p className="text-sm text-muted-foreground">Works in any browser, no downloads needed</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-3">
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
