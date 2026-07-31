import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = 'https://tbiveqrxupdsthddpfwg.supabase.co';
const supabaseKey = 'sb_publishable_YH3tQX67-o-2626e-nVmqg_8_iG4MOQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
