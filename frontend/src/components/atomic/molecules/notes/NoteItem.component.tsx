import { PhoneIcon } from '@heroicons/react/20/solid';
import { PiPen } from 'react-icons/pi';
import { useState } from 'react';
import { TextareaInput } from '../../atoms/Inputs.component.js';

export function NoteItem({ person, onEdit }: { person: any, onEdit: (x: any) => void }) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-500">{person.name}</h3>
          </div>
          {isEdit
            ? <TextareaInput
              className=""
              name="edit-note"
              value={person.content}
              onBlur={() => {
                setIsEdit(false);
                onEdit(person);
              }}
              onChange={(e) => (person.content = e.target.value)}
              placeholder="Content"
            />
            : <p className="mt-1 text-sm text-gray-900 break-words whitespace-normal">{person.content}</p>}
        </div>
        <img alt="" src={person.imageUrl} className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <button
              onClick={() => setIsEdit(!isEdit)}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <PiPen aria-hidden="true" className="h-5 w-5 text-gray-400" />
              Bearbeiten
            </button>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <a
              href={`tel:${person.telephone}`}
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <PhoneIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
              Call
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}