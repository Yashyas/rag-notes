'use server'
import { tavily } from "@tavily/core";
import { sanitizeContent } from "./sanitizeContext";

export async function webSearch(query: string) {
        const client = tavily({apiKey: process.env.TAVILY_API_KEY});
  try {

    const response = await client.search(query, {
      searchDepth: "basic",
      includeAnswer: true,
      maxResults: 3,
    });
    return response.results.map((result) => ({
      title: result.title,
      url: result.url,
      content: sanitizeContent(result.content),
    }));
  } catch (error) {
    return { error: "Could not fetch web results at this time." };
  }
}
