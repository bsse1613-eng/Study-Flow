import React from 'react';
import { LayoutDashboard, BookOpen, Calendar as CalendarIcon, Menu, GraduationCap } from 'lucide-react';
import { cn } from '../utils';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<Props> = ({ children, activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'schedule', label: 'Schedule & Exams', icon: CalendarIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
            <GraduationCap className="text-indigo-600" />
            <span className="font-bold text-xl text-indigo-900 font-display">StudyFlow</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-gray-50 rounded-lg">
          <Menu className="text-gray-600" size={24} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative shadow-xl md:shadow-none",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-dashed border-gray-100 hidden md:block">
          <h1 className="text-2xl font-bold text-indigo-900 flex items-center gap-2 font-display">
            <GraduationCap className="text-indigo-600 w-8 h-8" />
            StudyFlow
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium pl-10">AI POWERED PLANNER</p>
        </div>
        
        <nav className="p-6 space-y-3">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 group",
                  isActive 
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100 translate-x-1" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon size={20} className={cn("transition-colors", isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600")} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-50 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
               ME
             </div>
             <div>
               <p className="font-bold text-indigo-900 text-sm">My Profile</p>
               <p className="text-xs text-indigo-400">Keep learning!</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-indigo-900/20 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};