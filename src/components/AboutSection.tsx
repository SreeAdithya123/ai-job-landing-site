
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Sky, Target, RefreshCw, Sparkles, Globe } from 'lucide-react';

const AboutSection = () => {
  const principles = [
    {
      icon: Target,
      title: "Human-Centric AI",
      description: "We design AI to augment human capabilities, not replace them. Our tools are intuitive partners that enhance your natural intelligence."
    },
    {
      icon: Sky,
      title: "Ethical Foundation",
      description: "Transparency, fairness, and accountability are non-negotiable. We build AI that is unbiased, respects privacy, and serves the greater good."
    },
    {
      icon: RefreshCw,
      title: "Continuous Evolution",
      description: "Just as the sky is ever-changing, so are our tools. We embrace iterative development, constantly learning and adapting."
    },
    {
      icon: Sparkles,
      title: "Clarity & Craft",
      description: "We believe in elegant solutions and precise execution. Every product reflects our dedication to clarity and craftsmanship."
    },
    {
      icon: Globe,
      title: "Cosmic Intent",
      description: "Inspired by the vastness of the cosmos, we approach challenges with boundless curiosity and a long-term vision."
    }
  ];

  const differentiators = [
    {
      emoji: "🎯",
      title: "Purpose-Built Intelligence",
      description: "We don't build AI for the sake of AI. Every feature, every algorithm, every interaction is designed with a specific human need in mind."
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
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            The Sky Isn't the Limit.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              It's the Foundation.
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            The name Vyoman, derived from the ancient Sanskrit word for "sky," represents vastness, potential, 
            and the very fabric of existence. We don't see the sky as a distant limit, but as the omnipresent, 
            supportive element that allows everything to flourish.
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
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Our Philosophy</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              At Vyoman, we are driven by a singular, ambitious goal: to reimagine human potential through the 
              intelligent application of Artificial Intelligence. We are not interested in creating technology 
              for technology's sake. Instead, our focus is on developing AI systems that are inherently fast, 
              meticulously ethical, and genuinely useful.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our commitment to ethical AI is unwavering. We understand the immense responsibility that comes 
              with building intelligent systems, and we prioritize data privacy, algorithmic fairness, and user 
              control in every aspect of our development process. This dedication to thoughtful innovation ensures 
              that Vyoman's tools are not just cutting-edge, but also trustworthy companions on your journey of growth.
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
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">What Makes Us Different</h3>
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
                        <h4 className="font-semibold text-foreground mb-3">{item.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
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
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Our Guiding Principles</h3>
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
                    <h4 className="font-semibold text-foreground mb-3">{principle.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{principle.description}</p>
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
            <h3 className="text-2xl font-bold text-foreground mb-6">Our Commitment</h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              We are not just building software; we are building a future where technology is a force for good. 
              A future where individuals are empowered to learn, grow, and thrive. A future inspired by the 
              infinite potential of the sky, and built with the meticulous care of human hands.{' '}
              <span className="font-medium text-foreground">Join us on this journey.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
