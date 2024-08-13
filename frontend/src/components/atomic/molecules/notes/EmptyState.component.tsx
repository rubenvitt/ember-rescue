import { useState } from 'react';
import { TextareaInput } from '../../atoms/Inputs.component.js';
import { Button } from '../Button.component.js';
import { CreateNotizDto } from '../../../../types/app/notes.types.js';

type EmptyStateProps = {
  addNote: (note: CreateNotizDto) => void;
};

export function EmptyState({ addNote }: EmptyStateProps) {
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (content.trim()) {
      addNote({
        content,
      });
      setContent('');
    }
  };

  return (
    <li className="col-span-1 divide-y divide-gray-200 dark:divide-gray-800 rounded-lg bg-white dark:bg-gray-700 shadow">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <TextareaInput
          className=""
          name="new-note"
          value={content}
          onBlur={() => {
            // do nothing
          }}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Neue Notiz anlegen"
        />
      </div>
      <div className="flex w-full justify-end p-6">
        <Button
          onClick={handleAdd}
        >
          Notiz anlegen
        </Button>
      </div>
    </li>
  );
}