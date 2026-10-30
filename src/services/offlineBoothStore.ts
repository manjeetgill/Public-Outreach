import { BoothVoterRecord, OfflineDoorstepGrievance } from '../types/campaign';

const DB_NAME = 'janadesh_rural_booth_db';
const DB_VERSION = 2;

export interface PendingSyncItem {
  id: string;
  action: 'MARK_TURNOUT' | 'LOG_GRIEVANCE';
  payload: any;
  timestamp: string;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      
      // 1. Voters Store
      if (!db.objectStoreNames.contains('voters')) {
        const voterStore = db.createObjectStore('voters', { keyPath: 'id' });
        voterStore.createIndex('boothNo', 'boothNo', { unique: false });
        voterStore.createIndex('name', 'name', { unique: false });
        voterStore.createIndex('houseNo', 'houseNo', { unique: false });
        voterStore.createIndex('isTurnoutMarked', 'isTurnoutMarked', { unique: false });
      }

      // 2. Pending Sync Queue Store
      if (!db.objectStoreNames.contains('pendingSyncQueue')) {
        db.createObjectStore('pendingSyncQueue', { keyPath: 'id' });
      }

      // 3. Doorstep Complaints Store (legacy backward compat)
      if (!db.objectStoreNames.contains('doorstep')) {
        const doorstepStore = db.createObjectStore('doorstep', { keyPath: 'clientTempId' });
        doorstepStore.createIndex('syncStatus', 'syncStatus', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// 1. Save Booth Pack into IndexedDB
export async function saveBoothPack(boothNo: number, voters: BoothVoterRecord[]): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction('voters', 'readwrite');
    const store = tx.objectStore('voters');

    for (const voter of voters) {
      store.put({ ...voter, boothNo });
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    localStorage.setItem(`booth_${boothNo}_synced_at`, new Date().toISOString());
  } catch (err) {
    console.warn('[IndexedDB] Fallback to localStorage:', err);
    localStorage.setItem(`booth_${boothNo}_voters`, JSON.stringify(voters));
  }
}
export const saveBoothPackToLocal = saveBoothPack;

// 2. Search Offline Voters from IndexedDB
export async function searchOfflineVoters(query: string, boothNo: number): Promise<BoothVoterRecord[]> {
  const voters = await getBoothVotersFromLocal(boothNo);
  const q = query.toLowerCase().trim();
  if (!q) return voters;

  return voters.filter(v => 
    v.name.toLowerCase().includes(q) ||
    v.guardianName.toLowerCase().includes(q) ||
    v.houseNo.toLowerCase().includes(q) ||
    v.serialNo.toString().includes(q) ||
    v.id.toLowerCase().includes(q) ||
    (v.mobile && v.mobile.includes(q))
  );
}

// 3. Mark Voter Turnout Offline & Record Mutation in Pending Sync Queue
export async function markVoterTurnoutOffline(voterId: string, isVoted: boolean): Promise<void> {
  try {
    const db = await getDb();
    
    // Update voter store
    const tx = db.transaction(['voters', 'pendingSyncQueue'], 'readwrite');
    const voterStore = tx.objectStore('voters');
    const queueStore = tx.objectStore('pendingSyncQueue');

    const getReq = voterStore.get(voterId);
    getReq.onsuccess = () => {
      const record = getReq.result;
      if (record) {
        record.isTurnoutMarked = isVoted;
        record.turnoutTimestamp = isVoted ? new Date().toISOString() : undefined;
        voterStore.put(record);
      }
    };

    // Queue mutation for server flush
    const syncItem: PendingSyncItem = {
      id: `sync-turnout-${voterId}-${Date.now()}`,
      action: 'MARK_TURNOUT',
      payload: { id: voterId, isTurnoutMarked: isVoted, turnoutTimestamp: new Date().toISOString() },
      timestamp: new Date().toISOString()
    };
    queueStore.put(syncItem);
  } catch (err) {
    console.error('Failed to mark voter turnout offline:', err);
  }
}
export const updateVoterInLocal = async (id: string, isTurnoutMarked: boolean, sentimentTag?: any) => {
  await markVoterTurnoutOffline(id, isTurnoutMarked);
  if (sentimentTag) {
    try {
      const db = await getDb();
      const tx = db.transaction('voters', 'readwrite');
      const store = tx.objectStore('voters');
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const record = getReq.result;
        if (record) {
          record.sentimentTag = sentimentTag;
          store.put(record);
        }
      };
    } catch {}
  }
};

// 4. Queue Offline Grievance / Doorstep Petition
export async function queueOfflineGrievance(grievance: any): Promise<void> {
  const syncItem: PendingSyncItem = {
    id: `sync-grievance-${Date.now()}`,
    action: 'LOG_GRIEVANCE',
    payload: {
      clientTempId: grievance.clientTempId || `temp-${Date.now()}`,
      boothNo: grievance.boothNo,
      wardNo: grievance.wardNo,
      citizenName: grievance.citizenName,
      mobile: grievance.mobile,
      category: grievance.category,
      issueDescription: grievance.issueDescription,
      createdAt: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  };

  try {
    const db = await getDb();
    const tx = db.transaction(['pendingSyncQueue', 'doorstep'], 'readwrite');
    tx.objectStore('pendingSyncQueue').put(syncItem);
    tx.objectStore('doorstep').put({
      ...syncItem.payload,
      id: syncItem.id,
      syncStatus: 'QUEUED'
    });
  } catch (err) {
    const queuedStr = localStorage.getItem('janadesh_pending_sync_queue') || '[]';
    const queued: PendingSyncItem[] = JSON.parse(queuedStr);
    queued.push(syncItem);
    localStorage.setItem('janadesh_pending_sync_queue', JSON.stringify(queued));
  }
}
export const queueDoorstepGrievanceLocal = async (g: any) => {
  await queueOfflineGrievance(g);
  return { ...g, id: `temp-${Date.now()}`, syncStatus: 'QUEUED' as const };
};

// 5. Flush Sync Queue to Server upon reconnection
export async function flushSyncQueue(): Promise<{ syncedCount: number; errors?: any[] }> {
  try {
    const db = await getDb();
    const tx = db.transaction(['pendingSyncQueue', 'doorstep'], 'readwrite');
    const queueStore = tx.objectStore('pendingSyncQueue');
    const doorstepStore = tx.objectStore('doorstep');

    const getAllReq = queueStore.getAll();
    const items: PendingSyncItem[] = await new Promise((resolve) => {
      getAllReq.onsuccess = () => resolve(getAllReq.result || []);
      getAllReq.onerror = () => resolve([]);
    });

    if (items.length === 0) {
      return { syncedCount: 0 };
    }

    const voterUpdates = items
      .filter(i => i.action === 'MARK_TURNOUT')
      .map(i => i.payload);

    const doorstepGrievances = items
      .filter(i => i.action === 'LOG_GRIEVANCE')
      .map(i => i.payload);

    const response = await fetch('/api/booth/sync-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        boothNo: items[0]?.payload?.boothNo || 41,
        voterUpdates,
        doorstepGrievances
      })
    });

