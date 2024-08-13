import { EmptyState } from '../molecules/notes/EmptyState.component.js';
import { NotizItem } from '../molecules/notes/NotizItem.component.js';
import { useNotizen } from '../../../hooks/notes.hook.js';
import { CreateNotizDto } from '../../../types/app/notes.types.js';

export function NotesList() {
  const { alleNotizen, createNotiz } = useNotizen();

  const addNote = (newNote: CreateNotizDto) => {
    createNotiz.mutate({content: newNote.content})
  };

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <EmptyState addNote={addNote} />
      {alleNotizen.data?.map((note) => (
        <NotizItem key={note.id} notiz={note} />
      ))}
    </ul>
  );
}