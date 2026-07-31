// Import the Supabase client from CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// TODO: Replace with actual Supabase Project URL and Anon Key
const supabaseUrl = 'YOUR_SUPABASE_URL_HERE';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize and export the client
export const supabase = createClient(supabaseUrl, supabaseKey);
