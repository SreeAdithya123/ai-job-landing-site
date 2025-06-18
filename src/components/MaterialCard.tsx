
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MaterialCardProps {
  material: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    buttonText: string;
  };
  index: number;
  onClick: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, index, onClick }) => {
  const { title, description, icon: Icon, buttonText } = material;

  return (
    <motion.div
      className="p-6 glass-card rounded-2xl border-2 border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-xl hover:border-primary/30 group"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-r from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-200 group-hover:shadow-glow">
        <Icon className="h-6 w-6 text-primary group-hover:text-primary-hover transition-colors duration-200" />
      </div>
      
      <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary-hover transition-colors duration-200">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-200 text-sm font-medium transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        {buttonText}
      </button>
    </motion.div>
  );
};

export default MaterialCard;
