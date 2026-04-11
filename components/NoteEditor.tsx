"use client";

import { useState, useEffect, useMemo } from "react";
import { useNotesStore, Note } from "@/lib/store/notesStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { createNote, updateNoteDatabase } from "@/app/actions/notes";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";

export function NoteEditor() {
  const selectedNoteId = useNotesStore((state) => state.selectedNoteId);
  const notes = useNotesStore((state) => state.notes);
  const updateNoteFrontend = useNotesStore((state) => state.updateNote);
  const addNote = useNotesStore((state) => state.addNote);


const selectedNote = useMemo(() => {
  if (selectedNoteId === "tempnote") {
    return {
      id: "tempnote",
      title: "New note",
      content: "",
      tags: [],
    };
  }
  return notes.find((note) => note.id === selectedNoteId);
}, [selectedNoteId, notes]); 

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setTags(selectedNote.tags);
      setTagInput("");
      setIsDirty(false);
    }
  }, [selectedNote]);

  // Track if form is dirty
  useEffect(() => {
    if (!selectedNote) {
      setIsDirty(title !== "" || content !== "" || tags.length > 0);
    } else {
      setIsDirty(
        title !== selectedNote.title ||
          content !== selectedNote.content ||
          JSON.stringify(tags) !== JSON.stringify(selectedNote.tags),
      );
    }
  }, [title, content, tags, selectedNote]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!selectedNoteId) return;

    if (selectedNoteId !== "tempnote") {
      updateNoteFrontend(selectedNoteId, {
        title: title || "Untitled",
        content,
        tags,
      });
      const promise= updateNoteDatabase(selectedNoteId, content, title, tags);

        // toast 
      toast.promise(promise, {
      loading: 'Updating your note...',
      success: (res) => {
        if(res.success) return `Note updated successfully!`;
        else throw new Error(res.error)
      },
      error: (err) => {
        // 'err' is the caught error if updateNoteDatabase fails
        return err?.message || 'Failed to create note';
      },
    });

    } else if (title || content || tags.length > 0) {
      const newNote: Note = {
        id: "tempnote",
        title: title || "Untitled",
        content,
        tags,
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      updateNoteFrontend(newNote.id, newNote);

      // promise for creating note 
      const promise = createNote(content, title, tags);

      // toast 
      toast.promise(promise, {
      loading: 'Creating your note...',
      success: (res) => {
        // 'data' is the resolved value (createdNote)
        if (res.success){
          return `Note "${res.data?.title}" created successfully!`;
        }
        else throw new Error(res.error)
      },
      error: (err) => {
        // 'err' is the caught error if createNote fails
        return err?.message || 'Failed to create note';
      },
    });
      const createdNote = await promise

      if (createdNote?.data?.id) {
        addNote(createdNote.data);
      }
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
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 bg-primary text-sm"
                >
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
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
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
              Select a note from the list to view or edit it, or create a new
              one.
            </p>
            <Button
              className="text-base"
              onClick={() => {
                useNotesStore.getState().setSelectedNoteId("tempnote");
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
