import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';
import { Plus, Edit2, Trash2, CheckCircle2, History, Package, ClipboardList, User as UserIcon, Calendar, ArrowRight, DollarSign, Car, Search, ChevronDown, ChevronRight, TrendingUp, AlertTriangle, BarChart3, Users, LayoutDashboard, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Product, Order, Vehicle } from '../types';
import { VEHICLE_DATA } from '../data/vehicles';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function Admin() {
  const { products, orders, vehicles, user, users, deleteUser, addProduct, updateProduct, deleteProduct, deleteOrder, toggleOrderStatus, addVehicle, updateVehicle, deleteVehicle, t, getLocalized } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'inventory' | 'orders' | 'vehicles' | 'users'>('dashboard');
  const [revenueView, setRevenueView] = useState<'live' | 'history'>('live');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showBulkVehicleModal, setShowBulkVehicleModal] = useState(false);
  const [showBulkProductModal, setShowBulkProductModal] = useState(false);
  const [bulkVehicleData, setBulkVehicleData] = useState('');
  const [bulkProductData, setBulkProductData] = useState('');

  const handleBulkVehicleImport = () => {
    const lines = bulkVehicleData.split('\n').filter(line => line.trim());
    let importedCount = 0;
    
    lines.forEach(line => {
      // Split by comma, tab, or pipe
      const parts = line.split(/[,\t|]/).map(s => s.trim());
      const [make, model, year, engine] = parts;
      
      if (make && model && year && engine) {
        addVehicle({
          make,
          model,
          year,
          engine
        });
        importedCount++;
      }
    });

    setBulkVehicleData('');
    setShowBulkVehicleModal(false);
    alert(`Successfully imported ${importedCount} vehicles.`);
  };

  const handleBulkProductImport = () => {
    const lines = bulkProductData.split('\n').filter(line => line.trim());
    let importedCount = 0;
    
    lines.forEach(line => {
      // Format: SKU, Name (EN), Price, Brand, Category, ImageURL
      const parts = line.split(/[,\t|]/).map(s => s.trim());
      const [sku, name, price, brand, category, image] = parts;
      
      if (sku && name && price && brand && category) {
        addProduct({
          sku,
          name: { en: name, sq: name, sr: name },
          description: { en: name, sq: name, sr: name },
          price: parseFloat(price) || 0,
          brand,
          category,
          image: image || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=200',
          instock: true,
          quantity: 10,
          rating: 4.5,
          isReturnable: true,
          compatibleVehicles: []
        });
        importedCount++;
      }
    });

    setBulkProductData('');
    setShowBulkProductModal(false);
    alert(`Successfully imported ${importedCount} products.`);
  };
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showInlineVehicleAdd, setShowInlineVehicleAdd] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({ 
    sku: '',
    brand: '',
    image: '',
    category: 'Oil',
    instock: true, 
    rating: 4.5, 
    quantity: 0, 
    isReturnable: true,
    compatibleVehicles: [],
    name: { en: '', sq: '', sr: '' },
    description: { en: '', sq: '', sr: '' }
  });
  const [vehicleForm, setVehicleForm] = useState<Partial<Vehicle>>({});
  const [inlineVehicleForm, setInlineVehicleForm] = useState<Partial<Vehicle>>({});
  const [bulkCompatibilityData, setBulkCompatibilityData] = useState('');
  const [showBulkCompatibility, setShowBulkCompatibility] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedMakes, setExpandedMakes] = useState<Set<string>>(new Set());
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  const toggleMakeExpanded = (make: string) => {
    const next = new Set(expandedMakes);
    if (next.has(make)) next.delete(make);
    else next.add(make);
    setExpandedMakes(next);
  };

  const toggleModelExpanded = (makeModel: string) => {
    const next = new Set(expandedModels);
    if (next.has(makeModel)) next.delete(makeModel);
    else next.add(makeModel);
    setExpandedModels(next);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-black mb-4">{t('accessDenied')}</h1>
        <p className="text-zinc-500 mb-8 font-medium">{t('adminLoginRequired')}</p>
        <button onClick={() => window.location.href = '/login'} className="h-12 px-8 bg-zinc-900 text-white font-bold rounded-xl">{t('login').toUpperCase()}</button>
      </div>
    );
  }

  const handlePrintLabel = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    if (!printWindow) return;

    const itemsHtml = order.items.map(item => `<li>${getLocalized(item.name)} x${item.qty}</li>`).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label - #${order.id}</title>
          <style>
            @page { size: auto; margin: 0; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 40px;
              line-height: 1.4;
            }
            .label-container {
              border: 3px solid black;
              padding: 40px;
              max-width: 500px;
              margin: 0 auto;
              border-radius: 10px;
            }
            .title { 
              font-size: 32px; 
              font-weight: 900; 
              letter-spacing: -0.05em;
              border-bottom: 3px solid black;
              padding-bottom: 20px;
              margin-bottom: 30px;
              text-align: center;
            }
            .section-label {
              font-size: 10px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #666;
              margin-bottom: 5px;
            }
            .customer-name { 
              font-size: 24px; 
              font-weight: 700;
              margin-bottom: 5px;
            }
            .address { 
              font-size: 18px; 
              margin-bottom: 20px;
            }
            .phone {
              font-size: 16px;
              margin-bottom: 30px;
            }
            .order-meta {
              display: flex;
              justify-content: space-between;
              border-top: 1px solid #eee;
              padding-top: 20px;
              font-size: 12px;
              font-weight: 700;
            }
            .items {
              margin-top: 20px;
              font-size: 11px;
              color: #444;
            }
            ul { padding-left: 15px; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="label-container">
            <div class="title">SPRINTER PLUS</div>
            <div style="font-size: 10px; color: #666; margin-bottom: 20px;">
              Prizren 20000, Ahmet Prishtina nr.141<br/>
              +383 44 930 260 • ARBK: 810136615
            </div>
            <div class="section-label">Ship To:</div>
            <div class="customer-name">${order.name}</div>
            <div class="address">${order.address}</div>
            <div class="phone">${order.phone}</div>
            
            <div class="order-meta">
              <span>ORDER: #${String(order.id).slice(-6)}</span>
              <span>DATE: ${new Date(order.created).toLocaleDateString()}</span>
            </div>

            <div class="items">
              <div class="section-label">Contents:</div>
              <ul>${itemsHtml}</ul>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintInvoice = (order: Order) => {
    window.open(`/admin/invoice/${order.id}`, '_blank');
  };

  const resetProductForm = () => {
    setProductForm({ 
      sku: '',
      brand: '',
      image: '',
      category: 'Oil',
      instock: true, 
      rating: 4.5, 
      quantity: 0, 
      isReturnable: true,
      compatibleVehicles: [],
      name: { en: '', sq: '', sr: '' },
      description: { en: '', sq: '', sr: '' }
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productForm } as Product);
    } else {
      addProduct(productForm as any);
    }
    setShowProductModal(false);
    setEditingProduct(null);
    resetProductForm();
  };

  const handleInlineVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vid = `${inlineVehicleForm.make?.toLowerCase().slice(0, 1)}-${inlineVehicleForm.model?.toLowerCase().split(' ')[0]}-${inlineVehicleForm.year}-${inlineVehicleForm.engine?.toLowerCase().replace(/\s+/g, '-')}-${String(Date.now()).slice(-4)}`;
    const newVehicle = { ...inlineVehicleForm, id: vid } as Vehicle;
    
    addVehicle(newVehicle);
    setProductForm(prev => ({
      ...prev,
      compatibleVehicles: [...(prev.compatibleVehicles || []), vid]
    }));
    
    setInlineVehicleForm({});
    setShowInlineVehicleAdd(false);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setProductForm(p);
    setShowProductModal(true);
  };

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vid = editingVehicle 
      ? editingVehicle.id 
      : `${vehicleForm.make?.toLowerCase().slice(0, 1)}-${vehicleForm.model?.toLowerCase().split(' ')[0]}-${vehicleForm.year}-${vehicleForm.engine?.toLowerCase().replace(/\s+/g, '-')}-${String(Date.now()).slice(-4)}`;
    
    const newVehicle = { ...vehicleForm, id: vid } as Vehicle;

    if (editingVehicle) {
      updateVehicle(newVehicle);
    } else {
      addVehicle(newVehicle);
      // Automatically add to current product if product modal is open
      if (showProductModal) {
        setProductForm(prev => ({
          ...prev,
          compatibleVehicles: [...(prev.compatibleVehicles || []), vid]
        }));
      }
    }
    setShowVehicleModal(false);
    setEditingVehicle(null);
    setVehicleForm({});
  };

  const openVehicleEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setVehicleForm(v);
    setShowVehicleModal(true);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAfterDiscount || o.subtotal), 0);
  const pendingOrders = orders.filter(o => o.status === 'new').length;
  const lowStockProducts = products.filter(p => p.quantity !== undefined && p.quantity < 5);

  const handleCloudSync = async () => {
    if (!confirm('This will upload default products and vehicles to your new online database. Continue?')) return;
    
    // Import defaults if database is empty
    if (products.length === 0) {
      const DEFAULT_PRODUCTS = [
        { 
          name: 'Bosch Brake Pads', 
          sku: 'BP1001', 
          price: 79.99, 
          image: 'https://images.unsplash.com/photo-1616627980684-8c9e6b9d0b8c?q=80&w=400&auto=format&fit=crop', 
          category: 'Brakes', 
          brand: 'Bosch', 
          badge: 'Best Seller', 
          rating: 4.8, 
          quantity: 50, 
          instock: true, 
          description: 'Premium Bosch brake pads designed for maximum stopping power and minimal noise.',
          compatibleVehicles: ['m-s-2006-211-cdi']
        },
        { 
          name: 'Mann-Filter Oil Filter', 
          sku: 'OF2002', 
          price: 19.99, 
          image: 'https://images.unsplash.com/photo-1581093587955-9c8b1a7e5c8c?q=80&w=400&auto=format&fit=crop', 
          category: 'Engine', 
          brand: 'Mann-Filter', 
          badge: 'Top Rated', 
          rating: 4.6, 
          quantity: 100, 
          instock: true, 
          description: 'Genuine Mann-Filter oil filter provides superior filtration.'
        }
      ];
      for (const p of DEFAULT_PRODUCTS) {
        await addProduct(p as any);
      }
    }

    if (vehicles.length === 0) {
      for (const v of VEHICLE_DATA.slice(0, 20)) {
        await addVehicle(v);
      }
    }

    alert('Cloud sync completed!');
  };

  // Chart Data Preparation
  const revenueByDay = orders.reduce((acc, order) => {
    const dateObj = new Date(order.created);
    const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    
    // If Live view, only show last 7 days
    if (revenueView === 'live') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (dateObj < sevenDaysAgo) return acc;
    }

    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.revenue += (order.totalAfterDiscount || order.subtotal);
    } else {
      acc.push({ date, revenue: (order.totalAfterDiscount || order.subtotal), timestamp: dateObj.getTime() });
    }
    return acc;
  }, [] as { date: string; revenue: number; timestamp: number }[]).sort((a, b) => a.timestamp - b.timestamp);

  const categoryDistribution = products.reduce((acc, p) => {
    const existing = acc.find(d => d.name === p.category);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: p.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'];

  const filteredProducts = products.filter(p => {
    const nameMatch = typeof p.name === 'object' 
      ? Object.values(p.name).some(v => typeof v === 'string' && v.toLowerCase().includes(searchQuery.toLowerCase()))
      : (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryMatch = !selectedCategory || (selectedCategory === 'Other' 
      ? !['Brakes', 'Lights', 'Filters', 'Engine Parts', 'Tyres', 'Oils', 'Fluids', 'Spray', 'Decoration', 'Covers', 'Battery'].includes(p.category || '')
      : (p.category || '').toLowerCase() === selectedCategory.toLowerCase());

    return (nameMatch ||
      (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.id).includes(searchQuery)) && categoryMatch;
  }).sort((a, b) => {
    // Sort by created date if available, otherwise by name
    if (a.created && b.created) {
      const dateA = a.created?.seconds ? a.created.seconds : new Date(a.created).getTime();
      const dateB = b.created?.seconds ? b.created.seconds : new Date(b.created).getTime();
      return dateB - dateA;
    }
    const nameA = getLocalized(a.name);
    const nameB = getLocalized(b.name);
    return nameA.localeCompare(nameB);
  });

  const filteredOrders = orders.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(o.id).includes(searchQuery) ||
    o.items.some(item => item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  ).reverse();

  const filteredVehicles = vehicles.filter(v => 
    v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.engine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(v.year).includes(searchQuery)
  );

  const filteredUsers = (users || []).filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedVehicles = filteredVehicles.reduce((acc, v) => {
    if (!acc[v.make]) acc[v.make] = {};
    
    // Grouping by "Series" or "Family"
    let series = 'Other';
    if (v.make === 'Mercedes-Benz') {
      if (v.model.includes('A-Class')) series = 'A-Class';
      else if (v.model.includes('B-Class')) series = 'B-Class';
      else if (v.model.includes('C-Class')) series = 'C-Class';
      else if (v.model.includes('E-Class')) series = 'E-Class';
      else if (v.model.includes('S-Class')) series = 'S-Class';
      else if (v.model.includes('CLS')) series = 'CLS';
      else if (v.model.includes('GLC')) series = 'GLC';
      else if (v.model.includes('GLE')) series = 'GLE';
      else if (v.model.includes('Sprinter')) series = 'Sprinter';
      else if (v.model.includes('Vito')) series = 'Vito';
      else series = v.model;
    } else if (v.make === 'Volkswagen') {
      if (v.model.includes('Golf')) {
        if (v.model.includes('VIII.5')) series = 'Golf Mk8.5';
        else if (v.model.includes('VIII')) series = 'Golf Mk8';
        else if (v.model.includes('VII')) series = 'Golf Mk7';
        else if (v.model.includes('VI')) series = 'Golf Mk6';
        else if (v.model.includes('V') && !v.model.includes('IV')) series = 'Golf Mk5';
        else if (v.model.includes('IV')) series = 'Golf Mk4';
        else if (v.model.includes('III')) series = 'Golf Mk3';
        else if (v.model.includes('II')) series = 'Golf Mk2';
        else series = 'Golf';
      }
      else if (v.model.includes('Passat')) series = 'Passat';
      else if (v.model.includes('Polo')) series = 'Polo';
      else if (v.model.includes('Transporter')) series = 'Transporter';
      else if (v.model.includes('Caddy')) series = 'Caddy';
      else if (v.model.includes('Tiguan')) series = 'Tiguan';
      else series = v.model;
    } else if (v.make === 'Ford') {
      if (v.model.includes('Focus')) series = 'Focus';
      else if (v.model.includes('Fiesta')) series = 'Fiesta';
      else if (v.model.includes('Transit')) series = 'Transit';
      else if (v.model.includes('Mondeo')) series = 'Mondeo';
      else series = v.model;
    } else if (v.make === 'Renault') {
      if (v.model.includes('Clio')) series = 'Clio';
      else if (v.model.includes('Mégane')) series = 'Mégane';
      else if (v.model.includes('Master')) series = 'Master';
      else if (v.model.includes('Duster')) series = 'Duster';
      else if (v.model.includes('Captur')) series = 'Captur';
      else if (v.model.includes('Kadjar')) series = 'Kadjar';
      else if (v.model.includes('Laguna')) series = 'Laguna';
      else if (v.model.includes('Scenic') || v.model.includes('Scénic')) series = 'Scenic';
      else if (v.model.includes('Talisman')) series = 'Talisman';
      else if (v.model.includes('Zoe')) series = 'Zoe';
      else if (v.model.includes('Trafic')) series = 'Trafic';
      else if (v.model.includes('Kangoo')) series = 'Kangoo';
      else if (v.model.includes('Koleos')) series = 'Koleos';
      else if (v.model.includes('Espace')) series = 'Espace';
      else series = v.model;
    } else if (v.make === 'Fiat') {
      if (v.model.includes('500')) series = '500';
      else if (v.model.includes('Punto')) series = 'Punto';
      else if (v.model.includes('Doblo')) series = 'Doblo';
      else if (v.model.includes('Ducato')) series = 'Ducato';
      else series = v.model;
    } else if (v.make === 'Citroën') {
      if (v.model.includes('C3')) series = 'C3';
      else if (v.model.includes('C4')) series = 'C4';
      else if (v.model.includes('Berlingo')) series = 'Berlingo';
      else series = v.model;
    } else if (v.make === 'Suzuki') {
      if (v.model.includes('Swift')) series = 'Swift';
      else if (v.model.includes('Vitara')) series = 'Vitara';
      else series = v.model;
    } else {
      series = v.model;
    }

    if (!acc[v.make][series]) acc[v.make][series] = [];
    acc[v.make][series].push(v);
    return acc;
  }, {} as Record<string, Record<string, Vehicle[]>>);

  const vehicleMakes = Object.keys(groupedVehicles).sort();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <Helmet>
        <title>Admin Dashboard | Sprinter Plus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">{t('adminConsole')}</h1>
          <p className="text-zinc-500 font-medium mt-1">Global inventory and order management system</p>
        </div>
        
        <div className="flex bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100">
          <button 
            onClick={handleCloudSync}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-sky-600 hover:bg-sky-50 transition-all flex items-center gap-2 mr-2"
          >
            <Zap className="w-4 h-4" /> {t('syncCloud').toUpperCase()}
          </button>
          <div className="relative mr-2 hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input 
              type="text"
              placeholder={`${t('search')}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 pr-4 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 w-[200px] lg:w-[260px] transition-all"
            />
          </div>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'dashboard' ? "bg-white text-zinc-900 shadow-lg shadow-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            <LayoutDashboard className="w-4 h-4" /> {t('dashboard').toUpperCase()}
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'products' ? "bg-white text-zinc-900 shadow-lg shadow-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            <Package className="w-4 h-4" /> {t('products').toUpperCase()}
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'inventory' ? "bg-white text-zinc-900 shadow-lg shadow-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            <History className="w-4 h-4" /> {t('inventory').toUpperCase()}
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'orders' ? "bg-white text-zinc-900 shadow-lg shadow-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            <ClipboardList className="w-4 h-4" /> {t('orders').toUpperCase()}
            {pendingOrders > 0 && <span className="bg-sky-500 text-white w-2 h-2 rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('vehicles')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'vehicles' ? "bg-white text-zinc-900 shadow-lg shadow-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            <Car className="w-4 h-4" /> {t('vehicles').toUpperCase()}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'users' ? "bg-white text-zinc-900 shadow-lg shadow-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            <Users className="w-4 h-4" /> {t('users').toUpperCase()}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">              <div className="bg-zinc-900 text-white border border-zinc-800 rounded-[32px] p-8 flex flex-col justify-between group hover:bg-sky-500 transition-all cursor-pointer shadow-2xl shadow-zinc-900/20" onClick={() => { setEditingProduct(null); resetProductForm(); setShowProductModal(true); }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">{t('inventory')}</div>
                  <div className="text-xl font-black">{t('addProduct').toUpperCase()}</div>
                </div>
              </div>
              <div className="bg-white border border-zinc-200 rounded-[32px] p-8 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('revenue')}</div>
                  <div className="text-2xl font-black text-zinc-900">€{totalRevenue.toFixed(2)}</div>
                </div>
              </div>
              <div className="bg-white border border-zinc-200 rounded-[32px] p-8 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 grid place-items-center">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('pending')}</div>
                  <div className="text-2xl font-black text-zinc-900">{pendingOrders}</div>
                </div>
              </div>
              <div className="bg-white border border-zinc-200 rounded-[32px] p-8 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('activeSkus')}</div>
                  <div className="text-2xl font-black text-zinc-900">{products.length}</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-[40px] p-8 lg:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 tracking-tight">{t('revenueAnalytics')}</h3>
                    <p className="text-sm font-medium text-zinc-400">Daily financial performance overview</p>
                  </div>
                  <div className="flex bg-zinc-50 p-1 rounded-xl">
                    <button 
                      onClick={() => setRevenueView('live')}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                        revenueView === 'live' 
                          ? "bg-zinc-900 text-white shadow-lg" 
                          : "text-zinc-400 hover:text-zinc-600"
                      )}
                    >
                      {revenueView === 'live' && <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />}
                      Live
                    </button>
                    <button 
                      onClick={() => setRevenueView('history')}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        revenueView === 'history' 
                          ? "bg-zinc-900 text-white shadow-lg" 
                          : "text-zinc-400 hover:text-zinc-600"
                      )}
                    >
                      History
                    </button>
                  </div>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueByDay.length > 0 ? revenueByDay : [{date: 'No Data', revenue: 0}]}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                        tickFormatter={(value) => `€${value}`}
                      />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold'}}
                        formatter={(value: any) => [`€${value.toFixed(2)}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Weight */}
              <div className="bg-white border border-zinc-200 rounded-[40px] p-8 lg:p-10">
                <h3 className="text-xl font-black text-zinc-900 tracking-tight mb-2">{t('categorySpread')}</h3>
                <p className="text-sm font-medium text-zinc-400 mb-8">Top performing product groups</p>
                
                <div className="h-[250px] w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold'}}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  {categoryDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[11px] font-black text-zinc-900 uppercase tracking-widest">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-zinc-400">{item.value} items</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Low Stock Alerts */}
              <div className="bg-white border border-zinc-200 rounded-[40px] p-8 lg:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 tracking-tight">{t('stockAlerts')}</h3>
                    <p className="text-sm font-medium text-zinc-400">Inventory items requiring attention</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-4">
                  {lowStockProducts.length === 0 ? (
                    <div className="text-center py-10 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Inventory Healthy</div>
                    </div>
                  ) : (
                    lowStockProducts.slice(0, 5).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-white" />
                          <div>
                            <div className="text-xs font-black text-zinc-900 uppercase tracking-tight">{getLocalized(p.name)}</div>
                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SKU: {p.sku}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "text-xs font-black",
                            p.quantity === 0 ? "text-rose-500" : "text-amber-600"
                          )}>
                            {p.quantity === 0 ? 'OUT OF STOCK' : `${p.quantity} LEFT`}
                          </div>
                          <button 
                            onClick={() => openEdit(p)}
                            className="text-[10px] font-black text-sky-500 uppercase tracking-widest mt-1 hover:underline"
                          >
                            Restock
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white border border-zinc-200 rounded-[40px] p-8 lg:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-zinc-900 tracking-tight">{t('recentOrders')}</h3>
                    <p className="text-sm font-medium text-zinc-400">Latest customer activity</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:text-sky-600 transition-colors"
                  >
                    {t('viewAll').toUpperCase()}
                  </button>
                </div>
                <div className="space-y-4">
                  {orders.slice(0, 5).reverse().map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 font-black text-xs grid place-items-center">
                          {order.avatarInitials}
                        </div>
                        <div>
                          <div className="text-xs font-black text-zinc-900 uppercase tracking-tight">{order.name}</div>
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">#{String(order.id).slice(-6)} • {new Date(order.created).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-zinc-900 tracking-tight">€{(order.totalAfterDiscount || order.subtotal).toFixed(2)}</div>
                        <div className={cn(
                          "text-[9px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 rounded ml-auto",
                          order.status === 'new' ? "bg-sky-100 text-sky-600" : "bg-emerald-100 text-emerald-600"
                        )}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'products' ? (
          <motion.div 
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center bg-white border border-zinc-200 rounded-3xl p-6 mb-8">
              <div>
                <h2 className="text-xl font-black text-zinc-900 tracking-tight">{t('inventory')}</h2>
                <p className="text-sm font-medium text-zinc-400">Manage your SKU catalog and stock levels</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setBulkProductData('');
                    setShowBulkProductModal(true);
                  }}
                  className="h-12 px-6 bg-zinc-100 text-zinc-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="w-5 h-5" /> BULK ADD
                </button>
                <button 
                  onClick={() => { setEditingProduct(null); resetProductForm(); setShowProductModal(true); }}
                  className="h-12 px-6 bg-zinc-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-sky-500 transition-colors"
                >
                  <Plus className="w-5 h-5" /> {t('addProduct').toUpperCase()}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(p => (
              <div key={p.id} className="group bg-white border border-zinc-200 rounded-3xl p-5 hover:border-sky-500/30 transition-colors">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-50 mb-5">
                  <img src={p.image} className="w-full h-full object-cover" alt="" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur grid place-items-center text-zinc-500 hover:text-sky-500 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur grid place-items-center text-zinc-500 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-zinc-900 truncate mb-1">{getLocalized(p.name)}</h3>
                <div className="text-[11px] font-bold text-zinc-400 uppercase mb-4 tracking-wider">{p.sku} • {p.brand}</div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <div className="text-lg font-black tracking-tight">€{p.price.toFixed(2)}</div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    p.instock ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600 text-center leading-tight"
                  )}>
                    {p.instock ? `IN STOCK — ${p.quantity || 0}` : 'Order 3-10 Days'}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </motion.div>
        ) : activeTab === 'inventory' ? (
          <motion.div 
            key="inventory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-zinc-200 rounded-3xl p-6 mb-8 gap-4">
              <div>
                <h2 className="text-xl font-black text-zinc-900 tracking-tight">{t('inventoryManagement')}</h2>
                <p className="text-sm font-medium text-zinc-400">Monitor stock levels and perform rapid inventory updates</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex bg-zinc-50 p-1 rounded-xl border border-zinc-100">
                  <div className="px-4 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-200">
                    Low Stock: {lowStockProducts.length}
                  </div>
                  <div className="px-4 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Out of Stock: {products.filter(p => !p.instock || p.quantity === 0).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Categories Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['All', 'Brakes', 'Lights', 'Filters', 'Engine Parts', 'Tyres', 'Oils', 'Fluids', 'Spray', 'Decoration', 'Covers', 'Battery', 'Other'].map((cat) => {
                const isActive = (cat === 'All' && !selectedCategory) || selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      isActive 
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-200" 
                        : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    {t(cat.toLowerCase().replace(/\s+/g, '')) || cat}
                  </button>
                );
              })}
            </div>

            <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{t('product')}</th>
                      <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">SKU</th>
                      <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{t('category')}</th>
                      <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{t('stock')}</th>
                      <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{t('status')}</th>
                      <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
                              <img src={p.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <div className="font-bold text-zinc-900 group-hover:text-sky-600 transition-colors">{getLocalized(p.name)}</div>
                              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{p.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-[11px] font-black text-zinc-500 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">{p.sku}</code>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-zinc-600 px-2 py-0.5 bg-zinc-100 rounded-md">{p.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                const newQty = Math.max(0, (p.quantity || 0) - 1);
                                updateProduct({ ...p, quantity: newQty, instock: newQty > 0 });
                              }}
                              className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                            >
                              -
                            </button>
                            <span className={cn(
                              "text-sm font-black w-8 text-center",
                              (p.quantity || 0) < 5 ? "text-rose-500" : "text-zinc-900"
                            )}>
                              {p.quantity || 0}
                            </span>
                            <button 
                              onClick={() => {
                                const newQty = (p.quantity || 0) + 1;
                                updateProduct({ ...p, quantity: newQty, instock: true });
                              }}
                              className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            (p.quantity || 0) > 10 ? "bg-emerald-50 text-emerald-600" : 
                            (p.quantity || 0) > 0 ? "bg-amber-50 text-amber-600" : 
                            "bg-rose-50 text-rose-600"
                          )}>
                            <div className={cn(
                              "w-1 h-1 rounded-full",
                              (p.quantity || 0) > 10 ? "bg-emerald-500" : 
                              (p.quantity || 0) > 0 ? "bg-amber-500" : 
                              "bg-rose-500"
                            )} />
                            {(p.quantity || 0) > 10 ? 'Healthy' : (p.quantity || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                              onClick={() => openEdit(p)}
                              className="p-2 text-zinc-400 hover:text-sky-500 transition-colors"
                              title="Full Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'orders' ? (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {filteredOrders.length === 0 ? (
              <div className="text-center py-32 bg-zinc-50 rounded-[48px] border border-dashed border-zinc-200">
                <div className="text-zinc-300 font-bold">No orders found matching your search.</div>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-white border border-zinc-200 rounded-[32px] p-8 lg:p-10">
                  <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-sky-50 text-sky-700 grid place-items-center font-black text-2xl shadow-inner uppercase tracking-tighter">
                        {order.avatarInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{order.name}</h3>
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                            order.customerTier === 'Emerald' ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-500"
                          )}>
                            {order.customerTier}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-zinc-400 mb-3">{order.email}</div>
                        <div className="flex items-center gap-4 text-xs font-bold text-zinc-300 uppercase tracking-widest">
                          <span>ID: #{String(order.id).slice(-6)}</span>
                          <span>{new Date(order.created).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                  <div className="flex flex-wrap items-center gap-4">
                      <div className="text-right pr-6 border-r border-zinc-100 hidden lg:block">
                        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('totalAmount')}</div>
                        <div className="text-3xl font-black text-zinc-900 tracking-tighter">€{(order.totalAfterDiscount || order.subtotal).toFixed(2)}</div>
                      </div>
                      
                      <button 
                        onClick={() => toggleOrderStatus(order)}
                        className={cn(
                          "h-12 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl active:scale-95 flex items-center gap-3",
                          order.status === 'new' ? "bg-sky-500 text-white shadow-sky-500/20" : "bg-emerald-500 text-white shadow-emerald-500/20"
                        )}
                      >
                        {order.status === 'new' ? <History className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        {order.status === 'new' ? t('markProcessed').toUpperCase() : t('completed').toUpperCase()}
                      </button>
                      
                      <button 
                        onClick={() => deleteOrder(order.id)}
                        className="w-12 h-12 rounded-2xl border border-zinc-200 grid place-items-center text-zinc-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-95"
                      >
                         <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-zinc-50 rounded-[28px] p-6 lg:p-8 grid lg:grid-cols-[1fr_300px] gap-8">
                    <div>
                      <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[.2em] mb-4">{t('itemsSummary')}</h4>
                      <div className="space-y-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-xl overflow-hidden group">
                           <div className="flex items-center gap-4">
                            <img src={item.image} className="w-10 h-10 rounded-lg object-cover bg-zinc-50 border border-zinc-100" />
                            <div>
                              <div className="font-bold text-sm text-zinc-900">{getLocalized(item.name)}</div>
                              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">x{item.qty} • {item.brand}</div>
                            </div>
                           </div>
                           <div className="text-sm font-black text-zinc-900">€{(item.price * item.qty).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[.2em] mb-4">{t('delivery')}</h4>
                      <div className="space-y-4 text-sm">
                        <div className="font-bold text-zinc-900 leading-relaxed">{order.address}</div>
                        <div className="text-zinc-600 font-medium">{order.phone}</div>
                        <div className="pt-4 border-t border-zinc-200 mt-auto space-y-2">
                          <button 
                            onClick={() => handlePrintLabel(order)}
                            className="w-full h-10 bg-white border border-zinc-200 rounded-xl text-[11px] font-black uppercase tracking-[.15em] flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors"
                          >
                            {t('printLabel')} <ArrowRight className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => handlePrintInvoice(order)}
                            className="w-full h-10 bg-zinc-900 text-white rounded-xl text-[11px] font-black uppercase tracking-[.15em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                          >
                            {t('printInvoice')} <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        ) : activeTab === 'users' ? (
          <motion.div 
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center bg-white border border-zinc-200 rounded-3xl p-6 mb-8">
              <div>
                <h2 className="text-xl font-black text-zinc-900 tracking-tight">{t('registeredUsers')}</h2>
                <p className="text-sm font-medium text-zinc-400">Manage customer accounts and access levels</p>
              </div>
              <div className="flex bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{users.length} total users</span>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden">
               <div className="grid grid-cols-[80px_1fr_200px_150px_100px] px-8 py-4 bg-zinc-50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                <div>Avatar</div>
                <div>User Details</div>
                <div>Status / Created</div>
                <div>Role</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="divide-y divide-zinc-100">
                {filteredUsers.length === 0 ? (
                  <div className="p-20 text-center text-zinc-400 font-bold">No users found.</div>
                ) : (
                  filteredUsers.map(u => (
                    <div key={u.id || u.email} className="grid grid-cols-[80px_1fr_200px_150px_100px] px-8 py-6 items-center hover:bg-zinc-50 transition-colors group">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 grid place-items-center font-black text-lg group-hover:bg-sky-500 group-hover:text-white transition-colors">
                        {(u.name?.[0] || u.email?.[0] || '?').toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-zinc-900 leading-none mb-1">{u.name}</span>
                        <span className="text-xs font-medium text-zinc-400">{u.email}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className={cn("w-1.5 h-1.5 rounded-full", u.emailVerified ? "bg-emerald-500" : "bg-zinc-300")} />
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", u.emailVerified ? "text-emerald-600" : "text-zinc-400")}>
                            {u.emailVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                        {u.created && (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter italic">
                              Joined {new Date(u.created?.seconds ? u.created.seconds * 1000 : u.created).toLocaleDateString()}
                            </span>
                            {(() => {
                              const createdDate = u.created?.toDate ? u.created.toDate() : new Date(u.created?.seconds ? u.created.seconds * 1000 : u.created);
                              const now = new Date();
                              const diff = now.getTime() - createdDate.getTime();
                              const isFirstDay = diff < 24 * 60 * 60 * 1000 && diff >= 0;
                              return isFirstDay && (
                                <span className="text-[8px] text-sky-500 font-black uppercase tracking-widest mt-0.5 animate-pulse">
                                  First Day Special Active
                                </span>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className={cn(
                          "inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none",
                          u.role === 'admin' ? "bg-zinc-900 text-white" : "bg-sky-100 text-sky-600"
                        )}>
                          {u.role || 'customer'}
                        </div>
                      </div>
                      <div className="text-right">
                        {u.email !== 'kenotube9816@gmail.com' && (
                          <button 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
                                deleteUser(u.id!);
                              }
                            }}
                            className="w-10 h-10 rounded-xl bg-white border border-zinc-200 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all grid place-items-center ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="vehicles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center bg-white border border-zinc-200 rounded-3xl p-6 mb-8">
              <div>
                <h2 className="text-xl font-black text-zinc-900 tracking-tight">{t('vehicleDatabase')}</h2>
                <p className="text-sm font-medium text-zinc-400">Manage all supported vehicles in your fleet</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    if (confirm('This will append all factory default vehicles to your database. Continue?')) {
                      // Simple implementation: filter out existing IDs and append
                      const existingIds = new Set(vehicles.map(v => v.id));
                      const defaultsToAdd = VEHICLE_DATA.filter(v => !existingIds.has(v.id));
                      defaultsToAdd.forEach(v => addVehicle(v));
                    }
                  }}
                  className="h-12 px-6 bg-zinc-100 text-zinc-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-zinc-200 transition-colors"
                >
                  <History className="w-5 h-5" /> {t('syncDefaults').toUpperCase()}
                </button>
                <button 
                  onClick={() => {
                    setBulkVehicleData('');
                    setShowBulkVehicleModal(true);
                  }}
                  className="h-12 px-6 bg-zinc-100 text-zinc-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="w-5 h-5" /> BULK ADD
                </button>
                <button 
                  onClick={() => { setEditingVehicle(null); setVehicleForm({}); setShowVehicleModal(true); }}
                  className="h-12 px-6 bg-zinc-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-sky-500 transition-colors"
                >
                  <Plus className="w-5 h-5" /> {t('addVehicle').toUpperCase()}
                </button>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden">
              <div className="grid grid-cols-[1fr_200px_120px] px-8 py-4 bg-zinc-50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                <div>Model series / Engine</div>
                <div className="text-center">Constr.year</div>
                <div className="text-right px-4">Management</div>
              </div>
              <div className="divide-y divide-zinc-100 max-h-[800px] overflow-y-auto">
                {vehicleMakes.length === 0 ? (
                  <div className="p-20 text-center text-zinc-400 font-bold">No vehicles found.</div>
                ) : (
                  vehicleMakes.map(make => (
                    <div key={make} className="flex flex-col">
                      <button 
                        onClick={() => toggleMakeExpanded(make)}
                        className="px-8 py-3 bg-zinc-50/50 flex items-center gap-4 hover:bg-zinc-100/50 transition-colors cursor-pointer text-left w-full"
                      >
                        <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[10px] font-black text-zinc-400 uppercase">
                          {make.slice(0, 2)}
                        </div>
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest">{make}</h3>
                        <div className="h-px flex-1 bg-zinc-100" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {Object.keys(groupedVehicles[make]).length} Series
                        </span>
                        {expandedMakes.has(make) ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedMakes.has(make) && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-zinc-50/30"
                          >
                            <div className="divide-y divide-zinc-100/50">
                              {Object.keys(groupedVehicles[make]).sort().map(series => (
                                <div key={series} className="flex flex-col">
                                  <button 
                                    onClick={() => toggleModelExpanded(make + '|' + series)}
                                    className="px-12 py-2.5 flex items-center justify-between hover:bg-zinc-100/30 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                      <span className="text-[11px] font-black text-zinc-700 uppercase tracking-widest">{series}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-[10px] font-bold text-zinc-400 uppercase">{groupedVehicles[make][series].length} Vehicles</span>
                                      {expandedModels.has(make + '|' + series) ? <ChevronDown className="w-3 h-3 text-zinc-400" /> : <ChevronRight className="w-3 h-3 text-zinc-400" />}
                                    </div>
                                  </button>

                                  <AnimatePresence>
                                    {expandedModels.has(make + '|' + series) && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="divide-y divide-zinc-50 border-t border-zinc-100/50">
                                          {groupedVehicles[make][series].map(v => (
                                            <div key={v.id} className="grid grid-cols-[1fr_200px_120px] px-16 py-3 items-center hover:bg-sky-50/50 transition-colors group">
                                              <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-zinc-900 uppercase tracking-tight">{v.model}</span>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase">{v.engine}</span>
                                              </div>
                                              <div className="text-[10px] font-black text-zinc-600 text-center bg-white py-1 rounded-lg border border-zinc-100 inline-block px-3 mx-auto">
                                                {v.year}
                                              </div>
                                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button onClick={() => openVehicleEdit(v)} className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-sky-500 hover:bg-white hover:border-sky-100 transition-all shadow-sm">
                                                  <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => deleteVehicle(v.id)} className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-white hover:border-rose-100 transition-all shadow-sm">
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 py-10 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductModal(false)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-3xl p-8 lg:p-12 my-auto"
            >
              <h2 className="text-3xl font-black text-zinc-900 mb-8 tracking-tighter">
                {editingProduct ? 'Edit Portfolio SKU' : 'Add New Portfolio SKU'}
              </h2>
              
              <form onSubmit={handleProductSubmit} className="space-y-5">
                <div className="space-y-4 py-4 bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Localized Names</div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">English</label>
                      <input 
                        required
                        value={typeof productForm.name === 'object' ? productForm.name.en : (typeof productForm.name === 'string' ? productForm.name : '')}
                        onChange={e => {
                          const currentName = typeof productForm.name === 'object' ? productForm.name : { en: productForm.name as string || '', sq: '', sr: '' };
                          setProductForm({...productForm, name: { ...currentName, en: e.target.value }});
                        }}
                        className="w-full h-10 px-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-sky-500 font-bold text-sm" 
                        placeholder="Name (EN)"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Albanian</label>
                      <input 
                        required
                        value={typeof productForm.name === 'object' ? (productForm.name.sq || '') : ''}
                        onChange={e => {
                          const currentName = typeof productForm.name === 'object' ? productForm.name : { en: productForm.name as string || '', sq: '', sr: '' };
                          setProductForm({...productForm, name: { ...currentName, sq: e.target.value }});
                        }}
                        className="w-full h-10 px-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-sky-500 font-bold text-sm" 
                        placeholder="Emri (SQ)"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">Serbian</label>
                      <input 
                        required
                        value={typeof productForm.name === 'object' ? (productForm.name.sr || '') : ''}
                        onChange={e => {
                          const currentName = typeof productForm.name === 'object' ? productForm.name : { en: productForm.name as string || '', sq: '', sr: '' };
                          setProductForm({...productForm, name: { ...currentName, sr: e.target.value }});
                        }}
                        className="w-full h-10 px-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-sky-500 font-bold text-sm" 
                        placeholder="Ime (SR)"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 py-4 bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Localized Descriptions</div>
                  <div className="space-y-3">
                    <textarea 
                      required
                      value={typeof productForm.description === 'object' ? productForm.description.en : (typeof productForm.description === 'string' ? productForm.description : '')}
                      onChange={e => {
                        const currentDesc = typeof productForm.description === 'object' ? productForm.description : { en: productForm.description as string || '', sq: '', sr: '' };
                        setProductForm({...productForm, description: { ...currentDesc, en: e.target.value }});
                      }}
                      className="w-full h-20 p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-sky-500 font-medium text-sm" 
                      placeholder="Description (EN)"
                    />
                    <textarea 
                      required
                      value={typeof productForm.description === 'object' ? (productForm.description.sq || '') : ''}
                      onChange={e => {
                        const currentDesc = typeof productForm.description === 'object' ? productForm.description : { en: productForm.description as string || '', sq: '', sr: '' };
                        setProductForm({...productForm, description: { ...currentDesc, sq: e.target.value }});
                      }}
                      className="w-full h-20 p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-sky-500 font-medium text-sm" 
                      placeholder="Përshkrimi (SQ)"
                    />
                    <textarea 
                      required
                      value={typeof productForm.description === 'object' ? (productForm.description.sr || '') : ''}
                      onChange={e => {
                        const currentDesc = typeof productForm.description === 'object' ? productForm.description : { en: productForm.description as string || '', sq: '', sr: '' };
                        setProductForm({...productForm, description: { ...currentDesc, sr: e.target.value }});
                      }}
                      className="w-full h-20 p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-sky-500 font-medium text-sm" 
                      placeholder="Opis (SR)"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">SKU Identification</label>
                    <input 
                      required
                      value={productForm.sku || ''}
                      onChange={e => setProductForm({...productForm, sku: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" 
                      placeholder="e.g. SKU-12345"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Unit Price (€)</label>
                    <input 
                      required
                      type="number"
                      step="0.01"
                      value={productForm.price || ''}
                      onChange={e => setProductForm({...productForm, price: +e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Brand</label>
                    <input 
                      required
                      value={productForm.brand || ''}
                      onChange={e => setProductForm({...productForm, brand: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Category</label>
                    <input 
                      required
                      value={productForm.category || ''}
                      onChange={e => setProductForm({...productForm, category: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Image Endpoint (URL)</label>
                  <input 
                    required
                    value={productForm.image || ''}
                    onChange={e => setProductForm({...productForm, image: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" 
                    placeholder="https://..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5 py-4 border-y border-zinc-100">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="font-bold text-sm text-zinc-400 group-hover:text-zinc-600 uppercase tracking-widest">Available in Stock</span>
                    <input 
                      type="checkbox"
                      checked={productForm.instock}
                      onChange={e => setProductForm({...productForm, instock: e.target.checked})}
                      className="w-6 h-6 rounded-lg border-zinc-300 text-sky-500"
                    />
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-zinc-400 uppercase tracking-widest">Inventory Level</span>
                    <input 
                      type="number"
                      value={productForm.quantity || 0}
                      onChange={e => setProductForm({...productForm, quantity: +e.target.value})}
                      className="w-20 h-10 px-3 rounded-lg border border-zinc-200 text-center font-bold"
                    />
                  </div>
                </div>

                <div className="py-4 border-b border-zinc-100">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="font-bold text-sm text-zinc-400 group-hover:text-zinc-600 uppercase tracking-widest">Item is Returnable</span>
                    <input 
                      type="checkbox"
                      checked={productForm.isReturnable}
                      onChange={e => setProductForm({...productForm, isReturnable: e.target.checked})}
                      className="w-6 h-6 rounded-lg border-zinc-300 text-emerald-500"
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Compatible Vehicles</label>
                    <div className="flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={() => setShowBulkCompatibility(!showBulkCompatibility)}
                        className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-sky-500 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Bulk Link
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowInlineVehicleAdd(!showInlineVehicleAdd)}
                        className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:text-sky-600 transition-colors flex items-center gap-1"
                      >
                        <Plus className={cn("w-3 h-3 transition-transform", showInlineVehicleAdd && "rotate-45")} /> 
                        {showInlineVehicleAdd ? 'Cancel' : 'Quick Add'}
                      </button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {showBulkCompatibility && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-zinc-50 rounded-2xl border border-zinc-100 p-4 space-y-4"
                      >
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">
                          Link Vehicles by Search Strings (One per line)
                        </label>
                        <textarea 
                          value={bulkCompatibilityData}
                          onChange={(e) => setBulkCompatibilityData(e.target.value)}
                          placeholder="VW Golf 2010&#10;Mercedes Sprinter 2015"
                          className="w-full h-32 p-3 bg-white border border-zinc-200 rounded-xl text-xs font-mono resize-none focus:ring-1 focus:ring-sky-500 outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const queries = bulkCompatibilityData.split('\n').filter(q => q.trim());
                            const matchedIds: string[] = [];
                            queries.forEach(q => {
                              const found = vehicles.find(v => 
                                `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(q.toLowerCase().trim())
                              );
                              if (found) matchedIds.push(found.id);
                            });
                            const current = productForm.compatibleVehicles || [];
                            setProductForm({ ...productForm, compatibleVehicles: [...new Set([...current, ...matchedIds])] });
                            setBulkCompatibilityData('');
                            setShowBulkCompatibility(false);
                          }}
                          className="w-full h-10 bg-zinc-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                        >
                          MATCH & LINK VEHICLES
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showInlineVehicleAdd && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-sky-50 rounded-2xl border border-sky-100 p-4"
                      >
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <input 
                            placeholder="Make"
                            value={inlineVehicleForm.make || ''}
                            onChange={e => setInlineVehicleForm({...inlineVehicleForm, make: e.target.value})}
                            className="h-9 px-3 rounded-lg border border-sky-200 text-xs font-bold focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                          <input 
                            placeholder="Model"
                            value={inlineVehicleForm.model || ''}
                            onChange={e => setInlineVehicleForm({...inlineVehicleForm, model: e.target.value})}
                            className="h-9 px-3 rounded-lg border border-sky-200 text-xs font-bold focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <input 
                            placeholder="Year (e.g. 2003-2008)"
                            value={inlineVehicleForm.year || ''}
                            onChange={e => setInlineVehicleForm({...inlineVehicleForm, year: e.target.value})}
                            className="h-9 px-3 rounded-lg border border-sky-200 text-xs font-bold focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                          <input 
                            placeholder="Engine"
                            value={inlineVehicleForm.engine || ''}
                            onChange={e => setInlineVehicleForm({...inlineVehicleForm, engine: e.target.value})}
                            className="h-9 px-3 rounded-lg border border-sky-200 text-xs font-bold focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={handleInlineVehicleSubmit}
                          disabled={!inlineVehicleForm.make || !inlineVehicleForm.model || !inlineVehicleForm.year || !inlineVehicleForm.engine}
                          className="w-full h-9 bg-sky-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 disabled:opacity-50 disabled:hover:bg-sky-500 transition-colors"
                        >
                          Add & Link Vehicle
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <input 
                      type="text"
                      placeholder="Search vehicles..."
                      value={vehicleSearchQuery}
                      onChange={(e) => setVehicleSearchQuery(e.target.value)}
                      className="w-full h-10 pl-9 pr-4 bg-zinc-50 border border-zinc-100 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-zinc-100 rounded-2xl p-4 bg-zinc-50 space-y-2">
                    {vehicles.filter(v => 
                      v.make.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) ||
                      v.model.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) ||
                      v.engine.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) ||
                      String(v.year).includes(vehicleSearchQuery)
                    ).map(vehicle => (
                      <label key={vehicle.id} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-zinc-50 cursor-pointer hover:border-sky-200 transition-colors">
                        <input 
                          type="checkbox"
                          checked={productForm.compatibleVehicles?.includes(vehicle.id)}
                          onChange={(e) => {
                            const current = productForm.compatibleVehicles || [];
                            if (e.target.checked) {
                              setProductForm({ ...productForm, compatibleVehicles: [...current, vehicle.id] });
                            } else {
                              setProductForm({ ...productForm, compatibleVehicles: current.filter(id => id !== vehicle.id) });
                            }
                          }}
                          className="w-5 h-5 rounded border-zinc-300 text-sky-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-black text-zinc-900 truncate uppercase">
                            {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">
                            {vehicle.year} • {vehicle.engine}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 h-14 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-sky-500 transition-all duration-300 active:scale-[0.98]"
                  >
                    {editingProduct ? 'SYNCHRONIZE UPDATES' : 'INITIALIZE PRODUCT'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="h-14 px-8 border border-zinc-200 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-50 transition-all"
                  >
                    ABORT
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Bulk Product Modal */}
      <AnimatePresence>
        {showBulkProductModal && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkProductModal(false)}
              className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden my-auto"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Bulk Add Products</h2>
                  <p className="text-zinc-400 text-sm font-medium">Add multiple products to inventory</p>
                </div>
                <button onClick={() => setShowBulkProductModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
                    Paste Data (Format: SKU, Name, Price, Brand, Category, ImageURL)
                  </label>
                  <textarea 
                    value={bulkProductData}
                    onChange={(e) => setBulkProductData(e.target.value)}
                    placeholder="SKU001, Brake Pad Set, 45.99, Bosch, Brakes, https://...&#10;SKU002, Oil Filter, 12.50, Mann, Filters, https://..."
                    className="w-full h-64 p-6 bg-zinc-50 border-2 border-zinc-100 rounded-2xl focus:border-sky-500 focus:ring-0 transition-all font-mono text-sm resize-none"
                  />
                  <p className="mt-3 text-[10px] text-zinc-400 font-medium italic">Enter one product per line. Separators: Comma, Tab, or Pipe.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowBulkProductModal(false)}
                    className="flex-1 px-8 py-4 border-2 border-zinc-100 rounded-2xl text-sm font-bold text-zinc-400 hover:bg-zinc-50 transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={handleBulkProductImport}
                    disabled={!bulkProductData.trim()}
                    className="flex-1 px-8 py-4 bg-zinc-900 text-white rounded-2xl text-sm font-bold shadow-lg shadow-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                  >
                    IMPORT PRODUCTS
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Vehicle Modal */}
      <AnimatePresence>
        {showBulkVehicleModal && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkVehicleModal(false)}
              className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden my-auto"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Bulk Add Vehicles</h2>
                  <p className="text-zinc-400 text-sm font-medium">Add multiple vehicle types at once</p>
                </div>
                <button onClick={() => setShowBulkVehicleModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
                    Paste Data (Format: Make, Model, Year, Engine)
                  </label>
                  <textarea 
                    value={bulkVehicleData}
                    onChange={(e) => setBulkVehicleData(e.target.value)}
                    placeholder="Audi, A4, 2015-2020, 2.0 TDI&#10;BMW, X5, 2019-2024, xDrive30d&#10;Volkswagen, Golf, 2012-2019, 1.6 TDI"
                    className="w-full h-64 p-6 bg-zinc-50 border-2 border-zinc-100 rounded-2xl focus:border-sky-500 focus:ring-0 transition-all font-mono text-sm resize-none"
                  />
                  <p className="mt-3 text-[10px] text-zinc-400 font-medium italic">Enter one vehicle per line, separated by commas.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowBulkVehicleModal(false)}
                    className="flex-1 px-8 py-4 border-2 border-zinc-100 rounded-2xl text-sm font-bold text-zinc-400 hover:bg-zinc-50 transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={handleBulkVehicleImport}
                    disabled={!bulkVehicleData.trim()}
                    className="flex-1 px-8 py-4 bg-zinc-900 text-white rounded-2xl text-sm font-bold shadow-lg shadow-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                  >
                    IMPORT VEHICLES
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vehicle Modal */}
      <AnimatePresence>
        {showVehicleModal && (
          <div className="fixed inset-0 z-[110] flex items-start justify-center px-4 py-10 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVehicleModal(false)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-3xl p-8 lg:p-12 my-auto"
            >
              <h2 className="text-2xl font-black text-zinc-900 mb-8 tracking-tighter">
                {editingVehicle ? 'Edit Vehicle MasterData' : 'Integrate New Vehicle'}
              </h2>
              
              <form onSubmit={handleVehicleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Manufacturer</label>
                    <input 
                      required
                      value={vehicleForm.make || ''}
                      onChange={e => setVehicleForm({...vehicleForm, make: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" 
                      placeholder="e.g. Mercedes-Benz"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Model Name</label>
                    <input 
                      required
                      value={vehicleForm.model || ''}
                      onChange={e => setVehicleForm({...vehicleForm, model: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" 
                      placeholder="e.g. Sprinter"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Year Range</label>
                    <input 
                      required
                      value={vehicleForm.year || ''}
                      onChange={e => setVehicleForm({...vehicleForm, year: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" 
                      placeholder="e.g. 2003-2008"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">Engine Configuration</label>
                    <input 
                      required
                      value={vehicleForm.engine || ''}
                      onChange={e => setVehicleForm({...vehicleForm, engine: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold" 
                      placeholder="e.g. 316 CDI (907)"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 h-14 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-sky-500 transition-all duration-300 active:scale-[0.98]"
                  >
                    {editingVehicle ? 'UPDATE VEHICLE' : 'CONFIRM INTEGRATION'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowVehicleModal(false)}
                    className="h-14 px-8 border border-zinc-200 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-50 transition-all"
                  >
                    ABORT
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
