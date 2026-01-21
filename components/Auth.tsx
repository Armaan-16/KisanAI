import React, { useState } from 'react';
import { IconLeaf, IconUser, IconPhone, IconLock } from './Icons';
import { User, Language } from '../types';
import { translations } from '../utils/translations';

interface AuthProps {
  onLogin: (user: User) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, language, setLanguage }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const t = translations[language];

  const validate = () => {
    if (!phone.trim()) {
      setError(t.errorPhone);
      return false;
    }
    if (!isLogin && !name.trim()) {
      setError(t.errorName);
      return false;
    }
    if (!password) {
      setError(t.errorPassword);
      return false;
    }
    if (!/^\d+$/.test(password)) {
      setError(t.errorNumeric);
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('crop_gpt_users') || '[]');
      const user = users.find((u: any) => u.phoneNumber === phone && u.password === password);
      
      if (user) {
        onLogin({ name: user.name, phoneNumber: user.phoneNumber });
      } else {
        setError(t.errorLogin);
      }
    } else {
      const users = JSON.parse(localStorage.getItem('crop_gpt_users') || '[]');
      if (users.find((u: any) => u.phoneNumber === phone)) {
        setError(t.errorExists);
        return;
      }
      
      const newUser = { name, phoneNumber: phone, password };
      users.push(newUser);
      localStorage.setItem('crop_gpt_users', JSON.stringify(users));
      
      onLogin({ name, phoneNumber: phone });
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300 relative">
      
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-white dark:bg-slate-800 border border-green-200 dark:border-slate-700 rounded-lg px-3 py-1 text-sm font-medium text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="or">ଓଡ଼ିଆ (Odia)</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-green-100 dark:border-slate-800 transition-colors duration-300">
        <div className="bg-green-600 p-8 text-center">
          <div className="bg-white/20 p-3 rounded-full inline-block mb-4 backdrop-blur-sm">
            <IconLeaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.appTitle}</h1>
          <p className="text-green-100">{t.tagline}</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            {isLogin ? t.welcomeBack : t.createAccount}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded-lg border border-red-100 dark:border-red-900 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t.fullName}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-700"
                    placeholder={t.fullName}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t.phone}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconPhone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-700"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{t.password}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                     if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                         setPassword(e.target.value);
                     }
                  }}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-700"
                  placeholder="123456"
                  inputMode="numeric"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">{t.passwordHint}</p>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-green-200 dark:shadow-none mt-2"
            >
              {isLogin ? t.login : t.signup}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? t.noAccount : t.hasAccount}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setPassword('');
                }}
                className="ml-2 text-green-600 dark:text-green-400 font-semibold hover:underline"
              >
                {isLogin ? t.signup : t.login}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};