import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import { Star, ExternalLink } from 'lucide-react';
import { BRAND_URLS } from '../constants/brandUrls';

const BRANDS = [
  'Bosch', 'Brembo', 'Castrol', 'Continental', 'Denso', 
  'Febi Bilstein', 'Filtron', 'GKN', 'Hella', 'Lemförder', 
  'LuK', 'Mahle', 'Mann-Filter', 'Monroe', 'NGK', 
  'Sachs', 'Schaeffler', 'SKF', 'Textar', 'TRW', 
  'Valeo', 'Victor Reinz', 'ZF', 'Aisin', 'Akebono', 
  'Bilstein', 'Dayco', 'Delphi', 'Gates', 'KYB', 
  'Magneti Marelli', 'Meyle', 'Osram', 'Philips', 
  'Shell', 'Liqui Moly'
];

export default function Brands() {
  const { t } = useStore();

  const canonicalUrl = "https://sprinterplus.com/brands";
  const pageTitle = "Premium Brands | Sprinter Plus";
  const pageDescription = "Shop parts from world-class automotive manufacturers. We carry Bosch, Brembo, Mann-Filter, Sachs, and many more premium brands for your Sprinter.";
  const pageImage = "https://images.unsplash.com/photo-1486262715619-67b1418b671a?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-zinc-50 pt-12 pb-24">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest mb-4"
          >
            <Star className="w-3 h-3 fill-current" />
            {t('brands')}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight mb-6"
          >
            {t('brandsTitle')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 font-medium leading-relaxed"
          >
            {t('brandsSubtitle')}
          </motion.p>
        </header>

        <div className="relative">
          {/* Animated Background Logos */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-[0.04]">
            <div className="flex flex-col gap-20">
              {[0, 1, 2, 3].map((row) => (
                <motion.div
                  key={row}
                  initial={{ x: row % 2 === 0 ? "-10%" : "10%" }}
                  animate={{ x: row % 2 === 0 ? "-50%" : "50%" }}
                  transition={{
                    duration: 60 + row * 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "mirror"
                  }}
                  className="flex gap-24 items-center whitespace-nowrap"
                >
                  {Array.from({ length: 15 }).map((_, i) => {
                    const brand = BRANDS[(i + row * 5) % BRANDS.length];
                    const url = BRAND_URLS[brand];
                    const domain = url ? new URL(url).hostname.replace('www.', '') : null;
                    const logoUrl = domain ? `https://logo.clearbit.com/${domain}?size=128` : null;
                    
                    return (
                      <div key={i} className="flex items-center gap-6">
                        {logoUrl && (
                          <img 
                            src={logoUrl} 
                            alt="" 
                            className="w-16 h-16 object-contain grayscale invert"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        )}
                        <span className="text-8xl font-black italic tracking-tighter uppercase">
                          {brand}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 relative z-10">
            {BRANDS.map((brand, index) => {
              const url = BRAND_URLS[brand];
              const domain = url ? new URL(url).hostname.replace('www.', '') : null;
              const logoUrl = domain ? `https://logo.clearbit.com/${domain}?size=200` : null;

              return (
                <motion.a
                  key={brand}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="group bg-white/80 backdrop-blur-sm border border-zinc-100 p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all hover:shadow-xl hover:shadow-zinc-200/50 hover:border-sky-200 hover:-translate-y-1 h-48"
                >
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    {logoUrl && (
                      <img 
                        src={logoUrl} 
                        alt={`${brand} logo`}
                        className="w-16 h-16 object-contain mb-4 filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100 group-hover:scale-110"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                    <span className="text-xl font-black text-zinc-300 group-hover:text-zinc-900 transition-colors uppercase tracking-wider relative">
                      {brand}
                      <ExternalLink className="w-3 h-3 absolute -top-1 -right-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 p-12 bg-zinc-900 rounded-[40px] text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Don't see a specific brand?</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            We have access to over 200 automotive manufacturers. Contact our experts to source specific parts for your vehicle.
          </p>
          <button className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl transition-all active:scale-95 uppercase text-xs tracking-widest">
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
}
