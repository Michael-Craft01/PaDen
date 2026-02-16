import { supabase } from './supabase';

export interface PropertyFilters {
    location?: string;
    maxPrice?: number;
    minPrice?: number;
    type?: string; // room, cottage, apartment, boarding, etc.
    limit?: number;
}

export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    type: string;
    latitude?: number;
    longitude?: number;
    owner_id?: string;
    images?: string[];
    created_at?: string;
}

/**
 * Search properties in Supabase based on parsed AI filters.
 */
export async function searchProperties(filters: PropertyFilters): Promise<Property[]> {
    console.log('🔍 Searching properties with filters:', JSON.stringify(filters));

    let query = supabase
        .from('properties')
        .select('*');

    // Apply filters
    if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        query = query.lte('price', filters.maxPrice);
    }

    if (filters.minPrice !== undefined && filters.minPrice !== null) {
        query = query.gte('price', filters.minPrice);
    }

    if (filters.type) {
        query = query.ilike('type', `%${filters.type}%`);
    }

    // Limit results (WhatsApp messages shouldn't be too long)
    const limit = filters.limit || 5;
    query = query.limit(limit).order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
        console.error('❌ Supabase query error:', error.message);
        return [];
    }

    console.log(`✅ Found ${data?.length || 0} properties`);
    return (data as Property[]) || [];
}
