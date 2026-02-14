'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { 
  Search, MapPin, Building2, LayoutGrid, X, ArrowUpRight,
  Home, ShoppingBag, Briefcase, Stethoscope, Palmtree,
  Phone, MessageCircle, TrendingUp, Loader2, Navigation
} from 'lucide-react';

import { client } from '@/sanity/client'; 
import { CONTACT_INFO } from '@/components/constants/contact';

const TYPE_CONFIG = {
  residential: { icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50', labelAr: 'سكني', labelEn: 'Residential' },
  commercial: { icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50', labelAr: 'تجاري', labelEn: 'Commercial' },
  administrative: { icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', labelAr: 'إداري', labelEn: 'Admin' },
  medical: { icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-50', labelAr: 'طبي', labelEn: 'Medical' },
  coastal: { icon: Palmtree, color: 'text-cyan-600', bg: 'bg-cyan-50', labelAr: 'ساحلي', labelEn: 'Coastal' },
  default: { icon: LayoutGrid, color: 'text-slate-500', bg: 'bg-slate-50', labelAr: 'مشروع', labelEn: 'Project' }
};

export default function SearchBar({ lang }) {
  const router = useRouter();
  const isAr = lang === 'ar';
  const dropdownRef = useRef(null);

  const [data, setData] = useState({ projects: [], developers: [], locations: [], districts: [] });
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetching Data - تم إضافة "districts" للاستعلام
  useEffect(() => {
    async function fetchAllData() {
      try {
        const groqQuery = `{
          "projects": *[_type == "project"]{ 
            _id, titleAr, titleEn, "slug": slug.current, projectType,
            "districtNameAr": districtData->nameAr, "districtNameEn": districtData->nameEn 
          },
          "developers": *[_type == "developer"]{ _id, nameAr, nameEn, "slug": slug.current },
          "locations": *[_type == "location"]{ _id, nameAr, nameEn, "slug": slug.current },
          "districts": *[_type == "district"]{ _id, nameAr, nameEn, "slug": slug.current }
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

  // 2. Search Logic - تم إضافة منطق فلترة الأحياء
  const suggestions = useMemo(() => {
    if (!query || query.trim().length < 1) return { projects: [], developers: [], locations: [], districts: [] };
    
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    
    const filterFn = (item, fields) => {
      const content = fields.map(f => (item[f] || '').toLowerCase()).join(' ');
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
      router.push(`/${lang}/projects?search=${encodeURIComponent(query)}`);
      setIsFocused(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 relative z-[100] -mt-10 md:-mt-12" ref={dropdownRef}>
      
      <form 
        onSubmit={handleSearchSubmit}
        className={`bg-white p-1.5 md:p-2 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.12)] border-2 transition-all duration-500 flex items-center gap-2 ${
          isFocused ? 'border-[#C02026] ring-8 ring-red-500/5' : 'border-transparent'
        }`}
      >
        <div className="ps-5 text-slate-400">
          {loading ? <Loader2 size={22} className="animate-spin text-[#C02026]" /> : <Search size={24} className={isFocused ? 'text-[#C02026]' : ''} />}
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isAr ? 'ابحث عن حي، كومبوند، أو مطور...' : 'Search district, compound, or developer...'}
          className="flex-1 bg-transparent border-none outline-none py-4 md:py-5 text-base md:text-xl text-slate-800 font-bold placeholder:text-slate-400"
        />

        {query && (
          <button type="button" onClick={() => setQuery('')} className="p-2 text-slate-300 hover:text-[#C02026] transition-colors">
            <X size={22} />
          </button>
        )}

        <button type="submit" className="hidden md:flex bg-[#C02026] text-white px-10 py-4 rounded-2xl font-black items-center gap-3 hover:bg-slate-900 transition-all shadow-xl">
          {isAr ? 'ابحث الآن' : 'Search Now'}
        </button>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden">
          <div className="max-h-[75vh] overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
            
            {/* Trending Section */}
            {query.length === 0 && (
               <div className="animate-in slide-in-from-top-2">
                  <h4 className="text-[10px] font-black text-[#C02026] uppercase mb-6 flex items-center gap-3 tracking-[0.3em]">
                    <TrendingUp size={16} /> {isAr ? 'الأكثر بحثاً' : 'Most Searched'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.projects.slice(0, 4).map(p => (
                       <Link key={p._id} href={`/${lang}/projects/${p.slug}`} onClick={() => setIsFocused(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#C02026] italic font-black shadow-sm">P</div>
                          <span className="font-black text-slate-800 text-sm">{isAr ? p.titleAr : p.titleEn}</span>
                       </Link>
                    ))}
                  </div>
               </div>
            )}

            {/* Projects Results */}
            {suggestions.projects.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-6 flex items-center gap-3 tracking-[0.3em]">
                  <LayoutGrid size={16} /> {isAr ? 'المشاريع' : 'Projects'}
                </h4>
                <div className="space-y-2">
                  {suggestions.projects.map(project => {
                    const typeData = TYPE_CONFIG[project.projectType] || TYPE_CONFIG.default;
                    return (
                      <Link key={project._id} href={`/${lang}/projects/${project.slug}`} onClick={() => setIsFocused(false)} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 group transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${typeData.bg} ${typeData.color}`}>
                             <typeData.icon size={20} />
                          </div>
                          <div>
                            <span className="block font-black text-slate-900 text-base group-hover:text-[#C02026]">{isAr ? project.titleAr : project.titleEn}</span>
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                               <MapPin size={10} className="text-[#C02026]" /> {isAr ? project.districtNameAr : project.districtNameEn}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight size={18} className="text-slate-200 group-hover:text-[#C02026]" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Districts & Locations - تم دمج الأحياء هنا */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {(suggestions.districts.length > 0 || suggestions.locations.length > 0) && (
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-3 tracking-[0.3em]">
                            <Navigation size={16} /> {isAr ? 'المناطق والأحياء' : 'Areas & Districts'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {/* عرض الأحياء أولاً */}
                            {suggestions.districts.map(dist => (
                                <Link key={dist._id} href={`/${lang}/locations/${dist.slug}`} onClick={() => setIsFocused(false)} className="px-5 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs font-black text-[#C02026] hover:bg-[#C02026] hover:text-white transition-all">
                                    {isAr ? dist.nameAr : dist.nameEn}
                                </Link>
                            ))}
                            {/* عرض المدن (Locations) */}
                            {suggestions.locations.map(loc => (
                                <Link key={loc._id} href={`/${lang}/locations/${loc.slug}`} onClick={() => setIsFocused(false)} className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-900 hover:text-white transition-all">
                                    {isAr ? loc.nameAr : loc.nameEn}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {suggestions.developers.length > 0 && (
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-3 tracking-[0.3em]">
                            <Building2 size={16} /> {isAr ? 'المطورين العقاريين' : 'Property Developers'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.developers.map(dev => (
                                <Link key={dev._id} href={`/${lang}/developers/${dev.slug}`} onClick={() => setIsFocused(false)} className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-700 hover:bg-[#C02026] hover:text-white transition-all">
                                    {isAr ? dev.nameAr : dev.nameEn}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Empty State */}
            {query.length >= 1 && Object.values(suggestions).every(arr => arr.length === 0) && (
              <div className="text-center py-12 px-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                <h5 className="text-slate-900 font-black text-lg mb-2">{isAr ? 'لا توجد نتائج مطابقة' : "No direct matches"}</h5>
                <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                  {isAr ? 'جرب البحث باسم المنطقة أو الحي أو تواصل مع مستشارنا.' : 'Try searching by city or district, or contact our advisor.'}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g,'')}`} target="_blank" className="bg-[#25D366] text-white px-6 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2">
                      <MessageCircle size={16} fill="currentColor" /> {isAr ? 'استفسار سريع' : 'Quick Inquiry'}
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