export type Language = 'hi' | 'en';

export type ScreenTab = 
  | 'screen-home' 
  | 'screen-about'
  | 'screen-work'
  | 'screen-projects'
  | 'screen-services'
  | 'screen-events'
  | 'screen-constituency'
  | 'screen-ai'
  | 'screen-media'
  | 'screen-contact'
  | 'screen-voter'
  | 'screen-citizen-dashboard'
  | 'screen-admin'
  // Legacy compatibility tabs
  | 'screen-hisaab' 
  | 'screen-nivaran' 
  | 'screen-karyakarta'
  | 'screen-wards'
  | 'screen-vision'
  | 'screen-panna-pramukh'
  | 'screen-padyatra-beacon';

// --- RURAL CAPABILITY 1: PANNA PRAMUKH BOOTH COMPANION ---
export interface BoothVoterRecord {
  id: string; // Unique voter ID / EPIC No.
  boothNo: number; // e.g. Booth 41
  boothName: string; // e.g. राजकीय वरिष्ठ माध्यमिक विद्यालय, भदवार
  wardNo: number;
  sectionNo: number;
  serialNo: number;
  name: string;
  guardianName: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  houseNo: string;
  mobile?: string;
  isTurnoutMarked: boolean;
  turnoutTimestamp?: string;
  votedByPannaPramukhId?: string;
  sentimentTag?: 'SUPPORTER' | 'SWING' | 'OPPOSITION';
}

export interface OfflineDoorstepGrievance {
  id: string;
  clientTempId: string;
  boothNo: number;
  wardNo: number;
  citizenName: string;
  mobile: string;
  issueDescription: string;
  category: string;
  createdAt: string;
  syncStatus: 'QUEUED' | 'SYNCED' | 'FAILED';
}

// --- RURAL CAPABILITY 2: DIGITAL VOTER SLIP ---
export interface VoterSlipData {
  epicNo: string;
  name: string;
  guardianName: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  houseNo: string;
  boothNo: number;
  boothName: string;
  roomNo: string;
  partNo: number;
  serialNo: number;
  wardNo: number;
  locality: string;
  gpsCoordinates: { lat: number; lng: number };
  mapsUrl: string;
  assemblyConstituency: string; // 142 नूरपुर (कांगड़ा)
  candidateName: string; // रणबीर सिंह निक्का
}

// --- RURAL CAPABILITY 3: SARKARI YOJANA ENGINE ---
export interface YojanaItem {
  id: string;
  title: string;
  titleEn: string;
  department: string;
  benefitAmount: string;
  benefitPeriod: string;
  description: string;
  descriptionEn: string;
  eligibilityConditions: string[];
  documentsRequired: string[];
  applyLink?: string;
  category: 'welfare' | 'farming' | 'women' | 'energy' | 'health';
}

export interface YojanaUserAnswers {
  familyCategory: 'BPL' | 'ANTYODAYA' | 'GENERAL' | 'OBC' | 'SC_ST';
  landHolding: 'LANDLESS' | 'MARGINAL' | 'MEDIUM' | 'LARGE';
  annualIncomeRange: 'BELOW_1_5L' | '1_5L_TO_2_5L' | 'ABOVE_2_5L';
  hasGirlChild: boolean;
  hasDestituteOrOrphan: boolean;
  hasSeniorCitizen: boolean;
  hasWoman18To59: boolean;
  isPracticingFarmer: boolean;
  hasConcreteRoof: boolean;
  hasTapConnection: boolean;
}

// --- RURAL CAPABILITY 4: MLA RECOMMENDATION LETTER ---
export interface MlaLetterRecord {
  dispatchNo: string; // e.g. RSN/MLA/2026/0412
  citizenName: string;
  guardianName: string;
  villageOrWard: string;
  mobile: string;
  category: string;
  subject: string;
  targetOfficer: string;
  targetDepartment: string;
  letterBodyHindi: string;
  issuedAt: string;
  qrCodeToken: string;
}

// --- RURAL CAPABILITY 5: PADYATRA LIVE BEACON ---
export interface WardCentroid {
  wardNo: number;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  population: number;
}

export interface PadyatraBeaconState {
  isActive: boolean;
  currentLat: number;
  currentLng: number;
  speedKmH: number;
  currentLocationName: string;
  currentWardNo: number;
  nextWardNo: number;
  nextStopName: string;
  estimatedArrivalMin: number;
  lastUpdated: string;
  announcement: string;
  proximityAlerts: {
    wardNo: number;
    distanceKm: number;
    isApproaching: boolean;
    smsSentCount: number;
  }[];
}

// --- RURAL CAPABILITY 6: DAILY JANVANI BULLETIN ---
export interface DailyBulletinData {
  id: string;
  date: string;
  headline: string;
  headlineEn: string;
  scheduleSummary: string;
  solvedGrievanceHighlight: string;
  farmerAdvisory: string;
  audioBase64?: string;
  durationSeconds: number;
  broadcastWhatsAppCount: number;
}



export interface WarRoomAuditEntry {
  id: string;
  time: string;
  ward: string;
  action: string;
  officer: string;
  amount: string;
  status: string;
}

export interface CitizenInboundMessage {
  id: string;
  name: string;
  phone?: string;
  channel: 'WHATSAPP' | 'VOICE' | 'SMS';
  boothOrWard: string;
  timeAgo: string;
  category: string;
  sentiment: string;
  text: string;
  replied?: boolean;
}

export interface WardInfo {
  wardNo: number;
  name: string;
  nameEn: string;
  voters: number;
  completedWorksCount: number;
  budgetSpentLakhs: number;
  majorWork: string;
  majorWorkEn: string;
  pannaPramukh: string;
  contact: string;
  keyIssuesResolved: string[];
}

export interface VisionItem {
  id: string;
  pillar: string;
  pillarEn: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  targetYear: string;
  iconName: string;
  points: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  titleEn: string;
  category: 'roads' | 'water' | 'health' | 'education' | 'solar' | 'community';
  categoryLabel: string;
  categoryLabelEn: string;
  ward: string;
  wardNo: number;
  cost: string;
  sanctionNo: string;
  status: 'completed' | 'in-progress';
  description: string;
  descriptionEn: string;
  impact: string;
  feedbackAuthor: string;
  feedbackText: string;
  feedbackRole: string;
  imageUrl?: string;
}

export interface GrievanceTimelineStep {
  title: string;
  titleEn: string;
  timestamp: string;
  description: string;
  descriptionEn: string;
  status: 'done' | 'current' | 'pending';
}

export interface GrievanceTicket {
  token: string;
  category: string;
  title: string;
  titleEn: string;
  location: string;
  wardNo: number;
  citizenName: string;
  phone: string;
  status: 'resolved' | 'in-progress' | 'verified' | 'pending';
  submittedDate: string;
  timeline: GrievanceTimelineStep[];
  photoUrl?: string;
  resolvedProof?: string;
  whatsappSubscribed: boolean;
}

export interface PadyatraStop {
  time: string;
  title: string;
  titleEn: string;
  location: string;
  locationEn: string;
  description: string;
  descriptionEn: string;
  status: 'completed' | 'current' | 'upcoming';
  attendeesCount?: string;
}

export interface KaryakartaTask {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  points: number;
  completed: boolean;
  category: 'voter' | 'rally' | 'senior' | 'digital';
}

export interface MediaKitItem {
  id: string;
  title: string;
  titleEn: string;
  type: 'image' | 'audio' | 'pdf' | 'banner';
  dimensionsOrFormat: string;
  size: string;
  previewUrl?: string;
  downloadFilename: string;
  badge?: string;
}
