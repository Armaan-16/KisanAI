import React, { useState, useEffect, useRef } from 'react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { MarketItem, Language } from '../types';
import { translations } from '../utils/translations';
import { IconTrendingUp, IconTrendingDown, IconSprout, IconSearch, IconFilter } from './Icons';
import { statesData } from '../utils/indianData';

interface MarketWidgetProps {
  isDark?: boolean;
  language: Language;
}

const cropsList = ["Rice", "Wheat", "Tomato", "Potato", "Onion", "Cotton", "Maize", "Sugarcane", "Mustard", "Soybean"];

// Helper to generate initial consistent data based on district
const getMarketDataForDistrict = (district: string): MarketItem[] => {
  // Simple hash to make 'random' numbers stable for the same district initially
  let hash = 0;
  for (let i = 0; i < district.length; i++) {
    hash = district.charCodeAt(i) + ((hash << 5) - hash);
  }

  return cropsList.map((crop, index) => {
    // Generate pseudo-random values
    const basePrice = 1200 + Math.abs((hash * (index + 1)) % 6000);
    const demand = 30 + Math.abs((hash * (index + 2)) % 70);
    const supply = 30 + Math.abs((hash * (index + 3)) % 70);
    
    return {
      crop,
      price: basePrice,
      demand,
      supply
    };
  });
};

const MarketWidget: React.FC<MarketWidgetProps> = ({ isDark, language }) => {
  const t = translations[language];
  
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedState, setSelectedState] = useState("Odisha");
  const [selectedDistrict, setSelectedDistrict] = useState("Bargarh");
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'demand' | 'supply'>('name');
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Theme colors
  const chartTextColor = isDark ? '#cbd5e1' : '#4b5563';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipText = isDark ? '#f1f5f9' : '#1f2937';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  useEffect(() => {
    // Initial Load
    const data = getMarketDataForDistrict(selectedDistrict);
    setMarketData(data);

    // Live Realtime Simulation: Fluctuate prices slightly every 3 seconds
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setMarketData(prevData => prevData.map(item => {
        // Random fluctuation between -2% and +2%
        const fluctuation = (Math.random() * 0.04) - 0.02; 
        const newPrice = Math.max(500, Math.floor(item.price * (1 + fluctuation)));
        
        // Occasionally shift demand/supply
        const demandShift = Math.random() > 0.8 ? (Math.floor(Math.random() * 5) - 2) : 0;
        
        return {
          ...item,
          price: newPrice,
          demand: Math.max(0, Math.min(100, item.demand + demandShift)),
          supply: item.supply
        };
      }));
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedDistrict]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    // Reset district to first in list
    if (statesData[newState]) {
      setSelectedDistrict(statesData[newState][0]);
    }
  };

  const getProcessedData = () => {
    let processed = [...marketData];

    // Filter
    if (searchTerm) {
      processed = processed.filter(item => item.crop.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sort
    processed.sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];
      
      if (sortBy === 'name') {
        valA = a.crop;
        valB = b.crop;
        return valA.localeCompare(valB);
      } else {
         // Descending order for numbers (Price/Demand/Supply)
         return valB - valA;
      }
    });

    return processed;
  };

  const processedData = getProcessedData();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 p-5 h-full transition-colors duration-300 flex flex-col overflow-hidden">
      <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-5 text-center flex items-center justify-center gap-2 shrink-0">
         <IconTrendingUp className="w-5 h-5" />
         {t.marketData}
      </h3>
      
      {/* Selectors */}
      <div className="grid grid-cols-3 gap-3 mb-4 shrink-0">
        <div>
           <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t.selectCountry}</label>
           <select 
             className="w-full p-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-medium text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
             value={selectedCountry}
             onChange={(e) => setSelectedCountry(e.target.value)}
           >
             <option value="India">India</option>
           </select>
        </div>

        <div>
           <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t.selectState}</label>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="w-full p-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-medium text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {Object.keys(statesData).sort().map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
        </div>

        <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t.selectDistrict}</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-medium text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {statesData[selectedState]?.sort().map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
        </div>
      </div>

      {/* Search & Sort Row */}
      <div className="flex gap-2 mb-4 shrink-0">
        <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
        <div className="relative w-1/3">
             <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <IconFilter className="h-3 w-3 text-gray-400" />
            </div>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-7 pr-2 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                <option value="name">{t.sortName}</option>
                <option value="price">{t.sortPrice}</option>
                <option value="demand">{t.sortDemand}</option>
                <option value="supply">{t.sortSupply}</option>
            </select>
        </div>
      </div>

      {/* Graph Area - Fixed Height */}
      <div className="h-[200px] w-full mb-6 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="crop" 
              tick={{fontSize: 10, fill: chartTextColor}} 
              axisLine={false} 
              tickLine={false}
              interval={0}
            />
            <YAxis 
              yAxisId="left" 
              tick={{fontSize: 10, fill: chartTextColor}} 
              axisLine={false} 
              tickLine={false}
              label={{ value: 'Index', angle: -90, position: 'insideLeft', fill: chartTextColor, fontSize: 10 }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{fontSize: 10, fill: chartTextColor}} 
              axisLine={false} 
              tickLine={false}
              label={{ value: 'Price (₹)', angle: 90, position: 'insideRight', fill: chartTextColor, fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: tooltipBg, color: tooltipText, borderRadius: '8px', border: '1px solid ' + gridColor, fontSize: '12px' }}
              cursor={{fill: isDark ? 'rgba(255,255,255,0.05)' : '#f0fdf4'}}
            />
            <Legend wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
            
            <Bar yAxisId="left" dataKey="supply" name={t.supply} fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={12} />
            <Bar yAxisId="left" dataKey="demand" name={t.demand} fill="#fca5a5" radius={[4, 4, 0, 0]} barSize={12} />
            <Line yAxisId="right" type="monotone" dataKey="price" name={t.price} stroke="#22c55e" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Live Trends List - Flex Scrollable */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-gray-100 dark:border-slate-800 pt-2">
        <div className="flex justify-between items-center pb-2 mb-2 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t.marketTrends}</span>
          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
        </div>
        <div className="space-y-3 overflow-y-auto pr-1 scrollbar-hide flex-1">
          {processedData.length > 0 ? (
            processedData.map((item, idx) => {
             const isRecommended = item.demand > item.supply + 20;
             return (
              <div key={item.crop} className={`flex justify-between items-center p-2 rounded-lg transition-colors cursor-default group ${isRecommended ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isRecommended ? 'bg-green-200 text-green-700' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'}`}>
                      {item.crop.charAt(0)}
                   </div>
                   <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                        {item.crop}
                        {isRecommended && <span className="text-[9px] bg-green-500 text-white px-1.5 rounded-full">BEST</span>}
                      </div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                         {item.demand > item.supply ? (
                           <span className="text-green-500 flex items-center gap-0.5"><IconTrendingUp className="w-3 h-3"/> {t.highDemand}</span>
                         ) : (
                           <span className="text-orange-500 flex items-center gap-0.5"><IconTrendingDown className="w-3 h-3"/> {t.volatility}</span>
                         )}
                      </div>
                   </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 dark:text-green-400 text-sm">₹{item.price}</div>
                  <div className={`text-[10px] font-medium ${idx % 2 === 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {idx % 2 === 0 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
                  </div>
                </div>
              </div>
          )})
          ) : (
              <div className="text-center text-gray-400 dark:text-slate-600 py-4 text-sm">
                  No crops found.
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketWidget;