import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Check, Star, Zap, Shield, Crown, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, PLAN_DETAILS, SubscriptionPlan } from '@/hooks/useSubscription';
import { Badge } from './ui/badge';

const Pricing = () => {
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
      description: "Demo plan for marketing & conversions",
      originalPrice: null,
      features: [
        "1 mock interview (10 min)",
        "AI questions & live transcript",
        "Basic evaluation",
        "Resume Builder (1 template)",
        "CareerBot (10 msg/day)",
      ],
      buttonText: "Start Free",
      buttonVariant: "outline" as const,
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
      description: "Best for students",
      originalPrice: null,
      features: [
        "3 mocks/month (10 min each)",
        "PDF export (1-page summary)",
        "Resume Builder (full + export)",
        "CareerBot (200 msg/month)",
        "YourDream Bot (50 msg/month)",
      ],
      buttonText: "Get Basic",
      buttonVariant: "outline" as const,
      popular: false,
      icon: Clock,
      highlight: "Best for Students"
    },
    {
      id: 'plus' as SubscriptionPlan,
      name: "Plus",
      price: "399",
      originalPrice: null,
      period: "month",
      currency: "₹",
      description: "For serious job seekers",
      features: [
        "6 mocks/month (10-15 min)",
        "Full PDF report + compare (2)",
        "Premium resume templates",
        "CareerBot (600 msg/month)",
        "Cold email/DM drafting",
        "Role-based Q bank",
      ],
      buttonText: "Upgrade to Plus",
      buttonVariant: "outline" as const,
      popular: false,
      icon: Star,
      highlight: "Serious Job Seekers"
    },
    {
      id: 'pro' as SubscriptionPlan,
      name: "Pro",
      price: "599",
      originalPrice: null,
      period: "month",
      currency: "₹",
      description: "For high intent users",
      features: [
        "15 mocks/month (up to 30 min)",
        "Best AI model (Groq)",
        "Unlimited tools (fair-use)",
        "Offer negotiation assistant",
        "Weekly roadmap generator",
        "Priority support",
      ],
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      popular: true,
      icon: Crown,
      highlight: "Best Value"
    }
  ];

  const handleGetStarted = (planId: SubscriptionPlan) => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/payments');
    }
  };

  const isCurrentPlan = (planId: SubscriptionPlan) => {
    return subscription?.plan === planId;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background via-slate-50/50 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mb-6 border border-primary/20">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-body text-sm font-medium text-primary tracking-button">Trusted by 50,000+ job seekers</span>
          </div>
          
          <h2 className="font-headline text-display font-bold text-foreground mb-6 tracking-headline bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent leading-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="font-body text-body-lg text-muted-foreground max-w-3xl mx-auto leading-body">
            Start practicing for free. Upgrade when you are ready for deeper insights and unlimited sessions.
          </p>
          
          {/* Credit info */}
          <div className="mt-8 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-body text-primary font-medium">1 credit = 15 minutes of interview time</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2 border-2 border-white font-body">
                    <Crown className="h-4 w-4 fill-current" />
                    <span>Best Value</span>
                  </div>
                </div>
              )}
              {isCurrentPlan(plan.id) && (
                <div className="absolute -top-4 right-4 z-10">
                  <Badge className="bg-accent text-accent-foreground font-body">Current Plan</Badge>
                </div>
              )}
              
              <Card className={`glass-card h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary/30 shadow-xl ring-2 ring-primary/20 scale-105' 
                  : 'border-white/20 hover:border-primary/20'
              }`}>
                <CardHeader className="text-center pb-8 pt-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow' 
                        : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600'
                    }`}>
                      <plan.icon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <CardTitle className="font-headline text-h2 font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="font-body text-sm text-primary font-medium mb-4 tracking-button">
                    {plan.highlight}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      {plan.originalPrice && (
                        <span className="font-body text-lg text-muted-foreground line-through">
                          {plan.currency}{plan.originalPrice}
                        </span>
                      )}
                      <span className="font-metric text-4xl font-bold text-foreground">
                        {plan.currency}{plan.price}
                      </span>
                    </div>
                    <span className="font-body text-muted-foreground">/{plan.period}</span>
                    {plan.originalPrice && (
                      <div className="font-body text-sm text-green-600 font-medium mt-1">
                        Save {plan.currency}50/month
                      </div>
                    )}
                  </div>
                  
                  <p className="font-body text-muted-foreground text-sm leading-body">
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
                        <span className="font-body text-muted-foreground text-sm leading-body">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleGetStarted(plan.id)}
                    variant={plan.buttonVariant}
                    disabled={isCurrentPlan(plan.id)}
                    className={`w-full h-12 font-semibold font-body tracking-button ${
                      plan.popular 
                        ? 'shadow-xl hover:shadow-2xl scale-105 bg-gradient-to-r from-primary to-accent text-white' 
                        : 'hover:bg-primary/10 hover:border-primary/30'
                    } ${isCurrentPlan(plan.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isCurrentPlan(plan.id) ? 'Current Plan' : plan.buttonText}
                  </Button>
                  
                  {plan.id !== 'free' && (
                    <div className="text-center">
                      <Button
                        variant="link"
                        onClick={() => navigate('/payments')}
                        className="font-body text-xs text-primary p-0 h-auto"
                      >
                        View all plan details →
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators and guarantee */}
        <motion.div
          className="mt-20 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* Money-back guarantee */}
          <div className="glass-card p-8 rounded-2xl border border-white/20 max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="font-headline text-h2 font-bold text-foreground mb-3">
              30-Day Money-Back Guarantee
            </h3>
            <p className="font-body text-muted-foreground leading-body">
              Not satisfied with your results? Get a full refund within 30 days, no questions asked. We're confident you'll love our AI interview platform.
            </p>
          </div>

          {/* FAQ or additional info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-headline font-semibold text-foreground mb-2">Instant Access</h4>
              <p className="font-body text-sm text-muted-foreground leading-body">Start practicing immediately after signup</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-headline font-semibold text-foreground mb-2">No Setup Required</h4>
              <p className="font-body text-sm text-muted-foreground leading-body">Works in any browser, no downloads needed</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-headline font-semibold text-foreground mb-2">Expert Support</h4>
              <p className="font-body text-sm text-muted-foreground leading-body">Get help from our interview specialists</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
