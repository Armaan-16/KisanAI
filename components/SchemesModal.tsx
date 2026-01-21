import React from 'react';
import { IconX, IconLandmark } from './Icons';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface SchemesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const schemes = [
  {
    id: 1,
    title: "PM-Kisan Samman Nidhi",
    desc: "Financial benefit of Rs. 6000/- per year in three equal installments.",
    link: "#"
  },
  {
    id: 2,
    title: "Pradhan Mantri Fasal Bima Yojana",
    desc: "Crop insurance scheme to provide financial support to farmers suffering crop loss.",
    link: "#"
  },
  {
    id: 3,
    title: "Kisan Credit Card (KCC)",
    desc: "Provides adequate and timely credit support from the banking system.",
    link: "#"
  },
  {
    id: 4,
    title: "Soil Health Card Scheme",
    desc: "Assist State Governments to issue Soil Health Cards to all farmers.",
    link: "#"
  }
];

export const SchemesModal: React.FC<SchemesModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
             <IconLandmark className="w-6 h-6" />
             <h2 className="text-xl font-bold">{t.schemes}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">{t.schemeList}</h3>
          <div className="grid gap-4">
            {schemes.map(s => (
              <div key={s.id} className="p-5 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow bg-gray-50 dark:bg-slate-800">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{s.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">{s.desc}</p>
                <button className="text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors">
                  {t.apply}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};