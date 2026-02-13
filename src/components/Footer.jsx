import Link from 'next/link';
import { 
  MapPin, Phone, Mail, Facebook, Instagram, 
  Linkedin, Youtube, ChevronRight, ShieldCheck, ArrowUpRight 
} from 'lucide-react';
import { client } from '@/sanity/client'; 
import { CONTACT_INFO } from '@/components/constants/contact';

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
      "youtube": coalesce(youtube, contactInfo.youtube)
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
    console.error("Footer Data Fetch Error:", error);
    return { settings: null, locations: [] };
  }
}

export default async function Footer({ lang }) {
  const isAr = lang === 'ar';
  const { settings, locations } = await getFooterData();

  const data = {
    title: isAr 
      ? (settings?.titleAr || CONTACT_INFO.siteNameAr) 
      : (settings?.titleEn || CONTACT_INFO.siteNameEn),
    description: isAr 
      ? (settings?.descriptionAr || 'الوجهة الموثوقة للاستثمار العقاري في مصر. نضع خبرتنا الطويلة بين يديك لاختيار منزلك أو استثمارك القادم.') 
      : (settings?.descriptionEn || 'Your trusted partner for real estate investment in Egypt. Leveraging our extensive expertise to help you secure premium assets.'),
    phone: settings?.phone || CONTACT_INFO.phone,
    email: settings?.email || CONTACT_INFO.email,
    address: isAr 
      ? (settings?.addressAr || CONTACT_INFO.addressAr) 
      : (settings?.addressEn || CONTACT_INFO.addressEn),
    mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.mapLocation || CONTACT_INFO.addressEn)}`
  };

  const socialLinks = [
    { Icon: Facebook, url: settings?.facebook || CONTACT_INFO.social?.facebook, label: 'Facebook' },
    { Icon: Instagram, url: settings?.instagram || CONTACT_INFO.social?.instagram, label: 'Instagram' },
    { Icon: Youtube, url: settings?.youtube || CONTACT_INFO.social?.youtube, label: 'Youtube' },
    { Icon: Linkedin, url: settings?.linkedin || CONTACT_INFO.social?.linkedin, label: 'Linkedin' }
  ].filter(link => link.url);

  return (
    <footer 
      className="bg-[#0A0C10] text-white pt-24 pb-10 border-t border-white/5 relative overflow-hidden" 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* 🎨 Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C02026]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 border-b border-white/5 pb-20">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-4 space-y-8">
            <Link href={`/${lang}`} className="group block w-fit">
               <div className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase">
                  <div className="bg-[#C02026] p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500">
                    <ShieldCheck className="text-white" size={32} />
                  </div>
                  <span className="group-hover:text-[#C02026] transition-colors">{data.title}</span>
               </div>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm font-medium max-w-sm">
              {data.description}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#C02026] hover:text-white hover:-translate-y-2 transition-all duration-500 border border-white/5 shadow-2xl"
                >
                  <item.Icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-black mb-10 uppercase tracking-[0.2em] text-white flex items-center gap-3">
              {isAr ? 'استكشف' : 'Explore'}
              <div className="h-px flex-1 bg-gradient-to-r from-[#C02026] to-transparent"></div>
            </h4>
            <ul className="space-y-5">
              {[
                { name: isAr ? 'الرئيسية' : 'Home', href: `/${lang}` },
                { name: isAr ? 'من نحن' : 'About Us', href: `/${lang}/about` },
                { name: isAr ? 'المشاريع' : 'Projects', href: `/${lang}/projects` },
                { name: isAr ? 'المطورون' : 'Developers', href: `/${lang}/developers` },
                { name: isAr ? 'المدونة' : 'Insights', href: `/${lang}/blog` },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center gap-3 text-[13px] text-slate-400 hover:text-white transition-all font-bold"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C02026] opacity-0 group-hover:opacity-100 transition-all"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Locations */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-black mb-10 uppercase tracking-[0.2em] text-white flex items-center gap-3">
              {isAr ? 'المناطق' : 'Hotspots'}
              <div className="h-px flex-1 bg-gradient-to-r from-[#C02026] to-transparent"></div>
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {locations?.map((loc) => (
                <Link 
                  key={loc.slug} 
                  href={`/${lang}/locations/${loc.slug}`} 
                  className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all"
                >
                  <span className="text-[13px] font-bold text-slate-400 group-hover:text-white">{isAr ? loc.nameAr : loc.nameEn}</span>
                  <ArrowUpRight size={16} className="text-[#C02026] group-hover:scale-125 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-black mb-10 uppercase tracking-[0.2em] text-white flex items-center gap-3">
              {isAr ? 'تواصل' : 'Connect'}
              <div className="h-px flex-1 bg-gradient-to-r from-[#C02026] to-transparent"></div>
            </h4>
            <div className="space-y-8">
              <a href={data.mapLink} target="_blank" rel="noreferrer" className="flex gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 text-[#C02026] group-hover:bg-[#C02026] group-hover:text-white transition-all shadow-xl">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{isAr ? 'المقر' : 'Location'}</p>
                  <p className="text-slate-300 text-[13px] font-bold leading-relaxed">{data.address}</p>
                </div>
              </a>

              <a href={`tel:${data.phone}`} className="flex gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 text-[#C02026] group-hover:bg-[#C02026] group-hover:text-white transition-all shadow-xl">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{isAr ? 'اتصل بنا' : 'Call center'}</p>
                  <p className="text-slate-300 text-sm font-black tracking-tighter">{data.phone}</p>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="py-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-start">
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black">
              © {new Date().getFullYear()} {data.title} <span className="mx-2 text-white/10">|</span> Crafted for Luxury Real Estate
            </p>
          </div>
          
          <div className="flex gap-10">
            {['Privacy', 'Terms', 'Sitemap'].map((item) => (
              <Link key={item} href={`/${lang}/${item.toLowerCase()}`} className="text-slate-500 hover:text-white text-[10px] uppercase tracking-[0.2em] font-black transition-colors">
                {isAr && item === 'Privacy' ? 'الخصوصية' : isAr && item === 'Terms' ? 'الشروط' : item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}