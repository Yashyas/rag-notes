'use client';

import { useMemo } from 'react';
import { useNotesStore } from '@/lib/store/notesStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MagnifyingGlassIcon, TrashIcon } from '@phosphor-icons/react';

export function TaskList() {
  const notes = useNotesStore((state) => state.notes);
  const searchQuery = useNotesStore((state) => state.searchQuery);
  const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
  const setSearchQuery = useNotesStore((state) => state.setSearchQuery);
  const setSelectedNoteId = useNotesStore((state) => state.setSelectedNoteId);
  const openDeleteDialog = useNotesStore((state) => state.openDeleteDialog);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;

    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Search Header */}
      <div className="p-4 border-b">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <Card
                key={note.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedNoteId === note.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setSelectedNoteId(note.id)}
              >
                <div className="space-y-2">
                  {/* Title */}
                  <h3
                    className={`font-semibold truncate ${
                      selectedNoteId === note.id
                        ? 'text-primary-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {note.title}
                  </h3>

                  {/* Content Preview */}
                  <p
                    className={`text-sm line-clamp-2 ${
                      selectedNoteId === note.id
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {note.content}
                  </p>

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedNoteId === note.id ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{note.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer: Date and Delete */}
                  <div className="flex items-center justify-between pt-2 border-t border-current opacity-50">
                    <span
                      className={`text-xs ${
                        selectedNoteId === note.id
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {new Date(note.lastUpdated).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(note.id);
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
