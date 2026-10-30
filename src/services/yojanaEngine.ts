import { YojanaItem, YojanaUserAnswers } from '../types/campaign';

export const ALL_YOJANAS: YojanaItem[] = [
  {
    id: 'sukh-aashray',
    title: 'मुख्यमंत्री सुख-आश्रय योजना (हि.प्र.)',
    titleEn: 'HP Mukhyamantri Sukh Aashray Yojana',
    department: 'सामाजिक न्याय एवं अधिकारिता विभाग, हि.प्र.',
    benefitAmount: '₹4,000 / माह + 100% उच्च शिक्षा शुल्क',
    benefitPeriod: 'मासिक एवं वार्षिक अनुदान',
    description: 'अनाथ बच्चों, निराश्रित महिलाओं एवं बुजुर्गों को "चिल्ड्रन ऑफ द स्टेट" का दर्जा व ₹4,000 मासिक पॉकेट मनी तथा आवास निर्माण सहायता।',
    descriptionEn: 'Provides state child status, ₹4,000/mo pocket allowance, hostel, and complete higher education sponsorship for destitute/orphan youth.',
    eligibilityConditions: [
      'निराश्रित अथवा अनाथ परिवार',
      'हिमाचल प्रदेश का स्थायी निवासी',
      'पारिवारिक आय ₹2.5 लाख से कम'
    ],
    documentsRequired: [
      'हिमाचल बोनाफाइड प्रमाणपत्र',
      'अनाथ / निराश्रित प्रमाण पत्र (ग्राम पंचायत / SDM द्वारा)',
      'बैंक खाता पासबुक व आधार कार्ड'
    ],
    category: 'welfare'
  },
  {
    id: 'pyari-behna',
    title: 'इंदिरा गांधी प्यारी बहना सुख सम्मान निधि',
    titleEn: 'Indira Gandhi Pyari Behna Sukh Samman Nidhi',
    department: 'महिला एवं बाल विकास विभाग, हिमाचल प्रदेश',
    benefitAmount: '₹1,500 / माह (वार्षिक ₹18,000)',
    benefitPeriod: 'आजीवन / मासिक डीबीटी',
    description: '18 से 59 वर्ष की पात्र हिमाचली महिलाओं को आर्थिक आत्मनिर्भरता हेतु प्रति माह ₹1500 की सीधी सहायता।',
    descriptionEn: 'Monthly direct cash transfer of ₹1,500 into bank accounts of eligible women aged 18 to 59 in Himachal Pradesh.',
    eligibilityConditions: [
      'महिला की आयु 18 से 59 वर्ष के मध्य',
      'परिवार में कोई सरकारी पेंशनभोगी अथवा नियमित कर्मचारी न हो',
      'हिमाचल का मूल निवासी परिवार'
    ],
    documentsRequired: [
      'आधार कार्ड व राशन कार्ड प्रति',
      'आयु प्रमाण पत्र / जन्म तिथि',
      'हिम परिवार (Him Parivar) आईडी'
    ],
    category: 'women'
  },
  {
    id: 'himcare',
    title: 'हिमकेयर स्वास्थ्य सुरक्षा योजना (HIMCARE)',
    titleEn: 'HimCare Universal Health Cover Scheme',
    department: 'स्वास्थ्य एवं परिवार कल्याण विभाग, हि.प्र.',
    benefitAmount: '₹5,00,000 तक कैशलेस उपचार',
    benefitPeriod: 'प्रति परिवार प्रति वर्ष',
    description: 'आयुष्मान भारत से छूटे सभी हिमाचली परिवारों को प्रदेश व पीजीआई/एम्स के सूचीबद्ध अस्पतालों में ₹5 लाख तक का निःशुल्क कैशलेस इलाज।',
    descriptionEn: 'Provides cashless treatment up to ₹5 Lakhs per family per year across empaneled civil hospitals, PGI, and AIIMS.',
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
    id: 'prakritik-kheti',
    title: 'राजीव गांधी प्राकृतिक खेती स्टार्ट-अप योजना',
    titleEn: 'Rajiv Gandhi Prakritik Kheti Yojana',
    department: 'कृषि विभाग, हिमाचल प्रदेश',
    benefitAmount: '₹33,000 अनुदान + देशी गाय खरीद पर ₹25,000',
    benefitPeriod: 'एकमुश्त एवं आवर्ती उपकरण सब्सिडी',
    description: 'रासायनिक खाद से मुक्त प्राकृतिक खेती अपनाने वाले किसानों को देशी गाय खरीद अनुदान व प्राकृतिक खाद किट हेतु आर्थिक सहायता।',
    descriptionEn: 'Subsidies up to ₹25,000 for indigenous cow purchase and specialized equipment for natural, chemical-free organic farming.',
    eligibilityConditions: [
      'कृषक परिवार (भूमि स्वामी अथवा पट्टेदार)',
      'सुभाष पालेकर प्राकृतिक खेती पद्धति का प्रशिक्षण',
      'कांगड़ा / नूरपुर कृषि क्षेत्र'
    ],
    documentsRequired: [
      'जमाबंदी / इंतकाल भूमि रिकॉर्ड',
      'किसान क्रेडिट कार्ड (KCC) अथवा आधार',
      'प्रशिक्षण प्रमाण पत्र'
    ],
    category: 'farming'
  },
  {
    id: 'surya-ghar',
    title: 'पीएम सूर्य घर मुफ्त बिजली योजना',
    titleEn: 'PM Surya Ghar Muft Bijli Yojana',
    department: 'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय / HIMURJA',
    benefitAmount: '₹78,000 तक सीधी सब्सिडी + 300 यूनिट फ्री बिजली',
    benefitPeriod: 'छत पर सोलर पैनल स्थापना',
    description: 'घरेलू छत पर 1kW से 3kW रूफटॉप सोलर लगाने पर ₹30,000 से ₹78,000 की सब्सिडी। शून्य बिजली बिल का लाभ।',
    descriptionEn: 'Provides up to ₹78,000 capital subsidy for residential rooftop solar installation and 300 free monthly power units.',
    eligibilityConditions: [
      'पक्की छत (कंक्रीट अथवा टीन शेड धूपयुक्त)',
      'घरेलू विद्युत कनेक्शन (HPSEBL उपभोक्ता)',
      'छत पर पर्याप्त छायामुक्त स्थान'
    ],
    documentsRequired: [
      'HPSEBL नवीनतम बिजली बिल',
      'मकान स्वामित्व प्रमाण / छत फोटो',
      'आधार व बैंक खाता'
    ],
    category: 'energy'
  },
  {
    id: 'har-ghar-nal',
    title: 'हर घर नल से जल (जल जीवन मिशन)',
    titleEn: 'Har Ghar Nal Se Jal (Jal Shakti Vibhag)',
    department: 'जल शक्ति विभाग, नूरपुर मंडल',
    benefitAmount: '₹0 निःशुल्क पाइपलाइन व नल कनेक्शन',
    benefitPeriod: 'स्थायी पेयजल सुरक्षा',
    description: 'ग्रामीण एवं पहाड़ी बस्तियों में हर घर तक शुद्ध पेयजल का व्यक्तिगत नल कनेक्शन तथा पाइपलाइन विस्तार।',
    descriptionEn: 'Free drinking water tap connection and pipeline laying directly into rural households under Jal Jeevan Mission.',
    eligibilityConditions: [
      'घर में वर्तमान में व्यक्तिगत नल कनेक्शन न हो',
      'वार्ड अथवा पंचायत क्षेत्र में पेयजल मुख्य लाइन की उपलब्धता'
    ],
    documentsRequired: [
      'राशन कार्ड',
      'पंचायत अनापत्ति / निवास प्रमाण पत्र',
      'आधार कार्ड'
    ],
    category: 'welfare'
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
  },
  {
    id: 'old-age-pension',
    title: 'हिमाचल वृद्धावस्था एवं दिव्यांग सामाजिक सुरक्षा पेंशन',
    titleEn: 'HP Social Security Old Age Pension',
    department: 'कल्याण विभाग, नूरपुर',
    benefitAmount: '₹1,700 / माह (70 वर्ष से ऊपर बिना आय सीमा)',
    benefitPeriod: 'मासिक डीबीटी पेंशन',
    description: '60 वर्ष से अधिक आयु के पात्र वरिष्ठ नागरिकों को सम्मानजनक जीवन यापन हेतु मासिक पेंशन। 70 वर्ष पश्चात आय सीमा समाप्त।',
    descriptionEn: 'Monthly social pension of ₹1,700 disbursed to senior citizens aged 60+ (universal eligibility above 70 years without income cap).',
    eligibilityConditions: [
      'आयु 60 वर्ष या अधिक',
      '70 वर्ष से ऊपर सभी नागरिक स्वतः पात्र',
      'अन्य सरकारी पेंशन प्राप्त न कर रहे हों'
    ],
    documentsRequired: [
      'आयु प्रमाण पत्र / वोटर कार्ड',
      'बैंक खाता विवरण',
      'परिवार रजिस्टर की नकल'
    ],
    category: 'welfare'
  }
];

