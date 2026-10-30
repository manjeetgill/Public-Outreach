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
 * Audio Transcription using Gemini 3.5 Transcribe
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
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
            mimeType: audioBlob.type || 'audio/webm'
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
 * Text-to-Speech using Gemini 3.8 Flash Lite TTS
 */
export async function synthesizeSpeech(text: string, voiceName: string = 'Zephyr'): Promise<string> {
  const res = await fetch(`${API_BASE}/ai/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceName })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'TTS failed');
  }
  return `data:${data.mimeType};base64,${data.audioBase64}`;
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

