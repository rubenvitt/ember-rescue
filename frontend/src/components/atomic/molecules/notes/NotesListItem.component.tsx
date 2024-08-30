import { NotizDto } from '../../../../types/app/notes.types.js';
import { useCallback, useMemo, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Button, List, Tooltip } from 'antd';
import { PiCheck, PiClock, PiFloppyDisk, PiPencil, PiX } from 'react-icons/pi';
import { Input } from 'formik-antd';
import { useNotizen } from '../../../../hooks/notes.hook.js';
import { formatNatoDateTime } from '../../../../utils/time.js';
import { useReminders } from '../../../../hooks/reminders.hook.tsx';

interface Props {
  notiz: NotizDto;
}

interface _NotesListItemProps {
  props?: FormikProps<{ content: string }>;
}

export function NotizenListItem({ notiz }: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const { changeNotiz, toggleCompleteNotiz } = useNotizen({ notizId: notiz.id });
  const { createReminder } = useReminders();

  function _NotesListItem({ props }: _NotesListItemProps) {
    const toggleEdit = useCallback((fixed?: boolean) => {
      if (fixed !== undefined) {
        setIsEdit(fixed);
      } else {
        setIsEdit(prevState => !prevState);
      }
      props?.resetForm();
    }, [setIsEdit]);

    const saveNotiz = useCallback(() => {
      props?.submitForm();
      setIsEdit(false);
    }, [setIsEdit]);

    const actions = useMemo(() => {
      return [
        !isEdit && <Tooltip title="Notiz bearbeiten">
          <Button icon={<PiPencil />}
                  key="edit"
                  onClick={() => toggleEdit()} />
        </Tooltip>,
        !isEdit && <Tooltip title="Erinnerung anlegen">
          <Button onClick={() => {
            // TODO[ant-design](rubeen, 27.08.24): implement this
            createReminder.mutate({ reminderTime: new Date(), noteId: notiz.id });
          }} key="list-loadmore-more" icon={<PiClock />} />
        </Tooltip>,
        !isEdit && <Tooltip title="Abschließen">
          <Button icon={<PiCheck />}
                  key="done"
                  onClick={() => toggleCompleteNotiz.mutate()} />
        </Tooltip>,
        isEdit && <Tooltip title="Abbrechen">
          <Button icon={<PiX />}
                  key="edit"
                  onClick={() => toggleEdit()} />
        </Tooltip>,
        isEdit && <Tooltip title="Speichern">
          <Button icon={<PiFloppyDisk />}
                  type="primary"
                  key="edit"
                  onClick={() => saveNotiz()} />
        </Tooltip>,
      ].filter(Boolean).map((item) => (item));
    }, [isEdit, saveNotiz, toggleEdit]);

    return <List.Item
      actions={actions}
    >
      <div className="w-full">
        <List.Item.Meta
          title={<p>
            <span>{notiz.bearbeiter.name}</span>
            <span className="text-gray-500"> (erstellt: {formatNatoDateTime(notiz.createdAt)})</span>
            {notiz.doneAt &&
              <span className="text-primary-500/50"> (abgeschlossen: {formatNatoDateTime(notiz.doneAt)})</span>}
          </p>}
        />
        {isEdit ? <Input.TextArea rows={4} name="content" /> : <p className="whitespace-pre-line">{notiz.content}</p>}
      </div>
    </List.Item>;
  }

  return <Formik<{ content: string; }> onSubmit={(data) => {
    console.log('my current data is', data);
    changeNotiz.mutate(data);
  }} initialValues={{
    content: notiz.content,
  }}>
    {(props) => (
      <_NotesListItem props={props} />
    )}
  </Formik>;
}