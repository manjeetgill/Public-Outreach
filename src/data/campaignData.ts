import { ProjectItem, GrievanceTicket, PadyatraStop, KaryakartaTask, MediaKitItem, WardInfo, VisionItem } from '../types/campaign';

export const MLA_INFO = {
  name: 'रणबीर सिंह निक्का',
  nameEn: 'Ranbir Singh Nikka',
  title: 'सक्रिय विधायक एवं समर्पित जनसेवक',
  titleEn: 'Sitting MLA & Dedicated Civic Leader',
  constituency: 'नूरपुर • कांगड़ा (वि.स. 142)',
  constituencyEn: 'Nurpur • Kangra (A.C. 142)',
  slogan: 'घर-घर निक्का, हर घर निक्का',
  sloganEn: 'Ghar-Ghar Nikka, Har Ghar Nikka',
  tenure: 'अटूट जन-समर्पण एवं सेवा पथ (2022–वर्तमान)',
  tenureEn: 'Unbroken Civic Dedication & Service (2022–Present)',
  helpline: '1800-123-456',
  campOfficePhone: '01893-222111',
  disasterHelpline: '1077',
  whatsappNumber: '+919816000000',
  officialEmail: 'mla.nurpur142@hp.gov.in',
  campOfficeAddress: 'विधायक मुख्य जनसंपर्क कार्यालय, कैंप रोड, निकट कोर्ट परिसर, नूरपुर, जिला कांगड़ा (हि.प्र.) - 176202',
  campOfficeAddressEn: 'MLA Main Civic Secretariat, Camp Road, Near Judicial Complex, Nurpur, Dist. Kangra (H.P.) - 176202',
  logoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1URrhj--LIGw_m228IiEh76BELOa61ztIlDA2fag_fH_KWgAhkK9fuJDogh37Tgy3oCF03QRSp2lSqTG45zqzRvBcr_heGIEr5P4SExffcxR-kjGEPhVuokSa0R0CR2eFGQHrYDbOo0FSI9ljnUkbNyQEPCJew3xTwlHnCFC7_Rh6taTox6Xujw7xTInNMoo9SDfx31obic5dankLArLtRZPfrUNB7_LhuOeF15faIA',
  photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgnPad_M4eB_fy1Ehj3vnwKyrhb20mnByuc8sRcNz8GMcF0SsnonhWyrBYpIjiAvbekdpshkQyg84ieICet6mc5gZraFsrvege6p4Hud8HFcOIFBLhwiN-F0QGuDIwvpmObjsjWWCGBZtCfTfJx-XY9mV_j8J-DrSPrVyX6iJb5g5g09zw0uI3EOtrHdBo0rqA_lFzlqQem_wQL1_RIMmvS8WpDUo4w5OL9Zit1SKponYTJW4iP1Oa',
  stats: {
    worksCompleted: 148,
    mlaFundSpentCr: 42,
    totalGrantSanctionedCr: 118,
    totalSchemes: 142,
    resolutionRate: '94%',
    turnaroundHours: 48,
    resolvedCount: 1840,
    inProgressCount: 112,
    totalVotersInConstituency: 92450,
    totalBooths: 118,
    wardsCount: 24
  }
};

export const WEB_ANNOUNCEMENTS = [
  '📢 नूरपुर 4-लेन बाईपास रिंग रोड एवं सोलर लाइटिंग कार्य 100% पूर्ण होकर जनता को समर्पित।',
  '🏥 प्राथमिक स्वास्थ्य केंद्र (PHC) वार्ड 08 में नई डिजिटल पैथोलॉजी लैब व मातृत्व विंग 24x7 चालू।',
  '💧 हर घर नल जल योजना: 5 नए ओवरहेड वाटर टैंक से 14,000+ परिवारों को नियमित जलापूर्ति शुरू।',
  '⚖️ कल सुबह 10:00 बजे विधायक कैंप ऑफिस में साप्ताहिक खुली जनसुनवाई आयोजित की जाएगी।'
];

