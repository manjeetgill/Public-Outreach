import { BoothVoterRecord, OfflineDoorstepGrievance } from '../types/campaign';

const DB_NAME = 'janadesh_rural_booth_db';
const DB_VERSION = 1;

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
      if (!db.objectStoreNames.contains('voters')) {
        const voterStore = db.createObjectStore('voters', { keyPath: 'id' });
        voterStore.createIndex('boothNo', 'boothNo', { unique: false });
        voterStore.createIndex('name', 'name', { unique: false });
      }
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

// Save booth voters pack into IndexedDB
export async function saveBoothPackToLocal(boothNo: number, voters: BoothVoterRecord[]): Promise<void> {
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
    console.warn('[IndexedDB] Fallback to memory/localStorage:', err);
    localStorage.setItem(`booth_${boothNo}_voters`, JSON.stringify(voters));
  }
}

// Get booth voters from IndexedDB
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
          // Fallback to localStorage if any
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

// Update turnout / sentiment for voter in IndexedDB
export async function updateVoterInLocal(
  id: string,
  isTurnoutMarked: boolean,
  sentimentTag?: 'SUPPORTER' | 'SWING' | 'OPPOSITION'
): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction('voters', 'readwrite');
    const store = tx.objectStore('voters');
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const record = getReq.result;
      if (record) {
        record.isTurnoutMarked = isTurnoutMarked;
        if (isTurnoutMarked) {
          record.turnoutTimestamp = new Date().toISOString();
        }
        if (sentimentTag) {
          record.sentimentTag = sentimentTag;
        }
        store.put(record);
      }
    };
  } catch (err) {
    console.error('Failed to update voter in local store:', err);
  }
}

// Queue an offline doorstep grievance
export async function queueDoorstepGrievanceLocal(
  grievance: Omit<OfflineDoorstepGrievance, 'id' | 'syncStatus'>
): Promise<OfflineDoorstepGrievance> {
  const item: OfflineDoorstepGrievance = {
    ...grievance,
    id: `temp-${Date.now()}`,
    syncStatus: 'QUEUED'
  };

  try {
    const db = await getDb();
    const tx = db.transaction('doorstep', 'readwrite');
    tx.objectStore('doorstep').put(item);
  } catch (err) {
    const queuedStr = localStorage.getItem('janadesh_offline_doorstep') || '[]';
    const queued: OfflineDoorstepGrievance[] = JSON.parse(queuedStr);
    queued.push(item);
    localStorage.setItem('janadesh_offline_doorstep', JSON.stringify(queued));
  }

  return item;
}

// Get all queued doorstep grievances
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

// Sync local booth mutations with server
export async function syncBoothWithServer(boothNo: number): Promise<{
  success: boolean;
  updatedCount: number;
  syncedDoorstepCount: number;
}> {
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

    // Mark queued grievances as synced
    const db = await getDb();
    const tx = db.transaction('doorstep', 'readwrite');
    const store = tx.objectStore('doorstep');
    for (const dg of queuedDoorstep) {
      store.delete(dg.clientTempId);
    }
    localStorage.removeItem('janadesh_offline_doorstep');

    return {
      success: true,
      updatedCount: data.updatedVotersCount || 0,
      syncedDoorstepCount: data.syncedDoorstepCount || 0
    };
  } catch (err) {
    console.error('Booth sync error:', err);
    return {
      success: false,
      updatedCount: 0,
      syncedDoorstepCount: 0
    };
  }
}
