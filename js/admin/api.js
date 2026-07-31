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
    return await supabase.from('gallery').delete().eq('id', id);
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
    return await supabase.from('projects').delete().eq('id', id);
  }
};
