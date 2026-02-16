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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">My Properties</h1>
                        <p className="text-zinc-400 mt-0.5 text-sm">
                            {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
                        </p>
                    </div>
                    <Link
                        to="/add-property"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/40 font-medium group text-sm whitespace-nowrap"
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
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500/50 transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={clsx(
                                "p-2.5 transition-colors",
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
                                "p-2.5 transition-colors",
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
                    <div className="text-center py-24 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Building2 className="text-zinc-600" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">
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
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all text-sm font-medium"
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
                                className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 overflow-hidden group hover:border-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/5 hover:-translate-y-0.5"
                            >
                                <div className="relative h-44 bg-zinc-800 overflow-hidden">
                                    <img
                                        src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                        alt={property.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <span className={clsx(
                                        "absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md",
                                        property.status === 'active'
                                            ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30'
                                            : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                                    )}>
                                        {property.status}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-base text-white group-hover:text-purple-400 transition-colors line-clamp-1 mb-2">
                                        {property.title}
                                    </h3>
                                    <div className="space-y-1.5 mb-4">
                                        <div className="flex items-center text-zinc-400 text-xs">
                                            <MapPin size={12} className="mr-1.5 text-zinc-500" />
                                            <span className="truncate">{property.location}</span>
                                        </div>
                                        <div className="flex items-center text-xs">
                                            <DollarSign size={12} className="mr-1.5 text-zinc-500" />
                                            <span className="text-white font-semibold">${property.price}</span>
                                            <span className="text-zinc-500 ml-0.5">/mo</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-3 border-t border-zinc-800/50">
                                        <Link
                                            to={`/edit-property/${property.id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-zinc-700/60 bg-zinc-800/40 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-700/60 hover:text-white transition-all"
                                        >
                                            <Edit size={12} /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="p-2 border border-zinc-800/60 bg-zinc-900/50 text-zinc-500 rounded-lg hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/30 transition-all"
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
                    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800/40 stagger-children">
                        {filtered.map((property) => (
                            <div
                                key={property.id}
                                className="flex items-center gap-4 p-4 hover:bg-zinc-800/20 transition-colors group"
                            >
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                                    <img
                                        src={property.images?.[0] || 'https://via.placeholder.com/100?text=No'}
                                        alt={property.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                                        {property.title}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                            <MapPin size={10} /> {property.location}
                                        </span>
                                        <span className="text-xs text-zinc-400 font-medium">
                                            ${property.price}/mo
                                        </span>
                                    </div>
                                </div>
                                <span className={clsx(
                                    "hidden sm:inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full",
                                    property.status === 'active'
                                        ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/20"
                                        : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                                )}>
                                    {property.status}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/edit-property/${property.id}`}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                                    >
                                        <Edit size={14} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(property.id)}
                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
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
