import { supabase } from '../supabase.js';

export const API = {
  // --- Gallery ---
  async fetchGallery() {
    return await supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true });
  },

  async saveGalleryItem(item) {
    if (item.id) {
      return await supabase.from('gallery').update(item).eq('id', item.id);
    } else {
      return await supabase.from('gallery').insert([item]);
    }
  },

  async deleteGalleryItem(id) {
    const response = await supabase.from('gallery').delete().eq('id', id).select();
    if (!response.error && response.data && response.data.length === 0) {
      return { error: new Error('Permission denied or item not found. 0 rows deleted.') };
    }
    return response;
  },

  // --- Projects ---
  async fetchProjects() {
    return await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
  },

  async saveProject(project) {
    if (project.id) {
      return await supabase.from('projects').update(project).eq('id', project.id);
    } else {
      return await supabase.from('projects').insert([project]);
    }
  },

  async deleteProject(id) {
    const response = await supabase.from('projects').delete().eq('id', id).select();
    if (!response.error && response.data && response.data.length === 0) {
      return { error: new Error('Permission denied or item not found. 0 rows deleted.') };
    }
    return response;
  }
};
