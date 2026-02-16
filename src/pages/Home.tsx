import { Link } from 'react-router-dom';
import { PublicLayout } from '../layout/PublicLayout';
import { Building2, ShieldCheck, Users, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <PublicLayout>
            <div className="relative bg-black overflow-hidden">
                {/* Background Gradient Mesh */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl mb-6">
                            <span className="block">Find the perfect tenant</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                                via WhatsApp
                            </span>
                        </h1>
                        <p className="mt-4 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            SafeStay connects you directly with verified students and professionals looking for accommodation.
                            Classic reliability, modern technology.
                        </p>
                        <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-12 gap-4">
                            <Link to="/login" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10 transition-all shadow-lg shadow-purple-900/30">
                                Get Started
                                <ArrowRight className="ml-2 -mr-1" size={20} />
                            </Link>
                            <a href="#features" className="flex items-center justify-center px-8 py-3 border border-zinc-700 text-base font-medium rounded-lg text-gray-300 bg-zinc-900/50 hover:bg-zinc-800 md:py-4 md:text-lg md:px-10 transition-colors backdrop-blur-sm">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div id="features" className="py-24 bg-zinc-950 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm text-purple-500 font-bold tracking-widest uppercase mb-3">Features</h2>
                        <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Modern solutions for classic problems
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-900/10">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Direct Connection</h3>
                            <p className="text-gray-400 leading-relaxed">Connect directly with potential tenants on WhatsApp. No middlemen, no delays.</p>
                        </div>

                        <div className="group bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-900/10">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Verified Listings</h3>
                            <p className="text-gray-400 leading-relaxed">Build trust with a verified badge. Tenants prefer safe, verified landlords.</p>
                        </div>

                        <div className="group bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-900/10">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                                <Building2 size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Easy Management</h3>
                            <p className="text-gray-400 leading-relaxed">Update availability, prices, and photos instantly from your modern dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
