import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Bell, 
  FileText, 
  Eye, 
  Volume2, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { CitizenProfile, Language, UserRole } from '../types';
import logoImg from '../assets/images/civiai_emblem_logo_1786027861370.jpg';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentLanguage?: Language;
  setCurrentLanguage?: (lang: Language) => void;
  activePersona: CitizenProfile;
  personas: CitizenProfile[];
  onSelectPersona: (p: CitizenProfile) => void;
  onOpenPRD: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  fontSize: 'normal' | 'large';
  setFontSize: (s: 'normal' | 'large') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activePersona,
  personas,
  onSelectPersona,
  onOpenPRD,
  onOpenNotifications,
  unreadCount,
  highContrast,
  setHighContrast,
  fontSize,
  setFontSize,
  activeTab,
  setActiveTab
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${
      highContrast 
        ? 'bg-black text-yellow-300 border-yellow-400' 
        : 'bg-white text-slate-800 border-slate-200/90 shadow-sm'
    }`}>
      {/* Top Accessibility & Emergency Helpline Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            National Portal Live Data Synchronized
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-300">24x7 Citizen Helpline: <strong className="text-amber-300">1800-11-0001</strong> / <strong className="text-amber-300">1915</strong></span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* High Contrast Toggle */}
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className="hover:text-amber-300 transition-colors flex items-center gap-1 font-medium px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Toggle High Contrast Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{highContrast ? 'Standard Mode' : 'High Contrast'}</span>
          </button>

          {/* Font Size Adjuster */}
          <button
            onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
            className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Adjust Text Size"
          >
            <span className="text-xs">A</span>
            <span className="text-sm font-bold">A+</span>
          </button>

          {/* Master PRD Architecture Modal Button */}
          <button 
            onClick={onOpenPRD}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-0.5 rounded transition-all flex items-center gap-1 shadow-sm text-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Internal PRD & Architecture</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('chat')}>
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center group-hover:border-indigo-300 transition-colors">
            <img 
              src={logoImg} 
              alt="CiviAI Logo" 
              className="h-9 w-9 object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                CiviAI
              </h1>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase leading-none inline-flex flex-col text-left">
                <span>ENTERPRISE</span>
                <span>AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              National Citizen Services & Scheme Discovery Platform
            </p>
          </div>
        </div>

        {/* Center Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { id: 'chat', label: 'AI Assistant', icon: Sparkles },
            { id: 'schemes', label: 'Schemes', icon: Building2 },
            { id: 'eligibility', label: 'Eligibility', icon: UserCheck },
            { id: 'ocr', label: 'Doc Scanner', icon: ShieldCheck },
            { id: 'grievance', label: 'Complaints', icon: FileText },
            { id: 'offices', label: 'Gov Offices', icon: Building2 },
            { id: 'admin', label: 'Admin Panel', icon: ShieldCheck },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tool Actions: Persona Selector, Role Switcher, Notifications */}
        <div className="flex items-center gap-3">

          {/* Persona Profile Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              <img 
                src={activePersona.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt={activePersona.name} 
                className="w-5 h-5 rounded-full object-cover ring-2 ring-indigo-500"
              />
              <div className="text-left">
                <p className="font-bold text-slate-900 leading-tight">{activePersona.name}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{activePersona.occupation}, {activePersona.state}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2">
                <div className="px-3 py-1 text-[11px] text-slate-400 font-bold uppercase border-b border-slate-100 mb-1">
                  Switch Citizen Persona
                </div>
                {personas.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPersona(p);
                      setShowPersonaMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg flex items-center gap-3 transition-colors ${
                      activePersona.id === p.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img src={p.avatarUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.occupation} • {p.state} • Income ₹{p.annualIncome.toLocaleString('en-IN')}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Notifications Drawer Toggle */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 shadow-sm"
            title="Notifications & Scheme Reminders"
          >
            <Bell className="w-4 h-4 text-indigo-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-200 px-2 py-1.5 overflow-x-auto gap-2">
        {[
          { id: 'chat', label: 'AI Assist' },
          { id: 'schemes', label: 'Schemes' },
          { id: 'eligibility', label: 'Check' },
          { id: 'ocr', label: 'Scanner' },
          { id: 'grievance', label: 'Complaints' },
          { id: 'offices', label: 'Offices' },
          { id: 'admin', label: 'Admin' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs px-2.5 py-1 rounded font-semibold whitespace-nowrap ${
              activeTab === tab.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
