import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type PrintId = 'postcard' | 'polaroid' | 'strip';

const EVENT_NAME = 'SARAH & DIMAS WEDDING';

export const LandingFinalCta: React.FC = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [topPrint, setTopPrint] = useState<PrintId>('polaroid');
  // Touch screens keep native scrolling; dragging is a mouse/pen detail.
  const [canDrag] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  );

  const printProps = (id: PrintId, rotate: number, delay: number) => ({
    drag: canDrag,
    dragConstraints: boardRef,
    dragElastic: 0.15,
    dragMomentum: false,
    onPointerDown: () => setTopPrint(id),
    onClick: () => setTopPrint(id),
    initial: { opacity: 0, y: 36, rotate: rotate * 1.5 },
    whileInView: { opacity: 1, y: 0, rotate },
    viewport: { once: true, margin: '-60px' },
    transition: { type: 'spring' as const, stiffness: 140, damping: 16, delay },
    whileHover: { scale: 1.04, rotate: rotate / 3, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 },
    whileDrag: { scale: 1.07, cursor: 'grabbing' },
    style: { zIndex: topPrint === id ? 20 : 10, cursor: canDrag ? 'grab' : 'pointer' },
  });

  return (
    <section className="w-full bg-amber-400 text-stone-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6"
        >
          <h2 className="font-heading-xl text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">
            Pasang kiosk di event berikutnya, bukan di spreadsheet.
          </h2>
          <p className="mt-4 sm:mt-5 text-xs sm:text-base leading-relaxed text-stone-900 max-w-xl">
            Buat akun studio, atur template strip, sambungkan kamera Canon atau Sony lewat USB,
            lalu cetak ke DNP DS620. Kalau venue tidak punya sinyal, kiosk tetap jalan dan
            mengirim fotonya ke cloud begitu koneksi kembali.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/auth/register"
                className="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-xl bg-stone-950 text-white text-xs sm:text-sm font-bold shadow-[0_4px_0_0_rgba(0,0,0,0.35)] hover:bg-black active:shadow-none active:translate-y-0.5 transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950 cursor-pointer"
              >
                Buat Akun Studio Gratis
              </Link>
            </motion.div>
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center min-h-11 px-4 text-xs sm:text-sm font-bold underline decoration-2 underline-offset-4 hover:decoration-stone-950/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950"
            >
              Sudah punya akun? Masuk
            </Link>
          </div>
        </motion.div>

        {/* Prints board with interactive tap to front */}
        <div className="lg:col-span-6">
          <div
            ref={boardRef}
            className="relative mx-auto w-full max-w-[340px] sm:max-w-md lg:max-w-none h-[19rem] sm:h-[26rem]"
          >
            {/* Postcard 4x6 */}
            <motion.figure
              {...printProps('postcard', -5, 0)}
              className="absolute left-1 sm:left-0 top-3 sm:top-4 w-[64%] sm:w-[62%] bg-white p-2 pb-6 sm:pb-7 rounded-lg shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)] select-none border border-stone-200/40"
            >
              <div className="aspect-[3/2] overflow-hidden bg-stone-200 rounded">
                <img
                  src="/images/wedding_postcard_candid.jpg"
                  alt="Foto candid tamu pernikahan di kartu pos 4x6"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
              <figcaption className="mt-2 text-[10px] font-bold tracking-wide text-stone-700 truncate">
                {EVENT_NAME}
              </figcaption>
            </motion.figure>

            {/* Polaroid */}
            <motion.figure
              {...printProps('polaroid', 4, 0.1)}
              className="absolute left-[24%] sm:left-[30%] bottom-0 w-[48%] sm:w-[44%] bg-white p-2 pb-7 sm:pb-9 rounded-lg shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)] select-none border border-stone-200/40"
            >
              <div className="aspect-square overflow-hidden bg-stone-200 rounded">
                <img
                  src="/images/wedding_polaroid_guests.jpg"
                  alt="Foto tamu pernikahan dalam bingkai polaroid persegi"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
              <figcaption className="mt-2 text-[10px] font-mono text-stone-600 truncate">
                24.10.2026
              </figcaption>
            </motion.figure>

            {/* Strip 2x6 */}
            <motion.figure
              {...printProps('strip', 6, 0.2)}
              className="absolute right-1 sm:right-0 top-0 w-[27%] sm:w-[26%] bg-white p-1.5 pb-3 rounded-lg shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)] flex flex-col gap-1.5 select-none border border-stone-200/40"
            >
              {['20%', '50%', '80%'].map((pos) => (
                <div key={pos} className="aspect-[4/3] overflow-hidden bg-stone-200 rounded-xs">
                  <img
                    src="/images/wedding_strip_couple.jpg"
                    alt=""
                    draggable={false}
                    style={{ objectPosition: `50% ${pos}` }}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              ))}
              <figcaption className="text-[7.5px] font-bold text-stone-800 text-center leading-tight truncate">
                {EVENT_NAME}
              </figcaption>
            </motion.figure>
          </div>

          <p className="mt-3 text-center lg:text-left text-xs text-stone-900 font-medium">
            Ketuk atau geser lembar foto untuk memindahkan ke depan.
          </p>
        </div>
      </div>
    </section>
  );
};

