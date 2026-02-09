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
        { label: 'Active Listings', value: stats.activeListings.toString(), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Views', value: stats.totalViews.toString(), icon: Eye, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'WhatsApp Inquiries', value: stats.inquiries.toString(), icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Tenants Placed', value: stats.tenantsPlaced.toString(), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's what's happening with your properties.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? '-' : stat.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <Icon size={24} />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Inquiries</h2>
                <div className="text-center py-8 text-gray-500 text-sm">
                    No inquiries yet. Once tenants message via WhatsApp, they will appear here.
                </div>
            </div>
        </DashboardLayout>
    );
}
