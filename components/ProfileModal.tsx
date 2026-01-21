import React, { useEffect, useState } from 'react';
import { IconX, IconUser, IconPhone, IconLock } from './Icons';
import { User, Language } from '../types';
import { translations } from '../utils/translations';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  language: Language;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, language }) => {
  const t = translations[language];
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
        const users = JSON.parse(localStorage.getItem('crop_gpt_users') || '[]');
        const currentUser = users.find((u: any) => u.phoneNumber === user.phoneNumber);
        if (currentUser) {
            setPassword(currentUser.password);
        }
    }
  }, [isOpen, user.phoneNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t.profileDetails}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400">
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                    <IconUser className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{t.fullName}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                    <IconPhone className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{t.phone}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{user.phoneNumber}</p>
                </div>
            </div>
             <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                    <IconLock className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{t.password}</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{password || '******'}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};