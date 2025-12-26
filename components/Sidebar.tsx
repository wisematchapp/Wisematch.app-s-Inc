
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  FileText,
  Bell,
  HelpCircle,
  Brain,
  Bot,
  Sparkles
} from 'lucide-react';
import { SupportModal } from './SupportModal';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  action?: () => void;
  type?: 'nav' | 'action';
}

interface SidebarProps {
  className?: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ className = "", onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Profile image sync
  const USER_IMAGE = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop";

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleItemClick = (item: NavigationItem) => {
    if (item.type === 'action' && item.action) {
      item.action();
    } else {
      setActiveItem(item.id);
      if (item.action) item.action();
    }
    
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const navigationItems: NavigationItem[] = [
    { id: "dashboard", name: "Dashboard", icon: Home, action: () => onNavigate('home') },
    { id: "build-tip", name: "Build Your Tip", icon: Sparkles, badge: "NEW", action: () => onNavigate('build-tip') },
    { id: "winston", name: "Winston", icon: Bot, badge: "AI", action: () => onNavigate('winston') },
    { id: "reports", name: "Relatórios", icon: FileText },
    { id: "notifications", name: "Gestão Banca", icon: Bell, badge: "3", action: () => onNavigate('notifications') },
    { id: "settings", name: "Configurações", icon: Settings, action: () => onNavigate('settings') },
    { 
      id: "help", 
      name: "Suporte", 
      icon: HelpCircle, 
      type: 'action',
      action: () => setIsSupportModalOpen(true) 
    },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-white shadow-md border border-slate-100 lg:hidden hover:bg-slate-50 transition-all duration-200 text-slate-600"
        aria-label="Toggle sidebar"
      >
        {isOpen ? 
          <X className="h-5 w-5" /> : 
          <Menu className="h-5 w-5" />
        }
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar - Permanently Expanded (w-72) */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-72
          lg:translate-x-0 lg:static lg:z-auto
          ${className}
        `}
      >
        {/* Header with logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-base leading-none">Wisematch</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-1">Analytics</span>
            </div>
          </div>
        </div>

        {/* Navigation - pr-6 used to ensure space from the scrollbar */}
        <nav className="flex-1 px-3 pr-6 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group relative
                      ${isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
                      }
                    `}
                  >
                    <div className={`flex items-center justify-center ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{item.name}</span>
                      {item.badge && (
                        <span className={`
                          px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide
                          ${isActive
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "bg-slate-100 text-slate-500"
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Active Indicator Strip */}
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section with profile and logout */}
        <div className="mt-auto border-t border-slate-100 p-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                        <img 
                            src={USER_IMAGE} 
                            className="w-full h-full object-cover" 
                            alt="Admin User" 
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 truncate">Admin User</span>
                    <span className="text-xs text-slate-500 truncate">Pro Plan</span>
                </div>
            </div>

            <button 
              onClick={() => onNavigate('promo')}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              title="Log Out"
            >
                <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
    </>
  );
}
