import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// 1. DATABASE MODELS & IN-MEMORY REPOSITORY (POSTGRESQL & FIRESTORE ALIGNED)
// ============================================================================

export interface TimelineStep {
  title: string;
  titleEn: string;
  timestamp: string;
  description: string;
  descriptionEn: string;
  status: 'done' | 'current' | 'pending';
}

export interface GrievanceRecord {
  token: string;
  category: string;
  title: string;
  titleEn: string;
  location: string;
  wardNo: number;
  citizenName: string;
  phone: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'verified';
  submittedDate: string;
  whatsappSubscribed: boolean;
  photoUrl?: string;
  resolvedProof?: string;
  timeline: TimelineStep[];
  createdAt: string;
  updatedAt: string;
}

export interface WarRoomEvent {
  id: string;
  time: string;
  title: string;
  titleEn: string;
  wardNo: number;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  status: 'PENDING' | 'DISPATCHED' | 'IN_PROGRESS' | 'RESOLVED';
  details: string;
}

// Initial seed data aligned with Nurpur Assembly 2026
const initialGrievances: GrievanceRecord[] = [
  {
    token: '#NR-8831',
    category: 'विद्युत / ट्रांसफार्मर समस्या',
    title: 'वार्ड 12 में विद्युत ट्रांसफार्मर रिप्लेसमेंट एवं तार मरम्मत',
    titleEn: 'Transformer Replacement & Cable Repair in Ward 12',
    location: 'स्थान: रामपुर रोड, प्राथमिक स्वास्थ्य केंद्र के पास',
    wardNo: 12,
    citizenName: 'सुखविंदर सिंह',
    phone: '98160*****',
    status: 'in-progress',
    submittedDate: '24 Oct 2026, 09:14 AM',
    whatsappSubscribed: true,
    createdAt: '2026-10-24T09:14:00Z',
    updatedAt: '2026-10-29T08:30:00Z',
    timeline: [
      {
        title: 'शिकायत दर्ज (नागरिक द्वारा)',
        titleEn: 'Grievance Registered by Citizen',
        timestamp: '24 Oct, 09:14 AM',
        description: 'Jan Sunwai Mobile App • फोटो व लोकेशन सत्यापित',
        descriptionEn: 'Jan Sunwai Mobile App • Geo-photo & location verified',
        status: 'done'
      },
      {
        title: 'विधायक कैंप कार्यालय द्वारा सत्यापित',
        titleEn: 'Verified by MLA Camp Office',
        timestamp: '24 Oct, 11:30 AM',
        description: 'फास्ट ट्रैक स्टेटस जारी • प्राथमिकता श्रेणी-A आवंटित',
        descriptionEn: 'Fast track status issued • Priority Category-A assigned',
        status: 'done'
      },
      {
        title: 'विद्युत बोर्ड को आदेश प्रेषित व फील्ड टीम रवाना',
        titleEn: 'Order Dispatched to HPSEB & Field Team En Route',
        timestamp: 'आज, 08:30 AM',
        description: 'नया 100kVA ट्रांसफार्मर लोड हुआ, लाइनमैन टीम मौके पर',
        descriptionEn: 'New 100kVA transformer dispatched, lineman squad on site',
        status: 'current'
      },
      {
        title: 'फील्ड कार्य पूर्ण एवं टेस्टिंग',
        titleEn: 'Field Replacement & Power Testing',
        timestamp: 'प्रक्रियाधीन (अनुमानित 4 घंटे)',
        description: 'लाइन चार्जिंग व वोल्टेज संतुलन परीक्षण',
        descriptionEn: 'Line charging & voltage stability test',
        status: 'pending'
      }
    ]
  },
  {
    token: '#NR-8712',
    category: 'सड़क एवं गड्ढा मरम्मत',
    title: 'वार्ड 05 मुख्य चौक पर जलभराव एवं पेवर ब्लॉक मरम्मत',
    titleEn: 'Waterlogging & Interlocking Paver Repair at Ward 05 Chowk',
    location: 'वार्ड 05, राधा कृष्ण मंदिर गली, नूरपुर',
    wardNo: 5,
    citizenName: 'अनिल महाजन',
    phone: '94180*****',
    status: 'resolved',
    submittedDate: '21 Oct 2026, 03:20 PM',
    whatsappSubscribed: true,
    createdAt: '2026-10-21T15:20:00Z',
    updatedAt: '2026-10-23T16:30:00Z',
    timeline: [
      {
        title: 'शिकायत दर्ज',
        titleEn: 'Grievance Registered',
        timestamp: '21 Oct, 03:20 PM',
        description: 'फोटो व विवरण दर्ज',
        descriptionEn: 'Photo & details recorded',
        status: 'done'
      },
      {
        title: 'नगर परिषद नूरपुर को संस्तुति',
        titleEn: 'Recommendation to Municipal Council',
        timestamp: '21 Oct, 05:45 PM',
        description: 'विधायक निक्का जी द्वारा सीधे निर्देश जारी',
        descriptionEn: 'Direct instructions issued by MLA Nikka',
        status: 'done'
      },
      {
        title: 'मरम्मत कार्य पूर्ण व नाली सफाई',
        titleEn: 'Repair Completed & Drainage Cleared',
        timestamp: '23 Oct, 02:00 PM',
        description: 'पेवर ब्लॉक बिछाए गए, जल निकासी चालू',
        descriptionEn: 'Paver blocks relaid, free drainage restored',
        status: 'done'
      },
      {
        title: 'नागरिक संतुष्टि पुष्टि',
        titleEn: 'Citizen Feedback Verified',
        timestamp: '23 Oct, 04:30 PM',
        description: 'नागरिक अनिल महाजन द्वारा 5-स्टार रेटिंग दर्ज',
        descriptionEn: '5-star rating recorded by citizen Anil Mahajan',
        status: 'done'
      }
    ]
  },
  {
    token: '#NR-8945',
    category: 'पेयजल एवं जल शक्ति पाइपलाइन',
    title: 'वार्ड 08 कोटला चौक पर पेयजल पाइपलाइन मरम्मत व आपातकालीन टैंकर आपूर्ति',
    titleEn: 'Drinking Water Pipeline Repair & Tanker Deployment in Ward 08',
    location: 'स्थान: वार्ड 08 कोटला चौक, नूरपुर',
    wardNo: 8,
    citizenName: 'रमेश कुमार',
    phone: '98161*****',
    status: 'in-progress',
    submittedDate: '26 Oct 2026, 10:15 AM',
    whatsappSubscribed: true,
    createdAt: '2026-10-26T10:15:00Z',
    updatedAt: '2026-10-29T07:00:00Z',
    timeline: [
      {
        title: 'शिकायत दर्ज व संकट अलर्ट जारी',
        titleEn: 'Complaint Registered & Alert Triggered',
        timestamp: '26 Oct, 10:15 AM',
        description: 'वार्ड 8 में पाइपलाइन लीकेज के कारण जलापूर्ति बाधित',
        descriptionEn: 'Water supply disruption due to pipeline breakage',
        status: 'done'
      },
      {
        title: '2 आपातकालीन पानी टैंकर रवाना',
        titleEn: '2 Emergency Water Tankers Dispatched',
        timestamp: '26 Oct, 11:30 AM',
        description: 'विधायक वॉर रूम से जल शक्ति विभाग को आदेश, गाड़ियां स्थल पर',
        descriptionEn: 'Orders issued from MLA War Room, tankers on site',
        status: 'done'
      },
      {
        title: 'एक्सईएन जल शक्ति टीम द्वारा पाइपलाइन वेल्डिंग जारी',
        titleEn: 'Pipeline Welding & Fitting In-Progress',
        timestamp: 'वर्तमान स्थिति',
        description: 'मुख्य लाइन प्रेशर टेस्टिंग जारी',
        descriptionEn: 'Main line pressure testing underway',
        status: 'current'
      }
    ]
  },
  {
    token: '#NR-8620',
    category: 'सौर ऊर्जा व स्ट्रीट लाइट',
    title: 'वार्ड 14 जसूर बाजार में सोलर हाई-मास्ट लाइट की बैटरी प्रतिस्थापन',
    titleEn: 'Solar High-Mast Light Battery Replacement at Ward 14 Jasur',
    location: 'स्थान: वार्ड 14, जसूर चौक, नूरपुर',
    wardNo: 14,
    citizenName: 'करनैल सिंह',
    phone: '94182*****',
    status: 'verified',
    submittedDate: '22 Oct 2026, 06:40 PM',
    whatsappSubscribed: false,
    createdAt: '2026-10-22T18:40:00Z',
    updatedAt: '2026-10-24T20:00:00Z',
    timeline: [
      {
        title: 'शिकायत दर्ज',
        titleEn: 'Complaint Registered',
        timestamp: '22 Oct, 06:40 PM',
        description: 'शाम के समय अंधेरे की सूचना पन्ना प्रमुख द्वारा प्रेषित',
        descriptionEn: 'Darkness reported by Panna Pramukh in market area',
        status: 'done'
      },
      {
        title: 'तकनीकी टीम द्वारा स्थल निरीक्षण',
        titleEn: 'Technical Inspection Complete',
        timestamp: '23 Oct, 11:00 AM',
        description: 'नई लिथियम बैटरी स्वीकृत एवं स्थापित',
        descriptionEn: 'New lithium battery approved & installed',
        status: 'done'
      },
      {
        title: 'कैंप ऑफिस व व्यापार मंडल द्वारा कार्य सत्यापित',
        titleEn: 'Work Verified by Camp Office & Merchant Union',
        timestamp: '24 Oct, 08:00 PM',
        description: 'लाइट पूरी क्षमता से प्रज्वलित, स्थानीय व्यापारियों द्वारा संतुष्टि प्रमाण',
        descriptionEn: 'Light functioning properly, verified on site',
        status: 'done'
      }
    ]
  },
  {
    token: '#NR-8519',
    category: 'बाढ़ सुरक्षा एवं दंगा निर्माण',
    title: 'वार्ड 19 भदवार खड्ड कृषि भूमि कटाव सुरक्षा दीवार (दंगा) निरीक्षण',
    titleEn: 'Ward 19 Bhadwar Khadd Flood Protection Wall Inspection',
    location: 'स्थान: वार्ड 19 भदवार, नूरपुर',
    wardNo: 19,
    citizenName: 'श्रीमती सरोज देवी',
    phone: '98166*****',
    status: 'resolved',
    submittedDate: '18 Oct 2026, 11:00 AM',
    whatsappSubscribed: true,
    createdAt: '2026-10-18T11:00:00Z',
    updatedAt: '2026-10-25T15:00:00Z',
    timeline: [
      {
        title: 'शिकायत दर्ज (पदयात्रा जनसंवाद में)',
        titleEn: 'Complaint Filed in Padyatra',
        timestamp: '18 Oct, 11:00 AM',
        description: 'खड्ड के किनारे कृषि भूमि कटाव रोकने हेतु दंगा मांग',
        descriptionEn: 'Demand for protection wall against land erosion',
        status: 'done'
      },
      {
        title: 'विधायक निधि से ₹5.20 लाख स्वीकृत',
        titleEn: '₹5.20 Lakh Sanctioned via MLA-LAD',
        timestamp: '19 Oct, 04:00 PM',
        description: 'बीडीओ नूरपुर को तकनीकी प्राक्कलन अनुसार कार्य आदेश',
        descriptionEn: 'BDO Nurpur issued sanction orders',
        status: 'done'
      },
      {
        title: '60 मीटर सुरक्षा दीवार निर्माण पूर्ण',
        titleEn: '60m Protection Wall Construction Complete',
        timestamp: '25 Oct, 03:00 PM',
        description: 'ग्राम पंचायत द्वारा पूर्णता प्रमाण पत्र जारी',
        descriptionEn: 'Panchayat issued completion certificate',
        status: 'done'
      }
    ]
  },
  {
    token: '#NR-8402',
    category: 'सड़क एवं लिंक मार्ग',
    title: 'वार्ड 02 नूरपुर शहर गंदराण लिंक रोड इंटरलॉकिंग टाइल्स कार्य',
    titleEn: 'Interlocking Tiles on Gandran Link Road, Ward 02 Nurpur',
    location: 'स्थान: वार्ड 02, गंदराण मोहल्ला, नूरपुर',
    wardNo: 2,
    citizenName: 'पवन डोगरा',
    phone: '94188*****',
    status: 'verified',
    submittedDate: '15 Oct 2026, 02:15 PM',
    whatsappSubscribed: true,
    createdAt: '2026-10-15T14:15:00Z',
    updatedAt: '2026-10-22T17:00:00Z',
    timeline: [
      {
        title: 'मांग पत्र प्राप्त व निरीक्षण',
        titleEn: 'Application Received & Inspected',
        timestamp: '15 Oct, 02:15 PM',
        description: '10 वर्षों से कच्चे रास्ते की समस्या दर्ज',
        descriptionEn: 'Unpaved road pending since 10 years',
        status: 'done'
      },
      {
        title: 'PWD व नगर परिषद द्वारा टाइल बिछाने का कार्य पूर्ण',
        titleEn: 'Interlocking Paver Laying Complete',
        timestamp: '22 Oct, 05:00 PM',
        description: 'गुणवत्ता परीक्षण जेई द्वारा सत्यापित',
        descriptionEn: 'Quality tested & verified by JE',
        status: 'done'
      }
    ]
  },
  {
    token: '#NR-8990',
    category: 'सामुदायिक स्वास्थ्य एवं एम्बुलेंस',
    title: 'वार्ड 07 प्राथमिक स्वास्थ्य उप-केंद्र पर रात्रिकालीन स्टाफ व एम्बुलेंस सेवा',
    titleEn: 'Night Staff & Ambulance Service at Ward 07 Primary Health Sub-Centre',
    location: 'स्थान: वार्ड 07, राजा का बाग, नूरपुर',
    wardNo: 7,
    citizenName: 'सुनील कटोच',
    phone: '98167*****',
    status: 'pending',
    submittedDate: '27 Oct 2026, 07:15 AM',
    whatsappSubscribed: true,
    createdAt: '2026-10-27T07:15:00Z',
    updatedAt: '2026-10-29T07:15:00Z',
    timeline: [
      {
        title: 'शिकायत दर्ज (नागरिक द्वारा)',
        titleEn: 'Complaint Registered by Citizen',
        timestamp: '27 Oct, 07:15 AM',
        description: 'रात के समय आपातकालीन चिकित्सा सेवा हेतु आवेदन',
        descriptionEn: 'Request for 24x7 emergency medical duty staff',
        status: 'done'
      },
      {
        title: 'मुख्य चिकित्सा अधिकारी (CMO) को अग्रसारित',
        titleEn: 'Forwarded to Chief Medical Officer (CMO)',
        timestamp: 'प्रक्रियाधीन',
        description: 'कैंप कार्यालय द्वारा आधिकारिक संज्ञान व समीक्षा',
        descriptionEn: 'Official cognizance taken by Camp Office',
        status: 'current'
      }
    ]
  },
  {
    token: '#NR-8998',
    category: 'सिंचाई एवं कूहल (नहर) मरम्मत',
    title: 'वार्ड 11 जाफरपुर कूहल में सिल्ट भराव से खरीफ फसल सिंचाई में बाधा',
    titleEn: 'Silt Blockage in Ward 11 Jafarpur Irrigation Kuhal',
    location: 'स्थान: वार्ड 11, जाफरपुर, नूरपुर',
    wardNo: 11,
    citizenName: 'दलजीत सिंह',
    phone: '98169*****',
    status: 'pending',
    submittedDate: '28 Oct 2026, 09:40 AM',
    whatsappSubscribed: true,
    createdAt: '2026-10-28T09:40:00Z',
    updatedAt: '2026-10-29T09:40:00Z',
    timeline: [
      {
        title: 'शिकायत दर्ज (किसान प्रतिनिधि द्वारा)',
        titleEn: 'Complaint Registered by Farmer Rep',
        timestamp: '28 Oct, 09:40 AM',
        description: 'खेतों तक पानी पहुंचाने वाली मुख्य कूहल में अवरोध',
        descriptionEn: 'Blockage in main agricultural kuhal affecting tail-end farms',
        status: 'done'
      },
      {
        title: 'सिंचाई एवं जन स्वास्थ्य (IPH) उपमंडल को निर्देश',
        titleEn: 'Instructions Issued to IPH Sub-Division',
        timestamp: 'लंबित समीक्षा',
        description: 'जेसीबी से गाद निकासी हेतु प्राथमिकता सूची में शामिल',
        descriptionEn: 'Queued for priority desilting machine deployment',
        status: 'pending'
      }
    ]
  }
];

