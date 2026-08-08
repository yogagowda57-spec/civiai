import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Info, 
  ExternalLink,
  ChevronRight,
  X,
  UserCheck,
  Zap,
  Award
} from 'lucide-react';
import { CitizenProfile, Scheme, SchemeCategory } from '../types';
import { CENTRAL_GOVT_SCHEMES } from '../data/schemes';

interface SchemeDiscoveryProps {
  activePersona: CitizenProfile;
  onSelectSchemeForCheck: (s: Scheme) => void;
  onNavigateToEligibility: () => void;
}

const CATEGORIES: (SchemeCategory | 'All')[] = [
  'All',
  'Agriculture & Farming',
  'Education & Scholarships',
  'Healthcare & Insurance',
  'Women & Child Welfare',
  'Pensions & Social Security',
  'Housing & Sanitation',
  'Entrepreneurship & MSME',
  'Employment & Skill Training',
  'Disability Empowerment',
];

export const SchemeDiscovery: React.FC<SchemeDiscoveryProps> = ({
  activePersona,
  onSelectSchemeForCheck,
  onNavigateToEligibility
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalScheme, setActiveModalScheme] = useState<Scheme | null>(null);

  // Compute AI Recommendations based on active persona
  const recommendedSchemes = useMemo(() => {
    return CENTRAL_GOVT_SCHEMES.map(scheme => {
      let score = 55;
      const reasons: string[] = [];
      const criteria = scheme.eligibilityCriteria;

      if (criteria) {
        if (criteria.requiresFarmer) {
          if (activePersona.isFarmer) {
            score += 35;
            reasons.push('Farmer status verified');
          } else {
            score -= 40;
          }
        }
        if (criteria.requiresStudent) {
          if (activePersona.isStudent) {
            score += 35;
            reasons.push('Student status verified');
          } else {
            score -= 40;
          }
        }
        if (criteria.requiresDisability) {
          if (activePersona.isDisabled) {
            score += 35;
            reasons.push('Disability empowerment match');
          } else {
            score -= 40;
          }
        }
        if (criteria.isSeniorCitizen) {
          if (activePersona.isSeniorCitizen || activePersona.age >= 60) {
            score += 30;
            reasons.push('Senior Citizen benefit');
          } else {
            score -= 30;
          }
        }
        if (criteria.requiresBPL) {
          if (activePersona.isBPL) {
            score += 25;
            reasons.push('BPL category eligible');
          } else {
            score -= 20;
          }
        }
        if (criteria.genderFilter && criteria.genderFilter !== 'all') {
          if (criteria.genderFilter === activePersona.gender) {
            score += 20;
            reasons.push(`Tailored for ${activePersona.gender} citizens`);
          } else {
            score -= 40;
          }
        }
        if (criteria.maxIncome) {
          if (activePersona.annualIncome <= criteria.maxIncome) {
            score += 20;
            reasons.push('Income within ceiling');
          } else {
            score -= 25;
          }
        }
        if (criteria.allowedCategories && criteria.allowedCategories.length > 0) {
          if (criteria.allowedCategories.includes(activePersona.socialCategory)) {
            score += 20;
            reasons.push(`${activePersona.socialCategory} reservation match`);
          }
        }
      }

      if (activePersona.isFarmer && (scheme.category === 'Agriculture & Farming' || scheme.tags.includes('Farmers'))) {
        if (!reasons.includes('Farmer status verified')) reasons.push('Agriculture & Farming');
        score += 15;
      }
      if (activePersona.isStudent && (scheme.category === 'Education & Scholarships' || scheme.tags.includes('Education'))) {
        if (!reasons.includes('Student status verified')) reasons.push('Education & Scholarship');
        score += 15;
      }
      if (activePersona.gender === 'female' && (scheme.category === 'Women & Child Welfare' || scheme.tags.includes('Women'))) {
        reasons.push('Women Empowerment');
        score += 15;
      }

      const finalScore = Math.min(98, Math.max(50, score));
      const reasonText = reasons.length > 0 ? reasons.slice(0, 2).join(' • ') : `${activePersona.occupation} profile match`;

      return {
        scheme,
        score: finalScore,
        reason: reasonText
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  }, [activePersona]);

  // Filter schemes
  const filteredSchemes = CENTRAL_GOVT_SCHEMES.filter(scheme => {
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesSearch = 
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Page Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              Central & State Catalog
            </span>
            <span className="text-xs text-slate-500">• {filteredSchemes.length} Active Schemes Available</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Government Scheme Discovery Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse through verified welfare benefits, subsidies, pensions, and financial grants for Indian citizens.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PM Kisan, Ayushman, Mudra..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* RECOMMENDED FOR YOU SECTION */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight text-white">Recommended for You</h3>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3" /> AI Matched
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Top schemes tailored for <strong className="text-white font-semibold">{activePersona.name}</strong> ({activePersona.occupation}, {activePersona.state}, Annual Income ₹{activePersona.annualIncome.toLocaleString('en-IN')})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs bg-indigo-950/60 border border-indigo-700/50 px-3 py-1.5 rounded-xl text-indigo-200 shrink-0">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Profile Persona: <strong className="text-white">{activePersona.socialCategory} / {activePersona.gender.toUpperCase()}</strong></span>
          </div>
        </div>

        {/* Recommended Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {recommendedSchemes.map(({ scheme, score, reason }) => (
            <div 
              key={`rec-${scheme.id}`}
              className="bg-indigo-950/70 border border-indigo-700/60 hover:border-indigo-400/80 rounded-xl p-4 flex flex-col justify-between transition-all hover:bg-indigo-900/80 group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {score}% Match
                  </span>
                  <span className="text-[10px] font-medium text-indigo-200 bg-indigo-900/80 px-2 py-0.5 rounded border border-indigo-700/40">
                    {scheme.category}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                  {scheme.title}
                </h4>

                <p className="text-[11px] font-medium text-indigo-300 mt-1 line-clamp-1">
                  {scheme.ministry}
                </p>

                <div className="mt-2.5 bg-indigo-900/60 border border-indigo-700/40 p-2 rounded-lg text-[11px] text-indigo-100 flex items-start gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{scheme.financialAssistance || scheme.benefits[0]}</span>
                </div>

                <p className="text-[10px] text-emerald-300/90 font-medium mt-2 flex items-center gap-1">
                  <span>•</span> {reason}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveModalScheme(scheme)}
                  className="text-xs text-indigo-200 hover:text-white font-medium flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Details</span>
                </button>

                <button
                  onClick={() => {
                    onSelectSchemeForCheck(scheme);
                    onNavigateToEligibility();
                  }}
                  className="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-md shrink-0"
                >
                  <span>Apply / Check</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all group hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                  {scheme.category}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {scheme.sponsoringBody}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {scheme.title}
              </h3>

              <p className="text-[11px] font-medium text-slate-500 mt-1">
                {scheme.ministry}
              </p>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
                {scheme.simplifiedDescription}
              </p>

              {/* Highlight Benefit */}
              <div className="mt-4 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="line-clamp-1">{scheme.financialAssistance || scheme.benefits[0]}</span>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveModalScheme(scheme)}
                className="text-xs text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>Details</span>
              </button>

              <button
                onClick={() => {
                  onSelectSchemeForCheck(scheme);
                  onNavigateToEligibility();
                }}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Check Eligibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Detail Modal */}
      {activeModalScheme && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative text-slate-900">
            
            <button
              onClick={() => setActiveModalScheme(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-800 p-1 rounded-lg bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                {activeModalScheme.category}
              </span>
              <span className="text-xs text-slate-400">{activeModalScheme.code}</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">{activeModalScheme.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{activeModalScheme.ministry}</p>

            <div className="my-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-700">Simplified Scheme Explanation</h4>
              <p className="text-xs text-slate-800 leading-relaxed">{activeModalScheme.simplifiedDescription}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-indigo-900 mb-2">Key Financial Benefits</h4>
                <ul className="space-y-1.5">
                  {activeModalScheme.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-indigo-900 mb-2">Mandatory Documents Required</h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalScheme.documentsRequired.map((doc, idx) => (
                    <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <a
                  href={activeModalScheme.officialPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Official Portal Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    onSelectSchemeForCheck(activeModalScheme);
                    setActiveModalScheme(null);
                    onNavigateToEligibility();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1 text-xs shadow-sm"
                >
                  <span>Run Instant AI Eligibility Test</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

