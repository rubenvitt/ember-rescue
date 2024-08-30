import { CreateNotizDto, NotizDto } from '../../../types/app/notes.types.js';
import { useCallback } from 'react';
import { List } from 'antd';
import { NotizenListItem } from '../molecules/notes/NotesListItem.component.js';
import { EmptyState } from '../molecules/notes/EmptyState.component.js';

interface NotesListProps {
  notizen?: NotizDto[],
  addNotiz?: any
  loading: boolean
}

export function NotizenList({ notizen, addNotiz, loading }: NotesListProps) {
  const createNote = useCallback((newNote: CreateNotizDto) => {
    addNotiz?.({ content: newNote.content });
  }, [addNotiz]);

  return (
    <>{addNotiz && <EmptyState addNote={createNote} />}
      <List loading={loading} dataSource={notizen} renderItem={(item) => <NotizenListItem notiz={item} />} />
    </>
  );
}