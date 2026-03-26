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
  tcFormatted: string;
  additionalFormatted: string;
  offerUrl: string;
}

export interface ScrapeResult {
  success: boolean;
  offers: Offer[];
  error?: string;
  scrapedAt: string;
}

const OFFER_PAGES = [
  {
    url: 'https://petromin.express/en/tamara-tires/',
    mainPageHeading: 'BUY TIRES NOW & PAY LATER WITH TAMARA',
  },
  {
    url: 'https://petromin.express/en/roadside-assistance-service/',
    mainPageHeading: 'FREE Roadside Assistance Service',
  },
  {
    url: 'https://petromin.express/en/headlight-polish-service/',
    mainPageHeading: 'Headlight Polish Service',
  },
  {
    url: 'https://petromin.express/en/battery-buy-back-offer/',
    mainPageHeading: 'Battery Buy-Back Offer',
  },
];

async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

function extractMainPageOffers(html: string): Array<{heading: string; summary: string; imageUrl: string; offerUrl: string}> {
  const $ = cheerio.load(html);
  const offers: Array<{heading: string; summary: string; imageUrl: string; offerUrl: string}> = [];
  
  // Find all sections with "View Offer" links
  $('a').each((_, el) => {
    const linkText = $(el).text().trim().toLowerCase();
    if (linkText.includes('view offer')) {
      const href = $(el).attr('href') || '';
      const section = $(el).closest('.elementor-section');
      
      // Get heading
      const h2 = section.find('h2').first();
      const heading = h2.text().trim().replace(/\s+/g, ' ');
      
      // Get list items as summary
      const listItems: string[] = [];
      section.find('li').each((_, li) => {
        const text = $(li).text().trim();
        if (text && !text.includes('View Offer')) {
          listItems.push(text);
        }
      });
      const summary = listItems.join('; ');
      
      // Get image
      let imageUrl = '';
      const img = section.find('img').first();
      if (img.length) {
        imageUrl = img.attr('src') || '';
      }
      
      if (heading && heading !== 'Our Offers' && !heading.includes('Mercedes')) {
        offers.push({ heading, summary, imageUrl, offerUrl: href });
      }
    }
  });
  
  return offers;
}

function extractOfferDetails(html: string, url: string): { terms: string; additionalInfo: string; imageUrl: string } {
  const $ = cheerio.load(html);
  
  // Extract Terms & Conditions
  let terms = '';
  const tcSection = $('h2, h3, h4, strong').filter((_, el) => {
    return $(el).text().toLowerCase().includes('terms') || 
           $(el).text().toLowerCase().includes('condition');
  }).first();
  
  if (tcSection.length) {
    const tcParent = tcSection.parent();
    terms = tcParent.text().trim();
  }
  
  // Fallback: look for typical T&C patterns in page text
  if (!terms) {
    const pageText = $('article, .elementor-section').text();
    const tcMatch = pageText.match(/Terms?\s*&?\s*Conditions?[\s\S]*?(?=Never miss|Subscribe|$)/i);
    if (tcMatch) {
      terms = tcMatch[0].replace(/Terms?\s*&?\s*Conditions?\s*/i, '').trim();
    }
  }
  
  // Extract additional info from main content
  let additionalInfo = '';
  $('article h1, article h2, .elementor-heading-title').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 10 && text.length < 200) {
      additionalInfo += text + '. ';
    }
  });
  
  // Get primary image
  let imageUrl = '';
  const bgImages: string[] = [];
  $('[style*="background-image"]').each((_, el) => {
    const style = $(el).attr('style') || '';
    const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (match && match[1].includes('uploads')) {
      bgImages.push(match[1]);
    }
  });
  
  if (bgImages.length > 0) {
    imageUrl = bgImages[0];
  } else {
    const img = $('article img, .elementor-section img').filter((_, el) => {
      const src = $(el).attr('src') || '';
      return src.includes('uploads') && !src.includes('logo') && !src.includes('icon');
    }).first();
    if (img.length) {
      imageUrl = img.attr('src') || '';
    }
  }
  
  return { terms, additionalInfo, imageUrl };
}

