/**
 * MLA Trust / CSR & Nijaat (निजी सहायता) Fund Tracker Service
 * Tracks out-of-pocket philanthropic aid provided by MLA Ranbir Singh Nikka.
 * Maps ₹3.82+ Cr private grants to 4,820 families and 19,280+ extended voter bloc in Nurpur AC 142.
 */

export type GrantType = 
  | 'DAUGHTER_MARRIAGE'     // कन्यादान सहायता (₹31,000 / ₹51,000)
  | 'MEDICAL_EMERGENCY'     // आपातकालीन चिकित्सा / ऑपरेशन सहायता
  | 'SPORTS_KIT'            // युवा खेल किट एवं जिम प्रोत्साहन
  | 'TEMPLE_COMMUNITY'      // मंदिर / सामुदायिक भवन निर्माण अंशदान
  | 'EDUCATION_FEE'         // मेधावी छात्रवृत्ति एवं उच्च शिक्षा शुल्क
  | 'DISASTER_RELIEF';      // प्राकृतिक आपदा / मकान क्षति राहत

export interface NijaatGrantRecord {
  id: string;
  recipientName: string;
  recipientNameEn: string;
  guardianName: string;
  boothNo: number;
  wardNo: number;
  village: string;
  mobile: string;
  grantType: GrantType;
  amountRupees: number;
  chequeOrTxnRef: string;
  paymentMode: 'DIRECT_BANK_TRANSFER' | 'CHEQUE_HANDOVER' | 'CASH_CEREMONY';
  handoverPhotoUrl?: string;
  dateGranted: string;
  extendedFamilyVotersCount: number; // Extended family voter base locked
  followupCallScheduledDate: string;
  anniversaryGreetingDate?: string;
  notes: string;
  karyakartaWitnessName: string;
  status: 'DISBURSED' | 'SANCTIONED' | 'VERIFIED';
}

export interface TrustFundSummary {
  totalDisbursedRupees: number;
  totalBeneficiariesCount: number;
  extendedVotersLockedCount: number;
  avgFamilyVoters: number;
  byCategory: {
    type: GrantType;
    labelHi: string;
    labelEn: string;
    count: number;
    amountRupees: number;
  }[];
  boothSaturationPercent: number; // % of 118 booths with at least 5 grants
}

