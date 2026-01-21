import React, { useState, useEffect } from 'react';
import { IconX, IconUsers, IconMessageSquare, IconThumbsUp, IconUser, IconSend } from './Icons';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface Comment {
  id: number;
  user: string;
  text: string;
  time: string;
}

interface Post {
  id: number;
  user: string;
  time: string;
  content: string;
  likes: number;
  comments: Comment[];
}

const defaultPosts: Post[] = [
  { 
    id: 1, 
    user: "Ramesh Kumar", 
    time: "2h ago", 
    content: "Used neem oil for pest control on cotton. Results are great!", 
    likes: 24, 
    comments: [
      { id: 101, user: "Suresh", text: "Very helpful advice, thanks!", time: "1h ago" }
    ] 
  },
  { 
    id: 2, 
    user: "Sita Devi", 
    time: "5h ago", 
    content: "Looking for best market price for Tomatoes in Cuttack district. Any leads?", 
    likes: 12, 
    comments: [] 
  },
  { 
    id: 3, 
    user: "Bijay Singh", 
    time: "1d ago", 
    content: "Heavy rains expected in Bargarh next week. Prepare drainage!", 
    likes: 56, 
    comments: [
      { id: 301, user: "Anil", text: "Thanks for the warning.", time: "5h ago" },
      { id: 302, user: "Ravi", text: "Will clear the channels today.", time: "2h ago" }
    ] 
  },
];

export const CommunityModal: React.FC<CommunityModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('crop_gpt_posts');
    return saved ? JSON.parse(saved) : defaultPosts;
  });
  
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});

  // Get current user name from local storage or default
  const [currentUserName, setCurrentUserName] = useState("Farmer");

  useEffect(() => {
    const userStr = localStorage.getItem('crop_gpt_current_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserName(user.name);
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('crop_gpt_posts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now(),
      user: currentUserName,
      time: "Just now",
      content: newPostContent,
      likes: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleCommentChange = (postId: number, text: string) => {
    setCommentInputs({ ...commentInputs, [postId]: text });
  };

  const handleAddComment = (postId: number) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              user: currentUserName,
              text: text,
              time: "Just now"
            }
          ]
        };
      }
      return post;
    }));

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

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
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={t.createPost}
                className="w-full bg-gray-50 dark:bg-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white resize-none h-20"
              />
            </div>
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.post}
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span className="font-bold text-xs text-purple-600 dark:text-purple-300">{post.user.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white">{post.user}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{post.time}</p>
                    </div>
                  </div>
                </div>
                
                {/* Post Content */}
                <p className="text-gray-700 dark:text-slate-300 text-sm mb-4 leading-relaxed">{post.content}</p>
                
                {/* Actions */}
                <div className="flex items-center gap-6 pt-3 border-t border-gray-50 dark:border-slate-800 mb-3">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-purple-500 transition-colors text-sm group"
                  >
                    <IconThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                    <span>{post.likes} {t.like}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                    <IconMessageSquare className="w-4 h-4" /> 
                    <span>{post.comments.length} {t.comments}</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="bg-gray-50 dark:bg-slate-950/50 rounded-lg p-3">
                  {/* Existing Comments */}
                  {post.comments.length > 0 && (
                    <div className="space-y-3 mb-3">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                            {comment.user.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg rounded-tl-none border border-gray-100 dark:border-slate-700">
                              <div className="flex justify-between items-baseline mb-1">
                                <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{comment.user}</span>
                                <span className="text-[10px] text-gray-400">{comment.time}</span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-slate-400">{comment.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder={t.writeComment}
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 dark:text-white"
                    />
                    <button 
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                      className="p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconSend className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
