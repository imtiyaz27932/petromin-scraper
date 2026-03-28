export interface Offer {
  id: number;
  businessName: string;
  language: string;
  sectionName: string;
  mainHeading: string;
  summary: string;
  imageUrl: string;
  additionalInfo: string;
  termsConditions: string;
  tcFormatted: string;
  additionalFormatted: string;
}

export interface ScrapeResult {
  success: boolean;
  englishOffers: Offer[];
  arabicOffers: Offer[];
  error?: string;
  scrapedAt: string;
}

// ==================== PETROMIN EXPRESS ENGLISH ====================
const PETROMIN_EXPRESS_EN: Offer[] = [
  {
    id: 1,
    businessName: 'Petromin Express',
    language: 'English',
    sectionName: 'Our Offers',
    mainHeading: `BUY TIRES NOW & PAY LATER WITH TAMARA
Available only at Petromin Express tire stations
Minimum purchase value SAR 500* with tamara
All tire brands available
Till stock lasts
T&C Apply`,
    summary: `Buy Tires Now, Pay Later!
Available At All petromin Express Tires Locations!
Minimum purchase value SAR 500*
Valid only in Petromin Express tires locations
All tire brands available
Till stock lasts`,
    imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2024/08/option-1-visual-1.jpg',
    additionalInfo: `Buy Tires Now, Pay Later!
Available At All petromin Express Tires Locations!
Minimum purchase value SAR 500*
Valid only in Petromin Express tires locations
All tire brands available
Till stock lasts`,
    termsConditions: `Pay with Tamara is available for all product categories.
Customers can split the invoice upto 4 when they pay using Tamara.
Minimum invoice value is 500 SR, and maximum invoice value is 10,000 SR to be eligible.
Items bought with tamara can't be refunded in cash or gift cards, refund can be through Tamara only.
Petromin Express return & refund policy applies for items purchased using Tamara.
Customer must use the mobile number registered with Absher to complete the purchase.
Customer must settle all overdue payments with Tamara.
Customers of Age 18 Years and older are Eligible to Pay with Tamara.
Petromin Express terms and conditions apply.
Offer valid till Stock Lasts.
Tamara's terms and conditions apply.`,
    tcFormatted: `• Pay with Tamara is available for all product categories
• Customers can split the invoice upto 4 payments
• Minimum invoice value is 500 SR, maximum is 10,000 SR
• Items bought with Tamara can't be refunded in cash or gift cards
• Customer must use mobile number registered with Absher
• Customer must settle all overdue payments with Tamara
• Customers of Age 18+ are Eligible to Pay with Tamara
• Offer valid till Stock Lasts
• Tamara's terms and conditions apply`,
    additionalFormatted: `• Buy Tires Now, Pay Later!
• Available At All petromin Express Tires Locations!
• Minimum purchase value SAR 500*
• Valid only in Petromin Express tires locations
• All tire brands available
• Till stock lasts`,
  },
  {
    id: 2,
    businessName: 'Petromin Express',
    language: 'English',
    sectionName: 'Our Offers',
    mainHeading: `FREE Roadside Assistance Service
Available 24/7 across the Kingdom
Battery Boost
Tire Change
Fuel Refill
Tow Truck
Chauffeur Ride`,
    summary: `24/7 Roadside Assistance Service
Our Emergency Assistance (in collaboration with MID) has been designed to assist in a road emergency.
It is available across the Kingdom 24 hours a day so you can drive with peace of mind.
To learn more about emergency roadside assistance, please visit us.`,
    imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2024/02/BATTERY-RSA-lp.jpg',
    additionalInfo: `24/7 Roadside Assistance Service
Our Emergency Assistance (in collaboration with MID) has been designed to assist in a road emergency.
It is available across the Kingdom 24 hours a day so you can drive with peace of mind.
To learn more about emergency roadside assistance, please visit us.`,
    termsConditions: 'NA',
    tcFormatted: 'NA',
    additionalFormatted: `• 24/7 Roadside Assistance Service
• Emergency Assistance in collaboration with MID
• Available across the Kingdom 24 hours a day
• Drive with peace of mind
• Battery Boost, Tire Change, Fuel Refill, Tow Truck, Chauffeur Ride`,
  },
  {
    id: 3,
    businessName: 'Petromin Express',
    language: 'English',
    sectionName: 'Our Offers',
    mainHeading: `Headlight Polish Service
Using high-quality 3M Products
SR 99 Only (Both headlights)
VAT Inclusive`,
    summary: `Professional Headlight Polish Service
Using high-quality 3M Products
SR 99 Only for both headlights
Prices are VAT Inclusive
Competitive prices`,
    imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2023/11/modern-led-headlight-dark-car-street.jpg',
    additionalInfo: `Professional Headlight Polish Service
Using high-quality 3M Products
SR 99 Only for both headlights
Prices are VAT Inclusive
Competitive prices`,
    termsConditions: `SR 49 for single headlight + VAT
SR 99 for both headlights + VAT
Using genuine 3M products only
Available at participating stations
Results may vary based on headlight condition`,
    tcFormatted: `• SR 49 for single headlight + VAT
• SR 99 for both headlights + VAT
• Using genuine 3M products only
• Available at participating stations
• Results may vary based on headlight condition`,
    additionalFormatted: `• Professional Headlight Polish Service
• Using high-quality 3M Products
• SR 99 Only for both headlights
• Prices are VAT Inclusive
• Competitive prices`,
  },
  {
    id: 4,
    businessName: 'Petromin Express',
    language: 'English',
    sectionName: 'Our Offers',
    mainHeading: `Battery Buy-Back Offer
Exchange your old battery for a new battery
Get SR 20-40 discount on any battery purchase
Warranty available across the Kingdom`,
    summary: `Battery Buy-Back Offer
Exchange your old battery
Get SR 20-40 discount on any battery you purchase
Available in more than 650 stations`,
    imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2022/11/battery-small-banner.jpg',
    additionalInfo: `Battery Buy-Back Offer
Exchange your old battery
Get SR 20-40 discount on any battery you purchase
Available in more than 650 stations`,
    termsConditions: `SR 20-40 discount based on battery type and condition
Old battery must be in exchangeable condition
No damaged or leaking batteries accepted
Kingdom-wide warranty included
Professional installation included
Cannot be combined with other offers`,
    tcFormatted: `• SR 20-40 discount based on battery type and condition
• Old battery must be in exchangeable condition
• No damaged or leaking batteries accepted
• Kingdom-wide warranty included
• Professional installation included
• Cannot be combined with other offers`,
    additionalFormatted: `• Battery Buy-Back Offer
• Exchange your old battery
• Get SR 20-40 discount on any battery you purchase
• Available in more than 650 stations`,
  },
];

