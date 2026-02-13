import { client } from '@/sanity/client';
import ProjectCard from '@/components/ProjectCard';
import SearchBar from '@/components/SearchFilter';
import Breadcrumbs from '@/components/Breadcrumbs'; 
import { CONTACT_INFO } from '@/components/constants/contact';
import Link from 'next/link';
import { Search, Filter, LayoutGrid } from 'lucide-react';

/**
 * 🛡️ دالة حماية لتحويل أي كائن غريب إلى نص
 */
const safeString = (val) => {
  if (typeof val === 'string') return val;
  if (!val) return "";
  // إذا كان كائن Sanity (Portable Text)
  if (Array.isArray(val)) return val.map(b => b.children?.map(c => c.text).join('')).join(' ');
  return String(val);
};

export async function generateMetadata({ params, searchParams }) {
  const { lang } = await params;
  const sParams = await searchParams; // الانتظار ضروري هنا
  const isAr = lang === 'ar';
  
  const query = `*[_type == "siteSettings"][0].projectsSeo`;
  const seo = await client.fetch(query);

  // تطهير العناوين المستخرجة من Sanity
  let title = isAr 
    ? safeString(seo?.metaTitleAr || 'عقارات للبيع في مصر') 
    : safeString(seo?.metaTitleEn || 'Properties for Sale in Egypt');

  if (sParams.search) {
    title = isAr ? `نتائج البحث عن ${sParams.search}` : `Results for ${sParams.search}`;
  }

  return {
    title: `${title} | ${isAr ? CONTACT_INFO.siteNameAr : CONTACT_INFO.siteNameEn}`,
    description: safeString(isAr ? seo?.metaDescAr : seo?.metaDescEn),
    alternates: {
      canonical: `${CONTACT_INFO.domain}/${lang}/projects`,
    }
  };
}

async function getProjects(filters) {
  const { search, location, developer, type } = filters; 

  let filterQuery = `_type == "project"`;
  
  if (search) {
    // استخدام matches للأمان العالي في Sanity
    filterQuery += ` && (titleAr match $search || titleEn match $search)`;
  }
  if (location) filterQuery += ` && location->slug.current == $location`;
  if (developer) filterQuery += ` && developer->slug.current == $developer`;
  if (type) filterQuery += ` && projectType == $type`;

  const query = `*[${filterQuery}] | order(isNewLaunch desc, _createdAt desc) {
    _id, titleAr, titleEn, price, installments, downPayment,
    isNewLaunch, isReadyToMove, isVerified, projectType,
    "slug": slug.current,
    mainImage,
    "districtData": district->{ nameAr, nameEn },
    "locationData": location->{ nameAr, nameEn },
    "developer": developer->{ nameAr, nameEn }
  }`;

  try {
    return await client.fetch(query, { 
        search: search ? `*${search}*` : "", 
        location: location || null,
        developer: developer || null,
        type: type || null
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export default async function ProjectsPage({ params, searchParams }) {
  const { lang } = await params;
  const filters = await searchParams; // تأكد من الـ await
  const projects = await getProjects(filters);
  
  const isAr = lang === 'ar';
  const breadcrumbItems = [{ label: isAr ? 'كافة المشاريع' : 'All Projects' }];

  return (
    <main className="min-h-screen bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      {/* ... بقية كود الـ Hero والـ Grid كما هو ... */}
      <section className="bg-slate-950 pt-36 md:pt-52 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-9xl font-black text-white mb-10 italic uppercase leading-none">
            {/* استخدام safeString للأمان عند الرندر */}
            {filters.search ? (isAr ? `نتائج: ${safeString(filters.search)}` : `Results for: ${safeString(filters.search)}`) : (isAr ? 'كتالوج المشاريع' : 'The Catalog')}
          </h1>
          <div className="max-w-5xl mx-auto mt-14 bg-white/5 backdrop-blur-3xl p-4 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <SearchBar lang={lang} />
          </div>
        </div>
      </section>

      {/* الرندر الفعلي للبطاقات */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project) => (
            <ProjectCard key={project._id} lang={lang} data={project} />
          ))}
        </div>
      </section>
    </main>
  );
}