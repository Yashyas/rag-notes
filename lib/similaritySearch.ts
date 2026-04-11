import {createClient} from '@supabase/supabase-js'

export const supabaseVector = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_DATA_API!,
    process.env.SERVICE_ROLE_KEY!
)
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  tags: string[];
  similarity: number;
}

export async function similaritySearch(vector: number[]) {
  const { data, error } = await supabaseVector.rpc('match_notes', {
    query_embedding: vector,
    match_threshold: 0.4,
    match_count: 5,
  });

  if (error) throw error;
  return data as SearchResult[] ?? [];
}