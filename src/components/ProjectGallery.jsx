'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { urlFor } from '../sanity/client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ProjectGallery({ images = [], projectName = "Property" }) {
  const [index, setIndex] = useState(null);

  // ✅ 1. إدارة القفل ودعم لوحة المفاتيح
  useEffect(() => {
    if (index !== null) {
      document.body.classList.add('gallery-open');
      
      // إغلاق المعرض عند ضغط Esc والتنقل بالأسهم
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIndex(null);
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      document.body.classList.remove('gallery-open');
    }
  }, [index]);

  const next = useCallback((e) => { 
    e?.stopPropagation(); 
    setIndex((prev) => (prev + 1) % images.length); 
  }, [images.length]);

  const prev = useCallback((e) => { 
    e?.stopPropagation(); 
    setIndex((prev) => (prev - 1 + images.length) % images.length); 
  }, [images.length]);

  if (!images || images.length === 0) return null;

  const handleDragEnd = (event, info) => {
    const horizontalSwipe = info.offset.x;
    const verticalSwipe = info.offset.y;
    const threshold = 70;

    if (verticalSwipe > 100) setIndex(null);
    else if (horizontalSwipe < -threshold) next();
    else if (horizontalSwipe > threshold) prev();
  };

  return (
    <section className="w-full bg-white py-10 px-4 md:px-8 select-none" aria-label="Project Gallery">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[220px]">
          {images.map((img, i) => (
            <motion.div 
              key={img._key || i} 
              role="button"
              aria-label={`View image ${i + 1} of ${images.length}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setIndex(i)}
              className={`relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer bg-slate-50 shadow-sm active:scale-95 transition-transform 
                ${i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : ''} 
                ${i === 1 ? 'md:col-span-2 md:row-span-1' : ''}
                ${i > 0 && i !== 1 ? 'aspect-square md:aspect-auto' : ''}`}
            >
              <Image 
                src={urlFor(img).width(i === 0 ? 1000 : 600).quality(80).url()} 
                alt={`${projectName} detail view ${i + 1}`} 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority={i < 4}
              />
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 md:hover:opacity-100 transition-opacity">
                  <Maximize2 className="text-white/80" size={24} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ✅ Lightbox */}
      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[1000000] bg-black flex flex-col items-center justify-center touch-none"
          >
            <div className="absolute top-0 w-full p-6 flex justify-between items-center z-[100]">
              <span className="text-white/40 font-mono text-xs">{index + 1} / {images.length}</span>
              <button 
                onClick={() => setIndex(null)} 
                aria-label="Close gallery"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <motion.div
              drag
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              className="relative w-full h-full flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
            >
              <motion.img
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={urlFor(images[index]).width(1200).quality(85).url()}
                alt={`${projectName} full view ${index + 1}`}
                className="max-w-full max-h-[80vh] object-contain shadow-2xl pointer-events-none"
              />
            </motion.div>

            <div className="absolute inset-x-0 bottom-12 flex justify-center items-center gap-10 z-[100]">
              <button 
                onClick={prev} 
                aria-label="Previous image"
                className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white hidden md:flex hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={next} 
                aria-label="Next image"
                className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white hidden md:flex hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}