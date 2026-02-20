'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { 
  Search, MapPin, Building2, LayoutGrid, X, ArrowUpRight,
  Home, ShoppingBag, Briefcase, Stethoscope, Palmtree,
  MessageCircle, TrendingUp, Loader2, Navigation
} from 'lucide-react';

import { client } from '@/sanity/client'; 
import { CONTACT_INFO } from '@/components/constants/contact';

// ✅ دالة الأمان لمنع خطأ الـ Objects
const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map(child => child.text).join('')).join(' ');
  }
  return String(val);
};

const TYPE_CONFIG = {
  residential: { icon: Home, color: 'text-emerald-700', bg: 'bg-emerald-50', labelAr: 'سكني', labelEn: 'Residential' },
  commercial: { icon: ShoppingBag, color: 'text-amber-700', bg: 'bg-amber-50', labelAr: 'تجاري', labelEn: 'Commercial' },
  administrative: { icon: Briefcase, color: 'text-blue-700', bg: 'bg-blue-50', labelAr: 'إداري', labelEn: 'Admin' },
  medical: { icon: Stethoscope, color: 'text-rose-700', bg: 'bg-rose-50', labelAr: 'طبي', labelEn: 'Medical' },
  coastal: { icon: Palmtree, color: 'text-cyan-700', bg: 'bg-cyan-50', labelAr: 'ساحلي', labelEn: 'Coastal' },
  default: { icon: LayoutGrid, color: 'text-slate-600', bg: 'bg-slate-100', labelAr: 'مشروع', labelEn: 'Project' }
};