export const INITIAL_NIJAAT_GRANTS: NijaatGrantRecord[] = [
  {
    id: 'NJT-2026-0841',
    recipientName: 'सुनीता देवी (पुत्री विवाह)',
    recipientNameEn: 'Sunita Devi (Daughter Marriage)',
    guardianName: 'कर्म चंद',
    boothNo: 41,
    wardNo: 7,
    village: 'भदवार (Bhadwar)',
    mobile: '9816041234',
    grantType: 'DAUGHTER_MARRIAGE',
    amountRupees: 51000,
    chequeOrTxnRef: 'PVI-HDFC-99214',
    paymentMode: 'CHEQUE_HANDOVER',
    dateGranted: '2026-02-14',
    extendedFamilyVotersCount: 18,
    followupCallScheduledDate: '2026-11-14',
    anniversaryGreetingDate: '2027-02-14',
    notes: 'विवाह समारोह में विधायक जी द्वारा निजी चेक सौंपा गया। परिवार 3 पीढ़ियों से आभारी है।',
    karyakartaWitnessName: 'राकेश शर्मा (बूथ प्रमुख #41)',
    status: 'DISBURSED'
  },
  {
    id: 'NJT-2026-0842',
    recipientName: 'मंगत राम (हार्ट सर्जरी सहायता)',
    recipientNameEn: 'Mangat Ram (Emergency Heart Surgery)',
    guardianName: 'स्व. ध्यान सिंह',
    boothNo: 18,
    wardNo: 3,
    village: 'जसूर (Jasur)',
    mobile: '9418088912',
    grantType: 'MEDICAL_EMERGENCY',
    amountRupees: 75000,
    chequeOrTxnRef: 'NEFT-SBIN20260218-01',
    paymentMode: 'DIRECT_BANK_TRANSFER',
    dateGranted: '2026-02-18',
    extendedFamilyVotersCount: 14,
    followupCallScheduledDate: '2026-11-10',
    notes: 'PGI चंडीगढ़ में ओपन हार्ट सर्जरी हेतु आपातकालीन सहायता। परिवार कट्टर समर्थक बना।',
    karyakartaWitnessName: 'अजय गुलेरिया (मंडल उपाध्यक्ष)',
    status: 'VERIFIED'
  },
  {
    id: 'NJT-2026-0843',
    recipientName: 'नवयुवक मंडल कोटला (क्रिकेट व फिटनेस किट)',
    recipientNameEn: 'Kotla Youth Club (Sports & Gym Kits)',
    guardianName: 'प्रधान विकास राणा',
    boothNo: 72,
    wardNo: 14,
    village: 'कोटला (Kotla)',
    mobile: '9882199044',
    grantType: 'SPORTS_KIT',
    amountRupees: 35000,
    chequeOrTxnRef: 'CASH-REC-1120',
    paymentMode: 'CASH_CEREMONY',
    dateGranted: '2026-03-02',
    extendedFamilyVotersCount: 32,
    followupCallScheduledDate: '2026-11-20',
    notes: '70 युवाओं का क्लब। खेल प्रतियोगिता में निक्का जी द्वारा प्रोत्साहन। युवा वोट बैंक सुरक्षित।',
    karyakartaWitnessName: 'अमित कटोच',
    status: 'DISBURSED'
  },
  {
    id: 'NJT-2026-0844',
    recipientName: 'राधा कृष्ण मंदिर समिति (सामुदायिक हॉल शेड)',
    recipientNameEn: 'Radha Krishna Temple Committee',
    guardianName: 'पं. रमेश शास्त्री',
    boothNo: 89,
    wardNo: 18,
    village: 'रेहन (Rehan)',
    mobile: '9459211029',
    grantType: 'TEMPLE_COMMUNITY',
    amountRupees: 100000,
    chequeOrTxnRef: 'PVI-PNB-48192',
    paymentMode: 'CHEQUE_HANDOVER',
    dateGranted: '2026-03-15',
    extendedFamilyVotersCount: 45,
    followupCallScheduledDate: '2026-11-15',
    notes: 'भंडारा शेड निर्माण हेतु। पूरे ब्राह्मण एवं स्थानीय समाज में विधायक जी की जय-जयकार।',
    karyakartaWitnessName: 'सुरेश गुलेरिया',
    status: 'DISBURSED'
  },
  {
    id: 'NJT-2026-0845',
    recipientName: 'पूजा कुमारी (IIT रुड़की बी.टेक छात्रवृत्ति)',
    recipientNameEn: 'Pooja Kumari (Higher Education Scholarship)',
    guardianName: 'विशन दास (गरीब किसान)',
    boothNo: 33,
    wardNo: 5,
    village: 'गनोह (Ganoh)',
    mobile: '9805544319',
    grantType: 'EDUCATION_FEE',
    amountRupees: 60000,
    chequeOrTxnRef: 'NEFT-HDFC20260322-99',
    paymentMode: 'DIRECT_BANK_TRANSFER',
    dateGranted: '2026-03-22',
    extendedFamilyVotersCount: 16,
    followupCallScheduledDate: '2026-12-01',
    notes: 'प्रथम वर्ष छात्रावास व सेमेस्टर फीस। पूरे गांव में निक्का जी की शिक्षा-समर्थक छवि सुदृढ़।',
    karyakartaWitnessName: 'विक्रम पठानिया',
    status: 'VERIFIED'
  },
  {
    id: 'NJT-2026-0846',
    recipientName: 'रीना देवी (मकान अग्नि राहत)',
    recipientNameEn: 'Reena Devi (Fire Disaster Relief)',
    guardianName: 'सुरजीत सिंह',
    boothNo: 105,
    wardNo: 22,
    village: 'औंध (Ondh)',
    mobile: '9816822199',
    grantType: 'DISASTER_RELIEF',
    amountRupees: 50000,
    chequeOrTxnRef: 'PVI-HDFC-99302',
    paymentMode: 'CHEQUE_HANDOVER',
    dateGranted: '2026-04-05',
    extendedFamilyVotersCount: 22,
    followupCallScheduledDate: '2026-11-05',
    notes: 'मकान जलने पर 4 घंटे के भीतर विधायक जी की ओर से तत्काल राहत राशि।',
    karyakartaWitnessName: 'अनिल धीमान',
    status: 'DISBURSED'
  },
  {
    id: 'NJT-2026-0847',
    recipientName: 'कमला देवी (पुत्री विवाह कन्यादान)',
    recipientNameEn: 'Kamla Devi (Daughter Wedding)',
    guardianName: 'स्व. मदन लाल',
    boothNo: 12,
    wardNo: 2,
    village: 'सद्वां (Sadwan)',
    mobile: '9418299182',
    grantType: 'DAUGHTER_MARRIAGE',
    amountRupees: 51000,
    chequeOrTxnRef: 'PVI-HDFC-99388',
    paymentMode: 'CHEQUE_HANDOVER',
    dateGranted: '2026-04-18',
    extendedFamilyVotersCount: 15,
    followupCallScheduledDate: '2026-11-18',
    anniversaryGreetingDate: '2027-04-18',
    notes: 'विधायक जी स्वयं शादी में पहुंचे और वर-वधू को आशीर्वाद दिया।',
    karyakartaWitnessName: 'रोहित शर्मा',
    status: 'DISBURSED'
  },
  {
    id: 'NJT-2026-0848',
    recipientName: 'गुरबचन सिंह (किडनी डायलिसिस सहायता)',
    recipientNameEn: 'Gurbachan Singh (Dialysis Support)',
    guardianName: 'स्व. करतार सिंह',
    boothNo: 58,
    wardNo: 11,
    village: 'जाच्छ (Jachh)',
    mobile: '9882200192',
    grantType: 'MEDICAL_EMERGENCY',
    amountRupees: 40000,
    chequeOrTxnRef: 'NEFT-SBIN20260502-44',
    paymentMode: 'DIRECT_BANK_TRANSFER',
    dateGranted: '2026-05-02',
    extendedFamilyVotersCount: 12,
    followupCallScheduledDate: '2026-11-02',
    notes: 'कांगड़ा फोर्टिस में डायलिसिस हेतु 6 माह का खर्च विधायक ट्रस्ट से वहन।',
    karyakartaWitnessName: 'संजीव राणा',
    status: 'VERIFIED'
  }
];

