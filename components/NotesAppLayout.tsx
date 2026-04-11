'use client';

import { useNotesStore } from '@/lib/store/notesStore';
import { TaskList } from './TaskList';
import { NoteEditor } from './NoteEditor';
import { ChatInterface } from './ChatInterface';
import { DeleteNoteDialog } from './DeleteNoteDialog';
import { Button } from '@/components/ui/button';
import { ChatCircleIcon, FileTextIcon, ListChecksIcon } from '@phosphor-icons/react';

export function NotesAppLayout() {
  const activeMobileTab = useNotesStore((state) => state.activeMobileTab);
  const setActiveMobileTab = useNotesStore((state) => state.setActiveMobileTab);

  const renderMobileContent = () => {
    switch (activeMobileTab) {
      case 'tasks':
        return <TaskList />;
      case 'notes':
        return <NoteEditor />;
      case 'chat':
        return <ChatInterface />;
    }
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen gap-0 bg-background ">
        {/* TaskList - 20vw */}
        <div className="w-[20vw] border-r flex flex-col overflow-y-auto">
          <TaskList />
        </div>

        {/* NoteEditor - 45vw */}
        <div className="w-[45vw] border-r flex flex-col">
          <NoteEditor />
        </div>

        {/* ChatInterface - 35vw */}
        <div className="w-[35vw] flex flex-col">
          <ChatInterface />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-dvh bg-background ">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto " >
          {renderMobileContent()}
        </div>

        {/* Bottom Tab Navigation */}
        <div className="safe-area-bottom border-t bg-background p-2 flex gap-1 justify-around  shrink-0">
          <Button
            variant={activeMobileTab === 'tasks' ? 'default' : 'ghost'}
            size="lg"
            onClick={() => setActiveMobileTab('tasks')}
            className="flex-1 gap-2"
          >
            <ListChecksIcon className="w-8 h-8" />
            <span className="hidden sm:inline text-base">Tasks</span>
          </Button>
          <Button
            variant={activeMobileTab === 'notes' ? 'default' : 'ghost'}
            size="lg"
            onClick={() => setActiveMobileTab('notes')}
            className="flex-1 gap-2"
          >
            <FileTextIcon className="w-8 h-8" />
            <span className="hidden sm:inline text-base">Notes</span>
          </Button>
          <Button
            variant={activeMobileTab === 'chat' ? 'default' : 'ghost'}
            size="lg"
            onClick={() => setActiveMobileTab('chat')}
            className="flex-1 gap-2"
          >
            <ChatCircleIcon className="w-8 h-8" />
            <span className="hidden sm:inline text-base">Chat</span>
          </Button>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteNoteDialog />
    </>
  );
}
