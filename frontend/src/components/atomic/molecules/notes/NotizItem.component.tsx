import { PiAlarm, PiPen } from 'react-icons/pi';
import { useCallback, useState } from 'react';
import { TextareaInput } from '../../atoms/Inputs.component.js';
import { NotizDto } from '../../../../types/app/notes.types.js';
import { useForm } from '@tanstack/react-form';
import { ChangeEvent } from '../../../../types/ui/inputs.types.js';
import { Button } from '../Button.component.tsx';
import { useNotizen } from '../../../../hooks/notes.hook.js';

export function NotizItem({ notiz }: { notiz: NotizDto }) {
  const [isEdit, setIsEdit] = useState(false);
  const { changeNotiz } = useNotizen({ notizId: notiz.id });
  const form = useForm<{ content: string }>({
    defaultValues: { content: notiz.content },
    async onSubmit(data) {
      await changeNotiz.mutateAsync(data.value);
      setIsEdit(false);
    },
  });

  const onAbbrechenClick = useCallback(() => {
    form.reset();
    setIsEdit(false);
  }, [isEdit]);

  const onBearbeitenClick = useCallback(() => setIsEdit(true), []);

  const onSpeichernClick = useCallback(async () => {
    await form.handleSubmit();
    setIsEdit(false);
  }, [form]);

  return (
    <li className="col-span-1 divide-y divide-gray-200 dark:divide-gray-800 rounded-lg bg-white dark:bg-gray-700 shadow flex flex-col justify-between">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-500 dark:text-gray-200">{notiz.bearbeiter.name}</h3>
          </div>
          {isEdit
            ? <form.Field name="content">
              {(fieldApi) => (
                <TextareaInput
                  className=""
                  value={fieldApi.state.value as string}
                  name={fieldApi.name}
                  onChange={(e: ChangeEvent) => fieldApi.setValue(e.target.value)}
                  onBlur={fieldApi.handleBlur}
                />)}
            </form.Field>
            : <p className="mt-1 text-sm text-gray-900 dark:text-white break-words whitespace-normal flex-1">{notiz.content}</p>}
        </div>
        {/*<img alt="" src={note.imageUrl} className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />*/}
      </div>
      <div>
        {isEdit
          ? <div className="flex w-full justify-between p-6">
            <Button
              color="red"
              type="button"
              onClick={onAbbrechenClick}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              onClick={onSpeichernClick}
            >
              Speichern
            </Button>
          </div>
          : <div className="-mt-px flex divide-x divide-gray-200 dark:divide-gray-800">
            <div className="flex w-0 flex-1">
              <button
                onClick={onBearbeitenClick}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 dark:text-white hover:bg-primary-200/20"
              >
                <PiPen aria-hidden="true" className="h-5 w-5 text-gray-400 dark:text-gray-200" />
                Bearbeiten
              </button>
            </div>
            <div className="-ml-px flex w-0 flex-1">
              <a
                href={`EMPTY`}
                className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 dark:text-white hover:bg-primary-200/20"
              >
                <PiAlarm aria-hidden="true" className="h-5 w-5 text-gray-400 dark:text-gray-200" />
                Erinnerung
              </a>
            </div>
          </div>
        }
      </div>
    </li>
  );
}