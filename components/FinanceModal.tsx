import React, { useState, useEffect } from 'react';
import { 
  IconX, 
  IconWallet, 
  IconTrendingUp, 
  IconTrendingDown, 
  IconPlus, 
  IconCalculator, 
  IconPieChart, 
  IconPercent 
} from './Icons';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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

interface Loan {
    id: number;
    amount: number;
    interest: number;
    tenure: number; // years
    emi: number;
    date: string;
}

export const FinanceModal: React.FC<FinanceModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'transactions' | 'loans' | 'analytics'>('transactions');
  
  // Transaction State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('crop_gpt_finance_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');

  // Loan State
  const [loans, setLoans] = useState<Loan[]>(() => {
      const saved = localStorage.getItem('crop_gpt_loans');
      return saved ? JSON.parse(saved) : [];
  });
  const [loanAmount, setLoanAmount] = useState('');
  const [loanInterest, setLoanInterest] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [calculatedEMI, setCalculatedEMI] = useState<null | { emi: number, totalInterest: number, totalPayment: number }>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('crop_gpt_finance_data', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('crop_gpt_loans', JSON.stringify(loans));
  }, [loans]);

  if (!isOpen) return null;

  // Transaction Logic
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAddTransaction = () => {
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

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Loan Logic
  const calculateEMI = () => {
      const P = parseFloat(loanAmount);
      const r = parseFloat(loanInterest) / 12 / 100;
      const n = parseFloat(loanTenure) * 12;

      if (!P || !r || !n) return;

      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - P;

      setCalculatedEMI({
          emi: Math.round(emi),
          totalInterest: Math.round(totalInterest),
          totalPayment: Math.round(totalPayment)
      });
  };

  const saveLoan = () => {
      if (!calculatedEMI || !loanAmount) return;
      const newLoan: Loan = {
          id: Date.now(),
          amount: parseFloat(loanAmount),
          interest: parseFloat(loanInterest),
          tenure: parseFloat(loanTenure),
          emi: calculatedEMI.emi,
          date: new Date().toISOString().split('T')[0]
      };
      setLoans([newLoan, ...loans]);
      setLoanAmount('');
      setLoanInterest('');
      setLoanTenure('');
      setCalculatedEMI(null);
  };

  const deleteLoan = (id: number) => {
      setLoans(loans.filter(l => l.id !== id));
  };

  // Analytics Data
  const pieData = [
    { name: t.income, value: totalIncome, color: '#22c55e' },
    { name: t.expense, value: totalExpense, color: '#ef4444' }
  ].filter(d => d.value > 0);

  const totalMonthlyEMI = loans.reduce((acc, curr) => acc + curr.emi, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800 bg-green-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
             <IconWallet className="w-6 h-6" />
             <h2 className="text-xl font-bold">{t.finance}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 transition-colors">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button 
                onClick={() => setActiveTab('transactions')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 
                ${activeTab === 'transactions' 
                    ? 'border-green-600 text-green-600 bg-green-50/50 dark:bg-slate-800' 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
            >
                <IconWallet className="w-4 h-4" /> {t.transactions}
            </button>
            <button 
                onClick={() => setActiveTab('loans')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 
                ${activeTab === 'loans' 
                    ? 'border-green-600 text-green-600 bg-green-50/50 dark:bg-slate-800' 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
            >
                <IconCalculator className="w-4 h-4" /> {t.loansAndEmi}
            </button>
            <button 
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 
                ${activeTab === 'analytics' 
                    ? 'border-green-600 text-green-600 bg-green-50/50 dark:bg-slate-800' 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
            >
                <IconPieChart className="w-4 h-4" /> {t.analytics}
            </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50 dark:bg-slate-950">
          
          {/* TAB 1: TRANSACTIONS */}
          {activeTab === 'transactions' && (
              <div className="space-y-6">
                 {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-green-100 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-green-600 dark:text-green-400 uppercase font-bold mb-1">{t.income}</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">₹{totalIncome}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-red-100 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-red-600 dark:text-red-400 uppercase font-bold mb-1">{t.expense}</p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-300">₹{totalExpense}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold mb-1">{t.balance}</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300">₹{balance}</p>
                    </div>
                </div>

                {/* Add Transaction */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">{t.addTransaction}</h3>
                    <div className="flex flex-col md:flex-row gap-3">
                    <input 
                        type="text" 
                        placeholder={t.description} 
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                    />
                    <input 
                        type="number" 
                        placeholder={t.amount}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full md:w-32 p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                    />
                    <select 
                        value={type}
                        onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                        className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                    >
                        <option value="income">{t.income}</option>
                        <option value="expense">{t.expense}</option>
                    </select>
                    <button 
                        onClick={handleAddTransaction}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 shadow-sm"
                    >
                        <IconPlus className="w-4 h-4" /> {t.add}
                    </button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {transactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                            No transactions yet. Add your first income or expense above.
                        </div>
                    ) : (
                        transactions.map(tx => (
                        <div key={tx.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-lg group hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {tx.type === 'income' ? <IconTrendingUp className="w-4 h-4" /> : <IconTrendingDown className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-slate-200">{tx.desc}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                            </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.type === 'income' ? '+' : '-'} ₹{tx.amount}
                                </span>
                                <button 
                                    onClick={() => handleDeleteTransaction(tx.id)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <IconX className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        ))
                    )}
                </div>
              </div>
          )}

          {/* TAB 2: LOANS AND EMI */}
          {activeTab === 'loans' && (
              <div className="space-y-6">
                  {/* Alert Section */}
                  <div className={`p-4 rounded-xl border flex justify-between items-center shadow-sm ${totalMonthlyEMI > (totalIncome / 2) ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-slate-700'}`}>
                      <div>
                          <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{t.totalEMIAlert}</p>
                          <p className="text-2xl font-bold text-gray-800 dark:text-white">₹{totalMonthlyEMI}</p>
                      </div>
                      {totalMonthlyEMI > (totalIncome / 2) && (
                          <div className="text-red-600 dark:text-red-400 flex items-center gap-1 font-bold text-sm bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-sm">
                              ! {t.highEmiWarning}
                          </div>
                      )}
                  </div>

                  {/* Calculator Form */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                          <IconCalculator className="w-4 h-4" /> {t.calculateEMI}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                              <label className="text-xs text-gray-500 mb-1 block">{t.loanAmount}</label>
                              <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 dark:text-white" />
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 mb-1 block">{t.interestRate}</label>
                              <div className="relative">
                                <input type="number" value={loanInterest} onChange={e => setLoanInterest(e.target.value)} className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 dark:text-white" />
                                <IconPercent className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                              </div>
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 mb-1 block">{t.tenureYears}</label>
                              <input type="number" value={loanTenure} onChange={e => setLoanTenure(e.target.value)} className="w-full p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 dark:text-white" />
                          </div>
                      </div>
                      
                      <button onClick={calculateEMI} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors shadow-sm mb-4">
                          {t.calculateEMI}
                      </button>

                      {/* Result Box */}
                      {calculatedEMI && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
                              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                                  <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.monthlyEMI}</p>
                                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">₹{calculatedEMI.emi}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.totalInterest}</p>
                                      <p className="text-lg font-bold text-gray-700 dark:text-gray-200">₹{calculatedEMI.totalInterest}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.totalPayment}</p>
                                      <p className="text-lg font-bold text-gray-700 dark:text-gray-200">₹{calculatedEMI.totalPayment}</p>
                                  </div>
                              </div>
                              <button onClick={saveLoan} className="w-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700">
                                  {t.saveLoan}
                              </button>
                          </div>
                      )}
                  </div>

                  {/* Active Loans List */}
                  <div>
                      <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-3">{t.activeLoans}</h3>
                      <div className="space-y-3">
                          {loans.length === 0 ? (
                               <div className="text-center py-4 text-gray-500 dark:text-gray-400 italic text-sm">
                                   No active loans.
                               </div>
                          ) : (
                              loans.map(loan => (
                                  <div key={loan.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex justify-between items-center group">
                                      <div>
                                          <p className="font-bold text-gray-800 dark:text-white">Loan: ₹{loan.amount}</p>
                                          <p className="text-xs text-gray-500">EMI: <span className="font-semibold text-red-500">₹{loan.emi}</span> | {loan.interest}% | {loan.tenure} Years</p>
                                      </div>
                                      <button onClick={() => deleteLoan(loan.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <IconX className="w-5 h-5" />
                                      </button>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && (
              <div className="space-y-6">
                  {/* Profit/Loss Badge */}
                  <div className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm ${balance >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      <p className={`text-sm font-bold uppercase tracking-widest ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {balance >= 0 ? t.netProfit : t.netLoss}
                      </p>
                      <p className={`text-4xl font-extrabold mt-2 ${balance >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                          ₹{Math.abs(balance)}
                      </p>
                  </div>

                  {/* Chart */}
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">{t.profitLossTracker}</h3>
                      <div className="h-64 w-full">
                          {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => `₹${value}`}
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                          ) : (
                              <div className="flex h-full items-center justify-center text-gray-400 text-sm italic">
                                  Not enough data to display chart.
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};
