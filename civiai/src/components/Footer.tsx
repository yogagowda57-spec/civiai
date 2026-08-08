import React from 'react';
import { Building2, ShieldCheck, PhoneCall, Award, FileText, Lock } from 'lucide-react';
import logoImg from '../assets/images/civiai_emblem_logo_1786027861370.jpg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 text-xs py-10 px-4 sm:px-6 lg:px-8 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand & Mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-white p-0.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center">
              <img 
                src={logoImg} 
                alt="CiviAI Logo" 
                className="h-6 w-6 object-contain rounded"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">CiviAI Platform</span>
          </div>
          <p className="text-slate-500 leading-relaxed text-xs">
            India’s enterprise AI-powered citizen services, scheme discovery, eligibility verification, document scanner, and grievance redressal infrastructure.
          </p>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 w-fit">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>STQC Certified & DigiLocker Integrated</span>
          </div>
        </div>

        {/* Essential Citizen Helplines */}
        <div>
          <h4 className="text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
            Essential National Helplines
          </h4>
          <ul className="space-y-2">
            <li className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
              <span>National Consumer Helpline:</span>
              <strong className="text-indigo-700">1915</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
              <span>Farmer Call Centre (Kisan Helpline):</span>
              <strong className="text-indigo-700">1800-180-1551</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
              <span>Ayushman Bharat Hospital Help:</span>
              <strong className="text-indigo-700">14555</strong>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-1 text-slate-600">
              <span>Senior Citizen Helpline (Elderline):</span>
              <strong className="text-indigo-700">14567</strong>
            </li>
          </ul>
        </div>

        {/* Security & Data Privacy Compliance */}
        <div>
          <h4 className="text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            Security & Compliance
          </h4>
          <ul className="space-y-1.5 text-slate-500">
            <li>• 256-Bit AES Encryption on Document Vault</li>
            <li>• Zero-Knowledge Privacy Architecture</li>
            <li>• DPDP Act 2023 Compliant Data Safeguards</li>
            <li>• ISO 27001 Certified Infrastructure</li>
            <li>• Role-Based Access Audit Telemetry</li>
          </ul>
        </div>

        {/* Digital India Standards */}
        <div>
          <h4 className="text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            Government Portals Sync
          </h4>
          <p className="text-slate-500 leading-relaxed mb-3">
            Real-time API sync with myScheme.gov.in, UMANG, DigiLocker, PFMS, CPGRAMS, and National Scholarship Portal.
          </p>
          <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-[10px] text-slate-600 font-medium">
            Designed for G2C (Government to Citizen) transparency & zero-middleman welfare delivery.
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <p>© 2026 CiviAI Platform. Government Technology Innovation Initiative.</p>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          <a href="#accessibility" className="hover:text-indigo-600 transition-colors">WCAG 2.1 AA Accessibility</a>
          <a href="#sitemap" className="hover:text-indigo-600 transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};
