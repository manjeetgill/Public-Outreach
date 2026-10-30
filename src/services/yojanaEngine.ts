import { YojanaItem, YojanaUserAnswers } from '../types/campaign';
export type { YojanaItem, YojanaUserAnswers };

export interface UserProfileAnswers {
  role?: 'farmer' | 'woman' | 'youth' | 'senior' | 'destitute';
  familyCategory: 'BPL' | 'ANTYODAYA' | 'GENERAL' | 'OBC' | 'SC_ST';
  landHolding: 'LANDLESS' | 'MARGINAL' | 'MEDIUM' | 'LARGE';
  annualIncomeRange: 'BELOW_1_5L' | '1_5L_TO_2_5L' | 'ABOVE_2_5L';
  hasGirlChild?: boolean;
  hasDestituteOrOrphan?: boolean;
  hasSeniorCitizen?: boolean;
  hasWoman18To59?: boolean;
  isPracticingFarmer?: boolean;
  hasConcreteRoof?: boolean;
  hasTapConnection?: boolean;
  wardNo?: number;
}

export type YojanaResult = YojanaItem;

export const ALL_YOJANAS: YojanaItem[] = [
  {
    id: 'sukh-aashray',
    title: 'मुख्यमंत्री सुख-आश्रय योजना (हि.प्र.)',
    titleEn: 'HP Mukhyamantri Sukh Aashray Yojana',
    department: 'सामाजिक न्याय एवं अधिकारिता विभाग, हि.प्र.',
    benefitAmount: '₹4,000 / माह + 100% उच्च शिक्षा शुल्क व छात्रावास',
    benefitPeriod: 'मासिक एवं वार्षिक अनुदान',
    description: 'अनाथ बच्चों, निराश्रित महिलाओं एवं एकल माताओं को "चिल्ड्रन ऑफ द स्टेट" का दर्जा, ₹4,000 मासिक पॉकेट मनी तथा आवास निर्माण सहायता।',
    descriptionEn: 'Provides state child status, ₹4,000/mo pocket allowance, hostel, and complete higher education sponsorship for destitute/orphan youth.',
    eligibilityConditions: [
      'निराश्रित अथवा अनाथ परिवार / एकल माता',
      'हिमाचल प्रदेश का स्थायी निवासी',
      'पारिवारिक आय ₹2.5 लाख से कम'
    ],
    documentsRequired: [
      'हिमाचल बोनाफाइड प्रमाणपत्र',
      'अनाथ / निराश्रित प्रमाण पत्र (ग्राम पंचायत / SDM द्वारा)',
      'बैंक खाता पासबुक व आधार कार्ड',
      'परिवार रजिस्टर की नकल'
    ],
    category: 'welfare'
  },
  {
    id: 'pyari-behna',
    title: 'इंदिरा गांधी प्यारी बहना सुख सम्मान निधि',
    titleEn: 'Indira Gandhi Pyari Behna Sukh Samman Nidhi',
    department: 'महिला एवं बाल विकास विभाग, हिमाचल प्रदेश',
    benefitAmount: '₹1,500 / माह (वार्षिक ₹18,000 DBT)',
    benefitPeriod: 'मासिक डायरेक्ट बैंक ट्रांसफर (DBT)',
    description: '18 से 59 वर्ष की पात्र हिमाचली महिलाओं को आर्थिक आत्मनिर्भरता हेतु प्रति माह ₹1500 की सीधी बैंक सहायता।',
    descriptionEn: 'Monthly direct cash transfer of ₹1,500 into bank accounts of eligible women aged 18 to 59 in non-government families.',
    eligibilityConditions: [
      'महिला की आयु 18 से 59 वर्ष के मध्य',
      'परिवार में कोई सरकारी पेंशनभोगी अथवा नियमित कर्मचारी न हो',
      'हिमाचल का मूल निवासी परिवार'
    ],
    documentsRequired: [
      'आधार कार्ड व राशन कार्ड प्रति',
      'आयु प्रमाण पत्र / जन्म तिथि',
      'हिम परिवार (Him Parivar) आईडी',
      'बैंक खाता पासबुक (आधार लिंक)'
    ],
    category: 'women'
  },
  {
    id: 'prakritik-kheti',
    title: 'राजीव गांधी प्राकृतिक खेती योजना',
    titleEn: 'Rajiv Gandhi Prakritik Kheti Yojana',
    department: 'कृषि विभाग, हिमाचल प्रदेश',
    benefitAmount: '₹33,000 देशी गाय खरीद पर + ₹8,000 संसाधन किट',
    benefitPeriod: 'एकमुश्त एवं आवर्ती उपकरण सब्सिडी',
    description: 'रासायनिक खाद से मुक्त प्राकृतिक खेती अपनाने वाले किसानों को देशी गाय खरीद अनुदान तथा जीवामृत/प्राकृतिक खाद ड्रम किट।',
    descriptionEn: 'Subsidies up to ₹33,000 per indigenous cow purchase and ₹8,000 specialized kit for natural chemical-free farming.',
    eligibilityConditions: [
      'कृषक परिवार (कृषि भूमि धारक)',
      'सुभाष पालेकर प्राकृतिक खेती पद्धति का प्रशिक्षण / संकल्प',
      'कांगड़ा / नूरपुर कृषि क्षेत्र'
    ],
    documentsRequired: [
      'जमाबंदी / इंतकाल भूमि रिकॉर्ड',
      'किसान क्रेडिट कार्ड (KCC) अथवा आधार',
      'प्रशिक्षण प्रमाण पत्र / पंचायत अनुशंसा'
    ],
    category: 'farming'
  },
  {
    id: 'swavalamban',
    title: 'मुख्यमंत्री स्वावलंबन योजना (MMSY)',
    titleEn: 'Mukhyamantri Swavalamban Yojana',
    department: 'उद्योग विभाग, हिमाचल प्रदेश',
    benefitAmount: '₹60 लाख तक परियोजना पर 25% से 35% पूंजी सब्सिडी',
    benefitPeriod: 'ग्रामीण युवा स्वरोजगार अनुदान',
    description: '18 से 45 वर्ष के हिमाचली युवाओं को गांव व कस्बे में छोटे उद्योग, वर्कशॉप, कैफे, डेयरी अथवा सेवा केंद्र खोलने हेतु 35% तक सब्सिडी और 5% ब्याज छूट।',
    descriptionEn: 'Up to 35% capital subsidy on projects up to ₹60 Lakh and 5% interest subvention for youth aged 18-45 starting local rural enterprises.',
    eligibilityConditions: [
      'आयु 18 से 45 वर्ष (महिलाओं व अनुसूचित जाति/जनजाति हेतु 50 वर्ष तक)',
      'हिमाचल प्रदेश का स्थायी बोनाफाइड निवासी',
      'नया सूक्ष्म उद्योग अथवा सेवा उपक्रम'
    ],
    documentsRequired: [
      'विस्तृत परियोजना रिपोर्ट (DPR)',
      'शैक्षणिक योग्यता व तकनीकी डिप्लोमा/आईटीआई प्रमाण',
      'आधार कार्ड व बैंक स्वीकृति पत्र'
    ],
    category: 'welfare'
  },
  {
    id: 'surya-ghar',
    title: 'पीएम सूर्य घर मुफ्त बिजली योजना / सोलर रूफटॉप',
    titleEn: 'PM Surya Ghar Solar Rooftop Scheme',
    department: 'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय / HIMURJA',
    benefitAmount: '₹78,000 तक सीधी सब्सिडी + 300 यूनिट निःशुल्क बिजली',
    benefitPeriod: 'घरेलू छत पर सोलर संयंत्र स्थापना',
    description: 'घरेलू छत पर 1kW से 3kW रूफटॉप सोलर लगाने पर ₹78,000 तक की पूंजी सब्सिडी। शून्य बिजली बिल का लाभ।',
    descriptionEn: 'Provides up to ₹78,000 capital subsidy for residential rooftop solar installation and 300 free monthly power units.',
    eligibilityConditions: [
      'पक्की छत (कंक्रीट अथवा टीन शेड धूपयुक्त)',
      'घरेलू विद्युत कनेक्शन (HPSEBL उपभोक्ता)',
      'छत पर पर्याप्त छायामुक्त स्थान'
    ],
    documentsRequired: [
      'HPSEBL नवीनतम बिजली बिल (CA Number)',
      'मकान स्वामित्व प्रमाण / छत फोटो',
      'आधार व बैंक खाता पासबुक'
    ],
    category: 'energy'
  },
  {
    id: 'har-ghar-nal',
    title: 'हर घर नल से जल (जल जीवन मिशन)',
    titleEn: 'Har Ghar Nal Se Jal (Jal Jeevan Mission)',
    department: 'जल शक्ति विभाग, नूरपुर मंडल',
    benefitAmount: '₹0 निःशुल्क व्यक्तिगत नल एवं पाइपलाइन कनेक्शन',
    benefitPeriod: 'स्थायी शुद्ध पेयजल सुरक्षा',
    description: 'ग्रामीण एवं पहाड़ी बस्तियों में हर घर तक शुद्ध पेयजल का व्यक्तिगत नल कनेक्शन तथा पाइपलाइन विस्तार।',
    descriptionEn: 'Free individual tap water connection and pipeline laying directly into rural households under Jal Jeevan Mission.',
    eligibilityConditions: [
      'घर में वर्तमान में व्यक्तिगत नल कनेक्शन न हो',
      'वार्ड अथवा पंचायत क्षेत्र में पेयजल मुख्य लाइन की उपलब्धता'
    ],
    documentsRequired: [
      'राशन कार्ड प्रति',
      'पंचायत अनापत्ति / निवास प्रमाण पत्र',
      'आधार कार्ड'
    ],
    category: 'welfare'
  },
  {
    id: 'himcare',
    title: 'हिमकेयर स्वास्थ्य सुरक्षा योजना (HIMCARE)',
    titleEn: 'HimCare Universal Health Cover Scheme',
    department: 'स्वास्थ्य एवं परिवार कल्याण विभाग, हि.प्र.',
    benefitAmount: '₹5,00,000 तक कैशलेस अस्पताल उपचार',
    benefitPeriod: 'प्रति परिवार प्रति वर्ष',
    description: 'आयुष्मान भारत से छूटे सभी हिमाचली परिवारों को प्रदेश व पीजीआई/एम्स के अस्पतालों में ₹5 लाख तक का निःशुल्क कैशलेस इलाज।',
    descriptionEn: 'Provides cashless hospitalization up to ₹5 Lakhs per family per year across empaneled civil hospitals, PGI, and AIIMS.',
    eligibilityConditions: [
      'परिवार आयुष्मान भारत का लाभार्थी न हो',
      'हिमाचल का वैध राशन कार्ड धारक',
      'बीपीएल / सामान्य / वरिष्ठ नागरिक परिवार'
    ],
    documentsRequired: [
      'राशन कार्ड / हिम परिवार आईडी',
      'आधार कार्ड सभी सदस्यों का',
      'शून्य/नाममात्र प्रीमियम रसीद'
    ],
    category: 'health'
  },
  {
    id: 'kanyadaan',
    title: 'मुख्यमंत्री कन्यादान एवं शगुन योजना',
    titleEn: 'Mukhyamantri Kanyadaan & Shagun Scheme',
    department: 'सामाजिक न्याय एवं अधिकारिता विभाग',
    benefitAmount: '₹51,000 / ₹31,000 एकमुश्त विवाह अनुदान',
    benefitPeriod: 'कन्या विवाह के अवसर पर',
    description: 'बीपीएल एवं असहाय परिवारों की सुपुत्रियों के विवाह हेतु राज्य सरकार द्वारा सम्मानपूर्वक आर्थिक अनुदान।',
    descriptionEn: 'Direct financial assistance of ₹51,000 given to parents for the wedding of daughters belonging to BPL/destitute households.',
    eligibilityConditions: [
      'परिवार में 18 वर्ष से अधिक आयु की सुपुत्री',
      'बीपीएल सूची में दर्ज परिवार अथवा वार्षिक आय ₹50,000 से कम',
      'विवाह की न्यूनतम आयु पूर्ण'
    ],
    documentsRequired: [
      'बीपीएल प्रमाण पत्र / आय प्रमाण पत्र',
      'कन्या व वर का आयु प्रमाण पत्र',
      'विवाह निमंत्रण पत्र / पंचायत सत्यापन'
    ],
    category: 'women'
  }
];

