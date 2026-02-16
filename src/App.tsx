
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import MockInterview from "./pages/MockInterview";
import InterviewCopilot from "./pages/InterviewCopilot";
import InterviewHistory from "./pages/InterviewHistory";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeScanner from "./pages/ResumeScanner";
import MaterialGenerator from "./pages/MaterialGenerator";
import CareerCoach from "./pages/CareerCoach";
import VirtualInterviewer from "./pages/VirtualInterviewer";
import PracticeInterview from "./pages/PracticeInterview";
import Recruiters from "./pages/Recruiters";
import CodingInterview from "./pages/CodingInterview";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Payments from "./pages/Payments";
import Teams from "./pages/Teams";
import AptitudeTest from "./pages/AptitudeTest";
import Interviewer from "./pages/Interviewer";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

function App() {
  return (
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/mock-interview" element={<MockInterview />} />
              <Route path="/interview-copilot" element={<InterviewCopilot />} />
              <Route path="/interview-copilot/coding" element={<CodingInterview />} />
              <Route path="/interview-history" element={<InterviewHistory />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/resume-scanner" element={<ResumeScanner />} />
              <Route path="/material-generator" element={<MaterialGenerator />} />
              <Route path="/career-coach" element={<CareerCoach />} />
              <Route path="/virtual-interviewer" element={<VirtualInterviewer />} />
              <Route path="/practice-interview" element={<PracticeInterview />} />
              <Route path="/recruiters" element={<Recruiters />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/aptitude-test" element={<AptitudeTest />} />
              <Route path="/interviewer" element={<Interviewer />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