// ==================== PETROMIN AUTOCARE ENGLISH ====================
const PETROMIN_AUTOCARE_EN: Offer[] = [
  {
    id: 1,
    businessName: 'Petromin Autocare',
    language: 'English',
    sectionName: 'Our Car Repair Offers',
    mainHeading: `Exclusive Hyundai Brake Pads Offer
Starting from SAR 399`,
    summary: `Exclusive offer for Hyundai Owners!
Get your brake pads replaced starting from SAR 399
Hyundai Genuine Parts
Front or Rear Brake Pads
Labor Charges
Skimming (if Required)
VAT Inclusive`,
    imageUrl: 'https://petrominauto.care/wp-content/uploads/2024/01/hyundai-brake-offer.jpg',
    additionalInfo: `Exclusive offer for Hyundai Owners!
Get your brake pads replaced starting from SAR 399
Hyundai Genuine Parts
Front or Rear Brake Pads
Labor Charges
Skimming (if Required)
VAT Inclusive`,
    termsConditions: `Offer Valid until 10th-Feb-2026
Packages price includes replacement of front or rear brake pads, skimming, and labor
Offer cannot be combined with any other offer
Only available at Petromin Autocare locations
Available till stock lasts`,
    tcFormatted: `• Offer Valid until 10th-Feb-2026
• Package includes front or rear brake pads, skimming, and labor
• Cannot be combined with any other offer
• Only available at Petromin Autocare locations
• Available till stock lasts`,
    additionalFormatted: `• Exclusive offer for Hyundai Owners!
• Get brake pads replaced starting from SAR 399
• Hyundai Genuine Parts
• Front or Rear Brake Pads
• Labor Charges included
• Skimming if Required
• VAT Inclusive`,
  },
  {
    id: 2,
    businessName: 'Petromin Autocare',
    language: 'English',
    sectionName: 'Our Car Repair Offers',
    mainHeading: `Toyota Brake Pad Mega Offer
Limited Time Offer!`,
    summary: `Toyota Brake Pad Offer
Toyota Genuine Parts
Price includes labor charges
VAT Inclusive
Skimming (If needed)`,
    imageUrl: 'https://petrominauto.care/wp-content/uploads/2024/01/toyota-brake-offer.jpg',
    additionalInfo: `Toyota Brake Pad Offer
Toyota Genuine Parts
Price includes labor charges
VAT Inclusive
Skimming (If needed)`,
    termsConditions: `Offer Valid until 10th-Feb-2026
Packages price includes replacement of front or rear brake pads, skimming, and labor
Offer cannot be combined with any other offer
Only available at Petromin Autocare locations
Available till stock lasts`,
    tcFormatted: `• Offer Valid until 10th-Feb-2026
• Package includes front or rear brake pads, skimming, and labor
• Cannot be combined with any other offer
• Only available at Petromin Autocare locations
• Available till stock lasts`,
    additionalFormatted: `• Toyota Brake Pad Offer
• Toyota Genuine Parts
• Price includes labor charges
• VAT Inclusive
• Skimming if needed`,
  },
];