export const INITIAL_PADYATRA: PadyatraStop[] = [
  {
    time: '10:00 AM',
    title: 'जनसुनवाई शिविर • कैंप रोड',
    titleEn: 'Public Hearing Camp • Camp Road',
    location: 'विधायक मुख्य जनसंपर्क कार्यालय, कैंप रोड, नूरपुर',
    locationEn: 'MLA Civic Office, Camp Road, Nurpur',
    description: '48 नागरिक आवेदनों का मौके पर निस्तारण • राशन, सड़क व विद्युत समस्याओं का निपटारा',
    descriptionEn: '48 applications resolved on the spot • Ration, road and power grievance redressal',
    status: 'completed',
    attendeesCount: '120+ नागरिक'
  },
  {
    time: '04:30 PM',
    title: 'पदयात्रा व चौपाल • मुख्य बाजार',
    titleEn: 'Padyatra & Chaupal • Main Bazaar',
    location: 'वार्ड १४, शिव मंदिर चौक से मुख्य बाजार तक',
    locationEn: 'Ward 14, Shiv Mandir Chowk to Main Market',
    description: 'स्थानीय व्यापारियों एवं मातृशक्ति के साथ सीधा संवाद, स्वच्छता व सोलर लाइट निरीक्षण',
    descriptionEn: 'Direct engagement with local traders, women groups; inspecting sanitation & solar lights',
    status: 'current',
    attendeesCount: '450+ जनसमुदाय'
  },
  {
    time: '07:30 PM',
    title: 'युवा संवाद एवं नुक्कड़ सभा',
    titleEn: 'Youth Dialogue & Street Corner Meet',
    location: 'वार्ड १९, डॉ. भीमराव अंबेडकर पार्क, नूरपुर',
    locationEn: 'Ward 19, Dr. BR Ambedkar Park, Nurpur',
    description: 'खेल मैदान आधुनिकीकरण, कौशल विकास केंद्र एवं प्रतियोगी परीक्षा लाइब्रेरी पर चर्चा',
    descriptionEn: 'Discussion on sports ground upgrade, skill development center and competitive exam library',
    status: 'upcoming',
    attendeesCount: 'अनुमानित 200+'
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [

  {
    id: 'proj-1',
    title: 'नूरपुर 4-लेन बाईपास रिंग रोड एवं सोलर स्ट्रीट लाइटिंग',
    titleEn: 'Nurpur 4-Lane Bypass Ring Road & Solar LED Network',
    category: 'roads',
    categoryLabel: 'सड़क एवं पुल',
    categoryLabelEn: 'Roads & Bridges',
    ward: 'वार्ड 14, 15 व 18',
    wardNo: 14,
    cost: '₹8.40 करोड़ स्वीकृत',
    sanctionNo: 'PWD/NR-142',
    status: 'completed',
    description: '6.8 किमी लंबे बाईपास का कायाकल्प। भारी वाहनों का शहर से बाहर डायवर्जन, 420 सोलर एलईडी लाइट्स और दोनों ओर वृक्षारोपण।',
    descriptionEn: 'Revamp of 6.8 km bypass road. Traffic diversion for heavy vehicles, 420 solar LED lights and green plantation belt.',
    impact: 'शहर में 65% जाम में कमी एवं वायु प्रदूषण से राहत',
    feedbackAuthor: 'रमेश चंद्र',
    feedbackRole: 'स्थानीय किसान व फल उत्पादक संघ',
    feedbackText: 'पहले मंडी तक फल-सब्जी पहुंचाने में 2 घंटे लगते थे। अब मात्र 20 मिनट में सफर पूरा होता है। विधायक निक्का जी ने दिया अपना वचन निभाया।'
  },
  {
    id: 'proj-2',
    title: 'हर घर नल जल योजना: 5 ओवरहेड वाटर टैंक एवं बोरवेल नेटवर्क',
    titleEn: 'Har Ghar Nal Jal Scheme: 5 Overhead Tanks & Borewell Grid',
    category: 'water',
    categoryLabel: 'पेयजल व नल',
    categoryLabelEn: 'Drinking Water',
    ward: 'वार्ड 02 से 08 (उत्तरी क्षेत्र)',
    wardNo: 4,
    cost: '₹14.20 करोड़ स्वीकृत',
    sanctionNo: 'JJM/NR-092',
    status: 'completed',
    description: 'फ्लोराइड मुक्त शुद्ध पेयजल। 5 बड़े आरसीसी जल भंडारण टैंक और 42 किमी पाइपलाइन से 14,000+ परिवारों को 24x7 मीठा पानी।',
    descriptionEn: 'Fluoride-free pure potable water. 5 RCC overhead storage tanks & 42 km pipeline supplying 14,000+ households.',
    impact: '14,000+ ग्रामीण एवं शहरी परिवारों को शुद्ध नल जल आपूर्ति',
    feedbackAuthor: 'श्रीमती सुनीता देवी',
    feedbackRole: 'अध्यक्ष, महिला मंडल वार्ड 06',
    feedbackText: 'गर्मियों में पानी के टैंकरों के पीछे भागना पड़ता था। आज हमारे आंगन में सुबह-शाम पर्याप्त दबाव से मीठा पानी आ रहा है।'
  },
  {
    id: 'proj-3',
    title: 'वार्ड ०८ प्राथमिक स्वास्थ्य केंद्र (PHC) का भव्य कायाकल्प',
    titleEn: 'Ward 08 Primary Health Center (PHC) Modernization & Maternity Wing',
    category: 'health',
    categoryLabel: 'शिक्षा व स्वास्थ्य',
    categoryLabelEn: 'Health & Education',
    ward: 'वार्ड 08 (रामपुर चौक)',
    wardNo: 8,
    cost: '₹1.45 करोड़ स्वीकृत',
    sanctionNo: 'NHM/HP-554',
    status: 'completed',
    description: '24x7 आपातकालीन सेवा, पैथोलॉजी लैब, डिजिटल एक्सरे, नव-निर्मित 12-बेड मातृत्व विंग एवं निशुल्क जन औषधि केंद्र।',
    descriptionEn: '24x7 emergency medical service, pathology lab, digital X-Ray, modern 12-bed maternity wing and Jan Aushadhi center.',
    impact: '18,000+ नागरिकों को अपने ही वार्ड में निशुल्क स्वास्थ्य सुविधा',
    feedbackAuthor: 'डॉ. राजेश गुलेरिया',
    feedbackRole: 'वरिष्ठ चिकित्सा अधिकारी',
    feedbackText: 'मातृत्व और आपातकालीन मामलों में पहले धर्मशाला या पठानकोट रेफर करना पड़ता था। अब यहीं पर सुरक्षित प्रसव और इलाज संभव हुआ है।'
  },
  {
    id: 'proj-4',
    title: 'नूरपुर राजकीय मॉडल सीनियर सेकेंडरी स्कूल: डिजिटल स्मार्ट क्लासरूम',
    titleEn: 'Govt Model Senior Secondary School: 12 Digital Smart Classrooms & STEM Lab',
    category: 'education',
    categoryLabel: 'शिक्षा व स्वास्थ्य',
    categoryLabelEn: 'Health & Education',
    ward: 'वार्ड 11 (शिक्षा नगर)',
    wardNo: 11,
    cost: '₹2.10 करोड़ स्वीकृत',
    sanctionNo: 'EDU/NR-310',
    status: 'completed',
    description: '12 इंटरैक्टिव स्मार्ट बोर्ड, हाई-स्पीड ऑप्टिकल फाइबर इंटरनेट, आधुनिक रोबोटिक्स व कंप्यूटर लैब और आधुनिक बालिका शौचालय ब्लॉक।',
    descriptionEn: '12 interactive smart boards, high-speed fiber internet, modern robotics lab and dedicated girls hygiene facility.',
    impact: '1,250 छात्र-छात्राओं को अत्याधुनिक डिजिटल शिक्षा',
    feedbackAuthor: 'प्रो. अशोक कटोच',
    feedbackRole: 'प्रधानाचार्य',
    feedbackText: 'सरकारी स्कूल अब निजी कॉन्वेंट स्कूलों को टक्कर दे रहे हैं। विधायक निधि से मिली स्मार्ट लैब से बच्चों के रिजल्ट में 28% का सुधार हुआ है।'
  },
  {
    id: 'proj-5',
    title: 'नूरपुर मिनी स्टेडियम एवं फ्लडलाइट स्पोर्ट्स कॉम्प्लेक्स',
    titleEn: 'Nurpur Mini Stadium & High-Mast Floodlit Sports Complex',
    category: 'community',
    categoryLabel: 'सामुदायिक भवन',
    categoryLabelEn: 'Community Infrastructure',
    ward: 'वार्ड 19 (अंबेडकर चौक)',
    wardNo: 19,
    cost: '₹3.60 करोड़ स्वीकृत',
    sanctionNo: 'YAS/HP-802',
    status: 'in-progress',
    description: 'सिंथेटिक 400 मी. रनिंग ट्रैक, वॉलीबॉल व बास्केटबॉल कोर्ट, ओपन एयर जिम और रात के खेलों के लिए 4 हाई-मास्ट सोलर लाइट टावर।',
    descriptionEn: '400m synthetic running track, basketball & volleyball courts, open gym and 4 high-mast floodlight towers.',
    impact: 'युवाओं को सेना/पुलिस भर्ती प्रशिक्षण व खेल प्रोत्साहन',
    feedbackAuthor: 'कैप्टन (से.नि.) बलबीर सिंह',
    feedbackRole: 'युवा खेल क्लब संयोजक',
    feedbackText: 'सेना भर्ती की तैयारी करने वाले युवाओं के लिए यह वरदान साबित हो रहा है। 85% निर्माण पूर्ण हो चुका है।'
  },
  {
    id: 'proj-6',
    title: 'ग्रामीण कृषि फीडर एवं 25 नए ट्रांसफार्मर प्रतिस्थापन',
    titleEn: 'Rural Agricultural Electricity Feeder & 25 New 100kVA Transformers',
    category: 'solar',
    categoryLabel: 'विद्युत व ऊर्जा',
    categoryLabelEn: 'Power & Energy',
    ward: 'वार्ड 01, 03, 07, 12 व 22',
    wardNo: 12,
    cost: '₹4.85 करोड़ स्वीकृत',
    sanctionNo: 'HPSEB/NR-771',
    status: 'completed',
    description: 'पुराने जर्जर तारों को बदलकर एरियल बंच केबल (ABC) लगाना, 25 नए 100 kVA ट्रांसफार्मर जिससे लो-वोल्टेज और बार-बार ट्रिपिंग की समस्या खत्म हुई।',
    descriptionEn: 'Replaced hanging bare wires with Aerial Bunched Cables, installed 25 new heavy-duty transformers eliminating low-voltage issues.',
    impact: '3,200 किसान नलकूपों व 8,000 घरों को निर्बाध बिजली',
    feedbackAuthor: 'गुरमीत सिंह',
    feedbackRole: 'प्रगतिशील किसान',
    feedbackText: 'धान और गेहूं की सिंचाई के समय मोटर जल जाती थी। नए ट्रांसफार्मर लगने के बाद 24 घंटे पूरी वोल्टेज मिल रही है।'
  }
];

export const INITIAL_GRIEVANCES: GrievanceTicket[] = [
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
      },
      {
        title: 'अंतिम निस्तारण व नागरिक संतुष्टि कॉल',
        titleEn: 'Final Resolution & Citizen Satisfaction Call',
        timestamp: 'लंबित',
        description: 'कैंप ऑफिस कंट्रोल रूम से फीडबैक कॉल व फोटो अपलोड',
        descriptionEn: 'Feedback verification call & resolution certificate',
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
  }
];

export const INITIAL_TASKS: KaryakartaTask[] = [
  {
    id: 'task-1',
    title: 'वरिष्ठ नागरिक पन्ना प्रमुख सत्यापन',
    titleEn: 'Senior Citizen Panna Pramukh Verification',
    description: '18 पोस्टल बैलट वरिष्ठ नागरिकों से संपर्क हुआ।',
    descriptionEn: '18 postal ballot senior citizens contacted & guided.',
    points: 150,
    completed: true,
    category: 'senior'
  },
  {
    id: 'task-2',
    title: 'घर-घर मतदाता पर्ची वितरण (Voter Slip)',
    titleEn: 'Door-to-Door Voter Slip Distribution',
    description: 'प्रगति: 42 / 100 वितरित • चंदनपुर गली 1 से 4',
    descriptionEn: 'Progress: 42 / 100 slips handed over in Chandanpur lanes.',
    points: 200,
    completed: false,
    category: 'voter'
  },
  {
    id: 'task-3',
    title: '28 तारीख विशाल जन संकल्प रैली संपर्क',
    titleEn: 'Mobilize Youth for Grand Rally on 28th',
    description: '30 युवा कार्यकर्ताओं को वाहन सहित सूचित करें।',
    descriptionEn: 'Notify 30 youth volunteers with two-wheelers for convoy.',
    points: 350,
    completed: false,
    category: 'rally'
  },
  {
    id: 'task-4',
    title: 'व्हाट्सएप स्टेटस पर रिपोर्ट कार्ड साझा करें',
    titleEn: 'Post 5-Year Report Card on WhatsApp Status',
    description: 'कम से कम 50 स्थानीय संपर्कों तक विकास रिपोर्ट पहुंचाएं।',
    descriptionEn: 'Reach at least 50 local contacts with performance report.',
    points: 100,
    completed: true,
    category: 'digital'
  }
];

export const MEDIA_KIT_ITEMS: MediaKitItem[] = [
  {
    id: 'media-1',
    title: 'निक्का विज़न 2029 पोस्टर (WhatsApp Status)',
    titleEn: 'Nikka Vision 2029 Poster (WhatsApp Status / Story)',
    type: 'image',
    dimensionsOrFormat: '1080x1920 • PNG HD',
    size: '1.8 MB',
    downloadFilename: 'Nikka_Vision_2029_Poster.png',
    badge: 'सर्वाधिक साझा'
  },
  {
    id: 'media-2',
    title: 'आधिकारिक चुनावी धुन व जिंगल (Audio MP3)',
    titleEn: 'Official Campaign Jingle & Dholak Anthem (Audio MP3)',
    type: 'audio',
    dimensionsOrFormat: 'ढोलक एंथम • 45 सेकंड्स लाउडस्पीकर रेडी',
    size: '1.2 MB',
    downloadFilename: 'Nikka_Campaign_Anthem.mp3',
    badge: 'लाउडस्पीकर रेडी'
  },
  {
    id: 'media-3',
    title: '5-वर्षीय विकास रिपोर्ट पैम्फलेट (Printable PDF)',
    titleEn: '5-Year Constituency Report Card Booklet (PDF)',
    type: 'pdf',
    dimensionsOrFormat: '4-पृष्ठ प्रिंटेबल लीफलेट • A4',
    size: '3.4 MB',
    downloadFilename: 'Ranbir_Singh_Nikka_5Yr_Report.pdf',
    badge: 'प्रमाणित ब्योरा'
  },
  {
    id: 'media-4',
    title: 'डिजिटल कार्यकर्ता डीपी फ्रेम व बैज (PNG)',
    titleEn: 'Digital Campaign DP Badge & Frame (Square PNG)',
    type: 'image',
    dimensionsOrFormat: '1080x1080 • पारदर्शी फ्रेम',
    size: '850 KB',
    downloadFilename: 'Nikka_Supporter_DP_Frame.png',
    badge: 'सोशल मीडिया'
  }
];

export const NURPUR_WARDS: WardInfo[] = [
  {
    wardNo: 1,
    name: 'वार्ड 01 - खन्नी व कोटला',
    nameEn: 'Ward 01 - Khanni & Kotla',
    voters: 3840,
    completedWorksCount: 7,
    budgetSpentLakhs: 184,
    majorWork: 'कृषि फीडर एवं ट्रांसफार्मर अपग्रेडेशन',
    majorWorkEn: 'Agri Feeder & Transformer Upgrade',
    pannaPramukh: 'सुरजीत सिंह',
    contact: '98160-11001',
    keyIssuesResolved: ['लो वोल्टेज समाधान', 'सिंचाई कूहल मरम्मत']
  },
  {
    wardNo: 2,
    name: 'वार्ड 02 - चौगान व जसूर लिंक',
    nameEn: 'Ward 02 - Chaugan & Jasoor Link',
    voters: 4120,
    completedWorksCount: 9,
    budgetSpentLakhs: 245,
    majorWork: 'जसूर लिंक सड़क चौड़ीकरण एवं आरसीसी नाली',
    majorWorkEn: 'Jasoor Link Road Widening & RCC Drain',
    pannaPramukh: 'राजेश धीमान',
    contact: '98160-11002',
    keyIssuesResolved: ['बरसाती पानी निकासी', 'सोलर स्ट्रीट लाइट्स']
  },
  {
    wardNo: 3,
    name: 'वार्ड 03 - भड़वार',
    nameEn: 'Ward 03 - Bhadwar',
    voters: 3650,
    completedWorksCount: 6,
    budgetSpentLakhs: 160,
    majorWork: 'नल जल योजना एवं 1 लाख लीटर ओवरहेड टैंक',
    majorWorkEn: 'Nal Jal Scheme & 1L Litre Overhead Tank',
    pannaPramukh: 'कुलदीप गुलेरिया',
    contact: '98160-11003',
    keyIssuesResolved: ['शुद्ध पेयजल आपूर्ति', 'शमशान घाट शेड निर्माण']
  },
  {
    wardNo: 4,
    name: 'वार्ड 04 - बदूही',
    nameEn: 'Ward 04 - Badoohi',
    voters: 3910,
    completedWorksCount: 8,
    budgetSpentLakhs: 210,
    majorWork: 'प्राथमिक विद्यालय कायाकल्प एवं पेवर ब्लॉक रास्ते',
    majorWorkEn: 'Primary School Renovation & Paver Pathways',
    pannaPramukh: 'संजय राणा',
    contact: '98160-11004',
    keyIssuesResolved: ['स्मार्ट क्लासरूम', 'तारकोल सड़क लेपन']
  },
  {
    wardNo: 5,
    name: 'वार्ड 05 - नूरपुर बाजार व राधा कृष्ण मंदिर',
    nameEn: 'Ward 05 - Nurpur Bazaar & Temple Area',
    voters: 4400,
    completedWorksCount: 11,
    budgetSpentLakhs: 320,
    majorWork: 'व्यापार मंडल मार्केट पेवर व आधुनिक स्ट्रीट ड्रेनेज',
    majorWorkEn: 'Market Pavers & Underground Drainage',
    pannaPramukh: 'अनिल महाजन',
    contact: '98160-11005',
    keyIssuesResolved: ['बाजार में जलभराव', 'हाई-मास्ट सोलर लाइट']
  },
  {
    wardNo: 6,
    name: 'वार्ड 06 - नियाजपुर',
    nameEn: 'Ward 06 - Niazpur',
    voters: 3780,
    completedWorksCount: 7,
    budgetSpentLakhs: 195,
    majorWork: 'मातृ एवं शिशु स्वास्थ्य उप-केंद्र का विस्तार',
    majorWorkEn: 'Maternal Sub-Health Center Expansion',
    pannaPramukh: 'श्रीमती अनीता देवी',
    contact: '98160-11006',
    keyIssuesResolved: ['नियमित एएनएम सेवा', 'पेयजल पाइपलाइन बदली']
  },
  {
    wardNo: 7,
    name: 'वार्ड 07 - छतरोली',
    nameEn: 'Ward 07 - Chhatroli',
    voters: 4100,
    completedWorksCount: 8,
    budgetSpentLakhs: 230,
    majorWork: 'छतरोली पुल एप्रोच रोड व सुरक्षा दीवार',
    majorWorkEn: 'Bridge Approach Road & Retaining Wall',
    pannaPramukh: 'मनिंदर कटोच',
    contact: '98160-11007',
    keyIssuesResolved: ['भूस्खलन सुरक्षा', 'नया 63kVA ट्रांसफार्मर']
  },
  {
    wardNo: 8,
    name: 'वार्ड 08 - रामपुर व मुख्य पीएचसी परिसर',
    nameEn: 'Ward 08 - Rampur & PHC Complex',
    voters: 4520,
    completedWorksCount: 12,
    budgetSpentLakhs: 415,
    majorWork: '24x7 मॉडल पीएचसी, पैथोलॉजी लैब व मातृत्व विंग',
    majorWorkEn: '24x7 Model PHC, Lab & Maternity Wing',
    pannaPramukh: 'विजय कुमार',
    contact: '98160-11008',
    keyIssuesResolved: ['आपातकालीन स्वास्थ्य', 'डिजिटल एक्सरे मशीन']
  },
  {
    wardNo: 9,
    name: 'वार्ड 09 - कंडवाल',
    nameEn: 'Ward 09 - Kandwal Gateway',
    voters: 3950,
    completedWorksCount: 6,
    budgetSpentLakhs: 175,
    majorWork: 'हिमाचल प्रवेश द्वार सौंदर्यीकरण एवं यात्री विश्राम गृह',
    majorWorkEn: 'Himachal Gateway Beautification & Shelter',
    pannaPramukh: 'प्रदीप वर्मा',
    contact: '98160-11009',
    keyIssuesResolved: ['हाईवे स्ट्रीट लाइट्स', 'सार्वजनिक शौचालय ब्लॉक']
  },
  {
    wardNo: 10,
    name: 'वार्ड 10 - सुलियाली',
    nameEn: 'Ward 10 - Suliali',
    voters: 4230,
    completedWorksCount: 8,
    budgetSpentLakhs: 260,
    majorWork: 'सामुदायिक भवन हॉल व महिला मंडल भवन',
    majorWorkEn: 'Community Hall & Mahila Mandal Bhawan',
    pannaPramukh: 'अशोक शर्मा',
    contact: '98160-11010',
    keyIssuesResolved: ['सामाजिक उत्सव स्थल', 'लिंक रोड पक्कीकरण']
  },
  {
    wardNo: 11,
    name: 'वार्ड 11 - शिक्षा नगर व मॉडल स्कूल',
    nameEn: 'Ward 11 - Shiksha Nagar & Model School',
    voters: 3890,
    completedWorksCount: 9,
    budgetSpentLakhs: 290,
    majorWork: 'राजकीय सीनियर सेकेंडरी स्कूल में 12 स्मार्ट क्लासरूम',
    majorWorkEn: '12 Smart Classrooms at Govt Model School',
    pannaPramukh: 'सुभाष चंद',
    contact: '98160-11011',
    keyIssuesResolved: ['कंप्यूटर व रोबोटिक्स लैब', 'छात्रा कॉमन रूम']
  },
  {
    wardNo: 12,
    name: 'वार्ड 12 - रामपुर रोड व विद्युत सब-स्टेशन',
    nameEn: 'Ward 12 - Rampur Road Substation Zone',
    voters: 4150,
    completedWorksCount: 10,
    budgetSpentLakhs: 340,
    majorWork: '100kVA ट्रांसफार्मर प्रतिस्थापन व नई केबलिंग',
    majorWorkEn: '100kVA Transformer Replacement & Cabling',
    pannaPramukh: 'रविंदर सिंह',
    contact: '98160-11012',
    keyIssuesResolved: ['वोल्टेज ट्रिपिंग खत्म', 'सड़क की तारकोल मरम्मत']
  },
  {
    wardNo: 13,
    name: 'वार्ड 13 - कोटला लिंक व कृषि पट्टी',
    nameEn: 'Ward 13 - Kotla Link & Agri Belt',
    voters: 3620,
    completedWorksCount: 6,
    budgetSpentLakhs: 155,
    majorWork: 'सोलर ट्यूबवेल व जल भंडारण टैंक',
    majorWorkEn: 'Solar Tubewell & Water Reservoir',
    pannaPramukh: 'हरबंस लाल',
    contact: '98160-11013',
    keyIssuesResolved: ['सिंचाई जल गारंटी', 'संपर्क मार्ग पुलिया']
  },
  {
    wardNo: 14,
    name: 'वार्ड 14 - शिव मंदिर चौक व बाईपास एंट्री',
    nameEn: 'Ward 14 - Shiv Mandir Chowk & Bypass Entry',
    voters: 4680,
    completedWorksCount: 14,
    budgetSpentLakhs: 520,
    majorWork: '4-लेन बाईपास रिंग रोड एवं मुख्य चौक सौंदर्यीकरण',
    majorWorkEn: '4-Lane Bypass Ring Road & Chowk Revamp',
    pannaPramukh: 'विक्रम शर्मा',
    contact: '98160-11014',
    keyIssuesResolved: ['ट्रैफिक जाम निवारण', 'सीसीटीवी सर्विलांस']
  },
  {
    wardNo: 15,
    name: 'वार्ड 15 - औद्योगिक पट्टी व ट्रांसपोर्ट नगर',
    nameEn: 'Ward 15 - Industrial & Transport Zone',
    voters: 3900,
    completedWorksCount: 8,
    budgetSpentLakhs: 280,
    majorWork: 'भारी वाहन पार्किंग व कंक्रीट रोड निर्माण',
    majorWorkEn: 'Heavy Vehicle Parking & Concrete Roads',
    pannaPramukh: 'जोगिंदर पाल',
    contact: '98160-11015',
    keyIssuesResolved: ['ट्रक पार्किंग समस्या', 'स्ट्रीट लाइट नेटवर्क']
  },
  {
    wardNo: 16,
    name: 'वार्ड 16 - नागनी माता मार्ग',
    nameEn: 'Ward 16 - Nagni Mata Pilgrim Route',
    voters: 4320,
    completedWorksCount: 9,
    budgetSpentLakhs: 310,
    majorWork: 'तीर्थ मार्ग चौड़ीकरण, रेलिंग व सौर ऊर्जा लाइट्स',
    majorWorkEn: 'Pilgrim Corridor Widening & Solar Lights',
    pannaPramukh: 'महेश कुमार',
    contact: '98160-11016',
    keyIssuesResolved: ['श्रद्धालु सुविधा केंद्र', 'पेयजल कियोस्क']
  },
  {
    wardNo: 17,
    name: 'वार्ड 17 - गनोह',
    nameEn: 'Ward 17 - Ganoh',
    voters: 3580,
    completedWorksCount: 5,
    budgetSpentLakhs: 145,
    majorWork: 'गनोह संपर्क मार्ग डामरीकरण व कंक्रीट ड्रेन',
    majorWorkEn: 'Ganoh Link Road Metalling & Concrete Drain',
    pannaPramukh: 'तारेश पठानिया',
    contact: '98160-11017',
    keyIssuesResolved: ['कीचड़ मुक्त रास्ते', 'आंगनवाड़ी केंद्र उन्नयन']
  },
  {
    wardNo: 18,
    name: 'वार्ड 18 - नूरपुर किला परिसर व हेरिटेज जोन',
    nameEn: 'Ward 18 - Nurpur Fort & Heritage Zone',
    voters: 3750,
    completedWorksCount: 8,
    budgetSpentLakhs: 275,
    majorWork: 'ऐतिहासिक किला पाथवे, हेरिटेज लाइट्स व पार्क',
    majorWorkEn: 'Historic Fort Pathway, Heritage Lighting & Park',
    pannaPramukh: 'राकेश मेहरा',
    contact: '98160-11018',
    keyIssuesResolved: ['पर्यटन सुविधाएं', 'वृंदावन पार्क मरम्मत']
  },
  {
    wardNo: 19,
    name: 'वार्ड 19 - अंबेडकर चौक व मिनी स्टेडियम',
    nameEn: 'Ward 19 - Ambedkar Chowk & Mini Stadium',
    voters: 4480,
    completedWorksCount: 11,
    budgetSpentLakhs: 460,
    majorWork: 'सिंथेटिक रनिंग ट्रैक, बास्केटबॉल कोर्ट व ओपन जिम',
    majorWorkEn: 'Synthetic Track, Basketball Court & Open Gym',
    pannaPramukh: 'बलबीर सिंह',
    contact: '98160-11019',
    keyIssuesResolved: ['युवा खेल सुविधाएं', '4 हाई-मास्ट सोलर टावर']
  },
  {
    wardNo: 20,
    name: 'वार्ड 20 - रिट',
    nameEn: 'Ward 20 - Reet',
    voters: 3420,
    completedWorksCount: 6,
    budgetSpentLakhs: 165,
    majorWork: 'ग्राम पंचायत संपर्क पुलिया व कूहल जीर्णोद्धार',
    majorWorkEn: 'Panchayat Culvert Bridge & Canal Revamp',
    pannaPramukh: 'सतीश कुमार',
    contact: '98160-11020',
    keyIssuesResolved: ['खड्ड पार करने में सुगमता', 'खेतों तक सिंचाई']
  },
  {
    wardNo: 21,
    name: 'वार्ड 21 - खजूरवां',
    nameEn: 'Ward 21 - Khajoorwan',
    voters: 3660,
    completedWorksCount: 7,
    budgetSpentLakhs: 180,
    majorWork: 'पशु चिकित्सालय औषधालय व जल भंडारण टैंक',
    majorWorkEn: 'Veterinary Dispensary & Water Tank',
    pannaPramukh: 'अमरजीत सिंह',
    contact: '98160-11021',
    keyIssuesResolved: ['पशुपालकों को दवाएं', 'पेयजल किल्लत दूर']
  },
  {
    wardNo: 22,
    name: 'वार्ड 22 - लोधवां',
    nameEn: 'Ward 22 - Lodhwan',
    voters: 4180,
    completedWorksCount: 8,
    budgetSpentLakhs: 240,
    majorWork: 'लोधवां मुख्य खड्ड तटीकरण व सुरक्षा दीवार',
    majorWorkEn: 'Lodhwan Embankment & Flood Retaining Wall',
    pannaPramukh: 'नरेश गुलेरिया',
    contact: '98160-11022',
    keyIssuesResolved: ['बाढ़ से उपजाऊ भूमि की रक्षा', 'पक्की पुलिया']
  },
  {
    wardNo: 23,
    name: 'वार्ड 23 - गहीं लगोड़',
    nameEn: 'Ward 23 - Gehin Lagor',
    voters: 3510,
    completedWorksCount: 5,
    budgetSpentLakhs: 150,
    majorWork: 'पहाड़ी बस्ती सड़क कटिंग व सोलिंग कार्य',
    majorWorkEn: 'Hill Settlement Road Cutting & Soling',
    pannaPramukh: 'धर्मपाल शर्मा',
    contact: '98160-11023',
    keyIssuesResolved: ['एंबुलेंस रोड कनेक्टिविटी', 'बिजली खंभे बदले गए']
  },
  {
    wardNo: 24,
    name: 'वार्ड 24 - सदवां',
    nameEn: 'Ward 24 - Sadwan',
    voters: 3890,
    completedWorksCount: 7,
    budgetSpentLakhs: 205,
    majorWork: 'पंचायत घर व बहुउद्देशीय किसान सेवा केंद्र',
    majorWorkEn: 'Panchayat Ghar & Farmers Multi-Service Hub',
    pannaPramukh: 'कुलभूषण कटोच',
    contact: '98160-11024',
    keyIssuesResolved: ['खाद-बीज वितरण केंद्र', 'सोलर लाइट व्यवस्था']
  }
];

export const VISION_2029: VisionItem[] = [
  {
    id: 'vision-1',
    pillar: 'स्वास्थ्य व संजीवनी',
    pillarEn: 'Healthcare & Emergency Support',
    title: 'नूरपुर 100-बेड सुपर-स्पेशियलिटी अस्पताल व ट्रॉमा सेंटर',
    titleEn: '100-Bed Super-Specialty Hospital & Trauma Center',
    description: 'कांगड़ा के पश्चिमी अंचल में आपातकालीन कार्डियोलॉजी, न्यूरोलॉजी व डायलिसिस की आधुनिक सुविधाएं।',
    descriptionEn: 'Advanced cardiology, neurology & 20-bed dialysis center eliminating travel to Pathankot/Dharamshala.',
    targetYear: '2027',
    iconName: 'HeartPulse',
    points: [
      '24x7 निशुल्क जीवन रक्षक दवा वितरण व जन औषधि केंद्र',
      'प्रत्येक पंचायत में टेली-मेडिसिन व डिजिटल मोबाइल वैन सेवा',
      'मातृत्व स्वास्थ्य एवं नवजात शिशु केयर आईसीयू यूनिट'
    ]
  },
  {
    id: 'vision-2',
    pillar: 'युवा रोजगार व आईटी',
    pillarEn: 'Youth Employment & IT Park',
    title: 'नूरपुर कौशल विकास, आईटी व बीपीओ हब',
    titleEn: 'Nurpur Skill Development & IT/BPO Hub',
    description: 'स्थानीय युवाओं को अपने ही क्षेत्र में सम्मानजनक तकनीकी व गैर-तकनीकी रोजगार के अवसर।',
    descriptionEn: 'Modern IT workspace and skill training center providing 2,500+ local job opportunities.',
    targetYear: '2028',
    iconName: 'GraduationCap',
    points: [
      'प्रतियोगी परीक्षा (HPAS, UPSC, Army) निशुल्क डिजिटल लाइब्रेरी',
      'आर्टिफिशियल इंटेलिजेंस व कोडिंग कौशल छात्रवृत्ति योजना',
      'स्थानीय स्टार्टअप्स के लिए सीड ग्रांट व इनक्यूबेशन सेंटर'
    ]
  },
  {
    id: 'vision-3',
    pillar: 'कृषि व बागवानी क्रांति',
    pillarEn: 'Agriculture & Horticulture Wealth',
    title: 'फल व सब्जी कोल्ड स्टोरेज एवं फूड प्रोसेसिंग क्लस्टर',
    titleEn: 'Agro-Fruit Cold Storage & Food Processing Cluster',
    description: 'नींबू वर्गीय फल (Citrus), आम व लीची उत्पादक किसानों को न्यूनतम समर्थन मूल्य व वैज्ञानिक भंडारण।',
    descriptionEn: 'Cold chain preservation for citrus, mango and litchi farmers ensuring maximum value realization.',
    targetYear: '2028',
    iconName: 'Apple',
    points: [
      '5,000 मीट्रिक टन क्षमता का अत्याधुनिक वातानुकूलित कोल्ड स्टोरेज',
      'प्रत्येक कृषक को सोलर लिफ्ट इरीगेशन पर 80% अतिरिक्त उपदान',
      'सीधे राष्ट्रीय मंडियों से ई-नाम (e-NAM) डिजिटल विपणन लिंक'
    ]
  },
  {
    id: 'vision-4',
    pillar: 'हरित ऊर्जा व स्मार्ट नूरपुर',
    pillarEn: 'Clean Energy & Smart Infrastructure',
    title: '100% सोलर रूफटॉप व हरित नूरपुर मिशन',
    titleEn: '100% Solar Rooftop & Green Nurpur Mission',
    description: 'घरेलू बिजली बिल शून्य करने के लिए सोलर पैनल इंस्टॉलेशन एवं पर्यावरण अनुकूल पर्यटन।',
    descriptionEn: 'Zero-electricity bill initiative via rooftop solar and eco-tourism promotion around historic Nurpur Fort.',
    targetYear: '2029',
    iconName: 'Zap',
    points: [
      'सभी 24 वार्डों में 100% एलईडी व स्मार्ट स्ट्रीट लाइटिंग',
      'नूरपुर ऐतिहासिक किले का भव्य लाइट एंड साउंड पर्यटन कॉरिडोर',
      'प्रदूषण मुक्त इलेक्ट्रिक बस व चार्जिंग स्टेशन नेटवर्क'
    ]
  }
];

export interface CitizenTicketItem {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  date: string;
  status: 'In Progress' | 'Received' | 'Resolved';
  statusHi: string;
  location: string;
}

export const CITIZEN_TICKETS_MOCK: CitizenTicketItem[] = [
  {
    id: 'C-1042',
    title: 'Damaged road near school',
    titleHi: 'स्कूल के समीप क्षतिग्रस्त सड़क मरम्मत',
    category: 'सड़क (Roads)',
    date: '28 Oct 2026',
    status: 'In Progress',
    statusHi: 'प्रगति पर',
    location: 'वार्ड 5, राजकीय वरिष्ठ माध्यमिक विद्यालय'
  },
  {
    id: 'C-1041',
    title: 'Irregular water supply',
    titleHi: 'अनियमित पेयजल आपूर्ति समस्या',
    category: 'जल आपूर्ति (Water)',
    date: '27 Oct 2026',
    status: 'Received',
    statusHi: 'प्राप्त (स्वीकृत)',
    location: 'वार्ड 8, कोटला मुख्य बाजार'
  },
  {
    id: 'C-1040',
    title: 'Health camp information',
    titleHi: 'स्वास्थ्य शिविर आयोजन व पैथोलॉजी जांच',
    category: 'स्वास्थ्य (Healthcare)',
    date: '26 Oct 2026',
    status: 'Resolved',
    statusHi: 'समाधान संपन्न',
    location: 'वार्ड 3, सामुदायिक स्वास्थ्य केंद्र'
  }
];

export interface EventItemMock {
  id: string;
  day: string;
  month: string;
  year: string;
  title: string;
  titleEn: string;
  time: string;
  venue: string;
  venueEn: string;
  category: 'upcoming' | 'past' | 'news' | 'video';
  image: string;
  description: string;
}

export const EVENTS_LIST_MOCK: EventItemMock[] = [
  {
    id: 'event-1',
    day: '07',
    month: 'Nov 2026',
    year: '2026',
    title: 'समुदाय स्वास्थ्य जागरूकता शिविर',
    titleEn: 'Community Health Awareness Camp',
    time: '10:00 AM - 1:00 PM',
    venue: 'वार्ड 3, सामुदायिक भवन',
    venueEn: 'Ward 3, Community Hall',
    category: 'upcoming',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    description: 'निःशुल्क रक्तचाप, मधुमेह, नेत्र जांच व वरिष्ठ नागरिकों को जेनेरिक दवाइयों का वितरण।'
  },
  {
    id: 'event-2',
    day: '14',
    month: 'Nov 2026',
    year: '2026',
    title: 'जन सुझाव बैठक',
    titleEn: 'Public Feedback & Suggestion Assembly',
    time: '11:00 AM - 2:00 PM',
    venue: 'नगर परिषद हॉल, नूरपुर',
    venueEn: 'Municipal Council Hall, Nurpur',
    category: 'upcoming',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80',
    description: 'आगामी बजट सत्र हेतु वार्ड स्तर पर प्राथमिकता योजनाओं के चयन हेतु खुली जनचर्चा।'
  },
  {
    id: 'event-3',
    day: '21',
    month: 'Nov 2026',
    year: '2026',
    title: 'युवा रोजगार मंच',
    titleEn: 'Youth Employment & Career Forum',
    time: '10:00 AM - 12:00 PM',
    venue: 'नूरपुर कॉलेज परिसर',
    venueEn: 'Nurpur College Campus',
    category: 'upcoming',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
    description: 'रोजगार मेला व तकनीकी कौशल विकास प्रमाणन हेतु विभिन्न कंपनियों के साथ सीधा साक्षात्कार।'
  }
];

export interface LatestUpdateMock {
  id: string;
  title: string;
  titleHi: string;
  date: string;
  image: string;
  category: string;
}

export const LATEST_UPDATES_MOCK: LatestUpdateMock[] = [
  {
    id: 'up-1',
    title: 'Community Health Camp in Ward 5',
    titleHi: 'वार्ड 5 में सामुदायिक स्वास्थ्य शिविर का सफल आयोजन',
    date: '28 Oct 2026',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80',
    category: 'स्वास्थ्य'
  },
  {
    id: 'up-2',
    title: 'New Road Project Sanctioned',
    titleHi: 'बढ़ोही-नूरपुर मुख्य लिंक मार्ग हेतु ₹3.80 करोड़ स्वीकृत',
    date: '25 Oct 2026',
    image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=400&auto=format&fit=crop&q=80',
    category: 'सड़क'
  },
  {
    id: 'up-3',
    title: 'Meeting with Local Farmers',
    titleHi: 'स्थानीय फल उत्पादक व प्रगतिशील कृषकों के साथ संवाद',
    date: '22 Oct 2026',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80',
    category: 'कृषि'
  }
];

export interface MapPinMock {
  id: string;
  wardNo: number;
  wardName: string;
  title: string;
  titleHi: string;
  category: 'roads' | 'water' | 'health' | 'education' | 'other';
  status: 'In Progress' | 'Resolved' | 'Reported';
  statusHi: string;
  date: string;
  xPercent: number; // percentage coordinate on map SVG
  yPercent: number;
  image: string;
  description: string;
}

export const MAP_PINS_MOCK: MapPinMock[] = [
  {
    id: 'pin-ward5',
    wardNo: 5,
    wardName: 'वार्ड 5 (नूरपुर)',
    title: 'Road Surface & Drainage Work',
    titleHi: 'वार्ड 5 - सड़क समस्या',
    category: 'roads',
    status: 'In Progress',
    statusHi: 'प्रगति पर',
    date: '28 Oct 2026',
    xPercent: 62,
    yPercent: 42,
    image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=400&auto=format&fit=crop&q=80',
    description: 'स्कूल संपर्क सड़क पर इंटरलॉकिंग टाइल्स एवं नाली निर्माण कार्य युद्धस्तर पर जारी।'
  },
  {
    id: 'pin-ward8',
    wardNo: 8,
    wardName: 'वार्ड 8 (कोटला)',
    title: 'Drinking Water Pipeline Replacement',
    titleHi: 'वार्ड 8 - मुख्य पेयजल पाइपलाइन',
    category: 'water',
    status: 'In Progress',
    statusHi: 'प्रगति पर',
    date: '27 Oct 2026',
    xPercent: 78,
    yPercent: 68,
    image: 'https://images.unsplash.com/photo-1527264935190-1401c51b5bbc?w=400&auto=format&fit=crop&q=80',
    description: 'कोटला चौक के पास क्षतिग्रस्त पाइपलाइन की मरम्मत व 2 आपातकालीन टैंकर स्टैंडबाय।'
  },
  {
    id: 'pin-ward2',
    wardNo: 2,
    wardName: 'वार्ड 2 (नूरपुर शहरी)',
    title: 'Smart LED Lighting & Tiles Complete',
    titleHi: 'वार्ड 2 - संपूर्ण विकास योजना',
    category: 'roads',
    status: 'Resolved',
    statusHi: 'संतुष्ट व पूर्ण',
    date: '24 Oct 2026',
    xPercent: 48,
    yPercent: 32,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80',
    description: 'शत-प्रतिशत गलियों में सोलर लाइट और इंटरलॉकिंग कार्य पूर्ण।'
  },
  {
    id: 'pin-ward14',
    wardNo: 14,
    wardName: 'वार्ड 14 (जसूर)',
    title: '100 KVA Transformer Installation',
    titleHi: 'वार्ड 14 - ट्रांसफार्मर अपग्रेड',
    category: 'other',
    status: 'In Progress',
    statusHi: 'स्वीकृत / प्रगति पर',
    date: '28 Oct 2026',
    xPercent: 34,
    yPercent: 55,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&auto=format&fit=crop&q=80',
    description: 'विधायक निधि से ₹3.80 लाख स्वीकृत, HPSEBL द्वारा नया ट्रांसफार्मर लगाया जा रहा है।'
  },
  {
    id: 'pin-ward19',
    wardNo: 19,
    wardName: 'वार्ड 19 (भदवार)',
    title: 'Flood Protection Danga',
    titleHi: 'वार्ड 19 - खड्ड सुरक्षा दंगा',
    category: 'other',
    status: 'Reported',
    statusHi: 'स्वीकृत योजना',
    date: '26 Oct 2026',
    xPercent: 84,
    yPercent: 38,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=400&auto=format&fit=crop&q=80',
    description: '60 मीटर आरसीसी सुरक्षा दीवार का निर्माण प्राक्कलन स्वीकृत।'
  }
];

