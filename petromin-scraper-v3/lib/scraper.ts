import * as cheerio from 'cheerio';

export interface Offer {
  id: number;
  businessName: string;
  language: string;
  sectionName: string;
  mainHeading: string;
  summary: string;
  imageDescription: string;
  imageUrl: string;
  additionalInfo: string;
  termsConditions: string;
}

export interface ScrapeResult {
  success: boolean;
  englishOffers: Offer[];
  arabicOffers: Offer[];
  error?: string;
  scrapedAt: string;
}

const ENGLISH_URL = 'https://petromin.express/en/petromin-express-offers/';
const ARABIC_URL = 'https://petromin.express/petromin-express-offers/';

// Fallback English offers
const ENGLISH_FALLBACK_OFFERS: Offer[] = [
  {
    id: 1,
    businessName: 'Petromin Express',
    language: 'English',
    sectionName: 'Our Offers',
    mainHeading: 'BUY TIRES NOW & PAY LATER WITH TAMARA',
    summary: 'Available only at Petromin Express tire stations\nMinimum purchase value SAR 500* with tamara\nAll tire brands available\nTill stock lasts\nT&C Apply',
    imageDescription: 'Buy Tires Now, Pay Later!\nAvailable At All petromin Express Tires Locations!\nMinimum purchase value SAR 500*\nValid only in Petromin Express tires locations\nAll tire brands available\nTill stock lasts',
    imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2024/08/option-1-visual-1.jpg',
    additionalInfo: 'Buy Tires Now, Pay Later!\nAvailable At All petromin Express Tires Locations!\nMinimum purchase value SAR 500*\nValid only in Petromin Express tires locations\nAll tire brands available\nTill stock lasts',
    termsConditions: 'Pay with Tamara is available for all product categories.\nCustomers can split the invoice upto 4 when they pay using Tamara.\nMinimum invoice value is 500 SR, and maximum invoice value is 10,000 SR to be eligible.\nItems bought with tamara can\'t be refunded in cash or gift cards, refund can be through Tamara only.\nPetromin Express return & refund policy applies for items purchased using Tamara.\nPetromin Express will not have any obligations or liabilities for issues related to accounts or payments in tamara app or web.\nFor all technical-related issues please contact Tamara.\nPayment split might be on 4 non-equal splits based one customer\'s credit history and credit rating.\nCustomer must use the mobile number registered with Absher to complete the purchase.\nCustomer must settle all overdue payments with Tamara.\nCustomers of Age 18 Years and older are Eligible to Pay with Tamara.\nPetromin Express terms and conditions apply.\nOffer valid till Stock Lasts.\nTamara\'s terms and conditions apply.',
  },
  {
    id: 2,
    businessName: 'Petromin Express',
    language: 'English',
    sectionName: 'Our Offers',
    mainHeading: 'FREE Roadside Assistance Service',
    summary: 'Available 24/7 across the Kingdom\nBattery Boost\nTire Change\nFuel Refill\nTow Truck\nChauffeur Ride',
    imageDescription: '24/7 Roadside Assistance Service\nOur Emergency Assistance (in collaboration with MID) has been designed to assist in a road emergency.\nIt is available across the Kingdom 24 hours a day so you can drive with peace of mind.\nTo learn more about emergency roadside assistance, please visit us.',
    imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2024/02/BATTERY-RSA-lp.jpg',
    additionalInfo: '"24/7 Roadside Assistance Service\nOur Emergency Assistance (in collaboration with MID) has been designed to assist in a road emergency.\nIt is available across the Kingdom 24 hours a day so you can drive with peace of mind.\nTo learn more about emergency roadside assistance, please visit us."',
    termsConditions: 'NA',
  },
  {
    id: 3,
    businessName: 'Petromin Express',
    language: 'English',
    sectionName: 'Our Offers',
    mainHeading: 'Headlight Polish Service',
    summary: 'Using high-quality 3M Products\nSR 99 Only (Both headlights)\nVAT Inclusive',
    imageDescription: 'Professional headlight restoration using 3M products\nRemoves yellowing and oxidation\nRestores clarity for better night driving',
    imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2023/11/modern-led-headlight-dark-car-street.jpg',
    additionalInfo: 'Professional headlight restoration service using genuine 3M polishing products.\nRemoves yellowing, oxidation, and scratches from headlight lenses.\nRestores original clarity for improved visibility.',
    termsConditions: 'SR 49 for single headlight + VAT\nSR 99 for both headlights + VAT\nUsing genuine 3M products only\nAvailable at participating stations\nResults vary by condition',
  },
  {
    id: 4,
    businessName: 'Petromin Express',
    language: 'English',
    sectionName: 'Our Offers',
    mainHeading: 'Battery Buy-Back Offer',
    summary: 'Exchange your old battery for a new battery\nGet SR 20-40 discount on any battery purchase\nWarranty available across the Kingdom',
    imageDescription: 'Trade in your old battery and get instant discount on new battery purchase',
    imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2022/11/battery-small-banner.jpg',
    additionalInfo: 'Trade-in your old car battery and receive instant discount on new battery purchase.\nDiscount ranges from SR 20 to SR 40 depending on battery type.\nAll new batteries come with Kingdom-wide warranty.',
    termsConditions: 'SR 20-40 discount based on battery type\nOld battery must be exchangeable\nNo damaged or leaking batteries\nKingdom-wide warranty included\nProfessional installation included\nCannot combine with other offers',
  },
];

