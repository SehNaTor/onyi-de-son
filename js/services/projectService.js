import { supabase } from '../supabase.js';

/**
 * Fetches active projects from the Supabase 'projects' table.
 * Sorts them by display_order ascending.
 * @returns {Promise<Array>} Array of project objects
 */
export async function fetchActiveProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, description, category, image_url, featured, display_order, status')
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects from Supabase:', error.message);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('ProjectService: fetchActiveProjects failed.', err);
    // Return null or throw to let the UI layer handle the error state
    return null; 
  }
}
