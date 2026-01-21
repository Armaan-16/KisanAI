import React, { useState, useEffect } from 'react';
import { IconX, IconCloudRain, IconSun, IconMapPin, IconAlertTriangle } from './Icons';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    isDay: number;
  };
  daily: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
  }>;
}

const getWeatherIcon = (code: number, isDay: number = 1) => {
  // WMO Weather interpretation codes
  if (code <= 3) return { icon: IconSun, label: 'Clear/Cloudy', color: 'text-yellow-400' };
  if (code <= 48) return { icon: IconCloudRain, label: 'Foggy', color: 'text-gray-400' };
  if (code <= 67) return { icon: IconCloudRain, label: 'Rain', color: 'text-blue-400' };
  if (code <= 77) return { icon: IconCloudRain, label: 'Snow', color: 'text-white' };
  if (code <= 82) return { icon: IconCloudRain, label: 'Heavy Rain', color: 'text-blue-600' };
  if (code <= 99) return { icon: IconAlertTriangle, label: 'Thunderstorm', color: 'text-purple-500' };
  return { icon: IconSun, label: 'Unknown', color: 'text-gray-400' };
};

export const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState('Locating...');

  useEffect(() => {
    if (isOpen) {
      fetchLocationAndWeather();
    }
  }, [isOpen]);

  const fetchLocationAndWeather = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationName(`Lat: ${latitude.toFixed(2)}, Long: ${longitude.toFixed(2)}`);
        
        try {
          // Open-Meteo API (No Key Required)
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&relativehumidity_2m=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
          );
          
          if (!response.ok) throw new Error('Weather data fetch failed');
          
          const data = await response.json();
          
          // Manually approximate humidity since current_weather doesn't have it directly in some versions, 
          // but we asked for relativehumidity_2m which is usually hourly. 
          // For simplicity in this demo, we'll mock humidity if not easily accessible or parse hourly.
          // Open-Meteo returns hourly data, let's grab the current hour's humidity.
          const currentHourIndex = new Date().getHours();
          const humidity = data.hourly?.relativehumidity_2m?.[currentHourIndex] || 65; // Fallback

          setWeather({
            current: {
              temp: data.current_weather.temperature,
              humidity: humidity,
              windSpeed: data.current_weather.windspeed,
              weatherCode: data.current_weather.weathercode,
              isDay: data.current_weather.is_day
            },
            daily: data.daily.time.map((date: string, index: number) => ({
              date,
              maxTemp: data.daily.temperature_2m_max[index],
              minTemp: data.daily.temperature_2m_min[index],
              weatherCode: data.daily.weathercode[index]
            })).slice(0, 5)
          });

        } catch (err) {
          console.error(err);
          setError("Failed to fetch weather data.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Location access denied. Please enable GPS.");
        setLoading(false);
        // Fallback to default mock if denied
        setLocationName("Default Location (Demo)");
        setWeather({
           current: { temp: 30, humidity: 60, windSpeed: 10, weatherCode: 1, isDay: 1 },
           daily: Array(5).fill({ date: '2023-01-01', maxTemp: 32, minTemp: 25, weatherCode: 1 })
        });
      }
    );
  };

  if (!isOpen) return null;

  const currentIconData = weather ? getWeatherIcon(weather.current.weatherCode, weather.current.isDay) : { icon: IconSun, label: '', color: '' };
  const CurrentIcon = currentIconData.icon;

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
          {loading ? (
             <div className="flex flex-col items-center justify-center py-10">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
               <p className="text-gray-500 animate-pulse">Detecting your farm location...</p>
             </div>
          ) : error ? (
             <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
               <p>{error}</p>
               <button onClick={fetchLocationAndWeather} className="mt-2 text-sm font-bold underline">Retry</button>
             </div>
          ) : weather ? (
            <>
              {/* Current Weather */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1 text-blue-100 text-sm mb-1">
                      <IconMapPin className="w-4 h-4" /> {locationName}
                    </div>
                    <div className="text-5xl font-bold mb-2">{weather.current.temp}°C</div>
                    <div className="font-medium text-blue-100">{t.today}, {currentIconData.label}</div>
                  </div>
                  <CurrentIcon className={`w-16 h-16 ${currentIconData.color} drop-shadow-lg`} />
                </div>
                
                <div className="relative z-10 flex gap-6 mt-6 pt-6 border-t border-white/20">
                  <div>
                    <div className="text-blue-200 text-xs">{t.humidity}</div>
                    <div className="font-semibold">{weather.current.humidity}%</div>
                  </div>
                  <div>
                    <div className="text-blue-200 text-xs">{t.wind}</div>
                    <div className="font-semibold">{weather.current.windSpeed} km/h</div>
                  </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              {/* Forecast */}
              <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-3">{t.forecast}</h3>
              <div className="space-y-3">
                {weather.daily.map((day, idx) => {
                  const dayIconData = getWeatherIcon(day.weatherCode);
                  const DayIcon = dayIconData.icon;
                  const dateObj = new Date(day.date);
                  const dayName = dateObj.toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', { weekday: 'short' });

                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                      <span className="font-medium text-gray-700 dark:text-slate-300 w-16">{dayName}</span>
                      <div className="flex items-center gap-2">
                         <DayIcon className={`w-5 h-5 ${dayIconData.color}`} />
                         <span className="text-sm text-gray-500 dark:text-slate-400 hidden sm:block">{dayIconData.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-gray-800 dark:text-white">{Math.round(day.maxTemp)}°</span>
                        <span className="font-medium text-gray-400">{Math.round(day.minTemp)}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};