import { VoterSlipData } from '../types/campaign';
import { getBoothVotersFromLocal } from './offlineBoothStore';

export async function lookupVoterSlip(query: string): Promise<VoterSlipData | null> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;

  try {
    const response = await fetch(`/api/voter/lookup?query=${encodeURIComponent(cleanQuery)}`);
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return result.data;
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
        return {
          epicNo: match.id,
          name: match.name,
          guardianName: match.guardianName,
          age: match.age,
          gender: match.gender,
          houseNo: match.houseNo,
          boothNo: match.boothNo,
          boothName: match.boothName,
          roomNo: 'कमरा सं. 01',
          partNo: match.boothNo,
          serialNo: match.serialNo,
          wardNo: match.wardNo,
          locality: `वार्ड ${match.wardNo}, नूरपुर`,
          gpsCoordinates: {
            lat: 32.3021 + (match.wardNo * 0.003),
            lng: 75.8920 + (match.boothNo * 0.002)
          },
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${32.3021 + (match.wardNo * 0.003)},${75.8920 + (match.boothNo * 0.002)}`,
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

export function generateVoterWhatsAppMessage(slip: VoterSlipData): string {
  return `🇮🇳 *डिजिटल मतदाता पर्ची (Digital Voter Slip)*
विधानसभा: *142 नूरपुर (कांगड़ा, हिमाचल प्रदेश)*
विधायक प्रत्याशी: *रणबीर सिंह निक्का (जनसेवक)*
────────────────────
👤 *मतदाता का नाम:* ${slip.name}
👨‍👦 *पिता/पति:* ${slip.guardianName}
🔢 *क्रम संख्या (Serial No):* ${slip.serialNo}
📑 *भाग संख्या (Part No):* ${slip.partNo}
🏠 *मकान संख्या:* ${slip.houseNo}
🆔 *EPIC नंबर:* ${slip.epicNo}
────────────────────
🏫 *मतदान केंद्र:* ${slip.boothName}
🚪 *कमरा संख्या:* ${slip.roomNo}
📍 *गूगल मैप्स लोकेशन (Directions):*
${slip.mapsUrl}
────────────────────
_आपका मत, नूरपुर का भविष्य। घर-घर निक्का, हर घर निक्का!_`;
}
