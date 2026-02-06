import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Users, BookOpen, MessageSquare, Calendar, Heart, Lightbulb } from 'lucide-react';

const CommunitySection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Exclusive Content",
      description: "Early access to new features and behind-the-scenes insights."
    },
    {
      icon: MessageSquare,
      title: "Direct Access to Team",
      description: "Connect with our engineers, designers, and product leads."
    },
    {
      icon: Users,
      title: "Collaborative Projects",
      description: "Work with other members on challenges and learning initiatives."
    },
    {
      icon: Heart,
      title: "Mentorship and Support",
      description: "Find guidance from experienced professionals and offer your own expertise."
    },
    {
      icon: Calendar,
      title: "Events and Workshops",
      description: "Participate in virtual meetups, AMAs, and hands-on learning sessions."
    }
  ];

  const audiences = [
    {
      title: "Career Seekers",
      description: "Get structured practice and clear feedback to improve your interview skills.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Developers and Designers",
      description: "Collaborate on projects and refine your technical communication.",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Educators and Trainers",
      description: "Share insights and explore new ways to prepare students for success.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Lifelong Learners",
      description: "Connect with people who value continuous improvement and growth.",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-background">
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
            Made for Humans.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Powered by Purpose.
            </span>
          </h2>
          <p className="font-body text-body-lg text-muted-foreground max-w-4xl mx-auto leading-body mb-8">
            Vyoman is more than a product. It is a growing community of learners, professionals, and builders who believe in continuous improvement. Members share insights, participate in mock sessions, and support each other's growth journeys.
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-8 lg:p-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-headline text-h2 text-foreground mb-6 text-center">Our Vision for Community</h3>
            <p className="font-body text-body-lg text-muted-foreground leading-body mb-6">
              We believe in the power of shared purpose. The Vyoman Community is a space where curiosity thrives and collaboration leads to real progress.
            </p>
            <p className="font-body text-body text-muted-foreground leading-body">
              Whether you are preparing for your first interview or your tenth, you will find support here.
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="font-headline text-h2 text-foreground mb-12 text-center">What You Will Find</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="glass-card h-full hover:shadow-xl transition-all duration-300 border border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-headline font-semibold text-foreground mb-3">{feature.title}</h4>
                    <p className="font-body text-muted-foreground text-sm leading-body">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Who It's For */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="font-headline text-h2 text-foreground mb-12 text-center">Who It Is For</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {audiences.map((audience, index) => (
              <motion.div
                key={audience.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="glass-card h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${audience.gradient} mt-2 flex-shrink-0`} />
                      <div>
                        <h4 className="font-headline font-semibold text-foreground mb-2">{audience.title}</h4>
                        <p className="font-body text-muted-foreground text-sm leading-body">{audience.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-8 lg:p-12">
            <h3 className="font-headline text-h2 text-foreground mb-6">Join the Movement</h3>
            <p className="font-body text-body-lg text-muted-foreground leading-body mb-8 max-w-3xl mx-auto">
              Join a growing community of people who are committed to preparation and continuous improvement. The Vyoman Community is where ideas take shape and progress happens together.
            </p>
            <Button size="lg" className="shadow-glow hover:shadow-xl font-body tracking-button">
              Join the Community
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
