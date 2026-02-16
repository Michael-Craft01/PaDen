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
    Bot,
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Home, label: 'My Properties', path: '/properties' },
    { icon: PlusCircle, label: 'Add Property', path: '/add-property' },
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

    const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

    // Shared nav link renderer
    const NavLink = ({ item, closeMobile }: { item: typeof navItems[0]; closeMobile?: boolean }) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
            <Link
                to={item.path}
                onClick={closeMobile ? () => setMobileOpen(false) : undefined}
                title={collapsed ? item.label : undefined}
                className={clsx(
                    "relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                    collapsed && !closeMobile ? "justify-center p-3.5 mx-1" : "px-4 py-3",
                    isActive
                        ? "bg-purple-600/15 text-purple-400 shadow-sm shadow-purple-900/10"
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                )}
            >
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-purple-400 to-violet-500 rounded-r-full shadow-sm shadow-purple-500/50" />
                )}
                <Icon size={20} className={clsx(
                    "flex-shrink-0 transition-all",
                    isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"
                )} />
                {(closeMobile || !collapsed) && (
                    <span className="animate-fade-in">{item.label}</span>
                )}
                {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                )}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* ─── Animated Background Orbs ─── */}
            <div className="bg-orbs" />
            <div className="bg-orb-center" />

            {/* ─── Mobile Backdrop ─── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ════════════════════════════════════════════
                 DESKTOP SIDEBAR (Glassmorphic)
                 ════════════════════════════════════════════ */}
            <aside
                className={clsx(
                    "fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out",
                    "glass-sidebar",
                    "hidden lg:flex",
                    collapsed ? "w-[72px]" : "w-[260px]",
                )}
            >
                {/* Logo */}
                <div className={clsx(
                    "flex items-center gap-3 h-16 border-b border-white/[0.04] flex-shrink-0",
                    collapsed ? "justify-center px-3" : "px-5"
                )}>
                    <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-purple-900/40">
                        <img src="/homify-logo.jpg" alt="Homify" className="w-full h-full object-cover" />
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold text-white tracking-tight animate-fade-in" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            hom<span className="text-purple-400">ify</span>
                        </span>
                    )}
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
                    {!collapsed && (
                        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.15em] px-3 mb-3">
                            Navigation
                        </p>
                    )}
                    {navItems.map((item) => (
                        <NavLink key={item.path} item={item} />
                    ))}

                    {/* AI Section */}
                    <div className={clsx("pt-4", !collapsed && "mt-3")}>
                        {!collapsed && (
                            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.15em] px-3 mb-3">
                                AI Tools
                            </p>
                        )}
                        <div
                            className={clsx(
                                "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group",
                                collapsed ? "justify-center p-3.5 mx-1" : "px-4 py-3",
                                "text-zinc-500 hover:bg-purple-600/10 hover:text-purple-400"
                            )}
                            title="AI Assistant"
                        >
                            <Sparkles size={20} className="text-purple-600 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                            {!collapsed && <span className="text-zinc-500 group-hover:text-purple-400">AI Assistant</span>}
                        </div>
                        <div
                            className={clsx(
                                "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group",
                                collapsed ? "justify-center p-3.5 mx-1" : "px-4 py-3",
                                "text-zinc-500 hover:bg-purple-600/10 hover:text-purple-400"
                            )}
                            title="WhatsApp Bot"
                        >
                            <Bot size={20} className="text-purple-600 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                            {!collapsed && (
                                <span className="flex items-center gap-2 text-zinc-500 group-hover:text-purple-400">
                                    WhatsApp Bot
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                                </span>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="border-t border-white/[0.04] p-3 space-y-1">
                    <div
                        className={clsx(
                            "flex items-center gap-3 rounded-xl text-sm font-medium text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 transition-all cursor-pointer",
                            collapsed ? "justify-center p-3" : "px-4 py-2.5"
                        )}
                        title={collapsed ? "Settings" : undefined}
                    >
                        <Settings size={18} className="flex-shrink-0" />
                        {!collapsed && <span>Settings</span>}
                    </div>

                    {/* User Profile */}
                    <div className={clsx(
                        "flex items-center gap-3 rounded-xl mt-1 p-2.5 glass-card",
                        collapsed ? "justify-center" : "px-3"
                    )}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-purple-900/30">
                            {userInitial}
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
                                className="p-1.5 text-zinc-600 hover:text-purple-400 transition-colors rounded-lg hover:bg-white/[0.04]"
                                title="Sign Out"
                            >
                                <LogOut size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3.5 top-20 w-7 h-7 glass border border-zinc-700/50 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-purple-600 hover:border-purple-500 transition-all shadow-lg z-50"
                >
                    {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
                </button>
            </aside>

            {/* ════════════════════════════════════════════
                 MOBILE SIDEBAR
                 ════════════════════════════════════════════ */}
            <aside
                className={clsx(
                    "fixed top-0 left-0 h-full w-[280px] z-50 flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
                    "glass-sidebar",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-purple-900/40">
                            <img src="/homify-logo.jpg" alt="Homify" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            hom<span className="text-purple-400">ify</span>
                        </span>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
                    <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.15em] px-3 mb-3">Navigation</p>
                    {navItems.map((item) => (
                        <NavLink key={item.path} item={item} closeMobile />
                    ))}
                    <div className="pt-4 mt-3">
                        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.15em] px-3 mb-3">AI Tools</p>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:bg-purple-600/10 hover:text-purple-400 transition-all cursor-pointer">
                            <Sparkles size={20} className="text-purple-600" /> AI Assistant
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:bg-purple-600/10 hover:text-purple-400 transition-all cursor-pointer">
                            <Bot size={20} className="text-purple-600" />
                            <span className="flex items-center gap-2">WhatsApp Bot <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" /></span>
                        </div>
                    </div>
                </nav>

                <div className="border-t border-white/[0.04] p-4">
                    <div className="flex items-center gap-3 mb-4 p-3 glass-card rounded-xl">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                            {userInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-300 truncate">{user?.email}</p>
                            <p className="text-[10px] text-zinc-600">Landlord</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-purple-400 hover:bg-purple-900/20 border border-zinc-800/50 transition-all"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ════════════════════════════════════════════
                 MAIN CONTENT AREA
                 ════════════════════════════════════════════ */}
            <div className={clsx(
                "flex-1 flex flex-col min-h-screen transition-all duration-300 relative z-10",
                collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
            )}>
                {/* Top Bar (Glassmorphic) */}
                <header className="sticky top-0 z-30 h-16 glass-header flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h2 className="text-lg font-semibold text-white">{pageTitle}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-zinc-500 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
                        </button>
                        <div className="hidden sm:flex w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 items-center justify-center text-white text-xs font-bold shadow-md shadow-purple-900/30">
                            {userInitial}
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
