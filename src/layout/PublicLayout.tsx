import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        // Add more links here if needed, e.g. { name: 'Features', path: '#features' }
    ];

    return (
        <div className="min-h-screen bg-black font-sans text-gray-100 selection:bg-purple-900 selection:text-white">
            <header
                className={clsx(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
                    scrolled ? "bg-zinc-900/80 backdrop-blur-md border-zinc-800 shadow-lg shadow-black/50 py-2" : "bg-transparent py-4"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-zinc-800">
                                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">P</span>
                                </div>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white group-hover:text-purple-400 transition-colors">
                                PaDen
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={clsx(
                                            "text-sm font-medium transition-colors relative group",
                                            isActive ? "text-white" : "text-gray-300 hover:text-white"
                                        )}
                                    >
                                        {link.name}
                                        <span className={clsx(
                                            "absolute -bottom-1 left-0 h-0.5 bg-purple-500 transition-all duration-300",
                                            isActive ? "w-full" : "w-0 group-hover:w-full"
                                        )}></span>
                                    </Link>
                                )
                            })}
                            <Link
                                to="/login"
                                className="group relative px-6 py-2.5 bg-white text-black rounded-full font-medium transition-transform active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] overflow-hidden"
                            >
                                <span className="relative z-10 group-hover:text-purple-600 transition-colors">Login</span>
                                <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-300 hover:text-white focus:outline-none p-2"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={clsx(
                        "md:hidden absolute top-full left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 transition-all duration-300 overflow-hidden",
                        mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center px-4 py-3 mt-4 text-base font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-900/40"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </header>
            <main className="pt-20">
                {children}
            </main>
            <footer className="bg-zinc-950 border-t border-zinc-900 mt-20 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} PaDen. <span className="text-zinc-700 mx-2">|</span> Classic Reliability. Modern Tech.
                    </p>
                </div>
            </footer>
        </div>
    );
};
