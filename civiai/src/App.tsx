import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AIChatAssistant } from './components/AIChatAssistant';
import { SchemeDiscovery } from './components/SchemeDiscovery';
import { EligibilityChecker } from './components/EligibilityChecker';
import { OCRDocValidator } from './components/OCRDocValidator';
import { DocumentVault } from './components/DocumentVault';
import { ApplicationTracker } from './components/ApplicationTracker';
import { GrievancePortal } from './components/GrievancePortal';
import { NearbyOfficeLocator } from './components/NearbyOfficeLocator';
import { AdminAnalyticsDashboard } from './components/AdminAnalyticsDashboard';
import { PRDDocModal } from './components/PRDDocModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';

import { PRESET_PERSONAS } from './data/personas';
import { CitizenProfile, DocumentVaultItem, Language, Scheme, UserRole } from './types';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('English');
  const [activePersona, setActivePersona] = useState<CitizenProfile>(PRESET_PERSONAS[0]);
  const [activeTab, setActiveTab] = useState<string>('chat');
  
  // Accessibility
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  // Modals
  const [showPRD, setShowPRD] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Selected Scheme context for eligibility checking
  const [selectedSchemeForCheck, setSelectedSchemeForCheck] = useState<Scheme | null>(null);

  // Document Vault State
  const [vaultItems, setVaultItems] = useState<DocumentVaultItem[]>([
    {
      id: 'v-101',
      docType: 'Aadhaar',
      documentNumber: 'XXXX-XXXX-9812',
      holderName: activePersona.name,
      issueDate: '2020-05-12',
      issuingAuthority: 'UIDAI',
      verificationStatus: 'Verified'
    },
    {
      id: 'v-102',
      docType: 'Income Certificate',
      documentNumber: 'RD00398211029',
      holderName: activePersona.name,
      issueDate: '2025-04-10',
      expiryDate: '2027-03-31',
      issuingAuthority: 'Tehsildar Mandya',
      verificationStatus: 'Verified'
    }
  ]);

  const handleSaveToVault = (newDoc: DocumentVaultItem) => {
    setVaultItems(prev => [newDoc, ...prev]);
  };

  const handleRemoveDoc = (id: string) => {
    setVaultItems(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all ${
      highContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-900'
    } ${fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
      
      {/* Platform Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        activePersona={activePersona}
        personas={PRESET_PERSONAS}
        onSelectPersona={(p) => setActivePersona(p)}
        onOpenPRD={() => setShowPRD(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        unreadCount={2}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        fontSize={fontSize}
        setFontSize={setFontSize}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Router Content */}
      <main className="flex-1 pb-12">
        {activeTab === 'chat' && (
          <AIChatAssistant
            activePersona={activePersona}
            currentLanguage={currentLanguage}
            onSelectScheme={(scheme) => setSelectedSchemeForCheck(scheme)}
            onNavigateToEligibility={() => setActiveTab('eligibility')}
            onNavigateToGrievance={() => setActiveTab('grievance')}
            onNavigateToVault={() => setActiveTab('vault')}
          />
        )}

        {activeTab === 'schemes' && (
          <SchemeDiscovery
            activePersona={activePersona}
            onSelectSchemeForCheck={(scheme) => setSelectedSchemeForCheck(scheme)}
            onNavigateToEligibility={() => setActiveTab('eligibility')}
          />
        )}

        {activeTab === 'eligibility' && (
          <EligibilityChecker
            activePersona={activePersona}
            selectedScheme={selectedSchemeForCheck}
            onSelectScheme={(scheme) => setSelectedSchemeForCheck(scheme)}
            onNavigateToVault={() => setActiveTab('vault')}
            onNavigateToGrievance={() => setActiveTab('grievance')}
          />
        )}

        {activeTab === 'ocr' && (
          <OCRDocValidator
            activePersona={activePersona}
            onSaveToVault={handleSaveToVault}
            onNavigateToVault={() => setActiveTab('vault')}
          />
        )}

        {activeTab === 'vault' && (
          <DocumentVault
            activePersona={activePersona}
            vaultItems={vaultItems}
            onAddNewDoc={() => setActiveTab('ocr')}
            onRemoveDoc={handleRemoveDoc}
          />
        )}

        {activeTab === 'tracker' && (
          <ApplicationTracker activePersona={activePersona} />
        )}

        {activeTab === 'grievance' && (
          <GrievancePortal activePersona={activePersona} />
        )}

        {activeTab === 'offices' && (
          <NearbyOfficeLocator activePersona={activePersona} />
        )}

        {activeTab === 'admin' && (
          <AdminAnalyticsDashboard />
        )}
      </main>

      {/* Platform Footer */}
      <Footer />

      {/* PRD & Architectural Documentation Slide-Over / Modal */}
      <PRDDocModal isOpen={showPRD} onClose={() => setShowPRD(false)} />

      {/* Notifications Drawer Modal */}
      <NotificationCenterModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

    </div>
  );
}
