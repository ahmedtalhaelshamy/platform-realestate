'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react'; 
import { urlFor } from '@/sanity/client'; 
import { CONTACT_INFO } from '@/components/constants/contact'; 
import AutoProjectCarousel from '../AutoProjectsCarousel'; 
import Breadcrumbs from '../Breadcrumbs'; 
import ProjectGallery from '../ProjectGallery'; 
import InstallmentCalculator from '@/components/InstallmentCalculator'; 

import { 
  Phone, MessageCircle, MapPin, Calendar, Building2, ShoppingBag, Waves,
  Star, Percent, CreditCard, PaintBucket, Clock, ShieldCheck, CarFront, Trees, Gamepad2, Armchair, 
  Dumbbell, Coffee, Lock, User, ChevronDown, HelpCircle, ThumbsUp, ThumbsDown, CheckCircle, 
  Activity, ArrowUpFromLine, Fan, Wifi, Mic, Syringe, Pill, Tv, Utensils, Palmtree, Anchor, Maximize,
  Calculator, Share2, Copy, Check, ArrowRight 
} from 'lucide-react';

// --- 1. CONFIGURATION ---
const AMENITIES_CONFIG = {
  security: { icon: ShieldCheck, ar: 'أمن وحراسة', en: 'Security' },
  parking: { icon: CarFront, ar: 'جراج خاص', en: 'Parking' },
  pools: { icon: Waves, ar: 'حمامات سباحة', en: 'Swimming Pools' },
  greenery: { icon: Trees, ar: 'لاند سكيب', en: 'Landscape' },
  kids_area: { icon: Gamepad2, ar: 'منطقة أطفال', en: 'Kids Area' },
  clubhouse: { icon: Armchair, ar: 'كلوب هاوس', en: 'Clubhouse' },
  mosque: { icon: Star, ar: 'مسجد', en: 'Mosque' },
  bbq: { icon: Coffee, ar: 'منطقة شواء', en: 'BBQ Area' },
  track: { icon: Activity, ar: 'تراك جري', en: 'Jogging Track' },
  cycling: { icon: Activity, ar: 'تراك عجل', en: 'Cycling Track' },
  smart_gates: { icon: Lock, ar: 'بوابات ذكية', en: 'Smart Gates' },
  smart_home: { icon: Wifi, ar: 'سمارت هوم', en: 'Smart Home' },
  lagoons: { icon: Waves, ar: 'لاجون', en: 'Lagoons' },
  commercial: { icon: ShoppingBag, ar: 'منطقة تجارية', en: 'Commercial Area' },
  elevators: { icon: ArrowUpFromLine, ar: 'مصاعد', en: 'Elevators' },
  escalators: { icon: ArrowUpFromLine, ar: 'سلالم متحركة', en: 'Escalators' },
  food_court: { icon: Utensils, ar: 'منطقة مطاعم', en: 'Food Court' },
  hypermarket: { icon: ShoppingBag, ar: 'هايبر ماركت', en: 'Hypermarket' },
  central_ac: { icon: Fan, ar: 'تكييف مركزي', en: 'Central AC' },
  internet: { icon: Wifi, ar: 'إنترنت فائق السرعة', en: 'High Speed Internet' },
  meeting_rooms: { icon: Mic, ar: 'قاعات اجتماعات', en: 'Meeting Rooms' },
  reception: { icon: User, ar: 'استقبال', en: 'Reception' },
  fire_system: { icon: ShieldCheck, ar: 'نظام حريق', en: 'Fire System' },
  lab: { icon: Syringe, ar: 'معمل تحاليل', en: 'Laboratory' },
  pharmacy: { icon: Pill, ar: 'صيدلية', en: 'Pharmacy' },
  waiting_area: { icon: Armchair, ar: 'منطقة انتظار', en: 'Waiting Area' },
  cleaning: { icon: Star, ar: 'خدمة تنظيف', en: 'Cleaning' },
  spa: { icon: Star, ar: 'سبا وجاكوزي', en: 'Spa & Jacuzzi' },
  gym: { icon: Dumbbell, ar: 'جيم رياضي', en: 'Gym' },
  cinema: { icon: Tv, ar: 'سينما', en: 'Cinema' },
  hotel_service: { icon: User, ar: 'خدمة فندقية', en: 'Hotel Service' },
  concierge: { icon: User, ar: 'كونسيرج', en: 'Concierge' },
  beach: { icon: Palmtree, ar: 'شاطئ خاص', en: 'Private Beach' },
  aquapark: { icon: Anchor, ar: 'أكوا بارك', en: 'Aqua Park' },
  default: { icon: CheckCircle, ar: 'مرفق مميز', en: 'Amenity' }
};