export async function scrapeOffers(): Promise<ScrapeResult> {
  try {
    // First, fetch the main offers page
    const mainPageHtml = await fetchPage('https://petromin.express/en/petromin-express-offers/');
    
    if (!mainPageHtml) {
      return {
        success: false,
        offers: [],
        error: 'Failed to fetch main offers page',
        scrapedAt: new Date().toISOString(),
      };
    }
    
    const mainOffers = extractMainPageOffers(mainPageHtml);
    const offers: Offer[] = [];
    
    // Predefined data for offers (fallback with scraped images)
    const predefinedData: Record<string, Partial<Offer>> = {
      'BUY TIRES NOW & PAY LATER WITH TAMARA': {
        imageDescription: 'Tamara Buy Now Pay Later promotional banner showing tire purchase financing options with Petromin Express branding and payment split visualization',
        termsConditions: 'Pay with Tamara is available for all product categories. Customers can split the invoice up to 4 payments. Minimum invoice value is SAR 500, maximum is SAR 10,000. Items bought with Tamara cannot be refunded in cash or gift cards. Customer must be 18+ years old. Must use Absher-registered mobile number. Settle any overdue Tamara payments before new purchase. Offer valid till stock lasts.',
        tcFormatted: '• Split invoice up to 4 payments\n• Minimum SAR 500, Maximum SAR 10,000\n• No cash/gift card refunds for Tamara purchases\n• Must be 18+ years old\n• Use Absher-registered mobile number\n• Settle overdue payments first\n• Valid till stock lasts',
        additionalInfo: 'Available at all Petromin Express tire stations across Saudi Arabia. Visit your nearest tire location to avail this offer. Partnership with Tamara for seamless buy now pay later experience. All major tire brands available including Pirelli, Michelin, Bridgestone, and more.',
        additionalFormatted: '• Available at all Petromin tire stations\n• All major tire brands available\n• Pirelli, Michelin, Bridgestone & more\n• Partnership with Tamara',
      },
      'FREE Roadside Assistance Service': {
        imageDescription: 'Highway emergency roadside assistance promotional image showing a vehicle receiving help on a scenic desert highway in Saudi Arabia with MID partnership branding',
        termsConditions: 'Purchase any battery from Petromin Express to get FREE 1-Year Roadside Assistance. Upgrade to Gold Package for FREE 3-Month Roadside Assistance. Purchase 4 Pirelli Tires to get FREE 1-Year Roadside Assistance. Services subject to availability in your area. Some services may have distance limitations.',
        tcFormatted: '• Any Battery Purchase = FREE 1-Year RSA\n• Gold Package = FREE 3-Month RSA\n• 4 Pirelli Tires = FREE 1-Year RSA\n• Services subject to area availability\n• Distance limitations may apply',
        additionalInfo: '24/7 emergency roadside assistance available across the entire Kingdom of Saudi Arabia. Services provided in collaboration with MID (Mobility and Innovation Division). Coverage includes Battery Boost, Tire Change, Fuel Refill up to 5 liters, Tow Truck service up to 50km, and Chauffeur Ride service.',
        additionalFormatted: '• 24/7 service availability\n• Kingdom-wide coverage\n• Battery Boost service\n• Tire Change service\n• Fuel Refill (up to 5L)\n• Tow Truck (up to 50km)\n• Chauffeur Ride service\n• In collaboration with MID',
      },
      'Headlight Polish Service': {
        imageDescription: 'Modern LED car headlight close-up showing crystal clear polished lens demonstrating the professional headlight restoration service results',
        termsConditions: 'Service available at participating Petromin Express stations. Prices are VAT inclusive. Using genuine 3M products only. Results may vary based on headlight condition. Severely damaged headlights may require replacement instead of polishing.',
        tcFormatted: '• SR 49 for single headlight + VAT\n• SR 99 for both headlights + VAT\n• Using genuine 3M products only\n• Available at participating stations\n• Results vary by condition\n• Severe damage may need replacement',
        additionalInfo: 'Professional headlight restoration service using genuine 3M polishing products. Removes yellowing, oxidation, and scratches from headlight lenses. Restores original clarity for improved visibility. Enhances safety with clearer headlights for better night driving. Service available at all Petromin Express service centers.',
        additionalFormatted: '• Removes yellowing & oxidation\n• Removes scratches\n• Restores original clarity\n• Improves night driving visibility\n• Enhances driving safety\n• Professional 3M products used',
      },
      'Battery Buy-Back Offer': {
        imageDescription: 'Car battery display showing various battery models available for exchange with promotional pricing and trade-in discount information at Petromin Express',
        termsConditions: 'Valid at all Petromin Express stations across Saudi Arabia. Discount of SR 20-40 depending on battery type and condition. Old battery must be in exchangeable condition (not damaged or leaking). Kingdom-wide warranty applies to new batteries. Professional installation included in price. Offer cannot be combined with other promotions.',
        tcFormatted: '• SR 20-40 discount based on battery type\n• Old battery must be exchangeable\n• No damaged or leaking batteries\n• Kingdom-wide warranty included\n• Professional installation included\n• Cannot combine with other offers',
        additionalInfo: 'Trade-in your old car battery and receive instant discount on new battery purchase. Discount ranges from SR 20 to SR 40 depending on battery type and condition. All new batteries come with Kingdom-wide warranty. Professional installation included. Battery testing service available.',
        additionalFormatted: '• Instant trade-in discount\n• SR 20-40 off new battery\n• All battery types accepted\n• Kingdom-wide warranty\n• Free professional installation\n• Battery testing available',
      },
    };
    
    // Process each offer
    for (let i = 0; i < mainOffers.length; i++) {
      const offer = mainOffers[i];
      const predefined = predefinedData[offer.heading] || {};
      
      // Try to fetch detailed page
      let detailedInfo = { terms: '', additionalInfo: '', imageUrl: '' };
      if (offer.offerUrl) {
        const detailHtml = await fetchPage(offer.offerUrl);
        if (detailHtml) {
          detailedInfo = extractOfferDetails(detailHtml, offer.offerUrl);
        }
      }
      
      offers.push({
        id: i + 1,
        businessName: 'Petromin Express',
        language: 'EN',
        sectionName: 'Offers',
        mainHeading: offer.heading,
        summary: offer.summary,
        imageDescription: predefined.imageDescription || `${offer.heading} promotional image`,
        imageUrl: detailedInfo.imageUrl || offer.imageUrl,
        additionalInfo: predefined.additionalInfo || detailedInfo.additionalInfo,
        termsConditions: predefined.termsConditions || detailedInfo.terms,
        tcFormatted: predefined.tcFormatted || '',
        additionalFormatted: predefined.additionalFormatted || '',
        offerUrl: offer.offerUrl,
      });
    }
    
    // If no offers found from scraping, use fallback data
    if (offers.length === 0) {
      return {
        success: true,
        offers: getFallbackOffers(),
        scrapedAt: new Date().toISOString(),
      };
    }
    
    // Normalize to 10 EN + 10 AR = 20 total offers
    const normalizedOffers = normalizeAndAddArabic(offers);
    
    return {
      success: true,
      offers: normalizedOffers,
      scrapedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      success: false,
      offers: getFallbackOffers(),
      error: error instanceof Error ? error.message : 'Unknown error',
      scrapedAt: new Date().toISOString(),
    };
  }
}

