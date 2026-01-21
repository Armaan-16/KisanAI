import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { User, Language } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedUser = localStorage.getItem('crop_gpt_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const storedTheme = localStorage.getItem('crop_gpt_theme');
    if (storedTheme) {
      setDarkMode(storedTheme === 'dark');
    }

    const storedLang = localStorage.getItem('crop_gpt_lang') as Language;
    if (storedLang) {
      setLanguage(storedLang);
    }

    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('crop_gpt_theme', newMode ? 'dark' : 'light');
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('crop_gpt_lang', lang);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('crop_gpt_current_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('crop_gpt_current_user');
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen text-gray-900 dark:text-slate-100 bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] dark:bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : !user ? (
          <Auth 
            onLogin={handleLogin} 
            language={language}
            setLanguage={changeLanguage}
          />
        ) : (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            isDark={darkMode} 
            toggleTheme={toggleTheme}
            language={language}
            setLanguage={changeLanguage}
          />
        )}
      </div>
    </div>
  );
}
