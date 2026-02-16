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

            setRecentProperties(allProps.slice(0, 3));
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
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            iconColor: 'text-purple-400',
        },
        {
            label: 'Total Views',
            value: stats.totalViews,
            icon: Eye,
            trend: '+12% vs last week',
            bg: 'bg-purple-500/8',
            border: 'border-purple-500/15',
            iconColor: 'text-purple-300',
        },
        {
            label: 'WhatsApp Inquiries',
            value: stats.inquiries,
            icon: MessageSquare,
            trend: '3 unread',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/20',
            iconColor: 'text-violet-400',
        },
        {
            label: 'Monthly Revenue',
            value: `$${stats.revenue.toLocaleString()}`,
            icon: TrendingUp,
            trend: 'Projected',
            bg: 'bg-purple-600/10',
            border: 'border-purple-600/20',
            iconColor: 'text-purple-300',
        },
    ];

    const quickActions = [
        { label: 'Add Property', icon: PlusCircle, path: '/add-property', color: 'text-purple-400 hover:bg-purple-600/10' },
        { label: 'AI Assistant', icon: Sparkles, path: '/dashboard', color: 'text-violet-400 hover:bg-violet-600/10' },
        { label: 'View All', icon: Building2, path: '/properties', color: 'text-purple-300 hover:bg-purple-600/10' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in">
                {/* ─── Welcome Banner ─── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-zinc-900 to-zinc-900 border border-purple-500/10 p-6 sm:p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                {greeting}, <span className="gradient-text">{userName}</span> 👋
                            </h1>
                            <p className="text-zinc-400 mt-1.5 text-sm sm:text-base">
                                Here's what's happening with your properties today.
                            </p>
                        </div>
                        <Link
                            to="/add-property"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 group whitespace-nowrap"
                        >
                            <PlusCircle size={18} />
                            List Property
                            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* ─── Stat Cards ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className={clsx(
                                    "group relative rounded-2xl p-5 transition-all duration-300",
                                    "glass-card hover:bg-white/[0.04]",
                                    stat.border,
                                    "hover:shadow-lg hover:shadow-purple-900/5 hover:-translate-y-0.5"
                                )}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={clsx("p-2.5 rounded-xl", stat.bg)}>
                                        <Icon size={20} className={stat.iconColor} />
                                    </div>
                                    <span className="text-[10px] font-medium text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded-full">
                                        {stat.trend}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-white tracking-tight">
                                    {loading ? (
                                        <span className="inline-block w-16 h-7 animate-shimmer rounded" />
                                    ) : (
                                        stat.value
                                    )}
                                </p>
                                <p className="text-xs text-zinc-500 mt-1 font-medium">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* ─── Main Grid ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Properties */}
                    <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-zinc-800/60">
                            <h3 className="text-base font-semibold text-white flex items-center gap-2">
                                <Building2 size={16} className="text-purple-500" />
                                Recent Properties
                            </h3>
                            <Link
                                to="/properties"
                                className="text-xs text-zinc-500 hover:text-purple-400 transition-colors flex items-center gap-1"
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
                            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                <div className="w-14 h-14 bg-zinc-800/60 rounded-2xl flex items-center justify-center mb-4">
                                    <Building2 className="text-zinc-600" size={24} />
                                </div>
                                <p className="text-sm text-zinc-400 mb-1">No properties yet</p>
                                <p className="text-xs text-zinc-600 mb-4">List your first property to see it here</p>
                                <Link
                                    to="/add-property"
                                    className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                                >
                                    + Add Property
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800/40">
                                {recentProperties.map((property) => (
                                    <Link
                                        key={property.id}
                                        to={`/edit-property/${property.id}`}
                                        className="flex items-center gap-4 p-4 hover:bg-zinc-800/30 transition-colors group"
                                    >
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                                            <img
                                                src={property.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Img'}
                                                alt={property.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                                                {property.title}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <MapPin size={10} /> {property.location}
                                                </span>
                                                <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <DollarSign size={10} /> ${property.price}/mo
                                                </span>
                                            </div>
                                        </div>
                                        <span className={clsx(
                                            "text-[10px] font-medium px-2 py-0.5 rounded-full",
                                            property.status === 'active'
                                                ? "bg-purple-900/30 text-purple-400 border border-purple-500/20"
                                                : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                                        )}>
                                            {property.status}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="glass-card rounded-2xl p-5">
                            <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                {quickActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <Link
                                            key={action.label}
                                            to={action.path}
                                            className={clsx(
                                                "flex items-center gap-3 p-3 rounded-xl border border-zinc-800/60 transition-all group",
                                                action.color
                                            )}
                                        >
                                            <Icon size={18} />
                                            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                                {action.label}
                                            </span>
                                            <ChevronRight size={14} className="ml-auto text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* AI Insights */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-zinc-900 to-zinc-900 rounded-2xl border border-purple-500/15 p-5">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles size={16} className="text-purple-400" />
                                    <h3 className="text-sm font-semibold text-purple-300">AI Insights</h3>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Properties with detailed descriptions and 5+ images receive <span className="text-purple-300 font-medium">3x more inquiries</span>. Use the AI assistant when listing to maximize visibility.
                                </p>
                                <Link
                                    to="/add-property"
                                    className="inline-flex items-center gap-1.5 mt-4 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                                >
                                    Try AI-Powered Listing <ArrowUpRight size={12} />
                                </Link>
                            </div>
                        </div>

                        {/* WhatsApp Status */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare size={16} className="text-purple-500" />
                                <h3 className="text-sm font-semibold text-white">WhatsApp Bot</h3>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                <span className="text-xs text-purple-400 font-medium">Online</span>
                            </div>
                            <p className="text-xs text-zinc-500">
                                Your AI bot is ready to respond to tenant inquiries on WhatsApp automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
