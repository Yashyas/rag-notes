"use server"
import { generateText, stepCountIs } from "ai";
import { groq } from "@ai-sdk/groq";
import { agentTools } from "@/lib/tools";
import { text } from "stream/consumers";

export async function askQuestions(userPrompt: string) {
  const {text,toolCalls} = await generateText({
    model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
    tools: agentTools,
    stopWhen: stepCountIs(50),
    // maxRetries:13,
    system: `you are a SmartNotes Agent.
OPERATIONAL LOGIC:
    1. ALWAYS call 'semanticSearch' first for any query about user data.
    2. If the data exists in notes: Answer using that data.
    3. If the data DOES NOT exist in notes: 
       - Explicitly state: "I couldn't find this in your notes."
       - Then provide your own knowledge but prefix it with "Source: LLM".
    
    CRUD ACTIONS:
    - Use 'createNote' ONLY when the user explicitly asks to save/create.
    - Use 'updateNote' ONLY when the user explicitly asks to change an existing note.`,
    prompt: userPrompt,
    onStepFinish({ text, toolCalls, toolResults }) {
      console.log(`Step finished. Agent called ${toolCalls.length} tools.`);
    },
  });
  return {answer:text,sources: toolCalls.map(call => call.toolName)};
}