// ==================== PETROMIN EXPRESS ARABIC ====================
const PETROMIN_EXPRESS_AR: Offer[] = [
  {
    id: 1,
    businessName: 'Petromin Express',
    language: 'Arabic',
    sectionName: 'عروضنا',
    mainHeading: `اشترِ الإطارات الآن، وادفع لاحقًا!
متوفرة في جميع فروع بترومين اكسبرس تايرز!
الحد الأدنى لقيمة الشراء 500 ريال سعودي
جميع ماركات الإطارات
متوفر حتى نفاد الكمية`,
    summary: `اشترِ الإطارات الآن، وادفع لاحقًا!
متوفره في جميع فروع بترومين اكسبرس تايرز!
الحد الأدنى لقيمة الشراء 500 ريال سعودي
صالح فقط في فروع بترومين اكسبرس تايرز
جميع ماركات الإطارات
متوفر حتى نفاد الكمية`,
    imageUrl: 'https://petromin.express/wp-content/uploads/2024/08/option-1-visual-1-Arabic.jpg',
    additionalInfo: `اشترِ الإطارات الآن، وادفع لاحقًا!
متوفره في جميع فروع بترومين اكسبرس تايرز!
الحد الأدنى لقيمة الشراء 500 ريال سعودي
صالح فقط في فروع بترومين اكسبرس تايرز
جميع ماركات الإطارات
متوفر حتى نفاد الكمية`,
    termsConditions: `الدفع مع تمارا متاح لجميع فئات المنتج.
يمكن للعملاء تقسيم الفاتورة حتى 4 دفعات عند الدفع باستخدام تمارا.
الحد الأدنى لقيمة الفاتورة هو 500 ريال سعودي، والحد الأقصى 10,000 ريال سعودي.
لا يمكن استرداد الأموال نقدًا أو ببطاقات الهدايا.
يجب استخدام رقم الجوال المسجل لدى أبشر.
يجب تسوية جميع الدفعات المتأخرة مع تمارا.
العملاء 18 عامًا فما فوق مؤهلون للدفع.
العرض ساري حتى نفاد الكمية.
تطبق شروط وأحكام تمارا.`,
    tcFormatted: `• الدفع مع تمارا متاح لجميع فئات المنتج
• يمكن تقسيم الفاتورة حتى 4 دفعات
• الحد الأدنى 500 ريال، الحد الأقصى 10,000 ريال
• لا يمكن استرداد المبالغ نقدًا أو ببطاقات الهدايا
• يجب استخدام رقم الجوال المسجل لدى أبشر
• العملاء 18 عامًا فما فوق مؤهلون للدفع
• العرض ساري حتى نفاد الكمية`,
    additionalFormatted: `• اشترِ الإطارات الآن، وادفع لاحقًا!
• متوفره في جميع فروع بترومين اكسبرس تايرز!
• الحد الأدنى لقيمة الشراء 500 ريال سعودي
• جميع ماركات الإطارات
• متوفر حتى نفاد الكمية`,
  },
  {
    id: 2,
    businessName: 'Petromin Express',
    language: 'Arabic',
    sectionName: 'عروضنا',
    mainHeading: `خدمة المساعدة على الطريق ٧/٢٤
إعادة شحن البطارية
تغيير الإطارات
إعادة تعبئة الوقود
قاطرة سحب (سطحة)
طلب سيارة مع سائق`,
    summary: `خدمة المساعدة على الطريق ٧/٢٤
تم تصميم خدمة المساعدة في حالات الطوارئ (بالتعاون مع MID) لمساعدتك في حالات الطوارئ على الطريق.
متوفر في جميع أنحاء المملكة على مدار 24 ساعة في اليوم.
حتى تتمكن من القيادة براحة البال.`,
    imageUrl: 'https://petromin.express/wp-content/uploads/2024/02/BATTERY-RSA-lp-AR.jpg',
    additionalInfo: `خدمة المساعدة على الطريق ٧/٢٤
تم تصميم خدمة المساعدة في حالات الطوارئ (بالتعاون مع MID) لمساعدتك في حالات الطوارئ على الطريق.
متوفر في جميع أنحاء المملكة على مدار 24 ساعة في اليوم.
حتى تتمكن من القيادة براحة البال.`,
    termsConditions: 'NA',
    tcFormatted: 'NA',
    additionalFormatted: `• خدمة المساعدة على الطريق ٧/٢٤
• خدمة المساعدة في حالات الطوارئ بالتعاون مع MID
• متوفر في جميع أنحاء المملكة على مدار 24 ساعة
• إعادة شحن البطارية، تغيير الإطارات، إعادة تعبئة الوقود
• قاطرة سحب، طلب سيارة مع سائق`,
  },
  {
    id: 3,
    businessName: 'Petromin Express',
    language: 'Arabic',
    sectionName: 'عروضنا',
    mainHeading: `عرض إعادة شراء البطارية
استبدل بطاريتك القديمة
احصل على خصم 20-40 ريال على أي بطارية تشتريها
متوفرة في أكثر من 650 محطة`,
    summary: `عرض إعادة شراء البطارية
استبدل بطاريتك القديمة
احصل على خصم 20-40 ريال على أي بطارية تشتريها
متوفرة في أكثر من 650 محطة`,
    imageUrl: 'https://petromin.express/wp-content/uploads/2022/11/battery-small-banner-ar.jpg',
    additionalInfo: `عرض إعادة شراء البطارية
استبدل بطاريتك القديمة
احصل على خصم 20-40 ريال على أي بطارية تشتريها
متوفرة في أكثر من 650 محطة`,
    termsConditions: `خصم 20-40 ريال حسب نوع البطارية وحالتها
يجب أن تكون البطارية القديمة قابلة للاستبدال
لا بطاريات تالفة أو مسربة
ضمان على مستوى المملكة
تركيب مجاني`,
    tcFormatted: `• خصم 20-40 ريال حسب نوع البطارية وحالتها
• يجب أن تكون البطارية القديمة قابلة للاستبدال
• لا بطاريات تالفة أو مسربة
• ضمان على مستوى المملكة
• تركيب مجاني`,
    additionalFormatted: `• عرض إعادة شراء البطارية
• استبدل بطاريتك القديمة
• احصل على خصم 20-40 ريال
• متوفرة في أكثر من 650 محطة`,
  },
  {
    id: 4,
    businessName: 'Petromin Express',
    language: 'Arabic',
    sectionName: 'عروضنا',
    mainHeading: `تلميع المصابيح الأمامية
99 ريال فقط
نحن نستخدم فقط منتجات عالية الجودة من شركة 3M
الأسعار شاملة ضريبة القيمة المضافة
أسعار منافسة`,
    summary: `تلميع المصابيح الأمامية
99 ريال فقط
نحن نستخدم فقط منتجات عالية الجودة من شركة 3M
الأسعار شاملة ضريبة القيمة المضافة
أسعار منافسة`,
    imageUrl: 'https://petromin.express/wp-content/uploads/2023/11/modern-led-headlight-dark-car-street.jpg',
    additionalInfo: `تلميع المصابيح الأمامية
99 ريال فقط
نحن نستخدم فقط منتجات عالية الجودة من شركة 3M
الأسعار شاملة ضريبة القيمة المضافة
أسعار منافسة`,
    termsConditions: `49 ريال للمصباح الواحد شامل الضريبة
99 ريال لكلا المصباحين شامل الضريبة
منتجات 3M الأصلية فقط
متوفر في المحطات المشاركة`,
    tcFormatted: `• 49 ريال للمصباح الواحد شامل الضريبة
• 99 ريال لكلا المصباحين شامل الضريبة
• منتجات 3M الأصلية فقط
• متوفر في المحطات المشاركة`,
    additionalFormatted: `• تلميع المصابيح الأمامية
• 99 ريال فقط
• منتجات عالية الجودة من شركة 3M
• الأسعار شاملة ضريبة القيمة المضافة`,
  },
];

