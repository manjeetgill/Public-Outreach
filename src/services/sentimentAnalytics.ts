/**
 * Booth Sentiment & Swing Voter Micro-Targeting Analytics
 * Covers all 118 Polling Booths of Nurpur AC 142 (Kangra, Himachal Pradesh).
 * Provides granular political intelligence, swing voter vulnerability scores, and AI surgical fund directives.
 */

export type BoothStatus = 'STRONGHOLD' | 'SWING' | 'VULNERABLE';

export interface BoothSentimentRecord {
  boothNo: number;
  boothName: string;
  boothNameHi: string;
  wardNo: number;
  totalVoters: number;
  favorablePct: number; // % committed Nikka Parivar
  swingPct: number;     // % undecided / swing voters
  oppositionPct: number; // % opposition
  status: BoothStatus;
  pendingGrievancesCount: number;
  avgSlaDays: number;
  nijaatGrantsCount: number; // Private philanthropic interventions in this booth
  pannaPramukhName: string;
  pannaPramukhPhone: string;
  aiSurgicalAction: {
    titleHi: string;
    descriptionHi: string;
    recommendedFundType: 'MLA_LAD' | 'NIJAAT_TRUST' | 'PERSONAL_VISIT' | 'COMMUNITY_OUTREACH';
    fundAmountRupees?: number;
    expectedSwingGainVoters: number;
  };
}

// Generate the 118 Booths dataset with authentic Nurpur villages
const NURPUR_VILLAGES = [
  { name: 'Bhadwar', nameHi: 'भदवार', ward: 7 },
  { name: 'Jasur', nameHi: 'जसूर', ward: 3 },
  { name: 'Rehan', nameHi: 'रेहन', ward: 18 },
  { name: 'Kotla', nameHi: 'कोटला', ward: 14 },
  { name: 'Ganoh', nameHi: 'गनोह', ward: 5 },
  { name: 'Sadwan', nameHi: 'सद्वां', ward: 2 },
  { name: 'Ondh', nameHi: 'औंध', ward: 22 },
  { name: 'Bodh', nameHi: 'बोध', ward: 9 },
  { name: 'Jachh', nameHi: 'जाच्छ', ward: 11 },
  { name: 'Nagabari', nameHi: 'नागाबाड़ी', ward: 1 },
  { name: 'Khazian', nameHi: 'खजियां', ward: 4 },
  { name: 'Beli', nameHi: 'बेली', ward: 6 },
  { name: 'Suliali', nameHi: 'सुलियाली', ward: 15 },
  { name: 'Kherian', nameHi: 'खेरियां', ward: 12 },
  { name: 'Bhadroya', nameHi: 'भदरोया', ward: 8 },
  { name: 'Kandror', nameHi: 'कंद्रोड़', ward: 16 },
  { name: 'Kandwal', nameHi: 'कंडवाल', ward: 10 },
  { name: 'Hatli', nameHi: 'हटली', ward: 13 },
  { name: 'Minjgran', nameHi: 'मिंजग्रां', ward: 19 },
  { name: 'Bassa', nameHi: 'बासा', ward: 20 },
  { name: 'Dak', nameHi: 'डक', ward: 21 },
  { name: 'Thohba', nameHi: 'थोबा', ward: 23 },
  { name: 'Chowgan', nameHi: 'चौगान', ward: 24 },
  { name: 'Nurpur City', nameHi: 'नूरपुर शहर', ward: 17 }
];

const KARYAKARTAS = [
  { name: 'राकेश शर्मा', phone: '9816041234' },
  { name: 'विक्रम पठानिया', phone: '9418088912' },
  { name: 'संजीव राणा', phone: '9882199044' },
  { name: 'अनिल धीमान', phone: '9459211029' },
  { name: 'सुरेश गुलेरिया', phone: '9805544319' },
  { name: 'अजय कटोच', phone: '9816822199' },
  { name: 'पंकज चौधरी', phone: '9418299182' },
  { name: 'मनोज कुमार', phone: '9882200192' }
];

