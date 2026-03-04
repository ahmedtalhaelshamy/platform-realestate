'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { 
  Search, MapPin, Building2, LayoutGrid, X, ArrowUpRight,
  Home, ShoppingBag, Briefcase, Stethoscope, Palmtree,
  Loader2, Navigation, Target
} from 'lucide-react';

import { client } from '@/sanity/client'; 
import { CONTACT_INFO } from '@/components/constants/contact';

const TYPE_CONFIG = {
  residential: { icon: Home, color: 'text-emerald-700', bg: 'bg-emerald-50', ar: 'سكني', en: 'Residential' },
  commercial: { icon: ShoppingBag, color: 'text-amber-700', bg: 'bg-amber-50', ar: 'تجاري', en: 'Commercial' },
  administrative: { icon: Briefcase, color: 'text-blue-700', bg: 'bg-blue-50', ar: 'إداري', en: 'Admin' },
  medical: { icon: Stethoscope, color: 'text-rose-700', bg: 'bg-rose-50', ar: 'طبي', en: 'Medical' },
  coastal: { icon: Palmtree, color: 'text-cyan-700', bg: 'bg-cyan-50', ar: 'ساحلي', en: 'Coastal' },
  default: { icon: LayoutGrid, color: 'text-slate-600', bg: 'bg-slate-100', ar: 'مشروع', en: 'Project' }
};

