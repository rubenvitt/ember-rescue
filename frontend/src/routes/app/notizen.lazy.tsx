import { createLazyFileRoute } from '@tanstack/react-router';
import { NotesList } from '../../components/atomic/organisms/NotesList.component.tsx';
import { useNotizen } from '../../hooks/notes.hook.js';
import { PiCaretDown, PiCaretUp } from 'react-icons/pi';
import { Button } from '../../components/atomic/molecules/Button.component.js';
import { useToggle } from '@reactuses/core';

export const Route = createLazyFileRoute('/app/notizen')({
  component: Notizen,
});

function Notizen() {
  const { activeNotizen, createNotiz, archivedNotizen } = useNotizen();
  const [expanded, toggleExpanded] = useToggle(false);

  return <div>
    {activeNotizen.data && <NotesList notizen={activeNotizen.data} addNotiz={createNotiz.mutate} />}
    {archivedNotizen.data && archivedNotizen.data.length > 0 && (
      <div className="mt-8 flex flex-col gap-8">
        <hr />
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="truncate">Abgeschlossene Notizen</p>
            <Button
              icon={expanded ? PiCaretUp : PiCaretDown}
              onClick={toggleExpanded}
            />
          </div>
          {expanded && <NotesList notizen={archivedNotizen.data} />}
        </div>
      </div>)
    }
  </div>;
}
