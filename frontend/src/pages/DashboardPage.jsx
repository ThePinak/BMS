import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, LogOut, Send, Building2, Clock } from 'lucide-react';
import api from '../utils/api';

function DashboardPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('deposit');
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    
    const [actionAmount, setActionAmount] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('bank_token');
        if (!token) {
            navigate('/auth');
            return;
        }
        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [meRes, txnRes] = await Promise.all([
                api.get('/me'),
                api.get('/transactions')
            ]);
            setUser(meRes.data.data);
            setTransactions(txnRes.data.data);
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout(); // Token expired
            } else {
                console.error("Failed to load dashboard data", err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('bank_token');
        navigate('/auth');
    };

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setActionLoading(true);

        try {
            const amount = parseFloat(actionAmount);
            if (activeTab === 'deposit') {
                await api.post('/deposit', { amount });
                setSuccess(`Successfully deposited $${amount.toFixed(2)}`);
            } else if (activeTab === 'withdraw') {
                await api.post('/withdraw', { amount });
                setSuccess(`Successfully withdrew $${amount.toFixed(2)}`);
            } else if (activeTab === 'transfer') {
                await api.post('/transfer', { toAccountId: recipientId, amount });
                setSuccess(`Successfully transferred $${amount.toFixed(2)}`);
            }
            
            // Reset form
            setActionAmount('');
            setRecipientId('');
            
            // Refresh data to show new balance and history
            await fetchDashboardData();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed. Please check your inputs.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-brand-dark">Loading your dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-surface-alt">
            {/* Header */}
            <header className="bg-surface border-b border-surface-border sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-brand-dark font-bold text-lg">
                        <Building2 className="text-brand" />
                        <span>BankSystem</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-brand-dark hidden sm:block">Hello, {user?.name}</span>
                        <button onClick={handleLogout} className="text-brand-light hover:text-brand-dark transition-colors" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column: Balance & Actions */}
                <div className="md:col-span-1 space-y-6">
                    {/* Balance Card */}
                    <div className="card bg-brand text-white border-none shadow-lg">
                        <h2 className="text-brand-light text-sm font-medium mb-1 uppercase tracking-wider">Current Balance</h2>
                        <div className="text-4xl font-bold mb-4">${parseFloat(user?.balance || 0).toFixed(2)}</div>
                        <div className="text-xs text-brand-light flex items-center justify-between gap-1">
                            <span className="flex items-center gap-1"><Clock size={12} /> Updated just now</span>
                            <span className="truncate w-24 text-right opacity-50" title="Account ID">ID: {user?.id.substring(0,8)}</span>
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="card">
                        <div className="flex border-b border-surface-border mb-4">
                            <button 
                                onClick={() => { setActiveTab('deposit'); setError(''); setSuccess(''); }}
                                className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'deposit' ? 'border-brand text-brand' : 'border-transparent text-brand-light hover:text-brand-dark'}`}
                            >
                                Deposit
                            </button>
                            <button 
                                onClick={() => { setActiveTab('withdraw'); setError(''); setSuccess(''); }}
                                className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'withdraw' ? 'border-brand text-brand' : 'border-transparent text-brand-light hover:text-brand-dark'}`}
                            >
                                Withdraw
                            </button>
                            <button 
                                onClick={() => { setActiveTab('transfer'); setError(''); setSuccess(''); }}
                                className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'transfer' ? 'border-brand text-brand' : 'border-transparent text-brand-light hover:text-brand-dark'}`}
                            >
                                Transfer
                            </button>
                        </div>

                        {error && <div className="mb-4 text-xs p-2 bg-rose-50 text-rose-600 rounded">{error}</div>}
                        {success && <div className="mb-4 text-xs p-2 bg-emerald-50 text-emerald-600 rounded">{success}</div>}

                        <form onSubmit={handleActionSubmit} className="space-y-4">
                            {activeTab === 'transfer' && (
                                <div>
                                    <label className="block text-xs font-medium text-brand-dark mb-1">Recipient Account ID</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={recipientId}
                                        onChange={(e) => setRecipientId(e.target.value)}
                                        className="input-field py-1.5 text-sm" 
                                        placeholder="e.g. 123e4567-e89b..." 
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-medium text-brand-dark mb-1">Amount ($)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    min="0.01" 
                                    required 
                                    value={actionAmount}
                                    onChange={(e) => setActionAmount(e.target.value)}
                                    className="input-field py-1.5 text-sm" 
                                    placeholder="0.00" 
                                />
                            </div>
                            <button disabled={actionLoading} type="submit" className="btn-primary w-full text-sm py-1.5 flex items-center justify-center gap-2 disabled:opacity-70">
                                {actionLoading ? 'Processing...' : (
                                    <>
                                        {activeTab === 'deposit' && <><ArrowDownLeft size={16} /> Process Deposit</>}
                                        {activeTab === 'withdraw' && <><ArrowUpRight size={16} /> Process Withdrawal</>}
                                        {activeTab === 'transfer' && <><Send size={16} /> Send Money</>}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Transaction History */}
                <div className="md:col-span-2">
                    <div className="card h-full min-h-[400px]">
                        <h3 className="text-lg font-semibold text-brand-dark mb-4 pb-2 border-b border-surface-border flex items-center justify-between">
                            Recent Transactions
                            <span className="text-xs font-normal text-brand-light bg-surface-alt px-2 py-1 rounded">{transactions.length} total</span>
                        </h3>
                        
                        <div className="space-y-3">
                            {transactions.length === 0 ? (
                                <div className="text-center text-brand-light py-8">No recent transactions found.</div>
                            ) : (
                                transactions.map((txn) => {
                                    const isPositive = txn.type === 'DEPOSIT' || txn.type === 'TRANSFER_RECEIVED';
                                    return (
                                        <div key={txn.id} className="flex items-center justify-between p-3 hover:bg-surface-alt rounded-sm transition-colors border border-transparent hover:border-surface-border">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPositive ? 'bg-emerald-100 text-brand-accent' : 'bg-rose-100 text-rose-600'}`}>
                                                    {isPositive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-brand-dark">
                                                        {txn.type.replace('_', ' ')}
                                                    </p>
                                                    <p className="text-xs text-brand-light">
                                                        {new Date(txn.createdAt).toLocaleDateString()} at {new Date(txn.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`text-sm font-semibold ${isPositive ? 'text-brand-accent' : 'text-brand-dark'}`}>
                                                {isPositive ? '+' : '-'}${parseFloat(txn.amount).toFixed(2)}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default DashboardPage;
