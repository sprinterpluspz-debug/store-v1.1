import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import { Phone, MapPin, Mail, Clock, MessageSquare, Truck, ShieldCheck, Send } from 'lucide-react';

export default function Contact() {
  const { t } = useStore();

  const contactInfo = [
    {
      icon: Phone,
      label: t('phone'),
      value: '+383 44 930 260',
      desc: 'Available Mon-Sat for support',
      link: 'tel:+38344930260'
    },
    {
      icon: MapPin,
      label: t('address'),
      value: t('storeAddress'),
      desc: 'Prizren, Kosovo',
      link: 'https://maps.google.com/?q=Ahmet+Prishtina+nr141+Prizren+Kosovo'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@sprinterplus.com',
      desc: t('emailSupportDesc'),
      link: 'mailto:info@sprinterplus.com'
    }
  ];

  const canonicalUrl = "https://sprinterplus.com/contact";
  const pageTitle = "Contact Us | Sprinter Plus";
  const pageDescription = "Get in touch with the Sprinter parts experts. Contact us for part availability, EU special orders, or technical support. Visit our store in Prizren, Kosovo.";
  const pageImage = "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
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
      {/* Hero Header */}
      <div className="bg-zinc-900 pt-24 pb-48 text-center text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <MessageSquare className="w-3 h-3" />
            {t('contact')}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight mb-6"
          >
            {t('contactTitle')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 font-medium text-lg max-w-xl mx-auto"
          >
            {t('contactSubtitle')}
          </motion.p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-xl shadow-zinc-200/50">
              <h3 className="font-black text-zinc-900 uppercase tracking-widest text-sm mb-8">{t('details')}</h3>
              
              <div className="space-y-10">
                {contactInfo.map((item) => (
                  <div key={item.label} className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                        <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-sky-500 transition-colors" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{item.label}</div>
                        <a href={item.link} className="font-black text-zinc-900 hover:text-sky-500 transition-colors">{item.value}</a>
                        <div className="text-sm text-zinc-500 mt-1">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-12 border-t border-zinc-50">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6">{t('workingHours')}</div>
                <div className="space-y-3 font-bold text-zinc-900 text-sm">
                  <div className="flex justify-between">
                    <span>{t('monFri')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('sat')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>{t('sun')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sky-500 rounded-3xl p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="font-black text-xl mb-4 leading-tight">{t('storeSupport')}</h4>
                  <p className="text-sky-100 text-sm font-medium mb-6">{t('storeSupportDesc')}</p>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="font-bold text-sm tracking-widest">CERTIFIED DEALER</span>
                  </div>
               </div>
               <Truck className="absolute -bottom-6 -right-6 w-32 h-32 text-sky-400/20" />
            </div>

            <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden border border-zinc-800">
               <div className="relative z-10">
                  <div className="text-sky-500 font-black text-[10px] uppercase tracking-widest mb-3">EU Distribution</div>
                  <h4 className="font-black text-xl mb-4 leading-tight">{t('euSpecialOrders')}</h4>
                  <p className="text-zinc-400 text-sm font-medium mb-6">{t('euDistributionDesc')}</p>
                  <div className="flex items-center gap-3 text-sky-500">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold text-sm">{t('euEstimate')}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] p-8 md:p-12 border border-zinc-100 shadow-xl shadow-zinc-200/50">
              <h2 className="text-3xl font-black text-zinc-900 mb-8">{t('sendUsMessage')}</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">{t('fullName')}</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">{t('emailAddress')}</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">{t('subject')}</label>
                  <select className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition">
                    <option>{t('generalInquiry')}</option>
                    <option>{t('euOrderInquiry')}</option>
                    <option>{t('partRequestInquiry')}</option>
                    <option>{t('orderStatusInquiry')}</option>
                    <option>{t('businessInquiry')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">{t('message')}</label>
                  <textarea 
                    rows={6}
                    placeholder={`${t('message')}...`}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition resize-none"
                  ></textarea>
                </div>
                <button className="w-full h-16 bg-zinc-900 hover:bg-sky-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
                  <Send className="w-4 h-4" />
                  {t('sendMessage')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
