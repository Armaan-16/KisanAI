import React, { useState, useEffect } from 'react';
import { IconX, IconLeaf } from './Icons';
import { generateCropPlan } from '../services/geminiService';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface CropPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  language: Language;
}

const crops = [
  "Sugarcane",
  "Paddy (Rice)",
  "Wheat",
  "Cotton",
  "Maize",
  "Tomato"
];

const cropDetails: Record<string, { soil: string, fertilizer: string, watering: string, harvest: string }> = {
  "Sugarcane": {
    soil: "Loamy, well-drained soils",
    fertilizer: "NPK complex, pressmud",
    watering: "Frequent watering, especially during formative stage",
    harvest: "Approx. 10-18 months"
  },
  "Paddy (Rice)": {
    soil: "Clay or clay loams",
    fertilizer: "Urea, DAP, Potash",
    watering: "Needs standing water",
    harvest: "Approx. 3-6 months"
  },
  "Wheat": {
    soil: "Loam texture, good drainage",
    fertilizer: "Nitrogen, Phosphorus",
    watering: "4-6 irrigations at critical stages",
    harvest: "Approx. 4-5 months"
  },
  "Cotton": {
    soil: "Black cotton soil (Regur)",
    fertilizer: "Farmyard manure, NPK",
    watering: "Moderate, sensitive to waterlogging",
    harvest: "Approx. 6-8 months"
  },
  "Maize": {
    soil: "Fertile, well-drained loams",
    fertilizer: "Nitrogen rich",
    watering: "Critical during flowering",
    harvest: "Approx. 3-4 months"
  },
  "Tomato": {
    soil: "Sandy loam, rich in organic matter",
    fertilizer: "Balanced NPK",
    watering: "Regular, avoid wetting leaves",
    harvest: "Approx. 2-3 months"
  }
};

export const CropPlannerModal: React.FC<CropPlannerModalProps> = ({ isOpen, onClose, isDark, language }) => {
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const [weekPlan, setWeekPlan] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      fetchPlan(selectedCrop);
    }
  }, [isOpen, selectedCrop, language]);

  const fetchPlan = async (crop: string) => {
    setLoading(true);
    setWeekPlan('');
    const plan = await generateCropPlan(crop, language);
    setWeekPlan(plan);
    setLoading(false);
  };

  if (!isOpen) return null;

  const details = cropDetails[selectedCrop] || cropDetails["Sugarcane"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">{t.plannerTitle}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition-colors"
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
              {t.selectCrop}
            </label>
            <div className="relative">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-3 bg-white dark:bg-slate-800 border border-green-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none shadow-sm font-medium"
              >
                {crops.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Guide Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">
              {selectedCrop} {t.guide}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t.soil}</p>
                <p className="text-gray-800 dark:text-slate-200 font-medium">{details.soil}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t.fertilizer}</p>
                <p className="text-gray-800 dark:text-slate-200 font-medium">{details.fertilizer}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t.watering}</p>
                <p className="text-gray-800 dark:text-slate-200 font-medium">{details.watering}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t.harvest}</p>
                <p className="text-gray-800 dark:text-slate-200 font-medium">{details.harvest}</p>
              </div>
            </div>
          </div>

          {/* Week-wise Plan Section */}
          <div>
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
              <IconLeaf className="w-5 h-5" />
              {t.weekPlan}
            </h3>
            
            <div className="bg-green-50 dark:bg-slate-800/50 p-6 rounded-xl border border-green-100 dark:border-slate-700 min-h-[150px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-8 space-y-3">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                   <p className="text-sm text-green-700 dark:text-green-400 animate-pulse">{t.generatingPlan}</p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-line text-gray-700 dark:text-slate-300 leading-relaxed font-sans">
                    {weekPlan}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
