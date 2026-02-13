'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Globe, MessageSquare, ChevronDown, MapPin, Newspaper, Home, Building2, LayoutGrid, Phone } from 'lucide-react';
import { client } from '../sanity/client'; 

export default function Navbar({ lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [sanityLocations, setSanityLocations] = useState([]);
  
  const pathname = usePathname();
  const router = useRouter();
  
  const currentLang = pathname?.split('/')[1] || lang || 'ar';
  const isAr = currentLang === 'ar';

  const isHomePage = pathname === `/${currentLang}` || pathname === `/${currentLang}/`;

  // 1. تحسين الأداء
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // 2. جلب المناطق
  useEffect(() => {
    let isSubscribed = true;
    const fetchLocations = async () => {
      try {
        const query = `*[_type == "location" && defined(slug.current)] | order(order asc) { nameAr, nameEn, "slug": slug.current }`;
        const data = await client.fetch(query);
        if (isSubscribed) setSanityLocations(data);
      } catch (error) {
        console.error("Navbar fetch error:", error);
      }
    };
    fetchLocations();
    return () => { isSubscribed = false; };
  }, []);

  // 3. منع سكرول الجسم عند فتح المنيو
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setIsLocationsOpen(false);
  }, []);
  
  const scrollToTop = useCallback((e) => {
    if (pathname === `/${currentLang}` || pathname === `/${currentLang}/`) { 
      e.preventDefault(); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
    closeMenu();
  }, [pathname, currentLang, closeMenu]);

  const switchLangPath = useMemo(() => {
    if (!pathname) return isAr ? '/en' : '/ar';
    const segments = pathname.split('/');
    if (segments.length < 2) return isAr ? '/en' : '/ar';
    segments[1] = isAr ? 'en' : 'ar';
    return segments.join('/') || `/${segments[1]}`;
  }, [pathname, isAr]);

  const isActive = (href) => {
    if (href.includes('#')) return pathname === `/${currentLang}` && href.includes('about');
    return pathname === href || (pathname.startsWith(href) && href !== `/${currentLang}`);
  };

  // --- الستايل ---
  const navBackground = (isHomePage && !scrolled) 
    ? 'bg-transparent py-4 lg:py-6' 
    : 'bg-white/95 backdrop-blur-xl shadow-md py-2 lg:py-3';

  const textColor = (isHomePage && !scrolled) 
    ? 'text-white hover:text-white/80' 
    : 'text-slate-700 hover:text-[#C02026]';

  const logoFilter = (isHomePage && !scrolled) ? 'brightness-0 invert' : '';
  const mobileBtnColor = (isHomePage && !scrolled && !isOpen) ? 'text-white' : 'text-slate-800';

  return (
    <>
      <nav 
        // ✅ التعديل هنا: رفعنا الـ Z-Index لـ 9999 لضمان إنه فوق أي سيرش بار
        className={`fixed w-full z-[9999] transition-all duration-300 ease-in-out font-sans ${navBackground}`} 
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            
            {/* Logo */}
            <div className="shrink-0 w-[100px] lg:w-[120px]">
              <Link href={`/${currentLang}`} onClick={scrollToTop} className="block relative z-50">
                <div className={`relative transition-all duration-300 ${scrolled || !isHomePage ? 'w-24 h-10' : 'w-28 h-12'}`}>
                  <Image 
                    src="/logo.png" 
                    fill 
                    priority 
                    sizes="(max-width: 768px) 100px, 120px" 
                    alt="Logo" 
                    className={`object-contain transition-all duration-300 ${logoFilter}`} 
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center justify-center flex-1 gap-8 xl:gap-10">
              <Link href={`/${currentLang}`} onClick={scrollToTop} className={`font-bold text-[15px] transition-colors ${textColor} ${isActive(`/${currentLang}`) ? '!text-[#C02026] font-black' : ''}`}>
                {isAr ? 'الرئيسية' : 'Home'}
              </Link>
              
              <Link href={`/${currentLang}/about-us`} className={`font-bold text-[15px] transition-colors ${textColor} ${isActive(`/${currentLang}/about-us`) ? '!text-[#C02026] font-black' : ''}`}>
                {isAr ? 'من نحن' : 'About us'}
              </Link>
              
              <div className="relative group h-10 flex items-center"> 
                <button className={`flex items-center gap-1 font-bold text-[15px] transition-colors ${textColor} ${pathname.includes('locations') ? '!text-[#C02026] font-black' : ''}`}>
                  {isAr ? 'المشاريع' : 'Projects'} 
                  <ChevronDown size={14} className="group-hover:-rotate-180 transition-transform duration-300" />
                </button>
                
                {/* Mega Menu - Z-Index controlled by parent nav */}
                <div className="absolute top-full pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-[280px] ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                    {sanityLocations.length > 0 ? (
                      sanityLocations.map((loc) => (
                        <Link key={loc.slug} href={`/${currentLang}/locations/${loc.slug}`} className="flex items-center gap-3 px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#C02026] transition-colors">
                          <MapPin size={14} className="text-gray-300 shrink-0" />
                          <span className="truncate">{isAr ? loc.nameAr : loc.nameEn}</span>
                        </Link>
                      ))
                    ) : (
                      <p className="px-6 py-2 text-xs text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
                    )}
                    <div className="p-2 mt-1 bg-gray-50/50">
                      <Link href={`/${currentLang}/locations`} className="flex items-center justify-center w-full py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-[#C02026] hover:bg-[#C02026] hover:text-white transition-all">
                        {isAr ? 'عرض كل المناطق' : 'View All Locations'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href={`/${currentLang}/developers`} className={`font-bold text-[15px] transition-colors ${textColor} ${isActive(`/${currentLang}/developers`) ? '!text-[#C02026] font-black' : ''}`}>
                {isAr ? 'المطورون' : 'Developers'}
              </Link>

              <Link href={`/${currentLang}/blog`} className={`font-bold text-[15px] transition-colors ${textColor} ${isActive(`/${currentLang}/blog`) ? '!text-[#C02026] font-black' : ''}`}>
                {isAr ? 'المدونة' : 'Blog'}
              </Link>
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center justify-end gap-3 shrink-0">
              <Link href={switchLangPath} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors group ${textColor}`}>
                <Globe size={16} className={isHomePage && !scrolled ? "text-white" : "text-gray-400 group-hover:text-[#C02026]"} />
                <span className="text-[13px] font-bold">{isAr ? 'English' : 'العربية'}</span>
              </Link>
              
              <Link href={`/${currentLang}/contact`} className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all
                ${(isHomePage && !scrolled) 
                    ? 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-[#C02026]' 
                    : 'bg-[#C02026] text-white shadow-lg shadow-[#C02026]/20 hover:bg-[#a01a20]'}
              `}>
                <MessageSquare size={16} /> {isAr ? 'تواصل معنا' : 'Contact'}
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`lg:hidden p-2 rounded-lg transition-colors ${mobileBtnColor}`}
                aria-label="Toggle Menu"
            >
              {isOpen ? <X size={28} className="text-slate-800 relative z-[130]" /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar System */}
      {/* 1. Overlay - لازم يكون أعلى من الناف بار */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={closeMenu} 
      />
      
      {/* 2. Drawer Content - أعلى من الـ Overlay */}
      <div 
        className="fixed inset-y-0 z-[10001] w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-out"
        style={{ 
          left: isAr ? '0' : 'auto', 
          right: isAr ? 'auto' : '0', 
          transform: isOpen ? 'translateX(0)' : (isAr ? 'translateX(-100%)' : 'translateX(100%)') 
        }}
      >
        {/* Header inside Sidebar */}
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <div className="relative w-24 h-10"><Image src="/logo.png" alt="Logo" fill className="object-contain" /></div>
          <button onClick={closeMenu} className="p-2 bg-gray-50 rounded-full text-slate-500 hover:bg-red-50 hover:text-[#C02026] transition-colors"><X size={24}/></button>
        </div>

        {/* Scrollable Links */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
          <nav className="space-y-2 text-start pb-20"> 
            <Link href={`/${currentLang}`} onClick={scrollToTop} className="flex items-center gap-3 text-base font-black text-slate-800 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <Home size={20} className="text-[#C02026]" /> {isAr ? 'الرئيسية' : 'Home'}
            </Link>

            <Link href={`/${currentLang}/about-us`} onClick={closeMenu} className="flex items-center gap-3 text-base font-black text-slate-800 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <LayoutGrid size={20} className="text-slate-400" /> {isAr ? 'من نحن' : 'About Us'}
            </Link>

            <div className="space-y-1">
              <button 
                onClick={() => setIsLocationsOpen(!isLocationsOpen)}
                className="flex items-center justify-between w-full text-base font-black text-slate-800 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-slate-400" />
                  {isAr ? 'المشاريع' : 'Projects'}
                </div>
                <ChevronDown size={18} className={`transition-transform duration-300 ${isLocationsOpen ? 'rotate-180 text-[#C02026]' : 'text-slate-400'}`} />
              </button>
              
              <div className={`grid transition-all duration-300 ease-in-out ${isLocationsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden ps-10">
                    <div className="space-y-2 py-2 border-s-2 border-gray-100 ps-4">
                        {sanityLocations.map((loc) => (
                            <Link 
                            key={loc.slug} 
                            href={`/${currentLang}/locations/${loc.slug}`} 
                            onClick={closeMenu}
                            className="block py-1.5 text-sm font-bold text-slate-500 hover:text-[#C02026] hover:translate-x-1 transition-all"
                            >
                            {isAr ? loc.nameAr : loc.nameEn}
                            </Link>
                        ))}
                        <Link 
                            href={`/${currentLang}/locations`} 
                            onClick={closeMenu}
                            className="block py-2 text-sm font-black text-[#C02026] underline decoration-2 underline-offset-4"
                        >
                            {isAr ? 'كل المناطق...' : 'All Locations...'}
                        </Link>
                    </div>
                </div>
              </div>
            </div>

            <Link href={`/${currentLang}/developers`} onClick={closeMenu} className="flex items-center gap-3 text-base font-black text-slate-800 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <Building2 size={20} className="text-slate-400" /> {isAr ? 'المطورون' : 'Developers'}
            </Link>
            
            <Link href={`/${currentLang}/blog`} onClick={closeMenu} className="flex items-center gap-3 text-base font-black text-slate-800 p-3 hover:bg-gray-50 rounded-xl transition-colors">
               <Newspaper size={20} className="text-slate-400" /> {isAr ? 'المدونة' : 'Blog'}
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-gray-50 bg-gray-50/50 space-y-4">
          <Link href={switchLangPath} className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-700 shadow-sm active:scale-95 transition-transform">
            <Globe size={18} className="text-[#C02026]" /> {isAr ? 'English Version' : 'النسخة العربية'}
          </Link>
          <Link href={`/${currentLang}/contact`} onClick={closeMenu} className="flex items-center justify-center gap-2 w-full py-3 bg-[#C02026] text-white rounded-xl text-sm font-black shadow-lg shadow-[#C02026]/20 active:scale-95 transition-transform">
            <Phone size={18} /> {isAr ? 'تواصل معنا' : 'Contact Us'}
          </Link>
        </div>
      </div>
    </>
  );
}