import { create } from 'zustand';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: Date;
  createdAt: Date;
}

interface NotesStore {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  activeMobileTab: 'tasks' | 'notes' | 'chat';
  deleteDialogOpen: boolean;
  deleteTargetId: string | null;

  // Note actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setSelectedNoteId: (id: string | null) => void;

  // Search actions
  setSearchQuery: (query: string) => void;

  // Mobile tab actions
  setActiveMobileTab: (tab: 'tasks' | 'notes' | 'chat') => void;

  // Delete dialog actions
  openDeleteDialog: (noteId: string) => void;
  closeDeleteDialog: () => void;

}

export const useNotesStore = create<NotesStore>((set) => ({
  notes: [
    {
      id: '1',
      title: 'Welcome to Notes App',
      content: 'This is your first note. Click on other notes to view them, or create a new one!',
      tags: ['welcome', 'tutorial'],
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Meeting Notes',
      content: 'Discussed project timeline and deliverables. Next meeting scheduled for next week.',
      tags: ['work', 'meeting'],
      updatedAt: new Date(Date.now() - 86400000),
      createdAt: new Date(Date.now() - 86400000),
    },
  ],
  selectedNoteId: null,
  searchQuery: '',
  activeMobileTab: 'notes',
  deleteDialogOpen: false,
  deleteTargetId: null,

  setNotes: (notes) => set({ notes }),

  addNote: (note) =>
    set((state) => ({
      notes: [note, ...state.notes],
      selectedNoteId: note.id,
    })),

  updateNote: (id, noteData) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...noteData,
              lastUpdated: new Date(),
            }
          : note
      ),
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
    })),

  setSelectedNoteId: (id) => set({ selectedNoteId: id }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveMobileTab: (tab) => set({ activeMobileTab: tab }),

  openDeleteDialog: (noteId) =>
    set({
      deleteDialogOpen: true,
      deleteTargetId: noteId,
    }),

  closeDeleteDialog: () =>
    set({
      deleteDialogOpen: false,
      deleteTargetId: null,
    }),

}));
