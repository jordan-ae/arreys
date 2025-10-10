import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProviders(userId: string) {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data;
}

export async function addProvider(
  userId: string,
  provider: { name: string; clientId: string; clientSecret: string; scopes: string[] }
) {
  const { data, error } = await supabase
    .from('providers')
    .insert({
      user_id: userId,
      provider_name: provider.name,
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
      scopes: provider.scopes,
    })
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function getAllProviders() {
    const {data, error} = await supabase.from("providers").select("*")
    if (error) throw new Error(error.message)
    return data
}