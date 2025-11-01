import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Dynamically import Monaco Editor to prevent React version conflicts
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange, height = "400px" }) => {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-[400px] bg-slate-900">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-slate-400">Loading editor...</p>
          </div>
        </div>
      }
    >
      <MonacoEditor
        height={height}
        language={language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language}
        value={value}
        onChange={(value) => onChange(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          wordWrap: 'on',
        }}
      />
    </Suspense>
  );
};

export default CodeEditor;