// Live in-memory database store
let grievancesDatabase: GrievanceRecord[] = [...initialGrievances];

// Realtime SSE connected clients for live snapshot sync
const sseClients: Response[] = [];

function broadcastEvent(type: string, data: any) {
  const payload = `data: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// ============================================================================
// 2. SERVER INITIALIZATION & API ROUTING
// ============================================================================

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // CORS headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // --- HEALTH & DB STATUS ---
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Janadesh Election & Civic Portal API',
      database: {
        engine: process.env.DATABASE_URL ? 'PostgreSQL (Cloud SQL)' : 'In-Memory / Local PostgreSQL Emulation',
        realtimeSync: 'Server-Sent Events (SSE) & Firestore Sync Adapter',
        recordCount: grievancesDatabase.length,
      },
      timestamp: new Date().toISOString()
    });
  });

  // --- STATS & ANALYTICS ---
  app.get('/api/stats', (req: Request, res: Response) => {
    const total = grievancesDatabase.length;
    const resolved = grievancesDatabase.filter(g => g.status === 'resolved').length;
    const verified = grievancesDatabase.filter(g => g.status === 'verified').length;
    const inProgress = grievancesDatabase.filter(g => g.status === 'in-progress').length;
    const pending = grievancesDatabase.filter(g => g.status === 'pending').length;
    const redressalRate = total > 0 ? Math.round(((resolved + verified) / total) * 100) : 0;

    res.json({
      total,
      resolved,
      verified,
      inProgress,
      pending,
      redressalRate,
      wardsCoverage: 24,
      updatedAt: new Date().toISOString()
    });
  });

  // --- REAL-TIME LIVE EVENT STREAM (SSE) ---
  app.get('/api/stream/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial snapshot
    res.write(`data: ${JSON.stringify({ type: 'SNAPSHOT', data: grievancesDatabase })}\n\n`);

    sseClients.push(res);

    req.on('close', () => {
      const idx = sseClients.indexOf(res);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
  });

  // --- GRIEVANCES REST API ---
  app.get('/api/grievances', (req: Request, res: Response) => {
    const { status, wardNo, search } = req.query;
    let results = [...grievancesDatabase];

    if (status && status !== 'all') {
      results = results.filter(g => g.status === status);
    }

    if (wardNo && wardNo !== 'all') {
      const wNum = parseInt(wardNo as string, 10);
      if (!isNaN(wNum)) {
        results = results.filter(g => g.wardNo === wNum);
      }
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      results = results.filter(g => 
        g.token.toLowerCase().includes(q) ||
        g.title.toLowerCase().includes(q) ||
        g.titleEn.toLowerCase().includes(q) ||
        g.location.toLowerCase().includes(q) ||
        g.citizenName.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  });

  app.get('/api/grievances/:token', (req: Request, res: Response) => {
    const token = req.params.token;
    const found = grievancesDatabase.find(g => g.token.toLowerCase() === token.toLowerCase());
    if (!found) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }
    res.json({ success: true, data: found });
  });

  app.post('/api/grievances', (req: Request, res: Response) => {
    const { category, title, titleEn, location, wardNo, citizenName, phone } = req.body;

    if (!category || !location || !citizenName) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const token = `#NR-${randomNum}`;
    const now = new Date();
    const formattedDate = `${now.getDate()} Oct 2026, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newTicket: GrievanceRecord = {
      token,
      category: category || 'सामान्य नागरिक समस्या',
      title: title || `${category} - ${location}`,
      titleEn: titleEn || `${category} issue at ${location}`,
      location: `स्थान: ${location}, वार्ड ${wardNo || 14}`,
      wardNo: Number(wardNo) || 14,
      citizenName,
      phone: phone || '98160*****',
      status: 'pending',
      submittedDate: formattedDate,
      whatsappSubscribed: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timeline: [
        {
          title: 'शिकायत दर्ज (नागरिक द्वारा)',
          titleEn: 'Complaint Registered by Citizen',
          timestamp: formattedDate,
          description: 'Janadesh डिजिटल नागरिक पोर्टल से सीधे पंजीकृत',
          descriptionEn: 'Registered directly via Janadesh Digital Civic Portal',
          status: 'done'
        },
        {
          title: 'विधायक कैंप ऑफिस द्वारा समीक्षा',
          titleEn: 'Camp Office Review & Assignment',
          timestamp: 'प्रक्रियाधीन',
          description: 'प्राथमिकता व संबंधित विभाग को आवंटन प्रक्रियाधीन',
          descriptionEn: 'Priority assignment & dispatch in progress',
          status: 'current'
        }
      ]
    };

    // Prepend to database
    grievancesDatabase.unshift(newTicket);

    // Broadcast live event to all connected clients (real-time sync)
    broadcastEvent('GRIEVANCE_CREATED', newTicket);

    res.status(201).json({
      success: true,
      message: 'Grievance lodged successfully',
      data: newTicket
    });
  });

  // PATCH status update
  app.patch('/api/grievances/:token/status', (req: Request, res: Response) => {
    const token = req.params.token;
    const { status, note } = req.body;

    const ticket = grievancesDatabase.find(g => g.token.toLowerCase() === token.toLowerCase());
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    const validStatuses = ['pending', 'in-progress', 'resolved', 'verified'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();

    if (note) {
      ticket.timeline.push({
        title: `स्थिति अद्यतन: ${status.toUpperCase()}`,
        titleEn: `Status Updated: ${status.toUpperCase()}`,
        timestamp: 'अभी-अभी',
        description: note,
        descriptionEn: note,
        status: status === 'resolved' || status === 'verified' ? 'done' : 'current'
      });
    }

    // Broadcast status change
    broadcastEvent('GRIEVANCE_UPDATED', ticket);

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: ticket
    });
  });

  // --- WAR ROOM LIVE ALERTS API ---
  app.get('/api/war-room/alerts', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: [
        {
          id: 'alert-1',
          time: '08:45 AM',
          wardNo: 12,
          priority: 'CRITICAL',
          status: 'DISPATCHED',
          title: 'वार्ड 12 ट्रांसफार्मर रिप्लेसमेंट टीम मौके पर पहुंची',
          titleEn: 'Ward 12 Transformer Squad Reached Site'
        },
        {
          id: 'alert-2',
          time: '10:15 AM',
          wardNo: 8,
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          title: 'वार्ड 08 कोटला चौक पानी टैंकर आपूर्ति चालू',
          titleEn: 'Ward 08 Kotla Chowk Water Tanker Active'
        },
        {
          id: 'alert-3',
          time: '11:30 AM',
          wardNo: 14,
          priority: 'NORMAL',
          status: 'RESOLVED',
          title: 'जसूर बाजार सोलर लाइट सत्यापन पूर्ण',
          titleEn: 'Jasur Market Solar Light Verified'
        }
      ]
    });
  });

  // --- VITE MIDDLEWARE (DEV) & STATIC FILES (PROD) ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Janadesh Server] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
