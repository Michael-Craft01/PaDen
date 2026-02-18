import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Mail, Lock, Loader2, Play } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
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
        } catch (err: any) {
            toastError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                success('Account created! Check your email to confirm.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                success('Welcome back!');
                navigate('/dashboard');
            }
        } catch (err: any) {
            toastError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex text-white font-sans">
            {/* ─── Left Side: Visual ─── */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-zinc-900">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                    alt="Luxury Interior"
                    className="absolute inset-0 w-full h-full object-cover animate-pan-slow"
                />

                <div className="relative z-20 h-full flex flex-col justify-end p-12">
                    <div className="mb-8 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl max-w-md animate-fade-in-up">
                        <div className="flex text-yellow-400 mb-2">
                            {[1, 2, 3, 4, 5].map(i => <Play key={i} size={12} fill="currentColor" className="rotate-[-90deg]" />)}
                        </div>
                        <p className="text-lg font-medium leading-relaxed text-zinc-100 italic">
                            "PaDen transformed how we manage our properties. The AI features save us hours every week."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-300">
                                JD
                            </div>
                            <div>
                                <p className="text-sm font-semibold">James Dawson</p>
                                <p className="text-xs text-zinc-400">Property Manager, Harare</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Right Side: Form ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Background Blobs */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-violet-900/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">
                    {/* Header */}
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors text-sm">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                        <h2 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400"
                            style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {mode === 'signin' ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-zinc-400">
                            {mode === 'signin' ? 'Enter your details to access your dashboard.' : 'Start managing your properties smarter today.'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAuth} className="space-y-6">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full py-3 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-zinc-800"></div>
                            <span className="flex-shrink mx-4 text-zinc-600 text-xs font-medium uppercase tracking-wider">Or {mode === 'signin' ? 'sign in' : 'sign up'} with email</span>
                            <div className="flex-grow border-t border-zinc-800"></div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-500">
                        {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-purple-400 font-medium hover:text-purple-300 hover:underline transition-colors"
                        >
                            {mode === 'signin' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