export default function SearchBar({ lang }) {
  const router = useRouter();
  const isAr = lang === 'ar';
  const dropdownRef = useRef(null);

  const [data, setData] = useState({ projects: [], developers: [], locations: [], districts: [] });
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetching Data - تم تصحيح مسارات الـ GROQ لضمان جلب البيانات
  useEffect(() => {
    async function fetchAllData() {
      try {
        const groqQuery = `{
          "projects": *[_type == "project" && !(_id in path("drafts.**"))]{ 
            _id, titleAr, titleEn, "slug": slug.current, projectType,
            "districtNameAr": district->nameAr, 
            "districtNameEn": district->nameEn 
          },
          "developers": *[_type == "developer" && !(_id in path("drafts.**"))]{ _id, nameAr, nameEn, "slug": slug.current },
          "locations": *[_type == "location" && !(_id in path("drafts.**"))]{ _id, nameAr, nameEn, "slug": slug.current },
          "districts": *[_type == "district" && !(_id in path("drafts.**"))]{ _id, nameAr, nameEn, "slug": slug.current }
        }`;
        const result = await client.fetch(groqQuery);
        setData(result);
      } catch (err) {
        console.error("Search Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  // 2. Search Logic - تحسين منطق البحث ليكون أكثر مرونة
  const suggestions = useMemo(() => {
    if (!query || query.trim().length < 1) return { projects: [], developers: [], locations: [], districts: [] };
    
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    
    const filterFn = (item, fields) => {
      const content = fields.map(f => (getSafeText(item[f]) || '').toLowerCase()).join(' ');
      return searchTerms.every(term => content.includes(term));
    };

    return {
      projects: (data.projects || []).filter(p => filterFn(p, ['titleAr', 'titleEn', 'districtNameAr', 'districtNameEn'])).slice(0, 5),
      developers: (data.developers || []).filter(d => filterFn(d, ['nameAr', 'nameEn'])).slice(0, 3),
      locations: (data.locations || []).filter(l => filterFn(l, ['nameAr', 'nameEn'])).slice(0, 3),
      districts: (data.districts || []).filter(dist => filterFn(dist, ['nameAr', 'nameEn'])).slice(0, 3)
    };
  }, [query, data]);

  const showDropdown = isFocused && (query.length >= 1 || (query.length === 0 && data.projects.length > 0));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      // ✅ توحيد الرابط بـ / في النهاية
      router.push(`/${lang}/projects/?search=${encodeURIComponent(query)}`);
      setIsFocused(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 relative z-[100] -mt-10 md:-mt-12" ref={dropdownRef}>
      
      <form 
        onSubmit={handleSearchSubmit}
        className={`bg-white p-1.5 md:p-2 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] border-2 transition-all duration-500 flex items-center gap-2 ${
          isFocused ? 'border-[#C02026] ring-8 ring-red-500/5' : 'border-transparent'
        }`}
      >
        <div className="ps-6 text-slate-400">
          {loading ? (
            <Loader2 size={24} className="animate-spin text-[#C02026]" />
          ) : (
            <Search size={26} className={isFocused ? 'text-[#C02026]' : ''} aria-hidden="true" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isAr ? 'ابحث عن حي، كومبوند، أو مطور...' : 'Search district, compound, or developer...'}
          className="flex-1 bg-transparent border-none outline-none py-5 md:py-6 text-base md:text-2xl text-slate-900 font-bold placeholder:text-slate-400 placeholder:italic"
          aria-label={isAr ? "خانة البحث" : "Search input"}
        />

        {query && (
          <button 
            type="button" 
            onClick={() => setQuery('')} 
            className="p-3 text-slate-300 hover:text-[#C02026] transition-colors"
            aria-label="Clear"
          >
            <X size={24} />
          </button>
        )}

        <button 
          type="submit" 
          className="hidden md:flex bg-[#C02026] text-white px-12 py-5 rounded-[1.8rem] font-black items-center gap-3 hover:bg-slate-900 transition-all shadow-xl uppercase italic tracking-tighter"
        >
          {isAr ? 'ابحث الآن' : 'Search'}
        </button>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-5 bg-white/95 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="max-h-[75vh] overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar text-start">
            
            {/* 📈 Trending Section */}
            {query.length === 0 && data.projects.length > 0 && (
               <div className="space-y-8">
                  <h4 className="text-[11px] font-black text-[#C02026] uppercase flex items-center gap-3 tracking-[0.4em] italic">
                    <TrendingUp size={18} /> {isAr ? 'الأكثر بحثاً الآن' : 'Trending Now'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {data.projects.slice(0, 4).map(p => (
                       <Link 
                        key={p._id} 
                        href={`/${lang}/projects/${p.slug}/`} 
                        onClick={() => setIsFocused(false)} 
                        className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-red-100 group"
                       >
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#C02026] italic font-black shadow-sm group-hover:bg-[#C02026] group-hover:text-white transition-colors">P</div>
                          <span className="font-black text-slate-900 text-base">{isAr ? getSafeText(p.titleAr) : getSafeText(p.titleEn)}</span>
                       </Link>
                    ))}
                  </div>
               </div>
            )}

            {/* 🏙️ Projects Results */}
            {suggestions.projects.length > 0 && (
              <div className="space-y-8">
                <h4 className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-3 tracking-[0.4em] italic">
                  <LayoutGrid size={18} /> {isAr ? 'المشاريع المطابقة' : 'Matching Projects'}
                </h4>
                <div className="space-y-3">
                  {suggestions.projects.map(project => {
                    const typeData = TYPE_CONFIG[project.projectType] || TYPE_CONFIG.default;
                    return (
                      <Link 
                        key={project._id} 
                        href={`/${lang}/projects/${project.slug}/`} 
                        onClick={() => setIsFocused(false)} 
                        className="flex items-center justify-between p-5 rounded-[2rem] hover:bg-slate-50 group transition-all"
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${typeData.bg} ${typeData.color}`}>
                             <typeData.icon size={24} />
                          </div>
                          <div>
                            <span className="block font-black text-slate-950 text-lg group-hover:text-[#C02026] transition-colors italic tracking-tighter">
                              {isAr ? getSafeText(project.titleAr) : getSafeText(project.titleEn)}
                            </span>
                            <span className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                               <MapPin size={12} className="text-[#C02026]" /> {isAr ? getSafeText(project.districtNameAr) : getSafeText(project.districtNameEn)}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight size={22} className="text-slate-200 group-hover:text-[#C02026] transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 🗺️ Districts & Developers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-100 pt-12">
                {(suggestions.districts.length > 0 || suggestions.locations.length > 0) && (
                    <div className="space-y-8">
                        <h4 className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-3 tracking-[0.4em] italic">
                            <Navigation size={18} /> {isAr ? 'المناطق والأحياء' : 'Explore Areas'}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {suggestions.districts.map(dist => (
                                <Link key={dist._id} href={`/${lang}/districts/${dist.slug}/`} onClick={() => setIsFocused(false)} className="px-6 py-3 bg-red-50 border border-red-100 rounded-2xl text-[11px] font-black text-[#C02026] hover:bg-[#C02026] hover:text-white transition-all uppercase tracking-widest">
                                    {isAr ? getSafeText(dist.nameAr) : getSafeText(dist.nameEn)}
                                </Link>
                            ))}
                            {suggestions.locations.map(loc => (
                                <Link key={loc._id} href={`/${lang}/locations/${loc.slug}/`} onClick={() => setIsFocused(false)} className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[11px] font-black text-white hover:bg-[#C02026] transition-all uppercase tracking-widest">
                                    {isAr ? getSafeText(loc.nameAr) : getSafeText(loc.nameEn)}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {suggestions.developers.length > 0 && (
                    <div className="space-y-8">
                        <h4 className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-3 tracking-[0.4em] italic">
                            <Building2 size={18} /> {isAr ? 'المطورين' : 'Titans'}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {suggestions.developers.map(dev => (
                                <Link key={dev._id} href={`/${lang}/developers/${dev.slug}/`} onClick={() => setIsFocused(false)} className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-black text-slate-900 hover:border-[#C02026] hover:text-[#C02026] transition-all uppercase tracking-widest italic">
                                    {isAr ? getSafeText(dev.nameAr) : getSafeText(dev.nameEn)}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ⚠️ Empty State */}
            {query.length >= 1 && Object.values(suggestions).every(arr => arr.length === 0) && (
              <div className="text-center py-16 px-8 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <Search size={48} className="mx-auto text-slate-200 mb-6" />
                <h5 className="text-slate-900 font-black text-xl mb-3 italic uppercase tracking-tighter">{isAr ? 'لا توجد نتائج مطابقة' : "No direct matches"}</h5>
                <p className="text-slate-500 text-base mb-8 max-w-sm mx-auto leading-relaxed font-medium">
                  {isAr ? 'جرب البحث بكلمات عامة أو تواصل مع فريقنا للحصول على عروض حصرية.' : 'Try general keywords or reach out to our team for exclusive off-market deals.'}
                </p>
                <div className="flex justify-center">
                    <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g,'')}`} target="_blank" className="bg-[#25D366] text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:scale-105 transition-transform uppercase italic text-xs tracking-widest">
                      <MessageCircle size={20} fill="currentColor" fillOpacity={0.2} /> {isAr ? 'استشارة سريعة' : 'Quick Access'}
                    </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}