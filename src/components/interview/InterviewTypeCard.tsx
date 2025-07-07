
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, LucideIcon } from 'lucide-react';

interface InterviewTypeCardProps {
  type: {
    id: string;
    name: string;
    icon: LucideIcon;
    description: string;
    gradient: string;
    bgGradient: string;
  };
  isSelected: boolean;
  onSelect: (typeId: string) => void;
  onStart: (typeId: string) => void;
  index: number;
}

const InterviewTypeCard: React.FC<InterviewTypeCardProps> = ({
  type,
  isSelected,
  onSelect,
  onStart,
  index
}) => {
  return (
    <motion.div
      className={`relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        isSelected 
          ? `border-transparent bg-gradient-to-br ${type.bgGradient} shadow-xl` 
          : 'border-slate-200/50 hover:border-slate-300/50'
      }`}
      onClick={() => onSelect(type.id)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg bg-gradient-to-r ${type.gradient}`}>
        <type.icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="font-bold text-xl mb-3 text-slate-800 text-center">{type.name}</h3>
      <p className="text-slate-600 text-center mb-6 leading-relaxed">{type.description}</p>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onStart(type.id);
        }} 
        className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 bg-gradient-to-r ${type.gradient} text-white hover:shadow-lg`}
      >
        <span>Start Interview</span>
        <ArrowLeft className="h-4 w-4 rotate-180" />
      </button>
    </motion.div>
  );
};

export default InterviewTypeCard;
