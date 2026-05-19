import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Vehicle } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Car, ChevronRight, X, CheckCircle2, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PartFinder() {
  const { t, selectedVehicle, setSelectedVehicle, vehicles } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-part-finder', handleOpen);
    return () => window.removeEventListener('open-part-finder', handleOpen);
  }, []);
  
  const [step, setStep] = useState(1);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<string | null>(null);
  const [engine, setEngine] = useState('');

  const handleReset = () => {
    setMake('');
    setModel('');
    setYear(null);
    setEngine('');
    setStep(1);
  };

  const handleSelectVehicle = () => {
    const vehicle = vehicles.find(v => 
      v.make === make && 
      v.model === model && 
      v.year === year && 
      v.engine === engine
    );
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setIsOpen(false);
    }
  };

  const makes = Array.from(new Set(vehicles.map(v => v.make))).sort();
  const models = make ? Array.from(new Set(vehicles.filter(v => v.make === make).map(v => v.model))).sort() : [];
  const years = (make && model) ? Array.from(new Set(vehicles.filter(v => v.make === make && v.model === model).map(v => v.year))).sort((a, b) => String(b).localeCompare(String(a))) : [];
  const engines = (make && model && year) ? Array.from(new Set(vehicles.filter(v => v.make === make && v.model === model && v.year === year).map(v => v.engine))).sort() : [];

  return (
    <div className="relative">
      {/* Quick Access Bar / Trigger */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-zinc-200/50 border border-zinc-100 p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
                <Car className="w-6 h-6 text-sky-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest leading-none mb-1">
                  {selectedVehicle ? 'Vehicle Selected' : 'Find Parts for Your Car'}
                </h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  {selectedVehicle 
                    ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})` 
                    : 'Select vehicle for perfect fitment'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {selectedVehicle && (
                <button 
                  onClick={() => setSelectedVehicle(null)}
                  className="h-12 px-6 rounded-2xl border border-zinc-100 text-zinc-400 hover:text-red-500 hover:border-red-100 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={() => setIsOpen(true)}
                className="h-12 px-8 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-sky-500 transition-all active:scale-95 flex items-center gap-2 flex-1 md:flex-none justify-center"
              >
                {selectedVehicle ? 'Change Vehicle' : 'Start Searching'}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-zinc-50 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Vehicles Selection</h2>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Step {step} of 4</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                {/* Progress Dots */}
                <div className="flex gap-2 mb-8 sticky top-0 bg-white pb-4 z-10">
                  {[1, 2, 3, 4].map(s => (
                    <div 
                      key={s} 
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-all duration-500",
                        step >= s ? "bg-sky-500" : "bg-zinc-100"
                      )}
                    />
                  ))}
                </div>

                <div className="min-h-[300px]">
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-zinc-900 mb-4">Select Make</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {makes.map(m => (
                          <button
                            key={m}
                            onClick={() => { setMake(m); setStep(2); }}
                            className={cn(
                              "h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border",
                              make === m ? "bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-200" : "bg-zinc-50 text-zinc-600 border-zinc-100 hover:border-sky-200"
                            )}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <button onClick={() => setStep(1)} className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                        ← Back to Makes
                      </button>
                      <h3 className="font-bold text-zinc-900 mb-4">Select Model for {make}</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {models.map(m => (
                          <button
                            key={m}
                            onClick={() => { setModel(m); setStep(3); }}
                            className={cn(
                              "h-14 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border flex items-center justify-between",
                              model === m ? "bg-sky-500 text-white border-sky-500" : "bg-zinc-50 text-zinc-600 border-zinc-100 hover:border-sky-200"
                            )}
                          >
                            {m}
                            <ChevronRight className="w-4 h-4 opacity-40" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <button onClick={() => setStep(2)} className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                        ← Back to Models
                      </button>
                      <h3 className="font-bold text-zinc-900 mb-4">Select Year for {model}</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {years.map(y => (
                          <button
                            key={y}
                            onClick={() => { setYear(y); setStep(4); }}
                            className={cn(
                              "h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border",
                              year === y ? "bg-sky-500 text-white border-sky-500" : "bg-zinc-50 text-zinc-600 border-zinc-100 hover:border-sky-200"
                            )}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-4">
                      <button onClick={() => setStep(3)} className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                        ← Back to Years
                      </button>
                      <h3 className="font-bold text-zinc-900 mb-4">Select Engine Type</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {engines.map(e => (
                          <button
                            key={e}
                            onClick={() => { setEngine(e); }}
                            className={cn(
                              "h-14 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border flex items-center justify-between text-left",
                              engine === e ? "bg-sky-500 text-white border-sky-500" : "bg-zinc-50 text-zinc-600 border-zinc-100 hover:border-sky-200"
                            )}
                          >
                            {e}
                            {engine === e && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between shrink-0">
                <button 
                  onClick={handleReset}
                  className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors"
                >
                  Reset Selection
                </button>
                <button 
                  disabled={!engine}
                  onClick={handleSelectVehicle}
                  className="h-14 px-8 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-sky-500 transition-all active:scale-95 disabled:opacity-20 disabled:pointer-events-none flex items-center gap-2 shadow-xl shadow-zinc-200"
                >
                  Show Compatible Parts
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