export default function SearchBar({ lang }) {
  const router = useRouter();
  const isAr = lang === 'ar';
  const dropdownRef = useRef(null);

  const [data, setData] = useState({ projects: [], developers: [], districts: [] });
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchSearchIntel() {
      try {
        const groqQuery = `{
          "projects": *[_type == "project" && !(_id in path("drafts.**"))] | order(isFeatured desc)[0...20]{ 
            _id, 
            "title": coalesce(${isAr ? 'titleAr' : 'titleEn'}, titleEn, titleAr), 
            "slug": slug.current, 
            projectType,
            "districtName": coalesce(district->nameAr, district->nameEn, "N/A")
          },
          "developers": *[_type == "developer" && !(_id in path("drafts.**"))][0...12]{ 
            _id, 
            "name": coalesce(${isAr ? 'nameAr' : 'nameEn'}, nameEn, nameAr), 
            "slug": slug.current 
          },
          "districts": *[_type == "district" && !(_id in path("drafts.**"))]{ 
            _id, 
            "name": coalesce(${isAr ? 'nameAr' : 'nameEn'}, nameEn, nameAr), 
            "slug": slug.current 
          }
        }`;
        const result = await client.fetch(groqQuery, {}, { next: { revalidate: 3600 } });
        if (isMounted) setData(result);
      } catch (err) {
        console.error("Search Intel Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSearchIntel();
    return () => { isMounted = false; };
  }, [isAr]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return { projects: [], developers: [], districts: [] };
    const term = query.toLowerCase().trim();
    return {
      projects: data.projects.filter(p => p.title?.toLowerCase().includes(term) || p.districtName?.toLowerCase().includes(term)).slice(0, 5),
      developers: data.developers.filter(d => d.name?.toLowerCase().includes(term)).slice(0, 3),
      districts: data.districts.filter(dist => dist.name?.toLowerCase().includes(term)).slice(0, 3)
    };
  }, [query, data]);

  const showDropdown = isFocused && (query.length > 0 || data.projects.length > 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 relative z-[100] -mt-10 md:-mt-14" ref={dropdownRef}>
      
      {/* 🔍 Search Container */}
      <form 
        onSubmit={(e) => { e.preventDefault(); if (query.trim()) router.push(`/${lang}/projects/?search=${query}`); }}
        className={`
          bg-white/95 backdrop-blur-xl p-2 md:p-3 rounded-[3rem] transition-all duration-500 flex items-center 
          border-none outline-none ring-0 overflow-visible
          ${isFocused 
            ? 'shadow-[0_0_0_2px_#C02026,0_40px_100px_-15px_rgba(192,32,38,0.25)]' 
            : 'shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_70px_-10px_rgba(0,0,0,0.15)]'
          }
        `}
      >
        {/* ✅ A11y Fix: تغيير text-slate-300 إلى 400 لتباين أفضل */}
        <div className={`flex items-center justify-center ps-4 md:ps-6 transition-colors ${isFocused ? 'text-[#C02026]' : 'text-slate-400'}`}>
          {loading ? <Loader2 size={24} className="animate-spin opacity-30" /> : <Search size={28} strokeWidth={2.5} />}
        </div>

        <div className="flex-1 relative px-2">
           <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن منطقة، كمبوند، أو مطور...' : 'Search area, compound, or titan...'}
            aria-label={isAr ? 'مربع البحث' : 'Search input'} // ✅ A11y Fix: قارئ الشاشة
            /* ✅ تم إضافة padding جانبي (px-4) وارتفاع سطر (leading-relaxed) لمنع تآكل الحروف وتعديل لون الـ placeholder للتباين */
            className="
              w-full bg-transparent border-none outline-none ring-0 
              focus:ring-0 focus:outline-none focus:border-none
              px-4 py-4 md:py-6 text-lg md:text-xl text-slate-900 font-extrabold 
              placeholder:text-slate-400 placeholder:font-bold italic tracking-tight
              appearance-none leading-relaxed block
            "
            style={{ 
              boxShadow: 'none', 
              outline: 'none',
              WebkitAppearance: 'none'
            }}
          />
        </div>

        {query && (
          <button 
            type="button" 
            onClick={() => setQuery('')} 
            className="p-3 text-slate-400 hover:text-red-500 transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full"
            aria-label={isAr ? 'مسح البحث' : 'Clear search'} // ✅ A11y Fix
          >
            <X size={22} />
          </button>
        )}

        <button 
          type="submit" 
          className="
            hidden md:flex bg-[#C02026] text-white px-12 py-5 rounded-[2rem] font-black items-center gap-3 
            hover:bg-slate-950 transition-all shadow-xl uppercase italic tracking-widest active:scale-95 shrink-0
            outline-none focus-visible:ring-4 focus-visible:ring-[#C02026]/30
          "
        >
          {isAr ? 'بحث' : 'Find'}
        </button>
      </form>

      {/* 📂 Results Dropdown */}
      {showDropdown && (
        <div className="absolute top-full inset-x-4 mt-6 bg-white/98 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.25)] border border-slate-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 text-start">
          <div className="max-h-[65vh] overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#C02026] uppercase flex items-center gap-3 tracking-[0.5em] italic opacity-60">
                <Target size={16} aria-hidden="true" /> {query ? (isAr ? 'المشاريع المطابقة' : 'Top Matches') : (isAr ? 'مشاريع مقترحة' : 'Spotlight')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(query ? suggestions.projects : data.projects.slice(0, 6)).map(p => {
                  const type = TYPE_CONFIG[p.projectType] || TYPE_CONFIG.default;
                  return (
                    <Link key={p._id} href={`/${lang}/projects/${p.slug}/`} onClick={() => setIsFocused(false)} className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-2xl border border-transparent hover:border-red-100 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${type.bg} ${type.color} group-hover:scale-110 transition-transform`}>
                        <type.icon size={24} aria-hidden="true" />
                      </div>
                      
                      {/* ✅ إضافة ps-1 لمنع تآكل أول حرف في النتائج المقترحة */}
                      <div className="flex-1 min-w-0">
                        <span className="block font-black text-slate-950 group-hover:text-[#C02026] text-lg leading-[1.4] mb-1 italic tracking-tight ps-1 truncate">
                          {p.title}
                        </span>
                        <div className="flex items-center gap-2 ps-1">
                            <MapPin size={12} className="text-slate-400" aria-hidden="true" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{p.districtName}</span>
                        </div>
                      </div>
                      {/* ✅ RTL Hover Fix: السهم بيتحرك يمين في الانجلش وشمال في العربي */}
                      <ArrowUpRight size={20} className="text-slate-300 group-hover:text-[#C02026] transition-all transform group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 group-hover:-translate-y-1 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-50 pt-10 text-start">
               <div className="space-y-6">
                  {/* ✅ A11y Fix: text-slate-500 instead of 400 */}
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic flex items-center gap-3 ps-2">
                    <Navigation size={14} aria-hidden="true" /> {isAr ? 'أهم المناطق' : 'Prime Hubs'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(query ? suggestions.districts : data.districts.slice(0, 6)).map(d => (
                      <Link key={d._id} href={`/${lang}/districts/${d.slug}/`} onClick={() => setIsFocused(false)} className="px-5 py-3 bg-slate-50 rounded-2xl text-[11px] font-black text-slate-600 hover:bg-[#C02026] hover:text-white transition-all uppercase tracking-tighter italic border border-slate-100 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
                        {d.name}
                      </Link>
                    ))}
                  </div>
               </div>
               <div className="space-y-6">
                  {/* ✅ A11y Fix: text-slate-500 instead of 400 */}
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic flex items-center gap-3 ps-2">
                    <Building2 size={14} aria-hidden="true" /> {isAr ? 'المطورون' : 'The Titans'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(query ? suggestions.developers : data.developers.slice(0, 6)).map(dev => (
                      <Link key={dev._id} href={`/${lang}/developers/${dev.slug}/`} onClick={() => setIsFocused(false)} className="px-5 py-3 bg-white border-2 border-slate-50 rounded-2xl text-[11px] font-black text-slate-900 hover:border-[#C02026] hover:text-[#C02026] transition-all italic shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
                        {dev.name}
                      </Link>
                    ))}
                  </div>
               </div>
            </div>

          </div>
          
          <div className="p-6 bg-slate-950 text-center">
             <Link href={`/${lang}/projects/`} className="text-[10px] font-black text-white/50 hover:text-white uppercase tracking-[0.5em] transition-colors outline-none focus-visible:text-brand-red">
                {isAr ? 'استكشف كافة العقارات المتاحة' : 'Discover full market portfolio'}
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}