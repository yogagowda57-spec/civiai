import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw,
  Plus
} from 'lucide-react';
import { CitizenProfile, GrievanceTicket } from '../types';

interface GrievancePortalProps {
  activePersona: CitizenProfile;
}

export const GrievancePortal: React.FC<GrievancePortalProps> = ({ activePersona }) => {
  const [grievances, setGrievances] = useState<GrievanceTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [drafting, setDrafting] = useState(false);
  
  // Form State
  const [department, setDepartment] = useState('PDS & Food Civil Supplies');
  const [subject, setSubject] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');

  const fetchGrievances = async () => {
    try {
      const res = await fetch('/api/grievances');
      const data = await res.json();
      setGrievances(data.grievances || []);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleGenerateAILetter = async () => {
    if (!subject.trim() || !issueDetails.trim()) {
      alert('Please enter subject and issue details to generate letter.');
      return;
    }

    setDrafting(true);
    try {
      const res = await fetch('/api/grievances/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department,
          subject,
          issueDetails,
          complainant: {
            name: activePersona.name,
            district: activePersona.district,
            state: activePersona.state
          }
        }),
      });

      const data = await res.json();
      setGeneratedLetter(data.draftLetter || '');
    } catch (e) {
      setGeneratedLetter(`To,\nThe Nodal Officer,\n${department}\n\nSubject: Formal Complaint Regarding ${subject}\n\nRespected Sir/Madam,\n\nI am writing to log an official grievance regarding ${issueDetails}.\n\nYours faithfully,\n${activePersona.name}`);
    } finally {
      setDrafting(false);
    }
  };

  const handleSubmitGrievance = async () => {
    if (!subject.trim() || !issueDetails.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department,
          subject,
          description: issueDetails,
          aiGeneratedLetter: generatedLetter,
          complainantName: activePersona.name,
          complainantPhone: '+91 98765 43210',
          complainantDistrict: activePersona.district,
          state: activePersona.state,
          priority: 'High'
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubject('');
        setIssueDetails('');
        setGeneratedLetter('');
        fetchGrievances();
      }
    } catch (e) {
      alert('Failed to register grievance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              CPGRAMS & State Portal Sync
            </span>
            <span className="text-xs text-slate-500">• Automated Legal & Administrative Complaints</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            AI Complaint Portal & Legal Letter Drafter
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Have you faced service delays, bribe demands, or illegal denials? CiviAI automatically writes formal administrative complaint letters and files official tickets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Complaint Form & AI Writer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Log New Complaint
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Target Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 shadow-sm"
            >
              <option value="PDS & Food Civil Supplies">PDS & Food Civil Supplies (Ration Shops)</option>
              <option value="Revenue & Land Mutation">Revenue & Land Mutation (Tehsildar)</option>
              <option value="Public Works & Roads (PWD)">Public Works & Roads (PWD)</option>
              <option value="Rural Development & Panchayat">Rural Development & Panchayat (MGNREGA)</option>
              <option value="Health & Family Welfare">Health & Family Welfare (Hospitals)</option>
              <option value="Electricity Board (DISCOM)">Electricity Board (DISCOM)</option>
              <option value="Urban Municipal Administration">Urban Municipal Administration</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Complaint Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Non-distribution of ration / Bribe demand for caste cert"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Issue Details in Plain Words</label>
            <textarea
              rows={3}
              value={issueDetails}
              onChange={(e) => setIssueDetails(e.target.value)}
              placeholder="Explain what happened, dates, office location, and officer names if known..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>

          <button
            onClick={handleGenerateAILetter}
            disabled={drafting || !subject.trim() || !issueDetails.trim()}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-4 py-2.5 rounded-xl transition-colors border border-indigo-200 text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            {drafting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-600" />}
            <span>Draft Legal Complaint Letter with AI</span>
          </button>

          {/* AI Generated Letter Preview */}
          {generatedLetter && (
            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-bold text-emerald-700 uppercase block">Preview AI Generated Formal Complaint Letter</label>
              <textarea
                rows={8}
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs leading-relaxed font-mono focus:outline-none shadow-sm"
              />

              <button
                onClick={handleSubmitGrievance}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm text-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Register Ticket & Send to District Magistrate</span>
              </button>
            </div>
          )}
        </div>

        {/* Existing Tickets List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" /> Active Complaint Tickets ({grievances.length})
          </h3>

          <div className="space-y-4">
            {grievances.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded uppercase">
                    {ticket.ticketNumber}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {ticket.status}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900">{ticket.subject}</h4>
                <p className="text-[11px] text-slate-500">Department: <strong className="text-slate-800">{ticket.department}</strong></p>
                <p className="text-[11px] text-slate-500">Assigned Officer: <strong className="text-emerald-700">{ticket.assignedOfficer || 'Pending Assignment'}</strong></p>
                
                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
                  <span>Filed on: {ticket.createdAt}</span>
                  <span className="text-indigo-600 font-bold">Priority: {ticket.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
