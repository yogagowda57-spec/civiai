import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ApplicationRecord, CitizenProfile } from '../types';

interface ApplicationTrackerProps {
  activePersona: CitizenProfile;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ activePersona }) => {
  const [applications, setApplications] = useState<ApplicationRecord[]>([
    {
      id: 'app-101',
      applicationNumber: 'CIVI-PMK-2026-9812',
      schemeId: 'pm-kisan',
      schemeTitle: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      applicantName: activePersona.name,
      appliedDate: '2026-07-28',
      status: 'Nodal Inspection',
      currentStageIndex: 2,
      stages: [
        { title: 'Application Submitted', date: '2026-07-28', completed: true, remark: 'Aadhaar eKYC verified' },
        { title: 'Document Verification', date: '2026-07-30', completed: true, remark: 'Land RTC verified by Village Accountant' },
        { title: 'District Nodal Approval', date: '2026-08-02', completed: true, remark: 'Inspected and recommended' },
        { title: 'DBT Direct Disbursal', completed: false, remark: 'Scheduled for next installment cycle' }
      ],
      remarks: 'Application verified by Mandya District Agricultural Officer.',
      benefitAmount: '₹2,000 Next Installment'
    },
    {
      id: 'app-102',
      applicationNumber: 'CIVI-AB-2026-4410',
      schemeId: 'ayushman-bharat',
      schemeTitle: 'Ayushman Bharat PM-JAY Health Card',
      applicantName: activePersona.name,
      appliedDate: '2026-08-01',
      status: 'Approved',
      currentStageIndex: 3,
      stages: [
        { title: 'Online Form & Ration Card Link', date: '2026-08-01', completed: true },
        { title: 'Biometric Verification', date: '2026-08-02', completed: true },
        { title: 'Digital Card Generation', date: '2026-08-03', completed: true },
        { title: 'Ayushman Card Active', date: '2026-08-03', completed: true }
      ],
      remarks: 'Card active and available for download in Vault.',
      benefitAmount: '₹5 Lakh Annual Cover'
    }
  ]);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              Real-Time Tracker
            </span>
            <span className="text-xs text-slate-500">• Direct Portal Lifecycle Monitoring</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Scheme Application Status ({applications.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track submitted applications, nodal officer inspections, and Direct Benefit Transfer (DBT) bank disbursals.
          </p>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded uppercase">
                  {app.applicationNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{app.schemeTitle}</h3>
                <p className="text-xs text-slate-500">Applied on: <strong className="text-slate-800">{app.appliedDate}</strong> | Applicant: <strong className="text-slate-800">{app.applicantName}</strong></p>
              </div>

              <div className="text-right">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {app.status}
                </span>
                <p className="text-xs text-emerald-700 font-bold mt-1">{app.benefitAmount}</p>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {app.stages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    stage.completed
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Stage {idx + 1}</span>
                    {stage.completed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="font-bold text-slate-900">{stage.title}</p>
                  {stage.date && <p className="text-[10px] text-slate-500">{stage.date}</p>}
                  {stage.remark && <p className="text-[10px] text-emerald-700 italic">{stage.remark}</p>}
                </div>
              ))}
            </div>

            {/* Application Receipt Action */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
              <span className="text-slate-500">Remark: <strong className="text-slate-800">{app.remarks}</strong></span>
              <button
                onClick={() => alert(`Downloading official acknowledgment receipt for ${app.applicationNumber}`)}
                className="text-xs bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-200 font-bold flex items-center gap-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Download Acknowledgment PDF</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