    if (!response.ok) throw new Error('Sync batch endpoint returned error');
    const resData = await response.json();

    // Clear processed sync queue
    const clearTx = db.transaction(['pendingSyncQueue', 'doorstep'], 'readwrite');
    clearTx.objectStore('pendingSyncQueue').clear();
    clearTx.objectStore('doorstep').clear();
    localStorage.removeItem('janadesh_pending_sync_queue');
    localStorage.removeItem('janadesh_offline_doorstep');

    return {
      syncedCount: (resData.updatedVotersCount || 0) + (resData.syncedDoorstepCount || 0)
    };
  } catch (err) {
    console.error('Failed to flush sync queue:', err);
    return { syncedCount: 0 };
  }
}

// Get all booth voters from IndexedDB
export async function getBoothVotersFromLocal(boothNo: number): Promise<BoothVoterRecord[]> {
  try {
    const db = await getDb();
    const tx = db.transaction('voters', 'readonly');
    const store = tx.objectStore('voters');
    const index = store.index('boothNo');
    const request = index.getAll(boothNo);

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results = request.result || [];
        if (results.length > 0) {
          resolve(results);
        } else {
          const cached = localStorage.getItem(`booth_${boothNo}_voters`);
          resolve(cached ? JSON.parse(cached) : []);
        }
      };
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    const cached = localStorage.getItem(`booth_${boothNo}_voters`);
    return cached ? JSON.parse(cached) : [];
  }
}

