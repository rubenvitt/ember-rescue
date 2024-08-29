import { CreateNotizDto, NotizDto } from '../../../types/app/notes.types.js';
import { useCallback } from 'react';
import { List } from 'antd';
import { NotesListItem } from '../molecules/notes/NotesListItem.component.js';
import { EmptyState } from '../molecules/notes/EmptyState.component.js';

interface NotesListProps {
  notizen?: NotizDto[],
  addNotiz?: any
}

export function NotesList({ notizen, addNotiz }: NotesListProps) {
  const createNote = useCallback((newNote: CreateNotizDto) => {
    addNotiz?.({ content: newNote.content });
  }, [addNotiz]);

  return (
    <>{addNotiz && <EmptyState addNote={createNote} />}
      <List loading={!notizen} dataSource={notizen} renderItem={(item) => <NotesListItem notiz={item} />} />
    </>
  );
}