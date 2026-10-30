import { GrievanceTicket } from '../types/campaign';
import { INITIAL_GRIEVANCES } from '../data/campaignData';

export interface ApiStats {
  total: number;
  resolved: number;
  verified: number;
  inProgress: number;
  pending: number;
  redressalRate: number;
  wardsCoverage: number;
  updatedAt: string;
}

const API_BASE = '/api';

/**
 * Fetch all grievance tickets with optional filter query parameters
 */
export async function fetchGrievances(params?: {
  status?: string;
  wardNo?: number | 'all';
  search?: string;
}): Promise<GrievanceTicket[]> {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/grievances`);
    if (params?.status && params.status !== 'all') {
      url.searchParams.set('status', params.status);
    }
    if (params?.wardNo && params.wardNo !== 'all') {
      url.searchParams.set('wardNo', params.wardNo.toString());
    }
    if (params?.search && params.search.trim()) {
      url.searchParams.set('search', params.search.trim());
    }

    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    return INITIAL_GRIEVANCES;
  } catch (err) {
    console.warn('[API] Fallback to local grievance dataset:', err);
    return INITIAL_GRIEVANCES;
  }
}

/**
 * Fetch high-level summary statistics
 */
export async function fetchStats(): Promise<ApiStats | null> {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Lodge a new civic grievance
 */
export async function createGrievance(payload: {
  category: string;
  title?: string;
  titleEn?: string;
  location: string;
  wardNo: number;
  citizenName: string;
  phone?: string;
}): Promise<GrievanceTicket | null> {
  try {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`Failed to lodge grievance: ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('[API] Error creating grievance:', err);
    return null;
  }
}

/**
 * Update a ticket status (e.g. from War Room or Janta Darbar)
 */
export async function updateGrievanceStatus(
  token: string, 
  status: 'pending' | 'in-progress' | 'resolved' | 'verified',
  note?: string
): Promise<GrievanceTicket | null> {
  try {
    const res = await fetch(`${API_BASE}/grievances/${encodeURIComponent(token)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ status, note })
    });

    if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('[API] Error updating ticket status:', err);
    return null;
  }
}

/**
 * Subscribe to real-time server events (SSE) for instant live sync
 */
export function subscribeToRealtimeGrievances(
  onUpdate: (event: { type: string; data: any; timestamp: string }) => void
): () => void {
  try {
    const eventSource = new EventSource(`${API_BASE}/stream/events`);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onUpdate(parsed);
      } catch (e) {
        console.error('[SSE] Error parsing event:', e);
      }
    };

    eventSource.onerror = () => {
      // EventSource automatically retries connection
    };

    return () => {
      eventSource.close();
    };
  } catch {
    return () => {};
  }
}

/**
 * Multi-Turn Chatbot using Gemini 3.8 Flash
 */
export async function sendChatMessage(
  messages: Array<{ role: 'user' | 'assistant' | 'model'; content: string }>,
  lang: string = 'hi'
): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, lang })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Chat request failed');
    }
    return data.text;
  } catch (err: any) {
    console.error('[API] Chat error:', err);
    throw err;
  }
}

/**
 * Audio Transcription using Gemini 3.5 Transcribe & Sarvam Indic Speech Engine
 */
export async function transcribeAudio(
  audioBlob: Blob,
  options?: { dialectMode?: 'kangri' | 'standard_hindi'; speechProvider?: 'sarvam' | 'gemini' }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await fetch(`${API_BASE}/ai/transcribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: audioBlob.type || 'audio/webm',
            dialectMode: options?.dialectMode || 'kangri',
            speechProvider: options?.speechProvider || 'sarvam'
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Transcription failed');
        }
        resolve(data.text);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
}

/**
 * Text-to-Speech using Gemini 3.8 Flash Lite TTS & Sarvam Indic Bulbul Engine
 */
export async function synthesizeSpeech(
  text: string, 
  voiceName: string = 'Zephyr',
  speechProvider: 'sarvam' | 'gemini' = 'sarvam'
): Promise<string> {
  const res = await fetch(`${API_BASE}/ai/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceName, speechProvider })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'TTS failed');
  }
  return `data:${data.mimeType};base64,${data.audioBase64}`;
}

/**
 * Multimodal Vision Inspection for Grievance Photos (vision.py)
 */
export interface PhotoVerificationResult {
  isAuthenticCivilDamage: boolean;
  confidence: number;
  severityRating: 'CRITICAL' | 'HIGH' | 'NORMAL';
  suggestedCategory: string;
  department: string;
  technicalSummary: string;
  technicalSummaryEn: string;
  detectedIssues: string[];
}

export async function verifyGrievancePhoto(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<PhotoVerificationResult> {
  const res = await fetch(`${API_BASE}/ai/verify-photo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Vision inspection failed');
  }
  return data.data;
}

/**
 * Real SMS & OTP Verification Service (sms_service.py)
 */
export async function sendCitizenOtp(phone: string, name?: string): Promise<{
  success: boolean;
  message: string;
  maskedPhone?: string;
  debugOtp?: string;
  expiresInSeconds?: number;
}> {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, name })
  });
  return await res.json();
}

