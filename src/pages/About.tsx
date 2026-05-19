import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import { ShieldCheck, Award, Users, History } from 'lucide-react';
import featureImage from '../assets/images/regenerated_image_1778929707806.png';

export default function About() {
  const { t } = useStore();

  const features = [
    {
      icon: History,
      title: t('experienceTitle'),
      desc: t('experienceDesc')
    },
    {
      icon: ShieldCheck,
      title: t('qualityTitle'),
      desc: t('qualityDesc')
    },
    {
      icon: Award,
      title: t('supportTitle'),
      desc: t('storeSupportDesc')
    }
  ];

  const canonicalUrl = "https://sprinterplus.com/about";
  const pageTitle = "About Us | Sprinter Plus";
  const pageDescription = "Dedicated to Sprinter excellence since 1996. Learn about Sprinter Plus, our history in Prizren, and our commitment to providing premium car parts.";
  const pageImage = "https://images.unsplash.com/photo-1486262715619-67b1418b671a?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-white pb-24">
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
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden bg-zinc-900 flex items-center">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1486262715619-67b1418b671a?q=80&w=2000&auto=format&fit=crop" 
            alt="Auto parts warehouse"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
        
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6"
          >
            {t('aboutSubtitle')}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 text-sky-400 font-bold uppercase tracking-widest text-sm"
          >
            <span>{t('since1996')}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-500" />
            <span>{t('prizrenKosovo')}</span>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl shadow-zinc-200 border border-zinc-100"
        >
          <div className="prose prose-zinc prose-lg max-w-none">
            <h2 className="text-3xl font-black text-zinc-900 mb-8">{t('aboutTitle')}</h2>
            <p className="text-zinc-600 leading-relaxed font-medium text-lg">
              {t('aboutStory')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mt-20">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="font-black text-zinc-900 uppercase tracking-widest text-sm mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="bg-zinc-50 rounded-[60px] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-black text-zinc-900 mb-6">{t('builtOnTrust')}</h2>
            <p className="text-zinc-500 font-medium text-lg mb-8">
              {t('aboutStory')}
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center">
                <Users className="w-8 h-8 text-zinc-900" />
              </div>
              <div className="font-black text-2xl text-zinc-900">
                10,000+ <br/><span className="text-zinc-400 text-sm uppercase tracking-widest">{t('happyCustomers')}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full aspect-square md:aspect-video rounded-[40px] overflow-hidden relative group shadow-2xl shadow-zinc-200">
            <img 
              src={featureImage} 
              alt="Premium Car Parts"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent h-1/2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em] mb-1">{t('officialSupplier')}</div>
                  <h3 className="text-white font-black text-3xl uppercase tracking-tighter">Sprinter Plus</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
