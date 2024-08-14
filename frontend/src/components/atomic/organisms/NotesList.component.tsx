import { EmptyState } from '../molecules/notes/EmptyState.component.js';
import { NotizItem } from '../molecules/notes/NotizItem.component.js';
import { CreateNotizDto, NotizDto } from '../../../types/app/notes.types.js';
import { useCallback } from 'react';

interface NotesListProps {
  notizen: NotizDto[],
  addNotiz?: any
}

export function NotesList({ notizen, addNotiz }: NotesListProps) {


  const createNote = useCallback((newNote: CreateNotizDto) => {
    addNotiz?.({ content: newNote.content });
  }, [addNotiz]);

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {addNotiz && <EmptyState addNote={createNote} />}
      {notizen.map((note) => (
        <NotizItem key={note.id} notiz={note} />
      ))}
    </ul>
  );
}