import { supabase } from '../supabase.js';

export const ProductService = {
  async fetchActiveProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: null, error };
    }
  }
};
