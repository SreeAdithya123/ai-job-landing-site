
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
  LogOut
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const menuItems = [
    {
      section: 'Interview',
      items: [
        { name: 'Interview Copilot', href: '/interview-copilot', icon: Laptop },
        { name: 'AI Resume Builder', href: '/resume-builder', icon: FileText },
      ]
    },
    {
      section: 'Tools',
      items: [
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
        { name: 'Careers', href: '/careers', icon: Briefcase },
      ]
    }
  ];

  const handleLogout = () => {
    // Add logout logic here when authentication is implemented
    console.log('Logout clicked');
  };

  const handleManageAccount = () => {
    // Add account management logic here
    console.log('Manage Account clicked');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-glow">
              <Code className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Interviewer</span>
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
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `
                    flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary/10 text-primary border-r-2 border-primary shadow-glow-accent' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={onClose}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full border border-accent/20">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile & Account Management */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">John Doe</div>
            <div className="text-xs text-gray-500">john@example.com</div>
          </div>
        </div>
        
        {/* Account Management Buttons */}
        <div className="space-y-2">
          <button 
            onClick={handleManageAccount}
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors"
          >
            <Settings className="h-3 w-3 mr-1" />
            Manage Account
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-3 w-3 mr-1" />
            Logout
          </button>
        </div>
        
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors">
            <Crown className="h-3 w-3 mr-1" />
            Interview Copilot Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