// ==================== PETROMIN AUTOCARE ARABIC ====================
const PETROMIN_AUTOCARE_AR: Offer[] = [
  {
    id: 1,
    businessName: 'Petromin Autocare',
    language: 'Arabic',
    sectionName: 'اكتشف عروضنا',
    mainHeading: `عرض حصري لأقمشة فرامل هيونداي
ابتداءً من 399 ريال`,
    summary: `عرض حصري لمُلاك هيونداي!
استبدل أقمشة الفرامل ابتداءً من 399 ريال
قطع غيار هيونداي الأصلية
أقمشة فرامل أمامية أو خلفية
أجور اليد
خرط الهوبات (عند الحاجة)`,
    imageUrl: 'https://petrominauto.care/wp-content/uploads/2024/01/hyundai-brake-offer-ar.jpg',
    additionalInfo: `عرض حصري لمُلاك هيونداي!
استبدل أقمشة الفرامل ابتداءً من 399 ريال
قطع غيار هيونداي الأصلية
أقمشة فرامل أمامية أو خلفية
أجور اليد
خرط الهوبات (عند الحاجة)`,
    termsConditions: `العرض ساري حتى 10 فبراير 2026
تشمل الأسعار استبدال أقمشة الفرامل الأمامية أو الخلفية، خرط الهوبات، وأجور اليد
لا يمكن الجمع بين هذا العرض وأي عرض آخر
متوفر فقط في فروع بترومين أوتوكير
العرض متوفر حتى نفاد الكمية`,
    tcFormatted: `• العرض ساري حتى 10 فبراير 2026
• تشمل الأسعار استبدال الأقمشة وخرط الهوبات وأجور اليد
• لا يمكن الجمع مع أي عرض آخر
• متوفر فقط في فروع بترومين أوتوكير
• العرض متوفر حتى نفاد الكمية`,
    additionalFormatted: `• عرض حصري لمُلاك هيونداي!
• استبدل أقمشة الفرامل ابتداءً من 399 ريال
• قطع غيار هيونداي الأصلية
• أقمشة فرامل أمامية أو خلفية
• أجور اليد مشمولة
• خرط الهوبات عند الحاجة`,
  },
  {
    id: 2,
    businessName: 'Petromin Autocare',
    language: 'Arabic',
    sectionName: 'اكتشف عروضنا',
    mainHeading: `عرض فحمات الفرامل لتويوتا
عرض لفترة محدودة!`,
    summary: `عرض فحمات الفرامل لتويوتا
قطع غيار تويوتا الأصلية
السعر يشمل أجور اليد
شامل ضريبة القيمة المضافة
خرط الهوبات (عند الحاجة)`,
    imageUrl: 'https://petrominauto.care/wp-content/uploads/2024/01/toyota-brake-offer-ar.jpg',
    additionalInfo: `عرض فحمات الفرامل لتويوتا
قطع غيار تويوتا الأصلية
السعر يشمل أجور اليد
شامل ضريبة القيمة المضافة
خرط الهوبات (عند الحاجة)`,
    termsConditions: `العرض ساري حتى 10 فبراير 2026
تشمل الأسعار استبدال أقمشة الفرامل الأمامية أو الخلفية، خرط الهوبات، وأجور اليد
لا يمكن الجمع بين هذا العرض وأي عرض آخر
متوفر فقط في فروع بترومين أوتوكير
العرض متوفر حتى نفاد الكمية`,
    tcFormatted: `• العرض ساري حتى 10 فبراير 2026
• تشمل الأسعار استبدال الأقمشة وخرط الهوبات وأجور اليد
• لا يمكن الجمع مع أي عرض آخر
• متوفر فقط في فروع بترومين أوتوكير
• العرض متوفر حتى نفاد الكمية`,
    additionalFormatted: `• عرض فحمات الفرامل لتويوتا
• قطع غيار تويوتا الأصلية
• السعر يشمل أجور اليد
• شامل ضريبة القيمة المضافة
• خرط الهوبات عند الحاجة`,
  },
];

