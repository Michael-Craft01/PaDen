import { useEffect, useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
    Plus,
    MapPin,
    DollarSign,
    Edit,
    Trash2,
    Grid3X3,
    List,
    Search,
    Building2,
    ArrowUpRight,
} from 'lucide-react';
import { clsx } from 'clsx';

interface Property {
    id: string;
    title: string;
    location: string;
    price: number;
    status: string;
    images: string[] | null;
    description?: string;
    created_at: string;
}

export default function Properties() {
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            fetchProperties();
        }
    }, [user]);

    const fetchProperties = async () => {
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('owner_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProperties(data || []);
        } catch (error: any) {
            console.error('Error fetching properties:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        try {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProperties(properties.filter(p => p.id !== id));
        } catch (error: any) {
            alert('Error deleting property: ' + error.message);
        }
    };

    const filtered = properties.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            My Properties
                        </h1>
                        <p className="text-zinc-500 mt-1 text-sm">
                            {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
                        </p>
                    </div>
                    <Link
                        to="/add-property"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl transition-all shadow-lg shadow-purple-900/30 font-semibold group text-sm whitespace-nowrap"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                        Add Property
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-600/40 transition-all"
                            style={{
                                background: 'rgba(24, 24, 27, 0.5)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(63, 63, 70, 0.3)',
                            }}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center rounded-xl overflow-hidden" style={{
                        background: 'rgba(24, 24, 27, 0.5)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(63, 63, 70, 0.3)',
                    }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={clsx(
                                "p-2.5 transition-all",
                                viewMode === 'grid'
                                    ? "bg-purple-600/20 text-purple-400"
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <Grid3X3 size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={clsx(
                                "p-2.5 transition-all",
                                viewMode === 'list'
                                    ? "bg-purple-600/20 text-purple-400"
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-72 animate-shimmer rounded-2xl" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 rounded-2xl" style={{
                        background: 'rgba(24, 24, 27, 0.35)',
                        backdropFilter: 'blur(16px)',
                        border: '1px dashed rgba(63, 63, 70, 0.4)',
                    }}>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/10 flex items-center justify-center mx-auto mb-5">
                            <Building2 className="text-purple-500/50" size={28} />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {searchQuery ? 'No results found' : 'No properties listed'}
                        </h3>
                        <p className="text-zinc-500 mb-6 max-w-sm mx-auto text-sm">
                            {searchQuery
                                ? `No properties match "${searchQuery}"`
                                : 'Get started by adding your first property.'}
                        </p>
                        {!searchQuery && (
                            <Link
                                to="/add-property"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl transition-all text-sm font-semibold shadow-lg shadow-purple-900/30"
                            >
                                <Plus size={16} /> Add your first property
                            </Link>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    /* ─── Grid View ─── */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                        {filtered.map((property) => (
                            <div
                                key={property.id}
                                className="group rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10"
                                style={{
                                    background: 'rgba(24, 24, 27, 0.5)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(63, 63, 70, 0.3)',
                                }}
                            >
                                <div className="relative h-48 bg-zinc-800 overflow-hidden">
                                    <img
                                        src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                        alt={property.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                    <span className={clsx(
                                        "absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold border",
                                        property.status === 'active'
                                            ? 'bg-purple-900/50 text-purple-300 border-purple-500/30 backdrop-blur-md'
                                            : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 backdrop-blur-md'
                                    )}>
                                        {property.status}
                                    </span>
                                    {/* Price tag overlay */}
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/[0.06]">
                                        <DollarSign size={12} className="text-purple-400" />
                                        <span className="text-sm font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{property.price}</span>
                                        <span className="text-[10px] text-zinc-400">/mo</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-base text-white group-hover:text-purple-400 transition-colors line-clamp-1 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        {property.title}
                                    </h3>
                                    <div className="flex items-center text-zinc-500 text-xs mb-4">
                                        <MapPin size={12} className="mr-1.5 text-zinc-600" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                    <div className="flex gap-2 pt-3 border-t border-white/[0.04]">
                                        <Link
                                            to={`/edit-property/${property.id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white transition-all"
                                            style={{
                                                background: 'rgba(39, 39, 42, 0.5)',
                                                border: '1px solid rgba(63, 63, 70, 0.3)',
                                            }}
                                        >
                                            <Edit size={12} /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="p-2 text-zinc-500 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-all"
                                            style={{
                                                border: '1px solid rgba(63, 63, 70, 0.3)',
                                            }}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ─── List View ─── */
                    <div className="rounded-2xl overflow-hidden divide-y divide-white/[0.03] stagger-children" style={{
                        background: 'rgba(24, 24, 27, 0.45)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(63, 63, 70, 0.3)',
                    }}>
                        {filtered.map((property) => (
                            <div
                                key={property.id}
                                className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-all group"
                            >
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 ring-1 ring-white/[0.06]">
                                    <img
                                        src={property.images?.[0] || 'https://via.placeholder.com/100?text=No'}
                                        alt={property.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        {property.title}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                            <MapPin size={10} className="text-zinc-600" /> {property.location}
                                        </span>
                                        <span className="text-xs font-medium text-zinc-300">
                                            ${property.price}/mo
                                        </span>
                                    </div>
                                </div>
                                <span className={clsx(
                                    "hidden sm:inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full",
                                    property.status === 'active'
                                        ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                                        : "bg-zinc-800/60 text-zinc-500 border border-zinc-700/50"
                                )}>
                                    {property.status}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Link
                                        to={`/edit-property/${property.id}`}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
                                    >
                                        <Edit size={14} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(property.id)}
                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-900/15 rounded-lg transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
