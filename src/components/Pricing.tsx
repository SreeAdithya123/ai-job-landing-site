
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Check, Star, Zap, Shield, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      description: "Perfect for getting started with AI interview practice",
      originalPrice: null,
      features: [
        "3 practice interviews per month",
        "Basic feedback and scoring",
        "General interview questions",
        "Email support",
        "Progress tracking",
        "Basic performance analytics"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false,
      icon: Clock,
      highlight: "Great for beginners"
    },
    {
      name: "Pro",
      price: "19",
      originalPrice: "39",
      period: "month",
      description: "Everything you need to master your interview skills",
      features: [
        "Unlimited practice interviews",
        "Advanced AI feedback & analysis",
        "Industry-specific questions",
        "Video interview practice",
        "Performance analytics dashboard",
        "Priority support",
        "Resume optimization tips",
        "Mock panel interviews"
      ],
      buttonText: "Start 7-Day Free Trial",
      buttonVariant: "default" as const,
      popular: true,
      icon: Zap,
      highlight: "Most popular choice"
    },
    {
      name: "Enterprise",
      price: "99",
      originalPrice: "149",
      period: "month",
      description: "For teams and organizations training multiple candidates",
      features: [
        "Everything in Pro",
        "Team management dashboard",
        "Custom question banks",
        "Bulk user management",
        "Advanced reporting & analytics",
        "API access & integrations",
        "Dedicated account manager",
        "Custom branding options",
        "SSO integration"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
      icon: Users,
      highlight: "Best for teams"
    }
  ];

  const handleGetStarted = () => {
    navigate('/auth');
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
            <span className="text-sm font-medium text-primary">Trusted by 50,000+ job seekers</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent leading-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade as you grow. All plans include our core AI interview technology with no hidden fees.
          </p>
          
          {/* Pricing toggle or promotion */}
          <div className="mt-8 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
            <span className="text-green-600 font-medium">🎉 Limited Time: 50% off all paid plans</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                  <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2 border-2 border-white">
                    <Star className="h-4 w-4 fill-current" />
                    <span>Most Popular</span>
                  </div>
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
                  
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="text-sm text-primary font-medium mb-4">
                    {plan.highlight}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      {plan.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${plan.originalPrice}
                        </span>
                      )}
                      <span className="text-5xl font-bold text-foreground">
                        ${plan.price}
                      </span>
                    </div>
                    <span className="text-muted-foreground">/{plan.period}</span>
                    {plan.originalPrice && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Save ${parseInt(plan.originalPrice) - parseInt(plan.price)}/month
                      </div>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
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
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={handleGetStarted}
                    variant={plan.buttonVariant}
                    className={`w-full h-12 font-semibold ${
                      plan.popular 
                        ? 'shadow-xl hover:shadow-2xl scale-105 bg-gradient-to-r from-primary to-accent text-white' 
                        : 'hover:bg-primary/10 hover:border-primary/30'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                  
                  {plan.popular && (
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        No credit card required • Cancel anytime
                      </p>
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
            <h3 className="text-2xl font-bold text-foreground mb-3">
              30-Day Money-Back Guarantee
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Not satisfied with your results? Get a full refund within 30 days, no questions asked. We're confident you'll love our AI interview platform.
            </p>
          </div>

          {/* FAQ or additional info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
    </section>
  );
};

export default Pricing;
