import { createLazyFileRoute } from '@tanstack/react-router';
import { NotesList } from '../../components/atomic/organisms/NotesList.component.tsx';

export const Route = createLazyFileRoute('/app/notizen')({
  component: Notizen
})

function Notizen() {
  return <div>
    <NotesList />
  </div>
}