// import Groq from "groq-sdk";
// import { SearchResult } from "./similaritySearch";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function generateAnswer(
//   question: string,
//   contextNotes: SearchResult[],
// ) {
//   if (!contextNotes || contextNotes.length === 0) {
//     return "I couldn't find any relevant notes to answer that question.";
//   }

//   // Convert notes into a single string for the AI
//   const contextText = contextNotes
//     .map((n) => `Title: ${n.title}\nTags: ${n.tags}\nContent: ${n.content}`)
//     .join("\n\n---\n\n");

//   // RAG Prompt
//   const response = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [
//       {
//         role: "system",
//         content: `You are a helpful assistant for "Rag-Notes". 
//         Use the provided context to answer the user's question. 

//         FORMATTING RULES:
//         1. Use clear Markdown for all responses.
//         2. Use "###" for section headers if the answer is long.
//         3. Use double line breaks between paragraphs and list items to ensure white space.
//         4. Use bold text (**phrase**) for key terms to make them scannable.
//         5. If using a list, use a numbered list (1., 2., 3.) with a blank line between each item.
//          6. If the answer is not in the notes, say: "I'm sorry, I couldn't find that in your notes."`,
//       },
//       {
//         role: "user",
//         content: `Context from user notes:\n${contextText}\n\nuser Question: ${question}`,
//       },
//     ],
//     temperature: 0.4, // Keeps answers factual
//   });

//   return response.choices[0]?.message?.content || "No answer found.";
// }
