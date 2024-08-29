import { useNotizen } from '../../../hooks/notes.hook.js';
import { useToggle } from '@reactuses/core';
import { NotesList } from '../organisms/NotesList.component.js';
import { Button } from 'antd';
import { PiCaretDown, PiCaretUp } from 'react-icons/pi';

export function NotizenTemplate() {
  const { activeNotizen, createNotiz, archivedNotizen } = useNotizen();
  const [expanded, toggleExpanded] = useToggle(false);

  return <div>
    <NotesList notizen={activeNotizen.data} addNotiz={createNotiz.mutate} />
    {archivedNotizen.data && archivedNotizen.data.length > 0 && (
      <div className="mt-8 flex flex-col gap-8">
        <hr />
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="truncate">Abgeschlossene Notizen</p>
            <Button
              type="text"
              shape="circle"
              icon={expanded ? <PiCaretUp /> : <PiCaretDown />}
              onClick={toggleExpanded}
            />
          </div>
          {expanded && <NotesList notizen={archivedNotizen.data} />}
        </div>
      </div>)
    }
  </div>;

}