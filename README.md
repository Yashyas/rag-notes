# RAG Notes

An agentic AI-powered notes app with hybrid search, multi-model support, and real-time streaming UI.

🔗 **[Live Demo](https://rag-notes-five.vercel.app/)** · **[GitHub](https://github.com/Yashyas/rag-notes)**

> ⚠️ Demo screenshots coming soon

---

## What it does

RAG Notes is more than a notes app — it's an AI agent that can search, create, and update your notes intelligently. Ask it a question and it retrieves the most relevant notes using hybrid search or web searches ,reasons over them, and responds in real time.

---

## Features

- **Hybrid Search** — Combines semantic search (AllMiniLM embeddings) and keyword search via Supabase RPC, routed through a Cohere Reranker for best results
- **Agentic CRUD** — The AI model performs create, read, and update operations on notes via tool calling
- **Web Search** — Integrated Tavily search for real-time information beyond your notes
- **Streaming UI** — Real-time streaming responses with visible reasoning traces and tool calls for models that support it
- **Multi-model Support** — Switch between 5 open-source LLMs depending on your task:
  - Llama Scout 4
  - Llama 3.3 70B
  - GPT OSS 120B
  - GPT OSS 20B
  - Qwen3 32B

---

## Architecture

```
User Query
    │
    ▼
Hybrid Search
├── Semantic Search  (AllMiniLM Embeddings → Supabase RPC)
└── Keyword Search   (BM25 → Supabase RPC)
    │
    ▼
Cohere Reranker  (top-K results, configurable 1–10)
    │
    ▼
LLM Inference  (tool calling → CRUD / Web Search / Response)
    │
    ▼
Streaming UI  (reasoning + tool call traces visible)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript , ShadCN ,TailwindCss|
| AI SDK | Vercel AI SDK |
| Database | Supabase, Prisma |
| Embeddings | AllMiniLM (Hugging Face) |
| Reranker | Cohere |
| Web Search | Tavily |
| LLM Providers | Groq, Hugging Face |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- API keys for Cohere, Tavily, Groq, and Hugging Face

### Installation

```bash
git clone https://github.com/Yashyas/rag-notes.git
cd rag-notes
npm install
```

### Environment Variables

Create a `.env` file in the root directory or rename .env.example file to .env 

```env
# Connect to Supabase via connection pooling
DATABASE_URL=""

# Direct connection to the database. Used for migrations
DIRECT_URL=""

# Hugging fce api key
HUGGINGFACE_API_KEY=""

# Supabase service_role secret key 
SERVICE_ROLE_KEY=""

NEXT_PUBLIC_SUPABASE_DATA_API=""

# groq api 
GROQ_API_KEY=""

# cohere api 
COHERE_API_KEY=""

# tavily web search 
TAVILY_API_KEY=""
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Author

Built by [Yashyas](https://github.com/Yashyas) — learning AI engineering from scratch, one project at a time.