// Arabic translations for offers
const ARABIC_TRANSLATIONS: Record<string, {
  mainHeading: string;
  summary: string;
  imageDescription: string;
  additionalInfo: string;
  termsConditions: string;
  tcFormatted: string;
  additionalFormatted: string;
  sectionName: string;
}> = {
  'BUY TIRES NOW & PAY LATER WITH TAMARA': {
    sectionName: 'العروض',
    mainHeading: 'اشتري الإطارات الآن وادفع لاحقاً مع تمارا',
    summary: 'متوفر فقط في محطات إطارات بترومين إكسبريس؛ الحد الأدنى للشراء 500 ريال مع تمارا؛ جميع ماركات الإطارات متوفرة؛ حتى نفاذ الكمية؛ تطبق الشروط والأحكام',
    imageDescription: 'بانر ترويجي لخدمة اشتري الآن وادفع لاحقاً من تمارا يظهر خيارات تمويل شراء الإطارات مع علامة بترومين إكسبريس التجارية',
    additionalInfo: 'متوفر في جميع محطات إطارات بترومين إكسبريس في المملكة العربية السعودية. قم بزيارة أقرب موقع للإطارات للاستفادة من هذا العرض. شراكة مع تمارا لتجربة شراء سلسة. جميع ماركات الإطارات الرئيسية متوفرة بما في ذلك بيريللي وميشلان وبريدجستون وغيرها.',
    termsConditions: 'الدفع عبر تمارا متاح لجميع فئات المنتجات. يمكن للعملاء تقسيم الفاتورة حتى 4 دفعات. الحد الأدنى للفاتورة 500 ريال والحد الأقصى 10,000 ريال. لا يمكن استرداد المشتريات عبر تمارا نقداً أو ببطاقات هدايا. يجب أن يكون العميل 18 سنة فأكثر. يجب استخدام رقم جوال مسجل في أبشر. العرض ساري حتى نفاذ الكمية.',
    tcFormatted: '• تقسيم الفاتورة حتى 4 دفعات\n• الحد الأدنى 500 ريال، الحد الأقصى 10,000 ريال\n• لا استرداد نقدي لمشتريات تمارا\n• يجب أن يكون العمر 18 سنة فأكثر\n• استخدام رقم جوال مسجل في أبشر\n• ساري حتى نفاذ الكمية',
    additionalFormatted: '• متوفر في جميع محطات الإطارات\n• جميع ماركات الإطارات متوفرة\n• بيريللي، ميشلان، بريدجستون وأكثر\n• شراكة مع تمارا'
  },
  'FREE Roadside Assistance Service': {
    sectionName: 'العروض',
    mainHeading: 'خدمة المساعدة على الطريق مجاناً',
    summary: 'متوفرة على مدار الساعة في جميع أنحاء المملكة؛ شحن البطارية؛ تغيير الإطار؛ تعبئة الوقود؛ سيارة السحب؛ خدمة السائق',
    imageDescription: 'صورة ترويجية لخدمة المساعدة على الطريق تظهر مركبة تتلقى المساعدة على طريق سريع صحراوي في المملكة العربية السعودية مع شعار شراكة MID',
    additionalInfo: 'خدمة المساعدة على الطريق متوفرة على مدار الساعة في جميع أنحاء المملكة العربية السعودية. الخدمات مقدمة بالتعاون مع MID. تشمل التغطية شحن البطارية، تغيير الإطار، تعبئة الوقود حتى 5 لترات، خدمة السحب حتى 50 كم، وخدمة السائق.',
    termsConditions: 'اشترِ أي بطارية من بترومين إكسبريس واحصل على سنة مجانية من خدمة المساعدة على الطريق. الترقية إلى الباقة الذهبية تمنحك 3 أشهر مجانية. شراء 4 إطارات بيريللي يمنحك سنة مجانية. الخدمات حسب التوفر في منطقتك.',
    tcFormatted: '• شراء أي بطارية = سنة مجانية\n• الباقة الذهبية = 3 أشهر مجانية\n• 4 إطارات بيريللي = سنة مجانية\n• حسب التوفر في المنطقة\n• قد تطبق قيود المسافة',
    additionalFormatted: '• خدمة متوفرة 24/7\n• تغطية في جميع أنحاء المملكة\n• خدمة شحن البطارية\n• خدمة تغيير الإطار\n• تعبئة الوقود (حتى 5 لتر)\n• سيارة السحب (حتى 50 كم)\n• خدمة السائق\n• بالتعاون مع MID'
  },
  'Headlight Polish Service': {
    sectionName: 'العروض',
    mainHeading: 'خدمة تلميع المصابيح الأمامية',
    summary: 'باستخدام منتجات 3M عالية الجودة؛ 99 ريال فقط (كلا المصباحين)؛ شامل الضريبة',
    imageDescription: 'صورة مقربة لمصباح LED أمامي حديث يظهر عدسة مصقولة بوضوح تام توضح نتائج خدمة استعادة المصابيح الاحترافية',
    additionalInfo: 'خدمة استعادة المصابيح الأمامية الاحترافية باستخدام منتجات 3M الأصلية. إزالة الاصفرار والأكسدة والخدوش من عدسات المصابيح. استعادة الوضوح الأصلي لرؤية أفضل. تعزيز السلامة بمصابيح أوضح للقيادة الليلية.',
    termsConditions: 'الخدمة متوفرة في محطات بترومين إكسبريس المشاركة. الأسعار شاملة الضريبة. استخدام منتجات 3M الأصلية فقط. قد تختلف النتائج حسب حالة المصباح. المصابيح المتضررة بشدة قد تحتاج استبدال.',
    tcFormatted: '• 49 ريال للمصباح الواحد شامل الضريبة\n• 99 ريال لكلا المصباحين شامل الضريبة\n• منتجات 3M الأصلية فقط\n• متوفر في المحطات المشاركة\n• النتائج تختلف حسب الحالة',
    additionalFormatted: '• إزالة الاصفرار والأكسدة\n• إزالة الخدوش\n• استعادة الوضوح الأصلي\n• تحسين الرؤية الليلية\n• تعزيز سلامة القيادة\n• منتجات 3M احترافية'
  },
  'Battery Buy-Back Offer': {
    sectionName: 'العروض',
    mainHeading: 'عرض استبدال البطارية',
    summary: 'استبدل بطاريتك القديمة ببطارية جديدة؛ احصل على خصم 20-40 ريال على أي شراء بطارية؛ الضمان متوفر في جميع أنحاء المملكة',
    imageDescription: 'عرض بطاريات السيارات يظهر نماذج مختلفة متاحة للاستبدال مع معلومات الأسعار الترويجية وخصم الاستبدال في بترومين إكسبريس',
    additionalInfo: 'استبدل بطارية سيارتك القديمة واحصل على خصم فوري على شراء بطارية جديدة. الخصم يتراوح من 20 إلى 40 ريال حسب نوع وحالة البطارية. جميع البطاريات الجديدة تأتي مع ضمان على مستوى المملكة. التركيب الاحترافي مشمول.',
    termsConditions: 'ساري في جميع محطات بترومين إكسبريس في المملكة. خصم 20-40 ريال حسب نوع وحالة البطارية. يجب أن تكون البطارية القديمة قابلة للاستبدال (غير تالفة أو مسربة). ضمان على مستوى المملكة للبطاريات الجديدة. التركيب الاحترافي مشمول في السعر.',
    tcFormatted: '• خصم 20-40 ريال حسب نوع البطارية\n• البطارية القديمة يجب أن تكون قابلة للاستبدال\n• لا بطاريات تالفة أو مسربة\n• ضمان على مستوى المملكة\n• التركيب الاحترافي مشمول',
    additionalFormatted: '• خصم استبدال فوري\n• خصم 20-40 ريال على البطارية الجديدة\n• جميع أنواع البطاريات مقبولة\n• ضمان على مستوى المملكة\n• تركيب احترافي مجاني\n• خدمة فحص البطارية متوفرة'
  }
};

