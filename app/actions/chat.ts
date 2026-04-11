"use server"
import { EmbedService } from "@/lib/embedService";
import { generateAnswer } from "@/lib/generateAnswers";
import { similaritySearch } from "@/lib/similaritySearch";

export async function askQuestions(question: string) {
  try {
    // generate embedding 
    const embedding = await EmbedService.generateEmbedding(question);

    // search similar notes 
    const similarNotes = await similaritySearch(embedding);

    // generate answers 
    const answer = await generateAnswer(question, similarNotes);
    return { answer, sources: similarNotes.map((n) => n.title) };

  } catch (error) {
    return { error: "Something went wrong" };
  }
}
