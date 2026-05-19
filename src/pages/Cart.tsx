import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard, ShieldCheck, Truck, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Cart() {
  const { cart, removeFromCart, updateCartQty, clearCart, placeOrder, user, t, getLocalized, login, isFirstDay } = useStore();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', address: '', phone: '' });

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || ''
      }));
    }
  }, [user]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 15;
  const total = subtotal + shipping;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Simple logic for loyalty tiers
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const prevOrders = orders.filter((o: any) => o.email === formData.email);
    const discount = subtotal > 500 ? 10 : subtotal > 200 ? 5 : 0;
    const totalAfter = total * (1 - discount/100);

    placeOrder({
      ...formData,
      subtotal,
      discountPercent: discount,
      totalAfterDiscount: totalAfter,
      customerTier: prevOrders.length > 5 ? 'Gold' : prevOrders.length > 2 ? 'Silver' : 'Bronze',
      customerPrevOrders: prevOrders.length,
      avatarInitials: formData.name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2)
    });
    
    alert('Thank you for your order! We will process it shortly.');
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-[40px] bg-zinc-50 border border-zinc-100 grid place-items-center">
          <ShoppingBag className="w-10 h-10 text-zinc-300" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">{t('emptyCart')}</h1>
        <p className="text-zinc-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
          {t('emptyCartDesc')}
        </p>
        <Link 
          to="/products"
          className="h-14 px-10 inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-sky-500/20 shadow-xl active:scale-95"
        >
          {t('exploreProducts')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-10">{t('yourCart')}</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
        {/* Cart Items */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden">
            <div className="divide-y divide-zinc-100">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 sm:p-8 flex items-center gap-6"
                  >
                    <img 
                      src={item.image} 
                      alt={getLocalized(item.name)} 
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-3xl bg-zinc-50 border border-zinc-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="font-bold text-zinc-900 text-lg sm:text-xl leading-snug truncate">
                          {getLocalized(item.name)}
                        </h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                        {item.sku} • {item.brand}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-zinc-50 rounded-2xl p-1 border border-zinc-100">
                          <button 
                            onClick={() => updateCartQty(item.id, -1)}
                            className="w-9 h-9 grid place-items-center hover:bg-white rounded-xl transition-colors text-zinc-500"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-zinc-900">{item.qty}</span>
                          <button 
                            onClick={() => updateCartQty(item.id, 1)}
                            className="w-9 h-9 grid place-items-center hover:bg-white rounded-xl transition-colors text-zinc-500"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xl font-extrabold text-zinc-900">
                          €{(item.price * item.qty).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="bg-zinc-50 p-6 flex items-center justify-between border-t border-zinc-100">
              <button 
                onClick={clearCart}
                className="text-sm font-bold text-zinc-400 hover:text-rose-500 transition-colors uppercase tracking-wider"
              >
                {t('emptyCart')}
              </button>
              <Link to="/products" className="text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors uppercase tracking-wider">
                {t('continueShopping')}
              </Link>
            </div>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-zinc-100 rounded-3xl p-6 flex items-center gap-4">
              <Truck className="w-6 h-6 text-emerald-500" />
              <div>
                <div className="font-bold text-sm">{t('kosovoShipping')}</div>
                <div className="text-xs text-zinc-400">1-2 bussines day!</div>
              </div>
            </div>
            <div className="bg-white border border-zinc-100 rounded-3xl p-6 flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-sky-500" />
              <div>
                <div className="font-bold text-sm">{t('warranty')}</div>
                <div className="text-xs text-zinc-400">On all OEM parts</div>
              </div>
            </div>
            <div className="bg-white border border-zinc-100 rounded-3xl p-6 flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-purple-500" />
              <div>
                <div className="font-bold text-sm">Secure Payment</div>
                <div className="text-xs text-zinc-400">SSL Encrypted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-[32px] p-8 lg:p-10 shadow-2xl shadow-zinc-200/50">
            <h2 className="text-xl font-bold text-zinc-900 mb-8 uppercase tracking-wider">{t('summary')}</h2>
            
            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>{t('subtotal')}</span>
                <span className="text-zinc-900 font-bold">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>{t('shipping')}</span>
                <span className="font-bold text-zinc-900">
                  €{shipping.toFixed(2)}
                </span>
              </div>
              <div className="pt-4 border-t border-zinc-100 flex justify-between items-end">
                <div>
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('total')}</div>
                  <div className="text-3xl font-black text-zinc-900 tracking-tight">€{total.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowCheckout(true)}
              className="w-full h-14 bg-zinc-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-sky-500 transition-all duration-300 group active:scale-[0.98]"
            >
              {t('proceedCheckout')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-sky-50 rounded-3xl p-6 border border-sky-100">
            {isFirstDay && (
              <div className="mb-4 pb-4 border-b border-sky-200">
                <div className="flex items-center gap-2 text-sky-600 font-black text-xs uppercase tracking-widest mb-1">
                  <Zap className="w-3 h-3 fill-current" />
                  {t('welcomeOfferActive')}
                </div>
                <p className="text-xs text-sky-800 leading-relaxed">
                  Your 15% first-day discount is applied to eligible items in your cart.
                </p>
              </div>
            )}
            <div className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">Pro Tip</div>
            <p className="text-sm text-sky-800 leading-relaxed font-medium">
              Join our <span className="font-bold">SprinterPlus Registry</span> to earn points on every order. Gold members get 15% off and priority dispatch.
            </p>
          </div>
        </aside>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 py-10 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-3xl p-8 lg:p-12 my-auto"
            >
            <h2 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">{t('secureCheckout')}</h2>
              
              {!user && (
                <div className="mb-8 p-6 bg-zinc-50 border border-zinc-100 rounded-3xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight mb-1">Fast Checkout</h3>
                      <p className="text-xs text-zinc-500 font-medium">Log in with Google to fill your details automatically.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => login()}
                      className="h-12 px-6 bg-white border border-zinc-200 text-zinc-900 text-xs font-black uppercase tracking-widest rounded-xl hover:border-zinc-900 transition-all flex items-center gap-3 active:scale-95 shadow-sm"
                    >
                      <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
                      {t('googleSignIn')}
                    </button>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleCheckout} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">{t('fullName')}</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">{t('emailAddress')}</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium" 
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">{t('shippingAddress')}</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium resize-none" 
                    placeholder="Street, City, Postcode, Country"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">{t('phone')}</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium" 
                    placeholder="+383 44 ..."
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 h-14 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-sky-500 transition-all duration-300 active:scale-[0.98]"
                  >
                    {t('placeOrder')} • €{total.toFixed(2)}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="h-14 px-8 border border-zinc-200 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-50 transition-all"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
