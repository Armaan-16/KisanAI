import React from 'react';
import { IconX, IconShoppingCart } from './Icons';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface FarmKartModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const products = [
  { id: 1, name: "Organic Fertilizer (50kg)", price: 1200, category: "Fertilizer" },
  { id: 2, name: "Hybrid Paddy Seeds (10kg)", price: 850, category: "Seeds" },
  { id: 3, name: "Manual Sprayer Pump", price: 1500, category: "Tools" },
  { id: 4, name: "Neem Oil (1L)", price: 450, category: "Pesticide" },
  { id: 5, name: "Sickle (Steel)", price: 150, category: "Tools" },
  { id: 6, name: "Vermicompost (20kg)", price: 600, category: "Fertilizer" },
];

export const FarmKartModal: React.FC<FarmKartModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
             <IconShoppingCart className="w-6 h-6" />
             <h2 className="text-xl font-bold">{t.farmKart}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">{t.products}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-800 group">
                <div className="h-40 bg-gray-200 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-gray-400 dark:text-slate-600 text-4xl font-bold opacity-30 group-hover:scale-110 transition-transform">{p.name.charAt(0)}</span>
                </div>
                <div className="p-4">
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider mb-1">{p.category}</div>
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">{p.name}</h4>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">₹{p.price}</span>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
                      {t.buy}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};