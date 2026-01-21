import React, { useState } from 'react';
import { 
  IconCloudRain, 
  IconWallet, 
  IconSprout, 
  IconLandmark, 
  IconUsers, 
  IconShoppingCart, 
  IconBell, 
  IconUser,
  IconLeaf,
  IconLogOut,
  IconSun,
  IconMoon
} from './Icons';
import ChatWidget from './ChatWidget';
import MarketWidget from './MarketWidget';
import { CropPlannerModal } from './CropPlannerModal';
import { WeatherModal } from './WeatherModal';
import { FinanceModal } from './FinanceModal';
import { SchemesModal } from './SchemesModal';
import { CommunityModal } from './CommunityModal';
import { FarmKartModal } from './FarmKartModal';
import { ProfileModal } from './ProfileModal';
import { User, Language, DashboardFeature } from '../types';
import { translations } from '../utils/translations';

const DashboardCard = ({ 
  title, 
  icon: Icon, 
  highlight = false,
  onClick
}: { 
  title: string; 
  icon: React.ElementType; 
  highlight?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
      relative overflow-hidden rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 group
      ${highlight 
        ? 'bg-white dark:bg-slate-900 shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 scale-[1.02]' 
        : 'bg-white dark:bg-slate-900 shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 hover:border-green-200 dark:hover:border-green-800'
      }
    `}>
      <div className={`p-4 rounded-full ${highlight ? 'bg-green-100 dark:bg-green-900/40' : 'bg-gray-50 dark:bg-slate-800 group-hover:bg-green-50 dark:group-hover:bg-slate-700'} transition-colors`}>
        <Icon className={`w-8 h-8 ${highlight ? 'text-green-600 dark:text-green-400' : 'text-green-600 dark:text-green-400'}`} />
      </div>
      <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-center">{title}</h3>
      {highlight && (
        <div className="absolute inset-0 rounded-xl pointer-events-none shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]"></div>
      )}
    </div>
  );
};

interface DashboardProps {
  user: User;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, isDark, toggleTheme, language, setLanguage }) => {
  const [activeFeature, setActiveFeature] = useState<DashboardFeature | null>(null);
  const t = translations[language];

  const closeModal = () => setActiveFeature(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-3">
           <div className="bg-green-600 p-1.5 rounded-lg">
              <IconLeaf className="w-6 h-6 text-white" />
           </div>
           <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 tracking-tight">{t.appTitle}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="hidden sm:block bg-gray-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="or">ଓଡ଼ିଆ</option>
          </select>

          <div 
            className="hidden md:flex flex-col items-end mr-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveFeature(DashboardFeature.PROFILE)}
          >
            <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{user.name}</span>
            <span className="text-xs text-gray-500 dark:text-slate-400">{user.phoneNumber}</span>
          </div>

          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
          </button>

          <div className="relative cursor-pointer">
             <IconBell className="w-6 h-6 text-gray-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" />
             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">2</span>
          </div>
          <button onClick={onLogout} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-gray-500 dark:text-slate-400 hover:text-red-500 transition-colors" title={t.logout}>
             <IconLogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           {/* Left Column: Features */}
           <div className="lg:col-span-2 space-y-6">
              
              {/* Feature Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DashboardCard 
                  title={t.weather} 
                  icon={IconCloudRain} 
                  onClick={() => setActiveFeature(DashboardFeature.WEATHER)}
                />
                <DashboardCard 
                  title={t.finance} 
                  icon={IconWallet} 
                  onClick={() => setActiveFeature(DashboardFeature.FINANCE)}
                />
                <DashboardCard 
                  title={t.cropPlanner} 
                  icon={IconSprout} 
                  highlight
                  onClick={() => setActiveFeature(DashboardFeature.CROP_MANAGER)}
                />
                <DashboardCard 
                  title={t.schemes} 
                  icon={IconLandmark} 
                  onClick={() => setActiveFeature(DashboardFeature.SCHEMES)}
                />
                <DashboardCard 
                  title={t.community} 
                  icon={IconUsers} 
                  onClick={() => setActiveFeature(DashboardFeature.COMMUNITY)}
                />
                <DashboardCard 
                  title={t.farmKart} 
                  icon={IconShoppingCart} 
                  onClick={() => setActiveFeature(DashboardFeature.FARM_KART)}
                />
              </div>

              {/* Market Widget (Large) */}
              <div className="h-[600px]">
                <MarketWidget isDark={isDark} language={language} />
              </div>
           </div>

           {/* Right Column: Chat */}
           <div className="lg:col-span-1">
             <ChatWidget language={language} />
           </div>
        </div>
      </main>

      {/* Modals */}
      <CropPlannerModal 
        isOpen={activeFeature === DashboardFeature.CROP_MANAGER} 
        onClose={closeModal} 
        isDark={isDark}
        language={language}
      />
      <WeatherModal 
        isOpen={activeFeature === DashboardFeature.WEATHER} 
        onClose={closeModal} 
        language={language}
      />
      <FinanceModal 
        isOpen={activeFeature === DashboardFeature.FINANCE} 
        onClose={closeModal} 
        language={language}
      />
      <SchemesModal 
        isOpen={activeFeature === DashboardFeature.SCHEMES} 
        onClose={closeModal} 
        language={language}
      />
      <CommunityModal 
        isOpen={activeFeature === DashboardFeature.COMMUNITY} 
        onClose={closeModal} 
        language={language}
      />
      <FarmKartModal 
        isOpen={activeFeature === DashboardFeature.FARM_KART} 
        onClose={closeModal} 
        language={language}
      />
      <ProfileModal 
        isOpen={activeFeature === DashboardFeature.PROFILE} 
        onClose={closeModal} 
        user={user} 
        language={language} 
      />

    </div>
  );
};