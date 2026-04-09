import { NotesAppLayout } from '@/components/NotesAppLayout';


export const metadata = {
  title: 'Notes App - RAG Query Interface',
  description: 'A modern notes application with AI-powered search and chat interface',
};

export default function Home() {
  return (
    <main className="w-full h-screen">
      <NotesAppLayout />
    </main>
  );
}
