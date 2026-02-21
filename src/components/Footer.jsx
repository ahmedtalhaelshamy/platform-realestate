import Link from 'next/link';
import { 
  MapPin, Phone, Mail, Facebook, Instagram, 
  Linkedin, Youtube, ChevronRight, ShieldCheck, ArrowUpRight, MessageCircle 
} from 'lucide-react';
import { client } from '@/sanity/client'; 
import { CONTACT_INFO } from '@/components/constants/contact';

// أيقونة تيك توك مخصصة
const TikTokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

async function getFooterData() {
  const query = `{
    "settings": *[_type == "siteSettings"][0]{
      titleAr, titleEn,
      descriptionAr, descriptionEn,
      "phone": coalesce(phone, contactInfo.phone),
      "whatsapp": coalesce(whatsapp, contactInfo.whatsapp),
      "email": coalesce(email, contactInfo.email),
      "addressAr": coalesce(addressAr, contactInfo.addressAr),
      "addressEn": coalesce(addressEn, contactInfo.addressEn),
      "mapLocation": coalesce(mapLocation, contactInfo.mapLocation),
      "facebook": coalesce(facebook, contactInfo.facebook),
      "instagram": coalesce(instagram, contactInfo.instagram),
      "linkedin": coalesce(linkedin, contactInfo.linkedin),
      "youtube": coalesce(youtube, contactInfo.youtube),
      "tiktok": coalesce(tiktok, contactInfo.tiktok)
    },
    "locations": *[_type == "location" && defined(slug.current)] | order(order asc)[0...6]{
      "slug": slug.current,
      nameAr,
      nameEn
    }
  }`;

  try {
    return await client.fetch(query, {}, { next: { revalidate: 3600 } });
  } catch (error) {
    console.error("Footer Fetch Error:", error);
    return { settings: null, locations: [] };
  }
}

