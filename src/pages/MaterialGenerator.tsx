
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import MaterialCard from '../components/MaterialCard';
import UploadModal from '../components/UploadModal';
import { 
  FileText, 
  BookOpen, 
  CreditCard, 
  HelpCircle, 
  Plus, 
  Settings 
} from 'lucide-react';

const MaterialGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [recentSessions, setRecentSessions] = useState<Array<{
    id: string;
    fileName: string;
    type: string;
    date: string;
    status: string;
  }>>([]);

  const materialTypes = [
    {
      id: 'pdf-summary',
      title: 'PDF to Summary',
      description: 'Upload a PDF to generate structured summaries',
      icon: FileText,
      buttonText: 'Start Generation'
    },
    {
      id: 'notes-generator',
      title: 'Notes Generator',
      description: 'Create student-friendly bullet notes from Word/Text files',
      icon: BookOpen,
      buttonText: 'Start Notes'
    },
    {
      id: 'flashcards-maker',
      title: 'Flashcards Maker',
      description: 'Convert material into spaced-repetition Q&A flashcards',
      icon: CreditCard,
      buttonText: 'Make Flashcards'
    },
    {
      id: 'qa-extractor',
      title: 'Q&A Extractor',
      description: 'Extract MCQs and Q&A from study material automatically',
      icon: HelpCircle,
      buttonText: 'Generate Q&A'
    }
  ];

  const handleCardClick = (materialType: string) => {
    setSelectedMaterial(materialType);
    setIsModalOpen(true);
  };

  const handleGenerateComplete = (fileName: string, type: string) => {
    const newSession = {
      id: Date.now().toString(),
      fileName,
      type,
      date: new Date().toLocaleDateString(),
      status: 'Completed'
    };
    setRecentSessions(prev => [newSession, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                AI Material Generator
              </h1>
              <p className="text-muted-foreground">
                Generate powerful study materials from PDFs, Word Docs, or text
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-200 font-medium transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>New Material</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 glass-card border border-primary/20 rounded-lg hover:bg-white/90 transition-colors">
                <Settings className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">Settings</span>
              </button>
            </div>
          </div>

          {/* Material Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {materialTypes.map((material, index) => (
              <MaterialCard
                key={material.id}
                material={material}
                index={index}
                onClick={() => handleCardClick(material.id)}
              />
            ))}
          </div>

          {/* Recent Sessions Section */}
          <div className="glass-card rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">Recent Sessions</h2>
            </div>
            
            {recentSessions.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentSessions.map((session) => (
                  <div key={session.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors">
                    <div>
                      <h3 className="font-medium text-foreground">{session.fileName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {session.type} • {session.date}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border border-green-200">
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No materials generated yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload your first document to start generating study materials.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-glow transition-all duration-200 font-medium transform hover:scale-105"
                >
                  Generate Your First Material
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedMaterial={selectedMaterial}
        onGenerateComplete={handleGenerateComplete}
      />
    </Layout>
  );
};

export default MaterialGenerator;
