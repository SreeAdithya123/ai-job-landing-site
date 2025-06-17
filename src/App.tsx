
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import InterviewCopilot from "./pages/InterviewCopilot";
import MockInterview from "./pages/MockInterview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App =  () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview-copilot" element={<InterviewCopilot />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          {/* Placeholder routes that redirect to dashboard */}
          <Route path="/preparation-hub" element={<Dashboard />} />
          <Route path="/resume-builder" element={<Dashboard />} />
          <Route path="/material-generator" element={<Dashboard />} />
          <Route path="/job-hunter" element={<Dashboard />} />
          <Route path="/career-coach" element={<Dashboard />} />
          <Route path="/recruiters" element={<Dashboard />} />
          <Route path="/question-bank" element={<Dashboard />} />
          <Route path="/careers" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
