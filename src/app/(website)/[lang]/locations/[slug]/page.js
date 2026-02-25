import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import ProjectCard from '@/components/ProjectCard';
import Image from 'next/image';
import { MapPin, ArrowRight, ArrowLeft, LayoutGrid, Phone, MessageCircle, Info, Building2, Sparkles, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CONTACT_INFO } from '@/components/constants/contact';

// 🏁 الدومين الموحد المعتمد
const BASE_URL = 'https://platformrealestate.co';

const getSafeText = (val) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map(block => block.children?.map((child) => child.text).join('')).join(' ');
  }
  if (typeof val === 'object' && val.children) {
    return val.children.map((child) => child.text).join('');
  }
  return String(val);
};

export async function generateStaticParams() {
  const query = `*[_type == "location" && defined(slug.current)]{ "slug": slug.current }`;
  const locations = await client.fetch(query);
  return locations.flatMap((loc) => [{ lang: 'ar', slug: loc.slug }, { lang: 'en', slug: loc.slug }]);
}

export const revalidate = 3600; 

export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';
  const data = await client.fetch(`*[_type == "location" && slug.current == $slug][0]{ nameAr, nameEn, seoTitleAr, seoTitleEn, seoDescAr, seoDescEn, image }`, { slug });
  if (!data) return { title: 'Location Not Found' };
  const name = isAr ? getSafeText(data.nameAr) : getSafeText(data.nameEn);
  const title = isAr ? getSafeText(data.seoTitleAr || name) : getSafeText(data.seoTitleEn || name);
  const ogImageUrl = data.image ? urlFor(data.image).width(1200).height(630).format('webp').url() : `${BASE_URL}/og-image.jpg`;
  return {
    title: `${title} | Platform`,
    alternates: { canonical: `${BASE_URL}/${lang}/locations/${slug}/` },
    openGraph: { title: name, images: [{ url: ogImageUrl }], locale: isAr ? 'ar_EG' : 'en_US', type: 'website' }
  };
}

const ptComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-black mt-12 mb-6 text-brand-dark border-s-8 border-brand-red ps-6 leading-tight italic uppercase tracking-tighter">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-black mt-8 mb-4 text-slate-800 uppercase tracking-tight">{children}</h3>,
    normal: ({ children }) => <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6 text-justify font-medium">{children}</p>,
  },
};

