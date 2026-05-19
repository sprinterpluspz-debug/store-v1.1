import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';
import { User, MapPin, Package, Settings, Save, X, Phone, Mail, User as UserIcon, Calendar, ArrowRight, ShieldCheck, History, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, orders, updateUser, logout, resendVerification, t, getLocalized } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'details' | 'addresses'>('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  if (!user) {
    return null;
  }

  const handleResend = async () => {
    try {
      await resendVerification();
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000);
    } catch (err) {
      alert('Failed to resend. Please try again later.');
    }
  };

  const userOrders = orders.filter(o => o.email === user.email);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ ...user, ...formData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const tabs = [
    { id: 'orders', name: 'Order History', icon: History },
    { id: 'details', name: 'Account Details', icon: UserIcon },
    { id: 'addresses', name: 'Saved Addresses', icon: MapPin },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <Helmet>
        <title>My Profile | Sprinter Plus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex flex-col gap-8 w-full">
          {!user.emailVerified && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-[32px] p-6 lg:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 grid place-items-center shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-amber-900 mb-1">Verify your email address</h3>
                <p className="text-amber-700/80 text-sm font-medium leading-relaxed max-w-xl">
                  Your access is currently restricted. Please verify your email to unlock order placement and profile updates.
                </p>
              </div>
              <button 
                onClick={handleResend}
                disabled={emailSent}
                className="h-12 px-8 rounded-xl bg-amber-600 text-white font-black text-xs uppercase tracking-widest hover:bg-amber-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {emailSent ? <CheckCircle2 className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {emailSent ? 'SENT!' : 'RESEND LINK'}
              </button>
            </motion.div>
          )}

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[32px] bg-sky-50 text-sky-700 grid place-items-center font-black text-2xl shadow-inner uppercase tracking-tighter">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">{t('myProfile')}</h1>
              <p className="text-zinc-500 font-medium mt-1">{t('manageAccount')}</p>
            </div>
          </div>
        </div>

        <div className="flex bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-white text-zinc-900 shadow-lg shadow-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <tab.icon className="w-4 h-4" /> {t(tab.id as any).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
        {/* Main Content */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {userOrders.length === 0 ? (
                  <div className="text-center py-24 bg-zinc-50 rounded-[40px] border border-dashed border-zinc-200">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-xl shadow-zinc-200/50 grid place-items-center">
                      <Package className="w-8 h-8 text-zinc-300" />
                    </div>
                    <h3 className="font-extrabold text-xl text-zinc-900 mb-1">{t('noOrders')}</h3>
                    <p className="text-zinc-500 font-medium">When you shop, your history will appear here.</p>
                  </div>
                ) : (
                  userOrders.slice().reverse().map(order => (
                    <div key={order.id} className="bg-white border border-zinc-200 rounded-[32px] p-8 overflow-hidden group">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">Order #{String(order.id).slice(-6)}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                              order.status === 'processed' ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"
                            )}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-zinc-900">{new Date(order.created).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('totalAmount')}</div>
                          <div className="text-2xl font-black text-zinc-900 tracking-tighter">€{(order.totalAfterDiscount || order.subtotal).toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-8 items-start">
                        <div className="space-y-4">
                          <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{t('orderedItems')}</h4>
                          <div className="space-y-3">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-4 p-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <img src={item.image} className="w-10 h-10 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold text-zinc-900 truncate">{getLocalized(item.name)}</div>
                                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{t('qty')}: {item.qty}</div>
                                </div>
                                <div className="text-xs font-black text-zinc-900">€{item.price.toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{t('shippingDetail')}</h4>
                          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                            <div className="text-sm font-bold text-zinc-900 mb-1">{order.name}</div>
                            <div className="text-xs text-zinc-600 leading-relaxed font-medium">{order.address}</div>
                            <div className="text-xs text-zinc-400 mt-2">{order.phone}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-zinc-200 rounded-[32px] p-8 lg:p-12 shadow-sm"
              >
                {!isEditing ? (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{t('accountDetails')}</h2>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="h-10 px-6 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors text-sm font-bold flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" /> {t('editProfile')}
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Display Name</div>
                        <div className="flex items-center gap-3 font-bold text-zinc-900 py-2 border-b border-zinc-100">
                          <UserIcon className="w-4 h-4 text-zinc-400" /> {user.name}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Email Endpoint</div>
                        <div className="flex items-center gap-3 font-bold text-zinc-900 py-2 border-b border-zinc-100">
                          <Mail className="w-4 h-4 text-zinc-400" /> {user.email}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Phone Number</div>
                        <div className="flex items-center gap-3 font-bold text-zinc-900 py-2 border-b border-zinc-100">
                          <Phone className="w-4 h-4 text-zinc-400" /> {user.phone || 'Not provided'}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Default Address</div>
                        <div className="flex items-center gap-3 font-bold text-zinc-900 py-2 border-b border-zinc-100 italic opacity-70">
                          <MapPin className="w-4 h-4 text-zinc-400" /> {user.address || 'No address saved'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{t('edit')}</h2>
                      <div className="flex gap-3">
                        <button 
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="h-10 px-4 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button 
                          type="submit"
                          className="h-10 px-6 rounded-xl bg-zinc-900 text-white font-bold flex items-center gap-2 hover:bg-sky-500 transition-colors"
                        >
                          <Save className="w-4 h-4" /> {t('saveChanges').toUpperCase()}
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">{t('fullName')}</label>
                        <input 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-2 focus:ring-sky-500 font-bold transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">{t('emailAddress')}</label>
                        <input 
                          required
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-2 focus:ring-sky-500 font-bold transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">{t('phone')}</label>
                        <input 
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-2 focus:ring-sky-500 font-bold transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">{t('address')}</label>
                        <input 
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:ring-2 focus:ring-sky-500 font-bold transition-all"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid sm:grid-cols-2 gap-6"
              >
                <div className="bg-white border-2 border-sky-500/20 rounded-[32px] p-8 relative">
                   <div className="absolute top-6 right-6">
                     <span className="bg-sky-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">DEFAULT</span>
                   </div>
                   <MapPin className="w-10 h-10 text-sky-500 mb-6" />
                   <h3 className="font-bold text-lg text-zinc-900 mb-2">Primary Address</h3>
                   <p className="text-zinc-500 text-sm leading-relaxed mb-4">
                     {user.address || 'No primary address configured.'}
                   </p>
                   <button 
                    onClick={() => { setActiveTab('details'); setIsEditing(true); }}
                    className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest"
                   >
                     Update address
                   </button>
                </div>

                <button className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[32px] p-8 hover:bg-white hover:border-sky-500/30 transition-all group flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 grid place-items-center mb-4 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-zinc-900">Add New Address</div>
                  <div className="text-xs text-zinc-400">Save another shipping location</div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-6 lg:sticky lg:top-28">
           <div className="bg-zinc-900 rounded-[32px] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <ShieldCheck className="w-8 h-8 text-sky-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">SprinterPlus Protection</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Your data is protected with enterprise-grade SSL encryption and compliant with EU GDPR regulations.
                </p>
                <div className="flex items-center gap-3 text-xs font-black text-sky-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Secured Session
                </div>
              </div>
           </div>

           <div className="bg-white border border-zinc-200 rounded-[32px] p-8">
              <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-6 px-1">Loyalty Rewards</h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-sm font-bold text-zinc-900">Level Progression</span>
                       <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
                          {userOrders.length > 5 ? 'Elite Gold' : userOrders.length > 2 ? 'Silver Pro' : 'Bronze Starter'}
                       </span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                       <div 
                        className="h-full bg-sky-500 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (userOrders.length / 10) * 100)}%` }}
                       />
                    </div>
                    <div className="text-[10px] text-zinc-400 font-bold mt-2 uppercase tracking-widest">
                       {10 - userOrders.length > 0 ? `${10 - userOrders.length} orders until next level` : 'Maximum level achieved'}
                    </div>
                 </div>

                 <button 
                  onClick={logout}
                  className="w-full h-12 rounded-xl border border-rose-100 text-rose-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                 >
                    {t('signOut').toUpperCase()}
                 </button>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
