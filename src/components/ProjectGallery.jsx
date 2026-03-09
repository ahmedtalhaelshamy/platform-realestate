'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/client'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

/**
 * 🎨 ProjectGallery - 2026 Ultra-Responsive Edition
 * تم إزالة unoptimized لضمان عمل Bunny.net CDN Loader
 */
export default function ProjectGallery({ images = [], projectName = "Property", lang = 'ar' }) {
  const [index, setIndex] = useState(null);
  const isArabic = lang === 'ar';

  useEffect(() => {
    if (index !== null) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIndex(null);
        if (e.key === 'ArrowRight') isArabic ? prev() : next();
        if (e.key === 'ArrowLeft') isArabic ? next() : prev();
      };
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [index, isArabic]);

  const next = useCallback((e) => { 
    e?.stopPropagation(); 
    setIndex((prevIndex) => (prevIndex + 1) % images.length); 
  }, [images.length]);

  const prev = useCallback((e) => { 
    e?.stopPropagation(); 
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); 
  }, [images.length]);

  if (!images || images.length === 0) return null;

  const handleDragEnd = (event, info) => {
    const threshold = 70;
    if (info.offset.y > 100) setIndex(null);
    else if (info.offset.x < -threshold) isArabic ? prev() : next();
    else if (info.offset.x > threshold) isArabic ? next() : prev();
  };

  return (
    <section className="w-full bg-white py-12 px-4 md:px-8 select-none" aria-label={isArabic ? 'معرض صور المشروع' : 'Project Visual Gallery'}>
      <div className="max-w-7xl mx-auto" dir={isArabic ? 'rtl' : 'ltr'}>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 auto-rows-[160px] md:auto-rows-[240px]">
          {images.map((img, i) => (
            <motion.div 
              key={img._key || i} 
              role="button"
              tabIndex={0}
              aria-label={isArabic ? `عرض الصورة ${i + 1}` : `View property image ${i + 1}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setIndex(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIndex(i); } }}
              className={`relative rounded-3xl md:rounded-[3rem] overflow-hidden cursor-pointer bg-slate-100 shadow-sm hover:shadow-premium transition-all duration-500 group outline-none focus-visible:ring-4 focus-visible:ring-brand-red focus-visible:ring-offset-2
                ${i === 0 ? 'col-span-2 row-span-2' : ''} 
                ${i === 1 ? 'md:col-span-2 md:row-span-1' : ''}`}
            >
              {/* 🚀 تم إزالة unoptimized ليعمل الـ Bunny Loader */}
              <Image 
                src={urlFor(img).url()} 
                alt={`${projectName} architectural detail ${i + 1}`} 
                fill 
                sizes={i === 0 
                  ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px" 
                  : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                }
                priority={i < 2} 
                className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out will-change-transform"
              />
              
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] pointer-events-none">
                  <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30">
                    <Maximize2 className="text-white" size={24} />
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={isArabic ? 'مستعرض الصور المكبرة' : 'Image Lightbox'}
            dir="ltr" 
            className="fixed inset-0 z-[1000000] bg-black/95 flex flex-col items-center justify-center touch-none backdrop-blur-xl"
          >
            <div className="absolute top-0 w-full p-6 md:p-10 flex justify-between items-center z-[100]">
              <div className="flex items-center gap-4">
                  <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10">
                    <span className="text-white font-mono text-sm tracking-widest">{index + 1} / {images.length}</span>
                  </div>
                  <span className="text-white/60 text-xs font-black uppercase tracking-widest hidden md:block">{projectName}</span>
              </div>
              <button 
                onClick={() => setIndex(null)} 
                className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-brand-red hover:text-white transition-all duration-300 shadow-2xl active:scale-90 outline-none"
              >
                <X size={28} />
              </button>
            </div>

            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.5}
              onDragEnd={handleDragEnd}
              className="relative w-full h-full flex items-center justify-center p-4 md:p-20 cursor-grab active:cursor-grabbing"
            >
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* 🚀 Lightbox Image Optimized with Bunny */}
                <Image 
                  src={urlFor(images[index]).url()}
                  alt={`${projectName} full view ${index + 1}`}
                  fill
                  className="object-contain pointer-events-none drop-shadow-2xl select-none"
                  sizes="100vw"
                  priority
                />
              </motion.div>
            </motion.div>

            <div className="absolute inset-x-0 bottom-12 flex justify-center items-center gap-12 z-[100]">
              <button 
                onClick={isArabic ? next : prev} 
                className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hidden md:flex hover:bg-brand-red transition-all duration-300 shadow-xl outline-none"
              >
                <ChevronLeft size={32} />
              </button>
              
              <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden hidden md:block" dir={isArabic ? 'rtl' : 'ltr'}>
                  <motion.div 
                    className="h-full bg-brand-red" 
                    initial={{ width: 0 }}
                    animate={{ width: `${((index + 1) / images.length) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
              </div>

              <button 
                onClick={isArabic ? prev : next} 
                className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hidden md:flex hover:bg-brand-red transition-all duration-300 shadow-xl outline-none"
              >
                <ChevronRight size={32} />
              </button>
            </div>
            
            <div className="md:hidden absolute bottom-10 text-white/20 flex flex-col items-center gap-2">
                <div className="w-8 h-1 bg-white/20 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{isArabic ? 'اسحب للإغلاق' : 'Swipe to close'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}