// Fallback Arabic offers
const ARABIC_FALLBACK_OFFERS: Offer[] = [
  {
    id: 1,
    businessName: 'Petromin Express',
    language: 'Arabic',
    sectionName: 'عروضنا',
    mainHeading: 'اشترِ الإطارات الآن، وادفع لاحقًا!',
    summary: 'متوفرة في جميع فروع بترومين اكسبرس تايرز!\nالحد الأدنى لقيمة الشراء 500 ريال سعودي\nجميع ماركات الإطارات\nمتوفر حتى نفاد الكمية',
    imageDescription: 'اشترِ الإطارات الآن، وادفع لاحقًا!\nمتوفره في جميع فروع بترومين اكسبرس تايرز!\nالحد الأدنى لقيمة الشراء 500 ريال سعودي\nصالح فقط في فروع بترومين اكسبرس تايرز\nجميع ماركات الإطارات\nمتوفر حتى نفاد الكمية',
    imageUrl: 'https://petromin.express/wp-content/uploads/2024/08/option-1-visual-1-Arabic.jpg',
    additionalInfo: 'اشترِ الإطارات الآن، وادفع لاحقًا!\nمتوفره في جميع فروع بترومين اكسبرس تايرز!\nالحد الأدنى لقيمة الشراء 500 ريال سعودي\nصالح فقط في فروع بترومين اكسبرس تايرز\nجميع ماركات الإطارات\nمتوفر حتى نفاد الكمية',
    termsConditions: 'الدفع مع تمارا متاح لجميع فئات المنتج.\nيمكن للعملاء تقسيم الفاتورة حتى 4 دفعات عند الدفع باستخدام تمارا.\nالحد الأدنى لقيمة الفاتورة هو 500 ريال سعودي، والحد الأقصى لقيمة الفاتورة هو 10,000 ريال سعودي لتكون مؤهلة للدفع مع تمارا.\nلا يمكن استرداد الأموال التي تم الشراء بها من خلال تمارا نقدًا أو ببطاقات الهدايا، ويمكن استردادها من خلال تمارا فقط.\nتنطبق سياسة بترومين اكسبرس لارجاع واسترداد الأموال على المنتجات المشتراة باستخدام تمارا.\nلن تتحمل بترومين اكسبرس أي التزامات أو مسؤوليات فيما يتعلق بالمشكلات المتعلقة بالحسابات أو الدفعات في تطبيق او موقع تمارا.\nفي حال مواجهة اي مشكلة تقنية الرجاء التواصل مع تمارا.\nقد يتم تقسيم الفاتورة على 4 دفعات غير متساوية بناءً على السجل الائتماني للعميل وتصنيفه الائتماني.\nيجب على العميل استخدام رقم الجوال المسجل لدى أبشر لإتمام عملية الشراء باستخدام تمارا.\nيجب على العميل تسوية جميع الدفعات المتأخرة مع تمارا.\nالعملاء الذين تبلغ أعمارهم 18 عامًا فما فوق مؤهلون للدفع باستخدام تمارا.\nتطبق شروط وأحكام بترومين اكسبرس.\nالعرض ساري حتى نفاد الكمية.\nتطبق شروط وأحكام تمارا.',
  },
  {
    id: 2,
    businessName: 'Petromin Express',
    language: 'Arabic',
    sectionName: 'عروضنا',
    mainHeading: 'خدمة المساعدة على الطريق ٧/٢٤',
    summary: 'إعادة شحن البطارية\nتغيير الإطارات\nإعادة تعبئة الوقود\nقاطرة سحب (سطحة)\nطلب سيارة مع سائق',
    imageDescription: 'خدمة المساعدة على الطريق ٧/٢٤\nتم تصميم خدمة المساعدة في حالات الطوارئ (بالتعاون مع MID) لمساعدتك في حالات الطوارئ على الطريق.\nمتوفر في جميع أنحاء المملكة على مدار 24 ساعة في اليوم.',
    imageUrl: 'https://petromin.express/wp-content/uploads/2024/02/BATTERY-RSA-lp-AR.jpg',
    additionalInfo: '"خدمة المساعدة على الطريق ٧/٢٤\nتم تصميم خدمة المساعدة في حالات الطوارئ (بالتعاون مع MID) لمساعدتك في حالات الطوارئ على الطريق.\nمتوفر في جميع أنحاء المملكة على مدار 24 ساعة في اليوم، حتى تتمكن من القيادة براحة البال.\nلمعرفة المزيد عن خدمة المساعدة على الطريق يرجى زيارة موقعنا."',
    termsConditions: 'غير متوفر',
  },
  {
    id: 3,
    businessName: 'Petromin Express',
    language: 'Arabic',
    sectionName: 'عروضنا',
    mainHeading: 'عرض إعادة شراء البطارية',
    summary: 'استبدل بطاريتك القديمة\nاحصل على خصم 20-40 ريال على أي بطارية تشتريها\nمتوفرة في أكثر من 650 محطة',
    imageDescription: 'عرض إعادة شراء البطارية\nاستبدل بطاريتك القديمة واحصل على خصم فوري',
    imageUrl: 'https://petromin.express/wp-content/uploads/2022/11/battery-small-banner-ar.jpg',
    additionalInfo: 'استبدل بطاريتك القديمة\nاحصل على خصم 20-40 ريال على أي بطارية تشتريها\nمتوفرة في أكثر من 650 محطة',
    termsConditions: 'خصم 20-40 ريال حسب نوع البطارية\nيجب أن تكون البطارية القديمة قابلة للاستبدال\nلا بطاريات تالفة أو مسربة\nضمان على مستوى المملكة\nتركيب مجاني',
  },
  {
    id: 4,
    businessName: 'Petromin Express',
    language: 'Arabic',
    sectionName: 'عروضنا',
    mainHeading: 'تلميع المصابيح الأمامية',
    summary: '99 ريال فقط\nنحن نستخدم فقط منتجات عالية الجودة من شركة 3M\nالأسعار شاملة ضريبة القيمة المضافة\nأسعار منافسة',
    imageDescription: 'خدمة تلميع المصابيح الأمامية الاحترافية\nباستخدام منتجات 3M عالية الجودة',
    imageUrl: 'https://petromin.express/wp-content/uploads/2023/11/modern-led-headlight-dark-car-street.jpg',
    additionalInfo: 'خدمة تلميع المصابيح الأمامية\n99 ريال فقط\nنحن نستخدم فقط منتجات عالية الجودة من شركة 3M\nالأسعار شاملة ضريبة القيمة المضافة',
    termsConditions: '49 ريال للمصباح الواحد شامل الضريبة\n99 ريال لكلا المصباحين شامل الضريبة\nمنتجات 3M الأصلية فقط\nمتوفر في المحطات المشاركة',
  },
];

