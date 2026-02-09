import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'signin' | 'signup' | 'google'>('signin');
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'google') {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        queryParams: {
                            access_type: 'offline',
                            prompt: 'consent',
                        },
                        redirectTo: `${window.location.origin}/dashboard`
                    }
                });
                if (error) throw error;
            } else if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Landlord Portal
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Sign in to manage your properties.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <button
                            type="button"
                            onClick={() => { setMode('google'); handleAuth({ preventDefault: () => { } } as any); }}
                            className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">Or with email</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            {mode === 'signin' ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
