import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ScanLine, Cog, Disc, GitMerge, Settings2, Zap, Lightbulb, Car, Armchair, Package, RefreshCcw, Wrench, Clock, ArrowRight, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';
import PartFinder from '../components/PartFinder';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

import { BRAND_URLS } from '../constants/brandUrls';
import aftermarketEngineParts from '../assets/images/aftermarket_engine_parts_1779176797468.png';
import aftermarketBrakes from '../assets/images/aftermarket_brakes_1779176818183.png';
import aftermarketLighting from '../assets/images/aftermarket_lighting_1779176833786.png';
import brandsCollageBg from '../assets/images/brands_collage_bg_1779177175774.png';

const CATEGORIES = [
  { name: 'Engine', key: 'catEngine', icon: Cog, descKey: 'catEngineDesc' },
  { name: 'Brakes', key: 'catBrakes', icon: Disc, descKey: 'catBrakesDesc' },
  { name: 'Suspension', key: 'catSuspension', icon: GitMerge, descKey: 'catSuspensionDesc' },
  { name: 'Transmission', key: 'catTransmission', icon: Settings2, descKey: 'catTransmissionDesc' },
  { name: 'Electrical', key: 'catElectrical', icon: Zap, descKey: 'catElectricalDesc' },
  { name: 'Lighting', key: 'catLighting', icon: Lightbulb, descKey: 'catLightingDesc' },
  { name: 'Exterior', key: 'catExterior', icon: Car, descKey: 'catExteriorDesc' },
  { name: 'Interior', key: 'catInterior', icon: Armchair, descKey: 'catInteriorDesc' },
];

const STATS = [
  { key: 'partsInStock', subKey: 'inStockSub', icon: Package },
  { key: 'returns', subKey: 'returnsSub', icon: RefreshCcw },
  { key: 'expertSupport', subKey: 'supportSub', icon: Wrench },
  { key: 'fastDelivery', subKey: 'shippingSub', icon: Truck },
];

const MAINTENANCE_IMAGES = [
  aftermarketEngineParts,
  aftermarketBrakes,
  aftermarketLighting,
];

