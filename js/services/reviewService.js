import { supabase } from '../supabase.js';

export const ReviewService = {
  async getApprovedReviews() {
    try {
      const { data, error } = await supabase
        .schema('public')
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching approved reviews:', error);
      return { data: [], error: 'Unable to load customer reviews right now.' };
    }
  },

  async getAllReviews() {
    try {
      const { data, error } = await supabase
        .schema('public')
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.debug('[ReviewService] admin getAllReviews response', {
        rowCount: data?.length || 0,
        error: null
      });
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      console.error('[ReviewService] admin getAllReviews failure details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
      return {
        data: [],
        error: error?.message || 'Unable to load review submissions.'
      };
    }
  },

  async submitReview(payload) {
    try {
      const { data, error } = await supabase
        .schema('public')
        .from('reviews')
        .insert({
          customer_name: payload.customer_name.trim(),
          avatar_url: payload.avatar_url || null,
          rating: Number(payload.rating),
          review: payload.review.trim(),
          status: 'pending'
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error submitting review:', error);
      return {
        data: null,
        error: error?.message || 'Your review could not be submitted right now.'
      };
    }
  },

  async updateReviewStatus(id, status) {
    try {
      const { data, error } = await supabase
        .schema('public')
        .from('reviews')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
          .eq('id', id)
          .select('id, status')
          .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating review status:', error);
      return {
        data: null,
        error: error?.message || 'Unable to update this review.'
      };
    }
  },

  async deleteReview(id) {
    if (!id || (typeof id === 'string' && !id.trim()) || id === 'undefined' || id === 'null') {
      console.error('[ReviewService] deleteReview: Invalid review ID provided:', id);
      return {
        data: null,
        error: 'A valid review ID is required.'
      };
    }

    try {
      const cleanId = typeof id === 'string' ? id.trim() : id;
      const { data, error } = await supabase
        .schema('public')
        .from('reviews')
        .delete()
        .eq('id', cleanId)
        .select();

      if (error) {
        console.error('[ReviewService] Error deleting review from Supabase:', error);
        return {
          data: null,
          error: error.message || 'Database error occurred while deleting review.'
        };
      }

      if (!data || data.length === 0) {
        console.warn('[ReviewService] Delete matched 0 rows for review ID:', cleanId);
        return {
          data: null,
          error: 'Review could not be deleted. It may have already been removed or permission was denied.'
        };
      }

      return { data: data[0], error: null };
    } catch (error) {
      console.error('[ReviewService] Unexpected error deleting review:', error);
      return {
        data: null,
        error: error?.message || 'Unable to delete this review.'
      };
    }
  }
};
