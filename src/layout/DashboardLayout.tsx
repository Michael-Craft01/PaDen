import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Home,
    LogOut,
    PlusCircle,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Bell,
    Settings,
    Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Home, label: 'My Properties', path: '/properties' },
    { icon: PlusCircle, label: 'Add Property', path: '/add-property' },
];

const bottomNavItems = [
    { icon: Settings, label: 'Settings', path: '/dashboard' },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const pageTitle = (() => {
        const current = navItems.find(i => i.path === location.pathname);
        if (current) return current.label;
        if (location.pathname.startsWith('/edit-property')) return 'Edit Property';
        return 'Dashboard';
    })();

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans flex">
            {/* ─── Mobile Backdrop ─── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ─── Sidebar ─── */}
            <aside
                className={clsx(
                    "fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out",
                    "bg-zinc-950/95 backdrop-blur-xl border-r border-zinc-800/80",
                    // Desktop
                    "hidden lg:flex",
                    collapsed ? "w-[72px]" : "w-[260px]",
                )}
            >
                {/* Logo */}
                <div className={clsx(
                    "flex items-center gap-3 px-5 h-16 border-b border-zinc-800/60 flex-shrink-0",
                    collapsed && "justify-center px-0"
                )}>
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-900/40 flex-shrink-0">
                        P
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold text-white tracking-tight animate-fade-in">
                            PaDen
                        </span>
                    )}
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {!collapsed && (
                        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-3 mb-3">
                            Menu
                        </p>
                    )}
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={collapsed ? item.label : undefined}
                                className={clsx(
                                    "relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                    collapsed ? "justify-center p-3" : "px-4 py-3",
                                    isActive
                                        ? "bg-purple-600/15 text-purple-400 border border-purple-500/20 shadow-sm shadow-purple-900/20"
                                        : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white border border-transparent"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-purple-500 rounded-r-full" />
                                )}
                                <Icon size={20} className={clsx(
                                    "flex-shrink-0 transition-colors",
                                    isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"
                                )} />
                                {!collapsed && (
                                    <span className="animate-fade-in">{item.label}</span>
                                )}
                            </Link>
                        )
                    })}

                    {/* AI Divider */}
                    {!collapsed && (
                        <div className="pt-6 pb-2">
                            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-3 mb-3">
                                AI Tools
                            </p>
                        </div>
                    )}
                    <div
                        className={clsx(
                            "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                            collapsed ? "justify-center p-3" : "px-4 py-3",
                            "text-zinc-500 hover:bg-zinc-800/60 hover:text-purple-300 border border-transparent"
                        )}
                        title="AI Assistant (Coming Soon)"
                    >
                        <Sparkles size={20} className="text-purple-600 flex-shrink-0" />
                        {!collapsed && <span className="text-zinc-500">AI Assistant</span>}
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="border-t border-zinc-800/60 p-3 space-y-1">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.label}
                                className={clsx(
                                    "flex items-center gap-3 rounded-xl text-sm font-medium text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300 transition-all cursor-pointer",
                                    collapsed ? "justify-center p-3" : "px-4 py-2.5"
                                )}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon size={18} className="flex-shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </div>
                        );
                    })}

                    {/* User */}
                    <div className={clsx(
                        "flex items-center gap-3 rounded-xl mt-2 p-2",
                        collapsed ? "justify-center" : "px-3"
                    )}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0 animate-fade-in">
                                <p className="text-xs font-medium text-zinc-300 truncate">{user?.email}</p>
                                <p className="text-[10px] text-zinc-600">Landlord</p>
                            </div>
                        )}
                        {!collapsed && (
                            <button
                                onClick={handleSignOut}
                                className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800/60"
                                title="Sign Out"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Collapse Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all shadow-md z-50"
                >
                    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>
            </aside>

            {/* ─── Mobile Sidebar ─── */}
            <aside
                className={clsx(
                    "fixed top-0 left-0 h-full w-[280px] z-50 flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
                    "bg-zinc-950/98 backdrop-blur-xl border-r border-zinc-800",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo + Close */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-800/60">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-900/40">
                            P
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">PaDen</span>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-purple-600/15 text-purple-400 border border-purple-500/20"
                                        : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white border border-transparent"
                                )}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Mobile User */}
                <div className="border-t border-zinc-800/60 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-300 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 border border-red-900/20 transition-all"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ─── Main Content Area ─── */}
            <div className={clsx(
                "flex-1 flex flex-col min-h-screen transition-all duration-300",
                collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
            )}>
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h2 className="text-lg font-semibold text-white">{pageTitle}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-zinc-500 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
                        </button>
                        <div className="hidden sm:block w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
