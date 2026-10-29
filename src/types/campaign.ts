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
  | 'screen-vision';


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
