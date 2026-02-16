import { useEffect, useState } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Plus, MapPin, DollarSign, Edit, Trash2 } from 'lucide-react';

interface Property {
    id: string;
    title: string;
    location: string;
    price: number;
    status: string;
    images: string[] | null;
}

export default function Properties() {
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">My Properties</h1>
                    <p className="text-zinc-400 mt-1">Manage your active listings.</p>
                </div>
                <Link to="/add-property" className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/40 font-medium group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    Add Property
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-zinc-500">Loading properties...</p>
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-24 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="text-zinc-600" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No properties listed</h3>
                    <p className="text-zinc-500 mb-6 max-w-sm mx-auto">Get started by adding your first property to the platform.</p>
                    <Link to="/add-property" className="text-purple-400 font-medium hover:text-purple-300 hover:underline transition-colors">
                        Add your first property
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div key={property.id} className="bg-zinc-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-800 overflow-hidden group hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-900/10">
                            <div className="relative h-48 bg-zinc-800">
                                <img
                                    src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={property.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md
                                    ${property.status === 'active'
                                        ? 'bg-purple-900/40 text-purple-200 border-purple-500/30'
                                        : 'bg-zinc-800/80 text-zinc-400 border-zinc-700'}`}>
                                    {property.status}
                                </span>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors line-clamp-1">{property.title}</h3>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-zinc-400 text-sm">
                                        <MapPin size={16} className="mr-2 text-zinc-500" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                    <div className="flex items-center text-zinc-400 text-sm">
                                        <DollarSign size={16} className="mr-2 text-zinc-500" />
                                        <span className="text-white font-medium">${property.price}</span>
                                        <span className="text-zinc-500 ml-1">/month</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-zinc-800/50">
                                    <Link
                                        to={`/edit-property/${property.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-zinc-700 bg-zinc-800/50 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
                                    >
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(property.id)}
                                        className="p-2 border border-zinc-800 bg-zinc-900/50 text-zinc-500 rounded-lg hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/30 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