export default async function Footer({ lang }) {
  const isAr = lang === 'ar';
  const { settings, locations } = await getFooterData();

  const data = {
    title: isAr ? (settings?.titleAr || CONTACT_INFO.siteNameAr) : (settings?.titleEn || CONTACT_INFO.siteNameEn),
    description: isAr 
      ? (settings?.descriptionAr || 'منصتكم العقارية الأولى في مصر. خبرة 15 عاماً في اختيار أفضل المشاريع الاستثمارية.') 
      : (settings?.descriptionEn || 'Egypt’s premier real estate platform. 15 years of expertise in high-end investments.'),
    phone: settings?.phone || CONTACT_INFO.phone,
    whatsapp: (settings?.whatsapp || CONTACT_INFO.whatsapp)?.replace(/\D/g, ''),
    address: isAr ? (settings?.addressAr || CONTACT_INFO.addressAr) : (settings?.addressEn || CONTACT_INFO.addressEn),
    mapLink: settings?.mapLocation || CONTACT_INFO.googleMapsUrl
  };

  const socialLinks = [
    { Icon: Facebook, url: settings?.facebook || CONTACT_INFO.social.facebook, label: 'Facebook' },
    { Icon: Instagram, url: settings?.instagram || CONTACT_INFO.social.instagram, label: 'Instagram' },
    { Icon: TikTokIcon, url: settings?.tiktok || CONTACT_INFO.social.tiktok, label: 'TikTok' },
    { Icon: Youtube, url: settings?.youtube || CONTACT_INFO.social.youtube, label: 'YouTube' },
    { Icon: Linkedin, url: settings?.linkedin || CONTACT_INFO.social.linkedin, label: 'LinkedIn' }
  ].filter(link => link.url);

  return (
    <footer className="bg-[#080A0D] text-white pt-24 pb-12 border-t border-white/[0.03] relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C02026]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12 border-b border-white/[0.05] pb-20">
          
          {/* 1. Brand Section */}
          <div className="lg:col-span-4 space-y-8 text-start">
            <Link href={`/${lang}/`} className="group inline-block" aria-label={data.title}>
               <div className="flex items-center gap-4">
                  <div className="bg-[#C02026] p-2.5 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-xl">
                    <ShieldCheck className="text-white" size={28} />
                  </div>
                  <span className="text-2xl font-black tracking-tighter uppercase italic">{data.title}</span>
               </div>
            </Link>
            <p className="text-slate-300 leading-[1.8] text-sm font-medium max-w-sm">
              {data.description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" 
                   aria-label={`${isAr ? 'تابعنا على' : 'Follow us on'} ${item.label}`}
                   className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-300 hover:bg-[#C02026] hover:text-white hover:-translate-y-1.5 transition-all duration-500">
                  <item.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Navigation Section */}
          <div className="lg:col-span-2 text-start">
            <h2 className="text-[11px] font-black mb-10 uppercase tracking-[0.3em] text-slate-300 flex items-center gap-3">
              {isAr ? 'خريطة الموقع' : 'Navigation'}
              <div className="h-px flex-1 bg-gradient-to-r from-[#C02026] to-transparent opacity-30"></div>
            </h2>
            <ul className="space-y-4">
              {[
                { name: isAr ? 'من نحن' : 'About Platform', href: `/${lang}/about-us/` },
                { name: isAr ? 'المطورون' : 'Developers', href: `/${lang}/developers/` },
                { name: isAr ? 'المدونة' : 'Insights', href: `/${lang}/blog/` },
                { name: isAr ? 'تواصل معنا' : 'Contact Us', href: `/${lang}/contact/` },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="group flex items-center gap-2 text-[13px] text-gray-200 hover:text-white transition-all font-bold uppercase tracking-tight">
                    <ChevronRight size={12} className={`text-[#C02026] transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Areas Section */}
          <div className="lg:col-span-3 text-start">
            <h2 className="text-[11px] font-black mb-10 uppercase tracking-[0.3em] text-slate-300 flex items-center gap-3">
              {isAr ? 'أهم المناطق' : 'Hotspots'}
              <div className="h-px flex-1 bg-gradient-to-r from-[#C02026] to-transparent opacity-30"></div>
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {locations?.map((loc) => (
                <Link key={loc.slug} href={`/${lang}/locations/${loc.slug}/`} 
                      className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all">
                  <span className="text-[12px] font-bold text-gray-200 group-hover:text-white">{isAr ? loc.nameAr : loc.nameEn}</span>
                  <ArrowUpRight size={14} className="text-[#C02026] opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* 4. Contact Section */}
          <div className="lg:col-span-3 text-start space-y-10">
            <h2 className="text-[11px] font-black mb-10 uppercase tracking-[0.3em] text-slate-300 flex items-center gap-3">
              {isAr ? 'بيانات التواصل' : 'Contact Hub'}
              <div className="h-px flex-1 bg-gradient-to-r from-[#C02026] to-transparent opacity-30"></div>
            </h2>
            
            <div className="space-y-6">
              <a href={data.mapLink} target="_blank" rel="noopener noreferrer" 
                 className="flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0 text-[#C02026] group-hover:bg-[#C02026] group-hover:text-white transition-all shadow-xl">
                  <MapPin size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{isAr ? 'العنوان' : 'Location'}</p>
                  <p className="text-gray-200 text-[13px] font-bold leading-relaxed">{data.address}</p>
                </div>
              </a>

              <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all shadow-xl">
                  <MessageCircle size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{isAr ? 'واتساب مباشر' : 'Live Support'}</p>
                  <p className="text-gray-200 text-sm font-black tracking-tighter">{data.phone}</p>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar - Contrast Fixed */}
        <div className="py-10 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/[0.02]">
          <p className="text-slate-300 text-[10px] uppercase tracking-[0.4em] font-black text-center md:text-start leading-relaxed">
            © {new Date().getFullYear()} {data.title} <span className="mx-2 text-white/5">|</span> 
            {isAr ? 'تم التطوير بواسطة بلاتفورم تكنولوجي' : 'Crafted by Platform Tech'}
          </p>
          
          <div className="flex gap-8 items-center">
            {[
              { id: 'Privacy', ar: 'الخصوصية', en: 'Privacy', path: 'privacy' },
              { id: 'Terms', ar: 'الشروط', en: 'Terms', path: 'terms' },
              { id: 'Sitemap', ar: 'خريطة الموقع', en: 'Sitemap', path: 'sitemap' }
            ].map((item) => (
              <Link key={item.id} href={`/${lang}/${item.path}/`} className="text-gray-200 hover:text-[#C02026] text-[10px] uppercase tracking-[0.2em] font-black transition-colors focus:ring-1 focus:ring-red-500 rounded px-1 outline-none">
                {isAr ? item.ar : item.en}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}