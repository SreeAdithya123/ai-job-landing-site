import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Target, Shield, RefreshCw, Sparkles, Eye } from 'lucide-react';

const AboutSection = () => {
  const principles = [
    {
      icon: Target,
      title: "Human-Centric AI", 
      description: "We design AI to augment human capabilities. Our tools are intuitive partners that enhance your natural intelligence."
    },
    {
      icon: Shield,
      title: "Ethical Foundation",
      description: "Transparency, fairness, and accountability guide everything we build. Your privacy and trust come first."
    },
    {
      icon: RefreshCw,
      title: "Continuous Evolution",
      description: "Just as learning never stops, neither does our platform. We constantly refine and improve based on real feedback."
    },
    {
      icon: Sparkles,
      title: "Clarity and Craft",
      description: "We believe in elegant solutions and precise execution. Every product reflects our dedication to quality."
    },
    {
      icon: Eye,
      title: "Long-term Vision",
      description: "We approach challenges with curiosity and patience. The future we are building is meant to last."
    }
  ];

  const differentiators = [
    {
      emoji: "🎯",
      title: "Purpose-Built Intelligence",
      description: "We do not build AI for the sake of AI. Every feature is designed with a specific human need in mind."
    },
    {
      emoji: "🔄",
      title: "Adaptive Learning",
      description: "Our systems learn from your unique patterns, preferences, and goals. The more you use Vyoman, the better it becomes at helping you succeed."
    },
    {
      emoji: "⚖️",
      title: "Ethical AI First",
      description: "We believe AI should enhance human capability, not replace human judgment. Our tools are transparent, explainable, and always keep you in control."
    },
    {
      emoji: "🌱",
      title: "Growth-Oriented Design",
      description: "Every interaction is an opportunity to learn something new. Our interfaces are designed to challenge you gently, helping you develop skills naturally over time."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-headline text-h1 lg:text-display text-foreground mb-6 tracking-title">
            The Sky Is Not the Limit.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              It Is the Foundation.
            </span>
          </h2>
          <p className="font-body text-body-lg text-muted-foreground max-w-4xl mx-auto leading-body">
            Vyoman means sky in Sanskrit. We see the sky not as a limit but as the foundation that supports everything. Our platform is built on this belief.
          </p>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-8 lg:p-12">
            <h3 className="font-headline text-h2 text-foreground mb-6 text-center">Our Philosophy</h3>
            <p className="font-body text-body-lg text-muted-foreground leading-body mb-6">
              We believe preparation builds confidence, and confidence builds opportunity. Technology should support human growth, not replace it.
            </p>
            <p className="font-body text-body text-muted-foreground leading-body">
              Every feature within Vyoman is designed to strengthen your thinking, communication, and professional readiness. Our goal is simple. Help individuals present their true potential when it matters most.
            </p>
          </div>
        </motion.div>

        {/* What Makes Us Different */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="font-headline text-h2 text-foreground mb-12 text-center">What Makes Us Different</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="glass-card h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{item.emoji}</div>
                      <div>
                        <h4 className="font-headline font-semibold text-foreground mb-3">{item.title}</h4>
                        <p className="font-body text-muted-foreground text-sm leading-body">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guiding Principles */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="font-headline text-h2 text-foreground mb-12 text-center">Our Guiding Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="glass-card h-full hover:shadow-xl transition-all duration-300 border border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <principle.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-headline font-semibold text-foreground mb-3">{principle.title}</h4>
                    <p className="font-body text-muted-foreground text-sm leading-body">{principle.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Commitment */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-8 lg:p-12">
            <h3 className="font-headline text-h2 text-foreground mb-6">Our Commitment</h3>
            <p className="font-body text-body-lg text-muted-foreground leading-body max-w-4xl mx-auto">
              We are not just building software. We are building tools that help people grow, learn, and succeed.{' '}
              <span className="font-medium text-foreground">Join us on this journey.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
