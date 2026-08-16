import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import api from '../utils/api';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if already logged in
    useEffect(() => {
        if (localStorage.getItem('bank_token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const response = await api.post('/login', {
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('bank_token', response.data.data.token);
                navigate('/dashboard');
            } else {
                const response = await api.post('/register', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                // Auto login after register (optional, or just switch to login view)
                setIsLogin(true);
                setFormData({ ...formData, password: '' }); // clear password
                alert('Account created successfully! Please sign in.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-brand text-white rounded-sm flex items-center justify-center mb-4">
                        {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
                    </div>
                    <h1 className="text-2xl font-bold text-brand-dark">
                        {isLogin ? 'Welcome Back' : 'Create an Account'}
                    </h1>
                    <p className="text-sm text-brand-light mt-2 text-center">
                        {isLogin ? 'Enter your details to access your account' : 'Sign up to start managing your finances'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded border border-rose-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-brand-dark mb-1">Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                required 
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input-field" 
                                placeholder="John Doe" 
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-brand-dark mb-1">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            required 
                            value={formData.email}
                            onChange={handleInputChange}
                            className="input-field" 
                            placeholder="john@example.com" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-dark mb-1">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            required 
                            value={formData.password}
                            onChange={handleInputChange}
                            className="input-field" 
                            placeholder="••••••••" 
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-primary w-full mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-sm text-brand font-medium hover:underline focus:outline-none"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;