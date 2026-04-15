import { z } from "zod";
import { tool } from "ai";
import { find_similar_notes } from "./similaritySearch";
import { createNote, updateNoteDatabase } from "@/app/actions/notes";

export const agentTools = {
    // Semantic search 
  semanticSearch: tool({
    description:
      "Search through the private notes of user to find relevant information using vector similarity.",
    inputSchema: z.object({
      query: z.string().describe("The search query for finding related notes"),
    }),
    execute: async ({query}) => {
        const data = await find_similar_notes(query)
        return data
    }
  }),

  createNote: tool({
    description: 'Create a new note for the user.',
    inputSchema: z.object({
      title: z.string().describe('Title of the note'),
      content: z.string().describe('Body content of the note'),
      tags: z.string().array().optional().describe('tags to better decribe,group and filter the note content'),
    }),
    execute: async ({title,content,tags}) =>{
        return await createNote(content,title,tags ?? [])
    }
  }),

   updateNote: tool({
    description: 'Update an existing note for the user.',
    inputSchema: z.object({
      id: z.string().describe('ID of the note that is to be updated (find id using semanticSearch tool)'),  
      title: z.string().describe('Title of the note'),
      content: z.string().describe('Body content of the note'),
      tags: z.string().array().describe('tags to better decribe,group and filter the note content'),
    }),
    execute: async ({id,title,content,tags}) =>{
        return await updateNoteDatabase(id,content,title,tags)
    }
  })
};