export async function verifyCitizenOtp(phone: string, otp: string, name?: string): Promise<{
  success: boolean;
  message?: string;
  token?: string;
  user?: { phone: string; name: string; role: string; verifiedAt: string };
}> {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp, name })
  });
  return await res.json();
}

/**
 * Outbound WhatsApp Alerts Logs (whatsapp_worker.py)
 */
export interface WhatsAppAlertLog {
  id: string;
  ticketToken: string;
  recipientPhone: string;
  citizenName: string;
  templateType: string;
  message: string;
  status: 'DELIVERED' | 'READ' | 'PENDING';
  timestamp: string;
}

export async function fetchWhatsAppOutboundLogs(): Promise<WhatsAppAlertLog[]> {
  try {
    const res = await fetch(`${API_BASE}/whatsapp/outbound-logs`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

/**
 * War Room Autonomous SLA Status & Briefing (automation.py)
 */
export interface WarRoomSlaStatus {
  totalPending: number;
  breachedCount: number;
  slaLimitHours: number;
  breachedTickets: Array<{
    token: string;
    wardNo: number;
    title: string;
    citizenName: string;
    submittedDate: string;
    ageHours: number;
  }>;
}

export async function fetchWarRoomSlaStatus(): Promise<WarRoomSlaStatus | null> {
  try {
    const res = await fetch(`${API_BASE}/war-room/sla-status`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchWarRoomExecutiveBriefing(): Promise<{
  success: boolean;
  generatedAt: string;
  briefing: string;
  stats: any;
} | null> {
  try {
    const res = await fetch(`${API_BASE}/war-room/briefing`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateDepartmentRequisitionMemo(
  ticketToken: string,
  department?: string,
  officerTitle?: string
): Promise<{
  success: boolean;
  memoNumber: string;
  date: string;
  memoContent: string;
} | null> {
  try {
    const res = await fetch(`${API_BASE}/war-room/generate-memo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketToken, department, officerTitle })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Video Generation using Gemini Omni Flash via Interactions API
 */
export async function generateAiVideo(params: {
  prompt?: string;
  imageBase64?: string;
  aspectRatio?: '16:9' | '9:16';
}): Promise<{ success: boolean; videoResult?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/ai/video-generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ============================================================================
// 100% AUTHENTIC REAL-WORLD CIVIC DATA FETCHERS (ZERO-DUMMY LAYER)
// ============================================================================

export async function fetchMlaProfile(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/config/mla-profile`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function fetchConstituencyProjects(params?: {
  wardNo?: number;
  category?: string;
  status?: string;
}): Promise<any[]> {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/projects`);
    if (params?.wardNo) url.searchParams.set('wardNo', params.wardNo.toString());
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.status) url.searchParams.set('status', params.status);

    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.projects : [];
  } catch {
    return [];
  }
}

export async function fetchPollingStations(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/booths/nurpur`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.booths : [];
  } catch {
    return [];
  }
}

export async function fetchBoothDetails(boothNo: number): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/booths/${boothNo}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.booth : null;
  } catch {
    return null;
  }
}

export async function fetchSarkariYojanas(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/yojanas`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.yojanas : [];
  } catch {
    return [];
  }
}

export async function fetchOfficialDak(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/dak/register`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.dak : [];
  } catch {
    return [];
  }
}

export async function fetchPadyatraSchedule(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/padyatra/schedule`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.telemetry : null;
  } catch {
    return null;
  }
}

export async function fetchFacebookFeed(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/integrations/facebook/feed`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.feed : [];
  } catch {
    return [];
  }
}

export interface MandiCommodity {
  id: string;
  commodity: string;
  commodityEn: string;
  variety: string;
  unit: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  change: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  arrivalsQuintals: number;
  market: string;
  district: string;
  grade: string;
  mspPrice: number | null;
  reportedDate: string;
}

export interface AgriWeather {
  location: string;
  current: {
    tempC: number;
    feelsLikeC: number;
    humidityPercent: number;
    windSpeedKmh: number;
    rainProbabilityPercent: number;
    minTempC: number;
    maxTempC: number;
    isFrostWarning: boolean;
    conditionHi: string;
    conditionEn: string;
    advisoryHi: string;
    advisoryEn: string;
  };
}

export interface CropDoctorResult {
  diseaseNameHi: string;
  diseaseNameEn: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  affectedPlantPart: string;
  symptomsHi: string;
  causeHi: string;
  threeStepTreatmentHi: string[];
  recommendedChemicalsHi: string;
  organicAlternativeHi: string;
  nearestAgriDepot: string;
  pmFasalBimaEligible: boolean;
  farmerAudioSummaryHi: string;
}

export interface CitizenTelemetryItem {
  id: string;
  session_id: string;
  citizen_name: string;
  phone: string;
  ward_no: number;
  village_name: string;
  booth_no: number;
  service_code: string;
  query_details: any;
  is_voter_mapped: number;
  epic_no: string;
  panna_pramukh_notified: number;
  followup_sent: number;
  accessed_at: string;
}

export async function fetchMandiRates(): Promise<{ marketYard: string; source: string; commodities: MandiCommodity[] }> {
  try {
    const res = await fetch(`${API_BASE}/kisan/mandi-rates`);
    if (!res.ok) throw new Error('Mandi rates fetch failed');
    const json = await res.json();
    return json.success ? json : { marketYard: 'उप मंडी प्रांगण जसूर', source: 'Agmarknet', commodities: [] };
  } catch {
    return { marketYard: 'उप मंडी प्रांगण जसूर', source: 'Agmarknet Baseline', commodities: [] };
  }
}

export async function fetchAgriWeather(): Promise<AgriWeather | null> {
  try {
    const res = await fetch(`${API_BASE}/kisan/weather`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json : null;
  } catch {
    return null;
  }
}

export async function analyzeCropDoctor(
  imageBase64: string,
  cropName: string,
  villageName?: string
): Promise<CropDoctorResult | null> {
  try {
    const res = await fetch(`${API_BASE}/kisan/crop-doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, cropName, villageName })
    });
    const json = await res.json();
    return json.success ? json.diagnosis : null;
  } catch (err) {
    console.error('Crop Doctor API error:', err);
    return null;
  }
}

export async function requestNikkaCivicPass(data: {
  phone: string;
  villageName?: string;
  wardNo?: number;
  citizenName?: string;
  serviceCode: string;
  queryDetails?: any;
}): Promise<{ passToken: string; record: any }> {
  const res = await fetch(`${API_BASE}/gateway/access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'सेवा पास प्रमाणीकरण विफल रहा');
  }
  return json;
}

export async function fetchCitizenTelemetry(): Promise<CitizenTelemetryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/gateway/telemetry`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.telemetry : [];
  } catch {
    return [];
  }
}

export async function sendTelemetryFollowup(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/gateway/telemetry/${id}/followup`, {
      method: 'POST'
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}


