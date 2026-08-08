export type Language = 
  | 'English'
  | 'Hindi'
  | 'Kannada'
  | 'Tamil'
  | 'Telugu'
  | 'Malayalam'
  | 'Marathi'
  | 'Gujarati'
  | 'Bengali'
  | 'Punjabi'
  | 'Odia'
  | 'Urdu';

export type UserRole = 'citizen' | 'admin' | 'nodal_officer' | 'auditor';

export interface CitizenProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string; // e.g. 'Farmer', 'Student', 'Street Vendor', 'Artisan', 'Unemployed', 'Salaried', 'Self-Employed'
  education: string; // e.g. '10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Illiterate'
  annualIncome: number; // in INR
  state: string;
  district: string;
  areaType: 'rural' | 'urban';
  socialCategory: 'SC' | 'ST' | 'OBC' | 'General' | 'EWS';
  isFarmer: boolean;
  landHoldingAcres?: number;
  isStudent: boolean;
  isDisabled: boolean;
  disabilityPercentage?: number;
  isSeniorCitizen: boolean;
  isMinority: boolean;
  isBPL: boolean; // Below Poverty Line
  hasRationCard: boolean;
  rationCardType?: 'AAY' | 'BPL' | 'APL';
  avatarUrl?: string;
}

export type SchemeCategory = 
  | 'Agriculture & Farming'
  | 'Education & Scholarships'
  | 'Healthcare & Insurance'
  | 'Women & Child Welfare'
  | 'Pensions & Social Security'
  | 'Housing & Sanitation'
  | 'Entrepreneurship & MSME'
  | 'Employment & Skill Training'
  | 'Disability Empowerment'
  | 'Financial Inclusion';

export interface Scheme {
  id: string;
  title: string;
  titleHi?: string;
  code: string;
  ministry: string;
  category: SchemeCategory;
  sponsoringBody: 'Central' | 'State' | 'Joint';
  applicableStates?: string[]; // Empty for all India
  targetAudience: string[];
  summary: string;
  simplifiedDescription: string;
  benefits: string[];
  financialAssistance?: string;
  documentsRequired: string[];
  eligibilityCriteria: {
    minAge?: number;
    maxAge?: number;
    maxIncome?: number;
    genderFilter?: 'male' | 'female' | 'all';
    requiresFarmer?: boolean;
    requiresStudent?: boolean;
    requiresDisability?: boolean;
    requiresBPL?: boolean;
    isSeniorCitizen?: boolean;
    allowedCategories?: string[];
  };
  applicationMethod: 'Online' | 'Offline' | 'Hybrid';
  officialPortalUrl: string;
  deadlineDate?: string;
  isActive: boolean;
  tags: string[];
}

export interface EligibilityResult {
  schemeId: string;
  schemeTitle: string;
  matchPercentage: number;
  isEligible: boolean;
  metCriteria: string[];
  missingCriteria: string[];
  actionRequired: string[];
  estimatedBenefit: string;
  aiReasoning: string;
}

export interface DocumentVaultItem {
  id: string;
  docType: 'Aadhaar' | 'PAN' | 'Ration Card' | 'Income Certificate' | 'Domicile Certificate' | 'Disability Certificate' | 'Land Records' | 'Driving License' | 'Voter ID';
  documentNumber: string;
  holderName: string;
  issueDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  verificationStatus: 'Verified' | 'Pending' | 'Flagged' | 'Expired';
  fileUrl?: string;
  extractedData?: Record<string, string>;
  warnings?: string[];
}

export interface OCRScanResult {
  docType: string;
  confidenceScore: number;
  extractedFields: Record<string, string>;
  isValid: boolean;
  expiryStatus: 'Valid' | 'Near Expiry' | 'Expired';
  warnings: string[];
  missingDetails: string[];
  aiNotes: string;
}

export interface ApplicationRecord {
  id: string;
  applicationNumber: string;
  schemeId: string;
  schemeTitle: string;
  applicantName: string;
  appliedDate: string;
  status: 'Submitted' | 'Document Verification' | 'Nodal Inspection' | 'Approved' | 'Disbursed' | 'Rejected';
  currentStageIndex: number;
  stages: { title: string; date?: string; completed: boolean; remark?: string }[];
  remarks: string;
  benefitAmount?: string;
}

export interface GrievanceTicket {
  id: string;
  ticketNumber: string;
  department: string;
  subject: string;
  description: string;
  aiGeneratedLetter?: string;
  complainantName: string;
  complainantPhone: string;
  complainantDistrict: string;
  state: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Draft' | 'Submitted' | 'Under Investigation' | 'Escalated' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  assignedOfficer?: string;
  resolutionRemark?: string;
}

export interface GovOffice {
  id: string;
  name: string;
  type: 'CSC Seva Kendra' | 'Tehsildar Office' | 'Aadhaar Enrolment Center' | 'Ration Shop (FPS)' | 'District Collectorate' | 'Post Office' | 'Passport Kendra';
  address: string;
  district: string;
  state: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  contactNumber: string;
  operatingHours: string;
  servicesProvided: string[];
  currentTokenQueue: number;
  estimatedWaitMinutes: number;
  isOpenNow: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedSchemes?: Scheme[];
  actions?: { label: string; actionType: string; payload?: any }[];
  simplifiedText?: string;
  audioAvailable?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'scheme_deadline' | 'doc_expiry' | 'application_update' | 'grievance_alert' | 'recommendation';
  timestamp: string;
  isRead: boolean;
  linkAction?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
  details: string;
}
