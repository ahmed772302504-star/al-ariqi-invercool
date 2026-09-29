import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lijxsxutdgxkzdreryzf.supabase.co';
const supabaseAnonKey = 'sb_publishable_GoNBowNZT1ECCEUlXWjiAQ_RCmoTz9o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
