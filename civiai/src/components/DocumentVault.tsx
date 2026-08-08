import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { DocumentVaultItem, CitizenProfile } from '../types';

interface DocumentVaultProps {
  activePersona: CitizenProfile;
  vaultItems: DocumentVaultItem[];
  onAddNewDoc: () => void;
  onRemoveDoc: (id: string) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  activePersona,
  vaultItems,
  onAddNewDoc,
  onRemoveDoc
}) => {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              Encrypted Citizen Vault
            </span>
            <span className="text-xs text-slate-500">• DigiLocker Compliant • AES-256 Storage</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Digital Document Vault ({vaultItems.length} Saved)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Store and manage verified government IDs, income certificates, and land records for 1-click scheme application auto-fill.
          </p>
        </div>

        <button
          onClick={onAddNewDoc}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Scan & Add New Document</span>
        </button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaultItems.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all relative group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded uppercase">
                  {doc.docType}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {doc.verificationStatus}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900">{doc.holderName}</h3>
              <p className="text-xs font-bold text-indigo-600 tracking-wider mt-1">{doc.documentNumber}</p>
              
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <p>Issuing Authority: <strong className="text-slate-800">{doc.issuingAuthority}</strong></p>
                <p>Issued Date: <strong className="text-slate-800">{doc.issueDate}</strong></p>
                {doc.expiryDate && (
                  <p className="text-amber-700 font-medium">Expires: {doc.expiryDate}</p>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => alert(`Downloading verified copy of ${doc.docType}`)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={() => onRemoveDoc(doc.id)}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
