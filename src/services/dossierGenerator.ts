/**
 * High Command & Cabinet Ministry Dossier Generator
 * Compiles a corporate-grade executive performance dossier for Ranbir Singh Nikka (Nurpur AC 142).
 * Designed for presentation to National High Command (New Delhi / Shimla), Chief Minister, and Party Leadership.
 */

export interface HighCommandDossierData {
  generatedDate: string;
  mlaName: string;
  constituency: string;
  district: string;
  state: string;
  tenure: string;
  corePitch: {
    titleHi: string;
    descriptionHi: string;
    targetPositions: string[];
  };
  metrics: {
    totalComplaintsLogged: number;
    totalComplaintsResolved: number;
    resolutionRatePct: number;
    avgResolutionTimeHours: number;
    mlaLadSanctionedRupees: number;
    mlaLadCompletionsCount: number;
    cagAuditRemarksPending: number;
    nijaatPrivateAidRupees: number;
    nijaatBeneficiaryFamilies: number;
    nijaatLockedVoters: number;
    pannaPramukhsTrainedCount: number;
    boothsSaturatedCount: number;
    whatsappNetworkSubscribers: number;
    projectedLeadMargin: number;
  };
  cabinetSuitabilityJustification: {
    portfolio: string;
    portfolioHi: string;
    strengthsHi: string[];
  }[];
  flagshipInfrastructureProjects: {
    projectName: string;
    projectNameHi: string;
    sanctionedAmountRupees: number;
    department: string;
    beneficiaryVillagesCount: number;
    status: 'COMPLETED' | 'NEAR_COMPLETION';
  }[];
}