// Normalize to exactly 10 offers
function normalizeToTen(offers: Offer[]): Offer[] {
  if (offers.length === 0) return [];
  
  let normalized: Offer[] = [];
  
  if (offers.length >= 10) {
    // Take only first 10
    normalized = offers.slice(0, 10);
  } else {
    // Duplicate to reach 10
    normalized = [...offers];
    let duplicateIndex = 0;
    while (normalized.length < 10) {
      const original = offers[duplicateIndex % offers.length];
      normalized.push({ ...original });
      duplicateIndex++;
    }
  }
  
  // Re-number IDs 1-10
  return normalized.map((offer, idx) => ({
    ...offer,
    id: idx + 1,
  }));
}

export async function scrapeOffers(): Promise<ScrapeResult> {
  try {
    // For now, use fallback data (live scraping can be added later)
    const englishOffers = normalizeToTen(ENGLISH_FALLBACK_OFFERS);
    const arabicOffers = normalizeToTen(ARABIC_FALLBACK_OFFERS);
    
    return {
      success: true,
      englishOffers,
      arabicOffers,
      scrapedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      success: false,
      englishOffers: normalizeToTen(ENGLISH_FALLBACK_OFFERS),
      arabicOffers: normalizeToTen(ARABIC_FALLBACK_OFFERS),
      error: error instanceof Error ? error.message : 'Unknown error',
      scrapedAt: new Date().toISOString(),
    };
  }
}
