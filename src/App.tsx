
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/interview-copilot" element={<ProtectedRoute><InterviewCopilot /></ProtectedRoute>} />
            <Route path="/upsc-interviewer" element={<ProtectedRoute><UPSCInterviewer /></ProtectedRoute>} />
            <Route path="/friendly-interviewer" element={<ProtectedRoute><FriendlyInterviewer /></ProtectedRoute>} />
            <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
            <Route path="/resume-scanner" element={<ProtectedRoute><ResumeScanner /></ProtectedRoute>} />
            <Route path="/material-generator" element={<ProtectedRoute><MaterialGenerator /></ProtectedRoute>} />
            <Route path="/career-coach" element={<ProtectedRoute><CareerCoach /></ProtectedRoute>} />
            <Route path="/recruiters" element={<ProtectedRoute><Recruiters /></ProtectedRoute>} />
            {/* Placeholder routes that redirect to dashboard */}
            <Route path="/question-bank" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
