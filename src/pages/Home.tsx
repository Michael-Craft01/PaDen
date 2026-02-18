import { Link } from 'react-router-dom';
import { PublicLayout } from '../layout/PublicLayout';
import { ShieldCheck, ArrowRight, Sparkles, Zap, MessageCircle } from 'lucide-react';

export default function Home() {
    return (
        <PublicLayout>
            {/* ═══ HERO SECTION ═══ */}
            <div className="relative bg-zinc-950 overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
                {/* Background gradients */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-900/10 blur-[100px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Text Content */}
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    #1 Rental Assistant in Zimbabwe
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Find your home <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
                                    simply by chatting.
                                </span>
                            </h1>

                            <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-lg">
                                No more endless scrolling. Just tell Homify via WhatsApp what you're looking for, and our AI will find the perfect match for you instantly.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/properties"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-900/25 hover:shadow-purple-700/40 hover:-translate-y-0.5"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    Browse Properties
                                    <ArrowRight className="ml-2" size={20} />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-2xl text-zinc-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all backdrop-blur-sm"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    How it Works
                                </a>
                            </div>

                            {/* Social Proof */}
                            <div className="mt-10 flex items-center gap-4 text-sm text-zinc-500">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover opacity-80" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <span className="text-purple-400 font-bold block">1,200+</span>
                                    Happy tenants
                                </div>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative hidden lg:block">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-violet-600/20 rounded-[32px] blur-2xl transform rotate-3 scale-105" />
                            <div className="relative rounded-[32px] overflow-hidden border border-white/[0.08] shadow-2xl shadow-purple-900/20 aspect-[4/5]">
                                <img
                                    src="https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1600&auto=format&fit=crop"
                                    alt="Happy Black couple looking at phone in modern apartment"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                                {/* Floating Badge */}
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                        <MessageCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">New Match Found!</p>
                                        <p className="text-zinc-400 text-xs">2 bedroom apartment in Avondale</p>
                                    </div>
                                    <div className="ml-auto px-3 py-1 rounded-full bg-white/10 text-xs text-white">
                                        Just now
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ HOW IT WORKS ═══ */}
            <div id="how-it-works" className="py-24 bg-black relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Renting made as easy as sending a text
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            We've integrated the entire rental process into WhatsApp so you can find your next home without leaving your favorite app.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="relative group">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/[0.08] relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <img
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                                    alt="Chatting on phone"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white mb-2 shadow-lg shadow-purple-900/50">
                                        <span className="font-bold font-mono">1</span>
                                    </div>
                                    <h3 className="text-white font-bold text-lg">Chat with AI</h3>
                                </div>
                            </div>
                            <p className="text-zinc-400 leading-relaxed">
                                Simply message our WhatsApp bot. Tell it your budget, preferred location, and needs like "2 beds in Bulawayo under $400".
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/[0.08] relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <img
                                    src="https://images.unsplash.com/photo-1582268611958-ebfd161ef2cf?q=80&w=1200&auto=format&fit=crop"
                                    alt="Keys close up"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white mb-2 shadow-lg shadow-violet-900/50">
                                        <span className="font-bold font-mono">2</span>
                                    </div>
                                    <h3 className="text-white font-bold text-lg">Get Matched</h3>
                                </div>
                            </div>
                            <p className="text-zinc-400 leading-relaxed">
                                Our platform instantly scans verified listings to find matches. You get photos and details delivered right to your chat.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/[0.08] relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <img
                                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop"
                                    alt="Moving in"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white mb-2 shadow-lg shadow-indigo-900/50">
                                        <span className="font-bold font-mono">3</span>
                                    </div>
                                    <h3 className="text-white font-bold text-lg">Move In</h3>
                                </div>
                            </div>
                            <p className="text-zinc-400 leading-relaxed">
                                Like what you see? Schedule a viewing with one tap and sign the lease. Welcome to your new home!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ FEATURES ═══ */}
            <div className="py-24 bg-zinc-950/50 border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/15 mb-4">
                            <Zap size={12} className="text-purple-400" />
                            <span className="text-[11px] font-semibold text-purple-400 tracking-wider uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>Why Homify?</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Everything you need to rent with confidence
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: MessageCircle,
                                title: 'Direct WhatsApp Chat',
                                desc: 'Communicate directly with landlords through our secure WhatsApp integration. Fast, familiar, and efficient.',
                            },
                            {
                                icon: ShieldCheck,
                                title: 'Verified Listings',
                                desc: 'Every property is verified by our team. No scams, no fake listings. Just quality homes waiting for you.',
                            },
                            {
                                icon: Sparkles,
                                title: 'AI-Powered Matching',
                                desc: 'Our smart algorithm learns your preferences to suggest homes that perfectly match your lifestyle and budget.',
                            },
                        ].map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={i}
                                    className="p-8 rounded-3xl bg-zinc-900/40 border border-white/[0.04] hover:bg-zinc-900/60 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-white mb-6">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ═══ CTA SECTION ═══ */}
            <div className="py-20 bg-zinc-950">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-violet-900/50" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Ready to find your happy place?
                            </h2>
                            <p className="text-lg text-purple-200 mb-8 max-w-2xl mx-auto">
                                Join thousands of Zimbabweans who found their home with Homify.
                                Fast, secure, and right on your phone.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    to="/properties"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-purple-900 bg-white hover:bg-zinc-100 transition-all shadow-xl hover:-translate-y-0.5"
                                >
                                    Start Searching
                                </Link>
                                <Link
                                    to="/add-property"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
                                >
                                    I'm a Landlord
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
