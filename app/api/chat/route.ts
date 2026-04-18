import { groq } from "@ai-sdk/groq";
import { streamText, stepCountIs, convertToModelMessages, UIMessage } from "ai";
import { agentTools } from "@/lib/tools";

export async function POST(req: Request) {
  const { messages ,model = "meta-llama/llama-4-scout-17b-16e-instruct"}: { messages: UIMessage[],model:string } = await req.json();

  const result = streamText({
    model: groq(model),
    messages: await convertToModelMessages(messages),
    tools: agentTools,
    stopWhen: stepCountIs(5),
    system: `you are SmartNotes Agent - precise,context-aware note assistant.
OPERATIONAL LOGIC:
    1. ALWAYS call 'semanticSearch' first for any query about user data except when asked for CRUD or ALL NOTES or WEB SEARCH.
    2. If the data exists in notes: Answer using that data.
    3. If the data DOES NOT exist in notes: 
       - Explicitly state: "I couldn't find this in your notes."
       - Then provide your own knowledge or through web search but prefix it with Source: "LLM" or "WEB".
    
    CRUD ACTIONS:
    - Use 'createNote' ONLY when the user explicitly asks to save/create .
    - Use 'updateNote' ONLY when the user explicitly asks to add or change an existing note (Never guess the id perform 'semanticSearch' for finding note and its ID).
    - Use 'fetchALLNotes' ONLY when user explicitly asks to summarize or extract data from all notes.

    WEB SEARCH:
    - Use 'webSearch' ONLY when user explicitly asks for current data, web search or the data is not available in database.
    `,
    onStepFinish({ reasoningText, toolCalls }) {
      console.log(`Reasoning: ${reasoningText}`);
      console.log(
        `Tools called: ${toolCalls.map((c) => c.toolName).join(", ")}`,
      );
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