export interface YojanaEligibilityResult {
  qualifiedYojanas: YojanaItem[];
  totalAnnualBenefitRupees: number;
  highlightedRecommendation: string;
  urgentDocumentNote: string;
}

// Exact evaluateEligibility function requested by prompt
export function evaluateEligibility(answers: UserProfileAnswers): YojanaItem[] {
  const qualified: YojanaItem[] = [];

  // Role based quick check
  if (answers.role === 'destitute' || answers.hasDestituteOrOrphan || (answers.familyCategory === 'ANTYODAYA' && answers.annualIncomeRange === 'BELOW_1_5L')) {
    const y = ALL_YOJANAS.find(i => i.id === 'sukh-aashray');
    if (y && !qualified.includes(y)) qualified.push(y);
  }

  if (answers.role === 'woman' || answers.hasWoman18To59) {
    if (answers.annualIncomeRange !== 'ABOVE_2_5L') {
      const y = ALL_YOJANAS.find(i => i.id === 'pyari-behna');
      if (y && !qualified.includes(y)) qualified.push(y);
    }
  }

  if (answers.role === 'farmer' || answers.isPracticingFarmer || answers.landHolding !== 'LANDLESS') {
    const y = ALL_YOJANAS.find(i => i.id === 'prakritik-kheti');
    if (y && !qualified.includes(y)) qualified.push(y);
  }

  if (answers.role === 'youth') {
    const y = ALL_YOJANAS.find(i => i.id === 'swavalamban');
    if (y && !qualified.includes(y)) qualified.push(y);
  }

  if (answers.hasConcreteRoof) {
    const y = ALL_YOJANAS.find(i => i.id === 'surya-ghar');
    if (y && !qualified.includes(y)) qualified.push(y);
  }

  if (answers.hasTapConnection === false) {
    const y = ALL_YOJANAS.find(i => i.id === 'har-ghar-nal');
    if (y && !qualified.includes(y)) qualified.push(y);
  }

  if (answers.familyCategory !== 'GENERAL' || answers.annualIncomeRange !== 'ABOVE_2_5L') {
    const y = ALL_YOJANAS.find(i => i.id === 'himcare');
    if (y && !qualified.includes(y)) qualified.push(y);
  }

  if (answers.hasGirlChild && (answers.familyCategory === 'BPL' || answers.familyCategory === 'ANTYODAYA' || answers.annualIncomeRange === 'BELOW_1_5L')) {
    const y = ALL_YOJANAS.find(i => i.id === 'kanyadaan');
    if (y && !qualified.includes(y)) qualified.push(y);
  }

  if (qualified.length === 0) {
    const y1 = ALL_YOJANAS.find(i => i.id === 'himcare')!;
    const y2 = ALL_YOJANAS.find(i => i.id === 'surya-ghar')!;
    qualified.push(y1, y2);
  }

  return qualified;
}