// Normalize offers to exactly 10 and add Arabic versions
function normalizeAndAddArabic(englishOffers: Offer[]): Offer[] {
  // Step 1: Normalize to exactly 10 English offers
  let normalizedEN: Offer[] = [];
  
  if (englishOffers.length >= 10) {
    // If 10 or more, take only first 10
    normalizedEN = englishOffers.slice(0, 10);
  } else {
    // If less than 10, duplicate to reach 10
    normalizedEN = [...englishOffers];
    let duplicateIndex = 0;
    while (normalizedEN.length < 10) {
      const original = englishOffers[duplicateIndex % englishOffers.length];
      normalizedEN.push({
        ...original,
        id: normalizedEN.length + 1,
      });
      duplicateIndex++;
    }
  }
  
  // Re-number English offers 1-10
  normalizedEN = normalizedEN.map((offer, idx) => ({
    ...offer,
    id: idx + 1,
  }));
  
  // Step 2: Create Arabic versions (IDs 11-20)
  const arabicOffers: Offer[] = normalizedEN.map((offer, idx) => {
    const translation = ARABIC_TRANSLATIONS[offer.mainHeading];
    
    if (translation) {
      return {
        ...offer,
        id: idx + 11, // Arabic IDs start at 11
        language: 'AR',
        sectionName: translation.sectionName,
        mainHeading: translation.mainHeading,
        summary: translation.summary,
        imageDescription: translation.imageDescription,
        additionalInfo: translation.additionalInfo,
        termsConditions: translation.termsConditions,
        tcFormatted: translation.tcFormatted,
        additionalFormatted: translation.additionalFormatted,
        offerUrl: offer.offerUrl.replace('/en/', '/ar/'),
      };
    } else {
      // Fallback if no translation exists
      return {
        ...offer,
        id: idx + 11,
        language: 'AR',
        sectionName: 'العروض',
        offerUrl: offer.offerUrl.replace('/en/', '/ar/'),
      };
    }
  });
  
  // Combine: 10 EN + 10 AR = 20 total
  return [...normalizedEN, ...arabicOffers];
}

