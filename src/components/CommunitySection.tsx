
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Users, BookOpen, MessageSquare, Calendar, Lightbulb, Heart } from 'lucide-react';

const CommunitySection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Exclusive Content",
      description: "Early access to new features, beta programs, and behind-the-scenes insights"
    },
    {
      icon: MessageSquare,
      title: "Direct Access to Team",
      description: "Engage with our engineers, designers, and product leads"
    },
    {
      icon: Users,
      title: "Collaborative Projects",
      description: "Work with other community members on open-source initiatives and creative challenges"
    },
    {
      icon: Heart,
      title: "Mentorship & Support",
      description: "Find guidance from experienced professionals and offer your own expertise to others"
    },
    {
      icon: Calendar,
      title: "Events & Workshops",
      description: "Participate in virtual meetups, expert AMAs, and hands-on learning sessions"
    }
  ];

  const audiences = [
    {
      title: "AI Enthusiasts",
      description: "Deepen your understanding of AI's potential and ethical implications",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Developers & Designers",
      description: "Collaborate on projects and refine your skills",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Educators & Researchers",
      description: "Share insights and explore new pedagogical approaches",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Visionaries",
      description: "Connect with like-minded individuals shaping the future of technology",
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
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Made for Humans.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Powered by Humans.
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            At Vyoman, we firmly believe that technology, at its best, is a catalyst for connection. 
            The Vyoman Community is a vibrant, inclusive ecosystem designed for individuals who are 
            passionate about building the future, exploring new ideas, and learning from one another.
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
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Our Vision for Community</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              In a world that often feels disconnected, we believe in the power of shared purpose. 
              The Vyoman Community is more than just a platform; it's a living, breathing ecosystem 
              where curiosity thrives and collaboration leads to breakthroughs.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We envision a world where innovation is a collective endeavor, not a solitary pursuit. 
              Whether you're an aspiring AI ethicist, a seasoned software engineer, a curious designer, 
              or simply someone eager to understand the implications of emerging technologies, you'll 
              find a welcoming environment here.
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
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">What You'll Find</h3>
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
                    <h4 className="font-semibold text-foreground mb-3">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
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
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Who It's For</h3>
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
                        <h4 className="font-semibold text-foreground mb-2">{audience.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{audience.description}</p>
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
            <h3 className="text-2xl font-bold text-foreground mb-6">Join the Movement</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              Join a growing circle of AI creators and explorers who are committed to responsible innovation 
              and collective advancement. The Vyoman Community is where ideas take flight, where challenges 
              are met with collaborative solutions, and where the future is not just anticipated, but actively co-created.
            </p>
            <Button size="lg" className="shadow-glow hover:shadow-xl">
              Join the Community
            </Button>
            <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto">
              We are building not just tools, but a movement — a community dedicated to harnessing technology 
              for the betterment of humanity, one thoughtful conversation and one shared insight at a time.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
