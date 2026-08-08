import React, { useState } from 'react';
import { X, FileText, Building2, ShieldCheck, Database, Code, Cpu, Server, MapPin } from 'lucide-react';

interface PRDDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PRDDocModal: React.FC<PRDDocModalProps> = ({ isOpen, onClose }) => {
  const [activeDocTab, setActiveDocTab] = useState<'prd' | 'srs' | 'arch' | 'db' | 'api' | 'sprint'>('prd');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-xl relative text-slate-900 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">CiviAI Enterprise Internal Documentation</h2>
              <p className="text-xs text-slate-500">FAANG-Grade Product Requirements, Architecture & Technical Specs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Documentation Sub-Tabs */}
        <div className="flex items-center gap-2 bg-slate-50 px-5 py-2 border-b border-slate-200 overflow-x-auto text-xs font-bold">
          {[
            { id: 'prd', label: '1. PRD' },
            { id: 'srs', label: '2. System Requirements' },
            { id: 'arch', label: '3. Architecture' },
            { id: 'db', label: '4. Database Design' },
            { id: 'api', label: '5. API Reference' },
            { id: 'sprint', label: '6. Sprint & Roadmap' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveDocTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeDocTab === tab.id
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Document Content View */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 leading-relaxed font-sans">
          
          {activeDocTab === 'prd' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-indigo-600">SECTION 1: PRODUCT REQUIREMENTS DOCUMENT (PRD)</h3>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs">1.1 Executive Summary</h4>
                <p>
                  <strong>Project Name:</strong> CiviAI (AI-Powered Citizen Services & Government Scheme Discovery Platform)<br />
                  <strong>Tagline:</strong> AI-Powered Citizen Services & Government Scheme Discovery Platform<br />
                  <strong>Mission:</strong> To solve the problem of fragmented government service discovery across 30+ central and state ministries in India by combining natural language AI chat, automated OCR document validation, personalized eligibility scoring, and administrative grievance drafting into a single, seamless platform.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs">1.2 User Personas & Target Segments</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Small & Marginal Farmers:</strong> Require direct access to PM-KISAN, crop insurance, and equipment subsidies with local language voice interaction.</li>
                  <li><strong>Students & Youth:</strong> Seeking higher education scholarships, Post-Matric grants, and free skill training (PMKVY) without complex bureaucracy.</li>
                  <li><strong>Senior Citizens & Widows:</strong> Need pension application support, Ayushman Bharat health card issuance, and home delivery support.</li>
                  <li><strong>Micro Entrepreneurs & Vendors:</strong> Seeking PM Mudra, PM SVANidhi, and PM Vishwakarma collateral-free working capital loans.</li>
                  <li><strong>Persons with Disabilities (Divyangjan):</strong> Require Universal Disability ID (UDID) cards, assistive equipment grants, and transport concessions.</li>
                  <li><strong>District Nodal Officers & Administrators:</strong> Require real-time telemetry, SLA tracking for grievances, and fraud anomaly detection.</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs">1.3 Scope & Functional Features</h4>
                <p>
                  • <strong>AI Assistant:</strong> Conversational assistant powered by Gemini 3.6 Flash supporting 12 Indian languages with voice input & speech synthesis.<br />
                  • <strong>Automated Scheme Matching:</strong> Instant eligibility score calculation comparing age, gender, occupation, income, and category against 25+ central schemes.<br />
                  • <strong>OCR & AI Document Scanner:</strong> Instant scanning of Aadhaar, PAN, Income Certs, and Ration Cards with blurriness and expiration detection.<br />
                  • <strong>Encrypted Citizen Vault:</strong> AES-256 storage for verified ID proofs with DigiLocker-compliant auto-fill.<br />
                  • <strong>AI Grievance Portal:</strong> Legal & administrative complaint letter writer with CPGRAMS ticket tracking.<br />
                  • <strong>GPS Office Finder:</strong> Real-time distance and token queue estimator for CSC Seva Kendras, Tehsildar offices, and Ration Depots.
                </p>
              </div>
            </div>
          )}

          {activeDocTab === 'srs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-indigo-600">SECTION 2: SYSTEM REQUIREMENTS SPECIFICATION (SRS)</h3>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs">2.1 Non-Functional Performance Metrics</h4>
                <p>
                  • <strong>Response Latency:</strong> Sub-300ms API response time for scheme queries; sub-1.2s for Gemini GenAI chat stream.<br />
                  • <strong>Scalability:</strong> Horizontally scalable Cloud Run container instance with auto-scaling from 1 to 50 pods.<br />
                  • <strong>Availability SLA:</strong> 99.95% uptime with failover across regional Availability Zones.<br />
                  • <strong>Security:</strong> DPDP Act 2023 compliance, TLS 1.3 encryption in transit, AES-256 in storage, JWT session authorization.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs">2.2 Accessibility Standards (WCAG 2.1 AA)</h4>
                <p>
                  • High Contrast mode toggle for low-vision users.<br />
                  • Dynamic font size scaling (A / A+).<br />
                  • Full keyboard navigation with explicit focus outlines (`focus:border-indigo-500`).<br />
                  • ARIA labels across all buttons and interactive controls.<br />
                  • Web Speech Synthesis API voice reader integration for illiterate/visually impaired citizens.
                </p>
              </div>
            </div>
          )}

          {activeDocTab === 'arch' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-indigo-600">SECTION 3: SOFTWARE ARCHITECTURE & DIAGRAMS</h3>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs">3.1 System Architecture Topology</h4>
                <div className="bg-slate-900 p-3 rounded border border-slate-800 font-mono text-[11px] text-indigo-300 leading-normal whitespace-pre">
{`+-----------------------------------------------------------------------+
|                         CITIZEN BROWSER / PWA                         |
|   React 19 + TypeScript + Tailwind CSS + Lucide Icons + Web Speech    |
+-----------------------------------------------------------------------+
                                   | (REST API / JSON)
                                   v
+-----------------------------------------------------------------------+
|                    EXPRESS.JS SERVER ENGINE (PORT 3000)                |
|  - Auth & Role Guard Middleware                                       |
|  - Gemini GenAI SDK Adapter (Server-Side @google/genai)               |
|  - OCR Document Analysis Controller                                   |
|  - Grievance Complaint Writer Engine                                  |
|  - In-Memory Schemes & Offices Store                                  |
+-----------------------------------------------------------------------+
         |                                             |
         v                                             v
+------------------------+                  +---------------------------+
|  GEMINI 3.6 FLASH API  |                  |  GOOGLE MAPS & LOCATION   |
|  Server API Proxy      |                  |  Seva Kendra Locator      |
+------------------------+                  +---------------------------+`}
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'db' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-indigo-600">SECTION 4: DATABASE SCHEMA DESIGN</h3>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs">4.1 Schema Definition (TypeScript & Drizzle Equivalent)</h4>
                <pre className="bg-slate-900 p-3 rounded border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
{`// Citizens Profile Entity
export interface CitizenProfile {
  id: string; // UUID primary key
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  annualIncome: number;
  state: string;
  district: string;
  isFarmer: boolean;
  isBPL: boolean;
}

// Schemes Catalog Entity
export interface SchemeEntity {
  id: string;
  code: string;
  title: string;
  ministry: string;
  category: SchemeCategory;
  financialAssistance: string;
  documentsRequired: string[];
}`}
                </pre>
              </div>
            </div>
          )}

          {activeDocTab === 'api' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-indigo-600">SECTION 5: REST API SPECIFICATION</h3>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs">5.1 Core Endpoint Catalog</h4>
                <ul className="space-y-2 font-mono text-[11px]">
                  <li className="p-2 bg-white rounded border border-slate-200 shadow-sm">
                    <span className="text-emerald-700 font-bold">POST</span> <span className="text-slate-900">/api/chat</span> - AI Assistant multi-turn conversation with Gemini 3.6 Flash.
                  </li>
                  <li className="p-2 bg-white rounded border border-slate-200 shadow-sm">
                    <span className="text-indigo-700 font-bold">GET</span> <span className="text-slate-900">/api/schemes</span> - Returns catalog filtered by category, search query, or state.
                  </li>
                  <li className="p-2 bg-white rounded border border-slate-200 shadow-sm">
                    <span className="text-emerald-700 font-bold">POST</span> <span className="text-slate-900">/api/eligibility-check</span> - Multi-attribute AI eligibility evaluation engine.
                  </li>
                  <li className="p-2 bg-white rounded border border-slate-200 shadow-sm">
                    <span className="text-emerald-700 font-bold">POST</span> <span className="text-slate-900">/api/ocr-scan</span> - Multimodal AI document scanning & validity detection.
                  </li>
                  <li className="p-2 bg-white rounded border border-slate-200 shadow-sm">
                    <span className="text-emerald-700 font-bold">POST</span> <span className="text-slate-900">/api/grievances/draft</span> - AI legal & administrative complaint letter writer.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeDocTab === 'sprint' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-indigo-600">SECTION 6: SPRINT PLANNING & ROADMAP</h3>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs">6.1 Sprint Execution Strategy</h4>
                <p>
                  • <strong>Sprint 1 (Core Foundation):</strong> Express server setup, Gemini GenAI integration, Scheme database catalog.<br />
                  • <strong>Sprint 2 (AI Intelligence):</strong> Conversational assistant, eligibility matrix, multi-language support.<br />
                  • <strong>Sprint 3 (OCR & Security):</strong> Multimodal document scanner, Citizen Vault, DPDP compliance.<br />
                  • <strong>Sprint 4 (Redressal & Geo):</strong> Grievance drafter, Seva Kendra locator, Admin telemetry dashboard.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
