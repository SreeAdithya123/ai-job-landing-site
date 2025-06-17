
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
  X
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
        { name: 'Mock Interview', href: '/mock-interview', icon: Users },
        { name: 'Preparation Hub', href: '/preparation-hub', icon: BookOpen },
        { name: 'AI Resume Builder', href: '/resume-builder', icon: FileText },
      ]
    },
    {
      section: 'Tools',
      items: [
        { name: 'AI Material Generator', href: '/material-generator', icon: Zap },
        { name: 'AI Job Hunter', href: '/job-hunter', icon: Briefcase, badge: 'Beta' },
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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
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
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={onClose}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* Stealth Mode Banner */}
        <div className="mx-2 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
          <div className="text-sm font-medium text-orange-900 mb-1">
            Stealth Mode is now available
          </div>
          <button className="text-xs text-orange-700 hover:text-orange-800 font-medium">
            Access Now →
          </button>
        </div>
      </nav>

      {/* User Profile & Subscriptions */}
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
        
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors">
            <Crown className="h-3 w-3 mr-1" />
            Interview Copilot Subscription
          </button>
          <button className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
            <Briefcase className="h-3 w-3 mr-1" />
            AI Job Hunter Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
