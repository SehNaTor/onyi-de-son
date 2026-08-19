import { supabase } from '../supabase.js';

export const AnalyticsService = {
  /**
   * Fetches analytics data from all relevant tables
   * @returns {Promise<Object>} Aggregated dashboard statistics
   */
  async getDashboardStats() {
    try {
      // Execute all count queries in parallel for efficiency
      const [
        galleryResult,
        projectsResult,
        productsResult,
        contactsResult,
        blogsResult
      ] = await Promise.all([
        // For media tables, we fetch the media_type to do our aggregation.
        // We only select the required column to minimize payload size.
        supabase.from('gallery').select('media_type'),
        supabase.from('projects').select('media_type'),
        supabase.from('products').select('media_type'),
        
        // For contacts, we just need the exact count, not the rows
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        
        // For blogs, we fetch the is_published status
        supabase.from('blogs').select('is_published')
      ]);

      // Check for errors in any request
      if (galleryResult.error) throw galleryResult.error;
      if (projectsResult.error) throw projectsResult.error;
      if (productsResult.error) throw productsResult.error;
      if (contactsResult.error) throw contactsResult.error;
      if (blogsResult.error) throw blogsResult.error;

      // Helper to process media counts
      const processMedia = (data) => {
        let images = 0;
        let videos = 0;
        
        if (data && data.length > 0) {
          data.forEach(item => {
            // Null or missing media_type defaults to "image" for legacy support
            if (item.media_type === 'video') {
              videos++;
            } else {
              images++;
            }
          });
        }
        
        return {
          images,
          videos,
          total: images + videos
        };
      };

      const galleryStats = processMedia(galleryResult.data);
      const projectStats = processMedia(projectsResult.data);
      const productStats = processMedia(productsResult.data);
      const contactsCount = contactsResult.count || 0;
      
      // Process Blogs
      let publishedBlogs = 0;
      let draftBlogs = 0;
      if (blogsResult.data) {
        blogsResult.data.forEach(blog => {
          if (blog.is_published) publishedBlogs++;
          else draftBlogs++;
        });
      }
      const totalBlogs = publishedBlogs + draftBlogs;

      // Aggregate totals
      const totalImages = galleryStats.images + projectStats.images + productStats.images;
      const totalVideos = galleryStats.videos + projectStats.videos + productStats.videos;
      const totalMedia = totalImages + totalVideos;

      return {
        data: {
          totals: {
            images: totalImages,
            videos: totalVideos,
            media: totalMedia,
            contacts: contactsCount,
            blogs: {
              total: totalBlogs,
              published: publishedBlogs,
              draft: draftBlogs
            }
          },
          breakdown: {
            gallery: galleryStats,
            projects: projectStats,
            products: productStats
          }
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        data: null,
        error: error.message || 'An error occurred while fetching analytics.'
      };
    }
  }
};
