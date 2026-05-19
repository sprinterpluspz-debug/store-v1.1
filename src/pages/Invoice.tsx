import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';
import { Printer, ArrowLeft, Mail, Truck, X, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, t, language, getLocalized } = useStore();
  
  const order = orders.find(o => o.id && String(o.id) === id);

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      const d = new Date(date?.seconds ? date.seconds * 1000 : date);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString(language === 'en' ? 'en-US' : language === 'sr' ? 'sr-RS' : 'sq-AL');
    } catch {
      return 'N/A';
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-zinc-100 rounded-3xl mx-auto mb-6 grid place-items-center">
            <X className="w-10 h-10 text-zinc-300" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 uppercase mb-4 tracking-tight">Order Not Found</h2>
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-sky-500 font-bold uppercase tracking-widest hover:text-sky-600 transition-colors mx-auto group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Admin
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const orderId = order.id ? String(order.id).slice(-6).toUpperCase() : 'N/A';

  return (
    <div className="min-h-screen bg-zinc-100 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <Helmet>
        <title>Invoice - Sprinter Plus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation / Actions - Hidden on print */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-widest hover:text-zinc-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('admin')}
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-sky-500 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-zinc-900/10 active:scale-95"
            >
              <Printer className="w-4 h-4" /> {t('printInvoice')}
            </button>
          </div>
        </div>

        {/* Invoice Page */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 sm:p-16 shadow-2xl shadow-zinc-200/50 print:shadow-none print:p-4 flex flex-col border border-zinc-100 print:border-none rounded-[40px] print:rounded-none overflow-hidden print:min-h-0 invoice-container"
        >
          {/* Decorative Top Border */}
          <div className="h-2 bg-zinc-900 absolute top-0 left-0 right-0 print:hidden" />

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-1">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl grid place-items-center text-white">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">sprinter</span>
                  <span className="text-3xl font-black text-sky-500 tracking-tighter lowercase">plus</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-[13px] font-black text-zinc-900 uppercase tracking-tight">Sprinter Plus d.o.o.</div>
                <div className="text-[11px] font-medium text-zinc-500 leading-relaxed max-w-[240px]">
                  {t('addressLabel')}: Ahmet Prishtina nr.141<br />
                  {t('cityLabel')}: Prizren, Kosovo 20000<br />
                  Web: www.sprinterplus.com<br />
                  ID: 810136615 • Tel: +383 44 930 260<br />
                  Email: info@sprinterplus.com
                </div>
              </div>
            </div>

            <div className="md:text-right space-y-6">
              <div>
                <h1 className="text-5xl font-black text-zinc-900 uppercase tracking-tighter mb-1 italic">INVOICE</h1>
                <div className="text-sm font-black text-zinc-400 uppercase tracking-widest">#{orderId}/2024</div>
              </div>

              <div className="grid grid-cols-2 md:block gap-8 md:space-y-1 font-medium text-zinc-500">
                <div className="text-[11px]">
                  <span className="text-zinc-900 font-bold uppercase mr-2">{t('dateOfIssue')}:</span>
                  {formatDate(order.created)}
                </div>
                <div className="text-[11px]">
                  <span className="text-zinc-900 font-bold uppercase mr-2">{t('dueDate')}:</span>
                  {formatDate((order.created?.seconds ? order.created.seconds * 1000 : order.created) + 7 * 24 * 60 * 60 * 1000)}
                </div>
                <div className="text-[11px]">
                  <span className="text-zinc-900 font-bold uppercase mr-2">{t('placeOfIssue')}:</span>
                   Prizren
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-100 mb-12" />

          {/* Customer box */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
               <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">{t('customer')}</div>
               <div className="text-xl font-black text-zinc-900 mb-2 uppercase tracking-tight">{order.name}</div>
               <div className="text-[12px] font-medium text-zinc-500 leading-relaxed space-y-1">
                 <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-zinc-300" /> {order.address}</div>
                 <div className="ml-5">{order.city}, {order.zipCode}</div>
                 <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-zinc-300" /> {order.phone}</div>
                 <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-zinc-300" /> {order.email}</div>
               </div>
            </div>
            
            <div className="md:text-right">
               <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Payment Status</div>
               <div className={cn(
                 "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                 order.status === 'processed' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-sky-50 text-sky-600 border border-sky-100"
               )}>
                 <div className={cn("w-2 h-2 rounded-full", order.status === 'processed' ? "bg-emerald-500" : "bg-sky-500")} />
                 {order.status === 'processed' ? 'PAID / KRYER' : 'PENDING / NË PRITJE'}
               </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-grow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50/50">
                  <th className="px-4 py-4 text-[10px] font-black text-zinc-900 uppercase tracking-widest text-left border-y border-zinc-100">{t('itemDescription')}</th>
                  <th className="px-4 py-4 text-[10px] font-black text-zinc-900 uppercase tracking-widest text-center border-y border-zinc-100">{t('qty')}</th>
                  <th className="px-4 py-4 text-[10px] font-black text-zinc-900 uppercase tracking-widest text-center border-y border-zinc-100">{t('unit')}</th>
                  <th className="px-4 py-4 text-[10px] font-black text-zinc-900 uppercase tracking-widest text-right border-y border-zinc-100">{t('unitPrice')}</th>
                  <th className="px-4 py-4 text-[10px] font-black text-zinc-900 uppercase tracking-widest text-right border-y border-zinc-100">{t('vat')}</th>
                  <th className="px-4 py-4 text-[10px] font-black text-zinc-900 uppercase tracking-widest text-right border-y border-zinc-100">{t('amount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {order.items.map((item, idx) => {
                  const grossTotal = (item.qty * item.price);
                  const discountAmount = (grossTotal * (order.discountPercent || 0)) / 100;
                  const discountedGross = grossTotal - discountAmount;
                  const netTotal = discountedGross / 1.18;
                  const pdvTotal = discountedGross - netTotal;
                  const unitPriceNet = item.price / 1.18;

                  return (
                    <tr key={idx} className="group hover:bg-zinc-50/30 transition-colors">
                      <td className="px-4 py-6">
                        <div className="text-[12px] font-black text-zinc-900 uppercase tracking-tight mb-1">{getLocalized(item.name)}</div>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded uppercase tracking-widest">SKU: {item.sku}</span>
                           {item.isEUOrder && (
                             <span className="text-[9px] font-black text-sky-500 bg-sky-50 px-1.5 py-0.5 rounded uppercase tracking-widest">EU ORDER</span>
                           )}
                        </div>
                      </td>
                      <td className="px-4 py-6 text-[12px] font-black text-zinc-900 text-center">{item.qty}</td>
                      <td className="px-4 py-6 text-[11px] font-bold text-zinc-400 text-center uppercase">COV.</td>
                      <td className="px-4 py-6 text-[12px] font-bold text-zinc-900 text-right">€{unitPriceNet.toFixed(2)}</td>
                      <td className="px-4 py-6 text-[11px] font-bold text-zinc-900 text-right">€{pdvTotal.toFixed(2)}</td>
                      <td className="px-4 py-6 text-[13px] font-black text-zinc-900 text-right">€{discountedGross.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className="mt-12 flex justify-end totals-section">
              <div className="w-full max-w-[340px] space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span>Subtotal:</span>
                  <span>€{(order.subtotal / 1.18).toFixed(2)}</span>
                </div>
                {order.discountPercent > 0 && (
                  <div className="flex justify-between text-[11px] font-bold text-sky-500 uppercase tracking-widest">
                    <span>Discount ({order.discountPercent}%):</span>
                    <span>-€{((order.subtotal * order.discountPercent / 100) / 1.18).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-widest border-t border-dashed border-zinc-100 pt-3">
                  <span>VAT (18%):</span>
                  <span>€{((order.subtotal - (order.subtotal * order.discountPercent / 100)) * 0.18 / 1.18).toFixed(2)}</span>
                </div>
                
                <div className="relative mt-8 group">
                   <div className="absolute -inset-1 bg-zinc-900 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500 print:hidden" />
                   <div className="relative bg-zinc-900 px-8 py-6 rounded-2xl flex justify-between items-center text-white overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 block mb-1">{t('totalAmount')}</span>
                        <span className="text-3xl font-black tracking-tighter italic">TOTAL</span>
                      </div>
                      <div className="relative text-right">
                        <span className="text-3xl font-black tracking-tight">€{(order.totalAfterDiscount || order.total || order.subtotal).toFixed(2)}</span>
                      </div>
                   </div>
                </div>

                <div className="text-[10px] font-black text-zinc-400 text-right uppercase tracking-[0.1em] mt-4 px-2 italic">
                  Amount in words: {(order.totalAfterDiscount || order.total || order.subtotal).toFixed(2)} EURO
                </div>
              </div>
            </div>
          </div>

          {/* Signature Area */}
          <div className="mt-24 grid grid-cols-2 gap-24 print:mt-12 signature-area">
            <div className="text-center group">
              <div className="h-[1px] bg-zinc-200 mb-4 group-hover:bg-zinc-400 transition-colors" />
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('receivedBy')}</div>
              <div className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">{order.name}</div>
            </div>
            <div className="text-center group">
              <div className="h-[1px] bg-zinc-200 mb-4 group-hover:bg-zinc-400 transition-colors" />
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('issuedBy')}</div>
              <div className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">Sprinter Plus d.o.o.</div>
            </div>
          </div>

          {/* Footer Area */}
          <div className="mt-auto pt-16">
            <div className="bg-zinc-50 border-t border-zinc-100 p-8 rounded-3xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-[11px] font-black text-zinc-900 uppercase tracking-[0.15em]">Raiffeisen Bank Kosovo J.S.C.</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">
                  XK05 1502 0010 0235 7241 • RZKOKOXX
                </div>
              </div>
              <div className="mt-6 text-[10px] font-medium text-zinc-400 leading-relaxed text-center max-w-2xl mx-auto">
                {t('invoiceNote')}
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-100 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">
              THANK YOU FOR SHOPPING WITH US
            </div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { 
            size: A4;
            margin: 8mm;
          }
          header, footer, nav, .bg-zinc-900.text-zinc-100, .print\\:hidden { display: none !important; }
          body { 
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-size: 9pt;
          }
          
          .max-w-4xl { 
            max-width: 100% !important;
            margin: 0 !important; 
            width: 100% !important;
            padding: 0 !important;
          }
          
          .bg-zinc-900 { background-color: #18181b !important; color: white !important; }
          .bg-zinc-50 { background-color: #fafafa !important; }
          .bg-zinc-50\\/50 { background-color: #fafafa !important; }
          .bg-emerald-50 { background-color: #ecfdf5 !important; }
          .bg-sky-50 { background-color: #f0f9ff !important; }
          .text-sky-500 { color: #0ea5e9 !important; }
          .text-emerald-600 { color: #059669 !important; }
          
          .invoice-container {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            min-height: 0 !important;
            transform: scale(0.98);
            transform-origin: top center;
          }

          .mb-16 { margin-bottom: 1rem !important; }
          .mb-12 { margin-bottom: 0.75rem !important; }
          .mt-24 { margin-top: 1rem !important; }
          .mt-12 { margin-top: 0.5rem !important; }
          .pt-16 { padding-top: 0.75rem !important; }
          .py-6 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
          .gap-12 { gap: 1rem !important; }
          .gap-24 { gap: 2rem !important; }

          /* Keep sections together */
          .flex-col, .grid, table, .totals-section, .signature-area { 
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          table { width: 100% !important; page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          
          h1.text-5xl { font-size: 2rem !important; }
          .text-3xl { font-size: 1.25rem !important; }
          .text-xl { font-size: 1rem !important; }
        }
      `}} />
    </div>
  );
}