export default async function LocationDetailPage({ params }) {
  const { slug, lang } = await params;
  const isAr = lang === 'ar';

  const query = `{
    "locationData": *[_type == "location" && slug.current == $slug][0]{
      _id, nameAr, nameEn, descriptionAr, descriptionEn, image,
      "relatedPosts": *[_type == "post" && language == $lang && (
        references(^._id) || 
        references(*[_type == "district" && location._ref == ^._id]._id)
      )] | order(_createdAt desc)[0...6] {
        title, "slug": slug.current, mainImage, overview, _createdAt
      }
    },
    "districts": *[_type == "district" && location->slug.current == $slug] | order(order asc) {
      _id, nameAr, nameEn, "slug": slug.current, image,
      "projects": *[_type == "project" && references(^._id) && !(_id in path("drafts.**"))] | order(isNewLaunch desc, _createdAt desc) { 
          _id, titleAr, titleEn, price, installments, downPayment, isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage, 
          "developer": developer->{nameAr, nameEn}, "location": location->{nameAr, nameEn}, "districtData": district->{ nameAr, nameEn }
      }
    },
    "generalProjects": *[_type == "project" && location->slug.current == $slug && !defined(district) && !(_id in path("drafts.**"))] | order(_createdAt desc)[0...6] {
       _id, titleAr, titleEn, price, installments, downPayment, isNewLaunch, isReadyToMove, isVerified, "slug": slug.current, mainImage,
       "developer": developer->{nameAr, nameEn}, "location": location->{nameAr, nameEn}, "districtData": district->{ nameAr, nameEn }
    }
  }`;

  const data = await client.fetch(query, { slug, lang });
  if (!data?.locationData) return notFound();

  const { locationData, districts, generalProjects } = data;
  const locName = isAr ? getSafeText(locationData.nameAr) : getSafeText(locationData.nameEn);
  const breadcrumbItems = [{ label: isAr ? 'المناطق' : 'Hotspots', href: `/${lang}/locations/` }, { label: locName }];
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(isAr ? `استفسار عن العقارات في ${locName}` : `Inquiry about ${locName}`)}`;

  return (
    <main className={`min-h-screen bg-brand-gray-50 selection:bg-brand-red selection:text-white ${isAr ? 'font-almarai' : 'font-jakarta'}`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. HERO SECTION - (Removed Call Button as requested) */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-brand-dark pt-20">
        {locationData.image && <Image src={urlFor(locationData.image).format('webp').quality(80).url()} alt={locName} fill sizes="100vw" className="object-cover opacity-50 scale-105 animate-slow-zoom" priority />}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-50 via-brand-dark/20 to-brand-dark/60 z-10" />
        <div className="relative z-30 text-center text-white px-6 max-w-7xl animate-fade-in-up">
          <nav className="mb-12 flex justify-center"><Breadcrumbs items={breadcrumbItems} lang={lang} /></nav>
          <div className="inline-flex items-center gap-3 bg-brand-red text-white px-6 py-3 rounded-full mb-10 shadow-2xl border border-white/10">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'فرص استثمارية حصرية 2026' : 'Exclusive 2026 Asset Guide'}</span>
          </div>
          <h1 className="text-5xl md:text-[8rem] lg:text-[10rem] font-black drop-shadow-2xl uppercase leading-none">{locName}</h1>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-12 relative z-30">
        
        {/* 2. DISTRICTS NAV */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 -mt-32 mb-32 relative z-40">
          {districts.map((dist) => (
            <Link key={dist._id} href={`/${lang}/districts/${dist.slug}/`} className="group flex flex-col items-center gap-5 transition-all duration-500 hover:-translate-y-2">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full p-1.5 bg-white shadow-premium border border-slate-100 group-hover:ring-4 group-hover:ring-brand-red overflow-hidden transition-all duration-700">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-50">
                  {dist.image ? <Image src={urlFor(dist.image).format('webp').url()} fill sizes="128px" alt="dist" className="object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><LayoutGrid size={32}/></div>}
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark bg-white px-5 py-2.5 rounded-2xl shadow-xl group-hover:bg-brand-red group-hover:text-white transition-all">{isAr ? getSafeText(dist.nameAr) : getSafeText(dist.nameEn)}</span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-32">
            
            {districts.map((district) => (
              district.projects?.length > 0 && (
                <section key={district._id} id={district.slug} className="scroll-mt-40 text-start">
                  <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-s-[12px] border-brand-red ps-8 gap-6">
                    <div>
                      <h2 className="text-3xl md:text-6xl font-black text-brand-dark uppercase tracking-tight leading-none">{isAr ? `مشاريع ${getSafeText(district.nameAr)}` : `${getSafeText(district.nameEn)} Legacy`}</h2>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">{isAr ? `نخبة العقارات المختارة في حي ${getSafeText(district.nameAr)}` : `Curated Assets in ${getSafeText(district.nameEn)} District`}</p>
                    </div>
                    <Link href={`/${lang}/districts/${district.slug}/`} className="group inline-flex items-center gap-3 text-brand-red font-black text-xs uppercase tracking-widest hover:underline">
                      {isAr ? 'عرض الكل' : 'View Hub'} <ArrowRight size={18} className="group-hover:translate-x-2 rtl:rotate-180" />
                    </Link>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                    {district.projects.map((project) => <ProjectCard key={project._id} data={project} lang={lang} />)}
                  </div>
                </section>
              )
            ))}

            {/* 📰 قسم الأخبار */}
            {locationData.relatedPosts?.length > 0 && (
              <section className="pt-20 border-t border-slate-200 text-start">
                <header className="mb-12 border-s-[12px] border-[#C02026] ps-8">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic leading-none">{isAr ? `أخبار ${locName}` : `${locName} Intel`}</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-4">{isAr ? 'تقارير حصرية وتطورات السوق في هذه المنطقة' : 'Exclusive area reports and market insights'}</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {locationData.relatedPosts.map((post) => (
                    <Link key={post.slug} href={`/${lang}/blog/${post.slug}/`} className="group flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-red-50">
                      <div className="aspect-video relative overflow-hidden">
                        {post.mainImage && <Image src={urlFor(post.mainImage).width(400).url()} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />}
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <span className="text-[10px] font-black text-[#C02026] uppercase mb-3 block">{new Date(post._createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}</span>
                        <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-[#C02026] transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-slate-500 text-sm font-medium line-clamp-2">{post.overview}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {(locationData.descriptionAr || locationData.descriptionEn) && (
              <article className="bg-white p-10 md:p-20 rounded-[4rem] shadow-premium border border-slate-50 text-start">
                <div className="flex items-center gap-6 mb-12 text-brand-red">
                    <div className="p-4 bg-red-50 rounded-[2rem] shadow-inner"><Info size={40} strokeWidth={1.5} /></div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight italic">{isAr ? 'دليل الاستثمار' : 'Market Intel'}</h2>
                </div>
                <div className="prose prose-xl prose-slate max-w-none prose-p:leading-relaxed prose-p:text-justify prose-p:font-medium">
                  <PortableText value={isAr ? locationData.descriptionAr : locationData.descriptionEn} components={ptComponents} />
                </div>
              </article>
            )}
          </div>

          <aside className="lg:col-span-4 h-full">
            <div className="lg:sticky lg:top-32 space-y-10">
                <div className="bg-brand-dark text-white p-10 md:p-14 rounded-[4rem] shadow-2xl border-b-[16px] border-brand-red relative overflow-hidden group">
                    <div className="absolute -top-16 -end-16 opacity-10 group-hover:rotate-12 transition-transform duration-[2s] pointer-events-none"><Building2 size={350} /></div>
                    <div className="relative z-10 text-start">
                        <div className="inline-flex items-center gap-3 bg-brand-red px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase mb-10 shadow-xl border border-white/10">
                            <CheckCircle size={14} /> {isAr ? 'مستشار عقاري معتمد' : 'Verified Partner'}
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black mb-8 leading-[0.95] uppercase italic">{isAr ? `تحتاج مساعدة في ${locName}؟` : `Investment Help in ${locName}?`}</h3>
                        <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed italic opacity-90">{isAr ? `خبراؤنا يساعدونك في اختيار أفضل حي سكني أو تجاري في المنطقة مجاناً بالكامل.` : `Our elite advisors help you compare ROI and districts within ${locName}, 100% complimentary.`}</p>
                        <div className="space-y-4">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 w-full py-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                <MessageCircle size={24} fill="currentColor" /> {isAr ? 'تحدث مع خبير' : 'WhatsApp Expert'}
                            </a>
                            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="flex items-center justify-center gap-4 w-full py-6 bg-[#C02026] text-white hover:bg-white hover:text-black border-2 border-[#C02026] rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all group">
                                <Phone size={24} fill="currentColor" className="group-hover:animate-bounce" /> {isAr ? 'اتصل الآن' : 'Call Sales'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
          </aside>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
        .animate-slow-zoom { animation: slow-zoom 40s linear infinite alternate; }
        .shadow-premium { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.06); }
      `}} />
    </main>
  );
}