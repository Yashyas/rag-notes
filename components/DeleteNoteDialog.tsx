'use client';

import { useNotesStore } from '@/lib/store/notesStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function DeleteNoteDialog() {
  const deleteDialogOpen = useNotesStore((state) => state.deleteDialogOpen);
  const deleteTargetId = useNotesStore((state) => state.deleteTargetId);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const closeDeleteDialog = useNotesStore((state) => state.closeDeleteDialog);

  const handleDelete = () => {
    if (deleteTargetId) {
      deleteNote(deleteTargetId);
      closeDeleteDialog();
    }
  };

  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Note</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this note? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
