import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Home, LogOut, PlusCircle, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Home, label: 'My Properties', path: '/properties' },
        { icon: PlusCircle, label: 'Add Property', path: '/add-property' },
    ];

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans">
            {/* Top Navigation Bar */}
            <nav className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/50">P</div>
                                <span className="text-xl font-bold text-white tracking-tight">PaDen</span>
                            </div>
                            <div className="hidden md:ml-6 md:flex md:space-x-4 items-center">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={clsx(
                                                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                                                    : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                                            )}
                                        >
                                            <Icon size={18} />
                                            {item.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-sm text-gray-400">
                                <span className="hidden lg:inline">Logged in as </span>
                                <span className="font-medium text-gray-200">{user?.email}</span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                        <div className="-mr-2 flex items-center md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={clsx(
                                            "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium",
                                            isActive
                                                ? "bg-purple-600 text-white"
                                                : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                                        )}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-zinc-800 hover:text-red-300 text-left mt-4"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};
