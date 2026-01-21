import React, { useState, useEffect } from 'react';
import { IconX, IconLandmark, IconSearch, IconInfo, IconLeaf, IconUser, IconSun } from './Icons';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { getLatestSchemes } from '../services/geminiService';

interface SchemesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface Scheme {
  id: number;
  title: string;
  desc: string;
  link: string;
  eligibility: string[];
  features: string[];
}

const DEFAULT_SCHEMES: Scheme[] = [
  {
    id: 1,
    title: "PM-Kisan Samman Nidhi",
    desc: "Income support of ₹6,000 per year to all landholding farmer families, paid in three equal installments.",
    link: "https://pmkisan.gov.in/",
    eligibility: [
      "All landholding farmer families having cultivable landholding in their names.",
      "Institutional landholders are NOT eligible.",
      "Farmer families paying income tax are NOT eligible.",
      "Professionals (Doctors, Engineers, Lawyers) are NOT eligible."
    ],
    features: [
      "Direct Benefit Transfer (DBT) of ₹6,000/year.",
      "Amount transferred in 3 equal installments of ₹2,000 every 4 months.",
      "100% funding from the Central Government."
    ]
  },
  {
    id: 2,
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    desc: "Crop insurance scheme that provides financial support to farmers suffering crop loss/damage due to unforeseen events.",
    link: "https://pmfby.gov.in/",
    eligibility: [
      "All farmers growing notified crops in notified areas.",
      "Includes sharecroppers and tenant farmers.",
      "Farmers should have insurable interest in the crop."
    ],
    features: [
      "Low premium rates: 2% for Kharif, 1.5% for Rabi, 5% for commercial/horticultural crops.",
      "Full sum insured is offered without capping.",
      "Covers localized calamities like hailstorm, landslide, inundation.",
      "Use of technology (drones, smartphones) for faster claim settlement."
    ]
  },
  {
    id: 3,
    title: "Kisan Credit Card (KCC)",
    desc: "Provides adequate and timely credit support from the banking system under a single window with flexible and simplified procedures.",
    link: "https://myscheme.gov.in/schemes/kcc",
    eligibility: [
      "All farmers - individuals/joint borrowers who are owner cultivators.",
      "Tenant farmers, oral lessees & share croppers.",
      "SHGs or Joint Liability Groups of farmers.",
      "Fisheries and Animal Husbandry farmers."
    ],
    features: [
      "Credit limit based on operational land holding and scale of finance.",
      "Interest subvention of 2% per annum.",
      "Additional 3% incentive for prompt repayment.",
      "Atm enabled RuPay Debit Card.",
      "Includes crop loans and consumption requirements."
    ]
  }
];

export const SchemesModal: React.FC<SchemesModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<number | null>(null);
  
  const [schemes, setSchemes] = useState<Scheme[]>(DEFAULT_SCHEMES);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Auto-fetch on open if we only have default schemes
  useEffect(() => {
    if (isOpen && schemes.length === DEFAULT_SCHEMES.length) {
       // Optional: Uncomment to auto-fetch every time. 
       // For now, let's keep it manual or on first load to save API calls
       // handleRefresh();
    }
  }, [isOpen]);

  const handleRefresh = async () => {
    setIsFetching(true);
    setFetchError('');
    try {
        const newSchemes = await getLatestSchemes(language);
        if (newSchemes && newSchemes.length > 0) {
            setSchemes(newSchemes);
        } else {
            setFetchError(t.schemesUpdateFailed);
        }
    } catch (e) {
        setFetchError(t.schemesUpdateFailed);
    } finally {
        setIsFetching(false);
    }
  };

  if (!isOpen) return null;

  const filteredSchemes = schemes.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleEligibility = (id: number) => {
    setExpandedSchemeId(expandedSchemeId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 bg-orange-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
             <IconLandmark className="w-6 h-6" />
             <h2 className="text-xl font-bold">{t.schemes}</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
                onClick={handleRefresh}
                disabled={isFetching}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-2
                    ${isFetching 
                        ? 'bg-orange-100 text-orange-600 border-orange-200 cursor-wait' 
                        : 'bg-white hover:bg-orange-50 text-gray-600 hover:text-orange-600 border-gray-200 hover:border-orange-200'
                    }`}
            >
                <div className={`${isFetching ? 'animate-spin' : ''}`}>
                    <IconSun className="w-3 h-3" /> 
                </div>
                {isFetching ? t.updatingSchemes : t.refreshSchemes}
            </button>

            <button onClick={onClose} className="p-2 rounded-full hover:bg-orange-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 transition-colors">
                <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar & Status */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
          {fetchError && (
              <div className="mb-3 p-2 bg-red-50 text-red-600 text-xs rounded-lg text-center">
                  {fetchError}
              </div>
          )}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder={t.searchSchemes}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl leading-5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-slate-950 flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center justify-between">
            <span>{t.schemeList}</span>
            <span className="text-xs font-normal text-gray-500 bg-gray-200 dark:bg-slate-800 px-2 py-1 rounded-full">
              {filteredSchemes.length} found
            </span>
          </h3>
          
          <div className="grid gap-6">
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map(s => {
                const isExpanded = expandedSchemeId === s.id;
                
                return (
                  <div key={s.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="p-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">{s.title}</h4>
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase shrink-0">
                          Govt of India
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-5 leading-relaxed">
                        {s.desc}
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        <a 
                          href={s.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none text-center text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                        >
                          {t.apply}
                        </a>
                        <button 
                          onClick={() => toggleEligibility(s.id)}
                          className={`flex-1 sm:flex-none text-center text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors border flex items-center justify-center gap-2
                            ${isExpanded 
                              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' 
                              : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600'
                            }`}
                        >
                          {isExpanded ? (
                             <>{t.hideDetails} <IconX className="w-4 h-4" /></>
                          ) : (
                             <>{t.checkEligibility} <IconInfo className="w-4 h-4" /></>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details Section */}
                    {isExpanded && (
                      <div className="bg-orange-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 p-5 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid md:grid-cols-2 gap-6">
                          
                          {/* Eligibility Column */}
                          <div>
                            <h5 className="text-sm font-bold text-gray-800 dark:text-orange-400 mb-3 flex items-center gap-2">
                              <IconUser className="w-4 h-4" /> {t.eligibilityCriteria}
                            </h5>
                            <ul className="space-y-2">
                              {s.eligibility.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-slate-300 flex items-start gap-2">
                                  <span className="text-orange-500 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Features Column */}
                          <div>
                            <h5 className="text-sm font-bold text-gray-800 dark:text-green-400 mb-3 flex items-center gap-2">
                              <IconLeaf className="w-4 h-4" /> {t.keyFeatures}
                            </h5>
                            <ul className="space-y-2">
                              {s.features.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-slate-300 flex items-start gap-2">
                                  <span className="text-green-500 mt-1">✓</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                <IconSearch className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No schemes found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
