import { CreateNotizDto, NotizDto } from '../../../types/app/notes.types.js';
import { useCallback } from 'react';
import { List } from 'antd';
import { NotizenListItem } from '../molecules/notes/NotesListItem.component.js';
import { EmptyState } from '../molecules/notes/EmptyState.component.js';
import { useReminders } from '../../../hooks/reminders.hook.tsx';

interface NotesListProps {
  notizen?: NotizDto[],
  addNotiz?: (notiz: CreateNotizDto) => Promise<NotizDto>
  loading: boolean
}

export function NotizenList({ notizen, addNotiz, loading }: NotesListProps) {
  const createNote = useCallback((newNote: CreateNotizDto) => {
    return addNotiz?.({ content: newNote.content });
  }, [addNotiz]);

  const { dueReminders } = useReminders();

  return (
    <>
      {dueReminders && <>{dueReminders.data?.map((reminder) => (
        <p key={reminder.id}>{reminder.noteId}</p>
      ))}</>}
      {addNotiz && <EmptyState addNote={createNote} />}
      <List loading={loading} dataSource={notizen} renderItem={(item) => <NotizenListItem notiz={item} />} />
    </>
  );
}