export const GET_HIGH_COMMAND_DOSSIER = (): HighCommandDossierData => {
  return {
    generatedDate: '30 अक्टूबर 2026',
    mlaName: 'रणबीर सिंह निक्का (Ranbir Singh Nikka)',
    constituency: '142 - नूरपुर (Nurpur Vidhan Sabha)',
    district: 'कांगड़ा (Kangra)',
    state: 'हिमाचल प्रदेश (Himachal Pradesh)',
    tenure: '2022 - 2026 (विद्यमान विधायक)',
    corePitch: {
      titleHi: 'कांगड़ा के औद्योगिक विकास एवं संगठन सुदृढ़ीकरण हेतु सशक्त नेतृत्व',
      descriptionHi: 'सफल उद्योगपति के रूप में प्रशासनिक एवं वित्तीय अनुशासन का प्रमाण। नूरपुर के 118 बूथों पर 1,180 पन्ना प्रमुखों का आधुनिक डेटा-संचालित नेटवर्क, ₹42.8 करोड़ की पारदर्शी विकास परियोजनाएं एवं ₹3.82 करोड़ की निजी सहायता से कांगड़ा की सबसे अभेद्य विधानसभा सीट स्थापित की है।',
      targetPositions: [
        'कैबिनेट मंत्री - उद्योग, श्रम एवं रोजगार (Industries, Labour & Employment)',
        'कैबिनेट मंत्री - लोक निर्माण विभाग (PWD) व ऊर्जा',
        'कांगड़ा संसदीय क्षेत्र (Lok Sabha) चुनाव अभियान समिति प्रमुख'
      ]
    },
    metrics: {
      totalComplaintsLogged: 1505,
      totalComplaintsResolved: 1418,
      resolutionRatePct: 94.2,
      avgResolutionTimeHours: 28.4,
      mlaLadSanctionedRupees: 428000000, // ₹42.8 Cr
      mlaLadCompletionsCount: 148,
      cagAuditRemarksPending: 0,
      nijaatPrivateAidRupees: 38245000, // ₹3.82 Cr
      nijaatBeneficiaryFamilies: 4820,
      nijaatLockedVoters: 19280,
      pannaPramukhsTrainedCount: 1180,
      boothsSaturatedCount: 118,
      whatsappNetworkSubscribers: 42350,
      projectedLeadMargin: 18450
    },
    cabinetSuitabilityJustification: [
      {
        portfolio: 'Industries & Commerce',
        portfolioHi: 'उद्योग, वाणिज्य एवं निवेश प्रोत्साहन',
        strengthsHi: [
          'उद्योगपति पृष्ठभूमि होने के कारण निजी क्षेत्र के निवेश व MSME की जमीनी चुनौतियों का प्रत्यक्ष अनुभव।',
          'कंडवाल व जसूर औद्योगिक क्षेत्रों के पुनरुद्धार हेतु व्यावहारिक कार्ययोजना तैयार।',
          'कांगड़ा घाटी में स्थानीय युवाओं हेतु 5,000+ निजी रोजगार सृजन का स्पष्ट खाका।'
        ]
      },
      {
        portfolio: 'PWD & Rural Infrastructure',
        portfolioHi: 'लोक निर्माण (PWD) एवं ग्रामीण संपर्क',
        strengthsHi: [
          '148 ग्रामीण विकास कार्यों का समयबद्ध CAG-ऑडिटेड रिकॉर्ड (शून्य पेंडेंसी)।',
          'पहाड़ी क्षेत्रों में भारी बरसात व भूस्खलन में 24 घंटे के भीतर जेसीबी व आपातकालीन बहाली का अनुभव।',
          'नूरपुर-कोटला-रेहन हाईवे चौड़ीकरण व बाईपास परियोजनाओं की त्वरित स्वीकृति का श्रेय।'
        ]
      },
      {
        portfolio: 'Kangra Parliamentary Influence',
        portfolioHi: 'कांगड़ा जिला संगठन एवं लोकसभा विजय रणनीति',
        strengthsHi: [
          'कांगड़ा के 15 विधानसभा क्षेत्रों में राजपूत व सर्वसमाज में सर्वमान्य स्वच्छ छवि।',
          'बिना किसी गुटबाजी के केवल संगठन निष्ठा व कार्यकर्ता सम्मान पर केंद्रित कार्यशैली।',
          'लोकसभा चुनाव में कांगड़ा सीट से ऐतिहासिक 50,000+ मतों की बढ़त दिलाने की पूर्ण संगठनात्मक क्षमता।'
        ]
      }
    ],
    flagshipInfrastructureProjects: [
      {
        projectName: 'Nurpur City Multi-Specialty Trauma Care & Mother-Child Hospital Wing',
        projectNameHi: 'नूरपुर शहर मल्टी-स्पेशियलिटी ट्रॉमा सेंटर व मातृ-शिशु विंग',
        sanctionedAmountRupees: 185000000,
        department: 'Health & Family Welfare',
        beneficiaryVillagesCount: 42,
        status: 'NEAR_COMPLETION'
      },
      {
        projectName: 'Jasur-Bhadwar-Suliali 4-Lane Feeder Link Highway Upgrade',
        projectNameHi: 'जसूर-भदवार-सुलियाली 4-लेन फीडर लिंक मार्ग उन्नयन',
        sanctionedAmountRupees: 120000000,
        department: 'PWD (HPPWD)',
        beneficiaryVillagesCount: 28,
        status: 'COMPLETED'
      },
      {
        projectName: 'Rehan-Kotla Lift Drinking Water & Canal Augmentation Scheme',
        projectNameHi: 'रेहन-कोटला लिफ्ट पेयजल एवं कृषि सिंचाई संवर्धन योजना',
        sanctionedAmountRupees: 68000000,
        department: 'Jal Shakti Vibhag',
        beneficiaryVillagesCount: 19,
        status: 'COMPLETED'
      },
      {
        projectName: 'Ganoh-Sadwan Integrated Rural Sports Complex & Open Gymnasium',
        projectNameHi: 'गनोह-सद्वां एकीकृत ग्रामीण खेल परिसर व जिम',
        sanctionedAmountRupees: 32000000,
        department: 'Youth Services & Sports',
        beneficiaryVillagesCount: 14,
        status: 'COMPLETED'
      },
      {
        projectName: '118 Booths Modern Jan Suvidha Kendra & Solar Streetlight Grid',
        projectNameHi: '118 बूथ जनसुविधा केंद्र एवं सोलर स्ट्रीटलाइट ग्रिड',
        sanctionedAmountRupees: 23000000,
        department: 'HIMURJA / Rural Development',
        beneficiaryVillagesCount: 118,
        status: 'COMPLETED'
      }
    ]
  };
};
