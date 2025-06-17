
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
          <Route path="/interview-copilot" element={<InterviewCopilot />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          {/* Placeholder routes */}
          <Route path="/preparation-hub" element={<Index />} />
          <Route path="/resume-builder" element={<Index />} />
          <Route path="/material-generator" element={<Index />} />
          <Route path="/job-hunter" element={<Index />} />
          <Route path="/career-coach" element={<Index />} />
          <Route path="/recruiters" element={<Index />} />
          <Route path="/question-bank" element={<Index />} />
          <Route path="/careers" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
