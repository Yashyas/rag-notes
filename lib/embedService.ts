export const EmbedService = {

  async generateEmbedding(data:string): Promise<number[]> {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: data }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API failed with status: ${response.status}`);
    }

    const vector = await response.json();
 
    return Array.isArray(vector[0]) ? vector[0] : vector; 
  }
}