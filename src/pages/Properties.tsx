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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
                    <p className="text-gray-500">Manage your active listings.</p>
                </div>
                <Link to="/add-property" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus size={18} />
                    Add Property
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading properties...</div>
            ) : properties.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">You haven't listed any properties yet.</p>
                    <Link to="/add-property" className="text-blue-600 font-medium hover:underline">
                        Add your first property
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="relative h-48 bg-gray-200">
                                <img
                                    src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium 
                                    ${property.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {property.status}
                                </span>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{property.title}</h3>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <MapPin size={16} className="mr-2" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <DollarSign size={16} className="mr-2" />
                                        ${property.price}/month
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(property.id)}
                                        className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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
