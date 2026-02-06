import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Laptop, 
  Code, 
  Phone, 
  Star,
  BookOpen,
  FileText,
  Briefcase,
  Users,
  HelpCircle,
  User,
  Crown,
  Zap,
  X,
  Settings,
  LogOut,
  Scan,
  Video,
  CreditCard,
  Brain
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { user, signOut } = useAuth();
  
  const menuItems = [
    {
      section: 'Interview',
      items: [
        { name: 'Voice Interviewer', href: '/interviewer', icon: Phone },
        { name: 'AI Interviewer', href: '/interview-copilot', icon: Laptop },
        { name: 'Virtual Interviewer', href: '/virtual-interviewer', icon: Video },
        { name: 'AI Resume Builder', href: '/resume-builder', icon: FileText },
        { name: 'Resume Scanner', href: '/resume-scanner', icon: Scan },
      ]
    },
    {
      section: 'Tools',
      items: [
        { name: 'Aptitude Test', href: '/aptitude-test', icon: Brain },
        { name: 'AI Material Generator', href: '/material-generator', icon: Zap },
        { name: 'AI Career Coach', href: '/career-coach', icon: Star },
        { name: 'Speak with Recruiters', href: '/recruiters', icon: Users },
        { name: 'Interview Question Bank', href: '/question-bank', icon: HelpCircle },
      ]
    },
    {
      section: 'Company',
      items: [
        { name: 'Get Started', href: '/', icon: Star },
        { name: 'Our Team', href: '/teams', icon: Users },
        { name: 'Careers', href: '/careers', icon: Briefcase },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleManageAccount = () => {
    // Add account management logic here
    console.log('Manage Account clicked');
  };

  // Extract user's name and email
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-glow">
              <Code className="h-4 w-4 text-white" />
            </div>
            <span className="font-headline text-xl font-bold text-gray-900 whitespace-nowrap tracking-title">AI Interviewer</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        {menuItems.map((section) => (
          <div key={section.section}>
            <h3 className="font-headline px-2 text-xs font-semibold text-gray-500 uppercase tracking-label mb-3">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `
                    flex items-center px-2 py-2 font-body text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary/10 text-primary border-r-2 border-primary shadow-glow-accent' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={onClose}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile & Account Management */}
      {user && (
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-body text-sm font-medium text-gray-900 truncate">{userName}</div>
              <div className="font-body text-xs text-gray-500 truncate">{userEmail}</div>
            </div>
          </div>
          
          {/* Account Management Buttons */}
          <div className="space-y-2">
            <button 
              onClick={handleManageAccount}
              className="w-full flex items-center justify-center px-3 py-2 font-body text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors tracking-button"
            >
              <Settings className="h-3 w-3 mr-1" />
              <span className="whitespace-nowrap">Manage Account</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 font-body text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors tracking-button"
            >
              <LogOut className="h-3 w-3 mr-1" />
              <span className="whitespace-nowrap">Logout</span>
            </button>
          </div>
          
          <div className="space-y-2">
            <NavLink
              to="/payments"
              onClick={onClose}
              className={({ isActive }) => `
                w-full flex items-center justify-center px-3 py-2 font-body text-xs font-medium rounded-md transition-colors tracking-button
                ${isActive 
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg' 
                  : 'text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20'
                }
              `}
            >
              <CreditCard className="h-3 w-3 mr-1" />
              <span className="whitespace-nowrap">Plans & Pricing</span>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
