
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Mail, MapPin, Clock, Heart } from 'lucide-react';

const CareersSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Attention to Detail",
      description: "We believe that excellence lives in the details. Every line of code, every design decision, every user interaction matters."
    },
    {
      icon: Clock,
      title: "Long-term Thinking",
      description: "We're building for the future, not just the next quarter. Our decisions today shape the world of tomorrow."
    },
    {
      icon: MapPin,
      title: "Global Impact",
      description: "Our work reaches across continents and cultures, creating tools that empower people everywhere."
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
            Work with People Who{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Care About the Details
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            At Vyoman, we are building more than just software; we are cultivating a culture of excellence, 
            curiosity, and profound impact. Our team is comprised of individuals who share a deep commitment 
            to craftsmanship, ethical innovation, and the belief that technology can genuinely elevate the human experience.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                <Card className="glass-card h-full hover:shadow-xl transition-all duration-300 border border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Our Mission</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              If you are driven by a desire to create tools that genuinely make a difference in people's lives, 
              if you thrive in environments where intellectual rigor meets creative freedom, and if you believe 
              that the intersection of human insight and artificial intelligence holds the key to solving some 
              of the world's most pressing challenges, then Vyoman might be the perfect place for you to grow 
              and contribute.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We are looking for individuals who are not just skilled in their respective domains, but who 
              also bring a sense of purpose, curiosity, and collaborative spirit to everything they do. 
              Whether you're a seasoned professional or an emerging talent, what matters most to us is your 
              passion for excellence and your commitment to building a better future through technology.
            </p>
          </div>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* Careers Card */}
          <Card className="glass-card hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-6 mx-auto">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Join Our Team</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Ready to shape the future of AI-powered tools? We're always looking for passionate individuals 
                who share our vision of ethical, human-centric technology.
              </p>
              <Button size="lg" className="shadow-glow hover:shadow-xl mb-4">
                View Open Positions
              </Button>
              <p className="text-sm text-muted-foreground">
                Don't see a perfect fit? We'd still love to hear from you.
              </p>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="glass-card hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Have questions about our products, partnerships, or just want to say hello? 
                We'd love to hear from you and learn about your journey.
              </p>
              <Button variant="secondary" size="lg" className="glass-card hover:bg-white/90 mb-4">
                Contact Us
              </Button>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24 hours.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-8">
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              At Vyoman, every team member is a stakeholder in our shared mission to create technology 
              that genuinely serves humanity. We offer competitive compensation, comprehensive benefits, 
              and most importantly, the opportunity to work on products that make a real difference in people's lives.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareersSection;
