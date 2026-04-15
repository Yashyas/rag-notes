import {createClient} from '@supabase/supabase-js'
import { EmbedService } from './embedService';

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
    match_threshold: 0.2,
    match_count: 5,
  });

  if (error) throw error;
  return data as SearchResult[] ?? [];
}
export async function find_similar_notes(query:string){
      // generate embedding 
      const embedding = await EmbedService.generateEmbedding(query);
      // search similar notes 
      const similarNotes = await similaritySearch(embedding);
      if (similarNotes) return similarNotes
      else return {success:false, error:"Failed to process symentic search due to some internal error."}
}