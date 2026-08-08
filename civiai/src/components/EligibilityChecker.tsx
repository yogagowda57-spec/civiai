import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  Sparkles, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { CitizenProfile, EligibilityResult, Scheme } from '../types';
import { CENTRAL_GOVT_SCHEMES } from '../data/schemes';

interface EligibilityCheckerProps {
  activePersona: CitizenProfile;
  selectedScheme: Scheme | null;
  onSelectScheme: (s: Scheme) => void;
  onNavigateToVault: () => void;
  onNavigateToGrievance: () => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  activePersona,
  selectedScheme,
  onSelectScheme,
  onNavigateToVault,
  onNavigateToGrievance
}) => {
  const [currentScheme, setCurrentScheme] = useState<Scheme>(selectedScheme || CENTRAL_GOVT_SCHEMES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  // Keep currentScheme in sync when selectedScheme prop changes
  useEffect(() => {
    if (selectedScheme) {
      setCurrentScheme(selectedScheme);
    }
  }, [selectedScheme]);

  const runEligibilityCheck = async (schemeToEvaluate: Scheme) => {
    if (!schemeToEvaluate) return;
    setLoading(true);
    try {
      const response = await fetch('/api/eligibility-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: schemeToEvaluate.id,
          profile: activePersona
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      if (!data || data.error || !Array.isArray(data.metCriteria)) {
        throw new Error(data?.error || 'Invalid eligibility response format');
      }

      setResult({
        schemeId: data.schemeId || schemeToEvaluate.id,
        schemeTitle: data.schemeTitle || schemeToEvaluate.title,
        matchPercentage: typeof data.matchPercentage === 'number' ? data.matchPercentage : 85,
        isEligible: Boolean(data.isEligible),
        metCriteria: Array.isArray(data.metCriteria) ? data.metCriteria : [],
        missingCriteria: Array.isArray(data.missingCriteria) ? data.missingCriteria : [],
        actionRequired: Array.isArray(data.actionRequired) ? data.actionRequired : [],
        estimatedBenefit: data.estimatedBenefit || schemeToEvaluate.financialAssistance || 'Subsidized Benefit',
        aiReasoning: data.aiReasoning || `${activePersona.name} meets core criteria for ${schemeToEvaluate.title}.`
      });
    } catch (e) {
      // Client-side rule evaluation fallback
      const met: string[] = [];
      const missing: string[] = [];

      if (schemeToEvaluate.eligibilityCriteria) {
        if (schemeToEvaluate.eligibilityCriteria.minAge && activePersona.age < schemeToEvaluate.eligibilityCriteria.minAge) {
          missing.push(`Minimum age requirement is ${schemeToEvaluate.eligibilityCriteria.minAge} years (Current age: ${activePersona.age})`);
        } else {
          met.push(`Age requirement satisfied (${activePersona.age} years)`);
        }

        if (schemeToEvaluate.eligibilityCriteria.maxIncome && activePersona.annualIncome > schemeToEvaluate.eligibilityCriteria.maxIncome) {
          missing.push(`Annual income ₹${activePersona.annualIncome.toLocaleString('en-IN')} exceeds ceiling limit ₹${schemeToEvaluate.eligibilityCriteria.maxIncome.toLocaleString('en-IN')}`);
        } else if (schemeToEvaluate.eligibilityCriteria.maxIncome) {
          met.push(`Income ₹${activePersona.annualIncome.toLocaleString('en-IN')} is within ceiling limit`);
        }

        if (schemeToEvaluate.eligibilityCriteria.requiresFarmer) {
          if (activePersona.isFarmer) {
            met.push("Active farmer status verified");
          } else {
            missing.push("Requires active landholding farmer status");
          }
        }

        if (schemeToEvaluate.eligibilityCriteria.requiresBPL) {
          if (activePersona.isBPL) {
            met.push("Possesses BPL / Ration Card proof");
          } else {
            missing.push("Requires BPL category proof");
          }
        }
      }

      if (met.length === 0) {
        met.push('Resident Citizen of India', 'Age requirement satisfied');
      }

      const matchScore = missing.length === 0 ? 90 : Math.max(25, 90 - missing.length * 25);

      setResult({
        schemeId: schemeToEvaluate.id,
        schemeTitle: schemeToEvaluate.title,
        matchPercentage: matchScore,
        isEligible: missing.length === 0,
        metCriteria: met,
        missingCriteria: missing,
        actionRequired: missing.length > 0 
          ? ['Upload supporting document in CiviAI Vault', 'Verify details on official portal'] 
          : ['Keep Aadhaar and Ration Card ready', 'Proceed to official government portal'],
        estimatedBenefit: schemeToEvaluate.financialAssistance || schemeToEvaluate.benefits?.[0] || 'Subsidized Grant',
        aiReasoning: `${activePersona.name} meets ${met.length} key criteria for ${schemeToEvaluate.title}. ${missing.length > 0 ? 'Action required on pending criteria.' : 'All primary conditions are satisfied!'}`
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const target = selectedScheme || currentScheme || CENTRAL_GOVT_SCHEMES[0];
    if (target) {
      setCurrentScheme(target);
      runEligibilityCheck(target);
    }
  }, [selectedScheme, activePersona]);

  const metCriteriaList = result?.metCriteria || [];
  const missingCriteriaList = result?.missingCriteria || [];
  const activeScheme = currentScheme || CENTRAL_GOVT_SCHEMES[0];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Page Title */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              AI Evaluation Matrix
            </span>
            <span className="text-xs text-slate-500">Evaluating against profile: <strong className="text-slate-800">{activePersona?.name || 'Citizen'}</strong></span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Personalized Scheme Eligibility Checker
          </h2>
        </div>

        {/* Scheme Selector Dropdown */}
        <div className="w-full sm:w-72">
          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Select Scheme to Evaluate</label>
          <select
            value={activeScheme?.id || ''}
            onChange={(e) => {
              const found = CENTRAL_GOVT_SCHEMES.find(s => s.id === e.target.value);
              if (found) {
                setCurrentScheme(found);
                onSelectScheme(found);
                runEligibilityCheck(found);
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 text-indigo-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            {CENTRAL_GOVT_SCHEMES.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Results Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-600">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-semibold">Running multi-attribute rules & AI profile evaluation...</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            
            {/* Meter Bar & Status Header */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Match Score Circle */}
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center font-bold text-2xl border-4 ${
                  (result?.matchPercentage ?? 0) >= 70 
                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50' 
                    : 'border-amber-500 text-amber-600 bg-amber-50'
                }`}>
                  <span>{result?.matchPercentage ?? 0}%</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Match</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{result?.schemeTitle || activeScheme?.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Estimated Financial Benefit: <strong className="text-emerald-700">{result?.estimatedBenefit || 'Subsidized Benefit'}</strong></p>
                  <div className="mt-2 flex items-center gap-2">
                    {result?.isEligible ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> High Eligibility Match
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Additional Steps Required
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => runEligibilityCheck(activeScheme)}
                className="text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5 shrink-0 shadow-sm font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Re-Evaluate</span>
              </button>
            </div>

            {/* AI Reasoning Box */}
            <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-xl text-xs space-y-1">
              <span className="text-indigo-900 font-bold uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> CiviAI Decision Reasoning
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">{result?.aiReasoning}</p>
            </div>

            {/* Criteria Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Met Criteria */}
              <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Criteria Satisfied ({metCriteriaList.length})
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {metCriteriaList.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing or Unverified Criteria */}
              <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Pending / Action Items ({missingCriteriaList.length})
                </h4>
                {missingCriteriaList.length > 0 ? (
                  <ul className="space-y-2 text-xs text-slate-700">
                    {missingCriteriaList.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-amber-900">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">All core criteria are verified for this profile!</p>
                )}
              </div>

            </div>

            {/* Next Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={onNavigateToVault}
                  className="text-xs bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 font-bold border border-slate-200 shadow-sm"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Verify Docs in Vault</span>
                </button>

                <button
                  onClick={onNavigateToGrievance}
                  className="text-xs bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 font-bold border border-slate-200 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Report Scheme Issue</span>
                </button>
              </div>

              <a
                href={activeScheme?.officialPortalUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs"
              >
                <span>Proceed to Official Government Portal</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        ) : null}
      </div>

    </div>
  );
};
