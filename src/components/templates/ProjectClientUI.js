"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react'; 
import { urlFor } from '@/sanity/image'; 
import { CONTACT_INFO } from '@/components/constants/contact'; 
import AutoProjectCarousel from '../AutoProjectsCarousel'; 
import Breadcrumbs from '../Breadcrumbs'; 
import ProjectGallery from '../ProjectGallery'; 
import InstallmentCalculator from '@/components/InstallmentCalculator';
import { sendGAEvent } from '@next/third-parties/google';

import { 
  Phone, MessageCircle, MapPin, Calendar, Building2, ShoppingBag, Waves,
  Star, Percent, CreditCard, PaintBucket, Clock, ShieldCheck, CarFront, Trees, Gamepad2, Armchair, 
  Dumbbell, Coffee, Lock, User, ChevronDown, HelpCircle, ThumbsUp, ThumbsDown, CheckCircle, 
  Activity, ArrowUpFromLine, Fan, Wifi, Mic, Syringe, Pill, Tv, Utensils, Palmtree, Anchor, Maximize,
  Calculator, Share2, Copy, Check, ArrowRight, Cpu, CheckCircle2 
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

const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object' && !Array.isArray(val) && val.children) {
    return val.children.map(child => child.text || "").join('');
  }
  if (Array.isArray(val)) {
    return val.map(block => {
      if (typeof block === 'string') return block;
      if (block.children) return block.children.map(child => child.text || "").join('');
      return "";
    }).join(' ');
  }
  return "";
};

const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <div className="relative w-full h-64 md:h-[500px] my-10 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 group">
          <Image 
            src={urlFor(value).url()} 
            alt="Project Content" 
            fill 
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          {value.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-black/50 backdrop-blur-sm text-white p-3 text-center text-xs font-bold">
                {getSafeText(value.caption)}
            </div>
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
const CTABox = ({ isArabic, inquiries, whatsappLink, handleShare, copied, projectName, onContactClick }) => (
  <div className="bg-white border border-gray-100 p-5 rounded-2xl sticky top-28 shadow-lg h-fit z-30 transition-shadow duration-300 hover:shadow-xl w-full mx-auto text-start">
      <div className="mb-4 text-start">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{isArabic ? 'مهتم بالمشروع؟' : 'Interested?'}</p>
          <h3 className="text-lg font-black text-slate-900">{isArabic ? 'احجز وحدتك الآن' : 'Book Your Unit'}</h3>
      </div>
      <div className="space-y-2.5 w-full">
          <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
             onClick={() => onContactClick?.('phone')}
             aria-label={`Call us about ${projectName}`}
             className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#C02026] transition-all group shadow-sm text-xs md:text-sm border border-slate-800">
              <Phone size={16} /> {isArabic ? 'اتصل مباشر' : 'Call Now'}
          </a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
             onClick={() => onContactClick?.('whatsapp')}
             aria-label={`WhatsApp us about ${projectName}`}
             className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#128c7e] transition-all shadow-sm text-xs md:text-sm">
              <MessageCircle size={18} /> {isArabic ? 'واتساب' : 'WhatsApp'}
          </a>

          <button onClick={handleShare} 
                  aria-label={`Share ${projectName}`}
                  className="w-full bg-slate-50 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-sm text-xs md:text-sm border border-slate-200 block"
                  style={{ textAlign: 'left', direction: 'ltr', paddingLeft: '15px', display: 'block' }}>
              <div style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }}>
                  {copied ? <Check size={16} className="text-green-600"/> : <Share2 size={16} />}
              </div>
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  {copied ? (isArabic ? 'تم النسخ' : 'Copied!') : (isArabic ? 'مشاركة المشروع' : 'Share Project')}
              </span>
          </button>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 rounded-lg py-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
          {inquiries} {isArabic ? 'شخص يشاهدون الآن' : 'people viewing now'}
      </div>
  </div>
);

