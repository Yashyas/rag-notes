import Groq from "groq-sdk";
import { SearchResult } from "./similaritySearch";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateAnswer(question: string, contextNotes: SearchResult[]) {
    
    if (!contextNotes || contextNotes.length === 0) {
    return "I couldn't find any relevant notes to answer that question.";
  }

  // Convert notes into a single string for the AI
  const contextText = contextNotes
    .map(n => `Title: ${n.title}\nTags: ${n.tags}\nContent: ${n.content}`)
    .join("\n\n---\n\n");

  // RAG Prompt
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant for "Rag-Notes". 
        Use the following notes in the context to answer the user's question. 
        If the answer isn't in the notes, simply say you don't know as there is nothing like that in the notes.`
      },
      {
        role: "user",
        content: `Context from user notes:\n${contextText}\n\nuser Question: ${question}`
      }
    ],
    temperature: 0.4, // Keeps answers factual
  });

  return response.choices[0]?.message?.content || "No answer found.";
}