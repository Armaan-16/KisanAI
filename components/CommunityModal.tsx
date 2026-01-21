import React from 'react';
import { IconX, IconUsers, IconMessageSquare, IconThumbsUp, IconUser } from './Icons';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const posts = [
  { id: 1, user: "Ramesh Kumar", time: "2h ago", content: "Used neem oil for pest control on cotton. Results are great!", likes: 24, comments: 5 },
  { id: 2, user: "Sita Devi", time: "5h ago", content: "Looking for best market price for Tomatoes in Cuttack district. Any leads?", likes: 12, comments: 8 },
  { id: 3, user: "Bijay Singh", time: "1d ago", content: "Heavy rains expected in Bargarh next week. Prepare drainage!", likes: 56, comments: 12 },
];

export const CommunityModal: React.FC<CommunityModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
             <IconUsers className="w-6 h-6" />
             <h2 className="text-xl font-bold">{t.community}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50 dark:bg-slate-950">
          
          {/* Create Post */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm mb-6 border border-gray-100 dark:border-slate-800">
            <div className="flex gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full h-fit">
                <IconUser className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <textarea 
                placeholder={t.createPost}
                className="w-full bg-gray-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white resize-none h-20"
              />
            </div>
            <div className="flex justify-end mt-2">
              <button className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-700">
                {t.post}
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                      <span className="font-bold text-xs text-gray-600 dark:text-gray-300">{post.user.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white">{post.user}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{post.time}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-6 pt-3 border-t border-gray-50 dark:border-slate-800">
                  <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors text-sm">
                    <IconThumbsUp className="w-4 h-4" /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors text-sm">
                    <IconMessageSquare className="w-4 h-4" /> {post.comments}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};