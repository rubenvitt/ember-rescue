import { useState } from 'react';
import { TextareaInput } from '../../atoms/Inputs.component.js';
import { Button } from '../Button.component.js';

type Note = {
  name: string;
  content: string;
  role: string;
  email: string;
  telephone: string;
  imageUrl: string;
};

type EmptyStateProps = {
  addNote: (note: Note) => void;
};

export function EmptyState({ addNote }: EmptyStateProps) {
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (content.trim()) {
      addNote({
        name: 'New Note',
        content,
        role: 'User',
        email: `new-${Date.now()}@example.com`,
        telephone: '',
        imageUrl: 'https://via.placeholder.com/150',
      });
      setContent('');
    }
  };

  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Notiz anlegen
        </Button>
      </div>
    </li>
  );
}