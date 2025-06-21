
import { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { setupWebhookListener } from "./services/webhookService";
import Index from "./pages/Index";
import MockInterview from "./pages/MockInterview";
import UPSCInterviewer from "./pages/UPSCInterviewer";
import FriendlyInterviewer from "./pages/FriendlyInterviewer";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeScanner from "./pages/ResumeScanner";
import MaterialGenerator from "./pages/MaterialGenerator";
import CareerCoach from "./pages/CareerCoach";
import InterviewCopilot from "./pages/InterviewCopilot";
import Recruiters from "./pages/Recruiters";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Set up webhook listener for real-time updates
    const cleanup = setupWebhookListener();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/mock-interview" element={<MockInterview />} />
                <Route path="/upsc-interviewer" element={<UPSCInterviewer />} />
                <Route path="/friendly-interviewer" element={<FriendlyInterviewer />} />
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                <Route path="/resume-scanner" element={<ResumeScanner />} />
                <Route path="/material-generator" element={<MaterialGenerator />} />
                <Route path="/career-coach" element={<CareerCoach />} />
                <Route path="/interview-copilot" element={<InterviewCopilot />} />
                <Route path="/recruiters" element={<Recruiters />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
