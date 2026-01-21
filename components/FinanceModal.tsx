import React, { useState } from 'react';
import { IconX, IconWallet, IconTrendingUp, IconTrendingDown, IconPlus } from './Icons';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface Transaction {
  id: number;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export const FinanceModal: React.FC<FinanceModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, desc: 'Sold Paddy', amount: 25000, type: 'income', date: '2023-10-15' },
    { id: 2, desc: 'Bought Fertilizers', amount: 4500, type: 'expense', date: '2023-10-18' },
  ]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');

  if (!isOpen) return null;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAdd = () => {
    if (!desc || !amount) return;
    const newTx: Transaction = {
      id: Date.now(),
      desc,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions([newTx, ...transactions]);
    setDesc('');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
             <IconWallet className="w-6 h-6" />
             <h2 className="text-xl font-bold">{t.finance}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
              <p className="text-xs text-green-600 dark:text-green-400 uppercase font-bold mb-1">{t.income}</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">₹{totalIncome}</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
              <p className="text-xs text-red-600 dark:text-red-400 uppercase font-bold mb-1">{t.expense}</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">₹{totalExpense}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold mb-1">{t.balance}</p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">₹{balance}</p>
            </div>
          </div>

          {/* Add Transaction */}
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl mb-6">
             <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">{t.addTransaction}</h3>
             <div className="flex flex-col md:flex-row gap-3">
               <input 
                 type="text" 
                 placeholder={t.description} 
                 value={desc}
                 onChange={(e) => setDesc(e.target.value)}
                 className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
               />
               <input 
                 type="number" 
                 placeholder={t.amount}
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 className="w-full md:w-32 p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
               />
               <select 
                 value={type}
                 onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                 className="p-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
               >
                 <option value="income">{t.income}</option>
                 <option value="expense">{t.expense}</option>
               </select>
               <button 
                 onClick={handleAdd}
                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
               >
                 <IconPlus className="w-4 h-4" /> {t.add}
               </button>
             </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-slate-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'income' ? <IconTrendingUp className="w-4 h-4" /> : <IconTrendingDown className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-slate-200">{tx.desc}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'} ₹{tx.amount}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};