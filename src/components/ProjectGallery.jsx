'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { urlFor } from '../sanity/client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ChevronDown, Maximize2 } from 'lucide-react';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    zIndex: 1,
    x: 0,
    scale: 1,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 500 : -500,
    opacity: 0,
    scale: 0.9,
  }),
};

export default function ProjectGallery({ images = [] }) {
  const [[page, direction], setPage] = useState([null, 0]);

  // التحكم في السكرول عند فتح الـ Lightbox
  useEffect(() => {
    if (page !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [page]);

  const paginate = useCallback((newDirection) => {
    setPage(([currentPage]) => {
      const nextIndex = (currentPage + newDirection + images.length) % images.length;
      return [nextIndex, newDirection];
    });
  }, [images.length]);

  if (!images || images.length === 0) return null;

  const openLightbox = (i) => setPage([i, 0]);
  const closeLightbox = () => setPage([null, 0]);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.y > 150) { closeLightbox(); return; }
    if (info.offset.x > swipeThreshold) paginate(-1);
    else if (info.offset.x < -swipeThreshold) paginate(1);
  };

  return (
    <section className="w-full bg-white py-12 md:py-20 overflow-hidden select-none" aria-label="Project Gallery">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Gallery Grid/Accordion */}
        <div className="flex flex-row gap-4 h-[55vh] md:h-[650px] w-full items-stretch overflow-x-auto md:overflow-hidden snap-x snap-mandatory hide-scrollbar">
          {images.map((img, i) => (
            <motion.div
              key={img._key || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => openLightbox(i)}
              className="group relative shrink-0 md:snap-center w-[88vw] md:w-auto flex-1 transition-all duration-[800ms] cubic-bezier(0.4, 0, 0.2, 1) md:hover:flex-[6] cursor-zoom-in overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-slate-50"
            >
              <Image
                src={urlFor(img).width(1200).quality(90).url()}
                alt={img.alt || `Property view ${i + 1}`}
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                priority={i < 2}
                sizes="(max-width: 768px) 88vw, 40vw"
              />
              {/* Overlay Decoration */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <Maximize2 size={20} />
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence initial={false} custom={direction}>
        {page !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center touch-none"
            onClick={closeLightbox}
          >
            {/* Header Controls */}
            <div className="absolute top-0 inset-x-0 p-8 flex justify-between items-center z-[10001]">
               <div className="text-white/50 font-black tracking-[0.4em] text-[11px] bg-white/5 px-6 py-2.5 rounded-full border border-white/10 uppercase">
                  {page + 1} <span className="mx-2 opacity-30">/</span> {images.length}
               </div>
               <button 
                 onClick={(e) => { e.stopPropagation(); closeLightbox(); }} 
                 className="text-white w-14 h-14 flex items-center justify-center bg-white/5 rounded-full hover:bg-[#C02026] hover:scale-110 transition-all duration-300 border border-white/10"
               >
                  <X size={32} />
               </button>
            </div>

            {/* Desktop Navigation */}
            <button onClick={(e) => { e.stopPropagation(); paginate(-1); }} className="absolute left-10 text-white w-16 h-16 items-center justify-center bg-white/5 rounded-full hidden md:flex hover:bg-white/10 hover:scale-110 z-[10002] transition-all border border-white/10"><ChevronLeft size={40} /></button>
            <button onClick={(e) => { e.stopPropagation(); paginate(1); }} className="absolute right-10 text-white w-16 h-16 items-center justify-center bg-white/5 rounded-full hidden md:flex hover:bg-white/10 hover:scale-110 z-[10002] transition-all border border-white/10"><ChevronRight size={40} /></button>

            {/* Image Container */}
            <div className="relative w-full max-w-7xl h-[75vh] md:h-[85vh] flex items-center justify-center overflow-hidden px-4">
                <motion.div 
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.5}
                  onDragEnd={handleDragEnd}
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 35 },
                    opacity: { duration: 0.3 }
                  }}
                  className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={urlFor(images[page]).width(1800).quality(100).url()}
                    alt="Property Insight"
                    fill
                    className="object-contain pointer-events-none p-4 md:p-12"
                    priority
                  />
                </motion.div>
            </div>

            {/* Swipe Indicator for Mobile */}
            <div className="absolute bottom-10 flex flex-col items-center gap-3 md:hidden opacity-40">
                <motion.div 
                  animate={{ y: [0, 8, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ChevronDown className="text-white" size={24} />
                </motion.div>
                <span className="text-white text-[8px] font-black uppercase tracking-[0.6em]">Drag down to dismiss</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}