export const ALL_118_BOOTHS: BoothSentimentRecord[] = Array.from({ length: 118 }, (_, index) => {
  const boothNo = index + 1;
  const villageRef = NURPUR_VILLAGES[index % NURPUR_VILLAGES.length];
  const sectionSuffix = Math.floor(index / NURPUR_VILLAGES.length) + 1;
  const karyakarta = KARYAKARTAS[index % KARYAKARTAS.length];

  // Derive realistic sentiment variations
  // Strongholds: ~62% of booths (>60% favorable)
  // Swing: ~26% of booths (30-50% swing)
  // Vulnerable: ~12% of booths (>30 days civic pending or <40% favorable)
  let status: BoothStatus = 'STRONGHOLD';
  let favorablePct = 68;
  let swingPct = 22;
  let oppositionPct = 10;
  let pendingGrievancesCount = 1;
  let avgSlaDays = 2.4;
  let nijaatGrantsCount = 12;

  if (boothNo % 7 === 0 || boothNo % 11 === 0) {
    status = 'SWING';
    favorablePct = 48;
    swingPct = 38;
    oppositionPct = 14;
    pendingGrievancesCount = 4;
    avgSlaDays = 8.6;
    nijaatGrantsCount = 5;
  } else if (boothNo % 13 === 0 || boothNo % 19 === 0) {
    status = 'VULNERABLE';
    favorablePct = 38;
    swingPct = 42;
    oppositionPct = 20;
    pendingGrievancesCount = 7;
    avgSlaDays = 18.2;
    nijaatGrantsCount = 2;
  } else {
    favorablePct = 62 + (boothNo % 15);
    swingPct = Math.max(12, 100 - favorablePct - 12);
    oppositionPct = 100 - favorablePct - swingPct;
    pendingGrievancesCount = (boothNo % 3);
    avgSlaDays = 1.8;
    nijaatGrantsCount = 8 + (boothNo % 14);
  }

  const totalVoters = 680 + ((boothNo * 17) % 300);

  // AI Directives
  let aiSurgicalAction: BoothSentimentRecord['aiSurgicalAction'];
  if (status === 'VULNERABLE') {
    aiSurgicalAction = {
      titleHi: 'जल शक्ति पाइपलाइन व आपात कन्यादान सहायता',
      descriptionHi: 'वार्ड में पेयजल संकट के कारण रोष है। विधायक निधि से ₹4.8 लाख पेयजल पाइपलाइन व 2 कन्यादान चेक तुरंत निर्गत करें।',
      recommendedFundType: 'MLA_LAD',
      fundAmountRupees: 480000,
      expectedSwingGainVoters: 240
    };
  } else if (status === 'SWING') {
    aiSurgicalAction = {
      titleHi: 'लिंक रोड खड़ंजा एवं युवा खेल किट वितरण',
      descriptionHi: 'वार्ड 14 के युवा समूह में रोष शांत करने हेतु ₹2.5 लाख खेल मैदान शेड व 20 क्रिकेट किट्स का वितरण करें।',
      recommendedFundType: 'NIJAAT_TRUST',
      fundAmountRupees: 250000,
      expectedSwingGainVoters: 180
    };
  } else {
    aiSurgicalAction = {
      titleHi: 'मजबूत गढ़: पन्ना प्रमुख अभिनंदन चौपाल',
      descriptionHi: 'वार्ड में 72%+ समर्थन। निक्का जी द्वारा चाय पर वरिष्ठ बुजुर्गों व महिला मंडल का व्यक्तिगत सम्मान करें।',
      recommendedFundType: 'PERSONAL_VISIT',
      expectedSwingGainVoters: 60
    };
  }

  return {
    boothNo,
    boothName: `${villageRef.name} - Part ${sectionSuffix}`,
    boothNameHi: `${villageRef.nameHi} - भाग ${sectionSuffix}`,
    wardNo: villageRef.ward,
    totalVoters,
    favorablePct,
    swingPct,
    oppositionPct,
    status,
    pendingGrievancesCount,
    avgSlaDays,
    nijaatGrantsCount,
    pannaPramukhName: karyakarta.name,
    pannaPramukhPhone: karyakarta.phone,
    aiSurgicalAction
  };
});

export interface ConstituencySentimentSummary {
  totalBooths: number;
  totalVoters: number;
  strongholdBooths: number;
  swingBooths: number;
  vulnerableBooths: number;
  avgFavorablePct: number;
  avgSwingPct: number;
  totalPendingGrievances: number;
  estimatedLeadVotes: number;
}

export const getConstituencySentimentSummary = (booths = ALL_118_BOOTHS): ConstituencySentimentSummary => {
  const totalBooths = booths.length;
  const totalVoters = booths.reduce((sum, b) => sum + b.totalVoters, 0);
  const strongholdBooths = booths.filter(b => b.status === 'STRONGHOLD').length;
  const swingBooths = booths.filter(b => b.status === 'SWING').length;
  const vulnerableBooths = booths.filter(b => b.status === 'VULNERABLE').length;
  const avgFavorablePct = Math.round(booths.reduce((sum, b) => sum + b.favorablePct, 0) / totalBooths);
  const avgSwingPct = Math.round(booths.reduce((sum, b) => sum + b.swingPct, 0) / totalBooths);
  const totalPendingGrievances = booths.reduce((sum, b) => sum + b.pendingGrievancesCount, 0);

  // Projected winning margin
  const favorableVoters = booths.reduce((sum, b) => sum + (b.totalVoters * b.favorablePct / 100), 0);
  const oppositionVoters = booths.reduce((sum, b) => sum + (b.totalVoters * b.oppositionPct / 100), 0);
  const estimatedLeadVotes = Math.round(favorableVoters - oppositionVoters);

  return {
    totalBooths,
    totalVoters,
    strongholdBooths,
    swingBooths,
    vulnerableBooths,
    avgFavorablePct,
    avgSwingPct,
    totalPendingGrievances,
    estimatedLeadVotes
  };
};
