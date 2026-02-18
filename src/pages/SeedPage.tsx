import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Building2, Check, AlertCircle, Loader2 } from 'lucide-react';

const LOCATIONS = [
    'Avondale, Harare', 'Borrowdale, Harare', 'Highlands, Harare', 'Mount Pleasant, Harare',
    'Greendale, Harare', 'Mabelreign, Harare', 'Hatfield, Harare', 'Glen Lorne, Harare',
    'Bulawayo Central, Bulawayo', 'Hillside, Bulawayo', 'Suburbs, Bulawayo', 'Kumalo, Bulawayo',
    'Victoria Falls, Matabeleland North', 'Mutare, Manicaland', 'Gweru, Midlands'
];

// Curated Unsplash IDs: Modern African Homes, Interiors, and Black Families/Lifestyle
const HOUSE_IMAGES = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', // Luxury Modern
    'https://images.unsplash.com/photo-1600596542815-2250c38ae058?auto=format&fit=crop&w=800&q=80', // Villa with Pool
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', // Modern Balcony
    'https://images.unsplash.com/photo-1512918760383-eda2723ad6e1?auto=format&fit=crop&w=800&q=80', // Apartment Complex
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', // Contemporary
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80', // Suburban Home
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80', // Cottage Style
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80', // Small House
    'https://images.unsplash.com/photo-1599809275375-dbece0d905c3?auto=format&fit=crop&w=800&q=80', // Garden View
    'https://images.unsplash.com/photo-1593604340846-4fbe976bd9b7?auto=format&fit=crop&w=800&q=80', // Sunny Villa
];

const LIFESTYLE_IMAGES = [
    'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80', // Moving In (Couple)
    'https://images.unsplash.com/photo-1566753323558-7c8976cc0b17?auto=format&fit=crop&w=800&q=80', // Couple at Home
    'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80', // Woman Relaxing
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80', // Man at Home
    'https://images.unsplash.com/photo-1556910638-6f7053531e43?auto=format&fit=crop&w=800&q=80', // Interior Living Room
    'https://images.unsplash.com/photo-1616486029423-aaa4789e2c97?auto=format&fit=crop&w=800&q=80', // Modern Interior
    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80', // Nice Kitchen
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80', // Family Living Room
];

const TITLES = [
    'Modern 3-Bed House with Solar & Borehole', 'Secure Garden Flat (Unfurnished)', 'Luxury Apartment in Borrowdale Brooke',
    'Cozy Cottage with Good Security', 'Spacious Family Home near Schools', 'Executive Townhouse - New Build',
    'Affordable Studio in Avondale', 'Prime Location 4-Bed Villa', 'Newly Renovated Flat with Balcony'
];

export default function SeedPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [successCount, setSuccessCount] = useState(0);

    const generateProperties = async () => {
        if (!user) return;
        setLoading(true);
        setStatus('Starting generation...');
        setSuccessCount(0);

        const propertiesToInsert = [];

        for (let i = 0; i < 50; i++) {
            const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
            const title = TITLES[Math.floor(Math.random() * TITLES.length)];
            const price = Math.floor(Math.random() * (2500 - 300) + 300);

            // Pick one house image and one lifestyle/interior image
            const mainImage = HOUSE_IMAGES[Math.floor(Math.random() * HOUSE_IMAGES.length)];
            const secondImage = LIFESTYLE_IMAGES[Math.floor(Math.random() * LIFESTYLE_IMAGES.length)];

            propertiesToInsert.push({
                owner_id: user.id,
                title: `${title} - Ref ${1000 + i}`,
                description: `Experience comfortable living in ${location.split(',')[0]}. This property features reliable water (borehole), solar backup power, and 24/7 security. Perfect for professionals or a growing family. Verified by PaDen agents.`,
                price: price,
                location: location,
                address: `${Math.floor(Math.random() * 100) + 1} ${['Samora Machel', 'Second St', 'Borrowdale Rd', 'Churchill Ave'][Math.floor(Math.random() * 4)]}, ${location.split(',')[0]}`,
                amenities: ['WiFi', 'Security', 'Parking', 'Borehole', 'Solar', Math.random() > 0.5 ? 'Pool' : 'Garden'],
                images: [mainImage, secondImage],
                status: 'active',
                created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
            });
        }

        try {
            // Insert in chunks of 10 to avoid payload limits
            const chunkSize = 10;
            for (let i = 0; i < propertiesToInsert.length; i += chunkSize) {
                const chunk = propertiesToInsert.slice(i, i + chunkSize);
                setStatus(`Inserting batch ${Math.floor(i / chunkSize) + 1}...`);

                const { error } = await supabase.from('properties').insert(chunk);
                if (error) throw error;

                setSuccessCount(prev => prev + chunk.length);
                await new Promise(r => setTimeout(r, 500)); // Slight delay
            }

            setStatus('Complete! 50 Properties Added.');
        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Building2 className="text-purple-500" size={32} />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Database Seeder
                    </h1>
                    <p className="text-zinc-400 mb-8">
                        Generate 50 realistic demo properties for testing.
                        <br />
                        <span className="text-yellow-500 text-xs">Warning: This will add dummy data to your live database.</span>
                    </p>

                    {!loading && !status && (
                        <button
                            onClick={generateProperties}
                            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
                        >
                            Generate 50 Properties
                        </button>
                    )}

                    {loading && (
                        <div className="space-y-4">
                            <Loader2 className="animate-spin text-purple-500 mx-auto" size={32} />
                            <p className="text-zinc-300 font-medium">{status}</p>
                            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-purple-500 h-full transition-all duration-300"
                                    style={{ width: `${(successCount / 50) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {!loading && status && (
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                                <Check className="text-green-500" size={24} />
                            </div>
                            <p className="text-green-400 font-medium">{status}</p>
                            <button
                                onClick={() => setStatus(null)}
                                className="text-zinc-500 hover:text-white text-sm underline"
                            >
                                Reset
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
