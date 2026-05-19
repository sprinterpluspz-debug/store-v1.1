import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Plus, Edit2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  layout?: 'grid' | 'list';
  key?: React.Key;
}

export default function ProductCard({ product, onEdit, onQuickView, layout = 'grid' }: ProductCardProps) {
  const { addToCart, user, selectedVehicle, t, getLocalized, isFirstDay } = useStore();
  
  const discountRate = isFirstDay ? 0.15 : 0; // 15% discount for first day
  const currentPrice = product.price * (1 - discountRate);

  const isCompatible = selectedVehicle && product.compatibleVehicles?.includes(selectedVehicle.id);

  const badgeColor = product.badge === 'OEM' 
    ? 'bg-zinc-900' 
    : product.badge === 'Bestseller' || product.badge === 'Best Seller'
    ? 'bg-sky-500' 
    : 'bg-emerald-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onQuickView?.(product)}
      className={cn(
        "group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300",
        onQuickView && "cursor-pointer",
        layout === 'list' ? "flex flex-col sm:flex-row gap-0 sm:gap-4" : "flex flex-col"
      )}
    >
      <div className={cn(
        "relative bg-zinc-50 overflow-hidden",
        layout === 'list' ? "w-full sm:w-48 aspect-square sm:aspect-auto sm:h-auto shrink-0" : "aspect-[4/3]"
      )}>
        <img
          src={product.image}
          alt={getLocalized(product.name)}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.badge && (
            <span className={cn(
              "text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm",
              badgeColor
            )}>
              {product.badge}
            </span>
          )}

          {product.isReturnable === false && (
            <span className="text-white bg-rose-500 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
              {t('nonReturnable')}
            </span>
          )}

          {isCompatible && (
            <div className="text-emerald-700 bg-white/90 backdrop-blur-md border border-emerald-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {t('guaranteedFit')}
            </div>
          )}
        </div>
        
        <div className={cn(
          "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10",
          product.instock ? "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0" : "hidden"
        )}>
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className="w-9 h-9 grid place-items-center bg-white/90 backdrop-blur rounded-xl shadow-sm hover:bg-white text-zinc-400 hover:text-rose-500 transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>
          {user?.role === 'admin' && onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(product); }}
              className="w-9 h-9 grid place-items-center bg-white/90 backdrop-blur rounded-xl shadow-sm hover:bg-white text-zinc-400 hover:text-sky-500 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {!product.instock && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="bg-zinc-900/90 text-white text-[9px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase shadow-xl backdrop-blur-sm w-fit border border-white/10">
                  {t('euSpecialLabel')}
                </span>
                <span className="bg-sky-500/90 text-white text-[8px] font-black px-2 py-1.5 rounded-md tracking-widest uppercase shadow-lg backdrop-blur-sm w-fit border border-white/10">
                  {t('daysDelivery')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={cn(
        "p-2.5 flex flex-col flex-grow",
        layout === 'list' && "sm:py-4 sm:pr-5"
      )}>
        {!product.instock && (
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); }}
              className="px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-white hover:border-rose-100 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
            >
              <Heart className="w-3.5 h-3.5" />
              {t('wishlist')}
            </button>
            {user?.role === 'admin' && onEdit && (
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                className="px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-400 hover:text-sky-500 hover:bg-white hover:border-sky-100 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {t('edit')}
              </button>
            )}
          </div>
        )}
        <div className="flex items-start justify-between gap-1.5 mb-0.5">
          <h3 className={cn(
            "font-bold text-zinc-900 leading-tight line-clamp-2 h-8 group-hover:text-sky-600 transition-colors text-[13px]",
            layout === 'list' && "text-base sm:text-lg sm:h-auto sm:line-clamp-1"
          )}>
            {getLocalized(product.name)}
          </h3>
        </div>
        <div className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 opacity-80">
          {product.sku} • {product.brand}
        </div>
        
        {layout === 'list' && product.description && (
          <p className="text-sm text-zinc-500 line-clamp-2 mb-4 hidden sm:block">
            {getLocalized(product.description)}
          </p>
        )}

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(product.rating) 
                    ? "fill-amber-400 text-amber-400" 
                    : "fill-zinc-100 text-zinc-100"
                )}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-zinc-400">{product.rating}</span>
        </div>

        <div className={cn(
          "flex items-center justify-between mt-auto pt-2 border-t border-zinc-50",
          layout === 'list' && "sm:border-t-0 sm:pt-0"
        )}>
          {user ? (
            <>
            <div className="text-base font-black tracking-tight text-zinc-900 flex flex-col items-start leading-none">
              {isFirstDay && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[9px] text-sky-500 font-black mb-1 uppercase tracking-wider animate-pulse flex items-center gap-1"
                >
                  <Zap className="w-2.5 h-2.5 fill-current" />
                  {t('welcomeOffer')}
                </motion.span>
              )}
              <div className="flex items-baseline gap-1.5">
                <motion.span
                  initial={isFirstDay ? { opacity: 0, scale: 1.1, y: -2 } : {}}
                  animate={isFirstDay ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                >
                  €{currentPrice.toFixed(2)}
                </motion.span>
                {isFirstDay && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.5, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-[10px] text-zinc-300 line-through decoration-zinc-400"
                  >
                    €{product.price.toFixed(2)}
                  </motion.span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                className={cn(
                  "h-8 px-2.5 text-white text-[9px] font-black rounded-lg transition-all active:scale-95 flex items-center gap-1.5 uppercase tracking-wide",
                  product.instock ? "bg-zinc-900 hover:bg-sky-500 shadow-lg shadow-zinc-900/10" : "bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/20",
                  layout === 'list' && "sm:h-10 sm:px-6 sm:text-xs"
                )}
              >
                <Plus className="w-3 h-3" />
                {product.instock ? t('add') : t('orderEu')}
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <Link
                to="/login"
                onClick={(e) => e.stopPropagation()}
                className="w-full h-10 bg-zinc-50 border border-zinc-200 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-sky-500 hover:text-sky-500 hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                {t('loginToSeePrice')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
