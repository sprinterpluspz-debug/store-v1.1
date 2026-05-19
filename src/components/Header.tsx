import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Truck, ShoppingCart, Heart, Search, Menu, X, LogOut, User as UserIcon, Home, Package, Info, Mail, LayoutGrid, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { cart, user, logout, language, setLanguage, t, login, products, getLocalized } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const navLinks = [
    { name: t('home'), path: '/', icon: Home },
    { name: t('products'), path: '/products', icon: Package },
    { name: t('brands'), path: '/brands', icon: LayoutGrid },
    { name: t('about'), path: '/about', icon: Info },
    { name: t('contact'), path: '/contact', icon: Mail },
  ];

  const suggestions = searchQuery.trim().length >= 2 
    ? products
        .filter(p => {
          const name = getLocalized(p.name).toLowerCase();
          const sku = (p.sku || '').toLowerCase();
          const query = searchQuery.toLowerCase();
          return name.includes(query) || sku.includes(query);
        })
        .slice(0, 6)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (p: Product) => {
    navigate(`/products?search=${encodeURIComponent(getLocalized(p.name))}`);
    setSearchQuery(getLocalized(p.name));
    setShowSuggestions(false);
    setIsSearchOpen(false);
  };

  return (
    <>
      <div className="bg-zinc-900 text-zinc-100 text-[11px] font-bold uppercase tracking-widest py-2.5 px-4 text-center">
        <span className="inline-flex items-center gap-3">
          <span>15-day returns</span>
          <span className="opacity-40">•</span>
          <span>Kosovo delivery 1-2 days</span>
        </span>
      </div>

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl grid place-items-center group-hover:bg-sky-500 transition-colors shadow-lg shadow-zinc-900/10 group-hover:shadow-sky-500/20">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-[20px] font-black tracking-tight leading-none">
                SPRINTER<span className="text-sky-500">PLUS</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-[13px] font-black uppercase tracking-widest">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "hover:text-sky-500 text-zinc-500 transition-all pb-1 border-b-2 border-transparent",
                    location.pathname === link.path && "text-zinc-900 border-sky-500"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Desktop Search */}
              <div className="hidden lg:block relative">
                <form onSubmit={handleSearch} className="flex items-center relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={t('search')}
                    className="w-[220px] xl:w-[280px] h-11 pl-10 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-sm"
                  />
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
                </form>

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowSuggestions(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 rounded-2xl shadow-2xl z-20 overflow-hidden"
                      >
                        <div className="p-2">
                          {suggestions.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => handleSuggestionClick(p)}
                              className="w-full flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-xl transition-all group text-left"
                            >
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                                <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-black text-zinc-900 truncate uppercase tracking-tight">
                                  {getLocalized(p.name)}
                                </div>
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                  {p.category} • {p.brand}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-sky-500 transition-colors" />
                            </button>
                          ))}
                        </div>
                        <div className="p-3 bg-zinc-50 border-t border-zinc-100">
                          <button 
                            onClick={handleSearch}
                            className="w-full text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hover:text-sky-500 transition-colors"
                          >
                            {t('viewAllResults')}
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Search Toggle */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden w-10 h-10 grid place-items-center rounded-xl hover:bg-zinc-50 transition text-zinc-700"
              >
                <Search className="w-5 h-5" />
              </button>

              <button className="relative w-10 h-10 grid place-items-center rounded-xl hover:bg-zinc-50 transition">
                <Heart className="w-5 h-5 text-zinc-700" />
              </button>

              <Link to="/cart" className="relative w-10 h-10 grid place-items-center rounded-xl hover:bg-zinc-50 transition group">
                <ShoppingCart className="w-5 h-5 text-zinc-700 group-hover:text-sky-500 transition-colors" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 grid place-items-center bg-sky-500 text-white text-[10px] font-black rounded-lg shadow-lg shadow-sky-500/30"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {user ? (
                <div className="hidden sm:flex items-center gap-3 ml-2">
                  <div className="h-8 w-px bg-zinc-100 mx-2" />
                  <Link to="/profile" className="flex items-center gap-3 hover:text-sky-500 transition-colors group">
                    <div className="text-right hidden xl:block">
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{t('hi')}</div>
                      <div className="text-sm font-black text-zinc-900 uppercase tracking-tight">{user.name.split(' ')[0]}</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 grid place-items-center group-hover:bg-sky-500 group-hover:text-white transition-all">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  </Link>

                  {user.role === 'admin' && (
                    <Link to="/admin" className="px-4 py-2 bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95 flex items-center gap-2">
                      <LayoutDashboard className="w-3 h-3" /> Admin
                    </Link>
                  )}

                  <div className="flex items-center gap-2 ml-1 border-l border-zinc-100 pl-4">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="bg-transparent text-[11px] font-black uppercase tracking-widest focus:outline-none cursor-pointer hover:text-sky-500 transition-colors"
                    >
                      <option value="en">EN</option>
                      <option value="sq">SQ</option>
                      <option value="sr">SR</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-2">
                  <div className="h-8 w-px bg-zinc-100 mx-2" />
                  <div className="flex items-center gap-1 pr-3 mr-1">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="bg-transparent text-[11px] font-black uppercase tracking-widest focus:outline-none cursor-pointer hover:text-sky-500 transition-colors"
                    >
                      <option value="en">EN</option>
                      <option value="sq">SQ</option>
                      <option value="sr">SR</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => login()}
                      title={t('googleSignIn')}
                      className="hidden xl:grid place-items-center w-10 h-10 bg-white border border-zinc-200 rounded-xl hover:border-zinc-900 transition-all active:scale-95"
                    >
                      <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
                    </button>
                    <Link to="/login" className="px-5 py-2.5 bg-zinc-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-sky-500 transition-all shadow-lg shadow-zinc-900/10 hover:shadow-sky-500/20 active:scale-95">
                      {t('login')}
                    </Link>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden w-10 h-10 grid place-items-center rounded-xl hover:bg-zinc-50 bg-zinc-100 transition-all active:scale-95"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Search Dropdown Mobile */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden bg-white border-t border-zinc-100"
              >
                <div className="py-4">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder={t('search')}
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-4" />
                  </form>

                  {/* Mobile Mobile Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="mt-2 bg-white border border-zinc-100 rounded-2xl shadow-xl overflow-hidden">
                      <div className="p-2">
                        {suggestions.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleSuggestionClick(p)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-xl transition-all text-left"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                              <img src={p.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-black text-zinc-900 truncate uppercase tracking-tight">
                                {getLocalized(p.name)}
                              </div>
                              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                {p.category}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-[320px] bg-white shadow-2xl flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-zinc-100">
                <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMenuOpen(false)}>
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl grid place-items-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-xl tracking-tight">SPRINTER<span className="text-sky-500">PLUS</span></span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 grid place-items-center rounded-xl bg-zinc-100 hover:bg-zinc-200 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Mobile Search - Prominent in menu as well */}
                <div className="mb-8 relative">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder={t('search')}
                      className="w-full h-12 pl-11 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-4" />
                  </form>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="mt-2 bg-white border border-zinc-100 rounded-2xl shadow-xl overflow-hidden max-h-[300px] overflow-y-auto">
                      <div className="p-2">
                        {suggestions.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleSuggestionClick(p)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-xl transition-all text-left"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                              <img src={p.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="max-w-[200px]">
                              <div className="text-[13px] font-black text-zinc-900 truncate uppercase tracking-tight">
                                {getLocalized(p.name)}
                              </div>
                              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                {p.category}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-2">Navigation</h3>
                    <nav className="flex flex-col gap-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-2xl transition-all group",
                            location.pathname === link.path 
                              ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20" 
                              : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl grid place-items-center transition-colors",
                              location.pathname === link.path ? "bg-white/10" : "bg-white shadow-sm group-hover:bg-sky-500 group-hover:text-white"
                            )}>
                              <link.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-wider">{link.name}</span>
                          </div>
                          <ChevronRight className={cn("w-4 h-4 opacity-40", location.pathname === link.path && "opacity-100")} />
                        </Link>
                      ))}
                    </nav>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-2">Settings</h3>
                    <div className="p-4 bg-zinc-50 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{t('language')}</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm">
                          {(['en', 'sq', 'sr'] as const).map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setLanguage(lang)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                language === lang ? "bg-sky-500 text-white" : "text-zinc-400 hover:text-zinc-600"
                              )}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
                {user ? (
                  <div className="space-y-3">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-zinc-100 hover:border-sky-200 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 grid place-items-center group-hover:bg-sky-500 group-hover:text-white transition-all">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">{t('hi')}</div>
                        <div className="text-sm font-black text-zinc-900 uppercase tracking-tight">{user.name}</div>
                      </div>
                    </Link>
                    
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-sky-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    <button 
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg active:scale-95"
                    >
                      <LogOut className="w-4 h-4" /> {t('logout')}
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-sky-500 transition-all shadow-lg active:scale-95"
                  >
                    <UserIcon className="w-4 h-4" /> {t('login')}
                  </Link>
                )}
                
                <div className="mt-8 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                  15-day returns<br/>
                  Kosovo delivery 1-2 days
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