const ContentSection = ({ title, image, content, children, altBg = false, id, itemProp }) => {
  const safeTitle = getSafeText(title);
  if (!safeTitle && !content && !image && !children) return null;

  return (
    <section id={id} itemProp={itemProp} className={`py-12 md:py-16 ${altBg ? 'bg-slate-50' : 'bg-white'} rounded-[2.5rem] my-4 overflow-hidden`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {safeTitle && <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 border-s-8 border-[#C02026] ps-6 italic uppercase tracking-tighter leading-none">{safeTitle}</h2>}
        <div className="space-y-6 mb-8 max-w-5xl text-start">
            {content && Array.isArray(content) && (
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed">
                <PortableText value={content} components={ptComponents} onMissingComponent={false} />
              </div>
            )}
            {children}
        </div>
        {image && image.asset && (
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 group mt-10">
              <Image 
                src={urlFor(image).url()} 
                alt={safeTitle} 
                fill 
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                className="object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
            </div>
        )}
      </div>
    </section>
  );
};

// --- 4. MAIN COMPONENT ---
export default function ProjectClientUI({ data, lang, breadcrumbItems, similarProjects = [], relatedPosts = [] }) {
  const isArabic = lang === 'ar';
  
  const [inquiries, setInquiries] = useState(0);
  const [copied, setCopied] = useState(false); 

  const trackLead = (method) => {
    sendGAEvent('event', 'generate_lead', {
      category: 'Lead Generation',
      action: method === 'whatsapp' ? 'WhatsApp Click' : 'Phone Call Click',
      label: officialName,
      project_id: data?._id,
      language: lang,
      value: data?.price || 0,
      currency: 'EGP'
    });
  };

  useEffect(() => { 
    setInquiries(15 + Math.floor(Math.random() * 10));

    const nukeScrollLock = () => {
      const els = [document.documentElement, document.body];
      els.forEach(el => {
        el.style.setProperty('overflow', 'auto', 'important');
        el.style.setProperty('position', 'static', 'important');
        el.style.setProperty('pointer-events', 'auto', 'important');
        el.style.setProperty('touch-action', 'auto', 'important');
        el.style.setProperty('height', 'auto', 'important');
      });
    };

    const observer = new MutationObserver(() => {
      if (!document.querySelector('.yarl__container') && !document.querySelector('.lg-container')) {
        nukeScrollLock();
      }
    });

    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
    window.addEventListener('touchstart', nukeScrollLock, { passive: true });
    window.addEventListener('popstate', nukeScrollLock);

    return () => {
      observer.disconnect();
      window.removeEventListener('touchstart', nukeScrollLock);
      window.removeEventListener('popstate', nukeScrollLock);
      nukeScrollLock();
    };
  }, []);

  if (!data) return null;

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = getSafeText(isArabic ? data.titleAr : data.titleEn);
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const txt = (ar, en) => {
    return getSafeText(isArabic ? ar : en); 
  };

  const officialName = txt(data.titleAr, data.titleEn);
  const h1Title = getSafeText(data.computedH1) || officialName; 
  const whatsappPhone = CONTACT_INFO.whatsapp.replace(/\D/g, '');
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(isArabic ? `استفسار عن: ${officialName}` : `Inquiry about: ${officialName}`)}`;
  const videoId = getYoutubeId(data.videoUrl);
  const aiSummary = isArabic ? data.aiSummaryAr : data.aiSummaryEn;

  const stats = [
    { l: isArabic ?'المساحات من':'Areas From', v: data.minArea ? `${data.minArea} m²` : '-', i: Maximize, p: "floorSize" }, 
    { l: isArabic ?'المقدم':'Down Payment', v: data.downPayment ? `${data.downPayment}%` : '-', i: Percent },
    { l: isArabic ?'التقسيط':'Installments', v: data.installments ? `${data.installments} ${isArabic ?'سنوات':'Yrs'}` : '-', i: CreditCard },
    { l: isArabic ?'التشطيب':'Finishing', v: txt(data.finishingTypeAr || data.finishingType, data.finishingTypeEn || data.finishingType) || '-', i: PaintBucket },
    { l: isArabic ?'الاستلام':'Delivery', v: txt(data.deliveryDateAr || data.deliveryDate, data.deliveryDateEn || data.deliveryDate) || '-', i: Calendar },
    { l: isArabic ?'سعر يبدأ من':'Prices From', v: data.price ? `${formatNum(data.price)} EGP` : (isArabic ?'اتصل بنا':'Call'), i: Star, c: 'text-[#C02026]', p: "price" }
  ];

  return (
    <main className={`font-sans text-slate-900 bg-white selection:bg-red-50 ${isArabic ? 'font-almarai' : 'font-jakarta'}`} dir={isArabic ? 'rtl' : 'ltr'} e itemType="https://schema.org/RealEstateListing">
      
      {/* Hero Section */}
      <section className="relative h-[75vh] w-full bg-slate-900 overflow-hidden group">itemScop
        {data.mainImage && (
          <Image 
            src={urlFor(data.mainImage).url()} 
            alt={officialName} 
            fill 
            sizes="100vw"
            className="object-cover opacity-60 scale-105 animate-slow-zoom" 
            priority 
            fetchPriority="high"
            
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        <button 
          onClick={handleShare} 
          aria-label={isArabic ? "مشاركة" : "Share"}
          className="absolute top-44 left-4 md:left-8 z-50 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all duration-300 hover:scale-110 shadow-2xl bg-white/10 text-white hover:bg-[#C02026]">
            {copied ? <Check size={20}/> : <Share2 size={20} />}
        </button>

        <div className="absolute inset-0 flex flex-col justify-end pb-20 px-4 md:px-8">
          <div className="max-w-[1440px] mx-auto w-full text-start">
            <div className="text-white/90 mb-4 md:mb-6 block relative z-30 overflow-x-auto hide-scrollbar">
              <div className="min-w-max">
                <Breadcrumbs items={breadcrumbItems} lang={lang} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
                {data.isNewLaunch && <span className="bg-[#C02026] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl"><Star size={12} fill="white"/> {isArabic ? 'إطلاق حديث' : 'New Launch'}</span>}
                {data.isReadyToMove && <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl"><CheckCircle size={12}/> {isArabic ? 'جاهز للاستلام' : 'Ready'}</span>}
            </div>
            <div className="relative z-10 space-y-2">
                <span itemProp="name" className="block text-[#C02026] text-xl md:text-2xl font-black uppercase tracking-[0.3em] italic leading-none">{officialName}</span>
                <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl max-w-5xl mb-6 italic uppercase">{h1Title}</h1>
            </div>
         <div className="flex items-center gap-3 text-xl text-slate-200 font-bold relative z-10 bg-white/5 w-fit px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
    <MapPin className="text-[#C02026] w-6 h-6" /> 
    <span>{txt(data.districtData?.nameAr, data.districtData?.nameEn)}</span>
</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-12 max-w-[1300px] mx-auto px-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 grid grid-cols-2 lg:grid-cols-6 p-8 gap-y-8 divide-slate-100 lg:divide-x lg:rtl:divide-x-reverse">
              {stats.map((x, i) => (
                <div key={i} className="text-center px-4 group">
                    <div className="flex justify-center mb-2 text-slate-300 group-hover:text-[#C02026] transition-colors"><x.i size={22}/></div>
                    <div className="text-[10px] text-slate-400 font-black uppercase mb-1.5 tracking-widest leading-none">{x.l}</div>
                    <div className={`text-base md:text-xl font-black tracking-tighter ${x.c || 'text-slate-900'}`} itemProp={x.p}>{x.v}</div>
                </div>
              ))}
          </div>
      </section>

      {/* ✅ [GEO]: AI Highlights Section - الإضافة الجديدة لمحركات الإجابة */}
      {aiSummary && aiSummary.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 mt-20">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-white/5 relative overflow-hidden text-start">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#C02026]/10 rounded-full blur-[80px]" />
             <div className="flex items-center gap-4 mb-8">
               <Cpu className="text-[#C02026] w-10 h-10" />
               <h3 className="font-black text-2xl text-white italic uppercase tracking-wider">{isArabic ? `ملخص استثماري: ${officialName}` : `${officialName} AI Insights`}</h3>
             </div>
             <ul className="grid md:grid-cols-2 gap-6">
               {aiSummary.map((point, i) => (
                 <li key={i} className="flex gap-4 text-slate-300 font-bold text-lg items-center">
                   <CheckCircle2 size={24} className="text-[#C02026] shrink-0" /><span>{point}</span>
                 </li>
               ))}
             </ul>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {data.gallery?.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 mt-24 mb-12">
            <div className="mb-10 text-start">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">{isArabic ? 'معرض الصور' : 'Visual Gallery'}</h2>
            </div>
            <ProjectGallery images={data.gallery} projectName={officialName} />
        </section>
      )}

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pb-40 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-9 space-y-6">
            
            <ContentSection id="intro" itemProp="description" title={txt(data.introTitleAr, data.introTitleEn) || (isArabic ? 'نبذة عن المشروع' : 'Introduction')} content={isArabic ? data.introContentAr : data.introContentEn} />
            
            <ContentSection id="location" title={txt(data.locationTitleAr, data.locationTitleEn) || (isArabic ? 'الموقع الاستراتيجي' : 'Location')} image={data.locationImage} content={isArabic ? data.locationContentAr : data.locationContentEn} altBg>
                {data.nearbyPlaces?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                        {data.nearbyPlaces.map((place, i) => (
                            <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 flex justify-between items-center shadow-sm">
                                <span className="font-black text-slate-800 italic uppercase">{isArabic ? getSafeText(place.placeAr) : getSafeText(place.placeEn)}</span>
                                <span className="text-[#C02026] text-[10px] font-black bg-red-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5"><Clock size={14}/> {isArabic ? getSafeText(place.timeAr) : getSafeText(place.timeEn)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </ContentSection>

            <ContentSection id="design" title={txt(data.detailsTitleAr, data.detailsTitleEn) || (isArabic ? 'تفاصيل وتصميم المشروع' : 'Design Details')} image={data.detailsImage} content={isArabic ? data.detailsContentAr : data.detailsContentEn} />

            <ContentSection id="area" title={txt(data.areaTitleAr, data.areaTitleEn) || (isArabic ? 'مساحة ومخطط المشروع' : 'Master Plan')} image={data.areaImage} content={isArabic ? data.areaContentAr : data.areaContentEn} altBg />

            <ContentSection id="facilities" title={txt(data.facilitiesTitleAr, data.facilitiesTitleEn) || (isArabic ? 'الخدمات والمرافق' : 'Amenities')} image={data.facilitiesImage} content={isArabic ? data.facilitiesContentAr : data.facilitiesContentEn}>
                {data.amenities?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                        {data.amenities.map((key, i) => {
                            const Item = AMENITIES_CONFIG[key] || AMENITIES_CONFIG.default;
                            const Icon = Item.icon;
                            return (
                                <div key={i} className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#C02026] group-hover:text-white transition-all"><Icon size={24} /></div>
                                    <span className="font-black text-[11px] uppercase tracking-wider text-slate-800 leading-none">{isArabic ? Item.ar : Item.en}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </ContentSection>

            <ContentSection id="units" title={txt(data.unitsTitleAr, data.unitsTitleEn) || (isArabic ? 'الوحدات المتاحة والمساحات' : 'Available Units')} image={data.unitsImage} content={isArabic ? data.unitsContentAr : data.unitsContentEn}>
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

            <ContentSection id="prices" title={txt(data.pricesTitleAr, data.pricesTitleEn) || (isArabic ? 'باقات الأسعار' : 'Pricing')} image={data.pricesImage} content={isArabic ? data.pricesContentAr : data.pricesContentEn} altBg />

            <ContentSection id="payment" title={txt(data.paymentTitleAr, data.paymentTitleEn) || (isArabic ? 'أنظمة السداد والتقسيط' : 'Payment Plans')} image={data.paymentImage} content={isArabic ? data.paymentContentAr : data.paymentContentEn}>
                <div className="flex flex-wrap gap-6 mt-10 mb-16">
                    <div className="bg-[#C02026] text-white p-8 rounded-[2.5rem] text-center flex-1 min-w-[200px] shadow-2xl relative overflow-hidden group">
                        <div className="text-[11px] opacity-80 mb-3 uppercase tracking-[0.3em] font-black leading-none">{isArabic ? 'مقدم حجز يبدأ من' : 'Reservation'}</div>
                        <div className="text-5xl font-black italic tracking-tighter leading-none">{data.downPayment}%</div>
                    </div>
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] text-center flex-1 min-w-[200px] shadow-2xl relative overflow-hidden group">
                        <div className="text-[11px] opacity-80 mb-3 uppercase tracking-[0.3em] font-black leading-none">{isArabic ? 'سنوات التقسيط حتى' : 'Duration'}</div>
                        <div className="text-5xl font-black italic tracking-tighter leading-none">{data.installments} <span className="text-2xl">{isArabic ? 'سنوات' : 'Years'}</span></div>
                    </div>
                </div>
            </ContentSection>

            {videoId && (
                <section className="py-20 bg-slate-950 rounded-[3rem] text-center my-10 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[#C02026]/5 blur-3xl rounded-full" />
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-12 italic uppercase tracking-tighter relative z-10">{isArabic ? 'فيديو المشروع' : 'Official Trailer'}</h2>
                    <div className="relative aspect-video max-w-5xl mx-auto rounded-[2rem] overflow-hidden border-8 border-white/5 group z-10 shadow-2xl">
                        <iframe loading="lazy" className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&autoplay=0`} allowFullScreen title="Project Official Video" />
                    </div>
                </section>
            )}

            <section className="mt-16 bg-slate-900 rounded-[3.5rem] p-8 md:p-14 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#C02026]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="w-20 h-20 bg-[#C02026] text-white rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(192,32,38,0.3)]">
                        <Calculator size={40} />
                    </div>
                    <div className="text-center md:text-start">
                        <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-3">
                          {isArabic ? 'المستشار العقاري الذكي' : 'Smart Advisor'}
                        </h3>
                        <p className="text-slate-400 font-medium text-sm md:text-base max-w-xl">
                          {isArabic ? 'احسب استثمارك الشهري بناءً على السعر الحالي وخطة السداد المتاحة.' : 'Calculate your future monthly installments based on current pricing.'}
                        </p>
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-4 md:p-10 border border-white/10 shadow-inner">
                  <Suspense fallback={<div className="h-96 animate-pulse bg-white/5 rounded-[2.5rem]" />}>
                      <InstallmentCalculator 
                        lang={lang} 
                        isAr={isArabic} 
                        initialPrice={data.price} 
                        initialDownPayment={data.downPayment} 
                        initialYears={data.installments} 
                        projectName={officialName} 
                      />
                  </Suspense>
                </div>
            </section>

            {/* ✅ [AEO]: FAQs Section - الإضافة الثانية لمحركات البحث */}
   {data.faqs && data.faqs.length > 0 && (
  <section className="py-20 bg-white">
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-12 italic uppercase tracking-tighter leading-none flex items-center gap-4">
          <HelpCircle size={40} className="text-[#C02026]" />
          {isArabic ? `الأسئلة الشائعة عن ${officialName}` : `FAQ: ${officialName}`}
      </h2>
      <div className="space-y-4">
          {data.faqs.map((faq, i) => (
            <details key={i} className="group bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 cursor-pointer text-start">
              <summary className="flex justify-between items-center font-black text-lg md:text-xl outline-none uppercase italic text-slate-900">
                <span>{isArabic ? faq.questionAr : faq.questionEn}</span>
                <span className="text-[#C02026] group-open:rotate-180 transition-transform"><ChevronDown size={24}/></span>
              </summary>
              <div className="mt-6 text-slate-600 font-medium leading-relaxed border-t border-slate-200 pt-6">
                <p>{isArabic ? faq.answerAr : faq.answerEn}</p>
              </div>
            </details>
          ))}
      </div>
  </section>
)}

            {(data.prosAr || data.consAr) && (
                <section className="py-20 bg-white">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-12 italic tracking-tighter uppercase leading-none">{isArabic ? 'التقييم الفني للمشروع' : 'Expert Evaluation'}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {data.prosAr && (
                            <div className="bg-emerald-50/40 p-10 rounded-[3rem] border border-emerald-100 hover:bg-emerald-50 transition-colors text-start">
                                <h3 className="text-emerald-800 font-black text-2xl mb-6 flex items-center gap-3"><ThumbsUp size={28} className="text-emerald-600"/> {isArabic ? 'نقاط التميز' : 'Pros'}</h3>
                                <ul className="space-y-4">
                                    {data.prosAr.map((p,i) => (<li key={i} className="flex gap-4 text-emerald-950 font-bold text-base leading-snug"><CheckCircle className="w-6 h-6 text-emerald-500 shrink-0"/>{getSafeText(p)}</li>))}
                                </ul>
                            </div>
                        )}
                        {data.consAr && (
                            <div className="bg-rose-50/40 p-10 rounded-[3rem] border border-rose-100 hover:bg-rose-50 transition-colors text-start">
                                <h3 className="text-rose-800 font-black text-2xl mb-6 flex items-center gap-3"><ThumbsDown size={28} className="text-rose-600"/> {isArabic ? 'نقاط للمراجعة' : 'Cons'}</h3>
                                <ul className="space-y-4">
                                    {data.consAr.map((c,i) => (<li key={i} className="flex gap-4 text-rose-950 font-medium text-base leading-snug"><div className="w-6 h-6 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-xs font-black shrink-0">!</div>{getSafeText(c)}</li>))}
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {data.developer && (
                <section className="bg-slate-950 p-10 md:p-16 rounded-[4rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -me-32 -mt-32 group-hover:bg-[#C02026]/10 transition-all duration-1000" />
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12 relative z-10 text-start">
                        {data.developer.logo ? (
                          <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-[2.5rem] p-6 shadow-2xl flex items-center justify-center shrink-0 overflow-hidden relative">
                            <Image 
                              src={urlFor(data.developer.logo).url()} 
                              fill 
                              className="object-contain p-4" 
                              alt={`${txt(data.developer.nameAr, data.developer.nameEn)} Logo`}
                              sizes="(max-width: 768px) 128px, 192px" 
                            /> 
                          </div>
                        ) : <div className="w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-[2.5rem] flex items-center justify-center shrink-0"><Building2 size={60} className="text-white/20"/></div>}
                        <div className="flex-1">
                            <div className="text-[10px] font-black text-[#C02026] uppercase tracking-[0.4em] mb-3">{isArabic ? 'المطور العقاري المعتمد' : 'Verified Partner'}</div>
                            <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">{txt(data.developer.nameAr, data.developer.nameEn)}</h3>
                            <p className="text-slate-400 text-base md:text-lg leading-relaxed line-clamp-6 mb-6">{txt(data.developer.descriptionAr, data.developer.descriptionEn)}</p>
                            
                            {data.developerProjects?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {data.developerProjects.map((p, i) => (
                                        <Link 
                                            key={`tag-${i}`} 
                                            href={`/${lang}/projects/${p.slug}/`} 
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#C02026] border border-white/10 hover:border-[#C02026] rounded-full text-xs font-bold text-white transition-all duration-300 shadow-sm"
                                        >
                                            <Building2 size={12} className="opacity-70" />
                                            {txt(p.titleAr, p.titleEn)}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {data.developerProjects?.length > 0 && (
                        <div className="border-t border-white/10 pt-10 relative z-10 text-start">
                            <h4 className="font-black mb-8 flex items-center justify-center md:justify-start gap-3 text-white uppercase tracking-widest text-sm"><div className="w-2 h-2 bg-[#C02026] rounded-full" /> {isArabic ? 'أبرز أعمال المطور الأخرى' : 'Landmark Projects'}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                               {data.developerProjects.map((p, i) => (
                                  <Link key={i} href={`/${lang}/projects/${p.slug}/`} className="group flex items-center gap-5 bg-white/5 p-4 rounded-[2rem] hover:bg-white/10 border border-white/5 transition-all">
                                    {p.mainImage && <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-xl">
                                      <Image src={urlFor(p.mainImage).url()} fill className="object-cover group-hover:scale-110 transition-all duration-700" alt={txt(p.titleAr, p.titleEn)} unoptimized={true}/></div>}
                                    <div className="overflow-hidden">
                                      <span className="font-black text-lg text-white group-hover:text-[#C02026] block truncate italic uppercase tracking-tighter">{txt(p.titleAr, p.titleEn)}</span>
                                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 uppercase mt-1"><MapPin size={12} className="text-[#C02026]" /> {txt(p.districtData?.nameAr, p.districtData?.nameEn)}</span>
                                    </div>
                                  </Link>
                               ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            <ContentSection id="review" title={txt(data.opinionTitleAr, data.opinionTitleEn) || (isArabic ? 'رأي خبير بلاتفورم' : 'Expert Review')} content={isArabic ? data.opinionContentAr : data.opinionContentEn} altBg>
                <div className="flex flex-col md:flex-row items-center gap-8 mt-10">
                  {data.editorRating && (
                      <div className="flex items-center gap-5 bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl border border-white/5 w-full md:w-fit">
                          <div className="bg-[#C02026] text-white font-black text-3xl w-16 h-16 rounded-[1.2rem] flex items-center justify-center shadow-2xl italic">{data.editorRating}</div>
                          <div>
                            <div className="font-black text-white uppercase tracking-[0.2em] text-[10px] mb-1">{isArabic ? 'تقييم المنصة' : 'Overall Score'}</div>
                            <div className="flex text-yellow-400 gap-1">{[...Array(5)].map((_,i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                          </div>
                      </div>
                  )}
                  {data.author && (
                      <div className="flex items-center gap-5 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm w-full md:w-fit text-start">
                          {data.author.image ? <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                            <Image 
                              src={urlFor(data.author.image).url()} 
                              fill 
                              className="object-cover" 
                              alt={data.author.name || "Author"} 
                              sizes="64px" 
                            /> 
                            </div> : <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><User className="text-slate-300"/></div>}
                          <div>
                            <div className="text-[10px] text-[#C02026] uppercase font-black tracking-widest mb-1">{isArabic ? 'تحليل بواسطة' : 'Analyzed By'}</div>
                            <h3 className="text-lg font-black text-slate-950 italic uppercase tracking-tighter leading-none">{data.author.name}</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{data.author.jobTitle}</p>
                          </div>
                      </div>
                  )}
                </div>
            </ContentSection>
        </div>

        <aside className="lg:col-span-3 space-y-8 hidden lg:block h-full">
            <div className="sticky top-32 space-y-8">
                <CTABox 
                  isArabic={isArabic} inquiries={inquiries} whatsappLink={whatsappLink} handleShare={handleShare} copied={copied} projectName={officialName} onContactClick={trackLead}
                />
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-5 group hover:bg-white hover:shadow-xl transition-all">
                   <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#C02026] shadow-xl group-hover:bg-[#C02026] group-hover:text-white transition-all"><ShieldCheck size={32} /></div>
                   <div className="text-start">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">Status</p>
                      <p className="text-slate-900 font-black text-xs uppercase italic">{isArabic ? 'استثمار معتمد وآمن' : '100% Certified Safe'}</p>
                   </div>
                </div>
            </div>
        </aside>
      </div>

      {similarProjects?.length > 0 && (
          <section className="py-32 bg-slate-950 rounded-[4rem] my-20 relative overflow-hidden text-start">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C02026]/5 rounded-full blur-[150px]" />
              <div className="max-w-[1440px] mx-auto px-12 relative z-10">
                  <div className="flex items-end justify-between mb-16">
                      <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">{isArabic ? 'مشاريع مقترحة لك' : 'Recommended'}</h2>
                      <Link href={`/${lang}/projects/`} className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:text-[#C02026] transition-colors">View All Directory</Link>
                  </div>
                  <div className="w-full"><AutoProjectCarousel projects={similarProjects} lang={lang} isAr={isArabic} desktopSlides={3} /></div>
              </div>
          </section>
      )}

      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-24 bg-slate-50 rounded-[4rem] border border-slate-100 my-16 text-start">
          <header className="flex flex-col md:flex-row items-center justify-between mb-16 px-6 md:px-12 gap-8">
            <div className="border-s-[12px] border-[#C02026] ps-8">
              <span className="text-[#C02026] font-black uppercase tracking-[0.4em] text-[10px] block mb-2">
                {isArabic ? 'تغطية حصرية' : 'Project Intelligence'}
              </span>
              <h2 className="text-3xl md:text-6xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                {isArabic ? `أخبار ${officialName}` : `${officialName} Intel`}
              </h2>
            </div>
            <Link href={`/${lang}/blog/`} className="group flex items-center gap-4 bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest border border-slate-200 hover:bg-[#C02026] hover:text-white transition-all shadow-xl shrink-0">
              {isArabic ? 'كل الأخبار' : 'Explore Blog'}
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform rtl:rotate-180" />
            </Link>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 md:px-12">
            {relatedPosts.map((post) => (
              <Link key={post.slug} href={`/${lang}/blog/${post.slug}/`} className="group flex flex-col h-full bg-white rounded-[3.5rem] overflow-hidden border border-transparent hover:border-red-100 hover:shadow-2xl transition-all duration-700">
                <div className="aspect-[16/10] overflow-hidden relative">
                  {post.mainImage && (
                    <Image 
                      src={urlFor(post.mainImage).url()} 
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                    />
                  )}
                </div>
                <div className="p-10 flex flex-col flex-1">
                  <span className="text-[10px] font-black text-[#C02026] uppercase tracking-[0.2em] mb-4 block">
                    {new Date(post._createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long' })}
                  </span>
                  <h3 className="text-2xl font-black text-slate-950 mb-6 group-hover:text-[#C02026] transition-colors line-clamp-2 leading-tight italic uppercase">{post.title}</h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed">{post.overview}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <nav className="lg:hidden fixed bottom-6 left-4 right-4 z-[110] flex gap-3 h-16 animate-in slide-in-from-bottom-12 duration-1000">
          <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} 
             onClick={() => trackLead('phone')}
             className="w-20 bg-slate-950 text-white rounded-[1.5rem] flex flex-col items-center justify-center border border-white/5 shadow-2xl active:scale-90 transition-all group">
            <Phone size={20} className="text-[#C02026] mb-1 group-hover:animate-bounce" /> 
            <span className="text-[9px] font-black uppercase tracking-tighter leading-none">{isArabic ? 'اتصل' : 'Call'}</span>
          </a>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
             onClick={() => trackLead('whatsapp')}
             className="flex-1 bg-[#25D366] text-white rounded-[1.5rem] flex items-center justify-center gap-3 font-black shadow-2xl active:scale-95 transition-all text-sm border-b-4 border-black/10">
            <MessageCircle size={24} /> <span className="uppercase tracking-widest">{isArabic ? 'واتساب' : 'WhatsApp'}</span>
          </a>
          <button onClick={handleShare} className="w-16 bg-white text-slate-950 rounded-[1.5rem] flex items-center justify-center border border-slate-100 shadow-2xl active:scale-90 transition-all">
            {copied ? <Check size={24} className="text-green-600"/> : <Share2 size={24} />}
          </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slow-zoom 30s linear infinite alternate; }
        html { scroll-behavior: auto !important; height: auto !important; overflow-x: hidden !important; } 
        body { overflow-x: hidden !important; -webkit-overflow-scrolling: touch !important; }
        @media (min-width: 1024px) { html { scroll-behavior: smooth !important; } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}