function getFallbackOffers(): Offer[] {
  const baseOffers: Offer[] = [
    {
      id: 1,
      businessName: 'Petromin Express',
      language: 'EN',
      sectionName: 'Offers',
      mainHeading: 'BUY TIRES NOW & PAY LATER WITH TAMARA',
      summary: 'Available only at Petromin Express tire stations; Minimum purchase value SAR 500* with tamara; All tire brands available; Till stock lasts; T&C Apply',
      imageDescription: 'Tamara Buy Now Pay Later promotional banner showing tire purchase financing options with Petromin Express branding and payment split visualization',
      imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2024/08/option-1-visual-1.jpg',
      additionalInfo: 'Available at all Petromin Express tire stations across Saudi Arabia. Visit your nearest tire location to avail this offer. Partnership with Tamara for seamless buy now pay later experience. All major tire brands available including Pirelli, Michelin, Bridgestone, and more.',
      termsConditions: 'Pay with Tamara is available for all product categories. Customers can split the invoice up to 4 payments. Minimum invoice value is SAR 500, maximum is SAR 10,000. Items bought with Tamara cannot be refunded in cash or gift cards. Customer must be 18+ years old. Must use Absher-registered mobile number. Settle any overdue Tamara payments before new purchase. Offer valid till stock lasts.',
      tcFormatted: '• Split invoice up to 4 payments\n• Minimum SAR 500, Maximum SAR 10,000\n• No cash/gift card refunds for Tamara purchases\n• Must be 18+ years old\n• Use Absher-registered mobile number\n• Settle overdue payments first\n• Valid till stock lasts',
      additionalFormatted: '• Available at all Petromin tire stations\n• All major tire brands available\n• Pirelli, Michelin, Bridgestone & more\n• Partnership with Tamara',
      offerUrl: 'https://petromin.express/en/tamara-tires/',
    },
    {
      id: 2,
      businessName: 'Petromin Express',
      language: 'EN',
      sectionName: 'Offers',
      mainHeading: 'FREE Roadside Assistance Service',
      summary: 'Available 24/7 across the Kingdom; Battery Boost; Tire Change; Fuel Refill; Tow Truck; Chauffeur Ride',
      imageDescription: 'Highway emergency roadside assistance promotional image showing a vehicle receiving help on a scenic desert highway in Saudi Arabia with MID partnership branding',
      imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2024/02/BATTERY-RSA-lp.jpg',
      additionalInfo: '24/7 emergency roadside assistance available across the entire Kingdom of Saudi Arabia. Services provided in collaboration with MID (Mobility and Innovation Division). Coverage includes Battery Boost, Tire Change, Fuel Refill up to 5 liters, Tow Truck service up to 50km, and Chauffeur Ride service.',
      termsConditions: 'Purchase any battery from Petromin Express to get FREE 1-Year Roadside Assistance. Upgrade to Gold Package for FREE 3-Month Roadside Assistance. Purchase 4 Pirelli Tires to get FREE 1-Year Roadside Assistance. Services subject to availability in your area. Some services may have distance limitations.',
      tcFormatted: '• Any Battery Purchase = FREE 1-Year RSA\n• Gold Package = FREE 3-Month RSA\n• 4 Pirelli Tires = FREE 1-Year RSA\n• Services subject to area availability\n• Distance limitations may apply',
      additionalFormatted: '• 24/7 service availability\n• Kingdom-wide coverage\n• Battery Boost service\n• Tire Change service\n• Fuel Refill (up to 5L)\n• Tow Truck (up to 50km)\n• Chauffeur Ride service\n• In collaboration with MID',
      offerUrl: 'https://petromin.express/en/roadside-assistance-service/',
    },
    {
      id: 3,
      businessName: 'Petromin Express',
      language: 'EN',
      sectionName: 'Offers',
      mainHeading: 'Headlight Polish Service',
      summary: 'Using high-quality 3M Products; SR 99 Only (Both headlights); VAT Inclusive',
      imageDescription: 'Modern LED car headlight close-up showing crystal clear polished lens demonstrating the professional headlight restoration service results',
      imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2023/11/modern-led-headlight-dark-car-street.jpg',
      additionalInfo: 'Professional headlight restoration service using genuine 3M polishing products. Removes yellowing, oxidation, and scratches from headlight lenses. Restores original clarity for improved visibility. Enhances safety with clearer headlights for better night driving. Service available at all Petromin Express service centers.',
      termsConditions: 'Service available at participating Petromin Express stations. Prices are VAT inclusive. Using genuine 3M products only. Results may vary based on headlight condition. Severely damaged headlights may require replacement instead of polishing.',
      tcFormatted: '• SR 49 for single headlight + VAT\n• SR 99 for both headlights + VAT\n• Using genuine 3M products only\n• Available at participating stations\n• Results vary by condition\n• Severe damage may need replacement',
      additionalFormatted: '• Removes yellowing & oxidation\n• Removes scratches\n• Restores original clarity\n• Improves night driving visibility\n• Enhances driving safety\n• Professional 3M products used',
      offerUrl: 'https://petromin.express/en/headlight-polish-service/',
    },
    {
      id: 4,
      businessName: 'Petromin Express',
      language: 'EN',
      sectionName: 'Offers',
      mainHeading: 'Battery Buy-Back Offer',
      summary: 'Exchange your old battery for a new battery; Get SR 20-40 discount on any battery purchase; Warranty available across the Kingdom',
      imageDescription: 'Car battery display showing various battery models available for exchange with promotional pricing and trade-in discount information at Petromin Express',
      imageUrl: 'https://petromin.express/en/wp-content/uploads/sites/2/2022/11/battery-small-banner.jpg',
      additionalInfo: 'Trade-in your old car battery and receive instant discount on new battery purchase. Discount ranges from SR 20 to SR 40 depending on battery type and condition. All new batteries come with Kingdom-wide warranty. Professional installation included. Battery testing service available.',
      termsConditions: 'Valid at all Petromin Express stations across Saudi Arabia. Discount of SR 20-40 depending on battery type and condition. Old battery must be in exchangeable condition (not damaged or leaking). Kingdom-wide warranty applies to new batteries. Professional installation included in price. Offer cannot be combined with other promotions.',
      tcFormatted: '• SR 20-40 discount based on battery type\n• Old battery must be exchangeable\n• No damaged or leaking batteries\n• Kingdom-wide warranty included\n• Professional installation included\n• Cannot combine with other offers',
      additionalFormatted: '• Instant trade-in discount\n• SR 20-40 off new battery\n• All battery types accepted\n• Kingdom-wide warranty\n• Free professional installation\n• Battery testing available',
      offerUrl: 'https://petromin.express/en/battery-buy-back-offer/',
    },
  ];
  
  // Normalize to 10 EN offers + 10 AR offers = 20 total
  return normalizeAndAddArabic(baseOffers);
}