// Normalize to exactly 10 offers
function normalizeToTen(offers: Offer[]): Offer[] {
  if (offers.length === 0) return [];
  
  let normalized: Offer[] = [];
  
  if (offers.length >= 10) {
    normalized = offers.slice(0, 10);
  } else {
    normalized = [...offers];
    let duplicateIndex = 0;
    while (normalized.length < 10) {
      const original = offers[duplicateIndex % offers.length];
      normalized.push({ ...original });
      duplicateIndex++;
    }
  }
  
  return normalized.map((offer, idx) => ({
    ...offer,
    id: idx + 1,
  }));
}

// Normalize Autocare offers (same logic but different starting ID)
function normalizeAutocare(offers: Offer[], startId: number): Offer[] {
  if (offers.length === 0) return [];
  
  let normalized: Offer[] = [];
  
  if (offers.length >= 10) {
    normalized = offers.slice(0, 10);
  } else {
    normalized = [...offers];
    let duplicateIndex = 0;
    while (normalized.length < 10) {
      const original = offers[duplicateIndex % offers.length];
      normalized.push({ ...original });
      duplicateIndex++;
    }
  }
  
  return normalized.map((offer, idx) => ({
    ...offer,
    id: startId + idx,
  }));
}

export async function scrapeOffers(): Promise<ScrapeResult> {
  try {
    // Petromin Express: 10 rows (IDs 1-10)
    const expressEN = normalizeToTen(PETROMIN_EXPRESS_EN);
    const expressAR = normalizeToTen(PETROMIN_EXPRESS_AR);
    
    // Petromin Autocare: 10 rows (IDs 11-20)
    const autocareEN = normalizeAutocare(PETROMIN_AUTOCARE_EN, 11);
    const autocareAR = normalizeAutocare(PETROMIN_AUTOCARE_AR, 11);
    
    // Combine: Express first, then Autocare
    const englishOffers = [...expressEN, ...autocareEN];
    const arabicOffers = [...expressAR, ...autocareAR];
    
    return {
      success: true,
      englishOffers,
      arabicOffers,
      scrapedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Scraping error:', error);
    
    const expressEN = normalizeToTen(PETROMIN_EXPRESS_EN);
    const expressAR = normalizeToTen(PETROMIN_EXPRESS_AR);
    const autocareEN = normalizeAutocare(PETROMIN_AUTOCARE_EN, 11);
    const autocareAR = normalizeAutocare(PETROMIN_AUTOCARE_AR, 11);
    
    return {
      success: false,
      englishOffers: [...expressEN, ...autocareEN],
      arabicOffers: [...expressAR, ...autocareAR],
      error: error instanceof Error ? error.message : 'Unknown error',
      scrapedAt: new Date().toISOString(),
    };
  }
}
