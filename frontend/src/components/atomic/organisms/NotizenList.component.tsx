import { useCallback } from 'react';
import { List } from 'antd';
import { NotizenListItem } from '../molecules/notes/NotesListItem.component.js';
import { EmptyState } from '../molecules/notes/EmptyState.component.js';
import { useReminders } from '../../../hooks/reminders.hook.tsx';
import { CreateNotizDto, EinsatzNoteDto, OneNoteResponse } from '@ember-rescue/shared/client/index.js';

interface NotesListProps {
  notizen?: EinsatzNoteDto[];
  addNotiz?: (notiz: CreateNotizDto) => Promise<OneNoteResponse>;
  loading: boolean;
}

export function NotizenList({ notizen, addNotiz, loading }: NotesListProps) {
  const createNote = useCallback(
    (newNote: CreateNotizDto) => {
      return addNotiz?.({ content: newNote.content });
    },
    [addNotiz],
  );

  const { dueReminders } = useReminders();

  return (
    <>
      {dueReminders && <>{dueReminders.data?.data.map((reminder) => <p key={reminder.id}>{reminder.action}</p>)}</>}
      {addNotiz && <EmptyState addNote={createNote} />}
      <List loading={loading} dataSource={notizen} renderItem={(item) => <NotizenListItem notiz={item} />} />
    </>
  );
}
