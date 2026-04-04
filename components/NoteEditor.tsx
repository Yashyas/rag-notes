'use client';

import { useState, useEffect } from 'react';
import { useNotesStore, Note } from '@/lib/store/notesStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PlusIcon, XIcon } from '@phosphor-icons/react';

export function NoteEditor() {
  const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
  const notes = useNotesStore((state) => state.notes);
  const updateNote = useNotesStore((state) => state.updateNote);
  const addNote = useNotesStore((state) => state.addNote);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setTags(selectedNote.tags);
      setTagInput('');
      setIsDirty(false);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
      setIsDirty(false);
    }
  }, [selectedNote]);

  // Track if form is dirty
  useEffect(() => {
    if (!selectedNote) {
      setIsDirty(title !== '' || content !== '' || tags.length > 0);
    } else {
      setIsDirty(
        title !== selectedNote.title ||
        content !== selectedNote.content ||
        JSON.stringify(tags) !== JSON.stringify(selectedNote.tags)
      );
    }
  }, [title, content, tags, selectedNote]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (selectedNote) {
      updateNote(selectedNote.id, {
        title: title || 'Untitled',
        content,
        tags,
      });
    } else if (title || content || tags.length > 0) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title || 'Untitled',
        content,
        tags,
        lastUpdated: new Date(),
        createdAt: new Date(),
      };
      addNote(newNote);
    }
    setIsDirty(false);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {selectedNote ? (
        <>
          {/* Header with title input */}
          <div className="p-4 border-b">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="!text-lg font-bold h-auto py-2 px-0 border-0 focus-visible:ring-0 placeholder:text-muted-foreground"
            />
          </div>

          {/* Tags section */}
          <div className="p-4 border-b space-y-3 ">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 bg-primary text-sm">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive "
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag and press Enter..."
                className="!text-base"
              />
              <Button
                size="default"
                variant="outline"
                onClick={handleAddTag}
                className="gap-1"
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content textarea */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your note..."
            className="flex-1 border-0 focus-visible:ring-0 resize-none !text-base"
          />

          {/* Save button footer */}
          <div className="p-4 border-t flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!isDirty}
              className="gap-2 text-lg"
            >
              Save
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Card className="p-8 max-w-sm bg-accent">
            <h3 className="text-lg font-bold mb-2">No Note Selected</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Select a note from the list to view or edit it, or create a new one.
            </p>
            <Button
              className='text-base'
              onClick={() => {
                const newNote: Note = {
                  id: Date.now().toString(),
                  title: 'New Note',
                  content: '',
                  tags: [],
                  lastUpdated: new Date(),
                  createdAt: new Date(),
                };
                addNote(newNote);
              }}
            >
              Create New Note
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
