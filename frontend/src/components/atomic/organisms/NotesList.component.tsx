import { useState } from 'react';
import { EmptyState } from '../molecules/notes/EmptyState.component.js';
import { NoteItem } from '../molecules/notes/NoteItem.component.js';

const initialPeople = [
  {
    name: 'Jane Cooper',
    content: 'Das ist meine ganz wichtige Notiz. Die ist so wichtig wie... was auch immer.',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // More people...
];

export function NotesList() {
  const [people, setPeople] = useState(initialPeople);

  const addNote = (newNote) => {
    setPeople([...people, newNote]);
  };

  const editNote = () => {
    setPeople([...people]);
  };

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <EmptyState addNote={addNote} />
      {people.map((person) => (
        <NoteItem key={person.email} person={person} onEdit={editNote} />
      ))}
    </ul>
  );
}