import { useEffect, useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    Eye,
    MessageSquare,
    PlusCircle,
    ArrowUpRight,
    Sparkles,
    Building2,
    MapPin,
    DollarSign,
    ChevronRight,
    Zap,
    Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { clsx } from 'clsx';

interface Property {
    id: string;
    title: string;
    location: string;
    price: number;
    status: string;
    images: string[] | null;
    created_at: string;
}

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeListings: 0,
        totalViews: 0,
        inquiries: 0,
        revenue: 0,
    });
    const [recentProperties, setRecentProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const { data: properties, error } = await supabase
                .from('properties')
                .select('*')
                .eq('owner_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const allProps = properties || [];
            const active = allProps.filter(p => p.status === 'active');

            setStats({
                activeListings: active.length,
                totalViews: active.length * 42,
                inquiries: Math.round(active.length * 3.5),
                revenue: active.reduce((sum, p) => sum + (p.price || 0), 0),
            });

            setRecentProperties(allProps.slice(0, 4));
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const greeting = (() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    })();

    const userName = user?.email?.split('@')[0] || 'Landlord';

    const statCards = [
        {
            label: 'Active Listings',
            value: stats.activeListings,
            icon: Building2,
            trend: '+2 this month',
            trendUp: true,
            gradient: 'from-purple-600/20 to-violet-600/5',
            glowColor: 'shadow-purple-500/10',
            iconBg: 'bg-purple-500/15',
            iconColor: 'text-purple-400',
        },
        {
            label: 'Total Views',
            value: stats.totalViews,
            icon: Eye,
            trend: '+12% this week',
            trendUp: true,
            gradient: 'from-violet-600/15 to-purple-600/5',
            glowColor: 'shadow-violet-500/10',
            iconBg: 'bg-violet-500/15',
            iconColor: 'text-violet-400',
        },
        {
            label: 'Inquiries',
            value: stats.inquiries,
            icon: MessageSquare,
            trend: '3 unread',
            trendUp: true,
            gradient: 'from-purple-700/15 to-violet-700/5',
            glowColor: 'shadow-purple-500/10',
            iconBg: 'bg-purple-600/15',
            iconColor: 'text-purple-300',
        },
        {
            label: 'Revenue',
            value: `$${stats.revenue.toLocaleString()}`,
            icon: TrendingUp,
            trend: 'Projected',
            trendUp: false,
            gradient: 'from-violet-700/15 to-purple-700/5',
            glowColor: 'shadow-violet-500/10',
            iconBg: 'bg-violet-600/15',
            iconColor: 'text-violet-300',
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-7 animate-fade-in">

                {/* ═══ WELCOME BANNER ═══ */}
                <div className="relative overflow-hidden rounded-3xl p-7 sm:p-9" style={{
                    background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.35) 0%, rgba(24, 24, 27, 0.8) 50%, rgba(24, 24, 27, 0.6) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.12)',
                    backdropFilter: 'blur(20px)',
                }}>
                    {/* Decorative gradient blobs */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/8 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4" />
                    <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-violet-500/6 rounded-full blur-[80px] translate-y-1/2" />
                    <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-purple-400/5 rounded-full blur-[60px]" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                        <div>
                            <p className="text-xs font-medium text-purple-400/80 tracking-wider uppercase mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Dashboard Overview
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                {greeting}, <span className="gradient-text">{userName}</span> 👋
                            </h1>
                            <p className="text-zinc-400 mt-2 text-sm sm:text-base leading-relaxed">
                                Here's what's happening with your properties today.
                            </p>
                        </div>
                        <Link
                            to="/add-property"
                            className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition-all shadow-xl shadow-purple-900/30 hover:shadow-purple-800/50 hover:-translate-y-0.5 group whitespace-nowrap"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <PlusCircle size={18} />
                            List Property
                            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* ═══ STAT CARDS ═══ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className={clsx(
                                    "group relative rounded-2xl p-5 transition-all duration-300 overflow-hidden cursor-default",
                                    "hover:-translate-y-1 hover:shadow-xl",
                                    stat.glowColor,
                                )}
                                style={{
                                    background: 'rgba(24, 24, 27, 0.5)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(63, 63, 70, 0.3)',
                                }}
                            >
                                {/* Gradient overlay */}
                                <div className={clsx("absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-100 transition-opacity", stat.gradient)} />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={clsx("p-2.5 rounded-xl", stat.iconBg)}>
                                            <Icon size={20} className={stat.iconColor} />
                                        </div>
                                        <span className={clsx(
                                            "text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1",
                                            stat.trendUp
                                                ? "text-purple-300 bg-purple-500/10 border border-purple-500/20"
                                                : "text-zinc-400 bg-zinc-800/60 border border-zinc-700/50"
                                        )}>
                                            {stat.trendUp && <Activity size={8} />}
                                            {stat.trend}
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        {loading ? (
                                            <span className="inline-block w-16 h-8 animate-shimmer rounded-lg" />
                                        ) : (
                                            stat.value
                                        )}
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-1.5 font-medium tracking-wide">{stat.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ═══ MAIN GRID ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* ── Recent Properties ── */}
                    <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{
                        background: 'rgba(24, 24, 27, 0.45)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(63, 63, 70, 0.3)',
                    }}>
                        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                                    <Building2 size={14} className="text-purple-400" />
                                </div>
                                Recent Properties
                            </h3>
                            <Link
                                to="/properties"
                                className="text-xs text-zinc-500 hover:text-purple-400 transition-colors flex items-center gap-1 font-medium"
                            >
                                View all <ChevronRight size={12} />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="p-5 space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 animate-shimmer rounded-xl" />
                                ))}
                            </div>
                        ) : recentProperties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/10 flex items-center justify-center mb-5">
                                    <Building2 className="text-purple-500/50" size={28} />
                                </div>
                                <p className="text-sm font-medium text-zinc-300 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    No properties yet
                                </p>
                                <p className="text-xs text-zinc-600 mb-5 max-w-[200px]">
                                    List your first property and start receiving inquiries
                                </p>
                                <Link
                                    to="/add-property"
                                    className="inline-flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 font-semibold bg-purple-600/10 hover:bg-purple-600/20 px-4 py-2 rounded-lg transition-all border border-purple-500/15"
                                >
                                    <PlusCircle size={14} /> Add Property
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.03]">
                                {recentProperties.map((property, i) => (
                                    <Link
                                        key={property.id}
                                        to={`/edit-property/${property.id}`}
                                        className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-all group"
                                        style={{ animationDelay: `${i * 80}ms` }}
                                    >
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800/80 flex-shrink-0 ring-1 ring-white/[0.06]">
                                            <img
                                                src={property.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Img'}
                                                alt={property.title}
                                                className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-purple-400 transition-colors">
                                                {property.title}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                                                    <MapPin size={10} className="text-zinc-600" /> {property.location}
                                                </span>
                                                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                                                    <DollarSign size={10} className="text-zinc-600" /> ${property.price}/mo
                                                </span>
                                            </div>
                                        </div>
                                        <span className={clsx(
                                            "text-[10px] font-semibold px-2.5 py-1 rounded-full",
                                            property.status === 'active'
                                                ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                                                : "bg-zinc-800/60 text-zinc-500 border border-zinc-700/50"
                                        )}>
                                            {property.status}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right Column ── */}
                    <div className="space-y-5">

                        {/* Quick Actions */}
                        <div className="rounded-2xl p-5" style={{
                            background: 'rgba(24, 24, 27, 0.45)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(63, 63, 70, 0.3)',
                        }}>
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                <Zap size={14} className="text-purple-400" />
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    to="/add-property"
                                    className="flex items-center gap-3 p-3.5 rounded-xl border border-purple-500/15 bg-purple-600/5 hover:bg-purple-600/10 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                                        <PlusCircle size={16} className="text-purple-400" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                        Add Property
                                    </span>
                                    <ChevronRight size={14} className="ml-auto text-zinc-700 group-hover:text-purple-400 transition-colors" />
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.04] hover:bg-white/[0.03] transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                        <Sparkles size={16} className="text-violet-400" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                        AI Assistant
                                    </span>
                                    <ChevronRight size={14} className="ml-auto text-zinc-700 group-hover:text-purple-400 transition-colors" />
                                </Link>
                                <Link
                                    to="/properties"
                                    className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.04] hover:bg-white/[0.03] transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center">
                                        <Building2 size={16} className="text-purple-300" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                        View Properties
                                    </span>
                                    <ChevronRight size={14} className="ml-auto text-zinc-700 group-hover:text-purple-400 transition-colors" />
                                </Link>
                            </div>
                        </div>

                        {/* AI Insights */}
                        <div className="relative overflow-hidden rounded-2xl p-5" style={{
                            background: 'linear-gradient(145deg, rgba(88, 28, 135, 0.2) 0%, rgba(24, 24, 27, 0.7) 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.15)',
                            backdropFilter: 'blur(20px)',
                        }}>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/8 rounded-full blur-[60px]" />
                            <div className="absolute bottom-0 left-0 w-28 h-28 bg-violet-500/5 rounded-full blur-[40px]" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                                        <Sparkles size={14} className="text-purple-400 animate-sparkle" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-purple-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        AI Insights
                                    </h3>
                                </div>
                                <p className="text-[13px] text-zinc-400 leading-relaxed">
                                    Properties with detailed descriptions and 5+ images receive{' '}
                                    <span className="text-purple-300 font-semibold">3× more inquiries</span>. Use the AI
                                    assistant when listing.
                                </p>
                                <Link
                                    to="/add-property"
                                    className="inline-flex items-center gap-2 mt-4 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-600/10 hover:bg-purple-600/20 px-3.5 py-2 rounded-lg transition-all border border-purple-500/15"
                                >
                                    Try AI-Powered Listing <ArrowUpRight size={12} />
                                </Link>
                            </div>
                        </div>

                        {/* WhatsApp Status */}
                        <div className="rounded-2xl p-5" style={{
                            background: 'rgba(24, 24, 27, 0.45)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(63, 63, 70, 0.3)',
                        }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                                        <MessageSquare size={14} className="text-purple-400" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        WhatsApp Bot
                                    </h3>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/15">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-purple-400 font-semibold">LIVE</span>
                                </div>
                            </div>
                            <p className="text-[13px] text-zinc-500 leading-relaxed">
                                Your AI bot is responding to tenant inquiries on WhatsApp automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