// Get queued doorstep complaints
export async function getQueuedDoorstepLocal(): Promise<OfflineDoorstepGrievance[]> {
  try {
    const db = await getDb();
    const tx = db.transaction('doorstep', 'readonly');
    const store = tx.objectStore('doorstep');
    const req = store.getAll();

    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    const queuedStr = localStorage.getItem('janadesh_offline_doorstep') || '[]';
    return JSON.parse(queuedStr);
  }
}

// Sync helper
export async function syncBoothWithServer(boothNo: number): Promise<{
  success: boolean;
  updatedCount: number;
  syncedDoorstepCount: number;
}> {
  const result = await flushSyncQueue();
  if (result.syncedCount > 0) {
    return { success: true, updatedCount: result.syncedCount, syncedDoorstepCount: 0 };
  }

  // Also sync direct voter records if any
  try {
    const localVoters = await getBoothVotersFromLocal(boothNo);
    const queuedDoorstep = await getQueuedDoorstepLocal();

    const voterUpdates = localVoters.map(v => ({
      id: v.id,
      isTurnoutMarked: v.isTurnoutMarked,
      sentimentTag: v.sentimentTag,
      turnoutTimestamp: v.turnoutTimestamp
    }));

    const response = await fetch('/api/booth/sync-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        boothNo,
        voterUpdates,
        doorstepGrievances: queuedDoorstep
      })
    });

    if (!response.ok) throw new Error('Sync failed');
    const data = await response.json();

    return {
      success: true,
      updatedCount: data.updatedVotersCount || 0,
      syncedDoorstepCount: data.syncedDoorstepCount || 0
    };
  } catch (err) {
    console.error('Booth sync error:', err);
    return { success: false, updatedCount: 0, syncedDoorstepCount: 0 };
  }
}

// ============================================================================
// LAYER 2: DECENTRALIZED PANNA PRAMUKH RELAY & CIVIC INTENT SYNTHESIZER
// ============================================================================

export interface CadreCivicBroadcastPack {
  id: string; // e.g. PACK-2026-OCT-30
  date: string;
  category: 'HEALTH_CAMP' | 'WEATHER_DISASTER' | 'WATER_POWER_NOTICE' | 'YOJANA_CAMP';
  headlineHi: string;
  headlineEn: string;
  bulletPoints: string[];
  mlaAudioUrl?: string;
  tollFreeNumber: string; // 1800-123-456
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface BoothRelayTelemetry {
  boothNo: number;
  boothName: string;
  wardNo: number;
  pannaPramukhName: string;
  pannaPramukhPhone: string;
  packId: string;
  assignedHouseholds: number; // e.g. 35 to 45
  relayedByCadre: boolean;
  relayInitiatedAt?: string;
  totalReads: number;
  coveragePercentage: number;
  lastReadTimestamp?: string;
}

export const FALLBACK_CIVIC_PACK: CadreCivicBroadcastPack = {
  id: 'PACK-2026-OCT-30',
  date: '30 अक्टूबर 2026',
  category: 'HEALTH_CAMP',
  headlineHi: 'वार्ड 14 जसूर: कल सुबह 10 बजे निशुल्क नेत्र एवं स्वास्थ्य जांच शिविर',
  headlineEn: 'Ward 14 Jasur: Free Eye & Health Checkup Camp Tomorrow 10 AM',
  bulletPoints: [
    'कांगड़ा फोर्टिस एवं रोटरी क्लब के विशेषज्ञ डॉक्टरों द्वारा जांच व दवा वितरण।',
    'मुफ्त मोतियाबिंद जांच एवं जरूरतमंद बुजुर्गों को निशुल्क चश्मा वितरण।',
    'स्थान: सामुदायिक भवन जसूर, समय: सुबह 10:00 से दोपहर 03:00 बजे तक।'
  ],
  mlaAudioUrl: '/audio/nikka-health-camp-advisory.mp3',
  tollFreeNumber: '1800-123-456',
  status: 'ACTIVE'
};

/**
 * Dynamic WhatsApp URL Synthesizer
 * Generates an authentic neighbor-to-neighbor civic notice that bypasses Meta/WhatsApp political spam bans.
 */
export function buildPannaPramukhRelayMessage(
  pack: CadreCivicBroadcastPack,
  pannaPramukhName: string,
  wardName: string,
  boothNo: number
): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://janadesh.in';
  const trackingUrl = `${origin}/api/c/${boothNo}/${pack.id}`;
  
