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
  },

  // --- Products ---
  async fetchProducts() {
    return await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true });
  },

  async fetchActiveProducts() {
    return await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
  },

  async saveProduct(product) {
    if (product.id) {
      return await supabase.from('products').update(product).eq('id', product.id);
    } else {
      return await supabase.from('products').insert([product]);
    }
  },

  async deleteProduct(id) {
    const response = await supabase.from('products').delete().eq('id', id).select();
    if (!response.error && response.data && response.data.length === 0) {
      return { error: new Error('Permission denied or item not found. 0 rows deleted.') };
    }
    return response;
  },

  // --- Blogs ---
  async fetchBlogs() {
    return await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
  },

  async saveBlog(blog) {
    if (blog.id) {
      return await supabase.from('blogs').update(blog).eq('id', blog.id);
    } else {
      return await supabase.from('blogs').insert([blog]);
    }
  },

  async deleteBlog(id) {
    const response = await supabase.from('blogs').delete().eq('id', id).select();
    if (!response.error && response.data && response.data.length === 0) {
      return { error: new Error('Permission denied or item not found. 0 rows deleted.') };
    }
    return response;
  }
};