function AutoChangingGallery() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MAINTENANCE_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={MAINTENANCE_IMAGES[index]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="w-full h-full object-cover"
          alt="Maintenance"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
        <div className="space-y-1">
          <div className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em]">Component Highlight</div>
          <div className="text-white text-lg font-bold">Performance Upgrade</div>
        </div>
        <div className="flex gap-2">
          {MAINTENANCE_IMAGES.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-sky-500' : 'w-2 bg-white/30'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { products, t, user, recentlyViewed, addToRecentlyViewed } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const featured = products.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const canonicalUrl = "https://sprinterplus.com";
  const pageTitle = "Sprinter Plus | Professional Sprinter Parts & Accessories";
  const pageDescription = "Shop 50,000+ specialized parts for your Sprinter. Fast delivery in Kosovo and EU special orders. Expert support for engine, brakes, suspension and more.";
  const pageImage = "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2036&auto=format&fit=crop";

  return (
    <div className="space-y-0">
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
      {/* Hero Section */}
      <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2036&auto=format&fit=crop" 
            alt="White Sprinter in workshop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent" />
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs font-semibold mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {t('inStockShipEU')}
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-zinc-300 mb-10 max-w-xl leading-relaxed font-medium">
              {t('heroSub')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="h-14 px-10 inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-sky-500/20 active:scale-95">
                {t('shopNow')}
              </Link>
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-part-finder'));
                }}
                className="h-14 px-10 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl transition-all active:scale-95"
              >
                <ScanLine className="w-5 h-5 mr-3" />
                {t('partFinder')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <PartFinder />

      {/* Stats Strip */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 grid place-items-center shrink-0">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 leading-tight">{t(stat.key)}</div>
                  <div className="text-[13px] font-medium text-zinc-400 uppercase tracking-wider">{t(stat.subKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">{t('category')}</h2>
            <p className="text-zinc-500 font-medium mt-2">{t('allPartsDesc')}</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-2 group transition-colors">
            {t('viewAllParts')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6"
        >
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.key}
              to={`/products?category=${cat.name}`}
              className="group relative bg-zinc-50 hover:bg-white border border-zinc-200 hover:border-sky-500/30 rounded-3xl p-6 lg:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-white grid place-items-center mb-6 group-hover:bg-sky-500 group-hover:rotate-12 transition-all duration-300">
                <cat.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 mb-1">{t(cat.key)}</h3>
              <p className="text-sm font-medium text-zinc-400 leading-snug">{t(cat.descKey)}</p>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* Bestsellers */}
      <section className="bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">{t('bestsellers')}</h2>
            <p className="text-zinc-500 font-medium">{t('bestsellersDesc')}</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featured.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onQuickView={(product) => {
                  setQuickViewProduct(product);
                  addToRecentlyViewed(product);
                }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4 flex items-center gap-4">
                  {t('recentlyViewed')}
                  <div className="h-px w-24 bg-zinc-100" />
                </h2>
                <p className="text-zinc-500 font-medium">{t('recentlyViewedDesc')}</p>
              </div>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
            >
              {recentlyViewed.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onQuickView={(product) => {
                    setQuickViewProduct(product);
                    addToRecentlyViewed(product);
                  }}
                />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Special Promotions */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[32px] bg-sky-900 text-white min-h-[280px] p-10 flex flex-col justify-center"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none translate-x-1/4 group-hover:translate-x-0 transition-transform duration-700">
               <Zap className="w-full h-full text-white" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                {t('specialOffers')}
              </div>
              <h3 className="text-3xl font-black mb-4 leading-tight">{t('memberDiscount')}</h3>
              <p className="text-sky-200 font-medium mb-8 max-w-sm">{t('getDiscount')}</p>
              {!user && (
                <Link to="/contact" className="inline-flex items-center gap-3 bg-white text-sky-900 px-6 h-12 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-sky-50 transition-colors">
                  {t('registerNow')} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[32px] bg-amber-500 text-white min-h-[280px] p-10 flex flex-col justify-center"
          >
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-10 pointer-events-none translate-y-1/4 group-hover:translate-y-0 transition-transform duration-700">
               <Car className="w-full h-full text-white" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                {t('featured')}
              </div>
              <h3 className="text-3xl font-black mb-4 leading-tight">PREMIUM <br/>BOSCH FILTERS</h3>
              <p className="text-amber-100 font-medium mb-8 max-w-sm">Upgrade your CAR with professional-grade filtration systems from Bosch.</p>
              <Link to="/products?brand=BOSCH" className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-sm border border-white/20 text-white px-6 h-12 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black/30 transition-colors">
                SHOP COLLECTION <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Aftermarket Gallery */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-6 uppercase">
              Premium <span className="text-sky-500">Aftermarket</span> Components
            </h2>
            <p className="text-zinc-500 font-medium text-lg leading-relaxed mb-8">
              Upgrade your vehicle with elite aftermarket components. From high-performance engine parts 
              to customized lighting and suspension, SprinterPlus provides the premium selection 
              needed for your specialized automotive projects.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white grid place-items-center mb-4">
                  <Cog className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-zinc-900 mb-2 uppercase tracking-tight">OEM Standards</h4>
                <p className="text-sm text-zinc-500 font-medium">Every part meets or exceeds original manufacturer specifications for a perfect fit.</p>
              </div>
              <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white grid place-items-center mb-4">
                  <Wrench className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-zinc-900 mb-2 uppercase tracking-tight">Expert Guides</h4>
                <p className="text-sm text-zinc-500 font-medium">Access detailed technical documentation and support from our certified mechanics.</p>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl">
              <AutoChangingGallery />
            </div>
            
            {/* Accent Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -z-10" />
            
            <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Elite Aftermarket Selection</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* EU Special Order Banner */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="bg-zinc-900 rounded-[48px] overflow-hidden relative group">
          <div className="absolute inset-0">
            <img 
              src={brandsCollageBg} 
              alt="EU Warehouse" 
              className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700" 
            />
            
            {/* Floating Brands Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05] select-none">
              <div className="flex flex-wrap gap-x-20 gap-y-16 p-10">
                {['BOSCH', 'BREMBO', 'FEBI', 'HELLA', 'SACHS', 'VALEO', 'LUK', 'MANN', 'MEYLE', 'MAHLE', 'TRW', 'NGK', 'GATES', 'FILTRON'].map((brand, i) => (
                  <span 
                    key={i} 
                    className="text-6xl font-black tracking-tighter"
                    style={{
                      transform: `rotate(${i % 2 === 0 ? 10 : -10}deg)`,
                    }}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent" />
          </div>
          
          <div className="relative px-8 py-16 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                <Truck className="w-3 h-3" />
                {t('fastDispatch')}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                {t('cantFindPart')} <br/>
                <span className="text-sky-400">{t('weShipEU')}</span>
              </h2>
              <p className="text-zinc-400 text-lg font-medium leading-relaxed mb-10">
                {t('euOrderDesc')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="h-14 px-8 bg-white text-zinc-900 font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-sky-500 hover:text-white transition-all shadow-2xl">
                  {t('euOrderForm')} <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="h-14 px-8 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-3">
                  <Clock className="w-4 h-4 text-sky-400" />
                  {t('euEstimate')}
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
               <div className="grid grid-cols-2 gap-4">
                  <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 grid place-items-center backdrop-blur-xl">
                    <Package className="w-10 h-10 text-sky-400" />
                  </div>
                  <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 grid place-items-center backdrop-blur-xl mt-8">
                    <Truck className="w-10 h-10 text-sky-400" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <ProductQuickView 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />

      {/* Brands */}
      <section id="brands" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-zinc-100">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-10">{t('trustedPartners')}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
          {[
            { name: 'FILTRON', className: 'text-2xl font-black tracking-tighter' },
            { name: 'BOSCH', className: 'text-2xl font-bold italic' },
            { name: 'MANN FILTER', className: 'text-2xl font-bold tracking-tight' },
            { name: 'brembo', className: 'text-3xl font-light tracking-widest' },
            { name: 'HELLA', className: 'text-2xl font-semibold' },
            { name: 'SACHS', className: 'text-2xl font-black italic' }
          ].map((brand) => (
            <a 
              key={brand.name}
              href={BRAND_URLS[brand.name]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${brand.className} hover:text-sky-500 transition-colors`}
            >
              {brand.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
