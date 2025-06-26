
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Camera, Mic, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import Layout from '../components/Layout';

const VirtualPractice = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Embed HeyGen streaming script
    const script = document.createElement('script');
    script.innerHTML = `
      !function(window){
        const host="https://labs.heygen.com",
        url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJXYXluZV8yMDI0MDcxMSIsInByZXZpZXdJ%0D%0AbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3YzL2EzZmRiMGM2NTIwMjRmNzk5%0D%0AODRhYWVjMTFlYmYyNjk0XzM0MzUwL3ByZXZpZXdfdGFyZ2V0LndlYnAiLCJuZWVkUmVtb3ZlQmFj%0D%0Aa2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6IjkzYjk5OTVkNWVlMDQ1OGY5MjE5ZDE5%0D%0AOGQ4OWM0NjliIiwidXNlcm5hbWUiOiI1Y2UxYTJlYjZkODI0MTVhYjU1ZWNkNGZjZmVkOTU1YyJ9&inIFrame=1",
        clientWidth=document.body.clientWidth,
        wrapDiv=document.createElement("div");
        wrapDiv.id="heygen-streaming-embed";
        const container=document.createElement("div");
        container.id="heygen-streaming-container";
        const stylesheet=document.createElement("style");
        stylesheet.innerHTML=\`
          #heygen-streaming-embed {
            z-index: 9999;
            position: fixed;
            left: 40px;
            bottom: 40px;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
            transition: all linear 0.1s;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
          }
          #heygen-streaming-embed.show {
            opacity: 1;
            visibility: visible;
          }
          #heygen-streaming-embed.expand {
            \${clientWidth<540?"height: 266px; width: 96%; left: 50%; transform: translateX(-50%);":"height: 366px; width: calc(366px * 16 / 9);"}
            border: 0;
            border-radius: 8px;
          }
          #heygen-streaming-container {
            width: 100%;
            height: 100%;
          }
          #heygen-streaming-container iframe {
            width: 100%;
            height: 100%;
            border: 0;
          }
        \`;
        const iframe=document.createElement("iframe");
        iframe.allowFullscreen=!1,
        iframe.title="Streaming Embed",
        iframe.role="dialog",
        iframe.allow="microphone",
        iframe.src=url;
        let visible=!1,initial=!1;
        window.addEventListener("message",(e=>{
          e.origin===host&&e.data&&e.data.type&&"streaming-embed"===e.data.type&&("init"===e.data.action?(initial=!0,wrapDiv.classList.toggle("show",initial)):"show"===e.data.action?(visible=!0,wrapDiv.classList.toggle("expand",visible)):"hide"===e.data.action&&(visible=!1,wrapDiv.classList.toggle("expand",visible)))
        })),
        container.appendChild(iframe),
        wrapDiv.appendChild(stylesheet),
        wrapDiv.appendChild(container),
        document.body.appendChild(wrapDiv)
      }(globalThis);
    `;
    document.head.appendChild(script);

    // Cleanup function to remove the HeyGen embed when component unmounts
    return () => {
      const embed = document.getElementById('heygen-streaming-embed');
      if (embed) {
        embed.remove();
      }
      script.remove();
    };
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors mr-6"
              >
                <ArrowLeft className="h-4 w-4 text-slate-300" />
                <span className="text-slate-300 font-medium">Back to Dashboard</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Virtual Practice
                </h1>
              </div>
            </div>
            
            <div className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg">
              <span className="text-slate-300 text-sm font-medium">AI-Powered Practice Sessions</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Practice with AI Avatar
              </h2>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                Engage in realistic practice sessions with our AI-powered avatar. 
                Get instant feedback and improve your interview skills in a safe, 
                interactive environment.
              </p>
            </div>

            {/* Interactive Area */}
            <div className="relative bg-slate-900/50 rounded-xl border border-slate-600 p-8 mb-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Avatar Ready</h3>
                <p className="text-slate-400 mb-4">
                  Your AI practice partner will appear in the bottom-right corner
                </p>
                <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>AI Avatar Loading...</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg p-6 border border-indigo-700/30">
              <h3 className="text-lg font-semibold text-white mb-3">How to Practice:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-slate-300 text-sm">
                <div className="space-y-2">
                  <p>• Click on the AI avatar when it appears</p>
                  <p>• Start a conversation naturally</p>
                  <p>• Practice common interview scenarios</p>
                </div>
                <div className="space-y-2">
                  <p>• Receive real-time feedback</p>
                  <p>• Work on your communication skills</p>
                  <p>• Build confidence through practice</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Conversation</h3>
              <p className="text-slate-300 text-sm">
                Natural conversations with an AI avatar that responds intelligently to your inputs
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Visual Practice</h3>
              <p className="text-slate-300 text-sm">
                Practice with a realistic avatar that maintains eye contact and natural expressions
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Voice Interaction</h3>
              <p className="text-slate-300 text-sm">
                Speak naturally with the AI and get immediate responses to improve your flow
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6"
          >
            <h3 className="font-semibold text-white mb-4">Practice Tips:</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Treat the AI avatar as a real interviewer</li>
              <li>• Practice maintaining eye contact with the camera</li>
              <li>• Use natural gestures and expressions</li>
              <li>• Ask questions back to show engagement</li>
              <li>• Practice different types of interview scenarios</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default VirtualPractice;
