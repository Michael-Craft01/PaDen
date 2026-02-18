import { supabase } from './supabase';

export interface PropertyFilters {
    location?: string;
    maxPrice?: number;
    minPrice?: number;
    query?: string; // Broad text search
    title?: string; // Specific title search
    limit?: number;
}

export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    // type: string; // Removed as it doesn't exist in DB
    amenities?: string; // Exists in DB
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

    // 1. Specific Location (if parsed)
    if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
    }

    // 2. Specific Title (if parsed - e.g. "Goshen House")
    if (filters.title) {
        query = query.ilike('title', `%${filters.title}%`);
    }

    // 3. Price Range
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        query = query.lte('price', filters.maxPrice);
    }
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
        query = query.gte('price', filters.minPrice);
    }

    // 4. Broad Text Search (replaces 'type')
    // Search in Title OR Description OR Location OR Amenities
    if (filters.query) {
        const q = filters.query;
        // ilike syntax for OR: column.ilike.pattern,column2.ilike.pattern
        const orClause = `title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%`;
        query = query.or(orClause);
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