export interface YojanaEligibilityResult {
  qualifiedYojanas: YojanaItem[];
  totalAnnualBenefitRupees: number;
  highlightedRecommendation: string;
  urgentDocumentNote: string;
}

export function evaluateYojanaEligibility(answers: YojanaUserAnswers): YojanaEligibilityResult {
  const qualified: YojanaItem[] = [];
  let totalBenefit = 0;

  // 1. Sukh Aashray
  if (answers.hasDestituteOrOrphan || (answers.familyCategory === 'ANTYODAYA' && answers.annualIncomeRange === 'BELOW_1_5L')) {
    const y = ALL_YOJANAS.find(i => i.id === 'sukh-aashray');
    if (y) {
      qualified.push(y);
      totalBenefit += 48000;
    }
  }

  // 2. Pyari Behna ₹1500/mo
  if (answers.hasWoman18To59 && answers.annualIncomeRange !== 'ABOVE_2_5L') {
    const y = ALL_YOJANAS.find(i => i.id === 'pyari-behna');
    if (y) {
      qualified.push(y);
      totalBenefit += 18000;
    }
  }

  // 3. HIMCARE
  if (answers.familyCategory !== 'GENERAL' || answers.annualIncomeRange !== 'ABOVE_2_5L') {
    const y = ALL_YOJANAS.find(i => i.id === 'himcare');
    if (y) {
      qualified.push(y);
      totalBenefit += 50000; // Estimated value of insurance coverage
    }
  }

  // 4. Prakritik Kheti
  if (answers.isPracticingFarmer && (answers.landHolding === 'MARGINAL' || answers.landHolding === 'LANDLESS' || answers.landHolding === 'MEDIUM')) {
    const y = ALL_YOJANAS.find(i => i.id === 'prakritik-kheti');
    if (y) {
      qualified.push(y);
      totalBenefit += 33000;
    }
  }

  // 5. PM Surya Ghar Solar
  if (answers.hasConcreteRoof) {
    const y = ALL_YOJANAS.find(i => i.id === 'surya-ghar');
    if (y) {
      qualified.push(y);
      totalBenefit += 78000;
    }
  }

  // 6. Har Ghar Nal Se Jal
  if (!answers.hasTapConnection) {
    const y = ALL_YOJANAS.find(i => i.id === 'har-ghar-nal');
    if (y) {
      qualified.push(y);
      totalBenefit += 12000;
    }
  }

  // 7. Kanyadaan Scheme
  if (answers.hasGirlChild && (answers.familyCategory === 'BPL' || answers.familyCategory === 'ANTYODAYA' || answers.annualIncomeRange === 'BELOW_1_5L')) {
    const y = ALL_YOJANAS.find(i => i.id === 'kanyadaan');
    if (y) {
      qualified.push(y);
      totalBenefit += 51000;
    }
  }

  // 8. Old Age Pension
  if (answers.hasSeniorCitizen) {
    const y = ALL_YOJANAS.find(i => i.id === 'old-age-pension');
    if (y) {
      qualified.push(y);
      totalBenefit += 20400; // ₹1700 * 12
    }
  }

  // Ensure at least 2 default schemes if none matched
  if (qualified.length === 0) {
    const y1 = ALL_YOJANAS.find(i => i.id === 'himcare')!;
    const y2 = ALL_YOJANAS.find(i => i.id === 'surya-ghar')!;
    qualified.push(y1, y2);
    totalBenefit = 128000;
  }

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
