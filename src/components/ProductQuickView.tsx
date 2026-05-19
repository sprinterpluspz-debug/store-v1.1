import React, { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Truck, CheckCircle2, Facebook, Twitter, Linkedin, Share2, RotateCcw, Car, ChevronDown, ChevronUp, Minus, Plus, Maximize2, ZoomIn } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { VEHICLE_DATA } from '../data/vehicles';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  const { addToCart, t, selectedVehicle, getLocalized, user, getEffectivePrice } = useStore();
  const [isCopied, setIsCopied] = useState(false);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };
  React.useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const effectivePrice = getEffectivePrice(product, quantity);

  const isCompatible = selectedVehicle && product.compatibleVehicles?.includes(selectedVehicle.id);

  const compatibleVehicles = VEHICLE_DATA.filter(v => product.compatibleVehicles?.includes(v.id));

  const bulkTiers = [
    { qty: 5, discount: 15, color: 'bg-zinc-50 border-zinc-100 text-zinc-900', activeColor: 'bg-zinc-900 text-white border-zinc-900 shadow-lg' },
    { qty: 20, discount: 20, color: 'bg-sky-50 border-sky-100 text-sky-700', activeColor: 'bg-sky-500 text-white border-sky-500 shadow-lg' },
    { qty: 50, discount: 30, color: 'bg-emerald-50 border-emerald-100 text-emerald-700', activeColor: 'bg-emerald-500 text-white border-emerald-500 shadow-lg' }
  ];

  const activeTier = bulkTiers.slice().reverse().find(t => quantity >= t.qty);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => setShowFullScreenImage(true)}
              className="relative aspect-square md:aspect-auto bg-zinc-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 cursor-zoom-in group overflow-hidden"
            >
              <div 
                className="w-full h-full relative"
                style={{
                  transform: isHovering ? 'scale(1.5)' : 'scale(1)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transition: isHovering ? 'none' : 'transform 0.5s ease-out'
                }}
              >
                <img 
                  src={product.image} 
                  alt={getLocalized(product.name)}
                  className="w-full h-full object-contain max-h-[400px]" 
                />
              </div>
              
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-zinc-900 border border-white">
                  <ZoomIn className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-zinc-900 border border-white">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>

              {product.badge && (
                 <span className="absolute top-8 left-8 bg-zinc-900 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg z-10">
                    {product.badge}
                 </span>
              )}
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-zinc-900/10 backdrop-blur-sm text-[10px] font-black text-zinc-900 px-4 py-2 rounded-full uppercase tracking-widest border border-zinc-900/5">
                  Click to enlarge
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                   <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(product.rating) 
                              ? "fill-amber-400 text-amber-400" 
                              : "fill-zinc-100 text-zinc-100"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{product.rating} REVIEW SCORE</span>
                </div>
                
                <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-3">
                  {getLocalized(product.name)}
                </h2>
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">
                  {product.sku} • {product.brand} • <span className={product.instock ? "text-emerald-500" : "text-sky-500"}>
                    {product.instock ? t('inStock') : t('euSpecialOrder')}
                  </span>
                </div>

                {user ? (
                  <>
                    <div className="flex items-baseline gap-3 mb-4">
                      <div className="text-3xl font-black text-zinc-900 tracking-tighter">
                        €{effectivePrice.toFixed(2)}
                      </div>
                      {effectivePrice < product.price && (
                        <div className="text-sm font-bold text-zinc-300 line-through">
                          €{product.price.toFixed(2)}
                        </div>
                      )}
                      {activeTier && (
                        <div className={cn(
                          "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest animate-pulse",
                          activeTier.qty === 50 ? "bg-emerald-500 text-white" : activeTier.qty === 20 ? "bg-sky-500 text-white" : "bg-zinc-900 text-white"
                        )}>
                          -{activeTier.discount}% {t('discount')}
                        </div>
                      )}
                    </div>

                    {/* Bulk Discounts Section */}
                    <div className="mb-8">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">{t('bulkDiscounts')}</div>
                      <div className="grid grid-cols-3 gap-2">
                        {bulkTiers.map((tier) => (
                          <div 
                            key={tier.qty}
                            onClick={() => setQuantity(tier.qty)}
                            className={cn(
                              "p-3 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer",
                              quantity >= tier.qty ? tier.activeColor : tier.color + " hover:border-zinc-300"
                            )}
                          >
                            <div className="text-[9px] font-black uppercase tracking-tight mb-1 opacity-80">
                              {t('orderQty').replace('{qty}', tier.qty.toString())}
                            </div>
                            <div className="text-sm font-black tracking-tighter">
                              -{tier.discount}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedVehicle && (
                      <div className={cn(
                        "mb-8 p-4 rounded-2xl flex items-center gap-4 border",
                        isCompatible 
                          ? "bg-emerald-50 border-emerald-100 text-emerald-900" 
                          : "bg-rose-50 border-rose-100 text-rose-900"
                      )}>
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          isCompatible ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                        )}>
                          {isCompatible ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('fitmentCheck')}</div>
                          <div className="text-sm font-bold">
                            {isCompatible 
                              ? `${t('fitmentConfirmed')} ${selectedVehicle.model}` 
                              : `${t('fitmentWarning')} ${selectedVehicle.model}`}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl mb-8 flex flex-col items-center text-center">
                    <div className="text-lg font-bold text-zinc-900 mb-2">{t('loginToSeePrice')}</div>
                    <p className="text-xs text-zinc-400 font-medium mb-4">{t('exclusiveContentDesc')}</p>
                    <button 
                      onClick={() => { window.location.href = '/login'; }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-sky-500 transition-all"
                    >
                      {t('login')}
                    </button>
                  </div>
                )}

                <p className="text-zinc-500 text-sm leading-relaxed mb-10 font-medium">
                  {getLocalized(product.description) || "High-quality replacement component designed to meet or exceed OEM specifications. This part ensures optimal performance and longevity for your vehicle's systems. Engineered with precision and tested for durability."}
                </p>

                {user && (
                  <div className="flex flex-col gap-4 mb-10">
                    <div className="flex items-center gap-4">
                      {/* Quantity Selector */}
                      <div className="h-14 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center px-4 gap-4">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input 
                          type="number" 
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 text-center bg-transparent font-black text-zinc-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => { addToCart(product, quantity); onClose(); }}
                        className={cn(
                          "flex-1 h-14 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl",
                          product.instock 
                            ? "bg-zinc-900 text-white hover:bg-sky-500 shadow-zinc-900/10" 
                            : "bg-sky-500 text-white hover:bg-sky-600 shadow-sky-500/20"
                        )}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {product.instock ? t('addToCart') : t('requestFromEu')}
                      </button>
                    </div>

                    {/* Adaptability Toggle Button */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowCompatibility(!showCompatibility)}
                        className="w-full h-14 bg-zinc-50 border border-zinc-100 text-zinc-900 font-bold rounded-2xl flex items-center justify-between px-6 hover:bg-white hover:border-sky-200 transition-all active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-3">
                          <Car className="w-5 h-5 text-sky-500" />
                          <span className="text-sm font-black uppercase tracking-widest">{t('adaptableOnVehicle') || 'Adaptable on Vehicle'}</span>
                        </div>
                        {showCompatibility ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>

                      <AnimatePresence>
                        {showCompatibility && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            className="overflow-hidden bg-zinc-50/50 rounded-2xl mt-2 border border-zinc-100"
                          >
                            <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                              <div className="grid gap-2">
                                {compatibleVehicles.length > 0 ? (
                                  compatibleVehicles.map(v => (
                                    <div key={v.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-100 shadow-sm">
                                      <div>
                                        <div className="text-xs font-black text-zinc-900 uppercase tracking-tight">{v.make} {v.model}</div>
                                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{v.engine} • {v.year}</div>
                                      </div>
                                      <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-8 text-center">
                                    <Car className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                      {t('noSpecificCompatibility')}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-zinc-100 mb-8">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0" />
                    <div>
                      <div className="text-[11px] font-black text-zinc-900 uppercase tracking-widest leading-none mb-1">{t('warranty')}</div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('protection24m')}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-sky-500 shrink-0" />
                    <div>
                      <div className="text-[11px] font-black text-zinc-900 uppercase tracking-widest leading-none mb-1">
                        {product.instock ? t('kosovoShipping') : t('extendedDelivery')}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {product.instock ? "1-2 business days" : t('euDeliveryTime')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 col-span-2 sm:col-span-1 pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-50">
                    <RotateCcw className={cn("w-5 h-5 shrink-0", product.isReturnable ? "text-emerald-500" : "text-rose-500")} />
                    <div>
                      <div className="text-[11px] font-black text-zinc-900 uppercase tracking-widest leading-none mb-1">
                        {product.isReturnable ? t('returnable') : t('nonReturnable')}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {t('returnPolicy')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-100">
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">{t('shareProduct')}</div>
                  <div className="flex gap-3">
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all active:scale-95"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getLocalized(product.name))}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all active:scale-95"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all active:scale-95"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <div className="relative">
                      <button 
                        onClick={async () => {
                          const shareData = {
                            title: getLocalized(product.name),
                            text: getLocalized(product.description),
                            url: window.location.href,
                          };

                          try {
                            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                              await navigator.share(shareData);
                            } else {
                              await navigator.clipboard.writeText(window.location.href);
                              setIsCopied(true);
                              setTimeout(() => setIsCopied(false), 2000);
                            }
                          } catch (error) {
                            if ((error as Error).name !== 'AbortError') {
                              await navigator.clipboard.writeText(window.location.href);
                              setIsCopied(true);
                              setTimeout(() => setIsCopied(false), 2000);
                            }
                          }
                        }}
                        className={cn(
                          "w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center transition-all active:scale-95",
                          isCopied ? "bg-emerald-500 text-white border-emerald-500" : "text-zinc-900 hover:bg-sky-500 hover:text-white hover:border-sky-500"
                        )}
                      >
                        {isCopied ? <CheckCircle2 className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                      </button>
                      <AnimatePresence>
                        {isCopied && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: 10, x: '-50%' }}
                            className="absolute bottom-full left-1/2 mb-2 px-3 py-1 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap pointer-events-none"
                          >
                            Copied!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {showFullScreenImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullScreenImage(false)}
              className="fixed inset-0 bg-zinc-950/95 backdrop-blur-xl cursor-zoom-out"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={() => setShowFullScreenImage(false)}
            >
              <button 
                onClick={() => setShowFullScreenImage(false)}
                className="absolute top-0 right-0 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-[110]"
              >
                <X className="w-6 h-6" />
              </button>

              <img 
                src={product.image} 
                alt={getLocalized(product.name)}
                className="max-w-full max-h-full object-contain select-none"
              />

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-[11px] font-black uppercase tracking-[0.3em] text-center w-full px-4">
                {getLocalized(product.name)} • {product.sku}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
