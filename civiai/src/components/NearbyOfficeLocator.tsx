import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Users, 
  Navigation, 
  Search, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { GovOffice, CitizenProfile } from '../types';
import { SAMPLE_GOV_OFFICES } from '../data/offices';

interface NearbyOfficeLocatorProps {
  activePersona: CitizenProfile;
}

export const NearbyOfficeLocator: React.FC<NearbyOfficeLocatorProps> = ({ activePersona }) => {
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');

  const filteredOffices = SAMPLE_GOV_OFFICES.filter(o => {
    const matchesType = selectedType === 'All' || o.type === selectedType;
    const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase()) || 
      o.servicesProvided.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              GPS Location Finder
            </span>
            <span className="text-xs text-slate-500">• Location Context: <strong className="text-slate-800">{activePersona.district}, {activePersona.state}</strong></span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Nearby Government Offices & Seva Kendras
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Locate Common Service Centres (CSC), Tehsildar offices, Aadhaar Kendras, Ration Depots, and Post Offices with live token queue status.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Aadhaar, eKYC, Land records..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['All', 'CSC Seva Kendra', 'Tehsildar Office', 'Aadhaar Enrolment Center', 'Ration Shop (FPS)', 'District Collectorate'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedType === t
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Office Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOffices.map((office) => (
          <div
            key={office.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded uppercase">
                  {office.type}
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {office.distanceKm} km away
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900">{office.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{office.address}</p>

              {/* Operating Hours & Queue */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">Hours</span>
                  <p className="font-semibold text-slate-800 text-[11px]">{office.operatingHours}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">Live Queue Token</span>
                  <p className="font-bold text-indigo-700 text-[11px]">{office.currentTokenQueue} People • ~{office.estimatedWaitMinutes}m Wait</p>
                </div>
              </div>

              {/* Services Provided */}
              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Services Offered</span>
                <div className="flex flex-wrap gap-1.5">
                  {office.servicesProvided.map((s, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <a
                href={`tel:${office.contactNumber}`}
                className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>{office.contactNumber}</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${office.latitude},${office.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
