import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange, height = "400px" }) => {
  return (
    <div className="relative" style={{ height }}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full resize-none bg-slate-900 text-slate-100 font-mono text-sm p-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        style={{ 
          height: '100%',
          minHeight: height,
          lineHeight: '1.5',
          tabSize: 2
        }}
        placeholder={`// Write your ${language} code here...`}
        spellCheck={false}
      />
      <div className="absolute top-2 right-2 px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 font-mono">
        {language.toUpperCase()}
      </div>
    </div>
  );
};

export default CodeEditor;