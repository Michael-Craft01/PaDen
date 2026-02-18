import { Link } from 'react-router-dom';
import { PublicLayout } from '../layout/PublicLayout';
import { ShieldCheck, ArrowRight, Sparkles, Zap, MessageCircle } from 'lucide-react';

export default function Home() {
    return (
        <PublicLayout>
            {/* ═══ HERO SECTION ═══ */}
            {/* ═══ HERO SECTION ═══ */}
            <div className="relative bg-zinc-950 min-h-screen flex flex-col justify-center pt-20 overflow-hidden">
                {/* Subtle Grain/Texture (Optional, keeping it clean for now) */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                        {/* Text Content (Left) */}
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md mb-8">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-medium text-zinc-300 uppercase tracking-widest" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    Live in Zimbabwe
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-[0.95] mb-8 font-serif">
                                Find a place <br />
                                <span className="italic text-zinc-400">to call home.</span>
                            </h1>

                            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed mb-10 max-w-lg font-light">
                                Experience the new standard of renting. Verified listings, direct chats, and AI assistance—all in one place.
                            </p>

                            <div className="flex flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                                <Link
                                    to="/properties"
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full text-black bg-white hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1 whitespace-nowrap"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    Start Search
                                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full text-white border border-zinc-800 hover:bg-zinc-900 transition-all whitespace-nowrap"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    How it Works
                                </a>
                            </div>

                            <div className="mt-12 flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    {[
                                        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&h=100&q=80",
                                        "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=100&h=100&q=80",
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                                    ].map((src, i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden">
                                            <img src={src} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-zinc-500">
                                    Trusted by <span className="text-white font-semibold">2,000+</span> tenants
                                </p>
                            </div>
                        </div>

                        {/* Visual (Right) - Main Image Only */}
                        <div className="lg:col-span-5 relative block h-[450px] lg:h-full lg:min-h-[600px] flex items-center mt-10 lg:mt-0">
                            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/50 group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                <img
                                    src="https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=1200&auto=format&fit=crop"
                                    alt="Black couple moving into new home"
                                    className="w-full h-auto aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 z-20">
                                    <p className="text-white font-serif italic text-xl sm:text-2xl">New beginnings.</p>
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
                                    src="/keys-handover.png"
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

            {/* ═══ MARKETING GALLERY ═══ */}
            <div className="py-24 bg-zinc-950 border-t border-white/[0.04] overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-end justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/15 mb-4">
                            <Sparkles size={12} className="text-indigo-400" />
                            <span className="text-[11px] font-semibold text-indigo-400 tracking-wider uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>App Showcase</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white max-w-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Experience the future of property rentals
                        </h2>
                    </div>
                    <div className="hidden sm:block text-zinc-400 max-w-sm text-sm text-right">
                        Join thousands of verified landlords and tenants using PaDen daily.
                    </div>
                </div>

                {/* Bento Grid Gallery */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[600px] sm:h-[800px] grid grid-cols-2 md:grid-cols-4 grid-rows-4 gap-4">

                    {/* 1. Large Feature Card (Top Left) */}
                    <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200" alt="Modern Interior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <p className="font-bold text-lg">Modern Living</p>
                            <p className="text-xs text-zinc-300">Curated spaces for your lifestyle</p>
                        </div>
                    </div>

                    {/* 2. Vertical Card (Top Right Center) */}
                    <div className="col-span-1 row-span-2 relative rounded-3xl overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800" alt="Kitchen" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    </div>

                    {/* 3. Small Card (Top Right) */}
                    <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group bg-purple-900/20 flex items-center justify-center border border-white/10">
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
                            <div className="text-xs text-zinc-400 font-medium uppercase tracking-wide">AI Support</div>
                        </div>
                    </div>

                    {/* 4. Small Card (Row 2 Right) */}
                    <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600" alt="Moving Boxes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>

                    {/* 5. Wide Card (Row 3 Left) */}
                    <div className="col-span-2 row-span-1 relative rounded-3xl overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1600596542815-e32870110232?q=80&w=1200" alt="House Exterior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                            Verified Listings only
                        </div>
                    </div>

                    {/* 6. Large Card (Bottom Right) */}
                    <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=1200" alt="Using App" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute bottom-6 left-6 max-w-xs">
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                                <div className="flex gap-3 items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                        <MessageCircle size={16} className="text-white" />
                                    </div>
                                    <div className="text-white text-sm font-semibold">Homify Bot</div>
                                </div>
                                <div className="text-zinc-200 text-xs leading-relaxed">
                                    "I found 3 apartments in Borrowdale matching your criteria. Would you like to see photos?"
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 7. Last Card (Bottom Left) */}
                    <div className="col-span-2 row-span-1 relative rounded-3xl overflow-hidden group bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-between px-8">
                        <div>
                            <p className="text-indigo-200 text-sm font-medium mb-1">Ready to start?</p>
                            <p className="text-2xl font-bold text-white">Join Homify today.</p>
                        </div>
                        <Link to="/properties" className="w-10 h-10 rounded-full bg-white text-indigo-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <ArrowRight size={20} />
                        </Link>
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