// --- 2. HELPERS ---
const formatNum = (n) => n ? Math.round(n).toLocaleString('en-US') : '---';

const getYoutubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
};

// ✅ الحارس الذكي: تحويل أي PortableText لنص صافي لمنع خطأ الـ Object Child
const toPlainText = (blocks = []) => {
  if (!blocks || !Array.isArray(blocks)) return typeof blocks === 'string' ? blocks : '';
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) return '';
      return block.children.map(child => child.text).join('');
    })
    .join(' ');
};

const getSafeText = (val) => {
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return toPlainText(val);
  return "";
};

const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <div className="relative w-full h-64 md:h-[500px] my-10 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 group">
          <Image src={urlFor(value).width(1200).quality(90).url()} alt="Project Content" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          {value.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-black/50 backdrop-blur-sm text-white p-3 text-center text-xs font-bold">{value.caption}</div>
          )}
        </div>
      );
    },
    undefined: () => null,
  },
  block: {
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-12 mb-6 border-s-4 border-[#C02026] ps-4 italic uppercase tracking-tighter leading-none">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">{children}</h3>,
    normal: ({ children }) => (!children || children[0] === '') ? <br /> : <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed text-justify font-medium">{children}</p>,
  },
};

// --- 3. SUB-COMPONENTS ---
const CTABox = ({ isAr, inquiries, whatsappLink, handleShare, copied }) => (
  <div className="bg-white border border-gray-100 p-5 rounded-2xl sticky top-28 shadow-lg h-fit z-30 transition-shadow duration-300 hover:shadow-xl w-full mx-auto">
      <div className="text-center mb-4">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{isAr ? 'مهتم بالمشروع؟' : 'Interested?'}</p>
          <h3 className="text-lg font-black text-slate-900">{isAr ? 'احجز وحدتك الآن' : 'Book Your Unit'}</h3>
      </div>
      <div className="space-y-2.5">
          <a href={`tel:${CONTACT_INFO.phone}`} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#C02026] transition-all group shadow-sm text-xs md:text-sm border border-slate-800">
              <Phone size={16} /> {isAr ? 'اتصال مباشر' : 'Call Now'}
          </a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#128c7e] transition-all shadow-sm text-xs md:text-sm">
              <MessageCircle size={18} /> {isAr ? 'واتساب' : 'WhatsApp'}
          </a>
          <button onClick={handleShare} className="w-full bg-slate-50 text-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-sm text-xs md:text-sm border border-slate-200">
              {copied ? <Check size={16} className="text-green-600"/> : <Share2 size={16} />} {copied ? (isAr ? 'تم النسخ' : 'Copied!') : (isAr ? 'مشاركة المشروع' : 'Share Project')}
          </button>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 rounded-lg py-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
          {inquiries} {isAr ? 'شخص يشاهدون الآن' : 'people viewing now'}
      </div>
  </div>
);

