import { createClient } from "@supabase/supabase-js";
import { EmbedService } from "./embedService";
import { CohereClient } from "cohere-ai";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_DATA_API!,
  process.env.SERVICE_ROLE_KEY!,
);

export const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  tags: string[];
  similarity: number;
}

export async function similaritySearch(vector: number[]) {
  const { data, error } = await supabase.rpc("match_notes", {
    query_embedding: vector,
    match_threshold: 0.1,
    match_count: 10,
  });

  if (error) throw { "Semantic search error": String };
  // console.log(data)
  return (data as SearchResult[]) ?? [];
}

// rpc based keyWordSearch
export async function keyWordSearch(query: string) {
  const { data, error } = await supabase.rpc("keyword_search_notes", {
    search_query: query,
    match_limit: 10,
  });

  if (error) throw { "Keyword search error": String };
  // console.log(data)
  return data;
}

export async function find_similar_notes(query: string) {
  // generate embedding
  const embedding = await EmbedService.generateEmbedding(query);
  // search similar notes
  const similarNotes = await similaritySearch(embedding);
  const keyWordSimilarNotes = await keyWordSearch(query);

  const uniqueNoteMap = new Map<string, SearchResult>();

  [...similarNotes, ...keyWordSimilarNotes].forEach((note) => {
    if (!uniqueNoteMap.has(note.id)) {
      uniqueNoteMap.set(note.id, note);
    }
  });

  const candidateNotes = Array.from(uniqueNoteMap.values());
  if (candidateNotes.length === 0) return [];

  const documentForReranking = candidateNotes.map((note) => ({
    text: `Title: ${note.title} | Tags: ${note.tags.join(", ")} | Content: ${note.content}`,
  }));

  const rerankResponse = await cohere.rerank({
    model: "rerank-english-v3.0",
    query: query,
    documents: documentForReranking,
    topN: 3,
  });

  const finalRerankedNotes = rerankResponse.results.map(result =>{
    const originalNote = candidateNotes[result.index]
    return {
      ...originalNote,
      relevanceScore: result.relevanceScore,
    }
  })
  // console.log(finalRerankedNotes)
  return finalRerankedNotes;
}
