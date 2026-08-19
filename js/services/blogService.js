import { supabase } from '../supabase.js';

export const BlogService = {
  /**
   * Fetches all published blog posts, ordered by latest first
   * @returns {Promise<Object>} Object containing data or error
   */
  async getPublishedPosts() {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, content, image_url, published_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching blogs:', error);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Service error fetching blogs:', error);
      return { 
        data: null, 
        error: 'Unable to load our latest updates right now. Please try again later.' 
      };
    }
  }
};
