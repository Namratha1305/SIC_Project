import React from 'react';
import { Mail, Sparkles, Beaker, ShieldCheck, FileText, CheckCircle2, Presentation } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLoadDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onLoadDemo }) => {
  const tabs = [
    { id: 'generator', label: 'Email Generator', icon: Mail },
    { id: 'experiment', label: 'Prompting Experiment', icon: Sparkles },
    { id: 'testing', label: 'Prototype Testing', icon: Beaker },
    { id: 'responsible-ai', label: 'Responsible AI & Grounding', icon: ShieldCheck },
    { id: 'presentation', label: 'Presentation & Report', icon: Presentation },
    { id: 'notes', label: 'Project Notes', icon: FileText },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Email Assistant</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Student Prototype
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Grounded Gemini Model
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Generate clear, professional business emails with AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="load-demo-header-btn"
              onClick={onLoadDemo}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors cursor-pointer border border-slate-300"
              title="Load standard Internship Inquiry demo context"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              Load Demo
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto border-t border-slate-100 pt-1 -mb-px scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
