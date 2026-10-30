import { VoterSlipData } from '../types/campaign';
import { getBoothVotersFromLocal } from './offlineBoothStore';

export interface EnrichedVoterRecord {
  id: string;
  epicNo: string;
  name: string;
  guardianName: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  houseNo: string;
  serialNo: number;
  partNo: number;
  boothNo: number;
  pollingStationName: string;
  boothName: string;
  roomNo: string;
  wardNo: number;
  locality: string;
  lat: number;
  lng: number;
  coordinates: { lat: number; lng: number };
  mapsUrl: string;
  mobile?: string;
  assemblyConstituency: string;
  candidateName: string;
}

export async function lookupVoterSlip(query: string): Promise<EnrichedVoterRecord | null> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;

  try {
    const response = await fetch(`/api/voter/lookup?query=${encodeURIComponent(cleanQuery)}`);
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        const d = result.data;
        const lat = d.gpsCoordinates?.lat || 32.3021;
        const lng = d.gpsCoordinates?.lng || 75.8920;
        return {
          id: d.epicNo,
          epicNo: d.epicNo,
          name: d.name,
          guardianName: d.guardianName,
          age: d.age,
          gender: d.gender,
          houseNo: d.houseNo,
          serialNo: d.serialNo,
          partNo: d.partNo,
          boothNo: d.boothNo,
          pollingStationName: d.boothName,
          boothName: d.boothName,
          roomNo: d.roomNo || 'कमरा सं. 01',
          wardNo: d.wardNo,
          locality: d.locality || `वार्ड ${d.wardNo}, नूरपुर`,
          lat,
          lng,
          coordinates: { lat, lng },
          mapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
          assemblyConstituency: d.assemblyConstituency || '142 नूरपुर (कांगड़ा, हि.प्र.)',
          candidateName: d.candidateName || 'रणबीर सिंह निक्का'
        };
      }
    }
  } catch (err) {
    console.warn('Network lookup failed, attempting offline IndexedDB search:', err);
  }

  // Fallback to local booth store
  try {
    const booths = [41, 42, 88, 15];
    for (const b of booths) {
      const voters = await getBoothVotersFromLocal(b);
      const match = voters.find(v => 
        v.id.toLowerCase() === cleanQuery.toLowerCase() ||
        (v.mobile && v.mobile.includes(cleanQuery)) ||
        v.name.toLowerCase().includes(cleanQuery.toLowerCase())
      );
      if (match) {
        const lat = 32.3021 + (match.wardNo * 0.003);
        const lng = 75.8920 + (match.boothNo * 0.002);
        return {
          id: match.id,
          epicNo: match.id,
          name: match.name,
          guardianName: match.guardianName,
          age: match.age,
          gender: match.gender,
          houseNo: match.houseNo,
          serialNo: match.serialNo,
          partNo: match.boothNo,
          boothNo: match.boothNo,
          pollingStationName: match.boothName,
          boothName: match.boothName,
          roomNo: 'कमरा सं. 01',
          wardNo: match.wardNo,
          locality: `वार्ड ${match.wardNo}, नूरपुर`,
          lat,
          lng,
          coordinates: { lat, lng },
          mapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
          assemblyConstituency: '142 नूरपुर (कांगड़ा, हि.प्र.)',
          candidateName: 'रणबीर सिंह निक्का'
        };
      }
    }
  } catch (offlineErr) {
    console.error('Offline lookup failed:', offlineErr);
  }

  return null;
}

export function generateVoterWhatsAppMessage(voter: EnrichedVoterRecord | VoterSlipData): string {
  const stationName = (voter as any).pollingStationName || (voter as any).boothName;
  const lat = (voter as any).lat || (voter as any).gpsCoordinates?.lat || 32.3021;
  const lng = (voter as any).lng || (voter as any).gpsCoordinates?.lng || 75.8920;
  
  return `*विधानसभा 142 नूरपुर • डिजिटल मतदाता पर्ची*\n\n👤 *मतदाता:* ${voter.name}\n🔢 *क्रम संख्या (Serial No):* ${voter.serialNo}\n🏛️ *मतदान केंद्र:* ${stationName}\n📍 *बूथ का रास्ता (Google Maps):* https://maps.google.com/?q=${lat},${lng}\n\n*जनसेवक रणबीर सिंह निक्का* - मतदान अवश्य करें!`;
}
