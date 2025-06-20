
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Copy, FileText, BookOpen, CreditCard, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutputDisplayProps {
  fileName: string;
  type: string;
  content: string;
  onClose: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ fileName, type, content, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'summary':
        return FileText;
      case 'bullet notes':
        return BookOpen;
      case 'flashcards':
        return CreditCard;
      case 'q&a format':
        return HelpCircle;
      default:
        return FileText;
    }
  };

  const Icon = getIcon();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "The generated content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.split('.')[0]}_${type.toLowerCase().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your generated material is being downloaded.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Generated Material</h3>
              <p className="text-sm opacity-90">{fileName} • {type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className={`${isExpanded ? '' : 'max-h-64 overflow-hidden'} transition-all duration-300`}>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
              {content}
            </pre>
          </div>
        </div>
        
        {content.length > 500 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-primary hover:text-accent font-medium text-sm transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default OutputDisplay;