  return `*राम राम जी! ${wardName} (बूथ सं. ${boothNo}) के लिए जरूरी जन-सूचना:*\n\n` +
    `📌 *${pack.headlineHi}*\n` +
    pack.bulletPoints.map(pt => `• ${pt}`).join('\n') + '\n\n' +
    `🎧 विधायक जी का 20s ऑडियो संदेश व विवरण यहाँ देखें व सुनें:\n👉 ${trackingUrl}\n\n` +
    `किसी भी आपातकालीन या नागरिक समस्या हेतु विधायक कैंप कार्यालय टोल-फ्री: ${pack.tollFreeNumber}\n` +
    `— आपका पड़ोसी, *${pannaPramukhName}* (जनसेवक दल, नूरपुर)`;
}

/**
 * Fetch latest civic broadcast pack from server or local offline cache
 */
export async function fetchCadreBroadcastPacks(): Promise<{
  activePack: CadreCivicBroadcastPack;
  allPacks: CadreCivicBroadcastPack[];
}> {
  try {
    const res = await fetch('/api/cadre/broadcast-packs');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.activePack) {
        localStorage.setItem('cadre_active_pack', JSON.stringify(data.activePack));
        localStorage.setItem('cadre_all_packs', JSON.stringify(data.allPacks || [data.activePack]));
        return { activePack: data.activePack, allPacks: data.allPacks || [data.activePack] };
      }
    }
  } catch (err) {
    console.warn('[Offline] Could not fetch server pack, checking local storage:', err);
  }

  const cached = localStorage.getItem('cadre_active_pack');
  if (cached) {
    try {
      const activePack = JSON.parse(cached);
      const allPacks = JSON.parse(localStorage.getItem('cadre_all_packs') || '[]') || [activePack];
      return { activePack, allPacks };
    } catch {}
  }

  return { activePack: FALLBACK_CIVIC_PACK, allPacks: [FALLBACK_CIVIC_PACK] };
}

/**
 * Notify server that Panna Pramukh has forwarded the relay pack to their booth
 */
export async function logRelaySentToServer(
  boothNo: number,
  packId: string,
  pannaPramukhName: string
): Promise<boolean> {
  // Mark in local storage immediately for offline resilience
  localStorage.setItem(`booth_${boothNo}_relayed_${packId}`, new Date().toISOString());

  try {
    const res = await fetch('/api/cadre/log-relay-sent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boothNo, packId, pannaPramukhName })
    });
    return res.ok;
  } catch (err) {
    console.warn('[Offline] Saved relay action locally:', err);
    return true;
  }
}

/**
 * Fetch 118-Booth Relay Leaderboard for War Room
 */
export async function fetchRelayLeaderboard(): Promise<{
  stats: {
    totalBooths: number;
    totalHouseholds: number;
    totalReads: number;
    avgCoveragePct: number;
    activeCadresCount: number;
    topActiveCount: number;
    inProgressCount: number;
    sluggishCount: number;
  };
  leaderboard: BoothRelayTelemetry[];
} | null> {
  try {
    const res = await fetch('/api/cadre/relay-leaderboard');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch relay leaderboard:', err);
  }
  return null;
}

