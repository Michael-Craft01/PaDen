import { Link } from 'react-router-dom';
import { PublicLayout } from '../layout/PublicLayout';
import { Building2, ShieldCheck, Users, ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function Home() {
    return (
        <PublicLayout>
            {/* ═══ HERO ═══ */}
            <div className="relative bg-black overflow-hidden">
                {/* Animated background orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-15%] left-[-8%] w-[45%] h-[45%] rounded-full bg-purple-800/20 blur-[140px] animate-[float-slow_25s_ease-in-out_infinite]" />
                    <div className="absolute bottom-[-15%] right-[-8%] w-[40%] h-[40%] rounded-full bg-violet-800/15 blur-[120px] animate-[float-slow_30s_ease-in-out_infinite_reverse]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-purple-600/5 blur-[100px] animate-[float_20s_ease-in-out_infinite]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-40">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{
                            background: 'rgba(88, 28, 135, 0.15)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            backdropFilter: 'blur(12px)',
                        }}>
                            <Sparkles size={14} className="text-purple-400" />
                            <span className="text-xs font-semibold text-purple-300 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                AI-Powered Property Management
                            </span>
                        </div>

                        <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl mb-7 leading-[1.1]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            <span className="block">Find the perfect tenant</span>
                            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500">
                                via WhatsApp
                            </span>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-base text-zinc-400 sm:text-lg md:text-xl leading-relaxed">
                            Homify connects you directly with verified students and professionals
                            looking for accommodation. Classic reliability, modern technology.
                        </p>
                        <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center gap-4">
                            <Link
                                to="/login"
                                className="flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 md:py-4 md:text-lg md:px-10 transition-all shadow-xl shadow-purple-900/30 hover:shadow-purple-800/50 hover:-translate-y-0.5 group"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                Get Started
                                <ArrowRight className="ml-2 -mr-1 group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <a
                                href="#features"
                                className="flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-xl text-gray-300 md:py-4 md:text-lg md:px-10 transition-all hover:text-white mt-4 sm:mt-0"
                                style={{
                                    background: 'rgba(24, 24, 27, 0.5)',
                                    border: '1px solid rgba(63, 63, 70, 0.4)',
                                    backdropFilter: 'blur(16px)',
                                    fontFamily: "'Outfit', sans-serif",
                                }}
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ FEATURES ═══ */}
            <div id="features" className="py-28 bg-zinc-950 relative">
                {/* Subtle background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/15 mb-5">
                            <Zap size={12} className="text-purple-400" />
                            <span className="text-[11px] font-semibold text-purple-400 tracking-wider uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>Features</span>
                        </div>
                        <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Modern solutions for classic problems
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Users,
                                title: 'Direct Connection',
                                desc: 'Connect directly with potential tenants on WhatsApp. No middlemen, no delays.',
                            },
                            {
                                icon: ShieldCheck,
                                title: 'Verified Listings',
                                desc: 'Build trust with a verified badge. Tenants prefer safe, verified landlords.',
                            },
                            {
                                icon: Building2,
                                title: 'Easy Management',
                                desc: 'Update availability, prices, and photos instantly from your modern dashboard.',
                            },
                        ].map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={i}
                                    className="group p-8 rounded-2xl hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10"
                                    style={{
                                        background: 'rgba(24, 24, 27, 0.5)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(63, 63, 70, 0.3)',
                                    }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/15 to-violet-500/10 border border-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed text-[15px]">
                                        {feature.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