const ContentSection = ({ title, image, content, children, altBg = false, id }) => {
  const safeTitle = getSafeText(title);
  if (!safeTitle && !content && !image && !children) return null;

  return (
    <section id={id} className={`py-12 md:py-16 ${altBg ? 'bg-slate-50' : 'bg-white'} rounded-[2.5rem] my-4 overflow-hidden`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {safeTitle && <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 border-s-8 border-[#C02026] ps-6 italic uppercase tracking-tighter leading-none">{safeTitle}</h2>}
        <div className="space-y-6 mb-8 max-w-5xl">
            {content && Array.isArray(content) && (
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed">
                <PortableText value={content} components={ptComponents} onMissingComponent={false} />
              </div>
            )}
            {children}
        </div>
        {image && image.asset && (
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 group mt-10">
                <Image src={urlFor(image).width(1400).url()} alt={safeTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
        )}
      </div>
    </section>
  );
};

// --- 4. MAIN COMPONENT ---
export default function ProjectClientUI({ data, lang, isAr, breadcrumbItems, similarProjects = [] }) {
  const [inquiries, setInquiries] = useState(0);
  const [copied, setCopied] = useState(false); 
  
  useEffect(() => { 
    setInquiries(15 + Math.floor(Math.random() * 10));
  }, []);

  if (!data) return null;

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = getSafeText(isAr ? data.titleAr : data.titleEn);
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ✅ دالة الحماية للنصوص: تضمن تحويل أي كائن PortableText لنص عادي فوراً
  const txt = (ar, en) => {
    const res = isAr ? ar : en;
    return getSafeText(res); 
  };

  const officialName = isAr ? getSafeText(data.titleAr) : getSafeText(data.titleEn);
  const h1Title = typeof data.computedH1 === 'string' ? data.computedH1 : officialName; 
  const whatsappLink = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(isAr ? `استفسار عن: ${officialName}` : `Inquiry about: ${officialName}`)}`;
  const videoId = getYoutubeId(data.videoUrl);

  return (
    <main className="font-sans text-slate-900 bg-white selection:bg-red-50" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[75vh] w-full bg-slate-900 overflow-hidden group">
        {data.mainImage && (
          <Image src={urlFor(data.mainImage).width(1920).quality(100).url()} alt={h1Title} fill className="object-cover opacity-60 scale-105 animate-slow-zoom" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        <button onClick={handleShare} className={`absolute top-28 ${isAr ? 'left-4 md:left-8' : 'right-4 md:right-8'} z-20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all duration-300 hover:scale-110 shadow-2xl ${copied ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-[#C02026]'}`}>
            {copied ? <Check size={20}/> : <Share2 size={20} />}
        </button>

        <div className="absolute inset-0 flex flex-col justify-end pb-20 px-4 md:px-8">
          <div className="max-w-[1440px] mx-auto w-full">
            <div className="text-white/90 mb-6 hidden md:block"><Breadcrumbs items={breadcrumbItems} lang={lang} /></div>
            <div className="flex flex-wrap gap-2 mb-6">
                {data.isNewLaunch && <span className="bg-[#C02026] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl"><Star size={12} fill="white"/> {isAr ? 'إطلاق حديث' : 'New Launch'}</span>}
                {data.isReadyToMove && <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl"><CheckCircle size={12}/> {isAr ? 'جاهز للاستلام' : 'Ready'}</span>}
            </div>
            <div className="relative z-10 space-y-2">
                <span className="block text-[#C02026] text-xl md:text-2xl font-black uppercase tracking-[0.3em] italic leading-none">{officialName}</span>
                <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl max-w-5xl mb-6 italic uppercase">{h1Title}</h1>
            </div>
            <div className="flex items-center gap-3 text-xl text-slate-200 font-bold relative z-10 bg-white/5 w-fit px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                <MapPin className="text-[#C02026] w-6 h-6" /> {txt(data.districtData?.nameAr, data.districtData?.nameEn)}
            </div>
          </div>
        </div>
      </section>

      {/* 2. dynamic STATS BAR (تم حل مشكلة التشطيب والاستلام هنا عبر فحص المسميات البديلة) */}
      <section className="relative z-20 -mt-12 max-w-[1300px] mx-auto px-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 grid grid-cols-2 lg:grid-cols-6 p-8 gap-y-8 lg:divide-x rtl:divide-x-reverse divide-slate-100">
              {[
                { l: isAr?'المساحات من':'Areas From', v: data.minArea ? `${data.minArea} m²` : '-', i: Maximize }, 
                { l: isAr?'المقدم':'Down Payment', v: data.downPayment ? `${data.downPayment}%` : '-', i: Percent },
                { l: isAr?'التقسيط':'Installments', v: data.installments ? `${data.installments} ${isAr?'سنوات':'Yrs'}` : '-', i: CreditCard },
                
                // ✅ التشطيب: محاولة جلب الحقل بأكثر من مسمى محتمل من سانتي
                { l: isAr?'التشطيب':'Finishing', v: txt(data.finishingTypeAr || data.finishingType, data.finishingTypeEn || data.finishingType) || '-', i: PaintBucket },
                
                // ✅ الاستلام: محاولة جلب الحقل بأكثر من مسمى محتمل من سانتي
                { l: isAr?'الاستلام':'Delivery', v: txt(data.deliveryDateAr || data.deliveryDate, data.deliveryDateEn || data.deliveryDate) || '-', i: Calendar },
                
                { l: isAr?'سعر يبدأ من':'Prices From', v: data.price ? `${formatNum(data.price)} EGP` : (isAr?'اتصل بنا':'Call'), i: Star, c: 'text-[#C02026]' }
              ].map((x, i) => (
                <div key={i} className="text-center px-4 group">
                    <div className="flex justify-center mb-2 text-slate-300 group-hover:text-[#C02026] transition-colors"><x.i size={22}/></div>
                    <div className="text-[10px] text-slate-400 font-black uppercase mb-1.5 tracking-widest leading-none">{x.l}</div>
                    <div className={`text-base md:text-xl font-black tracking-tighter ${x.c || 'text-slate-900'}`}>{x.v}</div>
                </div>
              ))}
          </div>
      </section>

      {/* 3. GALLERY SECTION */}
      {data.gallery?.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 mt-24 mb-12">
            <div className="mb-10"><h2 className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">{isAr ? 'معرض الصور' : 'Visual Gallery'}</h2></div>
            <ProjectGallery images={data.gallery} />
        </section>
      )}

      {/* 4. MAIN CONTENT (الترتيب الصارم المطلوب) */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pb-40 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-9 space-y-6">
            
            {/* أ. المقدمة */}
            <ContentSection id="intro" title={txt(data.introTitleAr, data.introTitleEn) || (isAr ? 'نبذة عن المشروع' : 'Introduction')} content={isAr ? data.introContentAr : data.introContentEn} />
            
            {/* ب. الموقع */}
            <ContentSection id="location" title={txt(data.locationTitleAr, data.locationTitleEn) || (isAr ? 'الموقع الاستراتيجي' : 'Location')} image={data.locationImage} content={isAr ? data.locationContentAr : data.locationContentEn} altBg>
                {data.nearbyPlaces?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                        {data.nearbyPlaces.map((place, i) => (
                            <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 flex justify-between items-center shadow-sm">
                                <span className="font-black text-slate-800 italic uppercase">{txt(place.placeAr, place.placeEn)}</span>
                                <span className="text-[#C02026] text-[10px] font-black bg-red-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5"><Clock size={14}/> {txt(place.timeAr, place.timeEn)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </ContentSection>

            {/* ج. تفاصيل المشروع */}
            <ContentSection id="design" title={txt(data.detailsTitleAr, data.detailsTitleEn) || (isAr ? 'تفاصيل وتصميم المشروع' : 'Design Details')} image={data.detailsImage} content={isAr ? data.detailsContentAr : data.detailsContentEn} />

            {/* د. مساحة المشروع (Master Plan) */}
            <ContentSection id="area" title={txt(data.areaTitleAr, data.areaTitleEn) || (isAr ? 'مساحة ومخطط المشروع' : 'Master Plan')} image={data.areaImage} content={isAr ? data.areaContentAr : data.areaContentEn} altBg />

            {/* هـ. المرافق والخدمات */}
            <ContentSection id="facilities" title={txt(data.facilitiesTitleAr, data.facilitiesTitleEn) || (isAr ? 'الخدمات والمرافق' : 'Amenities')} image={data.facilitiesImage} content={isAr ? data.facilitiesContentAr : data.facilitiesContentEn}>
                {data.amenities?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                        {data.amenities.map((key, i) => {
                            const Item = AMENITIES_CONFIG[key] || AMENITIES_CONFIG.default;
                            const Icon = Item.icon;
                            return (
                                <div key={i} className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#C02026] group-hover:text-white transition-all"><Icon size={24} /></div>
                                    <span className="font-black text-[11px] uppercase tracking-wider text-slate-800 leading-none">{isAr ? Item.ar : Item.en}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </ContentSection>

            {/* و. الوحدات وقائمة الوحدات */}
            <ContentSection id="units" title={txt(data.unitsTitleAr, data.unitsTitleEn) || (isAr ? 'الوحدات المتاحة والمساحات' : 'Available Units')} image={data.unitsImage} content={isAr ? data.unitsContentAr : data.unitsContentEn}>
                {data.inventory?.length > 0 && (
                    <div className="grid gap-4 mt-10">
                        {data.inventory.map((unit, i) => (
                            <div key={i} className="flex flex-col md:flex-row justify-between items-center p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-lg transition-all gap-4">
                                <div className="text-center md:text-start">
                                    <h4 className="font-black text-xl text-slate-900 italic uppercase">{unit.unitType}</h4>
                                    <p className="text-sm text-slate-400 font-bold mt-1 tracking-widest uppercase">{unit.area} m² {unit.bedrooms && `• ${unit.bedrooms} BEDROOMS`}</p>
                                </div>
                                <div className="bg-slate-50 px-8 py-3 rounded-2xl border border-slate-100">
                                    <div className="text-[#C02026] font-black text-xl tracking-tighter">{unit.price ? formatNum(unit.price) : '-'} EGP</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ContentSection>

            {/* ز. باقات الأسعار */}
            <ContentSection id="prices" title={txt(data.pricesTitleAr, data.pricesTitleEn) || (isAr ? 'باقات الأسعار' : 'Pricing')} image={data.pricesImage} content={isAr ? data.pricesContentAr : data.pricesContentEn} altBg />

            {/* ح. أنظمة الدفع */}
            <ContentSection id="payment" title={txt(data.paymentTitleAr, data.paymentTitleEn) || (isAr ? 'أنظمة السداد والتقسيط' : 'Payment Plans')} image={data.paymentImage} content={isAr ? data.paymentContentAr : data.paymentContentEn}>
                <div className="flex flex-wrap gap-6 mt-10 mb-16">
                    <div className="bg-[#C02026] text-white p-8 rounded-[2.5rem] text-center flex-1 min-w-[200px] shadow-2xl relative overflow-hidden group">
                        <div className="text-[11px] opacity-80 mb-3 uppercase tracking-[0.3em] font-black leading-none">{isAr ? 'مقدم حجز يبدأ من' : 'Reservation'}</div>
                        <div className="text-5xl font-black italic tracking-tighter leading-none">{data.downPayment}%</div>
                    </div>
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] text-center flex-1 min-w-[200px] shadow-2xl relative overflow-hidden group">
                        <div className="text-[11px] opacity-80 mb-3 uppercase tracking-[0.3em] font-black leading-none">{isAr ? 'سنوات التقسيط حتى' : 'Duration'}</div>
                        <div className="text-5xl font-black italic tracking-tighter leading-none">{data.installments} <span className="text-2xl">{isAr ? 'سنوات' : 'Years'}</span></div>
                    </div>
                </div>
            </ContentSection>

            {/* ط. فيديو المشروع */}
            {videoId && (
                <section className="py-20 bg-slate-950 rounded-[3rem] text-center my-10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[#C02026]/5 blur-3xl rounded-full" />
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-12 italic uppercase tracking-tighter relative z-10">{isAr ? 'فيديو المشروع' : 'Official Trailer'}</h2>
                    <div className="relative aspect-video max-w-5xl mx-auto rounded-[2rem] overflow-hidden border-8 border-white/5 group z-10 shadow-2xl">
                        <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&autoplay=0`} allowFullScreen title="Project Official Video" />
                    </div>
                </section>
            )}

            {/* ي. حاسبة الأقساط الذكية (نسخة مطورة بريميوم) */}
            <section className="mt-16 bg-slate-900 rounded-[3.5rem] p-8 md:p-14 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#C02026]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="w-20 h-20 bg-[#C02026] text-white rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(192,32,38,0.3)]">
                        <Calculator size={40} />
                    </div>
                    <div className="text-center md:text-start">
                        <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">
                          {isAr ? 'المستشار العقاري الذكي' : 'Smart Advisor'}
                        </h3>
                        <p className="text-slate-400 font-medium text-sm md:text-base max-w-xl">
                          {isAr ? 'احسب استثمارك الشهري بناءً على السعر الحالي وخطة السداد المتاحة.' : 'Calculate your future monthly installments based on current pricing.'}
                        </p>
                    </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-4 md:p-10 border border-white/10 shadow-inner">
                  <Suspense fallback={<div className="h-96 animate-pulse bg-white/5 rounded-[2.5rem]" />}>
                      <InstallmentCalculator 
                        lang={lang} 
                        isAr={isAr} 
                        initialPrice={data.price} 
                        initialDownPayment={data.downPayment} 
                        initialYears={data.installments} 
                        projectName={officialName} 
                      />
                  </Suspense>
                </div>
            </section>

            {/* ك. التقييم الفني (Pros & Cons) */}
            {(data.prosAr || data.consAr) && (
                <section className="py-20 bg-white">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-12 italic tracking-tighter uppercase leading-none">{isAr ? 'التقييم الفني (المميزات والعيوب)' : 'Evaluation'}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {data.prosAr && (
                            <div className="bg-emerald-50/40 p-10 rounded-[3rem] border border-emerald-100 hover:bg-emerald-50 transition-colors">
                                <h3 className="text-emerald-800 font-black text-2xl mb-6 flex items-center gap-3"><ThumbsUp size={28} className="text-emerald-600"/> {isAr ? 'نقاط التميز' : 'Pros'}</h3>
                                <ul className="space-y-4">
                                    {data.prosAr.map((p,i) => (<li key={i} className="flex gap-4 text-emerald-950 font-bold text-base leading-snug"><CheckCircle className="w-6 h-6 text-emerald-500 shrink-0"/>{p}</li>))}
                                </ul>
                            </div>
                        )}
                        {data.consAr && (
                            <div className="bg-rose-50/40 p-10 rounded-[3rem] border border-rose-100 hover:bg-rose-50 transition-colors">
                                <h3 className="text-rose-800 font-black text-2xl mb-6 flex items-center gap-3"><ThumbsDown size={28} className="text-rose-600"/> {isAr ? 'نقاط للمراجعة' : 'Cons'}</h3>
                                <ul className="space-y-4">
                                    {data.consAr.map((c,i) => (<li key={i} className="flex gap-4 text-rose-950 font-medium text-base leading-snug"><div className="w-6 h-6 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-xs font-black shrink-0">!</div>{c}</li>))}
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ل. المطور العقاري وماريعه */}
            {data.developer && (
                <section className="bg-slate-950 p-10 md:p-16 rounded-[4rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-[#C02026]/10 transition-all duration-1000" />
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12 relative z-10">
                        {data.developer.logo ? (
                          <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-[2.5rem] p-6 shadow-2xl flex items-center justify-center shrink-0 overflow-hidden">
                            <Image src={urlFor(data.developer.logo).width(300).url()} width={180} height={180} className="object-contain" alt="Developer" />
                          </div>
                        ) : <div className="w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-[2.5rem] flex items-center justify-center shrink-0"><Building2 size={60} className="text-white/20"/></div>}
                        <div className="flex-1 text-center md:text-start">
                            <div className="text-[10px] font-black text-[#C02026] uppercase tracking-[0.4em] mb-3">{isAr ? 'المطور العقاري المعتمد' : 'Verified Partner'}</div>
                            <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">{txt(data.developer.nameAr, data.developer.nameEn)}</h3>
                            <p className="text-slate-400 text-base md:text-lg leading-relaxed line-clamp-6">{txt(data.developer.descriptionAr, data.developer.descriptionEn)}</p>
                        </div>
                    </div>
                    {data.developerProjects?.length > 0 && (
                        <div className="border-t border-white/10 pt-10 relative z-10">
                            <h4 className="font-black mb-8 flex items-center justify-center md:justify-start gap-3 text-white uppercase tracking-widest text-sm"><div className="w-2 h-2 bg-[#C02026] rounded-full" /> {isAr ? 'أبرز أعمال المطور الأخرى' : 'Landmark Projects'}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                               {data.developerProjects.map((p, i) => (
                                  <Link key={i} href={`/${lang}/projects/${p.slug}`} className="group flex items-center gap-5 bg-white/5 p-4 rounded-[2rem] hover:bg-white/10 border border-white/5 transition-all">
                                    {p.mainImage && <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-xl"><Image src={urlFor(p.mainImage).width(200).url()} fill className="object-cover group-hover:scale-110 transition-all duration-700" alt="Proj" /></div>}
                                    <div className="overflow-hidden">
                                      <span className="font-black text-lg text-white group-hover:text-[#C02026] block truncate italic uppercase tracking-tighter">{txt(p.titleAr, p.titleEn)}</span>
                                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 uppercase mt-1"><MapPin size={12} className="text-[#C02026]" /> {getSafeText(isAr ? p.districtData?.nameAr : p.districtData?.nameEn)}</span>
                                    </div>
                                  </Link>
                               ))}
                            </div>
                            <Link href={`/${lang}/developers/${data.developer.slug}`} className="group flex items-center justify-center gap-3 mt-12 w-full py-5 rounded-3xl bg-white text-slate-950 font-black text-xs uppercase tracking-[0.3em] hover:bg-[#C02026] hover:text-white transition-all shadow-2xl">
                                {isAr ? 'استكشف سجل المطور الكامل' : 'Discover Full History'}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform rtl:rotate-180" />
                            </Link>
                        </div>
                    )}
                </section>
            )}

            {/* م. رأي المحرر العقاري + الكاتب والتقييم */}
            <ContentSection id="review" title={txt(data.opinionTitleAr, data.opinionTitleEn) || (isAr ? 'رأي خبير بلاتفورم' : 'Expert Review')} content={isAr ? data.opinionContentAr : data.opinionContentEn} altBg>
                <div className="flex flex-col md:flex-row items-center gap-8 mt-10">
                  {data.editorRating && (
                      <div className="flex items-center gap-5 bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl border border-white/5 w-full md:w-fit">
                          <div className="bg-[#C02026] text-white font-black text-3xl w-16 h-16 rounded-[1.2rem] flex items-center justify-center shadow-2xl shadow-red-900/40 italic">{data.editorRating}</div>
                          <div>
                            <div className="font-black text-white uppercase tracking-[0.2em] text-[10px] mb-1">{isAr ? 'تقييم المنصة' : 'Overall Score'}</div>
                            <div className="flex text-yellow-400 gap-1">{[...Array(5)].map((_,i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                          </div>
                      </div>
                  )}
                  {data.author && (
                      <div className="flex items-center gap-5 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm w-full md:w-fit">
                          {data.author.image ? <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-slate-50 shadow-md"><Image src={urlFor(data.author.image).width(120).url()} fill className="object-cover" alt="Author" /></div> : <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><User className="text-slate-300"/></div>}
                          <div>
                            <div className="text-[10px] text-[#C02026] uppercase font-black tracking-widest mb-1">{isAr ? 'تحليل بواسطة' : 'Analyzed By'}</div>
                            <h3 className="text-lg font-black text-slate-950 italic uppercase tracking-tighter leading-none">{data.author.name}</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{data.author.jobTitle}</p>
                          </div>
                      </div>
                  )}
                </div>
            </ContentSection>

            {/* ن. الأسئلة الشائعة */}
            {data.faqs?.length > 0 && (
                <section id="faqs" className="py-20 bg-white">
                    <div className="text-center mb-16"><span className="text-[#C02026] font-black uppercase tracking-[0.4em] text-[11px] block mb-4">{isAr ? 'معلومات تهمك' : 'Key Info'}</span><h2 className="text-4xl md:text-6xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">{isAr ? 'الأسئلة الشائعة' : 'Project FAQ'}</h2></div>
                    <div className="grid gap-4 max-w-5xl mx-auto">
                        {data.faqs.map((f, i) => (
                            <details key={i} className="group bg-slate-50 rounded-[2rem] p-6 cursor-pointer open:bg-white border-2 border-transparent open:border-slate-100 transition-all duration-500">
                                <summary className="font-black flex justify-between items-center list-none select-none text-base md:text-xl italic uppercase tracking-tight leading-none"><span className="flex gap-5 items-center text-slate-900 group-open:text-[#C02026] transition-colors"><HelpCircle className="w-6 h-6 shrink-0 text-[#C02026] opacity-30 group-open:opacity-100"/> {getSafeText(isAr ? f.questionAr : f.questionEn)}</span><ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-all"/></summary>
                                <div className="px-11 pb-2 text-slate-500 leading-loose text-base md:text-lg font-medium border-t border-slate-100 pt-6 mt-6 animate-in fade-in duration-700">{getSafeText(isAr ? f.answerAr : f.answerEn)}</div>
                            </details>
                        ))}
                    </div>
                </section>
            )}

            {/* س. مشاريع مقترحة لك */}
            {similarProjects?.length > 0 && (
                <section className="py-32 bg-slate-950 rounded-[4rem] my-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C02026]/5 rounded-full blur-[150px]" />
                    <div className="max-w-[1440px] mx-auto px-12 relative z-10">
                        <div className="flex items-end justify-between mb-16">
                           <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">{isAr ? 'مشاريع مقترحة لك' : 'Recommended'}</h2>
                           <Link href={`/${lang}/projects`} className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:text-[#C02026] transition-colors">View All Directory</Link>
                        </div>
                        <div className="w-full"><AutoProjectCarousel projects={similarProjects} lang={lang} isAr={isAr} desktopSlides={3} /></div>
                    </div>
                </section>
            )}
        </div>

        {/* Sidebar (البوكس الجانبي - ديناميكي بالكامل) */}
        <aside className="lg:col-span-3 space-y-8 hidden lg:block h-full">
            <div className="sticky top-32 space-y-8">
                <CTABox isAr={isAr} inquiries={inquiries} whatsappLink={whatsappLink} handleShare={handleShare} copied={copied} />
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-5 group hover:bg-white hover:shadow-xl transition-all">
                   <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#C02026] shadow-xl group-hover:bg-[#C02026] group-hover:text-white transition-all"><ShieldCheck size={32} /></div>
                   <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">Status</p>
                      <p className="text-slate-900 font-black text-xs uppercase italic">{isAr ? 'استثمار معتمد وآمن' : '100% Certified Safe'}</p>
                   </div>
                </div>
            </div>
        </aside>
      </div>

      {/* Floating Mobile Nav */}
      <nav className="lg:hidden fixed bottom-24 left-4 right-4 z-[110] flex gap-3 h-16 animate-in slide-in-from-bottom-12 duration-1000">
          <a href={`tel:${CONTACT_INFO.phone}`} className="w-20 bg-slate-950 text-white rounded-[1.5rem] flex flex-col items-center justify-center border border-white/5 shadow-2xl active:scale-90 transition-all group">
            <Phone size={20} className="text-[#C02026] mb-1 group-hover:animate-bounce" /> 
            <span className="text-[9px] font-black uppercase tracking-tighter leading-none">{isAr ? 'اتصل' : 'Call'}</span>
          </a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white rounded-[1.5rem] flex items-center justify-center gap-3 font-black shadow-2xl active:scale-95 transition-all text-sm border-b-4 border-black/10">
            <MessageCircle size={24} /> <span className="uppercase tracking-widest">{isAr ? 'تحدث مع خبير' : 'WhatsApp'}</span>
          </a>
          <button onClick={handleShare} className="w-16 bg-white text-slate-950 rounded-[1.5rem] flex items-center justify-center border border-slate-100 shadow-2xl active:scale-90 transition-all">
            {copied ? <Check size={24} className="text-green-600"/> : <Share2 size={24} />}
          </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 30s linear infinite alternate; }
        html { scroll-behavior: smooth; }
      `}} />
    </main>
  );
}