export const TRUST_FUND_TOTAL_METRICS: TrustFundSummary = {
  totalDisbursedRupees: 38245000, // ₹3.82 Cr
  totalBeneficiariesCount: 4820,
  extendedVotersLockedCount: 19280, // Avg 4 voters per household * 4820
  avgFamilyVoters: 4.1,
  boothSaturationPercent: 96.6, // 114 out of 118 booths
  byCategory: [
    {
      type: 'DAUGHTER_MARRIAGE',
      labelHi: 'कन्यादान (विवाह सहायता)',
      labelEn: 'Daughter Marriage (Kanyadaan)',
      count: 1420,
      amountRupees: 18500000
    },
    {
      type: 'MEDICAL_EMERGENCY',
      labelHi: 'आपातकालीन चिकित्सा व ऑपरेशन',
      labelEn: 'Medical Emergencies & Surgery',
      count: 1280,
      amountRupees: 9800000
    },
    {
      type: 'TEMPLE_COMMUNITY',
      labelHi: 'मंदिर / सामुदायिक भवन निर्माण',
      labelEn: 'Temple & Community Halls',
      count: 640,
      amountRupees: 6400000
    },
    {
      type: 'EDUCATION_FEE',
      labelHi: 'मेधावी छात्रवृत्ति एवं शुल्क',
      labelEn: 'Education Scholarships',
      count: 810,
      amountRupees: 4050000
    },
    {
      type: 'SPORTS_KIT',
      labelHi: 'युवा खेल किट एवं फिटनेस',
      labelEn: 'Youth Sports & Gym Kits',
      count: 420,
      amountRupees: 1875000
    },
    {
      type: 'DISASTER_RELIEF',
      labelHi: 'प्राकृतिक आपदा व मकान क्षति',
      labelEn: 'Disaster & Fire Relief',
      count: 250,
      amountRupees: 1500000
    }
  ]
};

export const getGrantTypeBadge = (type: GrantType) => {
  switch (type) {
    case 'DAUGHTER_MARRIAGE':
      return { labelHi: 'कन्यादान (विवाह)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    case 'MEDICAL_EMERGENCY':
      return { labelHi: 'चिकित्सा सहायता', color: 'bg-red-500/20 text-red-300 border-red-500/40' };
    case 'SPORTS_KIT':
      return { labelHi: 'खेल किट', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    case 'TEMPLE_COMMUNITY':
      return { labelHi: 'मंदिर/सामुदायिक', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    case 'EDUCATION_FEE':
      return { labelHi: 'शिक्षा छात्रवृत्ति', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    case 'DISASTER_RELIEF':
      return { labelHi: 'आपदा राहत', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
  }
};

/**
 * Format currency into Indian Lakhs / Crores string
 */
export const formatIndianRupees = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Generate anniversary or follow-up WhatsApp greeting message
 */
export const generateAnniversaryGreetingMessage = (grant: NijaatGrantRecord): string => {
  if (grant.grantType === 'DAUGHTER_MARRIAGE') {
    return `सादर प्रणाम ${grant.recipientName} जी,\n\nविधायक कार्यालय नूरपुर (रणबीर सिंह निक्का जी) की ओर से आपकी सुपुत्री के वैवाहिक जीवन की वर्षगांठ पर हार्दिक शुभकामनाएं! 💐\n\nनिक्का जी का सदैव यह प्रयास रहता है कि नूरपुर का प्रत्येक परिवार खुशहाल रहे। परिवार में किसी भी सुख-दुख या आवश्यकता में आपका भाई/सेवक रणबीर सिंह निक्का सदैव आपके साथ खड़ा है।\n\nसंपर्क: 01893-220101 | नूरपुर जनसेवा`;
  }
  return `सादर प्रणाम ${grant.recipientName} जी,\n\nविधायक कैंप कार्यालय (रणबीर सिंह निक्का) से आशा है कि आप सकुशल हैं और स्वास्थ्य में पूर्ण सुधार है।\n\nकिसी भी नागरिक सेवा या समस्या हेतु कभी भी संपर्क करें।\n\n- आपका विधायक रणबीर सिंह निक्का, नूरपुर`;
};
