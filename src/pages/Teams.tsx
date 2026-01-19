import React from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Linkedin, Twitter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import ceoImage from '@/assets/team-ceo.png';
import cmoImage from '@/assets/team-cmo.png';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  imageClassName?: string;
  social?: {
    email?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "K. Sree Adithya",
    role: "CEO & Founder",
    bio: "Passionate about democratizing interview preparation through AI technology.",
    image: ceoImage,
    social: {
      email: "adithya@aiinterviewer.com",
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    name: "G. Yohan Raju",
    role: "CMO",
    bio: "Strategic marketing leader driving brand growth and user engagement.",
    image: cmoImage,
    imageClassName: "scale-[1.8] translate-y-[20%]",
    social: {
      email: "yohan@aiinterviewer.com",
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    name: "Michael Park",
    role: "Head of Product",
    bio: "Former recruiter turned product leader, focused on user-centric design.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    social: {
      email: "michael@aiinterviewer.com",
      linkedin: "#"
    }
  },
  {
    name: "Emily Rodriguez",
    role: "Lead AI Engineer",
    bio: "Specializes in NLP and conversational AI for realistic interview simulations.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    social: {
      email: "emily@aiinterviewer.com",
      linkedin: "#"
    }
  }
];

const Teams = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Our Team</h1>
              <p className="text-sm text-muted-foreground">Meet the people behind AI Interviewer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Building the Future of Interview Preparation
          </h2>
          <p className="text-lg text-muted-foreground">
            We're a passionate team of engineers, designers, and industry experts committed to 
            helping candidates succeed in their career journeys through cutting-edge AI technology.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4 w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className={`w-full h-full object-cover object-top ${member.imageClassName || ''}`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  
                  {member.social && (
                    <div className="flex items-center justify-center gap-3">
                      {member.social.email && (
                        <a
                          href={`mailto:${member.social.email}`}
                          className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">User-Centric</h4>
              <p className="text-sm text-muted-foreground">Every feature we build starts with understanding our users' needs</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Innovation</h4>
              <p className="text-sm text-muted-foreground">We push the boundaries of AI to create better interview experiences</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Accessibility</h4>
              <p className="text-sm text-muted-foreground">Making professional interview prep available to everyone</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Teams;