export function evaluateYojanaEligibility(answers: YojanaUserAnswers | UserProfileAnswers): YojanaEligibilityResult {
  const qualified = evaluateEligibility(answers as UserProfileAnswers);
  let totalBenefit = 0;

  qualified.forEach(y => {
    if (y.id === 'sukh-aashray') totalBenefit += 48000;
    else if (y.id === 'pyari-behna') totalBenefit += 18000;
    else if (y.id === 'prakritik-kheti') totalBenefit += 41000;
    else if (y.id === 'swavalamban') totalBenefit += 150000;
    else if (y.id === 'surya-ghar') totalBenefit += 78000;
    else if (y.id === 'har-ghar-nal') totalBenefit += 12000;
    else if (y.id === 'himcare') totalBenefit += 50000;
    else if (y.id === 'kanyadaan') totalBenefit += 51000;
    else totalBenefit += 20000;
  });

  const highlightedRecommendation = qualified.length >= 3
    ? `बधाई! आपका परिवार हिमाचल सरकार व केंद्र की ${qualified.length} प्रमुख जनकल्याणकारी योजनाओं का सीधा लाभार्थी बन सकता है।`
    : `आपके परिवार हेतु ${qualified.length} महत्वपूर्ण सरकारी योजनाएं उपलब्ध हैं।`;

  const urgentDocumentNote = 'आवेदन हेतु आवश्यक दस्तावेज: आधार कार्ड, हिम परिवार (Him Parivar) आईडी, राशन कार्ड व बैंक खाता पासबुक की प्रति तैयार रखें।';

  return {
    qualifiedYojanas: qualified,
    totalAnnualBenefitRupees: totalBenefit,
    highlightedRecommendation,
    urgentDocumentNote
  };
}
