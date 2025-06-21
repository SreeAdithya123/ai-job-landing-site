
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import InterviewCopilot from "./pages/InterviewCopilot";
import UPSCInterviewer from "./pages/UPSCInterviewer";
import FriendlyInterviewer from "./pages/FriendlyInterviewer";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeScanner from "./pages/ResumeScanner";
import MaterialGenerator from "./pages/MaterialGenerator";
import NotFound from "./pages/NotFound";
import CareerCoach from "./pages/CareerCoach";
import Recruiters from "./pages/Recruiters";

const queryClient = new QueryClient();

const App =  () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview-copilot" element={<InterviewCopilot />} />
            <Route path="/upsc-interviewer" element={<UPSCInterviewer />} />
            <Route path="/friendly-interviewer" element={<FriendlyInterviewer />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/resume-scanner" element={<ResumeScanner />} />
            <Route path="/material-generator" element={<MaterialGenerator />} />
            <Route path="/career-coach" element={<CareerCoach />} />
            <Route path="/recruiters" element={<Recruiters />} />
            {/* Placeholder routes that redirect to dashboard */}
            <Route path="/question-bank" element={<Dashboard />} />
            <Route path="/careers" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
