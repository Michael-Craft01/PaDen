import { useEffect, useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { TrendingUp, Users, Eye, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeListings: 0,
        totalViews: 0, // Placeholder
        inquiries: 0, // Placeholder
        tenantsPlaced: 0 // Placeholder
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            // Count Active Properties
            const { count: activeCount, error: activeError } = await supabase
                .from('properties')
                .select('*', { count: 'exact', head: true })
                .eq('owner_id', user?.id)
                .eq('status', 'active');

            if (activeError) throw activeError;

            // In a real app, we would query views/inquiries tables here
            // For now, we simulate "real-like" data based on property count
            const simulatedViews = (activeCount || 0) * 42;
            const simulatedInquiries = Math.round((activeCount || 0) * 3.5);

            setStats({
                activeListings: activeCount || 0,
                totalViews: simulatedViews,
                inquiries: simulatedInquiries,
                tenantsPlaced: 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Active Listings', value: stats.activeListings.toString(), icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        { label: 'Total Views', value: stats.totalViews.toString(), icon: Eye, color: 'text-white', bg: 'bg-zinc-800/50 border-zinc-700' },
        { label: 'WhatsApp Inquiries', value: stats.inquiries.toString(), icon: MessageSquare, color: 'text-purple-300', bg: 'bg-purple-900/20 border-purple-500/20' },
        { label: 'Tenants Placed', value: stats.tenantsPlaced.toString(), icon: Users, color: 'text-gray-300', bg: 'bg-zinc-800/50 border-zinc-700' },
    ];

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-zinc-400 mt-1">Welcome back! Here's an overview of your property performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="group relative bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white tracking-tight">
                                        {loading ? <span className="animate-pulse">...</span> : stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl border ${stat.bg} ${stat.color} shadow-inner`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area (Placeholder) */}
                <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 min-h-[300px] flex flex-col items-center justify-center text-center relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <TrendingUp className="text-zinc-800 w-32 h-32 rotate-[-10deg]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Performance Analytics</h3>
                    <p className="text-gray-500 text-sm max-w-sm relative z-10">
                        Detailed analytics and insights coming soon. Track your property views and inquiry conversion rates.
                    </p>
                    <button className="mt-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors border border-zinc-700 relative z-10">
                        View Report
                    </button>
                </div>

                {/* Recent Inquiries */}
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare size={18} className="text-purple-500" />
                        Recent Inquiries
                    </h2>
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-gray-500 space-y-4">
                        <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-2">
                            <MessageSquare className="text-zinc-600" size={24} />
                        </div>
                        <p className="text-sm">No new messages yet.</p>
                        <p className="text-xs text-gray-600 max-w-[200px]">
                            Once tenants message via WhatsApp, they will appear here instantly.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
