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
import { deleteNote } from '@/app/actions/notes';
import { toast } from 'sonner';

export function DeleteNoteDialog() {
  const deleteDialogOpen = useNotesStore((state) => state.deleteDialogOpen);
  const deleteTargetId = useNotesStore((state) => state.deleteTargetId);
  const deleteNoteFrontend = useNotesStore((state) => state.deleteNote);
  const closeDeleteDialog = useNotesStore((state) => state.closeDeleteDialog);

  const handleDelete = () => {
    if (deleteTargetId) {
      
      const promise = deleteNote(deleteTargetId);
          // toast 
      toast.promise(promise, {
      loading: 'Deleting your note...',
      success: (res) => {
        if(res.success) {
          deleteNoteFrontend(deleteTargetId);
          return `Note deleted successfully!`;
        }else{
          throw new Error(res.error)
        }
      },
      error: (err) => {
        // 'err' is the caught error if deleteNote fails
        return err?.message || 'Failed to delete note';
      },
    });
      closeDeleteDialog();
      
    }
  };

  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-lg'>Delete Note</AlertDialogTitle>
          <AlertDialogDescription className='text-base'>
            Are you sure you want to delete this note? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel className='!text-base'>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 !text-base">
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
