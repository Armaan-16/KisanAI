import React from 'react';
import { IconX, IconCloudRain, IconSun, IconMapPin } from './Icons';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
             <IconCloudRain className="w-6 h-6" />
             <h2 className="text-xl font-bold">{t.weather}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Current Weather */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1 text-blue-100 text-sm mb-1">
                  <IconMapPin className="w-4 h-4" /> Bargarh, Odisha
                </div>
                <div className="text-5xl font-bold mb-2">32°C</div>
                <div className="font-medium text-blue-100">{t.today}, Sunny</div>
              </div>
              <IconSun className="w-16 h-16 text-yellow-300 animate-pulse" />
            </div>
            <div className="flex gap-6 mt-6 pt-6 border-t border-white/20">
              <div>
                <div className="text-blue-200 text-xs">{t.humidity}</div>
                <div className="font-semibold">65%</div>
              </div>
              <div>
                <div className="text-blue-200 text-xs">{t.wind}</div>
                <div className="font-semibold">12 km/h</div>
              </div>
              <div>
                <div className="text-blue-200 text-xs">Precipitation</div>
                <div className="font-semibold">10%</div>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-3">{t.forecast}</h3>
          <div className="space-y-3">
            {[
              { day: 'Mon', temp: '31°', icon: IconSun, color: 'text-yellow-500' },
              { day: 'Tue', temp: '29°', icon: IconCloudRain, color: 'text-blue-500' },
              { day: 'Wed', temp: '30°', icon: IconCloudRain, color: 'text-blue-500' },
              { day: 'Thu', temp: '33°', icon: IconSun, color: 'text-yellow-500' },
              { day: 'Fri', temp: '32°', icon: IconSun, color: 'text-yellow-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <span className="font-medium text-gray-700 dark:text-slate-300 w-12">{item.day}</span>
                <div className="flex items-center gap-2">
                   <item.icon className={`w-5 h-5 ${item.color}`} />
                   <span className="text-sm text-gray-500 dark:text-slate-400">{item.icon === IconSun ? 'Sunny' : 'Rain'}</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">{item.temp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};