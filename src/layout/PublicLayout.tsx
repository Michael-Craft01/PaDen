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
    ];

    return (
        <div className="min-h-screen bg-black text-gray-100 selection:bg-purple-900 selection:text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <header
                className={clsx(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
                    scrolled ? "py-2" : "py-4"
                )}
                style={scrolled ? {
                    background: 'rgba(9, 9, 11, 0.75)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderBottom: '1px solid rgba(63, 63, 70, 0.25)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                } : {
                    background: 'transparent',
                    borderBottom: '1px solid transparent',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
                            <img src="/logo.png" alt="PaDen" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-purple-900/40" />
                            <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>paDen</span>
                        </Link>

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
                                            isActive ? "text-white" : "text-zinc-400 hover:text-white"
                                        )}
                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                    >
                                        {link.name}
                                        <span className={clsx(
                                            "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-300 rounded-full",
                                            isActive ? "w-full" : "w-0 group-hover:w-full"
                                        )}></span>
                                    </Link>
                                )
                            })}
                            <Link
                                to="/login"
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-purple-900/30 hover:shadow-purple-800/50 hover:-translate-y-0.5"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                Login
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-zinc-400 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={clsx(
                        "md:hidden absolute top-full left-0 right-0 transition-all duration-300 overflow-hidden",
                        mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    )}
                    style={{
                        background: 'rgba(9, 9, 11, 0.9)',
                        backdropFilter: 'blur(24px)',
                        borderBottom: mobileMenuOpen ? '1px solid rgba(63, 63, 70, 0.25)' : 'none',
                    }}
                >
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block w-full text-center px-4 py-3 mt-4 text-base font-semibold bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl transition-all shadow-lg shadow-purple-900/30"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-24">
                {children}
            </main>

            <footer className="border-t mt-20 py-12" style={{
                background: 'rgba(9, 9, 11, 0.5)',
                borderColor: 'rgba(63, 63, 70, 0.15)',
            }}>
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2.5 mb-4">
                        <img src="/logo.png" alt="PaDen" className="w-8 h-8 rounded-lg shadow-md shadow-purple-900/30" />
                        <span className="text-lg font-bold text-balck" style={{ fontFamily: "'Outfit', sans-serif" }}>paDen</span>
                    </div>
                    <p className="text-zinc-600 text-sm">
                        &copy; {new Date().getFullYear()} paDen. Classic Reliability. Modern Tech.
                    </p>
                </div>
            </footer>
        </div>
    );
};
