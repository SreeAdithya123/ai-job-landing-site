import React, { useState } from 'react';
import { Menu, X, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  fullSize?: boolean;
}

const Layout = ({ children, fullSize = false }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isNotDashboard = location.pathname !== '/dashboard';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (fullSize) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border shadow-soft transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'}
        lg:static lg:inset-0 lg:transform-none
        ${sidebarOpen ? 'lg:w-64' : 'lg:w-0'}
      `}>
        {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      </div>

      {/* Round Arrow Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`
          fixed top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-card border border-border rounded-full shadow-soft hover:shadow-medium transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-muted
          ${sidebarOpen ? 'left-60' : 'left-4'}
          ${sidebarOpen ? 'lg:left-60' : 'lg:left-4'}
        `}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Mobile header */}
        <div className="lg:hidden bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">AI Interviewer</h1>
          <div className="flex items-center space-x-2">
            {isNotDashboard && (
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Home className="h-5 w-5 text-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
