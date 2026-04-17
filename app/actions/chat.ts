"use server"
import { generateText, stepCountIs } from "ai";
import { groq } from "@ai-sdk/groq";
import { agentTools } from "@/lib/tools";

export async function askQuestions(userPrompt: string,selectedNoteId?: string) {
  const {text,toolCalls} = await generateText({
    model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
    tools: agentTools,
    stopWhen: stepCountIs(6),
    // maxRetries:13,
    system: `you are SmartNotes Agent - precise,context-aware note assistant.
OPERATIONAL LOGIC:
    1. ALWAYS call 'semanticSearch' first for any query about user data except when asked for CRUD or ALL NOTES.
    2. If the data exists in notes: Answer using that data.
    3. If the data DOES NOT exist in notes: 
       - Explicitly state: "I couldn't find this in your notes."
       - Then provide your own knowledge but prefix it with "Source: LLM".
    
    CRUD ACTIONS:
    - Use 'createNote' ONLY when the user explicitly asks to save/create .
    - Use 'updateNote' ONLY when the user explicitly asks to add or change an existing note .
    - Use 'fetchALLNotes' ONLY when user explicitly asks to summarize or extract data from all notes.
    `,
    prompt: userPrompt,
    onStepFinish({ reasoningText,toolCalls}) {
      console.log(`Reasoning- ${reasoningText}`)
      console.log(`Step finished. Agent called ${toolCalls.map(call => call.toolName)} tool.`);
      
    },
  });
  return {answer:text,sources: toolCalls.map(call => call.toolName)};
}
