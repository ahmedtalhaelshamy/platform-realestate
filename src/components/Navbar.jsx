'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, MessageSquare, ChevronDown, MapPin, Newspaper, Home, LayoutGrid, Phone, Building2 } from 'lucide-react';
import { client } from '../sanity/client'; 

/**
 * 🚀 Premium Navbar 2026 - Platform Real Estate
 * تم التحسين لضمان توافق الـ Sidebar مع الـ RTL الصارم وتوحيد الروابط.
 */
export default function Navbar({ lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [sanityLocations, setSanityLocations] = useState([]);
  
  const pathname = usePathname();
  const currentLang = lang || pathname?.split('/')[1] || 'ar';
  const isAr = currentLang === 'ar';

  const isHomePage = pathname === `/${currentLang}` || pathname === `/${currentLang}/`;

  // 1. مراقبة التمرير
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // 2. جلب المناطق بذكاء
  useEffect(() => {
    let isSubscribed = true;
    const fetchLocations = async () => {
      try {
        const query = `*[_type == "location" && defined(slug.current)] | order(order asc) { nameAr, nameEn, "slug": slug.current }`;
        const data = await client.fetch(query, {}, { next: { revalidate: 3600 } });
        if (isSubscribed) setSanityLocations(data);
      } catch (error) {
        console.error("Navbar intelligence error:", error);
      }
    };
    fetchLocations();
    return () => { isSubscribed = false; };
  }, []);

  // 3. إدارة حالة الموبايل
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setIsLocationsOpen(false);
  }, []);

  // توحيد روابط اللغة
  const switchLangPath = useMemo(() => {
    if (!pathname) return isAr ? '/en/' : '/ar/';
    const segments = pathname.split('/').filter(Boolean);
    segments[0] = isAr ? 'en' : 'ar';
    return `/${segments.join('/')}/`;
  }, [pathname, isAr]);

  // منطق الروابط النشطة
  const isActive = (href) => {
    const normalizedPath = pathname?.endsWith('/') ? pathname : `${pathname}/`;
    const normalizedHref = href?.endsWith('/') ? href : `${href}/`;
    return normalizedPath === normalizedHref;
  };

  const navBackground = (isHomePage && !scrolled) 
    ? 'bg-transparent py-6' 
    : 'bg-white/90 backdrop-blur-2xl shadow-sm py-3 lg:py-4';

  const textColor = (isHomePage && !scrolled) 
    ? 'text-white hover:text-[#C02026]' 
    : 'text-slate-900 hover:text-[#C02026]';

  const logoFilter = (isHomePage && !scrolled) ? 'brightness-0 invert' : '';

  return (
    <>
      <nav 
        className={`fixed w-full z-[9999] transition-all duration-500 font-sans ${navBackground}`} 
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="flex justify-between items-center h-full">
            
            {/* 🏗️ Logo Section */}
            <div className="shrink-0">
              <Link href={`/${currentLang}/`} className="block relative z-50">
              <div className={`relative transition-all duration-500 ${scrolled || !isHomePage ? 'w-24 h-10' : 'w-32 h-14'}`}>
  <Image 
    src="/logo.webp" 
    fill 
    priority
    fetchPriority="high" 
    decoding="async"
    sizes="150px" 
    alt="Platform Real Estate" 
    // ✅ تم نقل الخاصية هنا كمكانها الصحيح كـ Prop
    unoptimized={true} 
    className={`object-contain transition-all duration-500 ${logoFilter}`} 
  />
</div>
              </Link>
            </div>

            {/* 💻 Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 gap-10">
              <Link href={`/${currentLang}/`} className={`text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${textColor} ${isActive(`/${currentLang}/`) ? '!text-[#C02026]' : ''}`}>
                {isAr ? 'الرئيسية' : 'Home'}
              </Link>
              
              <Link href={`/${currentLang}/about-us/`} className={`text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${textColor} ${isActive(`/${currentLang}/about-us/`) ? '!text-[#C02026]' : ''}`}>
                {isAr ? 'من نحن' : 'Legacy'}
              </Link>
              
              <div className="relative group h-10 flex items-center"> 
                <button className={`flex items-center gap-2 text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${textColor} ${pathname.includes('locations') ? '!text-[#C02026]' : ''}`}>
                  {isAr ? 'المشاريع' : 'Hotspots'} 
                  <ChevronDown size={14} className="group-hover:-rotate-180 transition-transform duration-500" />
                </button>
                
                <div className="absolute top-full pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-[300px] ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2">
                  <div className="bg-white rounded-[2rem] shadow-xl border border-slate-50 overflow-hidden p-3 text-start">
                    <div className="grid gap-1">
                        {sanityLocations.slice(0, 8).map((loc) => (
                          <Link key={loc.slug} href={`/${currentLang}/locations/${loc.slug}/`} className="flex items-center gap-4 px-5 py-3.5 text-xs font-black text-slate-700 hover:bg-slate-50 hover:text-[#C02026] transition-all rounded-2xl group/item">
                            <MapPin size={16} className="text-slate-300 group-hover/item:text-[#C02026]" />
                            <span className="italic uppercase tracking-tighter">{isAr ? loc.nameAr : loc.nameEn}</span>
                          </Link>
                        ))}
                    </div>
                    <div className="p-2 mt-2 border-t border-slate-50">
                      <Link href={`/${currentLang}/locations/`} className="flex items-center justify-center w-full py-4 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#C02026] transition-all">
                        {isAr ? 'استكشف كافة المناطق' : 'All Hotspots'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href={`/${currentLang}/developers/`} className={`text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${textColor} ${isActive(`/${currentLang}/developers/`) ? '!text-[#C02026]' : ''}`}>
                {isAr ? 'المطورون' : 'Titans'}
              </Link>

              <Link href={`/${currentLang}/blog/`} className={`text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${textColor} ${isActive(`/${currentLang}/blog/`) ? '!text-[#C02026]' : ''}`}>
                {isAr ? 'المدونة' : 'Insights'}
              </Link>
            </div>

            {/* ⚡ Actions Section */}
            <div className="hidden lg:flex items-center justify-end gap-5 shrink-0">
              <Link href={switchLangPath} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[11px] uppercase tracking-widest ${textColor}`}>
                <Globe size={16} className="text-[#C02026]" />
                <span>{isAr ? 'English' : 'العربية'}</span>
              </Link>
              
              <Link href={`/${currentLang}/contact/`} className={`
                flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl active:scale-95
                ${(isHomePage && !scrolled) 
                    ? 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-slate-950' 
                    : 'bg-[#C02026] text-white hover:bg-slate-950'}
              `}>
                <MessageSquare size={16} /> {isAr ? 'تواصل معنا' : 'Enquire'}
              </Link>
            </div>

            {/* 📱 Mobile Toggle */}
            <button 
                aria-label={isOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsOpen(!isOpen)} 
                className={`lg:hidden p-3 rounded-2xl transition-all active:scale-90 ${isOpen ? 'bg-slate-100 text-slate-900' : (isHomePage && !scrolled ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-900')}`}
            >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* 📱 Mobile Sidebar */}
      <div className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[10000] lg:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={closeMenu} />
      
      {/* ✅ RTL Sidebar Logic: يفتح من اليسار في العربي ومن اليمين في الإنجليزي */}
      <div 
        className={`fixed inset-y-0 z-[10001] w-[85%] max-w-[360px] bg-white flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl ltr:right-0 rtl:left-0 ${isOpen ? 'translate-x-0' : 'ltr:translate-x-[110%] rtl:-translate-x-[110%]'}`}
      >
        <div className="p-8 flex items-center justify-between border-b border-slate-50">
          <div className="relative w-28 h-10">
            <Image src="/logo.webp" alt="Platform Logo" fill loading="lazy" decoding="async" className="object-contain" sizes="112px" unoptimized={true} />  
          </div>
          <button onClick={closeMenu} className="p-3 bg-slate-50 rounded-2xl text-slate-500"><X size={22}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-3 text-start">
            <MobileLink href={`/${currentLang}/`} icon={<Home size={20}/>} label={isAr ? 'الرئيسية' : 'Home'} active={isActive(`/${currentLang}/`)} onClick={closeMenu} />
            <MobileLink href={`/${currentLang}/about-us/`} icon={<LayoutGrid size={20}/>} label={isAr ? 'من نحن' : 'Legacy'} active={isActive(`/${currentLang}/about-us/`)} onClick={closeMenu} />
            
            <div className="space-y-2">
              <button 
                onClick={() => setIsLocationsOpen(!isLocationsOpen)}
                className={`flex items-center justify-between w-full p-4 rounded-2xl font-black text-sm uppercase transition-all ${isLocationsOpen ? 'bg-slate-50 text-[#C02026]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4"><MapPin size={20} /> {isAr ? 'المشاريع' : 'Hotspots'}</div>
                <ChevronDown size={18} className={`transition-transform duration-500 ${isLocationsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`grid transition-all duration-500 ease-in-out ${isLocationsOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
                <div className="overflow-hidden ps-10 space-y-1 border-s-2 border-slate-50 ms-6">
                    {sanityLocations.map((loc) => (
                        <Link key={loc.slug} href={`/${currentLang}/locations/${loc.slug}/`} onClick={closeMenu} className="block py-3 text-xs font-bold text-slate-500 hover:text-[#C02026] italic uppercase">
                          {isAr ? loc.nameAr : loc.nameEn}
                        </Link>
                    ))}
                </div>
              </div>
            </div>

            <MobileLink href={`/${currentLang}/developers/`} icon={<Building2 size={20}/>} label={isAr ? 'المطورون' : 'Titans'} active={isActive(`/${currentLang}/developers/`)} onClick={closeMenu} />
            <MobileLink href={`/${currentLang}/blog/`} icon={<Newspaper size={20}/>} label={isAr ? 'المدونة' : 'Insights'} active={isActive(`/${currentLang}/blog/`)} onClick={closeMenu} />
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/50 space-y-4">
          <Link href={switchLangPath} className="flex items-center justify-center gap-3 w-full py-5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
            <Globe size={18} className="text-[#C02026]" /> {isAr ? 'English Version' : 'النسخة العربية'}
          </Link>
          <Link href={`/${currentLang}/contact/`} onClick={closeMenu} className="flex items-center justify-center gap-3 w-full py-5 bg-[#C02026] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#C02026]/20">
            <Phone size={18} /> {isAr ? 'تواصل معنا' : 'Get In Touch'}
          </Link>
        </div>
      </div>
    </>
  );
}

function MobileLink({ href, icon, label, active, onClick }) {
  return (
    <Link 
      href={href} 
      onClick={onClick} 
      className={`flex items-center gap-4 p-4 rounded-2xl font-black text-sm uppercase tracking-tighter italic transition-all ${active ? 'bg-[#C02026] text-white shadow-xl' : 'text-slate-700 hover:bg-slate-50'}`}
    >
      {icon} {label}
    </Link>
  );
}